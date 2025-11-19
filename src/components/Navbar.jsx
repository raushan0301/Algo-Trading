import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiSearch, FiTrendingUp } from "react-icons/fi";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.container}>
          {/* Logo */}
          <Link to="/" style={styles.logo}>
            <FiTrendingUp size={24} style={{ color: "var(--accent-blue)" }} />
            <span className="logo-text" style={styles.logoText}>CryptoCrafters</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="desktop-nav" style={styles.desktopNav}>
            <Link
              to="/"
              style={{
                ...styles.navLink,
                ...(isActive("/") && styles.navLinkActive),
              }}
            >
              Dashboard
            </Link>
            <Link
              to="/predictions"
              style={{
                ...styles.navLink,
                ...(isActive("/predictions") && styles.navLinkActive),
              }}
            >
              Predictions
            </Link>
          </div>

          {/* Search Bar */}
          <div className="search-container" style={styles.searchContainer}>
            <FiSearch size={18} style={styles.searchIcon} />
            <input
              placeholder="Search stocks..."
              style={styles.searchInput}
            />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-button"
            style={styles.mobileMenuButton}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={styles.mobileMenu}>
            <Link
              to="/"
              style={{
                ...styles.mobileNavLink,
                ...(isActive("/") && styles.mobileNavLinkActive),
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/predictions"
              style={{
                ...styles.mobileNavLink,
                ...(isActive("/predictions") && styles.mobileNavLinkActive),
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Predictions
            </Link>
          </div>
        )}
      </nav>
      <style>{navbarStyles}</style>
    </>
  );
}

const styles = {
  nav: {
    background: "var(--bg-secondary)",
    borderBottom: "1px solid var(--border-color)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "var(--shadow-md)",
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 var(--spacing-lg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "64px",
    gap: "var(--spacing-lg)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "var(--spacing-sm)",
    fontSize: "20px",
    fontWeight: "700",
    color: "var(--text-primary)",
    textDecoration: "none",
  },
  logoText: {
    display: "inline",
  },
  desktopNav: {
    display: "flex",
    gap: "var(--spacing-xl)",
  },
  navLink: {
    color: "var(--text-secondary)",
    fontSize: "15px",
    fontWeight: "500",
    padding: "var(--spacing-sm) var(--spacing-md)",
    borderRadius: "var(--radius-md)",
    transition: "all 0.2s ease",
    textDecoration: "none",
  },
  navLinkActive: {
    color: "var(--accent-blue)",
    background: "rgba(74, 158, 255, 0.1)",
  },
  searchContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    flex: "1",
    maxWidth: "400px",
  },
  searchIcon: {
    position: "absolute",
    left: "var(--spacing-md)",
    color: "var(--text-tertiary)",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    padding: "10px 16px 10px 40px",
    background: "var(--bg-tertiary)",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius-full)",
    color: "var(--text-primary)",
    fontSize: "14px",
    transition: "all 0.2s ease",
  },
  mobileMenuButton: {
    display: "none",
    color: "var(--text-primary)",
    padding: "var(--spacing-sm)",
  },
  mobileMenu: {
    display: "flex",
    flexDirection: "column",
    background: "var(--bg-secondary)",
    borderTop: "1px solid var(--border-color)",
    padding: "var(--spacing-md)",
    gap: "var(--spacing-sm)",
  },
  mobileNavLink: {
    padding: "var(--spacing-md)",
    color: "var(--text-secondary)",
    borderRadius: "var(--radius-md)",
    fontSize: "16px",
    fontWeight: "500",
    textDecoration: "none",
  },
  mobileNavLinkActive: {
    color: "var(--accent-blue)",
    background: "rgba(74, 158, 255, 0.1)",
  },
};

const navbarStyles = `
  @media (max-width: 768px) {
    .desktop-nav {
      display: none !important;
    }
    .search-container {
      display: none !important;
    }
    .mobile-menu-button {
      display: flex !important;
    }
    .logo-text {
      display: none !important;
    }
  }

  @media (min-width: 769px) {
    .mobile-menu {
      display: none !important;
    }
  }
`;