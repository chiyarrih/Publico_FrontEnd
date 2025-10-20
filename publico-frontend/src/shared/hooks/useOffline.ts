// ============================================================================
// OFFLINE DETECTION & NETWORK ERROR HANDLING
// ============================================================================
// Comprehensive offline detection, network quality monitoring,
// and connection error handling utilities.
// ============================================================================

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Network connection quality levels
 */
export enum NetworkQuality {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  OFFLINE = 'offline'
}

/**
 * Network information interface
 */
export interface NetworkInfo {
  online: boolean;
  quality: NetworkQuality;
  speed: number; // in Mbps
  latency: number; // in ms
  connectionType: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
}

/**
 * Offline queue item interface
 */
export interface OfflineQueueItem {
  id: string;
  timestamp: number;
  operation: () => Promise<any>;
  retries: number;
  maxRetries: number;
  priority: number; // Higher number = higher priority
}

/**
 * Network error types
 */
export enum NetworkErrorType {
  OFFLINE = 'offline',
  TIMEOUT = 'timeout',
  SLOW_CONNECTION = 'slow_connection',
  POOR_QUALITY = 'poor_quality',
  CONNECTION_LOST = 'connection_lost'
}

/**
 * Hook for detecting online/offline status
 */
export function useOfflineStatus(): {
  isOnline: boolean;
  isOffline: boolean;
  networkInfo: NetworkInfo | null;
} {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Get initial network information
    const updateNetworkInfo = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        const info: NetworkInfo = {
          online: navigator.onLine,
          quality: getNetworkQuality(connection),
          speed: connection.downlink || 0,
          latency: connection.rtt || 0,
          connectionType: connection.type || 'unknown',
          effectiveType: connection.effectiveType || 'unknown',
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0
        };
        setNetworkInfo(info);
      }
    };

    updateNetworkInfo();

    // Listen for connection changes
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener('change', updateNetworkInfo);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        connection.removeEventListener('change', updateNetworkInfo);
      }
    };
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
    networkInfo
  };
}

/**
 * Determines network quality based on connection information
 */
function getNetworkQuality(connection: any): NetworkQuality {
  if (!navigator.onLine) {
    return NetworkQuality.OFFLINE;
  }

  const downlink = connection.downlink || 0;
  const rtt = connection.rtt || 0;
  const effectiveType = connection.effectiveType || '4g';

  // Determine quality based on speed and latency
  if (downlink >= 10 && rtt <= 100) {
    return NetworkQuality.EXCELLENT;
  } else if (downlink >= 5 && rtt <= 200) {
    return NetworkQuality.GOOD;
  } else if (downlink >= 1 && rtt <= 500) {
    return NetworkQuality.FAIR;
  } else {
    return NetworkQuality.POOR;
  }
}

/**
 * Hook for network quality monitoring
 */
export function useNetworkQuality(): {
  quality: NetworkQuality;
  speed: number;
  latency: number;
  isSlowConnection: boolean;
  isPoorQuality: boolean;
} {
  const { networkInfo } = useOfflineStatus();

  return {
    quality: networkInfo?.quality || NetworkQuality.OFFLINE,
    speed: networkInfo?.speed || 0,
    latency: networkInfo?.latency || 0,
    isSlowConnection: (networkInfo?.speed || 0) < 1,
    isPoorQuality: (networkInfo?.quality || NetworkQuality.OFFLINE) === NetworkQuality.POOR
  };
}

/**
 * Hook for offline queue management
 */
export function useOfflineQueue(): {
  queue: OfflineQueueItem[];
  addToQueue: (item: Omit<OfflineQueueItem, 'id' | 'timestamp' | 'retries'>) => void;
  processQueue: () => Promise<void>;
  clearQueue: () => void;
  removeFromQueue: (id: string) => void;
} {
  const [queue, setQueue] = useState<OfflineQueueItem[]>([]);
  const { isOnline } = useOfflineStatus();
  const processingRef = useRef(false);

  // Add item to queue
  const addToQueue = useCallback((item: Omit<OfflineQueueItem, 'id' | 'timestamp' | 'retries'>) => {
    const queueItem: OfflineQueueItem = {
      ...item,
      id: `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retries: 0
    };

    setQueue(prev => [...prev, queueItem].sort((a, b) => b.priority - a.priority));
  }, []);

  // Remove item from queue
  const removeFromQueue = useCallback((id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
  }, []);

  // Clear entire queue
  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  // Process queue when online
  const processQueue = useCallback(async () => {
    if (!isOnline || processingRef.current || queue.length === 0) {
      return;
    }

    processingRef.current = true;

    try {
      const itemsToProcess = [...queue];
      
      for (const item of itemsToProcess) {
        try {
          await item.operation();
          removeFromQueue(item.id);
        } catch (error) {
          console.error(`Failed to process queue item ${item.id}:`, error);
          
          // Increment retry count
          const updatedItem = { ...item, retries: item.retries + 1 };
          
          if (updatedItem.retries >= updatedItem.maxRetries) {
            // Remove from queue if max retries reached
            removeFromQueue(item.id);
          } else {
            // Update retry count
            setQueue(prev => prev.map(q => q.id === item.id ? updatedItem : q));
          }
        }
      }
    } finally {
      processingRef.current = false;
    }
  }, [isOnline, queue, removeFromQueue]);

  // Auto-process queue when coming online
  useEffect(() => {
    if (isOnline && queue.length > 0) {
      processQueue();
    }
  }, [isOnline, queue.length, processQueue]);

  return {
    queue,
    addToQueue,
    processQueue,
    clearQueue,
    removeFromQueue
  };
}

/**
 * Hook for network error handling
 */
export function useNetworkErrorHandler(): {
  handleNetworkError: (error: any) => NetworkErrorType | null;
  isNetworkError: (error: any) => boolean;
  getNetworkErrorMessage: (errorType: NetworkErrorType) => string;
} {
  const { isOnline } = useOfflineStatus();

  const handleNetworkError = useCallback((error: any): NetworkErrorType | null => {
    if (!isOnline) {
      return NetworkErrorType.OFFLINE;
    }

    if (error?.name === 'AbortError') {
      return NetworkErrorType.TIMEOUT;
    }

    if (error?.message === 'Failed to fetch') {
      return NetworkErrorType.CONNECTION_LOST;
    }

    if (error?.response?.status === 408) {
      return NetworkErrorType.TIMEOUT;
    }

    if (error?.response?.status >= 500) {
      return NetworkErrorType.CONNECTION_LOST;
    }

    return null;
  }, [isOnline]);

  const isNetworkError = useCallback((error: any): boolean => {
    return handleNetworkError(error) !== null;
  }, [handleNetworkError]);

  const getNetworkErrorMessage = useCallback((errorType: NetworkErrorType): string => {
    const messages = {
      [NetworkErrorType.OFFLINE]: 'You appear to be offline. Please check your internet connection.',
      [NetworkErrorType.TIMEOUT]: 'The request timed out. Please try again.',
      [NetworkErrorType.SLOW_CONNECTION]: 'Your connection seems slow. Please wait a moment.',
      [NetworkErrorType.POOR_QUALITY]: 'Poor network quality detected. Some features may not work properly.',
      [NetworkErrorType.CONNECTION_LOST]: 'Connection lost. Please check your internet connection.'
    };

    return messages[errorType];
  }, []);

  return {
    handleNetworkError,
    isNetworkError,
    getNetworkErrorMessage
  };
}

/**
 * Hook for connection quality monitoring
 */
export function useConnectionMonitor(): {
  isMonitoring: boolean;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  connectionHistory: Array<{ timestamp: number; quality: NetworkQuality; speed: number }>;
} {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [connectionHistory, setConnectionHistory] = useState<Array<{ timestamp: number; quality: NetworkQuality; speed: number }>>([]);
  const { networkInfo } = useOfflineStatus();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startMonitoring = useCallback(() => {
    if (isMonitoring) return;

    setIsMonitoring(true);
    
    intervalRef.current = setInterval(() => {
      if (networkInfo) {
        setConnectionHistory(prev => [
          ...prev.slice(-19), // Keep only last 20 entries
          {
            timestamp: Date.now(),
            quality: networkInfo.quality,
            speed: networkInfo.speed
          }
        ]);
      }
    }, 5000); // Check every 5 seconds
  }, [isMonitoring, networkInfo]);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, [stopMonitoring]);

  return {
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    connectionHistory
  };
}

/**
 * Hook for adaptive loading strategies
 */
export function useAdaptiveLoading(): {
  shouldUseSkeleton: boolean;
  shouldUseSpinner: boolean;
  shouldUseProgressiveLoading: boolean;
  loadingTimeout: number;
} {
  const { quality, speed, latency } = useNetworkQuality();

  const shouldUseSkeleton = quality === NetworkQuality.EXCELLENT || quality === NetworkQuality.GOOD;
  const shouldUseSpinner = quality === NetworkQuality.FAIR || quality === NetworkQuality.POOR;
  const shouldUseProgressiveLoading = quality === NetworkQuality.POOR || speed < 1;
  const loadingTimeout = quality === NetworkQuality.POOR ? 10000 : 5000;

  return {
    shouldUseSkeleton,
    shouldUseSpinner,
    shouldUseProgressiveLoading,
    loadingTimeout
  };
}

/**
 * Hook for network-aware data fetching
 */
export function useNetworkAwareFetch<T>(
  fetchFunction: () => Promise<T>,
  options: {
    retryOnNetworkError?: boolean;
    maxRetries?: number;
    retryDelay?: number;
    fallbackData?: T;
  } = {}
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  isRetrying: boolean;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const { isOnline } = useOfflineStatus();
  const { addToQueue } = useOfflineQueue();
  const { handleNetworkError, isNetworkError } = useNetworkErrorHandler();

  const {
    retryOnNetworkError = true,
    maxRetries = 3,
    retryDelay = 1000,
    fallbackData
  } = options;

  const fetchData = useCallback(async (retryCount = 0) => {
    if (!isOnline) {
      setError(new Error('Offline'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      const networkErrorType = handleNetworkError(err);
      
      if (networkErrorType && retryOnNetworkError && retryCount < maxRetries) {
        // Retry on network errors
        setIsRetrying(true);
        setTimeout(() => {
          fetchData(retryCount + 1);
        }, retryDelay * Math.pow(2, retryCount)); // Exponential backoff
      } else {
        setError(err as Error);
        if (fallbackData) {
          setData(fallbackData);
        }
      }
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  }, [fetchFunction, isOnline, handleNetworkError, retryOnNetworkError, maxRetries, retryDelay, fallbackData]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // Add to offline queue if offline
  useEffect(() => {
    if (!isOnline && !data) {
      addToQueue({
        operation: fetchData,
        maxRetries: maxRetries,
        priority: 1
      });
    }
  }, [isOnline, data, addToQueue, fetchData, maxRetries]);

  return {
    data,
    loading,
    error,
    refetch,
    isRetrying
  };
}

/**
 * Utility function to check if a URL is reachable
 */
export async function checkUrlReachability(url: string, timeout = 5000): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      cache: 'no-cache'
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Utility function to measure network speed
 */
export async function measureNetworkSpeed(): Promise<number> {
  const startTime = Date.now();
  const testUrl = `https://httpbin.org/bytes/1024?t=${Date.now()}`;
  
  try {
    const response = await fetch(testUrl);
    const blob = await response.blob();
    const endTime = Date.now();
    
    const duration = (endTime - startTime) / 1000; // seconds
    const sizeInMB = blob.size / (1024 * 1024);
    const speedInMbps = (sizeInMB * 8) / duration; // Convert to Mbps
    
    return speedInMbps;
  } catch {
    return 0;
  }
}
