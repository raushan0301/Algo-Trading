import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import StockCard from "../components/StockCard";
import MarketOverview from "../components/MarketOverview";
import { supabase } from "../supabaseclient";

export default function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStocks();
  }, []);

  async function fetchStocks() {
    try {
      setLoading(true);
      setError(null);
      
      let { data, error } = await supabase.from("stocks").select("*");
      
      if (error) {
        console.error("Error fetching stocks:", error);
        setError(error.message);
      } else {
        console.log("Fetched stocks from Supabase:", data);
        setStocks(data || []);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ background: "#1a1a1a", minHeight: "100vh" }}>
      <Navbar />
      
      {/* Changed: Removed maxWidth to use full width */}
      <div style={{ padding: "24px 48px" }}>
        <MarketOverview />

        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "24px"
        }}>
          <h2 style={{ 
            fontSize: "24px", 
            fontWeight: "600",
            color: "#fff",
            margin: 0
          }}>
            Market and sectors
          </h2>
          <button 
            onClick={fetchStocks}
            style={{
              background: "transparent",
              border: "1px solid #4a9eff",
              color: "#4a9eff",
              cursor: "pointer",
              fontSize: "16px",
              padding: "8px 16px",
              borderRadius: "4px"
            }}
          >
            Refresh
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ 
            color: "#fff", 
            textAlign: "center", 
            padding: "60px",
            fontSize: "18px" 
          }}>
            Loading stocks data...
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div style={{ 
            color: "#ff4757", 
            textAlign: "center", 
            padding: "60px",
            background: "#2a2a2a",
            borderRadius: "8px",
            border: "1px solid #ff4757"
          }}>
            <h3>Error loading data</h3>
            <p>{error}</p>
            <button 
              onClick={fetchStocks}
              style={{
                background: "#ff4757",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "4px",
                cursor: "pointer",
                marginTop: "16px"
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Data State */}
        {!loading && !error && stocks.length === 0 && (
          <div style={{ 
            color: "#999", 
            textAlign: "center", 
            padding: "60px",
            background: "#2a2a2a",
            borderRadius: "8px",
            border: "1px solid #3a3a3a"
          }}>
            <h3 style={{ color: "#fff" }}>No stocks data available</h3>
            <p>Please add stocks data to your Supabase database.</p>
            <button 
              onClick={fetchStocks}
              style={{
                background: "#4a9eff",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "4px",
                cursor: "pointer",
                marginTop: "16px"
              }}
            >
              Refresh
            </button>
          </div>
        )}

        {/* Stock Cards Grid - Changed to responsive grid */}
        {!loading && !error && stocks.length > 0 && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                gap: "20px"
              }}
            >
              {stocks.map((stock) => (
                <StockCard
                  key={stock.id}
                  title={stock.name || stock.symbol}
                  value={stock.price}
                  change={stock.change_percent}
                />
              ))}
            </div>

            {/* Data Info */}
            <div style={{
              marginTop: "24px",
              padding: "12px",
              background: "#2a2a2a",
              borderRadius: "4px",
              color: "#999",
              fontSize: "14px",
              textAlign: "center"
            }}>
              Showing {stocks.length} stocks from database
            </div>
          </>
        )}

        {/* Bottom section - also made full width */}
        <div style={{ 
          marginTop: "48px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "24px"
        }}>
          <div style={{
            background: "#2a2a2a",
            borderRadius: "8px",
            padding: "24px",
            border: "1px solid #3a3a3a"
          }}>
            <h3 style={{ color: "#fff", marginBottom: "16px" }}>Connect portfolio to</h3>
            <h2 style={{ color: "#ff4757", fontSize: "24px", marginBottom: "16px" }}>Identify red flags</h2>
            <div style={{ color: "#999", fontSize: "14px" }}>●●●●●</div>
          </div>

          <div style={{
            background: "#2a2a2a",
            borderRadius: "8px",
            padding: "24px",
            border: "1px solid #3a3a3a"
          }}>
            <h3 style={{ color: "#fff", marginBottom: "16px", fontSize: "18px" }}>Today's news and events</h3>
            <div style={{ display: "flex", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
              <button style={{
                background: "#3a3a3a",
                border: "none",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "14px"
              }}>All</button>
              <button style={{
                background: "transparent",
                border: "1px solid #3a3a3a",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "14px"
              }}>News</button>
              <button style={{
                background: "transparent",
                border: "1px solid #3a3a3a",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "14px"
              }}>Macro</button>
              <button style={{
                background: "transparent",
                border: "1px solid #3a3a3a",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "14px"
              }}>Earnings</button>
            </div>
            <div style={{ color: "#999", fontSize: "14px" }}>
              <div style={{ marginBottom: "12px", display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ color: "#4a9eff" }}>📰</span> Corp Action
              </div>
              <div style={{ marginBottom: "12px", display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ color: "#feca57" }}>📊</span> Dividends
              </div>
            </div>
          </div>

          {/* Add third column for better balance on wide screens */}
          <div style={{
            background: "#2a2a2a",
            borderRadius: "8px",
            padding: "24px",
            border: "1px solid #3a3a3a"
          }}>
            <h3 style={{ color: "#fff", marginBottom: "16px", fontSize: "18px" }}>Market Summary</h3>
            <div style={{ color: "#999", fontSize: "14px" }}>
              <div style={{ marginBottom: "12px" }}>
                <span style={{ color: "#fff" }}>Total Stocks:</span> {stocks.length}
              </div>
              <div style={{ marginBottom: "12px" }}>
                <span style={{ color: "#fff" }}>Last Updated:</span> {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}