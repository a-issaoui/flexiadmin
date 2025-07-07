// src/lib/__tests__/error-handling.test.ts

import {
  CustomError,
  ValidationError,
  NetworkError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ErrorLogger,
  errorUtils,
} from '../error-handling';

describe('Custom Error Classes', () => {
  it('should create CustomError with all properties', () => {
    const error = new CustomError('TEST_ERROR', 'Test message', { detail: 'test' }, 'user123', { context: 'test' });
    
    expect(error.code).toBe('TEST_ERROR');
    expect(error.message).toBe('Test message');
    expect(error.details).toEqual({ detail: 'test' });
    expect(error.userId).toBe('user123');
    expect(error.context).toEqual({ context: 'test' });
    expect(error.timestamp).toBeDefined();
  });

  it('should create ValidationError', () => {
    const error = new ValidationError('Validation failed');
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.name).toBe('ValidationError');
  });

  it('should create NetworkError', () => {
    const error = new NetworkError('Network failed');
    expect(error.code).toBe('NETWORK_ERROR');
    expect(error.name).toBe('NetworkError');
  });

  it('should create AuthenticationError', () => {
    const error = new AuthenticationError('Auth failed');
    expect(error.code).toBe('AUTH_ERROR');
    expect(error.name).toBe('AuthenticationError');
  });

  it('should create AuthorizationError', () => {
    const error = new AuthorizationError('Not authorized');
    expect(error.code).toBe('AUTHORIZATION_ERROR');
    expect(error.name).toBe('AuthorizationError');
  });

  it('should create NotFoundError', () => {
    const error = new NotFoundError('Not found');
    expect(error.code).toBe('NOT_FOUND_ERROR');
    expect(error.name).toBe('NotFoundError');
  });
});

describe('ErrorLogger', () => {
  let logger: ErrorLogger;

  beforeEach(() => {
    logger = ErrorLogger.getInstance();
    logger.clearErrors();
  });

  afterEach(() => {
    logger.clearErrors();
  });

  it('should be a singleton', () => {
    const logger1 = ErrorLogger.getInstance();
    const logger2 = ErrorLogger.getInstance();
    expect(logger1).toBe(logger2);
  });

  it('should log errors', () => {
    const error = new Error('Test error');
    logger.log(error);
    
    const errors = logger.getErrors();
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toBe('Test error');
  });

  it('should log custom errors with additional context', () => {
    const error = new CustomError('TEST', 'Custom error', { detail: 'test' });
    logger.log(error, { additional: 'context' });
    
    const errors = logger.getErrors();
    expect(errors[0].code).toBe('TEST');
    expect(errors[0].context?.additional).toBe('context');
  });

  it('should clear errors', () => {
    logger.log(new Error('Test'));
    expect(logger.getErrors()).toHaveLength(1);
    
    logger.clearErrors();
    expect(logger.getErrors()).toHaveLength(0);
  });
});

describe('errorUtils', () => {
  describe('safeAsync', () => {
    it('should handle successful async operations', async () => {
      const operation = jest.fn().mockResolvedValue('success');
      const result = await errorUtils.safeAsync(operation);
      
      expect(result.data).toBe('success');
      expect(result.error).toBeNull();
    });

    it('should handle failed async operations', async () => {
      const operation = jest.fn().mockRejectedValue(new Error('Async error'));
      const result = await errorUtils.safeAsync(operation);
      
      expect(result.data).toBeNull();
      expect(result.error?.message).toBe('Async error');
    });

    it('should return fallback on error', async () => {
      const operation = jest.fn().mockRejectedValue(new Error('Error'));
      const result = await errorUtils.safeAsync(operation, 'fallback');
      
      expect(result.data).toBe('fallback');
      expect(result.error).toBeDefined();
    });
  });

  describe('safeSync', () => {
    it('should handle successful sync operations', () => {
      const operation = jest.fn().mockReturnValue('success');
      const result = errorUtils.safeSync(operation);
      
      expect(result.data).toBe('success');
      expect(result.error).toBeNull();
    });

    it('should handle failed sync operations', () => {
      const operation = jest.fn().mockImplementation(() => {
        throw new Error('Sync error');
      });
      const result = errorUtils.safeSync(operation);
      
      expect(result.data).toBeNull();
      expect(result.error?.message).toBe('Sync error');
    });
  });

  describe('withRetry', () => {
    it('should succeed on first try', async () => {
      const operation = jest.fn().mockResolvedValue('success');
      const result = await errorUtils.withRetry(operation, 3, 100);
      
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and eventually succeed', async () => {
      const operation = jest.fn()
        .mockRejectedValueOnce(new Error('Fail 1'))
        .mockRejectedValueOnce(new Error('Fail 2'))
        .mockResolvedValue('success');
      
      const result = await errorUtils.withRetry(operation, 3, 10);
      
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(3);
    });

    it('should throw after max retries', async () => {
      const operation = jest.fn().mockRejectedValue(new Error('Always fails'));
      
      await expect(errorUtils.withRetry(operation, 2, 10)).rejects.toThrow('Always fails');
      expect(operation).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });
  });

  describe('handleApiError', () => {
    it('should handle 401 authentication errors', () => {
      const error = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' }
        }
      };
      
      const result = errorUtils.handleApiError(error);
      expect(result).toBeInstanceOf(AuthenticationError);
      expect(result.message).toBe('Unauthorized');
    });

    it('should handle 403 authorization errors', () => {
      const error = {
        response: {
          status: 403,
          data: { message: 'Forbidden' }
        }
      };
      
      const result = errorUtils.handleApiError(error);
      expect(result).toBeInstanceOf(AuthorizationError);
    });

    it('should handle 404 not found errors', () => {
      const error = {
        response: {
          status: 404,
          data: { message: 'Not Found' }
        }
      };
      
      const result = errorUtils.handleApiError(error);
      expect(result).toBeInstanceOf(NotFoundError);
    });

    it('should handle 422 validation errors', () => {
      const error = {
        response: {
          status: 422,
          data: { message: 'Validation Error', errors: ['field error'] }
        }
      };
      
      const result = errorUtils.handleApiError(error);
      expect(result).toBeInstanceOf(ValidationError);
      expect(result.details).toEqual(['field error']);
    });

    it('should handle network errors', () => {
      const error = {
        request: { some: 'request' },
        message: 'Network Error'
      };
      
      const result = errorUtils.handleApiError(error);
      expect(result).toBeInstanceOf(NetworkError);
    });

    it('should handle unknown errors', () => {
      const error = {
        message: 'Unknown error'
      };
      
      const result = errorUtils.handleApiError(error);
      expect(result).toBeInstanceOf(CustomError);
      expect(result.code).toBe('UNKNOWN_ERROR');
    });
  });

  describe('formatErrorForUser', () => {
    it('should format validation errors', () => {
      const error = new ValidationError('Validation failed');
      const message = errorUtils.formatErrorForUser(error);
      expect(message).toBe('Validation failed');
    });

    it('should format network errors', () => {
      const error = new NetworkError('Network failed');
      const message = errorUtils.formatErrorForUser(error);
      expect(message).toBe('Network error occurred. Please check your connection and try again.');
    });

    it('should format authentication errors', () => {
      const error = new AuthenticationError('Auth failed');
      const message = errorUtils.formatErrorForUser(error);
      expect(message).toBe('Authentication failed. Please log in again.');
    });

    it('should format authorization errors', () => {
      const error = new AuthorizationError('Not authorized');
      const message = errorUtils.formatErrorForUser(error);
      expect(message).toBe('You do not have permission to perform this action.');
    });

    it('should format not found errors', () => {
      const error = new NotFoundError('Not found');
      const message = errorUtils.formatErrorForUser(error);
      expect(message).toBe('The requested resource was not found.');
    });

    it('should format unknown errors', () => {
      const error = new Error('Unknown error');
      const message = errorUtils.formatErrorForUser(error);
      expect(message).toBe('An unexpected error occurred. Please try again later.');
    });
  });

  describe('isRecoverable', () => {
    it('should identify recoverable errors', () => {
      expect(errorUtils.isRecoverable(new NetworkError('Network'))).toBe(true);
      expect(errorUtils.isRecoverable(new ValidationError('Validation'))).toBe(true);
      expect(errorUtils.isRecoverable(new AuthenticationError('Auth'))).toBe(true);
    });

    it('should identify non-recoverable errors', () => {
      expect(errorUtils.isRecoverable(new AuthorizationError('Forbidden'))).toBe(false);
      expect(errorUtils.isRecoverable(new Error('Unknown'))).toBe(false);
    });
  });
});