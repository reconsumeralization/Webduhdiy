'use client';

// TODO: confirm version & license.
import React, { useState, useCallback, useRef } from 'react';
// TODO: confirm version & license.
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/* ---- embedded utilities ---- */
// No additional small utilities required.
/* ---- end embedded utilities ---- */

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  cache?: boolean;
  timeout?: number;
}

interface UseApiOptions {
  enabled?: boolean;
  retries?: number;
  retryDelay?: number;
  staleTime?: number;
  cacheTime?: number;
}

class ApiError extends Error {
  status: number;
  code?: string;
  details?: any;

  constructor(message: string, status: number, code?: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const defaultHeaders = {
  'Content-Type': 'application/json',
};

async function apiRequest<T>(
  url: string,
  options: ApiOptions = {},
): Promise<T> {
  const { method = 'GET', headers = {}, body, timeout = 30000 } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      headers: { ...defaultHeaders, ...headers },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      throw new ApiError(
        errorData.message || `HTTP ${response.status}`,
        response.status,
        errorData.code,
        errorData.details,
      );
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }

    return response.text() as unknown as T;
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (
      typeof DOMException !== 'undefined' &&
      error instanceof DOMException &&
      error.name === 'AbortError'
    ) {
      throw new ApiError('Request timeout', 408);
    }

    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0,
    );
  }
}

export function useApi<T>(
  url: string | null,
  options: ApiOptions = {},
  queryOptions: UseApiOptions = {},
) {
  const {
    enabled = true,
    retries = 3,
    retryDelay = 1000,
    staleTime = 300000, // 5 minutes
    cacheTime = 600000, // 10 minutes
  } = queryOptions;

  return useQuery({
    queryKey: ['api', url, options],
    queryFn: () => apiRequest<T>(url!, options),
    enabled: enabled && !!url,
    retry: retries,
    retryDelay,
    staleTime,
    gcTime: cacheTime,
  });
}

export function useApiMutation<TData = any, TVariables = any>(
  url: string,
  options: Omit<ApiOptions, 'body'> = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: TVariables) =>
      apiRequest<TData>(url, { ...options, body: variables }),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['api'] });
    },
    onError: (error: any) => {
      (window as any).showToast?.({
        type: 'error',
        title: 'Request Failed',
        message: error instanceof Error ? error.message : String(error),
      });
    },
  });
}

// Specialized API hooks
export function useApiGet<T>(url: string | null, options: UseApiOptions = {}) {
  return useApi<T>(url, { method: 'GET' }, options);
}

export function useApiPost<TData = any, TVariables = any>(url: string) {
  return useApiMutation<TData, TVariables>(url, { method: 'POST' });
}

export function useApiPut<TData = any, TVariables = any>(url: string) {
  return useApiMutation<TData, TVariables>(url, { method: 'PUT' });
}

export function useApiPatch<TData = any, TVariables = any>(url: string) {
  return useApiMutation<TData, TVariables>(url, { method: 'PATCH' });
}

export function useApiDelete<TData = any>(url: string) {
  return useApiMutation<TData, void>(url, { method: 'DELETE' });
}

// File upload hook
export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (
      file: File,
      url: string,
      options: {
        onProgress?: (progress: number) => void;
        additionalData?: Record<string, string>;
      } = {},
    ) => {
      const { onProgress, additionalData = {} } = options;

      setIsUploading(true);
      setProgress(0);
      setError(null);

      try {
        const formData = new FormData();
        formData.append('file', file);

        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, value);
        });

        const xhr = new XMLHttpRequest();

        return new Promise((resolve, reject) => {
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const progressPercent = (event.loaded / event.total) * 100;
              setProgress(progressPercent);
              onProgress?.(progressPercent);
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const response = JSON.parse(xhr.responseText);
                resolve(response);
              } catch {
                resolve(xhr.responseText);
              }
            } else {
              reject(new Error(`Upload failed: ${xhr.statusText}`));
            }
          };

          xhr.onerror = () => {
            reject(new Error('Upload failed'));
          };

          xhr.open('POST', url);
          xhr.send(formData);
        });
      } catch (error: any) {
        const errorMessage =
          error instanceof Error ? error.message : 'Upload failed';
        setError(errorMessage);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    [],
  );

  return {
    upload,
    isUploading,
    progress,
    error,
  };
}

// Paginated API hook
export function usePaginatedApi<T>(
  baseUrl: string,
  options: {
    pageSize?: number;
    enabled?: boolean;
    filters?: Record<string, any>;
  } = {},
) {
  const { pageSize = 20, enabled = true, filters = {} } = options;
  const [page, setPage] = useState(1);

  const url = `${baseUrl}?page=${page}&limit=${pageSize}&${new URLSearchParams(filters)}`;

  const query = useApi<{
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }>(url, { method: 'GET' }, { enabled });

  const nextPage = useCallback(() => {
    if (query.data?.pagination.hasNext) {
      setPage((prev) => prev + 1);
    }
  }, [query.data?.pagination?.hasNext]);

  const prevPage = useCallback(() => {
    if (query.data?.pagination.hasPrev) {
      setPage((prev) => prev - 1);
    }
  }, [query.data?.pagination?.hasPrev]);

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const reset = useCallback(() => {
    setPage(1);
  }, []);

  return {
    ...query,
    page,
    nextPage,
    prevPage,
    goToPage,
    reset,
    pagination: query.data?.pagination,
    items: query.data?.data || [],
  };
}

// Batch API requests
export function useBatchApi() {
  const [requests, setRequests] = useState<
    Array<{
      id: string;
      url: string;
      options: ApiOptions;
      status: 'pending' | 'success' | 'error';
      result?: any;
      error?: string;
    }>
  >([]);

  const addRequest = useCallback(
    (id: string, url: string, options: ApiOptions = {}) => {
      setRequests((prev) => [...prev, { id, url, options, status: 'pending' }]);
    },
    [],
  );

  const executeBatch = useCallback(async () => {
    const pendingRequests = requests.filter((req) => req.status === 'pending');

    const promises = pendingRequests.map(async (req) => {
      try {
        const result = await apiRequest(req.url, req.options);
        return { ...req, status: 'success' as const, result };
      } catch (error: any) {
        return {
          ...req,
          status: 'error' as const,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    });

    const results = await Promise.all(promises);

    setRequests((prev) =>
      prev.map((req) => {
        const result = results.find((r) => r.id === req.id);
        return result || req;
      }),
    );

    return results;
  }, [requests]);

  const clearRequests = useCallback(() => {
    setRequests([]);
  }, []);

  return {
    requests,
    addRequest,
    executeBatch,
    clearRequests,
  };
}
