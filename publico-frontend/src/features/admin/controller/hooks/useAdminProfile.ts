import { useState } from "react";

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
  const [walletConnected, setWalletConnected] = useState(false);
  
  const profile: ProfileData = {
    name: "Admin User",
    email: "admin@dagupan.gov.ph",
    phone: "+63 912 345 6789",
    lastLogin: "2023-05-15 08:30 AM",
    status: "Active",
  };

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

  const handleChangePassword = () => {
    console.log("Change password clicked");
    // TODO: Implement change password modal
  };

  const handleEnable2FA = () => {
    console.log("Enable 2FA clicked");
    // TODO: Implement 2FA setup modal
  };

  return {
    profile,
    activities,
    walletConnected,
    handleEditProfile,
    handleConnectWallet,
    handleDisconnectWallet,
    handleChangePassword,
    handleEnable2FA,
  };
}

