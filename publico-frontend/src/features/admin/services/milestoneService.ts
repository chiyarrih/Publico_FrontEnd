import { API_BASE_URL } from '../../../config/api';

export interface ProofOfWork {
  documentId: string;
  documentType: string;
  description: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  verificationStatus: 'Pending Verification' | 'Verified' | 'Rejected';
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface RequiredDocument {
  documentType: string;
  description: string;
  isRequired: boolean;
}

export interface Phase {
  phaseNumber: number;
  phaseName: string;
  description: string;
  budget: number;
  budgetEth: number;
  spent: number;
  spentEth: number;
  progress: number;
  status: 'Pending' | 'In Progress' | 'Completed' | 'On Hold';
  startDate: string;
  endDate: string;
  requiredDocuments: RequiredDocument[];
  proofOfWork: ProofOfWork[];
  budgetReleased: boolean;
  budgetReleaseDate?: string;
  budgetReleaseTxHash?: string;
  completionDate?: string;
}

export interface Alert {
  type: 'budget_exceeded' | 'budget_under' | 'phase_delay' | 'document_pending' | 'phase_completed';
  phaseNumber?: number;
  message: string;
  amount?: number;
  amountEth?: number;
  isRead: boolean;
  createdAt: string;
}

export interface ProjectMilestone {
  _id: string;
  projectId: string;
  agencyId: {
    _id: string;
    name: string;
    email: string;
  };
  projectName: string;
  department: string;
  totalBudget: number;
  totalBudgetEth: number;
  overallProgress: number;
  overallStatus: 'Planning' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';
  startDate: string;
  endDate: string;
  proposedBy: string;
  approvedBy: {
    _id: string;
    name: string;
    email: string;
  };
  phases: Phase[];
  alerts: Alert[];
  createdAt: string;
  updatedAt: string;
}

export interface PhaseInput {
  phaseName: string;
  description: string;
  budget: number;
  spent: number;
  progress: number;
  status: 'Pending' | 'In Progress' | 'Completed' | 'On Hold';
  startDate: string;
  endDate: string;
  requiredDocuments: RequiredDocument[];
}

export interface CreateMilestoneRequest {
  projectId: string;
  phases: PhaseInput[];
  proposedBy: string;
}

export interface StartPhaseRequest {
  milestoneId: string;
  phaseNumber: number;
  privateKey: string;
}

export interface UploadProofRequest {
  milestoneId: string;
  phaseNumber: number;
  documentType: string;
  description: string;
  file: File;
}

export interface VerifyProofRequest {
  milestoneId: string;
  phaseNumber: number;
  documentId: string;
  verificationStatus: 'Verified' | 'Rejected';
  rejectionReason?: string;
}

export interface UpdateProgressRequest {
  milestoneId: string;
  phaseNumber: number;
  progress: number;
  spent?: number;
}

class MilestoneService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('publico_auth_token');
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'An error occurred');
    }

    return response.json();
  }

  async createMilestone(data: CreateMilestoneRequest): Promise<ProjectMilestone> {
    return this.request<ProjectMilestone>('/milestone/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMilestones(agencyId: string = 'all', params?: {
    page?: number;
    limit?: number;
    status?: string;
    department?: string;
  }): Promise<{
    data: ProjectMilestone[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
  }> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.department) searchParams.append('department', params.department);

    const queryString = searchParams.toString();
    const url = `/milestone/projects/${agencyId}${queryString ? `?${queryString}` : ''}`;
    
    return this.request(url);
  }

  async getMilestoneById(id: string): Promise<ProjectMilestone> {
    return this.request<ProjectMilestone>(`/milestone/${id}`);
  }

  async startPhase(data: StartPhaseRequest): Promise<{
    message: string;
    phase: Phase;
    transaction: any;
  }> {
    return this.request('/milestone/start-phase', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async uploadProof(data: UploadProofRequest): Promise<{
    message: string;
    proofOfWork: ProofOfWork;
  }> {
    const formData = new FormData();
    formData.append('milestoneId', data.milestoneId);
    formData.append('phaseNumber', data.phaseNumber.toString());
    formData.append('documentType', data.documentType);
    formData.append('description', data.description);
    formData.append('file', data.file);

    const token = localStorage.getItem('publico_auth_token');
    const response = await fetch(`${API_BASE_URL}/milestone/upload-proof`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  }

  async verifyProof(data: VerifyProofRequest): Promise<{
    message: string;
    proofOfWork: ProofOfWork;
  }> {
    return this.request('/milestone/verify-proof', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateProgress(data: UpdateProgressRequest): Promise<{
    message: string;
    phase: Phase;
  }> {
    return this.request('/milestone/update-progress', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getMilestoneAlerts(milestoneId: string): Promise<Alert[]> {
    return this.request<Alert[]>(`/milestone/${milestoneId}/alerts`);
  }

  async markAlertAsRead(milestoneId: string, alertIndex: number): Promise<{
    message: string;
  }> {
    return this.request(`/milestone/${milestoneId}/alerts/${alertIndex}/read`, {
      method: 'PUT',
    });
  }
}

export const milestoneService = new MilestoneService();
