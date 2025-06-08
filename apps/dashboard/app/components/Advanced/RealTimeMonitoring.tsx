'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ChartBarIcon,
  CpuChipIcon,
  CloudIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  BoltIcon,
  GlobeAltIcon,
  ClockIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  SignalIcon,
} from '@heroicons/react/24/outline';

interface MetricData {
  timestamp: number;
  value: number;
  status?: 'healthy' | 'warning' | 'critical';
}

interface RealTimeMetric {
  id: string;
  name: string;
  value: string | number;
  unit?: string;
  change?: number;
  status: 'healthy' | 'warning' | 'critical';
  icon: any;
  data: MetricData[];
  threshold?: {
    warning: number;
    critical: number;
  };
}

interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: number;
  dismissed?: boolean;
}

export default function RealTimeMonitoring() {
  const [metrics, setMetrics] = useState<RealTimeMetric[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Simulate real-time data
  useEffect(() => {
    setIsConnected(true);

    // Initialize metrics
    const initialMetrics: RealTimeMetric[] = [
      {
        id: 'response-time',
        name: 'Response Time',
        value: 145,
        unit: 'ms',
        change: -5.2,
        status: 'healthy',
        icon: BoltIcon,
        data: generateTimeSeriesData(50, 100, 200),
        threshold: { warning: 200, critical: 500 },
      },
      {
        id: 'requests-per-minute',
        name: 'Requests/min',
        value: 1247,
        unit: 'req/min',
        change: 12.3,
        status: 'healthy',
        icon: ChartBarIcon,
        data: generateTimeSeriesData(50, 800, 1500),
      },
      {
        id: 'cpu-usage',
        name: 'CPU Usage',
        value: 34,
        unit: '%',
        change: 2.1,
        status: 'healthy',
        icon: CpuChipIcon,
        data: generateTimeSeriesData(50, 20, 80),
        threshold: { warning: 70, critical: 90 },
      },
      {
        id: 'memory-usage',
        name: 'Memory Usage',
        value: 68,
        unit: '%',
        change: -1.5,
        status: 'warning',
        icon: CloudIcon,
        data: generateTimeSeriesData(50, 40, 90),
        threshold: { warning: 75, critical: 90 },
      },
      {
        id: 'error-rate',
        name: 'Error Rate',
        value: 0.12,
        unit: '%',
        change: -0.05,
        status: 'healthy',
        icon: ExclamationTriangleIcon,
        data: generateTimeSeriesData(50, 0, 2),
        threshold: { warning: 1, critical: 5 },
      },
      {
        id: 'active-users',
        name: 'Active Users',
        value: 2847,
        unit: 'users',
        change: 8.7,
        status: 'healthy',
        icon: UsersIcon,
        data: generateTimeSeriesData(50, 2000, 4000),
      },
      {
        id: 'uptime',
        name: 'Uptime',
        value: 99.98,
        unit: '%',
        change: 0.01,
        status: 'healthy',
        icon: ShieldCheckIcon,
        data: generateTimeSeriesData(50, 99.5, 100),
      },
      {
        id: 'bandwidth',
        name: 'Bandwidth',
        value: 247.8,
        unit: 'MB/s',
        change: 15.6,
        status: 'healthy',
        icon: GlobeAltIcon,
        data: generateTimeSeriesData(50, 100, 500),
      },
    ];

    setMetrics(initialMetrics);

    // Simulate real-time updates
    intervalRef.current = setInterval(() => {
      setMetrics((prevMetrics) =>
        prevMetrics.map((metric) => ({
          ...metric,
          value: updateMetricValue(metric),
          data: [...metric.data.slice(1), generateNewDataPoint(metric)],
          status: calculateStatus(metric),
        })),
      );

      // Randomly generate alerts
      if (Math.random() < 0.1) {
        // 10% chance per interval
        generateAlert();
      }
    }, 3000); // Update every 3 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const generateTimeSeriesData = (
    count: number,
    min: number,
    max: number,
  ): MetricData[] => {
    return Array.from({ length: count }, (_, i) => ({
      timestamp: Date.now() - (count - i) * 3000,
      value: min + Math.random() * (max - min),
    }));
  };

  const updateMetricValue = (metric: RealTimeMetric): number => {
    const currentValue =
      typeof metric.value === 'number'
        ? metric.value
        : parseFloat(metric.value as string);
    const variance = currentValue * 0.1; // 10% variance
    const change = (Math.random() - 0.5) * variance;
    const newValue = Math.max(0, currentValue + change);

    // Special logic for percentage metrics
    if (metric.unit === '%') {
      return Math.min(100, newValue);
    }

    return Math.round(newValue * 100) / 100;
  };

  const generateNewDataPoint = (metric: RealTimeMetric): MetricData => {
    const newValue = updateMetricValue(metric);
    return {
      timestamp: Date.now(),
      value: newValue,
      status: calculateStatus({ ...metric, value: newValue }),
    };
  };

  const calculateStatus = (
    metric: RealTimeMetric,
  ): 'healthy' | 'warning' | 'critical' => {
    if (!metric.threshold) return 'healthy';

    const value =
      typeof metric.value === 'number'
        ? metric.value
        : parseFloat(metric.value as string);

    if (value >= metric.threshold.critical) return 'critical';
    if (value >= metric.threshold.warning) return 'warning';
    return 'healthy';
  };

  const generateAlert = () => {
    const alertTypes = ['info', 'warning', 'error', 'success'] as const;
    const sampleAlerts = [
      {
        type: 'warning' as const,
        title: 'High Memory Usage',
        message: 'Memory usage has exceeded 75% on production servers',
      },
      {
        type: 'success' as const,
        title: 'Deployment Complete',
        message: 'New version successfully deployed to production',
      },
      {
        type: 'info' as const,
        title: 'Scaling Event',
        message: 'Auto-scaling triggered due to increased traffic',
      },
      {
        type: 'error' as const,
        title: 'Service Degradation',
        message: 'API response times are higher than normal',
      },
    ];

    const randomAlert =
      sampleAlerts[Math.floor(Math.random() * sampleAlerts.length)];

    const newAlert: Alert = {
      id: `alert-${Date.now()}`,
      ...randomAlert,
      timestamp: Date.now(),
    };

    setAlerts((prev) => [newAlert, ...prev.slice(0, 4)]); // Keep only latest 5 alerts
  };

  const dismissAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, dismissed: true } : alert,
      ),
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'critical':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'critical':
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20';
      case 'error':
        return 'border-red-200 bg-red-50 dark:bg-red-900/20';
      case 'success':
        return 'border-green-200 bg-green-50 dark:bg-green-900/20';
      default:
        return 'border-gray-200 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Real-Time Monitoring
        </h2>
        <div className="flex items-center space-x-2">
          <div
            className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
          ></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Live Alerts */}
      {alerts.filter((alert) => !alert.dismissed).length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Live Alerts
          </h3>
          {alerts
            .filter((alert) => !alert.dismissed)
            .map((alert) => (
              <div
                key={alert.id}
                className={`border rounded-lg p-4 ${getAlertColor(alert.type)} animate-in slide-in-from-top duration-300`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-1 rounded-full ${
                        alert.type === 'error'
                          ? 'bg-red-100 dark:bg-red-900/30'
                          : alert.type === 'warning'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30'
                            : alert.type === 'success'
                              ? 'bg-green-100 dark:bg-green-900/30'
                              : 'bg-blue-100 dark:bg-blue-900/30'
                      }`}
                    >
                      {alert.type === 'error' && (
                        <XCircleIcon className="h-4 w-4 text-red-600" />
                      )}
                      {alert.type === 'warning' && (
                        <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />
                      )}
                      {alert.type === 'success' && (
                        <CheckCircleIcon className="h-4 w-4 text-green-600" />
                      )}
                      {alert.type === 'info' && (
                        <SignalIcon className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {alert.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg ${getStatusColor(metric.status)}`}
                >
                  <metric.icon className="h-5 w-5" />
                </div>
                <div
                  className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}
                >
                  {getStatusIcon(metric.status)}
                  <span className="capitalize">{metric.status}</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {metric.name}
              </p>
              <div className="flex items-end space-x-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {typeof metric.value === 'number'
                    ? metric.value.toLocaleString()
                    : metric.value}
                </span>
                {metric.unit && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {metric.unit}
                  </span>
                )}
              </div>
              {metric.change !== undefined && (
                <div className="flex items-center space-x-1 mt-1">
                  {metric.change >= 0 ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {metric.change >= 0 ? '+' : ''}
                    {metric.change}%
                  </span>
                </div>
              )}
            </div>

            {/* Mini Chart */}
            <div className="h-16 relative">
              <svg className="w-full h-full" viewBox="0 0 200 50">
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`${
                    metric.status === 'healthy'
                      ? 'text-green-500'
                      : metric.status === 'warning'
                        ? 'text-yellow-500'
                        : 'text-red-500'
                  }`}
                  points={metric.data
                    .map((point, index) => {
                      const x = (index / (metric.data.length - 1)) * 200;
                      const maxValue = Math.max(
                        ...metric.data.map((d) => d.value),
                      );
                      const minValue = Math.min(
                        ...metric.data.map((d) => d.value),
                      );
                      const y =
                        40 -
                        ((point.value - minValue) / (maxValue - minValue)) * 30;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* System Overview */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          System Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full mb-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {metrics.filter((m) => m.status === 'healthy').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Healthy Services
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full mb-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {metrics.filter((m) => m.status === 'warning').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Warning Services
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full mb-3">
              <XCircleIcon className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {metrics.filter((m) => m.status === 'critical').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Critical Services
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
