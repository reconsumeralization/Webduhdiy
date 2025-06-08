const express = require('express');
const crypto = require('crypto');
const { body, param, query, validationResult } = require('express-validator');
const router = express.Router();

// Simple encryption functions (in production, use a proper encryption service)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32);
const IV_LENGTH = 16;

function encrypt(text) {
  if (!text) return null;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(encryptedText) {
  if (!encryptedText) return null;
  try {
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
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
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

// Check project access middleware
const checkProjectAccess = async (req, res, next) => {
  try {
    const { db } = req.app.locals.services;
    const userId = req.user.id;
    const projectId = req.params.projectId;

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
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const userRole = accessCheck.rows[0].user_role;
    if (!userRole) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
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
  async (req, res) => {
    try {
      const { db } = req.app.locals.services;
      const { projectId } = req.projectAccess;
      const target = req.query.target || 'all';

      let whereClause = 'project_id = $1';
      const queryParams = [projectId];

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
  async (req, res) => {
    try {
      const { db } = req.app.locals.services;
      const { projectId, userRole } = req.projectAccess;
      const userId = req.user.id;
      const { key, value, target } = req.body;

      // Check permissions
      if (userRole === 'viewer') {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions to create environment variables',
        });
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
        return res.status(400).json({
          success: false,
          message: 'Environment variable already exists for this target',
        });
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
  async (req, res) => {
    try {
      const { db } = req.app.locals.services;
      const { projectId, userRole } = req.projectAccess;
      const envId = req.params.envId;
      const { value } = req.body;

      // Check permissions
      if (userRole === 'viewer') {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions to update environment variables',
        });
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
        return res.status(404).json({
          success: false,
          message: 'Environment variable not found',
        });
      }

      // Don't allow updating system variables
      if (existingVar.rows[0].is_system) {
        return res.status(400).json({
          success: false,
          message: 'Cannot update system environment variables',
        });
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
  async (req, res) => {
    try {
      const { db } = req.app.locals.services;
      const { projectId, userRole } = req.projectAccess;
      const envId = req.params.envId;

      // Check permissions
      if (userRole === 'viewer') {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions to delete environment variables',
        });
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
        return res.status(404).json({
          success: false,
          message: 'Environment variable not found',
        });
      }

      // Don't allow deleting system variables
      if (existingVar.rows[0].is_system) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete system environment variables',
        });
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

// GET /api/projects/:projectId/environment/:envId/value - Get decrypted value (admin only)
router.get(
  '/:projectId/environment/:envId/value',
  [param('projectId').isUUID(), param('envId').isUUID()],
  validateRequest,
  checkProjectAccess,
  async (req, res) => {
    try {
      const { db } = req.app.locals.services;
      const { projectId, userRole } = req.projectAccess;
      const envId = req.params.envId;

      // Only owners and admins can view encrypted values
      if (!['owner', 'admin'].includes(userRole)) {
        return res.status(403).json({
          success: false,
          message:
            'Insufficient permissions to view environment variable values',
        });
      }

      const envVar = await db.query(
        `
      SELECT key, value_encrypted, target
      FROM environment_variables 
      WHERE id = $1 AND project_id = $2
    `,
        [envId, projectId],
      );

      if (envVar.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Environment variable not found',
        });
      }

      const decryptedValue = decrypt(envVar.rows[0].value_encrypted);

      res.json({
        success: true,
        data: {
          key: envVar.rows[0].key,
          value: decryptedValue,
          target: envVar.rows[0].target,
        },
      });
    } catch (error) {
      console.error('Error fetching environment variable value:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch environment variable value',
      });
    }
  },
);

// POST /api/projects/:projectId/environment/bulk - Bulk import environment variables
router.post(
  '/:projectId/environment/bulk',
  [
    param('projectId').isUUID(),
    body('variables').isArray().withMessage('Variables must be an array'),
    body('variables.*.key')
      .isLength({ min: 1, max: 255 })
      .matches(/^[A-Za-z_][A-Za-z0-9_]*$/),
    body('variables.*.value').isLength({ min: 0, max: 10000 }),
    body('variables.*.target').isIn([
      'production',
      'preview',
      'development',
      'all',
    ]),
    body('overwrite').optional().isBoolean(),
  ],
  validateRequest,
  checkProjectAccess,
  async (req, res) => {
    try {
      const { db } = req.app.locals.services;
      const { projectId, userRole } = req.projectAccess;
      const userId = req.user.id;
      const { variables, overwrite = false } = req.body;

      // Check permissions
      if (userRole === 'viewer') {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions to create environment variables',
        });
      }

      const results = {
        created: [],
        updated: [],
        skipped: [],
        errors: [],
      };

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
            if (overwrite) {
              // Update existing variable
              const encryptedValue = encrypt(value);
              await db.query(
                `
              UPDATE environment_variables 
              SET value_encrypted = $1, updated_at = NOW()
              WHERE project_id = $2 AND key = $3 AND target = $4
            `,
                [encryptedValue, projectId, key, target],
              );
              results.updated.push({ key, target });
            } else {
              results.skipped.push({ key, target, reason: 'Already exists' });
            }
          } else {
            // Create new variable
            const encryptedValue = encrypt(value);
            await db.query(
              `
            INSERT INTO environment_variables (project_id, key, value_encrypted, target, created_by)
            VALUES ($1, $2, $3, $4, $5)
          `,
              [projectId, key, encryptedValue, target, userId],
            );
            results.created.push({ key, target });
          }
        } catch (error) {
          results.errors.push({
            key: variable.key,
            target: variable.target,
            error: error.message,
          });
        }
      }

      res.json({
        success: true,
        data: {
          results,
          total_processed: variables.length,
        },
      });
    } catch (error) {
      console.error('Error bulk importing environment variables:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to bulk import environment variables',
      });
    }
  },
);

module.exports = router;
