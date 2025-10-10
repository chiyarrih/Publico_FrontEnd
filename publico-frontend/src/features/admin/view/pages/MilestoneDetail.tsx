import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectMilestone, useProjectMilestones } from '../../controller/hooks/useProjectMilestones';
import { Panel, Pill, IconButton } from '../ui/kit';
import { ProofOfWork } from '../../services/milestoneService';

const ArrowLeft = ({ className = "" }: { className?: string }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
const CheckCircle = ({ className = "" }: { className?: string }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>;
const Clock = ({ className = "" }: { className?: string }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>;
const AlertTriangle = ({ className = "" }: { className?: string }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const Info = ({ className = "" }: { className?: string }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
const Eye = ({ className = "" }: { className?: string }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const Upload = ({ className = "" }: { className?: string }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;

interface ProofOfWorkModalProps {
  proof: ProofOfWork;
  onClose: () => void;
  onVerify: (status: 'Verified' | 'Rejected', reason?: string) => void;
}

const ProofOfWorkModal: React.FC<ProofOfWorkModalProps> = ({ proof, onClose, onVerify }) => {
  const [rejectionReason, setRejectionReason] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">{proof.description}</h3>
        
        <div className="space-y-3 mb-4">
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
            <span className="ml-2">{(proof.fileSize / 1024 / 1024).toFixed(1)} MB</span>
          </div>
          <div>
            <span className="text-sm text-gray-600">Status:</span>
            <span className="ml-2">
              {proof.verificationStatus === 'Verified' && (
                <Pill tone="green">Verified</Pill>
              )}
              {proof.verificationStatus === 'Pending Verification' && (
                <Pill tone="yellow">Pending Verification</Pill>
              )}
              {proof.verificationStatus === 'Rejected' && (
                <Pill tone="red">Rejected</Pill>
              )}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => window.open(proof.fileUrl, '_blank')}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Eye />
            View Document
          </button>
        </div>

        {proof.verificationStatus === 'Pending Verification' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rejection Reason (if rejecting)
              </label>
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
                onClick={() => onVerify('Verified')}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <CheckCircle />
                Verify Proof
              </button>
              <button
                onClick={() => onVerify('Rejected', rejectionReason)}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center justify-center gap-2"
              >
                Reject
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function MilestoneDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { milestone, alerts, loading, error } = useProjectMilestone(id!);
  const { verifyProof } = useProjectMilestones();
  const [selectedProof, setSelectedProof] = useState<ProofOfWork | null>(null);

  const handleVerifyProof = async (status: 'Verified' | 'Rejected', reason?: string) => {
    if (!selectedProof || !milestone) return;
    
    try {
      await verifyProof({
        milestoneId: milestone._id,
        phaseNumber: milestone.phases.find(p => 
          p.proofOfWork.some(proof => proof.documentId === selectedProof.documentId)
        )?.phaseNumber || 0,
        documentId: selectedProof.documentId,
        verificationStatus: status,
        rejectionReason: reason
      });
      setSelectedProof(null);
    } catch (error) {
      console.error('Failed to verify proof:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading milestone details...</div>
      </div>
    );
  }

  if (error || !milestone) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Error: {error || 'Milestone not found'}</div>
      </div>
    );
  }

  const currentPhase = milestone.phases.find(p => p.status === 'In Progress');
  const completedPhases = milestone.phases.filter(p => p.status === 'Completed');
  const pendingPhases = milestone.phases.filter(p => p.status === 'Pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/milestones')}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <ArrowLeft />
        </button>
        <div>
          <h1 className="text-2xl font-semibold">Project Milestones - {milestone.projectName}</h1>
          <p className="text-gray-600">Project ID: {milestone._id}</p>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg flex items-center gap-3 ${
                alert.type === 'budget_exceeded' 
                  ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                  : alert.type === 'budget_under'
                  ? 'bg-blue-50 border border-blue-200 text-blue-800'
                  : 'bg-gray-50 border border-gray-200 text-gray-800'
              }`}
            >
              {alert.type === 'budget_exceeded' && <AlertTriangle className="text-yellow-600" />}
              {alert.type === 'budget_under' && <Info className="text-blue-600" />}
              <span className="text-sm">{alert.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Project Overview */}
      <Panel>
        <h2 className="text-lg font-semibold mb-4">Project Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-gray-600">Department</div>
            <div className="font-medium">{milestone.department}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Total Budget</div>
            <div className="font-medium text-blue-600">₱{milestone.totalBudget.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Timeline</div>
            <div className="font-medium">
              {new Date(milestone.startDate).toLocaleDateString()} - {new Date(milestone.endDate).toLocaleDateString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Overall Progress</div>
            <div className="font-medium">{milestone.overallProgress}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${milestone.overallProgress}%` }}
              />
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">Proposed By</div>
            <div className="font-medium">{milestone.proposedBy}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Approved By</div>
            <div className="font-medium">{milestone.approvedBy.name}</div>
          </div>
        </div>
      </Panel>

      {/* Project Timeline */}
      <Panel>
        <h2 className="text-lg font-semibold mb-4">Project Timeline</h2>
        <div className="space-y-4">
          {milestone.phases.map((phase, index) => (
            <div key={phase.phaseNumber} className="flex items-start gap-4 p-4 border rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                {phase.phaseNumber}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{phase.phaseName}</h3>
                  <Pill tone={
                    phase.status === 'Completed' ? 'green' :
                    phase.status === 'In Progress' ? 'blue' : 'gray'
                  }>
                    {phase.status}
                  </Pill>
                </div>
                <p className="text-sm text-gray-600 mb-3">{phase.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-gray-600">Budget</div>
                    <div className="font-medium">₱{phase.budget.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Spent</div>
                    <div className="font-medium">₱{phase.spent.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Progress</div>
                    <div className="font-medium">{phase.progress}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Timeline</div>
                    <div className="font-medium text-sm">
                      {new Date(phase.startDate).toLocaleDateString()} - {new Date(phase.endDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      phase.status === 'Completed' ? 'bg-green-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${phase.progress}%` }}
                  />
                </div>

                {/* Proof of Work */}
                {phase.proofOfWork.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Proof of Work</h4>
                    <div className="space-y-2">
                      {phase.proofOfWork.map((proof) => (
                        <div key={proof.documentId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <div>
                              <div className="text-sm font-medium">{proof.description}</div>
                              <div className="text-xs text-gray-600">
                                {proof.uploadedBy} • {new Date(proof.uploadedAt).toLocaleDateString()} • {(proof.fileSize / 1024 / 1024).toFixed(1)} MB
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {proof.verificationStatus === 'Verified' && (
                              <Pill tone="green">Verified</Pill>
                            )}
                            {proof.verificationStatus === 'Pending Verification' && (
                              <Pill tone="yellow">Pending Verification</Pill>
                            )}
                            {proof.verificationStatus === 'Rejected' && (
                              <Pill tone="red">Rejected</Pill>
                            )}
                            <button
                              onClick={() => setSelectedProof(proof)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Eye />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Proof of Work Modal */}
      {selectedProof && (
        <ProofOfWorkModal
          proof={selectedProof}
          onClose={() => setSelectedProof(null)}
          onVerify={handleVerifyProof}
        />
      )}
    </div>
  );
}
