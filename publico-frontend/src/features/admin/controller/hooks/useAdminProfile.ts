import { useState, useEffect } from "react";
import { AdminService } from "../../services/admin.api";
import { Admin } from "../../../../shared/types/auth";
import { getUserData } from "../../../../utils/auth";
import { AuthService } from "../../../auth/services/authApi";

export interface ProfileData {
  name: string;
  email: string;
  phone: string;
  lastLogin: string;
  status: string;
}

export interface ActivityItem {
  action: string;
  description: string;
  timestamp: string;
}

export default function useAdminProfile() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    name: "Loading...",
    email: "Loading...",
    phone: "Loading...",
    lastLogin: "Loading...",
    status: "Loading...",
  });

  const activities: ActivityItem[] = [
    {
      action: "Approved budget request",
      description: "Medical Equipment Procurement",
      timestamp: "2023-05-14 15:42 PM",
    },
    {
      action: "Rejected budget request",
      description: "Tourism Festival Expansion",
      timestamp: "2023-05-14 14:30 PM",
    },
    {
      action: "Generated monthly report",
      description: "April 2023 Financial Report",
      timestamp: "2023-05-13 10:15 AM",
    },
    {
      action: "Reviewed budget request",
      description: "School Building Repair",
      timestamp: "2023-05-12 16:20 PM",
    },
  ];

  useEffect(() => {
    const loadAdminProfile = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const userData = getUserData();
        if (!userData?.email) {
          throw new Error('User not found');
        }

        // Ensure user is an Admin
        if (userData.role !== 'Admin') {
          throw new Error('Access denied. This profile is only for Admin users.');
        }

        // Fetch admin profile data
        const adminData = await AdminService.getAdminProfile(userData.email);
        setAdmin(adminData);
        setWalletConnected(adminData.agency_web3_account?.address ? true : false);
        
        // Format last login date - use date_registered as fallback
        const lastLoginDate = new Date(adminData.date_registered).toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });

        // Determine the display name for admin
        let displayName = "Admin User";
        if (adminData.first_name && adminData.last_name) {
          displayName = `${adminData.first_name} ${adminData.last_name}`;
        } else if (adminData.first_name) {
          displayName = adminData.first_name;
        }

        setProfile({
          name: displayName,
          email: adminData.email,
          phone: "Not provided", // Admin doesn't have phone_number in the interface
          lastLogin: lastLoginDate,
          status: adminData.isVerified ? "Active" : "Pending",
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load admin profile');
        console.error("Error fetching admin profile data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminProfile();
  }, []);

  const handleEditProfile = () => {
    console.log("Edit profile clicked");
    // TODO: Implement edit profile modal
  };

  const handleConnectWallet = () => {
    console.log("Connect wallet clicked");
    setWalletConnected(true);
    // TODO: Implement MetaMask connection
  };

  const handleDisconnectWallet = () => {
    console.log("Disconnect wallet clicked");
    setWalletConnected(false);
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!admin) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await AuthService.changePassword(admin.id, currentPassword, newPassword);
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

  const handleChangePassword = () => {
    console.log("Change password clicked");
    // TODO: Implement change password modal
  };

  const handleEnable2FA = () => {
    console.log("Enable 2FA clicked");
    // TODO: Implement 2FA setup modal
  };

  return {
    admin,
    profile,
    activities,
    isLoading,
    error,
    walletConnected,
    handleEditProfile,
    handleConnectWallet,
    handleDisconnectWallet,
    handleChangePassword,
    handleEnable2FA,
    changePassword,
    forgotPassword,
    resetPassword,
    clearError,
  };
}

