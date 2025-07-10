// src/lib/error-handling.ts

/**
 * Comprehensive error handling utilities for FlexiAdmin
 */

export interface AppError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: string;
  userId?: string;
  context?: Record<string, unknown>;
}

export class CustomError extends Error {
  public readonly code: string;
  public readonly details?: unknown;
  public readonly timestamp: string;
  public readonly userId?: string;
  public readonly context?: Record<string, unknown>;

  constructor(
    code: string,
    message: string,
    details?: unknown,
    userId?: string,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.userId = userId;
    this.context = context;
  }
}

export class ValidationError extends CustomError {
  constructor(message: string, details?: unknown) {
    super('VALIDATION_ERROR', message, details);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends CustomError {
  constructor(message: string, details?: unknown) {
    super('NETWORK_ERROR', message, details);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends CustomError {
  constructor(message: string, details?: unknown) {
    super('AUTH_ERROR', message, details);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends CustomError {
  constructor(message: string, details?: unknown) {
    super('AUTHORIZATION_ERROR', message, details);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string, details?: unknown) {
    super('NOT_FOUND_ERROR', message, details);
    this.name = 'NotFoundError';
  }
}

/**
 * Error logging service
 */
export class ErrorLogger {
  private static instance: ErrorLogger;
  private errors: AppError[] = [];

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  log(error: Error | CustomError, context?: Record<string, unknown>): void {
    const appError: AppError = {
      code: error instanceof CustomError ? error.code : 'UNKNOWN_ERROR',
      message: error.message,
      details: error instanceof CustomError ? error.details : error.stack,
      timestamp: new Date().toISOString(),
      userId: error instanceof CustomError ? error.userId : undefined,
      context: {
        ...(error instanceof CustomError ? error.context : {}),
        ...context,
      },
    };

    this.errors.push(appError);
    this.sendToMonitoring(appError);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', appError);
    }
  }

  private sendToMonitoring(error: AppError): void {
    // In production, send to monitoring service
    // For now, we'll just store it locally
    if (typeof window !== 'undefined') {
      const storedErrors = localStorage.getItem('flexiadmin_errors');
      const errors = storedErrors ? JSON.parse(storedErrors) : [];
      errors.push(error);
      
      // Keep only last 100 errors
      if (errors.length > 100) {
        errors.splice(0, errors.length - 100);
      }
      
      localStorage.setItem('flexiadmin_errors', JSON.stringify(errors));
    }
  }

  getErrors(): AppError[] {
    return [...this.errors];
  }

  clearErrors(): void {
    this.errors = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem('flexiadmin_errors');
    }
  }
}

/**
 * Error handling utilities
 */
export const errorUtils = {
  /**
   * Safely handle async operations with error catching
   */
  async safeAsync<T>(
    operation: () => Promise<T>,
    fallback?: T
  ): Promise<{ data: T | null; error: Error | null }> {
    try {
      const data = await operation();
      return { data, error: null };
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      ErrorLogger.getInstance().log(errorObj);
      return { data: fallback || null, error: errorObj };
    }
  },

  /**
   * Safely handle synchronous operations with error catching
   */
  safeSync<T>(
    operation: () => T,
    fallback?: T
  ): { data: T | null; error: Error | null } {
    try {
      const data = operation();
      return { data, error: null };
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      ErrorLogger.getInstance().log(errorObj);
      return { data: fallback || null, error: errorObj };
    }
  },

  /**
   * Retry operation with exponential backoff
   */
  async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt === maxRetries) {
          ErrorLogger.getInstance().log(lastError, { 
            maxRetries, 
            totalAttempts: attempt + 1 
          });
          throw lastError;
        }
        
        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  },

  /**
   * Handle API errors with proper error types
   */
  handleApiError(error: unknown): CustomError {
    const errorObj = error as { response?: { status: number; data?: { message?: string; errors?: unknown } }; request?: unknown; message?: string };
    if (errorObj.response) {
      const status = errorObj.response.status;
      const message = errorObj.response.data?.message || errorObj.message;
      
      switch (status) {
        case 401:
          return new AuthenticationError(message || 'Authentication failed');
        case 403:
          return new AuthorizationError(message || 'Authorization failed');
        case 404:
          return new NotFoundError(message || 'Not found');
        case 422:
          return new ValidationError(message || 'Validation failed', errorObj.response.data?.errors);
        default:
          return new NetworkError(message || 'Network error', { status, response: errorObj.response.data });
      }
    } else if (errorObj.request) {
      return new NetworkError('Network request failed', { request: errorObj.request });
    } else {
      return new CustomError('UNKNOWN_ERROR', errorObj.message || 'Unknown error', errorObj);
    }
  },

  /**
   * Format error for user display
   */
  formatErrorForUser(error: Error): string {
    if (error instanceof ValidationError) {
      return error.message;
    }
    
    if (error instanceof NetworkError) {
      return 'Network error occurred. Please check your connection and try again.';
    }
    
    if (error instanceof AuthenticationError) {
      return 'Authentication failed. Please log in again.';
    }
    
    if (error instanceof AuthorizationError) {
      return 'You do not have permission to perform this action.';
    }
    
    if (error instanceof NotFoundError) {
      return 'The requested resource was not found.';
    }
    
    // Generic error message for unknown errors
    return 'An unexpected error occurred. Please try again later.';
  },

  /**
   * Check if error is recoverable
   */
  isRecoverable(error: Error): boolean {
    if (error instanceof NetworkError) {
      return true; // Network errors can be retried
    }
    
    if (error instanceof ValidationError) {
      return true; // User can fix validation errors
    }
    
    if (error instanceof AuthenticationError) {
      return true; // User can re-authenticate
    }
    
    return false; // Other errors are not recoverable
  }
};

// Note: This hook should be moved to a separate file with React imports
// For now, commenting out to fix build issues

/**
 * React hook for error handling
 */
/* 
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);
  const [isRecoverable, setIsRecoverable] = React.useState(false);

  const handleError = React.useCallback((error: Error) => {
    setError(error);
    setIsRecoverable(errorUtils.isRecoverable(error));
    ErrorLogger.getInstance().log(error);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
    setIsRecoverable(false);
  }, []);

  const retryOperation = React.useCallback(async (operation: () => Promise<any>) => {
    try {
      clearError();
      await operation();
    } catch (error) {
      handleError(error instanceof Error ? error : new Error(String(error)));
    }
  }, [clearError, handleError]);

  return {
    error,
    isRecoverable,
    handleError,
    clearError,
    retryOperation,
    formatError: (error: Error) => errorUtils.formatErrorForUser(error),
  };
}
*/

// Global error handler setup
export function setupGlobalErrorHandling(): void {
  // Handle unhandled promise rejections
  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
      ErrorLogger.getInstance().log(error, { type: 'unhandledrejection' });
    });

    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      const error = event.error instanceof Error ? event.error : new Error(event.message);
      ErrorLogger.getInstance().log(error, { type: 'uncaughterror' });
    });
  }
}

// Export singleton instance
export const errorLogger = ErrorLogger.getInstance();