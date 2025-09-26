import React, { useEffect, useState } from "react";
import { api } from "../services/admin.api";
import { Card, Badge, Button, Select } from "../ui/blocks";
import type { AlertRow } from "../types/admin";

const bar=(s:AlertRow["severity"])=>s==="High"?"border-rose-200 bg-rose-50":s==="Medium"?"border-amber-200 bg-amber-50":"border-emerald-200 bg-emerald-50";
const tone=(s:AlertRow["severity"])=>s==="High"?"red":s==="Medium"?"yellow":"green";

export default function SmartAlerts(){
  const [alerts,setAlerts]=useState<AlertRow[]>([]);
  useEffect(()=>{ api.getAlerts().then(setAlerts);},[]);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Smart Contract Alerts</h1>
      <div className="flex items-center gap-2">
        <Select defaultValue="All"><option>All Alert Types</option></Select>
        <Button className="ml-auto" disabled>Mark All as Read</Button>
      </div>

      <div className="space-y-3">
        {alerts.map(a=>(
          <Card key={a.id} className={bar(a.severity)+" border"}>
            <div className="flex items-start gap-3">
              <div className="text-xl">⚠️</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{a.title}</div>
                  <div className="text-xs text-slate-500">{a.date}</div>
                </div>
                <div className="mt-1 text-sm text-slate-600">{a.description}</div>
                <div className="mt-2 flex gap-2">
                  <Badge tone={tone(a.severity)}>{a.severity}</Badge>
                  <Button>View Details</Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">Mark as Resolved</Button>
                  <Button className="bg-slate-700 hover:bg-slate-800">Forward to Department</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
