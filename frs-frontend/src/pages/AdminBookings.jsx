import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaTicketAlt, FaSearch, FaTrash, FaCheck, FaTimes,
  FaPlane, FaUser, FaInfoCircle, FaChair, FaExchangeAlt,
  FaChevronRight, FaTimesCircle, FaCheckCircle
} from "react-icons/fa";

export default function AdminBookings() {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [flights, setFlights] = useState([]);
  const [selectedFlightId, setSelectedFlightId] = useState("");
  const [selectedFlightBookings, setSelectedFlightBookings] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  const [cancelId, setCancelId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedSeatDetails, setSelectedSeatDetails] = useState(null);

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch all bookings and flights
  const fetchAllData = () => {
    Promise.all([
      axios.get("http://localhost:8080/api/bookings", authHeaders),
      axios.get("http://localhost:8080/api/flights")
    ])
      .then(([bookingsRes, flightsRes]) => {
        setBookings(bookingsRes.data);
        setFiltered(bookingsRes.data);
        setFlights(flightsRes.data);
        if (flightsRes.data.length > 0) {
          setSelectedFlightId(flightsRes.data[0].id.toString());
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (token && userRole === "ADMIN") {
      fetchAllData();
    } else {
      setLoading(false);
    }
  }, []);

  // Filter list when search or status changes
  useEffect(() => {
    let result = bookings;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(b =>
        b.bookingId?.toLowerCase().includes(q) ||
        b.passengerName?.toLowerCase().includes(q) ||
        b.flight?.flightNumber?.toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      result = result.filter(b => b.status === statusFilter);
    }
    setFiltered(result);
  }, [search, statusFilter, bookings]);

  // Fetch bookings for the selected flight to render the seat map
  useEffect(() => {
    if (!selectedFlightId) return;
    axios.get(`http://localhost:8080/api/bookings/flight/${selectedFlightId}`, authHeaders)
      .then(res => {
        setSelectedFlightBookings(res.data);
        setSelectedSeatDetails(null);
      })
      .catch(console.error);
  }, [selectedFlightId, bookings]);

  const handleCancelBooking = (id) => {
    setCancellingId(id);
    axios.delete(`http://localhost:8080/api/bookings/${id}`, authHeaders)
      .then(() => {
        setCancelId(null);
        setCancellingId(null);
        setSelectedSeatDetails(null);
        setSuccessMsg("Booking cancelled successfully and seat released.");
        setTimeout(() => setSuccessMsg(""), 3500);
        fetchAllData(); // Refresh all state
      })
      .catch(err => {
        console.error(err);
        setCancellingId(null);
        setCancelId(null);
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

  // Seat map parameters
  const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const cols = ["A", "B", "C", "D", "E", "F"];

  // Helper to check if a seat is occupied
  const getBookingForSeat = (seat) => {
    return selectedFlightBookings.find(b => b.seatNumber === seat);
  };

  return (
    <div className="container mt-5 mb-5">
      {/* Page Title */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-0 d-flex align-items-center gap-2 text-dark">
            <FaTicketAlt style={{ color: "var(--accent-color)" }} />
            Manage Bookings
          </h2>
          <p className="text-muted small mt-1 mb-0">
            {bookings.length} reservations total in the database
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="alert alert-success d-flex align-items-center gap-2 py-2 px-4 mb-4 rounded-3" style={{ fontSize: "14px" }}>
          <FaCheckCircle size={13} /> {successMsg}
        </div>
      )}

      {/* Row splitting Seat Occupancy map and List of bookings */}
      <div className="row g-4 mb-5">

        {/* ── Visual Seat Occupancy Map (Something Unique) ── */}
        <div className="col-12 col-xl-5">
          <div className="card shadow-sm border-0 p-4" style={{ borderRadius: "20px", height: "100%", background: "#ffffff" }}>
            <h5 className="fw-bold mb-3 text-dark d-flex align-items-center gap-2">
              <FaChair className="text-primary" /> Flight Occupancy Map
            </h5>
            
            <div className="mb-4">
              <label className="form-label small text-muted fw-semibold">Select Flight to Visualise</label>
              <select
                className="form-control"
                value={selectedFlightId}
                onChange={e => setSelectedFlightId(e.target.value)}
                style={{ borderRadius: "10px" }}
              >
                {flights.map(f => (
                  <option key={f.id} value={f.id}>{f.airline} ({f.flightNumber}) - {f.source} → {f.destination}</option>
                ))}
              </select>
            </div>

            {/* Simulated Seating Layout */}
            <div className="d-flex flex-column align-items-center py-4 bg-light rounded-4 border position-relative">
              {/* Aircraft cockpit visual header */}
              <div 
                style={{ 
                  width: "140px", 
                  height: "50px", 
                  background: "#e2e8f0", 
                  borderTopLeftRadius: "50px", 
                  borderTopRightRadius: "50px", 
                  border: "2px solid #cbd5e1",
                  borderBottom: "none",
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: "bold",
                  color: "#64748b",
                  marginBottom: "20px"
                }}
              >
                🛩️ COCKPIT
              </div>

              {/* Seat grid */}
              <div className="d-flex flex-column gap-2" style={{ maxWidth: "260px" }}>
                {rows.map(row => (
                  <div key={row} className="d-flex align-items-center gap-1.5">
                    <span className="text-muted font-monospace fw-bold small me-2" style={{ width: "20px", textAlign: "right" }}>{row}</span>
                    
                    {/* A B C */}
                    {cols.slice(0, 3).map(col => {
                      const seat = `${col}${row}`;
                      const booking = getBookingForSeat(seat);
                      const isOccupied = !!booking;
                      return (
                        <button
                          key={col}
                          className="btn p-0 d-flex align-items-center justify-content-center"
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "6px",
                            background: isOccupied ? "var(--secondary-color)" : "#e2e8f0",
                            color: isOccupied ? "white" : "#64748b",
                            border: isOccupied ? "1px solid #0f172a" : "1px solid #cbd5e1",
                            fontSize: "10px",
                            fontWeight: "bold",
                            boxShadow: isOccupied ? "0 2px 4px rgba(0,0,0,0.15)" : "none"
                          }}
                          onClick={() => setSelectedSeatDetails(booking || { emptySeat: seat })}
                          title={`Seat ${seat} ${isOccupied ? `(Booked by ${booking.passengerName})` : "(Available)"}`}
                        >
                          {col}
                        </button>
                      );
                    })}

                    {/* Aisle */}
                    <div style={{ width: "16px" }} />

                    {/* D E F */}
                    {cols.slice(3).map(col => {
                      const seat = `${col}${row}`;
                      const booking = getBookingForSeat(seat);
                      const isOccupied = !!booking;
                      return (
                        <button
                          key={col}
                          className="btn p-0 d-flex align-items-center justify-content-center"
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "6px",
                            background: isOccupied ? "var(--secondary-color)" : "#e2e8f0",
                            color: isOccupied ? "white" : "#64748b",
                            border: isOccupied ? "1px solid #0f172a" : "1px solid #cbd5e1",
                            fontSize: "10px",
                            fontWeight: "bold",
                            boxShadow: isOccupied ? "0 2px 4px rgba(0,0,0,0.15)" : "none"
                          }}
                          onClick={() => setSelectedSeatDetails(booking || { emptySeat: seat })}
                          title={`Seat ${seat} ${isOccupied ? `(Booked by ${booking.passengerName})` : "(Available)"}`}
                        >
                          {col}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="d-flex justify-content-center gap-4 mt-4 small fw-semibold">
                <div className="d-flex align-items-center gap-1">
                  <span style={{ width: "12px", height: "12px", background: "#e2e8f0", border: "1px solid #cbd5e1", borderRadius: "3px" }} />
                  <span>Available</span>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <span style={{ width: "12px", height: "12px", background: "var(--secondary-color)", border: "1px solid #0f172a", borderRadius: "3px" }} />
                  <span>Occupied</span>
                </div>
              </div>
            </div>

            {/* Selected Seat detail sidebar */}
            {selectedSeatDetails && (
              <div className="mt-4 p-3 bg-light rounded-3 border">
                {selectedSeatDetails.emptySeat ? (
                  <div>
                    <h6 className="fw-bold mb-1">Seat {selectedSeatDetails.emptySeat}</h6>
                    <p className="text-success mb-0 small">✓ Available for passenger allocation.</p>
                  </div>
                ) : (
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="fw-bold mb-0">Passenger Card — Seat {selectedSeatDetails.seatNumber}</h6>
                      <span className="badge bg-warning text-dark font-monospace">{selectedSeatDetails.bookingId}</span>
                    </div>
                    <div className="small text-muted mb-2">
                      <strong className="text-dark d-block mb-1">{selectedSeatDetails.passengerName}</strong>
                      Age: {selectedSeatDetails.age} • Gender: {selectedSeatDetails.gender} <br />
                      User Account: {selectedSeatDetails.user?.fullName} <br />
                      Paid via: {selectedSeatDetails.paymentMethod || "—"}
                    </div>
                    {cancelId === selectedSeatDetails.id ? (
                      <div className="d-flex gap-2 mt-2">
                        <span className="small text-danger fw-semibold my-auto">Confirm eviction?</span>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancelBooking(selectedSeatDetails.id)}
                          disabled={cancellingId === selectedSeatDetails.id}
                        >
                          {cancellingId === selectedSeatDetails.id ? "Releasing..." : "Yes, Release"}
                        </button>
                        <button className="btn btn-light btn-sm" onClick={() => setCancelId(null)}>No</button>
                      </div>
                    ) : (
                      <button
                        className="btn btn-outline-danger btn-sm w-100 mt-2 d-flex align-items-center justify-content-center gap-1"
                        style={{ borderRadius: "8px" }}
                        onClick={() => setCancelId(selectedSeatDetails.id)}
                        disabled={selectedSeatDetails.status === "CANCELLED"}
                      >
                        <FaTrash size={10} /> Release Seat & Evict Passenger
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Table List of Bookings ── */}
        <div className="col-12 col-xl-7">
          <div className="card shadow-sm border-0 p-4" style={{ borderRadius: "20px", height: "100%", background: "#ffffff" }}>
            <h5 className="fw-bold mb-4 text-dark d-flex align-items-center gap-2">
              <FaTicketAlt className="text-primary" /> System Bookings Logs
            </h5>

            {/* Filter controls */}
            <div className="row g-2 mb-4">
              <div className="col-md-7 position-relative">
                <FaSearch
                  size={12}
                  style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}
                />
                <input
                  className="form-control"
                  placeholder="Search by ID, passenger, or flight..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ paddingLeft: "34px", borderRadius: "10px" }}
                />
              </div>
              <div className="col-md-5">
                <select
                  className="form-control"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  style={{ borderRadius: "10px" }}
                >
                  <option value="">All Statuses</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-5 bg-light rounded-4 border">
                <FaTicketAlt size={40} className="text-muted mb-2" />
                <h6 className="text-secondary fw-bold">No bookings found</h6>
                <p className="text-muted small mb-0">Try a different search or filter query.</p>
              </div>
            ) : (
              <div className="table-responsive" style={{ maxHeight: "550px", overflowY: "auto" }}>
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Passenger</th>
                      <th>Flight</th>
                      <th>Seat</th>
                      <th>Payment</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(b => (
                      <tr key={b.id}>
                        <td>
                          <span className="fw-bold text-dark font-monospace">{b.bookingId}</span>
                        </td>
                        <td>
                          <strong className="d-block" style={{ fontSize: "13px" }}>{b.passengerName}</strong>
                          <span style={{ fontSize: "10px" }} className="text-muted">{b.user?.fullName}</span>
                        </td>
                        <td>
                          <span className="fw-semibold small">{b.flight?.flightNumber}</span>
                          <span className="text-muted d-block" style={{ fontSize: "11px" }}>{b.flight?.source} → {b.flight?.destination}</span>
                        </td>
                        <td>
                          <span className="badge bg-warning text-dark font-monospace fw-bold">{b.seatNumber}</span>
                        </td>
                        <td>
                          <span className="badge bg-light text-secondary border">{b.paymentMethod || "—"}</span>
                        </td>
                        <td>
                          {cancelId === b.id ? (
                            <div className="d-flex align-items-center gap-1">
                              <button
                                className="btn btn-danger btn-sm py-0.5 px-2"
                                style={{ fontSize: "11px", borderRadius: "5px" }}
                                onClick={() => handleCancelBooking(b.id)}
                                disabled={cancellingId === b.id}
                              >
                                {cancellingId === b.id ? "..." : "Yes"}
                              </button>
                              <button
                                className="btn btn-light btn-sm py-0.5 px-2"
                                style={{ fontSize: "11px", borderRadius: "5px" }}
                                onClick={() => setCancelId(null)}
                              >No</button>
                            </div>
                          ) : (
                            <button
                              className="btn btn-outline-danger btn-sm"
                              style={{ borderRadius: "6px", fontSize: "11px" }}
                              onClick={() => setCancelId(b.id)}
                              disabled={b.status === "CANCELLED"}
                              title="Evict passenger"
                            >
                              Release
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
