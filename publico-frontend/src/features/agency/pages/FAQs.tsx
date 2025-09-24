import React, { useState } from "react";
import { Card } from "../ui";

const FAQS = [
  { q: "How are smart-contract alerts generated?", a: "They are simulated in the demo; in prod they are emitted by on-chain monitors." },
  { q: "How often is data refreshed?", a: "Nightly batch for budgets; near-real-time for transactions." },
  { q: "How do I export the ledger?", a: "Go to Transaction Ledger and click Export CSV." },
];

export default function FAQs() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Card title="FAQs">
      <ul className="divide-y">
        {FAQS.map((f,i)=>(
          <li key={i} className="py-3">
            <button className="w-full text-left" onClick={()=>setOpen(open===i?null:i)}>
              <div className="text-sm font-medium text-slate-900">{f.q}</div>
            </button>
            {open===i && <p className="mt-1 text-sm text-slate-600">{f.a}</p>}
          </li>
        ))}
      </ul>
    </Card>
  );
}
