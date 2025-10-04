import React, { useMemo, useState } from "react";
import { Table, Input, Select, Button, Badge, Card } from "../ui/blocks";
import useAdminTransactions from "../../controller/hooks/useAdminTransactions";
import TransactionDetailsModal from "../modals/TransactionDetailsModal";
import type { BudgetProposal } from "../../model/types/admin";

export default function Transactions(){
  const { proposals, loading, statusFilter, handleStatusChange, page, totalPages, handlePageChange, handleDelete } = useAdminTransactions();
  const [q, setQ] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [selectedProposal, setSelectedProposal] = useState<BudgetProposal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (proposal: BudgetProposal) => {
    setSelectedProposal(proposal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProposal(null);
  };

  const tone = (s: string) => {
    if (s === "Approved") return "green";
    if (s === "Pending") return "yellow";
    if (s === "Rejected") return "red";
    return "gray";
  };

  const filtered = useMemo(() => {
    return proposals.filter(proposal => {
      const searchMatch = [
        proposal.projectId,
        proposal.projectName,
        proposal.department,
        proposal.category
      ].join(" ").toLowerCase().includes(q.toLowerCase());

      const deptMatch = deptFilter === "All" || proposal.department === deptFilter;

      return searchMatch && deptMatch;
    });
  }, [proposals, q, deptFilter]);

  const departments = [
    "Department of Health",
    "Department of Education", 
    "Department of Public Works and Highways"
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Transaction Ledger</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <svg className="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Ledger
        </Button>
      </div>

      <Card>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Input 
            placeholder="Search transactions by ID, project, department…" 
            value={q} 
            onChange={e => setQ(e.target.value)} 
            className="w-full sm:w-96"
          />
          <div className="ml-auto flex items-center gap-2">
            <Select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
              <option value="All">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </Select>
            <Select value={statusFilter} onChange={e => handleStatusChange(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </Select>
            <Button className="border border-slate-300">
              <svg className="w-4 h-4 mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Date Range
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-500">Loading transactions...</div>
        ) : filtered.length === 0 ? (
          <div className="py-8 text-center text-slate-500">No transactions found</div>
        ) : (
          <>
            <Table
              head={["Transaction ID", "Date", "Department", "Project", "Amount", "Status", "Digital Signature", "Actions"]}
              rows={filtered.map(proposal => [
                <a 
                  onClick={() => handleViewDetails(proposal)}
                  className="text-sky-600 hover:underline cursor-pointer"
                >
                  {proposal.projectId}
                </a>,
                new Date(proposal.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
                proposal.department,
                proposal.projectName,
                "₱" + proposal.amountRequested.toLocaleString(),
                <Badge tone={tone(proposal.status)}>{proposal.status}</Badge>,
                <code className="text-xs text-slate-500">{proposal.blockchainTxHash ? proposal.blockchainTxHash.slice(0, 12) + '...' : '—'}</code>,
                <div className="flex gap-3 items-center">
                  <button 
                    onClick={() => handleViewDetails(proposal)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="View details"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDelete(proposal._id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ])}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between px-4 py-3 border-t">
                <div className="text-sm text-slate-500">
                  Page {page} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </Button>
                  <Button 
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        proposal={selectedProposal}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
