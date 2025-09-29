import React from "react";
import { useAgencyDashboard } from "../hooks/useAgencyDashboard";
import { AlertsList, KpiRow, SpendVsAlloc, StatusPie, ProjectList, BudgetForm, Card } from "../ui/blocks";

const AgencyDashboard: React.FC = () => {
  const { alerts, kpis, spendingSeries, statusPie, projects, tab, switchTab, submitBudget } = useAgencyDashboard();

  return (
    <div className="space-y-6">
      {/* Alerts */}
      <AlertsList items={alerts} />

      {/* KPIs */}
      <KpiRow items={kpis} />

      {/* Charts */}
      <div className="grid gap-3 lg:grid-cols-2">
        <SpendVsAlloc data={spendingSeries} />
        <StatusPie data={statusPie} />
      </div>

      {/* Projects */}
      <ProjectList items={projects} />

      {/* Budget & Activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2" title={
          <div className="flex items-center gap-4">
            <button
              className={`text-sm pb-2 border-b-2 ${tab === "budget" ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500"}`}
              onClick={() => switchTab("budget")}
            >Budget Submission</button>
            <button
              className={`text-sm pb-2 border-b-2 ${tab === "proposal" ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500"}`}
              onClick={() => switchTab("proposal")}
            >Project Proposal</button>
          </div>
        }>
          {tab === "budget" ? (
            <BudgetForm onSubmit={submitBudget} />
          ) : (
            <div className="pt-4 text-sm text-slate-600">
              <div className="rounded border border-slate-200 p-4">
                Project Proposal form goes here (reuse BudgetForm with objectives, milestones, stakeholders).
              </div>
            </div>
          )}
        </Card>

        <Card title="Recent Activity">
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="pill pill-green">Approved</span>
              <div>
                <div className="text-slate-700">Budget Amendment Approved</div>
                <div className="text-[12px] text-slate-500">Q3 Infrastructure Budget +₱250,000 • 2 hours ago</div>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="pill pill-yellow">Pending</span>
              <div>
                <div className="text-slate-700">Project Proposal Submitted</div>
                <div className="text-[12px] text-slate-500">Downtown Bridge Repair • yesterday</div>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="pill pill-blue">Verified</span>
              <div>
                <div className="text-slate-700">Document Uploaded</div>
                <div className="text-[12px] text-slate-500">Annual Financial Report 2023 • 2 days ago</div>
              </div>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default AgencyDashboard;
