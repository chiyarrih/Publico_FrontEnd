import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthService } from "../services/authApi";
import AuthLayout from "./AuthLayout";
import AuthCard from "./ui/AuthCard";

const OTPVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Get email from location state or localStorage
    const stateEmail = location.state?.email;
    const storedEmail = localStorage.getItem('pending_verification_email');
    
    if (stateEmail) {
      setEmail(stateEmail);
      localStorage.setItem('pending_verification_email', stateEmail);
    } else if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // If no email found, redirect to signup
      navigate('/signup');
    }

    // Start resend cooldown
    setResendCooldown(60);
    const timer = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, location.state]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== "") && newOtp.join("").length === 6) {
      handleVerifyOTP(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (otpCode?: string) => {
    const otpString = otpCode || otp.join("");
    
    if (otpString.length !== 6) {
      setError("Please enter a complete 6-digit code");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      // Use the dedicated OTP verification endpoint
      await AuthService.verifyOTP(email, otpString);
      
      setMessage("Email verified successfully! Redirecting to application status...");
      
      // Redirect to application under review page after successful verification
      setTimeout(() => {
        navigate('/application-under-review', { 
          state: { 
            email, 
            role: 'Agency',
            applicationStatus: 'pending',
            message: 'Email verified successfully! Your application is now under review.'
          } 
        });
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || "Invalid verification code. Please try again.");
      // Clear OTP on error
      setOtp(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      // Use the dedicated OTP sending endpoint
      await AuthService.sendOTP(email);
      
      setMessage("Verification code sent to your email!");
      setResendCooldown(60);
      
      // Start cooldown timer
      const timer = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (err: any) {
      setError(err.message || "Failed to resend code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSignup = () => {
    localStorage.removeItem('pending_verification_email');
    navigate('/signup');
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Verify Your Email"
        footer={
          <div className="mt-4 text-center">
            <button
              onClick={handleBackToSignup}
              className="text-[#2563eb] hover:underline text-[12px]"
              disabled={isLoading}
            >
              Back to Sign Up
            </button>
          </div>
        }
      >
        {error && (
          <div className="bg-red-50 border border-red-200 rounded px-3 py-2 text-[12px] text-red-600 mb-3">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-200 rounded px-3 py-2 text-[12px] text-green-600 mb-3">
            {message}
          </div>
        )}

        <div className="space-y-4">
          {/* OTP Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full border-2 border-blue-200 flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">OTP</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-600">
              We've sent a verification code to <strong>{email}</strong>
            </p>
            <p className="text-sm text-slate-600">
              Please enter the 6-digit code below.
            </p>
          </div>

          {/* OTP Input Fields */}
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isLoading}
                className="w-12 h-12 text-center text-lg font-semibold border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
            ))}
          </div>

          {/* Resend Code Section */}
          <div className="text-center space-y-2">
            <p className="text-xs text-slate-500">
              Didn't receive the code? Check your spam folder or click below to resend.
            </p>
            <button
              onClick={handleResendCode}
              disabled={isLoading || resendCooldown > 0}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {resendCooldown > 0 
                ? `Resend Verification Code (${resendCooldown}s)` 
                : "Resend Verification Code"
              }
            </button>
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  );
};

export default OTPVerificationPage;
