import { apiClient } from '../../../../config/api';
import {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  User
} from '../../../../shared/types/auth';

export class AuthService {
  // Registration
  static async register(data: RegisterRequest): Promise<RegisterResponse> {
    console.log('🔧 AuthService.register called with:', data);
    console.log('🌐 API Base URL:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');
    try {
      const response = await apiClient.post<RegisterResponse>('/auth/user/register', data);
      console.log('✅ API Response:', response);
      return response;
    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  }

  // Login
  static async login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/login', data);
  }

  // Email Verification
  static async verifyEmail(token: string): Promise<{ message: string }> {
    return apiClient.get<{ message: string }>(`/auth/verifyEmail2/${token}`);
  }

  // Forgot Password
  static async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string; user: User }> {
    return apiClient.post<{ message: string; user: User }>('/auth/sendResetPassword', data);
  }

  // Reset Password
  static async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/auth/changePassword', data);
  }

  // Get All Citizens (Admin only)
  static async getAllCitizens(): Promise<{ citizens: User[] }> {
    return apiClient.get<{ citizens: User[] }>('/auth/getAll');
  }
}