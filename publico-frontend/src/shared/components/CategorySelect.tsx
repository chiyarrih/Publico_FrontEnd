import React from "react";
import { CATEGORY_NAMES } from "@/shared/constants/departments";

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  includeAllOption?: boolean;
  allOptionLabel?: string;
}

/**
 * Reusable Category Select Component
 * Uses the centralized department categories
 */
export const CategorySelect: React.FC<CategorySelectProps> = ({
  value,
  onChange,
  className = "",
  placeholder = "Select Category",
  required = false,
  disabled = false,
  name,
  includeAllOption = false,
  allOptionLabel = "All Categories",
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
      required={required}
      disabled={disabled}
      name={name}
    >
      <option value="">{placeholder}</option>
      {includeAllOption && <option value="All">{allOptionLabel}</option>}
      
      {CATEGORY_NAMES.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
};

export default CategorySelect;
