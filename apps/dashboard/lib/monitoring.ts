export interface Metric {
  name: string;
  value: number;
  timestamp: Date;
  labels?: Record<string, string>;
  unit?: string;
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  source: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  acknowledged: boolean;
  resolved: boolean;
  metadata?: Record<string, any>;
}

export interface HealthCheck {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  message?: string;
  lastCheck: Date;
  responseTime?: number;
  uptime?: number;
  url?: string;
}

export interface SystemStatus {
  overall: 'operational' | 'degraded' | 'outage';
  services: HealthCheck[];
  incidents: Alert[];
  metrics: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
}

class MonitoringService {
  private metrics: Metric[] = [];
  private alerts: Alert[] = [];
  private healthChecks: Map<string, HealthCheck> = new Map();
  private alertThresholds: Map<string, { warning: number; critical: number }> =
    new Map();

  constructor() {
    this.initializeThresholds();
    this.startHealthChecks();
  }

  private initializeThresholds() {
    this.alertThresholds.set('cpu_usage', { warning: 80, critical: 95 });
    this.alertThresholds.set('memory_usage', { warning: 85, critical: 95 });
    this.alertThresholds.set('disk_usage', { warning: 85, critical: 95 });
    this.alertThresholds.set('response_time', {
      warning: 2000,
      critical: 5000,
    });
    this.alertThresholds.set('error_rate', { warning: 0.05, critical: 0.1 });
  }

  // Metrics Collection
  recordMetric(metric: Metric) {
    this.metrics.push(metric);

    // Keep only last 1000 metrics to prevent memory issues
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }

    // Check if metric exceeds thresholds
    this.checkMetricThresholds(metric);
  }

  recordDeploymentMetric(
    projectId: string,
    deploymentId: string,
    metrics: {
      buildTime?: number;
      bundleSize?: number;
      errorRate?: number;
      responseTime?: number;
    },
  ) {
    const baseLabels = { projectId, deploymentId };

    if (metrics.buildTime) {
      this.recordMetric({
        name: 'deployment_build_time',
        value: metrics.buildTime,
        timestamp: new Date(),
        labels: baseLabels,
        unit: 'seconds',
      });
    }

    if (metrics.bundleSize) {
      this.recordMetric({
        name: 'deployment_bundle_size',
        value: metrics.bundleSize,
        timestamp: new Date(),
        labels: baseLabels,
        unit: 'bytes',
      });
    }

    if (metrics.errorRate !== undefined) {
      this.recordMetric({
        name: 'deployment_error_rate',
        value: metrics.errorRate,
        timestamp: new Date(),
        labels: baseLabels,
        unit: 'percentage',
      });
    }

    if (metrics.responseTime) {
      this.recordMetric({
        name: 'deployment_response_time',
        value: metrics.responseTime,
        timestamp: new Date(),
        labels: baseLabels,
        unit: 'milliseconds',
      });
    }
  }

  recordSystemMetrics() {
    // Simulate system metrics collection
    const cpu = Math.random() * 100;
    const memory = Math.random() * 100;
    const disk = Math.random() * 100;
    const network = Math.random() * 100;

    this.recordMetric({
      name: 'system_cpu_usage',
      value: cpu,
      timestamp: new Date(),
      unit: 'percentage',
    });

    this.recordMetric({
      name: 'system_memory_usage',
      value: memory,
      timestamp: new Date(),
      unit: 'percentage',
    });

    this.recordMetric({
      name: 'system_disk_usage',
      value: disk,
      timestamp: new Date(),
      unit: 'percentage',
    });

    this.recordMetric({
      name: 'system_network_usage',
      value: network,
      timestamp: new Date(),
      unit: 'percentage',
    });

    return { cpu, memory, disk, network };
  }

  // Alert Management
  private checkMetricThresholds(metric: Metric) {
    const thresholds = this.alertThresholds.get(metric.name);
    if (!thresholds) return;

    let severity: 'warning' | 'critical' | null = null;
    if (metric.value >= thresholds.critical) {
      severity = 'critical';
    } else if (metric.value >= thresholds.warning) {
      severity = 'warning';
    }

    if (severity) {
      this.createAlert({
        type: severity === 'critical' ? 'error' : 'warning',
        title: `High ${metric.name.replace('_', ' ')}`,
        message: `${metric.name} is at ${metric.value}${metric.unit || ''}, which exceeds the ${severity} threshold of ${
          severity === 'critical' ? thresholds.critical : thresholds.warning
        }${metric.unit || ''}`,
        source: 'metrics',
        severity: severity === 'critical' ? 'critical' : 'medium',
        metadata: {
          metric: metric.name,
          value: metric.value,
          threshold:
            severity === 'critical' ? thresholds.critical : thresholds.warning,
          labels: metric.labels,
        },
      });
    }
  }

  createAlert(
    alert: Omit<Alert, 'id' | 'timestamp' | 'acknowledged' | 'resolved'>,
  ) {
    const newAlert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      acknowledged: false,
      resolved: false,
      ...alert,
    };

    this.alerts.unshift(newAlert);

    // Keep only last 50 alerts
    if (this.alerts.length > 50) {
      this.alerts = this.alerts.slice(0, 50);
    }

    // Auto-acknowledge low severity alerts after 5 minutes
    if (alert.severity === 'low') {
      setTimeout(
        () => {
          this.acknowledgeAlert(newAlert.id);
        },
        5 * 60 * 1000,
      );
    }

    return newAlert;
  }

  acknowledgeAlert(alertId: string) {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
    }
  }

  resolveAlert(alertId: string) {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      alert.acknowledged = true;
    }
  }

  // Health Checks
  private startHealthChecks() {
    // Check system health every 30 seconds
    setInterval(() => {
      this.performHealthChecks();
    }, 30000);

    // Initial health check
    this.performHealthChecks();
  }

  private async performHealthChecks() {
    const checks = [
      { name: 'Database', url: 'postgresql://localhost:5432/webduh' },
      { name: 'Redis', url: 'redis://localhost:6379' },
      { name: 'File Storage', url: '/storage/health' },
      { name: 'Docker Engine', url: 'unix:///var/run/docker.sock' },
      { name: 'Kubernetes API', url: 'https://kubernetes.default.svc' },
    ];

    for (const check of checks) {
      try {
        const startTime = Date.now();

        // Simulate health check
        const isHealthy = Math.random() > 0.1; // 90% success rate
        const responseTime = Math.random() * 200 + 50; // 50-250ms

        await new Promise((resolve) => setTimeout(resolve, responseTime));

        const status: HealthCheck['status'] = isHealthy
          ? 'healthy'
          : 'unhealthy';

        this.healthChecks.set(check.name, {
          name: check.name,
          status,
          message:
            status === 'healthy'
              ? 'Service is responding normally'
              : 'Service is not responding',
          lastCheck: new Date(),
          responseTime: Date.now() - startTime,
          uptime: Math.random() * 99.9 + 0.1, // Random uptime
          url: check.url,
        });

        // Create alert if service is unhealthy
        if (status === 'unhealthy') {
          this.createAlert({
            type: 'error',
            title: `${check.name} Service Down`,
            message: `${check.name} health check failed. Service may be unavailable.`,
            source: 'health-check',
            severity: 'high',
            metadata: {
              service: check.name,
              url: check.url,
              responseTime: Date.now() - startTime,
            },
          });
        }
      } catch (error) {
        this.healthChecks.set(check.name, {
          name: check.name,
          status: 'unhealthy',
          message: `Health check failed: ${error}`,
          lastCheck: new Date(),
          url: check.url,
        });
      }
    }
  }

  // Deployment Monitoring
  async monitorDeployment(deploymentId: string, projectId: string) {
    const startTime = Date.now();

    // Monitor deployment progress
    const checkInterval = setInterval(async () => {
      try {
        // Simulate deployment status check
        const deploymentStatus = await this.checkDeploymentStatus(deploymentId);

        this.recordMetric({
          name: 'deployment_status_check',
          value: deploymentStatus.success ? 1 : 0,
          timestamp: new Date(),
          labels: { deploymentId, projectId },
        });

        if (deploymentStatus.completed) {
          clearInterval(checkInterval);

          const totalTime = Date.now() - startTime;
          this.recordDeploymentMetric(projectId, deploymentId, {
            buildTime: totalTime / 1000,
            bundleSize: deploymentStatus.bundleSize,
            responseTime: deploymentStatus.responseTime,
          });

          if (deploymentStatus.success) {
            this.createAlert({
              type: 'info',
              title: 'Deployment Successful',
              message: `Deployment ${deploymentId} completed successfully`,
              source: 'deployment',
              severity: 'low',
              metadata: { deploymentId, projectId, buildTime: totalTime },
            });
          } else {
            this.createAlert({
              type: 'error',
              title: 'Deployment Failed',
              message: `Deployment ${deploymentId} failed: ${deploymentStatus.error}`,
              source: 'deployment',
              severity: 'high',
              metadata: {
                deploymentId,
                projectId,
                error: deploymentStatus.error,
              },
            });
          }
        }
      } catch (error) {
        console.error('Error monitoring deployment:', error);
      }
    }, 5000); // Check every 5 seconds

    // Timeout after 10 minutes
    setTimeout(
      () => {
        clearInterval(checkInterval);
      },
      10 * 60 * 1000,
    );
  }

  private async checkDeploymentStatus(deploymentId: string) {
    // Simulate deployment status check
    return {
      success: Math.random() > 0.1,
      completed: Math.random() > 0.3,
      bundleSize: Math.floor(Math.random() * 5000000) + 1000000,
      responseTime: Math.floor(Math.random() * 500) + 100,
      error: Math.random() > 0.9 ? 'Build failed due to syntax error' : null,
    };
  }

  // Data Retrieval
  getMetrics(filter?: {
    name?: string;
    from?: Date;
    to?: Date;
    labels?: Record<string, string>;
  }): Metric[] {
    let filtered = [...this.metrics];

    if (filter) {
      if (filter.name) {
        filtered = filtered.filter((m) => m.name === filter.name);
      }
      if (filter.from) {
        filtered = filtered.filter((m) => m.timestamp >= filter.from!);
      }
      if (filter.to) {
        filtered = filtered.filter((m) => m.timestamp <= filter.to!);
      }
      if (filter.labels) {
        filtered = filtered.filter((m) => {
          if (!m.labels) return false;
          return Object.entries(filter.labels!).every(
            ([key, value]) => m.labels![key] === value,
          );
        });
      }
    }

    return filtered;
  }

  getAlerts(filter?: {
    type?: Alert['type'];
    severity?: Alert['severity'];
    acknowledged?: boolean;
    resolved?: boolean;
  }): Alert[] {
    let filtered = [...this.alerts];

    if (filter) {
      if (filter.type) {
        filtered = filtered.filter((a) => a.type === filter.type);
      }
      if (filter.severity) {
        filtered = filtered.filter((a) => a.severity === filter.severity);
      }
      if (filter.acknowledged !== undefined) {
        filtered = filtered.filter(
          (a) => a.acknowledged === filter.acknowledged,
        );
      }
      if (filter.resolved !== undefined) {
        filtered = filtered.filter((a) => a.resolved === filter.resolved);
      }
    }

    return filtered;
  }

  getSystemStatus(): SystemStatus {
    const services = Array.from(this.healthChecks.values());
    const unhealthyServices = services.filter(
      (s) => s.status === 'unhealthy',
    ).length;
    const degradedServices = services.filter(
      (s) => s.status === 'degraded',
    ).length;

    let overall: SystemStatus['overall'];
    if (unhealthyServices > 0) {
      overall = 'outage';
    } else if (degradedServices > 0) {
      overall = 'degraded';
    } else {
      overall = 'operational';
    }

    const recentMetrics = this.recordSystemMetrics();
    const activeIncidents = this.getAlerts({
      resolved: false,
      severity: 'critical',
    });

    return {
      overall,
      services,
      incidents: activeIncidents,
      metrics: recentMetrics,
    };
  }

  // Analytics
  getMetricsSummary(metricName: string, timeRange: { from: Date; to: Date }) {
    const metrics = this.getMetrics({
      name: metricName,
      from: timeRange.from,
      to: timeRange.to,
    });

    if (metrics.length === 0) {
      return null;
    }

    const values = metrics.map((m) => m.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const median = values.sort((a, b) => a - b)[Math.floor(values.length / 2)];

    return {
      count: metrics.length,
      min,
      max,
      avg,
      median,
      latest: metrics[metrics.length - 1]?.value,
    };
  }

  getUptime(serviceName: string, timeRange: { from: Date; to: Date }) {
    const healthCheck = this.healthChecks.get(serviceName);
    if (!healthCheck) return null;

    // Simulate uptime calculation
    return {
      percentage: healthCheck.uptime || 99.9,
      downtime: Math.random() * 60, // minutes
      incidents: Math.floor(Math.random() * 3),
    };
  }
}

// Export singleton instance
export const monitoring = new MonitoringService();

// Export utility functions
export function formatMetricValue(value: number, unit?: string): string {
  if (unit === 'bytes') {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(value) / Math.log(1024));
    return `${(value / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  }

  if (unit === 'percentage') {
    return `${value.toFixed(1)}%`;
  }

  if (unit === 'milliseconds') {
    if (value > 1000) {
      return `${(value / 1000).toFixed(1)}s`;
    }
    return `${value.toFixed(0)}ms`;
  }

  if (unit === 'seconds') {
    if (value > 60) {
      const minutes = Math.floor(value / 60);
      const seconds = Math.floor(value % 60);
      return `${minutes}m ${seconds}s`;
    }
    return `${value.toFixed(1)}s`;
  }

  return value.toFixed(2) + (unit ? ` ${unit}` : '');
}

export function getMetricColor(
  value: number,
  thresholds: { warning: number; critical: number },
): string {
  if (value >= thresholds.critical) {
    return 'text-red-600 dark:text-red-400';
  }
  if (value >= thresholds.warning) {
    return 'text-yellow-600 dark:text-yellow-400';
  }
  return 'text-green-600 dark:text-green-400';
}

export function getStatusIcon(status: HealthCheck['status']): string {
  switch (status) {
    case 'healthy':
      return '✅';
    case 'degraded':
      return '⚠️';
    case 'unhealthy':
      return '❌';
    default:
      return '❓';
  }
}
