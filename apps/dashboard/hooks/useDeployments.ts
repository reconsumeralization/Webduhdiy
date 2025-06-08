'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Deployment,
  Build,
  BuildLog,
  FilterOptions,
  ApiResponse,
} from '../types';

interface UseDeploymentsOptions {
  projectId?: string;
  filters?: FilterOptions;
  enabled?: boolean;
  realtime?: boolean;
}

interface CreateDeploymentData {
  projectId: string;
  gitRef?: string;
  target?: 'production' | 'preview' | 'development';
  environment?: Record<string, string>;
}

export function useDeployments(options: UseDeploymentsOptions = {}) {
  const { projectId, filters, enabled = true, realtime = false } = options;
  const queryClient = useQueryClient();

  const queryKey = useMemo(
    () => ['deployments', projectId, filters],
    [projectId, filters],
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
    queryFn: async (): Promise<ApiResponse<Deployment[]>> => {
      const params = new URLSearchParams();

      if (projectId) params.append('projectId', projectId);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.status)
        filters.status.forEach((s) => params.append('status', s));
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await fetch(`/api/deployments?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch deployments');
      }
      return response.json();
    },
    enabled,
    refetchInterval: realtime ? 5000 : undefined,
    staleTime: 10000,
  });

  const deployments = response?.data || [];
  const pagination = response?.pagination;

  // Create deployment mutation
  const createDeploymentMutation = useMutation({
    mutationFn: async (data: CreateDeploymentData): Promise<Deployment> => {
      const response = await fetch('/api/deployments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create deployment');
      }

      return response.json();
    },
    onSuccess: (newDeployment) => {
      queryClient.setQueryData<ApiResponse<Deployment[]>>(queryKey, (old) => {
        if (!old) return { data: [newDeployment], success: true };
        return {
          ...old,
          data: [newDeployment, ...old.data],
        };
      });

      queryClient.invalidateQueries({ queryKey: ['deployments'] });
      (window as any).showToast?.({
        type: 'success',
        title: 'Deployment started',
        message: 'Your deployment is now building',
      });
      (window as any).playSound?.('deploy');
    },
    onError: (error) => {
      (window as any).showToast?.({
        type: 'error',
        title: 'Deployment failed',
        message:
          error instanceof Error ? error.message : 'Failed to start deployment',
      });
    },
  });

  // Cancel deployment mutation
  const cancelDeploymentMutation = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`/api/deployments/${id}/cancel`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel deployment');
      }
    },
    onSuccess: (_, cancelledId) => {
      queryClient.setQueryData<ApiResponse<Deployment[]>>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((deployment) =>
            deployment.id === cancelledId
              ? { ...deployment, state: 'CANCELED' }
              : deployment,
          ),
        };
      });
      (window as any).showToast?.({
        type: 'info',
        title: 'Deployment cancelled',
        message: 'Deployment has been cancelled',
      });
    },
  });

  // Promote deployment mutation
  const promoteDeploymentMutation = useMutation({
    mutationFn: async (id: string): Promise<Deployment> => {
      const response = await fetch(`/api/deployments/${id}/promote`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to promote deployment');
      }

      return response.json();
    },
    onSuccess: (promotedDeployment) => {
      queryClient.invalidateQueries({ queryKey: ['deployments'] });
      (window as any).showToast?.({
        type: 'success',
        title: 'Deployment promoted',
        message: 'Deployment is now live in production',
      });
    },
  });

  // Delete deployment mutation
  const deleteDeploymentMutation = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`/api/deployments/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete deployment');
      }
    },
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<ApiResponse<Deployment[]>>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.filter((deployment) => deployment.id !== deletedId),
        };
      });
      (window as any).showToast?.({
        type: 'success',
        title: 'Deployment deleted',
        message: 'Deployment has been deleted',
      });
    },
  });

  // Helper functions
  const createDeployment = useCallback(
    (data: CreateDeploymentData) => {
      return createDeploymentMutation.mutateAsync(data);
    },
    [createDeploymentMutation],
  );

  const cancelDeployment = useCallback(
    (id: string) => {
      return cancelDeploymentMutation.mutateAsync(id);
    },
    [cancelDeploymentMutation],
  );

  const promoteDeployment = useCallback(
    (id: string) => {
      return promoteDeploymentMutation.mutateAsync(id);
    },
    [promoteDeploymentMutation],
  );

  const deleteDeployment = useCallback(
    (id: string) => {
      return deleteDeploymentMutation.mutateAsync(id);
    },
    [deleteDeploymentMutation],
  );

  const getDeployment = useCallback(
    (id: string) => {
      return deployments.find((deployment) => deployment.id === id);
    },
    [deployments],
  );

  const getLatestDeployment = useCallback(() => {
    return deployments[0];
  }, [deployments]);

  const getProductionDeployment = useCallback(() => {
    return deployments.find(
      (deployment) =>
        deployment.target === 'production' && deployment.state === 'READY',
    );
  }, [deployments]);

  // Statistics
  const stats = useMemo(() => {
    const total = deployments.length;
    const building = deployments.filter((d) => d.state === 'BUILDING').length;
    const ready = deployments.filter((d) => d.state === 'READY').length;
    const error = deployments.filter((d) => d.state === 'ERROR').length;
    const canceled = deployments.filter((d) => d.state === 'CANCELED').length;

    const successRate = total > 0 ? (ready / total) * 100 : 0;

    return {
      total,
      building,
      ready,
      error,
      canceled,
      successRate: Math.round(successRate * 100) / 100,
    };
  }, [deployments]);

  return {
    // Data
    deployments,
    pagination,
    stats,

    // Loading states
    isLoading,
    isError,
    error,
    isRefetching,

    // Mutations
    createDeployment,
    cancelDeployment,
    promoteDeployment,
    deleteDeployment,

    // Mutation states
    isCreating: createDeploymentMutation.isPending,
    isCancelling: cancelDeploymentMutation.isPending,
    isPromoting: promoteDeploymentMutation.isPending,
    isDeleting: deleteDeploymentMutation.isPending,

    // Helpers
    refetch,
    getDeployment,
    getLatestDeployment,
    getProductionDeployment,
  };
}

// Individual deployment hook
export function useDeployment(
  id: string,
  options: { enabled?: boolean; realtime?: boolean } = {},
) {
  const { enabled = true, realtime = false } = options;
  const queryClient = useQueryClient();

  const {
    data: deployment,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['deployment', id],
    queryFn: async (): Promise<Deployment> => {
      const response = await fetch(`/api/deployments/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Deployment not found');
        }
        throw new Error('Failed to fetch deployment');
      }
      return response.json();
    },
    enabled: enabled && !!id,
    refetchInterval: realtime ? 2000 : undefined,
    staleTime: 5000,
  });

  return {
    deployment,
    isLoading,
    isError,
    error,
    refetch,
  };
}

// Build logs hook
export function useBuildLogs(
  deploymentId: string,
  options: { enabled?: boolean; realtime?: boolean } = {},
) {
  const { enabled = true, realtime = false } = options;
  const [logs, setLogs] = useState<BuildLog[]>([]);

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['build-logs', deploymentId],
    queryFn: async (): Promise<ApiResponse<BuildLog[]>> => {
      const response = await fetch(`/api/deployments/${deploymentId}/logs`);
      if (!response.ok) {
        throw new Error('Failed to fetch build logs');
      }
      return response.json();
    },
    enabled: enabled && !!deploymentId,
    refetchInterval: realtime ? 1000 : undefined,
  });

  // Update logs when data changes
  useEffect(() => {
    if (response?.data) {
      setLogs(response.data);
    }
  }, [response]);

  // WebSocket connection for real-time logs
  useEffect(() => {
    if (!realtime || !deploymentId) return;

    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL}/deployments/${deploymentId}/logs`,
    );

    ws.onmessage = (event) => {
      const logEntry: BuildLog = JSON.parse(event.data);
      setLogs((prev) => [...prev, logEntry]);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [realtime, deploymentId]);

  return {
    logs,
    isLoading,
    isError,
    error,
  };
}
