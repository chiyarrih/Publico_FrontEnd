import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { AdminService } from '@admin/services/admin.api';
import type { BudgetProposal } from '@admin/model/types/admin';

export default function useAdminTransactions() {
  const [proposals, setProposals] = useState<BudgetProposal[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const limit = 10;
  const socketRef = useRef<Socket | null>(null);

  const token = localStorage.getItem('publico_auth_token');

  const loadProposals = async (currentPage: number, status: string) => {
    setLoading(true);
    try {
      const response = await AdminService.getAllBudgetProposals(currentPage, limit, status);
      setProposals(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch budget proposals:', err);
      setProposals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this budget proposal?')) return;
    
    try {
      await AdminService.deleteBudgetProposal(id);
      // Remove from local state
      setProposals(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error('Failed to delete proposal:', err);
      alert('Failed to delete proposal');
    }
  };

  useEffect(() => {
    loadProposals(page, statusFilter);
  }, [page, statusFilter]);

  useEffect(() => {
    const socket = io('http://localhost:3001', {
      auth: { token },
    });

    socketRef.current = socket;

    socket.on('new_submited', (newProposal: BudgetProposal) => {
      console.log('📥 New budget proposal received:', newProposal);
      
      // Only add to list if we're viewing pending proposals and on first page
      if (statusFilter === 'Pending' && page === 1) {
        setProposals((prev) => [newProposal, ...prev.slice(0, limit - 1)]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [token, statusFilter, page]);

  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setPage(1); // Reset to first page when changing filter
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const refreshProposals = () => {
    loadProposals(page, statusFilter);
  };

  return {
    proposals,
    page,
    totalPages,
    loading,
    statusFilter,
    handleStatusChange,
    handlePageChange,
    refreshProposals,
    handleDelete,
  };
}

