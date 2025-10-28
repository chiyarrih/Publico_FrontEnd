import React from "react";
import { X, CheckCircle, XCircle, AlertCircle, FileText, Link2 } from "lucide-react";
import type { BudgetProposal } from "@admin/model/types/admin";
import { Badge } from "../ui/blocks";
import useSendFunds from "@admin/controller/hooks/useSendFunds";

interface ProjectApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: BudgetProposal;
  onReject: () => void;
  onSendFunds?: () => void;
  onApproved?: () => void;
  isFunded?: boolean;
  status?: string;
}

export default function ProjectApprovalModal({
  isOpen,
  onClose,
  proposal,
  onReject,
  onSendFunds,
  onApproved,
  isFunded,
  status
}: ProjectApprovalModalProps) {
  if (!isOpen) return null;
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-100 text-emerald-700";
      case "Pending":
        return "bg-amber-100 text-amber-700";
      case "Rejected":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl mx-4">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            Project Approval Details
          </h2>
          <button
            onClick={onClose}
            className="p-1 transition-colors rounded-lg hover:bg-slate-100"
          >
            <X size={24} className="text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column - Project Details */}
            <div className="space-y-6 lg:col-span-2">
              {/* Project Header */}
              <div className="p-6 border bg-slate-50 rounded-xl border-slate-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="mb-1 text-xl font-semibold text-slate-900">
                      {proposal.projectName}
                    </h3>
                    <p className="text-slate-600">{proposal.department}</p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                      proposal.status
                    )}`}
                  >
                    {proposal.status}
                  </span>
                </div>

                {/* Project Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Project ID</p>
                    <p className="font-semibold text-slate-900">
                      {proposal.projectId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Submitted By</p>
                    <p className="font-semibold text-slate-900">
                      {proposal.agencyId?.name || proposal.agencyId?.email || "Unknown"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Submitted Date</p>
                    <p className="font-semibold text-slate-900">
                      {new Date(proposal.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Requested Amount</p>
                    <p className="text-lg font-bold text-sky-600">
                      ₱{proposal.amountRequested.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Timeline</p>
                    <p className="font-semibold text-slate-900">
                      {proposal.timeline}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Blockchain Record</p>
                    {proposal.blockchainTxHash ? (
                      <div className="flex items-center gap-1 text-sky-600">
                        <Link2 size={14} />
                        <span className="text-sm font-medium">Verified</span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-500">Not yet verified</span>
                    )}
                  </div>
                </div>
              </div>


              {/* Supporting Documents */}
              <div>
                <h4 className="mb-3 text-base font-semibold text-slate-900">
                  Supporting Documents
                </h4>
                <div className="space-y-2">
                  {proposal.fileUrl ? (
                    Array.isArray(proposal.fileUrl) ? (
                      // Multiple files
                      proposal.fileUrl.map((fileUrl, index) => {
                        const fileName = fileUrl.split('/').pop() || `Document ${index + 1}`;
                        const fileExtension = fileName.split('.').pop()?.toLowerCase();
                        
                        const getFileIcon = (ext: string) => {
                          switch (ext) {
                            case 'pdf':
                              return <FileText className="text-red-600" size={20} />;
                            case 'xlsx':
                            case 'xls':
                              return <FileText className="text-green-600" size={20} />;
                            case 'doc':
                            case 'docx':
                              return <FileText className="text-blue-600" size={20} />;
                            case 'jpg':
                            case 'jpeg':
                            case 'png':
                              return <FileText className="text-purple-600" size={20} />;
                            default:
                              return <FileText className="text-slate-600" size={20} />;
                          }
                        };

                        return (
                          <div key={index} className="flex items-center justify-between p-4 transition-colors border rounded-lg bg-slate-50 border-slate-200 hover:border-sky-300">
                            <div className="flex items-center gap-3">
                              {getFileIcon(fileExtension || '')}
                              <div>
                                <p className="font-medium text-slate-900">
                                  {fileName}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {fileExtension?.toUpperCase()} Document
                                </p>
                              </div>
                            </div>
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 text-sm font-medium transition-colors text-sky-600 hover:text-sky-700"
                            >
                              View
                            </a>
                          </div>
                        );
                      })
                    ) : (
                      // Single file
                      (() => {
                        const fileName = proposal.fileUrl.split('/').pop() || 'Document';
                        const fileExtension = fileName.split('.').pop()?.toLowerCase();
                        
                        const getFileIcon = (ext: string) => {
                          switch (ext) {
                            case 'pdf':
                              return <FileText className="text-red-600" size={20} />;
                            case 'xlsx':
                            case 'xls':
                              return <FileText className="text-green-600" size={20} />;
                            case 'doc':
                            case 'docx':
                              return <FileText className="text-blue-600" size={20} />;
                            case 'jpg':
                            case 'jpeg':
                            case 'png':
                              return <FileText className="text-purple-600" size={20} />;
                            default:
                              return <FileText className="text-slate-600" size={20} />;
                          }
                        };

                        return (
                          <div className="flex items-center justify-between p-4 transition-colors border rounded-lg bg-slate-50 border-slate-200 hover:border-sky-300">
                            <div className="flex items-center gap-3">
                              {getFileIcon(fileExtension || '')}
                              <div>
                                <p className="font-medium text-slate-900">
                                  {fileName}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {fileExtension?.toUpperCase()} Document
                                </p>
                              </div>
                            </div>
                            <a
                              href={proposal.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 text-sm font-medium transition-colors text-sky-600 hover:text-sky-700"
                            >
                              View
                            </a>
                          </div>
                        );
                      })()
                    )
                  ) : (
                    <div className="flex items-center justify-center p-8 border rounded-lg bg-slate-50 border-slate-200">
                      <div className="text-center">
                        <FileText className="mx-auto mb-2 text-slate-400" size={32} />
                        <p className="text-sm text-slate-500">No supporting documents provided</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Actions & Activity */}
            <div className="space-y-6">
              {/* Approval Actions */}
              <div className="p-6 bg-white border rounded-xl border-slate-200">
                <h4 className="mb-4 text-base font-semibold text-slate-900">
                  Approval Actions
                </h4>
                <div className="space-y-3">
                  {proposal.status === "Pending" ? (
                    <>
                      <button
                        onClick={onApproved}
                        className="flex items-center justify-center w-full gap-2 px-4 py-3 font-medium text-white transition-colors bg-emerald-600 rounded-xl hover:bg-emerald-700"
                      >
                        <CheckCircle size={20} />
                        Approve Request
                      </button>
                      <button
                        onClick={onReject}
                        className="flex items-center justify-center w-full gap-2 px-4 py-3 font-medium text-white transition-colors bg-rose-600 rounded-xl hover:bg-rose-700"
                      >
                        <XCircle size={20} />
                        Reject Request
                      </button>
                    </>
                  ) : (
                    <>
                      <div className={status == 'Rejected' ? 'flex items-center gap-2 px-4 py-3 bg-red-300 text-red-700 rounded-xl' : 'flex items-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-xl'}>
                        <CheckCircle size={20} />
                        <span className="font-medium">{status == 'Rejected' ? 'Project Rejected' : 'Project Approved'}</span>
                      </div>
                      <button
                        disabled={isFunded || status == 'Rejected'}//TODO:CALL THE IS FUNDED HERE
                        onClick={onSendFunds}
                        className="flex items-center justify-center w-full gap-2 px-4 py-3 font-medium text-white transition-colors bg-sky-600 rounded-xl hover:bg-sky-700"
                      >
                        {isFunded || status== 'Rejected' ? 'Project is already funded or rejected' : 'Send Funds to Agency'}
                      </button>
                    </>
                  )}
                  <button className="flex items-center justify-center w-full gap-2 px-4 py-3 font-medium transition-colors bg-white border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50">
                    <AlertCircle size={20} />
                    Request More Information
                  </button>
                </div>
              </div>

              {/* Activity Log */}
              <div className="p-6 bg-white border rounded-xl border-slate-200">
                <h4 className="mb-4 text-base font-semibold text-slate-900">
                  Activity Log
                </h4>
                <div className="space-y-4">
                  <div className="pl-4 border-l-2 border-sky-500">
                    <p className="text-sm font-medium text-slate-900">
                      Budget Request Created
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(proposal.createdAt).toLocaleDateString()} by{" "}
                      {proposal.agencyId?.name || proposal.agencyId?.email || "Unknown"}
                    </p>
                  </div>
                  {proposal.approvedBy && (
                    <div className="pl-4 border-l-2 border-emerald-500">
                      <p className="text-sm font-medium text-slate-900">
                        Request Approved
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {proposal.approvalDate
                          ? new Date(proposal.approvalDate).toLocaleDateString()
                          : "N/A"}{" "}
                        by {proposal.approvedBy}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


