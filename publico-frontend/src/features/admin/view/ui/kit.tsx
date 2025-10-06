import React from "react";
import { Link } from "react-router-dom";

export const Panel = ({ className="", children }:{className?:string; children:React.ReactNode }) =>
  <div className={`rounded-xl border border-slate-200 bg-white ${className}`}>{children}</div>;

export const Block = ({ title, children }:{title:string; children:React.ReactNode }) =>
  <Panel className="mb-4">
    <div className="px-4 py-3 border-b text-sm font-semibold">{title}</div>
    <div className="p-4">{children}</div>
  </Panel>;

export const Pill = ({ tone="gray", children }:{tone?:"gray"|"blue"|"green"|"yellow"|"red"; children:React.ReactNode}) => {
  const toneMap: Record<string,string> = {
    gray:"bg-slate-100 text-slate-700",
    blue:"bg-blue-100 text-blue-700",
    green:"bg-emerald-100 text-emerald-700",
    yellow:"bg-amber-100 text-amber-800",
    red:"bg-rose-100 text-rose-700",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ${toneMap[tone]}`}>{children}</span>;
};

export const InfoItem = ({ label, value, hint }:{label:string; value:string; hint?:string}) =>
  <div className="flex-1">
    <div className="text-[12px] text-slate-500">{label}</div>
    <div className="text-[15px] font-semibold">{value}</div>
    {hint && <div className="text-xs text-slate-400">{hint}</div>}
  </div>;

export const ProgressBar = ({ value }:{value:number}) =>
  <div className="h-2 w-full rounded-full bg-slate-200">
    <div className="h-2 rounded-full bg-emerald-500" style={{ width:`${value}%` }} />
  </div>;

export const IconButton = ({ title, onClick, children }:{title:string; onClick?:()=>void; children:React.ReactNode}) =>
  <button title={title} onClick={onClick} className="rounded p-1.5 hover:bg-slate-100 text-slate-600">{children}</button>;

export const ViewLink = ({ to, children="View" }:{to:string; children?:React.ReactNode}) =>
  <Link to={to} className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-[13px] hover:bg-slate-50">{children}</Link>;
