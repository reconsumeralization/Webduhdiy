// WebduhBuilder Advanced Service
// Connects WebduhVercel with the webduh-builder service on port 5000

interface EnhancedRequest {
  prompt: string;
  provider: string;
  model: string;
  searchContext?: boolean;
  includeImages?: boolean;
}

interface EnhancedResponse {
  success: boolean;
  data?: {
    generatedCode: string;
    searchResults: Array<{
      title: string;
      url: string;
      snippet: string;
      source: string;
    }>;
    metadata: {
      tokensUsed: number;
      processingTime: number;
      provider: string;
      model: string;
    };
  };
  error?: string;
}

export class WebduhBuilderService {
  private readonly BASE_URL = 'http://localhost:5000';
  private readonly ENDPOINTS = {
    generate: '/webduh-builder',
    search: '/search',
    status: '/status',
  };

  async isServiceAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.BASE_URL}${this.ENDPOINTS.status}`, {
        method: 'GET',
        timeout: 5000,
      } as RequestInit);
      return response.ok;
    } catch (error) {
      console.log('WebduhBuilder service not available:', error);
      return false;
    }
  }

  async generateCode(request: EnhancedRequest): Promise<EnhancedResponse> {
    try {
      const response = await fetch(
        `${this.BASE_URL}${this.ENDPOINTS.generate}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            prompt: request.prompt,
            provider: request.provider,
            model: request.model,
            searchContext: request.searchContext ?? true,
            includeImages: request.includeImages ?? false,
            platform: 'webduh-vercel',
            timestamp: new Date().toISOString(),
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data: {
          generatedCode: data.code || data.generatedCode || '',
          searchResults: data.searchResults || [],
          metadata: {
            tokensUsed: data.tokensUsed || 0,
            processingTime: data.processingTime || 0,
            provider: data.provider || request.provider,
            model: data.model || request.model,
          },
        },
      };
    } catch (error) {
      console.error('WebduhBuilder request failed:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async searchWeb(
    query: string,
    limit: number = 5,
  ): Promise<
    Array<{
      title: string;
      url: string;
      snippet: string;
      source: string;
    }>
  > {
    try {
      const response = await fetch(`${this.BASE_URL}${this.ENDPOINTS.search}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          limit,
          sources: ['web', 'github', 'stackoverflow', 'docs'],
        }),
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Enhanced search failed:', error);
      return [];
    }
  }

  async healthCheck(): Promise<{
    status: 'online' | 'offline';
    version?: string;
    capabilities?: string[];
    uptime?: number;
  }> {
    try {
      const response = await fetch(`${this.BASE_URL}${this.ENDPOINTS.status}`);

      if (!response.ok) {
        return { status: 'offline' };
      }

      const data = await response.json();
      return {
        status: 'online',
        version: data.version || '1.0.0',
        capabilities: data.capabilities || [
          'code-generation',
          'search',
          'multi-llm',
        ],
        uptime: data.uptime || 0,
      };
    } catch (error) {
      return { status: 'offline' };
    }
  }

  // Real-time code generation with streaming
  async generateCodeStream(
    request: EnhancedRequest,
    onChunk: (chunk: string) => void,
    onComplete: (result: EnhancedResponse) => void,
  ): Promise<void> {
    try {
      const response = await fetch(
        `${this.BASE_URL}${this.ENDPOINTS.generate}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
          },
          body: JSON.stringify({
            ...request,
            stream: true,
            platform: 'webduh-vercel',
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Stream failed: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              onComplete({ success: true });
              return;
            }

            try {
              const chunk = JSON.parse(data);
              if (chunk.content) {
                onChunk(chunk.content);
              }
            } catch (error) {
              onChunk(data);
            }
          }
        }
      }

      onComplete({ success: true });
    } catch (error) {
      console.error('Stream generation failed:', error);
      onComplete({
        success: false,
        error: error instanceof Error ? error.message : 'Stream failed',
      });
    }
  }
}

// Export singleton instance
export const webduhBuilderService = new WebduhBuilderService();

// Integration helpers
export async function connectToWebduhBuilder(): Promise<boolean> {
  const isAvailable = await webduhBuilderService.isServiceAvailable();

  if (isAvailable) {
    console.log('🚀 WebduhBuilder service connected successfully!');

    // Log service capabilities
    const health = await webduhBuilderService.healthCheck();
    console.log('Service status:', health);

    return true;
  } else {
    console.log(
      '⚠️ WebduhBuilder service not available - using fallback AI service',
    );
    return false;
  }
}

export function createEnhancedPrompt(
  prompt: string,
  context?: string[],
): EnhancedRequest {
  return {
    prompt: `
Enhanced WebduhVercel AI Builder Request:
${prompt}

${
  context && context.length > 0
    ? `
Additional Context:
${context.join('\n')}
`
    : ''
}

Please generate:
1. Complete, production-ready code
2. Modern best practices
3. Proper error handling
4. Responsive design with Tailwind CSS
5. TypeScript for type safety
6. Include search-enhanced context from web results

Platform: WebduhVercel
Framework Preference: Next.js 14, React 18, TypeScript
Styling: Tailwind CSS
Requirements: Modern, accessible, responsive, performant
`,
    provider: 'anthropic',
    model: 'claude-3.5-sonnet',
    searchContext: true,
    includeImages: false,
  };
}
