import React from "react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import type { SpendPoint } from "../../../controller/agency/hooks/useAgencyDashboard";

const SpendVsAllocChart: React.FC<{ data: SpendPoint[] }> = ({ data }) => (
  <div className="card p-4">
    <div className="section-title mb-3">Monthly Spending vs. Allocation</div>
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ left: -10, right: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="m" /><YAxis /><Tooltip />
        <Line type="monotone" dataKey="actual"  name="Actual"    stroke="#2563eb" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="budget"  name="Allocated" stroke="#94a3b8" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
export default SpendVsAllocChart;
