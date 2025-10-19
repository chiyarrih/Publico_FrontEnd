// ============================================================================
// ERROR BOUNDARY COMPONENT
// ============================================================================
// React error boundary component for catching and handling errors
// ============================================================================

import React from 'react';
import { parseError, logError, AppError } from '../utils/errorHandling';

/**
 * Error boundary props
 */
interface ErrorBoundaryProps {
  fallback?: React.ComponentType<{ error: AppError; resetError: () => void }>;
  onError?: (error: AppError) => void;
  children: React.ReactNode;
}

/**
 * Error boundary state
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: AppError | null;
}

/**
 * Error boundary component for React
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    const appError = parseError(error);
    return { hasError: true, error: appError };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const appError = parseError(error);
    appError.context = {
      ...appError.context,
      componentStack: errorInfo.componentStack,
      errorBoundary: true
    };
    
    logError(appError);
    
    if (this.props.onError) {
      this.props.onError(appError);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <span className="text-4xl">🚨</span>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Something went wrong
                </h3>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {this.state.error.userMessage}
              </p>
              
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-2">
                  <summary className="text-xs text-gray-500 cursor-pointer">
                    Technical Details
                  </summary>
                  <pre className="mt-2 text-xs text-gray-700 bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify(this.state.error, null, 2)}
                  </pre>
                </details>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={this.resetError}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Try Again
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook for error handling in React components
 */
export function useErrorHandler(config: any = {}) {
  const handleErrorCallback = React.useCallback(
    (error: any, recoveryActions?: any[]) => {
      // Import the handleError function from the utils
      const { handleError } = require('../utils/errorHandling');
      return handleError(error, config, recoveryActions);
    },
    [config]
  );

  return handleErrorCallback;
}

/**
 * Hook for async operations with error handling
 */
export function useAsyncOperation<T>(
  operation: () => Promise<T>,
  options: {
    onSuccess?: (result: T) => void;
    onError?: (error: any) => void;
    retry?: boolean;
    retryOptions?: any;
  } = {}
) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<any>(null);
  const [result, setResult] = React.useState<T | null>(null);
  const handleError = useErrorHandler();

  const execute = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await operation();
      setResult(data);
      
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    } catch (err) {
      const appError = handleError(err);
      setError(appError);
      
      if (options.onError) {
        options.onError(appError);
      }
    } finally {
      setLoading(false);
    }
  }, [operation, options, handleError]);

  const reset = React.useCallback(() => {
    setError(null);
    setResult(null);
  }, []);

  return {
    execute,
    loading,
    error,
    result,
    reset
  };
}
