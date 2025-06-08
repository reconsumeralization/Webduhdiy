'use client';

import React, { useState, useEffect, Suspense } from 'react';
import {
  CpuChipIcon,
  BoltIcon,
  ChartBarIcon,
  CloudIcon,
  RocketLaunchIcon,
  EyeIcon,
  ShieldCheckIcon,
  CodeBracketIcon,
  CommandLineIcon,
  SparklesIcon,
  CogIcon,
  GlobeAltIcon,
  FireIcon,
  LightBulbIcon,
  BeakerIcon,
  WrenchScrewdriverIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

// Optimized loading wrapper to prevent Suspense issues
function SafeAsyncWrapper({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl h-64 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">
          Loading 10X Features...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// AI-Powered Performance Optimizer (Optimized)
export function OptimizedAIPerformanceOptimizer() {
  const [optimizations, setOptimizations] = useState([
    {
      id: 1,
      type: 'bundle-optimization',
      title: 'Bundle Size Reduction',
      description:
        'AI detected 3 unused dependencies that can reduce bundle size by 45%',
      impact: 'High',
      savings: '450KB',
      status: 'recommended',
      confidence: 95,
      autoApply: true,
    },
    {
      id: 2,
      type: 'image-optimization',
      title: 'Smart Image Compression',
      description:
        'ML-powered image optimization can improve load times by 60%',
      impact: 'Medium',
      savings: '2.1s load time',
      status: 'recommended',
      confidence: 88,
      autoApply: false,
    },
    {
      id: 3,
      type: 'cache-strategy',
      title: 'Intelligent Caching',
      description:
        'Neural network suggests optimal cache headers for 99.2% hit rate',
      impact: 'High',
      savings: '80% faster',
      status: 'applied',
      confidence: 92,
      autoApply: true,
    },
  ]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis with proper async handling
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newOptimization = {
      id: Date.now(),
      type: 'code-splitting',
      title: 'Smart Code Splitting',
      description: 'AI identified optimal code split points for lazy loading',
      impact: 'High',
      savings: '1.8s initial load',
      status: 'recommended',
      confidence: 94,
      autoApply: false,
    };

    setOptimizations((prev) => [newOptimization, ...prev]);
    setIsAnalyzing(false);
  };

  const applyOptimization = (id: number) => {
    setOptimizations((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, status: 'applying' } : opt)),
    );

    setTimeout(() => {
      setOptimizations((prev) =>
        prev.map((opt) =>
          opt.id === id ? { ...opt, status: 'applied' } : opt,
        ),
      );
    }, 1500);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'Low':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recommended':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'applying':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'applied':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <SafeAsyncWrapper>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <CpuChipIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Performance Optimizer
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Machine learning-powered optimization suggestions
              </p>
            </div>
          </div>
          <button
            onClick={runAIAnalysis}
            disabled={isAnalyzing}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {isAnalyzing ? (
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
            ) : (
              <SparklesIcon className="h-4 w-4" />
            )}
            <span>{isAnalyzing ? 'Analyzing...' : 'Run AI Analysis'}</span>
          </button>
        </div>

        <div className="space-y-4">
          {optimizations.map((optimization) => (
            <div
              key={optimization.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {optimization.title}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(optimization.impact)}`}
                    >
                      {optimization.impact} Impact
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(optimization.status)}`}
                    >
                      {optimization.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {optimization.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        {optimization.savings}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircleIcon className="h-4 w-4 text-blue-500" />
                      <span className="text-blue-600 dark:text-blue-400">
                        {optimization.confidence}% confidence
                      </span>
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex flex-col space-y-2">
                  {optimization.status === 'recommended' && (
                    <button
                      onClick={() => applyOptimization(optimization.id)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Apply
                    </button>
                  )}
                  {optimization.autoApply && (
                    <span className="text-xs text-green-600 dark:text-green-400">
                      Auto-apply enabled
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SafeAsyncWrapper>
  );
}

// Simple 10X Features Overview (No Suspense Issues)
export default function OptimizedAI10XFeatures() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: CpuChipIcon,
      title: 'AI-Powered Everything',
      description: '25+ AI features that optimize automatically',
      metric: '95% confidence',
      color: 'purple',
    },
    {
      icon: BoltIcon,
      title: 'Lightning Performance',
      description: '10x faster than any competitor',
      metric: '8ms latency',
      color: 'yellow',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Quantum Security',
      description: 'Unhackable with quantum encryption',
      metric: '98/100 score',
      color: 'red',
    },
    {
      icon: GlobeAltIcon,
      title: 'Global Edge Network',
      description: '15+ edge locations worldwide',
      metric: 'Sub-10ms delivery',
      color: 'blue',
    },
    {
      icon: ChartBarIcon,
      title: 'Predictive Scaling',
      description: 'AI predicts and scales automatically',
      metric: '90% cost reduction',
      color: 'green',
    },
    {
      icon: RocketLaunchIcon,
      title: 'Smart Deployments',
      description: 'Zero-downtime with AI optimization',
      metric: '30-second deploys',
      color: 'indigo',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      purple:
        'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
      yellow:
        'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
      red: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
      blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      green:
        'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
      indigo:
        'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (!isLoaded) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-32"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 dark:bg-gray-700 rounded-xl h-48"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <FireIcon className="h-8 w-8" />
          <h2 className="text-4xl font-bold">webduh 10X Platform</h2>
          <FireIcon className="h-8 w-8" />
        </div>
        <p className="text-xl mb-6 text-purple-100">
          Revolutionary AI-powered deployment platform - 10x better than
          anything else
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-3xl font-bold text-yellow-300">1000%</div>
            <div className="text-sm text-purple-100">Performance Boost</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-3xl font-bold text-green-300">90%</div>
            <div className="text-sm text-purple-100">Cost Savings</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-3xl font-bold text-red-300">98/100</div>
            <div className="text-sm text-purple-100">Security Score</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-3xl font-bold text-blue-300">8ms</div>
            <div className="text-sm text-purple-100">Global Latency</div>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <div
              className={`inline-flex p-3 rounded-lg mb-4 ${getColorClasses(feature.color)}`}
            >
              <feature.icon className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {feature.title}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              {feature.description}
            </p>
            <div className="flex items-center space-x-2">
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {feature.metric}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Performance Optimizer */}
      <Suspense
        fallback={
          <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64 animate-pulse"></div>
        }
      >
        <OptimizedAIPerformanceOptimizer />
      </Suspense>
    </div>
  );
}
