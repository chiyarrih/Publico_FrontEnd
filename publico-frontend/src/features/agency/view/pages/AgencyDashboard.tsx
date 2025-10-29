import React from "react";
import { useNavigate } from "react-router-dom";
import { useAgencyDashboard } from "../../controller/hooks/useAgencyDashboard";
import { ActiveProjectsCard } from "../components/ActiveProjectsCard";
import { PendingApprovalsCard } from "../components/PendingApprovalsCard";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import useContractAlerts from "../../controller/hooks/useContract";
import { formatAlertTimestamp, formatAlertType, formatSeverity } from "@/utils/serializers";
import { bar, IconForSeverity, tone } from "@/features/admin/view/pages/SmartAlerts";
import { Badge } from "@/features/admin/view/ui/blocks";


/* -- Enhanced UI Components -- */
const Card: React.FC<React.PropsWithChildren<{ title?: React.ReactNode; right?: React.ReactNode; className?: string; variant?: 'default' | 'elevated' | 'gradient' }>> =
({ title, right, className = "", children, variant = 'default' }) => {
  const cardClasses = {
    default: "rounded-2xl border border-slate-200/60 bg-white shadow-sm hover:shadow-md transition-all duration-300",
    elevated: "rounded-2xl border border-slate-200/60 bg-white shadow-lg hover:shadow-xl transition-all duration-300",
    gradient: "rounded-2xl border border-slate-200/60 bg-gradient-to-br from-white to-slate-50 shadow-lg hover:shadow-xl transition-all duration-300"
  };
  
  return (
    <div className={`${cardClasses[variant]} ${className}`}>
      {(title || right) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-white">
          <div className="text-lg font-semibold text-slate-900">{title}</div>
          {right}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

const pill = (t:"blue"|"green"|"yellow"|"red"|"gray"|"purple"|"indigo"="gray")=>{
  const m={
    blue:"bg-blue-50 text-blue-700 ring-blue-200 shadow-blue-100",
    green:"bg-emerald-50 text-emerald-700 ring-emerald-200 shadow-emerald-100",
    yellow:"bg-yellow-50 text-yellow-700 ring-yellow-200 shadow-yellow-100",
    red:"bg-red-50 text-red-700 ring-red-200 shadow-red-100",
    gray:"bg-slate-50 text-slate-700 ring-slate-200 shadow-slate-100",
    purple:"bg-purple-50 text-purple-700 ring-purple-200 shadow-purple-100",
    indigo:"bg-indigo-50 text-indigo-700 ring-indigo-200 shadow-indigo-100"
  };
  return `inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ring-1 shadow-sm ${m[t]}`;
};

const StatCard: React.FC<{ label: string; value: string; delta?: string; trend?: 'up' | 'down' | 'neutral'; icon?: React.ReactNode }> = 
({ label, value, delta, trend = 'neutral', icon }) => (
  <div className="group rounded-2xl border border-slate-200/60 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
    <div className="flex items-center justify-between mb-3">
      <div className="text-sm font-medium text-slate-600">{label}</div>
      {icon && <div className="transition-colors text-slate-400 group-hover:text-slate-600">{icon}</div>}
    </div>
    <div className="mb-1 text-2xl font-bold text-slate-900">{value}</div>
    {delta && (
      <div className={`flex items-center gap-1 text-sm font-medium ${
        trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-slate-500'
      }`}>
        {trend === 'up' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>}
        {trend === 'down' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>}
        {delta}
      </div>
    )}
  </div>
);
/* -------------------------------------------------------------------- */

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>
    <path d="M7 9l5-5 5 5M12 4v12"/>
  </svg>
);

const AgencyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    kpis, 
    spendingSeries, 
    statusPie, 
    projects, 
    tab, 
    switchTab, 
    submitBudget,
    dashboardData,
  } = useAgencyDashboard();
  const { alerts, loading, error } = useContractAlerts()

  // Error boundary - catch any rendering errors
  try {
    return (
    <div className="p-1 space-y-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">Agency Dashboard</h1>
        <p className="text-slate-600">Monitor your projects, budgets, and performance metrics</p>
      </div>

      {/* Alerts */}
      <Card 
        title={<div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <span>Smart Contract Alerts</span></div>}
        right={<button 
          onClick={() => navigate('/agency/alerts')}
          className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
        >
          View All →
        </button>}
        variant="elevated">
        <div className="space-y-3">
          {alerts && Array.isArray(alerts) && alerts.length > 0 ? (
            alerts.map((a, index) =>
              a && a.resolved === false ? (
                <Card key={index} className={`${bar(formatSeverity(a.severity))} border`}>
                  <div className="flex items-start gap-3">
                    <IconForSeverity severity={formatSeverity(a.severity)} />
      
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{formatAlertType(a.alertType)}</div>
                        <div className="text-xs text-slate-500">{formatAlertTimestamp(a.timestamp)}</div>
                      </div>
      
                      <div className="mt-1 text-sm text-slate-600">{a.description}</div>
      
                      <div className="flex gap-2 mt-2">
                        <Badge tone={tone(formatSeverity(a.severity))}>{formatSeverity(a.severity)}</Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ) : null,
            )
          ) : (
            <div className="text-center py-4 text-slate-500">No alerts available</div>
          )}
        </div>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {kpis && Array.isArray(kpis) ? (
          kpis.map((k,i)=>{
            const icons = [
              <svg key="budget" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>,
              <svg key="allocation" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>,
              <svg key="projects" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>,
              <svg key="approvals" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ];
            return (
              <StatCard 
                key={i}
                label={k.label}
                value={String(k.value)}
                delta={k.delta}
                trend={k.up ? 'up' : k.delta ? 'down' : 'neutral'}
                icon={icons[i]}
              />
            );
          })
        ) : (
          <div className="col-span-4 text-center py-8 text-slate-500">Loading KPI data...</div>
        )}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card 
          title={<div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            Monthly Spending vs. Allocation
          </div>}
          variant="gradient">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spendingSeries} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="m" 
                  stroke="#64748b" 
                  style={{ fontSize: '12px' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  style={{ fontSize: '12px' }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid #e2e8f0',
                    backgroundColor: 'white',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  name="Actual Spending" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="budget" 
                  name="Allocated Budget" 
                  stroke="#94a3b8" 
                  strokeWidth={3} 
                  strokeDasharray="5 5"
                  dot={{ fill: '#94a3b8', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#94a3b8', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card 
          title={<div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 bg-purple-100 rounded">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            Project Status Overview
          </div>}
          variant="gradient">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={statusPie} 
                  dataKey="value" 
                  nameKey="name" 
                  outerRadius={100} 
                  innerRadius={40}
                  label={(props: any) => `${props.name} ${(props.percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {statusPie.map((s,i)=><Cell key={i} fill={s.color}/>)}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid #e2e8f0',
                    backgroundColor: 'white',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Active Projects and Pending Approvals - Dynamic Data */}
      <div className="grid gap-3 lg:grid-cols-2">
        <ActiveProjectsCard 
          milestones={dashboardData.approvedMilestones} 
          isLoading={dashboardData.isLoading} 
        />
        <PendingApprovalsCard 
          requests={dashboardData.pendingRequests} 
          isLoading={dashboardData.isLoading} 
        />
      </div>

      {/* Projects and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card 
          title={<div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 bg-indigo-100 rounded">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            Department Projects
          </div>}
          right={<button 
            onClick={() => navigate('/agency/milestones')}
            className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
          >
            View All →
          </button>}
          variant="elevated">
          <div className="space-y-4">
            {projects && Array.isArray(projects) && projects.length > 0 ? (
              projects.map((p,i)=>{
                if (!p) return null;
                return (
                  <div key={i} className="p-5 transition-all duration-200 border group rounded-xl border-slate-200 hover:shadow-md hover:border-slate-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <div className="font-semibold transition-colors text-slate-900 group-hover:text-slate-700">{p.name}</div>
                        <div className="mt-1 text-sm text-slate-600">{p.dept}</div>
                        {(p.budget || p.spent) && (
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                            {p.budget && <span>Budget: {p.budget}</span>}
                            {p.spent && <span>Spent: {p.spent}</span>}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-900">{p.pct}%</div>
                        <div className="text-xs text-slate-500">Complete</div>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="w-full h-3 overflow-hidden rounded-full bg-slate-100">
                        <div 
                          className="h-full transition-all duration-500 ease-out rounded-full"
                          style={{ 
                            width: `${p.pct}%`, 
                            background: `linear-gradient(90deg, ${p.color} 0%, ${p.color}dd 100%)`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-slate-500">No projects available</div>
            )}
          </div>
        </Card>

        <Card 
          title={<div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded bg-emerald-100">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            Recent Activity
          </div>}
          variant="elevated">
          <ul className="space-y-4">
            <li className="flex items-start gap-3 p-3 transition-colors rounded-lg hover:bg-slate-50">
              <span className={pill("green")}>Approved</span>
              <div className="flex-1">
                <div className="font-medium text-slate-900">Budget Amendment Approved</div>
                <div className="mt-1 text-sm text-slate-600">Q3 Infrastructure Budget +₱250,000</div>
                <div className="mt-1 text-xs text-slate-500">2 hours ago</div>
              </div>
            </li>
            <li className="flex items-start gap-3 p-3 transition-colors rounded-lg hover:bg-slate-50">
              <span className={pill("yellow")}>Pending</span>
              <div className="flex-1">
                <div className="font-medium text-slate-900">Project Proposal Submitted</div>
                <div className="mt-1 text-sm text-slate-600">Downtown Bridge Repair</div>
                <div className="mt-1 text-xs text-slate-500">yesterday</div>
              </div>
            </li>
            <li className="flex items-start gap-3 p-3 transition-colors rounded-lg hover:bg-slate-50">
              <span className={pill("purple")}>Verified</span>
              <div className="flex-1">
                <div className="font-medium text-slate-900">Document Uploaded</div>
                <div className="mt-1 text-sm text-slate-600">Annual Financial Report 2023</div>
                <div className="mt-1 text-xs text-slate-500">2 days ago</div>
              </div>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
  } catch (err: any) {
    console.error('Agency Dashboard Error:', err);
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-2">⚠️ Dashboard Error</div>
          <p className="text-slate-600 mb-4">{err?.message || "Something went wrong"}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
};

export default AgencyDashboard;
