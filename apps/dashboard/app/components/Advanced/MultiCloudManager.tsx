'use client';

// TODO: confirm version & license.
import React, { useState, useEffect } from 'react';

// TODO: confirm version & license.
// Heroicons v2.0.18, MIT License
// https://github.com/tailwindlabs/heroicons
/* ---- embedded utilities ---- */
const CloudIcon = (props: any) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 15.75A4.5 4.5 0 006.75 20.25h10.5a4.5 4.5 0 004.5-4.5 4.5 4.5 0 00-4.5-4.5h-.75a6 6 0 10-11.25 4.5z"
    />
  </svg>
);
const ServerIcon = (props: any) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <rect width="20.25" height="5.25" x="1.875" y="3.75" rx="2.25" />
    <rect width="20.25" height="5.25" x="1.875" y="14.25" rx="2.25" />
    <path d="M4.125 8.25v7.5" />
    <circle cx="6.75" cy="6.375" r="0.75" />
    <circle cx="6.75" cy="16.875" r="0.75" />
  </svg>
);
const GlobeAltIcon = (props: any) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M2.25 12h19.5" />
    <path d="M12 2.25c2.25 2.25 4.5 6.75 4.5 9.75s-2.25 7.5-4.5 9.75c-2.25-2.25-4.5-6.75-4.5-9.75s2.25-7.5 4.5-9.75z" />
  </svg>
);
const CurrencyDollarIcon = (props: any) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v18m0 0c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"
    />
  </svg>
);
const ChartBarIcon = (props: any) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 21V3m0 0h18m-9 0v18m0 0H3m9 0h9"
    />
  </svg>
);
const ExclamationTriangleIcon = (props: any) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v4m0 4h.01M21.94 18.06A10 10 0 105.94 2.06a10 10 0 0016 16z"
    />
  </svg>
);
const CheckCircleIcon = (props: any) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
  </svg>
);
const XCircleIcon = (props: any) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6m0-6l6 6" />
  </svg>
);
const ClockIcon = (props: any) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <circle cx="12" cy="12" r="9" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 7.5v4.25l2.5 2.5"
    />
  </svg>
);
const BoltIcon = (props: any) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);
const ShieldCheckIcon = (props: any) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3l8.485 3.515A2 2 0 0122 8.236V12a9.978 9.978 0 01-2.929 7.071A9.978 9.978 0 0112 22a9.978 9.978 0 01-7.071-2.929A9.978 9.978 0 012 12V8.236a2 2 0 011.515-1.721L12 3z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
  </svg>
);
const ArrowPathIcon = (props: any) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 12a7.5 7.5 0 017.5-7.5m0 0V3m0 1.5l-1.5 1.5m1.5-1.5l1.5 1.5M19.5 12a7.5 7.5 0 01-7.5 7.5m0 0V21m0-1.5l1.5-1.5m-1.5 1.5l-1.5-1.5"
    />
  </svg>
);
const PlusIcon = (props: any) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);
const CogIcon = (props: any) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <circle cx="12" cy="12" r="3" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51h.09a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
    />
  </svg>
);
const MapPinIcon = (props: any) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21c-4.418 0-8-3.582-8-8a8 8 0 1116 0c0 4.418-3.582 8-8 8z"
    />
    <circle cx="12" cy="13" r="3" />
  </svg>
);
const SignalIcon = (props: any) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 19.5v-1.5a2.25 2.25 0 012.25-2.25h1.5a2.25 2.25 0 012.25 2.25v1.5m0 0v-1.5a2.25 2.25 0 012.25-2.25h1.5a2.25 2.25 0 012.25 2.25v1.5m0 0v-1.5a2.25 2.25 0 012.25-2.25h1.5a2.25 2.25 0 012.25 2.25v1.5"
    />
  </svg>
);
const BeakerIcon = (props: any) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.75 3v6.75m4.5-6.75v6.75m-7.5 0h10.5m-10.5 0a2.25 2.25 0 00-2.25 2.25v7.5A2.25 2.25 0 006.75 21h10.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25m-10.5 0V3m10.5 0V3"
    />
  </svg>
);
const RocketLaunchIcon = (props: any) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v1.5m0 0a9 9 0 019 9v1.5a9 9 0 01-9 9v-1.5m0 0a9 9 0 01-9-9V12a9 9 0 019-9z"
    />
  </svg>
);

interface CloudProvider {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error' | 'deploying';
  region: string;
  cost: {
    monthly: number;
    hourly: number;
  };
  resources: {
    instances: number;
    storage: number;
    bandwidth: number;
  };
  performance: {
    latency: number;
    uptime: number;
    throughput: number;
  };
  deployments: {
    active: number;
    pending: number;
    failed: number;
  };
  lastSync: number;
}

interface Deployment {
  id: string;
  name: string;
  providers: string[];
  status: 'active' | 'pending' | 'failed' | 'scaling';
  strategy: 'single' | 'multi-region' | 'hybrid' | 'failover';
  traffic: {
    total: number;
    distribution: { provider: string; percentage: number }[];
  };
  performance: {
    avgLatency: number;
    errorRate: number;
    availability: number;
  };
  cost: {
    daily: number;
    monthly: number;
  };
  created: number;
  lastUpdate: number;
}

interface DeploymentStrategy {
  id: string;
  name: string;
  description: string;
  providers: string[];
  trafficSplit: { provider: string; percentage: number }[];
  costEstimate: number;
  benefits: string[];
  considerations: string[];
}

const MultiCloudManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'providers' | 'deployments' | 'strategies'
  >('overview');
  const [providers, setProviders] = useState<CloudProvider[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [strategies, setStrategies] = useState<DeploymentStrategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateMockData = () => {
      const mockProviders: CloudProvider[] = [
        {
          id: 'aws',
          name: 'Amazon Web Services',
          status: 'connected',
          region: 'us-east-1',
          cost: { monthly: 2840, hourly: 3.95 },
          resources: { instances: 12, storage: 500, bandwidth: 1200 },
          performance: { latency: 45, uptime: 99.97, throughput: 850 },
          deployments: { active: 8, pending: 2, failed: 0 },
          lastSync: Date.now() - 300000,
        },
        {
          id: 'azure',
          name: 'Microsoft Azure',
          status: 'connected',
          region: 'eastus',
          cost: { monthly: 3120, hourly: 4.33 },
          resources: { instances: 15, storage: 750, bandwidth: 980 },
          performance: { latency: 52, uptime: 99.95, throughput: 720 },
          deployments: { active: 6, pending: 1, failed: 1 },
          lastSync: Date.now() - 180000,
        },
        {
          id: 'gcp',
          name: 'Google Cloud Platform',
          status: 'connected',
          region: 'us-central1',
          cost: { monthly: 2650, hourly: 3.68 },
          resources: { instances: 10, storage: 400, bandwidth: 1100 },
          performance: { latency: 38, uptime: 99.98, throughput: 920 },
          deployments: { active: 5, pending: 0, failed: 0 },
          lastSync: Date.now() - 120000,
        },
        {
          id: 'digitalocean',
          name: 'DigitalOcean',
          status: 'connected',
          region: 'nyc3',
          cost: { monthly: 890, hourly: 1.24 },
          resources: { instances: 4, storage: 160, bandwidth: 400 },
          performance: { latency: 28, uptime: 99.92, throughput: 380 },
          deployments: { active: 3, pending: 0, failed: 0 },
          lastSync: Date.now() - 450000,
        },
      ];

      const mockDeployments: Deployment[] = [
        {
          id: 'deploy-1',
          name: 'Production API',
          providers: ['aws', 'gcp'],
          status: 'active',
          strategy: 'multi-region',
          traffic: {
            total: 125000,
            distribution: [
              { provider: 'aws', percentage: 60 },
              { provider: 'gcp', percentage: 40 },
            ],
          },
          performance: { avgLatency: 42, errorRate: 0.02, availability: 99.98 },
          cost: { daily: 185, monthly: 5550 },
          created: Date.now() - 86400000 * 15,
          lastUpdate: Date.now() - 3600000,
        },
        {
          id: 'deploy-2',
          name: 'Frontend CDN',
          providers: ['aws', 'azure', 'gcp'],
          status: 'active',
          strategy: 'hybrid',
          traffic: {
            total: 89000,
            distribution: [
              { provider: 'aws', percentage: 45 },
              { provider: 'azure', percentage: 30 },
              { provider: 'gcp', percentage: 25 },
            ],
          },
          performance: { avgLatency: 35, errorRate: 0.01, availability: 99.99 },
          cost: { daily: 120, monthly: 3600 },
          created: Date.now() - 86400000 * 8,
          lastUpdate: Date.now() - 1800000,
        },
        {
          id: 'deploy-3',
          name: 'Database Cluster',
          providers: ['azure'],
          status: 'scaling',
          strategy: 'single',
          traffic: {
            total: 45000,
            distribution: [{ provider: 'azure', percentage: 100 }],
          },
          performance: {
            avgLatency: 15,
            errorRate: 0.005,
            availability: 99.95,
          },
          cost: { daily: 95, monthly: 2850 },
          created: Date.now() - 86400000 * 3,
          lastUpdate: Date.now() - 600000,
        },
      ];

      const mockStrategies: DeploymentStrategy[] = [
        {
          id: 'strategy-1',
          name: 'High Availability Multi-Cloud',
          description:
            'Deploy across 3+ cloud providers with automatic failover',
          providers: ['aws', 'azure', 'gcp'],
          trafficSplit: [
            { provider: 'aws', percentage: 40 },
            { provider: 'azure', percentage: 35 },
            { provider: 'gcp', percentage: 25 },
          ],
          costEstimate: 8500,
          benefits: [
            'Maximum uptime guarantee',
            'Geographic distribution',
            'Vendor lock-in protection',
            'Automatic failover',
          ],
          considerations: [
            'Higher complexity',
            'Increased costs',
            'Data synchronization challenges',
          ],
        },
        {
          id: 'strategy-2',
          name: 'Cost-Optimized Hybrid',
          description:
            'Primary deployment on cost-effective provider with backup',
          providers: ['digitalocean', 'aws'],
          trafficSplit: [
            { provider: 'digitalocean', percentage: 80 },
            { provider: 'aws', percentage: 20 },
          ],
          costEstimate: 3200,
          benefits: [
            'Significant cost savings',
            'Backup redundancy',
            'Scalability options',
            'Performance optimization',
          ],
          considerations: [
            'Provider dependency',
            'Limited geographic reach',
            'Potential latency issues',
          ],
        },
        {
          id: 'strategy-3',
          name: 'Performance-First Edge',
          description: 'Global edge deployment with intelligent routing',
          providers: ['aws', 'azure', 'gcp'],
          trafficSplit: [
            { provider: 'aws', percentage: 45 },
            { provider: 'azure', percentage: 30 },
            { provider: 'gcp', percentage: 25 },
          ],
          costEstimate: 12000,
          benefits: [
            'Ultra-low latency',
            'Global presence',
            'Dynamic routing',
            'Edge caching',
          ],
          considerations: [
            'Premium pricing',
            'Complex configuration',
            'Bandwidth costs',
          ],
        },
      ];

      setProviders(mockProviders);
      setDeployments(mockDeployments);
      setStrategies(mockStrategies);
      setIsLoading(false);
    };

    setTimeout(generateMockData, 1000);

    // Real-time updates
    const interval = setInterval(() => {
      setProviders((prev) =>
        prev.map((provider) => ({
          ...provider,
          performance: {
            ...provider.performance,
            latency: provider.performance.latency + (Math.random() - 0.5) * 10,
            throughput:
              provider.performance.throughput + (Math.random() - 0.5) * 50,
          },
          lastSync: Date.now(),
        })),
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'disconnected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'error':
      case 'failed':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'deploying':
      case 'pending':
      case 'scaling':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'disconnected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'error':
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'deploying':
      case 'pending':
      case 'scaling':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 dark:bg-gray-700 rounded"
              ></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Multi-Cloud Manager
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Deploy and manage across multiple cloud providers
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
            <PlusIcon className="h-4 w-4" />
            <span>New Deployment</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2">
            <CogIcon className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: ChartBarIcon },
            { id: 'providers', name: 'Providers', icon: CloudIcon },
            { id: 'deployments', name: 'Deployments', icon: ServerIcon },
            { id: 'strategies', name: 'Strategies', icon: BeakerIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Deployments
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {deployments.length}
                  </p>
                </div>
                <ServerIcon className="h-8 w-8 text-blue-500" />
              </div>
              <p className="text-sm text-green-600 mt-2">
                {deployments.filter((d) => d.status === 'active').length} active
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Connected Providers
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {providers.filter((p) => p.status === 'connected').length}
                  </p>
                </div>
                <CloudIcon className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                of {providers.length} total
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Monthly Cost
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    $
                    {providers
                      .reduce((sum, p) => sum + p.cost.monthly, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <CurrencyDollarIcon className="h-8 w-8 text-purple-500" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                $
                {deployments
                  .reduce((sum, d) => sum + d.cost.monthly, 0)
                  .toLocaleString()}{' '}
                deployments
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Avg Latency
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(
                      providers.reduce(
                        (sum, p) => sum + p.performance.latency,
                        0,
                      ) / providers.length,
                    )}
                    ms
                  </p>
                </div>
                <BoltIcon className="h-8 w-8 text-yellow-500" />
              </div>
              <p className="text-sm text-green-600 mt-2">
                Excellent performance
              </p>
            </div>
          </div>

          {/* Cost Analysis Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Cost by Provider
            </h3>
            <div className="space-y-4">
              {providers.map((provider, index) => (
                <div
                  key={provider.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        index === 0
                          ? 'bg-blue-500'
                          : index === 1
                            ? 'bg-green-500'
                            : index === 2
                              ? 'bg-purple-500'
                              : 'bg-orange-500'
                      }`}
                    ></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {provider.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        ${provider.cost.monthly.toLocaleString()}/mo
                      </p>
                      <p className="text-xs text-gray-500">
                        ${provider.cost.hourly.toFixed(2)}/hr
                      </p>
                    </div>
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          index === 0
                            ? 'bg-blue-500'
                            : index === 1
                              ? 'bg-green-500'
                              : index === 2
                                ? 'bg-purple-500'
                                : 'bg-orange-500'
                        }`}
                        style={{
                          width: `${(provider.cost.monthly / Math.max(...providers.map((p) => p.cost.monthly))) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Provider Performance
              </h3>
              <div className="space-y-4">
                {providers.map((provider) => (
                  <div
                    key={provider.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(provider.status)}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {provider.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {provider.region}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {Math.round(provider.performance.latency)}ms
                      </p>
                      <p className="text-xs text-gray-500">
                        {provider.performance.uptime}% uptime
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Deployment Health
              </h3>
              <div className="space-y-4">
                {deployments.map((deployment) => (
                  <div
                    key={deployment.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(deployment.status)}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {deployment.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {deployment.providers.length} providers
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {deployment.performance.availability}%
                      </p>
                      <p className="text-xs text-gray-500">
                        {deployment.performance.avgLatency}ms avg
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Providers Tab */}
      {activeTab === 'providers' && (
        <div className="space-y-6">
          <div className="grid gap-6">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <CloudIcon className="h-8 w-8 text-blue-500" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {provider.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {provider.region}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(provider.status)}`}
                    >
                      {provider.status}
                    </span>
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <ArrowPathIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Resources
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Instances:
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {provider.resources.instances}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Storage:
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {provider.resources.storage}GB
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Bandwidth:
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {provider.resources.bandwidth}GB
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Performance
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Latency:
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {Math.round(provider.performance.latency)}ms
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Uptime:
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {provider.performance.uptime}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Throughput:
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {Math.round(provider.performance.throughput)}MB/s
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Deployments
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Active:
                        </span>
                        <span className="text-sm font-medium text-green-600">
                          {provider.deployments.active}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Pending:
                        </span>
                        <span className="text-sm font-medium text-yellow-600">
                          {provider.deployments.pending}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Failed:
                        </span>
                        <span className="text-sm font-medium text-red-600">
                          {provider.deployments.failed}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Cost
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Monthly:
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          ${provider.cost.monthly.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Hourly:
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          ${provider.cost.hourly.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Last Sync:
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {Math.round((Date.now() - provider.lastSync) / 60000)}
                          m ago
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deployments Tab */}
      {activeTab === 'deployments' && (
        <div className="space-y-6">
          <div className="grid gap-6">
            {deployments.map((deployment) => (
              <div
                key={deployment.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <ServerIcon className="h-8 w-8 text-purple-500" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {deployment.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {deployment.strategy} strategy
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(deployment.status)}`}
                    >
                      {deployment.status}
                    </span>
                    <button className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700">
                      Manage
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Traffic Distribution
                    </h4>
                    <div className="space-y-2">
                      {deployment.traffic.distribution.map((dist, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {
                              providers.find((p) => p.id === dist.provider)
                                ?.name
                            }
                            :
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {dist.percentage}%
                          </span>
                        </div>
                      ))}
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Total:
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {deployment.traffic.total.toLocaleString()} req/day
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Performance
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Avg Latency:
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {deployment.performance.avgLatency}ms
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Error Rate:
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {deployment.performance.errorRate}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Availability:
                        </span>
                        <span className="text-sm font-medium text-green-600">
                          {deployment.performance.availability}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Cost
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Daily:
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          ${deployment.cost.daily}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Monthly:
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          ${deployment.cost.monthly.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Per Request:
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          $
                          {(
                            (deployment.cost.daily / deployment.traffic.total) *
                            1000
                          ).toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Details
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Providers:
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {deployment.providers.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Created:
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {Math.round(
                            (Date.now() - deployment.created) / 86400000,
                          )}{' '}
                          days ago
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Updated:
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {Math.round(
                            (Date.now() - deployment.lastUpdate) / 60000,
                          )}
                          m ago
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strategies Tab */}
      {activeTab === 'strategies' && (
        <div className="space-y-6">
          <div className="grid gap-6">
            {strategies.map((strategy) => (
              <div
                key={strategy.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {strategy.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {strategy.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-purple-600">
                      ${strategy.costEstimate.toLocaleString()}/mo
                    </span>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      Deploy
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Traffic Split
                    </h4>
                    <div className="space-y-2">
                      {strategy.trafficSplit.map((split, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {
                              providers.find((p) => p.id === split.provider)
                                ?.name
                            }
                            :
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {split.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Benefits
                    </h4>
                    <ul className="space-y-1">
                      {strategy.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Considerations
                    </h4>
                    <ul className="space-y-1">
                      {strategy.considerations.map((consideration, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {consideration}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiCloudManager;
