import { useState, useEffect } from "react";
import axios from "axios";
import { FaPlane, FaTrash, FaPlus, FaTimes, FaEdit } from "react-icons/fa";

const API = "http://localhost:8080/api/flights";

const EMPTY_FORM = {
  flightNumber: "",
  airline: "",
  source: "",
  destination: "",
  departureDate: "",
  departureTime: "",
  arrivalTime: "",
  price: "",
  availableSeats: ""
};

function AdminFlights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchFlights = () => {
    setLoading(true);
    axios.get(API)
      .then(res => { setFlights(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchFlights(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setError("");
    setShowForm(true);
  };

  const openEdit = (f) => {
    setForm({
      flightNumber: f.flightNumber,
      airline: f.airline,
      source: f.source,
      destination: f.destination,
      departureDate: f.departureDate,
      departureTime: f.departureTime?.substring(0, 5) || "",
      arrivalTime: f.arrivalTime?.substring(0, 5) || "",
      price: f.price,
      availableSeats: f.availableSeats
    });
    setEditId(f.id);
    setError("");
    setShowForm(true);
  };

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const handleSave = async () => {
    const required = ["flightNumber", "airline", "source", "destination", "departureDate", "departureTime", "arrivalTime", "price", "availableSeats"];
    for (const k of required) {
      if (!form[k]) { setError(`Please fill in ${k}.`); return; }
    }
    setSaving(true);
    setError("");
    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, form, authHeaders);
      } else {
        await axios.post(API, form, authHeaders);
      }
      setSaving(false);
      setShowForm(false);
      fetchFlights();
    } catch (err) {
      setSaving(false);
      setError(err.response?.data || "Failed to save flight.");
    }
  };

  const handleDelete = async (id, flightNumber) => {
    if (!window.confirm(`Delete flight ${flightNumber}? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API}/${id}`, authHeaders);
      fetchFlights();
    } catch {
      alert("Failed to delete flight.");
    }
  };

  if (!token) {
    return (
      <div className="container mt-5 text-center py-5">
        <div className="card shadow-sm p-5 border-0 mx-auto" style={{ maxWidth: "500px", borderRadius: "20px" }}>
          <h4 className="text-secondary fw-bold mb-3">Access Denied</h4>
          <p className="text-muted mb-4">You must be logged in to manage flights.</p>
          <a href="/login" className="btn btn-primary px-4 py-2" style={{ borderRadius: "8px" }}>Log In</a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0 d-flex align-items-center gap-2">
            <FaPlane style={{ color: "var(--accent-color)" }} />
            Admin — Manage Flights
          </h2>
          <p className="text-muted small mt-1 mb-0">Add, edit or remove flights in the system</p>
        </div>
        <button
          className="btn btn-success px-4 py-2 fw-semibold d-flex align-items-center gap-2"
          style={{ borderRadius: "10px" }}
          onClick={openAdd}
        >
          <FaPlus size={13} /> Add Flight
        </button>
      </div>

      {/* Inline Add/Edit Form */}
      {showForm && (
        <div
          className="card border-0 shadow p-4 mb-4"
          style={{ borderRadius: "16px", background: "#f8fafc", borderLeft: "4px solid var(--accent-color)" }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">{editId ? "Edit Flight" : "Add New Flight"}</h5>
            <button className="btn btn-sm btn-light" onClick={() => setShowForm(false)}>
              <FaTimes />
            </button>
          </div>

          {error && (
            <div className="alert alert-danger py-2 px-3 mb-3" style={{ fontSize: "13px" }}>{error}</div>
          )}

          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold text-secondary small">Flight Number</label>
              <input className="form-control" name="flightNumber" placeholder="e.g. AI-202" value={form.flightNumber} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold text-secondary small">Airline</label>
              <input className="form-control" name="airline" placeholder="e.g. Air India" value={form.airline} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold text-secondary small">Price (₹)</label>
              <input className="form-control" type="number" name="price" placeholder="e.g. 6500" value={form.price} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold text-secondary small">Source City</label>
              <input className="form-control" name="source" placeholder="e.g. Delhi" value={form.source} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold text-secondary small">Destination City</label>
              <input className="form-control" name="destination" placeholder="e.g. Mumbai" value={form.destination} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold text-secondary small">Available Seats</label>
              <input className="form-control" type="number" name="availableSeats" placeholder="e.g. 36" value={form.availableSeats} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold text-secondary small">Departure Date</label>
              <input className="form-control" type="date" name="departureDate" value={form.departureDate} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold text-secondary small">Departure Time</label>
              <input className="form-control" type="time" name="departureTime" value={form.departureTime} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold text-secondary small">Arrival Time</label>
              <input className="form-control" type="time" name="arrivalTime" value={form.arrivalTime} onChange={handleChange} />
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button
              className="btn btn-primary px-4 py-2 fw-semibold"
              style={{ borderRadius: "10px" }}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? <span className="spinner-border spinner-border-sm me-2" /> : null}
              {saving ? "Saving..." : editId ? "Update Flight" : "Save Flight"}
            </button>
            <button className="btn btn-light px-4 py-2 fw-semibold" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Flights Table */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : flights.length === 0 ? (
        <div className="text-center py-5 card border-0 shadow-sm" style={{ borderRadius: "16px" }}>
          <FaPlane style={{ fontSize: "3rem", color: "#ddd", marginBottom: "1rem" }} />
          <h5 className="text-muted fw-semibold">No flights in the database</h5>
          <p className="text-muted small">Click "Add Flight" to insert the first flight.</p>
        </div>
      ) : (
        <div className="card card-no-hover border-0 shadow-sm p-3" style={{ borderRadius: "16px" }}>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Flight No.</th>
                  <th>Airline</th>
                  <th>Route</th>
                  <th>Date</th>
                  <th>Departure</th>
                  <th>Arrival</th>
                  <th>Price</th>
                  <th>Seats</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {flights.map(f => (
                  <tr key={f.id}>
                    <td>
                      <span className="fw-bold text-dark">{f.flightNumber}</span>
                    </td>
                    <td>{f.airline}</td>
                    <td>
                      <span className="badge bg-light text-secondary border">
                        {f.source} → {f.destination}
                      </span>
                    </td>
                    <td><small>{f.departureDate}</small></td>
                    <td><small>{f.departureTime?.substring(0, 5)}</small></td>
                    <td><small>{f.arrivalTime?.substring(0, 5)}</small></td>
                    <td>
                      <span className="fw-bold text-success">₹{Number(f.price).toLocaleString("en-IN")}</span>
                    </td>
                    <td>
                      <span className={`badge ${f.availableSeats > 10 ? "bg-success" : "bg-warning text-dark"}`}>
                        {f.availableSeats}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary px-2 py-1"
                          style={{ borderRadius: "6px" }}
                          title="Edit"
                          onClick={() => openEdit(f)}
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger px-2 py-1"
                          style={{ borderRadius: "6px" }}
                          title="Delete"
                          onClick={() => handleDelete(f.id, f.flightNumber)}
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-2 pt-2 pb-1">
            <small className="text-muted">{flights.length} flight{flights.length !== 1 ? "s" : ""} in system</small>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminFlights;