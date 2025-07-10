// src/hooks/use-api.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import { ApiResponse } from '@/lib/api/client';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  success: boolean;
}

export interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
  retries?: number;
  retryDelay?: number;
}

/**
 * Hook for handling API calls with loading, error, and success states
 */
export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
) {
  const {
    immediate = false,
    onSuccess,
    onError,
    retries = 0,
    retryDelay = 1000,
  } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
    success: false,
  });

  const mountedRef = useRef(true);
  const retryCountRef = useRef(0);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async () => {
    if (!mountedRef.current) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiCall();
      
      if (!mountedRef.current) return;

      setState({
        data: response.data,
        loading: false,
        error: null,
        success: true,
      });

      retryCountRef.current = 0;
      onSuccess?.(response.data);
    } catch (error) {
      if (!mountedRef.current) return;

      const errorObj = error instanceof Error ? error : new Error(String(error));
      
      // Retry logic
      if (retryCountRef.current < retries) {
        retryCountRef.current++;
        setTimeout(() => {
          if (mountedRef.current) {
            execute();
          }
        }, retryDelay * retryCountRef.current);
        return;
      }

      setState({
        data: null,
        loading: false,
        error: errorObj,
        success: false,
      });

      onError?.(errorObj);
    }
  }, [apiCall, onSuccess, onError, retries, retryDelay]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
    retryCountRef.current = 0;
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    ...state,
    execute,
    reset,
    retry: execute,
  };
}

/**
 * Hook for handling mutations (POST, PUT, DELETE)
 */
export function useMutation<T, P = unknown>(
  apiCall: (params: P) => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
) {
  const {
    onSuccess,
    onError,
  } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const mutate = useCallback(async (params: P) => {
    if (!mountedRef.current) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiCall(params);
      
      if (!mountedRef.current) return;

      setState({
        data: response.data,
        loading: false,
        error: null,
        success: true,
      });

      onSuccess?.(response.data);
      return response;
    } catch (error) {
      if (!mountedRef.current) return;

      const errorObj = error instanceof Error ? error : new Error(String(error));
      
      setState({
        data: null,
        loading: false,
        error: errorObj,
        success: false,
      });

      onError?.(errorObj);
      throw errorObj;
    }
  }, [apiCall, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
}

/**
 * Hook for handling paginated API calls
 */
export function usePaginatedApi<T>(
  apiCall: (params: unknown) => Promise<ApiResponse<{ items: T[]; total: number; page: number; totalPages: number }>>,
  initialParams: unknown = {},
  options: UseApiOptions = {}
) {
  const [params, setParams] = useState(initialParams);
  
  const {
    data,
    loading,
    error,
    success,
    execute,
    reset,
  } = useApi(() => apiCall(params), { ...options, immediate: true });

  const setPage = useCallback((page: number) => {
    setParams((prev: Record<string, unknown>) => ({ ...prev, page }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setParams((prev: Record<string, unknown>) => ({ ...prev, limit, page: 1 }));
  }, []);

  const setFilters = useCallback((filters: Record<string, unknown>) => {
    setParams((prev: Record<string, unknown>) => ({ ...prev, ...filters, page: 1 }));
  }, []);

  const refresh = useCallback(() => {
    execute();
  }, [execute]);

  useEffect(() => {
    execute();
  }, [params, execute]);

  return {
    data: data?.items || [],
    total: data?.total || 0,
    page: data?.page || 1,
    totalPages: data?.totalPages || 0,
    loading,
    error,
    success,
    params,
    setPage,
    setLimit,
    setFilters,
    setParams,
    refresh,
    reset,
  };
}

/**
 * Hook for debounced API calls (useful for search)
 */
export function useDebouncedApi<T>(
  apiCall: (query: string) => Promise<ApiResponse<T>>,
  delay: number = 300,
  options: UseApiOptions = {}
) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  const {
    data,
    loading,
    error,
    success,
    execute,
    reset,
  } = useApi(
    () => apiCall(debouncedQuery),
    { ...options, immediate: false }
  );

  useEffect(() => {
    if (debouncedQuery) {
      execute();
    } else {
      reset();
    }
  }, [debouncedQuery, execute, reset]);

  return {
    data,
    loading,
    error,
    success,
    query,
    setQuery,
    reset,
  };
}