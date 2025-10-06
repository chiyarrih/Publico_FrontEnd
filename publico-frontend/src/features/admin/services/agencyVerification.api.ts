import { apiClient } from "../../../config/api";
import { AgencyVerificationData } from "../controller/hooks/useAgencyVerification";

export class AgencyVerificationService {
  // Get all agencies for verification
  static async getAllAgencies(): Promise<AgencyVerificationData[]> {
    try {
      const response = await apiClient.get<AgencyVerificationData[]>("/admin/agencies/verification");
      // Ensure we always return an array
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error("Error fetching agencies:", error);
      throw new Error("Failed to fetch agencies");
    }
  }

  // Get detailed agency information
  static async getAgencyDetails(agencyId: string): Promise<AgencyVerificationData> {
    try {
      const response = await apiClient.get<AgencyVerificationData>(`/admin/agencies/verification/${agencyId}`);
      return response;
    } catch (error) {
      console.error("Error fetching agency details:", error);
      throw new Error("Failed to fetch agency details");
    }
  }

  // Approve agency
  static async approveAgency(agencyId: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.put<{ message: string }>(`/admin/agencies/verification/${agencyId}/approve`);
      return response;
    } catch (error) {
      console.error("Error approving agency:", error);
      throw new Error("Failed to approve agency");
    }
  }

  // Reject agency
  static async rejectAgency(agencyId: string, reason: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.put<{ message: string }>(`/admin/agencies/verification/${agencyId}/reject`, {
        reason
      });
      return response;
    } catch (error) {
      console.error("Error rejecting agency:", error);
      throw new Error("Failed to reject agency");
    }
  }

  // Get agency documents
  static async getAgencyDocuments(agencyId: string): Promise<any[]> {
    try {
      const response = await apiClient.get<any[]>(`/admin/agencies/verification/${agencyId}/documents`);
      return response;
    } catch (error) {
      console.error("Error fetching agency documents:", error);
      throw new Error("Failed to fetch agency documents");
    }
  }

  // Download agency document
  static async downloadDocument(agencyId: string, documentId: string): Promise<Blob> {
    try {
      const response = await apiClient.get<Blob>(`/admin/agencies/verification/${agencyId}/documents/${documentId}/download`);
      return response;
    } catch (error) {
      console.error("Error downloading document:", error);
      throw new Error("Failed to download document");
    }
  }
}
