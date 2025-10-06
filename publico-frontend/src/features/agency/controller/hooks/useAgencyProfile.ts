import { useState, useEffect } from "react";
import { Agency } from "../../../../shared/types/auth";
import { fetchUsers } from "../../services/agencyService";
import { getUserData } from "../../../../utils/auth";
import { UseData } from "../../../../interfaces/user";

interface UseAgencyProfileReturn {
  user: Agency | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (data: Partial<Agency>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
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
      // TODO: Implement profile update API call
      console.log('Profile update not implemented yet:', data);
      setError('Profile update not implemented yet');
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
      // TODO: Implement password change API call
      console.log('Password change not implemented yet');
      setError('Password change not implemented yet');
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
