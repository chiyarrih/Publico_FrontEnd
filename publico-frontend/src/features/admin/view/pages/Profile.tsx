import React, { useState } from "react";
import ProfileInformationCard from "@admin/controller/components/cards/ProfileInformationCard";
import RecentActivityCard from "@admin/controller/components/cards/RecentActivityCard";
import BlockchainWalletCard from "@shared/components/BlockchainWalletCard";
import SecurityCard from "@admin/controller/components/cards/SecurityCard";
import useAdminProfile from "@admin/controller/hooks/useAdminProfile";
import ChangePasswordModal from "../modals/ChangePasswordModal";

export default function Profile() {
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  
  const {
    admin,
    profile,
    activities,
    isLoading,
    error,
    handleEditProfile,
    handleChangePassword,
    handleEnable2FA,
  } = useAdminProfile();

  const handleOpenChangePasswordModal = () => {
    setIsChangePasswordModalOpen(true);
  };

  const handleCloseChangePasswordModal = () => {
    setIsChangePasswordModalOpen(false);
  };

  const handlePasswordChangeSuccess = () => {
    // You can add any success handling here, like showing a toast notification
    console.log('Password changed successfully');
  };

  if (isLoading) {
    return (
      <div className="space-y-5">
        <h1 className="text-2xl font-semibold text-slate-800">User Profile</h1>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-slate-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-5">
        <h1 className="text-2xl font-semibold text-slate-800">User Profile</h1>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">Error Loading Profile</h3>
            <p className="text-sm text-slate-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold text-slate-800">User Profile</h1>

      <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
        {/* Left Column - Main Profile Info */}
        <div className="space-y-4">
          <ProfileInformationCard profile={profile} onEdit={handleEditProfile} />
          <RecentActivityCard activities={activities} />
        </div>

        {/* Right Column - Wallet & Security */}
        <div className="space-y-4">
          <BlockchainWalletCard role="Admin" />
          <SecurityCard
            onChangePassword={handleOpenChangePasswordModal}
            onEnable2FA={handleEnable2FA}
          />
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={handleCloseChangePasswordModal}
        onSuccess={handlePasswordChangeSuccess}
      />
    </div>
  );
}
