import React from "react";

export const PrimaryBtn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ 
  children, 
  className = "", 
  ...rest 
}) => (
  <button
    {...rest}
    className={
      "inline-flex items-center gap-2 rounded bg-[#2563eb] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d4fd8] " +
      className
    }
  >
    {children}
  </button>
);

export const OutlineBtn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ 
  children, 
  className = "", 
  ...rest 
}) => (
  <button
    {...rest}
    className={
      "inline-flex items-center gap-2 rounded border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 " +
      className
    }
  >
    {children}
  </button>
);
