// src/types/api.types.ts

/**
 * Common API response types and interfaces
 */

// Base API response wrapper
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  status: number;
  timestamp?: string;
}

// Error response format
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  status: number;
  timestamp: string;
  path?: string;
  method?: string;
}

// Validation error details
export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

// Paginated response wrapper
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Common query parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams {
  search?: string;
  query?: string;
  q?: string;
}

export interface FilterParams {
  filters?: Record<string, any>;
  startDate?: Date | string;
  endDate?: Date | string;
}

export interface BaseQueryParams extends PaginationParams, SortParams, SearchParams, FilterParams {}

// File upload types
export interface FileUploadResponse {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  path: string;
  uploadedAt: Date;
  metadata?: Record<string, any>;
}

export interface BulkOperationResponse {
  processed: number;
  succeeded: number;
  failed: number;
  errors: Array<{
    index: number;
    error: string;
    item?: any;
  }>;
}

// Audit log types
export interface AuditLog {
  id: string;
  action: string;
  resource: string;
  resourceId: string;
  userId: string;
  userEmail: string;
  changes?: Record<string, { from: any; to: any }>;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

// Health check response
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: Date;
  uptime: number;
  version: string;
  services: Array<{
    name: string;
    status: 'healthy' | 'unhealthy';
    responseTime?: number;
    error?: string;
  }>;
}

// Statistics response
export interface StatsResponse {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  recentChanges: number;
  growth: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  breakdown: Record<string, number>;
}

// Export/Import types
export interface ExportRequest {
  format: 'csv' | 'xlsx' | 'json' | 'pdf';
  filters?: Record<string, any>;
  fields?: string[];
  includeDeleted?: boolean;
}

export interface ExportResponse {
  id: string;
  downloadUrl: string;
  filename: string;
  format: string;
  size: number;
  recordCount: number;
  createdAt: Date;
  expiresAt: Date;
}

export interface ImportRequest {
  file: File;
  options?: {
    skipFirstRow?: boolean;
    delimiter?: string;
    encoding?: string;
    mapping?: Record<string, string>;
    validateOnly?: boolean;
  };
}

export interface ImportResponse {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  totalRecords: number;
  processedRecords: number;
  successfulRecords: number;
  failedRecords: number;
  errors: Array<{
    row: number;
    field?: string;
    message: string;
    value?: any;
  }>;
  downloadErrorsUrl?: string;
  createdAt: Date;
  completedAt?: Date;
}

// Real-time updates
export interface WebSocketMessage<T = any> {
  type: string;
  payload: T;
  timestamp: Date;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface NotificationMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
  persistent?: boolean;
  timestamp: Date;
}

// Type helpers
export type ApiMethodType = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiEndpoint {
  method: ApiMethodType;
  path: string;
  authenticated?: boolean;
  roles?: string[];
  permissions?: string[];
}

// Request context
export interface RequestContext {
  userId?: string;
  userRole?: string;
  permissions?: string[];
  ipAddress?: string;
  userAgent?: string;
  locale?: string;
  timezone?: string;
}