const client = require('prom-client');
const winston = require('winston');

class MetricsService {
  constructor() {
    this.register = client.register;
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'metrics.log' }),
      ],
    });

    this.initializeMetrics();
  }

  initializeMetrics() {
    try {
      // Custom metrics for webduh platform
      this.deploymentCounter = new client.Counter({
        name: 'webduh_deployments_total',
        help: 'Total number of deployments',
        labelNames: ['status', 'framework'],
      });

      this.deploymentDuration = new client.Histogram({
        name: 'webduh_deployment_duration_seconds',
        help: 'Duration of deployments in seconds',
        labelNames: ['framework', 'status'],
        buckets: [1, 5, 10, 30, 60, 120, 300, 600], // seconds
      });

      this.activeProjects = new client.Gauge({
        name: 'webduh_active_projects',
        help: 'Number of active projects',
      });

      this.containerCpuUsage = new client.Gauge({
        name: 'webduh_container_cpu_usage_percent',
        help: 'Container CPU usage percentage',
        labelNames: ['container_id', 'project_id'],
      });

      this.containerMemoryUsage = new client.Gauge({
        name: 'webduh_container_memory_usage_bytes',
        help: 'Container memory usage in bytes',
        labelNames: ['container_id', 'project_id'],
      });

      this.buildQueue = new client.Gauge({
        name: 'webduh_build_queue_length',
        help: 'Number of builds in queue',
      });

      this.errorCounter = new client.Counter({
        name: 'webduh_errors_total',
        help: 'Total number of errors',
        labelNames: ['type', 'service'],
      });

      this.logger.info('Metrics initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize metrics:', error);
    }
  }

  // Deployment metrics
  recordDeployment(framework, status) {
    try {
      this.deploymentCounter.inc({ status, framework });
    } catch (error) {
      this.logger.error('Failed to record deployment metric:', error);
    }
  }

  recordDeploymentDuration(framework, status, durationSeconds) {
    try {
      this.deploymentDuration.observe({ framework, status }, durationSeconds);
    } catch (error) {
      this.logger.error('Failed to record deployment duration:', error);
    }
  }

  // Project metrics
  setActiveProjects(count) {
    try {
      this.activeProjects.set(count);
    } catch (error) {
      this.logger.error('Failed to set active projects metric:', error);
    }
  }

  // Container metrics
  setContainerCpuUsage(containerId, projectId, cpuPercent) {
    try {
      this.containerCpuUsage.set(
        { container_id: containerId, project_id: projectId },
        cpuPercent,
      );
    } catch (error) {
      this.logger.error('Failed to set container CPU usage:', error);
    }
  }

  setContainerMemoryUsage(containerId, projectId, memoryBytes) {
    try {
      this.containerMemoryUsage.set(
        { container_id: containerId, project_id: projectId },
        memoryBytes,
      );
    } catch (error) {
      this.logger.error('Failed to set container memory usage:', error);
    }
  }

  // Build queue metrics
  setBuildQueueLength(length) {
    try {
      this.buildQueue.set(length);
    } catch (error) {
      this.logger.error('Failed to set build queue length:', error);
    }
  }

  // Error tracking
  recordError(type, service = 'unknown') {
    try {
      this.errorCounter.inc({ type, service });
    } catch (error) {
      this.logger.error('Failed to record error metric:', error);
    }
  }

  // Get metrics handler for Express
  getMetricsHandler() {
    return async (req, res) => {
      try {
        res.set('Content-Type', this.register.contentType);
        const metrics = await this.register.metrics();
        res.end(metrics);
      } catch (error) {
        this.logger.error('Failed to get metrics:', error);
        res.status(500).end('Failed to get metrics');
      }
    };
  }

  // Collect system metrics
  async collectSystemMetrics() {
    try {
      // This would typically collect metrics from various services
      // For now, we'll just update some basic metrics

      // Simulate some metrics updates
      this.setActiveProjects(Math.floor(Math.random() * 20) + 5);
      this.setBuildQueueLength(Math.floor(Math.random() * 5));
    } catch (error) {
      this.logger.error('Failed to collect system metrics:', error);
    }
  }

  // Start periodic metrics collection
  startCollection(intervalMs = 30000) {
    try {
      this.collectionInterval = setInterval(() => {
        this.collectSystemMetrics();
      }, intervalMs);

      this.logger.info('Metrics collection started', { intervalMs });
    } catch (error) {
      this.logger.error('Failed to start metrics collection:', error);
    }
  }

  // Stop metrics collection
  stopCollection() {
    if (this.collectionInterval) {
      clearInterval(this.collectionInterval);
      this.collectionInterval = null;
      this.logger.info('Metrics collection stopped');
    }
  }

  // Reset all metrics
  resetMetrics() {
    try {
      this.register.resetMetrics();
      this.logger.info('Metrics reset');
    } catch (error) {
      this.logger.error('Failed to reset metrics:', error);
    }
  }

  // Get current metrics as JSON
  async getMetricsAsJson() {
    try {
      const metrics = await this.register.getMetricsAsJSON();
      return metrics;
    } catch (error) {
      this.logger.error('Failed to get metrics as JSON:', error);
      return {};
    }
  }
}

module.exports = MetricsService;
