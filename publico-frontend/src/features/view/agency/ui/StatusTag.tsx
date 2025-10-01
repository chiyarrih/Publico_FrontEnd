import React from "react";

export type PillColor = "blue" | "green" | "yellow" | "red" | "gray";

const styles: Record<PillColor, string> = {
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  yellow: "bg-yellow-50 text-yellow-700 ring-yellow-200",
  red: "bg-rose-50 text-rose-700 ring-rose-200",
  gray: "bg-slate-50 text-slate-700 ring-slate-200",
};

export const Pill: React.FC<React.PropsWithChildren<{ color?: PillColor }>> = ({
  color = "gray",
  children,
}) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ${styles[color]}`}>
    {children}
  </span>
);
