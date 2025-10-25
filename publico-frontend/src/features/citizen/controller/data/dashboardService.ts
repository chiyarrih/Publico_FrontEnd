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
 */
const MOCK_PROJECTS = [
  {
    _id: "demo-1",
    projectName: "Default project",
    description: "Sample project for demonstration",
    budget: 50000,
    status: "Active",
    department: "Public Works",
    startDate: "2024-01-01",
    endDate: "2024-12-31"
  },
  {
    _id: "demo-2", 
    projectName: "dawd",
    description: "Sample project for testing",
    budget: 25000,
    status: "Planning",
    department: "Infrastructure",
    startDate: "2024-02-01",
    endDate: "2024-11-30"
  }
];

/**
 * Mock transaction data for when endpoints are not available
 */
const MOCK_TRANSACTIONS = [
  {
    _id: "txn-1",
    date: "2024-01-15",
    dept: "Department of Public Works and Highways",
    project: "Bridge Construction Project",
    amount: 50000000,
    status: "Verified",
    signature: "0x1234...5678"
  },
  {
    _id: "txn-2",
    date: "2024-02-01",
    dept: "Department of Education",
    project: "School Building Renovation",
    amount: 25000000,
    status: "Verified",
    signature: "0x9abc...def0"
  },
  {
    _id: "txn-3",
    date: "2024-02-15",
    dept: "Department of Health",
    project: "Hospital Equipment Upgrade",
    amount: 15000000,
    status: "Verified",
    signature: "0x5678...9abc"
  },
  {
    _id: "txn-4",
    date: "2024-03-01",
    dept: "Department of Public Works and Highways",
    project: "Road Maintenance",
    amount: 30000000,
    status: "Verified",
    signature: "0xdef0...1234"
  },
  {
    _id: "txn-5",
    date: "2024-03-15",
    dept: "Department of Education",
    project: "Computer Lab Setup",
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
  { month: "January", spent: 1200, allocated: 1250 },
  { month: "February", spent: 1100, allocated: 1250 },
  { month: "March", spent: 1150, allocated: 1250 },
  { month: "April", spent: 1300, allocated: 1250 }
];

/**
 * Mock category data for when endpoints are not available
 * These categories match the actual departments in the database
 */
const MOCK_CATEGORIES: CategorySlice[] = [
  { label: "Department of Education", value: 3500000 },
  { label: "Department of Public Works and Highways", value: 4200000 },
  { label: "Department of Health", value: 3200000 },
  { label: "Department of Agriculture", value: 2000000 },
  { label: "Department of Social Welfare and Development", value: 1800000 },
  { label: "Department of Transportation", value: 1600000 },
  { label: "Department of the Interior and Local Government", value: 1200000 },
  { label: "Department of Science and Technology", value: 1000000 },
  { label: "Department of Environment and Natural Resources", value: 800000 },
  { label: "Department of Tourism", value: 600000 }
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
    // For citizens, fetch real data from public milestones endpoint
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
    // For citizens, fetch real data from public milestones endpoint
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
    // For citizens, try to fetch public milestone data (no auth required for guests)
    try {
      // Try public milestone by ID endpoint (no authentication required)
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
    // For citizens, fetch real data from public ledger endpoint
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
      date: item.date ? new Date(item.date).toLocaleDateString() : undefined,
      dept: item.department,
      project: item.projectName,
      amount: item.amount,
      status: item.status === 'Verified' ? 'Verified' : item.status === 'completed' ? 'Verified' : 'Pending',
      signature: item.signature || item.blockchainTxHash,
      purpose: item.purpose
    })) || [];
    
    const total = json.pagination?.totalItems || items.length;
    
    return { items, total, page, limit };
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
    // For citizens, fetch real data from public alerts endpoint
    const response = await fetch(`http://localhost:5000/citizen/alerts/public`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // If no alerts endpoint, return empty array
      return [];
    }

    const json = await response.json();
    return json;
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
    // For citizens, fetch real data from public analytics endpoint
    const response = await fetch(`http://localhost:5000/citizen/analytics/monthly/public`, {
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
    // For citizens, fetch real data from public analytics endpoint
    const response = await fetch(`http://localhost:5000/citizen/analytics/categories/public`, {
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