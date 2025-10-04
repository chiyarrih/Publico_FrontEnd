import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../../admin/services/admin.api";
import { Badge, Button, Card, Input, Select, Table } from "../ui/blocks";
import type { BudgetRequest } from "../../../model/admin/types/admin";

const tone=(s:BudgetRequest["status"])=>s==="Approved"?"green":s==="Pending"?"yellow":s==="Rejected"?"red":"blue";

export default function BudgetRequests(){
  const [items,setItems]=useState<BudgetRequest[]>([]);
  const [q,setQ]=useState("");
  useEffect(()=>{ api.getBudgetRequests().then(setItems);},[]);
  const filtered=useMemo(()=>items.filter(i=>[i.id,i.dept,i.project].join(" ").toLowerCase().includes(q.toLowerCase())),[items,q]);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Budget Requests</h1>
      <Card>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Input placeholder="Search projects, departments…" value={q} onChange={e=>setQ(e.target.value)} className="w-full sm:w-80"/>
          <div className="ml-auto flex items-center gap-2">
            <Select defaultValue="All"><option>All Departments</option></Select>
            <Select defaultValue="All"><option>All Statuses</option></Select>
            <Button>New Request</Button>
          </div>
        </div>
        <Table
          head={["Project ID","Date","Department","Project Name","Amount","Status","Actions"]}
          rows={filtered.map(r=>[
            <a className="text-sky-600 hover:underline">{r.id}</a>,
            r.date, r.dept, r.project,
            "₱"+r.amount.toLocaleString(),
            <Badge tone={tone(r)}>{r.status}</Badge>,
            <a className="text-sky-600 hover:underline">View</a>
          ])}
        />
      </Card>
    </div>
  );
}
