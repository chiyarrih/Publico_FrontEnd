import React, { useState } from "react";

type Form = { dept: string; amount: string; start: string; end: string; note: string };

const BudgetForm: React.FC<{ onSubmit: (payload: Form) => void }> = ({ onSubmit }) => {
  const [f, setF] = useState<Form>({ dept: "Transportation", amount: "", start: "", end: "", note: "" });
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF(s => ({ ...s, [e.target.name]: e.target.value }));
  const submit = (e: React.FormEvent) => { e.preventDefault(); onSubmit(f); };

  return (
    <form onSubmit={submit} className="grid grid-cols-2 gap-3 pt-4">
      <label className="text-xs col-span-2">
        <span className="block mb-1 text-slate-700">Department</span>
        <select name="dept" value={f.dept} onChange={onChange} className="h-9 w-full rounded border border-slate-300 px-2 text-sm">
          <option>Transportation</option><option>Education</option><option>Health</option><option>IT</option><option>Finance</option>
        </select>
      </label>
      <label className="text-xs">
        <span className="block mb-1 text-slate-700">Amount (₱)</span>
        <input name="amount" value={f.amount} onChange={onChange} className="h-9 w-full rounded border border-slate-300 px-2 text-sm" placeholder="1,500,000" />
      </label>
      <div className="grid grid-cols-2 gap-3 col-span-2">
        <label className="text-xs">
          <span className="block mb-1 text-slate-700">Start Date</span>
          <input type="date" name="start" value={f.start} onChange={onChange} className="h-9 w-full rounded border border-slate-300 px-2 text-sm" />
        </label>
        <label className="text-xs">
          <span className="block mb-1 text-slate-700">End Date</span>
          <input type="date" name="end" value={f.end} onChange={onChange} className="h-9 w-full rounded border border-slate-300 px-2 text-sm" />
        </label>
      </div>
      <label className="text-xs col-span-2">
        <span className="block mb-1 text-slate-700">Notes</span>
        <textarea name="note" value={f.note} onChange={onChange} className="min-h-[80px] w-full rounded border border-slate-300 px-2 py-2 text-sm" placeholder="Describe objectives, milestones, stakeholders…" />
      </label>
      <div className="col-span-2">
        <button className="h-9 rounded bg-blue-600 px-4 text-sm text-white hover:bg-blue-700">Submit Budget</button>
      </div>
    </form>
  );
};
export default BudgetForm;
