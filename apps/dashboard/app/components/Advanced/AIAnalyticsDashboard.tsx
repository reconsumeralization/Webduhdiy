'use client';

import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  BoltIcon,
  UserGroupIcon,
  GlobeAltIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  LightBulbIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  visitors: {
    total: number;
    change: number;
    breakdown: { period: string; count: number }[];
  };
  engagement: {
    avgSessionDuration: number;
    bounceRate: number;
    pageViews: number;
    pagesPerSession: number;
  };
  performance: {
    loadTime: number;
    coreWebVitals: {
      lcp: number;
      fid: number;
      cls: number;
    };
  };
  conversions: {
    rate: number;
    value: number;
    goals: { name: string; completions: number; value: number }[];
  };
  predictions: {
    nextWeekTraffic: number;
    revenueProjection: number;
    churnRisk: number;
    growthOpportunities: string[];
  };
  insights: {
    type: 'opportunity' | 'warning' | 'success' | 'info';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    action: string;
  }[];
  demographics: {
    countries: { name: string; visitors: number; percentage: number }[];
    devices: { type: string; percentage: number }[];
    browsers: { name: string; percentage: number }[];
  };
  realTime: {
    activeUsers: number;
    topPages: { page: string; users: number }[];
    events: { event: string; count: number; timestamp: number }[];
  };
}

const AIAnalyticsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'insights' | 'predictions' | 'realtime'
  >('overview');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  // Mock data generation
  useEffect(() => {
    const generateMockData = (): AnalyticsData => ({
      visitors: {
        total: 45621,
        change: 23.4,
        breakdown: Array.from({ length: 30 }, (_, i) => ({
          period: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          count: Math.floor(Math.random() * 2000) + 1000,
        })),
      },
      engagement: {
        avgSessionDuration: 245,
        bounceRate: 32.1,
        pageViews: 126543,
        pagesPerSession: 2.8,
      },
      performance: {
        loadTime: 1.2,
        coreWebVitals: {
          lcp: 1.8,
          fid: 45,
          cls: 0.05,
        },
      },
      conversions: {
        rate: 4.2,
        value: 89250,
        goals: [
          { name: 'Sign Up', completions: 1245, value: 25000 },
          { name: 'Purchase', completions: 523, value: 52300 },
          { name: 'Newsletter', completions: 892, value: 8920 },
        ],
      },
      predictions: {
        nextWeekTraffic: 52000,
        revenueProjection: 125000,
        churnRisk: 8.3,
        growthOpportunities: [
          'Mobile optimization could increase conversions by 15%',
          'A/B testing landing pages shows 23% improvement potential',
          'Adding social proof elements could boost sign-ups by 18%',
          'Implementing AI chatbot could reduce bounce rate by 12%',
        ],
      },
      insights: [
        {
          type: 'opportunity',
          title: 'Mobile Traffic Spike',
          description:
            'Mobile traffic increased 45% this week. Consider mobile-first optimization.',
          impact: 'high',
          action: 'Optimize mobile experience',
        },
        {
          type: 'warning',
          title: 'Page Load Time',
          description:
            'Homepage load time increased by 200ms. This could impact SEO rankings.',
          impact: 'medium',
          action: 'Investigate performance issues',
        },
        {
          type: 'success',
          title: 'Conversion Rate Improved',
          description:
            'Conversion rate increased 18% after implementing new checkout flow.',
          impact: 'high',
          action: 'Apply similar patterns to other pages',
        },
        {
          type: 'info',
          title: 'Peak Traffic Hours',
          description:
            'Traffic peaks between 2-4 PM EST. Consider scheduling releases accordingly.',
          impact: 'medium',
          action: 'Schedule deployments for low-traffic hours',
        },
      ],
      demographics: {
        countries: [
          { name: 'United States', visitors: 18500, percentage: 40.5 },
          { name: 'United Kingdom', visitors: 9200, percentage: 20.2 },
          { name: 'Germany', visitors: 5500, percentage: 12.1 },
          { name: 'Canada', visitors: 4100, percentage: 9.0 },
          { name: 'Australia', visitors: 3200, percentage: 7.0 },
          { name: 'Others', visitors: 5121, percentage: 11.2 },
        ],
        devices: [
          { type: 'Desktop', percentage: 52.3 },
          { type: 'Mobile', percentage: 41.2 },
          { type: 'Tablet', percentage: 6.5 },
        ],
        browsers: [
          { name: 'Chrome', percentage: 65.2 },
          { name: 'Safari', percentage: 18.9 },
          { name: 'Firefox', percentage: 8.7 },
          { name: 'Edge', percentage: 5.2 },
          { name: 'Others', percentage: 2.0 },
        ],
      },
      realTime: {
        activeUsers: 1247,
        topPages: [
          { page: '/dashboard', users: 342 },
          { page: '/projects', users: 189 },
          { page: '/analytics', users: 156 },
          { page: '/deploy', users: 134 },
          { page: '/settings', users: 98 },
        ],
        events: [
          { event: 'Page View', count: 45, timestamp: Date.now() - 30000 },
          { event: 'Button Click', count: 23, timestamp: Date.now() - 45000 },
          { event: 'Form Submit', count: 12, timestamp: Date.now() - 60000 },
          { event: 'Download', count: 8, timestamp: Date.now() - 90000 },
        ],
      },
    });

    setTimeout(() => {
      setAnalyticsData(generateMockData());
      setIsLoading(false);
    }, 1000);

    // Real-time updates
    const interval = setInterval(() => {
      setAnalyticsData((prev) =>
        prev
          ? {
              ...prev,
              realTime: {
                ...prev.realTime,
                activeUsers: Math.floor(Math.random() * 200) + 1000,
                events: [
                  {
                    event: 'Page View',
                    count: Math.floor(Math.random() * 50) + 20,
                    timestamp: Date.now(),
                  },
                  ...prev.realTime.events.slice(0, 3),
                ],
              },
            }
          : null,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading || !analyticsData) {
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

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <LightBulbIcon className="h-5 w-5 text-yellow-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />;
      case 'success':
        return <SparklesIcon className="h-5 w-5 text-green-500" />;
      default:
        return <ChartBarIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getInsightBgColor = (type: string) => {
    switch (type) {
      case 'opportunity':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'warning':
        return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI Analytics Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Intelligent insights powered by machine learning
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-700 dark:text-green-300">
              Live
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: ChartBarIcon },
            { id: 'insights', name: 'AI Insights', icon: SparklesIcon },
            { id: 'predictions', name: 'Predictions', icon: RocketLaunchIcon },
            { id: 'realtime', name: 'Real-time', icon: BoltIcon },
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
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Visitors
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analyticsData.visitors.total.toLocaleString()}
                  </p>
                </div>
                <UserGroupIcon className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-2 flex items-center">
                {analyticsData.visitors.change > 0 ? (
                  <ArrowUpIcon className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={`text-sm ${analyticsData.visitors.change > 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {Math.abs(analyticsData.visitors.change)}% from last month
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Conversion Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analyticsData.conversions.rate}%
                  </p>
                </div>
                <ArrowTrendingUpIcon className="h-8 w-8 text-green-500" />
              </div>
              <div className="mt-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ${analyticsData.conversions.value.toLocaleString()} revenue
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Avg Session
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.floor(
                      analyticsData.engagement.avgSessionDuration / 60,
                    )}
                    m {analyticsData.engagement.avgSessionDuration % 60}s
                  </p>
                </div>
                <ClockIcon className="h-8 w-8 text-purple-500" />
              </div>
              <div className="mt-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {analyticsData.engagement.bounceRate}% bounce rate
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Page Load Time
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analyticsData.performance.loadTime}s
                  </p>
                </div>
                <BoltIcon className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="mt-2">
                <span className="text-sm text-green-600">
                  Excellent performance
                </span>
              </div>
            </div>
          </div>

          {/* Charts and Demographics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traffic Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Traffic Trend
              </h3>
              <div className="h-64 flex items-end space-x-1">
                {analyticsData.visitors.breakdown
                  .slice(-14)
                  .map((day, index) => (
                    <div
                      key={index}
                      className="flex-1 bg-gradient-to-t from-purple-500 to-purple-300 rounded-t"
                      style={{ height: `${(day.count / 2000) * 100}%` }}
                      title={`${day.period}: ${day.count} visitors`}
                    ></div>
                  ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>14 days ago</span>
                <span>Today</span>
              </div>
            </div>

            {/* Device Breakdown */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Device Breakdown
              </h3>
              <div className="space-y-4">
                {analyticsData.demographics.devices.map((device, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      {device.type === 'Desktop' ? (
                        <ComputerDesktopIcon className="h-5 w-5 text-gray-600" />
                      ) : device.type === 'Mobile' ? (
                        <DevicePhoneMobileIcon className="h-5 w-5 text-gray-600" />
                      ) : (
                        <GlobeAltIcon className="h-5 w-5 text-gray-600" />
                      )}
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {device.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${device.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {device.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="grid gap-6">
            {analyticsData.insights.map((insight, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg border ${getInsightBgColor(insight.type)}`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {insight.title}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          insight.impact === 'high'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                            : insight.impact === 'medium'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        }`}
                      >
                        {insight.impact} impact
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {insight.description}
                    </p>
                    <button className="mt-3 px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors">
                      {insight.action}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Predictions Tab */}
      {activeTab === 'predictions' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Next Week Traffic
                  </p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {analyticsData.predictions.nextWeekTraffic.toLocaleString()}
                  </p>
                </div>
                <ArrowTrendingUpIcon className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                +14% predicted growth
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-6 rounded-lg border border-green-200 dark:border-green-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">
                    Revenue Projection
                  </p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    $
                    {analyticsData.predictions.revenueProjection.toLocaleString()}
                  </p>
                </div>
                <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                Next month forecast
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 p-6 rounded-lg border border-orange-200 dark:border-orange-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                    Churn Risk
                  </p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                    {analyticsData.predictions.churnRisk}%
                  </p>
                </div>
                <ExclamationTriangleIcon className="h-8 w-8 text-orange-600" />
              </div>
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
                Low risk level
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Growth Opportunities
            </h3>
            <div className="space-y-4">
              {analyticsData.predictions.growthOpportunities.map(
                (opportunity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
                  >
                    <LightBulbIcon className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-900 dark:text-white">
                        {opportunity}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      )}

      {/* Real-time Tab */}
      {activeTab === 'realtime' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Active Users
              </h3>
              <div className="text-2xl font-bold text-green-600">
                {analyticsData.realTime.activeUsers}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Top Pages
                </h4>
                <div className="space-y-2">
                  {analyticsData.realTime.topPages.map((page, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                    >
                      <span className="text-sm text-gray-900 dark:text-white">
                        {page.page}
                      </span>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {page.users} users
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Recent Events
                </h4>
                <div className="space-y-2">
                  {analyticsData.realTime.events.map((event, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                    >
                      <span className="text-sm text-gray-900 dark:text-white">
                        {event.event}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {event.count}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAnalyticsDashboard;
