// Advanced Components for webduh 10X Platform
export { default as CommandPalette, useCommandPalette } from './CommandPalette';
export { default as RealTimeMonitoring } from './RealTimeMonitoring';
export { default as SecurityDashboard } from './SecurityDashboard';
export { default as PerformanceOptimizer } from './PerformanceOptimizer';
export { default as AIAnalyticsDashboard } from './AIAnalyticsDashboard';
export { default as MultiCloudManager } from './MultiCloudManager';
export { default as CostOptimizationEngine } from './CostOptimizationEngine';
export { default as CollaborationHub } from './CollaborationHub';
export { default as DevExperienceHub } from './DevExperienceHub';
export { default as AdminControlCenter } from './AdminControlCenter';
export { default as DeploymentEngine } from './DeploymentEngine';

// Types
export interface Command {
  id: string;
  name: string;
  description: string;
  icon: any;
  shortcut?: string;
  category: 'navigation' | 'actions' | 'ai' | 'recent' | 'suggestions';
  action: () => void;
  keywords?: string[];
  priority?: number;
}

export interface RealTimeMetric {
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

export interface MetricData {
  timestamp: number;
  value: number;
  status?: 'healthy' | 'warning' | 'critical';
}

export interface SecurityEvent {
  id: string;
  type: 'threat' | 'vulnerability' | 'compliance' | 'access' | 'anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: number;
  source: string;
  resolved?: boolean;
  affectedAssets?: string[];
}

export interface PerformanceMetric {
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
