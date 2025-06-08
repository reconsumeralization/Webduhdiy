const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');
const tar = require('tar');
const archiver = require('archiver');
const simpleGit = require('simple-git');
const winston = require('winston');

// Framework detection and configuration
const FRAMEWORK_CONFIGS = {
  nextjs: {
    buildCommand: 'npm run build',
    startCommand: 'npm start',
    port: 3000,
    healthCheck: '/',
    dockerBaseImage: 'node:18-alpine',
    buildArgs: ['--production'],
  },
  react: {
    buildCommand: 'npm run build',
    startCommand: 'npx serve -s build',
    port: 3000,
    healthCheck: '/',
    dockerBaseImage: 'node:18-alpine',
  },
  vue: {
    buildCommand: 'npm run build',
    startCommand: 'npx serve -s dist',
    port: 3000,
    healthCheck: '/',
    dockerBaseImage: 'node:18-alpine',
  },
  nuxt: {
    buildCommand: 'npm run build',
    startCommand: 'npm start',
    port: 3000,
    healthCheck: '/',
    dockerBaseImage: 'node:18-alpine',
  },
  sveltekit: {
    buildCommand: 'npm run build',
    startCommand: 'node build',
    port: 3000,
    healthCheck: '/',
    dockerBaseImage: 'node:18-alpine',
  },
  astro: {
    buildCommand: 'npm run build',
    startCommand: 'npx serve -s dist',
    port: 4321,
    healthCheck: '/',
    dockerBaseImage: 'node:18-alpine',
  },
  remix: {
    buildCommand: 'npm run build',
    startCommand: 'npm start',
    port: 3000,
    healthCheck: '/',
    dockerBaseImage: 'node:18-alpine',
  },
  vite: {
    buildCommand: 'npm run build',
    startCommand: 'npx serve -s dist',
    port: 5173,
    healthCheck: '/',
    dockerBaseImage: 'node:18-alpine',
  },
  static: {
    buildCommand: null,
    startCommand: 'npx serve -s .',
    port: 3000,
    healthCheck: '/',
    dockerBaseImage: 'nginx:alpine',
  },
};

class DeploymentEngine {
  constructor(dockerService, kubernetesService) {
    this.docker = dockerService;
    this.k8s = kubernetesService;
    this.deployments = new Map();
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'deployment.log' }),
      ],
    });

    // Temporary directories for builds
    this.tempDir = path.join(process.cwd(), 'temp');
    this.ensureTempDir();
  }

  async ensureTempDir() {
    try {
      await fs.access(this.tempDir);
    } catch {
      await fs.mkdir(this.tempDir, { recursive: true });
    }
  }

  /**
   * Main deployment function - orchestrates the entire deployment process
   */
  async deployProject(projectConfig) {
    const deploymentId = uuidv4();
    const deployment = {
      id: deploymentId,
      projectId: projectConfig.id,
      status: 'initializing',
      startTime: new Date(),
      logs: [],
      steps: [],
    };

    this.deployments.set(deploymentId, deployment);
    this.logger.info('Starting deployment', {
      deploymentId,
      projectId: projectConfig.id,
    });

    try {
      // Step 1: Clone repository
      await this.updateDeploymentStatus(
        deploymentId,
        'cloning',
        'Cloning repository...',
      );
      const sourceDir = await this.cloneRepository(
        projectConfig.repository,
        deploymentId,
      );

      // Step 2: Detect framework
      await this.updateDeploymentStatus(
        deploymentId,
        'analyzing',
        'Detecting framework...',
      );
      const framework = await this.detectFramework(sourceDir);
      const config = {
        ...FRAMEWORK_CONFIGS[framework],
        ...projectConfig.config,
      };

      // Step 3: Build Docker image
      await this.updateDeploymentStatus(
        deploymentId,
        'building',
        'Building container image...',
      );
      const imageName = await this.buildDockerImage(
        sourceDir,
        config,
        deploymentId,
      );

      // Step 4: Deploy to Kubernetes or Docker
      await this.updateDeploymentStatus(
        deploymentId,
        'deploying',
        'Deploying to cluster...',
      );
      const deployment_result = await this.deployToCluster(
        imageName,
        config,
        projectConfig,
        deploymentId,
      );

      // Step 5: Configure routing
      await this.updateDeploymentStatus(
        deploymentId,
        'configuring',
        'Setting up routing...',
      );
      const urls = await this.configureRouting(
        deployment_result,
        projectConfig,
      );

      // Step 6: Health check
      await this.updateDeploymentStatus(
        deploymentId,
        'health-check',
        'Performing health checks...',
      );
      await this.performHealthCheck(urls.primary, config.healthCheck);

      // Deployment complete
      deployment.status = 'deployed';
      deployment.endTime = new Date();
      deployment.urls = urls;
      deployment.imageName = imageName;

      this.logger.info('Deployment completed successfully', { deploymentId });
      return deployment;
    } catch (error) {
      this.logger.error('Deployment failed', {
        deploymentId,
        error: error.message,
      });
      deployment.status = 'failed';
      deployment.error = error.message;
      deployment.endTime = new Date();
      throw error;
    } finally {
      // Cleanup temporary files
      await this.cleanup(deploymentId);
    }
  }

  /**
   * Clone repository to temporary directory
   */
  async cloneRepository(repositoryUrl, deploymentId) {
    const cloneDir = path.join(this.tempDir, deploymentId);
    const git = simpleGit();

    try {
      await git.clone(repositoryUrl, cloneDir, ['--depth', '1']);
      this.logger.info('Repository cloned successfully', {
        deploymentId,
        repositoryUrl,
      });
      return cloneDir;
    } catch (error) {
      this.logger.error('Failed to clone repository', {
        deploymentId,
        repositoryUrl,
        error: error.message,
      });
      throw new Error(`Failed to clone repository: ${error.message}`);
    }
  }

  /**
   * Detect framework based on package.json and file structure
   */
  async detectFramework(sourceDir) {
    try {
      const packageJsonPath = path.join(sourceDir, 'package.json');
      const packageJson = JSON.parse(
        await fs.readFile(packageJsonPath, 'utf8'),
      );

      const dependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      // Detection logic based on dependencies
      if (dependencies.next) return 'nextjs';
      if (dependencies['@remix-run/react']) return 'remix';
      if (dependencies.nuxt) return 'nuxt';
      if (dependencies['@sveltejs/kit']) return 'sveltekit';
      if (dependencies.astro) return 'astro';
      if (dependencies.vite) return 'vite';
      if (dependencies.vue) return 'vue';
      if (dependencies.react) return 'react';

      // Check for index.html (static site)
      try {
        await fs.access(path.join(sourceDir, 'index.html'));
        return 'static';
      } catch {
        // Default to static if no framework detected
        return 'static';
      }
    } catch (error) {
      this.logger.warn('Could not detect framework, defaulting to static', {
        error: error.message,
      });
      return 'static';
    }
  }

  /**
   * Build Docker image for the project
   */
  async buildDockerImage(sourceDir, config, deploymentId) {
    const imageName = `webduh/${deploymentId}:latest`;
    const dockerfilePath = path.join(sourceDir, 'Dockerfile');

    try {
      // Check if custom Dockerfile exists
      await fs.access(dockerfilePath);
      this.logger.info('Using custom Dockerfile', { deploymentId });
    } catch {
      // Generate Dockerfile based on framework
      await this.generateDockerfile(sourceDir, config);
      this.logger.info('Generated Dockerfile for framework', {
        deploymentId,
        framework: config,
      });
    }

    // Build image using Docker service
    await this.docker.buildImage(sourceDir, imageName, (output) => {
      this.addDeploymentLog(deploymentId, output);
    });

    this.logger.info('Docker image built successfully', {
      deploymentId,
      imageName,
    });
    return imageName;
  }

  /**
   * Generate Dockerfile based on framework configuration
   */
  async generateDockerfile(sourceDir, config) {
    let dockerfile = '';

    if (config.dockerBaseImage.includes('node')) {
      dockerfile = `
FROM ${config.dockerBaseImage}

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
${config.buildCommand ? `RUN ${config.buildCommand}` : ''}

# Expose port
EXPOSE ${config.port}

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:${config.port}${config.healthCheck} || exit 1

# Start application
CMD ["sh", "-c", "${config.startCommand}"]
`;
    } else if (config.dockerBaseImage.includes('nginx')) {
      dockerfile = `
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
${config.buildCommand ? `RUN ${config.buildCommand}` : ''}

FROM ${config.dockerBaseImage}
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
`;
    }

    await fs.writeFile(path.join(sourceDir, 'Dockerfile'), dockerfile.trim());
  }

  /**
   * Deploy to Kubernetes cluster or Docker Swarm
   */
  async deployToCluster(imageName, config, projectConfig, deploymentId) {
    if (this.k8s.isAvailable()) {
      return await this.deployToKubernetes(
        imageName,
        config,
        projectConfig,
        deploymentId,
      );
    } else {
      return await this.deployToDocker(
        imageName,
        config,
        projectConfig,
        deploymentId,
      );
    }
  }

  /**
   * Deploy to Kubernetes cluster
   */
  async deployToKubernetes(imageName, config, projectConfig, deploymentId) {
    const deploymentName = `webduh-${projectConfig.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const namespace = projectConfig.namespace || 'webduh';

    const deployment = {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name: deploymentName,
        namespace: namespace,
        labels: {
          app: deploymentName,
          'webduh.io/project': projectConfig.id,
          'webduh.io/deployment': deploymentId,
        },
      },
      spec: {
        replicas: projectConfig.replicas || 1,
        selector: {
          matchLabels: { app: deploymentName },
        },
        template: {
          metadata: {
            labels: { app: deploymentName },
          },
          spec: {
            containers: [
              {
                name: deploymentName,
                image: imageName,
                ports: [{ containerPort: config.port }],
                env: this.buildEnvironmentVariables(projectConfig.environment),
                resources: {
                  limits: {
                    cpu: projectConfig.cpuLimit || '500m',
                    memory: projectConfig.memoryLimit || '512Mi',
                  },
                  requests: {
                    cpu: projectConfig.cpuRequest || '100m',
                    memory: projectConfig.memoryRequest || '128Mi',
                  },
                },
                livenessProbe: {
                  httpGet: {
                    path: config.healthCheck,
                    port: config.port,
                  },
                  initialDelaySeconds: 30,
                  periodSeconds: 10,
                },
                readinessProbe: {
                  httpGet: {
                    path: config.healthCheck,
                    port: config.port,
                  },
                  initialDelaySeconds: 5,
                  periodSeconds: 5,
                },
              },
            ],
          },
        },
      },
    };

    const service = {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {
        name: `${deploymentName}-service`,
        namespace: namespace,
        labels: {
          app: deploymentName,
        },
      },
      spec: {
        selector: { app: deploymentName },
        ports: [
          {
            port: 80,
            targetPort: config.port,
            protocol: 'TCP',
          },
        ],
        type: 'ClusterIP',
      },
    };

    // Deploy to Kubernetes
    await this.k8s.createDeployment(deployment);
    await this.k8s.createService(service);

    this.logger.info('Deployed to Kubernetes', {
      deploymentId,
      deploymentName,
      namespace,
    });

    return {
      type: 'kubernetes',
      deploymentName,
      serviceName: `${deploymentName}-service`,
      namespace,
      port: config.port,
    };
  }

  /**
   * Deploy to Docker (fallback when Kubernetes is not available)
   */
  async deployToDocker(imageName, config, projectConfig, deploymentId) {
    const containerName = `webduh-${projectConfig.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${deploymentId.slice(0, 8)}`;

    const containerConfig = {
      Image: imageName,
      name: containerName,
      Env: this.buildEnvironmentArray(projectConfig.environment),
      ExposedPorts: { [`${config.port}/tcp`]: {} },
      HostConfig: {
        PortBindings: { [`${config.port}/tcp`]: [{ HostPort: '0' }] }, // Auto-assign port
        RestartPolicy: { Name: 'unless-stopped' },
        Memory: this.parseMemoryLimit(projectConfig.memoryLimit || '512Mi'),
        CpuQuota: this.parseCpuLimit(projectConfig.cpuLimit || '500m'),
      },
      Labels: {
        'webduh.io/project': projectConfig.id,
        'webduh.io/deployment': deploymentId,
        'webduh.io/managed': 'true',
      },
    };

    const container = await this.docker.createContainer(containerConfig);
    await container.start();

    // Get assigned port
    const containerInfo = await container.inspect();
    const hostPort =
      containerInfo.NetworkSettings.Ports[`${config.port}/tcp`][0].HostPort;

    this.logger.info('Deployed to Docker', {
      deploymentId,
      containerName,
      hostPort,
    });

    return {
      type: 'docker',
      containerName,
      containerId: container.id,
      port: parseInt(hostPort),
    };
  }

  /**
   * Configure routing and load balancing
   */
  async configureRouting(deploymentResult, projectConfig) {
    const subdomain =
      projectConfig.subdomain ||
      projectConfig.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const domain = process.env.WEBDUH_DOMAIN || 'webduh.local';

    const urls = {
      primary: `https://${subdomain}.${domain}`,
      internal:
        deploymentResult.type === 'kubernetes'
          ? `http://${deploymentResult.serviceName}.${deploymentResult.namespace}.svc.cluster.local`
          : `http://localhost:${deploymentResult.port}`,
      custom: projectConfig.customDomain
        ? `https://${projectConfig.customDomain}`
        : null,
    };

    // Configure Traefik routing (this would integrate with actual Traefik configuration)
    await this.configureTraefikRouting(deploymentResult, urls, projectConfig);

    return urls;
  }

  /**
   * Configure Traefik routing rules
   */
  async configureTraefikRouting(deploymentResult, urls, projectConfig) {
    // This would create Traefik IngressRoute or Docker labels for routing
    // Implementation depends on your Traefik setup
    this.logger.info('Configuring Traefik routing', {
      deploymentResult,
      urls: urls.primary,
      customDomain: urls.custom,
    });
  }

  /**
   * Perform health check on deployed service
   */
  async performHealthCheck(url, healthCheckPath, maxRetries = 10) {
    const axios = require('axios');

    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await axios.get(`${url}${healthCheckPath}`, {
          timeout: 5000,
        });
        if (response.status === 200) {
          this.logger.info('Health check passed', { url, attempt: i + 1 });
          return true;
        }
      } catch (error) {
        this.logger.warn('Health check failed', {
          url,
          attempt: i + 1,
          error: error.message,
        });

        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds
        }
      }
    }

    throw new Error(`Health check failed after ${maxRetries} attempts`);
  }

  /**
   * Build environment variables for container
   */
  buildEnvironmentVariables(envVars = {}) {
    return Object.entries(envVars).map(([key, value]) => ({
      name: key,
      value: String(value),
    }));
  }

  buildEnvironmentArray(envVars = {}) {
    return Object.entries(envVars).map(([key, value]) => `${key}=${value}`);
  }

  /**
   * Parse memory limit string to bytes
   */
  parseMemoryLimit(limit) {
    const units = { Ki: 1024, Mi: 1024 * 1024, Gi: 1024 * 1024 * 1024 };
    const match = limit.match(/^(\d+)([A-Za-z]+)?$/);
    if (!match) return undefined;

    const value = parseInt(match[1]);
    const unit = match[2] || '';
    return value * (units[unit] || 1);
  }

  /**
   * Parse CPU limit string to Docker format
   */
  parseCpuLimit(limit) {
    if (limit.endsWith('m')) {
      return parseInt(limit) * 1000; // Convert millicores to microseconds
    }
    return parseInt(limit) * 1000000; // Convert cores to microseconds
  }

  /**
   * Update deployment status and notify via WebSocket
   */
  async updateDeploymentStatus(deploymentId, status, message) {
    const deployment = this.deployments.get(deploymentId);
    if (deployment) {
      deployment.status = status;
      deployment.steps.push({
        status,
        message,
        timestamp: new Date(),
      });

      this.logger.info('Deployment status updated', {
        deploymentId,
        status,
        message,
      });

      // Emit via WebSocket if available
      if (this.websocket) {
        this.websocket.broadcast('deployment-update', {
          deploymentId,
          status,
          message,
          projectId: deployment.projectId,
        });
      }
    }
  }

  /**
   * Add log entry to deployment
   */
  addDeploymentLog(deploymentId, message) {
    const deployment = this.deployments.get(deploymentId);
    if (deployment) {
      deployment.logs.push({
        message,
        timestamp: new Date(),
      });
    }
  }

  /**
   * Get deployment status
   */
  getDeployment(deploymentId) {
    return this.deployments.get(deploymentId);
  }

  /**
   * List all deployments
   */
  listDeployments(projectId = null) {
    const deployments = Array.from(this.deployments.values());
    return projectId
      ? deployments.filter((d) => d.projectId === projectId)
      : deployments;
  }

  /**
   * Cleanup temporary files
   */
  async cleanup(deploymentId) {
    try {
      const cloneDir = path.join(this.tempDir, deploymentId);
      await fs.rm(cloneDir, { recursive: true, force: true });
      this.logger.info('Cleanup completed', { deploymentId });
    } catch (error) {
      this.logger.warn('Cleanup failed', {
        deploymentId,
        error: error.message,
      });
    }
  }

  /**
   * Stop and remove deployment
   */
  async removeDeployment(deploymentId) {
    const deployment = this.deployments.get(deploymentId);
    if (!deployment) {
      throw new Error('Deployment not found');
    }

    try {
      if (deployment.type === 'kubernetes') {
        await this.k8s.deleteDeployment(
          deployment.deploymentName,
          deployment.namespace,
        );
        await this.k8s.deleteService(
          `${deployment.deploymentName}-service`,
          deployment.namespace,
        );
      } else if (deployment.type === 'docker') {
        const container = this.docker.getContainer(deployment.containerId);
        await container.stop();
        await container.remove();
      }

      this.deployments.delete(deploymentId);
      this.logger.info('Deployment removed', { deploymentId });
    } catch (error) {
      this.logger.error('Failed to remove deployment', {
        deploymentId,
        error: error.message,
      });
      throw error;
    }
  }
}

module.exports = DeploymentEngine;
