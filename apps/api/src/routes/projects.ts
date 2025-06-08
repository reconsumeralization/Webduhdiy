import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import path from 'path';
import { Pool } from 'pg';

const router = express.Router();

// Database connection
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || 'postgresql://localhost:5432/webduhvercel',
});

// Extended Request interface to include user
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username?: string;
  };
}

// Project interfaces
interface Project {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  repository?: string;
  framework: string;
  buildCommand: string;
  outputDirectory: string;
  installCommand: string;
  environmentVariables: Record<string, string>;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  teamId?: string;
}

interface ProjectFile {
  id: string;
  projectId: string;
  filePath: string;
  content: string;
  fileType: string;
  mimeType: string;
  fileHash: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Deployment {
  id: string;
  projectId: string;
  name: string;
  status: string;
  type: string;
  source: string;
  creatorId: string;
  deploymentConfig: Record<string, any>;
  fileSnapshot: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Middleware for authentication
const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // Implementation depends on your auth system
  // For now, assume user is available in req.user
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  next();
};

// Helper function to calculate file hash
const calculateFileHash = (content: string): string => {
  return crypto.createHash('sha256').update(content).digest('hex');
};

// Helper function to determine file type from extension
const getFileType = (filename: string): string => {
  const ext = path.extname(filename).toLowerCase();
  const typeMap: Record<string, string> = {
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
const getMimeType = (filename: string): string => {
  const ext = path.extname(filename).toLowerCase();
  const mimeMap: Record<string, string> = {
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
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = '10',
      search,
      status,
      framework,
      sortBy = 'updatedAt',
      sortOrder = 'desc',
    } = req.query;

    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

    let whereConditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (search) {
      whereConditions.push(`name ILIKE $${paramIndex}`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (status) {
      whereConditions.push(`status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    if (framework) {
      whereConditions.push(`framework = $${paramIndex}`);
      params.push(framework);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    const orderClause = `ORDER BY ${sortBy} ${sortOrder}`;

    const projectsQuery = `
      SELECT * FROM projects 
      ${whereClause} 
      ${orderClause} 
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    params.push(parseInt(limit as string), offset);
    
    const countQuery = `SELECT COUNT(*) FROM projects ${whereClause}`;
    const countParams = params.slice(0, -2); // Remove limit and offset from count params

    const [projectsResult, countResult] = await Promise.all([
      pool.query(projectsQuery, params),
      pool.query(countQuery, countParams)
    ]);

    const total = parseInt(countResult.rows[0].count);

    res.json({
      projects: projectsResult.rows,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get single project by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const projectResult = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);

    if (projectResult.rows.length === 0) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const project = projectResult.rows[0];

    // Get project deployments
    const deploymentsResult = await pool.query(
      'SELECT * FROM deployments WHERE project_id = $1 ORDER BY created_at DESC LIMIT 10',
      [id]
    );

    // Get project domains (if domains table exists)
    const domainsResult = await pool.query(
      'SELECT * FROM domains WHERE project_id = $1',
      [id]
    ).catch(() => ({ rows: [] })); // Handle if domains table doesn't exist

    res.json({
      ...project,
      deployments: deploymentsResult.rows,
      domains: domainsResult.rows,
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Create new project
router.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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
      res.status(400).json({ error: 'Project name is required' });
      return;
    }

    // Create project
    const result = await pool.query(
      `INSERT INTO projects (
        name, display_name, description, repository, framework, 
        build_command, output_directory, install_command, 
        environment_variables, status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()) 
      RETURNING *`,
      [
        name.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        name,
        description,
        repository,
        framework || 'static',
        buildCommand || 'npm run build',
        outputDirectory || 'build',
        installCommand || 'npm install',
        JSON.stringify(environmentVariables),
        'created',
      ]
    );

    const project = result.rows[0];

    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project
router.put('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      displayName,
      description,
      framework,
      buildCommand,
      outputDirectory,
      installCommand,
      environmentVariables,
    } = req.body;

    const result = await pool.query(
      `UPDATE projects SET 
        display_name = COALESCE($1, display_name),
        description = COALESCE($2, description),
        framework = COALESCE($3, framework),
        build_command = COALESCE($4, build_command),
        output_directory = COALESCE($5, output_directory),
        install_command = COALESCE($6, install_command),
        environment_variables = COALESCE($7, environment_variables),
        updated_at = NOW()
      WHERE id = $8 
      RETURNING *`,
      [
        displayName,
        description,
        framework,
        buildCommand,
        outputDirectory,
        installCommand,
        environmentVariables ? JSON.stringify(environmentVariables) : null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const { id } = req.params;

    // Delete related records first
    await client.query('DELETE FROM project_files WHERE project_id = $1', [id]);
    await client.query('DELETE FROM deployments WHERE project_id = $1', [id]);
    
    // Delete the project
    const result = await client.query('DELETE FROM projects WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    await client.query('COMMIT');
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  } finally {
    client.release();
  }
});

// Deploy a project
router.post('/:id/deploy', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { id } = req.params;
    const {
      type = 'preview',
      environmentVariables = {},
      buildCommand,
      outputDirectory,
    } = req.body;

    // Verify project exists
    const projectResult = await client.query('SELECT * FROM projects WHERE id = $1', [id]);

    if (projectResult.rows.length === 0) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const project = projectResult.rows[0];

    // Create deployment record
    const deploymentResult = await client.query(
      `INSERT INTO deployments (
        project_id, name, status, type, source, creator_id,
        deployment_config, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING *`,
      [
        id,
        `${project.name}-${type}-${Date.now()}`,
        'pending',
        type,
        'manual',
        req.user?.id,
        JSON.stringify({
          buildCommand: buildCommand || project.build_command,
          outputDirectory: outputDirectory || project.output_directory,
          environmentVariables,
        }),
      ]
    );

    const deployment = deploymentResult.rows[0];

    await client.query('COMMIT');

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

// Get project deployments
router.get('/:id/deployments', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, type } = req.query;

    let query = 'SELECT * FROM deployments WHERE project_id = $1';
    const params: any[] = [id];
    let paramIndex = 2;

    if (status) {
      query += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (type) {
      query += ` AND type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    query += ' ORDER BY created_at DESC';

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

export default router; 