import React from "react";

type Prof = { name: string; email: string; phone: string; address: string; avatar?: string };
const KEY = "agency_profile_v2";
const load = <T,>(k:string,f:T):T => { try{ const r=localStorage.getItem(k); return r?JSON.parse(r) as T:f }catch{return f} };
const save = (k:string,v:any)=>localStorage.setItem(k,JSON.stringify(v));

const Profile: React.FC = () => {
  const [tab, setTab] = React.useState<"info"|"security"|"notify">("info");
  const [p,setP]=React.useState<Prof>(()=>load(KEY,{name:"Juan Dela Cruz",email:"juan.delacruz@example.com",phone:"+63 (0) 912 345 6789",address:"Barangay Poblacion, Dagupan City"}));
  const [pw,setPw]=React.useState({cur:"",nw:"",cf:""});
  const [prefs,setPrefs]=React.useState({email:true,sms:false,weekly:true});

  const onAvatar = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const f=e.target.files?.[0]; if(!f) return;
    const r=new FileReader(); r.onload=()=>setP(s=>({...s,avatar:String(r.result)})); r.readAsDataURL(f);
  };
  const saveInfo=()=>{ save(KEY,p); alert("Profile saved (local)"); };
  const savePw=(e:React.FormEvent)=>{ e.preventDefault(); if(pw.nw!==pw.cf) return alert("Passwords do not match"); setPw({cur:"",nw:"",cf:""}); alert("Password changed (mock)"); };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="text-lg font-semibold">User Profile</div>
        <div className="mt-3 flex items-center gap-6 text-sm">
          <button onClick={()=>setTab("info")} className={`pb-2 border-b-2 ${tab==="info"?"border-blue-600 text-blue-700":"border-transparent text-slate-500"}`}>Profile Information</button>
          <button onClick={()=>setTab("security")} className={`pb-2 border-b-2 ${tab==="security"?"border-blue-600 text-blue-700":"border-transparent text-slate-500"}`}>Security</button>
          <button onClick={()=>setTab("notify")} className={`pb-2 border-b-2 ${tab==="notify"?"border-blue-600 text-blue-700":"border-transparent text-slate-500"}`}>Notifications</button>
        </div>
      </div>

      {tab==="info" && (
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="grid md:grid-cols-[240px_1fr] gap-6">
            <div>
              <div className="w-24 h-24 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                {p.avatar ? <img src={p.avatar} alt="avatar" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No photo</div>}
              </div>
              <label className="mt-3 inline-flex items-center gap-2 px-3 h-9 rounded border border-slate-300 cursor-pointer hover:bg-slate-50">
                <input type="file" accept="image/*" className="hidden" onChange={onAvatar}/>
                Upload
              </label>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <label className="text-xs"><span className="block mb-1 text-slate-700">Full Name</span>
                <input className="w-full h-9 rounded border border-slate-300 px-2 text-sm" value={p.name} onChange={(e)=>setP(s=>({...s,name:e.target.value}))}/></label>
              <label className="text-xs"><span className="block mb-1 text-slate-700">Email Address</span>
                <input className="w-full h-9 rounded border border-slate-300 px-2 text-sm" value={p.email} onChange={(e)=>setP(s=>({...s,email:e.target.value}))}/></label>
              <label className="text-xs"><span className="block mb-1 text-slate-700">Phone Number</span>
                <input className="w-full h-9 rounded border border-slate-300 px-2 text-sm" value={p.phone} onChange={(e)=>setP(s=>({...s,phone:e.target.value}))}/></label>
              <label className="text-xs md:col-span-2"><span className="block mb-1 text-slate-700">Address</span>
                <input className="w-full h-9 rounded border border-slate-300 px-2 text-sm" value={p.address} onChange={(e)=>setP(s=>({...s,address:e.target.value}))}/></label>
              <div className="md:col-span-2">
                <button onClick={saveInfo} className="h-9 px-4 rounded bg-blue-600 text-white text-sm hover:bg-blue-700">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab==="security" && (
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="text-sm font-medium mb-3">Change Password</div>
          <form className="grid md:grid-cols-2 gap-3" onSubmit={savePw}>
            <label className="text-xs md:col-span-2"><span className="block mb-1 text-slate-700">Current password</span>
              <input type="password" className="w-full h-9 rounded border border-slate-300 px-2 text-sm" value={pw.cur} onChange={(e)=>setPw(s=>({...s,cur:e.target.value}))}/></label>
            <label className="text-xs"><span className="block mb-1 text-slate-700">New password</span>
              <input type="password" className="w-full h-9 rounded border border-slate-300 px-2 text-sm" value={pw.nw} onChange={(e)=>setPw(s=>({...s,nw:e.target.value}))}/></label>
            <label className="text-xs"><span className="block mb-1 text-slate-700">Confirm password</span>
              <input type="password" className="w-full h-9 rounded border border-slate-300 px-2 text-sm" value={pw.cf} onChange={(e)=>setPw(s=>({...s,cf:e.target.value}))}/></label>
            <div className="md:col-span-2">
              <button className="h-9 px-4 rounded bg-blue-600 text-white text-sm hover:bg-blue-700">Update Password</button>
            </div>
          </form>
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

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600">
        ⚠️ Prototype: data is stored locally in your browser.
      </div>
    </div>
  );
};

export default Profile;
