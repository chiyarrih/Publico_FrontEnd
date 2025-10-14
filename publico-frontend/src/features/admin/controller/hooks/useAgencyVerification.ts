import { useState, useEffect } from "react";
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
  status: "Pending" | "Approved" | "Rejected";
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

  const fetchAgencies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AgencyVerificationService.getAllAgencies();
      // Ensure data is always an array
      setAgencies(Array.isArray(data) ? data : []);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch agencies";
      setError(errorMessage);
      console.error("Error fetching agencies:", err);
      // Set empty array on error to prevent undefined filter calls
      setAgencies([]);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshAgencies = () => {
    fetchAgencies();
  };

  const approveAgency = async (agencyId: string) => {
    try {
      await AgencyVerificationService.approveAgency(agencyId);
      await fetchAgencies(); // Refresh the list
      toast.success("Agency approved successfully!");
    } catch (err: any) {
      const errorMessage = err.message || "Failed to approve agency";
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
    } catch (err: any) {
      const errorMessage = err.message || "Failed to reject agency";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  const getAgencyDetails = async (agencyId: string) => {
    try {
      return await AgencyVerificationService.getAgencyDetails(agencyId);
    } catch (err: any) {
      setError(err.message || "Failed to fetch agency details");
      throw err;
    }
  };

  useEffect(() => {
    fetchAgencies();
  }, []);

  return {
    agencies,
    loading,
    error,
    searchTerm,
    statusFilter,
    setSearchTerm,
    setStatusFilter,
    refreshAgencies,
    approveAgency,
    rejectAgency,
    getAgencyDetails,
  };
}
