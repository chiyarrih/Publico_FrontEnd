// ============================================================================
// CITIZEN DASHBOARD PAGE
// ============================================================================
// This is the main dashboard page for citizens, displaying:
// - Smart contract alerts
// - Monthly spending charts
// - Budget allocation charts
// - Key projects overview
// - Recent blockchain transactions
// ============================================================================

import React, { useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useCitizenDashboard } from "../../controller/hooks/useCitizenDashboard";
// Simplified loading components

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/**
 * UI representation of a project
 */
interface UiProject {
  id: string;
  name: string;
  dept?: string;
  budget?: number;
  spent?: number;
  pct: number;
  status: "In Progress" | "Near Completion" | "Just Started";
  barColor: "blue" | "green" | "amber" | "slate";
}

/**
 * UI representation of an alert
 */
interface UiAlert {
  key: string | number;
  color: string;
  icon: string;
  title: string;
  date: string;
  desc: string;
}

/**
 * UI representation of a ledger transaction
 */
interface UiLedgerTransaction {
  key: string | number;
  tx: string;
  amount: string;
  date: string;
  status: "Verified" | "Pending" | "Flagged";
  sig: string;
}

/**
 * UI representation of spending data
 */
interface UiSpendingData {
  m: string;
  actual: number;
  budget: number;
}

/**
 * UI representation of category data
 */
interface UiCategoryData {
  name: string;
  value: number;
  color: string;
  [key: string]: any; // Allow additional properties for chart compatibility
}

// ============================================================================
// UI COMPONENTS
// ============================================================================

/**
 * Reusable card component for dashboard sections
 */
const DashboardCard: React.FC<{ 
  title?: React.ReactNode; 
  right?: React.ReactNode; 
  children: React.ReactNode; 
}> = ({ title, right, children }) => (
  <div className="card">
    {(title || right) && (
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gradient-to-r from-gray-50 to-white">
        <div className="section-title">{title}</div>
        {right}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

/**
 * Progress bar component for project completion
 */
const ProjectProgressBar: React.FC<{ 
  percentage: number; 
  color?: "blue" | "green" | "amber" | "slate" 
}> = ({ percentage, color = "blue" }) => {
  const colorClasses = {
    green: "bg-gradient-to-r from-emerald-500 to-teal-500",
    amber: "bg-gradient-to-r from-amber-500 to-orange-500",
    slate: "bg-gray-400",
    blue: "bg-gradient-to-r from-blue-600 to-indigo-600"
  };
  
  const barColor = colorClasses[color];
  const safePercentage = Math.max(0, Math.min(100, percentage));
  
  return (
    <div className="progress">
      <div 
        className={`progress-bar ${barColor}`} 
        style={{ width: `${safePercentage}%` }} 
      />
    </div>
  );
};

/**
 * Status pill component for displaying project/transaction status
 */
const StatusPill: React.FC<{ status: string }> = ({ status }) => {
  const statusStyles: Record<string, string> = {
    Verified: "pill pill-green",
    Pending: "pill pill-yellow",
    Flagged: "pill pill-red",
    "In Progress": "pill pill-blue",
    "Near Completion": "pill pill-green",
    "Just Started": "pill pill-gray",
  };
  
  const defaultStyle = "pill pill-gray";
  const style = statusStyles[status] ?? defaultStyle;
  
  return (
    <span className={style}>
      {status}
    </span>
  );
};

/**
 * Project row component for displaying project information
 */
const ProjectRow: React.FC<{ 
  project: UiProject; 
  compact?: boolean;
  onViewDetails?: (projectId: string) => void;
}> = ({ project, compact = false, onViewDetails }) => {
  const formatCurrency = (amount?: number) => 
    amount?.toLocaleString?.("en-PH", { 
      style: "currency", 
      currency: "PHP" 
    }) ?? "—";

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(project.id);
    }
  };

  return (
    <div className={`rounded-xl border border-gray-200/60 bg-white hover:shadow-md transition-shadow duration-200 ${compact ? "px-5 py-4" : "p-5"}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-semibold text-gray-900">{project.name}</div>
          <div className="text-xs text-gray-600 mt-1 flex items-center gap-2">
            {project.dept && (
              <span className="inline-flex items-center gap-1">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {project.dept}
              </span>
            )}
            <span>Budget: {formatCurrency(project.budget)}</span>
            <span>Spent: {formatCurrency(project.spent)}</span>
          </div>
        </div>
        <StatusPill status={project.status} />
      </div>
      <div className="space-y-2">
        <ProjectProgressBar percentage={project.pct} color={project.barColor} />
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-gray-700">{project.pct}% Complete</span>
          <button 
            onClick={handleViewDetails}
            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer hover:underline"
          >
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Simple modal component for displaying detailed views
 */
const Modal: React.FC<{ 
  title: string; 
  onClose: () => void; 
  children: React.ReactNode; 
}> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center">
    <div className="absolute inset-0 bg-black/30" onClick={onClose} />
    <div className="relative z-[101] w-full max-w-4xl rounded-xl border border-slate-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
        <div className="text-sm font-semibold text-slate-700">{title}</div>
        <button 
          onClick={onClose} 
          className="rounded p-1 hover:bg-slate-100" 
          aria-label="Close"
        >
          ✕
        </button>
      </div>
      <div className="max-h-[70vh] overflow-auto p-5">{children}</div>
    </div>
  </div>
);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Determine progress bar color based on percentage
 */
const getProgressColor = (percentage: number): UiProject["barColor"] =>
  percentage >= 80 ? "green" : 
  percentage >= 35 ? "blue" : 
  percentage >= 10 ? "amber" : "slate";

/**
 * Determine project status based on percentage
 */
const getProjectStatus = (percentage: number): UiProject["status"] =>
  percentage >= 80 ? "Near Completion" : 
  percentage >= 20 ? "In Progress" : "Just Started";

/**
 * Format currency for display
 */
const formatCurrency = (amount?: number): string =>
  amount?.toLocaleString?.("en-PH", { 
    style: "currency", 
    currency: "PHP" 
  }) ?? "—";

// ============================================================================
// DATA TRANSFORMATION FUNCTIONS
// ============================================================================

/**
 * Transform alert data to UI format
 */
const transformAlerts = (alerts: any[]): UiAlert[] =>
  alerts?.map((alert: any, index: number) => {
    const type = alert.type ?? "info";
    const colorMap = {
      warning: "bg-amber-50",
      success: "bg-emerald-50", 
      danger: "bg-rose-50",
      info: "bg-blue-50"
    };
    const iconMap = {
      warning: "⚠️",
      success: "✅",
      danger: "⛔",
      info: "📄"
    };
    
    return {
      key: alert.id ?? index,
      color: colorMap[type as keyof typeof colorMap] ?? "bg-blue-50",
      icon: iconMap[type as keyof typeof iconMap] ?? "📄",
      title: alert.title ?? alert.message ?? "Alert",
      date: alert.date ? String(alert.date) : "",
      desc: alert.description ?? "",
    };
  }) ?? [];

/**
 * Transform spending data to UI format
 */
const transformSpendingData = (monthly: any[]): UiSpendingData[] =>
  (monthly ?? []).map((item: any) => ({
    m: item.month ?? item.m ?? "",
    actual: Number(item.spent ?? item.actual ?? 0),
    budget: Number(item.allocated ?? item.budget ?? 0),
  }));

/**
 * Transform category data to UI format
 */
const transformCategoryData = (categories: any[]): UiCategoryData[] =>
  (categories ?? []).map((category: any) => ({
    name: category.label ?? category.name ?? "—",
    value: Number(category.value ?? 0),
    color: category.color ?? "#3b82f6",
  }));

/**
 * Transform project data to UI format
 */
const transformProjects = (projects: any[]): UiProject[] =>
  (projects ?? []).map((project: any) => {
    const spent = Number(project.spent ?? 0);
    const budget = Number(project.budget ?? 0);
    const percentage = budget > 0 
      ? Math.min(100, Math.round((spent / budget) * 100)) 
      : (project.progress ?? 0);
    
    return {
      id: String(project._id ?? project.id ?? Math.random()),
      name: project.projectName ?? project.name ?? "Untitled",
      dept: project.department ?? project.dept,
      budget: isNaN(budget) ? undefined : budget,
      spent: isNaN(spent) ? undefined : spent,
      pct: percentage,
      status: getProjectStatus(percentage),
      barColor: getProgressColor(percentage),
    };
  });

/**
 * Transform ledger data to UI format
 */
const transformLedgerData = (ledger: any): UiLedgerTransaction[] =>
  (ledger?.items ?? ledger ?? []).map((transaction: any, index: number) => ({
    key: transaction.id ?? index,
    tx: transaction.title ?? transaction.tx ?? "Transaction",
    amount: typeof transaction.amount === "number"
      ? formatCurrency(transaction.amount)
      : transaction.amount ?? "—",
    date: transaction.date 
      ? new Date(transaction.date).toISOString().slice(0, 10) 
      : transaction.createdAt?.slice(0, 10) ?? "—",
    status: (transaction.status ?? "Verified") as "Verified" | "Pending" | "Flagged",
    sig: transaction.signature ?? transaction.hash ?? transaction.sig ?? "—",
  }));

// ============================================================================
// LOADING & ERROR COMPONENTS
// ============================================================================

/**
 * Loading skeleton component
 */
const LoadingSkeleton = () => (
  <div className="space-y-8">
    <DashboardCard title="Smart Contract Alerts">
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className="animate-pulse rounded-md border border-slate-200 bg-slate-50 px-4 py-3 h-20" 
          />
        ))}
      </div>
    </DashboardCard>
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <DashboardCard title="Monthly Spending vs Allocation">
        <div className="animate-pulse bg-slate-100 h-[280px] rounded" />
      </DashboardCard>
      <DashboardCard title="Budget Allocation by Category">
        <div className="animate-pulse bg-slate-100 h-[280px] rounded" />
      </DashboardCard>
    </div>
  </div>
);

/**
 * Error display component
 */
const ErrorDisplay: React.FC<{ error: string; onRetry: () => void }> = ({ 
  error, 
  onRetry 
}) => (
  <DashboardCard>
    <div className="p-8 text-center space-y-4">
      <div className="text-red-600 text-lg font-medium">
        ⚠️ Failed to Load Dashboard
      </div>
      <p className="text-slate-600">{error}</p>
      <button 
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Retry
      </button>
    </div>
  </DashboardCard>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Citizen Dashboard Page Component
 * 
 * This component displays the main dashboard for citizens, including:
 * - Smart contract alerts
 * - Monthly spending and budget allocation charts
 * - Key projects overview
 * - Recent blockchain transactions
 */
export default function Dashboard() {
  // ============================================================================
  // HOOKS & STATE
  // ============================================================================

  const navigate = useNavigate();
  const { loading, error, alerts, monthly, categories, projects, ledger, reload } = useCitizenDashboard();
  
  const [openProjects, setOpenProjects] = useState(false);
  const [openLedger, setOpenLedger] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleViewProjectDetails = (projectId: string) => {
    navigate(`/citizen/milestones/${encodeURIComponent(projectId)}`);
  };

  // ============================================================================
  // DATA TRANSFORMATION
  // ============================================================================
  
  const uiAlerts = useMemo(() => transformAlerts(alerts), [alerts]);
  const uiSpending = useMemo(() => transformSpendingData(monthly), [monthly]);
  const uiAllocation = useMemo(() => transformCategoryData(categories), [categories]);
  const uiProjects = useMemo(() => transformProjects(projects), [projects]);
  const uiLedger = useMemo(() => transformLedgerData(ledger), [ledger]);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  
  const filteredProjects = useMemo(
    () => uiProjects.filter((project) => 
      project.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [searchQuery, uiProjects]
  );

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  const handleRetry = () => {
    window.location.reload();
  };


  // ============================================================================
  // RENDER CONDITIONS
  // ============================================================================
  
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="card max-w-md p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Dashboard Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={reload}
            className="btn-primary"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  
  return (
    <div className="space-y-8" role="main" aria-label="Citizen Dashboard">
      {/* Smart Contract Alerts Section */}
      <DashboardCard
        title={
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Smart Contract Alerts</span>
          </div>
        }
      >
        <div className="space-y-3">
          {uiAlerts.length === 0 && (
            <div className="alert alert-info flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">No alerts at this time</span>
            </div>
          )}
          {uiAlerts.map((alert) => (
            <div key={alert.key} className={`alert ${alert.color === 'bg-amber-50' ? 'alert-warning' : alert.color === 'bg-emerald-50' ? 'alert-success' : alert.color === 'bg-rose-50' ? 'alert-error' : 'alert-info'}`}>
              <div className="flex items-start gap-3 w-full">
                <span className="text-2xl flex-shrink-0">{alert.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">{alert.title}</span>
                    <span className="text-xs opacity-70">{alert.date}</span>
                  </div>
                  {alert.desc && (
                    <div className="text-sm opacity-90">{alert.desc}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DashboardCard title="Monthly Spending vs Allocation">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={uiSpending} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="m" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="actual" 
                name="Actual Spending" 
                stroke="#2563eb" 
                strokeWidth={2} 
                dot={false} 
              />
              <Line 
                type="monotone" 
                dataKey="budget" 
                name="Allocated Budget" 
                stroke="#94a3b8" 
                strokeWidth={2} 
                dot={false} 
              />
            </LineChart>
          </ResponsiveContainer>
        </DashboardCard>

        <DashboardCard title="Budget Allocation by Category">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie 
                data={uiAllocation} 
                dataKey="value" 
                cx="50%" 
                cy="50%" 
                outerRadius={100} 
                label
              >
                {uiAllocation.map((category, index) => (
                  <Cell key={index} fill={category.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </DashboardCard>
      </div>

      {/* Key Projects Section */}
      <DashboardCard
        title="Key Projects"
        right={
          <button 
            className="text-sm text-blue-600 hover:underline" 
            onClick={() => setOpenProjects(true)}
          >
            View All Projects
          </button>
        }
      >
        <div className="space-y-4">
          {uiProjects.length === 0 && (
            <div className="rounded-md border border-slate-200 p-6 text-center text-sm text-slate-500">
              No projects.
            </div>
          )}
          {uiProjects.slice(0, 4).map((project) => (
            <ProjectRow key={project.id} project={project} onViewDetails={handleViewProjectDetails} />
          ))}
        </div>
      </DashboardCard>

      {/* Recent Transactions Section */}
      <DashboardCard
        title="Recent Blockchain Transactions"
        right={
          <button 
            className="text-sm text-blue-600 hover:underline" 
            onClick={() => setOpenLedger(true)}
          >
            View Complete Ledger
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="px-4 py-2 font-medium">Transaction</th>
                <th className="px-4 py-2 font-medium">Amount</th>
                <th className="px-4 py-2 font-medium">Date</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Signature</th>
              </tr>
            </thead>
            <tbody>
              {uiLedger.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-slate-500" colSpan={5}>
                    No transactions.
                  </td>
                </tr>
              )}
              {uiLedger.map((transaction) => (
                <tr key={transaction.key} className="border-t">
                  <td className="px-4 py-2">{transaction.tx}</td>
                  <td className="px-4 py-2">{transaction.amount}</td>
                  <td className="px-4 py-2">{transaction.date}</td>
                  <td className="px-4 py-2">
                    <StatusPill status={transaction.status} />
                  </td>
                  <td className="px-4 py-2 text-slate-500">{transaction.sig}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>

      {/* Modals */}
      {openProjects && (
        <Modal title="All Projects" onClose={() => setOpenProjects(false)}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <button 
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50" 
              onClick={() => setSearchQuery("")}
            >
              Clear
            </button>
          </div>
          <div className="space-y-3">
            {filteredProjects.map((project) => (
              <ProjectRow key={project.id} project={project} compact onViewDetails={handleViewProjectDetails} />
            ))}
            {filteredProjects.length === 0 && (
              <div className="rounded-md border border-slate-200 p-6 text-center text-sm text-slate-500">
                No projects found.
              </div>
            )}
          </div>
        </Modal>
      )}

      {openLedger && (
        <Modal title="Complete Ledger" onClose={() => setOpenLedger(false)}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-600">
                  <th className="px-4 py-2 font-medium">Transaction</th>
                  <th className="px-4 py-2 font-medium">Amount</th>
                  <th className="px-4 py-2 font-medium">Date</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium">Signature</th>
                </tr>
              </thead>
              <tbody>
                {uiLedger.map((transaction) => (
                  <tr key={transaction.key} className="border-t">
                    <td className="px-4 py-2">{transaction.tx}</td>
                    <td className="px-4 py-2">{transaction.amount}</td>
                    <td className="px-4 py-2">{transaction.date}</td>
                    <td className="px-4 py-2">
                      <StatusPill status={transaction.status} />
                    </td>
                    <td className="px-4 py-2 text-slate-500">{transaction.sig}</td>
                  </tr>
                ))}
                {uiLedger.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-center text-slate-500" colSpan={5}>
                      No transactions.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </div>
  );
}
