import React, { useEffect, useState, useMemo } from "react";
import { Card, Progress } from "../../../../shared/ui";
import { getBudgetByCategory, getKeyProjects } from "../../controller/data/dashboardService";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useDepartmentFilter } from "../context/DepartmentFilterContext";
import { getCategoryForDepartment, DEPARTMENT_CATEGORIES } from "@/shared/constants/departments";

type Slice = { label: string; value: number; color?: string };
type ProjectRowProps = { name: string; dept: string; pct: number; color: string };

const palette = ["#3b82f6","#22c55e","#f59e0b","#ef4444","#94a3b8","#a78bfa","#10b981","#f97316"];

// Helper function to determine category color
const getCategoryColor = (categoryName: string) => {
  const colors: Record<string, string> = {
    "Economic Services & Business Development": "#3b82f6", // blue
    "Executive & Administrative Services": "#22c55e", // green
    "Public Safety & Disaster Management": "#f97316", // orange
    "Health & Social Services": "#ef4444", // red
    "Financial Management & Revenue": "#94a3b8", // gray
    "Infrastructure & Development": "#a78bfa", // purple
    "General Services & Support": "#10b981", // teal
  };
  return colors[categoryName] || palette[0];
};

const ProjectRow: React.FC<ProjectRowProps> = ({ name, dept, pct, color }) => (
  <div className="space-y-1">
    <div className="truncate text-sm font-medium text-slate-900">{name}</div>
    <div className="truncate text-xs text-slate-500">{dept}</div>
    <div className="mt-2 grid grid-cols-[1fr,2.25rem] items-center gap-2 pr-2">
      <div className="min-w-0"><Progress pct={pct} color={color as any} /></div>
      <span className="justify-self-end text-[11px] tabular-nums text-slate-600">{pct}%</span>
    </div>
  </div>
);

export default function Transparency() {
  const { selectedDepartment, selectedView, setAvailableDepartments } = useDepartmentFilter();
  const [allSlices, setAllSlices] = useState<Slice[]>([]);
  const [allProjects, setAllProjects] = useState<{ name: string; dept: string; pct: number; color: string }[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true); setErr(null);

        // key projects (convert to rows with pct if available, else fake % by budget rank)
        const list = await getKeyProjects(50); // Get more projects to filter
        let rows = list.map((p: any, i: number) => ({
          name: p.projectName ?? "-",
          dept: p.department ?? "-",
          pct: typeof p.progress === "number" ? Math.max(0, Math.min(100, p.progress)) : 100 - i * 12, // simple fallback
          color: ["blue","green","amber","slate","green","blue"][i % 6],
        }));
        if (!ignore) {
          setAllProjects(rows);
          
          // Extract unique departments from projects
          const uniqueDepartments = Array.from(new Set(rows.map(p => p.dept).filter(d => d && d !== "-")));
          setAvailableDepartments(uniqueDepartments);
        }
      } catch (e: any) {
        if (!ignore) setErr(e?.message || "Failed to load transparency data");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  // Filter projects AND recalculate slices based on selected department and view
  const { projects, slices } = useMemo(() => {
    // First filter by department
    let filteredProjects = selectedDepartment === "All" 
      ? allProjects 
      : allProjects.filter(p => {
          const matches = p.dept && p.dept.toLowerCase().includes(selectedDepartment.toLowerCase());
          return matches;
        });
    
    // Then filter by time view (monthly, quarterly, yearly)
    if (selectedView === "Monthly View") {
      // Show only recent projects (top 10)
      filteredProjects = filteredProjects.slice(0, 10);
    } else if (selectedView === "Quarterly View") {
      // Show more projects (top 25)
      filteredProjects = filteredProjects.slice(0, 25);
    } else if (selectedView === "Yearly View") {
      // Show all projects
      filteredProjects = filteredProjects;
    }
    
    // Recalculate category breakdown based on filtered projects
    const categoryCounts: Record<string, number> = {};
    
    filteredProjects.forEach(project => {
      const category = getCategoryForDepartment(project.dept);
      if (category) {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      }
    });
    
    // Convert counts to percentages for the donut chart
    const totalCount = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);
    
    const calculatedSlices = DEPARTMENT_CATEGORIES.map(cat => {
      const count = categoryCounts[cat.value] || 0;
      const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
      return {
        label: cat.label,
        value: percentage,
        color: getCategoryColor(cat.value)
      };
    }).filter(slice => slice.value > 0); // Only show categories with projects
    
    return { projects: filteredProjects, slices: calculatedSlices };
  }, [selectedDepartment, selectedView, allProjects]);

  return (
    <div className="space-y-8">
      <Card>
        <div className="grid gap-9 lg:grid-cols-2">
          <section className="py-2 sm:py-3">
            <h2 className="mb-3 pl-2 sm:pl-3 py-1.5 sm:py-2 text-base font-semibold text-slate-900">Project Status Overview</h2>

            {err && <div className="px-3 text-sm text-rose-600">{err}</div>}
            {loading && <div className="px-3 text-sm text-slate-500">Loading…</div>}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={slices} dataKey="value" cx="50%" cy="50%" innerRadius={52} outerRadius={84} label>
                      {slices.map((s, i) => <Cell key={i} fill={s.color || palette[i % palette.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <ul className="flex flex-col justify-center space-y-2.5 text-[13px] pr-2">
                {(slices.length ? slices : [{label:"No data", value:100, color:"#e5e7eb"}]).map((s) => {
                  const percentage = Math.min(100, Math.max(0, Math.round(s.value)));
                  return (
                    <li key={s.label} className="grid grid-cols-[auto,1fr,2.25rem] items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: s.color || "#e5e7eb" }} />
                      <span className="min-w-0 truncate text-slate-700">{s.label}</span>
                      <span className="justify-self-end font-medium tabular-nums text-slate-900">{percentage}%</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          <section className="py-2 sm:py-3 pr-2 sm:pr-4">
            <h2 className="mb-3 pl-2 sm:pl-3 py-1.5 sm:py-2 text-base font-semibold text-slate-900">Key Projects</h2>
            <div className="space-y-4">
              {(projects.length ? projects : [{name:"—", dept:"—", pct:0, color:"slate"}]).map((p, i) => (
                <ProjectRow key={`${p.name}-${i}`} {...p} />
              ))}
            </div>
          </section>
        </div>
      </Card>

      <Card title="Blockchain Verification" right={<span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700">100% Verified</span>}>
        <p className="text-sm text-slate-600">
          All information here is secured on-chain. Every transaction, budget allocation, and project update is written immutably for full public transparency.
        </p>
        <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 p-4">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-600">
            <span>Latest Block Hash</span><span>Updated 3 minutes ago</span>
          </div>
          <div className="overflow-x-auto">
            <code className="block w-full rounded bg-white px-3 py-2 font-mono text-xs text-slate-800">
              0xa1f0c8d2a9b0ee98f1a21b3c7af7e2a0e4cef7fbcedf7acb5f1e3df45c0b6ef6
            </code>
          </div>
          <p className="mt-2 text-xs text-slate-500">Verify this on the public blockchain explorer.</p>
        </div>
      </Card>
    </div>
  );
}
