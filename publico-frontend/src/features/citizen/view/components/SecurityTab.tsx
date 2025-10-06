import React from "react";
import { PrimaryBtn } from "./ui/Buttons";
import { Citizen } from "../../../../shared/types/auth";

interface SecurityTabProps {
  user: Citizen | null;
  onPasswordChange: () => void;
}

const SecurityTab: React.FC<SecurityTabProps> = ({ user, onPasswordChange }) => {
  return (
    <div className="max-w-xl space-y-6">
      <div>
        <div className="text-sm font-medium text-slate-900 mb-2">Password Security</div>
        <p className="text-xs text-slate-600 mb-4">
          For security reasons, changing your password requires email verification.
        </p>
        
        <PrimaryBtn onClick={onPasswordChange}>
          🔒 Change Password
        </PrimaryBtn>
      </div>

      <div className="h-px bg-slate-200" />

      <div>
        <div className="text-sm font-medium text-slate-900 mb-2">Account Information</div>
        <div className="space-y-2 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Email:</span>
            <span className="font-mono">{user?.email || 'Loading...'}</span>
          </div>
          <div className="flex justify-between">
            <span>Account Type:</span>
            <span className="font-mono">{user?.role || 'Loading...'}</span>
          </div>
          <div className="flex justify-between">
            <span>Member Since:</span>
            <span className="font-mono">
              {user?.date_registered ? new Date(user.date_registered).toLocaleDateString() : 'Loading...'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className={`font-mono ${user?.isVerified ? 'text-green-600' : 'text-red-600'}`}>
              {user?.isVerified ? 'Verified' : 'Unverified'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;
