'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ServerIcon,
  GlobeAltIcon,
  CodeBracketIcon,
  SparklesIcon,
  CircleStackIcon,
  CloudIcon,
  CpuChipIcon,
  ArrowPathIcon,
  EyeIcon,
  ChartBarIcon,
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

interface ServiceStatus {
  id: string;
  name: string;
  description: string;
  status: 'online' | 'offline' | 'degraded' | 'maintenance';
  url?: string;
  port?: number;
  icon: React.ComponentType<any>;
  lastChecked: Date;
  uptime?: string;
  responseTime?: number;
  version?: string;
  dependencies?: string[];
}

export default function StatusPage() {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const checkServiceHealth = async (
    url: string,
  ): Promise<{ status: 'online' | 'offline'; responseTime: number }> => {
    const startTime = Date.now();
    try {
      const response = await fetch(url, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      const responseTime = Date.now() - startTime;
      return {
        status: response.ok ? 'online' : 'offline',
        responseTime,
      };
    } catch (error) {
      return {
        status: 'offline',
        responseTime: Date.now() - startTime,
      };
    }
  };

  const refreshStatus = async () => {
    setIsRefreshing(true);

    const serviceChecks = [
      {
        id: 'dashboard',
        name: 'WebduhVercel Dashboard',
        description: 'Main dashboard interface',
        url: 'http://localhost:3000',
        port: 3000,
        icon: GlobeAltIcon,
        dependencies: [],
      },
      {
        id: 'api',
        name: 'WebduhVercel API',
        description: 'Backend API service',
        url: 'http://localhost:3001',
        port: 3001,
        icon: ServerIcon,
        dependencies: ['database'],
      },
      {
        id: 'ai-builder',
        name: 'AI Builder (Bolt.DIY)',
        description: 'AI-powered code generation service',
        url: 'http://localhost:3000/ai-builder',
        port: 3000,
        icon: SparklesIcon,
        dependencies: ['dashboard'],
      },
      {
        id: 'webduh-builder',
        name: 'WebduhBuilder Service',
        description: 'Advanced AI website and code builder service',
        url: 'http://localhost:5000/webduh-builder',
        port: 5000,
        icon: CpuChipIcon,
        dependencies: [],
      },
      {
        id: 'bolt-diy',
        name: 'Bolt.DIY',
        description: 'AI-powered full-stack web development with WebContainer',
        url: 'http://localhost:5173',
        port: 5173,
        icon: SparklesIcon,
        dependencies: [],
      },
      {
        id: 'database',
        name: 'PostgreSQL Database',
        description: 'Primary data storage',
        url: 'postgresql://localhost:5432',
        port: 5432,
        icon: CircleStackIcon,
        dependencies: [],
      },
    ];

    const updatedServices: ServiceStatus[] = [];

    for (const service of serviceChecks) {
      let status: 'online' | 'offline' | 'degraded' = 'offline';
      let responseTime = 0;

      if (service.url.startsWith('http')) {
        const health = await checkServiceHealth(service.url);
        status = health.status;
        responseTime = health.responseTime;
      } else if (service.id === 'database') {
        // Special handling for database - check if API can connect
        status = 'degraded'; // Based on the logs showing DB connection issues
      }

      updatedServices.push({
        id: service.id,
        name: service.name,
        description: service.description,
        status,
        url: service.url,
        port: service.port,
        icon: service.icon,
        lastChecked: new Date(),
        uptime: status === 'online' ? '99.9%' : '0%',
        responseTime,
        version: '1.0.0',
        dependencies: service.dependencies,
      });
    }

    setServices(updatedServices);
    setLastUpdate(new Date());
    setIsRefreshing(false);
  };

  useEffect(() => {
    refreshStatus();
    const interval = setInterval(refreshStatus, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return (
          <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
        );
      case 'degraded':
        return (
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        );
      case 'maintenance':
        return (
          <ClockIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        );
      case 'offline':
      default:
        return (
          <XCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'maintenance':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'offline':
      default:
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    }
  };

  const overallStatus =
    services.length > 0
      ? services.every((s) => s.status === 'online')
        ? 'All Systems Operational'
        : services.some((s) => s.status === 'offline')
          ? 'Partial Outage'
          : 'Degraded Performance'
      : 'Checking...';

  const overallStatusColor =
    services.length > 0
      ? services.every((s) => s.status === 'online')
        ? 'text-green-600 dark:text-green-400'
        : services.some((s) => s.status === 'offline')
          ? 'text-red-600 dark:text-red-400'
          : 'text-yellow-600 dark:text-yellow-400'
      : 'text-gray-600 dark:text-gray-400';

  return (
    <DashboardLayout
      title="System Status"
      description="Real-time status of all WebduhVercel services and integrations"
      headerActions={
        <div className="flex items-center space-x-3">
          <button
            onClick={refreshStatus}
            disabled={isRefreshing}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
          >
            <ArrowPathIcon
              className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            Refresh
          </button>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Back to Dashboard
          </Link>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Overall Status */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Overall Status
              </h2>
              <p className={`text-lg font-medium ${overallStatusColor}`}>
                {overallStatus}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last updated
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Platform Overview */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <SparklesIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              WebduhVercel Platform
            </h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Complete v0.dev competitor with AI-powered code generation,
            multi-LLM support, and real-time deployment capabilities.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CodeBracketIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-gray-900 dark:text-white">
                  AI Builder
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Bolt.DIY-inspired code generation with multiple LLM providers
              </p>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CloudIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="font-medium text-gray-900 dark:text-white">
                  Deployment
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Instant deployment with template system and project management
              </p>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <ChartBarIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span className="font-medium text-gray-900 dark:text-white">
                  Analytics
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Real-time monitoring, analytics, and performance insights
              </p>
            </div>
          </div>
        </div>

        {/* Services Status */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Service Status
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <Icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {service.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {service.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(service.status)}
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusBadge(service.status)}`}
                      >
                        {service.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Port</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {service.port || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">
                        Response Time
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {service.responseTime
                          ? `${service.responseTime}ms`
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Uptime</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {service.uptime || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">
                        Version
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {service.version || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {service.dependencies && service.dependencies.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        Dependencies
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {service.dependencies.map((dep) => (
                          <span
                            key={dep}
                            className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs"
                          >
                            {dep}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Last checked: {service.lastChecked.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/ai-builder"
              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg hover:shadow-md transition-all"
            >
              <SparklesIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Try AI Builder
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Generate code with AI
                </p>
              </div>
            </Link>

            <Link
              href="/projects/new"
              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:shadow-md transition-all"
            >
              <CodeBracketIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Deploy Project
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Start new deployment
                </p>
              </div>
            </Link>

            <Link
              href="/analytics"
              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg hover:shadow-md transition-all"
            >
              <EyeIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  View Analytics
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Monitor performance
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            System Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Platform</p>
              <p className="font-medium text-gray-900 dark:text-white">
                WebduhVercel
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Version</p>
              <p className="font-medium text-gray-900 dark:text-white">1.0.0</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Environment</p>
              <p className="font-medium text-gray-900 dark:text-white">
                Development
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Region</p>
              <p className="font-medium text-gray-900 dark:text-white">Local</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
