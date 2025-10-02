import React from "react";
import { Card, Badge } from "../ui/blocks";

export default function Verification() {
  const pendingAgencies = [
    { id: 1, name: "Department of Public Works", status: "pending", submittedDate: "2024-01-15" },
    { id: 2, name: "Health Department", status: "verified", submittedDate: "2024-01-10" },
    { id: 3, name: "Education Office", status: "rejected", submittedDate: "2024-01-12" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Agency Verification</h1>
        <p className="text-gray-600">Review and verify agency registration requests</p>
      </div>

      <Card className="bg-white">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Requests</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-gray-500 border-b">
                <tr>
                  <th className="py-3 pr-4">Agency Name</th>
                  <th className="py-3 pr-4">Submitted Date</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pendingAgencies.map((agency) => (
                  <tr key={agency.id}>
                    <td className="py-3 pr-4 font-medium text-gray-900">{agency.name}</td>
                    <td className="py-3 pr-4 text-gray-600">{agency.submittedDate}</td>
                    <td className="py-3 pr-4">
                      <Badge 
                        tone={
                          agency.status === 'verified' ? 'green' : 
                          agency.status === 'rejected' ? 'red' : 'yellow'
                        }
                      >
                        {agency.status}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4">
                      {agency.status === 'pending' && (
                        <div className="flex gap-2">
                          <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                            Approve
                          </button>
                          <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                            Reject
                          </button>
                        </div>
                      )}
                      {agency.status !== 'pending' && (
                        <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}
