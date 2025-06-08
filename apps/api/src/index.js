const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const { createServer } = require('http');
const WebSocket = require('ws');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const deploymentRoutes = require('./routes/deployments');
const webhookRoutes = require('./routes/webhooks');
const analyticsRoutes = require('./routes/analytics');
const organizationRoutes = require('./routes/organizations');
const environmentRoutes = require('./routes/environment');
const templateRoutes = require('./routes/templates');
const githubRoutes = require('./routes/github');

// Import middleware
const authMiddleware = require('./middleware/auth');
const {
  errorHandler,
  notFoundHandler,
  healthCheck,
} = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

// Import services
const DatabaseService = require('./services/DatabaseService');
const MockDatabaseService = require('./services/MockDatabaseService');
const RedisService = require('./services/RedisService');
const DockerService = require('./services/DockerService');
const KubernetesService = require('./services/KubernetesService');
const DeploymentEngine = require('./services/DeploymentEngine');
const MetricsService = require('./services/MetricsService');
const WebSocketService = require('./services/WebSocketService');
const TemplateService = require('./services/TemplateService');
const GitHubService = require('./services/GitHubService');

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3001;

// Initialize services
const dbService = new DatabaseService();
const redisService = new RedisService();
const dockerService = new DockerService();
const k8sService = new KubernetesService();
const deploymentEngine = new DeploymentEngine(dockerService, k8sService);
const metricsService = new MetricsService();
const wsService = new WebSocketService(server);
const templateService = new TemplateService(dbService, redisService);
const githubService = new GitHubService();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  }),
);

// Basic middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://webduh.vercel.app', 'https://*.webduh.io']
        : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  }),
);

app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting
app.use('/api/', rateLimiter);

// Metrics endpoint (before auth)
app.use('/metrics', metricsService.getMetricsHandler());

// Health check (no auth required)
app.get('/health', healthCheck);
app.get('/api/health', healthCheck);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', authMiddleware, projectRoutes);
app.use('/api/projects', authMiddleware, environmentRoutes); // Environment variables
app.use('/api/deployments', authMiddleware, deploymentRoutes);
app.use('/api/webhooks', webhookRoutes); // No auth for webhooks
app.use('/api/analytics', authMiddleware, analyticsRoutes);
app.use('/api/organizations', authMiddleware, organizationRoutes);
app.use('/api/templates', templateRoutes); // Templates (some public endpoints)
app.use('/api/github', githubRoutes); // GitHub integration

// WebSocket setup for real-time updates
wsService.initialize();

// Make services available to routes
app.locals.services = {
  db: dbService,
  redis: redisService,
  docker: dockerService,
  k8s: k8sService,
  deployment: deploymentEngine,
  metrics: metricsService,
  websocket: wsService,
  templates: null, // Will be initialized after DB
  github: null, // Will be initialized after DB
};

// 404 handler
app.use(notFoundHandler);

// Error handling
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');

  server.close(async () => {
    try {
      await dbService.close();
      await redisService.close();
      await dockerService.close();
      console.log('All services closed, exiting process');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  });
});

// Start server
async function startServer() {
  try {
    // Initialize database (fallback to mock if PostgreSQL not available)
    try {
      await dbService.initialize();
      console.log('✅ PostgreSQL Database connected');
    } catch (error) {
      console.warn(
        '⚠️  PostgreSQL not available, using mock database:',
        error.message,
      );
      // Replace with mock service
      const mockDb = new MockDatabaseService();
      await mockDb.initialize();
      app.locals.services.db = mockDb;
      console.log('✅ Mock Database initialized for development');
    }

    // Initialize template and GitHub services after database
    const templateService = new TemplateService(
      app.locals.services.db,
      redisService,
    );
    const githubService = new GitHubService();

    app.locals.services.templates = templateService;
    app.locals.services.github = githubService;
    console.log('✅ Template and GitHub services initialized');

    // Initialize Redis (optional)
    try {
      await redisService.initialize();
      console.log('✅ Redis connected');
    } catch (error) {
      console.warn(
        '⚠️  Redis connection failed, using fallback storage:',
        error.message,
      );
    }

    // Initialize Docker
    await dockerService.initialize();
    console.log('✅ Docker connected');

    // Initialize Kubernetes (optional)
    try {
      await k8sService.initialize();
      console.log('✅ Kubernetes connected');
    } catch (error) {
      console.warn('⚠️  Kubernetes connection failed:', error.message);
    }

    // Start metrics collection
    metricsService.startCollection();
    console.log('✅ Metrics collection started');

    server.listen(PORT, () => {
      console.log(`🚀 webduh API server running on port ${PORT}`);
      console.log(`📊 Metrics available at http://localhost:${PORT}/metrics`);
      console.log(`🏥 Health check at http://localhost:${PORT}/health`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
