// src/features/citizen/view/PAGES/Alerts.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Card, Select, statusToPill } from "../../../../shared/ui";
import { getDashboardAlerts } from "../../controller/data/dashboardService";

/* ---------- Types ---------- */
type Severity = "Low" | "Medium" | "High" | "Critical";
type Status   = "Unresolved" | "Pending" | "Under review" | "Resolved";
type AlertType = "Budget" | "Disbursement" | "Document" | "Anomaly" | "Delay" | "Price" | "Amendment";

type Alert = {
  id: string;
  type: AlertType;
  severity: Severity;
  status: Status;
  title: string;
  desc: string;
  date: string;     // ISO or displayable
  dept: string;     // Department / source
  category: string; // Category / tag
};

/* ---------- Normalizers (accept many backend shapes) ---------- */
const asText = (v: any, fallback = "") => (typeof v === "string" ? v : fallback);
const firstText = (obj: any, keys: string[], fallback = "") =>
  keys.map((k) => asText(obj?.[k])).find(Boolean) ?? fallback;

function toSeverity(v: any): Severity {
  const s = asText(v, "").toLowerCase();
  if (typeof v === "number") {
    if (v >= 90) return "Critical";
    if (v >= 70) return "High";
    if (v >= 40) return "Medium";
    return "Low";
  }
  if (s.includes("crit")) return "Critical";
  if (s.includes("high")) return "High";
  if (s.includes("med")) return "Medium";
  return "Low";
}

function toStatus(v: any): Status {
  const s = asText(v, "").toLowerCase();
  if (s.includes("resolve")) return "Resolved";
  if (s.includes("under")) return "Under review";
  if (s.includes("pend"))  return "Pending";
  return "Unresolved";
}

function toType(v: any): AlertType {
  const s = asText(v, "").toLowerCase();
  if (s.includes("doc")) return "Document";
  if (s.includes("disbur")) return "Disbursement";
  if (s.includes("delay")) return "Delay";
  if (s.includes("price")) return "Price";
  if (s.includes("amend")) return "Amendment";
  if (s.includes("budget") || s.includes("overrun")) return "Budget";
  if (s.includes("anom") || s.includes("risk")) return "Anomaly";
  return "Anomaly";
}

function mapRawAlert(a: any, idx: number): Alert {
  return {
    id: asText(a?.id) || asText(a?._id) || `al-${idx}`,
    type: toType(a?.type ?? a?.category ?? a?.kind),
    severity: toSeverity(a?.severity ?? a?.level ?? a?.priority),
    status: toStatus(a?.status ?? a?.state),
    title: firstText(a, ["title", "name", "heading"], "Alert"),
    desc: firstText(a, ["description", "desc", "message", "detail"], ""),
    date: firstText(a, ["date", "createdAt", "time"], new Date().toISOString().slice(0,10)),
    dept: firstText(a, ["department", "dept", "source"], "—"),
    category: firstText(a, ["category", "group", "tag"], "General"),
  };
}

/* ---------- Small glyph ---------- */
const Glyph: React.FC<{ t: AlertType }> = ({ t }) => {
  const base = "h-4 w-4";
  if (t === "Document") {
    return (
      <svg viewBox="0 0 24 24" className={`${base} text-sky-500`} fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 3h7l4 4v14H8z" /><path d="M15 3v4h4" />
      </svg>
    );
  }
  if (t === "Delay") {
    return (
      <svg viewBox="0 0 24 24" className={`${base} text-amber-500`} fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2" />
      </svg>
    );
  }
  if (t === "Budget" || t === "Price") {
    return (
      <svg viewBox="0 0 24 24" className={`${base} text-rose-500`} fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3v18M8 7a4 4 0 0 1 4-2 4 4 0 1 1 0 8 4 4 0 0 0-4 4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={`${base} text-amber-500`} fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 4l9 16H3z" /><path d="M12 10v4M12 18h.01" />
    </svg>
  );
};

/* ---------- Collapsible row ---------- */
const Row: React.FC<{
  a: Alert;
  open: string | null;
  setOpen: (id: string | null) => void;
}> = ({ a, open, setOpen }) => {
  const accent =
    a.type === "Document" ? "bg-sky-400" :
    a.type === "Budget" || a.type === "Price" ? "bg-rose-400" :
    "bg-amber-400";

  return (
    <div className="rounded-md border border-slate-200 bg-white">
      <div className="flex items-start justify-between">
        <div className="flex flex-1 items-start gap-3 p-3">
          <span className={`mt-0.5 inline-block h-4 w-1 rounded ${accent}`} />
          <div className="mt-0.5"><Glyph t={a.type} /></div>
          <div className="min-w-0 space-y-1">
            <div className="text-sm font-medium text-slate-900">{a.title}</div>
            <div className="text-[12px] text-slate-600">{a.desc}</div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
              <span>{a.date}</span><span>•</span><span>{a.dept}</span><span>•</span><span>{a.category}</span>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 p-3">
          {statusToPill(a.status)}
          <button
            onClick={() => setOpen(open === a.id ? null : a.id)}
            className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
          >
            {open === a.id ? "▴" : "▾"}
          </button>
        </div>
      </div>

      {open === a.id && (
        <div className="mx-3 mb-3 rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div><span className="font-medium">Severity:</span> {a.severity}</div>
            <div><span className="font-medium">Department:</span> {a.dept}</div>
            <div><span className="font-medium">Category:</span> {a.category}</div>
          </div>
          <div className="mt-2"><span className="font-medium">Suggested action:</span> Review supporting documents and approvals.</div>
        </div>
      )}
    </div>
  );
};

export default function Alerts() {
  const [type, setType] = useState<AlertType | "All Types">("All Types");
  const [sev, setSev]   = useState<Severity | "All Severities">("All Severities");
  const [open, setOpen] = useState<string | null>(null);

  const [data, setData] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // fetch from backend
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true); setErr(null);
        const res = await getDashboardAlerts(); // service returns array (any shape)
        const list: Alert[] = Array.isArray(res) ? res.map(mapRawAlert) : [];
        if (!ignore) setData(list);
      } catch (e: any) {
        if (!ignore) setErr(e?.message || "Failed to load alerts");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  const list = useMemo(
    () =>
      data.filter(
        (a) =>
          (type === "All Types" || a.type === type) &&
          (sev === "All Severities" || a.severity === sev)
      ),
    [type, sev, data]
  );

  return (
    <div className="space-y-4">
      <Card className="p-0">
        <div className="px-3 py-3">
          <div className="flex flex-wrap items-end gap-4">
            {/* Alert Type */}
            <div className="w-48">
              <div className="mb-1 text-[12px] font-medium text-slate-600">Alert Type</div>
              <Select value={type} onChange={(e) => setType(e.target.value as any)} className="w-full">
                {["All Types","Budget","Disbursement","Document","Anomaly","Delay","Price","Amendment"]
                  .map((t) => <option key={t}>{t}</option>)}
              </Select>
            </div>

            {/* Severity */}
            <div className="w-48">
              <div className="mb-1 text-[12px] font-medium text-slate-600">Severity</div>
              <Select value={sev} onChange={(e) => setSev(e.target.value as any)} className="w-full">
                {["All Severities","Low","Medium","High","Critical"].map((s) => <option key={s}>{s}</option>)}
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {err && <Card className="p-4 text-sm text-rose-600">{err}</Card>}
      {loading && <Card className="p-4 text-sm text-slate-500">Loading alerts…</Card>}

      {/* List */}
      <div className="space-y-3">
        {list.map((a) => (
          <Row key={a.id} a={a} open={open} setOpen={setOpen} />
        ))}
        {!loading && list.length === 0 && (
          <Card className="p-6 text-center text-sm text-slate-500">
            No alerts found for the selected filters.
          </Card>
        )}
      </div>
    </div>
  );
}
