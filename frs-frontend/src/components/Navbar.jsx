import { Link } from "react-router-dom";
import { FaPlaneDeparture } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm py-3" style={{ background: "var(--primary-color)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="container">

        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/" style={{ letterSpacing: "0.5px" }}>
          <FaPlaneDeparture style={{ color: "var(--accent-color)", fontSize: "1.45rem" }} />
          <span>Aeroglide</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarNav"
        >

          <ul className="navbar-nav ms-auto align-items-center gap-1">

            <li className="nav-item">
              <Link className="nav-link px-3" to="/">Home</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link px-3" to="/flights">Flights</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link px-3" to="/search">Search</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link px-3" to="/mybookings">Bookings</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link px-3" to="/admin">Admin</Link>
            </li>
            
            <li className="nav-item">
              <Link className="nav-link px-3" to="/dashboard">Dashboard</Link>
            </li>

            <li className="nav-item ms-lg-2">
              <Link className="btn btn-outline-light btn-sm px-3 py-2 fw-semibold" to="/login" style={{ borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)" }}>
                Login
              </Link>
            </li>

            <li className="nav-item ms-lg-1">
              <Link className="btn btn-primary btn-sm px-3 py-2 fw-semibold" to="/register" style={{ borderRadius: "8px", background: "linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%)" }}>
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