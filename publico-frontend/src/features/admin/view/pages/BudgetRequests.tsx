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
          isFunded={selectedProposal.isFunded}//TODO: call the project is already funded here
          onApproved={()=>{
            onApprove()
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
