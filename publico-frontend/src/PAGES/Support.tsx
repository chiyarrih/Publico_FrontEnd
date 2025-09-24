import React, { useRef, useState } from "react";

const Support: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    type: "",
    message: "",
  });
  const [fileName, setFileName] = useState<string>("No file selected");
  const fileRef = useRef<HTMLInputElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onPick: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    setFileName(f ? f.name : "No file selected");
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="card lg:col-span-2">
          <div className="border-b px-5 py-3 text-sm font-medium text-slate-900">Submit a Support Request</div>
          <form onSubmit={submit} className="p-5 space-y-4">
            <label className="block">
              <div className="text-[12px] text-slate-600 mb-1">Your Name</div>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Full Name"
                className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="block">
              <div className="text-[12px] text-slate-600 mb-1">Email Address</div>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="your.email@example.com"
                className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="block">
              <div className="text-[12px] text-slate-600 mb-1">Issue Type</div>
              <select
                name="type"
                value={form.type}
                onChange={onChange}
                className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                <option value="">Select an issue type</option>
                <option>Account / Login</option>
                <option>Data Accuracy</option>
                <option>Reports & Downloads</option>
                <option>Smart Contract Alert</option>
                <option>Other</option>
              </select>
            </label>

            <label className="block">
              <div className="text-[12px] text-slate-600 mb-1">Message</div>
              <textarea
                name="message"
                value={form.message}
                onChange={onChange}
                placeholder="Please describe your issue in detail"
                rows={5}
                className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100"
              />
            </label>

            {/* Attachment */}
            <div>
              <div className="text-[12px] text-slate-600 mb-1">Attachment (Optional)</div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-50"
                >
                  Upload a file
                </button>
                <span className="text-xs text-slate-500">{fileName}</span>
              </div>
              <input ref={fileRef} type="file" className="hidden" onChange={onPick} />
            </div>

            <button
              type="submit"
              className="w-full rounded bg-[#2563eb] py-2 text-sm font-medium text-white hover:bg-[#1d4fd8]"
            >
              Submit Request
            </button>
          </form>
        </div>

        {/* Contact info */}
        <aside className="card">
          <div className="border-b px-5 py-3 text-sm font-medium text-slate-900">Contact Information</div>
          <div className="p-5 space-y-5 text-sm">
            <div>
              <div className="text-slate-500">Email</div>
              <div className="text-slate-900">support@dagupan-transparency.gov.ph</div>
            </div>
            <div>
              <div className="text-slate-500">Phone</div>
              <div className="text-slate-900">Hotline: (075) 123-4567</div>
              <div className="text-slate-500 text-xs">Mon–Fri: 8:00 AM – 5:00 PM</div>
            </div>
            <div>
              <div className="text-slate-500">Operating Hours</div>
              <div className="text-slate-900 text-sm">
                Monday to Friday: 8:00 AM – 5:00 PM
                <br />
                Saturday: 8:00 AM – 12:00 PM
                <br />
                Sunday: Closed
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Support;
