'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Project, FilterOptions, ApiResponse } from '../types';

interface UseProjectsOptions {
  filters?: FilterOptions;
  enabled?: boolean;
  refetchInterval?: number;
}

interface CreateProjectData {
  name: string;
  description?: string;
  framework?: string;
  repository?: {
    type: 'github' | 'gitlab' | 'bitbucket';
    url: string;
    branch?: string;
  };
  template?: string;
  environmentVariables?: Record<string, string>;
  buildCommand?: string;
  outputDirectory?: string;
  installCommand?: string;
  devCommand?: string;
  rootDirectory?: string;
}

interface UpdateProjectData {
  name?: string;
  description?: string;
  buildCommand?: string;
  outputDirectory?: string;
  installCommand?: string;
  devCommand?: string;
  rootDirectory?: string;
  nodeVersion?: string;
}

export function useProjects(options: UseProjectsOptions = {}) {
  const { filters, enabled = true, refetchInterval } = options;
  const queryClient = useQueryClient();

  // Build query key with filters
  const queryKey = useMemo(() => ['projects', filters], [filters]);

  // Fetch projects
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey,
    queryFn: async (): Promise<ApiResponse<Project[]>> => {
      const params = new URLSearchParams();

      if (filters?.search) params.append('search', filters.search);
      if (filters?.status)
        filters.status.forEach((s) => params.append('status', s));
      if (filters?.type) filters.type.forEach((t) => params.append('type', t));
      if (filters?.owner) params.append('owner', filters.owner);
      if (filters?.team) params.append('team', filters.team);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.sort) {
        params.append('sortField', filters.sort.field);
        params.append('sortDirection', filters.sort.direction);
      }
      if (filters?.dateRange) {
        params.append('startDate', filters.dateRange.start.toISOString());
        params.append('endDate', filters.dateRange.end.toISOString());
      }

      const response = await fetch(`/api/projects?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      return response.json();
    },
    enabled,
    refetchInterval,
    staleTime: 30000, // 30 seconds
  });

  const projects = response?.data || [];
  const pagination = response?.pagination;

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (data: CreateProjectData): Promise<Project> => {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create project');
      }

      return response.json();
    },
    onSuccess: (newProject) => {
      // Update the cache with the new project
      queryClient.setQueryData<ApiResponse<Project[]>>(queryKey, (old) => {
        if (!old) return { data: [newProject], success: true };
        return {
          ...old,
          data: [newProject, ...old.data],
        };
      });

      // Also update any related queries
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      (window as any).showToast?.({
        type: 'success',
        title: 'Project created',
        message: `${newProject.name} has been created successfully`,
      });
      (window as any).playSound?.('success');
    },
    onError: (error) => {
      (window as any).showToast?.({
        type: 'error',
        title: 'Creation failed',
        message:
          error instanceof Error ? error.message : 'Failed to create project',
      });
    },
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProjectData;
    }): Promise<Project> => {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update project');
      }

      return response.json();
    },
    onSuccess: (updatedProject) => {
      // Update the project in the cache
      queryClient.setQueryData<ApiResponse<Project[]>>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((project) =>
            project.id === updatedProject.id ? updatedProject : project,
          ),
        };
      });

      // Update individual project cache
      queryClient.setQueryData(['project', updatedProject.id], updatedProject);
      (window as any).showToast?.({
        type: 'success',
        title: 'Project updated',
        message: `${updatedProject.name} has been updated successfully`,
      });
    },
    onError: (error) => {
      (window as any).showToast?.({
        type: 'error',
        title: 'Update failed',
        message:
          error instanceof Error ? error.message : 'Failed to update project',
      });
    },
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete project');
      }
    },
    onSuccess: (_, deletedId) => {
      // Remove the project from the cache
      queryClient.setQueryData<ApiResponse<Project[]>>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.filter((project) => project.id !== deletedId),
        };
      });

      // Remove individual project cache
      queryClient.removeQueries({ queryKey: ['project', deletedId] });
      (window as any).showToast?.({
        type: 'success',
        title: 'Project deleted',
        message: 'Project has been deleted successfully',
      });
    },
    onError: (error) => {
      (window as any).showToast?.({
        type: 'error',
        title: 'Delete failed',
        message:
          error instanceof Error ? error.message : 'Failed to delete project',
      });
    },
  });

  // Archive/Unarchive project mutation
  const archiveProjectMutation = useMutation({
    mutationFn: async ({
      id,
      archive,
    }: {
      id: string;
      archive: boolean;
    }): Promise<Project> => {
      const response = await fetch(`/api/projects/${id}/archive`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archive }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to ${archive ? 'archive' : 'unarchive'} project`,
        );
      }

      return response.json();
    },
    onSuccess: (updatedProject, { archive }) => {
      // Update the project in the cache
      queryClient.setQueryData<ApiResponse<Project[]>>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((project) =>
            project.id === updatedProject.id ? updatedProject : project,
          ),
        };
      });
      (window as any).showToast?.({
        type: 'success',
        title: `Project ${archive ? 'archived' : 'unarchived'}`,
        message: `${updatedProject.name} has been ${archive ? 'archived' : 'unarchived'} successfully`,
      });
    },
  });

  // Transfer project mutation
  const transferProjectMutation = useMutation({
    mutationFn: async ({
      id,
      targetTeamId,
    }: {
      id: string;
      targetTeamId: string;
    }): Promise<Project> => {
      const response = await fetch(`/api/projects/${id}/transfer`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetTeamId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to transfer project');
      }

      return response.json();
    },
    onSuccess: (updatedProject) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      (window as any).showToast?.({
        type: 'success',
        title: 'Project transferred',
        message: `${updatedProject.name} has been transferred successfully`,
      });
    },
  });

  // Helper functions
  const createProject = useCallback(
    (data: CreateProjectData) => {
      return createProjectMutation.mutateAsync(data);
    },
    [createProjectMutation],
  );

  const updateProject = useCallback(
    (id: string, data: UpdateProjectData) => {
      return updateProjectMutation.mutateAsync({ id, data });
    },
    [updateProjectMutation],
  );

  const deleteProject = useCallback(
    (id: string) => {
      return deleteProjectMutation.mutateAsync(id);
    },
    [deleteProjectMutation],
  );

  const archiveProject = useCallback(
    (id: string, archive = true) => {
      return archiveProjectMutation.mutateAsync({ id, archive });
    },
    [archiveProjectMutation],
  );

  const unarchiveProject = useCallback(
    (id: string) => {
      return archiveProjectMutation.mutateAsync({ id, archive: false });
    },
    [archiveProjectMutation],
  );

  const transferProject = useCallback(
    (id: string, targetTeamId: string) => {
      return transferProjectMutation.mutateAsync({ id, targetTeamId });
    },
    [transferProjectMutation],
  );

  // Get project by ID helper
  const getProject = useCallback(
    (id: string) => {
      return projects.find((project) => project.id === id);
    },
    [projects],
  );

  // Filter helpers
  const getProjectsByStatus = useCallback(
    (status: string) => {
      return projects.filter((project) => project.status === status);
    },
    [projects],
  );

  const getProjectsByFramework = useCallback(
    (framework: string) => {
      return projects.filter(
        (project) => project.framework?.slug === framework,
      );
    },
    [projects],
  );

  const searchProjects = useCallback(
    (query: string) => {
      if (!query) return projects;
      const lowerQuery = query.toLowerCase();
      return projects.filter(
        (project) =>
          project.name.toLowerCase().includes(lowerQuery) ||
          project.description?.toLowerCase().includes(lowerQuery) ||
          project.framework?.name.toLowerCase().includes(lowerQuery),
      );
    },
    [projects],
  );

  // Statistics
  const stats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter((p) => p.status === 'active').length;
    const paused = projects.filter((p) => p.status === 'paused').length;
    const archived = projects.filter((p) => p.status === 'archived').length;

    const frameworkStats = projects.reduce(
      (acc, project) => {
        const framework = project.framework?.name || 'Unknown';
        acc[framework] = (acc[framework] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      total,
      active,
      paused,
      archived,
      frameworkStats,
    };
  }, [projects]);

  return {
    // Data
    projects,
    pagination,
    stats,

    // Loading states
    isLoading,
    isError,
    error,
    isRefetching,

    // Mutations
    createProject,
    updateProject,
    deleteProject,
    archiveProject,
    unarchiveProject,
    transferProject,

    // Mutation states
    isCreating: createProjectMutation.isPending,
    isUpdating: updateProjectMutation.isPending,
    isDeleting: deleteProjectMutation.isPending,
    isArchiving: archiveProjectMutation.isPending,
    isTransferring: transferProjectMutation.isPending,

    // Helpers
    refetch,
    getProject,
    getProjectsByStatus,
    getProjectsByFramework,
    searchProjects,
  };
}

// Individual project hook
export function useProject(id: string, options: { enabled?: boolean } = {}) {
  const { enabled = true } = options;
  const queryClient = useQueryClient();

  const {
    data: project,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['project', id],
    queryFn: async (): Promise<Project> => {
      const response = await fetch(`/api/projects/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Project not found');
        }
        throw new Error('Failed to fetch project');
      }
      return response.json();
    },
    enabled: enabled && !!id,
    staleTime: 30000,
  });

  // Refresh project data
  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['project', id] });
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  }, [queryClient, id]);

  return {
    project,
    isLoading,
    isError,
    error,
    refetch,
    refresh,
  };
}
