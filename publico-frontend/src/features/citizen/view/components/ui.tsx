import React, { PropsWithChildren } from "react";

export const cn = (...cls: Array<string | false | undefined>) =>
  cls.filter(Boolean).join(" ");

type Tone = "default" | "info" | "success" | "warning" | "danger" | "gray";

export const Badge: React.FC<PropsWithChildren<{ tone?: Tone }>> = ({
  tone = "default",
  children,
}) => {
  const tones: Record<Tone, string> = {
    default: "bg-slate-100 text-slate-700 border border-slate-200",
    info: "bg-blue-50 text-blue-700 border border-blue-200",
    success: "bg-green-50 text-green-700 border border-green-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-red-50 text-red-700 border border-red-200",
    gray: "bg-slate-50 text-slate-600 border border-slate-200",
  };
  return (
    <span className={cn("px-2 py-0.5 text-xs rounded-md font-medium", tones[tone])}>
      {children}
    </span>
  );
};

export const SectionCard: React.FC<
  PropsWithChildren<{ title?: React.ReactNode; actions?: React.ReactNode; className?: string }>
> = ({ title, actions, className, children }) => (
  <div className={cn("card", className)}>
    {(title || actions) && (
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h3 className="text-slate-800 font-semibold">{title}</h3>
        {actions}
      </div>
    )}
    <div className="px-6 py-5">{children}</div>
  </div>
);

export const ProgressBar: React.FC<{ value: number; tone?: "info" | "success" | "warning" | "gray" }> = ({
  value,
  tone = "info",
}) => {
  const bar =
    tone === "success" ? "bg-emerald-600" :
    tone === "warning" ? "bg-amber-500" :
    tone === "gray" ? "bg-slate-400" : "bg-blue-600";
  return (
    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
      <div className={cn("h-full rounded-full", bar)} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
};

export const Icon = {
  Dashboard: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
    </svg>
  ),
  List: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  ),
  Ledger: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
      <path d="M4 4h16v16H4z" /><path d="M8 4v16M4 8h16" />
    </svg>
  ),
  Alert: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  ),
  User: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Faq: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
      <path d="M21 15a4 4 0 01-4 4H7l-4 4V7a4 4 0 014-4h10a4 4 0 014 4z" />
    </svg>
  ),
  Mail: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
      <path d="M4 4h16v16H4z" /><path d="M22 6l-10 7L2 6" />
    </svg>
  ),
  Bell: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
      <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  ),
  Search: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...p}>
      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
    </svg>
  ),
  Check: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...p}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
};
