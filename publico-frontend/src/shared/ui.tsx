import React from "react";

/* =============== BASIC CARDS & TITLES =============== */
export const Card: React.FC<
  React.PropsWithChildren<{ className?: string; title?: React.ReactNode; right?: React.ReactNode }>
> = ({ className = "", title, right, children }) => (
  <div className={`card ${className}`}>
    {(title || right) && (
      <div className="flex items-center justify-between border-b px-5 py-3">
        <div className="section-title">{title}</div>
        {right}
      </div>
    )}
    <div className={title || right ? "p-5" : ""}>{children}</div>
  </div>
);

/* =============== BUTTONS =============== */
export const PrimaryBtn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className = "",
  ...rest
}) => (
  <button
    {...rest}
    className={`inline-flex items-center gap-2 rounded bg-[#2563eb] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d4fd8] ${className}`}
  />
);

export const OutlineBtn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className = "",
  ...rest
}) => (
  <button
    {...rest}
    className={`inline-flex items-center gap-2 rounded border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 ${className}`}
  />
);

/* =============== LABELLED FIELDS =============== */
export const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="block">
    <div className="mb-1 text-[12px] text-slate-600">{label}</div>
    {children}
  </label>
);

export const Input = (p: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...p}
    className={`w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 ${p.className || ""}`}
  />
);

export const Select = (p: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...p}
    className={`w-full rounded border border-slate-300 bg-white px-2 py-2 text-sm ${p.className || ""}`}
  />
);

export const Textarea = (p: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...p}
    className={`w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 ${p.className || ""}`}
  />
);

/* =============== STATUS / PILL =============== */
type PillKind = "green" | "yellow" | "red" | "blue" | "gray";
export const Pill: React.FC<{ kind: PillKind; children: React.ReactNode }> = ({ kind, children }) => {
  const map: Record<PillKind, string> = {
    green: "pill pill-green",
    yellow: "pill pill-yellow",
    red: "pill pill-red",
    blue: "pill pill-blue",
    gray: "pill pill-gray",
  };
  return <span className={map[kind]}>{children}</span>;
};

/* Handy mappers reused across pages */
export const statusToPill = (v: string) =>
  v === "Verified" || v === "Near Completion" ? <Pill kind="green">{v}</Pill> :
  v === "Pending" || v === "Under review"      ? <Pill kind="yellow">{v}</Pill> :
  v === "In Progress"                           ? <Pill kind="blue">{v}</Pill> :
  v === "Just Started"                           ? <Pill kind="gray">{v}</Pill> :
                                                   <Pill kind="red">{v}</Pill>;

/* =============== PROGRESS BAR =============== */
export const Progress: React.FC<{ pct: number; color?: string }> = ({ pct, color = "#3b82f6" }) => (
  <div className="progress">
    <div className="progress-bar" style={{ width: `${pct}%`, backgroundColor: color }} />
  </div>
);
