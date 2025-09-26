import React, { useEffect, useMemo, useState } from "react";
import { api } from "../services/admin.api";
import { Table, Input, Select, Button, Badge, Card } from "../ui/blocks";
import type { TxnRow } from "../types/admin";

const tone=(s:TxnRow["status"])=>s==="Completed"?"green":s==="Pending"?"yellow":"red";

export default function Transactions(){
  const [rows,setRows]=useState<TxnRow[]>([]);
  const [q,setQ]=useState(""); useEffect(()=>{ api.getTransactions().then(setRows);},[]);
  const filtered=useMemo(()=>rows.filter(r=>[r.id,r.dept,r.project].join(" ").toLowerCase().includes(q.toLowerCase())),[rows,q]);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Transaction Ledger</h1>
      <Card>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Input placeholder="Search transactions by ID, project, department…" value={q} onChange={e=>setQ(e.target.value)} className="w-full sm:w-96"/>
          <div className="ml-auto flex items-center gap-2">
            <Select defaultValue="All"><option>All Departments</option></Select>
            <Select defaultValue="All"><option>All Statuses</option></Select>
            <Button>Export Ledger</Button>
            <Button className="bg-slate-700 hover:bg-slate-800">Date Range</Button>
          </div>
        </div>
        <Table
          head={["Tx ID","Date","Department","Project","Amount","Status","Hash","Actions"]}
          rows={filtered.map(t=>[
            <a className="text-sky-600 hover:underline">{t.id}</a>,
            t.date, t.dept, t.project, "₱"+t.amount.toLocaleString(),
            <Badge tone={tone(t.status)}>{t.status}</Badge>,
            <code className="text-xs text-slate-500">{t.hash}</code>,
            <a className="text-sky-600 hover:underline">View</a>
          ])}
        />
      </Card>
    </div>
  );
}
