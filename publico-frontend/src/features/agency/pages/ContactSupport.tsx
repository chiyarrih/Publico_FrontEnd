import React from "react";
import { Card } from "../ui";

export default function ContactSupport() {
  return (
    <Card title="Contact Support">
      <form className="grid grid-cols-2 gap-3">
        <label className="text-xs col-span-2"><span className="mb-1 block text-slate-700">Subject</span><input className="h-9 w-full rounded border border-slate-300 px-2 text-sm" placeholder="Describe your issue" /></label>
        <label className="text-xs col-span-2"><span className="mb-1 block text-slate-700">Message</span><textarea rows={5} className="w-full rounded border border-slate-300 px-2 py-2 text-sm" /></label>
        <div className="col-span-2"><button className="h-9 rounded bg-blue-600 px-4 text-sm text-white hover:bg-blue-700">Send</button></div>
      </form>
      <div className="mt-4 text-sm text-slate-600">
        Or email us at <span className="text-blue-600">support@publicoo.gov</span>
      </div>
    </Card>
  );
}
