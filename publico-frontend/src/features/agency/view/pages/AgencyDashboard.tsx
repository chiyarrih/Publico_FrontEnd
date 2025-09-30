import React from "react";
import { useAgencyDashboard } from "../../controller/hooks/useAgencyDashboard";
import {
  AlertsList,
  KpiRow,
  SpendVsAlloc,
  StatusPie,
  ProjectList,
  BudgetForm,
  Card,
} from "../ui/blocks";
import { Pill } from "../ui/Pill";

const AgencyDashboard: React.FC = () => {
  const {
    alerts,
    kpis,
    spendingSeries,
    statusPie,
    projects,
    submitBudget,
  } = useAgencyDashboard();

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

      {/* Budget form + activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BudgetForm onSubmit={submitBudget} />
        </div>

        <Card title="Recent Activity">
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <Pill color="green">Approved</Pill>
              <div>
                <div className="text-slate-700">Budget Amendment Approved</div>
                <div className="text-[12px] text-slate-500">
                  Q3 Infrastructure Budget +₱250,000 • 2 hours ago
                </div>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Pill color="yellow">Pending</Pill>
              <div>
                <div className="text-slate-700">Project Proposal Submitted</div>
                <div className="text-[12px] text-slate-500">
                  Downtown Bridge Repair • yesterday
                </div>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Pill color="blue">Verified</Pill>
              <div>
                <div className="text-slate-700">Document Uploaded</div>
                <div className="text-[12px] text-slate-500">
                  Annual Financial Report 2023 • 2 days ago
                </div>
              </div>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default AgencyDashboard;
