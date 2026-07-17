import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import SeatSelector from "../components/SeatSelector";
import {
  FaPlane, FaCalendarAlt, FaClock, FaUser,
  FaChevronRight, FaPlus, FaTrash, FaChevronDown, FaChevronUp
} from "react-icons/fa";
import "../styles/booking.css";

const newPassenger = () => ({ passengerName: "", age: "", gender: "", seatNumber: "" });

export default function Booking() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const flightId = params.get("flightId");

  const [bookedSeats, setBookedSeats] = useState([]);
  const [flight, setFlight] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Multi-passenger list
  const [passengers, setPassengers] = useState([newPassenger()]);
  // Which passenger's seat grid is currently open
  const [activeSeatFor, setActiveSeatFor] = useState(0);

  useEffect(() => {
    // Fetch booked seats from DB
    axios.get(`http://localhost:8080/api/bookings/seats/${flightId}`)
      .then(res => setBookedSeats(res.data))
      .catch(console.error);

    // Fetch flight details
    axios.get(`http://localhost:8080/api/flights/id/${flightId}`)
      .then(res => setFlight(res.data))
      .catch(console.error);

    // Fetch current user via JWT
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://localhost:8080/api/users/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          setCurrentUser(res.data);
          // Pre-fill first passenger name
          setPassengers(prev => {
            const copy = [...prev];
            copy[0] = { ...copy[0], passengerName: res.data.fullName };
            return copy;
          });
        })
        .catch(console.error);
    }
  }, [flightId]);

  // All seats currently picked by any passenger in this session
  const sessionSeats = passengers.map(p => p.seatNumber).filter(Boolean);

  const updatePassenger = (index, field, value) => {
    setPassengers(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addPassenger = () => {
    if (passengers.length >= 6) return; // max 6 per booking
    setPassengers(prev => [...prev, newPassenger()]);
    setActiveSeatFor(passengers.length); // open new passenger's seat selector
  };

  const removePassenger = (index) => {
    if (passengers.length === 1) return;
    setPassengers(prev => prev.filter((_, i) => i !== index));
    setActiveSeatFor(Math.max(0, activeSeatFor - 1));
  };

  const totalFare = flight ? flight.price * passengers.length : 0;

  const handleSubmit = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // Validate all passengers
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.passengerName || !p.age || !p.gender || !p.seatNumber) {
        setError(`Please complete all details for Passenger ${i + 1}.`);
        return;
      }
    }

    // Check for duplicate seats
    const seats = passengers.map(p => p.seatNumber);
    if (new Set(seats).size !== seats.length) {
      setError("Two or more passengers have the same seat selected. Please choose different seats.");
      return;
    }

    setError("");
    setSubmitting(true);

    const token = localStorage.getItem("token");
    try {
      // Book each passenger sequentially
      for (const p of passengers) {
        await axios.post(
          `http://localhost:8080/api/bookings/book?userId=${currentUser.id}&flightId=${flightId}`,
          p,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setSubmitting(false);
      navigate("/mybookings");
    } catch (err) {
      setSubmitting(false);
      setError(err.response?.data || "Booking failed. Please try again.");
    }
  };

  return (
    <div className="booking-page py-5">
      <div className="container">
        <div className="row g-4">

          {/* ── Flight Summary Sidebar ── */}
          <div className="col-lg-4">
            <div className="card border-0 p-4 shadow-sm" style={{ borderRadius: "16px", position: "sticky", top: "20px" }}>
              <h4 className="fw-bold mb-4 text-primary d-flex align-items-center gap-2">
                <FaPlane style={{ transform: "rotate(45deg)", color: "var(--accent-color)" }} />
                <span>Flight Details</span>
              </h4>

              {flight ? (
                <>
                  <div className="mb-3">
                    <h5 className="fw-bold text-dark mb-1">{flight.airline}</h5>
                    <span className="badge bg-light text-secondary border px-2 py-1">{flight.flightNumber}</span>
                  </div>

                  <div className="p-3 bg-light rounded-3 mb-3" style={{ border: "1px solid var(--border-color)" }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold text-dark">{flight.source}</span>
                      <FaChevronRight className="text-muted" size={12} />
                      <span className="fw-bold text-dark">{flight.destination}</span>
                    </div>
                    <div className="small text-muted d-flex align-items-center gap-1">
                      <FaCalendarAlt size={11} /> <span>{flight.departureDate}</span>
                    </div>
                  </div>

                  <div className="mb-3 d-flex justify-content-between text-muted small">
                    <div>
                      <span>Departure</span>
                      <strong className="d-block text-dark mt-1">
                        <FaClock size={11} className="me-1" />{flight.departureTime?.substring(0, 5)}
                      </strong>
                    </div>
                    <div className="text-end">
                      <span>Arrival</span>
                      <strong className="d-block text-dark mt-1">
                        <FaClock size={11} className="me-1" />{flight.arrivalTime?.substring(0, 5)}
                      </strong>
                    </div>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                      <span className="text-muted small d-block">Price per passenger</span>
                      <span className="fw-bold text-dark">₹{flight.price.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="text-muted small">×</div>
                    <div className="text-center">
                      <span className="text-muted small d-block">Passengers</span>
                      <span className="fw-bold text-dark">{passengers.length}</span>
                    </div>
                  </div>

                  <div
                    className="mt-3 p-3 rounded-3 d-flex justify-content-between align-items-center"
                    style={{ background: "linear-gradient(135deg, #0b192c 0%, #1e3e62 100%)" }}
                  >
                    <span className="text-white fw-semibold">Total Fare</span>
                    <span className="text-white fw-bold fs-4">₹{totalFare.toLocaleString("en-IN")}</span>
                  </div>
                </>
              ) : (
                <div className="text-center py-4 text-muted">Loading flight details...</div>
              )}
            </div>
          </div>

          {/* ── Passenger Forms ── */}
          <div className="col-lg-8">

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <FaUser style={{ color: "var(--secondary-color)" }} />
                <span>Passenger Information</span>
              </h3>
              {passengers.length < 6 && (
                <button
                  className="btn btn-outline-primary btn-sm px-3 py-2 fw-semibold d-flex align-items-center gap-2"
                  style={{ borderRadius: "10px" }}
                  onClick={addPassenger}
                >
                  <FaPlus size={12} />
                  Add Passenger
                </button>
              )}
            </div>

            {error && (
              <div className="alert alert-danger py-2 px-3 mb-3 rounded-3" style={{ fontSize: "14px" }}>
                {error}
              </div>
            )}

            <div className="d-flex flex-column gap-3">
              {passengers.map((p, idx) => {
                // Seats taken by OTHER passengers (not this one)
                const takenByOthers = passengers
                  .filter((_, i) => i !== idx)
                  .map(pp => pp.seatNumber)
                  .filter(Boolean);

                const isSeatOpen = activeSeatFor === idx;

                return (
                  <div
                    key={idx}
                    className="card border-0 shadow-sm"
                    style={{ borderRadius: "16px", overflow: "hidden" }}
                  >
                    {/* Passenger header */}
                    <div
                      className="d-flex justify-content-between align-items-center px-4 py-3"
                      style={{ background: "var(--primary-color)", color: "#fff" }}
                    >
                      <span className="fw-bold d-flex align-items-center gap-2">
                        <FaUser size={13} style={{ color: "var(--accent-color)" }} />
                        Passenger {idx + 1}
                        {p.seatNumber && (
                          <span
                            className="badge ms-2 fw-bold"
                            style={{ background: "var(--accent-color)", color: "#0b192c", fontSize: "12px" }}
                          >
                            Seat {p.seatNumber}
                          </span>
                        )}
                      </span>
                      {passengers.length > 1 && (
                        <button
                          className="btn btn-sm btn-link text-white p-0"
                          style={{ opacity: 0.75 }}
                          onClick={() => removePassenger(idx)}
                          title="Remove passenger"
                        >
                          <FaTrash size={13} />
                        </button>
                      )}
                    </div>

                    <div className="p-4">
                      {/* Fields */}
                      <div className="row g-3 mb-4">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold text-secondary small">Full Name</label>
                          <input
                            className="form-control"
                            placeholder="Passenger name"
                            value={p.passengerName}
                            onChange={e => updatePassenger(idx, "passengerName", e.target.value)}
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-semibold text-secondary small">Age</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Age"
                            min={1}
                            max={120}
                            value={p.age}
                            onChange={e => updatePassenger(idx, "age", e.target.value)}
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-semibold text-secondary small">Gender</label>
                          <select
                            className="form-control"
                            value={p.gender}
                            onChange={e => updatePassenger(idx, "gender", e.target.value)}
                          >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* Seat selection toggle */}
                      <button
                        className="btn btn-light w-100 d-flex justify-content-between align-items-center px-4 py-2 mb-3 fw-semibold"
                        style={{ borderRadius: "10px", border: "1px solid var(--border-color)" }}
                        onClick={() => setActiveSeatFor(isSeatOpen ? -1 : idx)}
                      >
                        <span>
                          {p.seatNumber
                            ? `✅ Seat ${p.seatNumber} selected — click to change`
                            : "🪑 Choose a seat"}
                        </span>
                        {isSeatOpen ? <FaChevronUp size={13} /> : <FaChevronDown size={13} />}
                      </button>

                      {isSeatOpen && (
                        <SeatSelector
                          selectedSeat={p.seatNumber}
                          setSelectedSeat={(seat) => {
                            updatePassenger(idx, "seatNumber", seat);
                            setActiveSeatFor(-1); // auto-close after picking
                          }}
                          bookedSeats={bookedSeats}
                          takenByOthers={takenByOthers}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Submit ── */}
            <div className="mt-4 pt-3 d-flex justify-content-between align-items-center border-top">
              <div className="text-muted small">
                {passengers.length} passenger{passengers.length > 1 ? "s" : ""} &nbsp;·&nbsp;
                Total: <strong className="text-dark">₹{totalFare.toLocaleString("en-IN")}</strong>
              </div>
              <button
                className="btn btn-primary px-5 py-3 fw-bold"
                style={{ borderRadius: "12px" }}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <><span className="spinner-border spinner-border-sm me-2" />Booking...</>
                ) : (
                  `Confirm ${passengers.length > 1 ? `${passengers.length} Bookings` : "Booking"}`
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}