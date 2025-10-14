import React from "react";
import { useNavigate, useParams } from "react-router-dom";

/* ---------- Mock single project (aligns with screenshot) ---------- */
const PROJECT = {
  id: "PRJ-2023-0125",
  title: "Road Rehabilitation - Perez Blvd",
  department: "Public Works",
  budget: 2_500_000,
  start: "2023-06-01",
  end: "2023-08-30",
  overallProgress: 45, // %
  alerts: [
    { tone: "warn", text: "Procurement phase exceeded budget by ₱150,000 (0.43 ETH)" },
    { tone: "info", text: "Planning phase completed under budget by ₱20,000 (0.06 ETH)" },
  ] as { tone: "warn" | "info"; text: string }[],
  phases: [
    { i: 1, name: "Planning", budget: 300_000, spent: 280_000, progress: 100, status: "Completed" },
    { i: 2, name: "Procurement", budget: 800_000, spent: 950_000, progress: 75, status: "In Progress" },
    { i: 3, name: "Construction", budget: 1_200_000, spent: 0, progress: 0, status: "Pending" },
    { i: 4, name: "Completion", budget: 200_000, spent: 0, progress: 0, status: "Pending" },
  ],
};

const peso = (n: number) =>
  n.toLocaleString("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 });

const Pill: React.FC<{ tone: "blue" | "green" | "gray"; children: React.ReactNode }> = ({ tone, children }) => {
  const map = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    gray: "bg-slate-50 text-slate-600 border-slate-200",
  } as const;
  return <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${map[tone]}`}>{children}</span>;
};

const Progress: React.FC<{ value: number; tone?: "blue" | "green" | "slate" }> = ({ value, tone = "blue" }) => {
  const track = "h-2 w-full rounded-full bg-slate-100";
  const thumb =
    tone === "green" ? "bg-emerald-500" : tone === "slate" ? "bg-slate-300" : "bg-blue-500";
  return (
    <div className={track}>
      <div className={`h-2 rounded-full ${thumb}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
};

const AlertBanner: React.FC<{ kind: "warn" | "info"; children: React.ReactNode }> = ({ kind, children }) => {
  const tone =
    kind === "warn"
      ? "bg-amber-50 border-amber-200 text-amber-800"
      : "bg-blue-50 border-blue-200 text-blue-700";
  const icon =
    kind === "warn" ? (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 9v4M12 17h.01" />
        <path d="M10 2h4l9 16H1L10 2z" />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 16h-1v-4h-1M12 8h.01" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    );
  return (
    <div className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${tone}`}>
      {icon}
      <span className="text-sm">{children}</span>
    </div>
  );
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

  const p = PROJECT; // (if you wire API, use id)

  return (
    <div className="space-y-6">
      {/* Header / breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => nav(-1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 hover:bg-slate-50"
            aria-label="Back"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="text-lg font-semibold text-slate-900">
            Project Milestones — <span className="font-normal">{p.title}</span>
          </div>
        </div>
        <div className="text-xs text-slate-500">
          <span className="uppercase tracking-wide">Project ID:</span>{" "}
          <span className="font-medium text-slate-700">{p.id}</span>
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-2">
        <AlertBanner kind="warn">{p.alerts[0].text}</AlertBanner>
        <AlertBanner kind="info">{p.alerts[1].text}</AlertBanner>
      </div>

      {/* Overview */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-4 text-sm font-semibold text-slate-700">Project Overview</div>

        <div className="grid gap-6 md:grid-cols-3">
          <RowLabel label="Department" value={<span className="text-slate-700">{p.department}</span>} />
          <RowLabel
            label="Total Budget"
            value={
              <button className="text-blue-600 hover:underline font-semibold">
                {peso(p.budget)}
              </button>
            }
          />
          <RowLabel
            label="Timeline"
            value={
              <span className="text-slate-700">
                {new Date(p.start).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" })} —{" "}
                {new Date(p.end).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            }
          />
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-slate-500">Overall Progress</span>
            <span className="font-medium text-slate-900">{p.overallProgress}%</span>
          </div>
          <Progress value={p.overallProgress} />
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-4 text-sm font-semibold text-slate-700">Project Timeline</div>

        <div className="space-y-4">
          {p.phases.map((ph, idx) => {
            const tone = ph.status === "Completed" ? "green" : ph.status === "In Progress" ? "blue" : "slate";
            const pillTone = ph.status === "Completed" ? "green" : ph.status === "In Progress" ? "blue" : "gray";
            return (
              <div
                key={ph.i}
                className={`rounded-lg border px-5 py-4 ${
                  ph.status === "In Progress" ? "border-blue-200 ring-1 ring-blue-50" : "border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold text-white ${
                        ph.status === "Completed" ? "bg-emerald-500" : ph.status === "In Progress" ? "bg-blue-500" : "bg-slate-300"
                      }`}
                    >
                      {ph.i}
                    </span>
                    <div className="text-slate-900 font-medium">{ph.name}</div>
                  </div>
                  <Pill tone={pillTone as any}>{ph.status}</Pill>
                </div>

                <div className="mt-3 grid gap-4 md:grid-cols-3 text-sm">
                  <RowLabel
                    label="Budget"
                    value={
                      <span className="text-slate-700">
                        {peso(ph.budget)} <span className="text-slate-400 text-xs">( est. ETH )</span>
                      </span>
                    }
                  />
                  <RowLabel
                    label="Spent"
                    value={
                      <span className="text-slate-700">
                        {peso(ph.spent)} <span className="text-slate-400 text-xs">( est. ETH )</span>
                      </span>
                    }
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Progress</span>
                    <span className="font-medium text-slate-900">{ph.progress}%</span>
                  </div>
                </div>

                <div className="mt-3">
                  <Progress value={ph.progress} tone={tone as any} />
                </div>

                {/* dates hint line */}
                <div className="mt-2 text-xs text-slate-500">
                  {ph.name === "Planning" && "Jun 1, 2023 — Jun 15, 2023"}
                  {ph.name === "Procurement" && "Jun 16, 2023 — Jul 15, 2023"}
                  {ph.name === "Construction" && "Jul 16, 2023 — Aug 15, 2023"}
                  {ph.name === "Completion" && "Aug 16, 2023 — Aug 30, 2023"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase detail section preview (matches screenshot footer label) */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-2 text-sm font-semibold text-slate-700">Procurement Phase</div>
        <div className="text-sm text-slate-600">
          Latest update: Vendor selection ongoing. Noted over-spend due to price adjustments and expedited shipping.
        </div>
      </div>
    </div>
  );
};

export default MilestoneDetail;
