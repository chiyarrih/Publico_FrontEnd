// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================
// Comprehensive error handling system with user-friendly messages,
// error recovery, and logging capabilities.
// ============================================================================

import toast from 'react-hot-toast';

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Error categories for better handling
 */
export enum ErrorCategory {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  SERVER = 'server',
  CLIENT = 'client',
  TIMEOUT = 'timeout',
  FILE_UPLOAD = 'file_upload',
  BUSINESS_LOGIC = 'business_logic'
}

/**
 * Error interface
 */
export interface AppError {
  code: string;
  message: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  timestamp: Date;
  context?: Record<string, any>;
  recoverable: boolean;
  userMessage: string;
  technicalMessage?: string;
}

/**
 * Error recovery actions
 */
export interface ErrorRecoveryAction {
  label: string;
  action: () => void | Promise<void>;
  primary?: boolean;
}

/**
 * Error handler configuration
 */
export interface ErrorHandlerConfig {
  logErrors: boolean;
  showToast: boolean;
  autoRetry: boolean;
  maxRetries: number;
  retryDelay: number;
  fallbackMessage: string;
}

/**
 * Default error handler configuration
 */
const DEFAULT_CONFIG: ErrorHandlerConfig = {
  logErrors: true,
  showToast: true,
  autoRetry: false,
  maxRetries: 3,
  retryDelay: 1000,
  fallbackMessage: 'An unexpected error occurred. Please try again.'
};

/**
 * Error code mappings to user-friendly messages
 */
const ERROR_MESSAGES: Record<string, string> = {
  // Network errors
  'NETWORK_ERROR': 'Unable to connect to the server. Please check your internet connection.',
  'TIMEOUT_ERROR': 'The request took too long to complete. Please try again.',
  'OFFLINE_ERROR': 'You appear to be offline. Please check your internet connection.',
  
  // Authentication errors
  'AUTH_TOKEN_EXPIRED': 'Your session has expired. Please log in again.',
  'AUTH_INVALID_CREDENTIALS': 'Invalid email or password. Please check your credentials.',
  'AUTH_ACCOUNT_LOCKED': 'Your account has been locked. Please contact support.',
  'AUTH_ACCOUNT_NOT_VERIFIED': 'Please verify your email address before logging in.',
  
  // Validation errors
  'VALIDATION_REQUIRED_FIELD': 'This field is required.',
  'VALIDATION_INVALID_EMAIL': 'Please enter a valid email address.',
  'VALIDATION_INVALID_PHONE': 'Please enter a valid phone number.',
  'VALIDATION_INVALID_PASSWORD': 'Password must be at least 8 characters with uppercase, lowercase, number, and special character.',
  'VALIDATION_FILE_TOO_LARGE': 'File size exceeds the maximum allowed limit.',
  'VALIDATION_INVALID_FILE_TYPE': 'Invalid file type. Please select a supported file format.',
  
  // Server errors
  'SERVER_ERROR_500': 'Server error occurred. Please try again later.',
  'SERVER_ERROR_503': 'Service temporarily unavailable. Please try again later.',
  'SERVER_ERROR_502': 'Bad gateway. Please try again later.',
  
  // Business logic errors
  'BUSINESS_INSUFFICIENT_FUNDS': 'Insufficient funds for this transaction.',
  'BUSINESS_DUPLICATE_ENTRY': 'This entry already exists.',
  'BUSINESS_INVALID_OPERATION': 'This operation is not allowed.',
  
  // File upload errors
  'FILE_UPLOAD_FAILED': 'File upload failed. Please try again.',
  'FILE_VIRUS_DETECTED': 'File contains potentially malicious content.',
  'FILE_CORRUPTED': 'File appears to be corrupted. Please try a different file.',
  
  // Generic errors
  'UNKNOWN_ERROR': 'An unexpected error occurred. Please try again.',
  'PERMISSION_DENIED': 'You do not have permission to perform this action.',
  'RESOURCE_NOT_FOUND': 'The requested resource was not found.',
  'RATE_LIMIT_EXCEEDED': 'Too many requests. Please wait a moment and try again.'
};

/**
 * Error severity styling
 */
const ERROR_STYLES: Record<ErrorSeverity, { bg: string; text: string; border: string }> = {
  [ErrorSeverity.LOW]: {
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200'
  },
  [ErrorSeverity.MEDIUM]: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-800',
    border: 'border-yellow-200'
  },
  [ErrorSeverity.HIGH]: {
    bg: 'bg-orange-50',
    text: 'text-orange-800',
    border: 'border-orange-200'
  },
  [ErrorSeverity.CRITICAL]: {
    bg: 'bg-red-50',
    text: 'text-red-800',
    border: 'border-red-200'
  }
};

/**
 * Creates a standardized error object
 */
export function createError(
  code: string,
  message: string,
  category: ErrorCategory = ErrorCategory.CLIENT,
  severity: ErrorSeverity = ErrorSeverity.MEDIUM,
  context?: Record<string, any>,
  recoverable: boolean = true
): AppError {
  return {
    code,
    message,
    category,
    severity,
    timestamp: new Date(),
    context,
    recoverable,
    userMessage: ERROR_MESSAGES[code] || message,
    technicalMessage: message
  };
}

/**
 * Extracts error information from various error sources
 */
export function parseError(error: any): AppError {
  // If it's already an AppError, return it
  if (error && typeof error === 'object' && error.code && error.category) {
    return error as AppError;
  }

  // Parse different error types
  if (error instanceof Error) {
    return parseErrorFromMessage(error.message, error);
  }

  if (typeof error === 'string') {
    return parseErrorFromMessage(error);
  }

  if (error?.response) {
    // HTTP response error
    const status = error.response.status;
    const data = error.response.data;
    
    let code = 'UNKNOWN_ERROR';
    let category = ErrorCategory.SERVER;
    let severity = ErrorSeverity.MEDIUM;

    if (status >= 500) {
      code = `SERVER_ERROR_${status}`;
      severity = ErrorSeverity.HIGH;
    } else if (status === 401) {
      code = 'AUTH_TOKEN_EXPIRED';
      category = ErrorCategory.AUTHENTICATION;
      severity = ErrorSeverity.HIGH;
    } else if (status === 403) {
      code = 'PERMISSION_DENIED';
      category = ErrorCategory.AUTHORIZATION;
      severity = ErrorSeverity.HIGH;
    } else if (status === 404) {
      code = 'RESOURCE_NOT_FOUND';
      category = ErrorCategory.CLIENT;
      severity = ErrorSeverity.MEDIUM;
    } else if (status === 429) {
      code = 'RATE_LIMIT_EXCEEDED';
      category = ErrorCategory.CLIENT;
      severity = ErrorSeverity.MEDIUM;
    }

    const message = data?.message || error.message || 'Request failed';
    
    return createError(
      code,
      message,
      category,
      severity,
      { status, responseData: data },
      status < 500
    );
  }

  // Network error
  if (error?.name === 'TypeError' && error.message === 'Failed to fetch') {
    return createError(
      'NETWORK_ERROR',
      'Network request failed',
      ErrorCategory.NETWORK,
      ErrorSeverity.HIGH,
      { originalError: error },
      true
    );
  }

  // Timeout error
  if (error?.name === 'AbortError') {
    return createError(
      'TIMEOUT_ERROR',
      'Request timeout',
      ErrorCategory.TIMEOUT,
      ErrorSeverity.MEDIUM,
      { originalError: error },
      true
    );
  }

  // Default error
  return createError(
    'UNKNOWN_ERROR',
    error?.message || 'An unexpected error occurred',
    ErrorCategory.CLIENT,
    ErrorSeverity.MEDIUM,
    { originalError: error }
  );
}

/**
 * Parses error from message string
 */
function parseErrorFromMessage(message: string, originalError?: any): AppError {
  const lowerMessage = message.toLowerCase();

  // Check for common error patterns
  if (lowerMessage.includes('network') || lowerMessage.includes('fetch')) {
    return createError(
      'NETWORK_ERROR',
      message,
      ErrorCategory.NETWORK,
      ErrorSeverity.HIGH,
      { originalError }
    );
  }

  if (lowerMessage.includes('timeout')) {
    return createError(
      'TIMEOUT_ERROR',
      message,
      ErrorCategory.TIMEOUT,
      ErrorSeverity.MEDIUM,
      { originalError }
    );
  }

  if (lowerMessage.includes('unauthorized') || lowerMessage.includes('401')) {
    return createError(
      'AUTH_TOKEN_EXPIRED',
      message,
      ErrorCategory.AUTHENTICATION,
      ErrorSeverity.HIGH,
      { originalError }
    );
  }

  if (lowerMessage.includes('forbidden') || lowerMessage.includes('403')) {
    return createError(
      'PERMISSION_DENIED',
      message,
      ErrorCategory.AUTHORIZATION,
      ErrorSeverity.HIGH,
      { originalError }
    );
  }

  if (lowerMessage.includes('not found') || lowerMessage.includes('404')) {
    return createError(
      'RESOURCE_NOT_FOUND',
      message,
      ErrorCategory.CLIENT,
      ErrorSeverity.MEDIUM,
      { originalError }
    );
  }

  if (lowerMessage.includes('validation') || lowerMessage.includes('invalid')) {
    return createError(
      'VALIDATION_ERROR',
      message,
      ErrorCategory.VALIDATION,
      ErrorSeverity.MEDIUM,
      { originalError }
    );
  }

  // Default error
  return createError(
    'UNKNOWN_ERROR',
    message,
    ErrorCategory.CLIENT,
    ErrorSeverity.MEDIUM,
    { originalError }
  );
}

/**
 * Logs error information
 */
export function logError(error: AppError, config: ErrorHandlerConfig = DEFAULT_CONFIG): void {
  if (!config.logErrors) return;

  const logData = {
    code: error.code,
    message: error.message,
    category: error.category,
    severity: error.severity,
    timestamp: error.timestamp.toISOString(),
    context: error.context,
    stack: error.context?.originalError?.stack,
    userAgent: navigator.userAgent,
    url: window.location.href
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.group(`🚨 Error: ${error.code}`);
    console.error('Message:', error.message);
    console.error('Category:', error.category);
    console.error('Severity:', error.severity);
    console.error('Context:', error.context);
    console.error('Full Error:', logData);
    console.groupEnd();
  }

  // Log to external service in production
  if (process.env.NODE_ENV === 'production') {
    // TODO: Implement external logging service (e.g., Sentry, LogRocket)
    console.error('Production Error:', logData);
  }
}

/**
 * Shows error toast notification
 */
export function showErrorToast(error: AppError, config: ErrorHandlerConfig = DEFAULT_CONFIG): void {
  if (!config.showToast) return;

  const style = ERROR_STYLES[error.severity];
  
  toast.error(error.userMessage, {
    duration: getToastDuration(error.severity),
    style: {
      background: style.bg.replace('bg-', ''),
      color: style.text.replace('text-', ''),
      border: `1px solid ${style.border.replace('border-', '')}`
    },
    icon: getErrorIcon(error.severity)
  });
}

/**
 * Gets appropriate toast duration based on severity
 */
function getToastDuration(severity: ErrorSeverity): number {
  switch (severity) {
    case ErrorSeverity.LOW:
      return 3000;
    case ErrorSeverity.MEDIUM:
      return 5000;
    case ErrorSeverity.HIGH:
      return 7000;
    case ErrorSeverity.CRITICAL:
      return 10000;
    default:
      return 5000;
  }
}

/**
 * Gets appropriate error icon based on severity
 */
function getErrorIcon(severity: ErrorSeverity): string {
  switch (severity) {
    case ErrorSeverity.LOW:
      return 'ℹ️';
    case ErrorSeverity.MEDIUM:
      return '⚠️';
    case ErrorSeverity.HIGH:
      return '🚨';
    case ErrorSeverity.CRITICAL:
      return '💥';
    default:
      return '⚠️';
  }
}

/**
 * Main error handler function
 */
export function handleError(
  error: any,
  config: ErrorHandlerConfig = DEFAULT_CONFIG,
  recoveryActions?: ErrorRecoveryAction[]
): AppError {
  const appError = parseError(error);
  
  // Log the error
  logError(appError, config);
  
  // Show toast notification
  showErrorToast(appError, config);
  
  // Handle recovery actions if provided
  if (recoveryActions && recoveryActions.length > 0 && appError.recoverable) {
    // TODO: Implement recovery action UI
    console.log('Recovery actions available:', recoveryActions);
  }
  
  return appError;
}

/**
 * Retry mechanism with exponential backoff
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
    backoffFactor?: number;
    retryCondition?: (error: any) => boolean;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    retryCondition = () => true
  } = options;

  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Don't retry if condition is not met
      if (!retryCondition(error)) {
        throw error;
      }
      
      // Don't retry on last attempt
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(
        baseDelay * Math.pow(backoffFactor, attempt),
        maxDelay
      );
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

/**
 * Error boundary configuration interface
 */
export interface ErrorBoundaryConfig {
  onError?: (error: AppError) => void;
}

/**
 * Create error boundary configuration
 */
export function createErrorBoundaryConfig(config: ErrorBoundaryConfig = {}) {
  return config;
}

/**
 * Error handler function for use in React components
 */
export function createErrorHandler(config: ErrorHandlerConfig = DEFAULT_CONFIG) {
  return (error: any, recoveryActions?: ErrorRecoveryAction[]) => {
    return handleError(error, config, recoveryActions);
  };
}
