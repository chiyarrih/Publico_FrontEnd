import React from "react";
import { Modal, Badge, Button } from "../ui/blocks";

export default function TxnDetailsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Transaction Details: TX-7B645"
      footer={<div className="flex justify-end gap-2"><Button className="bg-slate-700 hover:bg-slate-800">Print Receipt</Button><Button onClick={onClose}>Close</Button></div>}>
      <div className="space-y-2 text-sm">
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
    </Modal>
  );
}
