'use client';

import React, { useState, useRef, useEffect } from 'react';
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
              {description && (
                <p className="mt-2 text-gray-600 dark:text-gray-400">
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
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  files?: Array<{
    name: string;
    content: string;
    language: string;
  }>;
}

interface LLMProvider {
  id: string;
  name: string;
  models: string[];
  apiKeyRequired: boolean;
  baseUrl?: string;
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

export default function AIBuilderPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content:
        "👋 Hi! I'm your AI coding assistant. Describe what you want to build and I'll create it for you. You can:\n\n• Describe your app idea in natural language\n• Upload images for reference\n• Ask me to modify existing code\n• Request specific features or components\n\nWhat would you like to build today?",
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

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.success
          ? `I'll create that for you! Here's your application with search-enhanced context:\n\n${response.message}`
          : `Sorry, I encountered an issue: ${response.error}`,
        timestamp: new Date(),
        files: response.files,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setProjectFiles(response.files);
      if (response.files.length > 0) {
        setActiveFile(response.files[0].name);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `I apologize, but I encountered an error generating your code. Please try again or check your API key settings.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Handle file upload logic
      console.log('Files uploaded:', files);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Implement voice recording logic
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
          <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
            <SparklesIcon className="h-6 w-6 text-white" />
          </div>
          <span>AI Builder</span>
        </div>
      }
      description="Create full-stack applications with AI assistance"
      headerActions={
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            <CommandLineIcon className="h-4 w-4 mr-2" />
            Settings
          </button>
          <Link
            href="/projects"
            className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Bolt.DIY Integration Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Bolt.DIY Integration
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Launch the full Bolt.DIY experience with advanced WebContainer
                  features
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
                  boltDIYStatus === 'checking'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                    : boltDIYStatus === 'available'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    boltDIYStatus === 'checking'
                      ? 'bg-yellow-500'
                      : boltDIYStatus === 'available'
                        ? 'bg-green-500'
                        : 'bg-red-500'
                  }`}
                />
                {boltDIYStatus === 'checking'
                  ? 'Checking...'
                  : boltDIYStatus === 'available'
                    ? 'Online'
                    : 'Offline'}
              </div>
              <button
                onClick={() => launchBoltDIY()}
                disabled={boltDIYStatus !== 'available'}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <SparklesIcon className="h-4 w-4 mr-2" />
                Launch Bolt.DIY
              </button>
            </div>
          </div>
          {boltDIYStatus === 'unavailable' && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                Bolt.DIY is not running. Start it by running{' '}
                <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
                  npm run dev
                </code>{' '}
                in the apps/bolt-diy directory.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
          {/* Chat Interface */}
          <div className="lg:col-span-1 flex flex-col bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            {/* Provider Settings */}
            {showSettings && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  LLM Provider
                </h3>
                <div className="space-y-3">
                  <select
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    {llmProviders.map((provider) => (
                      <option key={provider.id} value={provider.id}>
                        {provider.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    {availableModels.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                  {currentProvider?.apiKeyRequired && (
                    <input
                      type="password"
                      placeholder="API Key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Chat Messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                    {message.files && (
                      <div className="mt-2 space-y-1">
                        {message.files.map((file, idx) => (
                          <div
                            key={idx}
                            className="text-xs bg-black/10 px-2 py-1 rounded"
                          >
                            📄 {file.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Generating code...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <p className="text-xs text-gray-500 mb-2">Quick prompts:</p>
              <div className="flex flex-wrap gap-1">
                {quickPrompts.slice(0, 4).map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {prompt.length > 30 ? prompt.slice(0, 30) + '...' : prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Describe what you want to build..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-1">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        multiple
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <PhotoIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={toggleRecording}
                        className={`p-1 ${isRecording ? 'text-red-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                      >
                        {isRecording ? (
                          <StopIcon className="h-4 w-4" />
                        ) : (
                          <MicrophoneIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isGenerating}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <PaperAirplaneIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="lg:col-span-1 flex flex-col bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-2">
                <CodeBracketIcon className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Code Editor
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <DocumentTextIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* File Tabs */}
            {projectFiles.length > 0 && (
              <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
                {projectFiles.map((file) => (
                  <button
                    key={file.name}
                    onClick={() => setActiveFile(file.name)}
                    className={`px-3 py-2 text-sm border-r border-gray-200 dark:border-gray-800 ${
                      activeFile === file.name
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {file.name}
                  </button>
                ))}
              </div>
            )}

            {/* Code Content */}
            <div className="flex-1 overflow-hidden">
              {activeFile && projectFiles.length > 0 ? (
                <div className="h-full">
                  <pre className="h-full overflow-auto p-4 text-sm bg-gray-50 dark:bg-gray-800 font-mono">
                    <code className="text-gray-800 dark:text-gray-200">
                      {projectFiles.find((f) => f.name === activeFile)?.content}
                    </code>
                  </pre>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <CodeBracketIcon className="h-8 w-8 mx-auto mb-2" />
                    <p>No files generated yet</p>
                    <p className="text-sm">
                      Start a conversation to generate code
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-1 flex flex-col bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-2">
                <EyeIcon className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Preview
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <PlayIcon className="h-4 w-4" />
                </button>
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
