import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlaneDeparture, FaUserCircle, FaSignOutAlt, FaChevronDown } from "react-icons/fa";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail");
  const isLoggedIn = !!token;

  const closeMenu = () => {
    setIsOpen(false);
    setProfileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    closeMenu();
    navigate("/login");
    window.location.reload();
  };

  // Derive display name from email (everything before the @)
  const displayName = userEmail ? userEmail.split("@")[0] : "Account";

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark shadow-sm py-3"
      style={{
        background: "var(--primary-color)",
        borderBottom: "1px solid rgba(255,255,255,0.05)"
      }}
    >
      <div className="container">
        {/* Brand */}
        <Link
          className="navbar-brand d-flex align-items-center gap-2 fw-bold"
          to="/"
          onClick={closeMenu}
          style={{ letterSpacing: "0.5px" }}
        >
          <FaPlaneDeparture style={{ color: "var(--accent-color)", fontSize: "1.45rem" }} />
          <span>Aeroglide</span>
        </Link>

        {/* Mobile toggler */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav links */}
        <div
          className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto align-items-center gap-1">
            <li className="nav-item">
              <Link className="nav-link px-3" to="/" onClick={closeMenu}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3" to="/flights" onClick={closeMenu}>Flights</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3" to="/search" onClick={closeMenu}>Search</Link>
            </li>

            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link px-3" to="/mybookings" onClick={closeMenu}>Bookings</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-3" to="/admin" onClick={closeMenu}>Admin</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-3" to="/dashboard" onClick={closeMenu}>Dashboard</Link>
                </li>
              </>
            )}

            {/* Auth section */}
            {!isLoggedIn ? (
              <>
                <li className="nav-item ms-lg-2">
                  <Link
                    className="btn btn-outline-light btn-sm px-3 py-2 fw-semibold"
                    to="/login"
                    onClick={closeMenu}
                    style={{ borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)" }}
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item ms-lg-1">
                  <Link
                    className="btn btn-warning btn-sm px-3 py-2 fw-semibold text-dark"
                    to="/register"
                    onClick={closeMenu}
                    style={{ borderRadius: "8px" }}
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item ms-lg-2 position-relative">
                <button
                  className="btn btn-outline-light btn-sm px-3 py-2 fw-semibold d-flex align-items-center gap-2"
                  style={{ borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)" }}
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <FaUserCircle style={{ color: "var(--accent-color)" }} />
                  <span className="d-none d-lg-inline">{displayName}</span>
                  <FaChevronDown size={10} />
                </button>

                {profileOpen && (
                  <div
                    className="position-absolute end-0 mt-1 bg-white rounded-3 shadow-lg py-1"
                    style={{
                      minWidth: "160px",
                      zIndex: 9999,
                      top: "100%",
                      border: "1px solid #e5e7eb"
                    }}
                  >
                    <div className="px-3 py-2 border-bottom" style={{ fontSize: "12px", color: "#6b7280" }}>
                      Signed in as<br />
                      <strong className="text-dark" style={{ fontSize: "13px" }}>{userEmail}</strong>
                    </div>
                    <Link
                      to="/dashboard"
                      className="dropdown-item d-flex align-items-center gap-2 py-2"
                      style={{ fontSize: "14px" }}
                      onClick={closeMenu}
                    >
                      <FaUserCircle size={13} /> Dashboard
                    </Link>
                    <Link
                      to="/mybookings"
                      className="dropdown-item d-flex align-items-center gap-2 py-2"
                      style={{ fontSize: "14px" }}
                      onClick={closeMenu}
                    >
                      My Bookings
                    </Link>
                    <button
                      className="dropdown-item d-flex align-items-center gap-2 py-2 text-danger"
                      style={{ fontSize: "14px", border: "none", background: "none", width: "100%" }}
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt size={13} /> Sign Out
                    </button>
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

export default Navbar;