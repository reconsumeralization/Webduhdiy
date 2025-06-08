'use client';

import React, { useState, useEffect } from 'react';
import {
  CodeBracketIcon,
  BugAntIcon,
  SparklesIcon,
  CommandLineIcon,
  DocumentTextIcon,
  RocketLaunchIcon,
  BeakerIcon,
  CpuChipIcon,
  WrenchScrewdriverIcon,
  LightBulbIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ArrowPathIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  FireIcon,
  BoltIcon,
  ChartBarIcon,
  CloudIcon,
  EyeIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

interface DevTool {
  id: string;
  name: string;
  description: string;
  category:
    | 'debugging'
    | 'testing'
    | 'performance'
    | 'ai'
    | 'deployment'
    | 'monitoring';
  status: 'active' | 'inactive' | 'running' | 'error';
  usage: number;
  lastUsed: number;
  icon: any;
}

interface AIAssistant {
  type: 'code_review' | 'bug_detection' | 'optimization' | 'documentation';
  suggestion: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  code?: string;
  action: string;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  steps: string[];
  estimatedTime: number;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  popularity: number;
}

interface DeploymentPipeline {
  id: string;
  name: string;
  status: 'running' | 'success' | 'failed' | 'pending';
  stage: string;
  progress: number;
  duration: number;
  logs: {
    level: 'info' | 'warning' | 'error';
    message: string;
    timestamp: number;
  }[];
}

export default function DevExperienceHub() {
  const [activeTab, setActiveTab] = useState<
    'tools' | 'ai-assistant' | 'workflows' | 'pipelines' | 'insights'
  >('tools');
  const [devTools, setDevTools] = useState<DevTool[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<AIAssistant[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowTemplate[]>([]);
  const [pipelines, setPipelines] = useState<DeploymentPipeline[]>([]);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  useEffect(() => {
    // Initialize dev tools
    const mockTools: DevTool[] = [
      {
        id: 'ai-debugger',
        name: 'AI Debugger',
        description: 'Intelligent debugging with AI-powered error detection',
        category: 'debugging',
        status: 'active',
        usage: 89,
        lastUsed: Date.now() - 300000,
        icon: BugAntIcon,
      },
      {
        id: 'code-assistant',
        name: 'Code Assistant',
        description: 'AI-powered code completion and suggestions',
        category: 'ai',
        status: 'running',
        usage: 95,
        lastUsed: Date.now() - 60000,
        icon: SparklesIcon,
      },
      {
        id: 'performance-profiler',
        name: 'Performance Profiler',
        description: 'Real-time performance monitoring and optimization',
        category: 'performance',
        status: 'active',
        usage: 76,
        lastUsed: Date.now() - 900000,
        icon: ChartBarIcon,
      },
      {
        id: 'test-runner',
        name: 'Intelligent Test Runner',
        description: 'AI-optimized test execution and coverage analysis',
        category: 'testing',
        status: 'active',
        usage: 82,
        lastUsed: Date.now() - 1800000,
        icon: BeakerIcon,
      },
      {
        id: 'deployment-optimizer',
        name: 'Deployment Optimizer',
        description: 'Smart deployment strategies and rollback automation',
        category: 'deployment',
        status: 'running',
        usage: 67,
        lastUsed: Date.now() - 600000,
        icon: RocketLaunchIcon,
      },
      {
        id: 'real-time-logs',
        name: 'Real-time Logs',
        description: 'Advanced log aggregation and intelligent filtering',
        category: 'monitoring',
        status: 'active',
        usage: 91,
        lastUsed: Date.now() - 120000,
        icon: DocumentTextIcon,
      },
    ];

    const mockAI: AIAssistant[] = [
      {
        type: 'bug_detection',
        suggestion:
          'Potential memory leak detected in component lifecycle. Consider using useEffect cleanup.',
        confidence: 92,
        impact: 'high',
        code: 'useEffect(() => {\n  // cleanup function\n  return () => cleanup()\n}, [])',
        action: 'Fix Memory Leak',
      },
      {
        type: 'optimization',
        suggestion:
          'Bundle size can be reduced by 23% using dynamic imports for rarely used components.',
        confidence: 88,
        impact: 'medium',
        action: 'Optimize Bundle',
      },
      {
        type: 'code_review',
        suggestion:
          'Consider extracting this logic into a custom hook for better reusability.',
        confidence: 85,
        impact: 'medium',
        action: 'Refactor Code',
      },
      {
        type: 'documentation',
        suggestion:
          'API endpoints missing documentation. Auto-generated docs available.',
        confidence: 95,
        impact: 'low',
        action: 'Generate Docs',
      },
    ];

    const mockWorkflows: WorkflowTemplate[] = [
      {
        id: 'full-stack-setup',
        name: 'Full-Stack Project Setup',
        description: 'Complete setup for React + Node.js + Database',
        steps: [
          'Initialize React app',
          'Setup Express server',
          'Configure database',
          'Add authentication',
          'Deploy to production',
        ],
        estimatedTime: 45,
        complexity: 'intermediate',
        category: 'Setup',
        popularity: 94,
      },
      {
        id: 'ci-cd-pipeline',
        name: 'CI/CD Pipeline Creation',
        description: 'Automated testing and deployment pipeline',
        steps: [
          'Setup GitHub Actions',
          'Configure tests',
          'Add build process',
          'Setup staging',
          'Production deployment',
        ],
        estimatedTime: 30,
        complexity: 'advanced',
        category: 'DevOps',
        popularity: 87,
      },
      {
        id: 'api-development',
        name: 'RESTful API Development',
        description: 'Build scalable REST API with best practices',
        steps: [
          'Design API schema',
          'Implement endpoints',
          'Add validation',
          'Write tests',
          'Document API',
        ],
        estimatedTime: 60,
        complexity: 'intermediate',
        category: 'Backend',
        popularity: 91,
      },
    ];

    const mockPipelines: DeploymentPipeline[] = [
      {
        id: 'main-production',
        name: 'Production Deployment',
        status: 'running',
        stage: 'Testing',
        progress: 65,
        duration: 420,
        logs: [
          {
            level: 'info',
            message: 'Starting deployment pipeline',
            timestamp: Date.now() - 400000,
          },
          {
            level: 'info',
            message: 'Running unit tests...',
            timestamp: Date.now() - 300000,
          },
          {
            level: 'info',
            message: 'Tests passed successfully',
            timestamp: Date.now() - 200000,
          },
          {
            level: 'warning',
            message: 'Build size increased by 2%',
            timestamp: Date.now() - 100000,
          },
        ],
      },
      {
        id: 'feature-branch',
        name: 'Feature Branch Testing',
        status: 'success',
        stage: 'Complete',
        progress: 100,
        duration: 180,
        logs: [
          {
            level: 'info',
            message: 'Branch tests completed',
            timestamp: Date.now() - 180000,
          },
          {
            level: 'info',
            message: 'All checks passed',
            timestamp: Date.now() - 120000,
          },
        ],
      },
    ];

    setDevTools(mockTools);
    setAiSuggestions(mockAI);
    setWorkflows(mockWorkflows);
    setPipelines(mockPipelines);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'success':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'running':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'error':
      case 'failed':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const tabs = [
    { id: 'tools', name: 'Dev Tools', icon: WrenchScrewdriverIcon },
    { id: 'ai-assistant', name: 'AI Assistant', icon: SparklesIcon },
    { id: 'workflows', name: 'Workflows', icon: Bars3Icon },
    { id: 'pipelines', name: 'Pipelines', icon: RocketLaunchIcon },
    { id: 'insights', name: 'Insights', icon: LightBulbIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Developer Experience Hub
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered development tools and workflow optimization
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {
                devTools.filter(
                  (t) => t.status === 'active' || t.status === 'running',
                ).length
              }
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Active Tools
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Dev Tools Tab */}
      {activeTab === 'tools' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devTools.map((tool) => (
            <div
              key={tool.id}
              className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                selectedTool === tool.id ? 'ring-2 ring-purple-500' : ''
              }`}
              onClick={() =>
                setSelectedTool(selectedTool === tool.id ? null : tool.id)
              }
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <tool.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tool.status)}`}
                >
                  {tool.status === 'running' && (
                    <ArrowPathIcon className="h-3 w-3 mr-1 animate-spin" />
                  )}
                  <span className="capitalize">{tool.status}</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {tool.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {tool.description}
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Usage
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {tool.usage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${tool.usage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Assistant Tab */}
      {activeTab === 'ai-assistant' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 rounded-2xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <SparklesIcon className="h-8 w-8" />
              <h3 className="text-xl font-bold">AI Development Assistant</h3>
            </div>
            <p className="text-purple-200">
              Get intelligent suggestions to improve your code quality,
              performance, and development workflow.
            </p>
          </div>

          <div className="grid gap-6">
            {aiSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      {suggestion.type === 'bug_detection' && (
                        <BugAntIcon className="h-5 w-5 text-purple-600" />
                      )}
                      {suggestion.type === 'optimization' && (
                        <BoltIcon className="h-5 w-5 text-purple-600" />
                      )}
                      {suggestion.type === 'code_review' && (
                        <CodeBracketIcon className="h-5 w-5 text-purple-600" />
                      )}
                      {suggestion.type === 'documentation' && (
                        <DocumentTextIcon className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white capitalize">
                        {suggestion.type.replace('_', ' ')}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(suggestion.impact)}`}
                        >
                          {suggestion.impact} impact
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {suggestion.confidence}% confidence
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors">
                    {suggestion.action}
                  </button>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {suggestion.suggestion}
                </p>
                {suggestion.code && (
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                    <pre className="text-sm text-gray-900 dark:text-gray-100 overflow-x-auto">
                      <code>{suggestion.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workflows Tab */}
      {activeTab === 'workflows' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {workflow.name}
                </h3>
                <div className="flex items-center space-x-2">
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      workflow.complexity === 'beginner'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        : workflow.complexity === 'intermediate'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    }`}
                  >
                    {workflow.complexity}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <FireIcon className="h-4 w-4 mr-1 text-orange-500" />
                    {workflow.popularity}%
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {workflow.description}
              </p>
              <div className="space-y-2 mb-4">
                {workflow.steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 text-sm"
                  >
                    <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 dark:text-purple-400 font-medium">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {workflow.estimatedTime} min
                </div>
                <button className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors">
                  Start Workflow
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pipelines Tab */}
      {activeTab === 'pipelines' && (
        <div className="space-y-6">
          {pipelines.map((pipeline) => (
            <div
              key={pipeline.id}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {pipeline.name}
                  </h3>
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pipeline.status)}`}
                  >
                    {pipeline.status === 'running' && (
                      <ArrowPathIcon className="h-3 w-3 mr-1 animate-spin" />
                    )}
                    <span className="capitalize">{pipeline.status}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {Math.floor(pipeline.duration / 60)}m {pipeline.duration % 60}
                  s
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Stage: {pipeline.stage}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {pipeline.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      pipeline.status === 'success'
                        ? 'bg-green-500'
                        : pipeline.status === 'failed'
                          ? 'bg-red-500'
                          : pipeline.status === 'running'
                            ? 'bg-blue-500'
                            : 'bg-yellow-500'
                    }`}
                    style={{ width: `${pipeline.progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Recent Logs
                </h4>
                {pipeline.logs.slice(-3).map((log, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 text-sm"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        log.level === 'error'
                          ? 'bg-red-500'
                          : log.level === 'warning'
                            ? 'bg-yellow-500'
                            : 'bg-blue-500'
                      }`}
                    ></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {log.message}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <ChartBarIcon className="h-8 w-8 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Development Velocity
              </h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              +34%
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Your team's development velocity increased by 34% this month using
              AI tools.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <BugAntIcon className="h-8 w-8 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Bug Reduction
              </h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              -67%
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              AI-powered debugging reduced production bugs by 67% compared to
              last quarter.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <RocketLaunchIcon className="h-8 w-8 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Deploy Frequency
              </h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              2.3x
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Automated workflows increased deployment frequency by 2.3x with
              99.9% success rate.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
