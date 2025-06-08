import { atom, map } from "nanostores";
import { logStore } from "../stores/logs";

// Performance metrics types
export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: "ms" | "bytes" | "count" | "percentage";
  timestamp: Date;
  context?: Record<string, any>;
  threshold?: {
    warning: number;
    critical: number;
  };
}

export interface BundleAnalysis {
  totalSize: number;
  gzippedSize: number;
  chunks: Array<{
    name: string;
    size: number;
    modules: Array<{
      name: string;
      size: number;
      imported: boolean;
    }>;
  }>;
  dependencies: Array<{
    name: string;
    size: number;
    version: string;
    duplicates: number;
  }>;
  recommendations: Array<{
    type: "warning" | "error" | "info";
    message: string;
    impact: "high" | "medium" | "low";
    fix?: string;
  }>;
}

export interface MemorySnapshot {
  usedJSSize: number;
  totalJSSize: number;
  jsEventListeners: number;
  documents: number;
  domNodes: number;
  layoutCount: number;
  recalcStyleCount: number;
  layoutDuration: number;
  recalcStyleDuration: number;
  scriptDuration: number;
  v8Only?: {
    usedSize: number;
    totalSize: number;
    totalAvailableSize: number;
  };
}

export interface NetworkMetrics {
  requests: Array<{
    url: string;
    method: string;
    status: number;
    duration: number;
    size: number;
    type: string;
    cached: boolean;
  }>;
  totalRequests: number;
  totalSize: number;
  averageResponseTime: number;
  cacheHitRate: number;
  failedRequests: number;
}

export interface RenderMetrics {
  fps: number;
  frameDrops: number;
  averageFrameTime: number;
  longestFrame: number;
  layoutShifts: Array<{
    value: number;
    sources: string[];
    timestamp: number;
  }>;
  paintMetrics: {
    firstPaint: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    firstInputDelay: number;
    cumulativeLayoutShift: number;
  };
}

// Performance optimization strategies
export interface OptimizationStrategy {
  id: string;
  name: string;
  description: string;
  category: "bundle" | "runtime" | "memory" | "network" | "render";
  impact: "high" | "medium" | "low";
  effort: "high" | "medium" | "low";
  enabled: boolean;
  auto: boolean;
  apply: () => Promise<void>;
  rollback: () => Promise<void>;
}

// Core Performance Monitor Class
class PerformanceMonitor {
  private metrics = map<Record<string, PerformanceMetric>>({});
  private isMonitoring = atom(false);
  private observers: Array<PerformanceObserver> = [];
  private intervals: Array<NodeJS.Timeout> = [];
  private memoryBaseline: MemorySnapshot | null = null;

  constructor() {
    this.setupPerformanceObservers();
    this.startContinuousMonitoring();
  }

  private setupPerformanceObservers() {
    if (typeof window === "undefined") return;

    try {
      // Long Task Observer
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.recordMetric({
            id: `long-task-${Date.now()}`,
            name: "Long Task",
            value: entry.duration,
            unit: "ms",
            timestamp: new Date(),
            context: {
              startTime: entry.startTime,
              entryType: entry.entryType,
            },
            threshold: { warning: 50, critical: 100 },
          });
        });
      });

      longTaskObserver.observe({ entryTypes: ["longtask"] });
      this.observers.push(longTaskObserver);

      // Layout Shift Observer
      const layoutShiftObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });

        if (clsValue > 0) {
          this.recordMetric({
            id: `cls-${Date.now()}`,
            name: "Cumulative Layout Shift",
            value: clsValue,
            unit: "count",
            timestamp: new Date(),
            threshold: { warning: 0.1, critical: 0.25 },
          });
        }
      });

      layoutShiftObserver.observe({ entryTypes: ["layout-shift"] });
      this.observers.push(layoutShiftObserver);

      // Largest Contentful Paint Observer
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];

        this.recordMetric({
          id: `lcp-${Date.now()}`,
          name: "Largest Contentful Paint",
          value: lastEntry.startTime,
          unit: "ms",
          timestamp: new Date(),
          threshold: { warning: 2500, critical: 4000 },
        });
      });

      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
      this.observers.push(lcpObserver);

      // First Input Delay Observer
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          this.recordMetric({
            id: `fid-${Date.now()}`,
            name: "First Input Delay",
            value: entry.processingStart - entry.startTime,
            unit: "ms",
            timestamp: new Date(),
            threshold: { warning: 100, critical: 300 },
          });
        });
      });

      fidObserver.observe({ entryTypes: ["first-input"] });
      this.observers.push(fidObserver);
    } catch (error) {
      logStore.logError("Failed to setup performance observers", error);
    }
  }

  private startContinuousMonitoring() {
    if (typeof window === "undefined") return;

    // Memory usage monitoring
    const memoryInterval = setInterval(() => {
      this.captureMemoryMetrics();
    }, 10000); // Every 10 seconds

    this.intervals.push(memoryInterval);

    // FPS monitoring
    const fpsInterval = setInterval(() => {
      this.measureFPS();
    }, 1000); // Every second

    this.intervals.push(fpsInterval);

    // Bundle size monitoring (if webpack stats available)
    this.analyzeBundleSize();

    this.isMonitoring.set(true);
  }

  private recordMetric(metric: PerformanceMetric) {
    this.metrics.setKey(metric.id, metric);

    // Check thresholds
    if (metric.threshold) {
      let level: "info" | "warning" | "error" = "info";
      if (metric.value >= metric.threshold.critical) {
        level = "error";
      } else if (metric.value >= metric.threshold.warning) {
        level = "warning";
      }

      if (level !== "info") {
        logStore.logError(`Performance ${level}: ${metric.name} = ${metric.value}${metric.unit}`, {
          metric,
          level,
        });
      }
    }

    // Trigger optimization if needed
    this.triggerOptimizationIfNeeded(metric);
  }

  private async captureMemoryMetrics() {
    if (!("memory" in performance)) return;

    try {
      const memInfo = (performance as any).memory;
      const snapshot: MemorySnapshot = {
        usedJSSize: memInfo.usedJSHeapSize,
        totalJSSize: memInfo.totalJSHeapSize,
        jsEventListeners: 0, // Would need to calculate
        documents: document.querySelectorAll("*").length,
        domNodes: document.getElementsByTagName("*").length,
        layoutCount: 0, // Would need performance API
        recalcStyleCount: 0, // Would need performance API
        layoutDuration: 0,
        recalcStyleDuration: 0,
        scriptDuration: 0,
        v8Only: {
          usedSize: memInfo.usedJSHeapSize,
          totalSize: memInfo.totalJSHeapSize,
          totalAvailableSize: memInfo.jsHeapSizeLimit,
        },
      };

      this.recordMetric({
        id: `memory-${Date.now()}`,
        name: "Memory Usage",
        value: snapshot.usedJSSize,
        unit: "bytes",
        timestamp: new Date(),
        context: snapshot,
        threshold: { warning: 50 * 1024 * 1024, critical: 100 * 1024 * 1024 }, // 50MB/100MB
      });

      // Detect memory leaks
      if (this.memoryBaseline) {
        const growth = snapshot.usedJSSize - this.memoryBaseline.usedJSSize;
        const growthRate = growth / (Date.now() - new Date(this.memoryBaseline.toString()).getTime());

        if (growthRate > 1000) {
          // 1KB/ms = potential leak
          this.recordMetric({
            id: `memory-leak-${Date.now()}`,
            name: "Memory Leak Detection",
            value: growthRate,
            unit: "bytes",
            timestamp: new Date(),
            context: { growth, baseline: this.memoryBaseline, current: snapshot },
            threshold: { warning: 500, critical: 1000 },
          });
        }
      } else {
        this.memoryBaseline = snapshot;
      }
    } catch (error) {
      logStore.logError("Failed to capture memory metrics", error);
    }
  }

  private measureFPS() {
    let fps = 0;
    let frameCount = 0;
    let lastTime = performance.now();

    const measureFrame = () => {
      const currentTime = performance.now();
      const delta = currentTime - lastTime;

      if (delta >= 1000) {
        fps = Math.round((frameCount * 1000) / delta);
        frameCount = 0;
        lastTime = currentTime;

        this.recordMetric({
          id: `fps-${Date.now()}`,
          name: "Frames Per Second",
          value: fps,
          unit: "count",
          timestamp: new Date(),
          threshold: { warning: 50, critical: 30 },
        });

        return;
      }

      frameCount++;
      requestAnimationFrame(measureFrame);
    };

    requestAnimationFrame(measureFrame);
  }

  private async analyzeBundleSize() {
    try {
      // This would typically connect to webpack-bundle-analyzer output
      // or a similar tool that provides bundle statistics
      const bundleStats = await this.getBundleStats();

      if (bundleStats) {
        this.recordMetric({
          id: `bundle-size-${Date.now()}`,
          name: "Bundle Size",
          value: bundleStats.totalSize,
          unit: "bytes",
          timestamp: new Date(),
          context: bundleStats,
          threshold: { warning: 1024 * 1024, critical: 2 * 1024 * 1024 }, // 1MB/2MB
        });
      }
    } catch (error) {
      logStore.logError("Failed to analyze bundle size", error);
    }
  }

  private async getBundleStats(): Promise<BundleAnalysis | null> {
    try {
      // In a real implementation, this would fetch from a build stats endpoint
      // or analyze the current loaded modules
      const modules = await this.getLoadedModules();

      return {
        totalSize: modules.reduce((sum, mod) => sum + mod.size, 0),
        gzippedSize: 0, // Would need actual gzip analysis
        chunks: [
          {
            name: "main",
            size: modules.reduce((sum, mod) => sum + mod.size, 0),
            modules: modules,
          },
        ],
        dependencies: [], // Would analyze package.json dependencies
        recommendations: this.generateBundleRecommendations(modules),
      };
    } catch (error) {
      return null;
    }
  }

  private async getLoadedModules() {
    // This is a simplified version - in practice you'd use webpack stats
    const scripts = Array.from(document.scripts);
    return scripts.map((script, index) => ({
      name: script.src || `inline-${index}`,
      size: script.textContent?.length || 0,
      imported: !!script.src,
    }));
  }

  private generateBundleRecommendations(modules: any[]): BundleAnalysis["recommendations"] {
    const recommendations: BundleAnalysis["recommendations"] = [];

    // Large modules check
    const largeModules = modules.filter((m) => m.size > 100000); // >100KB
    if (largeModules.length > 0) {
      recommendations.push({
        type: "warning",
        message: `Found ${largeModules.length} large modules (>100KB)`,
        impact: "high",
        fix: "Consider code splitting or lazy loading for large modules",
      });
    }

    // Duplicate modules check (simplified)
    const moduleNames = modules.map((m) => m.name.split("/").pop());
    const duplicates = moduleNames.filter((name, index) => moduleNames.indexOf(name) !== index);
    if (duplicates.length > 0) {
      recommendations.push({
        type: "error",
        message: `Found ${duplicates.length} duplicate modules`,
        impact: "medium",
        fix: "Use webpack deduplication or check for conflicting dependencies",
      });
    }

    return recommendations;
  }

  private triggerOptimizationIfNeeded(metric: PerformanceMetric) {
    // Auto-trigger optimizations based on metrics
    if (metric.threshold && metric.value >= metric.threshold.critical) {
      switch (metric.name) {
        case "Memory Usage":
          this.triggerMemoryOptimization();
          break;
        case "Bundle Size":
          this.triggerBundleOptimization();
          break;
        case "Frames Per Second":
          this.triggerRenderOptimization();
          break;
      }
    }
  }

  private async triggerMemoryOptimization() {
    logStore.logSystem("🧹 Triggering memory optimization");

    // Force garbage collection if available
    if ("gc" in window) {
      (window as any).gc();
    }

    // Clear unnecessary caches
    this.clearOldMetrics();

    // Trigger memory cleanup in stores
    // This would call cleanup methods in various stores
  }

  private async triggerBundleOptimization() {
    logStore.logSystem("📦 Triggering bundle optimization");

    // In a real implementation, this might:
    // - Lazy load non-critical modules
    // - Prefetch likely-needed modules
    // - Unload unused modules
  }

  private async triggerRenderOptimization() {
    logStore.logSystem("🎨 Triggering render optimization");

    // Reduce animation complexity
    document.documentElement.style.setProperty("--animation-complexity", "low");

    // Throttle non-critical updates
    // This would involve reducing update frequencies in various components
  }

  private clearOldMetrics() {
    const metrics = this.metrics.get();
    const cutoff = Date.now() - 24 * 60 * 60 * 1000; // 24 hours ago

    Object.keys(metrics).forEach((key) => {
      if (metrics[key].timestamp.getTime() < cutoff) {
        delete metrics[key];
      }
    });

    this.metrics.set(metrics);
  }

  // Public API
  getMetrics(): PerformanceMetric[] {
    return Object.values(this.metrics.get());
  }

  getMetricsByCategory(category: string): PerformanceMetric[] {
    return this.getMetrics().filter((m) => m.context?.category === category);
  }

  getMetricsSummary() {
    const metrics = this.getMetrics();
    const now = Date.now();
    const lastHour = metrics.filter((m) => now - m.timestamp.getTime() < 3600000);

    return {
      total: metrics.length,
      lastHour: lastHour.length,
      averageValues: this.calculateAverages(lastHour),
      thresholdViolations: metrics.filter((m) => m.threshold && m.value >= m.threshold.warning).length,
      criticalIssues: metrics.filter((m) => m.threshold && m.value >= m.threshold.critical).length,
    };
  }

  private calculateAverages(metrics: PerformanceMetric[]) {
    const grouped = metrics.reduce(
      (acc, metric) => {
        if (!acc[metric.name]) acc[metric.name] = [];
        acc[metric.name].push(metric.value);
        return acc;
      },
      {} as Record<string, number[]>,
    );

    return Object.keys(grouped).reduce(
      (acc, name) => {
        const values = grouped[name];
        acc[name] = values.reduce((sum, val) => sum + val, 0) / values.length;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  async generatePerformanceReport(): Promise<string> {
    const summary = this.getMetricsSummary();
    const recentMetrics = this.getMetrics().slice(-50); // Last 50 metrics

    const report = {
      timestamp: new Date().toISOString(),
      summary,
      recentMetrics,
      recommendations: await this.generateOptimizationRecommendations(),
      bundleAnalysis: await this.getBundleStats(),
    };

    return JSON.stringify(report, null, 2);
  }

  private async generateOptimizationRecommendations(): Promise<OptimizationStrategy[]> {
    const metrics = this.getMetrics();
    const recommendations: OptimizationStrategy[] = [];

    // Memory optimization
    const memoryMetrics = metrics.filter((m) => m.name === "Memory Usage");
    if (memoryMetrics.some((m) => m.threshold && m.value >= m.threshold.warning)) {
      recommendations.push({
        id: "memory-cleanup",
        name: "Memory Cleanup",
        description: "Clear unused caches and force garbage collection",
        category: "memory",
        impact: "high",
        effort: "low",
        enabled: true,
        auto: true,
        apply: async () => this.triggerMemoryOptimization(),
        rollback: async () => {
          /* No rollback needed */
        },
      });
    }

    // Bundle optimization
    const bundleMetrics = metrics.filter((m) => m.name === "Bundle Size");
    if (bundleMetrics.some((m) => m.threshold && m.value >= m.threshold.warning)) {
      recommendations.push({
        id: "lazy-loading",
        name: "Enable Lazy Loading",
        description: "Load non-critical components on demand",
        category: "bundle",
        impact: "high",
        effort: "medium",
        enabled: false,
        auto: false,
        apply: async () => this.enableLazyLoading(),
        rollback: async () => this.disableLazyLoading(),
      });
    }

    // Render optimization
    const fpsMetrics = metrics.filter((m) => m.name === "Frames Per Second");
    if (fpsMetrics.some((m) => m.threshold && m.value <= m.threshold.critical)) {
      recommendations.push({
        id: "reduce-animations",
        name: "Reduce Animations",
        description: "Simplify animations to improve render performance",
        category: "render",
        impact: "medium",
        effort: "low",
        enabled: false,
        auto: true,
        apply: async () => this.reduceAnimations(),
        rollback: async () => this.restoreAnimations(),
      });
    }

    return recommendations;
  }

  private async enableLazyLoading() {
    logStore.logSystem("🔄 Enabling lazy loading optimization");
    // Implementation would depend on the module system
  }

  private async disableLazyLoading() {
    logStore.logSystem("🔄 Disabling lazy loading optimization");
    // Rollback implementation
  }

  private async reduceAnimations() {
    logStore.logSystem("🎭 Reducing animation complexity");
    document.documentElement.style.setProperty("--animation-duration", "0.1s");
    document.documentElement.style.setProperty("--animation-complexity", "low");
  }

  private async restoreAnimations() {
    logStore.logSystem("🎭 Restoring full animations");
    document.documentElement.style.removeProperty("--animation-duration");
    document.documentElement.style.removeProperty("--animation-complexity");
  }

  cleanup() {
    this.observers.forEach((observer) => observer.disconnect());
    this.intervals.forEach((interval) => clearInterval(interval));
    this.isMonitoring.set(false);
    logStore.logSystem("🔧 Performance monitoring stopped");
  }
}

// Singleton instance
export const performanceOptimizer = new PerformanceMonitor();
