import React, { useMemo, useState } from "react";

type FAQItem = { q: string; a: string; tag: "General" | "Data" | "Security" | "Reports" | "Blockchain" };

const DATA: FAQItem[] = [
  { q: "Where does budget data come from?", a: "Data is sourced from official LGU systems and audited reports.", tag: "Data" },
  { q: "How often is the data updated?", a: "Most datasets are updated monthly; some dashboards refresh weekly.", tag: "Data" },
  { q: "What does the transparency score mean?", a: "A composite metric indicating openness of budgets, projects, and audits.", tag: "General" },
  { q: "How can I report an issue with the data?", a: "Use the Contact Support page and choose “Data Accuracy”.", tag: "Reports" },
  { q: "What are smart contract alerts?", a: "Automated checks that flag anomalies in spending and contracts.", tag: "Blockchain" },
  { q: "How is my privacy protected on this platform?", a: "Personal information is minimized and stored under strict policies.", tag: "Security" },
  { q: "Can I download reports and data?", a: "Yes, CSV and PDF downloads are available in related sections.", tag: "Reports" },
  { q: "What is blockchain verification?", a: "Key records are hashed and anchored on a public chain for integrity.", tag: "Blockchain" },
];

const TAGS = ["All", "General", "Data", "Security", "Reports", "Blockchain"] as const;

const FAQ: React.FC = () => {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<typeof TAGS[number]>("All");
  const [open, setOpen] = useState<number | null>(null);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DATA.filter((f) => (tag === "All" || f.tag === tag) && (q === "" || f.q.toLowerCase().includes(q)));
  }, [query, tag]);

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-slate-900">Frequently Asked Questions</h1>

      <div className="card p-4">
        {/* Search + filter row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search FAQs..."
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100"
          />
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value as any)}
            className="w-40 rounded border border-slate-300 bg-white px-2 py-2 text-sm"
          >
            {TAGS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* List */}
        <div className="mt-4 space-y-2">
          {list.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="rounded border border-slate-200 bg-white">
                <button
                  onClick={() => setOpen((p) => (p === i ? null : i))}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-slate-900 flex items-center justify-between"
                >
                  <span>{f.q}</span>
                  <span className="text-slate-400">{isOpen ? "▴" : "▾"}</span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-sm text-slate-600">
                    {f.a}
                    <div className="mt-2 text-xs text-slate-500">Category: {f.tag}</div>
                  </div>
                )}
              </div>
            );
          })}
          {list.length === 0 && (
            <div className="rounded border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
              No FAQs matched your search.
            </div>
          )}
        </div>

        {/* CTA box */}
        <div className="mt-6 rounded border border-slate-200 bg-slate-50 p-4">
          <div className="font-medium text-slate-900 mb-1">Can’t find what you’re looking for?</div>
          <p className="text-sm text-slate-600">
            If you couldn’t find the answer to your question, please reach out to our support team for assistance.
          </p>
          <a
            href="/app/support"
            className="mt-3 inline-flex rounded bg-[#2563eb] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#1d4fd8]"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
