import React, { useState } from "react";
import { Card, Button, Select, Ghost, LineMini, PieMini, BarMini } from "../ui/blocks";

// Mock data for analytics
const mockAnalyticsData = {
  kpis: {
    totalBudget: { value: 116.5, change: 8.6, changeType: "increase" },
    budgetUtilization: { value: 78, change: 3.3, changeType: "increase" },
    totalProjects: { value: 73, change: 2.7, changeType: "increase" },
    completionRate: { value: 82.5, change: 3.2, changeType: "increase" }
  },
  performanceData: [
    { label: "Jan", budget: 95, actual: 88 },
    { label: "Feb", budget: 98, actual: 92 },
    { label: "Mar", budget: 102, actual: 96 },
    { label: "Apr", budget: 105, actual: 98 },
    { label: "May", budget: 108, actual: 102 },
    { label: "Jun", budget: 110, actual: 105 },
    { label: "Jul", budget: 112, actual: 108 },
    { label: "Aug", budget: 115, actual: 110 },
    { label: "Sep", budget: 118, actual: 112 },
    { label: "Oct", budget: 120, actual: 115 },
    { label: "Nov", budget: 122, actual: 118 },
    { label: "Dec", budget: 125, actual: 120 }
  ],
  allocationData: [
    { name: "Public Works", value: 35.4, color: "#0ea5e9" },
    { name: "Health", value: 22.8, color: "#10b981" },
    { name: "Education", value: 18.6, color: "#f59e0b" },
    { name: "Agriculture", value: 12.4, color: "#f97316" },
    { name: "Tourism", value: 10.8, color: "#8b5cf6" }
  ],
  projectStatusData: [
    { dept: "Public Works", completed: 8, ongoing: 6, delayed: 2 },
    { dept: "Health", completed: 15, ongoing: 4, delayed: 1 },
    { dept: "Education", completed: 12, ongoing: 8, delayed: 0 },
    { dept: "Agriculture", completed: 6, ongoing: 3, delayed: 1 },
    { dept: "Tourism", completed: 7, ongoing: 6, delayed: 0 }
  ],
  budgetTrends: [
    { label: "2019", totalBudget: 95, budgetUtilization: 88 },
    { label: "2020", totalBudget: 102, budgetUtilization: 94 },
    { label: "2021", totalBudget: 108, budgetUtilization: 98 },
    { label: "2022", totalBudget: 112, budgetUtilization: 105 },
    { label: "2023", totalBudget: 120, budgetUtilization: 115 }
  ],
  summaryStats: {
    totalBudget: 106.5,
    totalActual: 104.2,
    averageVariance: -2.2,
    totalCompleted: 48,
    totalOngoing: 27,
    totalDelayed: 9,
    averageAnnualBudget: 105.2,
    averageUtilizationRate: 95.7
  }
};

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("Monthly");
  const [selectedChart, setSelectedChart] = useState("Line Chart");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedYear, setSelectedYear] = useState("Current Year");

  const data = mockAnalyticsData;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
        <div className="flex items-center gap-3">
          <Ghost className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </Ghost>
          <Button className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Report
          </Button>
        </div>
      </div>

      {/* Dashboard Title and Filters */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Budget Analytics Dashboard</h2>
        <div className="flex items-center gap-3">
          <Select value={selectedDept} onChange={e=>setSelectedDept(e.target.value)}>
            <option>All Departments</option>
            <option>Public Works</option>
            <option>Health</option>
            <option>Education</option>
            <option>Agriculture</option>
            <option>Tourism</option>
          </Select>
          <Select value={selectedYear} onChange={e=>setSelectedYear(e.target.value)}>
            <option>Current Year</option>
            <option>2022</option>
            <option>2021</option>
            <option>2020</option>
          </Select>
          <Ghost className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8a1 1 0 011-1h3z" />
            </svg>
            Custom Date
          </Ghost>
          <Ghost className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
            More Filters
          </Ghost>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <div className="p-4">
            <div className="text-sm text-gray-600 mb-1">Total Budget</div>
            <div className="text-2xl font-bold text-gray-900 mb-1">₱{data.kpis.totalBudget.value}M</div>
            <div className="flex items-center text-sm">
              <svg className="h-4 w-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
              <span className="text-green-600">{data.kpis.totalBudget.change}%</span>
              <span className="text-gray-500 ml-1">from previous year</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="text-sm text-gray-600 mb-1">Budget Utilization</div>
            <div className="text-2xl font-bold text-gray-900 mb-1">₱93.6M ({data.kpis.budgetUtilization.value}%)</div>
            <div className="flex items-center text-sm">
              <svg className="h-4 w-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
              <span className="text-green-600">{data.kpis.budgetUtilization.change}%</span>
              <span className="text-gray-500 ml-1">from previous year</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="text-sm text-gray-600 mb-1">Total Projects</div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{data.kpis.totalProjects.value}</div>
            <div className="flex items-center text-sm">
              <svg className="h-4 w-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
              <span className="text-green-600">{data.kpis.totalProjects.change}%</span>
              <span className="text-gray-500 ml-1">from previous year</span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <div className="text-sm text-gray-600 mb-1">Completion Rate</div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{data.kpis.completionRate.value}%</div>
            <div className="flex items-center text-sm">
              <svg className="h-4 w-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
              <span className="text-green-600">{data.kpis.completionRate.change}%</span>
              <span className="text-gray-500 ml-1">from previous year</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Budget Performance Analysis */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Budget Performance Analysis</h3>
              <div className="flex items-center gap-2">
                <button 
                  className={`px-3 py-1 text-sm rounded ${selectedPeriod === 'Monthly' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setSelectedPeriod('Monthly')}
                >
                  Monthly
                </button>
                <button 
                  className={`px-3 py-1 text-sm rounded ${selectedPeriod === 'Quarterly' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setSelectedPeriod('Quarterly')}
                >
                  Quarterly
                </button>
                <Select value={selectedChart} onChange={e=>setSelectedChart(e.target.value)} className="text-sm">
                  <option>Line Chart</option>
                  <option>Bar Chart</option>
                  <option>Area Chart</option>
                </Select>
              </div>
            </div>
            <LineMini data={data.performanceData.map(d => ({ label: d.label, allocated: d.budget, used: d.actual }))} />
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-600">Total Budget</div>
                <div className="text-lg font-semibold text-gray-900">₱{data.summaryStats.totalBudget}M</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Actual</div>
                <div className="text-lg font-semibold text-green-600">₱{data.summaryStats.totalActual}M</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Average Variance</div>
                <div className="text-lg font-semibold text-red-600">{data.summaryStats.averageVariance}%</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Budget Allocation by Department */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Allocation by Department</h3>
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <PieMini data={data.allocationData} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Public Works</div>
                    <div className="text-lg font-bold">₱42.5M</div>
                    <div className="text-xs text-gray-500">35.4% of total</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {data.allocationData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded mr-2" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <div className="text-sm text-gray-600">Total Budget</div>
              <div className="text-xl font-bold text-gray-900">₱120.0M</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Project Status by Department */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Status by Department</h3>
            <BarMini data={data.projectStatusData.map(d => ({ dept: d.dept, allocated: d.completed, used: d.ongoing }))} />
            <div className="mt-4 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2" />
                <span>Completed</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2" />
                <span>Ongoing</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded mr-2" />
                <span>Delayed</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-600">Total Completed</div>
                <div className="text-lg font-semibold text-green-600">{data.summaryStats.totalCompleted}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Ongoing</div>
                <div className="text-lg font-semibold text-blue-600">{data.summaryStats.totalOngoing}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Delayed</div>
                <div className="text-lg font-semibold text-red-600">{data.summaryStats.totalDelayed}</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Budget Trends (5-Year) */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Trends (5-Year)</h3>
            <LineMini data={data.budgetTrends.map(d => ({ label: d.label, allocated: d.totalBudget, used: d.budgetUtilization }))} />
            <div className="mt-4 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2" />
                <span>Total Budget</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2" />
                <span>Budget Utilization</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-600">Average Annual Budget</div>
                <div className="text-lg font-semibold text-blue-600">₱{data.summaryStats.averageAnnualBudget}M</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Average Utilization Rate</div>
                <div className="text-lg font-semibold text-green-600">{data.summaryStats.averageUtilizationRate}%</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Downloadable Reports */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Downloadable Reports</h3>
          <div className="space-y-3">
            {[
              "Monthly Budget Utilization.pdf",
              "Quarterly Performance Report.pdf", 
              "Annual Financial Statement.pdf",
              "Project Completion Analysis.xlsx",
              "Audit Compliance Report.pdf",
              "Department Expenditure Summary.xlsx",
              "Project Timeline Analysis.pdf"
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-gray-900">{report}</span>
                <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
