// BudgetBarChart.tsx - Horizontal Bar Chart for Budget Allocation
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface BudgetData {
  label: string;
  value: number;
}

interface Props {
  data: BudgetData[];
}

// Color palette for different departments
const COLORS = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#84CC16', // Lime
];

export const BudgetBarChart: React.FC<Props> = ({ data }) => {
  // Format data for horizontal bar chart
  const chartData = data.map((item) => ({
    name: item.label,
    amount: item.value,
    amountInMillions: item.value / 1000000
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{payload[0].payload.name}</p>
          <p className="text-blue-600 font-bold mt-1">
            ₱{payload[0].value.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            ₱{payload[0].payload.amountInMillions.toFixed(1)}M
          </p>
        </div>
      );
    }
    return null;
  };

  // Format Y-axis labels (department names)
  const formatYAxis = (value: string) => {
    if (value.length > 20) {
      return value.substring(0, 20) + '...';
    }
    return value;
  };

  // Format X-axis labels (amounts)
  const formatXAxis = (value: number) => {
    if (value >= 1000000000) {
      return `₱${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `₱${(value / 1000000).toFixed(0)}M`;
    }
    return `₱${value.toLocaleString()}`;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis 
          type="number" 
          tickFormatter={formatXAxis}
          stroke="#6B7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          type="category" 
          dataKey="name" 
          width={140}
          tickFormatter={formatYAxis}
          stroke="#6B7280"
          style={{ fontSize: '12px' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          formatter={() => 'Budget Allocated'}
        />
        <Bar 
          dataKey="amount" 
          radius={[0, 8, 8, 0]}
          animationDuration={800}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BudgetBarChart;

