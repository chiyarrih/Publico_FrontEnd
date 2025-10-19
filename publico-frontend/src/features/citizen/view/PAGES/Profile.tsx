import React, { useState } from "react";
import toast from "react-hot-toast";
import { useProfile } from "../../controller/hooks/useProfile";
import ChangePasswordModal from "../components/ChangePasswordModal";
import ProfileTabs, { TabKey } from "../components/ProfileTabs";
import ProfileInfoTab from "../components/ProfileInfoTab";
import SecurityTab from "../components/SecurityTab";
import NotificationsTab from "../components/NotificationsTab";
import ErrorDisplay from "../components/ErrorDisplay";
import { Citizen } from "../../../../shared/types/auth";

const Profile: React.FC = () => {
  const [tab, setTab] = useState<TabKey>("profile");
  const { user, isLoading, error, updateProfile, clearError } = useProfile();
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  // Role-based access control - only allow Citizens
  if (user && user.role !== 'Citizen') {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2 text-gray-600">This profile page is only accessible to Citizens.</p>
      </div>
    );
  }

  /** PROFILE INFO STATE */
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
  });

  // Update form when user data loads
  React.useEffect(() => {
    if (user && user.role === 'Citizen') {
      const citizenUser = user as Citizen;
      setForm({
        first_name: citizenUser.first_name || "",
        last_name: citizenUser.last_name || "",
        email: citizenUser.email || "",
        phone_number: citizenUser.phone_number || "",
        address: citizenUser.address || "",
      });
    }
  }, [user]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await updateProfile({
        first_name: form.first_name,
        last_name: form.last_name,
        phone_number: form.phone_number,
        address: form.address,
      });
      toast.success("Profile updated successfully!", {
        duration: 3000,
        position: "top-right",
      });
    } catch (err) {
      // Error handled by hook
      toast.error("Failed to update profile. Please try again.", {
        duration: 4000,
        position: "top-right",
      });
    }
  };

  const handlePasswordChangeSuccess = () => {
    toast.success("Password changed successfully!", {
      duration: 3000,
      position: "top-right",
    });
  };

  if (isLoading && !user) {
    return (
      <div className="space-y-6">
        <div className="card">
          <div className="p-5 text-center">
            <div className="text-sm text-slate-600">Loading profile...</div>
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (tab) {
      case "profile":
        return (
          <ProfileInfoTab
            form={form}
            onFormChange={onChange}
            onSave={onSaveProfile}
            isLoading={isLoading}
          />
        );
      case "security":
        return (
          <SecurityTab
            user={user as Citizen}
            onPasswordChange={() => setShowChangePasswordModal(true)}
          />
        );
      case "notifications":
        return <NotificationsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="card">
        {/* Tabs header */}
        <ProfileTabs activeTab={tab} onTabChange={setTab} />

        {/* Divider */}
        <div className="h-px bg-slate-200 mt-2" />

        {/* Tab panels */}
        <div className="p-5">
          {renderTabContent()}
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        onSuccess={handlePasswordChangeSuccess}
      />

      {/* Error Display */}
      <ErrorDisplay error={error} onClear={clearError} />
    </div>
  );
};

export default Profile;
