import express from 'express';
import { db } from '@/config/database';
import { getRedisClient } from '@/config/redis';
import { logger } from '@/utils/logger';

const router = express.Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Basic health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   description: Process uptime in seconds
 *                 memory:
 *                   type: object
 *                   properties:
 *                     rss:
 *                       type: number
 *                     heapTotal:
 *                       type: number
 *                     heapUsed:
 *                       type: number
 *                     external:
 *                       type: number
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version,
    platform: process.platform,
  });
});

/**
 * @swagger
 * /api/health/detailed:
 *   get:
 *     summary: Detailed health check including database and Redis
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Detailed health status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 services:
 *                   type: object
 *                   properties:
 *                     database:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                         responseTime:
 *                           type: number
 *                     redis:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                         responseTime:
 *                           type: number
 *                 system:
 *                   type: object
 *                   properties:
 *                     uptime:
 *                       type: number
 *                     memory:
 *                       type: object
 *                     cpu:
 *                       type: object
 *       503:
 *         description: Service unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/detailed', async (req, res) => {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: { status: 'unknown', responseTime: 0 },
      redis: { status: 'unknown', responseTime: 0 },
    },
    system: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      version: process.version,
      platform: process.platform,
      nodeEnv: process.env.NODE_ENV,
    },
  };

  let overallStatus = 200;

  // Check database connection
  try {
    const dbStart = Date.now();
    await db.raw('SELECT 1');
    healthCheck.services.database.status = 'healthy';
    healthCheck.services.database.responseTime = Date.now() - dbStart;
  } catch (error) {
    logger.error('Database health check failed:', error);
    healthCheck.services.database.status = 'unhealthy';
    overallStatus = 503;
  }

  // Check Redis connection
  try {
    const redisStart = Date.now();
    const redis = getRedisClient();
    await redis.ping();
    healthCheck.services.redis.status = 'healthy';
    healthCheck.services.redis.responseTime = Date.now() - redisStart;
  } catch (error) {
    logger.error('Redis health check failed:', error);
    healthCheck.services.redis.status = 'unhealthy';
    overallStatus = 503;
  }

  if (overallStatus !== 200) {
    healthCheck.status = 'unhealthy';
  }

  res.status(overallStatus).json(healthCheck);
});

/**
 * @swagger
 * /api/health/readiness:
 *   get:
 *     summary: Readiness probe for Kubernetes
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is ready
 *       503:
 *         description: Service is not ready
 */
router.get('/readiness', async (req, res) => {
  try {
    // Check if all critical services are available
    await db.raw('SELECT 1');
    const redis = getRedisClient();
    await redis.ping();
    
    res.status(200).json({ status: 'ready' });
  } catch (error) {
    logger.error('Readiness check failed:', error);
    res.status(503).json({ 
      status: 'not ready',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @swagger
 * /api/health/liveness:
 *   get:
 *     summary: Liveness probe for Kubernetes
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is alive
 */
router.get('/liveness', (req, res) => {
  res.status(200).json({ 
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router; 