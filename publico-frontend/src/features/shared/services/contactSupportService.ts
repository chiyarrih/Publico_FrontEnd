import { apiClient, API_BASE_URL } from '../../../config/api';
import { getAuthToken } from '../../../utils/auth';

export interface ContactSupportRequest {
  name: string;
  email: string;
  userRole: 'Citizen' | 'Agency' | 'Admin';
  issueType: string;
  message: string;
  attachment?: File;
}

export interface ContactSupportResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    status: string;
  };
}

export interface ContactSupportRequestData {
  _id: string;
  name: string;
  email: string;
  userRole: string;
  issueType: string;
  message: string;
  attachment?: {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
  };
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  adminResponse?: string;
  adminRespondedBy?: string;
  adminRespondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactSupportListResponse {
  success: boolean;
  data: {
    requests: ContactSupportRequestData[];
    pagination: {
      current: number;
      total: number;
      count: number;
      totalCount: number;
    };
  };
}

export interface ContactSupportStats {
  success: boolean;
  data: {
    overall: {
      total: number;
      open: number;
      inProgress: number;
      resolved: number;
      closed: number;
    };
    byRole: Array<{
      _id: string;
      count: number;
    }>;
    byIssueType: Array<{
      _id: string;
      count: number;
    }>;
  };
}

export class ContactSupportService {
  /**
   * Submit a contact support request
   */
  static async submitRequest(request: ContactSupportRequest): Promise<ContactSupportResponse> {
    const formData = new FormData();
    formData.append('name', request.name);
    formData.append('email', request.email);
    formData.append('userRole', request.userRole);
    formData.append('issueType', request.issueType);
    formData.append('message', request.message);
    
    if (request.attachment) {
      formData.append('attachment', request.attachment);
    }

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/contact-support/submit`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Get contact support requests (Admin only)
   */
  static async getRequests(params?: {
    status?: string;
    userRole?: string;
    page?: number;
    limit?: number;
  }): Promise<ContactSupportListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.userRole) queryParams.append('userRole', params.userRole);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const endpoint = `/admin/contact-support${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiClient.get<ContactSupportListResponse>(endpoint);
  }

  /**
   * Get single contact support request (Admin only)
   */
  static async getRequest(id: string): Promise<{ success: boolean; data: ContactSupportRequestData }> {
    return await apiClient.get<{ success: boolean; data: ContactSupportRequestData }>(`/admin/contact-support/${id}`);
  }

  /**
   * Update contact support request status (Admin only)
   */
  static async updateRequestStatus(
    id: string, 
    updates: {
      status?: string;
      adminResponse?: string;
      priority?: string;
    }
  ): Promise<{ success: boolean; message: string; data: ContactSupportRequestData }> {
    return await apiClient.put<{ success: boolean; message: string; data: ContactSupportRequestData }>(
      `/admin/contact-support/${id}`, 
      updates
    );
  }

  /**
   * Get contact support statistics (Admin only)
   */
  static async getStats(): Promise<ContactSupportStats> {
    return await apiClient.get<ContactSupportStats>('/admin/contact-support/stats/overview');
  }
}
