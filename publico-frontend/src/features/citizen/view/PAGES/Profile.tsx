import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../controller/hooks/useProfile";
import ChangePasswordModal from "../components/ChangePasswordModal";
import ProfileTabs, { TabKey } from "../components/ProfileTabs";
import ProfileInfoTab from "../components/ProfileInfoTab";
import SecurityTab from "../components/SecurityTab";
import NotificationsTab from "../components/NotificationsTab";
import ErrorDisplay from "../components/ErrorDisplay";
import { Citizen } from "../../../../shared/types/auth";
import { isAuthenticated } from "../../../../utils/auth";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>("profile");
  const { user, isLoading, error, updateProfile, clearError } = useProfile();
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  // Check if user is authenticated (guest users)
  if (!isAuthenticated() || !user) {
    return (
      <div className="space-y-6">
        <div className="card p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600 mb-6">
            You need to be logged in to manage your profile settings and preferences.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-sm transition-all"
            >
              Login to Your Account
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

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
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Information</h1>
        <p className="text-gray-600 mb-6">
          This is the public citizen portal. Profile management is available for logged-in users.
        </p>
        
        {/* Show login suggestion */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Login Required</h3>
          <p className="text-blue-800 text-sm mb-4">
            To access your personal profile and preferences, please log in with your citizen account.
          </p>
          <div className="flex gap-3">
            <a
              href="/login"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Go to Login
            </a>
            <a
              href="/signup"
              className="px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-blue-300 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Create Account
            </a>
          </div>
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
