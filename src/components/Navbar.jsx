import React from "react";
import { Link } from "react-router-dom";   // ✅ Router Link

export default function Navbar() {
  return (
    <nav
      style={{
        background: "#1a1a1a",
        padding: "12px 24px",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #2a2a2a"
      }}
    >
      {/* Left Logo */}
      <h1 style={{ fontSize: "20px", fontWeight: "600", margin: 0 }}>📊 Tickertape</h1>

      {/* Middle Nav Links */}
      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>Dashboard</Link>
        <Link to="/predictions" style={{ color: "#fff", textDecoration: "none" }}>Predictions</Link>
      </div>

      {/* Right Search + Buttons */}
      <div>
        <input
          placeholder="Search for stocks"
          style={{
            padding: "8px 16px",
            borderRadius: "20px",
            border: "1px solid #3a3a3a",
            background: "#2a2a2a",
            color: "#fff",
            width: "250px",
            fontSize: "14px"
          }}
        />
      </div>
    </nav>
  );
}