import { useState, useEffect } from 'react';
import { AuthService } from '../../../auth/services/authApi';
import { User, Citizen } from '../../../../shared/types/auth';
import { getUserData } from '../../../../utils/auth';

interface UseProfileReturn {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  clearError: () => void;
}

export const useProfile = (): UseProfileReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userData = getUserData();
      if (!userData?.email) {
        throw new Error('User not found');
      }

      // Ensure user is a Citizen
      if (userData.role !== 'Citizen') {
        throw new Error('Access denied. This profile is only for Citizens.');
      }

      // Use the dedicated citizen profile endpoint
      const profile = await AuthService.getCitizenProfile(userData.email);
      
      // Type guard to ensure we have a Citizen
      if (profile.role !== 'Citizen') {
        throw new Error('Invalid user type for this profile');
      }
      
      setUser(profile as Citizen);
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedProfile = await AuthService.updateUserProfile(user.id, data);
      setUser(updatedProfile);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await AuthService.changePassword(user.id, currentPassword, newPassword);
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    user,
    isLoading,
    error,
    updateProfile,
    changePassword,
    clearError,
  };
};
