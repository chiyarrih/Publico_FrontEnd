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
      const response = await apiClient.post<AuthResponse>('/auth/user/register', data);
      console.log('✅ API Response:', response);
      return response;
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