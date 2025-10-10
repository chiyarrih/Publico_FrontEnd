import React, { PropsWithChildren } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";

export const cn = (...c:(string|false|undefined)[])=>c.filter(Boolean).join(" ");
export const peso = (n:number)=>"₱"+n.toLocaleString();

/* SURFACES */
export const Card = ({children,className}:PropsWithChildren<{className?:string}>)=>(
  <div className={cn(
    "rounded-2xl border border-slate-200/70 bg-white",
    "shadow-[0_1px_0_0_rgba(0,0,0,.02),0_10px_30px_-10px_rgba(15,23,42,.15)]",
    "p-4 lg:p-5", className
  )}>{children}</div>
);

/* ATOMS */
export const Button=(p:React.ButtonHTMLAttributes<HTMLButtonElement>)=>(
  <button {...p} className={cn(
    "inline-flex h-9 items-center justify-center rounded-xl px-3 text-sm font-medium",
    "bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800 shadow-sm",
    "disabled:opacity-50", p.className
  )}/>
);

export const Ghost=(p:React.ButtonHTMLAttributes<HTMLButtonElement>)=>(
  <button {...p} className={cn(
    "inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-sm",
    "hover:bg-slate-50", p.className
  )}/>
);

export const Input=(p:React.InputHTMLAttributes<HTMLInputElement>)=>(
  <input {...p} className={cn(
    "h-10 w-full rounded-full border border-slate-200 bg-white px-4 text-sm",
    "shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-200",
    p.className
  )}/>
);

export const Select=(p:React.SelectHTMLAttributes<HTMLSelectElement>)=>(
  <select {...p} className={cn(
    "h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm",
    "focus:outline-none focus:ring-2 focus:ring-sky-200", p.className
  )}/>
);

export const Badge=({tone="gray",children}:{tone?:"gray"|"blue"|"green"|"yellow"|"red";children:React.ReactNode})=>{
  const map:Record<string,string>={
    gray:"bg-slate-100 text-slate-700",
    blue:"bg-sky-100 text-sky-700",
    green:"bg-emerald-100 text-emerald-700",
    yellow:"bg-amber-100 text-amber-700",
    red:"bg-rose-100 text-rose-700",
  };
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",map[tone])}>{children}</span>;
};

/* TABLE */
export const Table=({head,rows}:{head:React.ReactNode[];rows:React.ReactNode[][]})=>(
  <div className="overflow-hidden rounded-xl border border-slate-200">
    <table className="min-w-full text-sm">
      <thead className="bg-slate-50/80">
        <tr>{head.map((h,i)=><th key={i} className="px-4 py-2 text-left font-medium text-slate-600">{h}</th>)}</tr>
      </thead>
      <tbody>{rows.map((r,ri)=>(
        <tr key={ri} className="bg-white hover:bg-slate-50/60">
          {r.map((c,ci)=><td key={ci} className={cn("px-4 py-2",ci===4?"text-right":undefined)}>{c}</td>)}
        </tr>
      ))}</tbody>
    </table>
  </div>
);

/* CHARTS */
export const LineMini=({data}:{data:{label:string;allocated:number;used:number}[]})=>(
  <ResponsiveContainer width="100%" height={240}>
    <LineChart data={data} margin={{left:-20,right:8,top:10,bottom:5}}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/>
      <XAxis dataKey="label" tick={{fontSize:12}} stroke="#64748b"/>
      <YAxis tick={{fontSize:12}} stroke="#64748b"/>
      <Tooltip 
        contentStyle={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:"8px",fontSize:"12px"}}
        labelStyle={{fontWeight:600,color:"#334155"}}
      />
      <Legend 
        wrapperStyle={{fontSize:"12px",paddingTop:"10px"}}
        iconType="circle"
      />
      <Line 
        type="monotone" 
        dataKey="allocated" 
        stroke="#0ea5e9" 
        strokeWidth={2}
        dot={{fill:"#0ea5e9",r:4}}
        name="Allocated"
      />
      <Line 
        type="monotone" 
        dataKey="used" 
        stroke="#10b981" 
        strokeWidth={2}
        dot={{fill:"#10b981",r:4}}
        name="Utilized"
      />
    </LineChart>
  </ResponsiveContainer>
);

export const PieMini=({data}:{data:{name:string;value:number;color:string}[]})=>(
  <ResponsiveContainer width="100%" height={280}>
    <PieChart>
      <Pie 
        data={data} 
        dataKey="value" 
        nameKey="name" 
        cx="50%" 
        cy="45%" 
        outerRadius={90}
        label={({name,value})=>`${name} ${value}%`}
        labelLine={{stroke:"#94a3b8"}}
      >
        {data.map((d,i)=><Cell key={i} fill={d.color}/>)}
      </Pie>
      <Tooltip 
        contentStyle={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:"8px",fontSize:"12px"}}
      />
      <Legend 
        wrapperStyle={{fontSize:"11px",paddingTop:"5px"}}
        iconType="square"
      />
    </PieChart>
  </ResponsiveContainer>
);

export const BarMini=({data}:{data:{dept:string;allocated:number;used:number}[]})=>(
  <ResponsiveContainer width="100%" height={240}>
    <BarChart data={data} margin={{left:-20,right:8,top:10,bottom:5}}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/>
      <XAxis dataKey="dept" tick={{fontSize:11}} stroke="#64748b"/>
      <YAxis tick={{fontSize:12}} stroke="#64748b"/>
      <Tooltip 
        contentStyle={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:"8px",fontSize:"12px"}}
        labelStyle={{fontWeight:600,color:"#334155"}}
      />
      <Legend 
        wrapperStyle={{fontSize:"12px",paddingTop:"10px"}}
        iconType="square"
      />
      <Bar dataKey="allocated" fill="#0ea5e9" name="Allocated" radius={[4,4,0,0]}/>
      <Bar dataKey="used" fill="#10b981" name="Utilized" radius={[4,4,0,0]}/>
    </BarChart>
  </ResponsiveContainer>
);
