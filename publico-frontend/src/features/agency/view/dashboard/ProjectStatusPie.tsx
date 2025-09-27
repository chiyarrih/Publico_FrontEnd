import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import type { PieSlice } from "../../controller/hooks/useAgencyDashboard";

const ProjectStatusPie: React.FC<{ data: PieSlice[] }> = ({ data }) => (
  <div className="card p-4">
    <div className="section-title mb-3">Budget Allocation by Category</div>
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={90} label>
          {data.map((s, i) => <Cell key={i} fill={s.color} />)}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
);
export default ProjectStatusPie;
