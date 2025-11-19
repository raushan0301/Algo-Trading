import React, { useEffect, useState } from "react";
import { FiTrendingUp, FiTrendingDown, FiActivity } from "react-icons/fi";
import { supabase } from "../supabaseclient";

export default function MarketOverview() {
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictions();
  }, []);

  async function fetchPredictions() {
  try {
    setLoading(true);
    
    // Fetch all predictions with day_ahead = 1
    let { data: predictionsData, error } = await supabase
      .from("predictions")
      .select("*")
      .eq("day_ahead", 1)
      .order("prediction_date", { ascending: false });
    
    if (error) throw error;
    
    // Calculate change percentage for each prediction
    const predictionsWithChange = (predictionsData || []).map(pred => ({
      ...pred,
      changePercent: parseFloat(((pred.predicted_price - pred.last_close) / pred.last_close * 100).toFixed(2))
    }));
    
    // Remove duplicates - keep only latest entry per symbol
    const uniquePredictions = predictionsWithChange.reduce((acc, current) => {
      const existing = acc.find(item => item.symbol === current.symbol);
      if (!existing) {
        acc.push(current);
      } else {
        // Keep the one with the most recent prediction_date
        const existingIndex = acc.indexOf(existing);
        if (new Date(current.prediction_date) > new Date(existing.prediction_date)) {
          acc[existingIndex] = current;
        }
      }
      return acc;
    }, []);
    
    // Get top 4 gainers (highest positive change) - unique symbols
    const gainers = uniquePredictions
      .filter(p => p.changePercent > 0)
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, 4);
    
    // Get top 4 losers (highest negative change) - unique symbols
    const losers = uniquePredictions
      .filter(p => p.changePercent < 0)
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, 4);
    
    setTopGainers(gainers);
    setTopLosers(losers);
  } catch (err) {
    console.error("Error fetching predictions:", err);
  } finally {
    setLoading(false);
  }
}

  // Calculate market sentiment
  const getMarketSentiment = () => {
    const totalGainersChange = topGainers.reduce((sum, p) => sum + p.changePercent, 0);
    const totalLosersChange = topLosers.reduce((sum, p) => sum + Math.abs(p.changePercent), 0);
    
    if (totalGainersChange > totalLosersChange * 1.5) {
      return { text: "Extreme Greed", icon: "🚀", color: "#00d179" };
    } else if (totalGainersChange > totalLosersChange) {
      return { text: "Greed", icon: "📈", color: "#00d179" };
    } else if (totalLosersChange > totalGainersChange * 1.5) {
      return { text: "Extreme Fear", icon: "😱", color: "#ff4757" };
    } else if (totalLosersChange > totalGainersChange) {
      return { text: "Fear", icon: "🔥", color: "#ff4757" };
    } else {
      return { text: "Neutral", icon: "⚖️", color: "#feca57" };
    }
  };

  const sentiment = getMarketSentiment();

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <span style={styles.loadingText}>Loading market data...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Market Sentiment Card */}
      <div style={styles.sentimentCard}>
        <div style={styles.sentimentIcon}>
          <span style={{ fontSize: "28px" }}>{sentiment.icon}</span>
        </div>
        <div style={styles.sentimentContent}>
          <div style={styles.sentimentLabel}>Market Sentiment</div>
          <div style={{...styles.sentimentValue, color: sentiment.color}}>
            {sentiment.text}
          </div>
        </div>
      </div>

      {/* Top Gainers */}
      <div style={styles.movingCard}>
        <div style={styles.cardHeader}>
          <FiTrendingUp size={16} color="var(--accent-green)" />
          <h3 style={styles.cardTitle}>Top Gainers</h3>
        </div>
        <div style={styles.stocksList}>
          {topGainers.length > 0 ? (
            topGainers.map((stock, index) => (
              <div key={stock.id} style={styles.stockItem}>
                <div style={styles.stockRank}>{index + 1}</div>
                <div style={styles.stockInfo}>
                  <span style={styles.stockSymbol}>{stock.symbol}</span>
                  <span style={styles.stockPrice}>
                    ₹{stock.predicted_price.toFixed(2)}
                  </span>
                </div>
                <div style={{...styles.stockChange, color: "var(--accent-green)", background: "rgba(0, 209, 121, 0.1)"}}>
                  +{stock.changePercent}%
                </div>
              </div>
            ))
          ) : (
            <div style={styles.noData}>No gainers found</div>
          )}
        </div>
      </div>

      {/* Top Losers */}
      <div style={styles.movingCard}>
        <div style={styles.cardHeader}>
          <FiTrendingDown size={16} color="var(--accent-red)" />
          <h3 style={styles.cardTitle}>Top Losers</h3>
        </div>
        <div style={styles.stocksList}>
          {topLosers.length > 0 ? (
            topLosers.map((stock, index) => (
              <div key={stock.id} style={styles.stockItem}>
                <div style={styles.stockRank}>{index + 1}</div>
                <div style={styles.stockInfo}>
                  <span style={styles.stockSymbol}>{stock.symbol}</span>
                  <span style={styles.stockPrice}>
                    ₹{stock.predicted_price.toFixed(2)}
                  </span>
                </div>
                <div style={{...styles.stockChange, color: "var(--accent-red)", background: "rgba(255, 71, 87, 0.1)"}}>
                  {stock.changePercent}%
                </div>
              </div>
            ))
          ) : (
            <div style={styles.noData}>No losers found</div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "var(--bg-secondary)",
    padding: "var(--spacing-lg)",
    borderRadius: "var(--radius-lg)",
    marginBottom: "var(--spacing-xl)",
    boxShadow: "var(--shadow-md)",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "var(--spacing-lg)",
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--spacing-md)",
    padding: "var(--spacing-xl)",
    gridColumn: "1 / -1",
  },
  spinner: {
    width: "32px",
    height: "32px",
    border: "3px solid var(--border-color)",
    borderTop: "3px solid var(--accent-blue)",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    fontSize: "14px",
    color: "var(--text-secondary)",
  },
  
  // Sentiment Card
  sentimentCard: {
    display: "flex",
    alignItems: "center",
    gap: "var(--spacing-md)",
    padding: "var(--spacing-lg)",
    background: "var(--bg-tertiary)",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--border-color)",
  },
  sentimentIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-blue)99 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "var(--shadow-sm)",
  },
  sentimentContent: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  sentimentLabel: {
    fontSize: "11px",
    color: "var(--text-tertiary)",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  sentimentValue: {
    fontSize: "18px",
    fontWeight: "700",
    lineHeight: "1.2",
  },
  
  // Moving Cards (Gainers/Losers)
  movingCard: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--spacing-sm)",
    padding: "var(--spacing-lg)",
    background: "var(--bg-tertiary)",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--border-color)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "var(--spacing-xs)",
    paddingBottom: "var(--spacing-sm)",
    borderBottom: "1px solid var(--border-color)",
  },
  cardTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "var(--text-primary)",
    margin: 0,
  },
  stocksList: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--spacing-xs)",
  },
  stockItem: {
    display: "flex",
    alignItems: "center",
    gap: "var(--spacing-sm)",
    padding: "var(--spacing-sm)",
    background: "var(--bg-secondary)",
    borderRadius: "var(--radius-md)",
    border: "1px solid var(--border-color)",
    transition: "all 0.2s ease",
    cursor: "pointer",
  },
  stockRank: {
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--accent-blue)",
    color: "var(--text-primary)",
    borderRadius: "50%",
    fontSize: "11px",
    fontWeight: "700",
    flexShrink: 0,
  },
  stockInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    flex: 1,
    minWidth: 0,
  },
  stockSymbol: {
    fontSize: "13px",
    fontWeight: "700",
    color: "var(--text-primary)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  stockPrice: {
    fontSize: "11px",
    color: "var(--text-tertiary)",
  },
  stockChange: {
    padding: "3px 8px",
    borderRadius: "var(--radius-full)",
    fontSize: "11px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },
  noData: {
    textAlign: "center",
    padding: "var(--spacing-md)",
    color: "var(--text-tertiary)",
    fontSize: "12px",
  },
};