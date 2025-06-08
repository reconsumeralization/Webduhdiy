// Bolt.DIY Integration Service
// Connects WebduhVercel Dashboard with the Bolt.DIY application

interface BoltDIYRequest {
  prompt: string;
  provider: string;
  model: string;
  projectType?: 'web' | 'mobile' | 'api' | 'fullstack';
  framework?: string;
}

interface BoltDIYResponse {
  success: boolean;
  data?: {
    projectUrl: string;
    files: Array<{
      name: string;
      content: string;
      type: string;
    }>;
    webContainerUrl?: string;
    previewUrl?: string;
  };
  error?: string;
}

export class BoltDIYIntegrationService {
  private readonly BOLT_DIY_URL = 'http://localhost:5173';

  async isServiceAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.BOLT_DIY_URL}/health`, {
        method: 'GET',
        timeout: 5000,
      } as RequestInit);
      return response.ok;
    } catch (error) {
      console.log('Bolt.DIY service not available:', error);
      return false;
    }
  }

  async createProject(request: BoltDIYRequest): Promise<BoltDIYResponse> {
    try {
      // First check if Bolt.DIY is available
      const isAvailable = await this.isServiceAvailable();
      if (!isAvailable) {
        return {
          success: false,
          error:
            'Bolt.DIY service is not available. Please ensure it is running on port 5173.',
        };
      }

      // Since Bolt.DIY doesn't have a direct API, we'll provide instructions
      // for users to open it manually and provide integration points
      return {
        success: true,
        data: {
          projectUrl: `${this.BOLT_DIY_URL}`,
          files: [],
          webContainerUrl: `${this.BOLT_DIY_URL}`,
          previewUrl: `${this.BOLT_DIY_URL}`,
        },
      };
    } catch (error) {
      console.error('Bolt.DIY integration request failed:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getServiceStatus(): Promise<{
    status: 'online' | 'offline';
    url: string;
    features: string[];
  }> {
    const isAvailable = await this.isServiceAvailable();

    return {
      status: isAvailable ? 'online' : 'offline',
      url: this.BOLT_DIY_URL,
      features: [
        'AI-powered full-stack development',
        'Multi-LLM support (OpenAI, Anthropic, Groq, Ollama)',
        'WebContainer integration',
        'Real-time code editing',
        'Live preview',
        'Project export',
        'GitHub integration',
        'Terminal access',
      ],
    };
  }

  // Helper method to create a prompt optimized for Bolt.DIY
  createOptimizedPrompt(
    description: string,
    framework?: string,
    features?: string[],
  ): string {
    let prompt = `Create a ${framework || 'modern web'} application: ${description}`;

    if (features && features.length > 0) {
      prompt += `\n\nKey features to include:\n${features.map((f) => `- ${f}`).join('\n')}`;
    }

    prompt += `\n\nPlease generate:
1. Complete, production-ready code
2. Modern best practices and clean architecture
3. Responsive design with proper styling
4. Error handling and validation
5. Clear file structure and documentation
6. Working functionality with proper state management`;

    if (framework) {
      prompt += `\n7. Use ${framework} conventions and best practices`;
    }

    return prompt;
  }

  // Integration with WebduhVercel project creation
  async integrateWithWebduhProject(
    projectName: string,
    boltDIYProjectData: any,
  ): Promise<{
    success: boolean;
    projectId?: string;
    deploymentUrl?: string;
    error?: string;
  }> {
    try {
      // This would integrate with the WebduhVercel project creation system
      // For now, return a placeholder response
      return {
        success: true,
        projectId: `bolt-${Date.now()}`,
        deploymentUrl: `https://${projectName}.webduh.app`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Integration failed',
      };
    }
  }
}

// Export singleton instance
export const boltDIYIntegration = new BoltDIYIntegrationService();

// Helper function to launch Bolt.DIY with a specific prompt
export function launchBoltDIYWithPrompt(prompt: string): string {
  const encodedPrompt = encodeURIComponent(prompt);
  return `${boltDIYIntegration['BOLT_DIY_URL']}?prompt=${encodedPrompt}`;
}

// Helper function to check if Bolt.DIY is configured properly
export async function checkBoltDIYSetup(): Promise<{
  isReady: boolean;
  missingRequirements: string[];
  recommendations: string[];
}> {
  const status = await boltDIYIntegration.getServiceStatus();
  const missingRequirements: string[] = [];
  const recommendations: string[] = [];

  if (status.status === 'offline') {
    missingRequirements.push('Bolt.DIY service not running on port 5173');
    recommendations.push('Run "npm run dev" in the apps/bolt-diy directory');
  }

  if (missingRequirements.length === 0) {
    recommendations.push('Configure API keys in Bolt.DIY for best experience');
    recommendations.push(
      'Consider setting up GitHub integration for project publishing',
    );
  }

  return {
    isReady: missingRequirements.length === 0,
    missingRequirements,
    recommendations,
  };
}
