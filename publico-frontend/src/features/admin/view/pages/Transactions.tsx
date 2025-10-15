import React, { useState, useEffect, useRef } from "react";
import { Table, Input, Select, Button, Badge, Card } from "../ui/blocks";
import useAdminTransactions from "../../controller/hooks/useAdminTransactions";
import TransactionDetailsModal from "../modals/TransactionDetailsModal";
import type { BudgetProposal } from "../../model/types/admin";
import useLedger from "@agency/controller/hooks/useLedger";

export default function Transactions(){
  const { ledgers,
      page,
      totalPages,
      loading,
      statusFilter,
      searchQuery,
      typeFilter,
      dateRange,
      showDatePicker,
      handleStatusChange,
      handleSearchChange,
      handleTypeChange,
      handleDateRangeChange,
      clearDateRange,
      toggleDatePicker,
      handlePageChange,
      refreshLedgers,setPage } = useLedger();
  
  const [selectedProposal, setSelectedProposal] = useState<BudgetProposal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const datePickerRef = useRef<HTMLDivElement>(null);

  const handleViewDetails = (proposal: BudgetProposal) => {
    setSelectedProposal(proposal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProposal(null);
  };

  const handleApplyDateRange = () => {
    if (startDate && endDate) {
      handleDateRangeChange(startDate, endDate);
      toggleDatePicker();
    }
  };

  const handleClearDateRange = () => {
    setStartDate('');
    setEndDate('');
    clearDateRange();
    toggleDatePicker();
  };

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        if (showDatePicker) {
          toggleDatePicker();
        }
      }
    };

    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker, toggleDatePicker]);

  const tone = (s: string) => {
    if (s === "Approved") return "green";
    if (s === "Pending") return "yellow";
    if (s === "Rejected") return "red";
    return "gray";
  };

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
            value={searchQuery} 
            onChange={e => handleSearchChange(e.target.value)} 
            className="w-full sm:w-96"
          />
          <div className="ml-auto flex items-center gap-2">
            <Select value={typeFilter} onChange={e => handleTypeChange(e.target.value)}>
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
            <div className="relative" ref={datePickerRef}>
              <Button 
                onClick={toggleDatePicker}
                className={`border ${dateRange ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-300'}`}
              >
                <svg className="w-4 h-4 mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {dateRange ? `${dateRange.start} - ${dateRange.end}` : 'Date Range'}
              </Button>
              
              {showDatePicker && (
                <div className="absolute right-0 top-full mt-2 p-4 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-80">
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-slate-900">Select Date Range</h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Start Date
                        </label>
                        <Input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          End Date
                        </label>
                        <Input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={handleApplyDateRange}
                        disabled={!startDate || !endDate}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Apply Filter
                      </Button>
                      <Button
                        onClick={handleClearDateRange}
                        className="px-3 border border-slate-300 hover:bg-slate-50"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-500">Loading transactions...</div>
        ) : ledgers.length === 0 ? (
          <div className="py-8 text-center text-slate-500">No transactions found</div>
        ) : (
          <>
            <Table
              head={["Transaction ID", "Date", "Department", "Project", "Amount", "Status", "Digital Signature", "Actions"]}
              rows={ledgers.map(proposal => [
                <a 
                  onClick={() => handleViewDetails(proposal)}
                  className="text-sky-600 hover:underline cursor-pointer"
                >
                  {proposal.txId}
                </a>,
                new Date(proposal.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
                proposal.department,
                proposal.projectName,
                "₱" + proposal.amount.toLocaleString(),
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
