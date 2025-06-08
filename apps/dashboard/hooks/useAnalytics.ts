'use client';

// TODO: confirm version & license.
import React, { useState, useEffect, useCallback, useMemo } from 'react';
// TODO: confirm version & license.
import { useQuery } from '@tanstack/react-query';

/* ---- embedded utilities ---- */
// Types for analytics data

export interface AnalyticsDataPoint {
  date: string;
  value: number;
}

export interface BandwidthDataPoint {
  date: string;
  bytes: number;
}

export interface PerformanceMetrics {
  avgLoadTime: number;
  lighthouseScore: number;
  avgLCP: number;
  avgCLS: number;
}

export interface PageAnalytics {
  path: string;
  views: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgTimeOnPage: number;
}

export interface CountryAnalytics {
  country: string;
  visitors: number;
  percentage: number;
}

export interface DeviceAnalytics {
  type: 'desktop' | 'mobile' | 'tablet';
  visitors: number;
}

export interface ProjectAnalytics {
  pageViews: AnalyticsDataPoint[];
  uniqueVisitors: AnalyticsDataPoint[];
  bandwidth: BandwidthDataPoint[];
  performance: PerformanceMetrics;
  topPages: PageAnalytics[];
  topCountries: CountryAnalytics[];
  topDevices: DeviceAnalytics[];
}

export interface ApiResponse<T> {
  data: T;
  [key: string]: any;
}
/* ---- end embedded utilities ---- */

interface UseAnalyticsOptions {
  projectId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  interval?: 'hour' | 'day' | 'week' | 'month';
  enabled?: boolean;
  realtime?: boolean;
}

interface AnalyticsFilters {
  page?: string;
  country?: string;
  referrer?: string;
  device?: string;
}

export function useAnalytics(options: UseAnalyticsOptions = {}) {
  const {
    projectId,
    dateRange,
    interval = 'day',
    enabled = true,
    realtime = false,
  } = options;

  const queryKey = useMemo(
    () => ['analytics', projectId, dateRange, interval],
    [projectId, dateRange, interval],
  );

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey,
    queryFn: async (): Promise<ApiResponse<ProjectAnalytics>> => {
      const params = new URLSearchParams();

      if (projectId) params.append('projectId', projectId);
      if (dateRange) {
        params.append('startDate', dateRange.start.toISOString());
        params.append('endDate', dateRange.end.toISOString());
      }
      params.append('interval', interval);

      const response = await fetch(`/api/analytics?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      return response.json();
    },
    enabled,
    refetchInterval: realtime ? 30000 : undefined, // 30 seconds for real-time
    staleTime: 60000, // 1 minute
  });

  const analytics = response?.data;

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    if (!analytics) return null;

    const totalPageViews = analytics.pageViews.reduce(
      (sum, data) => sum + data.value,
      0,
    );
    const totalUniqueVisitors = analytics.uniqueVisitors.reduce(
      (sum, data) => sum + data.value,
      0,
    );
    const totalBandwidth = analytics.bandwidth.reduce(
      (sum, data) => sum + data.bytes,
      0,
    );

    // Calculate trends (comparing to previous period)
    const currentPeriodViews = analytics.pageViews
      .slice(-7)
      .reduce((sum, data) => sum + data.value, 0);
    const previousPeriodViews = analytics.pageViews
      .slice(-14, -7)
      .reduce((sum, data) => sum + data.value, 0);
    const viewsTrend =
      previousPeriodViews > 0
        ? ((currentPeriodViews - previousPeriodViews) / previousPeriodViews) *
          100
        : 0;

    const currentPeriodVisitors = analytics.uniqueVisitors
      .slice(-7)
      .reduce((sum, data) => sum + data.value, 0);
    const previousPeriodVisitors = analytics.uniqueVisitors
      .slice(-14, -7)
      .reduce((sum, data) => sum + data.value, 0);
    const visitorsTrend =
      previousPeriodVisitors > 0
        ? ((currentPeriodVisitors - previousPeriodVisitors) /
            previousPeriodVisitors) *
          100
        : 0;

    return {
      totalPageViews,
      totalUniqueVisitors,
      totalBandwidth,
      viewsTrend: Math.round(viewsTrend * 100) / 100,
      visitorsTrend: Math.round(visitorsTrend * 100) / 100,
      avgLoadTime: analytics.performance.avgLoadTime,
      lighthouseScore: analytics.performance.lighthouseScore,
    };
  }, [analytics]);

  // Top pages with more details
  const topPages = useMemo(() => {
    if (!analytics?.topPages) return [];

    return analytics.topPages.map((page) => ({
      ...page,
      conversionRate: page.views > 0 ? (1 - page.bounceRate) * 100 : 0,
      pageValue: page.views * 0.01, // Simple page value calculation
    }));
  }, [analytics?.topPages]);

  // Geographic data analysis
  const geographicStats = useMemo(() => {
    if (!analytics?.topCountries) return null;

    const totalVisitors = analytics.topCountries.reduce(
      (sum, country) => sum + country.visitors,
      0,
    );
    const topCountry = analytics.topCountries[0];
    const diversityIndex = analytics.topCountries.length;

    return {
      totalCountries: analytics.topCountries.length,
      topCountry: topCountry?.country || 'Unknown',
      topCountryPercentage: topCountry ? topCountry.percentage : 0,
      diversityIndex,
      totalVisitors,
    };
  }, [analytics?.topCountries]);

  // Device analysis
  const deviceStats = useMemo(() => {
    if (!analytics?.topDevices) return null;

    const desktop = analytics.topDevices
      .filter((d) => d.type === 'desktop')
      .reduce((sum, d) => sum + d.visitors, 0);
    const mobile = analytics.topDevices
      .filter((d) => d.type === 'mobile')
      .reduce((sum, d) => sum + d.visitors, 0);
    const tablet = analytics.topDevices
      .filter((d) => d.type === 'tablet')
      .reduce((sum, d) => sum + d.visitors, 0);
    const total = desktop + mobile + tablet;

    return {
      desktop: {
        count: desktop,
        percentage: total > 0 ? (desktop / total) * 100 : 0,
      },
      mobile: {
        count: mobile,
        percentage: total > 0 ? (mobile / total) * 100 : 0,
      },
      tablet: {
        count: tablet,
        percentage: total > 0 ? (tablet / total) * 100 : 0,
      },
      total,
    };
  }, [analytics?.topDevices]);

  // Performance insights
  const performanceInsights = useMemo(() => {
    if (!analytics?.performance) return null;

    const performance = analytics.performance;
    const insights = [];

    if (performance.avgLoadTime > 3000) {
      insights.push({
        type: 'warning',
        title: 'Slow Page Load',
        message: `Average load time is ${(performance.avgLoadTime / 1000).toFixed(1)}s. Consider optimizing images and reducing bundle size.`,
      });
    }

    if (performance.lighthouseScore < 70) {
      insights.push({
        type: 'error',
        title: 'Poor Lighthouse Score',
        message: `Lighthouse score is ${performance.lighthouseScore}. Focus on performance optimizations.`,
      });
    }

    if (performance.avgLCP > 2500) {
      insights.push({
        type: 'warning',
        title: 'Poor LCP Score',
        message: `Largest Contentful Paint is ${(performance.avgLCP / 1000).toFixed(1)}s. Optimize critical rendering path.`,
      });
    }

    if (performance.avgCLS > 0.1) {
      insights.push({
        type: 'warning',
        title: 'Layout Shifts',
        message: `Cumulative Layout Shift is ${performance.avgCLS.toFixed(3)}. Prevent unexpected layout shifts.`,
      });
    }

    return insights;
  }, [analytics?.performance]);

  return {
    // Raw data
    analytics,

    // Computed insights
    summaryStats,
    topPages,
    geographicStats,
    deviceStats,
    performanceInsights,

    // Loading states
    isLoading,
    isError,
    error,
    isRefetching,

    // Controls
    refetch,
  };
}

// Real-time analytics hook
export function useRealTimeAnalytics(
  projectId: string,
  options: { enabled?: boolean } = {},
) {
  const { enabled = true } = options;
  const [realtimeData, setRealtimeData] = useState({
    activeUsers: 0,
    pageViews: 0,
    currentPages: [] as { path: string; users: number }[],
    recentEvents: [] as any[],
  });

  useEffect(() => {
    if (!enabled || !projectId) return;

    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL}/analytics/${projectId}/realtime`,
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setRealtimeData(data);
    };

    ws.onerror = (error) => {
      console.error('Real-time analytics WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [enabled, projectId]);

  return realtimeData;
}

// Custom events tracking
export function useAnalyticsEvents() {
  const trackEvent = useCallback(
    async (event: {
      name: string;
      properties?: Record<string, any>;
      projectId?: string;
    }) => {
      try {
        await fetch('/api/analytics/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event),
        });
      } catch (error) {
        console.error('Failed to track event:', error);
      }
    },
    [],
  );

  const trackPageView = useCallback(
    async (projectId: string, path: string) => {
      await trackEvent({
        name: 'page_view',
        properties: { path },
        projectId,
      });
    },
    [trackEvent],
  );

  const trackCustomEvent = useCallback(
    async (
      projectId: string,
      eventName: string,
      properties?: Record<string, any>,
    ) => {
      await trackEvent({
        name: eventName,
        properties,
        projectId,
      });
    },
    [trackEvent],
  );

  return {
    trackEvent,
    trackPageView,
    trackCustomEvent,
  };
}

// Goals and conversions
export function useConversionAnalytics(
  projectId: string,
  options: UseAnalyticsOptions = {},
) {
  const { dateRange, enabled = true } = options;

  const {
    data: conversions,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['conversions', projectId, dateRange],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('projectId', projectId);

      if (dateRange) {
        params.append('startDate', dateRange.start.toISOString());
        params.append('endDate', dateRange.end.toISOString());
      }

      const response = await fetch(`/api/analytics/conversions?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch conversion data');
      }
      return response.json();
    },
    enabled: enabled && !!projectId,
    staleTime: 300000, // 5 minutes
  });

  return {
    conversions,
    isLoading,
    isError,
    error,
  };
}
