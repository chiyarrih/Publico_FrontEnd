import { apiClient } from '../../../config/api';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  User
} from '../../../shared/types/auth';

export class AuthService {
  // Registration
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    console.log('🔧 AuthService.register called with:', data);
    console.log('🌐 API Base URL:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');
    
    try {
      // For Agency role with documents, use FormData
      if (data.role === 'Agency' && data.documents) {
        console.log('📎 Detected Agency registration with documents');
        
        const formData = new FormData();
        
        // Add all text fields
        formData.append('role', data.role);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('agency_name', data.agency_name || '');
        formData.append('agency_code', data.agency_code || '');
        formData.append('contact_phone', data.contact_phone || '');
        formData.append('department', data.department || '');
        formData.append('address', data.address || '');
        
        // Add document files
        if (data.documents.agencyLicense) {
          formData.append('agencyLicense', data.documents.agencyLicense);
          console.log('✅ Added agencyLicense:', data.documents.agencyLicense.name);
        }
        if (data.documents.businessCertificate) {
          formData.append('businessCertificate', data.documents.businessCertificate);
          console.log('✅ Added businessCertificate:', data.documents.businessCertificate.name);
        }
        if (data.documents.proofOfInsurance) {
          formData.append('proofOfInsurance', data.documents.proofOfInsurance);
          console.log('✅ Added proofOfInsurance:', data.documents.proofOfInsurance.name);
        }
        
        // Send FormData - apiClient will automatically handle multipart/form-data
        const response = await apiClient.post<AuthResponse>('/auth/user/register', formData);
        
        console.log('✅ API Response:', response);
        return response;
      } else {
        // For other roles (Citizen, Admin), use JSON
        const response = await apiClient.post<AuthResponse>('/auth/user/register', data);
        console.log('✅ API Response:', response);
        return response;
      }
    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  }

  // Login
  static async login(data: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', data);
  }

  // Email Verification
  static async verifyEmail(token: string): Promise<{ message: string }> {
    return apiClient.get<{ message: string }>(`/auth/verifyEmail2/${token}`);
  }

  // Forgot Password
  static async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string; user: User }> {
    return apiClient.post<{ message: string; user: User }>('/auth/sendResetPassword', data);
  }

  // Verify Reset Code
  static async verifyResetCode(email: string, code: string): Promise<{ message: string; valid: boolean }> {
    return apiClient.post<{ message: string; valid: boolean }>('/auth/verifyResetCode', { email, code });
  }

  // Send OTP for email verification (for new registrations)
  static async sendOTP(email: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/auth/sendOTP', { email });
  }

  // Verify OTP for email verification (for new registrations)
  static async verifyOTP(email: string, code: string): Promise<{ message: string; valid: boolean }> {
    return apiClient.post<{ message: string; valid: boolean }>('/auth/verifyOTP', { email, code });
  }

  // Reset Password
  static async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/auth/changePassword', data);
  }

  // Get All Citizens (Admin only)
  static async getAllCitizens(): Promise<{ citizens: User[] }> {
    return apiClient.get<{ citizens: User[] }>('/auth/getAll');
  }

  // Check Agency Name Availability
  static async checkAgencyNameAvailability(agencyName: string): Promise<{ available: boolean; agencyName: string }> {
    return apiClient.get<{ available: boolean; agencyName: string }>(`/auth/check-agency-name/${encodeURIComponent(agencyName)}`);
  }

  // Profile Management
  static async getUserProfile(userId: string): Promise<User> {
    return apiClient.get<User>(`/auth/profile/${userId}`);
  }

  static async getUserProfileByEmail(email: string): Promise<User> {
    // Try the working endpoint used by admin/agency services
    return apiClient.get<User>(`/admin/auth/management/fetch/${email}`);
  }

  static async getCitizenProfile(email: string): Promise<User> {
    // Use the dedicated citizen profile endpoint
    return apiClient.get<User>(`/citizen/auth/profile/${email}`);
  }

  static async getCitizenProfileFromAll(email: string): Promise<User> {
    // Get all citizens and filter for the specific user
    const response = await apiClient.get<{ citizens: User[] }>('/auth/getAll');
    const citizen = response.citizens.find(c => c.email === email);
    if (!citizen) {
      throw new Error('Citizen not found');
    }
    return citizen;
  }


  static async updateUserProfile(userId: string, data: Partial<User>): Promise<User> {
    return apiClient.put<User>(`/auth/profile/${userId}`, data);
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/auth/changePassword/${userId}`, {
      currentPassword,
      newPassword
    });
  }
}