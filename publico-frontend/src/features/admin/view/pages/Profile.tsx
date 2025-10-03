import React from "react";
import ProfileInformationCard from "@admin/controller/components/cards/ProfileInformationCard";
import RecentActivityCard from "@admin/controller/components/cards/RecentActivityCard";
import BlockchainWalletCard from "@admin/controller/components/cards/BlockchainWalletCard";
import SecurityCard from "@admin/controller/components/cards/SecurityCard";
import useAdminProfile from "@admin/controller/hooks/useAdminProfile";

export default function Profile() {
  const {
    profile,
    activities,
    walletConnected,
    handleEditProfile,
    handleConnectWallet,
    handleDisconnectWallet,
    handleChangePassword,
    handleEnable2FA,
  } = useAdminProfile();

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
          <BlockchainWalletCard
            walletConnected={walletConnected}
            onConnect={handleConnectWallet}
            onDisconnect={handleDisconnectWallet}
          />
          <SecurityCard
            onChangePassword={handleChangePassword}
            onEnable2FA={handleEnable2FA}
          />
        </div>
      </div>
    </div>
  );
}
