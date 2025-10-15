// src/features/citizen/controller/data/dashboardService.ts
import { apiClient } from "@config/api";

/* -------- helpers -------- */
type Portal = "citizen" | "agency" | "admin";
function getPortal(): Portal {
  if (typeof window !== "undefined") {
    const p = window.location.pathname;
    if (p.startsWith("/agency")) return "agency";
    if (p.startsWith("/admin")) return "admin";
  }
  try {
    const raw = localStorage.getItem("portal_role");
    if (raw) {
      const v = raw.toLowerCase();
      if (v === "agency" || v === "admin" || v === "citizen") return v as Portal;
    }
  } catch {}
  return "citizen";
}
function apiPrefixForRead() {
  const p = getPortal();
  return p === "agency" ? "/agency" : p === "admin" ? "/admin" : "/citizen";
}
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
function getUserData(): UserData {
  const raw = localStorage.getItem("publico_user_data");
  if (!raw) throw new Error("No user data in localStorage");
  return JSON.parse(raw);
}
function getAgencyId() {
  const { user } = getUserData();
  return user?.agencyId ?? user?.user_id;
}

/* -------- array normalizers (works with many API shapes) -------- */
type AnyList =
  | any[]
  | { items?: any[]; data?: any[]; projects?: any[]; results?: any[]; rows?: any[]; list?: any[] }
  | Record<string, unknown>;

const pickArray = (obj: Record<string, unknown>) =>
  (obj.items as any[]) ??
  (obj.data as any[]) ??
  (obj.projects as any[]) ??
  (obj.results as any[]) ??
  (obj.rows as any[]) ??
  (obj.list as any[]);

function toArray(x: AnyList): any[] {
  if (Array.isArray(x)) return x;
  if (x && typeof x === "object") {
    const arr = pickArray(x as Record<string, unknown>);
    if (Array.isArray(arr)) return arr;
  }
  return [];
}

/* ---------------- types ---------------- */
export interface BudgetFormProps {
  projectName: string;
  department: string;
  category: string;
  amountRequested: number;
  startDate: string;
  endDate: string;
  objectives?: string;
}
export type DashboardAlert = { id: string; title: string; type: "warning" | "info" | "success"; date: string; description?: string; };
export type MonthlyPoint = { month: string; allocated: number; spent: number };
export type CategorySlice = { label: string; value: number };

/* ---------------- WRITE: proposal ---------------- */
export async function sendBudgetProposal(data: BudgetFormProps, files: File[]) {
  const { user } = getUserData();
  const formData = new FormData();
  formData.append("agencyId", String(user?.user_id || ""));
  formData.append("address", String(user?.address || ""));
  formData.append("privateKey", String(user?.privateKey || ""));
  formData.append("timeline", `${data.startDate} - ${data.endDate}`);
  formData.append("projectName", data.projectName);
  formData.append("department", data.department);
  formData.append("category", data.category);
  formData.append("amountRequested", String(data.amountRequested));
  formData.append("startDate", data.startDate);
  formData.append("message", data.objectives || "");
  formData.append("endDate", data.endDate);
  files.forEach((f) => formData.append("fileUrl", f));
  return apiClient.upload("/agency/budget/create_budget_proposal", formData);
}

/* ---------------- READ: projects ---------------- */
export async function getKeyProjects(limit = 5) {
  const agencyId = getAgencyId();
  if (!agencyId) throw new Error("No agencyId found in user data");
  const raw = await apiClient.get(`${apiPrefixForRead()}/projects/${agencyId}`, { params: { page: 1, limit } });
  return toArray(raw); // <-- ALWAYS array for UI .map()
}

export async function fetchProjectsProposed(page = 1, limit = 10) {
  const agencyId = getAgencyId();
  if (!agencyId) throw new Error("No agencyId found in user data");
  const raw = await apiClient.get(`${apiPrefixForRead()}/projects/${agencyId}`, { params: { page, limit } });
  const items = toArray(raw);
  const total =
    typeof (raw as any)?.total === "number"
      ? (raw as any).total
      : typeof (raw as any)?.count === "number"
      ? (raw as any).count
      : items.length;
  return { items, total, page, limit };
}

/* ---------------- READ: ledger (normalize to array) ---------------- */
// Backend route is: /api/ledgers/:role/:agencyId
export async function fetchLedger(page = 1, limit = 10) {
  const { user } = getUserData();
  const role = user?.role ?? "Citizen";
  const agencyId = getAgencyId();
  if (!agencyId) throw new Error("No agencyId found in user data");

  const raw = await apiClient.get(`/api/ledgers/${role}/${agencyId}`, { params: { page, limit } });
  // Accept either bare array or wrapped object
  const items = toArray(raw);
  const total =
    typeof (raw as any)?.total === "number"
      ? (raw as any).total
      : typeof (raw as any)?.count === "number"
      ? (raw as any).count
      : items.length;
  return { items, total, page, limit }; // <-- consumer can use .items.map(...)
}

/* ---------------- READ: misc ---------------- */
export async function updateToConnected() {
  const parsed = getUserData();
  const email = parsed.email || parsed.user?.email;
  return apiClient.post("/admin/auth/management/update", { email });
}

const fetchCache = new Map<string, { data: any; ts: number }>();
export async function fetchUsers() {
  const parsed = getUserData();
  const email = parsed.email || parsed.user?.email;
  const key = `fetchUsers_${email}`;
  const cached = fetchCache.get(key);
  if (cached && Date.now() - cached.ts < 5000) return cached.data;
  const data = await apiClient.get(`/admin/auth/management/fetch/${email}`);
  fetchCache.set(key, { data, ts: Date.now() });
  return data;
}

export async function updateAgencyProfile(userId: string, profileData: any) {
  return apiClient.put(`/auth/profile/${userId}`, profileData);
}

/* ---------------- READ: dashboard cards ---------------- */
export async function getDashboardAlerts(): Promise<DashboardAlert[]> {
  return apiClient.get("/citizen/alerts");
}
export async function getMonthlySpending(): Promise<MonthlyPoint[]> {
  return apiClient.get("/citizen/analytics/monthly");
}
export async function getBudgetByCategory(): Promise<CategorySlice[]> {
  return apiClient.get("/citizen/analytics/categories");
}
