const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || 'postgresql://localhost:5432/webduhvercel',
});

// Middleware for authentication
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// ============================================================================
// AI BUILDER SESSION ROUTES
// ============================================================================

// GET /api/ai-builder/sessions - List AI Builder sessions for user
router.get('/sessions', requireAuth, async (req, res) => {
  try {
    const { status, project_id } = req.query;

    let query = `
      SELECT s.*, p.name as project_name, 
        (SELECT COUNT(*) FROM ai_builder_messages m WHERE m.session_id = s.id) as message_count,
        (SELECT COUNT(*) FROM ai_builder_file_operations fo WHERE fo.session_id = s.id) as file_operation_count
      FROM ai_builder_sessions s
      LEFT JOIN projects p ON s.project_id = p.id
      WHERE s.user_id = $1
    `;

    const params = [req.user.id];
    let paramIndex = 2;

    if (status) {
      query += ` AND s.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (project_id) {
      query += ` AND s.project_id = $${paramIndex}`;
      params.push(project_id);
      paramIndex++;
    }

    query += ` ORDER BY s.updated_at DESC`;

    const result = await pool.query(query, params);

    res.json({
      sessions: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching AI Builder sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// POST /api/ai-builder/sessions - Create new AI Builder session
router.post('/sessions', requireAuth, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { title, description, llm_provider, llm_model, project_id } =
      req.body;

    if (!title || !llm_provider || !llm_model) {
      return res.status(400).json({
        error: 'Title, LLM provider, and model are required',
      });
    }

    // If project_id is provided, verify access
    if (project_id) {
      const projectAccess = await client.query(
        `
        SELECT p.id FROM projects p
        JOIN team_members tm ON p.team_id = tm.team_id
        WHERE p.id = $1 AND tm.user_id = $2
      `,
        [project_id, req.user.id],
      );

      if (projectAccess.rows.length === 0) {
        return res.status(403).json({ error: 'Project access denied' });
      }
    }

    const sessionResult = await client.query(
      `
      INSERT INTO ai_builder_sessions (
        user_id, project_id, title, description, 
        llm_provider, llm_model, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `,
      [
        req.user.id,
        project_id,
        title,
        description,
        llm_provider,
        llm_model,
        'active',
      ],
    );

    await client.query('COMMIT');

    res.status(201).json({
      session: sessionResult.rows[0],
      message: 'AI Builder session created successfully',
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating AI Builder session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  } finally {
    client.release();
  }
});

// GET /api/ai-builder/sessions/:id - Get specific session with files
router.get('/sessions/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Get session details
    const sessionResult = await pool.query(
      `
      SELECT s.*, p.name as project_name
      FROM ai_builder_sessions s
      LEFT JOIN projects p ON s.project_id = p.id
      WHERE s.id = $1 AND s.user_id = $2
    `,
      [id, req.user.id],
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const session = sessionResult.rows[0];

    // Get messages
    const messagesResult = await pool.query(
      `
      SELECT * FROM ai_builder_messages 
      WHERE session_id = $1 
      ORDER BY created_at ASC
    `,
      [id],
    );

    // Get file operations
    const fileOpsResult = await pool.query(
      `
      SELECT * FROM ai_builder_file_operations 
      WHERE session_id = $1 
      ORDER BY created_at ASC
    `,
      [id],
    );

    session.messages = messagesResult.rows;
    session.file_operations = fileOpsResult.rows;

    res.json({ session });
  } catch (error) {
    console.error('Error fetching AI Builder session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// PUT /api/ai-builder/sessions/:id - Update session
router.put('/sessions/:id', requireAuth, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { id } = req.params;
    const {
      title,
      description,
      status,
      generated_files,
      file_structure,
      export_status,
    } = req.body;

    const updateResult = await client.query(
      `
      UPDATE ai_builder_sessions SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        status = COALESCE($3, status),
        generated_files = COALESCE($4, generated_files),
        file_structure = COALESCE($5, file_structure),
        export_status = COALESCE($6, export_status),
        updated_at = NOW()
      WHERE id = $7 AND user_id = $8
      RETURNING *
    `,
      [
        title,
        description,
        status,
        generated_files ? JSON.stringify(generated_files) : null,
        file_structure ? JSON.stringify(file_structure) : null,
        export_status,
        id,
        req.user.id,
      ],
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    await client.query('COMMIT');

    res.json({
      session: updateResult.rows[0],
      message: 'Session updated successfully',
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating AI Builder session:', error);
    res.status(500).json({ error: 'Failed to update session' });
  } finally {
    client.release();
  }
});

// ============================================================================
// FILE OPERATIONS ROUTES
// ============================================================================

// POST /api/ai-builder/sessions/:id/file-operations - Log file operations
router.post('/sessions/:id/file-operations', requireAuth, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { id } = req.params;
    const { operations } = req.body;

    if (!operations || !Array.isArray(operations)) {
      return res.status(400).json({ error: 'Operations array is required' });
    }

    // Verify session ownership
    const sessionCheck = await client.query(
      'SELECT id FROM ai_builder_sessions WHERE id = $1 AND user_id = $2',
      [id, req.user.id],
    );

    if (sessionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const loggedOperations = [];

    for (const op of operations) {
      const {
        operation_type,
        file_path,
        old_file_path,
        file_content,
        content_diff,
        message_id,
      } = op;

      if (!operation_type || !file_path) {
        continue;
      }

      const result = await client.query(
        `
        INSERT INTO ai_builder_file_operations (
          session_id, message_id, operation_type, file_path,
          old_file_path, file_content, content_diff
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `,
        [
          id,
          message_id,
          operation_type,
          file_path,
          old_file_path,
          file_content,
          content_diff,
        ],
      );

      loggedOperations.push(result.rows[0]);
    }

    await client.query('COMMIT');

    res.status(201).json({
      operations: loggedOperations,
      message: `Logged ${loggedOperations.length} file operations`,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error logging file operations:', error);
    res.status(500).json({ error: 'Failed to log file operations' });
  } finally {
    client.release();
  }
});

// ============================================================================
// PROJECT INTEGRATION ROUTES
// ============================================================================

// POST /api/ai-builder/sessions/:id/export-to-project - Export session to project
router.post(
  '/sessions/:id/export-to-project',
  requireAuth,
  async (req, res) => {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const { id } = req.params;
      const {
        project_id,
        create_new_project = false,
        project_name,
        project_description,
        framework,
        team_id,
      } = req.body;

      // Get session with generated files
      const sessionResult = await client.query(
        `
      SELECT * FROM ai_builder_sessions 
      WHERE id = $1 AND user_id = $2
    `,
        [id, req.user.id],
      );

      if (sessionResult.rows.length === 0) {
        return res.status(404).json({ error: 'Session not found' });
      }

      const session = sessionResult.rows[0];
      let targetProjectId = project_id;

      // Create new project if requested
      if (create_new_project) {
        if (!project_name || !team_id) {
          return res.status(400).json({
            error: 'Project name and team_id required for new project',
          });
        }

        // Verify team access
        const teamAccess = await client.query(
          'SELECT role FROM team_members WHERE team_id = $1 AND user_id = $2',
          [team_id, req.user.id],
        );

        if (teamAccess.rows.length === 0) {
          return res.status(403).json({ error: 'Team access denied' });
        }

        // Generate unique slug
        const slug = project_name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .substring(0, 50);

        const projectResult = await client.query(
          `
        INSERT INTO projects (
          name, slug, description, framework, team_id, created_by,
          source_type, ai_builder_session_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `,
          [
            project_name,
            slug,
            project_description,
            framework,
            team_id,
            req.user.id,
            'ai-builder',
            id,
          ],
        );

        targetProjectId = projectResult.rows[0].id;
      } else {
        // Verify existing project access
        const projectAccess = await client.query(
          `
        SELECT p.id FROM projects p
        JOIN team_members tm ON p.team_id = tm.team_id
        WHERE p.id = $1 AND tm.user_id = $2
      `,
          [project_id, req.user.id],
        );

        if (projectAccess.rows.length === 0) {
          return res.status(403).json({ error: 'Project access denied' });
        }
      }

      // Export files to project
      const generatedFiles = session.generated_files || {};
      const exportedFiles = [];

      for (const [filePath, fileContent] of Object.entries(generatedFiles)) {
        // Here you would call the project files API
        // For now, we'll simulate the file creation
        exportedFiles.push({
          file_path: filePath,
          action: 'exported',
        });
      }

      // Update session
      await client.query(
        `
      UPDATE ai_builder_sessions SET
        project_id = $1, export_status = 'exported', 
        last_exported_at = NOW(), updated_at = NOW()
      WHERE id = $2
    `,
        [targetProjectId, id],
      );

      // Log sync history
      await client.query(
        `
      INSERT INTO project_sync_history (
        project_id, sync_type, source_reference, 
        files_added, initiated_by
      ) VALUES ($1, $2, $3, $4, $5)
    `,
        [
          targetProjectId,
          'ai_builder_export',
          id,
          exportedFiles.length,
          req.user.id,
        ],
      );

      await client.query('COMMIT');

      res.json({
        project_id: targetProjectId,
        exported_files: exportedFiles,
        message: `Successfully exported ${exportedFiles.length} files to project`,
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error exporting to project:', error);
      res.status(500).json({ error: 'Failed to export to project' });
    } finally {
      client.release();
    }
  },
);

// GET /api/ai-builder/project-files/:project_id - Get project files for AI Builder
router.get('/project-files/:project_id', requireAuth, async (req, res) => {
  try {
    const { project_id } = req.params;

    // Verify project access
    const projectAccess = await pool.query(
      `
      SELECT p.id, p.name FROM projects p
      JOIN team_members tm ON p.team_id = tm.team_id
      WHERE p.id = $1 AND tm.user_id = $2
    `,
      [project_id, req.user.id],
    );

    if (projectAccess.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get project files
    const filesResult = await pool.query(
      `
      SELECT file_path, file_name, file_type, content, file_size, ai_generated
      FROM project_files 
      WHERE project_id = $1 
      ORDER BY file_path
    `,
      [project_id],
    );

    // Format for AI Builder
    const files = {};
    filesResult.rows.forEach((file) => {
      files[file.file_path] = {
        content: file.content,
        type: file.file_type,
        size: file.file_size,
        ai_generated: file.ai_generated,
      };
    });

    res.json({
      project: projectAccess.rows[0],
      files: files,
      total_files: filesResult.rows.length,
    });
  } catch (error) {
    console.error('Error fetching project files for AI Builder:', error);
    res.status(500).json({ error: 'Failed to fetch project files' });
  }
});

// POST /api/ai-builder/import-from-project - Create AI Builder session from project
router.post('/import-from-project', requireAuth, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { project_id, title, description, llm_provider, llm_model } =
      req.body;

    if (!project_id || !title || !llm_provider || !llm_model) {
      return res.status(400).json({
        error: 'Project ID, title, LLM provider and model are required',
      });
    }

    // Verify project access
    const projectResult = await client.query(
      `
      SELECT p.* FROM projects p
      JOIN team_members tm ON p.team_id = tm.team_id
      WHERE p.id = $1 AND tm.user_id = $2
    `,
      [project_id, req.user.id],
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = projectResult.rows[0];

    // Get project files
    const filesResult = await client.query(
      `
      SELECT file_path, content, file_type FROM project_files 
      WHERE project_id = $1
    `,
      [project_id],
    );

    const generatedFiles = {};
    const fileStructure = {};

    filesResult.rows.forEach((file) => {
      generatedFiles[file.file_path] = file.content;
      fileStructure[file.file_path] = {
        type: file.file_type,
        size: Buffer.byteLength(file.content || '', 'utf8'),
      };
    });

    // Create AI Builder session
    const sessionResult = await client.query(
      `
      INSERT INTO ai_builder_sessions (
        user_id, project_id, title, description, 
        llm_provider, llm_model, status,
        generated_files, file_structure, export_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `,
      [
        req.user.id,
        project_id,
        title,
        description,
        llm_provider,
        llm_model,
        'active',
        JSON.stringify(generatedFiles),
        JSON.stringify(fileStructure),
        'imported',
      ],
    );

    await client.query('COMMIT');

    res.status(201).json({
      session: sessionResult.rows[0],
      files_imported: filesResult.rows.length,
      message: 'Successfully imported project into AI Builder',
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error importing from project:', error);
    res.status(500).json({ error: 'Failed to import from project' });
  } finally {
    client.release();
  }
});

// ============================================================================
// SYNC STATUS ROUTES
// ============================================================================

// GET /api/ai-builder/sync-status/:project_id - Get sync status between project and AI Builder
router.get('/sync-status/:project_id', requireAuth, async (req, res) => {
  try {
    const { project_id } = req.params;

    // Get project with AI Builder session
    const projectResult = await pool.query(
      `
      SELECT p.*, s.id as session_id, s.status as session_status,
             s.last_exported_at, s.export_status
      FROM projects p
      LEFT JOIN ai_builder_sessions s ON p.ai_builder_session_id = s.id
      JOIN team_members tm ON p.team_id = tm.team_id
      WHERE p.id = $1 AND tm.user_id = $2
    `,
      [project_id, req.user.id],
    );

    if (projectResult.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = projectResult.rows[0];

    // Get sync history
    const syncHistory = await pool.query(
      `
      SELECT * FROM project_sync_history 
      WHERE project_id = $1 
      ORDER BY created_at DESC 
      LIMIT 10
    `,
      [project_id],
    );

    res.json({
      project: {
        id: project.id,
        name: project.name,
        last_sync_at: project.last_sync_at,
        ai_builder_session_id: project.session_id,
        session_status: project.session_status,
        last_exported_at: project.last_exported_at,
        export_status: project.export_status,
      },
      sync_history: syncHistory.rows,
      has_ai_builder_session: !!project.session_id,
    });
  } catch (error) {
    console.error('Error fetching sync status:', error);
    res.status(500).json({ error: 'Failed to fetch sync status' });
  }
});

module.exports = router;
