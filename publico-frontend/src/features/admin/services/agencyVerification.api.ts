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
  static async downloadDocument(agencyId: string, documentId: string, fileName: string): Promise<void> {
    try {
      // Get the auth token - use the correct key from auth.ts
      const token = localStorage.getItem('publico_auth_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Get the base URL
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      // Create the download URL
      const url = `${baseURL}/admin/agencies/verification/${agencyId}/documents/${documentId}/download`;
      
      // Fetch the file
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download document');
      }

      // Get the blob
      const blob = await response.blob();
      
      // Create a download link and trigger download
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading document:", error);
      throw new Error("Failed to download document");
    }
  }

  // Delete/Remove agency
  static async deleteAgency(agencyId: string): Promise<{ message: string; agency: any }> {
    try {
      const response = await apiClient.delete<{ message: string; agency: any }>(`/admin/agencies/verification/${agencyId}/delete`);
      return response;
    } catch (error) {
      console.error("Error deleting agency:", error);
      throw new Error("Failed to delete agency");
    }
  }
}
