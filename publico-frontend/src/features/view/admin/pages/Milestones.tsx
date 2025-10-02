import React from "react";
import { Card } from "../ui/blocks";

export default function Milestones() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Project Milestones</h1>
        <p className="text-gray-600">Track and manage project milestones across all departments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Projects</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-gray-900">Road Infrastructure Project</h4>
                <p className="text-sm text-gray-600">Bonuan Gueset - 75% Complete</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium text-gray-900">Health Center Renovation</h4>
                <p className="text-sm text-gray-600">Sabangan - 90% Complete</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
              
              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-medium text-gray-900">School Building Construction</h4>
                <p className="text-sm text-gray-600">Salapingao - 45% Complete</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Milestone Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Foundation Complete</p>
                  <p className="text-sm text-gray-600">Road Infrastructure - Completed</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Equipment Installation</p>
                  <p className="text-sm text-gray-600">Health Center - In Progress</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Final Inspection</p>
                  <p className="text-sm text-gray-600">School Building - Pending</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
