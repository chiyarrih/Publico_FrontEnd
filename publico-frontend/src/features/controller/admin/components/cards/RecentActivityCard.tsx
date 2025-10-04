import { Card } from "features/view/admin/ui/blocks";

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

interface ActivityItem {
  action: string;
  description: string;
  timestamp: string;
}

interface RecentActivityCardProps {
  activities: ActivityItem[];
}

export default function RecentActivityCard({ activities }: RecentActivityCardProps) {
  return (
    <Card>
      <h3 className="text-base font-semibold text-slate-800">Recent Activity</h3>

      <div className="mt-4 space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex gap-3 border-b pb-3 last:border-0 last:pb-0">
            <ClockIcon />
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-medium text-slate-800">{activity.action}</span>
                  <span className="text-slate-600"> - {activity.description}</span>
                </div>
              </div>
              <div className="mt-1 text-xs text-slate-500">{activity.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

