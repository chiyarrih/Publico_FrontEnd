import React from "react";
export default function Loading({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="grid place-items-center py-10">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-transparent" />
      <p className="mt-3 text-sm text-slate-500">{label}</p>
    </div>
  );
}
