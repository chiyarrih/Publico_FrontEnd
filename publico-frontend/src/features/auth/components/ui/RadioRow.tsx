import React from "react";

type Option<T extends string> = { label: string; value: T };

type Props<T extends string> = {
  label?: string;
  name: string;
  value: T;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  options: Option<T>[];
};

function RadioRow<T extends string>({ label, name, value, onChange, options }: Props<T>) {
  return (
    <div>
      {label && <span className="block text-[12px] text-slate-700 mb-1">{label}</span>}
      <div className="flex items-center gap-4 text-[12px]">
        {options.map(o => (
          <label key={o.value} className="inline-flex items-center gap-1">
            <input
              className="accent-[#2563eb]"
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={onChange}
            /> {o.label}
          </label>
        ))}
      </div>
    </div>
  );
}

export default RadioRow;
