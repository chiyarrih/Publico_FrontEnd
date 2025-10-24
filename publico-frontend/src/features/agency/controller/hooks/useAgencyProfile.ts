import { useState, useEffect } from "react";
import { Agency } from "../../../../shared/types/auth";
import { fetchUsers, updateAgencyProfile } from "../../services/agencyService";
import { getUserData } from "../../../../utils/auth";
import { UseData } from "../../../../interfaces/user";
import { AuthService } from "../../../auth/services/authApi";

interface UseAgencyProfileReturn {
  user: Agency | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (data: Partial<Agency>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  forgotPassword: (data: { email: string }) => Promise<{ message: string; user: any }>;
  resetPassword: (data: { email: string; code: string; newPassword: string }) => Promise<{ message: string }>;
  clearError: () => void;
}

export const useAgencyProfile = (): UseAgencyProfileReturn => {
  const [user, setUser] = useState<Agency | null>(null);
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

      // Ensure user is an Agency
      if (userData.role !== 'Agency') {
        throw new Error('Access denied. This profile is only for Agency users.');
      }

      // Use the existing fetchUsers function
      const profileData = await fetchUsers();
      
      if (!profileData) {
        throw new Error('No profile data found');
      }

      // Handle both array and object responses
      const rawUserData = Array.isArray(profileData) ? profileData[0] : profileData;
      
      // Debug logging
      console.log('Raw API response:', profileData);
      console.log('Raw user data:', rawUserData);
      
      // Map the UseData to Agency interface
      const agencyUser: Agency = {
        _id: rawUserData._id,
        agency_name: rawUserData.agency_name || '',
        agency_code: rawUserData.agency_code || '',
        contact_email: rawUserData.email, // Map email to contact_email
        contact_phone: rawUserData.contact_phone,
        department: rawUserData.department,
        address: rawUserData.address,
        isPending: rawUserData.isPending || false,
        role: 'Agency' as const,
        // BaseUser fields
        id: rawUserData._id,
        email: rawUserData.email,
        isVerified: rawUserData.isVerified,
        date_registered: rawUserData.date_registered,
        privateKey: ""
      };
      
      setUser(agencyUser);
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<Agency>) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Map frontend data to backend expected format
      const updateData: any = {};
      
      if (data.agency_name) updateData.agency_name = data.agency_name;
      if (data.contact_phone) updateData.contact_phone = data.contact_phone;
      if (data.department) updateData.department = data.department;
      if (data.address) updateData.address = data.address;
      
      // Use the service function
      const updatedProfile = await updateAgencyProfile(user.id, updateData);
      
      // Update local state with the response
      setUser(updatedProfile);
      
      // Reload profile to get fresh data
      await loadUserProfile();
      
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
      throw err; // Re-throw to let the modal handle it
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (data: { email: string }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await AuthService.forgotPassword(data);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to send reset code');
      throw err; // Re-throw to let the modal handle it
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (data: { email: string; code: string; newPassword: string }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await AuthService.resetPassword(data);
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
      throw err; // Re-throw to let the modal handle it
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
    forgotPassword,
    resetPassword,
    clearError,
  };
};
