import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getKeyProjects } from "../../controller/data/dashboardService";

const peso = (n: number | undefined) =>
  typeof n === "number" ? n.toLocaleString("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }) : "-";

const Pill: React.FC<{ tone: "blue" | "green" | "gray"; children: React.ReactNode }> = ({ tone, children }) => {
  const map = { blue: "bg-blue-50 text-blue-700 border-blue-200", green: "bg-emerald-50 text-emerald-700 border-emerald-200", gray: "bg-slate-50 text-slate-600 border-slate-200" } as const;
  return <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${map[tone]}`}>{children}</span>;
};

const Progress: React.FC<{ value: number; tone?: "blue" | "green" | "slate" }> = ({ value, tone = "blue" }) => {
  const thumb = tone === "green" ? "bg-emerald-500" : tone === "slate" ? "bg-slate-300" : "bg-blue-500";
  return <div className="h-2 w-full rounded-full bg-slate-100"><div className={`h-2 rounded-full ${thumb}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>;
};

const AlertBanner: React.FC<{ kind: "warn" | "info"; children: React.ReactNode }> = ({ kind, children }) => {
  const tone = kind === "warn" ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-blue-50 border-blue-200 text-blue-700";
  const icon = kind === "warn"
    ? <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 9v4M12 17h.01" /><path d="M10 2h4l9 16H1L10 2z" /></svg>
    : <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 16h-1v-4h-1M12 8h.01" /><circle cx="12" cy="12" r="9" /></svg>;
  return <div className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${tone}`}>{icon}<span className="text-sm">{children}</span></div>;
};

const RowLabel: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-slate-500">{label}</span>
    <span className="font-medium text-slate-900">{value}</span>
  </div>
);

const MilestoneDetail: React.FC = () => {
  const nav = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [project, setProject] = useState<any | null>(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true); setErr(null);
        const list = await getKeyProjects(200); // array
        const p = list.find((x: any) => String(x._id ?? x.code) === String(id));
        if (!ignore) setProject(p ?? null);
      } catch (e: any) {
        if (!ignore) setErr(e?.message || "Failed to load project");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [id]);

  const title = project?.projectName ?? "-";
  const department = project?.department ?? "-";
  const budget = project?.budget;
  const start = project?.startDate;
  const end   = project?.endDate;
  const status = (project?.status as string) || "In Progress";

  // simple derived progress (if backend does not provide)
  const overallProgress = useMemo(() => {
    if (typeof project?.progress === "number") return project.progress;
    return status === "Completed" ? 100 : status === "Pending" ? 0 : 45;
  }, [project, status]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => nav(-1)} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 hover:bg-slate-50" aria-label="Back">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <div className="text-lg font-semibold text-slate-900">
            Project Milestones — <span className="font-normal">{title}</span>
          </div>
        </div>
        <div className="text-xs text-slate-500">
          <span className="uppercase tracking-wide">Project ID:</span>{" "}
          <span className="font-medium text-slate-700">{id}</span>
        </div>
      </div>

      {err && <div className="text-sm text-rose-600">{err}</div>}
      {loading && <div className="text-sm text-slate-500">Loading project…</div>}

      {/* Overview */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-4 text-sm font-semibold text-slate-700">Project Overview</div>
        <div className="grid gap-6 md:grid-cols-3">
          <RowLabel label="Department" value={<span className="text-slate-700">{department}</span>} />
          <RowLabel label="Total Budget" value={<button className="text-blue-600 hover:underline font-semibold">{peso(budget)}</button>} />
          <RowLabel
            label="Timeline"
            value={<span className="text-slate-700">
              {start ? new Date(start).toLocaleDateString() : "-"} — {end ? new Date(end).toLocaleDateString() : "-"}
            </span>}
          />
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-slate-500">Overall Progress</span>
            <span className="font-medium text-slate-900">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} />
        </div>
      </div>

      {/* Alerts (placeholder until backend exposes milestones alerts for citizens) */}
      <div className="space-y-2">
        <AlertBanner kind="warn">Monitoring expenditures for potential over-spend.</AlertBanner>
        <AlertBanner kind="info">Planning updates synced from agency portal.</AlertBanner>
      </div>

      {/* Phase placeholder */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-2 text-sm font-semibold text-slate-700">{status} Phase</div>
        <div className="text-sm text-slate-600">Latest update will appear here when the agency posts phase updates.</div>
      </div>
    </div>
  );
};

export default MilestoneDetail;
