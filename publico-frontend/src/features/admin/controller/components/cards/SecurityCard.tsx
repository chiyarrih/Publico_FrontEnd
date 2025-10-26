import { Card, Button } from "@admin/view/ui/blocks";

const KeyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-sky-600">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-sky-600">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

interface SecurityCardProps {
  onChangePassword: () => void;
}

export default function SecurityCard({ onChangePassword }: SecurityCardProps) {
  return (
    <Card>
      <h3 className="mb-4 text-base font-semibold text-slate-800">Security</h3>

      <div className="space-y-4">
        {/* Password Section */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <KeyIcon />
          </div>
          <div className="flex-1">
            <div className="font-medium text-slate-800">Password</div>
            <div className="mt-1 text-xs text-slate-500">Last changed 30 days ago</div>
            <Button onClick={onChangePassword} className="mt-3 w-full">
              Change Password
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

