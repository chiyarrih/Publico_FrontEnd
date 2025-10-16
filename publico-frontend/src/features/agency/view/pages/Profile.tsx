import ProfileComponent from "@agency/controller/components/profile/ProfileComponent";
import React from "react";
import useConnectWallet from "@agency/controller/hooks/useConnectWallet";

type Prof = { name: string; email: string; phone: string; address: string; avatar?: string };
const KEY = "agency_profile_v2";
const load = <T,>(k:string,f:T):T => { try{ const r=localStorage.getItem(k); return r?JSON.parse(r) as T:f }catch{return f} };
const save = (k:string,v:any)=>localStorage.setItem(k,JSON.stringify(v));

const Profile: React.FC = () => {
  const [tab, setTab] = React.useState<"info"|"notify">("info");
  const { profile } = useConnectWallet();
  const [p,setP]=React.useState<Prof>(()=>load(KEY,{
    name: profile.name || "Loading...",
    email: profile.email || "Loading...",
    phone: profile.phone || "Loading...",
    address: profile.address || "Loading..."
  }));
  const [prefs,setPrefs]=React.useState({email:true,sms:false,weekly:true});

  // Update profile when data loads
  React.useEffect(() => {
    if (profile.name) {
      setP({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        address: profile.address
      });
    }
  }, [profile]);

  const onAvatar = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const f=e.target.files?.[0]; if(!f) return;
    const r=new FileReader(); r.onload=()=>setP(s=>({...s,avatar:String(r.result)})); r.readAsDataURL(f);
  };
  const saveInfo=()=>{ save(KEY,p); alert("Profile saved (local)"); };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="text-lg font-semibold">User Profile</div>
        <div className="mt-3 flex items-center gap-6 text-sm">
          <button onClick={()=>setTab("info")} className={`pb-2 border-b-2 ${tab==="info"?"border-blue-600 text-blue-700":"border-transparent text-slate-500"}`}>Profile Information</button>
          <button onClick={()=>setTab("notify")} className={`pb-2 border-b-2 ${tab==="notify"?"border-blue-600 text-blue-700":"border-transparent text-slate-500"}`}>Notifications</button>
        </div>
      </div>

      {tab==="info" && (
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <ProfileComponent/>
        </div>
      )}


      {tab==="notify" && (
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-sm font-medium mb-3">Notification Preferences</div>
          <label className="flex items-center justify-between py-2 border-b"><span className="text-sm">Email updates</span>
            <input type="checkbox" className="accent-blue-600" checked={prefs.email} onChange={(e)=>setPrefs(s=>({...s,email:e.target.checked}))}/></label>
          <label className="flex items-center justify-between py-2 border-b"><span className="text-sm">SMS notifications</span>
            <input type="checkbox" className="accent-blue-600" checked={prefs.sms} onChange={(e)=>setPrefs(s=>({...s,sms:e.target.checked}))}/></label>
          <label className="flex items-center justify-between py-2"><span className="text-sm">Weekly activity digest</span>
            <input type="checkbox" className="accent-blue-600" checked={prefs.weekly} onChange={(e)=>setPrefs(s=>({...s,weekly:e.target.checked}))}/></label>
          <button className="mt-3 h-9 px-4 rounded border border-slate-300 text-sm hover:bg-slate-50">Save Preferences</button>
        </div>
      )}

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 flex items-center gap-2">
        <svg className="w-4 h-4 text-yellow-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01" />
        </svg>
        <span>Prototype: data is stored locally in your browser.</span>
      </div>
    </div>
  );
};

export default Profile;
