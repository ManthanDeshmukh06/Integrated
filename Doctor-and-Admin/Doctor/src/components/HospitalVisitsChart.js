"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const visitData = [
  { month: "Jan", visits: 300, trend: "up" },
  { month: "Feb", visits: 450, trend: "up" },
  { month: "Mar", visits: 320, trend: "down" },
  { month: "Apr", visits: 500, trend: "up" },
  { month: "May", visits: 610, trend: "up" },
  { month: "Jun", visits: 420, trend: "down" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-xl p-3 shadow-lg">
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-blue-600 font-medium">
          {payload[0].value} visits
        </p>
      </div>
    );
  }
  return null;
};

export default function HospitalVisitsChart() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60 p-4 lg:p-6 h-[350px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div>
          <h2 className="text-lg lg:text-xl font-semibold text-gray-800">Hospital Visits Trend</h2>
          <p className="text-sm text-gray-500">Last 6 months overview</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-800">610</p>
          <p className="text-xs text-green-600 font-medium">↑ 12% this month</p>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={visitData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="visits" 
              stroke="#2563EB" 
              strokeWidth={2}
              fill="url(#colorVisits)" 
              activeDot={{ r: 6, fill: "#2563EB", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200/60">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800">2.6K</p>
          <p className="text-xs text-gray-500">Total Visits</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">+18%</p>
          <p className="text-xs text-gray-500">Growth</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800">43.3</p>
          <p className="text-xs text-gray-500">Avg/Day</p>
        </div>
      </div>
    </div>
  );
}