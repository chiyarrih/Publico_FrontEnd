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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [dateRange, setDateRange] = useState<{start: string, end: string} | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const limit = 10;
  const socketRef = useRef<Socket | null>(null);

  const token = localStorage.getItem('publico_auth_token');

  const loadProposals = async (currentPage: number, status: string, search: string = '', department: string = 'All', dateFilter: {start: string, end: string} | null = null) => {
    setLoading(true);
    try {
      // If searching or date filtering, load all pages to get complete results
      if (search.trim() || dateFilter) {
        await loadAllProposalsForSearch(status, search, department, dateFilter);
      } else {
        const response = await AdminService.getAllBudgetProposals(currentPage, limit, status);
        let filteredData = response.data || [];
        
        // Apply client-side filtering for department only
        if (department !== 'All') {
          filteredData = filteredData.filter(proposal => proposal.department === department);
        }
        
        setProposals(filteredData);
        setTotalPages(response.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch budget proposals:', err);
      setProposals([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAllProposalsForSearch = async (status: string, search: string, department: string, dateFilter: {start: string, end: string} | null = null) => {
    try {
      let allProposals: BudgetProposal[] = [];
      let currentPage = 1;
      let hasMore = true;
      
      // Load all pages to get complete dataset for searching
      while (hasMore) {
        const response = await AdminService.getAllBudgetProposals(currentPage, limit, status);
        if (response.data && response.data.length > 0) {
          allProposals = [...allProposals, ...response.data];
          currentPage++;
          hasMore = currentPage <= (response.totalPages || 1);
        } else {
          hasMore = false;
        }
      }
      
      // Apply search, department, and date filters
      let filteredData = allProposals;
      
      if (search.trim()) {
        filteredData = filteredData.filter(proposal => {
          const searchText = [
            proposal.projectId,
            proposal.projectName,
            proposal.department,
            proposal.category
          ].join(" ").toLowerCase();
          return searchText.includes(search.toLowerCase());
        });
      }
      
      if (department !== 'All') {
        filteredData = filteredData.filter(proposal => proposal.department === department);
      }
      
      if (dateFilter) {
        filteredData = filteredData.filter(proposal => {
          const proposalDate = new Date(proposal.createdAt);
          const startDate = new Date(dateFilter.start);
          const endDate = new Date(dateFilter.end);
          
          // Set time to start/end of day for proper comparison
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
          
          return proposalDate >= startDate && proposalDate <= endDate;
        });
      }
      
      setProposals(filteredData);
      setTotalPages(1); // Show all results on one page when searching/filtering
    } catch (err) {
      console.error('Failed to load all proposals for search:', err);
      setProposals([]);
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
    loadProposals(page, statusFilter, searchQuery, departmentFilter, dateRange);
  }, [page, statusFilter, searchQuery, departmentFilter, dateRange]);

  useEffect(() => {
    const socket = io('http://localhost:5000', {
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

  const handleSearchChange = (newSearch: string) => {
    setSearchQuery(newSearch);
    setPage(1); // Reset to first page when searching
    
    // If clearing search, reset to normal pagination
    if (!newSearch.trim()) {
      setTotalPages(1); // Will be updated by loadProposals
    }
  };

  const handleDepartmentChange = (newDepartment: string) => {
    setDepartmentFilter(newDepartment);
    setPage(1); // Reset to first page when changing department filter
  };

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setDateRange({ start: startDate, end: endDate });
    setPage(1); // Reset to first page when changing date range
  };

  const clearDateRange = () => {
    setDateRange(null);
    setPage(1); // Reset to first page when clearing date range
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const refreshProposals = () => {
    loadProposals(page, statusFilter, searchQuery, departmentFilter, dateRange);
  };

  return {
    proposals,
    page,
    totalPages,
    loading,
    statusFilter,
    searchQuery,
    departmentFilter,
    dateRange,
    showDatePicker,
    handleStatusChange,
    handleSearchChange,
    handleDepartmentChange,
    handleDateRangeChange,
    clearDateRange,
    toggleDatePicker,
    handlePageChange,
    refreshProposals,
    handleDelete,
  };
}

