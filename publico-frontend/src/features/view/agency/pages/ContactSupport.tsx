import React from "react";

export default function ContactSupport() {
  return (
    <div className="grid lg:grid-cols-[2fr_1fr] gap-4">
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="text-lg font-semibold mb-3">Contact Support</div>
        <form className="grid grid-cols-2 gap-3">
          <label className="col-span-2 text-xs">
            <span className="block mb-1 text-slate-700">Your Name</span>
            <input className="w-full h-9 rounded border border-slate-300 px-2 text-sm" placeholder="Full Name"/>
          </label>
          <label className="col-span-2 text-xs">
            <span className="block mb-1 text-slate-700">Email Address</span>
            <input className="w-full h-9 rounded border border-slate-300 px-2 text-sm" placeholder="your.email@example.com"/>
          </label>
          <label className="col-span-2 text-xs">
            <span className="block mb-1 text-slate-700">Issue Type</span>
            <select className="w-full h-9 rounded border border-slate-300 px-2 text-sm">
              <option>General</option><option>Data Concern</option><option>Account</option><option>Other</option>
            </select>
          </label>
          <label className="col-span-2 text-xs">
            <span className="block mb-1 text-slate-700">Message</span>
            <textarea className="w-full min-h-[120px] rounded border border-slate-300 px-2 py-2 text-sm" placeholder="Please describe your issue in detail"/>
          </label>
          <div className="col-span-2 text-xs">
            <div className="rounded border border-dashed border-slate-300 p-4 text-center text-slate-600">
              Upload a file <span className="text-[11px] text-slate-400">(optional)</span> • No file selected
            </div>
          </div>
          <div className="col-span-2">
            <button type="button" className="w-full h-10 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
              Submit Request
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="text-sm font-medium mb-3">Contact Information</div>
        <ul className="space-y-3 text-sm">
          <li><span className="font-medium">Email:</span> support@dagupan-transparency.gov.ph</li>
          <li><span className="font-medium">Phone:</span> (075) 123-4567 — Mon-Fri 8:00 AM–5:00 PM</li>
          <li><span className="font-medium">Live Chat:</span> Available during business hours</li>
        </ul>
        <div className="mt-4 text-xs text-slate-500">
          <div className="font-medium mb-1">Operating Hours</div>
          <div>Mon–Fri: 8:00 AM–5:00 PM</div>
          <div>Sat: 8:00 AM–12:00 PM</div>
          <div>Sun: Closed</div>
        </div>
      </div>
    </div>
  );
}
