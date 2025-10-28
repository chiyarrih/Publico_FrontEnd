
type Status = "Approved" | "In Review" | "Pending" | "Rejected";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  amount: string;
  dept: string;
  date: string;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, title, amount, dept, date }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg p-6 mx-4 bg-white shadow-xl rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Project Receipt</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
            <I.close />
          </button>
        </div>
        
        <div className="p-5 mb-4 border rounded-xl border-slate-200 bg-slate-50/80">
          <div className="grid gap-4">
            <div>
              <div className="mb-1 text-sm text-slate-500">Project Title</div>
              <div className="font-medium text-slate-900">{title}</div>
            </div>
            <div>
              <div className="mb-1 text-sm text-slate-500">Department</div>
              <div className="font-medium text-slate-900">{dept}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-1 text-sm text-slate-500">Amount</div>
                <div className="font-medium text-slate-900">{amount}</div>
              </div>
              <div>
                <div className="mb-1 text-sm text-slate-500">Date</div>
                <div className="font-medium text-slate-900">{date}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium transition-colors border rounded-lg text-slate-600 border-slate-200 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
const StatusChip: React.FC<{ s: Status }> = ({ s }) => {
  const m: Record<Status, string> = {
    Approved: "bg-emerald-100 text-emerald-700",
    "In Review": "bg-blue-100 text-blue-700",
    Pending: "bg-amber-100 text-amber-700",
    Rejected: "bg-rose-100 text-rose-700",
  };
  return <span className={`rounded px-2 py-0.5 text-xs ${m[s]}`}>{s}</span>;
};
const I = {
  menu: () => <svg width="18" height="18" viewBox="0 0 24 24" className="text-slate-600"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  bell: () => <svg width="18" height="18" viewBox="0 0 24 24" className="text-slate-500"><path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  chevronDown: () => <svg width="16" height="16" viewBox="0 0 24 24" className="text-slate-500"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  dashboard: () => <svg width="16" height="16" viewBox="0 0 24 24"><path d="M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z" fill="currentColor"/></svg>,
  budget: () => <svg width="16" height="16" viewBox="0 0 24 24"><path d="M3 7h18v12H3z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M3 7l2-3h14l2 3" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>,
  docs: () => <svg width="16" height="16" viewBox="0 0 24 24"><path d="M7 3h8l4 4v14H7z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M15 3v4h4" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>,
  ledger: () => <svg width="16" height="16" viewBox="0 0 24 24"><path d="M4 5h16M4 12h16M4 19h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  alert: () => <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 3l9 16H3z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  user: () => <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zM3 21a9 9 0 0 1 18 0" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>,
  faq: () => <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 18h.01M8 9a4 4 0 1 1 6.7 2.9 4.3 4.3 0 0 0-1.7 3.1v.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  support: () => <svg width="16" height="16" viewBox="0 0 24 24"><path d="M18 16v-5a6 6 0 1 0-12 0v5M6 20h12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  search: () => <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-400"><path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  money:  () => <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-400"><path d="M3 6h18v12H3z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M7 12h10M12 9v6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  dept:   () => <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-400"><path d="M3 21h18M5 21V7l7-4 7 4v14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  cal:    () => <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-400"><path d="M7 3v4M17 3v4M3 9h18M5 21h14a2 2 0 0 0 2-2V9H3v10a2 2 0 0 0 2 2z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  check:  () => <svg viewBox="0 0 24 24" className="w-4 h-4 text-emerald-600"><path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chev:   () => <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-slate-500"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  close:  () => <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-500"><path d="M18 6L6 18M6 6l12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  receipt:() => <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-400"><path d="M4 21V3h16v18l-4-2-4 2-4-2-4 2z" fill="none" stroke="currentColor" strokeWidth="1.5"/><path d="M8 7h8M8 11h8M8 15h5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
};
import React, { useState } from "react";

interface ReceiptModalState {
    isOpen: boolean;
    title: string;
    amount: string;
    dept: string;
    date: string;
}

export default function ProposalCard({data}:{data:any[]}){
    const [receiptModal, setReceiptModal] = useState<ReceiptModalState>({
        isOpen: false,
        title: "",
        amount: "",
        dept: "",
        date: "",
    });

    return (
        <div className="bg-white border divide-y rounded-lg border-slate-200">
            {data.map((r, index)=>{
                return <div key={index} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="truncate text-[15px] font-medium text-slate-900">{r.projectName}</div>
                    <div className="flex flex-wrap items-center mt-1 text-xs gap-x-4 gap-y-1 text-slate-500">
                      <span className="inline-flex items-center gap-1"><I.dept/>{r.category}</span>
                      <span className="inline-flex items-center gap-1"><I.cal/>Timeline: {r.timeline}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center justify-end gap-2 text-sm font-semibold text-slate-900"><I.money/>{r.amountRequested}</div>
                    <div className="flex items-center justify-end gap-3 mt-1">
                      <div className="inline-flex items-center gap-1 text-xs text-slate-500"><I.cal/> Submitted: {r.createdAt}</div>
                      <StatusChip s={r.status}/>
                    </div>
                    <button 
                      onClick={() => setReceiptModal({
                        isOpen: true,
                        title: r.projectName,
                        amount: r.amountRequested,
                        dept: r.category,
                        date: r.createdAt
                      })}
                      className="inline-flex items-center gap-1 mt-2 text-sm text-blue-600 hover:underline"
                    >
                      View Details <I.chev/>
                    </button>
                  </div>
                </div>
              </div>
            })}

            <ReceiptModal 
              isOpen={receiptModal.isOpen}
              onClose={() => setReceiptModal((prev: ReceiptModalState) => ({ ...prev, isOpen: false }))}
              title={receiptModal.title}
              amount={receiptModal.amount}
              dept={receiptModal.dept}
              date={receiptModal.date}
            />
          </div>
    )
}