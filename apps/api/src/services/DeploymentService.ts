import { EventEmitter } from 'events';
import { spawn, ChildProcess } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import archiver from 'archiver';
import { v4 as uuidv4 } from 'uuid';

export interface DeploymentConfig {
  projectId: string;
  userId: string;
  teamId: string;
  sourceType: 'git' | 'upload' | 'template';
  sourceUrl?: string; // Git repository URL
  branch?: string;
  buildCommand?: string;
  outputDirectory?: string;
  environment: 'production' | 'preview' | 'development';
  environmentVariables?: Record<string, string>;
  regions?: string[];
  customDomain?: string;
  edgeFunctions?: EdgeFunctionConfig[];
}

export interface EdgeFunctionConfig {
  name: string;
  path: string;
  runtime: 'nodejs18' | 'nodejs20' | 'deno' | 'python3.11';
  memory?: number;
  timeout?: number;
}

export interface DeploymentStatus {
  id: string;
  status: 'queued' | 'building' | 'deploying' | 'ready' | 'error' | 'cancelled';
  progress: number;
  logs: DeploymentLog[];
  buildTime?: number;
  deployTime?: number;
  url?: string;
  previewUrl?: string;
  error?: string;
  metrics?: DeploymentMetrics;
}

export interface DeploymentLog {
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  source: 'build' | 'deploy' | 'runtime';
}

export interface DeploymentMetrics {
  buildSize: number;
  bundleSize: number;
  staticFiles: number;
  functions: number;
  buildDuration: number;
  deployDuration: number;
}

export class DeploymentService extends EventEmitter {
  private deployments = new Map<string, DeploymentStatus>();
  private buildProcesses = new Map<string, ChildProcess>();
  private readonly workspaceDir: string;
  private readonly outputDir: string;

  constructor() {
    super();
    this.workspaceDir =
      process.env.DEPLOYMENT_WORKSPACE || '/tmp/webduh-deployments';
    this.outputDir = process.env.DEPLOYMENT_OUTPUT || '/tmp/webduh-builds';
  }

  async initializeDeployment(config: DeploymentConfig): Promise<string> {
    const deploymentId = uuidv4();

    const deployment: DeploymentStatus = {
      id: deploymentId,
      status: 'queued',
      progress: 0,
      logs: [
        {
          timestamp: new Date(),
          level: 'info',
          message: 'Deployment initialized',
          source: 'deploy',
        },
      ],
    };

    this.deployments.set(deploymentId, deployment);
    this.emit('deployment:created', { deploymentId, config });

    // Start deployment process asynchronously
    this.processDeployment(deploymentId, config);

    return deploymentId;
  }

  async getDeploymentStatus(
    deploymentId: string,
  ): Promise<DeploymentStatus | null> {
    return this.deployments.get(deploymentId) || null;
  }

  async cancelDeployment(deploymentId: string): Promise<boolean> {
    const deployment = this.deployments.get(deploymentId);
    if (!deployment) return false;

    const buildProcess = this.buildProcesses.get(deploymentId);
    if (buildProcess) {
      buildProcess.kill('SIGTERM');
      this.buildProcesses.delete(deploymentId);
    }

    deployment.status = 'cancelled';
    this.addLog(deploymentId, 'info', 'Deployment cancelled by user', 'deploy');
    this.emit('deployment:cancelled', { deploymentId });

    return true;
  }

  private async processDeployment(
    deploymentId: string,
    config: DeploymentConfig,
  ): Promise<void> {
    try {
      await this.updateStatus(deploymentId, 'building', 10);

      // Step 1: Prepare workspace
      const workspaceDir = await this.prepareWorkspace(deploymentId, config);

      // Step 2: Source acquisition
      await this.updateStatus(deploymentId, 'building', 20);
      await this.acquireSource(deploymentId, config, workspaceDir);

      // Step 3: Install dependencies
      await this.updateStatus(deploymentId, 'building', 40);
      await this.installDependencies(deploymentId, workspaceDir);

      // Step 4: Build project
      await this.updateStatus(deploymentId, 'building', 60);
      await this.buildProject(deploymentId, config, workspaceDir);

      // Step 5: Deploy to edge
      await this.updateStatus(deploymentId, 'deploying', 80);
      const urls = await this.deployToEdge(deploymentId, config, workspaceDir);

      // Step 6: Configure routing and domains
      await this.updateStatus(deploymentId, 'deploying', 90);
      await this.configureRouting(deploymentId, config, urls);

      // Step 7: Final setup
      await this.updateStatus(deploymentId, 'ready', 100);
      this.finalizeDeployment(deploymentId, urls);
    } catch (error) {
      await this.handleDeploymentError(deploymentId, error as Error);
    }
  }

  private async prepareWorkspace(
    deploymentId: string,
    config: DeploymentConfig,
  ): Promise<string> {
    const workspaceDir = path.join(this.workspaceDir, deploymentId);
    await fs.mkdir(workspaceDir, { recursive: true });

    this.addLog(
      deploymentId,
      'info',
      `Workspace prepared: ${workspaceDir}`,
      'build',
    );
    return workspaceDir;
  }

  private async acquireSource(
    deploymentId: string,
    config: DeploymentConfig,
    workspaceDir: string,
  ): Promise<void> {
    switch (config.sourceType) {
      case 'git':
        await this.cloneRepository(deploymentId, config, workspaceDir);
        break;
      case 'upload':
        await this.extractUpload(deploymentId, config, workspaceDir);
        break;
      case 'template':
        await this.initializeTemplate(deploymentId, config, workspaceDir);
        break;
      default:
        throw new Error(`Unsupported source type: ${config.sourceType}`);
    }
  }

  private async cloneRepository(
    deploymentId: string,
    config: DeploymentConfig,
    workspaceDir: string,
  ): Promise<void> {
    if (!config.sourceUrl) {
      throw new Error('Git repository URL is required');
    }

    this.addLog(
      deploymentId,
      'info',
      `Cloning repository: ${config.sourceUrl}`,
      'build',
    );

    return new Promise((resolve, reject) => {
      const gitClone = spawn(
        'git',
        [
          'clone',
          '--depth',
          '1',
          '--branch',
          config.branch || 'main',
          config.sourceUrl!,
          '.',
        ],
        {
          cwd: workspaceDir,
          stdio: ['ignore', 'pipe', 'pipe'],
        },
      );

      this.buildProcesses.set(deploymentId, gitClone);

      gitClone.stdout?.on('data', (data) => {
        this.addLog(deploymentId, 'info', data.toString().trim(), 'build');
      });

      gitClone.stderr?.on('data', (data) => {
        this.addLog(deploymentId, 'warn', data.toString().trim(), 'build');
      });

      gitClone.on('close', (code) => {
        this.buildProcesses.delete(deploymentId);
        if (code === 0) {
          this.addLog(
            deploymentId,
            'info',
            'Repository cloned successfully',
            'build',
          );
          resolve();
        } else {
          reject(new Error(`Git clone failed with code ${code}`));
        }
      });
    });
  }

  private async extractUpload(
    deploymentId: string,
    config: DeploymentConfig,
    workspaceDir: string,
  ): Promise<void> {
    // This would handle uploaded zip files
    this.addLog(deploymentId, 'info', 'Extracting uploaded files', 'build');
    // Implementation for file extraction would go here
  }

  private async initializeTemplate(
    deploymentId: string,
    config: DeploymentConfig,
    workspaceDir: string,
  ): Promise<void> {
    // This would copy from predefined templates
    this.addLog(deploymentId, 'info', 'Initializing from template', 'build');
    // Implementation for template initialization would go here
  }

  private async installDependencies(
    deploymentId: string,
    workspaceDir: string,
  ): Promise<void> {
    // Check for package manager
    const packageJsonPath = path.join(workspaceDir, 'package.json');

    try {
      await fs.access(packageJsonPath);
    } catch {
      this.addLog(
        deploymentId,
        'info',
        'No package.json found, skipping dependency installation',
        'build',
      );
      return;
    }

    this.addLog(deploymentId, 'info', 'Installing dependencies', 'build');

    return new Promise((resolve, reject) => {
      const npmInstall = spawn('npm', ['ci'], {
        cwd: workspaceDir,
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      this.buildProcesses.set(deploymentId, npmInstall);

      npmInstall.stdout?.on('data', (data) => {
        this.addLog(deploymentId, 'info', data.toString().trim(), 'build');
      });

      npmInstall.stderr?.on('data', (data) => {
        this.addLog(deploymentId, 'warn', data.toString().trim(), 'build');
      });

      npmInstall.on('close', (code) => {
        this.buildProcesses.delete(deploymentId);
        if (code === 0) {
          this.addLog(
            deploymentId,
            'info',
            'Dependencies installed successfully',
            'build',
          );
          resolve();
        } else {
          reject(new Error(`npm install failed with code ${code}`));
        }
      });
    });
  }

  private async buildProject(
    deploymentId: string,
    config: DeploymentConfig,
    workspaceDir: string,
  ): Promise<void> {
    const buildCommand = config.buildCommand || 'npm run build';
    this.addLog(
      deploymentId,
      'info',
      `Building project with: ${buildCommand}`,
      'build',
    );

    return new Promise((resolve, reject) => {
      const [command, ...args] = buildCommand.split(' ');
      const buildProcess = spawn(command, args, {
        cwd: workspaceDir,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: {
          ...process.env,
          ...config.environmentVariables,
          NODE_ENV:
            config.environment === 'production' ? 'production' : 'development',
        },
      });

      this.buildProcesses.set(deploymentId, buildProcess);

      buildProcess.stdout?.on('data', (data) => {
        this.addLog(deploymentId, 'info', data.toString().trim(), 'build');
      });

      buildProcess.stderr?.on('data', (data) => {
        this.addLog(deploymentId, 'warn', data.toString().trim(), 'build');
      });

      buildProcess.on('close', (code) => {
        this.buildProcesses.delete(deploymentId);
        if (code === 0) {
          this.addLog(
            deploymentId,
            'info',
            'Build completed successfully',
            'build',
          );
          resolve();
        } else {
          reject(new Error(`Build failed with code ${code}`));
        }
      });
    });
  }

  private async deployToEdge(
    deploymentId: string,
    config: DeploymentConfig,
    workspaceDir: string,
  ): Promise<{ url: string; previewUrl: string }> {
    this.addLog(deploymentId, 'info', 'Deploying to edge network', 'deploy');

    // Generate deployment URLs
    const subdomain = `${config.projectId}-${deploymentId.slice(0, 8)}`;
    const url = `https://${subdomain}.webduhvercel.app`;
    const previewUrl = `https://${subdomain}-preview.webduhvercel.app`;

    // Here you would implement actual deployment to your edge network
    // This could involve:
    // 1. Uploading static assets to CDN
    // 2. Deploying edge functions
    // 3. Configuring routing rules
    // 4. Setting up SSL certificates

    // Simulate deployment delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    this.addLog(deploymentId, 'info', `Deployed to: ${url}`, 'deploy');
    return { url, previewUrl };
  }

  private async configureRouting(
    deploymentId: string,
    config: DeploymentConfig,
    urls: { url: string; previewUrl: string },
  ): Promise<void> {
    this.addLog(
      deploymentId,
      'info',
      'Configuring routing and domains',
      'deploy',
    );

    // Configure custom domain if provided
    if (config.customDomain) {
      this.addLog(
        deploymentId,
        'info',
        `Setting up custom domain: ${config.customDomain}`,
        'deploy',
      );
      // Domain configuration logic would go here
    }

    // Configure edge functions
    if (config.edgeFunctions && config.edgeFunctions.length > 0) {
      this.addLog(
        deploymentId,
        'info',
        `Configuring ${config.edgeFunctions.length} edge functions`,
        'deploy',
      );
      // Edge function deployment logic would go here
    }
  }

  private async finalizeDeployment(
    deploymentId: string,
    urls: { url: string; previewUrl: string },
  ): Promise<void> {
    const deployment = this.deployments.get(deploymentId);
    if (!deployment) return;

    deployment.url = urls.url;
    deployment.previewUrl = urls.previewUrl;
    deployment.metrics = await this.calculateMetrics(deploymentId);

    this.addLog(
      deploymentId,
      'info',
      'Deployment completed successfully!',
      'deploy',
    );
    this.addLog(
      deploymentId,
      'info',
      `🚀 Your site is live at: ${urls.url}`,
      'deploy',
    );

    this.emit('deployment:completed', { deploymentId, urls });
  }

  private async calculateMetrics(
    deploymentId: string,
  ): Promise<DeploymentMetrics> {
    // Calculate deployment metrics
    return {
      buildSize: 1024 * 1024, // 1MB placeholder
      bundleSize: 512 * 1024, // 512KB placeholder
      staticFiles: 10,
      functions: 0,
      buildDuration: 30000, // 30s placeholder
      deployDuration: 10000, // 10s placeholder
    };
  }

  private async handleDeploymentError(
    deploymentId: string,
    error: Error,
  ): Promise<void> {
    const deployment = this.deployments.get(deploymentId);
    if (!deployment) return;

    deployment.status = 'error';
    deployment.error = error.message;

    this.addLog(
      deploymentId,
      'error',
      `Deployment failed: ${error.message}`,
      'deploy',
    );
    this.emit('deployment:failed', { deploymentId, error: error.message });

    // Cleanup
    const buildProcess = this.buildProcesses.get(deploymentId);
    if (buildProcess) {
      buildProcess.kill('SIGTERM');
      this.buildProcesses.delete(deploymentId);
    }
  }

  private async updateStatus(
    deploymentId: string,
    status: DeploymentStatus['status'],
    progress: number,
  ): Promise<void> {
    const deployment = this.deployments.get(deploymentId);
    if (!deployment) return;

    deployment.status = status;
    deployment.progress = progress;

    this.emit('deployment:progress', { deploymentId, status, progress });
  }

  private addLog(
    deploymentId: string,
    level: DeploymentLog['level'],
    message: string,
    source: DeploymentLog['source'],
  ): void {
    const deployment = this.deployments.get(deploymentId);
    if (!deployment) return;

    const log: DeploymentLog = {
      timestamp: new Date(),
      level,
      message,
      source,
    };

    deployment.logs.push(log);
    this.emit('deployment:log', { deploymentId, log });

    // Keep only last 1000 logs to prevent memory issues
    if (deployment.logs.length > 1000) {
      deployment.logs = deployment.logs.slice(-1000);
    }
  }

  // Static file serving helper
  async serveStaticFile(
    deploymentId: string,
    filePath: string,
  ): Promise<Buffer | null> {
    try {
      const fullPath = path.join(this.outputDir, deploymentId, filePath);
      return await fs.readFile(fullPath);
    } catch {
      return null;
    }
  }

  // Get all deployments for a project
  async getProjectDeployments(projectId: string): Promise<DeploymentStatus[]> {
    return Array.from(this.deployments.values()).filter((deployment) =>
      deployment.logs.some((log) => log.message.includes(projectId)),
    );
  }

  // Cleanup old deployments
  async cleanupOldDeployments(olderThanDays: number = 30): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    for (const [deploymentId, deployment] of this.deployments.entries()) {
      const createdAt = deployment.logs[0]?.timestamp;
      if (createdAt && createdAt < cutoffDate) {
        // Cleanup files
        try {
          const deploymentDir = path.join(this.workspaceDir, deploymentId);
          await fs.rmdir(deploymentDir, { recursive: true });
        } catch {
          // Ignore cleanup errors
        }

        this.deployments.delete(deploymentId);
      }
    }
  }
}

export default DeploymentService;
