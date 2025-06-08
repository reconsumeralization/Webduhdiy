const winston = require('winston');
const crypto = require('crypto');
const path = require('path');
const GitHubService = require('./GitHubService');

class TemplateService {
  constructor(dbService, redisService) {
    this.db = dbService;
    this.redis = redisService;
    this.github = new GitHubService();

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'templates.log' }),
      ],
    });

    // Template categories and their metadata
    this.categories = {
      frontend: {
        name: 'Frontend',
        description: 'User interface and client-side applications',
        icon: 'browser',
        frameworks: ['react', 'vue', 'angular', 'svelte', 'vanilla'],
      },
      fullstack: {
        name: 'Full Stack',
        description: 'Complete applications with frontend and backend',
        icon: 'stack',
        frameworks: ['nextjs', 'nuxt', 'sveltekit', 'remix'],
      },
      backend: {
        name: 'Backend',
        description: 'Server-side applications and APIs',
        icon: 'server',
        frameworks: ['express', 'fastify', 'nestjs', 'koa'],
      },
      static: {
        name: 'Static Site',
        description: 'Static websites and documentation',
        icon: 'document',
        frameworks: ['gatsby', 'astro', 'eleventy', 'hugo'],
      },
      mobile: {
        name: 'Mobile',
        description: 'Mobile applications and PWAs',
        icon: 'phone',
        frameworks: ['react-native', 'ionic', 'flutter'],
      },
      starter: {
        name: 'Starter',
        description: 'Basic templates to get started quickly',
        icon: 'rocket',
        frameworks: ['vite', 'create-react-app', 'vue-cli'],
      },
    };
  }

  /**
   * Get all available templates with filtering and pagination
   */
  async getTemplates(options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        category,
        framework,
        search,
        tags,
        featured = false,
        official = false,
        sort = 'updated_at',
        order = 'desc',
        user_id,
      } = options;

      const offset = (page - 1) * limit;
      let whereClause = 'WHERE t.deleted_at IS NULL';
      const queryParams = [];
      let paramIndex = 1;

      // Build WHERE conditions
      if (category) {
        whereClause += ` AND t.category = $${paramIndex}`;
        queryParams.push(category);
        paramIndex++;
      }

      if (framework) {
        whereClause += ` AND t.framework = $${paramIndex}`;
        queryParams.push(framework);
        paramIndex++;
      }

      if (search) {
        whereClause += ` AND (t.name ILIKE $${paramIndex} OR t.description ILIKE $${paramIndex})`;
        queryParams.push(`%${search}%`);
        paramIndex++;
      }

      if (tags && tags.length > 0) {
        whereClause += ` AND t.tags @> $${paramIndex}`;
        queryParams.push(JSON.stringify(tags));
        paramIndex++;
      }

      if (featured) {
        whereClause += ` AND t.is_featured = true`;
      }

      if (official) {
        whereClause += ` AND t.is_official = true`;
      }

      if (user_id) {
        whereClause += ` AND t.created_by = $${paramIndex}`;
        queryParams.push(user_id);
        paramIndex++;
      }

      // Add public filter for non-owner requests
      if (!user_id) {
        whereClause += ` AND t.is_public = true`;
      }

      const query = `
        SELECT t.*,
               u.name as creator_name,
               u.avatar_url as creator_avatar,
               COUNT(tu.id) as usage_count,
               AVG(tr.rating) as average_rating,
               COUNT(tr.id) as review_count
        FROM project_templates t
        LEFT JOIN users u ON t.created_by = u.id
        LEFT JOIN template_usage tu ON t.id = tu.template_id
        LEFT JOIN template_reviews tr ON t.id = tr.template_id
        ${whereClause}
        GROUP BY t.id, u.name, u.avatar_url
        ORDER BY ${sort} ${order.toUpperCase()}
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      queryParams.push(limit, offset);
      const templates = await this.db.query(query, queryParams);

      // Get total count for pagination
      const countQuery = `
        SELECT COUNT(DISTINCT t.id) as total
        FROM project_templates t
        ${whereClause}
      `;
      const countResult = await this.db.query(
        countQuery,
        queryParams.slice(0, -2),
      );
      const total = parseInt(countResult.rows[0]?.total || 0);

      return {
        templates: templates.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
        categories: this.categories,
      };
    } catch (error) {
      this.logger.error('Failed to get templates:', error);
      throw error;
    }
  }

  /**
   * Get template by ID with detailed information
   */
  async getTemplateById(templateId, userId = null) {
    try {
      const query = `
        SELECT t.*,
               u.name as creator_name,
               u.avatar_url as creator_avatar,
               u.email as creator_email,
               COUNT(DISTINCT tu.id) as usage_count,
               AVG(tr.rating) as average_rating,
               COUNT(DISTINCT tr.id) as review_count,
               COUNT(DISTINCT tf.id) as fork_count
        FROM project_templates t
        LEFT JOIN users u ON t.created_by = u.id
        LEFT JOIN template_usage tu ON t.id = tu.template_id
        LEFT JOIN template_reviews tr ON t.id = tr.template_id
        LEFT JOIN template_forks tf ON t.id = tf.original_template_id
        WHERE t.id = $1 AND t.deleted_at IS NULL
        GROUP BY t.id, u.name, u.avatar_url, u.email
      `;

      const result = await this.db.query(query, [templateId]);

      if (result.rows.length === 0) {
        return null;
      }

      const template = result.rows[0];

      // Check if user can access this template
      if (!template.is_public && template.created_by !== userId) {
        return null;
      }

      // Get recent usage statistics
      const usageStats = await this.getTemplateUsageStats(templateId);

      // Get reviews
      const reviews = await this.getTemplateReviews(templateId);

      // Get related templates
      const relatedTemplates = await this.getRelatedTemplates(
        templateId,
        template.category,
        template.framework,
      );

      return {
        ...template,
        usage_stats: usageStats,
        reviews,
        related_templates: relatedTemplates,
      };
    } catch (error) {
      this.logger.error('Failed to get template by ID:', error);
      throw error;
    }
  }

  /**
   * Create a new template
   */
  async createTemplate(templateData, userId) {
    try {
      const {
        name,
        description,
        category,
        framework,
        repository_url,
        template_files,
        build_config = {},
        tags = [],
        is_public = true,
        thumbnail_url,
        demo_url,
      } = templateData;

      // Validate required fields
      if (!name || !description || !category || !framework) {
        throw new Error('Missing required template fields');
      }

      // Validate category
      if (!this.categories[category]) {
        throw new Error(`Invalid category: ${category}`);
      }

      // Generate unique slug
      const slug = await this.generateUniqueSlug(name);

      const insertQuery = `
        INSERT INTO project_templates (
          name, slug, description, category, framework, 
          repository_url, template_files, build_config, 
          tags, is_public, thumbnail_url, demo_url, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *
      `;

      const values = [
        name,
        slug,
        description,
        category,
        framework,
        repository_url,
        JSON.stringify(template_files),
        JSON.stringify(build_config),
        JSON.stringify(tags),
        is_public,
        thumbnail_url,
        demo_url,
        userId,
      ];

      const result = await this.db.query(insertQuery, values);
      const template = result.rows[0];

      // Cache template data
      await this.cacheTemplate(template);

      this.logger.info('Template created successfully:', {
        templateId: template.id,
        name: template.name,
        userId,
      });

      return template;
    } catch (error) {
      this.logger.error('Failed to create template:', error);
      throw error;
    }
  }

  /**
   * Create template from GitHub repository
   */
  async createTemplateFromGitHub(repositoryData, userId, accessToken) {
    try {
      const {
        owner,
        repo,
        ref = 'main',
        name,
        description,
        category,
      } = repositoryData;

      // Analyze repository
      const analysis = await this.github.analyzeRepositoryForTemplate(
        accessToken,
        owner,
        repo,
      );

      // Download repository files
      const zipBuffer = await this.github.downloadRepositoryZip(
        accessToken,
        owner,
        repo,
        ref,
      );
      const files = await this.github.extractRepositoryFiles(zipBuffer);

      // Create template data structure
      const templateFiles = this.processRepositoryFiles(files);

      // Detect build configuration
      const buildConfig = analysis.buildConfig || {};

      // Auto-detect tags based on analysis
      const autoTags = this.generateAutoTags(analysis, files);

      const templateData = {
        name: name || `${owner}/${repo}`,
        description: description || `Template created from ${owner}/${repo}`,
        category: category || this.mapFrameworkToCategory(analysis.framework),
        framework: analysis.framework,
        repository_url: `https://github.com/${owner}/${repo}`,
        template_files: templateFiles,
        build_config: buildConfig,
        tags: autoTags,
        is_public: true,
      };

      const template = await this.createTemplate(templateData, userId);

      // Record the GitHub source
      await this.recordTemplateSource(template.id, {
        type: 'github',
        owner,
        repo,
        ref,
        analysis,
      });

      return template;
    } catch (error) {
      this.logger.error('Failed to create template from GitHub:', error);
      throw error;
    }
  }

  /**
   * Update existing template
   */
  async updateTemplate(templateId, updates, userId) {
    try {
      // Check if user owns this template
      const ownership = await this.checkTemplateOwnership(templateId, userId);
      if (!ownership) {
        throw new Error('Unauthorized to update this template');
      }

      const allowedFields = [
        'name',
        'description',
        'category',
        'framework',
        'tags',
        'is_public',
        'thumbnail_url',
        'demo_url',
        'template_files',
        'build_config',
      ];

      const updateFields = [];
      const values = [];
      let paramIndex = 1;

      for (const [field, value] of Object.entries(updates)) {
        if (allowedFields.includes(field) && value !== undefined) {
          updateFields.push(`${field} = $${paramIndex}`);
          values.push(
            typeof value === 'object' ? JSON.stringify(value) : value,
          );
          paramIndex++;
        }
      }

      if (updateFields.length === 0) {
        throw new Error('No valid fields to update');
      }

      updateFields.push(`updated_at = NOW()`);
      values.push(templateId);

      const query = `
        UPDATE project_templates 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramIndex} AND deleted_at IS NULL
        RETURNING *
      `;

      const result = await this.db.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('Template not found');
      }

      const template = result.rows[0];

      // Update cache
      await this.cacheTemplate(template);

      this.logger.info('Template updated successfully:', {
        templateId,
        userId,
      });

      return template;
    } catch (error) {
      this.logger.error('Failed to update template:', error);
      throw error;
    }
  }

  /**
   * Delete template (soft delete)
   */
  async deleteTemplate(templateId, userId) {
    try {
      const ownership = await this.checkTemplateOwnership(templateId, userId);
      if (!ownership) {
        throw new Error('Unauthorized to delete this template');
      }

      const query = `
        UPDATE project_templates 
        SET deleted_at = NOW()
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING id, name
      `;

      const result = await this.db.query(query, [templateId]);

      if (result.rows.length === 0) {
        throw new Error('Template not found');
      }

      // Remove from cache
      await this.redis.del(`template:${templateId}`);

      this.logger.info('Template deleted successfully:', {
        templateId,
        userId,
      });

      return result.rows[0];
    } catch (error) {
      this.logger.error('Failed to delete template:', error);
      throw error;
    }
  }

  /**
   * Fork a template
   */
  async forkTemplate(originalTemplateId, forkData, userId) {
    try {
      const originalTemplate = await this.getTemplateById(originalTemplateId);
      if (!originalTemplate) {
        throw new Error('Original template not found');
      }

      const {
        name = `${originalTemplate.name} (Fork)`,
        description = originalTemplate.description,
        is_public = originalTemplate.is_public,
      } = forkData;

      // Create the forked template
      const forkedTemplate = await this.createTemplate(
        {
          name,
          description,
          category: originalTemplate.category,
          framework: originalTemplate.framework,
          repository_url: originalTemplate.repository_url,
          template_files: originalTemplate.template_files,
          build_config: originalTemplate.build_config,
          tags: originalTemplate.tags,
          is_public,
          thumbnail_url: originalTemplate.thumbnail_url,
          demo_url: originalTemplate.demo_url,
        },
        userId,
      );

      // Record the fork relationship
      await this.db.query(
        `
        INSERT INTO template_forks (original_template_id, forked_template_id, created_by)
        VALUES ($1, $2, $3)
      `,
        [originalTemplateId, forkedTemplate.id, userId],
      );

      this.logger.info('Template forked successfully:', {
        originalTemplateId,
        forkedTemplateId: forkedTemplate.id,
        userId,
      });

      return forkedTemplate;
    } catch (error) {
      this.logger.error('Failed to fork template:', error);
      throw error;
    }
  }

  /**
   * Record template usage
   */
  async recordTemplateUsage(templateId, userId, projectId = null) {
    try {
      await this.db.query(
        `
        INSERT INTO template_usage (template_id, user_id, project_id)
        VALUES ($1, $2, $3)
      `,
        [templateId, userId, projectId],
      );

      // Update download count
      await this.db.query(
        `
        UPDATE project_templates 
        SET download_count = download_count + 1
        WHERE id = $1
      `,
        [templateId],
      );

      this.logger.info('Template usage recorded:', {
        templateId,
        userId,
        projectId,
      });
    } catch (error) {
      this.logger.error('Failed to record template usage:', error);
      // Don't throw error - usage tracking is not critical
    }
  }

  /**
   * Get template usage statistics
   */
  async getTemplateUsageStats(templateId) {
    try {
      const query = `
        SELECT 
          DATE_TRUNC('day', created_at) as date,
          COUNT(*) as usage_count
        FROM template_usage
        WHERE template_id = $1 
          AND created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE_TRUNC('day', created_at)
        ORDER BY date DESC
      `;

      const result = await this.db.query(query, [templateId]);
      return result.rows;
    } catch (error) {
      this.logger.error('Failed to get template usage stats:', error);
      return [];
    }
  }

  /**
   * Get template reviews
   */
  async getTemplateReviews(templateId, limit = 10) {
    try {
      const query = `
        SELECT tr.*, u.name as reviewer_name, u.avatar_url as reviewer_avatar
        FROM template_reviews tr
        JOIN users u ON tr.user_id = u.id
        WHERE tr.template_id = $1
        ORDER BY tr.created_at DESC
        LIMIT $2
      `;

      const result = await this.db.query(query, [templateId, limit]);
      return result.rows;
    } catch (error) {
      this.logger.error('Failed to get template reviews:', error);
      return [];
    }
  }

  /**
   * Get related templates
   */
  async getRelatedTemplates(templateId, category, framework, limit = 5) {
    try {
      const query = `
        SELECT id, name, description, thumbnail_url, framework, average_rating, usage_count
        FROM project_templates
        WHERE id != $1 
          AND deleted_at IS NULL
          AND is_public = true
          AND (category = $2 OR framework = $3)
        ORDER BY 
          CASE WHEN framework = $3 THEN 2 ELSE 1 END DESC,
          download_count DESC
        LIMIT $4
      `;

      const result = await this.db.query(query, [
        templateId,
        category,
        framework,
        limit,
      ]);
      return result.rows;
    } catch (error) {
      this.logger.error('Failed to get related templates:', error);
      return [];
    }
  }

  /**
   * Helper methods
   */

  async generateUniqueSlug(name) {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await this.db.query(
        'SELECT id FROM project_templates WHERE slug = $1',
        [slug],
      );

      if (existing.rows.length === 0) {
        return slug;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  async checkTemplateOwnership(templateId, userId) {
    const result = await this.db.query(
      'SELECT created_by FROM project_templates WHERE id = $1',
      [templateId],
    );

    return result.rows.length > 0 && result.rows[0].created_by === userId;
  }

  processRepositoryFiles(files) {
    const processedFiles = {};

    for (const file of files) {
      if (this.shouldIncludeFile(file.path)) {
        processedFiles[file.path] = {
          content: file.content,
          size: file.size,
          type: this.getFileType(file.path),
        };
      }
    }

    return processedFiles;
  }

  shouldIncludeFile(filePath) {
    const excludePatterns = [
      /^\.git\//,
      /node_modules\//,
      /\.DS_Store$/,
      /Thumbs\.db$/,
      /\.log$/,
      /\.tmp$/,
      /\.cache\//,
      /dist\//,
      /build\//,
    ];

    return !excludePatterns.some((pattern) => pattern.test(filePath));
  }

  getFileType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const typeMap = {
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.css': 'css',
      '.scss': 'scss',
      '.sass': 'sass',
      '.less': 'less',
      '.html': 'html',
      '.htm': 'html',
      '.vue': 'vue',
      '.svelte': 'svelte',
      '.json': 'json',
      '.yaml': 'yaml',
      '.yml': 'yaml',
      '.md': 'markdown',
      '.mdx': 'mdx',
      '.py': 'python',
      '.php': 'php',
      '.rb': 'ruby',
      '.go': 'go',
      '.rs': 'rust',
    };
    return typeMap[ext] || 'text';
  }

  generateAutoTags(analysis, files) {
    const tags = [];

    // Framework-based tags
    if (analysis.framework) {
      tags.push(analysis.framework);
    }

    // Language-based tags
    Object.keys(analysis.languages || {}).forEach((lang) => {
      tags.push(lang.toLowerCase());
    });

    // Feature-based tags
    if (analysis.hasPackageJson) tags.push('npm');
    if (analysis.hasDockerfile) tags.push('docker');
    if (files.some((f) => f.path.includes('test'))) tags.push('testing');
    if (files.some((f) => f.path.includes('api'))) tags.push('api');
    if (files.some((f) => f.path.includes('component')))
      tags.push('components');

    // Complexity tags
    tags.push(analysis.complexity);

    return [...new Set(tags)]; // Remove duplicates
  }

  mapFrameworkToCategory(framework) {
    const mapping = {
      nextjs: 'fullstack',
      nuxt: 'fullstack',
      sveltekit: 'fullstack',
      react: 'frontend',
      vue: 'frontend',
      angular: 'frontend',
      svelte: 'frontend',
      express: 'backend',
      fastify: 'backend',
      nestjs: 'backend',
      gatsby: 'static',
      astro: 'static',
      eleventy: 'static',
      vite: 'starter',
      'create-react-app': 'starter',
    };

    return mapping[framework] || 'frontend';
  }

  async recordTemplateSource(templateId, sourceData) {
    try {
      await this.db.query(
        `
        INSERT INTO template_sources (template_id, source_type, source_data)
        VALUES ($1, $2, $3)
      `,
        [templateId, sourceData.type, JSON.stringify(sourceData)],
      );
    } catch (error) {
      this.logger.warn('Failed to record template source:', error);
    }
  }

  async cacheTemplate(template) {
    try {
      await this.redis.set(`template:${template.id}`, template, 3600); // 1 hour cache
    } catch (error) {
      this.logger.warn('Failed to cache template:', error);
    }
  }
}

module.exports = TemplateService;
