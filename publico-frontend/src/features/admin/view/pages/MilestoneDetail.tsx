"use client"

import type React from "react"
import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useProjectMilestone, useProjectMilestones } from "../../controller/hooks/useProjectMilestones"
import { Pill } from "../ui/kit"
import type { ProofOfWork } from "../../services/milestoneService"

const ArrowLeft = ({ className = "" }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
)
const CheckCircle = ({ className = "" }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22,4 12,14.01 9,11.01" />
  </svg>
)
const Clock = ({ className = "" }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
)
const AlertTriangle = ({ className = "" }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)
const Info = ({ className = "" }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)
const Eye = ({ className = "" }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)
const Upload = ({ className = "" }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7,10 12,15 17,10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

interface ProofOfWorkModalProps {
  proof: ProofOfWork
  onClose: () => void
  onVerify: (status: "Verified" | "Rejected", reason?: string) => void
  projectName?: string
  agencyName?: string
}

const ProofOfWorkModal: React.FC<ProofOfWorkModalProps> = ({ proof, onClose, onVerify, projectName, agencyName }) => {
  const [rejectionReason, setRejectionReason] = useState("")
  
  const fileUrl = proof.fileUrl?.startsWith('http') 
    ? proof.fileUrl 
    : `http://localhost:5000${proof.fileUrl}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">{proof.description}</h3>

        <div className="space-y-3 mb-4">
          {projectName && (
            <div>
              <span className="text-sm text-gray-600">Project:</span>
              <span className="ml-2 font-medium text-blue-600">{projectName}</span>
            </div>
          )}
          {agencyName && (
            <div>
              <span className="text-sm text-gray-600">Agency:</span>
              <span className="ml-2 font-medium">{agencyName}</span>
            </div>
          )}
          <div>
            <span className="text-sm text-gray-600">Uploaded by:</span>
            <span className="ml-2 font-medium">{proof.uploadedBy}</span>
          </div>
          <div>
            <span className="text-sm text-gray-600">Upload date:</span>
            <span className="ml-2">{new Date(proof.uploadedAt).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-sm text-gray-600">File size:</span>
            <span className="ml-2">{(proof.fileSize / 1024).toFixed(1)} KB</span>
          </div>
          <div>
            <span className="text-sm text-gray-600">Status:</span>
            <span className="ml-2">
              {proof.verificationStatus === "Verified" && <Pill tone="green">Verified</Pill>}
              {proof.verificationStatus === "Pending Verification" && <Pill tone="yellow">Pending Verification</Pill>}
              {proof.verificationStatus === "Rejected" && <Pill tone="red">Rejected</Pill>}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => window.open(fileUrl, "_blank")}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Eye />
            View Document
          </button>
        </div>

        {proof.verificationStatus === "Pending Verification" && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason (if rejecting)</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
                rows={3}
                placeholder="Enter reason for rejection..."
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onVerify("Verified")}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <CheckCircle />
                Verify Proof
              </button>
              <button
                onClick={() => onVerify("Rejected", rejectionReason)}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center justify-center gap-2"
              >
                Reject
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-50">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MilestoneDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { milestone, alerts, loading, error } = useProjectMilestone(id!)
  const { verifyProof } = useProjectMilestones()
  const [selectedProof, setSelectedProof] = useState<ProofOfWork | null>(null)

  const handleVerifyProof = async (status: "Verified" | "Rejected", reason?: string) => {
    if (!selectedProof || !milestone) return

    try {
      await verifyProof({
        milestoneId: milestone._id,
        phaseNumber:
          milestone.phases.find((p) => p.proofOfWork.some((proof) => proof.documentId === selectedProof.documentId))
            ?.phaseNumber || 0,
        documentId: selectedProof.documentId,
        verificationStatus: status,
        rejectionReason: reason,
      })
      setSelectedProof(null)
    } catch (error) {
      console.error("Failed to verify proof:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading milestone details...</div>
      </div>
    )
  }

  if (error || !milestone) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Error: {error || "Milestone not found"}</div>
      </div>
    )
  }

  const currentPhase = milestone.phases.find((p) => p.status === "In Progress")
  const completedPhases = milestone.phases.filter((p) => p.status === "Completed")
  const pendingPhases = milestone.phases.filter((p) => p.status === "Pending")

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin/milestones")}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Project Milestones - {milestone.projectName}</h1>
            </div>
          </div>
          <div className="text-right text-sm">
            <div className="text-gray-600">Project ID: {milestone._id}</div>
            <div className="text-gray-600">PR-2023-025</div>
          </div>
        </div>

        {alerts.length > 0 && (
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg flex items-start gap-3 ${
                  alert.type === "budget_exceeded"
                    ? "bg-yellow-50 border border-yellow-200"
                    : alert.type === "budget_under"
                      ? "bg-blue-50 border border-blue-200"
                      : "bg-gray-50 border border-gray-200"
                }`}
              >
                {alert.type === "budget_exceeded" && <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" />}
                {alert.type === "budget_under" && <Info className="text-blue-600 flex-shrink-0 mt-0.5" />}
                <span
                  className={`text-sm ${
                    alert.type === "budget_exceeded"
                      ? "text-yellow-800"
                      : alert.type === "budget_under"
                        ? "text-blue-800"
                        : "text-gray-800"
                  }`}
                >
                  {alert.message}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Project Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">Department</div>
              <div className="font-medium text-gray-900">{milestone.department}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Funds/Works</div>
              <div className="font-semibold text-gray-900">₱{milestone.totalBudget.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Budget</div>
              <div className="font-semibold text-gray-900">₱{milestone.totalBudget.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Timeline</div>
              <div className="font-medium text-gray-900">
                {new Date(milestone.startDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                -{" "}
                {new Date(milestone.endDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Proposed By</div>
              <div className="font-medium text-blue-600">{milestone.proposedBy}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Approved By</div>
              <div className="font-medium text-gray-900">Admin</div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Overall Progress</div>
              <div className="text-sm font-medium text-gray-900">{milestone.overallProgress}%</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${milestone.overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Project Timeline</h2>
          <div className="space-y-4">
            {milestone.phases.map((phase, index) => (
              <div key={phase.phaseNumber} className="border border-gray-200 rounded-lg p-5">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                      phase.status === "Completed"
                        ? "bg-green-500 text-white"
                        : phase.status === "In Progress"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {phase.phaseNumber}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{phase.phaseName}</h3>
                      <Pill
                        tone={phase.status === "Completed" ? "green" : phase.status === "In Progress" ? "blue" : "gray"}
                      >
                        {phase.status}
                      </Pill>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Budget</div>
                        <div className="font-semibold text-gray-900">₱{phase.budget.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">(BUDGET)</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Spent</div>
                        <div className="font-semibold text-gray-900">₱{phase.spent.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">(SPENT)</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm text-gray-600">Progress</div>
                        <div className="text-sm font-medium text-gray-900">{phase.progress}%</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            phase.status === "Completed" ? "bg-green-500" : "bg-blue-600"
                          }`}
                          style={{ width: `${phase.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      {new Date(phase.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      -{" "}
                      {new Date(phase.endDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>

                    {phase.proofOfWork.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            {phase.proofOfWork.length} document{phase.proofOfWork.length !== 1 ? "s" : ""} uploaded
                          </div>
                          <button
                            onClick={() => setSelectedProof(phase.proofOfWork[0])}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View Documents
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Procurement</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View Details</button>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">Amount Allocated</div>
              <div className="font-semibold text-gray-900">₱500,000</div>
              <div className="text-xs text-gray-500">₱ 0 (0%)</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Remaining Budget</div>
              <div className="font-semibold text-gray-900">₱500,000</div>
              <div className="text-xs text-gray-500">₱ 0 (0%)</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Procurement Status</div>
              <div className="font-semibold text-gray-900">₱0</div>
              <div className="text-xs text-gray-500">0.0% • 0%</div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">Timeline</div>
            <div className="text-sm font-medium text-gray-900">Jun 15, 2023 - Jul 15, 2023</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Proof of Work</h2>
          </div>
          <div className="space-y-3">
            {milestone.phases.flatMap((phase) => phase.proofOfWork).length > 0 ? (
              milestone.phases
                .flatMap((phase) => phase.proofOfWork)
                .map((proof) => {
                  const isImage = proof.fileUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                  const imageUrl = proof.fileUrl?.startsWith('http') 
                    ? proof.fileUrl 
                    : `http://localhost:5000${proof.fileUrl}`;
                  return (
                    <div
                      key={proof.documentId}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {isImage ? (
                          <img 
                            src={imageUrl}
                            alt={proof.description}
                            className="w-16 h-16 object-cover rounded border border-gray-200"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{proof.description}</div>
                          <div className="text-sm text-gray-600">
                            Uploaded:{" "}
                            {new Date(proof.uploadedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}{" "}
                            • {(proof.fileSize / 1024).toFixed(1)} KB
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {proof.verificationStatus === "Verified" && <Pill tone="green">Verified</Pill>}
                        {proof.verificationStatus === "Pending Verification" && (
                          <Pill tone="yellow">Pending Verification</Pill>
                        )}
                        {proof.verificationStatus === "Rejected" && <Pill tone="red">Rejected</Pill>}
                        <button
                          onClick={() => setSelectedProof(proof)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="mb-3">
                  <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm">No proof of work uploaded yet.</p>
                <p className="text-xs mt-1">The agency will upload proof documents here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Proof of Work Modal */}
      {selectedProof && (
        <ProofOfWorkModal 
          proof={selectedProof} 
          onClose={() => setSelectedProof(null)} 
          onVerify={handleVerifyProof}
          projectName={milestone?.projectName}
          agencyName={milestone?.proposedBy}
        />
      )}
    </div>
  )
}
