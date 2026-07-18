import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaBookmark, FaCalendarCheck, FaTimesCircle, FaWallet, FaUser, FaPlane, FaChair, FaArrowRight } from "react-icons/fa";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }

    axios.get("http://localhost:8080/api/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(userRes => {
      setCurrentUser(userRes.data);
      const userId = userRes.data.id;

      Promise.all([
        axios.get(`http://localhost:8080/api/dashboard/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`http://localhost:8080/api/bookings/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])
      .then(([dashRes, bookingsRes]) => {
        setDashboard(dashRes.data);
        // Show 5 most recent bookings
        const sorted = [...bookingsRes.data].slice(0, 5);
        setRecentBookings(sorted);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
    })
    .catch(err => {
      console.error("Failed to load user profile", err);
      setLoading(false);
    });
  }, []);

  if (!localStorage.getItem("token")) {
    return (
      <div className="container mt-5 text-center py-5">
        <div className="card shadow-sm p-5 border-0 mx-auto" style={{ maxWidth: "500px", borderRadius: "20px" }}>
          <h4 className="text-secondary fw-bold mb-3">Access Denied</h4>
          <p className="text-muted mb-4">Please log in to your account to view your travel statistics and booking dashboard.</p>
          <a href="/login" className="btn btn-primary px-4 py-2" style={{ borderRadius: "8px" }}>Log In</a>
        </div>
      </div>
    );
  }

  if (loading || !dashboard) {
    return (
      <div className="container mt-5 text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Bookings",
      value: dashboard.totalBookings,
      sub: "All-time reservation logs",
      subColor: "text-success",
      icon: <FaBookmark size={18} />,
      iconBg: "rgba(30, 62, 98, 0.08)",
      iconColor: "var(--secondary-color)",
    },
    {
      label: "Upcoming Trips",
      value: dashboard.upcomingBookings,
      sub: "Scheduled active flights",
      subColor: "text-muted",
      icon: <FaCalendarCheck size={18} />,
      iconBg: "rgba(16, 185, 129, 0.08)",
      iconColor: "#10b981",
    },
    {
      label: "Cancelled Flights",
      value: dashboard.cancelledBookings,
      sub: "Refunded/withdrawn orders",
      subColor: "text-muted",
      icon: <FaTimesCircle size={18} />,
      iconBg: "rgba(239, 68, 68, 0.08)",
      iconColor: "#ef4444",
    },
    {
      label: "Total Investment",
      value: `₹${dashboard.totalSpent.toLocaleString("en-IN")}`,
      sub: "Value of booked packages",
      subColor: "text-success",
      icon: <FaWallet size={18} />,
      iconBg: "rgba(226, 182, 89, 0.08)",
      iconColor: "var(--accent-color)",
      valueStyle: { letterSpacing: "-0.5px" },
    },
  ];

  return (
    <div className="container mt-5 mb-5 animate-fade-in-up">
      {/* Welcome banner */}
      <div
        className="card border-0 text-white p-4 mb-4 shadow-sm card-no-hover"
        style={{
          borderRadius: "20px",
          background: "linear-gradient(135deg, rgba(22, 38, 60, 0.85) 0%, rgba(30, 62, 98, 0.85) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center bg-white bg-opacity-10 rounded-circle"
            style={{ width: "60px", height: "60px", flexShrink: 0 }}
          >
            <FaUser size={24} style={{ color: "var(--accent-color)" }} />
          </div>
          <div>
            <h4 className="fw-bold mb-1">Welcome back, {currentUser?.fullName}!</h4>
            <p className="mb-0 opacity-75 small">Here is a summary of your flight reservation logs and itinerary metrics.</p>
          </div>
        </div>
      </div>

      <h3 className="fw-bold mb-4 text-slate">Travel Dashboard</h3>

      {/* Stat cards */}
      <div className="row g-4 mb-5">
        {statCards.map((s, i) => (
          <div key={i} className="col-lg-3 col-sm-6">
            <div className="card shadow p-4 border-0 h-100" style={{ borderRadius: "20px" }}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <span className="text-muted small fw-semibold text-uppercase">{s.label}</span>
                  <h2 className="fw-bold text-slate mt-2 mb-0" style={s.valueStyle}>{s.value}</h2>
                </div>
                <div className="p-3 rounded-3" style={{ background: s.iconBg, color: s.iconColor }}>
                  {s.icon}
                </div>
              </div>
              <small className={`${s.subColor} fw-semibold`}>{s.sub}</small>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      {recentBookings.length > 0 && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0 text-slate">Recent Bookings</h5>
            <Link to="/mybookings" className="btn btn-outline-primary btn-sm px-3 py-1 d-inline-flex align-items-center gap-1" style={{ borderRadius: "10px" }}>
              View all <FaArrowRight size={11} />
            </Link>
          </div>
          <div className="card card-no-hover shadow border-0 p-3" style={{ borderRadius: "20px" }}>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th><FaUser size={11} className="me-1" style={{ color: "var(--accent-color)" }} />Passenger</th>
                    <th><FaPlane size={11} className="me-1" style={{ color: "var(--accent-color)" }} />Flight</th>
                    <th><FaChair size={11} className="me-1" style={{ color: "var(--accent-color)" }} />Seat</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b) => (
                    <tr key={b.id}>
                      <td><span className="fw-bold text-slate font-monospace">{b.bookingId}</span></td>
                      <td className="text-slate fw-semibold">{b.passengerName}</td>
                      <td>
                        <span className="fw-bold text-slate">{b.flight?.airline}</span>
                        <small className="text-muted d-block">{b.flight?.source} → {b.flight?.destination}</small>
                      </td>
                      <td>
                        <span className="badge bg-warning text-dark font-monospace fw-bold px-2 py-1" style={{ fontSize: "12px" }}>
                          {b.seatNumber}
                        </span>
                      </td>
                      <td>
                        <span className={`badge px-3 py-1 rounded-pill fw-semibold ${b.status === "CONFIRMED" ? "bg-success bg-opacity-10 text-success border border-success" : "bg-secondary bg-opacity-10 text-secondary border border-secondary"}`}>
                          {b.status}
                        </span>
                        {b.paymentMethod && (
                          <small className="text-muted d-block mt-1" style={{ fontSize: "11px" }}>
                            Paid: <strong>{b.paymentMethod}</strong>
                          </small>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;