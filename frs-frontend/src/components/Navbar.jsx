import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaPlaneDeparture,
  FaUserCircle,
  FaSignOutAlt,
  FaChevronDown,
  FaTicketAlt,
  FaTachometerAlt,
  FaShieldAlt,
} from "react-icons/fa";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail");
  const isLoggedIn = !!token;

  // Derive display name from email (everything before the @)
  const displayName = userEmail ? userEmail.split("@")[0] : "Account";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  // Close mobile menu + dropdown on route change
  const closeAll = () => {
    setIsOpen(false);
    setProfileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    closeAll();
    window.location.href = "/login";
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark shadow-sm py-3"
      style={{
        background: "var(--primary-color)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        position: "relative",
        zIndex: 1000,
      }}
    >
      <div className="container">
        {/* Brand */}
        <Link
          className="navbar-brand d-flex align-items-center gap-2 fw-bold"
          to="/"
          onClick={closeAll}
          style={{ letterSpacing: "0.5px" }}
        >
          <FaPlaneDeparture style={{ color: "var(--accent-color)", fontSize: "1.45rem" }} />
          <span>Aeroglide</span>
        </Link>

        {/* Mobile toggler */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Nav links */}
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-1">
            <li className="nav-item">
              <Link className="nav-link px-3" to="/" onClick={closeAll}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3" to="/flights" onClick={closeAll}>Flights</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3" to="/search" onClick={closeAll}>Search</Link>
            </li>

            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link px-3" to="/mybookings" onClick={closeAll}>Bookings</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-3" to="/admin" onClick={closeAll}>Admin</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-3" to="/dashboard" onClick={closeAll}>Dashboard</Link>
                </li>
              </>
            )}

            {/* ── Guest buttons ── */}
            {!isLoggedIn && (
              <>
                <li className="nav-item ms-lg-2">
                  <Link
                    className="btn btn-outline-light btn-sm px-3 py-2 fw-semibold"
                    to="/login"
                    onClick={closeAll}
                    style={{ borderRadius: "8px", border: "1px solid rgba(255,255,255,0.25)" }}
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item ms-lg-1">
                  <Link
                    className="btn btn-warning btn-sm px-3 py-2 fw-semibold text-dark"
                    to="/register"
                    onClick={closeAll}
                    style={{ borderRadius: "8px" }}
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}

            {/* ── Logged-in profile dropdown ── */}
            {isLoggedIn && (
              <li className="nav-item ms-lg-2" style={{ position: "relative" }} ref={dropdownRef}>
                {/* Trigger button */}
                <button
                  className="btn btn-outline-light btn-sm px-3 py-2 fw-semibold d-flex align-items-center gap-2"
                  style={{
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.25)",
                    transition: "background 0.15s",
                  }}
                  onClick={() => setProfileOpen((prev) => !prev)}
                >
                  <FaUserCircle style={{ color: "var(--accent-color)", fontSize: "1rem" }} />
                  <span className="d-none d-lg-inline" style={{ maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {displayName}
                  </span>
                  <FaChevronDown
                    size={10}
                    style={{
                      transition: "transform 0.2s",
                      transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>

                {/* Dropdown panel */}
                {profileOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      minWidth: "200px",
                      background: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                      zIndex: 9999,
                      overflow: "hidden",
                    }}
                  >
                    {/* Email header */}
                    <div
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #f0f0f0",
                        background: "#f9fafb",
                      }}
                    >
                      <p style={{ fontSize: "11px", color: "#9ca3af", margin: 0 }}>Signed in as</p>
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#111827",
                          margin: 0,
                          wordBreak: "break-all",
                        }}
                      >
                        {userEmail}
                      </p>
                    </div>

                    {/* Menu items */}
                    <div style={{ padding: "6px 0" }}>
                      <Link
                        to="/dashboard"
                        onClick={closeAll}
                        style={menuItemStyle}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <FaTachometerAlt size={13} style={{ color: "#6b7280" }} />
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        to="/mybookings"
                        onClick={closeAll}
                        style={menuItemStyle}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <FaTicketAlt size={13} style={{ color: "#6b7280" }} />
                        <span>My Bookings</span>
                      </Link>

                      <Link
                        to="/admin"
                        onClick={closeAll}
                        style={menuItemStyle}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <FaShieldAlt size={13} style={{ color: "#6b7280" }} />
                        <span>Admin Panel</span>
                      </Link>

                      <div style={{ height: "1px", background: "#f0f0f0", margin: "6px 0" }} />

                      <button
                        onClick={handleLogout}
                        style={{
                          ...menuItemStyle,
                          border: "none",
                          width: "100%",
                          background: "transparent",
                          color: "#ef4444",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#fef2f2")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <FaSignOutAlt size={13} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

const menuItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "9px 16px",
  fontSize: "14px",
  color: "#374151",
  textDecoration: "none",
  background: "transparent",
  transition: "background 0.15s",
};

export default Navbar;