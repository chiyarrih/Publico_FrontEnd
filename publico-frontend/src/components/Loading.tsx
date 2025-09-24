import React from "react";

const Loading: React.FC<{ label?: string }> = ({ label = "Loading..." }) => (
  <div className="w-full flex items-center justify-center py-16">
    <div className="animate-pulse text-slate-500 text-sm">{label}</div>
  </div>
);
export default Loading;
