import { useEffect, useState } from "react";
import axios from "axios";
import BookingService from "../services/BookingService";
import { FaTicketAlt, FaUser, FaPlane, FaChair, FaInfoCircle, FaTrash } from "react-icons/fa";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
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
      .then(res => {
        setCurrentUser(res.data);
        loadBookings(res.data.id);
      })
      .catch(err => {
        console.error("Failed to load profile", err);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const loadBookings = (userId) => {
    if (!userId) return;
    BookingService.getMyBookings(userId)
      .then((res) => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const cancelBooking = (id) => {
    if (!window.confirm("Are you sure you want to cancel this flight booking?"))
      return;

    BookingService.cancelBooking(id)
      .then(() => {
        alert("Booking Cancelled Successfully");
        if (currentUser) {
          loadBookings(currentUser.id);
        }
      })
      .catch(console.error);
  };

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">My Bookings</h2>
        <span className="badge bg-primary px-3 py-2 rounded-pill fs-6">
          {bookings.length} Bookings Total
        </span>
      </div>

      {!currentUser && (
        <div className="text-center py-5 card shadow-sm" style={{ border: "1px dashed var(--border-color)" }}>
          <h5 className="fw-semibold text-secondary">Please login to view your flight bookings</h5>
          <p className="text-muted small">You need to be authenticated to access your itineraries.</p>
        </div>
      )}

      {currentUser && bookings.length === 0 && (
        <div className="text-center py-5 card shadow-sm" style={{ border: "1px dashed var(--border-color)", background: "#ffffff" }}>
          <div className="text-muted mb-3">
            <FaTicketAlt style={{ fontSize: "3rem", color: "var(--border-color)" }} />
          </div>
          <h5 className="fw-semibold text-secondary">You don't have any upcoming bookings</h5>
          <p className="text-muted small">Search and book flights to view them here.</p>
        </div>
      )}

      {currentUser && bookings.length > 0 && (
        <div className="card shadow-sm border-0 p-3" style={{ borderRadius: "16px", background: "#ffffff" }}>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th><FaTicketAlt className="me-2" />Booking ID</th>
                  <th><FaUser className="me-2" />Passenger</th>
                  <th><FaPlane className="me-2" />Flight</th>
                  <th><FaChair className="me-2" />Seat</th>
                  <th><FaInfoCircle className="me-2" />Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <span className="fw-bold text-dark">{b.bookingId}</span>
                    </td>
                    <td>{b.passengerName}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-bold">{b.flight.airline}</span>
                        <span className="badge bg-light text-secondary border px-2 py-1">{b.flight.flightNumber}</span>
                      </div>
                      <small className="text-muted block mt-1">
                        {b.flight.source} → {b.flight.destination}
                      </small>
                    </td>
                    <td>
                      <span className="badge bg-warning text-dark font-monospace fw-bold px-2.5 py-1.5" style={{ fontSize: "13px" }}>
                        {b.seatNumber}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${b.status === "CONFIRMED" ? "bg-success-subtle text-success border border-success-subtle" : "bg-secondary-subtle text-secondary"} px-3 py-1.5 rounded-pill fw-semibold`}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1.5"
                        onClick={() => cancelBooking(b.id)}
                        style={{ borderRadius: "8px" }}
                      >
                        <FaTrash size={12} />
                        <span>Cancel</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBookings;