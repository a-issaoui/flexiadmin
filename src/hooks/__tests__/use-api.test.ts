// src/hooks/__tests__/use-api.test.ts

import { renderHook, waitFor } from '@testing-library/react';
import { useApi, useMutation, usePaginatedApi, useDebouncedApi } from '../use-api';
import type { ApiResponse } from '@/lib/api/client';

// Mock API responses
const mockSuccessResponse: ApiResponse<string> = {
  data: 'success',
  success: true,
  status: 200,
};

const mockErrorResponse = new Error('API Error');

describe('useApi', () => {
  it('should handle successful API calls', async () => {
    const mockApiCall = jest.fn().mockResolvedValue(mockSuccessResponse);
    
    const { result } = renderHook(() => useApi(mockApiCall, { immediate: true }));
    
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.data).toBe('success');
    expect(result.current.error).toBeNull();
    expect(result.current.success).toBe(true);
  });

  it('should handle API errors', async () => {
    const mockApiCall = jest.fn().mockRejectedValue(mockErrorResponse);
    
    const { result } = renderHook(() => useApi(mockApiCall, { immediate: true }));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.data).toBeNull();
    expect(result.current.error).toEqual(mockErrorResponse);
    expect(result.current.success).toBe(false);
  });

  it('should call onSuccess callback', async () => {
    const onSuccess = jest.fn();
    const mockApiCall = jest.fn().mockResolvedValue(mockSuccessResponse);
    
    renderHook(() => useApi(mockApiCall, { immediate: true, onSuccess }));
    
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith('success');
    });
  });

  it('should call onError callback', async () => {
    const onError = jest.fn();
    const mockApiCall = jest.fn().mockRejectedValue(mockErrorResponse);
    
    renderHook(() => useApi(mockApiCall, { immediate: true, onError }));
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(mockErrorResponse);
    });
  });

  it('should not execute immediately when immediate is false', () => {
    const mockApiCall = jest.fn().mockResolvedValue(mockSuccessResponse);
    
    const { result } = renderHook(() => useApi(mockApiCall, { immediate: false }));
    
    expect(result.current.loading).toBe(false);
    expect(mockApiCall).not.toHaveBeenCalled();
  });

  it('should execute when execute is called manually', async () => {
    const mockApiCall = jest.fn().mockResolvedValue(mockSuccessResponse);
    
    const { result } = renderHook(() => useApi(mockApiCall, { immediate: false }));
    
    result.current.execute();
    
    expect(result.current.loading).toBe(true);
    expect(mockApiCall).toHaveBeenCalled();
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should reset state when reset is called', async () => {
    const mockApiCall = jest.fn().mockResolvedValue(mockSuccessResponse);
    
    const { result } = renderHook(() => useApi(mockApiCall, { immediate: true }));
    
    await waitFor(() => {
      expect(result.current.success).toBe(true);
    });
    
    result.current.reset();
    
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.success).toBe(false);
    expect(result.current.loading).toBe(false);
  });
});

describe('useMutation', () => {
  it('should handle successful mutations', async () => {
    const mockMutation = jest.fn().mockResolvedValue(mockSuccessResponse);
    
    const { result } = renderHook(() => useMutation(mockMutation));
    
    expect(result.current.loading).toBe(false);
    
    const mutatePromise = result.current.mutate('test-param');
    
    expect(result.current.loading).toBe(true);
    
    const response = await mutatePromise;
    
    expect(response).toEqual(mockSuccessResponse);
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe('success');
    expect(result.current.success).toBe(true);
  });

  it('should handle mutation errors', async () => {
    const mockMutation = jest.fn().mockRejectedValue(mockErrorResponse);
    
    const { result } = renderHook(() => useMutation(mockMutation));
    
    await expect(result.current.mutate('test-param')).rejects.toThrow('API Error');
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toEqual(mockErrorResponse);
    expect(result.current.success).toBe(false);
  });

  it('should call onSuccess callback for mutations', async () => {
    const onSuccess = jest.fn();
    const mockMutation = jest.fn().mockResolvedValue(mockSuccessResponse);
    
    const { result } = renderHook(() => useMutation(mockMutation, { onSuccess }));
    
    await result.current.mutate('test-param');
    
    expect(onSuccess).toHaveBeenCalledWith('success');
  });
});

describe('usePaginatedApi', () => {
  const mockPaginatedResponse: ApiResponse<{
    items: string[];
    total: number;
    page: number;
    totalPages: number;
  }> = {
    data: {
      items: ['item1', 'item2', 'item3'],
      total: 100,
      page: 1,
      totalPages: 10,
    },
    success: true,
    status: 200,
  };

  it('should handle paginated data correctly', async () => {
    const mockApiCall = jest.fn().mockResolvedValue(mockPaginatedResponse);
    
    const { result } = renderHook(() => 
      usePaginatedApi(mockApiCall, { page: 1, limit: 10 })
    );
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.data).toEqual(['item1', 'item2', 'item3']);
    expect(result.current.total).toBe(100);
    expect(result.current.page).toBe(1);
    expect(result.current.totalPages).toBe(10);
  });

  it('should update page when setPage is called', async () => {
    const mockApiCall = jest.fn().mockResolvedValue(mockPaginatedResponse);
    
    const { result } = renderHook(() => 
      usePaginatedApi(mockApiCall, { page: 1, limit: 10 })
    );
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    result.current.setPage(2);
    
    expect(result.current.params.page).toBe(2);
    expect(mockApiCall).toHaveBeenCalledWith({ page: 2, limit: 10 });
  });

  it('should update limit and reset page when setLimit is called', async () => {
    const mockApiCall = jest.fn().mockResolvedValue(mockPaginatedResponse);
    
    const { result } = renderHook(() => 
      usePaginatedApi(mockApiCall, { page: 2, limit: 10 })
    );
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    result.current.setLimit(20);
    
    expect(result.current.params.limit).toBe(20);
    expect(result.current.params.page).toBe(1); // Should reset to 1
  });
});

describe('useDebouncedApi', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should debounce API calls', async () => {
    const mockApiCall = jest.fn().mockResolvedValue(mockSuccessResponse);
    
    const { result } = renderHook(() => 
      useDebouncedApi(mockApiCall, 300)
    );
    
    // Set query multiple times quickly
    result.current.setQuery('test1');
    result.current.setQuery('test2');
    result.current.setQuery('test3');
    
    // API should not be called yet
    expect(mockApiCall).not.toHaveBeenCalled();
    
    // Fast-forward time past debounce delay
    jest.advanceTimersByTime(300);
    
    await waitFor(() => {
      expect(mockApiCall).toHaveBeenCalledTimes(1);
      expect(mockApiCall).toHaveBeenCalledWith('test3');
    });
  });

  it('should reset data when query is empty', () => {
    const mockApiCall = jest.fn().mockResolvedValue(mockSuccessResponse);
    
    const { result } = renderHook(() => 
      useDebouncedApi(mockApiCall, 300)
    );
    
    result.current.setQuery('test');
    jest.advanceTimersByTime(300);
    
    result.current.setQuery('');
    
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
  });
});