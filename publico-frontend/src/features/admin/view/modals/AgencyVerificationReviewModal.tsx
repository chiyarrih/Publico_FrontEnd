import React, { useState, useEffect } from "react";
import { Card, Button } from "../ui/blocks";
import { useAgencyVerification } from "../../controller/hooks/useAgencyVerification";
import ApproveAgencyModal from "../modals/ApproveAgencyModal";
import RejectAgencyModal from "../modals/RejectAgencyModal";

interface AgencyVerificationReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  agency: any;
}

export default function AgencyVerificationReviewModal({
  isOpen,
  onClose,
  agency,
}: AgencyVerificationReviewModalProps) {
  const { getAgencyDetails, approveAgency, rejectAgency } = useAgencyVerification();
  const [agencyDetails, setAgencyDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  // normalized current status (prefer fresh details, fallback to prop)
  const currentStatus = (((agencyDetails?.status ?? agency?.status) as string) ?? "")
    .toString()
    .trim()
    .toLowerCase();
  const isApproved = currentStatus === "approved";
  const isRejected = currentStatus === "rejected";
  const displayStatus = (agencyDetails?.status ?? agency?.status ?? "Pending") as string;
  
  useEffect(() => {
    if (isOpen && agency) {
      fetchAgencyDetails();
    }
  }, [isOpen, agency]);

  const fetchAgencyDetails = async () => {
    try {
      setLoading(true);
      const details = await getAgencyDetails(agency._id);
      setAgencyDetails(details);
    } catch (error) {
      console.error("Error fetching agency details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await approveAgency(agency._id);
      setIsApproveModalOpen(false);
      onClose();
    } catch (error) {
      console.error("Error approving agency:", error);
    }
  };

  const handleReject = async (reason: string) => {
    try {
      await rejectAgency(agency._id, reason);
      setIsRejectModalOpen(false);
      onClose();
    } catch (error) {
      console.error("Error rejecting agency:", error);
    }
  };

  // new: remove handler
  const handleRemove = async () => {
    const ok = confirm(
      `Are you sure you want to remove "${agency?.agency_name}" (${agency?.agency_id})? This action cannot be undone.`
    );
    if (!ok) return;

    try {
      setLoading(true);
      
      onClose();
      // parent hook refresh should update list; optionally you can show a toast here
    } catch (error) {
      console.error("Error removing agency:", error);
      alert((error as any)?.message || "Failed to remove agency");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    switch (status) {
      case "Pending":
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            Pending
          </span>
        );
      case "Approved":
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            Approved
          </span>
        );
      case "Rejected":
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            Rejected
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
            {status}
          </span>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold text-gray-900">Agency Verification Review</h2>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(agency?.status || "Pending")}
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-80px)]">
          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Agency Details */}
                <Card>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Agency Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Agency ID</label>
                      <p className="text-sm text-gray-900">{agency?.agency_id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Agency Name</label>
                      <p className="text-sm text-gray-900">{agency?.agency_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contact Person</label>
                      <p className="text-sm text-gray-900">{agencyDetails?.contact_person || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone Number</label>
                      <p className="text-sm text-gray-900">{agency?.contact_phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-sm text-gray-900">{agency?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Department/Organization</label>
                      <p className="text-sm text-gray-900">{agency?.department}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Registration Date</label>
                      <p className="text-sm text-gray-900">
                        {new Date(agency?.date_registered).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Submission Date</label>
                      <p className="text-sm text-gray-900">
                        {new Date(agency?.date_registered).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Uploaded Documents */}
                <Card>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Uploaded Documents</h3>
                  <div className="space-y-3">
                    {agencyDetails?.documents?.map((doc: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {doc.type?.includes('image') ? (
                              <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                            <p className="text-xs text-gray-500">{(doc.size / 1024 / 1024).toFixed(1)} MB</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.type?.includes('image') && (
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                              Preview
                            </button>
                          )}
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                    {(!agencyDetails?.documents || agencyDetails.documents.length === 0) && (
                      <p className="text-gray-500 text-center py-4">No documents uploaded</p>
                    )}
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-gray-50 p-6 border-l border-gray-200">
            <div className="space-y-6">
{/* Verification Actions */}
<Card>
  <h3 className="text-lg font-medium text-gray-900 mb-4">Verification Actions</h3>
  <div className="space-y-3">
    {isApproved ? (
      <Button
        onClick={handleRemove}
        className="w-full border-red-300 text-red-700 hover:bg-red-50 flex items-center justify-center gap-2"
        disabled={loading}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22" />
        </svg>
        Remove Agency
      </Button>
    ) : (
      <>
        <Button
          onClick={() => setIsApproveModalOpen(true)}
          className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
          disabled={isApproved}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Approve Agency
        </Button>

        <Button
          onClick={() => setIsRejectModalOpen(true)}
          className="w-full border-red-300 text-red-700 hover:bg-red-50 flex items-center justify-center gap-2"
          disabled={isRejected}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Reject Agency
        </Button>
      </>
    )}
  </div>
</Card>

              {/* Verification Log */}
              <Card>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Verification Log</h3>
                <div className="space-y-3">
                  {agencyDetails?.verification_log?.map((log: any, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{log.action}</p>
                        <p className="text-xs text-gray-500">{new Date(log.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                  {(!agencyDetails?.verification_log || agencyDetails.verification_log.length === 0) && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Agency Registration Submitted</p>
                        <p className="text-xs text-gray-500">{new Date(agency?.date_registered).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Modals */}
        <ApproveAgencyModal
          isOpen={isApproveModalOpen}
          onClose={() => setIsApproveModalOpen(false)}
          onConfirm={handleApprove}
          agencyName={agency?.agency_name}
        />

        <RejectAgencyModal
          isOpen={isRejectModalOpen}
          onClose={() => setIsRejectModalOpen(false)}
          onConfirm={handleReject}
          agencyName={agency?.agency_name}
        />
      </div>
    </div>
  );
}
