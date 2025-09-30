import React, { useRef, useState } from "react";

/** Small button + styles used below */
const PrimaryBtn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = "", ...rest }) => (
  <button
    {...rest}
    className={
      "inline-flex items-center gap-2 rounded bg-[#2563eb] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d4fd8] " +
      className
    }
  >
    {children}
  </button>
);

const OutlineBtn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = "", ...rest }) => (
  <button
    {...rest}
    className={
      "inline-flex items-center gap-2 rounded border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 " +
      className
    }
  >
    {children}
  </button>
);

type TabKey = "profile" | "security" | "notifications";

const Profile: React.FC = () => {
  const [tab, setTab] = useState<TabKey>("profile");

  /** PROFILE INFO STATE */
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "Juan Dela Cruz",
    email: "juan.delacruz@example.com",
    phone: "(+63) 912 345 6789",
    address: "Barangay Poblacion, Dagupan City",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const pickFile = () => fileRef.current?.click();
  const onPick: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setAvatarUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  };

  const onSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // demo only
    alert("Profile saved ✅");
  };

  /** SECURITY TAB STATE */
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const savePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.next !== pwd.confirm) return alert("New passwords do not match.");
    if (!pwd.current || !pwd.next) return alert("Fill out all password fields.");
    alert("Password updated ✅ (demo)");
    setPwd({ current: "", next: "", confirm: "" });
  };

  /** NOTIFICATIONS TAB STATE */
  const [notif, setNotif] = useState({
    emailTxn: true,
    emailAlerts: true,
    emailNews: false,
    pushCritical: true,
    pushUpdates: false,
  });

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="card">
        {/* Tabs header */}
        <div className="px-5 pt-4">
          <div className="flex items-center gap-6 text-sm">
            {[
              { k: "profile", label: "Profile Information" },
              { k: "security", label: "Security" },
              { k: "notifications", label: "Notifications" },
            ].map((t) => (
              <button
                key={t.k}
                onClick={() => setTab(t.k as TabKey)}
                className={`pb-2 -mb-px border-b-2 ${
                  tab === t.k
                    ? "border-[#2563eb] text-[#2563eb] font-medium"
                    : "border-transparent text-slate-600 hover:text-slate-800"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-200 mt-2" />

        {/* Tab panels */}
        <div className="p-5">
          {tab === "profile" && (
            <form onSubmit={onSaveProfile} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: avatar */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <img
                    src={
                      avatarUrl ||
                      "https://images.unsplash.com/photo-1603415526960-f7e0328d13a7?q=80&w=300&auto=format&fit=crop"
                    }
                    alt="avatar"
                    className="h-28 w-28 rounded-full object-cover border"
                  />
                  <button
                    type="button"
                    onClick={pickFile}
                    className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-[#2563eb] text-white text-sm shadow"
                    title="Change"
                  >
                    ✎
                  </button>
                </div>
                <div className="text-xs text-slate-500">Profile Picture</div>
                <input ref={fileRef} type="file" accept="image/*" onChange={onPick} className="hidden" />
              </div>

              {/* Right: fields */}
              <div className="space-y-4">
                <label className="block">
                  <div className="text-[12px] text-slate-600 mb-1">Full Name</div>
                  <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <label className="block">
                  <div className="text-[12px] text-slate-600 mb-1">Email Address</div>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <label className="block">
                  <div className="text-[12px] text-slate-600 mb-1">Phone Number</div>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <label className="block">
                  <div className="text-[12px] text-slate-600 mb-1">Address</div>
                  <input
                    name="address"
                    value={form.address}
                    onChange={onChange}
                    className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <PrimaryBtn type="submit" className="mt-1">
                  <span>🖫</span> Save Changes
                </PrimaryBtn>
              </div>
            </form>
          )}

          {tab === "security" && (
            <form onSubmit={savePassword} className="max-w-xl space-y-4">
              <div className="text-sm font-medium text-slate-900 mb-2">Change Password</div>
              <label className="block">
                <div className="text-[12px] text-slate-600 mb-1">Current Password</div>
                <input
                  type="password"
                  value={pwd.current}
                  onChange={(e) => setPwd((s) => ({ ...s, current: e.target.value }))}
                  className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="block">
                <div className="text-[12px] text-slate-600 mb-1">New Password</div>
                <input
                  type="password"
                  value={pwd.next}
                  onChange={(e) => setPwd((s) => ({ ...s, next: e.target.value }))}
                  className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="block">
                <div className="text-[12px] text-slate-600 mb-1">Confirm New Password</div>
                <input
                  type="password"
                  value={pwd.confirm}
                  onChange={(e) => setPwd((s) => ({ ...s, confirm: e.target.value }))}
                  className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <div className="flex items-center gap-2">
                <PrimaryBtn type="submit">Update Password</PrimaryBtn>
                <OutlineBtn type="button" onClick={() => setPwd({ current: "", next: "", confirm: "" })}>
                  Clear
                </OutlineBtn>
              </div>

              <div className="mt-6 text-xs text-slate-500">
                Tip: Use at least 8 characters including a number and a symbol.
              </div>
            </form>
          )}

          {tab === "notifications" && (
            <div className="max-w-xl space-y-5">
              <div className="text-sm font-medium text-slate-900">Email Notifications</div>
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  className="accent-[#2563eb]"
                  checked={notif.emailTxn}
                  onChange={(e) => setNotif((s) => ({ ...s, emailTxn: e.target.checked }))}
                />
                Transaction receipts and ledger updates
              </label>
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  className="accent-[#2563eb]"
                  checked={notif.emailAlerts}
                  onChange={(e) => setNotif((s) => ({ ...s, emailAlerts: e.target.checked }))}
                />
                Smart contract alerts
              </label>
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  className="accent-[#2563eb]"
                  checked={notif.emailNews}
                  onChange={(e) => setNotif((s) => ({ ...s, emailNews: e.target.checked }))}
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
                  onChange={(e) => setNotif((s) => ({ ...s, pushCritical: e.target.checked }))}
                />
                Critical alerts (recommended)
              </label>
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  className="accent-[#2563eb]"
                  checked={notif.pushUpdates}
                  onChange={(e) => setNotif((s) => ({ ...s, pushUpdates: e.target.checked }))}
                />
                General updates
              </label>

              <PrimaryBtn type="button" onClick={() => alert("Notification preferences saved ✅ (demo)")}>
                Save Preferences
              </PrimaryBtn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
