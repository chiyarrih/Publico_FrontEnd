import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Pill } from '../../../../shared/ui';

const ArrowLeft = ({ className = "" }: { className?: string }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
const CheckCircle = ({ className = "" }: { className?: string }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>;
const Clock = ({ className = "" }: { className?: string }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>;
const Upload = ({ className = "" }: { className?: string }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;

// Mock data - matching the mockup
const mockMilestone = {
  _id: "PRJ-2023-0125",
  projectName: "Road Rehabilitation - Perez Blvd",
  department: "Public Works",
  totalBudget: 2500000,
  startDate: "2023-06-01",
  endDate: "2023-08-30",
  overallStatus: "In Progress",
  overallProgress: 25,
  proposedBy: "Department of Public Works",
  approvedBy: { name: "City Administrator" },
  phases: [
    {
      phaseNumber: 1,
      phaseName: "Planning",
      description: "Complete site survey and engineering plans",
      status: "Approved",
      progress: 100,
      budget: 500000,
      spent: 500000,
      startDate: "2023-06-01",
      endDate: "2023-06-15",
      targetDate: "2023-06-15",
      proofOfWork: [
        {
          documentId: "doc_001",
          description: "Site Survey Report",
          uploadedBy: "Engineering Team",
          uploadedAt: "2023-06-10T10:00:00Z",
          fileSize: 2500000,
          fileUrl: "/documents/site-survey.pdf",
          verificationStatus: "Verified"
        },
        {
          documentId: "doc_002",
          description: "Engineering Plans",
          uploadedBy: "Engineering Team",
          uploadedAt: "2023-06-12T14:30:00Z",
          fileSize: 1800000,
          fileUrl: "/documents/engineering-plans.pdf",
          verificationStatus: "Verified"
        }
      ]
    },
    {
      phaseNumber: 2,
      phaseName: "Procurement",
      description: "Purchase all construction materials and equipment rental",
      status: "Under Review",
      progress: 80,
      budget: 800000,
      spent: 640000,
      startDate: "2023-06-16",
      endDate: "2023-07-15",
      targetDate: "2023-07-15",
      proofOfWork: [
        {
          documentId: "doc_003",
          description: "Material Purchase Receipts",
          uploadedBy: "Procurement Officer",
          uploadedAt: "2023-06-25T10:00:00Z",
          fileSize: 2800000,
          fileUrl: "/documents/material-receipts.pdf",
          verificationStatus: "Pending Verification"
        },
        {
          documentId: "doc_004",
          description: "Equipment Rental Agreement",
          uploadedBy: "Procurement Officer",
          uploadedAt: "2023-07-06T14:30:00Z",
          fileSize: 1500000,
          fileUrl: "/documents/equipment-rental.pdf",
          verificationStatus: "Pending Verification"
        }
      ]
    },
    {
      phaseNumber: 3,
      phaseName: "Construction",
      description: "Complete road construction according to specifications",
      status: "Pending",
      progress: 0,
      budget: 1000000,
      spent: 0,
      startDate: "2023-07-16",
      endDate: "2023-08-15",
      targetDate: "2023-08-15",
      proofOfWork: []
    },
    {
      phaseNumber: 4,
      phaseName: "Completion",
      description: "Final inspection and project handover",
      status: "Pending",
      progress: 0,
      budget: 200000,
      spent: 0,
      startDate: "2023-08-16",
      endDate: "2023-08-30",
      targetDate: "2023-08-30",
      proofOfWork: []
    }
  ]
};

interface ProofOfWorkModalProps {
  phaseNumber: number;
  phaseName: string;
  onClose: () => void;
  onUpload: (file: File, description: string) => void;
}

const ProofOfWorkModal: React.FC<ProofOfWorkModalProps> = ({ phaseNumber, phaseName, onClose, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (file && description) {
      onUpload(file, description);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Upload Proof of Work - Phase {phaseNumber}</h3>
        <p className="text-sm text-gray-600 mb-4">{phaseName}</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Describe the work completed..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Document
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full border rounded px-3 py-2 text-sm"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
          </div>
        </div>
        
        <div className="flex gap-2 mt-6">
          <button
            onClick={handleSubmit}
            disabled={!file || !description}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
          >
            <Upload />
            Upload Proof
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default function MilestoneDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<any>(null);

  // In real app, this would fetch from API based on id
  const milestone = mockMilestone;

  const handleUploadProof = (phase: any) => {
    setSelectedPhase(phase);
    setShowUploadModal(true);
  };

  const handleFileUpload = (file: File, description: string) => {
    // In real app, this would upload to backend
    console.log('Uploading file:', file.name, 'Description:', description);
    alert(`Proof of work uploaded for ${selectedPhase?.phaseName}: ${description}`);
  };

  if (!milestone) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Milestone not found</div>
      </div>
    );
  }

  const currentPhase = milestone.phases.find(p => p.status === 'In Progress');
  const completedPhases = milestone.phases.filter(p => p.status === 'Completed');
  const pendingPhases = milestone.phases.filter(p => p.status === 'Pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/agency/milestones')}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <ArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Project Milestones - {milestone.projectName}</h1>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Project ID: {milestone._id}</span>
          <span>|</span>
          <span>Agency View</span>
        </div>
      </div>

      {/* Project Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Project Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <div className="text-sm text-gray-600 mb-1">Department</div>
            <div className="font-medium text-lg">{milestone.department}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Total Budget</div>
            <div className="font-bold text-lg text-blue-600">₱{milestone.totalBudget.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Timeline</div>
            <div className="font-bold text-lg">
              {new Date(milestone.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(milestone.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Overall Progress</span>
          <span className="text-sm font-medium">{milestone.overallProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${milestone.overallProgress}%` }}
          />
        </div>
      </div>

      {/* Milestones Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <h2 className="text-lg font-semibold p-6 pb-4">Milestones</h2>
        
        {/* Table Header */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-6 gap-4 px-6 py-3 text-sm font-medium text-gray-700">
            <div>Milestone</div>
            <div>Target Date</div>
            <div>Deliverables</div>
            <div>Status</div>
            <div>Proofs</div>
            <div>Actions</div>
          </div>
        </div>
        
        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {milestone.phases.map((phase) => (
            <div key={phase.phaseNumber} className="grid grid-cols-6 gap-4 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  phase.status === 'Approved' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {phase.status === 'Approved' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                </div>
                <span className="font-medium">{phase.phaseName}</span>
              </div>
              <div className="text-sm text-gray-600">
                {new Date(phase.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="text-sm text-gray-600">{phase.description}</div>
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  phase.status === 'Approved' ? 'bg-green-100 text-green-800' :
                  phase.status === 'Under Review' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {phase.status}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {phase.proofOfWork.length > 0 ? `${phase.proofOfWork.length} uploaded` : 'None'}
              </div>
              <div className="flex items-center gap-2">
                {phase.status === 'Under Review' && (
                  <>
                    <button
                      onClick={() => handleUploadProof(phase)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                    >
                      <Upload className="w-3 h-3" />
                      Upload Proof
                    </button>
                    {/*
                    <button className="inline-flex items-center gap-1 px-3 py-1 text-blue-600 text-xs hover:bg-blue-50 rounded">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    */}
                  </>
                )}
                {phase.status === 'Pending' && (
                  <button
                    onClick={() => handleUploadProof(phase)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                  >
                    <Upload className="w-3 h-3" />
                    Upload Proof
                  </button>
                )}
                {phase.status === 'Approved' && (
                  <button className="inline-flex items-center gap-1 px-3 py-1 text-blue-600 text-xs hover:bg-blue-50 rounded">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Proofs
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Procurement Phase Details */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Procurement Phase</h2>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Under Review
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="text-sm text-gray-600 mb-1">Target Date</div>
            <div className="font-bold text-lg">
              {new Date(milestone.phases[1].targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Deliverables</div>
            <div className="font-medium">{milestone.phases[1].description}</div>
          </div>
        </div>
        
        <button
          onClick={() => handleUploadProof(milestone.phases[1])}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Upload className="w-4 h-4" />
          Upload New Proof
        </button>
      </div>

      {/* Proof of Work Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Proof of Work</h2>
        
        <div className="space-y-4">
          {milestone.phases[1].proofOfWork.map((proof) => (
            <div key={proof.documentId} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">{proof.description}</h3>
                <p className="text-sm text-gray-600 mb-2">{proof.description}</p>
                <div className="text-xs text-gray-500 mb-3">
                  Uploaded {new Date(proof.uploadedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} by {proof.uploadedBy} • {(proof.fileSize / 1024 / 1024).toFixed(1)} MB
                </div>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    proof.verificationStatus === 'Verified' ? 'bg-green-100 text-green-800' :
                    proof.verificationStatus === 'Pending Verification' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {proof.verificationStatus}
                  </span>
                  <button
                    onClick={() => window.open(proof.fileUrl, '_blank')}
                    className="inline-flex items-center gap-1 px-3 py-1 text-blue-600 text-xs hover:bg-blue-50 rounded"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && selectedPhase && (
        <ProofOfWorkModal
          phaseNumber={selectedPhase.phaseNumber}
          phaseName={selectedPhase.phaseName}
          onClose={() => {
            setShowUploadModal(false);
            setSelectedPhase(null);
          }}
          onUpload={handleFileUpload}
        />
      )}
    </div>
  );
}


