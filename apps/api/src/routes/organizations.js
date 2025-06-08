const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const router = express.Router();

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

// GET /api/organizations - List user's organizations
router.get('/', async (req, res) => {
  try {
    const { db } = req.app.locals.services;
    const userId = req.user.id;

    const query = `
      SELECT o.*, tm.role, tm.joined_at,
             COUNT(p.id) as project_count,
             COUNT(DISTINCT tm2.user_id) as member_count
      FROM organizations o
      JOIN team_members tm ON o.id = tm.organization_id
      LEFT JOIN projects p ON o.id = p.organization_id
      LEFT JOIN team_members tm2 ON o.id = tm2.organization_id
      WHERE tm.user_id = $1 AND o.deleted_at IS NULL
      GROUP BY o.id, tm.role, tm.joined_at
      ORDER BY tm.joined_at DESC
    `;

    const organizations = await db.query(query, [userId]);

    res.json({
      success: true,
      data: {
        organizations: organizations.rows,
      },
    });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch organizations',
    });
  }
});

// POST /api/organizations - Create new organization
router.post(
  '/',
  [
    body('name')
      .isLength({ min: 1, max: 255 })
      .withMessage('Name is required and must be less than 255 characters'),
    body('slug')
      .isLength({ min: 1, max: 100 })
      .matches(/^[a-z0-9-]+$/)
      .withMessage('Slug must be lowercase alphanumeric with hyphens'),
    body('description').optional().isLength({ max: 1000 }),
    body('plan_type').optional().isIn(['free', 'pro', 'team', 'enterprise']),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { db } = req.app.locals.services;
      const userId = req.user.id;
      const { name, slug, description, plan_type = 'free' } = req.body;

      // Check if slug is available
      const existingOrg = await db.query(
        'SELECT id FROM organizations WHERE slug = $1',
        [slug],
      );
      if (existingOrg.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Organization slug is already taken',
        });
      }

      // Create organization
      const orgResult = await db.query(
        `
      INSERT INTO organizations (name, slug, description, plan_type)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
        [name, slug, description, plan_type],
      );

      const organization = orgResult.rows[0];

      // Add creator as owner
      await db.query(
        `
      INSERT INTO team_members (organization_id, user_id, role, joined_at)
      VALUES ($1, $2, 'owner', NOW())
    `,
        [organization.id, userId],
      );

      res.status(201).json({
        success: true,
        data: {
          organization,
        },
      });
    } catch (error) {
      console.error('Error creating organization:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create organization',
      });
    }
  },
);

// GET /api/organizations/:id - Get organization details
router.get(
  '/:id',
  [param('id').isUUID()],
  validateRequest,
  async (req, res) => {
    try {
      const { db } = req.app.locals.services;
      const userId = req.user.id;
      const organizationId = req.params.id;

      // Check if user has access to this organization
      const memberCheck = await db.query(
        `
      SELECT role FROM team_members 
      WHERE organization_id = $1 AND user_id = $2
    `,
        [organizationId, userId],
      );

      if (memberCheck.rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied',
        });
      }

      // Get organization details
      const orgResult = await db.query(
        `
      SELECT o.*,
             COUNT(DISTINCT p.id) as project_count,
             COUNT(DISTINCT tm.user_id) as member_count,
             COUNT(DISTINCT d.id) as deployment_count
      FROM organizations o
      LEFT JOIN projects p ON o.id = p.organization_id
      LEFT JOIN team_members tm ON o.id = tm.organization_id
      LEFT JOIN deployments d ON p.id = d.project_id
      WHERE o.id = $1 AND o.deleted_at IS NULL
      GROUP BY o.id
    `,
        [organizationId],
      );

      if (orgResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Organization not found',
        });
      }

      const organization = orgResult.rows[0];
      const userRole = memberCheck.rows[0].role;

      res.json({
        success: true,
        data: {
          organization,
          user_role: userRole,
        },
      });
    } catch (error) {
      console.error('Error fetching organization:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch organization',
      });
    }
  },
);

// PUT /api/organizations/:id - Update organization
router.put(
  '/:id',
  [
    param('id').isUUID(),
    body('name').optional().isLength({ min: 1, max: 255 }),
    body('description').optional().isLength({ max: 1000 }),
    body('website_url').optional().isURL(),
    body('billing_email').optional().isEmail(),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { db } = req.app.locals.services;
      const userId = req.user.id;
      const organizationId = req.params.id;

      // Check if user is admin or owner
      const memberCheck = await db.query(
        `
      SELECT role FROM team_members 
      WHERE organization_id = $1 AND user_id = $2 AND role IN ('owner', 'admin')
    `,
        [organizationId, userId],
      );

      if (memberCheck.rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
        });
      }

      const allowedFields = [
        'name',
        'description',
        'website_url',
        'billing_email',
      ];
      const updates = {};
      const values = [];
      let valueIndex = 1;

      for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
          updates[field] = `$${valueIndex}`;
          values.push(req.body[field]);
          valueIndex++;
        }
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid fields to update',
        });
      }

      const setClause = Object.keys(updates)
        .map((key) => `${key} = ${updates[key]}`)
        .join(', ');
      values.push(organizationId);

      const result = await db.query(
        `
      UPDATE organizations 
      SET ${setClause}, updated_at = NOW()
      WHERE id = $${valueIndex} AND deleted_at IS NULL
      RETURNING *
    `,
        values,
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Organization not found',
        });
      }

      res.json({
        success: true,
        data: {
          organization: result.rows[0],
        },
      });
    } catch (error) {
      console.error('Error updating organization:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update organization',
      });
    }
  },
);

// GET /api/organizations/:id/members - Get organization members
router.get(
  '/:id/members',
  [param('id').isUUID()],
  validateRequest,
  async (req, res) => {
    try {
      const { db } = req.app.locals.services;
      const userId = req.user.id;
      const organizationId = req.params.id;

      // Check if user has access to this organization
      const memberCheck = await db.query(
        `
      SELECT role FROM team_members 
      WHERE organization_id = $1 AND user_id = $2
    `,
        [organizationId, userId],
      );

      if (memberCheck.rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied',
        });
      }

      const members = await db.query(
        `
      SELECT tm.*, u.email, u.name, u.avatar_url,
             invited_by_user.name as invited_by_name
      FROM team_members tm
      JOIN users u ON tm.user_id = u.id
      LEFT JOIN users invited_by_user ON tm.invited_by = invited_by_user.id
      WHERE tm.organization_id = $1
      ORDER BY tm.role DESC, tm.joined_at ASC
    `,
        [organizationId],
      );

      res.json({
        success: true,
        data: {
          members: members.rows,
        },
      });
    } catch (error) {
      console.error('Error fetching organization members:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch organization members',
      });
    }
  },
);

// POST /api/organizations/:id/members - Invite member
router.post(
  '/:id/members',
  [
    param('id').isUUID(),
    body('email').isEmail(),
    body('role').isIn(['admin', 'developer', 'viewer']),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { db } = req.app.locals.services;
      const userId = req.user.id;
      const organizationId = req.params.id;
      const { email, role } = req.body;

      // Check if user can invite members
      const memberCheck = await db.query(
        `
      SELECT role FROM team_members 
      WHERE organization_id = $1 AND user_id = $2 AND role IN ('owner', 'admin')
    `,
        [organizationId, userId],
      );

      if (memberCheck.rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
        });
      }

      // Check if user exists
      const userResult = await db.query(
        'SELECT id FROM users WHERE email = $1',
        [email],
      );
      if (userResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      const invitedUserId = userResult.rows[0].id;

      // Check if user is already a member
      const existingMember = await db.query(
        `
      SELECT id FROM team_members 
      WHERE organization_id = $1 AND user_id = $2
    `,
        [organizationId, invitedUserId],
      );

      if (existingMember.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'User is already a member of this organization',
        });
      }

      // Add member
      const memberResult = await db.query(
        `
      INSERT INTO team_members (organization_id, user_id, role, invited_by, joined_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *
    `,
        [organizationId, invitedUserId, role, userId],
      );

      res.status(201).json({
        success: true,
        data: {
          member: memberResult.rows[0],
        },
      });
    } catch (error) {
      console.error('Error inviting member:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to invite member',
      });
    }
  },
);

// PUT /api/organizations/:id/members/:memberId - Update member role
router.put(
  '/:id/members/:memberId',
  [
    param('id').isUUID(),
    param('memberId').isUUID(),
    body('role').isIn(['admin', 'developer', 'viewer']),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { db } = req.app.locals.services;
      const userId = req.user.id;
      const organizationId = req.params.id;
      const memberId = req.params.memberId;
      const { role } = req.body;

      // Check if user can update member roles
      const memberCheck = await db.query(
        `
      SELECT role FROM team_members 
      WHERE organization_id = $1 AND user_id = $2 AND role IN ('owner', 'admin')
    `,
        [organizationId, userId],
      );

      if (memberCheck.rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
        });
      }

      // Update member role
      const result = await db.query(
        `
      UPDATE team_members 
      SET role = $1, updated_at = NOW()
      WHERE id = $2 AND organization_id = $3
      RETURNING *
    `,
        [role, memberId, organizationId],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Member not found',
        });
      }

      res.json({
        success: true,
        data: {
          member: result.rows[0],
        },
      });
    } catch (error) {
      console.error('Error updating member role:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update member role',
      });
    }
  },
);

// DELETE /api/organizations/:id/members/:memberId - Remove member
router.delete(
  '/:id/members/:memberId',
  [param('id').isUUID(), param('memberId').isUUID()],
  validateRequest,
  async (req, res) => {
    try {
      const { db } = req.app.locals.services;
      const userId = req.user.id;
      const organizationId = req.params.id;
      const memberId = req.params.memberId;

      // Check if user can remove members
      const memberCheck = await db.query(
        `
      SELECT role FROM team_members 
      WHERE organization_id = $1 AND user_id = $2 AND role IN ('owner', 'admin')
    `,
        [organizationId, userId],
      );

      if (memberCheck.rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
        });
      }

      // Don't allow removing the last owner
      const memberToRemove = await db.query(
        `
      SELECT role FROM team_members 
      WHERE id = $1 AND organization_id = $2
    `,
        [memberId, organizationId],
      );

      if (memberToRemove.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Member not found',
        });
      }

      if (memberToRemove.rows[0].role === 'owner') {
        const ownerCount = await db.query(
          `
        SELECT COUNT(*) as count FROM team_members 
        WHERE organization_id = $1 AND role = 'owner'
      `,
          [organizationId],
        );

        if (parseInt(ownerCount.rows[0].count) <= 1) {
          return res.status(400).json({
            success: false,
            message: 'Cannot remove the last owner',
          });
        }
      }

      // Remove member
      await db.query(
        `
      DELETE FROM team_members 
      WHERE id = $1 AND organization_id = $2
    `,
        [memberId, organizationId],
      );

      res.json({
        success: true,
        message: 'Member removed successfully',
      });
    } catch (error) {
      console.error('Error removing member:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to remove member',
      });
    }
  },
);

// GET /api/organizations/:id/usage - Get organization usage statistics
router.get(
  '/:id/usage',
  [
    param('id').isUUID(),
    query('period').optional().isIn(['day', 'week', 'month', 'year']),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { db } = req.app.locals.services;
      const userId = req.user.id;
      const organizationId = req.params.id;
      const period = req.query.period || 'month';

      // Check if user has access to this organization
      const memberCheck = await db.query(
        `
      SELECT role FROM team_members 
      WHERE organization_id = $1 AND user_id = $2
    `,
        [organizationId, userId],
      );

      if (memberCheck.rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Access denied',
        });
      }

      // Get usage statistics
      const intervalMap = {
        day: '1 day',
        week: '1 week',
        month: '1 month',
        year: '1 year',
      };

      const usageResult = await db.query(
        `
      SELECT resource_type, SUM(quantity) as total_quantity, unit
      FROM usage_records 
      WHERE organization_id = $1 
        AND period_start >= NOW() - INTERVAL '${intervalMap[period]}'
      GROUP BY resource_type, unit
    `,
        [organizationId],
      );

      // Get current month's deployment count
      const deploymentsResult = await db.query(
        `
      SELECT COUNT(*) as deployment_count
      FROM deployments d
      JOIN projects p ON d.project_id = p.id
      WHERE p.organization_id = $1 
        AND d.created_at >= DATE_TRUNC('month', NOW())
    `,
        [organizationId],
      );

      res.json({
        success: true,
        data: {
          period,
          usage: usageResult.rows,
          current_month_deployments: parseInt(
            deploymentsResult.rows[0].deployment_count,
          ),
          organization_id: organizationId,
        },
      });
    } catch (error) {
      console.error('Error fetching organization usage:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch organization usage',
      });
    }
  },
);

module.exports = router;
