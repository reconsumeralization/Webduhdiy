'use client';

import React, { useState, useEffect } from 'react';
import {
  RocketLaunchIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CpuChipIcon,
  CloudIcon,
  CodeBracketIcon,
  ChartBarIcon,
  BoltIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  EyeIcon,
  DocumentTextIcon,
  CommandLineIcon,
  BeakerIcon,
  ShieldCheckIcon,
  SparklesIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon,
  GlobeAltIcon,
  ServerIcon,
} from '@heroicons/react/24/outline';

interface Deployment {
  id: string;
  projectName: string;
  status:
    | 'queued'
    | 'building'
    | 'deploying'
    | 'success'
    | 'failed'
    | 'cancelled';
  startTime: number;
  endTime?: number;
  duration?: number;
  commit: {
    hash: string;
    message: string;
    author: string;
    branch: string;
  };
  environment: 'production' | 'preview' | 'development';
  url?: string;
  buildLogs: string[];
  metrics: {
    buildTime: number;
    deployTime: number;
    bundleSize: number;
    lighthouse: {
      performance: number;
      accessibility: number;
      bestPractices: number;
      seo: number;
    };
  };
  features: string[];
  checks: {
    id: string;
    name: string;
    status: 'pending' | 'running' | 'passed' | 'failed';
    duration?: number;
    details?: string;
  }[];
}

interface DeploymentAnalytics {
  totalDeployments: number;
  successRate: number;
  averageBuildTime: number;
  averageDeployTime: number;
  deploymentsToday: number;
  trendsLast30Days: {
    date: string;
    deployments: number;
    successRate: number;
    averageTime: number;
  }[];
  topProjects: {
    name: string;
    deployments: number;
    successRate: number;
  }[];
}

const DeploymentEngine: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'deployments' | 'analytics' | 'logs' | 'settings'
  >('deployments');
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [analytics, setAnalytics] = useState<DeploymentAnalytics | null>(null);
  const [selectedDeployment, setSelectedDeployment] = useState<string | null>(
    null,
  );
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [filter, setFilter] = useState<
    'all' | 'running' | 'success' | 'failed'
  >('all');

  useEffect(() => {
    const generateMockData = () => {
      const mockDeployments: Deployment[] = [
        {
          id: 'dep-1',
          projectName: 'my-next-app',
          status: 'building',
          startTime: Date.now() - 120000,
          commit: {
            hash: 'a1b2c3d',
            message: 'Update hero section with new animations',
            author: 'John Smith',
            branch: 'main',
          },
          environment: 'production',
          buildLogs: [
            '[INFO] Starting build process...',
            '[INFO] Installing dependencies...',
            '[INFO] ✓ Dependencies installed (45s)',
            '[INFO] Building application...',
            '[INFO] ✓ TypeScript compiled successfully',
            '[INFO] ✓ ESLint passed',
            '[INFO] Building for production...',
          ],
          metrics: {
            buildTime: 0,
            deployTime: 0,
            bundleSize: 2.4,
            lighthouse: {
              performance: 95,
              accessibility: 98,
              bestPractices: 92,
              seo: 100,
            },
          },
          features: ['SSR', 'TypeScript', 'Tailwind CSS', 'PWA'],
          checks: [
            { id: 'lint', name: 'ESLint', status: 'passed', duration: 8 },
            { id: 'test', name: 'Unit Tests', status: 'running' },
            { id: 'security', name: 'Security Scan', status: 'pending' },
            { id: 'lighthouse', name: 'Lighthouse', status: 'pending' },
          ],
        },
        {
          id: 'dep-2',
          projectName: 'portfolio-site',
          status: 'success',
          startTime: Date.now() - 300000,
          endTime: Date.now() - 180000,
          duration: 120000,
          commit: {
            hash: 'x9y8z7w',
            message: 'Add new project showcase',
            author: 'Jane Doe',
            branch: 'main',
          },
          environment: 'production',
          url: 'https://portfolio-site.webduh.app',
          buildLogs: [
            '[INFO] Build completed successfully!',
            '[INFO] ✓ All tests passed',
            '[INFO] ✓ Lighthouse score: 96/100',
            '[INFO] ✓ Deployed to production',
          ],
          metrics: {
            buildTime: 89,
            deployTime: 31,
            bundleSize: 1.8,
            lighthouse: {
              performance: 96,
              accessibility: 100,
              bestPractices: 95,
              seo: 98,
            },
          },
          features: ['Astro', 'TypeScript', 'Tailwind CSS', 'Static'],
          checks: [
            { id: 'lint', name: 'ESLint', status: 'passed', duration: 6 },
            { id: 'test', name: 'Unit Tests', status: 'passed', duration: 23 },
            {
              id: 'security',
              name: 'Security Scan',
              status: 'passed',
              duration: 15,
            },
            {
              id: 'lighthouse',
              name: 'Lighthouse',
              status: 'passed',
              duration: 12,
            },
          ],
        },
        {
          id: 'dep-3',
          projectName: 'e-commerce-store',
          status: 'failed',
          startTime: Date.now() - 480000,
          endTime: Date.now() - 420000,
          duration: 60000,
          commit: {
            hash: 'm5n4o3p',
            message: 'Fix payment integration bug',
            author: 'Mike Johnson',
            branch: 'feature/payment-fix',
          },
          environment: 'preview',
          buildLogs: [
            '[INFO] Starting build process...',
            '[ERROR] TypeScript compilation failed',
            "[ERROR] Type 'string' is not assignable to type 'number'",
            '[ERROR] Build failed with 3 errors',
          ],
          metrics: {
            buildTime: 45,
            deployTime: 0,
            bundleSize: 0,
            lighthouse: {
              performance: 0,
              accessibility: 0,
              bestPractices: 0,
              seo: 0,
            },
          },
          features: ['Next.js', 'TypeScript', 'Stripe', 'Auth'],
          checks: [
            {
              id: 'lint',
              name: 'ESLint',
              status: 'failed',
              duration: 5,
              details: '3 errors found',
            },
            {
              id: 'test',
              name: 'Unit Tests',
              status: 'failed',
              duration: 12,
              details: '2 tests failed',
            },
            { id: 'security', name: 'Security Scan', status: 'pending' },
            { id: 'lighthouse', name: 'Lighthouse', status: 'pending' },
          ],
        },
      ];

      const mockAnalytics: DeploymentAnalytics = {
        totalDeployments: 1247,
        successRate: 94.2,
        averageBuildTime: 89,
        averageDeployTime: 28,
        deploymentsToday: 23,
        trendsLast30Days: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          deployments: Math.floor(Math.random() * 20) + 10,
          successRate: Math.random() * 10 + 90,
          averageTime: Math.random() * 30 + 60,
        })),
        topProjects: [
          { name: 'my-next-app', deployments: 156, successRate: 96.8 },
          { name: 'portfolio-site', deployments: 89, successRate: 98.9 },
          { name: 'blog-cms', deployments: 67, successRate: 91.0 },
          { name: 'api-service', deployments: 134, successRate: 99.2 },
          { name: 'e-commerce-store', deployments: 45, successRate: 88.9 },
        ],
      };

      setDeployments(mockDeployments);
      setAnalytics(mockAnalytics);
    };

    generateMockData();

    // Auto-refresh deployments
    const interval = setInterval(() => {
      if (isAutoRefresh) {
        generateMockData();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoRefresh]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'queued':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'building':
        return <CpuChipIcon className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'deploying':
        return <CloudIcon className="h-5 w-5 text-purple-500 animate-pulse" />;
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'cancelled':
        return <StopIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'queued':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'building':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'deploying':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getCheckIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
      case 'running':
        return <ArrowPathIcon className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return minutes > 0 ? `${minutes}m ${seconds % 60}s` : `${seconds}s`;
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const filteredDeployments = deployments.filter((deployment) => {
    if (filter === 'all') return true;
    if (filter === 'running')
      return ['queued', 'building', 'deploying'].includes(deployment.status);
    return deployment.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Deployment Engine
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Advanced deployment management with real-time monitoring and
            analytics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            className={`btn btn-outline btn-sm ${isAutoRefresh ? 'bg-green-50 border-green-200 text-green-700' : ''}`}
          >
            <ArrowPathIcon
              className={`h-4 w-4 mr-2 ${isAutoRefresh ? 'animate-spin' : ''}`}
            />
            Auto-refresh
          </button>
          <button className="btn btn-primary btn-sm">
            <RocketLaunchIcon className="h-4 w-4 mr-2" />
            New Deployment
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'deployments', name: 'Deployments', icon: RocketLaunchIcon },
            { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
            { id: 'logs', name: 'Build Logs', icon: DocumentTextIcon },
            { id: 'settings', name: 'Settings', icon: CpuChipIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Deployments Tab */}
      {activeTab === 'deployments' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Active Deployments
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {
                      deployments.filter((d) =>
                        ['queued', 'building', 'deploying'].includes(d.status),
                      ).length
                    }
                  </p>
                </div>
                <RocketLaunchIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            {analytics && (
              <>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Success Rate
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {analytics.successRate.toFixed(1)}%
                      </p>
                    </div>
                    <CheckCircleIcon className="h-8 w-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Avg Build Time
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {analytics.averageBuildTime}s
                      </p>
                    </div>
                    <ClockIcon className="h-8 w-8 text-orange-600" />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Today
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {analytics.deploymentsToday}
                      </p>
                    </div>
                    <ArrowTrendingUpIcon className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter:
            </span>
            <div className="flex space-x-2">
              {[
                { id: 'all', name: 'All' },
                { id: 'running', name: 'Running' },
                { id: 'success', name: 'Success' },
                { id: 'failed', name: 'Failed' },
              ].map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id as any)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterOption.id
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {filterOption.name}
                </button>
              ))}
            </div>
          </div>

          {/* Deployments List */}
          <div className="space-y-4">
            {filteredDeployments.map((deployment) => (
              <div
                key={deployment.id}
                className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer ${
                  selectedDeployment === deployment.id
                    ? 'ring-2 ring-primary-500'
                    : ''
                }`}
                onClick={() =>
                  setSelectedDeployment(
                    selectedDeployment === deployment.id ? null : deployment.id,
                  )
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(deployment.status)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {deployment.projectName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {deployment.commit.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(deployment.status)}`}
                    >
                      {deployment.status}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatTime(deployment.startTime)}
                    </span>
                    {deployment.duration && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDuration(deployment.duration)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedDeployment === deployment.id && (
                  <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left Column - Deploy Info */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Commit Info
                          </h4>
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">
                                Hash:
                              </span>
                              <span className="font-mono text-gray-900 dark:text-white">
                                {deployment.commit.hash}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">
                                Author:
                              </span>
                              <span className="text-gray-900 dark:text-white">
                                {deployment.commit.author}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">
                                Branch:
                              </span>
                              <span className="text-gray-900 dark:text-white">
                                {deployment.commit.branch}
                              </span>
                            </div>
                          </div>
                        </div>

                        {deployment.url && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                              Deployment URL
                            </h4>
                            <a
                              href={deployment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-primary-600 dark:text-primary-400 hover:underline"
                            >
                              <GlobeAltIcon className="h-4 w-4 mr-2" />
                              {deployment.url}
                            </a>
                          </div>
                        )}

                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Features
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {deployment.features.map((feature) => (
                              <span
                                key={feature}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Checks & Metrics */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Quality Checks
                          </h4>
                          <div className="space-y-2">
                            {deployment.checks.map((check) => (
                              <div
                                key={check.id}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center space-x-2">
                                  {getCheckIcon(check.status)}
                                  <span className="text-sm text-gray-900 dark:text-white">
                                    {check.name}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {check.duration && `${check.duration}s`}
                                  {check.details && ` - ${check.details}`}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {deployment.status === 'success' && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                              Lighthouse Scores
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(
                                deployment.metrics.lighthouse,
                              ).map(([key, value]) => (
                                <div
                                  key={key}
                                  className="flex justify-between text-sm"
                                >
                                  <span className="text-gray-600 dark:text-gray-400 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1')}:
                                  </span>
                                  <span
                                    className={`font-medium ${value >= 90 ? 'text-green-600' : value >= 70 ? 'text-yellow-600' : 'text-red-600'}`}
                                  >
                                    {value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recent Build Logs */}
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Recent Logs
                      </h4>
                      <div className="bg-gray-900 rounded-lg p-4 max-h-32 overflow-y-auto">
                        {deployment.buildLogs.slice(-5).map((log, index) => (
                          <div
                            key={index}
                            className="text-sm font-mono text-gray-300"
                          >
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Top Projects by Deployments
              </h3>
              <div className="space-y-3">
                {analytics.topProjects.map((project, index) => (
                  <div
                    key={project.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-4">
                        #{index + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {project.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {project.deployments} deploys
                      </span>
                      <span
                        className={`font-medium ${project.successRate >= 95 ? 'text-green-600' : 'text-yellow-600'}`}
                      >
                        {project.successRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Deployment Performance
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Total Deployments
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {analytics.totalDeployments}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Success Rate
                  </span>
                  <span className="text-sm font-semibold text-green-600">
                    {analytics.successRate.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Avg Build Time
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {analytics.averageBuildTime}s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Avg Deploy Time
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {analytics.averageDeployTime}s
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Live Build Logs
            </h3>
            <div className="flex items-center space-x-2">
              <button className="text-gray-400 hover:text-white">
                <CommandLineIcon className="h-5 w-5" />
              </button>
              <button className="text-gray-400 hover:text-white">
                <ArrowPathIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {deployments
              .find((d) => d.status === 'building')
              ?.buildLogs.map((log, index) => (
                <div key={index} className="text-sm font-mono text-gray-300">
                  {log}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Deployment Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Auto-deploy on Push
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Automatically deploy when code is pushed to main branch
                  </p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Preview Deployments
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Create preview deployments for pull requests
                  </p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Security Scanning
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Run security scans on every deployment
                  </p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeploymentEngine;
