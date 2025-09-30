import React from "react";
import { Card, Button } from "../ui/blocks";

export default function Profile(){
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">User Profile</h1>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-slate-100 text-slate-700">AU</div>
            <div>
              <div className="font-medium">Admin User</div>
              <div className="text-sm text-slate-500">admin@dagupan.gov.ph</div>
              <div className="text-xs text-emerald-600">Account Status: Active</div>
            </div>
            <Button className="ml-auto">Edit Profile</Button>
          </div>

          <div className="mt-4">
            <div className="text-sm font-medium">Recent Activity</div>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li>• Approved budget request – Medical Equipment Procurement</li>
              <li>• Generated monthly report – Tourism Expenses</li>
              <li>• Reviewed budget request – School Building Repair</li>
            </ul>
          </div>
        </Card>

        <div className="space-y-3">
          <Card>
            <div className="mb-2 text-sm font-medium">Security</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm"><span>Password</span><Button>Change Password</Button></div>
              <div className="flex items-center justify-between text-sm"><span>Two-Factor Authentication</span><Button>Enable 2FA</Button></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
