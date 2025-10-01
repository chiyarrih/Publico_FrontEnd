import React from "react";
import { Card } from "../ui/blocks";
import { StatusTag } from "../ui/StatusTag";

type Tx = { id: string; ref: string; date: string; payor: string; amount: number; status: string };

const TXS: Tx[] = [
  { id: "t1", ref: "INV-002154", date: "2025-09-10", payor: "Procurement", amount: 125000, status: "Approved" },
  { id: "t2", ref: "INV-002155", date: "2025-09-12", payor: "Infra Ops", amount: 78000, status: "Pending" },
  { id: "t3", ref: "INV-002156", date: "2025-09-12", payor: "DPWH Unit A", amount: 221000, status: "Rejected" },
];

const peso = (n: number) =>
  n.toLocaleString("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 });

export default function Transactions() {
  return (
    <Card title="Transactions">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr>
              <th className="py-2 pr-4">Reference</th>
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Payor</th>
              <th className="py-2 pr-4">Amount</th>
              <th className="py-2 pr-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {TXS.map((r) => (
              <tr key={r.id}>
                <td className="py-2 pr-4">{r.ref}</td>
                <td className="py-2 pr-4">{r.date}</td>
                <td className="py-2 pr-4">{r.payor}</td>
                <td className="py-2 pr-4">{peso(r.amount)}</td>
                <td className="py-2 pr-4"><StatusTag value={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
