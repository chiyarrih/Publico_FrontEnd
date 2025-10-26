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
        </div>
      </div>

      {tab==="info" && (
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <ProfileComponent/>
        </div>
      )}

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600">
        ⚠️ Prototype: data is stored locally in your browser.
      </div>
    </div>
  );
};

export default Profile;
