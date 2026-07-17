import { useState } from "react";
import { Link } from "react-router-dom";
import { FaPlaneDeparture } from "react-icons/fa";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm py-3" style={{ background: "var(--primary-color)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="container">

        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/" onClick={closeMenu} style={{ letterSpacing: "0.5px" }}>
          <FaPlaneDeparture style={{ color: "var(--accent-color)", fontSize: "1.45rem" }} />
          <span>Aeroglide</span>
        </Link>

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

            <li className="nav-item">
              <Link className="nav-link px-3" to="/mybookings" onClick={closeMenu}>Bookings</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link px-3" to="/admin" onClick={closeMenu}>Admin</Link>
            </li>
            
            <li className="nav-item">
              <Link className="nav-link px-3" to="/dashboard" onClick={closeMenu}>Dashboard</Link>
            </li>

            <li className="nav-item ms-lg-2">
              <Link className="btn btn-outline-light btn-sm px-3 py-2 fw-semibold" to="/login" onClick={closeMenu} style={{ borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)" }}>
                Login
              </Link>
            </li>

            <li className="nav-item ms-lg-1">
              <Link className="btn btn-primary btn-sm px-3 py-2 fw-semibold" to="/register" onClick={closeMenu} style={{ borderRadius: "8px", background: "linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%)" }}>
                Sign Up
              </Link>
            </li>

          </ul>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;