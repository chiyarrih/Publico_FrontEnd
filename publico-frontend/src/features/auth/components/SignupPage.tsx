import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AuthService } from "../services/authApi";
import { RegisterCitizenRequest, RegisterAgencyRequest, RegisterAdminRequest } from "../../../shared/types/auth";
import { validateEmail, validatePassword } from "../../../utils/auth";
import AuthLayout from "./AuthLayout";
import AuthCard from "./ui/AuthCard";
import FormField from "./ui/FormField";
import PasswordField from "./ui/PasswordField";
import RadioRow from "./ui/RadioRow";
import TermsAndConditionsModal from "./ui/TermsAndConditionsModal";
import { Upload, X, AlertCircle, CheckCircle } from "lucide-react";

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
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [agencyNameStatus, setAgencyNameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [documents, setDocuments] = useState<{
    agencyLicense: File | null;
    businessCertificate: File | null;
    proofOfInsurance: File | null;
  }>({
    agencyLicense: null,
    businessCertificate: null,
    proofOfInsurance: null,
  });

  // Real-time agency name validation
  const checkAgencyName = useCallback(async (agencyName: string) => {
    if (!agencyName.trim() || form.role !== 'agency') {
      setAgencyNameStatus('idle');
      return;
    }

    setAgencyNameStatus('checking');
    
    try {
      const response = await AuthService.checkAgencyNameAvailability(agencyName);
      setAgencyNameStatus(response.available ? 'available' : 'taken');
    } catch (error) {
      console.error('Error checking agency name:', error);
      setAgencyNameStatus('idle');
    }
  }, [form.role]);

  // Debounce the agency name check
  useEffect(() => {
    if (form.role === 'agency' && form.agencyName.trim()) {
      const timer = setTimeout(() => {
        checkAgencyName(form.agencyName);
      }, 800); // 800ms delay

      return () => clearTimeout(timer);
    } else {
      setAgencyNameStatus('idle');
    }
  }, [form.agencyName, form.role, checkAgencyName]);

  // Reset agency name status when there's an error to avoid conflicts
  useEffect(() => {
    if (error && error.includes('has already registered') && error.includes('agency')) {
      setAgencyNameStatus('taken');
    } else if (error) {
      setAgencyNameStatus('idle');
    }
  }, [error]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(s => ({ ...s, [name]: type === "checkbox" ? checked : value }));
    if (errs[name]) setErrs(o => ({ ...o, [name]: "" }));
    if (error) clearError();
    
    // Reset agency name status when user types to clear any previous error state
    if (name === 'agencyName') {
      setAgencyNameStatus('idle');
    }
  };

  const handleDocumentUpload = (type: keyof typeof documents, file: File | null) => {
    setDocuments(prev => ({ ...prev, [type]: file }));
    if (errs[type]) setErrs(o => ({ ...o, [type]: "" }));
  };

  const removeDocument = (type: keyof typeof documents) => {
    setDocuments(prev => ({ ...prev, [type]: null }));
  };

  const handleTermsClick = () => {
    setShowTermsModal(true);
  };

  const handleTermsAccept = () => {
    setHasReadTerms(true);
    setForm(prev => ({ ...prev, terms: true }));
    setErrs(prev => ({ ...prev, terms: "" }));
  };

  const handleTermsModalClose = () => {
    setShowTermsModal(false);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow checking if user has read the terms
    if (hasReadTerms) {
      const { checked } = e.target;
      setForm(prev => ({ ...prev, terms: checked }));
      if (errs.terms) setErrs(prev => ({ ...prev, terms: "" }));
    }
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
    if (!hasReadTerms) e.terms = "Please read and accept the terms and conditions";
    if (!form.terms) e.terms = "You must agree to the terms and conditions";

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
          <div className={`border rounded px-3 py-2 text-[12px] mb-3 ${
            error.includes('has already registered') && error.includes('agency')
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : 'bg-red-50 border-red-200 text-red-600'
          }`}>
            {error.includes('has already registered') && error.includes('agency') ? (
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="font-medium">Agency Already Registered</div>
                  <div className="text-[11px] mt-1">{error}</div>
                </div>
              </div>
            ) : (
              error
            )}
          </div>
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
              <div className="space-y-1">
                <div className="relative">
                  <FormField label="Agency Name" name="agencyName" value={form.agencyName} onChange={onChange} disabled={isLoading} error={errs.agencyName} placeholder="e.g., Department of Transportation" />
                  {form.agencyName && agencyNameStatus !== 'idle' && (
                    <div className="absolute right-3 top-8 flex items-center">
                      {agencyNameStatus === 'checking' && (
                        <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                      )}
                      {agencyNameStatus === 'available' && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                      {agencyNameStatus === 'taken' && (
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] text-slate-500">
                    <span className="font-medium">Note:</span> Only one representative per agency is allowed to register.
                  </p>
                  {form.agencyName && agencyNameStatus === 'available' && (
                    <p className="text-[11px] text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Agency name is available
                    </p>
                  )}
                  {form.agencyName && agencyNameStatus === 'taken' && (
                    <p className="text-[11px] text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      This agency name is already registered
                    </p>
                  )}
                </div>
              </div>
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

          <div className="space-y-2">
            <div className="flex items-start gap-3 text-[12px]">
              <div className="relative flex-shrink-0 mt-0.5">
                <input 
                  className={`accent-[#2563eb] w-4 h-4 ${
                    !hasReadTerms 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'cursor-pointer'
                  }`}
                  type="checkbox" 
                  name="terms" 
                  checked={form.terms} 
                  onChange={handleCheckboxChange}
                  disabled={isLoading || !hasReadTerms}
                  title={!hasReadTerms ? "Please read the terms and conditions first" : ""}
                />
              </div>
              <div className="flex-1">
                <span className={!hasReadTerms ? "text-gray-500" : "text-gray-700"}>
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={handleTermsClick}
                    className="text-[#2563eb] hover:underline cursor-pointer font-medium"
                    disabled={isLoading}
                  >
                    terms and conditions
                  </button>
                </span>
                {!hasReadTerms && (
                  <div className="mt-1 text-[11px] text-amber-600 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Please read the terms first
                  </div>
                )}
                {errs.terms && (
                  <div className="mt-1 text-[11px] text-red-600 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errs.terms}
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-9 rounded bg-[#2563eb] text-white text-[13px] font-medium hover:bg-[#1d4fd8] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
      </AuthCard>
      
      {/* Terms and Conditions Modal */}
      <TermsAndConditionsModal
        isOpen={showTermsModal}
        onClose={handleTermsModalClose}
        onAccept={handleTermsAccept}
      />
    </AuthLayout>
  );
};

export default SignupPage;
