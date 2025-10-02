import React, { useEffect, useState } from "react";
import { api } from "../../../controller/admin/services/admin.api";
import { Button, Select, Ghost } from "../ui/blocks";
import type { AlertRow } from "../../../model/admin/types/admin";

const getAlertIcon = (title: string, severity: AlertRow["severity"]) => {
  if (title.includes("Completed")) {
    return (
      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }
  if (title.includes("Delay")) {
    return (
      <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
        <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    );
  }
  // Default warning icon for high severity alerts
  return (
    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    </div>
  );
};

const getAlertBorderColor = (title: string, severity: AlertRow["severity"]) => {
  if (title.includes("Completed")) return "border-l-green-500";
  if (title.includes("Delay")) return "border-l-yellow-500";
  return "border-l-red-500";
};

export default function SmartAlerts(){
  const [alerts,setAlerts]=useState<AlertRow[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("All Alert Types");

  useEffect(()=>{ api.getAlerts().then(setAlerts);},[]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Smart Contract Alerts</h1>
        <div className="flex items-center gap-3">
          <Select value={selectedFilter} onChange={e=>setSelectedFilter(e.target.value)}>
            <option>All Alert Types</option>
            <option>Budget Alerts</option>
            <option>Project Alerts</option>
            <option>System Alerts</option>
          </Select>
          <Button>Mark All as Read</Button>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="space-y-4">
        {alerts.map(alert => (
          <div 
            key={alert.id} 
            className={`bg-white rounded-lg border-l-4 ${getAlertBorderColor(alert.title, alert.severity)} shadow-sm p-6`}
          >
            <div className="flex items-start gap-4">
              {getAlertIcon(alert.title, alert.severity)}
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{alert.date}</span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{alert.description}</p>
                
                <div className="flex items-center gap-3">
                  <Button className="text-sm">View Details</Button>
                  <Ghost className="text-sm">Mark as Resolved</Ghost>
                  <Ghost className="text-sm">Forward to Department</Ghost>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
