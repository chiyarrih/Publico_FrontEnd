import React from "react";

/* =============== BASIC CARDS & TITLES =============== */
export const Card: React.FC<
  React.PropsWithChildren<{ className?: string; title?: React.ReactNode; right?: React.ReactNode }>
> = ({ className = "", title, right, children }) => (
  <div className={`card ${className}`}>
    {(title || right) && (
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gradient-to-r from-gray-50 to-white">
        <div className="section-title">{title}</div>
        {right}
      </div>
    )}
    <div className={title || right ? "p-6" : "p-6"}>{children}</div>
  </div>
);

/* =============== BUTTONS =============== */
export const PrimaryBtn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className = "",
  ...rest
}) => (
  <button
    {...rest}
    className={`btn-primary ${className}`}
  />
);

export const OutlineBtn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className = "",
  ...rest
}) => (
  <button
    {...rest}
    className={`btn-secondary ${className}`}
  />
);

/* =============== LABELLED FIELDS =============== */
export const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="block">
    <div className="mb-2 text-sm font-medium text-gray-700">{label}</div>
    {children}
  </label>
);

export const Input = (p: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...p}
    className={`input-field ${p.className || ""}`}
  />
);

export const Select = (p: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...p}
    className={`select-field ${p.className || ""}`}
  />
);

export const Textarea = (p: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...p}
    className={`textarea-field ${p.className || ""}`}
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
    <div className="progress-bar bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
  </div>
);
