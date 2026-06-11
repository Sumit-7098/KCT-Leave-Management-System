import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const defaultColors = ["#2563eb", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899"];

const PieChartDept = ({ data = [] }) => {
  const normalized = Array.isArray(data) ? data : [];
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-full" style={{ minWidth: 0, minHeight: 1 }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-8 bg-purple-600 rounded-full" />
        <h2 className="text-lg font-semibold text-gray-800">
          Department-wise Distribution
        </h2>
      </div>

      {/* Chart */}
      <div className="relative w-full h-64 sm:h-72 lg:h-80 flex items-center justify-center" style={{ minWidth: 0 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <PieChart>
            <Pie
              data={normalized}
              cx="50%"
              cy="50%"
              outerRadius={90}
              dataKey="value"
              stroke="none"
            >
              {normalized.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color || defaultColors[index % defaultColors.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Simple fallback legend (avoids hardcoded positioned labels) */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-3 flex-wrap justify-center px-2">
          {normalized.slice(0, 6).map((entry, idx) => (
            <span
              key={idx}
              className="text-xs text-gray-700 bg-gray-100/70 border border-gray-200 rounded-full px-2 py-1 flex items-center gap-2"
            >
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: entry.color || defaultColors[idx % defaultColors.length] }}
              />
              {entry.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChartDept;
