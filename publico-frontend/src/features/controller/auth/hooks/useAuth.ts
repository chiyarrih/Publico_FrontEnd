import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/authApi';
import { 
  LoginRequest, 
  RegisterRequest, 
  User, 
  UserRole,
  ForgotPasswordRequest,
  ResetPasswordRequest 
} from '../../../shared/types/auth';
import { 
  setAuthToken, 
  setUserData, 
  getUserData, 
  isAuthenticated, 
  getCurrentUserRole,
  logout as utilLogout
} from '../../../utils/auth';

interface UseAuthReturn {
  user: Partial<User> | null;
  userRole: UserRole | null;
  isAuth: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginRequest) => Promise<void>;
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

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await AuthService.login(data);
      
      setAuthToken(response.token);
      
      const userData = {
        role: response.role,
        email: data.email,
        user: response
      };
      
      setUserData(userData);
      setUser(userData);
      
      // Navigate based on role
      switch (response.role) {
        case 'Admin':
          navigate('/admin/dashboard');
          break;
        case 'Agency':
          navigate('/agency/dashboard');
          break;
        case 'Citizen':
          navigate('/citizen/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      console.log(err);
      
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
      if (data.role === 'Citizen' || data.role === 'Agency') {
        setError('Registration successful! Please check your email for verification.');
        navigate('/login');
      } else if (data.role === 'Admin') {
        // Auto-login for Admin
        const email = data.email;
        await login({ email, password: data.password });
      }
    } catch (err) {
      console.error('❌ Registration error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      console.error('Error message:', errorMessage);
      setError(errorMessage);
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
      setError('Reset code sent to your email!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset code');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (data: ResetPasswordRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await AuthService.resetPassword(data);
      setError('Password reset successful! You can now login.');
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset failed');
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
    register,
    logout,
    forgotPassword,
    resetPassword,
    clearError,
  };
};