"use client"

import { useState } from "react"
import { User, Wallet, Key, Shield, ExternalLink, Copy } from "lucide-react"
import { Button } from "@shared/ui/button"
import { CardContent, CardHeader, CardTitle } from "@shared/ui/card"
import { Card, Input } from "@shared/ui"
import ProfileInformationCard from "../cards/ProfileInformationCard"
import BlockchainWalletCard from "@shared/components/BlockchainWalletCard"
import ChangePasswordModal from "../../../view/modals/ChangePasswordModal"

export default function ProfileComponent() {
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handlePasswordChangeSuccess = () => {
    // You can add any success handling here
    console.log('Password changed successfully');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">User Profile</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Profile Information Card */}
        <ProfileInformationCard/>
        {/* Blockchain Wallet Card */}
        <BlockchainWalletCard role="Agency" onProfileUpdate={setProfile} onFetchedData={(data) => {/* handled by useConnectWallet */}} />
      </div>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Password</h3>
                <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowChangePasswordModal(true)}
            >
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onSuccess={handlePasswordChangeSuccess}
      />
    </div>
  )
}
