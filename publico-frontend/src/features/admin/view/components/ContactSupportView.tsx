import React, { useState, useEffect } from 'react';
import { ContactSupportService, ContactSupportRequestData } from '../../../shared/services/contactSupportService';

interface ContactSupportViewProps {
  className?: string;
}

export default function ContactSupportView({ className = "" }: ContactSupportViewProps) {
  const [requests, setRequests] = useState<ContactSupportRequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ContactSupportRequestData | null>(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await ContactSupportService.getRequests({ limit: 20 });
      setRequests(response.data.requests);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch support requests');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRequest = async () => {
    if (!selectedRequest) return;

    try {
      setIsUpdating(true);
      await ContactSupportService.updateRequestStatus(selectedRequest._id, {
        status: status || undefined,
        adminResponse: adminResponse || undefined,
        priority: priority || undefined
      });
      
      // Refresh the list
      await fetchRequests();
      setSelectedRequest(null);
      setAdminResponse('');
      setStatus('');
      setPriority('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update request');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return 'bg-blue-100 text-blue-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="text-center">Loading support requests...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="text-red-600">Error: {error}</div>
        <button 
          onClick={fetchRequests}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Contact Support Requests</h2>
        <button 
          onClick={fetchRequests}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requests List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Requests ({requests.length})</h3>
          {requests.length === 0 ? (
            <div className="text-gray-500 text-center py-8">No support requests found</div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {requests.map((request) => (
                <div
                  key={request._id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedRequest?._id === request._id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedRequest(request)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-gray-900">{request.name}</div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                        {request.priority}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    <strong>{request.userRole}</strong> • {request.issueType}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {request.message}
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(request.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Request Details */}
        <div className="space-y-4">
          {selectedRequest ? (
            <>
              <h3 className="text-lg font-semibold">Request Details</h3>
              <div className="bg-white border rounded-lg p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <div className="text-sm text-gray-900">{selectedRequest.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="text-sm text-gray-900">{selectedRequest.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User Role</label>
                  <div className="text-sm text-gray-900">{selectedRequest.userRole}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
                  <div className="text-sm text-gray-900">{selectedRequest.issueType}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <div className="text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-3 rounded">
                    {selectedRequest.message}
                  </div>
                </div>
                {selectedRequest.attachment && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Attachment</label>
                    <div className="text-sm text-gray-900">
                      {selectedRequest.attachment.originalName} 
                      ({(selectedRequest.attachment.size / 1024).toFixed(2)} KB)
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Submitted</label>
                  <div className="text-sm text-gray-900">
                    {new Date(selectedRequest.createdAt).toLocaleString()}
                  </div>
                </div>

                {/* Admin Response Section */}
                <div className="border-t pt-4">
                  <h4 className="text-md font-medium text-gray-700 mb-3">Admin Response</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={status || selectedRequest.status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <select
                        value={priority || selectedRequest.priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Response Message</label>
                      <textarea
                        value={adminResponse}
                        onChange={(e) => setAdminResponse(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your response to the user..."
                      />
                    </div>

                    <button
                      onClick={handleUpdateRequest}
                      disabled={isUpdating}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? 'Updating...' : 'Update Request'}
                    </button>
                  </div>

                  {selectedRequest.adminResponse && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                      <label className="block text-sm font-medium text-green-700 mb-1">Previous Response</label>
                      <div className="text-sm text-green-800 whitespace-pre-wrap">
                        {selectedRequest.adminResponse}
                      </div>
                      {selectedRequest.adminRespondedAt && (
                        <div className="text-xs text-green-600 mt-1">
                          Responded: {new Date(selectedRequest.adminRespondedAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-gray-500 text-center py-8">
              Select a request to view details and respond
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
