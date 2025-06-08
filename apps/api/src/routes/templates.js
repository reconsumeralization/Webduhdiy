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

// GET /api/templates - List templates with filtering and pagination
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('category')
      .optional()
      .isIn([
        'frontend',
        'fullstack',
        'backend',
        'static',
        'mobile',
        'starter',
      ]),
    query('framework').optional().isLength({ min: 1 }),
    query('search').optional().isLength({ min: 1 }),
    query('tags').optional().isString(),
    query('featured').optional().isBoolean(),
    query('official').optional().isBoolean(),
    query('sort')
      .optional()
      .isIn([
        'created_at',
        'updated_at',
        'name',
        'download_count',
        'average_rating',
      ]),
    query('order').optional().isIn(['asc', 'desc']),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { templates: templateService } = req.app.locals.services;

      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        category: req.query.category,
        framework: req.query.framework,
        search: req.query.search,
        tags: req.query.tags ? req.query.tags.split(',') : undefined,
        featured: req.query.featured === 'true',
        official: req.query.official === 'true',
        sort: req.query.sort || 'updated_at',
        order: req.query.order || 'desc',
      };

      const result = await templateService.getTemplates(options);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Error fetching templates:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch templates',
      });
    }
  },
);

// GET /api/templates/categories - Get template categories
router.get('/categories', async (req, res) => {
  try {
    const { templates: templateService } = req.app.locals.services;

    res.json({
      success: true,
      data: {
        categories: templateService.categories,
      },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
    });
  }
});

// GET /api/templates/featured - Get featured templates
router.get('/featured', async (req, res) => {
  try {
    const { templates: templateService } = req.app.locals.services;

    const result = await templateService.getTemplates({
      featured: true,
      limit: 10,
      sort: 'download_count',
      order: 'desc',
    });

    res.json({
      success: true,
      data: result.templates,
    });
  } catch (error) {
    console.error('Error fetching featured templates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured templates',
    });
  }
});

// GET /api/templates/:id - Get template by ID
router.get(
  '/:id',
  [param('id').isUUID()],
  validateRequest,
  async (req, res) => {
    try {
      const { templates: templateService } = req.app.locals.services;
      const templateId = req.params.id;
      const userId = req.user?.id;

      const template = await templateService.getTemplateById(
        templateId,
        userId,
      );

      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found',
        });
      }

      res.json({
        success: true,
        data: template,
      });
    } catch (error) {
      console.error('Error fetching template:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch template',
      });
    }
  },
);

// POST /api/templates - Create new template
router.post(
  '/',
  [
    body('name')
      .isLength({ min: 1, max: 255 })
      .withMessage('Name is required and must be less than 255 characters'),
    body('description')
      .isLength({ min: 1, max: 2000 })
      .withMessage('Description is required'),
    body('category').isIn([
      'frontend',
      'fullstack',
      'backend',
      'static',
      'mobile',
      'starter',
    ]),
    body('framework').isLength({ min: 1, max: 50 }),
    body('template_files')
      .isObject()
      .withMessage('Template files must be an object'),
    body('build_config').optional().isObject(),
    body('tags').optional().isArray(),
    body('is_public').optional().isBoolean(),
    body('thumbnail_url').optional().isURL(),
    body('demo_url').optional().isURL(),
    body('repository_url').optional().isURL(),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { templates: templateService } = req.app.locals.services;
      const userId = req.user.id;

      const template = await templateService.createTemplate(req.body, userId);

      res.status(201).json({
        success: true,
        data: template,
      });
    } catch (error) {
      console.error('Error creating template:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create template',
      });
    }
  },
);

// POST /api/templates/from-github - Create template from GitHub repository
router.post(
  '/from-github',
  [
    body('owner')
      .isLength({ min: 1 })
      .withMessage('Repository owner is required'),
    body('repo')
      .isLength({ min: 1 })
      .withMessage('Repository name is required'),
    body('ref').optional().isLength({ min: 1 }),
    body('name').optional().isLength({ min: 1, max: 255 }),
    body('description').optional().isLength({ min: 1, max: 2000 }),
    body('category')
      .optional()
      .isIn([
        'frontend',
        'fullstack',
        'backend',
        'static',
        'mobile',
        'starter',
      ]),
    body('access_token').optional().isLength({ min: 1 }),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { templates: templateService } = req.app.locals.services;
      const userId = req.user.id;
      const accessToken = req.body.access_token || req.user.github_access_token;

      if (!accessToken) {
        return res.status(400).json({
          success: false,
          message: 'GitHub access token is required',
        });
      }

      const template = await templateService.createTemplateFromGitHub(
        req.body,
        userId,
        accessToken,
      );

      res.status(201).json({
        success: true,
        data: template,
      });
    } catch (error) {
      console.error('Error creating template from GitHub:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to create template from GitHub',
      });
    }
  },
);

// PUT /api/templates/:id - Update template
router.put(
  '/:id',
  [
    param('id').isUUID(),
    body('name').optional().isLength({ min: 1, max: 255 }),
    body('description').optional().isLength({ min: 1, max: 2000 }),
    body('category')
      .optional()
      .isIn([
        'frontend',
        'fullstack',
        'backend',
        'static',
        'mobile',
        'starter',
      ]),
    body('framework').optional().isLength({ min: 1, max: 50 }),
    body('template_files').optional().isObject(),
    body('build_config').optional().isObject(),
    body('tags').optional().isArray(),
    body('is_public').optional().isBoolean(),
    body('thumbnail_url').optional().isURL(),
    body('demo_url').optional().isURL(),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { templates: templateService } = req.app.locals.services;
      const templateId = req.params.id;
      const userId = req.user.id;

      const template = await templateService.updateTemplate(
        templateId,
        req.body,
        userId,
      );

      res.json({
        success: true,
        data: template,
      });
    } catch (error) {
      console.error('Error updating template:', error);

      if (error.message.includes('Unauthorized')) {
        return res.status(403).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update template',
      });
    }
  },
);

// DELETE /api/templates/:id - Delete template
router.delete(
  '/:id',
  [param('id').isUUID()],
  validateRequest,
  async (req, res) => {
    try {
      const { templates: templateService } = req.app.locals.services;
      const templateId = req.params.id;
      const userId = req.user.id;

      await templateService.deleteTemplate(templateId, userId);

      res.json({
        success: true,
        message: 'Template deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting template:', error);

      if (error.message.includes('Unauthorized')) {
        return res.status(403).json({
          success: false,
          message: error.message,
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to delete template',
      });
    }
  },
);

// POST /api/templates/:id/fork - Fork a template
router.post(
  '/:id/fork',
  [
    param('id').isUUID(),
    body('name').optional().isLength({ min: 1, max: 255 }),
    body('description').optional().isLength({ min: 1, max: 2000 }),
    body('is_public').optional().isBoolean(),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { templates: templateService } = req.app.locals.services;
      const originalTemplateId = req.params.id;
      const userId = req.user.id;

      const forkedTemplate = await templateService.forkTemplate(
        originalTemplateId,
        req.body,
        userId,
      );

      res.status(201).json({
        success: true,
        data: forkedTemplate,
      });
    } catch (error) {
      console.error('Error forking template:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fork template',
      });
    }
  },
);

// POST /api/templates/:id/use - Record template usage and deploy
router.post(
  '/:id/use',
  [
    param('id').isUUID(),
    body('project_name').isLength({ min: 1, max: 255 }),
    body('environment_variables').optional().isObject(),
    body('customizations').optional().isObject(),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { templates: templateService, deployment: deploymentService } =
        req.app.locals.services;
      const templateId = req.params.id;
      const userId = req.user.id;
      const {
        project_name,
        environment_variables = {},
        customizations = {},
      } = req.body;

      // Get template details
      const template = await templateService.getTemplateById(
        templateId,
        userId,
      );
      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found',
        });
      }

      // Create project from template
      const project = await deploymentService.createProjectFromTemplate({
        template,
        project_name,
        environment_variables,
        customizations,
        user_id: userId,
      });

      // Record template usage
      await templateService.recordTemplateUsage(templateId, userId, project.id);

      res.status(201).json({
        success: true,
        data: {
          project,
          template: {
            id: template.id,
            name: template.name,
          },
        },
      });
    } catch (error) {
      console.error('Error using template:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to use template',
      });
    }
  },
);

// GET /api/templates/:id/download - Download template files
router.get(
  '/:id/download',
  [param('id').isUUID()],
  validateRequest,
  async (req, res) => {
    try {
      const { templates: templateService } = req.app.locals.services;
      const templateId = req.params.id;
      const userId = req.user?.id;

      const template = await templateService.getTemplateById(
        templateId,
        userId,
      );
      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found',
        });
      }

      // Record usage if user is authenticated
      if (userId) {
        await templateService.recordTemplateUsage(templateId, userId);
      }

      res.json({
        success: true,
        data: {
          files: template.template_files,
          build_config: template.build_config,
          framework: template.framework,
          name: template.name,
        },
      });
    } catch (error) {
      console.error('Error downloading template:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to download template',
      });
    }
  },
);

// GET /api/templates/:id/usage - Get template usage statistics (owner only)
router.get(
  '/:id/usage',
  [param('id').isUUID()],
  validateRequest,
  async (req, res) => {
    try {
      const { templates: templateService } = req.app.locals.services;
      const templateId = req.params.id;
      const userId = req.user.id;

      // Check ownership
      const ownership = await templateService.checkTemplateOwnership(
        templateId,
        userId,
      );
      if (!ownership) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized to view usage statistics',
        });
      }

      const usageStats =
        await templateService.getTemplateUsageStats(templateId);

      res.json({
        success: true,
        data: {
          usage_stats: usageStats,
        },
      });
    } catch (error) {
      console.error('Error fetching template usage:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch usage statistics',
      });
    }
  },
);

// GET /api/templates/:id/reviews - Get template reviews
router.get(
  '/:id/reviews',
  [param('id').isUUID(), query('limit').optional().isInt({ min: 1, max: 50 })],
  validateRequest,
  async (req, res) => {
    try {
      const { templates: templateService } = req.app.locals.services;
      const templateId = req.params.id;
      const limit = parseInt(req.query.limit) || 10;

      const reviews = await templateService.getTemplateReviews(
        templateId,
        limit,
      );

      res.json({
        success: true,
        data: {
          reviews,
        },
      });
    } catch (error) {
      console.error('Error fetching template reviews:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch reviews',
      });
    }
  },
);

// GET /api/templates/:id/related - Get related templates
router.get(
  '/:id/related',
  [param('id').isUUID(), query('limit').optional().isInt({ min: 1, max: 20 })],
  validateRequest,
  async (req, res) => {
    try {
      const { templates: templateService } = req.app.locals.services;
      const templateId = req.params.id;
      const userId = req.user?.id;
      const limit = parseInt(req.query.limit) || 5;

      const template = await templateService.getTemplateById(
        templateId,
        userId,
      );
      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found',
        });
      }

      const relatedTemplates = await templateService.getRelatedTemplates(
        templateId,
        template.category,
        template.framework,
        limit,
      );

      res.json({
        success: true,
        data: {
          related_templates: relatedTemplates,
        },
      });
    } catch (error) {
      console.error('Error fetching related templates:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch related templates',
      });
    }
  },
);

// GET /api/templates/my/templates - Get user's templates
router.get(
  '/my/templates',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { templates: templateService } = req.app.locals.services;
      const userId = req.user.id;

      const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        user_id: userId,
        sort: 'updated_at',
        order: 'desc',
      };

      const result = await templateService.getTemplates(options);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Error fetching user templates:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch your templates',
      });
    }
  },
);

module.exports = router;
