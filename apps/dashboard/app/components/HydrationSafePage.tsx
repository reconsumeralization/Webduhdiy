'use client';

import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  ClockIcon,
  FireIcon,
  GlobeAltIcon,
  CpuChipIcon,
  ArrowTrendingUpIcon,
  BoltIcon,
  UserGroupIcon,
  CloudIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  CogIcon,
  ArrowRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  EyeIcon,
  CommandLineIcon,
  BeakerIcon,
  MagnifyingGlassIcon,
  BellIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  StarIcon,
} from '@heroicons/react/24/solid';

import { DashboardLayout } from './Navigation/PageLayout';
import {
  DragDropUpload,
  AutoSave,
  AnimatedButton,
  LiveActivityFeed,
} from './PremiumFeatures';
import OptimizedAI10XFeatures from './OptimizedAI10XFeatures';
import { CommandPalette, useCommandPalette } from './Advanced';

// Enhanced mock data
const mockProjects = [
  {
    id: 1,
    name: 'my-next-app',
    url: 'my-next-app.webduh.app',
    customDomain: 'myapp.com',
    status: 'active',
    lastDeploy: '2 hours ago',
    deployments: 45,
    visits: 12500,
    framework: 'Next.js',
    runtime: 'Node.js 18',
    region: 'us-west-1',
    buildTime: '2m 34s',
    size: '1.2 MB',
    uptime: 99.9,
    ssl: true,
    analytics: {
      visitors: 1250,
      pageViews: 4800,
      bounceRate: 32,
      avgSessionDuration: '4m 12s',
    },
  },
  {
    id: 2,
    name: 'portfolio-site',
    url: 'portfolio.webduh.app',
    customDomain: 'john-doe.com',
    status: 'building',
    lastDeploy: '5 minutes ago',
    deployments: 23,
    visits: 8750,
    framework: 'React',
    runtime: 'Node.js 18',
    region: 'eu-west-1',
    buildTime: '1m 45s',
    size: '890 KB',
    uptime: 98.7,
    ssl: true,
    analytics: {
      visitors: 875,
      pageViews: 2100,
      bounceRate: 28,
      avgSessionDuration: '6m 45s',
    },
  },
  {
    id: 3,
    name: 'api-backend',
    url: 'api.webduh.app',
    customDomain: 'api.mycompany.io',
    status: 'error',
    lastDeploy: '1 day ago',
    deployments: 78,
    visits: 156000,
    framework: 'Express.js',
    runtime: 'Node.js 18',
    region: 'us-east-1',
    buildTime: '45s',
    size: '456 KB',
    uptime: 97.2,
    ssl: true,
    analytics: {
      visitors: 15600,
      pageViews: 45000,
      bounceRate: 15,
      avgSessionDuration: '12m 30s',
    },
  },
  {
    id: 4,
    name: 'e-commerce-shop',
    url: 'shop.webduh.app',
    customDomain: 'mystore.com',
    status: 'active',
    lastDeploy: '30 minutes ago',
    deployments: 156,
    visits: 45000,
    framework: 'Nuxt.js',
    runtime: 'Node.js 18',
    region: 'us-west-2',
    buildTime: '3m 12s',
    size: '2.1 MB',
    uptime: 99.8,
    ssl: true,
    analytics: {
      visitors: 4500,
      pageViews: 18900,
      bounceRate: 22,
      avgSessionDuration: '8m 15s',
    },
  },
];

const mockStats = [
  {
    label: 'Total Deployments',
    value: '2,456',
    change: '+12%',
    trend: 'up',
    icon: RocketLaunchIcon,
    color: 'blue',
  },
  {
    label: 'Active Projects',
    value: '12',
    change: '+2',
    trend: 'up',
    icon: BeakerIcon,
    color: 'green',
  },
  {
    label: 'Total Bandwidth',
    value: '1.2 TB',
    change: '+8%',
    trend: 'up',
    icon: CloudIcon,
    color: 'purple',
  },
  {
    label: 'Uptime',
    value: '99.9%',
    change: '+0.1%',
    trend: 'up',
    icon: ShieldCheckIcon,
    color: 'emerald',
  },
];

export default function HydrationSafePage() {
  const [mounted, setMounted] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState<number[]>([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const commandPalette = useCommandPalette();

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-save demo data
  const [demoData, setDemoData] = useState({ settings: 'demo' });
  const handleAutoSave = async (data: any) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const toggleProjectExpansion = (projectId: number) => {
    setExpandedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId],
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'building':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'error':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'building':
        return <ArrowPathIcon className="h-4 w-4 animate-spin" />;
      case 'error':
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return <ExclamationTriangleIcon className="h-4 w-4" />;
    }
  };

  const displayedProjects = showAllProjects
    ? mockProjects
    : mockProjects.slice(0, 3);

  // Show loading state until mounted
  if (!mounted) {
    return (
      <DashboardLayout
        title="Loading..."
        description="Preparing your revolutionary 10X dashboard..."
      >
        <div className="animate-pulse space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 dark:bg-gray-700 rounded-xl h-32"
              ></div>
            ))}
          </div>
          <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64"></div>
        </div>
      </DashboardLayout>
    );
  }

  const headerActions = (
    <AnimatedButton
      variant="primary"
      size="sm"
      onClick={() => (window.location.href = '/projects/new')}
    >
      <PlusIcon className="h-4 w-4 mr-1" />
      New Project
    </AnimatedButton>
  );

  const sidebarContent = (
    <div className="space-y-6">
      <LiveActivityFeed />

      {/* Performance Chart */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Performance Overview
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Requests Today
            </span>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              24.5K
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-pulse"
              style={{ width: '75%' }}
            ></div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">
                Response Time
              </span>
              <p className="font-semibold text-gray-900 dark:text-white">
                142ms
              </p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">
                Success Rate
              </span>
              <p className="font-semibold text-green-600">99.8%</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          System Status
        </h3>
        <div className="space-y-3">
          {[
            { name: 'API', status: 'operational', latency: '12ms' },
            { name: 'CDN', status: 'operational', latency: '8ms' },
            { name: 'Database', status: 'operational', latency: '23ms' },
            { name: 'Edge Functions', status: 'operational', latency: '45ms' },
          ].map((service) => (
            <div
              key={service.name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-900 dark:text-white">
                  {service.name}
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-green-600 capitalize">
                  {service.status}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {service.latency}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <CommandPalette
        isOpen={commandPalette.isOpen}
        onClose={commandPalette.close}
      />
      <DashboardLayout
        title="Dashboard"
        description="Welcome to your revolutionary 10X deployment platform! 🚀"
        headerActions={headerActions}
        sidebarContent={sidebarContent}
      >
        {/* Welcome Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back! 👋
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Here's what's happening with your projects today.
            </p>
          </div>
          <AutoSave data={demoData} onSave={handleAutoSave} />
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mockStats.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 hover:scale-105 group"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20 group-hover:scale-110 transition-transform`}
                >
                  <stat.icon
                    className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`}
                  />
                </div>
                <div
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    stat.trend === 'up'
                      ? 'text-green-700 bg-green-100 dark:bg-green-900/20'
                      : 'text-red-700 bg-red-100 dark:bg-red-900/20'
                  }`}
                >
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Projects Section */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Your Projects
            </h3>
            <AnimatedButton
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = '/projects')}
            >
              View All Projects
              <ArrowRightIcon className="h-4 w-4 ml-1" />
            </AnimatedButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedProjects.slice(0, 4).map((project) => (
              <div
                key={project.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() =>
                  (window.location.href = `/projects/${project.id}`)
                }
              >
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {project.name}
                  </h4>
                  <div
                    className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}
                  >
                    {getStatusIcon(project.status)}
                    <span className="capitalize">{project.status}</span>
                  </div>
                </div>
                <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-2">
                  {project.customDomain || project.url}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {project.framework} • {project.lastDeploy}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Deploy Section */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Deploy
          </h3>
          <DragDropUpload
            onUpload={(files) => {
              console.log('Files uploaded:', files);
              // Handle file upload
            }}
          />
        </div>

        {/* Revolutionary 10X AI Features Section */}
        <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 rounded-2xl p-8 text-white">
          <OptimizedAI10XFeatures />
        </div>
      </DashboardLayout>
    </>
  );
}
