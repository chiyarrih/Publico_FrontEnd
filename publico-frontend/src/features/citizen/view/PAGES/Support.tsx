import React, { useRef, useState } from "react";
import { Card, Field, Input, Select, Textarea, PrimaryBtn } from "../../../../shared/ui";
import { ContactSupportService, ContactSupportRequest } from "../../../shared/services/contactSupportService";
import { getUserData, getCurrentUserRole } from "../../../../utils/auth";

const Icon = {
  mail: (cls = "h-4 w-4") => (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M4 6h16v12H4z" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  ),
  phone: (cls = "h-4 w-4") => (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M5 3h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 7a2 2 0 0 1 2-2z" />
    </svg>
  ),
  clock: (cls = "h-4 w-4") => (
    <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
};

export default function Support() {
  const [form, setForm] = useState({ name: "", email: "", type: "", message: "" });
  const [fileName, setFileName] = useState("No file selected");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Pre-fill form with user data if available
  React.useEffect(() => {
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
        userRole: 'Citizen',
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: form */}
        <Card className="lg:col-span-2" title="Submit a Support Request">
          {submitMessage && (
            <div className={`mb-4 p-3 rounded-md ${
              submitMessage.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {submitMessage.text}
            </div>
          )}
          <form onSubmit={submit} className="space-y-4">
            <Field label="Your Name">
              <Input name="name" value={form.name} onChange={onChange} placeholder="Full Name" />
            </Field>
            <Field label="Email Address">
              <Input 
                name="email" 
                type="email" 
                value={form.email} 
                readOnly 
                className="bg-gray-50 cursor-not-allowed" 
                placeholder="your.email@example.com" 
              />
            </Field>
            <Field label="Issue Type">
              <Select name="type" value={form.type} onChange={onChange}>
                <option value="">Select an issue type</option>
                <option>General</option>
                <option>Account / Login</option>
                <option>Data Accuracy</option>
                <option>Reports & Downloads</option>
                <option>Smart Contract Alert</option>
                <option>Data Concern</option>
                <option>Other</option>
              </Select>
            </Field>
            <Field label="Message">
              <Textarea
                name="message"
                rows={5}
                value={form.message}
                onChange={onChange}
                placeholder="Tell us what happened—include any IDs, steps to reproduce, or screenshots."
              />
            </Field>

            <div>
              <div className="mb-1 text-[12px] text-slate-600">Attachment (Optional)</div>
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

            <PrimaryBtn type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </PrimaryBtn>
          </form>
        </Card>

        {/* Right: contact info with icons */}
        <Card title="Contact Information">
          <div className="space-y-5 text-sm">
            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-blue-50 p-2 text-blue-600">{Icon.mail()}</div>
              <div>
                <div className="text-slate-500">Email</div>
                <a href="mailto:support@dagupan-transparency.gov.ph" className="text-slate-900 hover:underline">
                  support@dagupan-transparency.gov.ph
                </a>
                <div className="text-xs text-slate-500 mt-0.5">We typically respond within 1 business day.</div>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-emerald-50 p-2 text-emerald-600">{Icon.phone()}</div>
              <div>
                <div className="text-slate-500">Phone</div>
                <div className="text-slate-900">Hotline: (075) 123-4567</div>
                <div className="text-xs text-slate-500">If urgent, call us so we can help right away.</div>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-amber-50 p-2 text-amber-600">{Icon.clock()}</div>
              <div>
                <div className="text-slate-500">Operating Hours</div>
                <div className="text-slate-900">
                  Mon–Fri: 8:00 AM – 5:00 PM<br />
                  Sat: 8:00 AM – 12:00 PM<br />
                  Sun: Closed
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Send tickets anytime—we’ll reply during office hours.</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
