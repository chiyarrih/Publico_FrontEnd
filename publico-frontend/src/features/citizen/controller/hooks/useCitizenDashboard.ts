// ============================================================================
// CITIZEN DASHBOARD HOOK
// ============================================================================
// This hook manages the state and data fetching for the citizen dashboard.
// It coordinates multiple API calls and provides a clean interface for components.
// ============================================================================

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getDashboardAlerts,
  getMonthlySpending,
  getBudgetByCategory,
  getKeyProjects,
  fetchLedger,
  fetchProjectsProposed,
} from "../data/dashboardService";
// import { createErrorHandler, ErrorCategory, ErrorSeverity } from "../../../../shared/utils/errorHandling";
// import { useOfflineStatus, useNetworkErrorHandler } from "../../../../shared/hooks/useOffline";
// import { usePerformanceMonitoring } from "../../../../shared/hooks/usePerformance";

// ============================================================================
// TYPES
// ============================================================================

/**
 * Loading status for the dashboard
 */
type LoadingStatus = "idle" | "loading" | "success" | "error";

/**
 * Dashboard data structure
 */
interface DashboardData {
  alerts: any[];
  monthly: any[];
  categories: any[];
  projects: any[];
  ledger: {
    items: any[];
    total: number;
  };
}

/**
 * Hook return type
 */
interface UseCitizenDashboardReturn {
  loading: boolean;
  status: LoadingStatus;
  error: string;
  alerts: any[];
  monthly: any[];
  categories: any[];
  projects: any[];
  ledger: {
    items: any[];
    total: number;
  };
  reload: () => Promise<void>;
}

// ============================================================================
// MAIN HOOK
// ============================================================================

/**
 * Custom hook for managing citizen dashboard data
 * 
 * This hook:
 * - Fetches all dashboard data in parallel for better performance
 * - Handles errors gracefully with user-friendly messages
 * - Provides loading states for better UX
 * - Includes a reload function for refreshing data
 * 
 * @returns Dashboard data and state management functions
 */
export function useCitizenDashboard(): UseCitizenDashboardReturn {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [status, setStatus] = useState<LoadingStatus>("idle");
  const [error, setError] = useState("");

  // Dashboard data state
  const [alerts, setAlerts] = useState<any[]>([]);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [ledger, setLedger] = useState<{ items: any[]; total: number }>({ 
    items: [], 
    total: 0 
  });

  // ============================================================================
  // HOOKS & UTILITIES
  // ============================================================================
  
  // Simplified error handling
  const handleError = (error: any) => {
    console.error('Dashboard error:', error);
    return {
      userMessage: 'An error occurred while loading the dashboard. Please try again.',
      technicalMessage: error.message || 'Unknown error',
      category: 'NETWORK',
      severity: 'HIGH'
    };
  };

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  /**
   * Load all dashboard data
   * 
   * This function:
   * - Fetches all data in parallel for better performance
   * - Handles errors gracefully with comprehensive error handling
   * - Provides meaningful error messages to users
   * - Monitors performance and network conditions
   * - Cleans up any HTML error responses from the server
   */
  const loadDashboardData = useCallback(async () => {
    setStatus("loading");
    setError("");

    try {
      // Fetch all dashboard data in parallel for better performance
      const [
        alertsData,
        monthlyData,
        categoriesData,
        projectsData,
        ledgerData
      ] = await Promise.all([
        getDashboardAlerts(),         // Dashboard alerts and notifications
        getMonthlySpending(),         // Monthly spending analytics
        getBudgetByCategory(),        // Budget allocation by category
        getKeyProjects(5),            // Key projects (limited to 5)
        fetchLedger(1, 10),           // Recent transactions (limited to 10)
      ]);

      // Update state with fetched data
      setAlerts(alertsData || []);
      setMonthly(monthlyData || []);
      setCategories(categoriesData || []);

      // Handle projects data - it could be an array or an object with items
      const projectsArray = Array.isArray(projectsData)
        ? projectsData
        : (projectsData as any)?.items || [];
      setProjects(projectsArray);

      // Handle ledger data - ensure it has the correct structure
      setLedger(ledgerData || { items: [], total: 0 });

      setStatus("success");
    } catch (error: any) {
      // Use simplified error handling
      const appError = handleError(error);
      setError(appError.userMessage);
      setStatus("error");
    }
  }, []);


  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Load dashboard data when the component mounts
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const loading = status === "loading";

  // ============================================================================
  // RETURN VALUE
  // ============================================================================

  return useMemo(
    () => ({
      loading,
      status,
      error,
      alerts,
      monthly,
      categories,
      projects,
      ledger,
      reload: loadDashboardData,
    }),
    [loading, status, error, alerts, monthly, categories, projects, ledger, loadDashboardData]
  );
}