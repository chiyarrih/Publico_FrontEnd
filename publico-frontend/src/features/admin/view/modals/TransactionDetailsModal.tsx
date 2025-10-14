"use client"

interface TransactionDetailsModalProps {
  proposal: any | null
  isOpen: boolean
  onClose: () => void
}

export default function TransactionDetailsModal({ proposal, isOpen, onClose }: TransactionDetailsModalProps) {
  if (!isOpen || !proposal) return null

  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Receipt Header */}
        <div className="text-center p-6 border-b-2 border-dashed border-slate-300">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Transaction Receipt</h2>
          <p className="text-sm text-slate-500">Official Record</p>
        </div>

        {/* Receipt Content */}
        <div className="p-6 space-y-4 font-mono text-sm">
          {/* Transaction ID */}
          <div className="text-center pb-4 border-b border-dashed border-slate-300">
            <p className="text-xs text-slate-500 mb-1">TRANSACTION ID</p>
            <p className="text-base font-bold text-slate-900">Tx-{proposal.txId}</p>
          </div>

          {/* Date and Time */}
          <div className="flex justify-between py-2">
            <span className="text-slate-600">Date:</span>
            <span className="text-slate-900 font-semibold">{formatDate(proposal.createdAt)}</span>
          </div>

          {/* Department */}
          <div className="flex justify-between py-2">
            <span className="text-slate-600">Department:</span>
            <span className="text-slate-900 text-right max-w-[60%]">{proposal.department}</span>
          </div>

          {/* Project Name */}
          <div className="flex justify-between py-2">
            <span className="text-slate-600">Project:</span>
            <span className="text-slate-900 text-right max-w-[60%]">{proposal.projectName}</span>
          </div>

          {/* Category */}
          <div className="flex justify-between py-2">
            <span className="text-slate-600">Category:</span>
            <span className="text-slate-900">{proposal.category}</span>
          </div>

          {/* Timeline */}
          {proposal.timeline && (
            <div className="flex justify-between py-2">
              <span className="text-slate-600">Timeline:</span>
              <span className="text-slate-900">{proposal.timeline}</span>
            </div>
          )}

          {/* Divider */}
          <div className="border-t-2 border-dashed border-slate-300 my-4"></div>

          {/* Amount - Highlighted */}
          <div className="bg-slate-50 rounded p-4 my-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 text-base">AMOUNT:</span>
              <span className="text-2xl font-bold text-slate-900">{formatCurrency(proposal.amount)}</span>
            </div>
          </div>

          {/* Status */}
          <div className="flex justify-between items-center py-2">
            <span className="text-slate-600">Status:</span>
            <span
              className={`px-3 py-1 rounded text-xs font-bold uppercase ${
                proposal.status === "Approved"
                  ? "bg-green-100 text-green-700"
                  : proposal.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {proposal.status}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-dashed border-slate-300 my-4"></div>

          {/* Digital Signature */}
          <div className="py-2">
            <p className="text-xs text-slate-500 mb-2">DIGITAL SIGNATURE</p>
            <code className="text-xs text-slate-700 bg-slate-50 px-2 py-1 rounded block break-all">
              {proposal.blockchainTxHash || "Not available"}
            </code>
          </div>

          {/* Blockchain Verification */}
          {proposal.blockchainTxHash && proposal.status === "Approved" && (
            <div className="bg-blue-50 rounded p-3 mt-4">
              <p className="text-xs text-blue-900 font-semibold mb-1">✓ BLOCKCHAIN VERIFIED</p>
              <p className="text-xs text-blue-700">Recorded: {formatDate(proposal.createdAt)} 14:30:25 GMT+8</p>
            </div>
          )}

          {/* Agency Information */}
          {proposal.agencyId && typeof proposal.agencyId === "object" && (
            <div className="pt-4 border-t border-dashed border-slate-300">
              <p className="text-xs text-slate-500 mb-1">SUBMITTED BY</p>
              <p className="text-sm text-slate-900">
                {proposal.agencyId.name || proposal.agencyId.email || "Unknown Agency"}
              </p>
            </div>
          )}

          {/* Details */}
          <div className="pt-4 border-t border-dashed border-slate-300">
            <p className="text-xs text-slate-500 mb-2">TRANSACTION DETAILS</p>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Fund transfer for initial phase of {proposal.projectName} project.
            </p>
          </div>
        </div>

        {/* Receipt Footer */}
        <div className="border-t-2 border-dashed border-slate-300 p-6 bg-slate-50">
          <p className="text-center text-xs text-slate-500 mb-4">Thank you for using our system</p>
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
            >
              Print Receipt
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
