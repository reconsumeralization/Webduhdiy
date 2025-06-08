'use client';

import React, { useState, useEffect } from 'react';
import {
  BoltIcon,
  CpuChipIcon,
  ChartBarIcon,
  ClockIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  SparklesIcon,
  CloudIcon,
  RocketLaunchIcon,
  BeakerIcon,
  FireIcon,
  GlobeAltIcon,
  ArrowPathIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
} from '@heroicons/react/24/outline';

interface PerformanceMetric {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string;
  status: 'good' | 'warning' | 'poor';
  trend: 'improving' | 'declining' | 'stable';
  impact: 'high' | 'medium' | 'low';
  category: 'speed' | 'seo' | 'accessibility' | 'best-practices';
}

interface OptimizationSuggestion {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'easy' | 'medium' | 'hard';
  category:
    | 'images'
    | 'javascript'
    | 'css'
    | 'fonts'
    | 'network'
    | 'caching'
    | 'database';
  estimatedImprovement: string;
  priority: number;
  implemented?: boolean;
  aiGenerated: boolean;
}

interface LoadTestResult {
  id: string;
  timestamp: number;
  duration: number;
  users: number;
  requests: number;
  averageResponseTime: number;
  errorRate: number;
  throughput: number;
  status: 'running' | 'completed' | 'failed';
}

export default function PerformanceOptimizer() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [loadTests, setLoadTests] = useState<LoadTestResult[]>([]);
  const [selectedTab, setSelectedTab] = useState<
    'overview' | 'suggestions' | 'load-testing' | 'ai-insights'
  >('overview');
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testProgress, setTestProgress] = useState(0);

  useEffect(() => {
    // Initialize performance data
    const mockMetrics: PerformanceMetric[] = [
      {
        id: 'first-contentful-paint',
        name: 'First Contentful Paint',
        current: 1.8,
        target: 1.5,
        unit: 's',
        status: 'warning',
        trend: 'improving',
        impact: 'high',
        category: 'speed',
      },
      {
        id: 'largest-contentful-paint',
        name: 'Largest Contentful Paint',
        current: 2.4,
        target: 2.5,
        unit: 's',
        status: 'good',
        trend: 'stable',
        impact: 'high',
        category: 'speed',
      },
      {
        id: 'cumulative-layout-shift',
        name: 'Cumulative Layout Shift',
        current: 0.08,
        target: 0.1,
        unit: '',
        status: 'good',
        trend: 'improving',
        impact: 'medium',
        category: 'speed',
      },
      {
        id: 'time-to-interactive',
        name: 'Time to Interactive',
        current: 3.2,
        target: 3.0,
        unit: 's',
        status: 'warning',
        trend: 'declining',
        impact: 'high',
        category: 'speed',
      },
      {
        id: 'seo-score',
        name: 'SEO Score',
        current: 92,
        target: 95,
        unit: '/100',
        status: 'good',
        trend: 'stable',
        impact: 'medium',
        category: 'seo',
      },
      {
        id: 'accessibility-score',
        name: 'Accessibility Score',
        current: 87,
        target: 90,
        unit: '/100',
        status: 'warning',
        trend: 'improving',
        impact: 'medium',
        category: 'accessibility',
      },
      {
        id: 'best-practices-score',
        name: 'Best Practices Score',
        current: 96,
        target: 95,
        unit: '/100',
        status: 'good',
        trend: 'stable',
        impact: 'low',
        category: 'best-practices',
      },
    ];

    const mockSuggestions: OptimizationSuggestion[] = [
      {
        id: 'suggest-1',
        title: 'Optimize Images with Next.js Image Component',
        description:
          'Replace img tags with next/image to enable automatic optimization, lazy loading, and modern formats',
        impact: 'high',
        effort: 'easy',
        category: 'images',
        estimatedImprovement: '15-25% faster LCP',
        priority: 1,
        aiGenerated: true,
      },
      {
        id: 'suggest-2',
        title: 'Enable Brotli Compression',
        description:
          'Configure server to use Brotli compression for text-based resources',
        impact: 'medium',
        effort: 'easy',
        category: 'network',
        estimatedImprovement: '10-20% smaller bundles',
        priority: 2,
        aiGenerated: true,
      },
      {
        id: 'suggest-3',
        title: 'Implement Code Splitting',
        description: 'Split JavaScript bundles to reduce initial load time',
        impact: 'high',
        effort: 'medium',
        category: 'javascript',
        estimatedImprovement: '30-40% faster TTI',
        priority: 3,
        aiGenerated: true,
      },
      {
        id: 'suggest-4',
        title: 'Add Service Worker for Caching',
        description:
          'Implement service worker to cache static assets and API responses',
        impact: 'medium',
        effort: 'hard',
        category: 'caching',
        estimatedImprovement: '50-70% faster repeat visits',
        priority: 4,
        aiGenerated: false,
      },
      {
        id: 'suggest-5',
        title: 'Optimize Database Queries',
        description:
          'Add indexes and optimize slow queries identified in monitoring',
        impact: 'high',
        effort: 'medium',
        category: 'database',
        estimatedImprovement: '40-60% faster API responses',
        priority: 5,
        aiGenerated: true,
      },
      {
        id: 'suggest-6',
        title: 'Preload Critical Fonts',
        description:
          'Add font preloading for critical web fonts to reduce layout shift',
        impact: 'medium',
        effort: 'easy',
        category: 'fonts',
        estimatedImprovement: '20-30% better CLS',
        priority: 6,
        aiGenerated: false,
      },
    ];

    const mockLoadTests: LoadTestResult[] = [
      {
        id: 'test-1',
        timestamp: Date.now() - 3600000,
        duration: 300,
        users: 100,
        requests: 15000,
        averageResponseTime: 245,
        errorRate: 0.5,
        throughput: 50,
        status: 'completed',
      },
      {
        id: 'test-2',
        timestamp: Date.now() - 7200000,
        duration: 600,
        users: 250,
        requests: 45000,
        averageResponseTime: 312,
        errorRate: 1.2,
        throughput: 75,
        status: 'completed',
      },
      {
        id: 'test-3',
        timestamp: Date.now() - 86400000,
        duration: 900,
        users: 500,
        requests: 90000,
        averageResponseTime: 456,
        errorRate: 2.8,
        throughput: 100,
        status: 'completed',
      },
    ];

    setMetrics(mockMetrics);
    setSuggestions(mockSuggestions);
    setLoadTests(mockLoadTests);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'poor':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
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

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'easy':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'hard':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'images':
        return <GlobeAltIcon className="h-4 w-4" />;
      case 'javascript':
        return <CpuChipIcon className="h-4 w-4" />;
      case 'css':
        return <SparklesIcon className="h-4 w-4" />;
      case 'fonts':
        return <DocumentTextIcon className="h-4 w-4" />;
      case 'network':
        return <CloudIcon className="h-4 w-4" />;
      case 'caching':
        return <ClockIcon className="h-4 w-4" />;
      case 'database':
        return <ChartBarIcon className="h-4 w-4" />;
      default:
        return <BoltIcon className="h-4 w-4" />;
    }
  };

  const runLoadTest = async () => {
    setIsRunningTest(true);
    setTestProgress(0);

    // Simulate load test progress
    const progressInterval = setInterval(() => {
      setTestProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsRunningTest(false);

          // Add new test result
          const newTest: LoadTestResult = {
            id: `test-${Date.now()}`,
            timestamp: Date.now(),
            duration: 300,
            users: 100,
            requests: Math.floor(Math.random() * 5000) + 10000,
            averageResponseTime: Math.floor(Math.random() * 200) + 150,
            errorRate: Math.random() * 3,
            throughput: Math.floor(Math.random() * 50) + 30,
            status: 'completed',
          };

          setLoadTests((prev) => [newTest, ...prev]);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const implementSuggestion = (suggestionId: string) => {
    setSuggestions((prev) =>
      prev.map((suggestion) =>
        suggestion.id === suggestionId
          ? { ...suggestion, implemented: true }
          : suggestion,
      ),
    );
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const tabs = [
    { id: 'overview', name: 'Performance Overview', icon: ChartBarIcon },
    { id: 'suggestions', name: 'AI Suggestions', icon: SparklesIcon },
    { id: 'load-testing', name: 'Load Testing', icon: RocketLaunchIcon },
    { id: 'ai-insights', name: 'AI Insights', icon: BoltIcon },
  ];

  const overallScore = Math.round(
    metrics.reduce((sum, metric) => {
      const score =
        metric.category === 'speed'
          ? Math.max(0, 100 - (metric.current / metric.target) * 100)
          : metric.current;
      return sum + score;
    }, 0) / metrics.length,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Performance Optimizer
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered performance analysis and optimization recommendations
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div
              className={`text-3xl font-bold ${
                overallScore >= 90
                  ? 'text-green-600'
                  : overallScore >= 70
                    ? 'text-yellow-600'
                    : 'text-red-600'
              }`}
            >
              {overallScore}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Performance Score
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
              onClick={() => setSelectedTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                selectedTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* Core Web Vitals */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics
              .filter((m) => m.category === 'speed')
              .map((metric) => (
                <div
                  key={metric.id}
                  className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-2 rounded-lg ${getStatusColor(metric.status)}`}
                    >
                      <BoltIcon className="h-5 w-5" />
                    </div>
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}
                    >
                      <span className="capitalize">{metric.status}</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {metric.name}
                    </p>
                    <div className="flex items-end space-x-2">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {metric.current}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        {metric.unit}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Target: {metric.target}
                        {metric.unit}
                      </span>
                      {metric.trend === 'improving' && (
                        <ArrowTrendingUpIcon className="h-3 w-3 text-green-500" />
                      )}
                      {metric.trend === 'declining' && (
                        <ArrowTrendingDownIcon className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        metric.status === 'good'
                          ? 'bg-green-500'
                          : metric.status === 'warning'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}
                      style={{
                        width: `${Math.min(100, (metric.target / metric.current) * 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {metrics
              .filter((m) => m.category !== 'speed')
              .map((metric) => (
                <div
                  key={metric.id}
                  className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {metric.name}
                    </h3>
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}
                    >
                      <span className="capitalize">{metric.status}</span>
                    </div>
                  </div>
                  <div className="flex items-end space-x-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metric.current}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {metric.unit}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          metric.status === 'good'
                            ? 'bg-green-500'
                            : metric.status === 'warning'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        }`}
                        style={{ width: `${metric.current}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* AI Suggestions Tab */}
      {selectedTab === 'suggestions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI-Powered Optimization Suggestions
            </h3>
            <div className="flex items-center space-x-2">
              <SparklesIcon className="h-5 w-5 text-purple-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {suggestions.filter((s) => s.aiGenerated).length} AI-generated
                suggestions
              </span>
            </div>
          </div>

          {suggestions
            .sort((a, b) => a.priority - b.priority)
            .map((suggestion) => (
              <div
                key={suggestion.id}
                className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 ${
                  suggestion.implemented ? 'opacity-75' : 'hover:shadow-lg'
                } transition-all duration-300`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        {getCategoryIcon(suggestion.category)}
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {suggestion.title}
                      </h4>
                      {suggestion.aiGenerated && (
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
                          <SparklesIcon className="h-3 w-3 mr-1" />
                          AI
                        </div>
                      )}
                      {suggestion.implemented && (
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          Implemented
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {suggestion.description}
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Impact:
                        </span>
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(suggestion.impact)}`}
                        >
                          {suggestion.impact}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Effort:
                        </span>
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEffortColor(suggestion.effort)}`}
                        >
                          {suggestion.effort}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Expected: {suggestion.estimatedImprovement}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    {!suggestion.implemented && (
                      <button
                        onClick={() => implementSuggestion(suggestion.id)}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                      >
                        Implement
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Load Testing Tab */}
      {selectedTab === 'load-testing' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Load Testing
            </h3>
            <button
              onClick={runLoadTest}
              disabled={isRunningTest}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isRunningTest ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  <span>Running Test...</span>
                </>
              ) : (
                <>
                  <PlayIcon className="h-4 w-4" />
                  <span>Run Load Test</span>
                </>
              )}
            </button>
          </div>

          {/* Progress Bar */}
          {isRunningTest && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Test Progress
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {testProgress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${testProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Load Test Results */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Test Results
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Test Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Users
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Requests
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Avg Response Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Error Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Throughput
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {loadTests.map((test) => (
                    <tr
                      key={test.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatTimeAgo(test.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {test.users}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {test.requests.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {test.averageResponseTime}ms
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`${
                            test.errorRate < 1
                              ? 'text-green-600'
                              : test.errorRate < 5
                                ? 'text-yellow-600'
                                : 'text-red-600'
                          }`}
                        >
                          {test.errorRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {test.throughput} req/s
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            test.status === 'completed'
                              ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                              : test.status === 'running'
                                ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300'
                                : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                          }`}
                        >
                          {test.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights Tab */}
      {selectedTab === 'ai-insights' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 rounded-2xl p-8 text-white">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-white/10 rounded-lg">
                <SparklesIcon className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">AI Performance Insights</h3>
                <p className="text-purple-200">
                  Powered by advanced machine learning algorithms
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 rounded-xl p-6">
                <h4 className="font-semibold mb-3">Performance Prediction</h4>
                <p className="text-purple-100 text-sm mb-4">
                  Based on current trends, your site will achieve a 95+
                  performance score within 2 weeks by implementing the top 3 AI
                  suggestions.
                </p>
                <div className="flex items-center space-x-2">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-green-400">
                    +23% improvement expected
                  </span>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-6">
                <h4 className="font-semibold mb-3">User Experience Impact</h4>
                <p className="text-purple-100 text-sm mb-4">
                  Reducing your LCP by 0.5s could increase conversion rates by
                  12% and reduce bounce rate by 8%.
                </p>
                <div className="flex items-center space-x-2">
                  <FireIcon className="h-4 w-4 text-orange-400" />
                  <span className="text-sm text-orange-400">
                    High business impact
                  </span>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-6">
                <h4 className="font-semibold mb-3">Competitive Analysis</h4>
                <p className="text-purple-100 text-sm mb-4">
                  Your site loads 15% faster than industry average but 8% slower
                  than top competitors. Focus on image optimization for quick
                  wins.
                </p>
                <div className="flex items-center space-x-2">
                  <ChartBarIcon className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-blue-400">
                    Above average performance
                  </span>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-6">
                <h4 className="font-semibold mb-3">
                  Next Generation Optimizations
                </h4>
                <p className="text-purple-100 text-sm mb-4">
                  Consider implementing HTTP/3, WebAssembly for compute-heavy
                  tasks, and edge computing for global performance.
                </p>
                <div className="flex items-center space-x-2">
                  <RocketLaunchIcon className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-purple-400">
                    Future-ready optimizations
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
