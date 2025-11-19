import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MarketOverview from "../components/MarketOverview";
import { supabase } from "../supabaseclient";
import { FiRefreshCw, FiAlertCircle, FiTrendingUp, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Dashboard() {
  const [predictions, setPredictions] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch predictions
      let { data: predictionsData, error: predictionsError } = await supabase
        .from("predictions")
        .select("*")
        .eq("day_ahead", 1)
        .order("prediction_date", { ascending: false });
      
      // Fetch news
      let { data: newsData, error: newsError } = await supabase
        .from("news")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (predictionsError) throw predictionsError;
      if (newsError) console.error("Error fetching news:", newsError);
      
      setPredictions(predictionsData || []);
      setNews(newsData || []);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Calculate pagination
  const totalPages = Math.ceil(predictions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPredictions = predictions.slice(startIndex, endIndex);

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToPage = (pageNum) => {
    setCurrentPage(pageNum);
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    const icons = {
      'Corp Action': '📰',
      'Earnings': '📊',
      'Dividends': '💰',
      'News': '📢',
      'Macro': '🌐',
    };
    return icons[category] || '📄';
  };

  // Calculate change percentage
  const calculateChange = (predicted, lastClose) => {
    return ((predicted - lastClose) / lastClose * 100).toFixed(2);
  };

  // Generate mini chart for card
  // Generate mini chart for card
const generateMiniChart = (predicted, lastClose) => {
  const isPositive = predicted >= lastClose;
  const points = [];
  
  // Generate 40 smooth points
  for (let i = 0; i < 40; i++) {
    const progress = i / 39;
    const baseY = 50;
    const trendStrength = 25;
    const trend = isPositive ? -trendStrength : trendStrength;
    
    // Add wave patterns
    const wave1 = Math.sin(progress * Math.PI * 2) * 6;
    const wave2 = Math.sin(progress * Math.PI * 4) * 3;
    const noise = (Math.random() - 0.5) * 5;
    
    const y = baseY + (trend * progress) + wave1 + wave2 + noise;
    
    points.push({
      x: i * 5,
      y: Math.max(15, Math.min(85, y))
    });
  }
  
  return { points, isPositive };
};

  return (
    <div style={styles.page}>
      <Navbar />
      
      <div style={styles.container}>
        <MarketOverview />

        {/* Header Section */}
        <div style={styles.headerSection}>
          <div>
            <h2 style={styles.sectionTitle}>Stock Predictions </h2>
            <p style={styles.sectionSubtitle}>
          • Showing {startIndex + 1}-{Math.min(endIndex, predictions.length)} of {predictions.length} predictions
            </p>
          </div>
          <button onClick={fetchData} style={styles.refreshButton}>
            <FiRefreshCw size={18} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Loading predictions...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div style={styles.errorContainer}>
            <FiAlertCircle size={48} color="var(--accent-red)" />
            <h3 style={styles.errorTitle}>Error Loading Data</h3>
            <p style={styles.errorMessage}>{error}</p>
            <button onClick={fetchData} style={styles.retryButton}>
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && predictions.length === 0 && (
          <div style={styles.emptyContainer}>
            <FiTrendingUp size={64} color="var(--text-tertiary)" />
            <h3 style={styles.emptyTitle}>No Predictions Available</h3>
            <p style={styles.emptyMessage}>Add prediction data to your Supabase database to get started.</p>
            <button onClick={fetchData} style={styles.retryButton}>
              Refresh
            </button>
          </div>
        )}

        {/* Prediction Cards Grid */}
        {!loading && !error && predictions.length > 0 && (
          <>
            <div style={styles.stockGrid}>
              {currentPredictions.map((pred) => {
  const changePercent = calculateChange(pred.predicted_price, pred.last_close);
  const { points, isPositive } = generateMiniChart(pred.predicted_price, pred.last_close);
  const pathData = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
  
  return (
    <div key={pred.id} style={styles.predictionCard}>
      {/* Card Header */}
      <div style={styles.cardHeader}>
        <div style={styles.headerLeft}>
          <span style={styles.symbolBadge}>{pred.symbol}</span>
          <h4 style={styles.cardNameInline}>{pred.name}</h4>
        </div>
        <span style={{
          ...styles.changeBadge,
          color: changePercent >= 0 ? 'var(--accent-green)' : 'var(--accent-red)',
          background: changePercent >= 0 ? 'rgba(0, 209, 121, 0.1)' : 'rgba(255, 71, 87, 0.1)',
        }}>
          {changePercent >= 0 ? '▲' : '▼'} {Math.abs(changePercent)}%
        </span>
      </div>

      {/* Large Chart */}
      <div style={styles.chartContainerLarge}>
        <svg width="100%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`gradient-${pred.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isPositive ? '#00d179' : '#ff4757'} stopOpacity="0.4"/>
              <stop offset="100%" stopColor={isPositive ? '#00d179' : '#ff4757'} stopOpacity="0"/>
            </linearGradient>
            <filter id={`glow-${pred.id}`}>
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Grid lines */}
          <line x1="0" y1="25" x2="200" y2="25" stroke="var(--border-color)" strokeWidth="0.5" opacity="0.3"/>
          <line x1="0" y1="50" x2="200" y2="50" stroke="var(--border-color)" strokeWidth="0.5" opacity="0.5"/>
          <line x1="0" y1="75" x2="200" y2="75" stroke="var(--border-color)" strokeWidth="0.5" opacity="0.3"/>
          
          {/* Area fill */}
          <path
            d={`${pathData} L 200,100 L 0,100 Z`}
            fill={`url(#gradient-${pred.id})`}
          />
          
          {/* Trend line */}
          <path
            d={pathData}
            fill="none"
            stroke={isPositive ? '#00d179' : '#ff4757'}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#glow-${pred.id})`}
          />
          
          {/* End point */}
          <circle 
            cx={points[points.length - 1].x} 
            cy={points[points.length - 1].y} 
            r="4" 
            fill={isPositive ? '#00d179' : '#ff4757'}
          />
        </svg>
      </div>

      {/* Card Footer */}
      <div style={styles.cardFooter}>
        <span style={styles.dateText}>
          📅 {new Date(pred.prediction_date).toLocaleDateString('en-IN', { 
            day: 'numeric', 
            month: 'short',
            year: 'numeric'
          })}
        </span>
        <span style={styles.weekdayBadge}>{pred.market_reflect_weekday}</span>
      </div>
    </div>
  );
})}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={styles.paginationContainer}>
                <button 
                  onClick={goToPrevPage} 
                  disabled={currentPage === 1}
                  style={{
                    ...styles.paginationButton,
                    ...(currentPage === 1 && styles.paginationButtonDisabled)
                  }}
                >
                  <FiChevronLeft size={18} />
                  <span>Previous</span>
                </button>

                <div style={styles.paginationNumbers}>
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          style={{
                            ...styles.pageNumberButton,
                            ...(currentPage === pageNum && styles.pageNumberButtonActive)
                          }}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                      return <span key={pageNum} style={styles.paginationDots}>...</span>;
                    }
                    return null;
                  })}
                </div>

                <button 
                  onClick={goToNextPage} 
                  disabled={currentPage === totalPages}
                  style={{
                    ...styles.paginationButton,
                    ...(currentPage === totalPages && styles.paginationButtonDisabled)
                  }}
                >
                  <span>Next</span>
                  <FiChevronRight size={18} />
                </button>
              </div>
            )}

            {/* Info Bar */}
            <div style={styles.infoBar}>
              <span style={styles.infoText}>
                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
              </span>
              <span style={styles.infoText}>
                Showing <strong>{currentPredictions.length}</strong> of <strong>{predictions.length}</strong> predictions
              </span>
              <span style={styles.infoText}>
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </>
        )}
        {/* Bottom Sections */}
<div style={styles.bottomGrid}>
  {/* News Section - Scrollable */}
  <div style={styles.card}>
    <div style={styles.cardHeaderSection}>
      <h3 style={styles.cardTitle}>Today's News & Events</h3>
      <span style={styles.newsCount}>{news.length} items</span>
    </div>
    
    <div style={styles.newsFilters}>
      {['All', 'News', 'Macro', 'Earnings'].map((filter) => (
        <button key={filter} style={styles.filterButton}>
          {filter}
        </button>
      ))}
    </div>
    
    <div style={styles.newsListScrollable}>
      {news.length > 0 ? (
        news.map((item) => (
          <div key={item.id} style={styles.newsItemCompact}>
            <span style={styles.newsIcon}>{getCategoryIcon(item.category)}</span>
            <div style={styles.newsContent}>
              <span style={styles.newsTextCompact}>{item.title}</span>
              <span style={styles.newsCategoryBadge}>{item.category}</span>
            </div>
          </div>
        ))
      ) : (
        <p style={styles.noNewsText}>No news available</p>
      )}
    </div>
  </div>

  {/* Market Summary - Compact */}
  <div style={styles.card}>
    <h3 style={styles.cardTitle}>Predictions Summary</h3>
    <div style={styles.summaryGridCompact}>
      <div style={styles.summaryItemCompact}>
        <div style={styles.summaryIconContainer}>
          <span style={{ fontSize: '28px' }}>📊</span>
        </div>
        <div style={styles.summaryContent}>
          <span style={styles.summaryLabel}>Total Predictions</span>
          <span style={styles.summaryValue}>{predictions.length}</span>
        </div>
      </div>
      
      <div style={styles.summaryItemCompact}>
        <div style={{ ...styles.summaryIconContainer, background: 'rgba(0, 209, 121, 0.1)' }}>
          <span style={{ fontSize: '28px' }}>📈</span>
        </div>
        <div style={styles.summaryContent}>
          <span style={styles.summaryLabel}>Bullish</span>
          <span style={{ ...styles.summaryValue, color: 'var(--accent-green)' }}>
            {predictions.filter(p => p.predicted_price > p.last_close).length}
          </span>
        </div>
      </div>
      
      <div style={styles.summaryItemCompact}>
        <div style={{ ...styles.summaryIconContainer, background: 'rgba(255, 71, 87, 0.1)' }}>
          <span style={{ fontSize: '28px' }}>📉</span>
        </div>
        <div style={styles.summaryContent}>
          <span style={styles.summaryLabel}>Bearish</span>
          <span style={{ ...styles.summaryValue, color: 'var(--accent-red)' }}>
            {predictions.filter(p => p.predicted_price < p.last_close).length}
          </span>
        </div>
      </div>
    </div>
    
    {/* Quick Stats */}
    <div style={styles.quickStats}>
      <div style={styles.statItem}>
        <span style={styles.statLabel}>Avg Change</span>
        <span style={styles.statValue}>
          {(predictions.reduce((sum, p) => sum + parseFloat(calculateChange(p.predicted_price, p.last_close)), 0) / predictions.length || 0).toFixed(2)}%
        </span>
      </div>
      <div style={styles.statItem}>
        <span style={styles.statLabel}>Last Updated</span>
        <span style={styles.statValue}>{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  </div>
</div>
      </div>
    </div>
  );
}

const styles = {
  // Page Layout
  page: {
    background: 'var(--bg-primary)',
    minHeight: '100vh',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: 'var(--spacing-xl)',
  },

  // Header Section
  headerSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 'var(--spacing-xl)',
    gap: 'var(--spacing-md)',
    flexWrap: 'wrap',
  },
  sectionTitle: {
    fontSize: 'clamp(24px, 4vw, 32px)',
    fontWeight: '700',
    color: 'var(--text-primary)',
    margin: '0 0 var(--spacing-xs) 0',
  },
  sectionSubtitle: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    margin: 0,
  },
  refreshButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
    padding: 'var(--spacing-sm) var(--spacing-lg)',
    background: 'transparent',
    border: '1px solid var(--accent-blue)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--accent-blue)',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  // Loading States
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-2xl) var(--spacing-lg)',
    gap: 'var(--spacing-lg)',
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
    fontSize: '16px',
    color: 'var(--text-secondary)',
  },

  // Error States
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 'var(--spacing-2xl)',
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid rgba(255, 71, 87, 0.3)',
    gap: 'var(--spacing-md)',
  },
  errorTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    margin: 0,
  },
  errorMessage: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    textAlign: 'center',
    maxWidth: '500px',
  },
  retryButton: {
    padding: 'var(--spacing-md) var(--spacing-xl)',
    background: 'var(--accent-blue)',
    color: 'var(--text-primary)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: 'var(--spacing-sm)',
  },

  // Empty States
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 'var(--spacing-2xl)',
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-color)',
    gap: 'var(--spacing-md)',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    margin: 0,
  },
  emptyMessage: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    textAlign: 'center',
    maxWidth: '500px',
  },

  // Prediction Cards Grid
  stockGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: 'var(--spacing-lg)',
    marginBottom: 'var(--spacing-xl)',
  },

  // Prediction Card
  predictionCard: {
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-lg)',
    border: '1px solid var(--border-color)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-md)',
    minHeight: '280px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 'var(--spacing-md)',
    flexWrap: 'wrap',
    paddingBottom: 'var(--spacing-md)',
    borderBottom: '1px solid var(--border-color)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-md)',
    flex: 1,
    minWidth: '200px',
  },
  symbolBadge: {
    display: 'inline-block',
    padding: '8px 16px',
    background: 'var(--accent-blue)',
    color: 'var(--text-primary)',
    borderRadius: 'var(--radius-full)',
    fontSize: '14px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    flexShrink: 0,
  },
  cardNameInline: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    margin: 0,
    lineHeight: '1.3',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  changeBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 14px',
    borderRadius: 'var(--radius-full)',
    fontSize: '14px',
    fontWeight: '700',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },

  // Chart
  chartContainerLarge: {
    width: '100%',
    height: '160px',
    background: 'var(--bg-primary)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--spacing-md)',
    border: '1px solid var(--border-color)',
    flex: 1,
  },

  // Card Footer
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 'var(--spacing-md)',
    borderTop: '1px solid var(--border-color)',
    marginTop: 'auto',
  },
  dateText: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
  weekdayBadge: {
    padding: '4px 12px',
    background: 'var(--bg-tertiary)',
    color: 'var(--text-secondary)',
    borderRadius: 'var(--radius-full)',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  // Pagination
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 'var(--spacing-md)',
    marginBottom: 'var(--spacing-xl)',
    flexWrap: 'wrap',
  },
  paginationButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-xs)',
    padding: 'var(--spacing-sm) var(--spacing-lg)',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  paginationButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    pointerEvents: 'none',
  },
  paginationNumbers: {
    display: 'flex',
    gap: 'var(--spacing-xs)',
    alignItems: 'center',
  },
  pageNumberButton: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-secondary)',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  pageNumberButtonActive: {
    background: 'var(--accent-blue)',
    color: 'var(--text-primary)',
    borderColor: 'var(--accent-blue)',
  },
  paginationDots: {
    color: 'var(--text-tertiary)',
    fontSize: '14px',
    padding: '0 var(--spacing-xs)',
  },

  // Info Bar
  infoBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 'var(--spacing-md)',
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-md)',
    marginBottom: 'var(--spacing-2xl)',
    gap: 'var(--spacing-md)',
    flexWrap: 'wrap',
  },
  infoText: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
  },

  // Bottom Section
  bottomGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 'var(--spacing-xl)',
    marginTop: 'var(--spacing-2xl)',
  },
  card: {
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-lg)',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '500px',
  },

  // Card Header Section
  cardHeaderSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--spacing-md)',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    margin: 0,
  },
  newsCount: {
    fontSize: '12px',
    color: 'var(--text-tertiary)',
    background: 'var(--bg-tertiary)',
    padding: '4px 10px',
    borderRadius: 'var(--radius-full)',
    fontWeight: '600',
  },

  // News Section
  newsFilters: {
    display: 'flex',
    gap: 'var(--spacing-xs)',
    marginBottom: 'var(--spacing-md)',
    flexWrap: 'wrap',
  },
  filterButton: {
    padding: '6px 14px',
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-full)',
    color: 'var(--text-secondary)',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  newsListScrollable: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-sm)',
    overflowY: 'auto',
    maxHeight: '320px',
    paddingRight: 'var(--spacing-xs)',
    flex: 1,
  },
  newsItemCompact: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--spacing-md)',
    padding: 'var(--spacing-md)',
    background: 'var(--bg-tertiary)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  newsIcon: {
    fontSize: '20px',
    flexShrink: 0,
  },
  newsContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
    minWidth: 0,
  },
  newsTextCompact: {
    fontSize: '13px',
    color: 'var(--text-primary)',
    fontWeight: '500',
    lineHeight: '1.4',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  newsCategoryBadge: {
    fontSize: '10px',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: '700',
    background: 'var(--bg-primary)',
    padding: '2px 8px',
    borderRadius: 'var(--radius-full)',
    alignSelf: 'flex-start',
  },
  noNewsText: {
    fontSize: '14px',
    color: 'var(--text-tertiary)',
    textAlign: 'center',
    padding: 'var(--spacing-xl)',
    margin: 0,
  },

  // Summary Section
  summaryGridCompact: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-md)',
    marginBottom: 'var(--spacing-lg)',
  },
  summaryItemCompact: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-md)',
    padding: 'var(--spacing-md)',
    background: 'var(--bg-tertiary)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)',
  },
  summaryIconContainer: {
    width: '56px',
    height: '56px',
    background: 'var(--bg-primary)',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  summaryContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  summaryLabel: {
    fontSize: '12px',
    color: 'var(--text-tertiary)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  summaryValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    lineHeight: '1',
  },

  // Quick Stats
  quickStats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'var(--spacing-md)',
    paddingTop: 'var(--spacing-md)',
    borderTop: '1px solid var(--border-color)',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statLabel: {
    fontSize: '11px',
    color: 'var(--text-tertiary)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  statValue: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
};

const mediaStyles = `
/* Keyframe Animations */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(10px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

@keyframes slideIn {
  from { transform: translateX(-10px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* Custom Scrollbar for News List */
*::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

*::-webkit-scrollbar-track {
  background: var(--bg-tertiary);
  border-radius: 10px;
}

*::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 10px;
}

*::-webkit-scrollbar-thumb:hover {
  background: var(--border-color-light);
}

/* Tablet Devices (768px and below) */
@media (max-width: 768px) {
  .container { 
    padding: var(--spacing-md) !important; 
  }
  
  .headerSection { 
    flex-direction: column; 
    align-items: stretch; 
  }
  
  .stockGrid { 
    grid-template-columns: 1fr !important; 
  }
  
  .bottomGrid { 
    grid-template-columns: 1fr !important; 
  }
  
  .paginationNumbers {
    gap: 4px !important;
  }
  
  .infoBar {
    flex-direction: column;
    align-items: flex-start !important;
  }
  
  .cardHeader {
    flex-direction: column;
    align-items: flex-start !important;
  }
  
  .headerLeft {
    width: 100%;
    flex-wrap: wrap;
  }
  
  .summaryGridCompact {
    gap: var(--spacing-sm) !important;
  }
  
  .quickStats {
    grid-template-columns: 1fr !important;
  }
}

/* Mobile Devices (480px and below) */
@media (max-width: 480px) {
  .container {
    padding: var(--spacing-sm) !important;
  }
  
  .headerSection {
    gap: var(--spacing-sm) !important;
  }
  
  .mainPriceSection {
    flex-direction: column !important;
    gap: var(--spacing-md) !important;
  }
  
  .lastClosePriceContainer {
    align-items: flex-start !important;
  }
  
  .paginationButton span {
    display: none;
  }
  
  .paginationButton {
    padding: var(--spacing-sm) !important;
  }
  
  .symbolBadge {
    font-size: 12px !important;
    padding: 6px 12px !important;
  }
  
  .changeBadge {
    font-size: 12px !important;
    padding: 4px 10px !important;
  }
  
  .stockGrid {
    gap: var(--spacing-md) !important;
  }
  
  .newsFilters {
    gap: 6px !important;
  }
  
  .filterButton {
    font-size: 11px !important;
    padding: 4px 10px !important;
  }
  
  .summaryIconContainer {
    width: 48px !important;
    height: 48px !important;
    font-size: 24px !important;
  }
  
  .summaryValue {
    font-size: 24px !important;
  }
}

/* Hover Effects (for devices with hover capability) */
@media (hover: hover) {
  .predictionCard:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--accent-blue);
  }
  
  .paginationButton:hover:not(:disabled) {
    background: var(--bg-tertiary);
    border-color: var(--accent-blue);
    color: var(--accent-blue);
  }
  
  .pageNumberButton:hover {
    background: var(--bg-tertiary);
    border-color: var(--accent-blue);
    color: var(--accent-blue);
  }
  
  .cardButton:hover {
    background: #3a8eef;
    transform: translateY(-2px);
  }
  
  .filterButton:hover {
    background: var(--accent-blue);
    color: var(--text-primary);
    border-color: var(--accent-blue);
  }
  
  .refreshButton:hover {
    background: rgba(74, 158, 255, 0.1);
    transform: translateY(-2px);
  }
  
  .newsItemCompact:hover {
    background: var(--bg-hover);
    transform: translateX(4px);
    border-color: var(--accent-blue);
  }
  
  .summaryItemCompact:hover {
    background: var(--bg-hover);
    border-color: var(--border-color-light);
  }
}

/* Landscape Mobile Devices */
@media (max-width: 900px) and (orientation: landscape) {
  .stockGrid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
  
  .bottomGrid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

/* Large Desktop (1920px and above) */
@media (min-width: 1920px) {
  .stockGrid {
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)) !important;
  }
  
  .container {
    max-width: 1600px !important;
  }
}

/* Print Styles */
@media print {
  .refreshButton,
  .paginationContainer,
  .newsFilters {
    display: none !important;
  }
  
  .predictionCard {
    break-inside: avoid;
    page-break-inside: avoid;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Dark Mode Override (if system preferences change) */
@media (prefers-color-scheme: light) {
  /* Keep dark mode forced */
  :root {
    color-scheme: dark;
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .predictionCard,
  .card,
  .newsItemCompact {
    border-width: 2px !important;
  }
  
  .symbolBadge,
  .changeBadge {
    border: 2px solid currentColor;
  }
}
`;

// Add to document head
if (typeof document !== 'undefined' && !document.getElementById('dashboard-styles')) {
  const styleSheet = document.createElement("style");
  styleSheet.id = 'dashboard-styles';
  styleSheet.textContent = mediaStyles;
  document.head.appendChild(styleSheet);
}
