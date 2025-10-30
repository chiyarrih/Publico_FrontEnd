import React, { useEffect, useMemo, useRef, useState } from "react";
import { AdminService } from "../../services/admin.api";
import { Card } from "../ui/blocks";
import type { BudgetProposal } from "../../model/types/admin";
import {
  BudgetRequestsTable,
  BudgetRequestsFilters,
  BudgetRequestsPagination,
} from "../../controller/components/budget-requests";
import ProjectApprovalModal from "../modals/ProjectApprovalModal";
import { useNavigate } from "react-router-dom";
import useSendFunds from "@admin/controller/hooks/useSendFunds";
import { io, Socket } from "socket.io-client";
import { Button } from "../ui/blocks";
import toast from "react-hot-toast";
import { rejectBudget } from "../../services/sendFundsService";

export default function BudgetRequests() {
  const [items, setItems] = useState<BudgetProposal[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState<BudgetProposal | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const itemsPerPage = 10;
  const socketRef = useRef<Socket | null>(null);
  const token = localStorage.getItem('publico_auth_token');
  const navigate = useNavigate();
  const {onApprove} = useSendFunds({projectId:selectedProposal?.projectId});
  const loadProposals = async () => {
    setLoading(true);
    try {
      const response = await AdminService.getAllBudgetProposals(
        currentPage,
        itemsPerPage,
        selectedStatus
      );
      setItems(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch budget proposals:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProposals();
  }, [currentPage, selectedStatus]);
  
  useEffect(() => {
  const socket = io('http://localhost:5000', {
    auth: { token },
  });

  socketRef.current = socket;

    socket.on('project_updated', (updatedProject) => {
    setItems((prev) =>
      prev.map((item) =>
        item.projectId === updatedProject.projectId ? updatedProject : item
      )
    );
  });


  return () => {
    socket.disconnect();
  };
}, [token]);


  // Filter logic - search only (department and status filtering done via API)
  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = [item.projectId, item.department, item.projectName]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesDept =
        selectedDepartment === "All" || item.department === selectedDepartment;
      return matchesSearch && matchesDept;
    });
  }, [items, searchQuery, selectedDepartment]);

  const handleView = (proposal: BudgetProposal) => {
    setSelectedProposal(proposal);
    setShowApprovalModal(true);
  };

  

  const handleReject = async (proposal: BudgetProposal) => {
    // Use toast for confirmation instead of browser confirm
    const confirmed = await new Promise<boolean>((resolve) => {
      toast((t) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold">Reject Budget Request?</p>
          <p className="text-sm text-gray-600">Project: {proposal.projectName}</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
              className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Reject
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
              className="px-4 py-2 text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ), { duration: Infinity });
    });
    
    if (!confirmed) return;

    try {
      // Try API call first
      await rejectBudget({projectId: proposal.projectId});
      // Only update UI if API call succeeds
      setItems(prev => prev.map(p => p._id === proposal._id ? { ...p, status: "Rejected" } : p));
      setSelectedProposal({ ...proposal, status: "Rejected" });
      setShowApprovalModal(true);
      toast.success(`Budget request for "${proposal.projectName}" has been rejected`);
    } catch (err) {
      console.error("Failed to reject proposal:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      toast.error(`Failed to reject proposal: ${errorMessage}`);
      // Don't update UI state or reopen modal on error
      return;
    }
  };

  const handleDelete = async (proposal: BudgetProposal) => {
    // Use toast for confirmation
    const confirmed = await new Promise<boolean>((resolve) => {
      toast((t) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-red-600">Delete Budget Request?</p>
          <p className="text-sm text-gray-600">Project: {proposal.projectName}</p>
          <p className="text-xs text-red-500">This action cannot be undone.</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
              className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
              className="px-4 py-2 text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ), { duration: Infinity });
    });
    
    if (!confirmed) return;
    
    try {
      await AdminService.deleteBudgetProposal(proposal.projectId);
      // Reload proposals
      loadProposals();
      toast.success(`Budget request "${proposal.projectName}" has been deleted`);
    } catch (err) {
      console.error("Failed to delete proposal:", err);
      toast.error("Failed to delete proposal. Please try again.");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleExport = () => {
    try {
      // Create CSV content with proper escaping
      const csvHeaders = ['Project ID', 'Date', 'Department', 'Project Name', 'Amount', 'Current Spending', 'Status'];
      const csvRows = filtered.map(item => [
        item.projectId || '',
        new Date(item.createdAt).toLocaleDateString(),
        item.department || '',
        item.projectName || '',
        `₱${(item.amountRequested || 0).toLocaleString()}`,
        `₱${(item.currentSpending || 0).toLocaleString()}`,
        item.status || ''
      ]);

      // Escape special characters in CSV cells
      const escapeCSV = (cell: string) => {
        if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
          return `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      };

      const csvContent = [
        csvHeaders.map(escapeCSV).join(','),
        ...csvRows.map(row => row.map(escapeCSV).join(','))
      ].join('\n');

      // Add BOM for UTF-8 to ensure Excel opens it correctly
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Create and trigger download
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = `budget_requests_${new Date().toISOString().split('T')[0]}.csv`;
      
      // Ensure button is in DOM before clicking
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      toast.success('CSV file downloaded successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export CSV. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Loading budget requests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Budget Requests</h1>
        <Button 
          onClick={handleExport}
          disabled={filtered.length === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="inline-block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Data
        </Button>
      </div>

      <Card>
        {/* Filters */}
        <div className="mb-4">
          <BudgetRequestsFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedDepartment={selectedDepartment}
            onDepartmentChange={setSelectedDepartment}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
          />
        </div>

        {/* Table */}
        <BudgetRequestsTable
          requests={filtered}
          onView={handleView}
          onDelete={handleDelete}
        />

        {/* Pagination */}
        {filtered.length > 0 && (
          <BudgetRequestsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        )}
      </Card>

      {/* Project Approval Modal */}
      {selectedProposal && (
        <ProjectApprovalModal
          status={selectedProposal.status}
          isFunded={selectedProposal.isFunded}
          onApproved={()=>{
            onApprove()
            setShowApprovalModal(false)
          }}
          isOpen={showApprovalModal}
          onClose={() => setShowApprovalModal(false)}
          proposal={selectedProposal}
          onReject={() => handleReject(selectedProposal)}
          onSendFunds={() => {
            setShowApprovalModal(false);
            navigate("/admin/send-budget", { state: { proposal: selectedProposal } });
          }}
        />
      )}
    </div>
  );
}
