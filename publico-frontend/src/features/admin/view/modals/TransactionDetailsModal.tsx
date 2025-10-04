import React from 'react';
import type { BudgetProposal } from '@admin/model/types/admin';

interface TransactionDetailsModalProps {
  proposal: BudgetProposal | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TransactionDetailsModal({ 
  proposal, 
  isOpen, 
  onClose 
}: TransactionDetailsModalProps) {
  if (!isOpen || !proposal) return null;

  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-slate-900">
            Transaction Details: {proposal.projectId}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Department and Project */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Department
              </label>
              <p className="text-base text-slate-900">{proposal.department}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Project
              </label>
              <p className="text-base text-slate-900">{proposal.projectName}</p>
            </div>
          </div>

          {/* Amount and Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Amount
              </label>
              <p className="text-base font-semibold text-slate-900">
                {formatCurrency(proposal.amountRequested)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Date
              </label>
              <p className="text-base text-slate-900">
                {formatDate(proposal.createdAt)}
              </p>
            </div>
          </div>

          {/* Status and Digital Signature */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Status
              </label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-sm font-medium ${
                proposal.status === 'Approved' 
                  ? 'bg-green-100 text-green-700' 
                  : proposal.status === 'Pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {proposal.status}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Digital Signature
              </label>
              <code className="text-xs text-slate-700 bg-slate-50 px-2 py-1 rounded break-all">
                {proposal.blockchainTxHash || 'Not available'}
              </code>
            </div>
          </div>

          {/* Timeline */}
          {proposal.timeline && (
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Timeline
              </label>
              <p className="text-base text-slate-900">{proposal.timeline}</p>
            </div>
          )}

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Category
            </label>
            <p className="text-base text-slate-900">{proposal.category}</p>
          </div>

          {/* Details Section */}
          <div className="bg-slate-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Details
            </label>
            <p className="text-sm text-slate-600 leading-relaxed">
              Fund transfer for initial phase of {proposal.projectName} project.
            </p>
          </div>

          {/* Blockchain Verification (if transaction is completed) */}
          {proposal.blockchainTxHash && proposal.status === 'Approved' && (
            <div className="bg-blue-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-blue-900 mb-2">
                Blockchain Verification
              </label>
              <p className="text-sm text-blue-700">
                This transaction has been recorded on the blockchain with timestamp{' '}
                <span className="font-mono">{formatDate(proposal.createdAt)} 14:30:25 GMT+8</span>
              </p>
            </div>
          )}

          {/* File Attachments (if available) */}
          {proposal.fileUrl && (
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Attachments
              </label>
              {Array.isArray(proposal.fileUrl) ? (
                <div className="space-y-2">
                  {proposal.fileUrl.map((fileUrl, index) => {
                    const fileName = fileUrl.split('/').pop() || `Document ${index + 1}`;
                    return (
                      <a
                        key={index}
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mr-4"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {fileName}
                      </a>
                    );
                  })}
                </div>
              ) : (
                <a
                  href={proposal.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Document
                </a>
              )}
            </div>
          )}

          {/* Agency Information (if available) */}
          {proposal.agencyId && typeof proposal.agencyId === 'object' && (
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Submitted By
              </label>
              <p className="text-base text-slate-900">
                {proposal.agencyId.name || proposal.agencyId.email || 'Unknown Agency'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
          >
            Print Receipt
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

