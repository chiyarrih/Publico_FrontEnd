import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { RegisterCitizenRequest, RegisterAgencyRequest, RegisterAdminRequest } from "../../../shared/types/auth";
import { validateEmail, validatePassword } from "../../../utils/auth";
import AuthLayout from "./AuthLayout";
import AuthCard from "./ui/AuthCard";
import FormField from "./ui/FormField";
import PasswordField from "./ui/PasswordField";
import RadioRow from "./ui/RadioRow";
import { Upload, X } from "lucide-react";

type Role = "citizen" | "agency" | "admin";
type Errors = Record<string, string>;

const SignupPage = () => {
  const { register, isLoading, error, clearError } = useAuth();
  const [form, setForm] = useState({
    role: "citizen" as Role,
    firstName: "", lastName: "",
    email: "", password: "", confirm: "",
    agencyName: "", agencyCode: "", contactPhone: "", department: "", address: "",
    terms: false,
  });
  const [errs, setErrs] = useState<Errors>({});
  const [documents, setDocuments] = useState<{
    agencyLicense: File | null;
    businessCertificate: File | null;
    proofOfInsurance: File | null;
  }>({
    agencyLicense: null,
    businessCertificate: null,
    proofOfInsurance: null,
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(s => ({ ...s, [name]: type === "checkbox" ? checked : value }));
    if (errs[name]) setErrs(o => ({ ...o, [name]: "" }));
    if (error) clearError();
  };

  const handleDocumentUpload = (type: keyof typeof documents, file: File | null) => {
    setDocuments(prev => ({ ...prev, [type]: file }));
    if (errs[type]) setErrs(o => ({ ...o, [type]: "" }));
  };

  const removeDocument = (type: keyof typeof documents) => {
    setDocuments(prev => ({ ...prev, [type]: null }));
  };

  // Document upload component
  const DocumentUploadField = ({ 
    label, 
    type, 
    file, 
    error 
  }: { 
    label: string; 
    type: keyof typeof documents; 
    file: File | null; 
    error?: string; 
  }) => (
    <div className="space-y-1">
      <label className="block text-[12px] font-medium text-slate-700">{label}</label>
      <div className="relative">
        <input
          type="file"
          id={`${type}-upload`}
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleDocumentUpload(type, e.target.files?.[0] || null)}
          disabled={isLoading}
        />
        <label
          htmlFor={`${type}-upload`}
          className="flex items-center justify-between w-full p-3 text-sm border border-slate-300 rounded cursor-pointer hover:bg-slate-50"
        >
          <span className={file ? "text-slate-900" : "text-slate-500"}>
            {file ? file.name : "Select file..."}
          </span>
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-slate-400" />
            <span className="text-[#2563eb] text-[12px] font-medium">Browse</span>
          </div>
        </label>
        {file && (
          <button
            type="button"
            onClick={() => removeDocument(type)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded"
            disabled={isLoading}
          >
            <X className="w-3 h-3 text-slate-400" />
          </button>
        )}
      </div>
      {error && <span className="text-[11px] text-red-600">{error}</span>}
    </div>
  );

  const validate = (): boolean => {
    const e: Errors = {};
    const need = (k: string, v: string, msg = "Required") => { if (!v.trim()) e[k] = msg; };

    // common
    need("email", form.email, "Email is required");
    if (form.email && !validateEmail(form.email)) e.email = "Invalid email";
    need("password", form.password, "Password is required");
    if (form.password && !validatePassword(form.password))
      e.password = "Min 8 chars with upper, lower, number & special";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    if (!form.terms) e.terms = "Agree to the terms";

    // names (citizen always, agency also needs them)
    need("firstName", form.firstName, "First name is required");
    need("lastName", form.lastName, "Last name is required");

    if (form.role === "agency") {
      need("agencyName", form.agencyName, "Agency name is required");
      need("agencyCode", form.agencyCode, "Agency code is required");
      need("contactPhone", form.contactPhone, "Contact phone is required");
      need("address", form.address, "Address is required");
      
      // Document validation for agency
      if (!documents.agencyLicense) e.agencyLicense = "Agency License is required";
      if (!documents.businessCertificate) e.businessCertificate = "Business Certificate is required";
      if (!documents.proofOfInsurance) e.proofOfInsurance = "Proof of Insurance is required";
    }

    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let payload: RegisterCitizenRequest | RegisterAgencyRequest | RegisterAdminRequest;
    if (form.role === "citizen") {
      payload = {
        role: "Citizen",
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        password: form.password,
      };
    } else if (form.role === "agency") {
      payload = {
        role: "Agency",
        agency_name: form.agencyName,
        agency_code: form.agencyCode,
        email: form.email,
        password: form.password,
        contact_phone: form.contactPhone,
        department: form.department,
        address: form.address,
        documents: documents, // Include documents for agency
      };
      console.log("🚀 Agency registration payload:", payload);
    } else {
      payload = {
        role: "Admin",
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        password: form.password,
      };
    }
    await register(payload);
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Create an Account"
        footer={
          <p className="mt-3 text-center text-[12px] text-slate-600">
            Already have an account? <Link to="/login" className="text-[#2563eb] hover:underline">Log in</Link>
          </p>
        }
      >
        {error && (
          <div className="bg-red-50 border border-red-200 rounded px-3 py-2 text-[12px] text-red-600 mb-3">{error}</div>
        )}

        <form className="space-y-3" onSubmit={onSubmit}>
          <RadioRow<Role>
            label="I am creating an account as a:"
            name="role"
            value={form.role}
            onChange={onChange}
            options={[
              { label: "Citizen", value: "citizen" },
              { label: "Agency Representative", value: "agency" },
              { label: "Administrator", value: "admin" },
            ]}
          />

          {/* Names */}
          <div className="grid grid-cols-2 gap-2">
            <FormField label="First Name" name="firstName" value={form.firstName} onChange={onChange} disabled={isLoading} error={errs.firstName} />
            <FormField label="Last Name"  name="lastName"  value={form.lastName}  onChange={onChange} disabled={isLoading} error={errs.lastName} />
          </div>

          {/* Agency-only */}
          {form.role === "agency" && (
            <>
              <FormField label="Agency Name" name="agencyName" value={form.agencyName} onChange={onChange} disabled={isLoading} error={errs.agencyName} placeholder="e.g., Department of Transportation" />
              <div className="grid grid-cols-2 gap-2">
                <FormField label="Agency Code" name="agencyCode" value={form.agencyCode} onChange={onChange} disabled={isLoading} error={errs.agencyCode} placeholder="e.g., DOT" />
                <FormField label="Contact Phone" name="contactPhone" value={form.contactPhone} onChange={onChange} disabled={isLoading} error={errs.contactPhone} placeholder="e.g., +63..." />
              </div>
              <FormField label="Department (Optional)" name="department" value={form.department} onChange={onChange} disabled={isLoading} placeholder="e.g., Budget Planning" />
              <FormField label="Address" name="address" value={form.address} onChange={onChange} disabled={isLoading} error={errs.address} placeholder="Agency address" />
              
              {/* Document Upload Section */}
              <div className="space-y-3 pt-2">
                <h3 className="text-[13px] font-medium text-slate-700">Required Documents</h3>
                <DocumentUploadField 
                  label="Agency License" 
                  type="agencyLicense" 
                  file={documents.agencyLicense} 
                  error={errs.agencyLicense} 
                />
                <DocumentUploadField 
                  label="Business Certificate" 
                  type="businessCertificate" 
                  file={documents.businessCertificate} 
                  error={errs.businessCertificate} 
                />
                <DocumentUploadField 
                  label="Proof of Insurance" 
                  type="proofOfInsurance" 
                  file={documents.proofOfInsurance} 
                  error={errs.proofOfInsurance} 
                />
              </div>
            </>
          )}

          {/* Common auth fields */}
          <FormField label="Email" type="email" name="email" value={form.email} onChange={onChange} disabled={isLoading} error={errs.email} />
          <PasswordField label="Password" name="password" value={form.password} onChange={onChange} disabled={isLoading} error={errs.password} />
          <PasswordField label="Confirm Password" name="confirm" value={form.confirm} onChange={onChange} disabled={isLoading} error={errs.confirm} />

          <label className="flex items-center gap-2 text-[12px]">
            <input className="accent-[#2563eb]" type="checkbox" name="terms" checked={form.terms} onChange={onChange} disabled={isLoading} />
            I agree to the terms and conditions
            {errs.terms && <span className="text-[11px] text-red-600 ml-2">{errs.terms}</span>}
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-9 rounded bg-[#2563eb] text-white text-[13px] font-medium hover:bg-[#1d4fd8] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
};

export default SignupPage;
