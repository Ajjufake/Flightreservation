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
  FaPlane,
  FaUsers,
} from "react-icons/fa";
import "../styles/navbar.css";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail");
  const userRole = localStorage.getItem("userRole") || "USER";
  const userFullName = localStorage.getItem("userFullName") || "";
  const isLoggedIn = !!token;
  const isAdmin = userRole === "ADMIN";

  // Display name: prefer full name, fall back to email prefix
  const displayName = userFullName
    ? userFullName.split(" ")[0]
    : userEmail
    ? userEmail.split("@")[0]
    : "Account";

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

  const closeAll = () => {
    setIsOpen(false);
    setProfileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userFullName");
    closeAll();
    window.location.href = "/login";
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light py-3"
      style={{
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(0, 0, 0, 0.06)",
        borderRadius: "16px",
        margin: "12px 24px",
        position: "sticky",
        top: "12px",
        zIndex: 1030,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
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

            {/* ── Common public links ── */}
            <li className="nav-item">
              <Link className="nav-link px-3" to="/" onClick={closeAll}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3" to="/flights" onClick={closeAll}>Flights</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3" to="/search" onClick={closeAll}>Search</Link>
            </li>

            {/* ── Logged-in USER links ── */}
            {isLoggedIn && !isAdmin && (
              <>
                <li className="nav-item">
                  <Link className="nav-link px-3" to="/mybookings" onClick={closeAll}>Bookings</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-3" to="/dashboard" onClick={closeAll}>Dashboard</Link>
                </li>
              </>
            )}

            {/* ── Logged-in ADMIN links ── */}
            {isLoggedIn && isAdmin && (
              <>
                <li className="nav-item">
                  <Link className="nav-link px-3" to="/admin" onClick={closeAll}>
                    <FaPlane size={12} className="me-1" />Flights
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-3" to="/admin/users" onClick={closeAll}>
                    <FaUsers size={12} className="me-1" />Users
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-3" to="/admin/bookings" onClick={closeAll}>
                    <FaTicketAlt size={12} className="me-1" style={{ color: "var(--accent-color)" }} />Bookings
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-3" to="/admin/dashboard" onClick={closeAll}>
                    <FaShieldAlt size={12} className="me-1" />Admin Panel
                  </Link>
                </li>
              </>
            )}

            {/* ── Guest buttons ── */}
            {!isLoggedIn && (
              <>
                <li className="nav-item ms-lg-2">
                  <Link
                    className="btn btn-outline-secondary btn-sm px-3 py-2 fw-semibold"
                    to="/login"
                    onClick={closeAll}
                    style={{ borderRadius: "8px", border: "1px solid rgba(30,41,59,0.2)", color: "rgba(30,41,59,0.8)" }}
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item ms-lg-1">
                  <Link
                    className="btn btn-primary btn-sm px-3 py-2 fw-semibold"
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
                  className="btn btn-outline-secondary btn-sm px-3 py-2 fw-semibold d-flex align-items-center gap-2"
                  style={{
                    borderRadius: "8px",
                    border: isAdmin
                      ? "1px solid rgba(180,83,9,0.6)"
                      : "1px solid rgba(30,41,59,0.2)",
                    background: isAdmin ? "rgba(180,83,9,0.08)" : "transparent",
                    color: "rgba(30,41,59,0.8)",
                    transition: "all 0.15s",
                  }}
                  onClick={() => setProfileOpen((prev) => !prev)}
                >
                  {isAdmin ? (
                    <FaShieldAlt style={{ color: "var(--accent-color)", fontSize: "1rem" }} />
                  ) : (
                    <FaUserCircle style={{ color: "var(--accent-color)", fontSize: "1rem" }} />
                  )}
                  <span
                    className="d-none d-lg-inline"
                    style={{ maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  >
                    {displayName}
                  </span>
                  {isAdmin && (
                    <span
                      className="badge ms-1"
                      style={{ background: "var(--accent-color)", color: "#ffffff", fontSize: "9px", padding: "2px 5px" }}
                    >
                      ADMIN
                    </span>
                  )}
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
                      minWidth: "220px",
                      background: "rgba(16, 30, 51, 0.95)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "14px",
                      boxShadow: "0 15px 35px rgba(0,0,0,0.4), 0 0 15px rgba(226, 182, 89, 0.15)",
                      zIndex: 9999,
                      overflow: "hidden",
                    }}
                  >
                    {/* Header */}
                    <div
                      style={{
                        padding: "14px 18px",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                        background: isAdmin ? "rgba(226, 182, 89, 0.08)" : "rgba(255, 255, 255, 0.02)",
                      }}
                    >
                      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", margin: 0 }}>
                        {isAdmin ? "🛡️ Admin Account" : "Signed in as"}
                      </p>
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "white",
                          margin: 0,
                          wordBreak: "break-all",
                        }}
                      >
                        {userFullName || userEmail}
                      </p>
                      {isAdmin && (
                        <p style={{ fontSize: "11px", color: "var(--accent-color)", margin: "2px 0 0", fontWeight: 600 }}>
                          {userEmail}
                        </p>
                      )}
                    </div>

                    {/* Menu items */}
                    <div style={{ padding: "6px 0" }}>
                      {isAdmin ? (
                        // ── ADMIN dropdown items ──
                        <>
                          <Link
                            to="/admin/dashboard"
                            onClick={closeAll}
                            style={menuItemStyle}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(226, 182, 89, 0.15)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            <FaShieldAlt size={13} style={{ color: "var(--accent-color)" }} />
                            <span>Admin Dashboard</span>
                          </Link>

                          <Link
                            to="/admin"
                            onClick={closeAll}
                            style={menuItemStyle}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            <FaPlane size={13} style={{ color: "rgba(255, 255, 255, 0.7)" }} />
                            <span>Manage Flights</span>
                          </Link>

                          <Link
                            to="/admin/users"
                            onClick={closeAll}
                            style={menuItemStyle}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            <FaUsers size={13} style={{ color: "rgba(255, 255, 255, 0.7)" }} />
                            <span>Manage Users</span>
                          </Link>

                          <Link
                            to="/admin/bookings"
                            onClick={closeAll}
                            style={menuItemStyle}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            <FaTicketAlt size={13} style={{ color: "rgba(255, 255, 255, 0.7)" }} />
                            <span>Manage Bookings</span>
                          </Link>
                        </>
                      ) : (
                        // ── USER dropdown items ──
                        <>
                          <Link
                            to="/dashboard"
                            onClick={closeAll}
                            style={menuItemStyle}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            <FaTachometerAlt size={13} style={{ color: "rgba(255, 255, 255, 0.7)" }} />
                            <span>Dashboard</span>
                          </Link>

                          <Link
                            to="/mybookings"
                            onClick={closeAll}
                            style={menuItemStyle}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            <FaTicketAlt size={13} style={{ color: "rgba(255, 255, 255, 0.7)" }} />
                            <span>My Bookings</span>
                          </Link>
                        </>
                      )}

                      <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", margin: "6px 0" }} />

                      <button
                        onClick={handleLogout}
                        style={{
                          ...menuItemStyle,
                          border: "none",
                          width: "100%",
                          background: "transparent",
                          color: "#f87171",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)")}
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
  padding: "10px 18px",
  fontSize: "14px",
  color: "rgba(255, 255, 255, 0.85)",
  textDecoration: "none",
  background: "transparent",
  transition: "all 0.2s",
};

export default Navbar;