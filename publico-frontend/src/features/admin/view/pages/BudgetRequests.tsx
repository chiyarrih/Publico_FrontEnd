import React, { useEffect, useMemo, useState } from "react";
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
  const navigate = useNavigate();

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

  const handleApprove = async (proposal: BudgetProposal) => {
    // Show confirmation first
    const ok = confirm("Approve this budget request? You can send funds afterward.");
    if (!ok) return;

    try {
      // Try API call first
      await AdminService.approveBudgetProposal(proposal.projectId);
      // Only update UI if API call succeeds
      setItems(prev => prev.map(p => p._id === proposal._id ? { ...p, status: "Approved" } : p));
      setSelectedProposal({ ...proposal, status: "Approved" });
      setShowApprovalModal(true);
    } catch (err) {
      console.error("Failed to approve proposal:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      alert(`Failed to approve proposal: ${errorMessage}`);
      // Don't update UI state or reopen modal on error
      return;
    }
  };

  const handleReject = async (proposal: BudgetProposal) => {
    if (!confirm("Reject this budget request?")) return;

    try {
      // Try API call first
      await AdminService.rejectBudgetProposal(proposal.projectId);
      // Only update UI if API call succeeds
      setItems(prev => prev.map(p => p._id === proposal._id ? { ...p, status: "Rejected" } : p));
      setSelectedProposal({ ...proposal, status: "Rejected" });
      setShowApprovalModal(true);
    } catch (err) {
      console.error("Failed to reject proposal:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      alert(`Failed to reject proposal: ${errorMessage}`);
      // Don't update UI state or reopen modal on error
      return;
    }
  };

  const handleDelete = async (proposal: BudgetProposal) => {
    if (!confirm("Are you sure you want to delete this budget request?")) return;
    
    try {
      await AdminService.deleteBudgetProposal(proposal.projectId);
      // Reload proposals
      loadProposals();
    } catch (err) {
      console.error("Failed to delete proposal:", err);
      alert("Failed to delete proposal");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
      <h1 className="text-2xl font-semibold text-slate-800">Budget Requests</h1>

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
            onMoreFilters={() => console.log("More filters clicked")}
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
          isOpen={showApprovalModal}
          onClose={() => setShowApprovalModal(false)}
          proposal={selectedProposal}
          onApprove={() => handleApprove(selectedProposal)}
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
