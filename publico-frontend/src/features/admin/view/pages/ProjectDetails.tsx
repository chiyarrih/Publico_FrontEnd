import React from "react";
import { useParams, Link } from "react-router-dom";
import { useProjectMilestone } from "../../controller/hooks/useProjectMilestones";
import { Block, Panel, InfoItem, Pill, ProgressBar, ViewLink } from "../ui/kit";

const asMoney = (n: number) => `₱${n.toLocaleString()}`;

export default function ProjectDetails(){
  const { id="" } = useParams();
  const { milestone: project, loading, error } = useProjectMilestone(id);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading project details...</div>
      </div>
    );
  }

  if (error || !project) {
    return <div className="text-sm">Project not found.</div>;
  }

  const avgProgress = project.overallProgress || 0;
  const procurementPhase = project.phases.find(p => p.phaseName.toLowerCase().includes('procurement'));
  const planningPhase = project.phases.find(p => p.phaseName.toLowerCase().includes('planning'));
  const procurementOver = procurementPhase ? procurementPhase.spent - procurementPhase.budget : 0;
  const planningUnder = planningPhase ? planningPhase.budget - planningPhase.spent : 0;

  return (
    <>
      <div className="mb-3 flex items-center gap-2 text-sm">
        <Link to="/admin/milestones" className="rounded px-2 py-1 hover:bg-slate-100">← Project Milestones</Link>
        <div className="text-slate-500">—</div>
        <div className="font-medium">{project.projectName}</div>
        <div className="ml-auto text-xs text-slate-500">Project ID: <span className="font-medium">{project._id.slice(-8)}</span></div>
      </div>

      {procurementOver>0 && (
        <Panel className="mb-3 bg-amber-50 border-amber-200 text-amber-900">
          <div className="px-4 py-3 text-[13px]">⚠️ Procurement went over budget by <b>{asMoney(procurementOver)}</b></div>
        </Panel>
      )}
      {planningUnder>0 && (
        <Panel className="mb-3 bg-blue-50 border-blue-200 text-blue-900">
          <div className="px-4 py-3 text-[13px]">ℹ️ Planning finished under budget by <b>{asMoney(planningUnder)}</b></div>
        </Panel>
      )}

      <Block title="Project Overview">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoItem label="Project Title" value={project.projectName}/>
          <InfoItem label="Department" value={project.department}/>
          <InfoItem label="Total Budget" value={asMoney(project.totalBudget)}/>
          <InfoItem label="Timeline" value={`${new Date(project.startDate).toLocaleDateString()}  -  ${new Date(project.endDate).toLocaleDateString()}`}/>
        </div>
        <div className="mt-4">
          <div className="mb-1 text-xs text-slate-500">Overall Progress</div>
          <ProgressBar value={avgProgress}/>
          <div className="mt-1 text-xs text-slate-500">{avgProgress}%</div>
        </div>
      </Block>

      <Block title="Project Timeline">
        {project.phases.map((phase, i)=>(
          <Panel key={phase.phaseNumber} className="mb-3">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-xs">{phase.phaseNumber}</span>
                <div className="font-medium">{phase.phaseName}</div>
              </div>
              <Pill tone={phase.status==="Completed"?"green":phase.status==="In Progress"?"blue":"gray"}>{phase.status}</Pill>
            </div>
            <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <InfoItem label="Budget" value={asMoney(phase.budget)}/>
              <InfoItem label="Spent" value={asMoney(phase.spent)}/>
              <InfoItem label="Progress" value={`${phase.progress}%`}/>
              <InfoItem label="Timeline" value={`${new Date(phase.startDate).toLocaleDateString()}  -  ${new Date(phase.endDate).toLocaleDateString()}`}/>
            </div>
            <div className="px-4 pb-4"><ProgressBar value={phase.progress}/></div>
          </Panel>
        ))}
      </Block>

      {procurementPhase && (
        <Block title="Procurement Phase">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <InfoItem label="Budget Allocation" value={asMoney(procurementPhase.budget)} hint={`${procurementPhase.budgetEth} ETH`}/>
            <InfoItem label="Expenses to Date" value={asMoney(procurementPhase.spent)} hint={`${procurementPhase.spentEth} ETH`}/>
            <InfoItem label="Remaining Budget" value={`${procurementOver>0? "-" : ""}${asMoney(Math.abs(procurementPhase.budget - procurementPhase.spent))}`} hint={`${procurementPhase.budgetEth - procurementPhase.spentEth} ETH`}/>
            <InfoItem label="Timeline" value={`${new Date(procurementPhase.startDate).toLocaleDateString()}  -  ${new Date(procurementPhase.endDate).toLocaleDateString()}`}/>
          </div>

          <div className="mt-4 text-sm font-medium mb-2">Proof of Work</div>
          <div className="space-y-2">
            {procurementPhase.proofOfWork?.map(doc=>(
              <Panel key={doc.documentId} className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{doc.documentType}</div>
                    <div className="text-xs text-slate-500">{doc.description}</div>
                    <div className="mt-1 text-[12px] text-slate-500">
                      Uploaded <b>{new Date(doc.uploadedAt).toLocaleDateString()}</b> · by {doc.uploadedBy} · {(doc.fileSize / 1024 / 1024).toFixed(1)} MB
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Pill tone={doc.verificationStatus==="Verified"?"green":doc.verificationStatus==="Rejected"?"red":"yellow"}>{doc.verificationStatus}</Pill>
                    <ViewLink to={`document/${doc.documentId}`}/>
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        </Block>
      )}
    </>
  );
}
