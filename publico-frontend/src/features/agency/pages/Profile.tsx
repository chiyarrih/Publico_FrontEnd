import React from "react";
import { Card } from "../ui";

export default function Profile() {
  return (
    <div className="space-y-6">
      <Card title="Profile">
        <form className="grid grid-cols-2 gap-3">
          <label className="text-xs"><span className="mb-1 block text-slate-700">First Name</span><input className="h-9 w-full rounded border border-slate-300 px-2 text-sm" defaultValue="Agency" /></label>
          <label className="text-xs"><span className="mb-1 block text-slate-700">Last Name</span><input className="h-9 w-full rounded border border-slate-300 px-2 text-sm" defaultValue="User" /></label>
          <label className="text-xs col-span-2"><span className="mb-1 block text-slate-700">Email</span><input className="h-9 w-full rounded border border-slate-300 px-2 text-sm" defaultValue="agency@example.gov" /></label>
          <div className="col-span-2"><button className="h-9 rounded bg-blue-600 px-4 text-sm text-white hover:bg-blue-700">Save</button></div>
        </form>
      </Card>
      <Card title="Security">
        <form className="grid grid-cols-2 gap-3">
          <label className="text-xs col-span-2"><span className="mb-1 block text-slate-700">Change Password</span><input type="password" className="h-9 w-full rounded border border-slate-300 px-2 text-sm" /></label>
          <div className="col-span-2"><button className="h-9 rounded bg-blue-600 px-4 text-sm text-white hover:bg-blue-700">Update</button></div>
        </form>
      </Card>
    </div>
  );
}
