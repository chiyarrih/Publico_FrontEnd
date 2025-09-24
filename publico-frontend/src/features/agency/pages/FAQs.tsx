import React from "react";

const qs = [
  "Where does budget data come from?",
  "How often is the data updated?",
  "What does the transparency score mean?",
  "How can I report an issue with the data?",
  "What are smart contract alerts?",
  "How is my privacy protected on this platform?",
  "Can I download reports and data?",
  "What is blockchain verification?",
];

export default function FAQs() {
  const [open, setOpen] = React.useState<number | null>(null);
  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        <div className="text-lg font-semibold">Frequently Asked Questions</div>
        <div className="mt-3 flex items-center gap-2">
          <input placeholder="Search FAQs..." className="h-9 w-full rounded border border-slate-300 px-3 text-sm"/>
          <select className="h-9 rounded border border-slate-300 px-2 text-sm"><option>All</option></select>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg divide-y">
        {qs.map((q,i)=>(
          <details key={q} open={open===i} onToggle={(e)=>setOpen(e.currentTarget.open?i:null)} className="group">
            <summary className="list-none cursor-pointer select-none p-4 flex items-center justify-between">
              <span className="text-sm">{q}</span>
              <span className="text-slate-400 group-open:rotate-180 transition">⌄</span>
            </summary>
            <div className="px-4 pb-4 text-sm text-slate-600">
              Placeholder answer. Replace with your actual FAQ content later.
            </div>
          </details>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <div className="text-sm font-medium">Can’t find what you’re looking for?</div>
        <div className="text-xs text-slate-600 mt-1">
          If you didn’t find the answer to your question, reach out to our support team.
        </div>
        <button className="mt-3 h-9 px-3 rounded bg-blue-600 text-white text-sm">Contact Support</button>
      </div>
    </div>
  );
}
