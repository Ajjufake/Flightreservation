import { useEffect, useState } from "react";
import axios from "axios";
import { FaBookmark, FaCalendarCheck, FaTimesCircle, FaWallet, FaUser } from "react-icons/fa";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://localhost:8080/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(userRes => {
        setCurrentUser(userRes.data);
        
        axios.get(`http://localhost:8080/api/dashboard/${userRes.data.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(dashRes => {
          setDashboard(dashRes.data);
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
    } else {
      setLoading(false);
    }
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

  return (
    <div className="container mt-5 mb-5">
      <div className="card border-0 bg-primary text-white p-4 mb-4 shadow-sm" style={{ borderRadius: "20px", background: "linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)" }}>
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center justify-content-center bg-white bg-opacity-10 rounded-circle" style={{ width: "60px", height: "60px" }}>
            <FaUser size={24} style={{ color: "var(--accent-color)" }} />
          </div>
          <div>
            <h4 className="fw-bold mb-1">Welcome back, {currentUser?.fullName}!</h4>
            <p className="mb-0 opacity-75 small">Here is a summary of your flight reservation logs and itinerary metrics.</p>
          </div>
        </div>
      </div>

      <h3 className="fw-bold mb-4 text-dark">Travel Dashboard</h3>

      <div className="row g-4">
        {/* Card 1 - Total Bookings */}
        <div className="col-lg-3 col-sm-6">
          <div className="card shadow-sm p-4 border-0 h-100" style={{ borderRadius: "16px", background: "#ffffff" }}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <span className="text-muted small fw-semibold uppercase">Total Bookings</span>
                <h2 className="fw-bold text-dark mt-2 mb-0">{dashboard.totalBookings}</h2>
              </div>
              <div className="p-3 rounded-3" style={{ background: "rgba(30, 62, 98, 0.08)", color: "var(--secondary-color)" }}>
                <FaBookmark size={18} />
              </div>
            </div>
            <small className="text-success fw-semibold">All-time reservation logs</small>
          </div>
        </div>

        {/* Card 2 - Upcoming */}
        <div className="col-lg-3 col-sm-6">
          <div className="card shadow-sm p-4 border-0 h-100" style={{ borderRadius: "16px", background: "#ffffff" }}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <span className="text-muted small fw-semibold uppercase">Upcoming Trips</span>
                <h2 className="fw-bold text-dark mt-2 mb-0">{dashboard.upcomingBookings}</h2>
              </div>
              <div className="p-3 rounded-3" style={{ background: "rgba(16, 185, 129, 0.08)", color: "#10b981" }}>
                <FaCalendarCheck size={18} />
              </div>
            </div>
            <small className="text-muted">Scheduled active flights</small>
          </div>
        </div>

        {/* Card 3 - Cancelled */}
        <div className="col-lg-3 col-sm-6">
          <div className="card shadow-sm p-4 border-0 h-100" style={{ borderRadius: "16px", background: "#ffffff" }}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <span className="text-muted small fw-semibold uppercase">Cancelled Flights</span>
                <h2 className="fw-bold text-dark mt-2 mb-0">{dashboard.cancelledBookings}</h2>
              </div>
              <div className="p-3 rounded-3" style={{ background: "rgba(239, 68, 68, 0.08)", color: "#ef4444" }}>
                <FaTimesCircle size={18} />
              </div>
            </div>
            <small className="text-muted">Refunded/withdrawn orders</small>
          </div>
        </div>

        {/* Card 4 - Total Spent */}
        <div className="col-lg-3 col-sm-6">
          <div className="card shadow-sm p-4 border-0 h-100" style={{ borderRadius: "16px", background: "#ffffff" }}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <span className="text-muted small fw-semibold uppercase">Total Investment</span>
                <h2 className="fw-bold text-dark mt-2 mb-0" style={{ letterSpacing: "-0.5px" }}>
                  ₹{dashboard.totalSpent.toLocaleString("en-IN")}
                </h2>
              </div>
              <div className="p-3 rounded-3" style={{ background: "rgba(226, 182, 89, 0.08)", color: "var(--accent-color)" }}>
                <FaWallet size={18} />
              </div>
            </div>
            <small className="text-success fw-semibold">Value of booked packages</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;