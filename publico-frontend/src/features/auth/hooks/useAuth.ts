import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/authApi';
import { 
  LoginRequest, 
  RegisterRequest, 
  User, 
  UserRole,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthResponse
} from '../../../shared/types/auth';
import { 
  setAuthToken, 
  setUserData, 
  getUserData, 
  isAuthenticated, 
  getCurrentUserRole,
  decodeJWT,
  logout as utilLogout
} from '../../../utils/auth';
import toast from 'react-hot-toast';

interface UseAuthReturn {
  user: Partial<User> | null;
  userRole: UserRole | null;
  isAuth: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginRequest) => Promise<AuthResponse | null>;
  loginWithRoleValidation: (data: LoginRequest, expectedRole: UserRole) => Promise<AuthResponse | null>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  forgotPassword: (data: ForgotPasswordRequest) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const userRole = getCurrentUserRole();
  const isAuth = isAuthenticated();

  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setUser(userData);
    }
  }, []);

  const login = async (data: LoginRequest): Promise<AuthResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await AuthService.login(data);
      
      // Debug logging for agency applications
      if (response.role === 'Agency') {
        console.log('🔍 Agency login response:', {
          role: response.role,
          isVerified: response.isVerified,
          isAgencyVerified: response.isAgencyVerified,
          applicationStatus: response.applicationStatus,
          isPending: response.isPending,
          fullResponse: response
        });
      }
      
      // Check email verification for ALL users (this is authentication-related)
      if (response.isVerified === false) {
        setError('Please verify your email before logging in');
        return null;
      }
      
      // For agencies, check application status (this is business logic, not authentication)
      if (response.role === 'Agency') {
        // Agency application status is handled in navigation logic below
        // We don't block login here, just handle navigation
      }
      
      setAuthToken(response.token);
      
      // Extract user ID from JWT token
      const decoded = decodeJWT(response.token);
      const userId = decoded?.id;
      
      const userData = {
        id: userId,
        role: response.role,
        email: data.email,
        user: response
      };
      
      setUserData(userData);
      setUser(userData);
      
      // Navigate based on role and status
      switch (response.role) {
        case 'Admin':
          navigate('/admin/dashboard');
          break;
        case 'Agency':
          if (response.isAgencyVerified === true) {
            // Check if agency has seen the approval page
            const agencyId = (response as any).user_id || (response as any)._id;
            const hasSeenApproval = localStorage.getItem(`agency_approval_seen_${agencyId}`);
            
            if (!hasSeenApproval) {
              // First time seeing approval - show approval page
              navigate('/application-approved', { 
                state: { 
                  email: data.email, 
                  role: 'Agency', 
                  applicationStatus: 'approved',
                  agencyName: response.agency_name || 'Your Agency',
                  agencyId: agencyId
                } 
              });
            } else {
              // Already seen approval page - go directly to dashboard
              navigate('/agency/dashboard');
            }
          } else if (response.isAgencyVerified === false && !response.isPending) {
            navigate('/application-rejected', { 
              state: { email: data.email, role: 'Agency', applicationStatus: 'rejected' } 
            });
          } else {
            // Default case: pending or undefined status - show application under review
            navigate('/application-under-review', { 
              state: { 
                email: data.email, 
                role: 'Agency', 
                applicationStatus: response.applicationStatus || 'pending' 
              } 
            });
          }
          break;
        case 'Citizen':
          navigate('/citizen/dashboard');
          break;
        default:
          navigate('/');
      }
      
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      console.log(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithRoleValidation = async (data: LoginRequest, expectedRole: UserRole): Promise<AuthResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await AuthService.login(data);
      
      // Debug logging for agency applications
      if (response.role === 'Agency') {
        console.log('🔍 Agency loginWithRoleValidation response:', {
          role: response.role,
          isVerified: response.isVerified,
          isAgencyVerified: response.isAgencyVerified,
          applicationStatus: response.applicationStatus,
          isPending: response.isPending,
          fullResponse: response
        });
      }
      
      // Validate role before proceeding
      if (response.role !== expectedRole) {
        setError(`Access denied. This account is registered as ${response.role}, not ${expectedRole}. Please select the correct portal or contact support.`);
        return null;
      }
      
      // Check email verification for ALL users (this is authentication-related)
      if (response.isVerified === false) {
        setError('Please verify your email before logging in');
        return null;
      }
      
      // For agencies, check application status (this is business logic, not authentication)
      if (response.role === 'Agency') {
        // Agency application status is handled in navigation logic below
        // We don't block login here, just handle navigation
      }
      
      setAuthToken(response.token);
      
      // Extract user ID from JWT token
      const decoded = decodeJWT(response.token);
      const userId = decoded?.id;
      
      const userData = {
        id: userId,
        role: response.role,
        email: data.email,
        user: response
      };
      
      setUserData(userData);
      setUser(userData);
      
      // Navigate based on role and status
      switch (response.role) {
        case 'Admin':
          navigate('/admin/dashboard');
          break;
        case 'Agency':
          if (response.isAgencyVerified === true) {
            // Check if agency has seen the approval page
            const agencyId = (response as any).user_id || (response as any)._id;
            const hasSeenApproval = localStorage.getItem(`agency_approval_seen_${agencyId}`);
            
            if (!hasSeenApproval) {
              // First time seeing approval - show approval page
              navigate('/application-approved', { 
                state: { 
                  email: data.email, 
                  role: 'Agency', 
                  applicationStatus: 'approved',
                  agencyName: response.agency_name || 'Your Agency',
                  agencyId: agencyId
                } 
              });
            } else {
              // Already seen approval page - go directly to dashboard
              navigate('/agency/dashboard');
            }
          } else if (response.isAgencyVerified === false && !response.isPending) {
            navigate('/application-rejected', { 
              state: { email: data.email, role: 'Agency', applicationStatus: 'rejected' } 
            });
          } else {
            // Default case: pending or undefined status - show application under review
            navigate('/application-under-review', { 
              state: { 
                email: data.email, 
                role: 'Agency', 
                applicationStatus: response.applicationStatus || 'pending' 
              } 
            });
          }
          break;
        case 'Citizen':
          navigate('/citizen/dashboard');
          break;
        default:
          navigate('/');
      }
      
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      console.log(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    console.log('🚀 Register function called with data:', data);
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('📡 Calling AuthService.register...');
      const response = await AuthService.register(data);
      console.log('✅ Registration response:', response);
      
      // For roles that require email verification
      if (data.role === 'Citizen') {
        toast.success('Registration successful! Please check your email for verification.', {
          duration: 5000,
          position: 'top-center',
        });
        navigate('/login');
      } else if (data.role === 'Agency') {
        // For agency, redirect to OTP verification
        navigate('/verify-otp', { 
          state: { email: data.email, role: 'Agency' } 
        });
      } else if (data.role === 'Admin') {
        // Auto-login for Admin
        const email = data.email;
        await login({ email, password: data.password });
      }
    } catch (err: any) {
      console.error('❌ Registration error:', err);
      
      // Handle specific error types from backend
      let errorMessage = 'Registration failed';
      
      if (err?.response?.data?.message) {
        // Backend error message
        errorMessage = err.response.data.message;
      } else if (err instanceof Error) {
        // Generic error
        errorMessage = err.message;
      }
      
      // Handle agency name conflict specifically
      if (errorMessage.includes('has already registered') && errorMessage.includes('agency')) {
        // Keep the backend message as it's user-friendly
        setError(errorMessage);
      } else {
        setError(errorMessage);
      }
      
      console.error('Error message:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    utilLogout();
    setUser(null);
  };

  const forgotPassword = async (data: ForgotPasswordRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await AuthService.forgotPassword(data);
      // Success message will be handled by the component
    } catch (err: any) {
      setError(err.message || 'Failed to send reset code');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (data: ResetPasswordRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await AuthService.resetPassword(data);
      // Success message and navigation will be handled by the component
    } catch (err: any) {
      setError(err.message || 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    user,
    userRole,
    isAuth,
    isLoading,
    error,
    login,
    loginWithRoleValidation,
    register,
    logout,
    forgotPassword,
    resetPassword,
    clearError,
  };
};