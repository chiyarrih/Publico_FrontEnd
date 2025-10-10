import { Card } from "@admin/view/ui/blocks";

const UserIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  lastLogin: string;
  status: string;
}

interface ProfileInformationCardProps {
  profile: ProfileData;
  onEdit: () => void;
}

export default function ProfileInformationCard({ profile, onEdit }: ProfileInformationCardProps) {
  return (
    <Card>
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-sky-500 text-white">
          <UserIcon />
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-slate-800">{profile.name}</h2>
          
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-xs font-medium text-slate-500">Email Address</div>
              <div className="mt-1 text-sm text-slate-700">{profile.email}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Phone Number</div>
              <div className="mt-1 text-sm text-slate-700">{profile.phone}</div>
            </div>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-xs font-medium text-slate-500">Last Login</div>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-700">
                <ClockIcon />
                <span>{profile.lastLogin}</span>
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Account Status</div>
              <div className="mt-1 flex items-center gap-1.5 text-sm">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                <span className="font-medium text-emerald-600">{profile.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t pt-4">
        <button
          onClick={onEdit}
          className="inline-flex h-9 items-center justify-center rounded-xl bg-sky-600 px-3 text-sm font-medium text-white shadow-sm hover:bg-sky-700 active:bg-sky-800"
        >
          Edit Profile
        </button>
      </div>
    </Card>
  );
}

