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
  <div className="rounded-xl border border-slate-200 bg-white">
    {(title || right) && (
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div className="text-sm font-semibold text-slate-700">{title}</div>
        {right}
      </div>
    )}
    <div className="p-4">{children}</div>
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
    green: "bg-emerald-500",
    amber: "bg-amber-500",
    slate: "bg-slate-400",
    blue: "bg-blue-600"
  };
  
  const barColor = colorClasses[color];
  const safePercentage = Math.max(0, Math.min(100, percentage));
  
  return (
    <div className="h-2 w-full rounded-full bg-slate-100">
      <div 
        className={`h-2 rounded-full ${barColor}`} 
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
    Verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Flagged: "bg-rose-50 text-rose-700 border-rose-200",
    "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
    "Near Completion": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Just Started": "bg-slate-50 text-slate-600 border-slate-200",
  };
  
  const defaultStyle = "bg-slate-50 text-slate-600 border-slate-200";
  const style = statusStyles[status] ?? defaultStyle;
  
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${style}`}>
      {status}
    </span>
  );
};

/**
 * Project row component for displaying project information
 */
const ProjectRow: React.FC<{ 
  project: UiProject; 
  compact?: boolean 
}> = ({ project, compact = false }) => {
  const formatCurrency = (amount?: number) => 
    amount?.toLocaleString?.("en-PH", { 
      style: "currency", 
      currency: "PHP" 
    }) ?? "—";

  return (
    <div className={`rounded-md border border-slate-200 ${compact ? "px-4 py-3" : "p-4"}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium text-slate-900">{project.name}</div>
          <div className="text-xs text-slate-500">
            {project.dept && `${project.dept} • `}
            Budget: {formatCurrency(project.budget)}
            {" • "}Spent: {formatCurrency(project.spent)}
          </div>
        </div>
        <StatusPill status={project.status} />
      </div>
      <div className="mt-3 space-y-1">
        <ProjectProgressBar percentage={project.pct} color={project.barColor} />
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{project.pct}%</span>
          <button className="text-blue-600 hover:underline">
            View Details
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

  const { loading, error, alerts, monthly, categories, projects, ledger, reload } = useCitizenDashboard();
  
  const [openProjects, setOpenProjects] = useState(false);
  const [openLedger, setOpenLedger] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center p-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Dashboard Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={reload}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
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
            <span className="text-amber-500">◎</span>
            <span>Smart Contract Alerts</span>
          </div>
        }
      >
        <div className="space-y-3">
          {uiAlerts.length === 0 && (
            <div className="rounded-md border border-slate-200 px-4 py-3 text-sm text-slate-600">
              No alerts.
            </div>
          )}
          {uiAlerts.map((alert) => (
            <div key={alert.key} className={`rounded-md ${alert.color} border border-slate-200 px-4 py-3`}>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-2 font-medium text-slate-900">
                  {alert.icon} {alert.title}
                </span>
                <span>{alert.date}</span>
              </div>
              {alert.desc && (
                <div className="mt-1 text-sm text-slate-600">{alert.desc}</div>
              )}
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
            <ProjectRow key={project.id} project={project} />
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
              <ProjectRow key={project.id} project={project} compact />
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