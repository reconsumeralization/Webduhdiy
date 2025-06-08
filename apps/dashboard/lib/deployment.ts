import { nanoid } from 'nanoid';

// Types
export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'Frontend' | 'Backend' | 'Full-Stack';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  technologies: string[];
  buildCommand?: string;
  startCommand?: string;
  installCommand?: string;
  framework?: string;
  buildTime: string;
  featured: boolean;
}

export interface Project {
  id: string;
  name: string;
  templateId?: string;
  gitUrl?: string;
  status: 'creating' | 'building' | 'deployed' | 'failed';
  deploymentUrl?: string;
  environmentVars: Record<string, string>;
  createdAt: string;
  lastDeployedAt?: string;
  buildLogs: string[];
  framework?: string;
  buildCommand?: string;
  installCommand?: string;
  rootDirectory?: string;
}

export interface DeploymentRequest {
  projectName: string;
  templateId?: string;
  gitUrl?: string;
  environmentVars?: Record<string, string>;
  buildCommand?: string;
  installCommand?: string;
  rootDirectory?: string;
}

// Template definitions
export const templates: Template[] = [
  {
    id: 'nextjs',
    name: 'Next.js',
    description:
      'Modern React framework with SSR, API routes, and built-in optimization',
    category: 'Frontend',
    difficulty: 'Beginner',
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    buildCommand: 'npm run build',
    startCommand: 'npm start',
    installCommand: 'npm install',
    framework: 'nextjs',
    buildTime: '2-3 min',
    featured: true,
  },
  {
    id: 'react-vite',
    name: 'React + Vite',
    description: 'Lightning-fast React development with Vite bundler',
    category: 'Frontend',
    difficulty: 'Beginner',
    technologies: ['React', 'Vite', 'TypeScript', 'CSS Modules'],
    buildCommand: 'npm run build',
    startCommand: 'npm run preview',
    installCommand: 'npm install',
    framework: 'vite',
    buildTime: '1-2 min',
    featured: true,
  },
  {
    id: 'nodejs-express',
    name: 'Node.js Express API',
    description:
      'Robust REST API with Express.js, authentication, and database integration',
    category: 'Backend',
    difficulty: 'Intermediate',
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'JWT'],
    buildCommand: 'npm run build',
    startCommand: 'npm start',
    installCommand: 'npm install',
    framework: 'nodejs',
    buildTime: '3-4 min',
    featured: true,
  },
  {
    id: 'static-html',
    name: 'Static Website',
    description:
      'Clean, responsive static website with modern CSS and JavaScript',
    category: 'Frontend',
    difficulty: 'Beginner',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    buildCommand: '',
    startCommand: '',
    installCommand: '',
    framework: 'static',
    buildTime: '30s',
    featured: false,
  },
];

// Mock storage (in production, this would be a database)
let projects: Project[] = [];

// Deployment service
export class DeploymentService {
  static async createProject(request: DeploymentRequest): Promise<Project> {
    const projectId = nanoid(12);
    const project: Project = {
      id: projectId,
      name: request.projectName,
      templateId: request.templateId,
      gitUrl: request.gitUrl,
      status: 'creating',
      environmentVars: request.environmentVars || {},
      createdAt: new Date().toISOString(),
      buildLogs: [],
      buildCommand: request.buildCommand,
      installCommand: request.installCommand,
      rootDirectory: request.rootDirectory,
    };

    // Add to projects array
    projects.push(project);

    // Start deployment process (async)
    this.deployProject(project);

    return project;
  }

  static async deployProject(project: Project): Promise<void> {
    try {
      // Update status to building
      this.updateProjectStatus(project.id, 'building');
      this.addBuildLog(
        project.id,
        `Starting deployment for project: ${project.name}`,
      );

      if (project.templateId) {
        await this.deployFromTemplate(project);
      } else if (project.gitUrl) {
        await this.deployFromGit(project);
      } else {
        throw new Error('No template or Git URL provided');
      }

      // Simulate deployment completion
      await this.simulateDeployment(project);

      // Update status to deployed
      this.updateProjectStatus(project.id, 'deployed');
      this.updateDeploymentUrl(
        project.id,
        `https://${project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.webduh.app`,
      );
      this.addBuildLog(project.id, '✅ Deployment completed successfully!');

      // Update last deployed time
      const projectIndex = projects.findIndex((p) => p.id === project.id);
      if (projectIndex !== -1) {
        projects[projectIndex].lastDeployedAt = new Date().toISOString();
      }
    } catch (error) {
      this.updateProjectStatus(project.id, 'failed');
      this.addBuildLog(
        project.id,
        `❌ Deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  private static async deployFromTemplate(project: Project): Promise<void> {
    const template = templates.find((t) => t.id === project.templateId);
    if (!template) {
      throw new Error(`Template not found: ${project.templateId}`);
    }

    this.addBuildLog(project.id, `📦 Using template: ${template.name}`);
    this.addBuildLog(project.id, `🔧 Framework: ${template.framework}`);
    this.addBuildLog(
      project.id,
      `📚 Technologies: ${template.technologies.join(', ')}`,
    );

    // Set framework and commands from template
    const projectIndex = projects.findIndex((p) => p.id === project.id);
    if (projectIndex !== -1) {
      projects[projectIndex].framework = template.framework;
      projects[projectIndex].buildCommand = template.buildCommand;
      projects[projectIndex].installCommand = template.installCommand;
    }

    // Simulate template copying
    await this.delay(1000);
    this.addBuildLog(project.id, '📁 Copying template files...');

    await this.delay(1500);
    this.addBuildLog(project.id, '🔧 Setting up project structure...');

    if (template.installCommand) {
      await this.delay(2000);
      this.addBuildLog(project.id, `📦 Running: ${template.installCommand}`);
      this.addBuildLog(project.id, '⬇️  Installing dependencies...');
    }

    if (template.buildCommand) {
      await this.delay(3000);
      this.addBuildLog(project.id, `🔨 Running: ${template.buildCommand}`);
      this.addBuildLog(project.id, '🏗️  Building project...');
    }
  }

  private static async deployFromGit(project: Project): Promise<void> {
    if (!project.gitUrl) {
      throw new Error('Git URL is required');
    }

    this.addBuildLog(project.id, `📡 Cloning repository: ${project.gitUrl}`);

    await this.delay(2000);
    this.addBuildLog(project.id, '📁 Repository cloned successfully');

    // Auto-detect framework
    const detectedFramework = this.detectFramework(project.gitUrl);
    const projectIndex = projects.findIndex((p) => p.id === project.id);
    if (projectIndex !== -1) {
      projects[projectIndex].framework = detectedFramework;
    }

    this.addBuildLog(project.id, `🔍 Detected framework: ${detectedFramework}`);

    // Install dependencies
    const installCommand = project.installCommand || 'npm install';
    await this.delay(3000);
    this.addBuildLog(project.id, `📦 Running: ${installCommand}`);
    this.addBuildLog(project.id, '⬇️  Installing dependencies...');

    // Build project
    const buildCommand =
      project.buildCommand || this.getDefaultBuildCommand(detectedFramework);
    if (buildCommand) {
      await this.delay(4000);
      this.addBuildLog(project.id, `🔨 Running: ${buildCommand}`);
      this.addBuildLog(project.id, '🏗️  Building project...');
    }
  }

  private static async simulateDeployment(project: Project): Promise<void> {
    await this.delay(1000);
    this.addBuildLog(project.id, '🚀 Preparing deployment...');

    await this.delay(1500);
    this.addBuildLog(project.id, '☁️  Uploading to CDN...');

    await this.delay(2000);
    this.addBuildLog(project.id, '🌐 Configuring domains...');

    await this.delay(1000);
    this.addBuildLog(project.id, '🔒 Setting up SSL certificate...');

    await this.delay(500);
    this.addBuildLog(project.id, '⚡ Optimizing assets...');
  }

  private static detectFramework(gitUrl: string): string {
    // Simple framework detection based on URL patterns
    if (gitUrl.includes('next') || gitUrl.includes('nextjs')) return 'nextjs';
    if (gitUrl.includes('react')) return 'react';
    if (gitUrl.includes('vue')) return 'vue';
    if (gitUrl.includes('svelte')) return 'svelte';
    if (gitUrl.includes('angular')) return 'angular';
    if (gitUrl.includes('express') || gitUrl.includes('node')) return 'nodejs';
    return 'static';
  }

  private static getDefaultBuildCommand(framework: string): string {
    switch (framework) {
      case 'nextjs':
        return 'npm run build';
      case 'react':
        return 'npm run build';
      case 'vue':
        return 'npm run build';
      case 'svelte':
        return 'npm run build';
      case 'angular':
        return 'npm run build';
      case 'nodejs':
        return 'npm run build';
      default:
        return '';
    }
  }

  private static updateProjectStatus(
    projectId: string,
    status: Project['status'],
  ): void {
    const projectIndex = projects.findIndex((p) => p.id === projectId);
    if (projectIndex !== -1) {
      projects[projectIndex].status = status;
    }
  }

  private static updateDeploymentUrl(projectId: string, url: string): void {
    const projectIndex = projects.findIndex((p) => p.id === projectId);
    if (projectIndex !== -1) {
      projects[projectIndex].deploymentUrl = url;
    }
  }

  private static addBuildLog(projectId: string, message: string): void {
    const projectIndex = projects.findIndex((p) => p.id === projectId);
    if (projectIndex !== -1) {
      const timestamp = new Date().toISOString();
      projects[projectIndex].buildLogs.push(`[${timestamp}] ${message}`);
    }
  }

  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async getProject(projectId: string): Promise<Project | null> {
    return projects.find((p) => p.id === projectId) || null;
  }

  static async getProjects(): Promise<Project[]> {
    return projects.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  static async getTemplate(templateId: string): Promise<Template | null> {
    return templates.find((t) => t.id === templateId) || null;
  }

  static async getTemplates(): Promise<Template[]> {
    return templates;
  }

  static async deleteProject(projectId: string): Promise<boolean> {
    const initialLength = projects.length;
    projects = projects.filter((p) => p.id !== projectId);
    return projects.length < initialLength;
  }

  static async updateProject(
    projectId: string,
    updates: Partial<Project>,
  ): Promise<Project | null> {
    const projectIndex = projects.findIndex((p) => p.id === projectId);
    if (projectIndex !== -1) {
      projects[projectIndex] = { ...projects[projectIndex], ...updates };
      return projects[projectIndex];
    }
    return null;
  }

  // Environment variable management
  static async updateEnvironmentVariables(
    projectId: string,
    envVars: Record<string, string>,
  ): Promise<boolean> {
    const projectIndex = projects.findIndex((p) => p.id === projectId);
    if (projectIndex !== -1) {
      projects[projectIndex].environmentVars = envVars;
      this.addBuildLog(projectId, '🔧 Environment variables updated');
      return true;
    }
    return false;
  }

  // Redeploy project
  static async redeployProject(projectId: string): Promise<boolean> {
    const project = await this.getProject(projectId);
    if (!project) return false;

    project.buildLogs = [];
    this.addBuildLog(projectId, '🔄 Starting redeployment...');
    this.deployProject(project);
    return true;
  }

  // Get build logs in real-time
  static async getBuildLogs(projectId: string): Promise<string[]> {
    const project = await this.getProject(projectId);
    return project?.buildLogs || [];
  }
}

// Initialize with some sample projects for demo
DeploymentService.createProject({
  projectName: 'my-next-app',
  templateId: 'nextjs',
  environmentVars: {
    NODE_ENV: 'production',
    API_URL: 'https://api.example.com',
  },
});

DeploymentService.createProject({
  projectName: 'company-website',
  templateId: 'static-html',
});

export default DeploymentService;
