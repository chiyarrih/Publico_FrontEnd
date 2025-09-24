import React from "react";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#eaf1ff]">
      <div className="mx-auto flex justify-center pt-16 sm:pt-20 md:pt-24 px-4">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
