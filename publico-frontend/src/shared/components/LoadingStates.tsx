// ============================================================================
// COMPREHENSIVE LOADING STATES & PROGRESS INDICATORS
// ============================================================================
// Advanced loading components with skeleton loaders, progress bars,
// and adaptive loading strategies based on network conditions.
// ============================================================================

import React from 'react';
import { useNetworkQuality, NetworkQuality } from '../hooks/useOffline';

/**
 * Loading spinner component with different sizes and styles
 */
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'gray' | 'white' | 'green' | 'red' | 'yellow';
  className?: string;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'blue',
  className = '',
  label = 'Loading...'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    blue: 'border-blue-500',
    gray: 'border-gray-500',
    white: 'border-white',
    green: 'border-green-500',
    red: 'border-red-500',
    yellow: 'border-yellow-500'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          ${colorClasses[color]}
          border-4 border-t-transparent rounded-full animate-spin
        `}
        role="status"
        aria-label={label}
      />
      {label && (
        <span className="mt-2 text-sm text-gray-600 sr-only">
          {label}
        </span>
      )}
    </div>
  );
};

/**
 * Progress bar component with different styles
 */
export interface ProgressBarProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'gray';
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  size = 'md',
  color = 'blue',
  showPercentage = false,
  animated = false,
  className = '',
  label = 'Progress'
}) => {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-4'
  };

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    gray: 'bg-gray-500'
  };

  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700" id={`progress-label-${Math.random()}`}>
          {label}
        </span>
        {showPercentage && (
          <span className="text-sm text-gray-500">
            {Math.round(clampedProgress)}%
          </span>
        )}
      </div>
      
      <div
        className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-labelledby={`progress-label-${Math.random()}`}
      >
        <div
          className={`
            ${colorClasses[color]}
            ${sizeClasses[size]}
            ${animated ? 'transition-all duration-300 ease-out' : ''}
            rounded-full
          `}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

/**
 * Skeleton loader component for different content types
 */
export interface SkeletonProps {
  type?: 'text' | 'rectangular' | 'circular' | 'card' | 'table' | 'form';
  width?: string | number;
  height?: string | number;
  className?: string;
  lines?: number;
  animated?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  type = 'rectangular',
  width,
  height,
  className = '',
  lines = 1,
  animated = true
}) => {
  const baseClasses = `
    bg-gray-200 rounded
    ${animated ? 'animate-pulse' : ''}
    ${className}
  `;

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height
  };

  switch (type) {
    case 'text':
      return (
        <div className={baseClasses} style={style}>
          {Array.from({ length: lines }, (_, i) => (
            <div
              key={i}
              className={`bg-gray-200 rounded ${animated ? 'animate-pulse' : ''}`}
              style={{
                height: '1rem',
                marginBottom: i < lines - 1 ? '0.5rem' : '0',
                width: i === lines - 1 ? '75%' : '100%'
              }}
            />
          ))}
        </div>
      );

    case 'circular':
      return (
        <div
          className={`${baseClasses} rounded-full`}
          style={{
            width: width || '40px',
            height: height || '40px'
          }}
        />
      );

    case 'card':
      return (
        <div className={`${baseClasses} p-4`} style={style}>
          <div className={`bg-gray-200 rounded h-4 w-3/4 mb-3 ${animated ? 'animate-pulse' : ''}`} />
          <div className={`bg-gray-200 rounded h-3 w-1/2 mb-2 ${animated ? 'animate-pulse' : ''}`} />
          <div className={`bg-gray-200 rounded h-3 w-2/3 ${animated ? 'animate-pulse' : ''}`} />
        </div>
      );

    case 'table':
      return (
        <div className={baseClasses} style={style}>
          {Array.from({ length: lines }, (_, i) => (
            <div key={i} className="flex space-x-4 mb-2">
              <div className={`bg-gray-200 rounded h-4 flex-1 ${animated ? 'animate-pulse' : ''}`} />
              <div className={`bg-gray-200 rounded h-4 flex-1 ${animated ? 'animate-pulse' : ''}`} />
              <div className={`bg-gray-200 rounded h-4 flex-1 ${animated ? 'animate-pulse' : ''}`} />
            </div>
          ))}
        </div>
      );

    case 'form':
      return (
        <div className={baseClasses} style={style}>
          {Array.from({ length: lines }, (_, i) => (
            <div key={i} className="mb-4">
              <div className={`bg-gray-200 rounded h-4 w-1/4 mb-2 ${animated ? 'animate-pulse' : ''}`} />
              <div className={`bg-gray-200 rounded h-10 w-full ${animated ? 'animate-pulse' : ''}`} />
            </div>
          ))}
        </div>
      );

    default:
      return <div className={baseClasses} style={style} />;
  }
};

/**
 * Adaptive loading component that changes based on network conditions
 */
export interface AdaptiveLoadingProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  retry?: () => void;
  className?: string;
}

export const AdaptiveLoading: React.FC<AdaptiveLoadingProps> = ({
  children,
  fallback,
  loading = false,
  error = null,
  retry,
  className = ''
}) => {
  const { quality, isSlowConnection } = useNetworkQuality();

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Something went wrong
        </h3>
        <p className="text-sm text-gray-600 mb-4 text-center">
          {error}
        </p>
        {retry && (
          <button
            onClick={retry}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (loading) {
    if (fallback) {
      return <>{fallback}</>;
    }

    // Choose loading strategy based on network quality
    switch (quality) {
      case NetworkQuality.EXCELLENT:
      case NetworkQuality.GOOD:
        return (
          <div className={`flex items-center justify-center p-8 ${className}`}>
            <LoadingSpinner size="lg" label="Loading content..." />
          </div>
        );

      case NetworkQuality.FAIR:
        return (
          <div className={`space-y-4 ${className}`}>
            <Skeleton type="card" height="120px" />
            <Skeleton type="card" height="120px" />
            <Skeleton type="card" height="120px" />
          </div>
        );

      case NetworkQuality.POOR:
      case NetworkQuality.OFFLINE:
        return (
          <div className={`space-y-4 ${className}`}>
            <Skeleton type="card" height="120px" />
            <Skeleton type="card" height="120px" />
            <Skeleton type="card" height="120px" />
            <Skeleton type="card" height="120px" />
            <Skeleton type="card" height="120px" />
          </div>
        );

      default:
        return (
          <div className={`flex items-center justify-center p-8 ${className}`}>
            <LoadingSpinner size="md" label="Loading..." />
          </div>
        );
    }
  }

  return <>{children}</>;
};

/**
 * Loading overlay component
 */
export interface LoadingOverlayProps {
  loading: boolean;
  children: React.ReactNode;
  message?: string;
  progress?: number;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  loading,
  children,
  message = 'Loading...',
  progress,
  className = ''
}) => {
  if (!loading) {
    return <>{children}</>;
  }

  return (
    <div className={`relative ${className}`}>
      {children}
      
      <div className="absolute inset-0 bg-white bg-opacity-75 flex flex-col items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
          <div className="text-center">
            <LoadingSpinner size="lg" label={message} />
            
            {message && (
              <p className="mt-4 text-sm text-gray-600">
                {message}
              </p>
            )}
            
            {progress !== undefined && (
              <div className="mt-4">
                <ProgressBar
                  progress={progress}
                  showPercentage
                  label="Progress"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Infinite scroll loading component
 */
export interface InfiniteScrollLoadingProps {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  className?: string;
}

export const InfiniteScrollLoading: React.FC<InfiniteScrollLoadingProps> = ({
  loading,
  hasMore,
  onLoadMore,
  className = ''
}) => {
  if (!hasMore) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <p className="text-sm text-gray-500">
          No more items to load
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex justify-center py-4 ${className}`}>
        <LoadingSpinner size="md" label="Loading more items..." />
      </div>
    );
  }

  return (
    <div className={`text-center py-4 ${className}`}>
      <button
        onClick={onLoadMore}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Load More
      </button>
    </div>
  );
};

/**
 * Loading state for data tables
 */
export interface TableLoadingProps {
  columns: number;
  rows: number;
  className?: string;
}

export const TableLoading: React.FC<TableLoadingProps> = ({
  columns,
  rows,
  className = ''
}) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {Array.from({ length: columns }, (_, i) => (
              <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Skeleton type="text" width="100px" height="16px" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.from({ length: rows }, (_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }, (_, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                  <Skeleton type="text" width="80px" height="16px" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Loading state for charts
 */
export interface ChartLoadingProps {
  type?: 'line' | 'bar' | 'pie' | 'area';
  className?: string;
}

export const ChartLoading: React.FC<ChartLoadingProps> = ({
  type = 'line',
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" label="Loading chart..." />
          <p className="mt-2 text-sm text-gray-600">
            Preparing {type} chart...
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Loading state for forms
 */
export interface FormLoadingProps {
  fields: number;
  className?: string;
}

export const FormLoading: React.FC<FormLoadingProps> = ({
  fields,
  className = ''
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {Array.from({ length: fields }, (_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton type="text" width="120px" height="16px" />
          <Skeleton type="rectangular" width="100%" height="40px" />
        </div>
      ))}
      
      <div className="flex space-x-4">
        <Skeleton type="rectangular" width="100px" height="40px" />
        <Skeleton type="rectangular" width="100px" height="40px" />
      </div>
    </div>
  );
};

/**
 * Loading state for lists
 */
export interface ListLoadingProps {
  items: number;
  className?: string;
}

export const ListLoading: React.FC<ListLoadingProps> = ({
  items,
  className = ''
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: items }, (_, i) => (
        <div key={i} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
          <Skeleton type="circular" width="40px" height="40px" />
          <div className="flex-1 space-y-2">
            <Skeleton type="text" width="60%" height="16px" />
            <Skeleton type="text" width="40%" height="14px" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Loading state for cards
 */
export interface CardLoadingProps {
  cards: number;
  className?: string;
}

export const CardLoading: React.FC<CardLoadingProps> = ({
  cards,
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: cards }, (_, i) => (
        <Skeleton key={i} type="card" height="200px" />
      ))}
    </div>
  );
};
