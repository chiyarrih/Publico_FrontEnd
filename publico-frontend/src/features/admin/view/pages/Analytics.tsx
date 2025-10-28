import React from "react";
import { Card, LineMini, PieMini, Button, Select } from "../ui/blocks";
import { useAdminDashboard } from "../../controller/hooks/useAdminDashboard";

export default function Analytics(){
  const {loading,data}=useAdminDashboard(); 
  
  const handleExport = () => {
    const exportData = [
      { Category: 'Total Budget', Value: data.totalBudget },
      { Category: 'Budget Utilization', Value: `${data.utilization}%` },
      { Category: 'Pending Requests', Value: data.pendingRequests },
      { Category: 'Active Alerts', Value: data.activeAlerts },
    ];

    const csvHeaders = ['Category', 'Value'];
    const csvRows = exportData.map(item => [item.Category, item.Value]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if(loading) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Analytics & Reports</h1>
        <Button onClick={handleExport}>Export Report</Button>
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
