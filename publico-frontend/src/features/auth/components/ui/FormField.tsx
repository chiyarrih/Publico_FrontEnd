import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

const FormField: React.FC<Props> = ({ label, error, className, ...rest }) => (
  <label className="block">
    <span className="block text-[12px] text-slate-700 mb-1">{label}</span>
    <input
      {...rest}
      className={[
        "w-full h-8 rounded border px-2 text-[13px] outline-none focus:ring-2 focus:ring-[#2563eb]/40 disabled:bg-gray-100",
        error ? "border-red-300" : "border-slate-300",
        className || ""
      ].join(" ")}
    />
    {error && <span className="text-[11px] text-red-600">{error}</span>}
  </label>
);

export default FormField;
