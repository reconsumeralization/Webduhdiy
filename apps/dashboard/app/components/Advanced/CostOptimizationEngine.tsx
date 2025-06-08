'use client';

import React, { useState, useEffect } from 'react';
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  BoltIcon,
  ClockIcon,
  ServerIcon,
  CpuChipIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  ScaleIcon,
  CloudIcon,
  FireIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

interface CostMetric {
  id: string;
  name: string;
  current: number;
  previous: number;
  budget: number;
  unit: string;
  category: 'compute' | 'storage' | 'network' | 'services';
  trend: 'up' | 'down' | 'stable';
  forecast: number[];
}

interface OptimizationSuggestion {
  id: string;
  type: 'cost_reduction' | 'resource_optimization' | 'automation' | 'scaling';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'easy' | 'moderate' | 'complex';
  savings: {
    monthly: number;
    annual: number;
    percentage: number;
  };
  implementation: string[];
  status: 'new' | 'in_progress' | 'completed' | 'dismissed';
  confidence: number;
  category: string;
}

interface BudgetAlert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  title: string;
  message: string;
  threshold: number;
  current: number;
  percentage: number;
  category: string;
  timestamp: number;
}

interface CostBreakdown {
  category: string;
  current: number;
  previous: number;
  budget: number;
  items: {
    name: string;
    cost: number;
    percentage: number;
    trend: 'up' | 'down' | 'stable';
  }[];
}

const CostOptimizationEngine: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'suggestions' | 'budget' | 'analytics'
  >('overview');
  const [costMetrics, setCostMetrics] = useState<CostMetric[]>([]);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [alerts, setAlerts] = useState<BudgetAlert[]>([]);
  const [breakdown, setBreakdown] = useState<CostBreakdown[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateMockData = () => {
      const mockMetrics: CostMetric[] = [
        {
          id: 'compute',
          name: 'Compute Resources',
          current: 2850,
          previous: 3200,
          budget: 3000,
          unit: 'USD',
          category: 'compute',
          trend: 'down',
          forecast: [2850, 2900, 2750, 2800, 2900, 3100],
        },
        {
          id: 'storage',
          name: 'Storage Costs',
          current: 890,
          previous: 820,
          budget: 1000,
          unit: 'USD',
          category: 'storage',
          trend: 'up',
          forecast: [890, 920, 950, 980, 1000, 1050],
        },
        {
          id: 'network',
          name: 'Bandwidth & CDN',
          current: 1200,
          previous: 1150,
          budget: 1500,
          unit: 'USD',
          category: 'network',
          trend: 'up',
          forecast: [1200, 1250, 1300, 1400, 1450, 1500],
        },
        {
          id: 'services',
          name: 'Cloud Services',
          current: 650,
          previous: 680,
          budget: 800,
          unit: 'USD',
          category: 'services',
          trend: 'down',
          forecast: [650, 640, 620, 610, 600, 590],
        },
      ];

      const mockSuggestions: OptimizationSuggestion[] = [
        {
          id: 'sug-1',
          type: 'cost_reduction',
          title: 'Rightsizing Underutilized Instances',
          description:
            'Analysis shows 60% of your compute instances are running at <30% utilization. Downsizing can save significant costs.',
          impact: 'high',
          effort: 'easy',
          savings: { monthly: 840, annual: 10080, percentage: 29.5 },
          implementation: [
            'Review instance utilization metrics',
            'Identify instances with <30% CPU utilization',
            'Schedule downtime for resizing',
            'Monitor performance after changes',
          ],
          status: 'new',
          confidence: 92,
          category: 'Compute Optimization',
        },
        {
          id: 'sug-2',
          type: 'automation',
          title: 'Implement Auto-Scaling Policies',
          description:
            'Set up intelligent auto-scaling to automatically adjust resources based on demand patterns.',
          impact: 'high',
          effort: 'moderate',
          savings: { monthly: 650, annual: 7800, percentage: 22.8 },
          implementation: [
            'Analyze traffic patterns',
            'Configure scaling policies',
            'Set up monitoring alerts',
            'Test scaling behavior',
          ],
          status: 'new',
          confidence: 88,
          category: 'Automation',
        },
        {
          id: 'sug-3',
          type: 'resource_optimization',
          title: 'Storage Class Optimization',
          description:
            "Move infrequently accessed data to cheaper storage tiers. 40% of your data hasn't been accessed in 90+ days.",
          impact: 'medium',
          effort: 'easy',
          savings: { monthly: 320, annual: 3840, percentage: 36.0 },
          implementation: [
            'Audit data access patterns',
            'Identify cold data',
            'Configure lifecycle policies',
            'Monitor cost impact',
          ],
          status: 'in_progress',
          confidence: 85,
          category: 'Storage',
        },
        {
          id: 'sug-4',
          type: 'scaling',
          title: 'Reserved Instance Optimization',
          description:
            'Purchase reserved instances for stable workloads to save up to 72% compared to on-demand pricing.',
          impact: 'high',
          effort: 'complex',
          savings: { monthly: 1200, annual: 14400, percentage: 42.1 },
          implementation: [
            'Analyze usage patterns',
            'Calculate optimal reservation mix',
            'Purchase reserved capacity',
            'Monitor utilization',
          ],
          status: 'new',
          confidence: 95,
          category: 'Reserved Instances',
        },
        {
          id: 'sug-5',
          type: 'cost_reduction',
          title: 'Eliminate Idle Resources',
          description:
            'Found 12 resources that have been idle for 30+ days, including dev environments and unused load balancers.',
          impact: 'medium',
          effort: 'easy',
          savings: { monthly: 280, annual: 3360, percentage: 9.8 },
          implementation: [
            'Review resource utilization',
            'Confirm resources are unused',
            'Schedule removal',
            'Update documentation',
          ],
          status: 'new',
          confidence: 98,
          category: 'Resource Cleanup',
        },
      ];

      const mockAlerts: BudgetAlert[] = [
        {
          id: 'alert-1',
          type: 'warning',
          title: 'Storage Budget at 89%',
          message: 'Storage costs are approaching the monthly budget limit.',
          threshold: 1000,
          current: 890,
          percentage: 89,
          category: 'Storage',
          timestamp: Date.now() - 3600000,
        },
        {
          id: 'alert-2',
          type: 'critical',
          title: 'Compute Spike Detected',
          message:
            'Unusual compute usage spike detected. 45% above normal levels.',
          threshold: 3000,
          current: 4350,
          percentage: 145,
          category: 'Compute',
          timestamp: Date.now() - 1800000,
        },
        {
          id: 'alert-3',
          type: 'info',
          title: 'Savings Opportunity',
          message:
            'AI detected potential $2,400/month savings through optimization.',
          threshold: 0,
          current: 2400,
          percentage: 0,
          category: 'Optimization',
          timestamp: Date.now() - 900000,
        },
      ];

      const mockBreakdown: CostBreakdown[] = [
        {
          category: 'Compute',
          current: 2850,
          previous: 3200,
          budget: 3000,
          items: [
            {
              name: 'EC2 Instances',
              cost: 1850,
              percentage: 64.9,
              trend: 'down',
            },
            {
              name: 'Lambda Functions',
              cost: 420,
              percentage: 14.7,
              trend: 'up',
            },
            {
              name: 'Container Service',
              cost: 380,
              percentage: 13.3,
              trend: 'stable',
            },
            {
              name: 'Elastic Load Balancers',
              cost: 200,
              percentage: 7.0,
              trend: 'down',
            },
          ],
        },
        {
          category: 'Storage',
          current: 890,
          previous: 820,
          budget: 1000,
          items: [
            { name: 'S3 Storage', cost: 450, percentage: 50.6, trend: 'up' },
            {
              name: 'EBS Volumes',
              cost: 280,
              percentage: 31.5,
              trend: 'stable',
            },
            {
              name: 'Database Storage',
              cost: 160,
              percentage: 18.0,
              trend: 'up',
            },
          ],
        },
        {
          category: 'Network',
          current: 1200,
          previous: 1150,
          budget: 1500,
          items: [
            {
              name: 'CloudFront CDN',
              cost: 650,
              percentage: 54.2,
              trend: 'up',
            },
            { name: 'Data Transfer', cost: 380, percentage: 31.7, trend: 'up' },
            {
              name: 'VPC Endpoints',
              cost: 170,
              percentage: 14.2,
              trend: 'stable',
            },
          ],
        },
        {
          category: 'Services',
          current: 650,
          previous: 680,
          budget: 800,
          items: [
            {
              name: 'RDS Databases',
              cost: 320,
              percentage: 49.2,
              trend: 'down',
            },
            {
              name: 'Monitoring',
              cost: 180,
              percentage: 27.7,
              trend: 'stable',
            },
            {
              name: 'Security Services',
              cost: 150,
              percentage: 23.1,
              trend: 'down',
            },
          ],
        },
      ];

      setCostMetrics(mockMetrics);
      setSuggestions(mockSuggestions);
      setAlerts(mockAlerts);
      setBreakdown(mockBreakdown);
      setIsLoading(false);
    };

    setTimeout(generateMockData, 1000);

    // Real-time updates
    const interval = setInterval(() => {
      setCostMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          current: metric.current + (Math.random() - 0.5) * 100,
        })),
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowTrendingUpIcon className="h-4 w-4 text-red-500" />;
      case 'down':
        return <ArrowTrendingDownIcon className="h-4 w-4 text-green-500" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'easy':
        return 'text-green-600 bg-green-50';
      case 'moderate':
        return 'text-yellow-600 bg-yellow-50';
      case 'complex':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <LightBulbIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <LightBulbIcon className="h-5 w-5 text-gray-500" />;
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
            Cost Optimization Engine
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered cost analysis and savings recommendations
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">
              $
              {suggestions
                .reduce((sum, s) => sum + s.savings.monthly, 0)
                .toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              potential monthly savings
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: ChartBarIcon },
            { id: 'suggestions', name: 'AI Suggestions', icon: SparklesIcon },
            {
              id: 'budget',
              name: 'Budget Alerts',
              icon: ExclamationTriangleIcon,
            },
            { id: 'analytics', name: 'Analytics', icon: CurrencyDollarIcon },
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
          {/* Cost Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {costMetrics.map((metric) => (
              <div
                key={metric.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {metric.name}
                  </h3>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${metric.current.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Budget: ${metric.budget.toLocaleString()}
                    </span>
                    <span
                      className={`font-medium ${
                        metric.current <= metric.budget
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {Math.round((metric.current / metric.budget) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        metric.current <= metric.budget
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      }`}
                      style={{
                        width: `${Math.min((metric.current / metric.budget) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      vs last month: $
                      {Math.abs(
                        metric.current - metric.previous,
                      ).toLocaleString()}
                    </span>
                    <span
                      className={`${
                        metric.current < metric.previous
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {metric.current < metric.previous ? '↓' : '↑'}
                      {Math.abs(
                        Math.round(
                          ((metric.current - metric.previous) /
                            metric.previous) *
                            100,
                        ),
                      )}
                      %
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Top Suggestions Preview */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Top Optimization Opportunities
              </h3>
              <button
                onClick={() => setActiveTab('suggestions')}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                View All →
              </button>
            </div>
            <div className="grid gap-4">
              {suggestions.slice(0, 3).map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <LightBulbIcon className="h-8 w-8 text-yellow-500" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {suggestion.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {suggestion.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      ${suggestion.savings.monthly.toLocaleString()}/mo
                    </p>
                    <p className="text-xs text-gray-500">
                      {suggestion.confidence}% confidence
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-6 rounded-lg border border-green-200 dark:border-green-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">
                    Total Monthly Savings
                  </p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    $
                    {suggestions
                      .reduce((sum, s) => sum + s.savings.monthly, 0)
                      .toLocaleString()}
                  </p>
                </div>
                <ArrowTrendingDownIcon className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                $
                {suggestions
                  .reduce((sum, s) => sum + s.savings.annual, 0)
                  .toLocaleString()}{' '}
                annually
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Active Suggestions
                  </p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {suggestions.filter((s) => s.status === 'new').length}
                  </p>
                </div>
                <SparklesIcon className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                {suggestions.filter((s) => s.impact === 'high').length} high
                impact
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-6 rounded-lg border border-purple-200 dark:border-purple-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    Cost Trend
                  </p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {costMetrics.reduce((sum, m) => sum + m.current, 0) <
                    costMetrics.reduce((sum, m) => sum + m.previous, 0)
                      ? '↓'
                      : '↑'}
                    {Math.abs(
                      Math.round(
                        ((costMetrics.reduce((sum, m) => sum + m.current, 0) -
                          costMetrics.reduce((sum, m) => sum + m.previous, 0)) /
                          costMetrics.reduce((sum, m) => sum + m.previous, 0)) *
                          100,
                      ),
                    )}
                    %
                  </p>
                </div>
                <ChartBarIcon className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">
                vs last month
              </p>
            </div>
          </div>
        </div>
      )}

      {/* AI Suggestions Tab */}
      {activeTab === 'suggestions' && (
        <div className="space-y-6">
          <div className="grid gap-6">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <LightBulbIcon className="h-8 w-8 text-yellow-500 mt-1" />
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {suggestion.title}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full border ${getImpactColor(suggestion.impact)}`}
                        >
                          {suggestion.impact} impact
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getEffortColor(suggestion.effort)}`}
                        >
                          {suggestion.effort}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {suggestion.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-500">
                          Category: {suggestion.category}
                        </span>
                        <span className="text-gray-500">
                          Confidence: {suggestion.confidence}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      ${suggestion.savings.monthly.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      monthly savings
                    </p>
                    <p className="text-xs text-gray-500">
                      {suggestion.savings.percentage}% reduction
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Implementation Steps
                    </h4>
                    <ol className="space-y-2">
                      {suggestion.implementation.map((step, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="flex-shrink-0 w-5 h-5 bg-purple-100 text-purple-600 rounded-full text-xs flex items-center justify-center font-medium">
                            {index + 1}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {step}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          ${suggestion.savings.monthly.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">Monthly</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          ${suggestion.savings.annual.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">Annual</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {suggestion.savings.percentage}%
                        </p>
                        <p className="text-xs text-gray-500">Reduction</p>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        Implement
                      </button>
                      <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        Details
                      </button>
                      <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Budget Alerts Tab */}
      {activeTab === 'budget' && (
        <div className="space-y-6">
          <div className="grid gap-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-6 rounded-lg border ${
                  alert.type === 'critical'
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    : alert.type === 'warning'
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                      : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {alert.title}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {alert.message}
                    </p>
                    {alert.threshold > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>
                            Current: ${alert.current.toLocaleString()}
                          </span>
                          <span>
                            Budget: ${alert.threshold.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              alert.percentage >= 100
                                ? 'bg-red-500'
                                : alert.percentage >= 80
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                            }`}
                            style={{
                              width: `${Math.min(alert.percentage, 100)}%`,
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {alert.percentage}% of budget used
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Cost Breakdown */}
          <div className="grid gap-6">
            {breakdown.map((category) => (
              <div
                key={category.category}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {category.category}
                  </h3>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      ${category.current.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {category.current < category.previous ? '↓' : '↑'}$
                      {Math.abs(
                        category.current - category.previous,
                      ).toLocaleString()}{' '}
                      vs last month
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {category.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            index === 0
                              ? 'bg-purple-500'
                              : index === 1
                                ? 'bg-blue-500'
                                : index === 2
                                  ? 'bg-green-500'
                                  : 'bg-orange-500'
                          }`}
                        ></div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </span>
                        {getTrendIcon(item.trend)}
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {item.percentage}%
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          ${item.cost.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Budget remaining:
                    </span>
                    <span
                      className={`font-medium ${
                        category.current <= category.budget
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      ${(category.budget - category.current).toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full ${
                        category.current <= category.budget
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      }`}
                      style={{
                        width: `${Math.min((category.current / category.budget) * 100, 100)}%`,
                      }}
                    ></div>
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

export default CostOptimizationEngine;
