import React, { useMemo, useState } from "react";
import { Card, Input, Select } from "../../../../shared/ui";
import { FAQ_DATA } from "../../controller/data/demo";

const TAGS = ["All", "General", "Data", "Security", "Reports", "Blockchain"] as const;

export default function FAQ() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<typeof TAGS[number]>("All");
  const [open, setOpen] = useState<number | null>(null);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQ_DATA.filter((f: any) => (tag === "All" || f.tag === tag) && (q === "" || f.q.toLowerCase().includes(q)));
  }, [query, tag]);

  return (
    <div className="space-y-6">
    
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Input placeholder="Search FAQs..." value={query} onChange={(e)=>setQuery(e.target.value)} />
          <Select value={tag} onChange={(e)=>setTag(e.target.value as any)} className="w-40">
            {TAGS.map(t => <option key={t}>{t}</option>)}
          </Select>
        </div>

        <div className="mt-4 space-y-2">
          {list.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="rounded border border-slate-200 bg-white">
                <button onClick={()=>setOpen(p=>p===i?null:i)} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-900">
                  <span>{f.q}</span><span className="text-slate-400">{isOpen ? "▴" : "▾"}</span>
                </button>
                {isOpen && <div className="px-4 pb-4 text-sm text-slate-600">{f.a}<div className="mt-2 text-xs text-slate-500">Category: {f.tag}</div></div>}
              </div>
            );
          })}
          {list.length === 0 && <div className="rounded border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">No FAQs matched your search.</div>}
        </div>

        <div className="mt-6 rounded border border-slate-200 bg-slate-50 p-4">
          <div className="mb-1 font-medium text-slate-900">Can’t find what you’re looking for?</div>
          <p className="text-sm text-slate-600">If you couldn’t find the answer to your question, please reach out to our support team for assistance.</p>
          <a href="/app/support" className="mt-3 inline-flex rounded bg-[#2563eb] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#1d4fd8]">Contact Support</a>
        </div>
      </Card>
    </div>
  );
}
