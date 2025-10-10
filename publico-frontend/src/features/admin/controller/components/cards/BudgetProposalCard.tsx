import React from 'react';
import type { BudgetProposal } from '@admin/model/types/admin';

interface BudgetProposalCardProps {
  proposal: BudgetProposal;
  onView?: (proposal: BudgetProposal) => void;
  onApprove?: (proposal: BudgetProposal) => void;
  onReject?: (proposal: BudgetProposal) => void;
}

export default function BudgetProposalCard({ 
  proposal, 
  onView, 
  onApprove, 
  onReject 
}: BudgetProposalCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Infrastructure': return 'text-blue-600';
      case 'Education': return 'text-purple-600';
      case 'Health': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm border-slate-200 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900">{proposal.projectName}</h3>
            <span className={`px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(proposal.status)}`}>
              {proposal.status}
            </span>
          </div>
          <p className="text-sm text-slate-500">Project ID: {proposal.projectId}</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-slate-900">
            ₱{proposal.amountRequested.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500">Requested Amount</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
        <div>
          <p className="text-slate-500">Department</p>
          <p className="font-medium text-slate-900">{proposal.department}</p>
        </div>
        <div>
          <p className="text-slate-500">Category</p>
          <p className={`font-medium ${getCategoryColor(proposal.category)}`}>{proposal.category}</p>
        </div>
        <div>
          <p className="text-slate-500">Timeline</p>
          <p className="font-medium text-slate-900">{proposal.timeline}</p>
        </div>
        <div>
          <p className="text-slate-500">Submitted</p>
          <p className="font-medium text-slate-900">
            {new Date(proposal.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Agency Info */}
      {proposal.agencyId && (
        <div className="p-2 mb-3 rounded bg-slate-50">
          <p className="text-xs text-slate-500">Submitted by</p>
          <p className="text-sm font-medium text-slate-900">
            {proposal.agencyId.name || proposal.agencyId.email || 'Unknown Agency'}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-slate-200">
        <button 
          onClick={() => onView?.(proposal)}
          className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
        >
          View Details
        </button>
        {proposal.status === 'Pending' && (
          <>
            <button 
              onClick={() => onApprove?.(proposal)}
              className="flex-1 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
            >
              Approve
            </button>
            <button 
              onClick={() => onReject?.(proposal)}
              className="flex-1 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
            >
              Reject
            </button>
          </>
        )}
      </div>

      {/* Blockchain Hash (if approved) */}
      {proposal.blockchainTxHash && (
        <div className="mt-3 pt-3 border-t border-slate-200">
          <p className="text-xs text-slate-500">Blockchain Transaction</p>
          <code className="text-xs text-slate-700 break-all">{proposal.blockchainTxHash}</code>
        </div>
      )}
    </div>
  );
}

