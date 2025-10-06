import React from "react";
import { useParams, Link } from "react-router-dom";
import { sampleProjects, asMoney } from "../../model/projectTypes";
import { Block, Panel, InfoItem, Pill, ProgressBar, ViewLink } from "../ui/kit";

export default function ProjectDetails(){
  const { id="" } = useParams();
  const project = sampleProjects.find(p=>p.id===id) || null;
  if(!project) return <div className="text-sm">Project not found.</div>;

  const avgProgress = Math.round(
    (project.phases.planning.progress + project.phases.procurement.progress + project.phases.construction.progress + project.phases.completion.progress) / 4
  );
  const procurementOver = project.phases.procurement.spent - project.phases.procurement.budget;
  const planningUnder   = project.phases.planning.budget - project.phases.planning.spent;

  return (
    <>
      <div className="mb-3 flex items-center gap-2 text-sm">
        <Link to="/admin/milestones" className="rounded px-2 py-1 hover:bg-slate-100">← Project Milestones</Link>
        <div className="text-slate-500">—</div>
        <div className="font-medium">{project.title}</div>
        <div className="ml-auto text-xs text-slate-500">Project ID: <span className="font-medium">{project.id}</span></div>
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
          <InfoItem label="Project Title" value={project.title}/>
          <InfoItem label="Department" value={project.department}/>
          <InfoItem label="Total Budget" value={asMoney(project.totalBudget)}/>
          <InfoItem label="Timeline" value={`${project.timeline.start}  -  ${project.timeline.end}`}/>
        </div>
        <div className="mt-4">
          <div className="mb-1 text-xs text-slate-500">Overall Progress</div>
          <ProgressBar value={avgProgress}/>
          <div className="mt-1 text-xs text-slate-500">{avgProgress}%</div>
        </div>
      </Block>

      <Block title="Project Timeline">
        {(Object.entries(project.phases) as [string, any][])
          .map(([phaseName, phase], i)=>(
          <Panel key={phaseName} className="mb-3">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-xs">{i+1}</span>
                <div className="font-medium capitalize">{phaseName}</div>
              </div>
              <Pill tone={phase.status==="Completed"?"green":phase.status==="In Progress"?"blue":"gray"}>{phase.status}</Pill>
            </div>
            <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <InfoItem label="Budget" value={asMoney(phase.budget)}/>
              <InfoItem label="Spent" value={asMoney(phase.spent)}/>
              <InfoItem label="Progress" value={`${phase.progress}%`}/>
              <InfoItem label="Timeline" value={`${phase.start}  -  ${phase.end}`}/>
            </div>
            <div className="px-4 pb-4"><ProgressBar value={phase.progress}/></div>
          </Panel>
        ))}
      </Block>

      <Block title="Procurement  Phase">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoItem label="Budget Allocation" value={asMoney(project.phases.procurement.budget)} hint="2.32 ETH"/>
          <InfoItem label="Expenses to Date" value={asMoney(project.phases.procurement.spent)} hint="2.75 ETH"/>
          <InfoItem label="Remaining Budget" value={`${procurementOver>0? "-" : ""}${asMoney(Math.abs(project.phases.procurement.budget - project.phases.procurement.spent))}`} hint="-0.43 ETH"/>
          <InfoItem label="Timeline" value={`${project.phases.procurement.start}  -  ${project.phases.procurement.end}`}/>
        </div>

        <div className="mt-4 text-sm font-medium mb-2">Proof of Work</div>
        <div className="space-y-2">
          {project.proofs?.map(doc=>(
            <Panel key={doc.id} className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{doc.title}</div>
                  <div className="text-xs text-slate-500">{doc.note}</div>
                  <div className="mt-1 text-[12px] text-slate-500">
                    Uploaded <b>{doc.uploadedDate}</b> · by {doc.uploadedBy} · {doc.size}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Pill tone={doc.checkStatus==="Verified"?"green":"yellow"}>{doc.checkStatus}</Pill>
                  <ViewLink to={`document/${doc.id}`}/>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      </Block>
    </>
  );
}
