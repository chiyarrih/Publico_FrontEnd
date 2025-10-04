import React from "react";
import { Card, LineMini, PieMini, Button, Select } from "../ui/blocks";
import { useAdminDashboard } from "../../../controller/admin/components/hooks/useAdminDashboard";

export default function Analytics(){
  const {loading,data}=useAdminDashboard(); if(loading) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Analytics & Reports</h1>
        <Button>Export Report</Button>
      </div>

      <div className="flex items-center gap-2">
        <Select defaultValue="All"><option>All Departments</option></Select>
        <Select defaultValue="Current"><option>Current Year</option><option>Last Year</option></Select>
        <Button className="ml-auto">More Filters</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card><div className="mb-2 text-sm font-medium">Budget Performance Analysis</div><LineMini data={data.utilizationSeries}/></Card>
        <Card><div className="mb-2 text-sm font-medium">Budget Allocation by Department</div><PieMini data={data.categories}/></Card>
      </div>
    </div>
  );
}
