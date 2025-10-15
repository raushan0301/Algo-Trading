import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseclient";
import ChartComponent from "../components/ChartComponent";
import Navbar from "../components/Navbar";

export default function Predictions() {
  const [predictions, setPredictions] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPredictions();
  }, []);

  async function fetchPredictions(symbol = null) {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from("predictions").select("*");

      if (symbol) {
        query = query.eq("symbol", symbol);
      }

      let { data, error } = await query.order("prediction_date", { ascending: true });

      if (error) throw error;
      setPredictions(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // 🔎 Filter by search input
  const filtered = predictions.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: "#1a1a1a", minHeight: "100vh", color: "#fff" }}>
      <Navbar />

      <div style={{ padding: "24px 48px" }}>
        <h1>📈 Predictions Page</h1>

        {/* 🔎 Search input */}
        <input
          type="text"
          placeholder="Search by symbol or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "6px",
            border: "1px solid #3a3a3a",
            background: "#2a2a2a",
            color: "#fff",
          }}
        />

        {/* ⬇ Dropdown for specific stock */}
        <select
          value={selectedSymbol}
          onChange={(e) => {
            setSelectedSymbol(e.target.value);
            fetchPredictions(e.target.value);
          }}
          style={{
            padding: "10px",
            marginLeft: "20px",
            borderRadius: "6px",
            border: "1px solid #3a3a3a",
            background: "#2a2a2a",
            color: "#fff",
          }}
        >
          <option value="">Select Stock</option>
          {Array.from(new Set(predictions.map((p) => p.symbol))).map((sym) => (
            <option key={sym} value={sym}>
              {sym}
            </option>
          ))}
        </select>

        {/* 🔄 Loading/Error States */}
        {loading && <p>Loading predictions...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* 📊 Predictions Table */}
        {!loading && filtered.length > 0 && (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr style={{ background: "#2a2a2a" }}>
                <th style={{ padding: "10px", border: "1px solid #3a3a3a" }}>Symbol</th>
                <th style={{ padding: "10px", border: "1px solid #3a3a3a" }}>Name</th>
                <th style={{ padding: "10px", border: "1px solid #3a3a3a" }}>Day Ahead</th>
                <th style={{ padding: "10px", border: "1px solid #3a3a3a" }}>Prediction Date</th>
                <th style={{ padding: "10px", border: "1px solid #3a3a3a" }}>Predicted Price</th>
                <th style={{ padding: "10px", border: "1px solid #3a3a3a" }}>Last Close</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td style={{ padding: "10px", border: "1px solid #3a3a3a" }}>{p.symbol}</td>
                  <td style={{ padding: "10px", border: "1px solid #3a3a3a" }}>{p.name}</td>
                  <td style={{ padding: "10px", border: "1px solid #3a3a3a" }}>{p.day_ahead}</td>
                  <td style={{ padding: "10px", border: "1px solid #3a3a3a" }}>{p.prediction_date}</td>
                  <td style={{ padding: "10px", border: "1px solid #3a3a3a" }}>{p.predicted_price?.toFixed(2)}</td>
                  <td style={{ padding: "10px", border: "1px solid #3a3a3a" }}>{p.last_close}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 📉 Chart */}
        {!loading && filtered.length > 0 && (
          <div
            style={{
              marginTop: "40px",
              background: "#2a2a2a",
              padding: "20px",
              borderRadius: "8px",
            }}
          >
            <h3>{selectedSymbol || "Filtered Stocks"} - Prediction Chart</h3>
            <ChartComponent
              data={filtered.map((p) => ({
                name: p.prediction_date,
                value: p.predicted_price,
              }))}
            />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p style={{ color: "#999" }}>No predictions available.</p>
        )}
      </div>
    </div>
  );
}