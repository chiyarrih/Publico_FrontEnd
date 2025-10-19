import React from "react";

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

const AuthCard: React.FC<Props> = ({ title, subtitle, children, footer }) => (
  <div className="w-full max-w-md">
    {/* Logo/Brand */}
    <div className="w-full mb-8 text-center">
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
          P
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Publico
        </span>
      </div>
      <p className="text-sm text-gray-600">Government Transparency Platform</p>
    </div>

    {/* Card */}
    <div className="card">
      <div className="p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>
        {children}
        {footer}
      </div>
    </div>
  </div>
);

export default AuthCard;
