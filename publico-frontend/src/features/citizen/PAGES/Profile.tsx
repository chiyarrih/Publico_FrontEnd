import React, { useRef, useState } from "react";
import { Card, Field, Input, PrimaryBtn, OutlineBtn } from "../../../shared/ui";

type TabKey = "profile" | "security" | "notifications";

export default function Profile() {
  const [tab, setTab] = useState<TabKey>("profile");

  /* profile */
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ name: "Juan Dela Cruz", email: "juan.delacruz@example.com", phone: "(+63) 912 345 6789", address: "Barangay Poblacion, Dagupan City" });
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  const onPick: React.ChangeEventHandler<HTMLInputElement> = (e) => { const f = e.target.files?.[0]; if (!f) return; const url = URL.createObjectURL(f); setAvatarUrl((prev)=>{ if(prev) URL.revokeObjectURL(prev); return url; }); };
  const onSaveProfile = (e: React.FormEvent) => { e.preventDefault(); alert("Profile saved ✅"); };

  /* security */
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const savePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.next !== pwd.confirm) return alert("New passwords do not match.");
    if (!pwd.current || !pwd.next) return alert("Fill out all password fields.");
    alert("Password updated ✅ (demo)"); setPwd({ current: "", next: "", confirm: "" });
  };

  /* notifications */
  const [notif, setNotif] = useState({ emailTxn: true, emailAlerts: true, emailNews: false, pushCritical: true, pushUpdates: false });

  return (
    <div className="space-y-6">
      <div className="text-lg font-semibold text-slate-900">User Profile</div>

      <Card>
        <div className="px-5 pt-1">
          <div className="flex items-center gap-6 text-sm">
            {(["profile","security","notifications"] as const).map(k => (
              <button key={k} onClick={()=>setTab(k)} className={`-mb-px border-b-2 pb-2 ${tab===k ? "border-[#2563eb] font-medium text-[#2563eb]" : "border-transparent text-slate-600 hover:text-slate-800"}`}>{k==="profile"?"Profile Information":k==="security"?"Security":"Notifications"}</button>
            ))}
          </div>
        </div>
        <div className="mt-2 h-px bg-slate-200" />

        <div className="p-5">
          {tab === "profile" && (
            <form onSubmit={onSaveProfile} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <img
                    src={avatarUrl || "https://images.unsplash.com/photo-1603415526960-f7e0328d13a7?q=80&w=300&auto=format&fit=crop"}
                    className="h-28 w-28 rounded-full border object-cover"
                  />
                  <button type="button" onClick={()=>fileRef.current?.click()} className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-[#2563eb] text-sm text-white shadow" title="Change">✎</button>
                </div>
                <div className="text-xs text-slate-500">Profile Picture</div>
                <input ref={fileRef} type="file" accept="image/*" onChange={onPick} className="hidden" />
              </div>

              <div className="space-y-4">
                <Field label="Full Name"><Input name="name" value={form.name} onChange={onChange} /></Field>
                <Field label="Email Address"><Input type="email" name="email" value={form.email} onChange={onChange} /></Field>
                <Field label="Phone Number"><Input name="phone" value={form.phone} onChange={onChange} /></Field>
                <Field label="Address"><Input name="address" value={form.address} onChange={onChange} /></Field>
                <PrimaryBtn type="submit" className="mt-1">🖫 Save Changes</PrimaryBtn>
              </div>
            </form>
          )}

          {tab === "security" && (
            <form onSubmit={savePassword} className="max-w-xl space-y-4">
              <div className="mb-2 text-sm font-medium text-slate-900">Change Password</div>
              <Field label="Current Password"><Input type="password" value={pwd.current} onChange={(e)=>setPwd(s=>({...s,current:e.target.value}))} /></Field>
              <Field label="New Password"><Input type="password" value={pwd.next} onChange={(e)=>setPwd(s=>({...s,next:e.target.value}))} /></Field>
              <Field label="Confirm New Password"><Input type="password" value={pwd.confirm} onChange={(e)=>setPwd(s=>({...s,confirm:e.target.value}))} /></Field>
              <div className="flex items-center gap-2"><PrimaryBtn type="submit">Update Password</PrimaryBtn><OutlineBtn type="button" onClick={()=>setPwd({current:"",next:"",confirm:""})}>Clear</OutlineBtn></div>
              <div className="mt-6 text-xs text-slate-500">Tip: Use at least 8 characters including a number and a symbol.</div>
            </form>
          )}

          {tab === "notifications" && (
            <div className="max-w-xl space-y-5">
              <div className="text-sm font-medium text-slate-900">Email Notifications</div>
              {[
                ["emailTxn","Transaction receipts and ledger updates"],
                ["emailAlerts","Smart contract alerts"],
                ["emailNews","Announcements & newsletters"],
              ].map(([k, label])=>(
                <label key={k} className="flex items-center gap-3 text-sm">
                  <input type="checkbox" className="accent-[#2563eb]" checked={(notif as any)[k]} onChange={(e)=>setNotif(s=>({...s,[k]:e.target.checked}))} />
                  {label}
                </label>
              ))}
              <div className="my-2 h-px bg-slate-200" />
              <div className="text-sm font-medium text-slate-900">Push Notifications</div>
              {[
                ["pushCritical","Critical alerts (recommended)"],
                ["pushUpdates","General updates"],
              ].map(([k, label])=>(
                <label key={k} className="flex items-center gap-3 text-sm">
                  <input type="checkbox" className="accent-[#2563eb]" checked={(notif as any)[k]} onChange={(e)=>setNotif(s=>({...s,[k]:e.target.checked}))} />
                  {label}
                </label>
              ))}
              <PrimaryBtn type="button" onClick={()=>alert("Notification preferences saved ✅ (demo)")}>Save Preferences</PrimaryBtn>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
