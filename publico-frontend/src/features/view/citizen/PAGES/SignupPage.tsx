import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../controller/citizen/hooks/useAuth";
import { RegisterCitizenRequest, RegisterAgencyRequest } from "../../../../shared/types/auth";
import { validateEmail, validatePassword } from "../../../../utils/auth";

const SignupPage: React.FC = () => {
  const { register, isLoading, error, clearError } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
    role: "citizen" as "citizen" | "agency",
    terms: false,
    // Agency specific fields
    agencyName: "",
    agencyCode: "",
    contactPhone: "",
    department: "",
    address: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(s => ({ ...s, [name]: type === "checkbox" ? checked : value }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) clearError();
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Common validations
    if (!form.firstName.trim()) errors.firstName = 'First name is required';
    if (!form.lastName.trim()) errors.lastName = 'Last name is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!validateEmail(form.email)) errors.email = 'Invalid email format';
    if (!form.password) errors.password = 'Password is required';
    else if (!validatePassword(form.password)) errors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
    if (form.password !== form.confirm) errors.confirm = 'Passwords do not match';
    if (!form.terms) errors.terms = 'Please agree to the terms and conditions';

    // Agency specific validations
    if (form.role === "agency") {
      if (!form.agencyName.trim()) errors.agencyName = 'Agency name is required';
      if (!form.agencyCode.trim()) errors.agencyCode = 'Agency code is required';
      if (!form.contactPhone.trim()) errors.contactPhone = 'Contact phone is required';
      if (!form.address.trim()) errors.address = 'Address is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    let registerData: RegisterCitizenRequest | RegisterAgencyRequest;

    if (form.role === "citizen") {
      registerData = {
        role: 'Citizen',
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        password: form.password,
      } as RegisterCitizenRequest;
    } else {
      registerData = {
        role: 'Agency',
        agency_name: form.agencyName,
        agency_code: form.agencyCode,
        contact_email: form.email,
        password: form.password,
        contact_phone: form.contactPhone,
        department: form.department,
        address: form.address,
      } as RegisterAgencyRequest;
    }

    await register(registerData);
  };

  return (
    <div className="min-h-screen w-full bg-[#eaf1ff]">
      <div className="mx-auto flex justify-center pt-16 sm:pt-20 md:pt-24 px-4">
        <div className="w-[440px]">
          <div className="w-full text-center mb-3">
            <span className="text-[13px] font-semibold text-[#2563eb]">Publico</span>
          </div>

          <div className="bg-white rounded-lg shadow border border-slate-200">
            <div className="p-5">
              <h1 className="text-[15px] font-semibold text-center mb-4">Create an Account</h1>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded px-3 py-2 text-[12px] text-red-600 mb-3">
                  {error}
                </div>
              )}

              <form className="space-y-3" onSubmit={onSubmit}>
                {/* Role Selection */}
                <div>
                  <span className="block text-[12px] text-slate-700 mb-1">I am creating an account as a:</span>
                  <div className="flex items-center gap-4 text-[12px]">
                    <label className="inline-flex items-center gap-1">
                      <input 
                        type="radio" 
                        name="role" 
                        value="citizen" 
                        checked={form.role === "citizen"} 
                        onChange={onChange} 
                        className="accent-[#2563eb]" 
                      /> 
                      Citizen
                    </label>
                    <label className="inline-flex items-center gap-1">
                      <input 
                        type="radio" 
                        name="role" 
                        value="agency" 
                        checked={form.role === "agency"} 
                        onChange={onChange} 
                        className="accent-[#2563eb]" 
                      /> 
                      Agency Representative
                    </label>
                  </div>
                </div>

                {/* Citizen Fields */}
                {form.role === "citizen" && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="block">
                        <span className="block text-[12px] text-slate-700 mb-1">First Name</span>
                        <input 
                          name="firstName" 
                          value={form.firstName} 
                          onChange={onChange} 
                          disabled={isLoading}
                          className={`w-full h-8 rounded border px-2 text-[13px] focus:ring-2 focus:ring-[#2563eb]/40 disabled:bg-gray-100 ${
                            formErrors.firstName ? 'border-red-300' : 'border-slate-300'
                          }`}
                        />
                        {formErrors.firstName && (
                          <span className="text-[11px] text-red-600">{formErrors.firstName}</span>
                        )}
                      </label>
                      <label className="block">
                        <span className="block text-[12px] text-slate-700 mb-1">Last Name</span>
                        <input 
                          name="lastName" 
                          value={form.lastName} 
                          onChange={onChange} 
                          disabled={isLoading}
                          className={`w-full h-8 rounded border px-2 text-[13px] focus:ring-2 focus:ring-[#2563eb]/40 disabled:bg-gray-100 ${
                            formErrors.lastName ? 'border-red-300' : 'border-slate-300'
                          }`}
                        />
                        {formErrors.lastName && (
                          <span className="text-[11px] text-red-600">{formErrors.lastName}</span>
                        )}
                      </label>
                    </div>
                  </>
                )}

                {/* Agency Fields */}
                {form.role === "agency" && (
                  <>
                    <label className="block">
                      <span className="block text-[12px] text-slate-700 mb-1">Agency Name</span>
                      <input 
                        name="agencyName" 
                        value={form.agencyName} 
                        onChange={onChange} 
                        disabled={isLoading}
                        placeholder="e.g., Department of Transportation"
                        className={`w-full h-8 rounded border px-2 text-[13px] focus:ring-2 focus:ring-[#2563eb]/40 disabled:bg-gray-100 ${
                          formErrors.agencyName ? 'border-red-300' : 'border-slate-300'
                        }`}
                      />
                      {formErrors.agencyName && (
                        <span className="text-[11px] text-red-600">{formErrors.agencyName}</span>
                      )}
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      <label className="block">
                        <span className="block text-[12px] text-slate-700 mb-1">Agency Code</span>
                        <input 
                          name="agencyCode" 
                          value={form.agencyCode} 
                          onChange={onChange} 
                          disabled={isLoading}
                          placeholder="e.g., DOT"
                          className={`w-full h-8 rounded border px-2 text-[13px] focus:ring-2 focus:ring-[#2563eb]/40 disabled:bg-gray-100 ${
                            formErrors.agencyCode ? 'border-red-300' : 'border-slate-300'
                          }`}
                        />
                        {formErrors.agencyCode && (
                          <span className="text-[11px] text-red-600">{formErrors.agencyCode}</span>
                        )}
                      </label>
                      <label className="block">
                        <span className="block text-[12px] text-slate-700 mb-1">Contact Phone</span>
                        <input 
                          name="contactPhone" 
                          value={form.contactPhone} 
                          onChange={onChange} 
                          disabled={isLoading}
                          placeholder="e.g., +1234567890"
                          className={`w-full h-8 rounded border px-2 text-[13px] focus:ring-2 focus:ring-[#2563eb]/40 disabled:bg-gray-100 ${
                            formErrors.contactPhone ? 'border-red-300' : 'border-slate-300'
                          }`}
                        />
                        {formErrors.contactPhone && (
                          <span className="text-[11px] text-red-600">{formErrors.contactPhone}</span>
                        )}
                      </label>
                    </div>

                    <label className="block">
                      <span className="block text-[12px] text-slate-700 mb-1">Department (Optional)</span>
                      <input 
                        name="department" 
                        value={form.department} 
                        onChange={onChange} 
                        disabled={isLoading}
                        placeholder="e.g., Budget Planning"
                        className="w-full h-8 rounded border border-slate-300 px-2 text-[13px] focus:ring-2 focus:ring-[#2563eb]/40 disabled:bg-gray-100"
                      />
                    </label>

                    <label className="block">
                      <span className="block text-[12px] text-slate-700 mb-1">Address</span>
                      <input 
                        name="address" 
                        value={form.address} 
                        onChange={onChange} 
                        disabled={isLoading}
                        placeholder="Agency address"
                        className={`w-full h-8 rounded border px-2 text-[13px] focus:ring-2 focus:ring-[#2563eb]/40 disabled:bg-gray-100 ${
                          formErrors.address ? 'border-red-300' : 'border-slate-300'
                        }`}
                      />
                      {formErrors.address && (
                        <span className="text-[11px] text-red-600">{formErrors.address}</span>
                      )}
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      <label className="block">
                        <span className="block text-[12px] text-slate-700 mb-1">First Name</span>
                        <input 
                          name="firstName" 
                          value={form.firstName} 
                          onChange={onChange} 
                          disabled={isLoading}
                          className={`w-full h-8 rounded border px-2 text-[13px] focus:ring-2 focus:ring-[#2563eb]/40 disabled:bg-gray-100 ${
                            formErrors.firstName ? 'border-red-300' : 'border-slate-300'
                          }`}
                        />
                        {formErrors.firstName && (
                          <span className="text-[11px] text-red-600">{formErrors.firstName}</span>
                        )}
                      </label>
                      <label className="block">
                        <span className="block text-[12px] text-slate-700 mb-1">Last Name</span>
                        <input 
                          name="lastName" 
                          value={form.lastName} 
                          onChange={onChange} 
                          disabled={isLoading}
                          className={`w-full h-8 rounded border px-2 text-[13px] focus:ring-2 focus:ring-[#2563eb]/40 disabled:bg-gray-100 ${
                            formErrors.lastName ? 'border-red-300' : 'border-slate-300'
                          }`}
                        />
                        {formErrors.lastName && (
                          <span className="text-[11px] text-red-600">{formErrors.lastName}</span>
                        )}
                      </label>
                    </div>
                  </>
                )}

                {/* Common Fields */}
                <label className="block">
                  <span className="block text-[12px] text-slate-700 mb-1">Email</span>
                  <input 
                    type="email" 
                    name="email" 
                    value={form.email} 
                    onChange={onChange} 
                    disabled={isLoading}
                    className={`w-full h-8 rounded border px-2 text-[13px] focus:ring-2 focus:ring-[#2563eb]/40 disabled:bg-gray-100 ${
                      formErrors.email ? 'border-red-300' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.email && (
                    <span className="text-[11px] text-red-600">{formErrors.email}</span>
                  )}
                </label>

                <label className="block">
                  <span className="block text-[12px] text-slate-700 mb-1">Password</span>
                  <input 
                    type="password" 
                    name="password" 
                    value={form.password} 
                    onChange={onChange} 
                    disabled={isLoading}
                    className={`w-full h-8 rounded border px-2 text-[13px] focus:ring-2 focus:ring-[#2563eb]/40 disabled:bg-gray-100 ${
                      formErrors.password ? 'border-red-300' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.password && (
                    <span className="text-[11px] text-red-600">{formErrors.password}</span>
                  )}
                </label>

                <label className="block">
                  <span className="block text-[12px] text-slate-700 mb-1">Confirm Password</span>
                  <input 
                    type="password" 
                    name="confirm" 
                    value={form.confirm} 
                    onChange={onChange} 
                    disabled={isLoading}
                    className={`w-full h-8 rounded border px-2 text-[13px] focus:ring-2 focus:ring-[#2563eb]/40 disabled:bg-gray-100 ${
                      formErrors.confirm ? 'border-red-300' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.confirm && (
                    <span className="text-[11px] text-red-600">{formErrors.confirm}</span>
                  )}
                </label>

                <label className="flex items-center gap-2 text-[12px]">
                  <input 
                    type="checkbox" 
                    name="terms" 
                    checked={form.terms} 
                    onChange={onChange} 
                    disabled={isLoading}
                    className="accent-[#2563eb]" 
                  />
                  I agree to the terms and conditions
                  {formErrors.terms && (
                    <span className="text-[11px] text-red-600 ml-2">{formErrors.terms}</span>
                  )}
                </label>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-9 rounded bg-[#2563eb] text-white text-[13px] font-medium hover:bg-[#1d4fd8] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </form>

              <p className="mt-3 text-center text-[12px] text-slate-600">
                Already have an account? <Link to="/login" className="text-[#2563eb] hover:underline">Log in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
