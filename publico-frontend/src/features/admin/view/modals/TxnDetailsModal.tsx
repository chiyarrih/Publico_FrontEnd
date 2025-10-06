import React from "react";
import { Badge, Button } from "../ui/blocks";

export default function TxnDetailsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Transaction Details: TX-7B645</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div><div className="text-slate-500">Department</div><div>Public Works</div></div>
            <div><div className="text-slate-500">Project</div><div>Road Rehabilitation</div></div>
            <div><div className="text-slate-500">Amount</div><div>₱500,000</div></div>
            <div><div className="text-slate-500">Date</div><div>2023-05-15</div></div>
            <div><div className="text-slate-500">Status</div><Badge tone="green">Completed</Badge></div>
            <div><div className="text-slate-500">Digital Signature</div><code>0xa5d…64ff</code></div>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 text-xs">
            <div className="font-medium">Blockchain Verification</div>
            <div>This transaction has been recorded on the blockchain.</div>
            <div>TX hash: 0x… • 2023-05-15 08:47</div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 p-6 border-t border-gray-200">
          <Button className="bg-slate-700 hover:bg-slate-800">Print Receipt</Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}
