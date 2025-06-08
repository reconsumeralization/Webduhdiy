'use client';

// TODO: confirm version & license.
import React from 'react';
// TODO: confirm version & license.
import Link from 'next/link';
// TODO: confirm version & license.
import {
  RocketLaunchIcon,
  PlusIcon,
  EyeIcon,
  ChartBarIcon,
  GlobeAltIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  CodeBracketIcon,
  CogIcon,
  ArrowRightIcon,
  StarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

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

// Mock data
const stats = {
  projects: 8,
  deployments: 234,
  domains: 4,
  teamMembers: 5,
};

const recentProjects = [
  {
    id: 'proj_1',
    name: 'my-nextjs-app',
    status: 'deployed',
    lastDeployed: '2024-03-10T15:30:00Z',
    url: 'https://my-nextjs-app.webduh.app',
    framework: 'Next.js',
  },
  {
    id: 'proj_2',
    name: 'api-service',
    status: 'building',
    lastDeployed: '2024-03-10T14:20:00Z',
    url: 'https://api-service.webduh.app',
    framework: 'Express',
  },
  {
    id: 'proj_3',
    name: 'landing-page',
    status: 'deployed',
    lastDeployed: '2024-03-09T11:45:00Z',
    url: 'https://landing-page.webduh.app',
    framework: 'React',
  },
];

const recentActivity = [
  {
    id: 'act_1',
    type: 'deployment',
    message: 'Deployed my-nextjs-app to production',
    timestamp: '2024-03-10T15:30:00Z',
    status: 'success',
  },
  {
    id: 'act_2',
    type: 'domain',
    message: 'Added custom domain myapp.com',
    timestamp: '2024-03-10T14:20:00Z',
    status: 'success',
  },
  {
    id: 'act_3',
    type: 'team',
    message: 'Added Sarah Wilson to the team',
    timestamp: '2024-03-10T13:15:00Z',
    status: 'success',
  },
  {
    id: 'act_4',
    type: 'deployment',
    message: 'Build failed for api-service',
    timestamp: '2024-03-10T12:00:00Z',
    status: 'error',
  },
];

const quickActions = [
  {
    title: 'Deploy New Project',
    description: 'Import from GitHub or deploy from template',
    icon: RocketLaunchIcon,
    href: '/projects/new',
    color: 'blue',
  },
  {
    title: 'Add Custom Domain',
    description: 'Connect your own domain with SSL',
    icon: GlobeAltIcon,
    href: '/domains/new',
    color: 'green',
  },
  {
    title: 'Invite Team Member',
    description: 'Collaborate with your team',
    icon: UserGroupIcon,
    href: '/team',
    color: 'purple',
  },
  {
    title: 'View Analytics',
    description: 'Monitor performance and usage',
    icon: ChartBarIcon,
    href: '/analytics',
    color: 'yellow',
  },
];

export default function DashboardPage() {
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deployed':
      case 'success':
        return (
          <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
        );
      case 'building':
        return (
          <ClockIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        );
      case 'error':
        return (
          <XCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
        );
      default:
        return (
          <ClockIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'deployed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'building':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getActionColor = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
      case 'green':
        return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
      case 'purple':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <DashboardLayout
      title="Dashboard"
      description="Welcome back! Here's what's happening with your projects."
      headerActions={
        <Link
          href="/projects/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Project
        </Link>
      }
    >
      <div className="space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Projects
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.projects}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <CodeBracketIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                +2
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                this month
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Deployments
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.deployments}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <RocketLaunchIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                +15
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                this week
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Domains
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.domains}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <GlobeAltIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                +1
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                this month
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Team Members
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.teamMembers}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                +1
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                this week
              </span>
            </div>
          </div>
        </div>

        {/* AI Builder Feature */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-700/20"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                    <SparklesIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">🚀 NEW: AI Builder</h3>
                    <p className="text-white/90">
                      v0.dev competitor with multi-LLM support
                    </p>
                  </div>
                </div>
                <p className="text-lg text-white/90 mb-6 max-w-2xl">
                  Generate full-stack applications with AI assistance. Connect
                  to OpenAI, Anthropic, Ollama, and more. Enhanced with
                  real-time search engines for better code generation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/ai-builder"
                    className="inline-flex items-center px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-all duration-200 font-semibold shadow-lg transform hover:scale-105"
                  >
                    <SparklesIcon className="h-5 w-5 mr-2" />
                    Try AI Builder
                  </Link>
                  <Link
                    href="/guides/ai-builder"
                    className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all duration-200 font-medium border border-white/20"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <CodeBracketIcon className="h-16 w-16 text-white/80" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.title} href={action.href} className="group">
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-lg transition-all duration-200 group-hover:border-blue-300 dark:group-hover:border-blue-600">
                    <div
                      className={`p-3 rounded-lg mb-4 ${getActionColor(action.color)}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {action.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Projects and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Projects */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Projects
              </h3>
              <Link
                href="/projects"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(project.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {project.name}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(project.status)}`}
                        >
                          {project.status}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {project.framework}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimeAgo(project.lastDeployed)}
                    </span>
                    <Link href={`/projects/${project.id}`}>
                      <ArrowRightIcon className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h3>
              <Link
                href="/activity"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Getting Started Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <StarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  New to Webduh?
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl">
                Get started with our comprehensive guides and tutorials. Learn
                how to deploy your first project, configure custom domains, and
                optimize your applications for production.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/guides"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <RocketLaunchIcon className="h-5 w-5 mr-2" />
                  View Guides
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  <EyeIcon className="h-5 w-5 mr-2" />
                  Browse Docs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
