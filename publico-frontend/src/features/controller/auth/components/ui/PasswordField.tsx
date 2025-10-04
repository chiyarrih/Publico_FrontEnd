import React, { useState } from "react";
import FormField from "./FormField";

type Props = {
  name: string;
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  error?: string;
};

const PasswordField: React.FC<Props> = (p) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <FormField
        type={show ? "text" : "password"}
        {...p}
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        className="absolute right-2 top-6 text-[11px] text-slate-500"
        tabIndex={-1}
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
};

export default PasswordField;
