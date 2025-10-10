import { useState, useEffect } from 'react';
import { ContactSupportService, ContactSupportRequestData, ContactSupportStats } from '../../../shared/services/contactSupportService';

export interface ContactSupportFilters {
  status?: string;
  userRole?: string;
  page?: number;
  limit?: number;
}

export default function useContactSupport(filters?: ContactSupportFilters) {
  const [requests, setRequests] = useState<ContactSupportRequestData[]>([]);
  const [stats, setStats] = useState<ContactSupportStats['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    count: 0,
    totalCount: 0
  });

  const fetchRequests = async (newFilters?: ContactSupportFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ContactSupportService.getRequests(newFilters || filters);
      setRequests(response.data.requests);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch support requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await ContactSupportService.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch contact support stats:', err);
    }
  };

  const updateRequest = async (
    id: string, 
    updates: { status?: string; adminResponse?: string; priority?: string }
  ) => {
    try {
      await ContactSupportService.updateRequestStatus(id, updates);
      // Refresh the list after update
      await fetchRequests();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update request');
      return false;
    }
  };

  const getRequest = async (id: string) => {
    try {
      const response = await ContactSupportService.getRequest(id);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch request details');
      return null;
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchStats();
  }, []);

  return {
    requests,
    stats,
    loading,
    error,
    pagination,
    fetchRequests,
    fetchStats,
    updateRequest,
    getRequest,
    refetch: () => fetchRequests()
  };
}
