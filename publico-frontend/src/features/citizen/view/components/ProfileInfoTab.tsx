import React from "react";
import { PrimaryBtn } from "./ui/Buttons";
import AvatarUpload from "./AvatarUpload";

interface ProfileForm {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
}

interface ProfileInfoTabProps {
  form: ProfileForm;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: (e: React.FormEvent) => void;
  isLoading: boolean;
  onAvatarChange?: (url: string | null) => void;
}

const ProfileInfoTab: React.FC<ProfileInfoTabProps> = ({
  form,
  onFormChange,
  onSave,
  isLoading,
  onAvatarChange,
}) => {
  return (
    <form onSubmit={onSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: avatar */}
      <AvatarUpload 
        onAvatarChange={onAvatarChange}
        disabled={isLoading}
      />

      {/* Right: fields */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <div className="text-[12px] text-slate-600 mb-1">First Name</div>
            <input
              name="first_name"
              value={form.first_name}
              onChange={onFormChange}
              className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100"
              disabled={isLoading}
            />
          </label>
          <label className="block">
            <div className="text-[12px] text-slate-600 mb-1">Last Name</div>
            <input
              name="last_name"
              value={form.last_name}
              onChange={onFormChange}
              className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100"
              disabled={isLoading}
            />
          </label>
        </div>

        <label className="block">
          <div className="text-[12px] text-slate-600 mb-1">Email Address</div>
          <input
            type="email"
            name="email"
            value={form.email}
            className="w-full rounded border border-slate-300 bg-gray-100 px-3 py-2 text-sm text-gray-500"
            disabled
          />
          <div className="text-[10px] text-slate-500 mt-1">Email cannot be changed</div>
        </label>

        <label className="block">
          <div className="text-[12px] text-slate-600 mb-1">Phone Number</div>
          <input
            name="phone_number"
            value={form.phone_number}
            onChange={onFormChange}
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100"
            disabled={isLoading}
          />
        </label>

        <label className="block">
          <div className="text-[12px] text-slate-600 mb-1">Address</div>
          <input
            name="address"
            value={form.address}
            onChange={onFormChange}
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100"
            disabled={isLoading}
          />
        </label>

        <PrimaryBtn type="submit" className="mt-1">
          <span>🖫</span> Save Changes
        </PrimaryBtn>
      </div>
    </form>
  );
};

export default ProfileInfoTab;
