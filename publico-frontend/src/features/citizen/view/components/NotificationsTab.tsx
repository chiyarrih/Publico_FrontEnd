import React, { useState } from "react";
import { PrimaryBtn } from "./ui/Buttons";

interface NotificationSettings {
  emailTxn: boolean;
  emailAlerts: boolean;
  emailNews: boolean;
  pushCritical: boolean;
  pushUpdates: boolean;
}

interface NotificationsTabProps {
  onSave?: () => void;
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({ onSave }) => {
  const [notif, setNotif] = useState<NotificationSettings>({
    emailTxn: true,
    emailAlerts: true,
    emailNews: false,
    pushCritical: true,
    pushUpdates: false,
  });

  const handleSave = () => {
    onSave?.();
    alert("Notification preferences saved ✅ (demo)");
  };

  const updateNotification = (key: keyof NotificationSettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotif((s) => ({ ...s, [key]: e.target.checked }));
  };

  return (
    <div className="max-w-xl space-y-5">
      <div className="text-sm font-medium text-slate-900">Email Notifications</div>
      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          className="accent-[#2563eb]"
          checked={notif.emailTxn}
          onChange={updateNotification('emailTxn')}
        />
        Transaction receipts and ledger updates
      </label>
      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          className="accent-[#2563eb]"
          checked={notif.emailAlerts}
          onChange={updateNotification('emailAlerts')}
        />
        Smart contract alerts
      </label>
      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          className="accent-[#2563eb]"
          checked={notif.emailNews}
          onChange={updateNotification('emailNews')}
        />
        Announcements & newsletters
      </label>

      <div className="h-px bg-slate-200 my-2" />

      <div className="text-sm font-medium text-slate-900">Push Notifications</div>
      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          className="accent-[#2563eb]"
          checked={notif.pushCritical}
          onChange={updateNotification('pushCritical')}
        />
        Critical alerts (recommended)
      </label>
      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          className="accent-[#2563eb]"
          checked={notif.pushUpdates}
          onChange={updateNotification('pushUpdates')}
        />
        General updates
      </label>

      <PrimaryBtn type="button" onClick={handleSave}>
        Save Preferences
      </PrimaryBtn>
    </div>
  );
};

export default NotificationsTab;
