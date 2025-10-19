// ============================================================================
// PERFORMANCE MONITORING & MEMORY LEAK PREVENTION
// ============================================================================
// Comprehensive performance monitoring, memory leak detection,
// and optimization utilities for React applications.
// ============================================================================

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  componentCount: number;
  eventListeners: number;
  domNodes: number;
  timestamp: number;
}

/**
 * Memory usage interface
 */
export interface MemoryUsage {
  used: number;
  total: number;
  percentage: number;
  timestamp: number;
}

/**
 * Performance threshold configuration
 */
export interface PerformanceThresholds {
  maxRenderTime: number;
  maxMemoryUsage: number;
  maxComponentCount: number;
  maxEventListeners: number;
  maxDomNodes: number;
}

/**
 * Default performance thresholds
 */
const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  maxRenderTime: 100, // ms
  maxMemoryUsage: 80, // percentage
  maxComponentCount: 1000,
  maxEventListeners: 100,
  maxDomNodes: 5000
};

/**
 * Hook for performance monitoring
 */
export function usePerformanceMonitoring(
  componentName: string,
  thresholds: Partial<PerformanceThresholds> = {}
) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);
  const observerRef = useRef<PerformanceObserver | null>(null);
  
  const finalThresholds = { ...DEFAULT_THRESHOLDS, ...thresholds };

  // Start render timing
  const startRender = useCallback(() => {
    renderStartTime.current = performance.now();
  }, []);

  // End render timing
  const endRender = useCallback(() => {
    const renderTime = performance.now() - renderStartTime.current;
    renderCount.current += 1;

    // Get memory usage
    const memoryUsage = getMemoryUsage();
    
    // Get DOM metrics
    const domNodes = document.querySelectorAll('*').length;
    const eventListeners = getEventListenersCount();
    
    // Get component count (approximate)
    const componentCount = getComponentCount();

    const newMetrics: PerformanceMetrics = {
      renderTime,
      memoryUsage: memoryUsage.percentage,
      componentCount,
      eventListeners,
      domNodes,
      timestamp: Date.now()
    };

    setMetrics(newMetrics);

    // Check for warnings
    const newWarnings: string[] = [];
    
    if (renderTime > finalThresholds.maxRenderTime) {
      newWarnings.push(`Slow render: ${renderTime.toFixed(2)}ms`);
    }
    
    if (memoryUsage.percentage > finalThresholds.maxMemoryUsage) {
      newWarnings.push(`High memory usage: ${memoryUsage.percentage.toFixed(1)}%`);
    }
    
    if (componentCount > finalThresholds.maxComponentCount) {
      newWarnings.push(`Too many components: ${componentCount}`);
    }
    
    if (eventListeners > finalThresholds.maxEventListeners) {
      newWarnings.push(`Too many event listeners: ${eventListeners}`);
    }
    
    if (domNodes > finalThresholds.maxDomNodes) {
      newWarnings.push(`Too many DOM nodes: ${domNodes}`);
    }

    setWarnings(newWarnings);

    // Log warnings in development
    if (process.env.NODE_ENV === 'development' && newWarnings.length > 0) {
      console.warn(`Performance warnings for ${componentName}:`, newWarnings);
    }
  }, [componentName, finalThresholds]);

  // Setup performance observer
  useEffect(() => {
    if (typeof PerformanceObserver !== 'undefined') {
      observerRef.current = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'measure') {
            console.log(`Performance measure: ${entry.name} - ${entry.duration}ms`);
          }
        });
      });

      observerRef.current.observe({ entryTypes: ['measure'] });
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    metrics,
    warnings,
    startRender,
    endRender,
    renderCount: renderCount.current
  };
}

/**
 * Hook for memory leak detection
 */
export function useMemoryLeakDetection(componentName: string) {
  const [memoryUsage, setMemoryUsage] = useState<MemoryUsage | null>(null);
  const [leaks, setLeaks] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousUsage = useRef<number>(0);

  const checkMemoryUsage = useCallback(() => {
    const usage = getMemoryUsage();
    setMemoryUsage(usage);

    // Check for memory leaks
    if (previousUsage.current > 0) {
      const increase = usage.used - previousUsage.current;
      const increasePercentage = (increase / previousUsage.current) * 100;

      if (increasePercentage > 10) {
        setLeaks(prev => [...prev, `Memory increased by ${increasePercentage.toFixed(1)}%`]);
      }
    }

    previousUsage.current = usage.used;
  }, []);

  const startMonitoring = useCallback(() => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(checkMemoryUsage, 5000); // Check every 5 seconds
  }, [checkMemoryUsage]);

  const stopMonitoring = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const clearLeaks = useCallback(() => {
    setLeaks([]);
  }, []);

  useEffect(() => {
    startMonitoring();
    return stopMonitoring;
  }, [startMonitoring, stopMonitoring]);

  return {
    memoryUsage,
    leaks,
    startMonitoring,
    stopMonitoring,
    clearLeaks
  };
}

/**
 * Hook for event listener cleanup
 */
export function useEventListenerCleanup() {
  const listenersRef = useRef<Array<{ element: EventTarget; event: string; handler: EventListener }>>([]);

  const addEventListener = useCallback((
    element: EventTarget,
    event: string,
    handler: EventListener,
    options?: AddEventListenerOptions
  ) => {
    element.addEventListener(event, handler, options);
    listenersRef.current.push({ element, event, handler });
  }, []);

  const removeEventListener = useCallback((
    element: EventTarget,
    event: string,
    handler: EventListener,
    options?: EventListenerOptions
  ) => {
    element.removeEventListener(event, handler, options);
    listenersRef.current = listenersRef.current.filter(
      listener => !(listener.element === element && listener.event === event && listener.handler === handler)
    );
  }, []);

  const cleanupAll = useCallback(() => {
    listenersRef.current.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    listenersRef.current = [];
  }, []);

  useEffect(() => {
    return cleanupAll;
  }, [cleanupAll]);

  return {
    addEventListener,
    removeEventListener,
    cleanupAll,
    listenerCount: listenersRef.current.length
  };
}

/**
 * Hook for timer cleanup
 */
export function useTimerCleanup() {
  const timersRef = useRef<Array<{ id: number; type: 'timeout' | 'interval' }>>([]);

  const setTimeout = useCallback((callback: () => void, delay: number) => {
    const id = window.setTimeout(() => {
      callback();
      timersRef.current = timersRef.current.filter(timer => timer.id !== id);
    }, delay);
    
    timersRef.current.push({ id, type: 'timeout' });
    return id;
  }, []);

  const setInterval = useCallback((callback: () => void, delay: number) => {
    const id = window.setInterval(callback, delay);
    timersRef.current.push({ id, type: 'interval' });
    return id;
  }, []);

  const clearTimeout = useCallback((id: number) => {
    window.clearTimeout(id);
    timersRef.current = timersRef.current.filter(timer => timer.id !== id);
  }, []);

  const clearInterval = useCallback((id: number) => {
    window.clearInterval(id);
    timersRef.current = timersRef.current.filter(timer => timer.id !== id);
  }, []);

  const cleanupAll = useCallback(() => {
    timersRef.current.forEach(({ id, type }) => {
      if (type === 'timeout') {
        window.clearTimeout(id);
      } else {
        window.clearInterval(id);
      }
    });
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return cleanupAll;
  }, [cleanupAll]);

  return {
    setTimeout,
    setInterval,
    clearTimeout,
    clearInterval,
    cleanupAll,
    timerCount: timersRef.current.length
  };
}

/**
 * Hook for subscription cleanup
 */
export function useSubscriptionCleanup() {
  const subscriptionsRef = useRef<Array<{ unsubscribe: () => void }>>([]);

  const addSubscription = useCallback((subscription: { unsubscribe: () => void }) => {
    subscriptionsRef.current.push(subscription);
  }, []);

  const removeSubscription = useCallback((subscription: { unsubscribe: () => void }) => {
    subscription.unsubscribe();
    subscriptionsRef.current = subscriptionsRef.current.filter(sub => sub !== subscription);
  }, []);

  const cleanupAll = useCallback(() => {
    subscriptionsRef.current.forEach(subscription => {
      subscription.unsubscribe();
    });
    subscriptionsRef.current = [];
  }, []);

  useEffect(() => {
    return cleanupAll;
  }, [cleanupAll]);

  return {
    addSubscription,
    removeSubscription,
    cleanupAll,
    subscriptionCount: subscriptionsRef.current.length
  };
}

/**
 * Hook for DOM observer cleanup
 */
export function useObserverCleanup() {
  const observersRef = useRef<Array<{ observer: MutationObserver | IntersectionObserver | ResizeObserver; disconnect: () => void }>>([]);

  const addObserver = useCallback((observer: MutationObserver | IntersectionObserver | ResizeObserver) => {
    observersRef.current.push({ observer, disconnect: () => observer.disconnect() });
  }, []);

  const removeObserver = useCallback((observer: MutationObserver | IntersectionObserver | ResizeObserver) => {
    observer.disconnect();
    observersRef.current = observersRef.current.filter(obs => obs.observer !== observer);
  }, []);

  const cleanupAll = useCallback(() => {
    observersRef.current.forEach(({ observer }) => {
      observer.disconnect();
    });
    observersRef.current = [];
  }, []);

  useEffect(() => {
    return cleanupAll;
  }, [cleanupAll]);

  return {
    addObserver,
    removeObserver,
    cleanupAll,
    observerCount: observersRef.current.length
  };
}

/**
 * Hook for comprehensive cleanup
 */
export function useCleanup() {
  const eventCleanup = useEventListenerCleanup();
  const timerCleanup = useTimerCleanup();
  const subscriptionCleanup = useSubscriptionCleanup();
  const observerCleanup = useObserverCleanup();

  const cleanupAll = useCallback(() => {
    eventCleanup.cleanupAll();
    timerCleanup.cleanupAll();
    subscriptionCleanup.cleanupAll();
    observerCleanup.cleanupAll();
  }, [eventCleanup, timerCleanup, subscriptionCleanup, observerCleanup]);

  useEffect(() => {
    return cleanupAll;
  }, [cleanupAll]);

  return {
    ...eventCleanup,
    ...timerCleanup,
    ...subscriptionCleanup,
    ...observerCleanup,
    cleanupAll,
    totalResources: eventCleanup.listenerCount + timerCleanup.timerCount + subscriptionCleanup.subscriptionCount + observerCleanup.observerCount
  };
}

/**
 * Hook for lazy loading with performance monitoring
 */
export function useLazyLoading<T>(
  loadFunction: () => Promise<T>,
  options: {
    threshold?: number;
    rootMargin?: string;
    trigger?: 'intersection' | 'immediate' | 'manual';
  } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  
  const { threshold = 0.1, rootMargin = '50px', trigger = 'intersection' } = options;
  
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const loadData = useCallback(async () => {
    if (hasLoaded || loading) return;

    setLoading(true);
    setError(null);

    try {
      const result = await loadFunction();
      setData(result);
      setHasLoaded(true);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [loadFunction, hasLoaded, loading]);

  const triggerLoad = useCallback(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (trigger === 'immediate') {
      loadData();
    } else if (trigger === 'intersection' && elementRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadData();
            }
          });
        },
        { threshold, rootMargin }
      );

      observerRef.current.observe(elementRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [trigger, loadData, threshold, rootMargin]);

  return {
    data,
    loading,
    error,
    hasLoaded,
    elementRef,
    triggerLoad
  };
}

/**
 * Hook for debounced operations with cleanup
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useCallback(
    ((...args: Parameters<T>) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    }) as T,
    [delay, ...deps]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

/**
 * Hook for throttled operations with cleanup
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallRef = useRef<number>(0);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const throttledCallback = useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        callbackRef.current(...args);
      } else if (!timerRef.current) {
        timerRef.current = setTimeout(() => {
          lastCallRef.current = Date.now();
          callbackRef.current(...args);
          timerRef.current = null;
        }, delay - (now - lastCallRef.current));
      }
    }) as T,
    [delay, ...deps]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return throttledCallback;
}

/**
 * Utility functions
 */

function getMemoryUsage(): MemoryUsage {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
      timestamp: Date.now()
    };
  }

  return {
    used: 0,
    total: 0,
    percentage: 0,
    timestamp: Date.now()
  };
}

function getEventListenersCount(): number {
  // This is an approximation - we can't directly count event listeners
  // but we can count elements with event handlers
  let count = 0;
  const elements = document.querySelectorAll('*');
  
  elements.forEach(element => {
    // Check for common event attributes
    const events = ['onclick', 'onchange', 'onsubmit', 'onload', 'onerror'];
    events.forEach(event => {
      if (element.hasAttribute(event)) {
        count++;
      }
    });
  });

  return count;
}

function getComponentCount(): number {
  // This is an approximation - we can't directly count React components
  // but we can count elements with React-specific attributes
  const reactElements = document.querySelectorAll('[data-reactroot], [data-react-helmet]');
  return reactElements.length;
}

/**
 * Performance monitoring configuration
 */
export interface PerformanceMonitorConfig {
  componentName: string;
  thresholds?: Partial<PerformanceThresholds>;
}

/**
 * Create performance monitor configuration
 */
export function createPerformanceMonitorConfig(config: PerformanceMonitorConfig) {
  return config;
}
