import React from "react";
import { Toaster } from "react-hot-toast";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#eaf1ff]">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 5000,
            style: {
              background: '#10b981',
              color: '#fff',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#ef4444',
              color: '#fff',
            },
          },
        }}
      />
      <div className="mx-auto flex justify-center pt-16 sm:pt-20 md:pt-24 px-4">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
