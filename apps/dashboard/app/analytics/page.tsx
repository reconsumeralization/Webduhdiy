'use client';

// TODO: confirm version & license.
import React, { useState } from 'react';
// TODO: confirm version & license.
import Link from 'next/link';
// TODO: confirm version & license.
import {
  ChartBarIcon,
  CalendarIcon,
  GlobeAltIcon,
  ClockIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  UserGroupIcon,
  DocumentChartBarIcon,
  ArrowPathIcon,
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

// Mock analytics data
const analyticsData = {
  overview: {
    totalVisits: 45267,
    uniqueVisitors: 31248,
    pageViews: 78543,
    bounceRate: 34.2,
    avgSessionDuration: '3m 24s',
    topPages: [
      { path: '/', views: 12345, percentage: 23.1 },
      { path: '/docs', views: 8976, percentage: 16.8 },
      { path: '/about', views: 6543, percentage: 12.3 },
      { path: '/contact', views: 4321, percentage: 8.1 },
    ],
  },
  performance: {
    loadTime: 1.2,
    firstContentfulPaint: 0.8,
    largestContentfulPaint: 2.1,
    cumulativeLayoutShift: 0.05,
    timeToFirstByte: 0.3,
  },
  traffic: {
    sources: [
      { source: 'Direct', visitors: 12500, percentage: 40.0 },
      { source: 'Google', visitors: 9375, percentage: 30.0 },
      { source: 'Social Media', visitors: 4687, percentage: 15.0 },
      { source: 'Referral', visitors: 3125, percentage: 10.0 },
      { source: 'Email', visitors: 1561, percentage: 5.0 },
    ],
    devices: [
      { device: 'Desktop', users: 18749, percentage: 60.0 },
      { device: 'Mobile', users: 9374, percentage: 30.0 },
      { device: 'Tablet', users: 3125, percentage: 10.0 },
    ],
  },
  deployments: {
    totalDeployments: 234,
    successfulDeployments: 221,
    failedDeployments: 13,
    avgBuildTime: '2m 15s',
    successRate: 94.4,
  },
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>(
    '30d',
  );

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const getChangeIcon = (change: number) => {
    return change > 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
  };

  const getChangeColor = (change: number) => {
    return change > 0
      ? 'text-green-600 dark:text-green-400'
      : 'text-red-600 dark:text-red-400';
  };

  return (
    <DashboardLayout
      title="Analytics"
      description="Monitor your website performance and visitor insights"
      headerActions={
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Visits
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(analyticsData.overview.totalVisits)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <EyeIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                +12.5%
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                vs last month
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Unique Visitors
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(analyticsData.overview.uniqueVisitors)}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                +8.3%
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                vs last month
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Page Views
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(analyticsData.overview.pageViews)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <DocumentChartBarIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                +15.7%
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                vs last month
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Bounce Rate
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analyticsData.overview.bounceRate}%
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowTrendingDownIcon className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                -2.1%
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                vs last month
              </span>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Top Pages
            </h3>
            <div className="space-y-4">
              {analyticsData.overview.topPages.map((page, index) => (
                <div
                  key={page.path}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {page.path}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {page.percentage}% of total views
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatNumber(page.views)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      views
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Traffic Sources
            </h3>
            <div className="space-y-4">
              {analyticsData.traffic.sources.map((source) => (
                <div
                  key={source.source}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {source.source}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatNumber(source.visitors)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {source.percentage}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Core Web Vitals */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Core Web Vitals
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Load Time
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {analyticsData.performance.loadTime}s
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: '75%' }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    First Contentful Paint
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {analyticsData.performance.firstContentfulPaint}s
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: '85%' }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Largest Contentful Paint
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {analyticsData.performance.largestContentfulPaint}s
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: '60%' }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cumulative Layout Shift
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {analyticsData.performance.cumulativeLayoutShift}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: '90%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Device Analytics */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Device Analytics
            </h3>
            <div className="space-y-4">
              {analyticsData.traffic.devices.map((device) => {
                const Icon =
                  device.device === 'Desktop'
                    ? ComputerDesktopIcon
                    : DevicePhoneMobileIcon;

                return (
                  <div
                    key={device.device}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {device.device}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {device.percentage}% of users
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatNumber(device.users)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        users
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Deployment Analytics */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Deployment Analytics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {analyticsData.deployments.totalDeployments}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Deployments
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {analyticsData.deployments.successfulDeployments}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Successful
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                {analyticsData.deployments.failedDeployments}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Failed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {analyticsData.deployments.avgBuildTime}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Avg Build Time
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {analyticsData.deployments.successRate}%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Success Rate
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
