import express from 'express';
import multer from 'multer';
import { WebSocket } from 'ws';
import DeploymentService, {
  DeploymentConfig,
} from '../services/DeploymentService.js';
import { z } from 'zod';

const router = express.Router();
const deploymentService = new DeploymentService();

// Simple auth middleware placeholder - replace with actual implementation
const authenticateToken = (req: any, res: any, next: any) => {
  // TODO: Implement actual authentication
  req.user = { id: 'user-1', teamId: 'team-1' };
  next();
};

// Simple validation middleware
const validateInput = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error,
      });
    }
  };
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || '/tmp/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow zip files and common web files
    const allowedTypes = [
      'application/zip',
      'application/x-zip-compressed',
      'application/octet-stream',
    ];

    if (
      allowedTypes.includes(file.mimetype) ||
      file.originalname.endsWith('.zip')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only ZIP files are allowed for uploads'));
    }
  },
});

// Validation schemas
const createDeploymentSchema = z.object({
  projectId: z.string().uuid(),
  sourceType: z.enum(['git', 'upload', 'template']),
  sourceUrl: z.string().url().optional(),
  branch: z.string().default('main'),
  buildCommand: z.string().optional(),
  outputDirectory: z.string().default('dist'),
  environment: z
    .enum(['production', 'preview', 'development'])
    .default('preview'),
  environmentVariables: z.record(z.string()).optional(),
  regions: z.array(z.string()).optional(),
  customDomain: z.string().optional(),
  edgeFunctions: z
    .array(
      z.object({
        name: z.string(),
        path: z.string(),
        runtime: z.enum(['nodejs18', 'nodejs20', 'deno', 'python3.11']),
        memory: z.number().optional(),
        timeout: z.number().optional(),
      }),
    )
    .optional(),
});

const deployFromTemplateSchema = z.object({
  templateId: z.string(),
  projectName: z.string().min(1).max(100),
  environment: z
    .enum(['production', 'preview', 'development'])
    .default('preview'),
  environmentVariables: z.record(z.string()).optional(),
});

// WebSocket connections for real-time deployment logs
const deploymentConnections = new Map<string, WebSocket[]>();

// Real-time deployment updates via WebSocket
export function setupDeploymentWebSocket(wss: any) {
  deploymentService.on('deployment:created', ({ deploymentId, config }) => {
    broadcastToDeployment(deploymentId, {
      type: 'deployment:created',
      data: { deploymentId, config },
    });
  });

  deploymentService.on(
    'deployment:progress',
    ({ deploymentId, status, progress }) => {
      broadcastToDeployment(deploymentId, {
        type: 'deployment:progress',
        data: { deploymentId, status, progress },
      });
    },
  );

  deploymentService.on('deployment:log', ({ deploymentId, log }) => {
    broadcastToDeployment(deploymentId, {
      type: 'deployment:log',
      data: { deploymentId, log },
    });
  });

  deploymentService.on('deployment:completed', ({ deploymentId, urls }) => {
    broadcastToDeployment(deploymentId, {
      type: 'deployment:completed',
      data: { deploymentId, urls },
    });
  });

  deploymentService.on('deployment:failed', ({ deploymentId, error }) => {
    broadcastToDeployment(deploymentId, {
      type: 'deployment:failed',
      data: { deploymentId, error },
    });
  });
}

function broadcastToDeployment(deploymentId: string, message: any) {
  const connections = deploymentConnections.get(deploymentId) || [];
  connections.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  });
}

// WebSocket subscription endpoint - to be handled by WebSocket server setup
export function handleDeploymentSubscription(
  ws: WebSocket,
  deploymentId: string,
) {
  if (!deploymentConnections.has(deploymentId)) {
    deploymentConnections.set(deploymentId, []);
  }

  deploymentConnections.get(deploymentId)!.push(ws);

  ws.on('close', () => {
    const connections = deploymentConnections.get(deploymentId) || [];
    const index = connections.indexOf(ws);
    if (index > -1) {
      connections.splice(index, 1);
    }
  });

  // Send current status immediately
  deploymentService.getDeploymentStatus(deploymentId).then((status) => {
    if (status) {
      ws.send(
        JSON.stringify({
          type: 'deployment:status',
          data: status,
        }),
      );
    }
  });
}

// Create new deployment from Git repository
router.post(
  '/deployments',
  authenticateToken,
  validateInput(createDeploymentSchema),
  async (req, res) => {
    try {
      const { user } = req as any;
      const deploymentConfig: DeploymentConfig = {
        ...req.body,
        userId: user.id,
        teamId: user.teamId || user.id, // Fallback to user ID if no team
      };

      const deploymentId =
        await deploymentService.initializeDeployment(deploymentConfig);

      return res.status(201).json({
        success: true,
        data: {
          deploymentId,
          message: 'Deployment started successfully',
        },
      });
    } catch (error) {
      console.error('Deployment creation error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to start deployment',
      });
    }
  },
);

// Upload and deploy files
router.post(
  '/deployments/upload',
  authenticateToken,
  upload.single('file'),
  async (req, res) => {
    try {
      const { user } = req as any;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded',
        });
      }

      const deploymentConfig: DeploymentConfig = {
        projectId: req.body.projectId || `upload-${Date.now()}`,
        userId: user.id,
        teamId: user.teamId || user.id,
        sourceType: 'upload',
        environment: req.body.environment || 'preview',
        buildCommand: req.body.buildCommand,
        outputDirectory: req.body.outputDirectory || 'dist',
        environmentVariables: req.body.environmentVariables
          ? JSON.parse(req.body.environmentVariables)
          : undefined,
      };

      const deploymentId =
        await deploymentService.initializeDeployment(deploymentConfig);

      return res.status(201).json({
        success: true,
        data: {
          deploymentId,
          fileName: file.originalname,
          message: 'File uploaded and deployment started',
        },
      });
    } catch (error) {
      console.error('Upload deployment error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to process upload and start deployment',
      });
    }
  },
);

// Deploy from template
router.post(
  '/deployments/template',
  authenticateToken,
  validateInput(deployFromTemplateSchema),
  async (req, res) => {
    try {
      const { user } = req as any;
      const { templateId, projectName, environment, environmentVariables } =
        req.body;

      const deploymentConfig: DeploymentConfig = {
        projectId: `template-${templateId}-${Date.now()}`,
        userId: user.id,
        teamId: user.teamId || user.id,
        sourceType: 'template',
        environment,
        environmentVariables,
        buildCommand: 'npm run build', // Default for templates
        outputDirectory: 'dist',
      };

      const deploymentId =
        await deploymentService.initializeDeployment(deploymentConfig);

      return res.status(201).json({
        success: true,
        data: {
          deploymentId,
          projectName,
          templateId,
          message: 'Template deployment started',
        },
      });
    } catch (error) {
      console.error('Template deployment error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to start template deployment',
      });
    }
  },
);

// Get deployment status
router.get(
  '/deployments/:deploymentId',
  authenticateToken,
  async (req, res) => {
    try {
      const { deploymentId } = req.params;
      const deployment =
        await deploymentService.getDeploymentStatus(deploymentId);

      if (!deployment) {
        return res.status(404).json({
          success: false,
          error: 'Deployment not found',
        });
      }

      return res.json({
        success: true,
        data: deployment,
      });
    } catch (error) {
      console.error('Get deployment status error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to get deployment status',
      });
    }
  },
);

// Get deployment logs
router.get(
  '/deployments/:deploymentId/logs',
  authenticateToken,
  async (req, res) => {
    try {
      const { deploymentId } = req.params;
      const deployment =
        await deploymentService.getDeploymentStatus(deploymentId);

      if (!deployment) {
        return res.status(404).json({
          success: false,
          error: 'Deployment not found',
        });
      }

      const { since } = req.query;
      let logs = deployment.logs;

      if (since) {
        const sinceDate = new Date(since as string);
        logs = logs.filter((log) => log.timestamp > sinceDate);
      }

      return res.json({
        success: true,
        data: {
          deploymentId,
          logs,
          total: logs.length,
        },
      });
    } catch (error) {
      console.error('Get deployment logs error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to get deployment logs',
      });
    }
  },
);

// Cancel deployment
router.post(
  '/deployments/:deploymentId/cancel',
  authenticateToken,
  async (req, res) => {
    try {
      const { deploymentId } = req.params;
      const cancelled = await deploymentService.cancelDeployment(deploymentId);

      if (!cancelled) {
        return res.status(404).json({
          success: false,
          error: 'Deployment not found or cannot be cancelled',
        });
      }

      return res.json({
        success: true,
        data: {
          deploymentId,
          message: 'Deployment cancelled successfully',
        },
      });
    } catch (error) {
      console.error('Cancel deployment error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to cancel deployment',
      });
    }
  },
);

// List project deployments
router.get(
  '/projects/:projectId/deployments',
  authenticateToken,
  async (req, res) => {
    try {
      const { projectId } = req.params;
      const { limit = '20', offset = '0' } = req.query;

      const deployments =
        await deploymentService.getProjectDeployments(projectId);

      // Apply pagination
      const start = parseInt(offset as string);
      const end = start + parseInt(limit as string);
      const paginatedDeployments = deployments.slice(start, end);

      return res.json({
        success: true,
        data: {
          deployments: paginatedDeployments,
          total: deployments.length,
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
        },
      });
    } catch (error) {
      console.error('List project deployments error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to list project deployments',
      });
    }
  },
);

// Serve static files from deployment
router.get('/deployments/:deploymentId/files/*', async (req, res) => {
  try {
    const { deploymentId } = req.params;
    const filePath = (req.params as any)[0] as string;

    const fileBuffer = await deploymentService.serveStaticFile(
      deploymentId,
      filePath,
    );

    if (!fileBuffer) {
      return res.status(404).json({
        success: false,
        error: 'File not found',
      });
    }

    // Set appropriate content type based on file extension
    const ext = filePath.split('.').pop()?.toLowerCase();
    const contentTypes: Record<string, string> = {
      html: 'text/html',
      css: 'text/css',
      js: 'application/javascript',
      json: 'application/json',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      gif: 'image/gif',
      svg: 'image/svg+xml',
      ico: 'image/x-icon',
    };

    if (ext && contentTypes[ext]) {
      res.setHeader('Content-Type', contentTypes[ext]);
    }

    return res.send(fileBuffer);
  } catch (error) {
    console.error('Serve static file error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to serve file',
    });
  }
});

// Get available templates
router.get('/templates', authenticateToken, async (req, res) => {
  try {
    // This would come from a database or file system
    const templates = [
      {
        id: 'nextjs-starter',
        name: 'Next.js Starter',
        description:
          'A modern Next.js application with TypeScript and Tailwind CSS',
        category: 'React',
        preview: 'https://nextjs-starter-preview.webduhvercel.app',
        buildCommand: 'npm run build',
        outputDirectory: '.next',
      },
      {
        id: 'vue-spa',
        name: 'Vue.js SPA',
        description: 'Single Page Application with Vue 3 and Vite',
        category: 'Vue',
        preview: 'https://vue-spa-preview.webduhvercel.app',
        buildCommand: 'npm run build',
        outputDirectory: 'dist',
      },
      {
        id: 'static-site',
        name: 'Static HTML Site',
        description: 'Simple HTML, CSS, and JavaScript static site',
        category: 'Static',
        preview: 'https://static-site-preview.webduhvercel.app',
        buildCommand: null,
        outputDirectory: '.',
      },
      {
        id: 'express-api',
        name: 'Express.js API',
        description: 'RESTful API with Express.js and TypeScript',
        category: 'Node.js',
        preview: null,
        buildCommand: 'npm run build',
        outputDirectory: 'dist',
      },
    ];

    return res.json({
      success: true,
      data: {
        templates,
        total: templates.length,
      },
    });
  } catch (error) {
    console.error('Get templates error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get templates',
    });
  }
});

// Health check for deployment service
router.get('/health', async (req, res) => {
  try {
    return res.json({
      success: true,
      data: {
        service: 'deployment',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Service unhealthy',
    });
  }
});

export default router;
