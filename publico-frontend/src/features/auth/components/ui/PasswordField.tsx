import React, { useState } from "react";

type Props = {
  name: string;
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  showStrength?: boolean;
};

/**
 * Calculate password strength
 */
const getPasswordStrength = (password: string) => {
  if (!password) return { level: 0, label: '', color: '' };
  
  let strength = 0;
  
  // Length
  if (password.length >= 8) strength += 25;
  if (password.length >= 12) strength += 10;
  
  // Has lowercase
  if (/[a-z]/.test(password)) strength += 15;
  
  // Has uppercase
  if (/[A-Z]/.test(password)) strength += 15;
  
  // Has number
  if (/[0-9]/.test(password)) strength += 15;
  
  // Has special character
  if (/[^A-Za-z0-9]/.test(password)) strength += 20;
  
  // Determine level
  let level = 0;
  let label = '';
  let color = '';
  
  if (strength >= 80) {
    level = 4;
    label = 'Strong';
    color = 'bg-emerald-500';
  } else if (strength >= 60) {
    level = 3;
    label = 'Good';
    color = 'bg-blue-500';
  } else if (strength >= 40) {
    level = 2;
    label = 'Fair';
    color = 'bg-amber-500';
  } else if (strength > 0) {
    level = 1;
    label = 'Weak';
    color = 'bg-rose-500';
  }
  
  return { level, label, color };
};

const PasswordField: React.FC<Props> = ({ 
  name, 
  label, 
  value, 
  onChange, 
  disabled, 
  error, 
  placeholder,
  showStrength = false 
}) => {
  const [show, setShow] = useState(false);
  const strength = showStrength ? getPasswordStrength(value) : null;
  
  return (
    <div className="space-y-2">
      <label className="block">
        <span className="block text-sm font-medium text-gray-700 mb-2">{label}</span>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`input-field pr-12 ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''}`}
          />
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            tabIndex={-1}
            disabled={disabled}
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? (
              <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {error && (
          <span className="flex items-center gap-1.5 mt-1.5 text-xs text-red-600">
            <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </span>
        )}
      </label>
      
      {/* Password Strength Indicator */}
      {showStrength && value && strength && strength.level > 0 && (
        <div className="space-y-1.5">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((bar) => (
              <div
                key={bar}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  bar <= strength.level ? strength.color : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className={`text-xs font-medium ${
            strength.level === 4 ? 'text-emerald-600' :
            strength.level === 3 ? 'text-blue-600' :
            strength.level === 2 ? 'text-amber-600' :
            'text-rose-600'
          }`}>
            Password strength: {strength.label}
          </p>
        </div>
      )}
    </div>
  );
};

export default PasswordField;
