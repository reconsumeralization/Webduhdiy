const express = require('express');
const router = express.Router();
const DatabaseService = require('../services/DatabaseService');
const DeploymentEngine = require('../services/DeploymentEngine');
const WebSocketService = require('../services/WebSocketService');

// Get all deployments with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      projectId,
      status,
      environment,
      fromDate,
      toDate,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const offset = (page - 1) * limit;

    let whereClause = {};
    if (projectId) {
      whereClause.projectId = projectId;
    }
    if (status) {
      whereClause.status = status;
    }
    if (environment) {
      whereClause.environment = environment;
    }
    if (fromDate) {
      whereClause.createdAt = {
        ...whereClause.createdAt,
        $gte: new Date(fromDate),
      };
    }
    if (toDate) {
      whereClause.createdAt = {
        ...whereClause.createdAt,
        $lte: new Date(toDate),
      };
    }

    const deployments = await DatabaseService.findMany('deployments', {
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      orderBy: { [sortBy]: sortOrder },
      include: ['project'],
    });

    const total = await DatabaseService.count('deployments', whereClause);

    res.json({
      deployments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching deployments:', error);
    res.status(500).json({ error: 'Failed to fetch deployments' });
  }
});

// Get single deployment by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deployment = await DatabaseService.findById('deployments', id, {
      include: ['project'],
    });

    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' });
    }

    res.json(deployment);
  } catch (error) {
    console.error('Error fetching deployment:', error);
    res.status(500).json({ error: 'Failed to fetch deployment' });
  }
});

// Create new deployment
router.post('/', async (req, res) => {
  try {
    const {
      projectId,
      branch = 'main',
      commitSha,
      environment = 'production',
      environmentVariables = {},
      deploymentType = 'git',
    } = req.body;

    // Validate required fields
    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    // Get project
    const project = await DatabaseService.findById('projects', projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Create deployment record
    const deployment = await DatabaseService.create('deployments', {
      projectId,
      branch,
      commitSha,
      environment,
      status: 'queued',
      deploymentType,
      environmentVariables: {
        ...project.environmentVariables,
        ...environmentVariables,
      },
      buildSettings: {
        buildCommand: project.buildCommand,
        outputDirectory: project.outputDirectory,
        installCommand: project.installCommand,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Start deployment process
    DeploymentEngine.deploy(deployment)
      .then(async (result) => {
        await DatabaseService.update('deployments', deployment.id, {
          status: result.status,
          url: result.url,
          buildDuration: result.buildDuration,
          size: result.size,
          completedAt: new Date(),
          updatedAt: new Date(),
        });

        // Notify via WebSocket
        WebSocketService.broadcastToProject(projectId, {
          type: 'deployment_completed',
          deployment: { ...deployment, ...result },
        });
      })
      .catch(async (error) => {
        console.error('Deployment failed:', error);
        await DatabaseService.update('deployments', deployment.id, {
          status: 'failed',
          error: error.message,
          completedAt: new Date(),
          updatedAt: new Date(),
        });

        // Notify via WebSocket
        WebSocketService.broadcastToProject(projectId, {
          type: 'deployment_failed',
          deployment: { ...deployment, error: error.message },
        });
      });

    res.status(201).json(deployment);
  } catch (error) {
    console.error('Error creating deployment:', error);
    res.status(500).json({ error: 'Failed to create deployment' });
  }
});

// Cancel deployment
router.post('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;

    const deployment = await DatabaseService.findById('deployments', id);
    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' });
    }

    if (!['queued', 'building'].includes(deployment.status)) {
      return res.status(400).json({ error: 'Deployment cannot be cancelled' });
    }

    // Cancel the deployment
    await DeploymentEngine.cancel(id);

    const updatedDeployment = await DatabaseService.update('deployments', id, {
      status: 'cancelled',
      completedAt: new Date(),
      updatedAt: new Date(),
    });

    // Notify via WebSocket
    WebSocketService.broadcastToProject(deployment.projectId, {
      type: 'deployment_cancelled',
      deployment: updatedDeployment,
    });

    res.json(updatedDeployment);
  } catch (error) {
    console.error('Error cancelling deployment:', error);
    res.status(500).json({ error: 'Failed to cancel deployment' });
  }
});

// Rollback to deployment
router.post('/:id/rollback', async (req, res) => {
  try {
    const { id } = req.params;

    const deployment = await DatabaseService.findById('deployments', id, {
      include: ['project'],
    });

    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' });
    }

    if (deployment.status !== 'deployed') {
      return res
        .status(400)
        .json({ error: 'Can only rollback to successful deployments' });
    }

    // Create rollback deployment
    const rollbackDeployment = await DatabaseService.create('deployments', {
      projectId: deployment.projectId,
      branch: deployment.branch,
      commitSha: deployment.commitSha,
      environment: deployment.environment,
      status: 'queued',
      deploymentType: 'rollback',
      rollbackFrom: id,
      environmentVariables: deployment.environmentVariables,
      buildSettings: deployment.buildSettings,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Start rollback process
    DeploymentEngine.rollback(deployment, rollbackDeployment)
      .then(async (result) => {
        await DatabaseService.update('deployments', rollbackDeployment.id, {
          status: result.status,
          url: result.url,
          buildDuration: result.buildDuration,
          completedAt: new Date(),
          updatedAt: new Date(),
        });

        // Notify via WebSocket
        WebSocketService.broadcastToProject(deployment.projectId, {
          type: 'rollback_completed',
          deployment: { ...rollbackDeployment, ...result },
        });
      })
      .catch(async (error) => {
        console.error('Rollback failed:', error);
        await DatabaseService.update('deployments', rollbackDeployment.id, {
          status: 'failed',
          error: error.message,
          completedAt: new Date(),
          updatedAt: new Date(),
        });
      });

    res.status(201).json(rollbackDeployment);
  } catch (error) {
    console.error('Error rolling back deployment:', error);
    res.status(500).json({ error: 'Failed to rollback deployment' });
  }
});

// Get deployment logs
router.get('/:id/logs', async (req, res) => {
  try {
    const { id } = req.params;
    const { follow = false } = req.query;

    const deployment = await DatabaseService.findById('deployments', id);
    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' });
    }

    if (follow === 'true') {
      // Stream logs via Server-Sent Events
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      });

      const logStream = DeploymentEngine.getLogStream(id);

      logStream.on('data', (chunk) => {
        res.write(
          `data: ${JSON.stringify({ type: 'log', data: chunk.toString() })}\n\n`,
        );
      });

      logStream.on('end', () => {
        res.write(`data: ${JSON.stringify({ type: 'end' })}\n\n`);
        res.end();
      });

      logStream.on('error', (error) => {
        res.write(
          `data: ${JSON.stringify({ type: 'error', data: error.message })}\n\n`,
        );
        res.end();
      });

      req.on('close', () => {
        logStream.destroy();
      });
    } else {
      // Get static logs
      const logs = await DeploymentEngine.getLogs(id);
      res.json({ logs });
    }
  } catch (error) {
    console.error('Error fetching deployment logs:', error);
    res.status(500).json({ error: 'Failed to fetch deployment logs' });
  }
});

// Get deployment analytics
router.get('/:id/analytics', async (req, res) => {
  try {
    const { id } = req.params;

    const deployment = await DatabaseService.findById('deployments', id);
    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' });
    }

    // Get analytics data
    const analytics = await DeploymentEngine.getAnalytics(id);

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching deployment analytics:', error);
    res.status(500).json({ error: 'Failed to fetch deployment analytics' });
  }
});

// Get deployment preview
router.get('/:id/preview', async (req, res) => {
  try {
    const { id } = req.params;

    const deployment = await DatabaseService.findById('deployments', id);
    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' });
    }

    const previewUrl = await DeploymentEngine.getPreviewUrl(id);

    res.json({ previewUrl });
  } catch (error) {
    console.error('Error fetching deployment preview:', error);
    res.status(500).json({ error: 'Failed to fetch deployment preview' });
  }
});

// Update deployment
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove non-updatable fields
    delete updates.id;
    delete updates.createdAt;
    delete updates.projectId;
    updates.updatedAt = new Date();

    const deployment = await DatabaseService.update('deployments', id, updates);

    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' });
    }

    res.json(deployment);
  } catch (error) {
    console.error('Error updating deployment:', error);
    res.status(500).json({ error: 'Failed to update deployment' });
  }
});

// Delete deployment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deployment = await DatabaseService.findById('deployments', id);
    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' });
    }

    // Cannot delete active deployments
    if (deployment.status === 'building') {
      return res.status(400).json({ error: 'Cannot delete active deployment' });
    }

    // Delete deployment resources
    await DeploymentEngine.cleanup(id);

    // Delete deployment record
    await DatabaseService.delete('deployments', id);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting deployment:', error);
    res.status(500).json({ error: 'Failed to delete deployment' });
  }
});

module.exports = router;
