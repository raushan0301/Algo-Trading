import React from "react";

export default function StockCard({ title, value, change, showChart = true }) {
  const isPositive = change >= 0;
  
  // Simple chart data
  const generateChartPoints = () => {
    const points = [];
    for (let i = 0; i < 50; i++) {
      points.push({
        x: i * 4,
        y: 50 + Math.random() * 30 * (isPositive ? 1 : -1) + (isPositive ? -i * 0.3 : i * 0.3)
      });
    }
    return points;
  };

  const chartPoints = generateChartPoints();
  const pathData = `M ${chartPoints.map(p => `${p.x},${p.y}`).join(' L ')}`;

  return (
    <div
      style={{
        background: "#2a2a2a",
        borderRadius: "8px",
        padding: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: "1px solid #3a3a3a"
      }}
    >
      <div>
        <h3 style={{ 
          fontSize: "16px", 
          color: "#fff",
          margin: "0 0 8px 0",
          fontWeight: "500"
        }}>
          {title}
        </h3>
        <div style={{ 
          fontSize: "24px", 
          fontWeight: "600", 
          color: "#fff",
          marginBottom: "4px"
        }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div style={{ 
          fontSize: "14px",
          color: isPositive ? "#00d179" : "#ff4757",
          display: "flex",
          alignItems: "center",
          gap: "4px"
        }}>
          {isPositive ? "▲" : "▼"} {Math.abs(change)}%
        </div>
      </div>
      
      {showChart && (
        <svg width="200" height="80" style={{ marginLeft: "20px" }}>
          <path
            d={pathData}
            fill="none"
            stroke={isPositive ? "#00d179" : "#ff4757"}
            strokeWidth="2"
          />
        </svg>
      )}
    </div>
  );
}