import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { body, param, query, validationResult } from 'express-validator';
import { Pool } from 'pg';

const router = express.Router();

// Simple encryption functions (in production, use a proper encryption service)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32);
const IV_LENGTH = 16;

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
  projectAccess?: {
    projectId: string;
    organizationId: string;
    userRole: string;
  };
}

// Type assertion helper for app.locals
const getServices = (req: Request) => (req.app.locals as any).services as { db: Pool };

function encrypt(text: string): string | null {
  if (!text) return null;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(encryptedText: string): string | null {
  if (!encryptedText) return null;
  try {
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedData = textParts.join(':');
    const decipher = crypto.createDecipher('aes-256-cbc', ENCRYPTION_KEY);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
}

// Middleware for validation
const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  next();
};

// Check project access middleware
const checkProjectAccess = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { db } = getServices(req);
    const userId = req.user!.id;
    const projectId = req.params.projectId;
    
    if (!projectId) {
      res.status(400).json({
        success: false,
        message: 'Project ID is required',
      });
      return;
    }

    const accessCheck = await db.query(
      `
      SELECT p.id, p.organization_id,
             CASE 
               WHEN p.user_id = $1 THEN 'owner'
               WHEN tm.role IS NOT NULL THEN tm.role
               WHEN pc.role IS NOT NULL THEN pc.role
               ELSE NULL
             END as user_role
      FROM projects p
      LEFT JOIN team_members tm ON p.organization_id = tm.organization_id AND tm.user_id = $1
      LEFT JOIN project_collaborators pc ON p.id = pc.project_id AND pc.user_id = $1
      WHERE p.id = $2
    `,
      [userId, projectId],
    );

    if (accessCheck.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Project not found',
      });
      return;
    }

    const userRole = accessCheck.rows[0].user_role;
    if (!userRole) {
      res.status(403).json({
        success: false,
        message: 'Access denied',
      });
      return;
    }

    req.projectAccess = {
      projectId,
      organizationId: accessCheck.rows[0].organization_id,
      userRole,
    };

    next();
  } catch (error) {
    console.error('Error checking project access:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify project access',
    });
  }
};

// GET /api/projects/:projectId/environment - Get environment variables
router.get(
  '/:projectId/environment',
  [
    param('projectId').isUUID(),
    query('target')
      .optional()
      .isIn(['production', 'preview', 'development', 'all']),
  ],
  validateRequest,
  checkProjectAccess,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { db } = getServices(req);
      const { projectId } = req.projectAccess!;
      const target = req.query.target || 'all';

      let whereClause = 'project_id = $1';
      const queryParams: any[] = [projectId];

      if (target !== 'all') {
        whereClause += " AND (target = $2 OR target = 'all')";
        queryParams.push(target);
      }

      const envVars = await db.query(
        `
      SELECT id, key, target, is_system, created_at, updated_at,
             u.name as created_by_name
      FROM environment_variables ev
      LEFT JOIN users u ON ev.created_by = u.id
      WHERE ${whereClause}
      ORDER BY key ASC
    `,
        queryParams,
      );

      res.json({
        success: true,
        data: {
          environment_variables: envVars.rows,
          target: target,
        },
      });
    } catch (error) {
      console.error('Error fetching environment variables:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch environment variables',
      });
    }
  },
);

// POST /api/projects/:projectId/environment - Create environment variable
router.post(
  '/:projectId/environment',
  [
    param('projectId').isUUID(),
    body('key')
      .isLength({ min: 1, max: 255 })
      .matches(/^[A-Za-z_][A-Za-z0-9_]*$/)
      .withMessage('Key must be a valid environment variable name'),
    body('value').isLength({ min: 0, max: 10000 }),
    body('target').isIn(['production', 'preview', 'development', 'all']),
  ],
  validateRequest,
  checkProjectAccess,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { db } = getServices(req);
      const { projectId, userRole } = req.projectAccess!;
      const userId = req.user!.id;
      const { key, value, target } = req.body;

      // Check permissions
      if (userRole === 'viewer') {
        res.status(403).json({
          success: false,
          message: 'Insufficient permissions to create environment variables',
        });
        return;
      }

      // Check if variable already exists
      const existingVar = await db.query(
        `
      SELECT id FROM environment_variables 
      WHERE project_id = $1 AND key = $2 AND target = $3
    `,
        [projectId, key, target],
      );

      if (existingVar.rows.length > 0) {
        res.status(400).json({
          success: false,
          message: 'Environment variable already exists for this target',
        });
        return;
      }

      // Encrypt the value
      const encryptedValue = encrypt(value);

      const result = await db.query(
        `
      INSERT INTO environment_variables (project_id, key, value_encrypted, target, created_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, key, target, is_system, created_at, updated_at
    `,
        [projectId, key, encryptedValue, target, userId],
      );

      res.status(201).json({
        success: true,
        data: {
          environment_variable: result.rows[0],
        },
      });
    } catch (error) {
      console.error('Error creating environment variable:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create environment variable',
      });
    }
  },
);

// PUT /api/projects/:projectId/environment/:envId - Update environment variable
router.put(
  '/:projectId/environment/:envId',
  [
    param('projectId').isUUID(),
    param('envId').isUUID(),
    body('value').isLength({ min: 0, max: 10000 }),
  ],
  validateRequest,
  checkProjectAccess,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { db } = getServices(req);
      const { projectId, userRole } = req.projectAccess!;
      const envId = req.params.envId;
      const { value } = req.body;

      // Check permissions
      if (userRole === 'viewer') {
        res.status(403).json({
          success: false,
          message: 'Insufficient permissions to update environment variables',
        });
        return;
      }

      // Check if variable exists and belongs to this project
      const existingVar = await db.query(
        `
      SELECT id, is_system FROM environment_variables 
      WHERE id = $1 AND project_id = $2
    `,
        [envId, projectId],
      );

      if (existingVar.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Environment variable not found',
        });
        return;
      }

      // Don't allow updating system variables
      if (existingVar.rows[0].is_system) {
        res.status(400).json({
          success: false,
          message: 'Cannot update system environment variables',
        });
        return;
      }

      // Encrypt the new value
      const encryptedValue = encrypt(value);

      const result = await db.query(
        `
      UPDATE environment_variables 
      SET value_encrypted = $1, updated_at = NOW()
      WHERE id = $2 AND project_id = $3
      RETURNING id, key, target, is_system, created_at, updated_at
    `,
        [encryptedValue, envId, projectId],
      );

      res.json({
        success: true,
        data: {
          environment_variable: result.rows[0],
        },
      });
    } catch (error) {
      console.error('Error updating environment variable:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update environment variable',
      });
    }
  },
);

// DELETE /api/projects/:projectId/environment/:envId - Delete environment variable
router.delete(
  '/:projectId/environment/:envId',
  [param('projectId').isUUID(), param('envId').isUUID()],
  validateRequest,
  checkProjectAccess,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { db } = getServices(req);
      const { projectId, userRole } = req.projectAccess!;
      const envId = req.params.envId;

      // Check permissions
      if (userRole === 'viewer') {
        res.status(403).json({
          success: false,
          message: 'Insufficient permissions to delete environment variables',
        });
        return;
      }

      // Check if variable exists and belongs to this project
      const existingVar = await db.query(
        `
      SELECT id, is_system FROM environment_variables 
      WHERE id = $1 AND project_id = $2
    `,
        [envId, projectId],
      );

      if (existingVar.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Environment variable not found',
        });
        return;
      }

      // Don't allow deleting system variables
      if (existingVar.rows[0].is_system) {
        res.status(400).json({
          success: false,
          message: 'Cannot delete system environment variables',
        });
        return;
      }

      await db.query(
        `
      DELETE FROM environment_variables 
      WHERE id = $1 AND project_id = $2
    `,
        [envId, projectId],
      );

      res.json({
        success: true,
        message: 'Environment variable deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting environment variable:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete environment variable',
      });
    }
  },
);

// GET /api/projects/:projectId/environment/:envId - Get environment variable value
router.get(
  '/:projectId/environment/:envId',
  [param('projectId').isUUID(), param('envId').isUUID()],
  validateRequest,
  checkProjectAccess,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { db } = getServices(req);
      const { projectId } = req.projectAccess!;
      const envId = req.params.envId;

      const envVar = await db.query(
        `
      SELECT id, key, value_encrypted, target, is_system, created_at, updated_at,
             u.name as created_by_name
      FROM environment_variables ev
      LEFT JOIN users u ON ev.created_by = u.id
      WHERE ev.id = $1 AND ev.project_id = $2
    `,
        [envId, projectId],
      );

      if (envVar.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Environment variable not found',
        });
        return;
      }

      const variable = envVar.rows[0];
      const decryptedValue = decrypt(variable.value_encrypted);

      res.json({
        success: true,
        data: {
          environment_variable: {
            ...variable,
            value: decryptedValue,
            value_encrypted: undefined, // Don't send encrypted value
          },
        },
      });
    } catch (error) {
      console.error('Error fetching environment variable:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch environment variable',
      });
    }
  },
);

// POST /api/projects/:projectId/environment/bulk - Bulk create/update environment variables
router.post(
  '/:projectId/environment/bulk',
  [
    param('projectId').isUUID(),
    body('variables').isArray({ min: 1 }),
    body('variables.*.key')
      .isLength({ min: 1, max: 255 })
      .matches(/^[A-Za-z_][A-Za-z0-9_]*$/)
      .withMessage('Key must be a valid environment variable name'),
    body('variables.*.value').isLength({ min: 0, max: 10000 }),
    body('variables.*.target').isIn(['production', 'preview', 'development', 'all']),
  ],
  validateRequest,
  checkProjectAccess,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { db } = getServices(req);
      const { projectId, userRole } = req.projectAccess!;
      const userId = req.user!.id;
      const { variables } = req.body;

      // Check permissions
      if (userRole === 'viewer') {
        res.status(403).json({
          success: false,
          message: 'Insufficient permissions to create environment variables',
        });
        return;
      }

      const results = [];
      const errors = [];

      for (const variable of variables) {
        try {
          const { key, value, target } = variable;

          // Check if variable already exists
          const existingVar = await db.query(
            `
          SELECT id FROM environment_variables 
          WHERE project_id = $1 AND key = $2 AND target = $3
        `,
            [projectId, key, target],
          );

          if (existingVar.rows.length > 0) {
            // Update existing variable
            const encryptedValue = encrypt(value);
            const result = await db.query(
              `
            UPDATE environment_variables 
            SET value_encrypted = $1, updated_at = NOW()
            WHERE project_id = $2 AND key = $3 AND target = $4
            RETURNING id, key, target, is_system, created_at, updated_at
          `,
              [encryptedValue, projectId, key, target],
            );
            results.push({ action: 'updated', variable: result.rows[0] });
          } else {
            // Create new variable
            const encryptedValue = encrypt(value);
            const result = await db.query(
              `
            INSERT INTO environment_variables (project_id, key, value_encrypted, target, created_by)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, key, target, is_system, created_at, updated_at
          `,
              [projectId, key, encryptedValue, target, userId],
            );
            results.push({ action: 'created', variable: result.rows[0] });
          }
        } catch (error) {
          errors.push({
            variable: variable,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      res.status(200).json({
        success: true,
        data: {
          results,
          errors,
          summary: {
            total: variables.length,
            successful: results.length,
            failed: errors.length,
          },
        },
      });
    } catch (error) {
      console.error('Error bulk creating/updating environment variables:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to bulk create/update environment variables',
      });
    }
  },
);

export default router; 