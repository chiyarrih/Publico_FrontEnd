import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

const FormField: React.FC<Props> = ({ label, error, className, ...rest }) => (
  <label className="block">
    <span className="block text-sm font-medium text-gray-700 mb-2">{label}</span>
    <input
      {...rest}
      className={[
        "input-field",
        error ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "",
        className || ""
      ].join(" ")}
    />
    {error && (
      <span className="flex items-center gap-1.5 mt-1.5 text-xs text-red-600">
        <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {error}
      </span>
    )}
  </label>
);

export default FormField;
