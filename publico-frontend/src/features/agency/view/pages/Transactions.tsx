import useLedger from "@agency/controller/hooks/useLedger";
import React, { useState, useEffect, useRef } from "react";

type Row = {
  date: string;
  dept: string;
  proj: string;
  amt: string;
  status: "Verified" | "Pending";
  sig: string;
};

const Tag: React.FC<{ s: Row["status"] }> = ({ s }) => (
  <span
    className={`text-xs px-2 py-0.5 rounded ${
      s === "Verified"
        ? "bg-emerald-100 text-emerald-700"
        : "bg-amber-100 text-amber-700"
    }`}
  >
    {s}
  </span>
);

export default function Transactions() {
  const { ledgers,
    page,
    totalPages,
    loading,
    statusFilter,
    searchQuery,
    dateRange,
    showDatePicker,
    handleStatusChange,
    handleSearchChange,
    handleDateRangeChange,
    clearDateRange,
    toggleDatePicker,
    handlePageChange,
    refreshLedgers,
    setPage } = useLedger();

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [dateError, setDateError] = useState<string>('');
  const datePickerRef = useRef<HTMLDivElement>(null);

  const statuses = ["All", "Pending", "Approved", "Rejected"];

  // Validate date range
  const validateDateRange = (start: string, end: string): boolean => {
    if (!start || !end) return true; // Allow empty dates
    
    const startDateObj = new Date(start);
    const endDateObj = new Date(end);
    
    if (endDateObj < startDateObj) {
      setDateError('End date cannot be before start date');
      return false;
    }
    
    setDateError('');
    return true;
  };

  const handleStartDateChange = (newStartDate: string) => {
    setStartDate(newStartDate);
    if (endDate) {
      validateDateRange(newStartDate, endDate);
    }
  };

  const handleEndDateChange = (newEndDate: string) => {
    setEndDate(newEndDate);
    if (startDate) {
      validateDateRange(startDate, newEndDate);
    }
  };

  const handleApplyDateRange = () => {
    if (startDate && endDate && validateDateRange(startDate, endDate)) {
      handleDateRangeChange(startDate, endDate);
      toggleDatePicker();
      setDateError('');
    }
  };

  const handleClearDateRange = () => {
    setStartDate('');
    setEndDate('');
    setDateError('');
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

  return (
    <div className="space-y-4">
      {/* Header Filters */}
      <div className="p-4 bg-white border rounded-lg border-slate-200">
        <div className="text-lg font-semibold">Transaction Ledger</div>
        <div className="flex items-center gap-2 mt-3">
          <input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-3 text-sm border rounded h-9 border-slate-300"
          />
          
          {/* Date Range Picker */}
          <div className="relative" ref={datePickerRef}>
            <button
              onClick={toggleDatePicker}
              className={`px-3 text-sm border rounded h-9 border-slate-300 whitespace-nowrap ${
                dateRange ? 'bg-blue-50 border-blue-500 text-blue-700' : ''
              }`}
            >
              {dateRange ? `${dateRange.start} - ${dateRange.end}` : 'All Dates'}
            </button>
            
            {showDatePicker && (
              <div className="absolute right-0 top-full mt-2 p-4 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-80">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900">Select Date Range</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        max={endDate}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                        className={`w-full px-3 text-sm border rounded h-9 ${
                          dateError ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        min={startDate}
                        onChange={(e) => handleEndDateChange(e.target.value)}
                        className={`w-full px-3 text-sm border rounded h-9 ${
                          dateError ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                    </div>
                  </div>
                  
                  {dateError && (
                    <div className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded">
                      {dateError}
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleApplyDateRange}
                      disabled={!startDate || !endDate || !!dateError}
                      className="flex-1 px-3 text-sm bg-blue-600 text-white rounded h-9 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Apply Filter
                    </button>
                    <button
                      onClick={handleClearDateRange}
                      className="px-3 text-sm border rounded h-9 border-slate-300 hover:bg-slate-50"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Status Filter */}
          <select 
            value={statusFilter} 
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-2 text-sm border rounded h-9 border-slate-300"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>{status === "All" ? "All Statuses" : status}</option>
            ))}
          </select>

          <button
            onClick={() => {
              try {
                // Format the CSV content with proper escaping
                const csvContent = [
                  ['Date', 'Department', 'Project', 'Amount', 'Signature'].join(','),
                  ...ledgers.map((r: any) => [
                    new Date(r.createdAt).toLocaleDateString(),
                    `"${(r.department || '').replace(/"/g, '""')}"`,
                    `"${(r.projectName || '').replace(/"/g, '""')}"`,
                    r.amount || 0,
                    `"${(r.blockchainTxHash || '').replace(/"/g, '""')}"`
                  ].join(','))
                ].join('\n');
                
                // Create blob and download
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                
                console.log('✅ CSV exported successfully:', ledgers.length, 'records');
              } catch (error) {
                console.error('❌ Error exporting CSV:', error);
                alert('Failed to export CSV. Please try again.');
              }
            }}
            className="px-3 text-sm border rounded h-9 border-slate-300 hover:bg-slate-50 whitespace-nowrap"
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto bg-white border rounded-lg border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Department</th>
              <th className="px-4 py-3 text-left">Project</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Signature</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-6 text-center text-slate-500">
                  Loading transactions...
                </td>
              </tr>
            ) : (
              ledgers.map((r: any, i: number) => (
                <tr key={i} className="border-t">
                  <td className="px-4 py-3">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{r.department || "—"}</td>
                  <td className="px-4 py-3">{r.projectName || "—"}</td>
                  <td className="px-4 py-3">${r.amount?.toLocaleString() || 0}</td>
                  <td className="px-4 py-3">
                    {r.blockchainTxHash
                      ? r.blockchainTxHash.slice(0, 10) + "…"
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-blue-600 hover:underline">...</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-3 text-xs border-t text-slate-500">
          Showing page {page} of {totalPages}
          <div className="float-right space-x-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-2 py-1 border rounded ${
                  page === i + 1 ? "bg-blue-500 text-white" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-2 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="p-3 text-xs bg-white border rounded-lg border-slate-200 text-slate-600">
        All transactions are immutably recorded on the blockchain for complete
        transparency.
      </div>
    </div>
  );
}
