const winston = require('winston');

class KubernetesService {
  constructor() {
    this.available = false;
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'kubernetes.log' }),
      ],
    });
  }

  async initialize() {
    try {
      // Try to load Kubernetes client
      const k8s = require('@kubernetes/client-node');
      const kc = new k8s.KubeConfig();

      try {
        kc.loadFromDefault();
        this.k8sApi = kc.makeApiClient(k8s.CoreV1Api);
        this.k8sAppsApi = kc.makeApiClient(k8s.AppsV1Api);

        // Test connection
        await this.k8sApi.listNamespaces();
        this.available = true;
        this.logger.info('Kubernetes service initialized successfully');
      } catch (error) {
        this.logger.warn('Kubernetes not available, will use Docker fallback');
        this.available = false;
      }
    } catch (error) {
      this.logger.warn(
        'Kubernetes client not available, will use Docker fallback',
      );
      this.available = false;
    }
  }

  isAvailable() {
    return this.available;
  }

  async isHealthy() {
    if (!this.available) return false;

    try {
      await this.k8sApi.listNamespaces();
      return true;
    } catch (error) {
      this.logger.warn('Kubernetes health check failed:', error.message);
      return false;
    }
  }

  // Deployment management - simplified for now
  async createDeployment(deployment) {
    if (!this.available) {
      throw new Error('Kubernetes is not available');
    }

    try {
      const response = await this.k8sAppsApi.createNamespacedDeployment(
        deployment.metadata.namespace,
        deployment,
      );

      this.logger.info('Deployment created', {
        name: deployment.metadata.name,
        namespace: deployment.metadata.namespace,
      });

      return response.body;
    } catch (error) {
      this.logger.error('Failed to create deployment:', error.message);
      throw error;
    }
  }

  async deleteDeployment(name, namespace = 'default') {
    if (!this.available) {
      return true; // Silently succeed if K8s not available
    }

    try {
      await this.k8sAppsApi.deleteNamespacedDeployment(name, namespace);
      this.logger.info('Deployment deleted', { name, namespace });
      return true;
    } catch (error) {
      if (error.statusCode === 404) {
        return true; // Already deleted
      }
      this.logger.error('Failed to delete deployment:', error.message);
      throw error;
    }
  }

  async createService(service) {
    if (!this.available) {
      throw new Error('Kubernetes is not available');
    }

    try {
      const response = await this.k8sApi.createNamespacedService(
        service.metadata.namespace,
        service,
      );

      this.logger.info('Service created', {
        name: service.metadata.name,
        namespace: service.metadata.namespace,
      });

      return response.body;
    } catch (error) {
      this.logger.error('Failed to create service:', error.message);
      throw error;
    }
  }

  async deleteService(name, namespace = 'default') {
    if (!this.available) {
      return true; // Silently succeed if K8s not available
    }

    try {
      await this.k8sApi.deleteNamespacedService(name, namespace);
      this.logger.info('Service deleted', { name, namespace });
      return true;
    } catch (error) {
      if (error.statusCode === 404) {
        return true; // Already deleted
      }
      this.logger.error('Failed to delete service:', error.message);
      throw error;
    }
  }

  async getClusterInfo() {
    if (!this.available) {
      return { available: false, message: 'Kubernetes not available' };
    }

    try {
      const namespaces = await this.k8sApi.listNamespace();
      const nodes = await this.k8sApi.listNode();

      return {
        available: true,
        namespaces: namespaces.body.items.length,
        nodes: nodes.body.items.length,
        version:
          nodes.body.items[0]?.status?.nodeInfo?.kubeletVersion || 'unknown',
      };
    } catch (error) {
      this.logger.error('Failed to get cluster info:', error.message);
      return { available: false, error: error.message };
    }
  }
}

module.exports = KubernetesService;
