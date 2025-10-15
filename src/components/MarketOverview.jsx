import React from "react";
export default function MarketOverview() {
  return (
    <div style={{
      background: "#2a2a2a",
      padding: "24px",
      borderRadius: "8px",
      marginBottom: "24px"
    }}>
      <div style={{ display: "flex", gap: "48px", alignItems: "center" }}>
        <div>
          <h3 style={{ color: "#999", fontSize: "14px", margin: "0 0 8px 0" }}>NIFTY 50</h3>
          <div style={{ fontSize: "28px", fontWeight: "600", color: "#fff" }}>24,715.05</div>
          <div style={{ color: "#00d179", fontSize: "14px" }}>▲ 135.45</div>
        </div>
        
        <div>
          <h3 style={{ color: "#999", fontSize: "14px", margin: "0 0 8px 0" }}>SENSEX</h3>
          <div style={{ fontSize: "28px", fontWeight: "600", color: "#fff" }}>80,567.71</div>
          <div style={{ color: "#00d179", fontSize: "14px" }}>▲ 409.63</div>
        </div>

        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "16px",
          marginLeft: "auto",
          background: "#1a1a1a",
          padding: "16px 24px",
          borderRadius: "8px"
        }}>
          <div style={{ 
            width: "50px", 
            height: "50px", 
            borderRadius: "50%",
            background: "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <span style={{ fontSize: "24px" }}>🔥</span>
          </div>
          <div>
            <div style={{ fontSize: "18px", fontWeight: "500", color: "#fff" }}>
              The market is in
            </div>
            <div style={{ fontSize: "20px", fontWeight: "600", color: "#feca57" }}>
              Fear zone
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "32px", marginLeft: "48px" }}>
          {["THU", "FRI", "MON", "TUE", "TODAY"].map((day, index) => (
            <div key={day} style={{ textAlign: "center" }}>
              <div style={{ 
                width: "40px", 
                height: "40px", 
                borderRadius: "50%",
                background: index === 1 ? "#00d179" : "#feca57",
                marginBottom: "8px"
              }}></div>
              <div style={{ color: "#999", fontSize: "12px" }}>{day}</div>
              {day === "TODAY" && <div style={{ color: "#999", fontSize: "10px" }}>7:00pm</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}