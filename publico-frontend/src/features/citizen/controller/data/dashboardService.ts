// ============================================================================
// CITIZEN DASHBOARD SERVICE
// ============================================================================
// This service handles all data fetching for the citizen dashboard,
// including projects, transactions, analytics, and alerts.
// ============================================================================

import { apiClient } from "@config/api";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/**
 * Portal types for determining user context
 */
type Portal = "citizen" | "agency" | "admin";

/**
 * User data structure from localStorage
 */
type UserData = {
  user?: {
    user_id?: string;
    agencyId?: string;
    role?: "Citizen" | "Agency" | "Admin";
    address?: string;
    privateKey?: string;
    email?: string;
  };
  email?: string;
};

/**
 * Budget proposal form data
 */
export interface BudgetFormProps {
  projectName: string;
  department: string;
  category: string;
  amountRequested: number;
  startDate: string;
  endDate: string;
  objectives?: string;
}

/**
 * Dashboard alert structure
 */
export type DashboardAlert = { 
  id: string; 
  title: string; 
  type: "warning" | "info" | "success"; 
  date: string; 
  description?: string; 
};

/**
 * Monthly spending data point for charts
 */
export type MonthlyPoint = { 
  month: string; 
  allocated: number; 
  spent: number; 
};

/**
 * Budget category data for pie charts
 */
export type CategorySlice = { 
  label: string; 
  value: number; 
};

/**
 * Generic API response that could contain arrays in various formats
 */
type AnyList =
  | any[]
  | { items?: any[]; data?: any[]; projects?: any[]; results?: any[]; rows?: any[]; list?: any[] }
  | Record<string, unknown>;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Determine the current portal based on URL path or localStorage
 */
function getPortal(): Portal {
  // First, try to determine from URL path
  if (typeof window !== "undefined") {
    const path = window.location.pathname;
    if (path.startsWith("/agency")) return "agency";
    if (path.startsWith("/admin")) return "admin";
    if (path.startsWith("/citizen")) return "citizen";
  }
  
  // Fallback to localStorage
  try {
    const portalRole = localStorage.getItem("portal_role");
    if (portalRole) {
      const role = portalRole.toLowerCase();
      if (role === "agency" || role === "admin" || role === "citizen") {
        return role as Portal;
      }
    }
  } catch (error) {
    console.warn("Could not read portal_role from localStorage:", error);
  }
  
  // Default to citizen
  return "citizen";
}

/**
 * Get API prefix based on current portal
 */
function apiPrefixForRead(): string {
  const portal = getPortal();
  return portal === "agency" ? "/agency" : portal === "admin" ? "/admin" : "/citizen";
}

/**
 * Get user data from localStorage with proper error handling
 */
function getUserData(): UserData {
  try {
    const raw = localStorage.getItem("publico_user_data");
    if (!raw) {
      throw new Error("No user data found in localStorage");
    }
    
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      throw new Error("Invalid user data format");
    }
    
    return parsed;
  } catch (error) {
    console.error("Failed to get user data from localStorage:", error);
    throw new Error("Unable to retrieve user session. Please log in again.");
  }
}

/**
 * Get agency ID from user data
 */
function getAgencyId(): string | undefined {
  const { user } = getUserData();
  return user?.agencyId ?? user?.user_id;
}

/**
 * Extract array from various API response formats
 */
function pickArray(obj: Record<string, unknown>): any[] | undefined {
  return (obj.items as any[]) ??
         (obj.data as any[]) ??
         (obj.projects as any[]) ??
         (obj.results as any[]) ??
         (obj.rows as any[]) ??
         (obj.list as any[]);
}

/**
 * Convert various API response shapes to a consistent array format
 */
function toArray(response: AnyList): any[] {
  if (Array.isArray(response)) {
    return response;
  }
  
  if (response && typeof response === "object") {
    const array = pickArray(response as Record<string, unknown>);
    if (Array.isArray(array)) {
      return array;
    }
  }
  
  return [];
}

// ============================================================================
// MOCK DATA FOR DEMONSTRATION
// ============================================================================

/**
 * Mock project data for when endpoints are not available
 * Updated with Dagupan City LGU departments
 */
const MOCK_PROJECTS = [
  {
    _id: "demo-1",
    projectName: "City Infrastructure Enhancement",
    description: "Comprehensive infrastructure improvement project",
    budget: 50000,
    status: "Active",
    department: "City Engineering Office",
    startDate: "2024-01-01",
    endDate: "2024-12-31"
  },
  {
    _id: "demo-2", 
    projectName: "Tourism Development Program",
    description: "Tourism infrastructure and promotion project",
    budget: 25000,
    status: "Planning",
    department: "City Tourism Office",
    startDate: "2024-02-01",
    endDate: "2024-11-30"
  }
];

/**
 * Mock transaction data for when endpoints are not available
 * Updated with Dagupan City LGU departments
 */
const MOCK_TRANSACTIONS = [
  {
    _id: "txn-1",
    date: "2024-01-15",
    dept: "City Engineering Office",
    project: "Bridge Construction Project",
    amount: 50000000,
    status: "Verified",
    signature: "0x1234...5678"
  },
  {
    _id: "txn-2",
    date: "2024-02-01",
    dept: "City Planning & Development Office",
    project: "School Building Renovation",
    amount: 25000000,
    status: "Verified",
    signature: "0x9abc...def0"
  },
  {
    _id: "txn-3",
    date: "2024-02-15",
    dept: "City Health Office",
    project: "Hospital Equipment Upgrade",
    amount: 15000000,
    status: "Verified",
    signature: "0x5678...9abc"
  },
  {
    _id: "txn-4",
    date: "2024-03-01",
    dept: "City Engineering Office",
    project: "Road Maintenance",
    amount: 30000000,
    status: "Verified",
    signature: "0xdef0...1234"
  },
  {
    _id: "txn-5",
    date: "2024-03-15",
    dept: "City Tourism Office",
    project: "Tourism Infrastructure Development",
    amount: 12000000,
    status: "Verified",
    signature: "0x9abc...5678"
  }
];

/**
 * Mock alert data for when endpoints are not available
 */
const MOCK_ALERTS: DashboardAlert[] = [
  {
    id: "alert-1",
    title: "Bridge Repair is 8% over budget",
    type: "warning",
    date: "2024-01-15",
    description: "The bridge repair project has exceeded its budget by 8%"
  }
];

/**
 * Mock monthly spending data for when endpoints are not available
 */
const MOCK_MONTHLY_SPENDING: MonthlyPoint[] = [
  { month: "Jul", allocated: 5000000, spent: 4200000 },
  { month: "Aug", allocated: 6200000, spent: 5800000 },
  { month: "Sep", allocated: 7500000, spent: 6500000 },
  { month: "Oct", allocated: 8100000, spent: 7200000 },
  { month: "Nov", allocated: 6800000, spent: 5900000 },
  { month: "Dec", allocated: 5400000, spent: 4800000 }
];

/**
 * Mock category data for when endpoints are not available
 * Updated with Dagupan City LGU categories
 */
const MOCK_CATEGORIES: CategorySlice[] = [
  { label: "Infrastructure & Development", value: 150000 },
  { label: "Health & Social Services", value: 75000 },
  { label: "Economic Services & Business Development", value: 50000 },
  { label: "Public Safety & Disaster Management", value: 45000 },
  { label: "Executive & Administrative Services", value: 30000 }
];

// ============================================================================
// BUDGET PROPOSAL FUNCTIONS
// ============================================================================

/**
 * Submit a budget proposal with attached files
 * This function handles the form data preparation and submission
 */
export async function sendBudgetProposal(data: BudgetFormProps, files: File[]) {
  const { user } = getUserData();
  
  // Validate required user data
  if (!user?.user_id) {
    throw new Error("User ID is required to submit budget proposals");
  }
  
  // Prepare form data for submission
  const formData = new FormData();
  formData.append("agencyId", String(user.user_id));
  formData.append("address", String(user.address || ""));
  formData.append("privateKey", String(user.privateKey || ""));
  formData.append("timeline", `${data.startDate} - ${data.endDate}`);
  formData.append("projectName", data.projectName);
  formData.append("department", data.department);
  formData.append("category", data.category);
  formData.append("amountRequested", String(data.amountRequested));
  formData.append("startDate", data.startDate);
  formData.append("endDate", data.endDate);
  formData.append("message", data?.objectives || "");

  // Attach all files
  files.forEach((file) => formData.append("fileUrl", file));
  
  // Submit the proposal
  return apiClient.upload("/agency/budget/create_budget_proposal", formData);
}

// ============================================================================
// PROJECT DATA FUNCTIONS
// ============================================================================

/**
 * Get key projects for the dashboard
 * For citizens: tries public milestone endpoints, falls back to mock data
 * For agencies/admins: fetches their specific projects
 */
export async function getKeyProjects(limit = 5) {
  const portal = getPortal();
  
  if (portal === "citizen") {
    // For citizens, fetch all agency milestones (public data)
    try {
      // Fetch from the public milestones endpoint that shows all agency milestones
      const response = await fetch(`http://localhost:5000/citizen/milestones/public?page=1&limit=${limit}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      // Extract data array from response
      const milestones = json.data || json;
      return Array.isArray(milestones) ? milestones : [];
    } catch (error) {
      console.warn("Public milestones endpoint not available, using mock data:", error);
      // Return mock data for demonstration
      return MOCK_PROJECTS.slice(0, limit);
    }
  } else {
    // For agencies/admins, fetch their specific projects
    const agencyId = getAgencyId();
    if (!agencyId) {
      throw new Error("No agency ID found in user data");
    }
    
    const raw = await apiClient.get(`${apiPrefixForRead()}/projects/${agencyId}`, { 
      params: { page: 1, limit } 
    });
    return toArray(raw as AnyList);
  }
}

/**
 * Fetch projects with pagination
 * For citizens: tries public milestone endpoints, falls back to mock data
 * For agencies/admins: fetches their specific projects
 */
export async function fetchProjectsProposed(page = 1, limit = 10) {
  const portal = getPortal();
  
  if (portal === "citizen") {
    // For citizens, fetch all agency milestones (public data)
    try {
      // Fetch from the public milestones endpoint that shows all agency milestones
      const response = await fetch(`http://localhost:5000/citizen/milestones/public?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      const items = json.data || json;
      const total = json.totalItems || (Array.isArray(items) ? items.length : 0);
      
      return { items: Array.isArray(items) ? items : [], total, page, limit };
    } catch (error) {
      console.warn("Public milestones endpoint not available, using mock data:", error);
      // Return mock data with pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedItems = MOCK_PROJECTS.slice(startIndex, endIndex);
      
      return { 
        items: paginatedItems, 
        total: MOCK_PROJECTS.length, 
        page, 
        limit 
      };
    }
  } else {
    // For agencies/admins, fetch their specific projects
    const agencyId = getAgencyId();
    if (!agencyId) {
      throw new Error("No agency ID found in user data");
    }
    
    const raw = await apiClient.get(`${apiPrefixForRead()}/projects/${agencyId}`, { 
      params: { page, limit } 
    });
    const items = toArray(raw as AnyList);
    const total = typeof (raw as any)?.total === "number" 
      ? (raw as any).total 
      : typeof (raw as any)?.count === "number" 
      ? (raw as any).count 
      : items.length;
    
    return { items, total, page, limit };
  }
}

/**
 * Get a specific milestone by ID for citizens
 */
export async function getMilestoneById(milestoneId: string) {
  const portal = getPortal();
  
  if (portal === "citizen") {
    // For citizens, fetch public milestone data from agencies
    try {
      // Fetch from the public milestone by ID endpoint
      const response = await fetch(`http://localhost:5000/citizen/milestones/public/${milestoneId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      return json;
    } catch (error) {
      console.warn("Public milestone endpoint not available:", error);
      throw error;
    }
  } else {
    // For agencies/admins, fetch their specific milestone
    return apiClient.get(`/milestone/${milestoneId}`);
  }
}

// ============================================================================
// TRANSACTION DATA FUNCTIONS
// ============================================================================

/**
 * Fetch ledger transactions with pagination
 * For citizens: tries public endpoints, falls back to mock data
 * For agencies/admins: fetches their specific ledger
 */
export async function fetchLedger(page = 1, limit = 10) {
  const portal = getPortal();
  
  if (portal === "citizen") {
    // For citizens, fetch all agency transactions (public data)
    try {
      // Fetch from the public ledger endpoint that shows all agency transactions
      const response = await fetch(`http://localhost:5000/citizen/ledger/public?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      
      // Transform the data to match frontend expectations
      const items = json.data?.map((item: any) => ({
        _id: item._id,
        id: item._id,
        title: item.budgetId?.projectName || 'Project Transaction',
        tx: item.budgetId?.projectName || 'Project Transaction',
        date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : undefined,
        createdAt: item.createdAt,
        dept: item.budgetId?.department || item.agencyId?.agency_name || 'Government Department',
        department: item.budgetId?.department || item.agencyId?.agency_name || 'Government Department',
        project: item.budgetId?.projectName || 'Government Project',
        projectName: item.budgetId?.projectName || 'Government Project',
        amount: item.amount || 0,
        status: item.status === 'completed' ? 'Verified' : item.status === 'Verified' ? 'Verified' : 'Pending',
        signature: item.signature || item.blockchainTxHash || 'Blockchain Verified',
        hash: item.signature || item.blockchainTxHash || 'Blockchain Verified',
        sig: item.signature || item.blockchainTxHash || 'Blockchain Verified',
        purpose: item.purpose || 'Government Project Funding'
      })) || [];
      
      const total = json.pagination?.totalItems || items.length;
      
      return { items, total, page, limit };
    } catch (error) {
      console.warn("Public ledger endpoint not available, using mock data:", error);
      // Return mock data with pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedItems = MOCK_TRANSACTIONS.slice(startIndex, endIndex);
      
      return { 
        items: paginatedItems, 
        total: MOCK_TRANSACTIONS.length, 
        page, 
        limit 
      };
    }
  } else {
    // For agencies/admins, fetch their specific ledger
    const { user } = getUserData();
    const role = user?.role ?? "Agency";
    const agencyId = getAgencyId();
    
    if (!agencyId) {
      throw new Error("No agency ID found in user data");
    }

    const raw = await apiClient.get(`/api/ledgers/${role}/${agencyId}`, { 
      params: { page, limit } 
    });
    const items = toArray(raw as AnyList);
    const total = typeof (raw as any)?.total === "number" 
      ? (raw as any).total 
      : typeof (raw as any)?.count === "number" 
      ? (raw as any).count 
      : items.length;
    
    return { items, total, page, limit };
  }
}

// ============================================================================
// ANALYTICS & DASHBOARD FUNCTIONS
// ============================================================================

/**
 * Get dashboard alerts
 * For citizens: tries public endpoints, falls back to mock data
 * For agencies/admins: fetches their specific alerts
 */
export async function getDashboardAlerts(): Promise<DashboardAlert[]> {
  const portal = getPortal();
  
  if (portal === "citizen") {
    // For citizens, fetch public alert data from all agencies
    try {
      // Try public alerts endpoint (no authentication required)
      const response = await fetch(`http://localhost:5000/citizen/alerts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      return json;
    } catch (error) {
      console.warn("Public alerts endpoint not available, using mock data:", error);
      // Return mock alert data
      return MOCK_ALERTS;
    }
  } else {
    // For agencies/admins, fetch their specific alerts
    return apiClient.get("/citizen/alerts");
  }
}

/**
 * Get monthly spending data for charts
 * For citizens: tries public endpoints, falls back to mock data
 * For agencies/admins: fetches their specific analytics
 */
export async function getMonthlySpending(): Promise<MonthlyPoint[]> {
  const portal = getPortal();
  
  if (portal === "citizen") {
    // For citizens, fetch public analytics data from all agencies
    try {
      // Try public monthly analytics endpoint (no authentication required)
      const response = await fetch(`http://localhost:5000/citizen/analytics/monthly`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      console.log("✅ Monthly spending data:", json);
      return json;
    } catch (error) {
      console.warn("Public monthly analytics endpoint not available, using mock data:", error);
      console.log("📊 Using mock monthly data:", MOCK_MONTHLY_SPENDING);
      // Return mock monthly spending data
      return MOCK_MONTHLY_SPENDING;
    }
  } else {
    // For agencies/admins, fetch their specific analytics
    return apiClient.get("/citizen/analytics/monthly");
  }
}

/**
 * Get budget allocation by category for charts
 * For citizens: tries public endpoints, falls back to mock data
 * For agencies/admins: fetches their specific analytics
 */
export async function getBudgetByCategory(): Promise<CategorySlice[]> {
  const portal = getPortal();
  
  if (portal === "citizen") {
    // For citizens, fetch public analytics data from all agencies
    try {
      // Try public category analytics endpoint (no authentication required)
      const response = await fetch(`http://localhost:5000/citizen/analytics/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();
      return json;
    } catch (error) {
      console.warn("Public category analytics endpoint not available, using mock data:", error);
      // Return mock category data
      return MOCK_CATEGORIES;
    }
  } else {
    // For agencies/admins, fetch their specific analytics
    return apiClient.get("/citizen/analytics/categories");
  }
}

// ============================================================================
// PROFILE & USER MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Update user connection status
 */
export async function updateToConnected() {
  const parsed = getUserData();
  const email = parsed.email || parsed.user?.email;
  
  if (!email) {
    throw new Error("Email is required to update connection status");
  }
  
  return apiClient.post("/admin/auth/management/update", { email });
}

/**
 * Update agency profile information
 */
export async function updateAgencyProfile(userId: string, profileData: any) {
  return apiClient.put(`/auth/profile/${userId}`, profileData);
}