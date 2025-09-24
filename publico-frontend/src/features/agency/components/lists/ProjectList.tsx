import React from "react";
import type { Project } from "../../../agency/hooks/useAgencyDashboard";

const ProjectRow: React.FC<{ p: Project }> = ({ p }) => (
  <div className="rounded border border-slate-200 p-3">
    <div className="flex items-center justify-between">
      <div>
        <div className="font-medium text-slate-900">{p.name}</div>
        <div className="text-[12px] text-slate-500">
          {p.dept}{p.budget ? ` • Budget: ${p.budget}` : ""}{p.spent ? ` • Spent: ${p.spent}` : ""}
        </div>
      </div>
      <span className="text-xs text-slate-500">{p.pct}%</span>
    </div>
    <div className="mt-2 w-full h-2 rounded bg-slate-200 overflow-hidden">
      <div className="h-2" style={{ width: `${p.pct}%`, backgroundColor: p.color }} />
    </div>
  </div>
);

const ProjectList: React.FC<{ items: Project[] }> = ({ items }) => (
  <div className="card p-4">
    <div className="section-title mb-3">Key Projects</div>
    <div className="space-y-3">{items.map((p, i) => <ProjectRow key={i} p={p} />)}</div>
  </div>
);

export default ProjectList;
