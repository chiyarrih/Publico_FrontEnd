import React from "react";

type Props = {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

const AuthCard: React.FC<Props> = ({ title, children, footer }) => (
  <div className="w-[360px] md:w-[440px]">
    <div className="w-full mb-3 text-center">
      <span className="text-[13px] font-semibold text-[#2563eb]">Publico</span>
    </div>

    <div className="bg-white border rounded-lg shadow border-slate-200">
      <div className="p-5">
        <h1 className="text-[15px] font-semibold text-center mb-4">{title}</h1>
        {children}
        {footer}
      </div>
    </div>
  </div>
);

export default AuthCard;
