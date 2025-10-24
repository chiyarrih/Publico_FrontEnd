import React from "react";
import { DEPARTMENT_CATEGORIES } from "@/shared/constants/departments";

interface DepartmentSelectProps {
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
 * Reusable Department Select Component with grouped options
 * Uses the centralized department constants
 */
export const DepartmentSelect: React.FC<DepartmentSelectProps> = ({
  value,
  onChange,
  className = "",
  placeholder = "Select Department/Office",
  required = false,
  disabled = false,
  name,
  includeAllOption = false,
  allOptionLabel = "All Departments",
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
      
      {DEPARTMENT_CATEGORIES.map((category) => (
        <optgroup key={category.value} label={category.label}>
          {category.departments.map((dept) => (
            <option key={dept.value} value={dept.value}>
              {dept.label}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
};

interface SimpleDepartmentSelectProps extends Omit<DepartmentSelectProps, 'includeAllOption' | 'allOptionLabel'> {
  includeAll?: boolean;
  allLabel?: string;
}

/**
 * Simple Department Select without optgroups (flat list)
 * Better for filters where grouping is not needed
 */
export const SimpleDepartmentSelect: React.FC<SimpleDepartmentSelectProps> = ({
  value,
  onChange,
  className = "",
  includeAll = true,
  allLabel = "All Departments",
  ...props
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
      {...props}
    >
      {includeAll && <option value="All">{allLabel}</option>}
      
      {DEPARTMENT_CATEGORIES.map((category) =>
        category.departments.map((dept) => (
          <option key={dept.value} value={dept.value}>
            {dept.label}
          </option>
        ))
      )}
    </select>
  );
};

export default DepartmentSelect;
