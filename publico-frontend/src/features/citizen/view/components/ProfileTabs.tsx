import React from "react";

export type TabKey = "profile" | "security" | "notifications";

interface ProfileTabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { k: "profile" as TabKey, label: "Profile Information" },
    { k: "security" as TabKey, label: "Security" },
    { k: "notifications" as TabKey, label: "Notifications" },
  ];

  return (
    <div className="px-5 pt-4">
      <div className="flex items-center gap-6 text-sm">
        {tabs.map((tab) => (
          <button
            key={tab.k}
            onClick={() => onTabChange(tab.k)}
            className={`pb-2 -mb-px border-b-2 ${
              activeTab === tab.k
                ? "border-[#2563eb] text-[#2563eb] font-medium"
                : "border-transparent text-slate-600 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileTabs;
