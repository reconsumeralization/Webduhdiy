// AI Service for WebduhVercel Platform
// Integrates multiple LLM providers with search engine capabilities

interface LLMProvider {
  id: string;
  name: string;
  models: string[];
  apiKeyRequired: boolean;
  baseUrl?: string;
}

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: 'web' | 'github' | 'stackoverflow' | 'docs';
}

interface CodeGenerationRequest {
  prompt: string;
  provider: string;
  model: string;
  apiKey?: string;
  context?: string[];
  searchResults?: SearchResult[];
  files?: Array<{
    name: string;
    content: string;
    language: string;
  }>;
}

interface GeneratedFile {
  name: string;
  content: string;
  language: string;
  description?: string;
}

interface CodeGenerationResponse {
  success: boolean;
  message: string;
  files: GeneratedFile[];
  searchQueries?: string[];
  error?: string;
}

// LLM Providers Configuration
export const LLM_PROVIDERS: LLMProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    apiKeyRequired: true,
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    models: ['claude-3.5-sonnet', 'claude-3-opus', 'claude-3-haiku'],
    apiKeyRequired: true,
  },
  {
    id: 'groq',
    name: 'Groq',
    models: ['llama3-70b', 'mixtral-8x7b', 'gemma-7b'],
    apiKeyRequired: true,
  },
  {
    id: 'ollama',
    name: 'Ollama (Local)',
    models: ['llama3', 'codellama', 'mistral', 'qwen2.5-coder'],
    apiKeyRequired: false,
    baseUrl: 'http://localhost:11434',
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    models: [
      'llama-3.1-sonar-large-128k-online',
      'llama-3.1-sonar-small-128k-online',
    ],
    apiKeyRequired: true,
  },
];

// Search Engine Service
export class SearchEngineService {
  private readonly SEARCH_ENGINES = {
    web: 'https://api.search.brave.com/res/v1/web/search',
    github: 'https://api.github.com/search/repositories',
    stackoverflow: 'https://api.stackexchange.com/2.3/search',
  };

  async searchWeb(query: string, limit: number = 5): Promise<SearchResult[]> {
    try {
      // Using brave search API (you'll need to get API key)
      // For now, return mock results
      return this.getMockSearchResults(query, 'web', limit);
    } catch (error) {
      console.error('Web search failed:', error);
      return [];
    }
  }

  async searchGitHub(
    query: string,
    limit: number = 3,
  ): Promise<SearchResult[]> {
    try {
      const response = await fetch(
        `${this.SEARCH_ENGINES.github}?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=${limit}`,
      );
      const data = await response.json();

      return (
        data.items?.map((repo: any) => ({
          title: repo.full_name,
          url: repo.html_url,
          snippet: repo.description || 'No description available',
          source: 'github' as const,
        })) || []
      );
    } catch (error) {
      console.error('GitHub search failed:', error);
      return this.getMockSearchResults(query, 'github', limit);
    }
  }

  async searchStackOverflow(
    query: string,
    limit: number = 3,
  ): Promise<SearchResult[]> {
    try {
      const response = await fetch(
        `${this.SEARCH_ENGINES.stackoverflow}?order=desc&sort=relevance&intitle=${encodeURIComponent(query)}&site=stackoverflow&pagesize=${limit}`,
      );
      const data = await response.json();

      return (
        data.items?.map((item: any) => ({
          title: item.title,
          url: item.link,
          snippet:
            item.body_markdown?.substring(0, 200) + '...' ||
            'No content preview',
          source: 'stackoverflow' as const,
        })) || []
      );
    } catch (error) {
      console.error('StackOverflow search failed:', error);
      return this.getMockSearchResults(query, 'stackoverflow', limit);
    }
  }

  async searchDocumentation(
    query: string,
    limit: number = 3,
  ): Promise<SearchResult[]> {
    // Search through popular documentation sites
    return this.getMockSearchResults(query, 'docs', limit);
  }

  private getMockSearchResults(
    query: string,
    source: SearchResult['source'],
    limit: number,
  ): SearchResult[] {
    const mockResults: Record<SearchResult['source'], SearchResult[]> = {
      web: [
        {
          title: `${query} - Best Practices and Examples`,
          url: `https://example.com/search?q=${encodeURIComponent(query)}`,
          snippet: `Comprehensive guide on ${query} with modern approaches and implementation examples.`,
          source: 'web',
        },
        {
          title: `Modern ${query} Tutorial 2024`,
          url: `https://tutorial.com/${query.replace(/\s+/g, '-')}`,
          snippet: `Learn ${query} with step-by-step tutorials and real-world examples.`,
          source: 'web',
        },
      ],
      github: [
        {
          title: `awesome-${query.replace(/\s+/g, '-')}`,
          url: `https://github.com/awesome/${query.replace(/\s+/g, '-')}`,
          snippet: `A curated list of awesome ${query} resources, libraries, and tools.`,
          source: 'github',
        },
        {
          title: `${query}-starter-template`,
          url: `https://github.com/templates/${query.replace(/\s+/g, '-')}`,
          snippet: `Production-ready starter template for ${query} projects.`,
          source: 'github',
        },
      ],
      stackoverflow: [
        {
          title: `How to implement ${query} properly?`,
          url: `https://stackoverflow.com/questions/12345/how-to-implement-${query.replace(/\s+/g, '-')}`,
          snippet: `Question about best practices for implementing ${query} with detailed answers and code examples.`,
          source: 'stackoverflow',
        },
      ],
      docs: [
        {
          title: `${query} Documentation`,
          url: `https://docs.example.com/${query.replace(/\s+/g, '-')}`,
          snippet: `Official documentation for ${query} with API reference and guides.`,
          source: 'docs',
        },
      ],
    };

    return mockResults[source].slice(0, limit);
  }
}

// AI Code Generation Service
export class AICodeGenerationService {
  private searchEngine: SearchEngineService;

  constructor() {
    this.searchEngine = new SearchEngineService();
  }

  async generateCode(
    request: CodeGenerationRequest,
  ): Promise<CodeGenerationResponse> {
    try {
      // Step 1: Enhance prompt with search results
      const enhancedPrompt = await this.enhancePromptWithSearch(request.prompt);

      // Step 2: Generate code using selected LLM
      const generatedFiles = await this.callLLM({
        ...request,
        prompt: enhancedPrompt.prompt,
        searchResults: enhancedPrompt.searchResults,
      });

      return {
        success: true,
        message: 'Code generated successfully',
        files: generatedFiles,
        searchQueries: enhancedPrompt.queries,
      };
    } catch (error) {
      console.error('Code generation failed:', error);
      return {
        success: false,
        message: 'Failed to generate code',
        files: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async enhancePromptWithSearch(prompt: string): Promise<{
    prompt: string;
    searchResults: SearchResult[];
    queries: string[];
  }> {
    // Extract search queries from the prompt
    const queries = this.extractSearchQueries(prompt);
    const allSearchResults: SearchResult[] = [];

    // Perform searches
    for (const query of queries) {
      const [webResults, githubResults, stackResults] = await Promise.all([
        this.searchEngine.searchWeb(query, 2),
        this.searchEngine.searchGitHub(query, 2),
        this.searchEngine.searchStackOverflow(query, 1),
      ]);

      allSearchResults.push(...webResults, ...githubResults, ...stackResults);
    }

    // Enhance prompt with search context
    const searchContext = this.formatSearchContext(allSearchResults);
    const enhancedPrompt = `${prompt}

CONTEXT FROM SEARCH RESULTS:
${searchContext}

Please use this context to inform your code generation, incorporating best practices and modern approaches found in the search results.`;

    return {
      prompt: enhancedPrompt,
      searchResults: allSearchResults,
      queries,
    };
  }

  private extractSearchQueries(prompt: string): string[] {
    // Simple query extraction - can be enhanced with NLP
    const keywords = [
      'react',
      'nextjs',
      'typescript',
      'tailwind',
      'api',
      'database',
      'authentication',
      'deployment',
      'testing',
      'performance',
      'security',
      'ui components',
      'state management',
      'routing',
    ];

    const promptLower = prompt.toLowerCase();
    const foundKeywords = keywords.filter((keyword) =>
      promptLower.includes(keyword),
    );

    // Generate search queries
    const queries = [
      prompt.split(' ').slice(0, 5).join(' '), // First 5 words
      ...foundKeywords.map((keyword) => `${keyword} best practices`),
      ...foundKeywords.map((keyword) => `${keyword} tutorial examples`),
    ];

    return Array.from(new Set(queries)).slice(0, 3); // Remove duplicates and limit
  }

  private formatSearchContext(results: SearchResult[]): string {
    return results
      .map(
        (result, index) =>
          `${index + 1}. ${result.title} (${result.source})
   ${result.snippet}
   URL: ${result.url}`,
      )
      .join('\n\n');
  }

  private async callLLM(
    request: CodeGenerationRequest,
  ): Promise<GeneratedFile[]> {
    const { provider, model, apiKey, prompt } = request;

    switch (provider) {
      case 'openai':
        return this.callOpenAI(model, prompt, apiKey!);
      case 'anthropic':
        return this.callAnthropic(model, prompt, apiKey!);
      case 'groq':
        return this.callGroq(model, prompt, apiKey!);
      case 'ollama':
        return this.callOllama(model, prompt);
      case 'perplexity':
        return this.callPerplexity(model, prompt, apiKey!);
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  private async callOpenAI(
    model: string,
    prompt: string,
    apiKey: string,
  ): Promise<GeneratedFile[]> {
    // OpenAI implementation
    return this.simulateCodeGeneration(prompt, 'OpenAI');
  }

  private async callAnthropic(
    model: string,
    prompt: string,
    apiKey: string,
  ): Promise<GeneratedFile[]> {
    // Anthropic implementation
    return this.simulateCodeGeneration(prompt, 'Anthropic');
  }

  private async callGroq(
    model: string,
    prompt: string,
    apiKey: string,
  ): Promise<GeneratedFile[]> {
    // Groq implementation
    return this.simulateCodeGeneration(prompt, 'Groq');
  }

  private async callOllama(
    model: string,
    prompt: string,
  ): Promise<GeneratedFile[]> {
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt: this.createCodePrompt(prompt),
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Ollama request failed');
      }

      const result = await response.json();
      return this.parseGeneratedCode(result.response, 'Ollama');
    } catch (error) {
      console.error('Ollama call failed:', error);
      return this.simulateCodeGeneration(prompt, 'Ollama');
    }
  }

  private async callPerplexity(
    model: string,
    prompt: string,
    apiKey: string,
  ): Promise<GeneratedFile[]> {
    // Perplexity implementation with real-time search
    return this.simulateCodeGeneration(prompt, 'Perplexity');
  }

  private createCodePrompt(prompt: string): string {
    return `You are an expert full-stack developer. Create a complete, production-ready application based on this request: "${prompt}"

Please provide:
1. All necessary files with complete code
2. Modern best practices and patterns
3. Proper error handling and validation
4. Responsive design with Tailwind CSS
5. TypeScript for type safety

Format your response as structured code blocks with filenames.`;
  }

  private parseGeneratedCode(
    response: string,
    provider: string,
  ): GeneratedFile[] {
    // Parse LLM response to extract files
    // This is a simplified parser - enhance based on actual LLM response format
    const files: GeneratedFile[] = [];

    // Look for code blocks with filenames
    const codeBlockRegex = /```(?:(\w+)\s+)?([^\n]*)\n([\s\S]*?)```/g;
    let match;

    while ((match = codeBlockRegex.exec(response)) !== null) {
      const [, language, filename, content] = match;

      if (filename && content.trim()) {
        files.push({
          name: filename.trim() || `file.${language || 'txt'}`,
          content: content.trim(),
          language: language || this.detectLanguage(filename),
          description: `Generated by ${provider}`,
        });
      }
    }

    return files.length > 0
      ? files
      : this.simulateCodeGeneration(response, provider);
  }

  private detectLanguage(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const langMap: Record<string, string> = {
      ts: 'typescript',
      tsx: 'typescript',
      js: 'javascript',
      jsx: 'javascript',
      html: 'html',
      css: 'css',
      json: 'json',
      md: 'markdown',
      py: 'python',
      go: 'go',
      rs: 'rust',
    };
    return langMap[ext || ''] || 'text';
  }

  private simulateCodeGeneration(
    prompt: string,
    provider: string,
  ): GeneratedFile[] {
    // Fallback simulation for development
    const promptLower = prompt.toLowerCase();

    if (promptLower.includes('react') || promptLower.includes('component')) {
      return [
        {
          name: 'App.tsx',
          language: 'typescript',
          content: this.generateReactComponent(prompt),
          description: `React component generated by ${provider}`,
        },
        {
          name: 'styles.css',
          language: 'css',
          content: this.generateCSS(),
          description: `Styles generated by ${provider}`,
        },
      ];
    }

    if (promptLower.includes('api') || promptLower.includes('backend')) {
      return [
        {
          name: 'api.ts',
          language: 'typescript',
          content: this.generateAPI(prompt),
          description: `API endpoint generated by ${provider}`,
        },
      ];
    }

    return [
      {
        name: 'index.html',
        language: 'html',
        content: this.generateHTML(prompt),
        description: `HTML page generated by ${provider}`,
      },
    ];
  }

  private generateReactComponent(prompt: string): string {
    return `import React, { useState, useEffect } from 'react'

interface Props {
  title?: string
}

export default function GeneratedComponent({ title = "AI Generated Component" }: Props) {
  const [count, setCount] = useState(0)
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // Simulated data fetch
    setData([
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' }
    ])
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Interactive Counter</h2>
              <p className="text-gray-600 mb-4">Current count: {count}</p>
              <div className="space-x-2">
                <button 
                  onClick={() => setCount(count + 1)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Increment
                </button>
                <button 
                  onClick={() => setCount(0)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Data List</h2>
              <ul className="space-y-2">
                {data.map(item => (
                  <li key={item.id} className="bg-white p-2 rounded border">
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">
              ✨ This component was generated based on: "{prompt}"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}`;
  }

  private generateAPI(prompt: string): string {
    return `import { NextApiRequest, NextApiResponse } from 'next'

interface ApiResponse {
  success: boolean
  data?: any
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      return handleGet(req, res)
    case 'POST':
      return handlePost(req, res)
    case 'PUT':
      return handlePut(req, res)
    case 'DELETE':
      return handleDelete(req, res)
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
      return res.status(405).json({ 
        success: false, 
        error: \`Method \${req.method} Not Allowed\` 
      })
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    // Simulated data fetch
    const data = [
      { id: 1, name: 'Item 1', created: new Date().toISOString() },
      { id: 2, name: 'Item 2', created: new Date().toISOString() },
      { id: 3, name: 'Item 3', created: new Date().toISOString() }
    ]

    res.status(200).json({ success: true, data })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch data' 
    })
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    const { name } = req.body

    if (!name) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name is required' 
      })
    }

    // Simulated data creation
    const newItem = {
      id: Date.now(),
      name,
      created: new Date().toISOString()
    }

    res.status(201).json({ success: true, data: newItem })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create item' 
    })
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    const { id } = req.query
    const { name } = req.body

    if (!id || !name) {
      return res.status(400).json({ 
        success: false, 
        error: 'ID and name are required' 
      })
    }

    // Simulated data update
    const updatedItem = {
      id: Number(id),
      name,
      updated: new Date().toISOString()
    }

    res.status(200).json({ success: true, data: updatedItem })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update item' 
    })
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    const { id } = req.query

    if (!id) {
      return res.status(400).json({ 
        success: false, 
        error: 'ID is required' 
      })
    }

    // Simulated data deletion
    res.status(200).json({ 
      success: true, 
      data: { message: \`Item \${id} deleted successfully\` } 
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete item' 
    })
  }
}`;
  }

  private generateHTML(prompt: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Generated Page</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-gray-50">
    <div class="min-h-screen">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-6">
                    <h1 class="text-2xl font-bold text-gray-900">AI Generated Page</h1>
                    <nav class="space-x-6">
                        <a href="#home" class="text-gray-600 hover:text-blue-600">Home</a>
                        <a href="#about" class="text-gray-600 hover:text-blue-600">About</a>
                        <a href="#contact" class="text-gray-600 hover:text-blue-600">Contact</a>
                    </nav>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <!-- Hero Section -->
            <section class="text-center mb-16">
                <h2 class="text-4xl font-bold text-gray-900 mb-4">
                    Welcome to Your AI-Generated Website
                </h2>
                <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                    This page was automatically created based on your prompt: "${prompt}"
                </p>
                <button class="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Get Started
                </button>
            </section>

            <!-- Features Grid -->
            <section class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div class="bg-white p-6 rounded-xl shadow-sm border">
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Fast Performance</h3>
                    <p class="text-gray-600">Lightning-fast loading times with optimized code generation.</p>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-sm border">
                    <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Reliable Code</h3>
                    <p class="text-gray-600">Production-ready code with best practices built-in.</p>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-sm border">
                    <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M13 13h4a2 2 0 012 2v4a2 2 0 01-2 2h-4m-6-4a2 2 0 01-2-2V7a2 2 0 012-2h2m10 10l2.5 2.5"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">AI-Powered</h3>
                    <p class="text-gray-600">Intelligent code generation with modern frameworks.</p>
                </div>
            </section>

            <!-- Call to Action -->
            <section class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
                <h2 class="text-3xl font-bold mb-4">Ready to Build Something Amazing?</h2>
                <p class="text-xl mb-8 opacity-90">Start creating with AI-powered development tools.</p>
                <button class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Start Building Now
                </button>
            </section>
        </main>

        <!-- Footer -->
        <footer class="bg-gray-900 text-white py-12 mt-16">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center">
                    <p class="text-gray-400">
                        © 2024 AI Generated Website. Powered by WebduhVercel Platform.
                    </p>
                </div>
            </div>
        </footer>
    </div>

    <script>
        // Add interactivity
        document.addEventListener('DOMContentLoaded', function() {
            console.log('AI Generated page loaded successfully!');
            
            // Smooth scrolling for navigation links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });
        });
    </script>
</body>
</html>`;
  }

  private generateCSS(): string {
    return `/* AI Generated Styles */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --primary-color: #3b82f6;
  --secondary-color: #8b5cf6;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: var(--gray-800);
  background-color: var(--gray-50);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Utility Classes */
.btn {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: var(--gray-200);
  color: var(--gray-800);
}

.btn-secondary:hover {
  background-color: var(--gray-300);
}

.card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--gray-200);
  transition: all 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

.fade-in {
  animation: fadeIn 0.6s ease-out;
}

.slide-in {
  animation: slideIn 0.6s ease-out;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 0 0.5rem;
  }
  
  .btn {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
  }
  
  .card {
    padding: 1rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :root {
    --gray-50: #1f2937;
    --gray-100: #374151;
    --gray-200: #4b5563;
    --gray-300: #6b7280;
    --gray-400: #9ca3af;
    --gray-500: #d1d5db;
    --gray-600: #e5e7eb;
    --gray-700: #f3f4f6;
    --gray-800: #f9fafb;
    --gray-900: #ffffff;
  }
  
  body {
    background-color: var(--gray-50);
    color: var(--gray-800);
  }
  
  .card {
    background-color: var(--gray-100);
    border-color: var(--gray-200);
  }
}`;
  }
}

// Export instances
export const searchEngineService = new SearchEngineService();
export const aiCodeGenerationService = new AICodeGenerationService();

// Utility functions
export function isValidProvider(provider: string): boolean {
  return LLM_PROVIDERS.some((p) => p.id === provider);
}

export function getProviderModels(providerId: string): string[] {
  const provider = LLM_PROVIDERS.find((p) => p.id === providerId);
  return provider?.models || [];
}

export function requiresApiKey(providerId: string): boolean {
  const provider = LLM_PROVIDERS.find((p) => p.id === providerId);
  return provider?.apiKeyRequired || false;
}
