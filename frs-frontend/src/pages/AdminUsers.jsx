import { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaTrash, FaCheck, FaTimes, FaShieldAlt, FaUserCircle, FaSearch } from "react-icons/fa";

function AdminUsers() {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const fetchUsers = () => {
    axios.get("http://localhost:8080/api/users", authHeaders)
      .then(res => {
        setUsers(res.data);
        setFiltered(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (token && userRole === "ADMIN") fetchUsers();
    else setLoading(false);
  }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(users);
    } else {
      const q = search.toLowerCase();
      setFiltered(users.filter(u =>
        u.fullName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q)
      ));
    }
  }, [search, users]);

  const handleDelete = (id) => {
    setDeletingId(id);
    axios.delete(`http://localhost:8080/api/users/${id}`, authHeaders)
      .then(() => {
        setDeleteId(null);
        setDeletingId(null);
        setSuccessMsg("User deleted successfully.");
        setTimeout(() => setSuccessMsg(""), 3000);
        setUsers(prev => prev.filter(u => u.id !== id));
      })
      .catch(err => {
        console.error(err);
        setDeletingId(null);
        setDeleteId(null);
      });
  };

  if (!token || userRole !== "ADMIN") {
    return (
      <div className="container mt-5 text-center py-5">
        <div className="card shadow-sm p-5 border-0 mx-auto" style={{ maxWidth: "500px", borderRadius: "20px" }}>
          <h4 className="text-secondary fw-bold mb-3">Admin Access Only</h4>
          <p className="text-muted mb-4">You need an admin account to view this page.</p>
          <a href="/login" className="btn btn-primary px-4 py-2" style={{ borderRadius: "8px" }}>Log In</a>
        </div>
      </div>
    );
  }

  if (loading) {
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
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-0 d-flex align-items-center gap-2">
            <FaUsers style={{ color: "var(--accent-color)" }} />
            Manage Users
          </h2>
          <p className="text-muted small mt-1 mb-0">
            {users.length} registered user{users.length !== 1 ? "s" : ""} in system
          </p>
        </div>

        {/* Search */}
        <div className="position-relative" style={{ minWidth: "260px" }}>
          <FaSearch
            size={13}
            style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}
          />
          <input
            className="form-control"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: "34px" }}
          />
        </div>
      </div>

      {/* Success message */}
      {successMsg && (
        <div className="alert alert-success d-flex align-items-center gap-2 py-2 px-4 mb-4 rounded-3" style={{ fontSize: "14px" }}>
          <FaCheck size={13} /> {successMsg}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-5 card shadow-sm border-0" style={{ borderRadius: "16px" }}>
          <FaUsers style={{ fontSize: "3rem", color: "#d1d5db", marginBottom: "1rem" }} />
          <h5 className="fw-semibold text-secondary">No users found</h5>
          {search && <p className="text-muted small">Try a different search term.</p>}
        </div>
      ) : (
        <div className="card card-no-hover shadow-sm border-0 p-3" style={{ borderRadius: "16px" }}>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th><FaUserCircle className="me-1" size={13} />Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={u.id}>
                    <td><small className="text-muted">{i + 1}</small></td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle fw-bold"
                          style={{
                            width: "32px", height: "32px", flexShrink: 0,
                            background: u.role === "ADMIN" ? "rgba(226,182,89,0.15)" : "rgba(30,62,98,0.08)",
                            color: u.role === "ADMIN" ? "var(--accent-color)" : "var(--secondary-color)",
                            fontSize: "12px"
                          }}
                        >
                          {u.role === "ADMIN"
                            ? <FaShieldAlt size={13} />
                            : (u.fullName?.charAt(0) || "U")}
                        </div>
                        <span className="fw-semibold text-dark">{u.fullName}</span>
                      </div>
                    </td>
                    <td className="text-muted small">{u.email}</td>
                    <td className="text-muted small">{u.phone || "—"}</td>
                    <td>
                      <span
                        className={`badge px-2 py-1 rounded-pill fw-semibold ${u.role === "ADMIN" ? "bg-warning text-dark" : "bg-primary-subtle text-primary border border-primary-subtle"}`}
                        style={{ fontSize: "11px" }}
                      >
                        {u.role === "ADMIN" ? "🛡️ ADMIN" : u.role}
                      </span>
                    </td>
                    <td>
                      {deleteId === u.id ? (
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-muted small">Are you sure?</span>
                          <button
                            className="btn btn-danger btn-sm px-2 py-1 fw-semibold d-inline-flex align-items-center gap-1"
                            style={{ borderRadius: "6px", fontSize: "12px" }}
                            onClick={() => handleDelete(u.id)}
                            disabled={deletingId === u.id}
                          >
                            {deletingId === u.id
                              ? <span className="spinner-border spinner-border-sm" />
                              : <><FaCheck size={10} /> Yes</>}
                          </button>
                          <button
                            className="btn btn-light btn-sm px-2 py-1 fw-semibold d-inline-flex align-items-center gap-1"
                            style={{ borderRadius: "6px", fontSize: "12px" }}
                            onClick={() => setDeleteId(null)}
                          >
                            <FaTimes size={10} /> No
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn btn-outline-danger btn-sm px-3 py-1 fw-semibold d-inline-flex align-items-center gap-1"
                          style={{ borderRadius: "8px" }}
                          onClick={() => setDeleteId(u.id)}
                          disabled={u.role === "ADMIN"}
                          title={u.role === "ADMIN" ? "Cannot delete admin accounts" : "Delete user"}
                        >
                          <FaTrash size={11} />
                          <span>Delete</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-2 pt-2 pb-1 border-top">
            <small className="text-muted">
              Showing {filtered.length} of {users.length} user{users.length !== 1 ? "s" : ""}
            </small>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
