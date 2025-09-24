import React, { useRef, useState } from "react";
import { Card, Field, Input, Select, Textarea, PrimaryBtn } from "../../../shared/ui";

export default function Support() {
  const [form, setForm] = useState({ name: "", email: "", type: "", message: "" });
  const [fileName, setFileName] = useState("No file selected");
  const fileRef = useRef<HTMLInputElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onPick: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    setFileName(e.target.files?.[0]?.name || "No file selected");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Support request submitted ✅ (demo)");
    setForm({ name: "", email: "", type: "", message: "" });
    setFileName("No file selected");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-slate-900">Contact Support</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2" title="Submit a Support Request">
          <form onSubmit={submit} className="space-y-4">
            <Field label="Your Name"><Input name="name" value={form.name} onChange={onChange} placeholder="Full Name" /></Field>
            <Field label="Email Address"><Input name="email" type="email" value={form.email} onChange={onChange} placeholder="your.email@example.com" /></Field>
            <Field label="Issue Type">
              <Select name="type" value={form.type} onChange={onChange}>
                <option value="">Select an issue type</option>
                <option>Account / Login</option><option>Data Accuracy</option><option>Reports & Downloads</option><option>Smart Contract Alert</option><option>Other</option>
              </Select>
            </Field>
            <Field label="Message"><Textarea name="message" rows={5} value={form.message} onChange={onChange} placeholder="Please describe your issue in detail" /></Field>

            <div>
              <div className="mb-1 text-[12px] text-slate-600">Attachment (Optional)</div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => fileRef.current?.click()} className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-50">Upload a file</button>
                <span className="text-xs text-slate-500">{fileName}</span>
              </div>
              <input ref={fileRef} type="file" className="hidden" onChange={onPick} />
            </div>

            <PrimaryBtn type="submit" className="w-full">Submit Request</PrimaryBtn>
          </form>
        </Card>

        <Card title="Contact Information">
          <div className="space-y-5 text-sm">
            <div><div className="text-slate-500">Email</div><div className="text-slate-900">support@dagupan-transparency.gov.ph</div></div>
            <div>
              <div className="text-slate-500">Phone</div>
              <div className="text-slate-900">Hotline: (075) 123-4567</div>
              <div className="text-xs text-slate-500">Mon–Fri: 8:00 AM – 5:00 PM</div>
            </div>
            <div>
              <div className="text-slate-500">Operating Hours</div>
              <div className="text-sm text-slate-900">Monday to Friday: 8:00 AM – 5:00 PM<br/>Saturday: 8:00 AM – 12:00 PM<br/>Sunday: Closed</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
