import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseclient";
import ChartComponent from "../components/ChartComponent";
import Navbar from "../components/Navbar";
import { FiSearch, FiTrendingUp, FiTrendingDown, FiFilter } from "react-icons/fi";

export default function Predictions() {
  const [predictions, setPredictions] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // table or cards

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

  const filtered = predictions.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const uniqueSymbols = Array.from(new Set(predictions.map((p) => p.symbol)));

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.pageTitle}>Stock Predictions</h1>
            <p style={styles.pageSubtitle}> predictions and market insights</p>
          </div>
        </div>

        {/* Filters Section */}
        <div style={styles.filtersContainer}>
          {/* Search */}
          <div style={styles.searchWrapper}>
            <FiSearch size={18} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by symbol or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          {/* Stock Selector */}
          <div style={styles.selectWrapper}>
            <FiFilter size={18} style={styles.selectIcon} />
            <select
              value={selectedSymbol}
              onChange={(e) => {
                setSelectedSymbol(e.target.value);
                fetchPredictions(e.target.value || null);
              }}
              style={styles.select}
            >
              <option value="">All Stocks</option>
              {uniqueSymbols.map((sym) => (
                <option key={sym} value={sym}>
                  {sym}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div style={styles.viewToggle}>
            <button
              style={{
                ...styles.toggleButton,
                ...(viewMode === "table" && styles.toggleButtonActive),
              }}
              onClick={() => setViewMode("table")}
            >
              Table
            </button>
            <button
              style={{
                ...styles.toggleButton,
                ...(viewMode === "cards" && styles.toggleButtonActive),
              }}
              onClick={() => setViewMode("cards")}
            >
              Cards
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Loading predictions...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={styles.errorContainer}>
            <p style={styles.errorText}>Error: {error}</p>
            <button onClick={() => fetchPredictions()} style={styles.retryButton}>
              Retry
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <div style={styles.emptyState}>
                <FiTrendingUp size={64} color="var(--text-tertiary)" />
                <h3 style={styles.emptyTitle}>No Predictions Found</h3>
                <p style={styles.emptyText}>Try adjusting your search filters</p>
              </div>
            ) : (
              <>
                {/* Table View */}
                {viewMode === "table" && (
                  <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                      <thead style={styles.thead}>
                        <tr>
                          <th style={styles.th}>Symbol</th>
                          <th style={styles.th}>Name</th>
                          <th style={styles.th}>Day Ahead</th>
                          <th style={styles.th}>Prediction Date</th>
                          <th style={styles.th}>Predicted Price</th>
                          <th style={styles.th}>Last Close</th>
                          <th style={styles.th}>Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((p) => {
                          const change = ((p.predicted_price - p.last_close) / p.last_close * 100).toFixed(2);
                          const isPositive = change >= 0;
                          return (
                            <tr key={p.id} style={styles.tr}>
                              <td style={styles.td}>
                                <span style={styles.symbolBadge}>{p.symbol}</span>
                              </td>
                              <td style={styles.td}>{p.name}</td>
                              <td style={styles.td}>{p.day_ahead}</td>
                              <td style={styles.td}>{p.prediction_date}</td>
                              <td style={styles.td}>
                                <strong>₹{p.predicted_price?.toFixed(2)}</strong>
                              </td>
                              <td style={styles.td}>₹{p.last_close}</td>
                              <td style={styles.td}>
                                <span style={{
                                  ...styles.changeBadge,
                                  color: isPositive ? 'var(--accent-green)' : 'var(--accent-red)',
                                  background: isPositive ? 'rgba(0, 209, 121, 0.1)' : 'rgba(255, 71, 87, 0.1)',
                                }}>
                                  {isPositive ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
                                  {change}%
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Card View */}
                {viewMode === "cards" && (
                  <div style={styles.cardsGrid}>
                    {filtered.map((p) => {
                      const change = ((p.predicted_price - p.last_close) / p.last_close * 100).toFixed(2);
                      const isPositive = change >= 0;
                      return (
                        <div key={p.id} style={styles.predictionCard}>
                          <div style={styles.cardHeader}>
                            <span style={styles.symbolBadge}>{p.symbol}</span>
                            <span style={{
                              ...styles.changeBadge,
                              color: isPositive ? 'var(--accent-green)' : 'var(--accent-red)',
                              background: isPositive ? 'rgba(0, 209, 121, 0.1)' : 'rgba(255, 71, 87, 0.1)',
                            }}>
                              {isPositive ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
                              {change}%
                            </span>
                          </div>
                          <h4 style={styles.cardName}>{p.name}</h4>
                          <div style={styles.cardPrices}>
                            <div>
                              <span style={styles.cardLabel}>Predicted</span>
                              <span style={styles.cardPrice}>₹{p.predicted_price?.toFixed(2)}</span>
                            </div>
                            <div>
                              <span style={styles.cardLabel}>Last Close</span>
                              <span style={styles.cardPrice}>₹{p.last_close}</span>
                            </div>
                          </div>
                          <div style={styles.cardFooter}>
                            <span style={styles.cardInfo}>Day {p.day_ahead}</span>
                            <span style={styles.cardInfo}>{p.prediction_date}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Chart Section */}
                <div style={styles.chartSection}>
                  <h3 style={styles.chartTitle}>
                    {selectedSymbol || "All Stocks"} - Prediction Trend
                  </h3>
                  <div style={styles.chartContainer}>
                    <ChartComponent
                      data={filtered.map((p) => ({
                        name: p.prediction_date,
                        value: p.predicted_price,
                      }))}
                    />
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: 'var(--bg-primary)',
    minHeight: '100vh',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: 'var(--spacing-xl)',
  },
  header: {
    marginBottom: 'var(--spacing-xl)',
  },
  pageTitle: {
    fontSize: 'clamp(28px, 5vw, 36px)',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: 'var(--spacing-xs)',
  },
  pageSubtitle: {
    fontSize: '16px',
    color: 'var(--text-secondary)',
  },
  filtersContainer: {
    display: 'flex',
    gap: 'var(--spacing-md)',
    marginBottom: 'var(--spacing-xl)',
    flexWrap: 'wrap',
  },
  searchWrapper: {
    position: 'relative',
    flex: '1 1 300px',
  },
  searchIcon: {
    position: 'absolute',
    left: 'var(--spacing-md)',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-tertiary)',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: 'var(--spacing-md) var(--spacing-md) var(--spacing-md) 40px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    fontSize: '14px',
  },
  selectWrapper: {
    position: 'relative',
    flex: '0 1 200px',
  },
  selectIcon: {
    position: 'absolute',
    left: 'var(--spacing-md)',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-tertiary)',
    pointerEvents: 'none',
  },
  select: {
    width: '100%',
    padding: 'var(--spacing-md) var(--spacing-md) var(--spacing-md) 40px',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    cursor: 'pointer',
  },
  viewToggle: {
    display: 'flex',
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    overflow: 'hidden',
  },
  toggleButton: {
    padding: 'var(--spacing-md) var(--spacing-lg)',
    background: 'transparent',
    color: 'var(--text-secondary)',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  toggleButtonActive: {
    background: 'var(--accent-blue)',
    color: 'var(--text-primary)',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 'var(--spacing-2xl)',
    gap: 'var(--spacing-md)',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid var(--border-color)',
    borderTop: '4px solid var(--accent-blue)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: 'var(--text-secondary)',
  },
  errorContainer: {
    padding: 'var(--spacing-xl)',
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid rgba(255, 71, 87, 0.3)',
    textAlign: 'center',
  },
  errorText: {
    color: 'var(--accent-red)',
    marginBottom: 'var(--spacing-md)',
  },
  retryButton: {
    padding: 'var(--spacing-sm) var(--spacing-xl)',
    background: 'var(--accent-blue)',
    color: 'var(--text-primary)',
    borderRadius: 'var(--radius-md)',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 'var(--spacing-2xl)',
    gap: 'var(--spacing-md)',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  emptyText: {
    color: 'var(--text-secondary)',
  },
  tableWrapper: {
    overflowX: 'auto',
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-color)',
    marginBottom: 'var(--spacing-xl)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thead: {
    background: 'var(--bg-tertiary)',
  },
  th: {
    padding: 'var(--spacing-md) var(--spacing-lg)',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid var(--border-color)',
  },
  tr: {
    borderBottom: '1px solid var(--border-color)',
    transition: 'background 0.2s ease',
  },
  td: {
    padding: 'var(--spacing-md) var(--spacing-lg)',
    fontSize: '14px',
    color: 'var(--text-primary)',
  },
  symbolBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    background: 'var(--accent-blue)',
    color: 'var(--text-primary)',
    borderRadius: 'var(--radius-full)',
    fontSize: '12px',
    fontWeight: '700',
  },
  changeBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    borderRadius: 'var(--radius-full)',
    fontSize: '12px',
    fontWeight: '700',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 'var(--spacing-lg)',
    marginBottom: 'var(--spacing-xl)',
  },
  predictionCard: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-lg)',
    transition: 'all 0.3s ease',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--spacing-md)',
  },
  cardName: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: 'var(--spacing-lg)',
  },
  cardPrices: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 'var(--spacing-md)',
    marginBottom: 'var(--spacing-lg)',
  },
  cardLabel: {
    display: 'block',
    fontSize: '12px',
    color: 'var(--text-tertiary)',
    marginBottom: '4px',
  },
  cardPrice: {
    display: 'block',
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 'var(--spacing-md)',
    borderTop: '1px solid var(--border-color)',
  },
  cardInfo: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },
  chartSection: {
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-xl)',
    border: '1px solid var(--border-color)',
  },
  chartTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: 'var(--spacing-lg)',
  },
  chartContainer: {
    width: '100%',
    minHeight: '300px',
  },
};