import React from "react";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

export default function StockCard({ title, value, change, showChart = true }) {
  const isPositive = change >= 0;
  
  const generateChartPoints = () => {
    const points = [];
    for (let i = 0; i < 40; i++) {
      points.push({
        x: i * 5,
        y: 50 + Math.random() * 30 * (isPositive ? 1 : -1) + (isPositive ? -i * 0.3 : i * 0.3)
      });
    }
    return points;
  };

  const chartPoints = generateChartPoints();
  const pathData = `M ${chartPoints.map(p => `${p.x},${p.y}`).join(' L ')}`;

  return (
    <div style={styles.card}>
      <div style={styles.content}>
        <div style={styles.header}>
          <h3 style={styles.title}>{title}</h3>
          <div style={{
            ...styles.badge,
            background: isPositive ? 'rgba(0, 209, 121, 0.1)' : 'rgba(255, 71, 87, 0.1)',
            color: isPositive ? 'var(--accent-green)' : 'var(--accent-red)'
          }}>
            {isPositive ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
            <span>{Math.abs(change)}%</span>
          </div>
        </div>
        
        <div style={styles.value}>
          {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
        </div>
        
        <div style={styles.changeContainer}>
          <span style={{ 
            color: isPositive ? 'var(--accent-green)' : 'var(--accent-red)',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            {isPositive ? '▲' : '▼'} {Math.abs(change)}%
          </span>
        </div>
      </div>
      
      {showChart && (
        <div style={styles.chartContainer}>
          <svg width="100%" height="80" viewBox="0 0 200 80" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={isPositive ? '#00d179' : '#ff4757'} stopOpacity="0.3"/>
                <stop offset="100%" stopColor={isPositive ? '#00d179' : '#ff4757'} stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path
              d={`${pathData} L 200,80 L 0,80 Z`}
              fill={`url(#gradient-${title})`}
            />
            <path
              d={pathData}
              fill="none"
              stroke={isPositive ? '#00d179' : '#ff4757'}
              strokeWidth="2"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: 'var(--bg-secondary)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-lg)',
    border: '1px solid var(--border-color)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-md)',
    minHeight: '180px',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: 'var(--shadow-lg)',
      borderColor: 'var(--border-color-light)',
    }
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-sm)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 'var(--spacing-sm)',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    margin: 0,
    flex: '1',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    borderRadius: 'var(--radius-full)',
    fontSize: '12px',
    fontWeight: '600',
  },
  value: {
    fontSize: 'clamp(24px, 3vw, 28px)',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginTop: 'var(--spacing-xs)',
  },
  changeContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-xs)',
  },
  chartContainer: {
    marginTop: 'auto',
    width: '100%',
    height: '80px',
  }
};