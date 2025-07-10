// src/lib/api/client.ts

import { errorUtils } from '@/lib/error-handling';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  status: number;
}

export interface ApiError {
  message: string;
  code: string;
  details?: unknown;
  status: number;
}

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  retries?: number;
  requireAuth?: boolean;
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private authToken: string | null = null;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  private getHeaders(config?: RequestConfig): Record<string, string> {
    const headers = {
      ...this.defaultHeaders,
      ...config?.headers,
    };

    if (config?.requireAuth !== false && this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  private async makeRequest<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      body,
      timeout = 10000,
      retries = 3,
    } = config;

    const url = `${this.baseURL}${endpoint}`;
    const headers = this.getHeaders(config);

    const fetchConfig: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(timeout),
    };

    if (body && method !== 'GET') {
      fetchConfig.body = JSON.stringify(body);
    }

    return errorUtils.withRetry(async () => {
      const response = await fetch(url, fetchConfig);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw errorUtils.handleApiError({
          response: {
            status: response.status,
            data: errorData,
          },
          message: errorData.message || `HTTP ${response.status}`,
        });
      }

      const data = await response.json();
      return {
        data: data.data || data,
        message: data.message,
        success: data.success ?? true,
        status: response.status,
      };
    }, retries);
  }

  // HTTP Methods
  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'POST', body });
  }

  async put<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'PUT', body });
  }

  async patch<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'DELETE' });
  }

  // Upload method for file uploads
  async upload<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, unknown>,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const headers = this.getHeaders(config);
    delete headers['Content-Type']; // Let browser set multipart boundary

    return this.makeRequest<T>(endpoint, {
      ...config,
      method: 'POST',
      headers,
      body: formData,
    } as RequestConfig);
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Helper hooks for React components
export function useApiClient() {
  return apiClient;
}

// Type-safe API response handler
export async function handleApiCall<T>(
  apiCall: () => Promise<ApiResponse<T>>
): Promise<{ data: T | null; error: Error | null; loading: boolean }> {
  try {
    const response = await apiCall();
    return { data: response.data, error: null, loading: false };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
      loading: false,
    };
  }
}