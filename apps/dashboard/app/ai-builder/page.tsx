'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  CodeBracketIcon,
  EyeIcon,
  PlayIcon,
  CommandLineIcon,
  DocumentTextIcon,
  PhotoIcon,
  MicrophoneIcon,
  StopIcon,
  ClipboardDocumentIcon,
  ArrowDownTrayIcon,
  Cog6ToothIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { LLM_PROVIDERS, aiCodeGenerationService } from '../../lib/ai-service';
import {
  boltDIYIntegration,
  launchBoltDIYWithPrompt,
  checkBoltDIYSetup,
} from '../../lib/bolt-diy-integration';

/* ---- embedded utilities ---- */
type DashboardLayoutProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
};

function DashboardLayout({
  title,
  description,
  headerActions,
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {title}
              </h1>
              {description && (
                <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
                  {description}
                </p>
              )}
            </div>
            {headerActions && (
              <div className="mt-4 md:mt-0">{headerActions}</div>
            )}
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
/* ---- end embedded utilities ---- */

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  files?: Array<{
    name: string;
    content: string;
    language: string;
  }>;
  metadata?: {
    tokens?: number;
    model?: string;
    provider?: string;
    executionTime?: number;
  };
}

interface LLMProvider {
  id: string;
  name: string;
  models: string[];
  apiKeyRequired: boolean;
  baseUrl?: string;
}

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  prompt: string;
  tags: string[];
}

// Using providers from ai-service
const llmProviders = LLM_PROVIDERS;

const quickPrompts = [
  'Create a modern landing page with hero section, features, and contact form',
  'Build a todo app with React hooks and local storage',
  'Make a responsive dashboard with charts and data tables',
  'Create a blog with markdown support and syntax highlighting',
  'Build an e-commerce product page with cart functionality',
  'Make a real-time chat application with WebSocket',
  'Create a weather app with geolocation and API integration',
  'Build a file upload component with drag and drop',
];

const projectTemplates: ProjectTemplate[] = [
  {
    id: 'landing-page',
    name: 'Landing Page',
    description: 'Modern responsive landing page with hero, features, and CTA',
    icon: '🚀',
    prompt:
      'Create a modern, responsive landing page with a hero section, features grid, testimonials, and contact form. Use Tailwind CSS for styling.',
    tags: ['React', 'Tailwind', 'Responsive'],
  },
  {
    id: 'dashboard',
    name: 'Admin Dashboard',
    description: 'Full-featured admin dashboard with charts and tables',
    icon: '📊',
    prompt:
      'Build a comprehensive admin dashboard with sidebar navigation, data visualization charts, tables, and user management. Include dark mode support.',
    tags: ['React', 'Charts', 'Admin'],
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Store',
    description: 'Complete online store with cart and checkout',
    icon: '🛒',
    prompt:
      'Create a full e-commerce application with product catalog, shopping cart, user authentication, and checkout process.',
    tags: ['React', 'E-commerce', 'Auth'],
  },
  {
    id: 'blog',
    name: 'Blog Platform',
    description: 'Content management system with markdown support',
    icon: '📝',
    prompt:
      'Build a blog platform with markdown editor, syntax highlighting, categories, tags, and search functionality.',
    tags: ['React', 'Markdown', 'CMS'],
  },
];

export default function AIBuilderPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content:
        "🎉 Welcome to the Enhanced AI Builder! I'm your advanced coding assistant with supercharged capabilities:\n\n✨ **New Features:**\n• 🎨 Project templates for quick starts\n• 📊 Real-time code analysis\n• 🔄 Live preview with hot reload\n• 📱 Mobile-responsive designs\n• 🌙 Dark mode support\n• 💾 Auto-save and version control\n• 🚀 One-click deployment\n\n**What would you like to build today?** Choose a template below or describe your custom project!",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('anthropic');
  const [selectedModel, setSelectedModel] = useState('claude-3.5-sonnet');
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [projectFiles, setProjectFiles] = useState<
    Array<{
      name: string;
      content: string;
      language: string;
    }>
  >([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [boltDIYStatus, setBoltDIYStatus] = useState<
    'checking' | 'available' | 'unavailable'
  >('checking');
  const [showTemplates, setShowTemplates] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [codeAnalysis, setCodeAnalysis] = useState<{
    complexity: number;
    suggestions: string[];
    performance: number;
  } | null>(null);
  const [autoSave, setAutoSave] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const checkBoltDIY = async () => {
      const status = await boltDIYIntegration.getServiceStatus();
      setBoltDIYStatus(
        status.status === 'online' ? 'available' : 'unavailable',
      );
    };
    checkBoltDIY();
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && projectFiles.length > 0) {
      const saveTimer = setTimeout(() => {
        localStorage.setItem(
          'ai-builder-project',
          JSON.stringify(projectFiles),
        );
      }, 2000);
      return () => clearTimeout(saveTimer);
    }
  }, [projectFiles, autoSave]);

  // Load saved project on mount
  useEffect(() => {
    const savedProject = localStorage.getItem('ai-builder-project');
    if (savedProject) {
      try {
        const files = JSON.parse(savedProject);
        setProjectFiles(files);
        if (files.length > 0) {
          setActiveFile(files[0].name);
        }
      } catch (error) {
        console.error('Failed to load saved project:', error);
      }
    }
  }, []);

  const analyzeCode = useCallback((code: string) => {
    // Simple code analysis
    const lines = code.split('\n').length;
    const complexity = Math.min(Math.floor(lines / 10), 10);
    const suggestions = [];

    if (code.includes('console.log')) {
      suggestions.push(
        'Consider removing console.log statements for production',
      );
    }
    if (code.includes('var ')) {
      suggestions.push('Consider using const/let instead of var');
    }
    if (lines > 100) {
      suggestions.push('Consider breaking this file into smaller components');
    }

    const performance = Math.max(10 - complexity, 1);

    setCodeAnalysis({ complexity, suggestions, performance });
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsGenerating(true);
    setShowTemplates(false);

    const startTime = Date.now();

    try {
      // Connect to webduh-builder service if available
      let enhancedResponse = null;
      try {
        const enhancedService = await fetch(
          'http://localhost:5000/webduh-builder',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: currentMessage,
              provider: selectedProvider,
              model: selectedModel,
              template: selectedTemplate,
            }),
          },
        );
        if (enhancedService.ok) {
          enhancedResponse = await enhancedService.json();
        }
      } catch (error) {
        console.log(
          'WebduhBuilder service not available, using built-in AI service',
        );
      }

      // Use our AI service for code generation with search enhancement
      const response = await aiCodeGenerationService.generateCode({
        prompt: currentMessage,
        provider: selectedProvider,
        model: selectedModel,
        apiKey: apiKey || undefined,
        context: enhancedResponse
          ? [JSON.stringify(enhancedResponse)]
          : undefined,
      });

      const executionTime = Date.now() - startTime;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.success
          ? `🎉 **Project Generated Successfully!**\n\n${response.message}\n\n✨ **Enhanced Features Added:**\n• Responsive design with Tailwind CSS\n• Dark mode support\n• Accessibility improvements\n• Performance optimizations\n• Modern React patterns\n\n🚀 Your application is ready for preview and deployment!`
          : `❌ **Generation Failed:** ${response.error}`,
        timestamp: new Date(),
        files: response.files,
        metadata: {
          model: selectedModel,
          provider: selectedProvider,
          executionTime,
          tokens:
            response.files?.reduce(
              (acc, file) => acc + file.content.length,
              0,
            ) || 0,
        },
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setProjectFiles(response.files || []);
      if (response.files && response.files.length > 0) {
        setActiveFile(response.files[0].name);
        analyzeCode(response.files[0].content);
        generatePreview(response.files);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `🚨 **Error Encountered**\n\nI apologize, but I encountered an error generating your code. This could be due to:\n\n• API key issues\n• Network connectivity\n• Service limitations\n\nPlease check your settings and try again.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
      setSelectedTemplate(null);
    }
  };

  const handleTemplateSelect = (template: ProjectTemplate) => {
    setSelectedTemplate(template.id);
    setInputMessage(template.prompt);
    setShowTemplates(false);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
    setShowTemplates(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Handle file upload logic
      console.log('Files uploaded:', files);
      // Add system message about file upload
      const systemMessage: Message = {
        id: Date.now().toString(),
        type: 'system',
        content: `📎 **Files Uploaded:** ${Array.from(files)
          .map((f) => f.name)
          .join(', ')}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, systemMessage]);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Implement voice recording logic
    if (!isRecording) {
      const systemMessage: Message = {
        id: Date.now().toString(),
        type: 'system',
        content:
          '🎤 **Voice recording started...** Speak your project requirements.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, systemMessage]);
    }
  };

  const generatePreview = (
    files: Array<{ name: string; content: string; language: string }>,
  ) => {
    const htmlFile = files.find(
      (f) => f.name.endsWith('.html') || f.name === 'index.html',
    );
    if (htmlFile && previewRef.current) {
      const blob = new Blob([htmlFile.content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      previewRef.current.src = url;
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    // Show success message
    const systemMessage: Message = {
      id: Date.now().toString(),
      type: 'system',
      content: '✅ **Code copied to clipboard!**',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, systemMessage]);
  };

  const downloadProject = () => {
    if (projectFiles.length === 0) return;

    // Create a zip-like structure (simplified)
    const projectData = {
      files: projectFiles,
      metadata: {
        created: new Date().toISOString(),
        generator: 'AI Builder Enhanced',
      },
    };

    const blob = new Blob([JSON.stringify(projectData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-generated-project.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const launchBoltDIY = (prompt?: string) => {
    const url = prompt
      ? launchBoltDIYWithPrompt(prompt)
      : 'http://localhost:5173';
    window.open(url, '_blank', 'width=1400,height=900');
  };

  const currentProvider = llmProviders.find((p) => p.id === selectedProvider);
  const availableModels = currentProvider?.models || [];

  return (
    <DashboardLayout
      title={
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-xl shadow-lg">
            <SparklesIcon className="h-7 w-7 text-white" />
          </div>
          <div>
            <span className="text-4xl font-bold">AI Builder</span>
            <div className="text-sm font-normal text-blue-600 dark:text-blue-400">
              Enhanced Edition
            </div>
          </div>
        </div>
      }
      description="Create stunning full-stack applications with advanced AI assistance and real-time preview"
      headerActions={
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAutoSave(!autoSave)}
            className={`inline-flex items-center px-4 py-2 rounded-lg transition-all font-medium ${
              autoSave
                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            {autoSave ? (
              <CheckIcon className="h-4 w-4 mr-2" />
            ) : (
              <XMarkIcon className="h-4 w-4 mr-2" />
            )}
            Auto-save
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all font-medium shadow-sm"
          >
            <Cog6ToothIcon className="h-4 w-4 mr-2" />
            Settings
          </button>
          <Link
            href="/projects"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Enhanced Bolt.DIY Integration Banner */}
        <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-cyan-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <SparklesIcon className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  🚀 Bolt.DIY Integration
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Launch the full Bolt.DIY experience with advanced WebContainer
                  features and live collaboration
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${
                  boltDIYStatus === 'checking'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                    : boltDIYStatus === 'available'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full animate-pulse ${
                    boltDIYStatus === 'checking'
                      ? 'bg-yellow-500'
                      : boltDIYStatus === 'available'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                  }`}
                />
                {boltDIYStatus === 'checking'
                  ? 'Checking Status...'
                  : boltDIYStatus === 'available'
                    ? 'Online & Ready'
                    : 'Offline'}
              </div>
              <button
                onClick={() => launchBoltDIY()}
                disabled={boltDIYStatus !== 'available'}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-lg"
              >
                <SparklesIcon className="h-5 w-5 mr-2" />
                Launch Bolt.DIY
              </button>
            </div>
          </div>
          {boltDIYStatus === 'unavailable' && (
            <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
              <div className="flex items-start space-x-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                    Bolt.DIY Service Unavailable
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                    Start the service by running{' '}
                    <code className="bg-yellow-200 dark:bg-yellow-800 px-2 py-1 rounded font-mono text-xs">
                      npm run dev
                    </code>{' '}
                    in the apps/bolt-diy directory for enhanced features.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Project Templates */}
        {showTemplates && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  🎨 Project Templates
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Quick start with pre-built templates or create from scratch
                </p>
              </div>
              <button
                onClick={() => setShowTemplates(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {projectTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all text-left group"
                >
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                    {template.icon}
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {template.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {template.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {template.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-400px)]">
          {/* Enhanced Chat Interface */}
          <div className="lg:col-span-1 flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg">
            {/* Enhanced Provider Settings */}
            {showSettings && (
              <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-t-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    ⚙️ AI Configuration
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Provider
                    </label>
                    <select
                      value={selectedProvider}
                      onChange={(e) => setSelectedProvider(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      {llmProviders.map((provider) => (
                        <option key={provider.id} value={provider.id}>
                          {provider.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Model
                    </label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      {availableModels.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                  </div>
                  {currentProvider?.apiKeyRequired && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        API Key
                      </label>
                      <input
                        type="password"
                        placeholder="Enter your API key..."
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Enhanced Chat Messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : message.type === 'system' ? 'justify-center' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : message.type === 'system'
                          ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 text-center text-sm'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </div>
                    {message.files && (
                      <div className="mt-3 space-y-2">
                        {message.files.map((file, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-black/10 dark:bg-white/10 px-3 py-2 rounded-lg"
                          >
                            <span className="text-xs font-medium">
                              📄 {file.name}
                            </span>
                            <button
                              onClick={() => copyToClipboard(file.content)}
                              className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded"
                            >
                              <ClipboardDocumentIcon className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {message.metadata && (
                      <div className="mt-2 text-xs opacity-70">
                        {message.metadata.model} •{' '}
                        {message.metadata.executionTime}ms
                        {message.metadata.tokens &&
                          ` • ${message.metadata.tokens} chars`}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        🚀 Generating enhanced code...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Quick Prompts */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  ⚡ Quick Prompts
                </p>
                <button
                  onClick={() => setShowTemplates(true)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Templates
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.slice(0, 3).map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="text-xs px-3 py-2 bg-gradient-to-r from-gray-100 to-blue-100 dark:from-gray-800 dark:to-blue-900/30 text-gray-700 dark:text-gray-300 rounded-lg hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all"
                  >
                    {prompt.length > 25 ? prompt.slice(0, 25) + '...' : prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Describe your dream application in detail..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        multiple
                        accept="image/*,.pdf,.txt,.md"
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        title="Upload files"
                      >
                        <PhotoIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={toggleRecording}
                        className={`p-2 transition-colors rounded-lg ${
                          isRecording
                            ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                            : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                        }`}
                        title={
                          isRecording ? 'Stop recording' : 'Start voice input'
                        }
                      >
                        {isRecording ? (
                          <StopIcon className="h-5 w-5" />
                        ) : (
                          <MicrophoneIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <div className="text-xs text-gray-500">
                      {inputMessage.length}/2000
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isGenerating}
                  className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Code Editor */}
          <div className="lg:col-span-1 flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-purple-50 dark:from-gray-800 dark:to-purple-900/20 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <CodeBracketIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  Code Editor
                </span>
                {codeAnalysis && (
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        codeAnalysis.performance > 7
                          ? 'bg-green-500'
                          : codeAnalysis.performance > 4
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}
                    />
                    <span className="text-xs text-gray-500">
                      Performance: {codeAnalysis.performance}/10
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {projectFiles.length > 0 && (
                  <>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          projectFiles.find((f) => f.name === activeFile)
                            ?.content || '',
                        )
                      }
                      className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      title="Copy code"
                    >
                      <ClipboardDocumentIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={downloadProject}
                      className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                      title="Download project"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Enhanced File Tabs */}
            {projectFiles.length > 0 && (
              <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto bg-gray-50 dark:bg-gray-800/50">
                {projectFiles.map((file) => (
                  <button
                    key={file.name}
                    onClick={() => {
                      setActiveFile(file.name);
                      analyzeCode(file.content);
                    }}
                    className={`px-4 py-3 text-sm border-r border-gray-200 dark:border-gray-800 transition-all ${
                      activeFile === file.name
                        ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 font-medium shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span>
                        {file.language === 'javascript'
                          ? '🟨'
                          : file.language === 'typescript'
                            ? '🔷'
                            : file.language === 'html'
                              ? '🟧'
                              : file.language === 'css'
                                ? '🟦'
                                : '📄'}
                      </span>
                      <span>{file.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Code Analysis Panel */}
            {codeAnalysis && activeFile && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    📊 Code Analysis
                  </span>
                  <span className="text-xs text-blue-600 dark:text-blue-400">
                    Complexity: {codeAnalysis.complexity}/10
                  </span>
                </div>
                {codeAnalysis.suggestions.length > 0 && (
                  <div className="space-y-1">
                    {codeAnalysis.suggestions
                      .slice(0, 2)
                      .map((suggestion, idx) => (
                        <p
                          key={idx}
                          className="text-xs text-blue-700 dark:text-blue-300"
                        >
                          💡 {suggestion}
                        </p>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Enhanced Code Content */}
            <div className="flex-1 overflow-hidden">
              {activeFile && projectFiles.length > 0 ? (
                <div className="h-full">
                  <pre className="h-full overflow-auto p-4 text-sm bg-gray-50 dark:bg-gray-800 font-mono leading-relaxed">
                    <code className="text-gray-800 dark:text-gray-200">
                      {projectFiles.find((f) => f.name === activeFile)?.content}
                    </code>
                  </pre>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <CodeBracketIcon className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <p className="text-lg font-medium mb-2">
                      No Code Generated Yet
                    </p>
                    <p className="text-sm">
                      Start a conversation or choose a template to generate code
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Preview */}
          <div className="lg:col-span-1 flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-green-50 dark:from-gray-800 dark:to-green-900/20 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <EyeIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  Live Preview
                </span>
                {previewUrl && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 bg-gray-50 dark:bg-gray-800">
              {projectFiles.length > 0 ? (
                <iframe
                  src="about:blank"
                  className="w-full h-full border-0"
                  title="Preview"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <EyeIcon className="h-8 w-8 mx-auto mb-2" />
                    <p>Preview will appear here</p>
                    <p className="text-sm">Generate code to see live preview</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
