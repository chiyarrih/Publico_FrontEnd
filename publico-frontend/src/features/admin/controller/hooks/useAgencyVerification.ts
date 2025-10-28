import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { AgencyVerificationService } from "../../services/agencyVerification.api";

export interface AgencyVerificationData {
  _id: string;
  agency_id: string;
  agency_name: string;
  email: string;
  department: string;
  contact_phone: string;
  address: string;
  date_registered: string;
  isPending: boolean;
  isVerified: boolean; // Email verification status
  isAgencyVerified?: boolean; // Agency application approval status
  status: "Approved" | "Pending" | "Rejected";
  documents?: Array<{
    name: string;
    size: number;
    type: string;
    url: string;
  }>;
  verification_log?: Array<{
    action: string;
    date: string;
    admin?: string;
  }>;
}

export function useAgencyVerification() {
  const [agencies, setAgencies] = useState<AgencyVerificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [allAgencies, setAllAgencies] = useState<AgencyVerificationData[]>([]);
  const itemsPerPage = 10;

  const applyFiltersAndPagination = useCallback((
    data: AgencyVerificationData[], 
    page: number, 
    status: string, 
    search: string
  ) => {
    // Apply filters
    let filtered = data.filter(agency => {
      const matchesSearch = 
        agency.agency_name?.toLowerCase().includes(search.toLowerCase()) ||
        agency.email?.toLowerCase().includes(search.toLowerCase()) ||
        agency.department?.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = status === "All Statuses" || agency.status === status;
      
      return matchesSearch && matchesStatus;
    });

    // Apply pagination
    const totalFilteredItems = filtered.length;
    const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedAgencies = filtered.slice(startIndex, endIndex);

    setAgencies(paginatedAgencies);
    setTotalPages(totalPages);
  }, [itemsPerPage]);

  const fetchAgencies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AgencyVerificationService.getAllAgencies();
      // Ensure data is always an array
      const agenciesData = Array.isArray(data) ? data : [];
      setAllAgencies(agenciesData);
      
      // Apply pagination and filtering
      applyFiltersAndPagination(agenciesData, currentPage, statusFilter, searchTerm);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch agencies";
      setError(errorMessage);
      console.error("Error fetching agencies:", err);
      // Set empty array on error to prevent undefined filter calls
      setAgencies([]);
      setAllAgencies([]);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, searchTerm, applyFiltersAndPagination]);

  const refreshAgencies = useCallback(() => {
    fetchAgencies();
  }, [fetchAgencies]);

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
    applyFiltersAndPagination(allAgencies, 1, statusFilter, search);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    applyFiltersAndPagination(allAgencies, 1, status, searchTerm);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    applyFiltersAndPagination(allAgencies, page, statusFilter, searchTerm);
  };

  const approveAgency = async (agencyId: string) => {
    try {
      await AgencyVerificationService.approveAgency(agencyId);
      await fetchAgencies(); // Refresh the list
      toast.success("Agency approved successfully!");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to approve agency";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  const rejectAgency = async (agencyId: string, reason: string) => {
    try {
      await AgencyVerificationService.rejectAgency(agencyId, reason);
      await fetchAgencies(); // Refresh the list
      toast.success("Agency rejected successfully!");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to reject agency";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  const getAgencyDetails = async (agencyId: string) => {
    try {
      return await AgencyVerificationService.getAgencyDetails(agencyId);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch agency details";
      setError(errorMessage);
      throw err;
    }
  };

  const deleteAgency = async (agencyId: string) => {
    try {
      await AgencyVerificationService.deleteAgency(agencyId);
      await fetchAgencies(); // Refresh the list
      toast.success("Agency removed successfully!");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete agency";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchAgencies();
  }, [fetchAgencies]);

  return {
    agencies,
    loading,
    error,
    searchTerm,
    statusFilter,
    currentPage,
    totalPages,
    setSearchTerm,
    setStatusFilter,
    handleSearchChange,
    handleStatusChange,
    handlePageChange,
    refreshAgencies,
    approveAgency,
    rejectAgency,
    getAgencyDetails,
    deleteAgency,
  };
}
