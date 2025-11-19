import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function ChartComponent({ data }) {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          padding: 'var(--spacing-sm) var(--spacing-md)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
        }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '12px', margin: '0 0 4px 0' }}>
            {payload[0].payload.name}
          </p>
          <p style={{ color: 'var(--accent-blue)', fontSize: '16px', fontWeight: '700', margin: 0 }}>
            ₹{payload[0].value.toLocaleString('en-IN')}
          </p>
        </div>
      );
    }
    return null;
  };
    const values = data.map(d => d.value);
const min = Math.min(...values);
const max = Math.max(...values);
const padding = (max - min) * 0.2;
  return (
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />

    <XAxis
      dataKey="name"
      stroke="var(--text-tertiary)"
      style={{ fontSize: "12px" }}
    />

    <YAxis
      stroke="var(--text-tertiary)"
      style={{ fontSize: "12px" }}
      domain={[min - padding, max + padding]}   // ⭐ ZOOMED Y-AXIS
      allowDecimals={false}
    />

    <Tooltip content={<CustomTooltip />} />

    <Line
      type="monotone"
      dataKey="value"
      stroke="var(--accent-blue)"
      strokeWidth={3}
      dot={{ fill: "var(--accent-blue)", r: 4 }}
      activeDot={{ r: 6 }}
    />
  </LineChart>
</ResponsiveContainer>


  );
}