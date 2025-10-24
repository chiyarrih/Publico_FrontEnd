import React from "react";
import { Input, Select, Button } from "@admin/view/ui/blocks";
import { Search, Filter } from "lucide-react";
import { SimpleDepartmentSelect } from "@/shared/components/DepartmentSelect";

interface BudgetRequestsFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDepartment?: string;
  onDepartmentChange?: (dept: string) => void;
  selectedStatus?: string;
  onStatusChange?: (status: string) => void;
  onMoreFilters?: () => void;
}

export default function BudgetRequestsFilters({
  searchQuery,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  selectedStatus,
  onStatusChange,
  onMoreFilters,
}: BudgetRequestsFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[280px]">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <Input
          placeholder="Search projects, departments, or ID..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-11"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <SimpleDepartmentSelect
          value={selectedDepartment || "All"}
          onChange={(value) => onDepartmentChange?.(value)}
          className="min-w-[160px] px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          includeAll={true}
          allLabel="All Departments"
        />

        <Select
          value={selectedStatus || "All"}
          onChange={(e) => onStatusChange?.(e.target.value)}
          className="min-w-[140px]"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </Select>

        <button
          onClick={onMoreFilters}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm hover:bg-slate-50"
        >
          <Filter size={16} />
          More Filters
        </button>
      </div>
    </div>
  );
}

