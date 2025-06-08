const express = require('express');
const router = express.Router();
const DatabaseService = require('../services/DatabaseService');
const DeploymentEngine = require('../services/DeploymentEngine');
const crypto = require('crypto');
const path = require('path');
const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || 'postgresql://localhost:5432/webduhvercel',
});

// Middleware for authentication (placeholder - implement based on your auth system)
const requireAuth = (req, res, next) => {
  // Implementation depends on your auth system
  // For now, assume user is available in req.user
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Helper function to calculate file hash
const calculateFileHash = (content) => {
  return crypto.createHash('sha256').update(content).digest('hex');
};

// Helper function to determine file type from extension
const getFileType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  const typeMap = {
    '.js': 'javascript',
    '.jsx': 'javascript',
    '.ts': 'typescript',
    '.tsx': 'typescript',
    '.css': 'css',
    '.scss': 'scss',
    '.sass': 'sass',
    '.html': 'html',
    '.json': 'json',
    '.md': 'markdown',
    '.py': 'python',
    '.php': 'php',
    '.vue': 'vue',
    '.svelte': 'svelte',
  };
  return typeMap[ext] || 'text';
};

// Helper function to determine MIME type
const getMimeType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  const mimeMap = {
    '.js': 'application/javascript',
    '.jsx': 'application/javascript',
    '.ts': 'application/typescript',
    '.tsx': 'application/typescript',
    '.css': 'text/css',
    '.scss': 'text/scss',
    '.sass': 'text/sass',
    '.html': 'text/html',
    '.json': 'application/json',
    '.md': 'text/markdown',
    '.txt': 'text/plain',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
  };
  return mimeMap[ext] || 'text/plain';
};

// Get all projects with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      framework,
      sortBy = 'updatedAt',
      sortOrder = 'desc',
    } = req.query;

    const offset = (page - 1) * limit;

    let whereClause = {};
    if (search) {
      whereClause.name = { $regex: search, $options: 'i' };
    }
    if (status) {
      whereClause.status = status;
    }
    if (framework) {
      whereClause.framework = framework;
    }

    const projects = await DatabaseService.findMany('projects', {
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      orderBy: { [sortBy]: sortOrder },
    });

    const total = await DatabaseService.count('projects', whereClause);

    res.json({
      projects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get single project by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await DatabaseService.findById('projects', id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get project deployments
    const deployments = await DatabaseService.findMany('deployments', {
      where: { projectId: id },
      limit: 10,
      orderBy: { createdAt: 'desc' },
    });

    // Get project domains
    const domains = await DatabaseService.findMany('domains', {
      where: { projectId: id },
    });

    res.json({
      ...project,
      deployments,
      domains,
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Create new project
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      repository,
      framework,
      buildCommand,
      outputDirectory,
      installCommand,
      environmentVariables = {},
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    // Create project
    const project = await DatabaseService.create('projects', {
      name: name.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      displayName: name,
      description,
      repository,
      framework: framework || 'static',
      buildCommand: buildCommand || 'npm run build',
      outputDirectory: outputDirectory || 'build',
      installCommand: installCommand || 'npm install',
      environmentVariables,
      status: 'created',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Trigger initial deployment if repository is provided
    if (repository) {
      try {
        const deployment = await DeploymentEngine.deployFromRepository({
          projectId: project.id,
          repository,
          branch: 'main',
        });

        project.latestDeployment = deployment;
      } catch (deployError) {
        console.error('Initial deployment failed:', deployError);
        // Continue with project creation even if deployment fails
      }
    }

    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove non-updatable fields
    delete updates.id;
    delete updates.createdAt;
    updates.updatedAt = new Date();

    const project = await DatabaseService.update('projects', id, updates);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if project exists
    const project = await DatabaseService.findById('projects', id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Delete related resources
    await DatabaseService.deleteMany('deployments', { projectId: id });
    await DatabaseService.deleteMany('domains', { projectId: id });

    // Delete project
    await DatabaseService.delete('projects', id);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Deploy project
router.post('/:id/deploy', async (req, res) => {
  try {
    const { id } = req.params;
    const { branch = 'main', environmentVariables } = req.body;

    const project = await DatabaseService.findById('projects', id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const deployment = await DeploymentEngine.deployFromRepository({
      projectId: id,
      repository: project.repository,
      branch,
      environmentVariables: {
        ...project.environmentVariables,
        ...environmentVariables,
      },
    });

    res.status(201).json(deployment);
  } catch (error) {
    console.error('Error deploying project:', error);
    res.status(500).json({ error: 'Failed to deploy project' });
  }
});

// Get project environments
router.get('/:id/environments', async (req, res) => {
  try {
    const { id } = req.params;

    const project = await DatabaseService.findById('projects', id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      environmentVariables: project.environmentVariables || {},
    });
  } catch (error) {
    console.error('Error fetching environments:', error);
    res.status(500).json({ error: 'Failed to fetch environments' });
  }
});

// Update project environments
router.put('/:id/environments', async (req, res) => {
  try {
    const { id } = req.params;
    const { environmentVariables } = req.body;

    const project = await DatabaseService.update('projects', id, {
      environmentVariables,
      updatedAt: new Date(),
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      environmentVariables: project.environmentVariables,
    });
  } catch (error) {
    console.error('Error updating environments:', error);
    res.status(500).json({ error: 'Failed to update environments' });
  }
});

// ============================================================================
// PROJECT ROUTES
// ============================================================================

// GET /api/projects - List all projects for the authenticated user
router.get('/', requireAuth, async (req, res) => {
  try {
    const { team_id, status, source_type, framework } = req.query;

    let query = `
      SELECT p.*, t.name as team_name, u.username as creator_username,
        (SELECT COUNT(*) FROM project_files pf WHERE pf.project_id = p.id) as file_count,
        (SELECT COUNT(*) FROM deployments d WHERE d.project_id = p.id) as deployment_count,
        (SELECT MAX(d.created_at) FROM deployments d WHERE d.project_id = p.id AND d.status = 'ready') as last_deployment_at
      FROM projects p
      JOIN teams t ON p.team_id = t.id
      JOIN users u ON p.created_by = u.id
      JOIN team_members tm ON t.id = tm.team_id
      WHERE tm.user_id = $1
    `;

    const params = [req.user.id];
    let paramIndex = 2;

    if (team_id) {
      query += ` AND p.team_id = $${paramIndex}`;
      params.push(team_id);
      paramIndex++;
    }

    if (status) {
      query += ` AND p.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (source_type) {
      query += ` AND p.source_type = $${paramIndex}`;
      params.push(source_type);
      paramIndex++;
    }

    if (framework) {
      query += ` AND p.framework = $${paramIndex}`;
      params.push(framework);
      paramIndex++;
    }

    query += ` ORDER BY p.updated_at DESC`;

    const result = await pool.query(query, params);
    res.json({
      projects: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// POST /api/projects - Create a new project
router.post('/', requireAuth, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const {
      name,
      description,
      framework,
      team_id,
      repository_url,
      source_type = 'manual',
      ai_builder_session_id,
      build_command,
      output_directory,
      install_command,
      dev_command,
      template_id,
    } = req.body;

    // Validate required fields
    if (!name || !team_id) {
      return res.status(400).json({
        error: 'Name and team_id are required',
      });
    }

    // Generate unique slug
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50);

    // Check if slug is unique within team
    const slugCheck = await client.query(
      'SELECT id FROM projects WHERE team_id = $1 AND slug = $2',
      [team_id, slug],
    );

    if (slugCheck.rows.length > 0) {
      return res.status(400).json({
        error: 'Project name already exists in this team',
      });
    }

    // Verify user has access to the team
    const teamAccess = await client.query(
      'SELECT role FROM team_members WHERE team_id = $1 AND user_id = $2',
      [team_id, req.user.id],
    );

    if (teamAccess.rows.length === 0) {
      return res.status(403).json({
        error: 'You do not have access to this team',
      });
    }

    // Create project
    const projectResult = await client.query(
      `
      INSERT INTO projects (
        name, slug, description, framework, team_id, created_by,
        repository_url, source_type, ai_builder_session_id,
        build_command, output_directory, install_command, dev_command
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `,
      [
        name,
        slug,
        description,
        framework,
        team_id,
        req.user.id,
        repository_url,
        source_type,
        ai_builder_session_id,
        build_command,
        output_directory,
        install_command,
        dev_command,
      ],
    );

    const project = projectResult.rows[0];

    // If creating from template, copy template files
    if (template_id) {
      const template = await client.query(
        'SELECT template_files FROM project_templates WHERE id = $1 AND is_public = true',
        [template_id],
      );

      if (template.rows.length > 0) {
        const templateFiles = template.rows[0].template_files;

        for (const [filePath, fileData] of Object.entries(templateFiles)) {
          await client.query(
            `
            INSERT INTO project_files (
              project_id, file_path, file_name, file_type, content,
              content_hash, file_size, mime_type, parent_directory,
              created_by, ai_generated
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          `,
            [
              project.id,
              filePath,
              path.basename(filePath),
              getFileType(filePath),
              fileData.content,
              calculateFileHash(fileData.content),
              Buffer.byteLength(fileData.content, 'utf8'),
              getMimeType(filePath),
              path.dirname(filePath),
              req.user.id,
              false,
            ],
          );
        }
      }
    }

    await client.query('COMMIT');

    res.status(201).json({
      project: project,
      message: 'Project created successfully',
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  } finally {
    client.release();
  }
});

// GET /api/projects/:id - Get specific project with files
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { include_files = 'false' } = req.query;

    // Get project details
    const projectResult = await pool.query(
      `
      SELECT p.*, t.name as team_name, u.username as creator_username
      FROM projects p
      JOIN teams t ON p.team_id = t.id
      JOIN users u ON p.created_by = u.id
      JOIN team_members tm ON t.id = tm.team_id
      WHERE p.id = $1 AND tm.user_id = $2
    `,
      [id, req.user.id],
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = projectResult.rows[0];

    // Optionally include files
    if (include_files === 'true') {
      const filesResult = await pool.query(
        `
        SELECT id, file_path, file_name, file_type, file_size, 
               mime_type, parent_directory, ai_generated, 
               created_at, updated_at
        FROM project_files 
        WHERE project_id = $1 
        ORDER BY file_path
      `,
        [id],
      );

      project.files = filesResult.rows;
    }

    res.json({ project });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// ============================================================================
// FILE MANAGEMENT ROUTES
// ============================================================================

// GET /api/projects/:id/files - Get all files for a project
router.get('/:id/files', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { include_content = 'false', file_type, ai_generated } = req.query;

    // Verify project access
    const projectAccess = await pool.query(
      `
      SELECT p.id FROM projects p
      JOIN team_members tm ON p.team_id = tm.team_id
      WHERE p.id = $1 AND tm.user_id = $2
    `,
      [id, req.user.id],
    );

    if (projectAccess.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    let query = `
      SELECT 
        ${
          include_content === 'true'
            ? 'pf.*'
            : `
          pf.id, pf.file_path, pf.file_name, pf.file_type, 
          pf.file_size, pf.mime_type, pf.parent_directory,
          pf.ai_generated, pf.version, pf.created_at, pf.updated_at
        `
        }
      FROM project_files pf
      WHERE pf.project_id = $1
    `;

    const params = [id];
    let paramIndex = 2;

    if (file_type) {
      query += ` AND pf.file_type = $${paramIndex}`;
      params.push(file_type);
      paramIndex++;
    }

    if (ai_generated !== undefined) {
      query += ` AND pf.ai_generated = $${paramIndex}`;
      params.push(ai_generated === 'true');
      paramIndex++;
    }

    query += ` ORDER BY pf.file_path`;

    const result = await pool.query(query, params);

    res.json({
      files: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching project files:', error);
    res.status(500).json({ error: 'Failed to fetch project files' });
  }
});

// GET /api/projects/:id/files/:file_id - Get specific file with content
router.get('/:id/files/:file_id', requireAuth, async (req, res) => {
  try {
    const { id, file_id } = req.params;

    const result = await pool.query(
      `
      SELECT pf.* FROM project_files pf
      JOIN projects p ON pf.project_id = p.id
      JOIN team_members tm ON p.team_id = tm.team_id
      WHERE pf.id = $1 AND pf.project_id = $2 AND tm.user_id = $3
    `,
      [file_id, id, req.user.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json({ file: result.rows[0] });
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ error: 'Failed to fetch file' });
  }
});

// POST /api/projects/:id/files - Create or update files
router.post('/:id/files', requireAuth, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { id } = req.params;
    const { files, ai_builder_session_id } = req.body;

    if (!files || !Array.isArray(files)) {
      return res.status(400).json({
        error: 'Files array is required',
      });
    }

    // Verify project access
    const projectAccess = await client.query(
      `
      SELECT p.id FROM projects p
      JOIN team_members tm ON p.team_id = tm.team_id
      WHERE p.id = $1 AND tm.user_id = $2
    `,
      [id, req.user.id],
    );

    if (projectAccess.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const createdFiles = [];
    const updatedFiles = [];

    for (const fileData of files) {
      const {
        file_path,
        content,
        operation = 'create', // create, update
      } = fileData;

      if (!file_path || content === undefined) {
        continue;
      }

      const fileName = path.basename(file_path);
      const fileType = getFileType(fileName);
      const mimeType = getMimeType(fileName);
      const contentHash = calculateFileHash(content);
      const fileSize = Buffer.byteLength(content, 'utf8');
      const parentDirectory = path.dirname(file_path);
      const isAiGenerated = Boolean(ai_builder_session_id);

      // Check if file exists
      const existingFile = await client.query(
        'SELECT id, version, content_hash FROM project_files WHERE project_id = $1 AND file_path = $2',
        [id, file_path],
      );

      if (existingFile.rows.length > 0 && operation === 'update') {
        const existing = existingFile.rows[0];

        // Only update if content has changed
        if (existing.content_hash !== contentHash) {
          // Create version backup
          await client.query(
            `
            INSERT INTO project_file_versions (
              file_id, version_number, content, content_hash, created_by
            ) VALUES ($1, $2, $3, $4, $5)
          `,
            [
              existing.id,
              existing.version,
              content, // The old content becomes the backup
              existing.content_hash,
              req.user.id,
            ],
          );

          // Update file
          const updateResult = await client.query(
            `
            UPDATE project_files SET
              content = $1, content_hash = $2, file_size = $3, version = version + 1,
              last_modified_by = $4, ai_builder_session_id = $5, updated_at = NOW()
            WHERE id = $6
            RETURNING *
          `,
            [
              content,
              contentHash,
              fileSize,
              req.user.id,
              ai_builder_session_id,
              existing.id,
            ],
          );

          updatedFiles.push(updateResult.rows[0]);
        }
      } else {
        // Create new file
        const createResult = await client.query(
          `
          INSERT INTO project_files (
            project_id, file_path, file_name, file_type, content,
            content_hash, file_size, mime_type, parent_directory,
            created_by, ai_generated, ai_builder_session_id
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          RETURNING *
        `,
          [
            id,
            file_path,
            fileName,
            fileType,
            content,
            contentHash,
            fileSize,
            mimeType,
            parentDirectory,
            req.user.id,
            isAiGenerated,
            ai_builder_session_id,
          ],
        );

        createdFiles.push(createResult.rows[0]);
      }
    }

    // Update project's last_sync_at
    await client.query(
      'UPDATE projects SET last_sync_at = NOW() WHERE id = $1',
      [id],
    );

    // Log sync history if this is an AI Builder import
    if (ai_builder_session_id) {
      await client.query(
        `
        INSERT INTO project_sync_history (
          project_id, sync_type, source_reference, 
          files_added, files_changed, initiated_by
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `,
        [
          id,
          'ai_builder_import',
          ai_builder_session_id,
          createdFiles.length,
          updatedFiles.length,
          req.user.id,
        ],
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      created: createdFiles,
      updated: updatedFiles,
      message: `Successfully processed ${createdFiles.length + updatedFiles.length} files`,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating/updating files:', error);
    res.status(500).json({ error: 'Failed to process files' });
  } finally {
    client.release();
  }
});

// DELETE /api/projects/:id/files/:file_id - Delete a file
router.delete('/:id/files/:file_id', requireAuth, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { id, file_id } = req.params;

    // Verify file exists and user has access
    const fileCheck = await client.query(
      `
      SELECT pf.file_path FROM project_files pf
      JOIN projects p ON pf.project_id = p.id
      JOIN team_members tm ON p.team_id = tm.team_id
      WHERE pf.id = $1 AND pf.project_id = $2 AND tm.user_id = $3
    `,
      [file_id, id, req.user.id],
    );

    if (fileCheck.rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete file versions first (due to foreign key constraint)
    await client.query('DELETE FROM project_file_versions WHERE file_id = $1', [
      file_id,
    ]);

    // Delete the file
    await client.query('DELETE FROM project_files WHERE id = $1', [file_id]);

    // Update project's last_sync_at
    await client.query(
      'UPDATE projects SET last_sync_at = NOW() WHERE id = $1',
      [id],
    );

    await client.query('COMMIT');

    res.json({
      message: 'File deleted successfully',
      file_path: fileCheck.rows[0].file_path,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  } finally {
    client.release();
  }
});

// ============================================================================
// AI BUILDER INTEGRATION ROUTES
// ============================================================================

// POST /api/projects/:id/sync-from-ai-builder - Sync project from AI Builder session
router.post('/:id/sync-from-ai-builder', requireAuth, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { id } = req.params;
    const { session_id, files, overwrite = false } = req.body;

    if (!session_id || !files) {
      return res.status(400).json({
        error: 'session_id and files are required',
      });
    }

    // Verify project access
    const projectAccess = await client.query(
      `
      SELECT p.id FROM projects p
      JOIN team_members tm ON p.team_id = tm.team_id
      WHERE p.id = $1 AND tm.user_id = $2
    `,
      [id, req.user.id],
    );

    if (projectAccess.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Verify AI Builder session belongs to user
    const sessionCheck = await client.query(
      'SELECT id FROM ai_builder_sessions WHERE id = $1 AND user_id = $2',
      [session_id, req.user.id],
    );

    if (sessionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'AI Builder session not found' });
    }

    const syncedFiles = [];
    const conflicts = [];

    for (const [filePath, fileContent] of Object.entries(files)) {
      const fileName = path.basename(filePath);
      const fileType = getFileType(fileName);
      const mimeType = getMimeType(fileName);
      const contentHash = calculateFileHash(fileContent);
      const fileSize = Buffer.byteLength(fileContent, 'utf8');
      const parentDirectory = path.dirname(filePath);

      // Check for existing file
      const existingFile = await client.query(
        'SELECT id, content_hash FROM project_files WHERE project_id = $1 AND file_path = $2',
        [id, filePath],
      );

      if (existingFile.rows.length > 0) {
        const existing = existingFile.rows[0];

        if (existing.content_hash !== contentHash) {
          if (overwrite) {
            // Update existing file
            await client.query(
              `
              UPDATE project_files SET
                content = $1, content_hash = $2, file_size = $3, version = version + 1,
                last_modified_by = $4, ai_builder_session_id = $5, 
                ai_generated = true, updated_at = NOW()
              WHERE id = $6
            `,
              [
                fileContent,
                contentHash,
                fileSize,
                req.user.id,
                session_id,
                existing.id,
              ],
            );

            syncedFiles.push({ file_path: filePath, action: 'updated' });
          } else {
            conflicts.push({
              file_path: filePath,
              reason: 'File exists with different content',
            });
          }
        } else {
          syncedFiles.push({ file_path: filePath, action: 'unchanged' });
        }
      } else {
        // Create new file
        await client.query(
          `
          INSERT INTO project_files (
            project_id, file_path, file_name, file_type, content,
            content_hash, file_size, mime_type, parent_directory,
            created_by, ai_generated, ai_builder_session_id
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `,
          [
            id,
            filePath,
            fileName,
            fileType,
            fileContent,
            contentHash,
            fileSize,
            mimeType,
            parentDirectory,
            req.user.id,
            true,
            session_id,
          ],
        );

        syncedFiles.push({ file_path: filePath, action: 'created' });
      }
    }

    // Update AI Builder session
    await client.query(
      `
      UPDATE ai_builder_sessions SET
        project_id = $1, export_status = 'exported', last_exported_at = NOW()
      WHERE id = $2
    `,
      [id, session_id],
    );

    // Update project
    await client.query(
      `
      UPDATE projects SET
        ai_builder_session_id = $1, last_sync_at = NOW(), source_type = 'ai-builder'
      WHERE id = $2
    `,
      [session_id, id],
    );

    // Log sync history
    await client.query(
      `
      INSERT INTO project_sync_history (
        project_id, sync_type, source_reference, 
        files_added, files_changed, initiated_by,
        sync_summary
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
      [
        id,
        'ai_builder_import',
        session_id,
        syncedFiles.filter((f) => f.action === 'created').length,
        syncedFiles.filter((f) => f.action === 'updated').length,
        req.user.id,
        JSON.stringify({ synced_files: syncedFiles, conflicts }),
      ],
    );

    await client.query('COMMIT');

    res.json({
      synced_files: syncedFiles,
      conflicts: conflicts,
      message: `Successfully synced ${syncedFiles.length} files from AI Builder`,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error syncing from AI Builder:', error);
    res.status(500).json({ error: 'Failed to sync from AI Builder' });
  } finally {
    client.release();
  }
});

// ============================================================================
// DEPLOYMENT ROUTES
// ============================================================================

// POST /api/projects/:id/deploy - Deploy a project
router.post('/:id/deploy', requireAuth, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { id } = req.params;
    const {
      type = 'preview',
      environment_variables = {},
      build_command,
      output_directory,
    } = req.body;

    // Verify project access
    const projectResult = await client.query(
      `
      SELECT p.* FROM projects p
      JOIN team_members tm ON p.team_id = tm.team_id
      WHERE p.id = $1 AND tm.user_id = $2
    `,
      [id, req.user.id],
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = projectResult.rows[0];

    // Get project files for deployment
    const filesResult = await client.query(
      'SELECT file_path, content, file_type FROM project_files WHERE project_id = $1',
      [id],
    );

    const fileSnapshot = {};
    filesResult.rows.forEach((file) => {
      fileSnapshot[file.file_path] = {
        content: file.content,
        type: file.file_type,
      };
    });

    // Create deployment record
    const deploymentResult = await client.query(
      `
      INSERT INTO deployments (
        project_id, name, status, type, source, creator_id,
        deployment_config, file_snapshot
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `,
      [
        id,
        `${project.name}-${type}-${Date.now()}`,
        'pending',
        type,
        'manual',
        req.user.id,
        JSON.stringify({
          build_command: build_command || project.build_command,
          output_directory: output_directory || project.output_directory,
          environment_variables,
        }),
        JSON.stringify(fileSnapshot),
      ],
    );

    const deployment = deploymentResult.rows[0];

    await client.query('COMMIT');

    // TODO: Trigger actual deployment process (integrate with your deployment system)
    // This could be a queue job, webhook, or direct API call to your deployment service

    res.status(201).json({
      deployment: deployment,
      message: 'Deployment initiated successfully',
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating deployment:', error);
    res.status(500).json({ error: 'Failed to create deployment' });
  } finally {
    client.release();
  }
});

// GET /api/projects/:id/deployments - Get project deployments
router.get('/:id/deployments', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, type } = req.query;

    let query = `
      SELECT d.*, u.username as creator_username
      FROM deployments d
      JOIN projects p ON d.project_id = p.id
      JOIN team_members tm ON p.team_id = tm.team_id
      LEFT JOIN users u ON d.creator_id = u.id
      WHERE d.project_id = $1 AND tm.user_id = $2
    `;

    const params = [id, req.user.id];
    let paramIndex = 3;

    if (status) {
      query += ` AND d.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (type) {
      query += ` AND d.type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    query += ` ORDER BY d.created_at DESC`;

    const result = await pool.query(query, params);

    res.json({
      deployments: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching deployments:', error);
    res.status(500).json({ error: 'Failed to fetch deployments' });
  }
});

module.exports = router;
