import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Pill } from '../../../../shared/ui';
import {useMilestoneId} from '@agency/controller/hooks/useMilestoneId';
import { apiClient } from '../../../../config/api';
import toast from 'react-hot-toast';




const ArrowLeft = ({ className = "" }: { className?: string }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
const CheckCircle = ({ className = "" }: { className?: string }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>;
const Clock = ({ className = "" }: { className?: string }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>;
const Upload = ({ className = "" }: { className?: string }) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;

// Mock data - matching the mockup with updated Dagupan City LGU departments
const mockMilestone = {
  _id: "PRJ-2023-0125",
  projectName: "Road Rehabilitation - Perez Blvd",
  department: "City Engineering Office",
  totalBudget: 2500000,
  startDate: "2023-06-01",
  endDate: "2023-08-30",
  overallStatus: "In Progress",
  overallProgress: 25,
  proposedBy: "City Engineering Office",
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (file && description) {
      await onUpload(file, description);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-4 text-lg font-semibold">Upload Proof of Work - Phase {phaseNumber}</h3>
        <p className="mb-4 text-sm text-gray-600">{phaseName}</p>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded"
              placeholder="Describe the work completed..."
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Upload Document
            </label>
            <div className="relative">
              <label 
                htmlFor="file-upload-input"
                onClick={(e) => e.stopPropagation()}
                className="block w-full px-3 py-3 text-sm border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-blue-500 hover:bg-blue-50 active:bg-blue-100 text-center transition-all"
              >
                {file ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700 font-medium truncate max-w-xs">{file.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-gray-600">Click to choose file...</span>
                    <span className="text-xs text-gray-400">PNG, JPG, PDF, DOC</span>
                  </div>
                )}
              </label>
              <input
                id="file-upload-input"
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept="image/png,image/jpeg,image/jpg,application/pdf,.doc,.docx"
              />
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 mt-6">
          <button
            onClick={handleSubmit}
            disabled={!file || !description}
            className="flex items-center justify-center flex-1 gap-2 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-400"
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
  const {milestoneId, loading, error, refetch} = useMilestoneId({id:id});
  // In real app, this would fetch from API based on id
  const milestone = milestoneId;

  const handleUploadProof = (phase: any) => {
    setSelectedPhase(phase);
    setShowUploadModal(true);
  };

  const handleFileUpload = async (file: File, description: string) => {
    if (!milestone || !selectedPhase) {
      toast.error('Missing milestone or phase information');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('milestoneId', milestone._id);
      formData.append('phaseNumber', selectedPhase.phaseNumber.toString());
      formData.append('documentType', 'proof_of_work');
      formData.append('description', description);
      formData.append('index', '0'); // Default index for now
      
      console.log('Uploading file:', file.name, 'Description:', description);
      
      // Use upload method for file uploads with proper content type
      const response = await apiClient.post('/milestone/upload-proof', formData, {
        headers: {
          // Let browser set Content-Type with boundary for multipart/form-data
        }
      });
      
      toast.success('Proof of work uploaded successfully');
      
      // Refresh milestone data by calling refetch
      console.log('🔄 Refreshing milestone data...');
      if (refetch) {
        await refetch();
        console.log('✅ Milestone data refreshed');
      } else {
        console.warn('⚠️ No refetch function available');
      }
      
    } catch (error: any) {
      console.error('Error uploading proof of work:', error);
      const errorMsg = error?.message || 'Failed to upload proof of work';
      toast.error(errorMsg);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading milestone details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!milestone) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Milestone not found</div>
      </div>
    );
  }



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/agency/milestones')}
            className="p-2 rounded hover:bg-gray-100"
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
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <h2 className="mb-4 text-lg font-semibold">Project Overview</h2>
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
          <div>
            <div className="mb-1 text-sm text-gray-600">Department</div>
            <div className="text-lg font-medium">{milestone.department}</div>
          </div>
          <div>
            <div className="mb-1 text-sm text-gray-600">Total Budget</div>
            <div className="text-lg font-bold text-blue-600">₱{milestone?.totalBudget?.toLocaleString()}</div>
          </div>
          <div>
            <div className="mb-1 text-sm text-gray-600">Timeline</div>
            <div className="text-lg font-bold">
              {new Date(milestone?.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(milestone.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Overall Progress</span>
          <span className="text-sm font-medium">{milestone.overallProgress}%</span>
        </div>
        <div className="w-full h-2 mt-2 bg-gray-200 rounded-full">
          <div 
            className="h-2 transition-all duration-300 bg-blue-600 rounded-full"
            style={{ width: `${milestone.overallProgress ?? ''}%` }}
          />
        </div>
      </div>

      {/* Milestones Table */}
      <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
        <h2 className="p-6 pb-4 text-lg font-semibold">Milestones</h2>
        
        {/* Table Header */}
        <div className="border-b border-gray-200 bg-gray-50">
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
          {milestone?.phases?.map((phase:any) => (
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
                {(phase.status === 'In Progress' || phase.status === 'Pending') && (
                  <button
                    onClick={() => handleUploadProof(phase)}
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    <Upload className="w-3 h-3" />
                    Upload Proof
                  </button>
                )}
                {phase.proofOfWork.length > 0 && (
                  <button className="inline-flex items-center gap-1 px-3 py-1 text-xs text-blue-600 rounded hover:bg-blue-50">
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
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Procurement Phase</h2>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Under Review
          </span>
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
          <div>
            <div className="mb-1 text-sm text-gray-600">Target Date</div>
            <div className="text-lg font-bold">
              {milestone?.phases?.[1]?.targetDate
                ? new Date(milestone.phases[1].targetDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'No target date'}
            </div>

          </div>
          <div>
            <div className="mb-1 text-sm text-gray-600">Deliverables</div>
            <div className="font-medium">{milestone?.phases?.[1]?.description}</div>
          </div>
        </div>
        
        <button
          onClick={() => handleUploadProof(milestone?.phases[0])}
          className="inline-flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          <Upload className="w-4 h-4" />
          Upload New Proof
        </button>
      </div>

      {/* Proof of Work Section */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <h2 className="mb-4 text-lg font-semibold">Proof of Work</h2>
        
        <div className="space-y-6">
          {milestone.phases?.map((phase:any, phaseIdx: number) => {
            if (!phase.proofOfWork || phase.proofOfWork.length === 0) {
              return null;
            }
            return (
              <div key={phaseIdx} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
                <h3 className="mb-4 text-md font-semibold text-gray-700">Phase {phase.phaseNumber}: {phase.phaseName}</h3>
                <div className="space-y-4">
                  {phase.proofOfWork.map((proof:any) => {
                    const isImage = proof.fileUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                    return (
                      <div key={proof.documentId} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                        {isImage && (
                          <div className="flex-shrink-0">
                            <img 
                              src={`http://localhost:5000${proof.fileUrl}`} 
                              alt={proof.description}
                              className="w-24 h-24 object-cover rounded border border-gray-200"
                            />
                          </div>
                        )}
                        {!isImage && (
                          <div className="flex-shrink-0">
                            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded">
                              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <h3 className="mb-1 font-medium text-gray-900">{proof.description}</h3>
                          <div className="mb-3 text-xs text-gray-500">
                            Uploaded {new Date(proof.uploadedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} by {proof.uploadedBy} • {(proof.fileSize / 1024).toFixed(1)} KB
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
                              onClick={() => window.open(`http://localhost:5000${proof.fileUrl}`, '_blank')}
                              className="inline-flex items-center gap-1 px-3 py-1 text-xs text-blue-600 rounded hover:bg-blue-50"
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
                    );
                  })}
                </div>
              </div>
            );
          })}
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


