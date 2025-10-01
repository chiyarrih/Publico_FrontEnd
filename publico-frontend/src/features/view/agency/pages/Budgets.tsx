import React from "react";
import { Card } from "../ui/blocks";
import { StatusTag } from "../ui/StatusTag";

type Row = { id: string; program: string; quarter: "Q1" | "Q2" | "Q3" | "Q4"; requested: number; status: string };

const ROWS: Row[] = [
  { id: "b1", program: "Roadworks", quarter: "Q3", requested: 250000, status: "Approved" },
  { id: "b2", program: "Drainage", quarter: "Q4", requested: 180000, status: "Pending" },
  { id: "b3", program: "Equipment", quarter: "Q2", requested: 320000, status: "Rejected" },
];

const peso = (n: number) =>
  n.toLocaleString("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 });

export default function Budgets() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="Requests">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="py-2 pr-4">Program</th>
                <th className="py-2 pr-4">Quarter</th>
                <th className="py-2 pr-4">Amount</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {ROWS.map((r) => (
                <tr key={r.id}>
                  <td className="py-2 pr-4">{r.program}</td>
                  <td className="py-2 pr-4">{r.quarter}</td>
                  <td className="py-2 pr-4">{peso(r.requested)}</td>
                  <td className="py-2 pr-4"><StatusTag value={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="New Budget Request">
        <form
          className="grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Submitted (demo)");
          }}
        >
          <label className="grid gap-1">
            <span className="text-xs text-slate-600">Program</span>
            <input className="rounded border px-3 py-2" placeholder="e.g., Roadworks" required />
          </label>

          <label className="grid gap-1">
            <span className="text-xs text-slate-600">Quarter</span>
            <select className="rounded border px-3 py-2" defaultValue="Q3">
              <option>Q1</option>
              <option>Q2</option>
              <option>Q3</option>
              <option>Q4</option>
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-xs text-slate-600">Amount</span>
            <input type="number" className="rounded border px-3 py-2" placeholder="₱" min={0} required />
          </label>

          <button className="rounded-md bg-slate-900 px-4 py-2 text-white">Submit</button>
        </form>
      </Card>
    </div>
  );
}
