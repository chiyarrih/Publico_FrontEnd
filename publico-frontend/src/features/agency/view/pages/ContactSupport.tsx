import React, { useRef, useState, useEffect } from "react";
import { ContactSupportService, ContactSupportRequest } from "../../../shared/services/contactSupportService";
import { getUserData } from "../../../../utils/auth";

export default function ContactSupport() {
  const [form, setForm] = useState({ name: "", email: "", type: "", message: "" });
  const [fileName, setFileName] = useState("No file selected");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Pre-fill form with user data if available
  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      let name = "";
      let email = userData.email || "";
      
      // Handle different user types
      if (userData.role === 'Citizen') {
        name = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
      } else if (userData.role === 'Agency') {
        name = userData.agency_name || "";
        email = userData.contact_email || userData.email || "";
      } else if (userData.role === 'Admin') {
        name = `${userData.first_name || ''} ${userData.last_name || ''}`.trim();
      }
      
      setForm(prev => ({
        ...prev,
        name,
        email
      }));
    }
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onPick: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    setFileName(e.target.files?.[0]?.name || "No file selected");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Validate form
      if (!form.name || !form.email || !form.type || !form.message) {
        throw new Error("All fields are required");
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        throw new Error("Please enter a valid email address");
      }

      const request: ContactSupportRequest = {
        name: form.name,
        email: form.email,
        userRole: 'Agency',
        issueType: form.type,
        message: form.message,
        attachment: fileRef.current?.files?.[0] || undefined
      };

      const response = await ContactSupportService.submitRequest(request);
      
      if (response.success) {
        setSubmitMessage({ type: 'success', text: 'Support request submitted successfully! We will get back to you soon.' });
        setForm({ name: "", email: "", type: "", message: "" });
        setFileName("No file selected");
        if (fileRef.current) fileRef.current.value = "";
      } else {
        throw new Error(response.message || 'Failed to submit support request');
      }
    } catch (error) {
      console.error('Error submitting support request:', error);
      setSubmitMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to submit support request. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-[2fr_1fr] gap-4">
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="text-lg font-semibold mb-3">Contact Support</div>
        {submitMessage && (
          <div className={`mb-4 p-3 rounded-md ${
            submitMessage.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {submitMessage.text}
          </div>
        )}
        <form onSubmit={submit} className="grid grid-cols-2 gap-3">
          <label className="col-span-2 text-xs">
            <span className="block mb-1 text-slate-700">Your Name</span>
            <input 
              name="name"
              value={form.name}
              onChange={onChange}
              className="w-full h-9 rounded border border-slate-300 px-2 text-sm" 
              placeholder="Full Name"
              required
            />
          </label>
          <label className="col-span-2 text-xs">
            <span className="block mb-1 text-slate-700">Email Address</span>
            <input 
              name="email"
              type="email"
              value={form.email}
              readOnly
              className="w-full h-9 rounded border border-slate-300 px-2 text-sm bg-gray-50 cursor-not-allowed" 
              placeholder="your.email@example.com"
              required
            />
          </label>
          <label className="col-span-2 text-xs">
            <span className="block mb-1 text-slate-700">Issue Type</span>
            <select 
              name="type"
              value={form.type}
              onChange={onChange}
              className="w-full h-9 rounded border border-slate-300 px-2 text-sm"
              required
            >
              <option value="">Select an issue type</option>
              <option value="General">General</option>
              <option value="Account / Login">Account / Login</option>
              <option value="Data Accuracy">Data Accuracy</option>
              <option value="Reports & Downloads">Reports & Downloads</option>
              <option value="Smart Contract Alert">Smart Contract Alert</option>
              <option value="Data Concern">Data Concern</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label className="col-span-2 text-xs">
            <span className="block mb-1 text-slate-700">Message</span>
            <textarea 
              name="message"
              value={form.message}
              onChange={onChange}
              className="w-full min-h-[120px] rounded border border-slate-300 px-2 py-2 text-sm" 
              placeholder="Please describe your issue in detail"
              required
            />
          </label>
          <div className="col-span-2 text-xs">
            <div 
              className="rounded border border-dashed border-slate-300 p-4 text-center text-slate-600 cursor-pointer hover:bg-slate-50"
              onClick={() => fileRef.current?.click()}
            >
              Upload a file <span className="text-[11px] text-slate-400">(optional)</span> • {fileName}
            </div>
            <input 
              ref={fileRef} 
              type="file" 
              className="hidden" 
              onChange={onPick}
              accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.zip,.rar"
            />
          </div>
          <div className="col-span-2">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-10 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
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
