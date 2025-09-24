import React from "react";
import { Card } from "../ui";

export default function Documents() {
  const docs = [
    { name: "Annual Financial Report 2023.pdf", dept: "Finance", date: "2023-09-12", status: "Verified" },
    { name: "Vendor Contract – Roads.docx",    dept: "Transportation", date: "2023-09-09", status: "Pending" },
    { name: "Procurement Policy.pdf",          dept: "Admin", date: "2023-09-02", status: "Verified" },
  ];
  return (
    <Card title="Documents">
      <ul className="divide-y">
        {docs.map((d,i)=>(
          <li key={i} className="flex items-center justify-between py-3">
            <div>
              <div className="text-sm font-medium text-slate-900">{d.name}</div>
              <div className="text-[12px] text-slate-500">{d.dept} • {d.date}</div>
            </div>
            <span className={`pill ${d.status==="Verified"?"pill-green":"pill-yellow"}`}>{d.status}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
