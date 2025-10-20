// ============================================================================
// PERFORMANCE MONITOR COMPONENT
// ============================================================================
// React component for performance monitoring and debugging
// ============================================================================

import React, { useEffect } from 'react';
import { usePerformanceMonitoring, useMemoryLeakDetection, PerformanceThresholds } from '../hooks/usePerformance';

/**
 * Performance monitoring component
 */
export const PerformanceMonitor: React.FC<{
  componentName: string;
  children: React.ReactNode;
  thresholds?: Partial<PerformanceThresholds>;
}> = ({ componentName, children, thresholds }) => {
  const { metrics, warnings, startRender, endRender } = usePerformanceMonitoring(componentName, thresholds);
  const { memoryUsage, leaks } = useMemoryLeakDetection(componentName);

  useEffect(() => {
    startRender();
    return endRender;
  }, [startRender, endRender]);

  if (process.env.NODE_ENV === 'development') {
    return (
      <div>
        {children}
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs max-w-xs">
          <div className="font-bold">{componentName}</div>
          {metrics && (
            <div>
              <div>Render: {metrics.renderTime.toFixed(2)}ms</div>
              <div>Memory: {metrics.memoryUsage.toFixed(1)}%</div>
              <div>Components: {metrics.componentCount}</div>
              <div>DOM Nodes: {metrics.domNodes}</div>
            </div>
          )}
          {warnings.length > 0 && (
            <div className="text-yellow-400">
              Warnings: {warnings.join(', ')}
            </div>
          )}
          {leaks.length > 0 && (
            <div className="text-red-400">
              Leaks: {leaks.join(', ')}
            </div>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
