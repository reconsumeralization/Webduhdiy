const Docker = require('dockerode');
const { Transform } = require('stream');
const winston = require('winston');

class DockerService {
  constructor() {
    this.docker = null;
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'docker.log' }),
      ],
    });
  }

  async initialize() {
    try {
      // Try different Docker connection methods
      const connectionOptions = [
        // Unix socket (Linux/macOS)
        { socketPath: '/var/run/docker.sock' },
        // Named pipe (Windows)
        { socketPath: '\\\\.\\pipe\\docker_engine' },
        // TCP connection (remote Docker)
        {
          host: process.env.DOCKER_HOST || 'localhost',
          port: process.env.DOCKER_PORT || 2376,
          protocol: 'http',
        },
      ];

      for (const options of connectionOptions) {
        try {
          this.docker = new Docker(options);
          await this.docker.ping();
          this.logger.info('Docker connection established', { options });
          return;
        } catch (error) {
          this.logger.debug('Docker connection attempt failed', {
            options,
            error: error.message,
          });
          continue;
        }
      }

      throw new Error('Could not connect to Docker daemon');
    } catch (error) {
      this.logger.error('Failed to initialize Docker service', {
        error: error.message,
      });
      throw error;
    }
  }

  async isHealthy() {
    try {
      if (!this.docker) return false;
      await this.docker.ping();
      return true;
    } catch (error) {
      this.logger.warn('Docker health check failed', { error: error.message });
      return false;
    }
  }

  /**
   * Build Docker image from source directory
   */
  async buildImage(sourceDir, imageName, onProgress = null) {
    try {
      this.logger.info('Starting Docker build', { sourceDir, imageName });

      const buildStream = await this.docker.buildImage(
        {
          context: sourceDir,
          src: ['.'],
        },
        {
          t: imageName,
          pull: true,
          rm: true,
          forcerm: true,
        },
      );

      return new Promise((resolve, reject) => {
        const buildLogs = [];

        const logTransform = new Transform({
          transform(chunk, encoding, callback) {
            const lines = chunk
              .toString()
              .split('\n')
              .filter((line) => line.trim());

            for (const line of lines) {
              try {
                const logData = JSON.parse(line);

                if (logData.stream) {
                  buildLogs.push(logData.stream);
                  if (onProgress) {
                    onProgress(logData.stream);
                  }
                }

                if (logData.error) {
                  reject(new Error(logData.error));
                  return;
                }

                if (logData.aux && logData.aux.ID) {
                  this.logger.info('Docker build completed', {
                    imageName,
                    imageId: logData.aux.ID,
                  });
                  resolve({
                    imageName,
                    imageId: logData.aux.ID,
                    logs: buildLogs,
                  });
                  return;
                }
              } catch (parseError) {
                // Ignore JSON parsing errors for non-JSON lines
                if (onProgress) {
                  onProgress(line);
                }
              }
            }

            callback();
          },
        });

        buildStream.pipe(logTransform);

        buildStream.on('error', (error) => {
          this.logger.error('Docker build stream error', {
            error: error.message,
          });
          reject(error);
        });
      });
    } catch (error) {
      this.logger.error('Docker build failed', {
        sourceDir,
        imageName,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Create and start a container
   */
  async createContainer(config) {
    try {
      this.logger.info('Creating Docker container', {
        config: { ...config, Env: '***' },
      });

      const container = await this.docker.createContainer(config);
      this.logger.info('Container created successfully', {
        containerId: container.id,
        name: config.name,
      });

      return container;
    } catch (error) {
      this.logger.error('Failed to create container', {
        error: error.message,
        config,
      });
      throw error;
    }
  }

  /**
   * Get container by ID
   */
  getContainer(containerId) {
    return this.docker.getContainer(containerId);
  }

  /**
   * List containers with optional filters
   */
  async listContainers(filters = {}) {
    try {
      const containers = await this.docker.listContainers({
        all: true,
        filters: JSON.stringify(filters),
      });

      return containers.map((container) => ({
        id: container.Id,
        name: container.Names[0]?.replace('/', ''),
        image: container.Image,
        state: container.State,
        status: container.Status,
        created: new Date(container.Created * 1000),
        ports: container.Ports,
        labels: container.Labels,
      }));
    } catch (error) {
      this.logger.error('Failed to list containers', { error: error.message });
      throw error;
    }
  }

  /**
   * Get webduh managed containers
   */
  async getWebduhContainers() {
    return await this.listContainers({
      label: ['webduh.io/managed=true'],
    });
  }

  /**
   * Get container stats
   */
  async getContainerStats(containerId, stream = false) {
    try {
      const container = this.getContainer(containerId);
      const stats = await container.stats({ stream });

      if (!stream) {
        return this.formatContainerStats(stats);
      }

      return stats;
    } catch (error) {
      this.logger.error('Failed to get container stats', {
        containerId,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Format container stats for easier consumption
   */
  formatContainerStats(rawStats) {
    const cpuDelta =
      rawStats.cpu_stats.cpu_usage.total_usage -
      rawStats.precpu_stats.cpu_usage.total_usage;
    const systemDelta =
      rawStats.cpu_stats.system_cpu_usage -
      rawStats.precpu_stats.system_cpu_usage;
    const cpuPercent = (cpuDelta / systemDelta) * 100.0;

    const memoryUsage = rawStats.memory_stats.usage;
    const memoryLimit = rawStats.memory_stats.limit;
    const memoryPercent = (memoryUsage / memoryLimit) * 100.0;

    // Network stats
    const networks = rawStats.networks || {};
    const networkRx = Object.values(networks).reduce(
      (sum, net) => sum + net.rx_bytes,
      0,
    );
    const networkTx = Object.values(networks).reduce(
      (sum, net) => sum + net.tx_bytes,
      0,
    );

    return {
      cpu: {
        percent: Math.round(cpuPercent * 100) / 100,
        usage: cpuDelta,
        system: systemDelta,
      },
      memory: {
        usage: memoryUsage,
        limit: memoryLimit,
        percent: Math.round(memoryPercent * 100) / 100,
        usageMB: Math.round(memoryUsage / 1024 / 1024),
        limitMB: Math.round(memoryLimit / 1024 / 1024),
      },
      network: {
        rx: networkRx,
        tx: networkTx,
        rxMB: Math.round((networkRx / 1024 / 1024) * 100) / 100,
        txMB: Math.round((networkTx / 1024 / 1024) * 100) / 100,
      },
      timestamp: new Date(),
    };
  }

  /**
   * Get container logs
   */
  async getContainerLogs(containerId, options = {}) {
    try {
      const container = this.getContainer(containerId);
      const logs = await container.logs({
        stdout: true,
        stderr: true,
        timestamps: true,
        tail: options.tail || 100,
        since: options.since || 0,
        ...options,
      });

      // Convert buffer to string and split lines
      const logLines = logs
        .toString()
        .split('\n')
        .filter((line) => line.trim());

      return logLines.map((line) => {
        // Remove Docker log header (8 bytes)
        const cleanLine = line.slice(8);
        const timestampMatch = cleanLine.match(
          /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z)\s(.*)$/,
        );

        if (timestampMatch) {
          return {
            timestamp: new Date(timestampMatch[1]),
            message: timestampMatch[2],
          };
        }

        return {
          timestamp: new Date(),
          message: cleanLine,
        };
      });
    } catch (error) {
      this.logger.error('Failed to get container logs', {
        containerId,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Stream container logs
   */
  async streamContainerLogs(containerId, callback) {
    try {
      const container = this.getContainer(containerId);
      const stream = await container.logs({
        stdout: true,
        stderr: true,
        follow: true,
        timestamps: true,
      });

      stream.on('data', (chunk) => {
        const lines = chunk
          .toString()
          .split('\n')
          .filter((line) => line.trim());

        for (const line of lines) {
          const cleanLine = line.slice(8); // Remove Docker log header
          const timestampMatch = cleanLine.match(
            /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z)\s(.*)$/,
          );

          if (timestampMatch) {
            callback({
              timestamp: new Date(timestampMatch[1]),
              message: timestampMatch[2],
            });
          } else {
            callback({
              timestamp: new Date(),
              message: cleanLine,
            });
          }
        }
      });

      return stream;
    } catch (error) {
      this.logger.error('Failed to stream container logs', {
        containerId,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Stop container
   */
  async stopContainer(containerId, timeout = 10) {
    try {
      const container = this.getContainer(containerId);
      await container.stop({ t: timeout });

      this.logger.info('Container stopped', { containerId });
      return true;
    } catch (error) {
      if (error.statusCode === 304) {
        // Container already stopped
        return true;
      }

      this.logger.error('Failed to stop container', {
        containerId,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Remove container
   */
  async removeContainer(containerId, force = false) {
    try {
      const container = this.getContainer(containerId);
      await container.remove({ force });

      this.logger.info('Container removed', { containerId });
      return true;
    } catch (error) {
      if (error.statusCode === 404) {
        // Container already removed
        return true;
      }

      this.logger.error('Failed to remove container', {
        containerId,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Restart container
   */
  async restartContainer(containerId, timeout = 10) {
    try {
      const container = this.getContainer(containerId);
      await container.restart({ t: timeout });

      this.logger.info('Container restarted', { containerId });
      return true;
    } catch (error) {
      this.logger.error('Failed to restart container', {
        containerId,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Execute command in container
   */
  async execInContainer(containerId, command) {
    try {
      const container = this.getContainer(containerId);
      const exec = await container.exec({
        Cmd: Array.isArray(command) ? command : ['/bin/sh', '-c', command],
        AttachStdout: true,
        AttachStderr: true,
      });

      const stream = await exec.start();

      return new Promise((resolve, reject) => {
        let output = '';

        stream.on('data', (chunk) => {
          output += chunk.toString();
        });

        stream.on('end', async () => {
          try {
            const inspect = await exec.inspect();
            resolve({
              output: output.slice(8), // Remove Docker stream header
              exitCode: inspect.ExitCode,
            });
          } catch (error) {
            reject(error);
          }
        });

        stream.on('error', reject);
      });
    } catch (error) {
      this.logger.error('Failed to execute command in container', {
        containerId,
        command,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Pull Docker image
   */
  async pullImage(imageName, onProgress = null) {
    try {
      this.logger.info('Pulling Docker image', { imageName });

      const stream = await this.docker.pull(imageName);

      return new Promise((resolve, reject) => {
        this.docker.modem.followProgress(
          stream,
          (err, res) => {
            if (err) {
              this.logger.error('Failed to pull image', {
                imageName,
                error: err.message,
              });
              reject(err);
            } else {
              this.logger.info('Image pulled successfully', { imageName });
              resolve(res);
            }
          },
          (event) => {
            if (onProgress) {
              onProgress(event);
            }
          },
        );
      });
    } catch (error) {
      this.logger.error('Failed to pull image', {
        imageName,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * List Docker images
   */
  async listImages(filters = {}) {
    try {
      const images = await this.docker.listImages({
        filters: JSON.stringify(filters),
      });

      return images.map((image) => ({
        id: image.Id,
        tags: image.RepoTags,
        created: new Date(image.Created * 1000),
        size: image.Size,
        virtualSize: image.VirtualSize,
      }));
    } catch (error) {
      this.logger.error('Failed to list images', { error: error.message });
      throw error;
    }
  }

  /**
   * Remove Docker image
   */
  async removeImage(imageId, force = false) {
    try {
      const image = this.docker.getImage(imageId);
      await image.remove({ force });

      this.logger.info('Image removed', { imageId });
      return true;
    } catch (error) {
      if (error.statusCode === 404) {
        return true;
      }

      this.logger.error('Failed to remove image', {
        imageId,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Get Docker system info
   */
  async getSystemInfo() {
    try {
      const info = await this.docker.info();
      const version = await this.docker.version();

      return {
        version: version.Version,
        apiVersion: version.ApiVersion,
        containers: info.Containers,
        containersRunning: info.ContainersRunning,
        containersPaused: info.ContainersPaused,
        containersStopped: info.ContainersStopped,
        images: info.Images,
        driver: info.Driver,
        memTotal: info.MemTotal,
        cpus: info.NCPU,
        operatingSystem: info.OperatingSystem,
        architecture: info.Architecture,
        kernelVersion: info.KernelVersion,
      };
    } catch (error) {
      this.logger.error('Failed to get system info', { error: error.message });
      throw error;
    }
  }

  /**
   * Cleanup unused resources
   */
  async cleanup() {
    try {
      this.logger.info('Starting Docker cleanup');

      // Remove stopped containers
      const containers = await this.listContainers({ status: ['exited'] });
      for (const container of containers) {
        if (
          container.labels &&
          container.labels['webduh.io/managed'] === 'true'
        ) {
          await this.removeContainer(container.id);
        }
      }

      // Remove unused images
      await this.docker.pruneImages({ filters: { dangling: { true: true } } });

      // Remove unused volumes
      await this.docker.pruneVolumes();

      // Remove unused networks
      await this.docker.pruneNetworks();

      this.logger.info('Docker cleanup completed');
      return true;
    } catch (error) {
      this.logger.error('Docker cleanup failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Close Docker connection
   */
  async close() {
    if (this.docker) {
      // Docker client doesn't need explicit closing
      this.docker = null;
      this.logger.info('Docker service closed');
    }
  }
}

module.exports = DockerService;
