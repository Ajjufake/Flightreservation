import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaShieldAlt, FaPlane, FaUsers, FaTicketAlt,
  FaArrowRight, FaPlus, FaTrash, FaChevronRight,
  FaCheckCircle, FaTimesCircle, FaChartBar,
} from "react-icons/fa";

function AdminDashboard() {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentFlights, setRecentFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token || userRole !== "ADMIN") return;

    Promise.all([
      axios.get("http://localhost:8080/api/users", authHeaders),
      axios.get("http://localhost:8080/api/flights"),
      axios.get("http://localhost:8080/api/bookings", authHeaders).catch(() => ({ data: [] })),
    ])
    .then(([usersRes, flightsRes, bookingsRes]) => {
      const users = usersRes.data;
      const flights = flightsRes.data;
      const bookings = bookingsRes.data;

      setStats({
        totalUsers: users.length,
        totalFlights: flights.length,
        totalBookings: bookings.length,
        confirmedBookings: bookings.filter(b => b.status === "CONFIRMED").length,
        cancelledBookings: bookings.filter(b => b.status === "CANCELLED").length,
      });
      setRecentUsers(users.slice(0, 6));
      setRecentFlights(flights.slice(0, 5));
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleDeleteUser = (id) => {
    setDeletingId(id);
    axios.delete(`http://localhost:8080/api/users/${id}`, authHeaders)
      .then(() => {
        setDeleteUserId(null);
        setDeletingId(null);
        setSuccessMsg("User deleted successfully.");
        setTimeout(() => setSuccessMsg(""), 3000);
        setRecentUsers(prev => prev.filter(u => u.id !== id));
        setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
      })
      .catch(err => {
        console.error(err);
        setDeletingId(null);
        setDeleteUserId(null);
      });
  };

  if (!token || userRole !== "ADMIN") {
    return (
      <div className="container mt-5 text-center py-5">
        <div className="card shadow-sm p-5 border-0 mx-auto" style={{ maxWidth: "500px", borderRadius: "20px" }}>
          <FaShieldAlt size={40} style={{ color: "#e5e7eb", marginBottom: "1rem" }} />
          <h4 className="text-secondary fw-bold mb-3">Admin Access Only</h4>
          <p className="text-muted mb-4">You need an admin account to view this page.</p>
          <a href="/login" className="btn btn-primary px-4 py-2" style={{ borderRadius: "8px" }}>Log In as Admin</a>
        </div>
      </div>
    );
  }

  if (loading || !stats) {
    return (
      <div className="container mt-5 text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-3 small">Loading admin data...</p>
      </div>
    );
  }

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: <FaUsers size={20} />, color: "#3b82f6", bg: "rgba(59,130,246,0.08)", link: "/admin/users" },
    { label: "Total Flights", value: stats.totalFlights, icon: <FaPlane size={20} />, color: "var(--secondary-color)", bg: "rgba(30,62,98,0.08)", link: "/admin" },
    { label: "Total Bookings", value: stats.totalBookings, icon: <FaTicketAlt size={20} />, color: "#10b981", bg: "rgba(16,185,129,0.08)", link: null },
    { label: "Confirmed", value: stats.confirmedBookings, icon: <FaCheckCircle size={20} />, color: "#10b981", bg: "rgba(16,185,129,0.08)", link: null },
    { label: "Cancelled", value: stats.cancelledBookings, icon: <FaTimesCircle size={20} />, color: "#ef4444", bg: "rgba(239,68,68,0.08)", link: null },
    { label: "Active Flights", value: recentFlights.length, icon: <FaChartBar size={20} />, color: "var(--accent-color)", bg: "rgba(226,182,89,0.08)", link: "/admin" },
  ];

  return (
    <div className="container mt-5 mb-5">

      {/* Admin Welcome Banner */}
      <div
        className="card card-no-hover border-0 text-white p-4 mb-4 shadow-sm"
        style={{ borderRadius: "20px", background: "linear-gradient(135deg, #0b192c 0%, #1e3e62 60%, #92400e 100%)" }}
      >
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: "60px", height: "60px", background: "rgba(226,182,89,0.15)", flexShrink: 0 }}
            >
              <FaShieldAlt size={26} style={{ color: "var(--accent-color)" }} />
            </div>
            <div>
              <h4 className="fw-bold mb-1">
                Admin Control Panel
                <span
                  className="badge ms-2"
                  style={{ background: "var(--accent-color)", color: "#0b192c", fontSize: "11px", verticalAlign: "middle" }}
                >
                  ADMIN
                </span>
              </h4>
              <p className="mb-0 opacity-75 small">Manage flights, users, and monitor system activity.</p>
            </div>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <Link
              to="/admin"
              className="btn btn-sm fw-semibold d-inline-flex align-items-center gap-2"
              style={{ background: "var(--accent-color)", color: "#0b192c", borderRadius: "8px", border: "none" }}
            >
              <FaPlus size={11} /> Add Flight
            </Link>
            <Link
              to="/admin/users"
              className="btn btn-sm btn-outline-light fw-semibold d-inline-flex align-items-center gap-2"
              style={{ borderRadius: "8px" }}
            >
              <FaUsers size={11} /> Manage Users
            </Link>
          </div>
        </div>
      </div>

      {/* Success message */}
      {successMsg && (
        <div className="alert alert-success d-flex align-items-center gap-2 py-2 px-4 mb-4 rounded-3" style={{ fontSize: "14px" }}>
          <FaCheckCircle size={13} /> {successMsg}
        </div>
      )}

      {/* Stat Cards */}
      <h5 className="fw-bold mb-3 text-dark">System Overview</h5>
      <div className="row g-3 mb-5">
        {statCards.map((s, i) => (
          <div key={i} className="col-lg-2 col-md-4 col-6">
            <div className="card shadow-sm p-3 border-0 h-100 text-center" style={{ borderRadius: "14px" }}>
              <div
                className="mx-auto mb-2 d-flex align-items-center justify-content-center rounded-3"
                style={{ width: "44px", height: "44px", background: s.bg, color: s.color }}
              >
                {s.icon}
              </div>
              <h3 className="fw-bold mb-0 text-dark" style={{ fontSize: "1.6rem" }}>{s.value}</h3>
              <small className="text-muted fw-semibold">{s.label}</small>
              {s.link && (
                <Link to={s.link} className="stretched-link" style={{ opacity: 0 }}>.</Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Recent Users */}
        <div className="col-lg-6">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
              <FaUsers size={16} style={{ color: "var(--secondary-color)" }} />
              Registered Users
            </h5>
            <Link
              to="/admin/users"
              className="btn btn-outline-primary btn-sm px-3 py-1 d-inline-flex align-items-center gap-1"
              style={{ borderRadius: "8px" }}
            >
              Manage <FaArrowRight size={10} />
            </Link>
          </div>
          <div className="card card-no-hover shadow-sm border-0" style={{ borderRadius: "16px" }}>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map(u => (
                    <tr key={u.id}>
                      <td className="fw-semibold text-dark">{u.fullName}</td>
                      <td className="text-muted small">{u.email}</td>
                      <td>
                        <span className={`badge px-2 py-1 rounded-pill fw-semibold ${u.role === "ADMIN" ? "bg-warning text-dark" : "bg-primary-subtle text-primary"}`} style={{ fontSize: "11px" }}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        {deleteUserId === u.id ? (
                          <div className="d-flex gap-1 align-items-center">
                            <span className="text-muted" style={{ fontSize: "11px" }}>Sure?</span>
                            <button
                              className="btn btn-danger btn-sm px-2 py-0 fw-semibold"
                              style={{ fontSize: "11px", borderRadius: "5px" }}
                              onClick={() => handleDeleteUser(u.id)}
                              disabled={deletingId === u.id}
                            >
                              {deletingId === u.id ? <span className="spinner-border spinner-border-sm" /> : "Yes"}
                            </button>
                            <button
                              className="btn btn-light btn-sm px-2 py-0 fw-semibold"
                              style={{ fontSize: "11px", borderRadius: "5px" }}
                              onClick={() => setDeleteUserId(null)}
                            >No</button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-outline-danger btn-sm px-2 py-1 d-inline-flex align-items-center gap-1"
                            style={{ borderRadius: "6px", fontSize: "11px" }}
                            onClick={() => setDeleteUserId(u.id)}
                            disabled={u.role === "ADMIN"}
                            title={u.role === "ADMIN" ? "Cannot delete admin" : "Delete user"}
                          >
                            <FaTrash size={10} /> Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Flights */}
        <div className="col-lg-6">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
              <FaPlane size={16} style={{ color: "var(--secondary-color)" }} />
              Flight Inventory
            </h5>
            <Link
              to="/admin"
              className="btn btn-outline-primary btn-sm px-3 py-1 d-inline-flex align-items-center gap-1"
              style={{ borderRadius: "8px" }}
            >
              Manage <FaArrowRight size={10} />
            </Link>
          </div>
          <div className="card card-no-hover shadow-sm border-0" style={{ borderRadius: "16px" }}>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Flight</th>
                    <th>Route</th>
                    <th>Date</th>
                    <th>Seats</th>
                  </tr>
                </thead>
                <tbody>
                  {recentFlights.map(f => (
                    <tr key={f.id}>
                      <td>
                        <span className="fw-bold text-dark d-block">{f.flightNumber}</span>
                        <small className="text-muted">{f.airline}</small>
                      </td>
                      <td>
                        <span className="badge bg-light text-secondary border" style={{ fontSize: "11px" }}>
                          {f.source} <FaChevronRight size={8} /> {f.destination}
                        </span>
                      </td>
                      <td><small className="text-muted">{f.departureDate}</small></td>
                      <td>
                        <span className={`badge fw-bold ${f.availableSeats > 10 ? "bg-success" : "bg-warning text-dark"}`}>
                          {f.availableSeats}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-3 py-2 border-top">
              <Link
                to="/admin"
                className="btn btn-sm btn-warning fw-semibold w-100 d-flex align-items-center justify-content-center gap-2"
                style={{ borderRadius: "8px" }}
              >
                <FaPlus size={12} /> Add New Flight
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
