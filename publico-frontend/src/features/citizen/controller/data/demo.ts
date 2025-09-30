/* ---------- Dashboard data ---------- */
export const dashboardAlerts = [
  { color: "bg-rose-50", icon: "⚠️", title: "Budget Overrun", desc: "Downtown Bridge Repair Project is 8% over budget", date: "2023-09-15" },
  { color: "bg-amber-50", icon: "🕒", title: "Pending Disbursement", desc: "Q4 infrastructure funds awaiting approval", date: "2023-09-14" },
  { color: "bg-sky-50", icon: "📄", title: "Document Expiration", desc: "Contract #TR-2023-45 expires in 14 days", date: "2023-09-10" },
];

export const spending = [
  { m: "Jan", actual: 1200, budget: 1400 }, { m: "Feb", actual: 1350, budget: 1380 },
  { m: "Mar", actual: 1100, budget: 1420 }, { m: "Apr", actual: 1550, budget: 1460 },
  { m: "May", actual: 1260, budget: 1490 }, { m: "Jun", actual: 1380, budget: 1500 },
  { m: "Jul", actual: 1500, budget: 1520 }, { m: "Aug", actual: 1220, budget: 1530 },
];

export const allocation = [
  { name: "Education", value: 35, color: "#3b82f6" },
  { name: "Infrastructure", value: 25, color: "#22c55e" },
  { name: "Health", value: 20, color: "#f59e0b" },
  { name: "Flood Control", value: 15, color: "#ef4444" },
  { name: "Other", value: 5, color: "#64748b" },
];

export type Project = {
  name: string; dept: string; budget: string; spent: string; pct: number; barColor: string;
  status?: "In Progress" | "Near Completion" | "Just Started" | "Anomaly";
};

export const keyProjects: Project[] = [
  { name: "City Park Renovation", dept: "Parks & Recreation", budget: "$1.2M", spent: "$780K", pct: 65, barColor: "#3b82f6", status: "In Progress" },
  { name: "Public Library Expansion", dept: "Education", budget: "$3.5M", spent: "$1.05M", pct: 30, barColor: "#f59e0b", status: "In Progress" },
  { name: "Road Infrastructure Repair", dept: "Transportation", budget: "$6.8M", spent: "$5.2M", pct: 90, barColor: "#22c55e", status: "Near Completion" },
  { name: "Water Treatment Facility", dept: "Utilities", budget: "$3.1M", spent: "$310K", pct: 10, barColor: "#64748b", status: "Just Started" },
];

export const recentTx = [
  { tx: "Equipment Purchase - Parks Dept", amount: "$24,500", date: "2023-09-15", status: "Verified", sig: "0x7e9f…6b1" },
  { tx: "Contractor Payment - Library Project", amount: "$156,000", date: "2023-09-12", status: "Pending", sig: "0xb3dc…7b2" },
  { tx: "Office Supplies - Administration", amount: "$3,450", date: "2023-09-10", status: "Verified", sig: "0x0c54…05b" },
  { tx: "IT Infrastructure - City Hall", amount: "$87,200", date: "2023-09-05", status: "Flagged", sig: "0x3e2b…e4a" },
];

/* ---------- Transparency data ---------- */
export const statusData = [
  { name: "Completed", value: 35, color: "#3b82f6" },
  { name: "In Progress", value: 45, color: "#22c55e" },
  { name: "Planning", value: 15, color: "#f59e0b" },
  { name: "On Hold", value: 5,  color: "#ef4444" },
];

export const transpoProjects = [
  { name: "City Park Renovation", dept: "Parks & Recreation • $1.2M", pct: 65, color: "#3b82f6" },
  { name: "Public Library Expansion", dept: "Education • $3.5M", pct: 30, color: "#f59e0b" },
  { name: "Road Infrastructure Repair", dept: "Transportation • $6.8M", pct: 90, color: "#22c55e" },
  { name: "Water Treatment Facility", dept: "Utilities • $3.1M", pct: 10, color: "#94a3b8" },
];

/* ---------- FAQ ---------- */
export const FAQ_DATA = [
  { q: "Where does budget data come from?", a: "Data is sourced from official LGU systems and audited reports.", tag: "Data" },
  { q: "How often is the data updated?", a: "Most datasets are updated monthly; some dashboards refresh weekly.", tag: "Data" },
  { q: "What does the transparency score mean?", a: "A composite metric indicating openness of budgets, projects, and audits.", tag: "General" },
  { q: "How can I report an issue with the data?", a: "Use the Contact Support page and choose “Data Accuracy”.", tag: "Reports" },
  { q: "What are smart contract alerts?", a: "Automated checks that flag anomalies in spending and contracts.", tag: "Blockchain" },
  { q: "How is my privacy protected on this platform?", a: "Personal information is minimized and stored under strict policies.", tag: "Security" },
  { q: "Can I download reports and data?", a: "Yes, CSV and PDF downloads are available in related sections.", tag: "Reports" },
  { q: "What is blockchain verification?", a: "Key records are hashed and anchored on a public chain for integrity.", tag: "Blockchain" },
] as const;

/* ---------- Ledger demo rows ---------- */
export const LEDGER_ROWS = [
  { date: "2023-09-20", dept: "Health", project: "City Hospital Equipment", amount: 156000, status: "Verified", signature: "0x97a7f63…" },
  { date: "2023-09-18", dept: "Education", project: "School Renovation Phase 1", amount: 98500, status: "Verified", signature: "0x3c45c79…" },
  { date: "2023-09-15", dept: "Infrastructure", project: "Downtown Bridge Repair", amount: 24500, status: "Verified", signature: "0x89a47b0…" },
  { date: "2023-09-10", dept: "Education", project: "Teacher Training Program", amount: 12300, status: "Verified", signature: "0xf54f782…" },
  { date: "2023-09-01", dept: "Infrastructure", project: "Road Maintenance", amount: 45600, status: "Verified", signature: "0x4bb3c446…" },
  { date: "2023-08-27", dept: "Administration", project: "Office Supplies", amount: 3450, status: "Verified", signature: "0x1c0aa5d…" },
  { date: "2023-08-25", dept: "Utilities", project: "Water Sensor Upgrade", amount: 18200, status: "Pending", signature: "0x2abef76…" },
  { date: "2023-08-17", dept: "Health", project: "Clinic HVAC Repair", amount: 8200, status: "Verified", signature: "0x6a9d3e1…" },
  { date: "2023-08-10", dept: "Infrastructure", project: "IT Infrastructure – City Hall", amount: 87200, status: "Flagged", signature: "0x3e2b5e4…" },
  { date: "2023-08-03", dept: "Education", project: "STEM Lab Equipment", amount: 26800, status: "Verified", signature: "0x0c54a05…" },
];
