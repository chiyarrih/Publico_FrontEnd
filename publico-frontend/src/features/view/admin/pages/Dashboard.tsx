import React, { useEffect, useState } from "react";
import { Card, LineMini, PieMini, BarMini } from "../ui/blocks";

// Mock data matching the original dashboard design
const mockDashboardData = {
  totals: {
    budget: 120.5, // in millions
    utilizationPct: 78,
    utilizationChange: "+2.5% from last month",
    pending: 14,
    urgentPending: 3,
    activeAlerts: 5,
    criticalAlerts: 2
  },
  utilizationTrends: [
    { label: "Jan", allocated: 400, used: 320 },
    { label: "Feb", allocated: 420, used: 350 },
    { label: "Mar", allocated: 450, used: 380 },
    { label: "Apr", allocated: 480, used: 420 },
    { label: "May", allocated: 500, used: 450 },
    { label: "Jun", allocated: 520, used: 480 },
    { label: "Jul", allocated: 540, used: 520 },
    { label: "Aug", allocated: 560, used: 540 },
    { label: "Sep", allocated: 580, used: 560 }
  ],
  budgetAllocation: [
    { name: "Infrastructure", value: 35, color: "#0ea5e9" },
    { name: "Health", value: 25, color: "#10b981" },
    { name: "Education", value: 20, color: "#f59e0b" },
    { name: "Agriculture", value: 10, color: "#f97316" },
    { name: "Others", value: 10, color: "#8b5cf6" }
  ],
  departmentComparison: [
    { dept: "Public Works", allocated: 4000, used: 3000 },
    { dept: "Health", allocated: 3000, used: 2800 },
    { dept: "Education", allocated: 2800, used: 2400 },
    { dept: "Agriculture", allocated: 2000, used: 1500 },
    { dept: "Tourism", allocated: 1500, used: 1000 }
  ],
  activeProjects: [
    { barangay: "Bonuan Gueset", projects: 5, lat: 16.0544, lng: 120.3440 },
    { barangay: "Sabangan", projects: 3, lat: 16.0400, lng: 120.3300 },
    { barangay: "Salapingao", projects: 4, lat: 16.0600, lng: 120.3500 },
    { barangay: "Lomboy", projects: 2, lat: 16.0500, lng: 120.3600 }
  ]
};

export default function AdminDashboard() {
  const [data] = useState(mockDashboardData);
  const [selectedProject, setSelectedProject] = useState(data.activeProjects[0]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dagupan City Admin Panel</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Generate Report
        </button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Budget */}
        <Card className="bg-white">
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Budget for FY 2023</p>
                <p className="text-2xl font-bold text-gray-900">₱{data.totals.budget}M</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Budget Utilization */}
        <Card className="bg-white">
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Budget Utilization</p>
                <p className="text-2xl font-bold text-gray-900">{data.totals.utilizationPct}%</p>
                <p className="text-sm text-green-600">{data.totals.utilizationChange}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Pending Requests */}
        <Card className="bg-white">
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 mr-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">{data.totals.pending}</p>
                <p className="text-sm text-yellow-600">{data.totals.urgentPending} urgent</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Active Alerts */}
        <Card className="bg-white">
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{data.totals.activeAlerts}</p>
                <p className="text-sm text-red-600">{data.totals.criticalAlerts} critical</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Budget Utilization Trends */}
        <Card className="bg-white">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Utilization Trends</h3>
            <LineMini data={data.utilizationTrends} />
          </div>
        </Card>

        {/* Budget Allocation by Category */}
        <Card className="bg-white">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Allocation by Category</h3>
            <div className="flex items-center justify-center">
              <PieMini data={data.budgetAllocation} />
            </div>
            <div className="mt-4 space-y-2">
              {data.budgetAllocation.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded mr-2" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Budget Comparison */}
        <Card className="bg-white">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Budget Comparison</h3>
            <BarMini data={data.departmentComparison} />
            <div className="mt-4 flex items-center gap-6 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2" />
                <span>Allocated</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2" />
                <span>Utilized</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Active Projects by Barangay */}
        <Card className="bg-white">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Projects by Barangay</h3>
            
            {/* Mock Map Area */}
            <div className="relative bg-blue-100 rounded-lg h-64 mb-4 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-300">
                {/* Mock map markers */}
                {data.activeProjects.map((project, index) => (
                  <div 
                    key={index}
                    className="absolute w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:bg-blue-700 transition-colors"
                    style={{ 
                      left: `${20 + index * 15}%`, 
                      top: `${30 + index * 10}%` 
                    }}
                    onClick={() => setSelectedProject(project)}
                  >
                    {project.projects}
                  </div>
                ))}
                
                {/* Mock coastline and roads */}
                <svg className="absolute inset-0 w-full h-full opacity-30">
                  <path d="M0,200 Q100,180 200,190 T400,200" stroke="#1e40af" strokeWidth="2" fill="none" />
                  <path d="M50,50 L350,80 L300,150" stroke="#374151" strokeWidth="1" fill="none" />
                </svg>
              </div>
              
              {/* Map controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-1">
                <button className="w-8 h-8 bg-white rounded shadow flex items-center justify-center text-gray-600 hover:bg-gray-50">+</button>
                <button className="w-8 h-8 bg-white rounded shadow flex items-center justify-center text-gray-600 hover:bg-gray-50">−</button>
              </div>
            </div>

            {/* Selected Project Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900">{selectedProject.barangay}</h4>
              <p className="text-sm text-gray-600">Active Projects: {selectedProject.projects}</p>
              <button className="mt-2 text-sm text-blue-600 hover:text-blue-700">View Details</button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
