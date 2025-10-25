// BudgetTrendChart.tsx - Area Chart for Budget Trends Over Time
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MonthlyData {
  month: string;
  allocated: number;
  spent: number;
}

interface Props {
  data: MonthlyData[];
}

export const BudgetTrendChart: React.FC<Props> = ({ data }) => {
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <p className="text-sm">
                <span className="text-gray-600">Allocated: </span>
                <span className="font-bold text-blue-600">
                  ₱{payload[0].value.toLocaleString()}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <p className="text-sm">
                <span className="text-gray-600">Spent: </span>
                <span className="font-bold text-purple-600">
                  ₱{payload[1].value.toLocaleString()}
                </span>
              </p>
            </div>
            <div className="pt-1 border-t border-gray-200 mt-2">
              <p className="text-xs text-gray-500">
                Utilization: {((payload[1].value / payload[0].value) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Format Y-axis (amounts)
  const formatYAxis = (value: number) => {
    if (value >= 1000000000) {
      return `₱${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `₱${(value / 1000000).toFixed(0)}M`;
    }
    return `₱${value.toLocaleString()}`;
  };

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorAllocated" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis 
          dataKey="month" 
          stroke="#6B7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          tickFormatter={formatYAxis}
          stroke="#6B7280"
          style={{ fontSize: '12px' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ paddingTop: '10px' }}
          iconType="circle"
        />
        <Area
          type="monotone"
          dataKey="allocated"
          stroke="#3B82F6"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorAllocated)"
          name="Budget Allocated"
          animationDuration={1000}
        />
        <Area
          type="monotone"
          dataKey="spent"
          stroke="#8B5CF6"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorSpent)"
          name="Budget Spent"
          animationDuration={1000}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default BudgetTrendChart;

