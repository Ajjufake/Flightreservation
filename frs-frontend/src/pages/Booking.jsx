import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import SeatSelector from "../components/SeatSelector";
import {
  FaPlane, FaCalendarAlt, FaClock, FaUser,
  FaChevronRight, FaPlus, FaTrash, FaChevronDown, FaChevronUp,
  FaCreditCard, FaMobileAlt, FaUniversity, FaShieldAlt, FaCheckCircle,
  FaLock, FaCheck
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

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [selectedBank, setSelectedBank] = useState("");

  // Payment simulation overlay states
  const [showPaymentOverlay, setShowPaymentOverlay] = useState(false);
  const [paymentStep, setPaymentStep] = useState(0); // 0 = Verifying, 1 = Processing, 2 = Success

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

  // Format card number as 1111 2222 3333 4444
  const handleCardNumberChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").substring(0, 16);
    const formatted = val.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(formatted);
  };

  // Format expiry as MM/YY
  const handleCardExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, "").substring(0, 4);
    if (val.length >= 2) {
      val = val.substring(0, 2) + "/" + val.substring(2);
    }
    setCardExpiry(val);
  };

  const handleCardCvvChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").substring(0, 3);
    setCardCvv(val);
  };

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

    // Validate Payment details
    if (paymentMethod === "CARD") {
      if (cardNumber.replace(/\s/g, "").length !== 16) {
        setError("Please enter a valid 16-digit Card Number.");
        return;
      }
      if (!cardHolder.trim()) {
        setError("Please enter the Cardholder Name.");
        return;
      }
      if (cardExpiry.length !== 5) {
        setError("Please enter Expiry Date (MM/YY).");
        return;
      }
      if (cardCvv.length !== 3) {
        setError("Please enter a valid 3-digit CVV.");
        return;
      }
    } else if (paymentMethod === "UPI") {
      if (!upiId.trim() || !upiId.includes("@")) {
        setError("Please enter a valid UPI ID (e.g., user@bank).");
        return;
      }
    } else if (paymentMethod === "NETBANK") {
      if (!selectedBank) {
        setError("Please select your bank for Net Banking.");
        return;
      }
    }

    setError("");
    setShowPaymentOverlay(true);
    setPaymentStep(0);

    // Simulate payment steps
    setTimeout(() => {
      setPaymentStep(1); // Processing Transaction
      setTimeout(() => {
        setPaymentStep(2); // Success / Finalizing Booking
        setTimeout(async () => {
          const token = localStorage.getItem("token");
          try {
            // Book each passenger sequentially with payment details
            for (const p of passengers) {
              const bookingData = {
                ...p,
                paymentMethod: paymentMethod === "CARD" ? "Card" : paymentMethod === "UPI" ? "UPI" : "Net Banking"
              };
              await axios.post(
                `http://localhost:8080/api/bookings/book?userId=${currentUser.id}&flightId=${flightId}`,
                bookingData,
                { headers: { Authorization: `Bearer ${token}` } }
              );
            }
            setShowPaymentOverlay(false);
            navigate("/mybookings");
          } catch (err) {
            setShowPaymentOverlay(false);
            setError(err.response?.data || "Booking failed. Please try again.");
          }
        }, 1500);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="booking-page py-5">
      <div className="container">
        <div className="row g-4">

          {/* ── Flight Summary Sidebar ── */}
          <div className="col-lg-4">
            <div className="card border-0 p-4 shadow-sm card-no-hover" style={{ borderRadius: "16px", position: "sticky", top: "20px" }}>
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
                    <div>
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
                    <div>
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

                  <div className="d-flex align-items-center justify-content-center gap-2 mt-4 text-muted small">
                    <FaShieldAlt size={12} className="text-success" />
                    <span>Secure Checkout • 256-bit SSL</span>
                  </div>
                </>
              ) : (
                <div className="text-center py-4 text-muted">Loading flight details...</div>
              )}
            </div>
          </div>

          {/* ── Passenger & Payment Forms ── */}
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
                const takenByOthers = passengers
                  .filter((_, i) => i !== idx)
                  .map(pp => pp.seatNumber)
                  .filter(Boolean);

                const isSeatOpen = activeSeatFor === idx;

                return (
                  <div
                    key={idx}
                    className="card border-0 shadow-sm card-no-hover"
                    style={{ borderRadius: "16px", overflow: "hidden" }}
                  >
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
                            setActiveSeatFor(-1);
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

            {/* ── Payment Method Section ── */}
            <h3 className="fw-bold mt-5 mb-3 d-flex align-items-center gap-2 text-dark">
              <FaCreditCard style={{ color: "var(--secondary-color)" }} />
              <span>Select Payment Method</span>
            </h3>

            <div className="card border-0 shadow-sm p-4 card-no-hover" style={{ borderRadius: "16px" }}>
              <div className="d-flex gap-3 mb-4 flex-wrap">
                <button
                  className={`btn d-flex align-items-center gap-2 px-4 py-2.5 fw-semibold ${paymentMethod === "CARD" ? "btn-primary" : "btn-light"}`}
                  style={{ borderRadius: "10px", border: paymentMethod === "CARD" ? "none" : "1px solid var(--border-color)" }}
                  onClick={() => setPaymentMethod("CARD")}
                >
                  <FaCreditCard /> Credit / Debit Card
                </button>
                <button
                  className={`btn d-flex align-items-center gap-2 px-4 py-2.5 fw-semibold ${paymentMethod === "UPI" ? "btn-primary" : "btn-light"}`}
                  style={{ borderRadius: "10px", border: paymentMethod === "UPI" ? "none" : "1px solid var(--border-color)" }}
                  onClick={() => setPaymentMethod("UPI")}
                >
                  <FaMobileAlt /> UPI Pay
                </button>
                <button
                  className={`btn d-flex align-items-center gap-2 px-4 py-2.5 fw-semibold ${paymentMethod === "NETBANK" ? "btn-primary" : "btn-light"}`}
                  style={{ borderRadius: "10px", border: paymentMethod === "NETBANK" ? "none" : "1px solid var(--border-color)" }}
                  onClick={() => setPaymentMethod("NETBANK")}
                >
                  <FaUniversity /> Net Banking
                </button>
              </div>

              {/* CARD DETAILS */}
              {paymentMethod === "CARD" && (
                <div className="row g-3">
                  <div className="col-12 col-md-7">
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-secondary small">Card Number</label>
                      <input
                        className="form-control"
                        placeholder="4111 2222 3333 4444"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-secondary small">Cardholder Name</label>
                      <input
                        className="form-control"
                        placeholder="John Doe"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                      />
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <label className="form-label fw-semibold text-secondary small">Expiry Date</label>
                        <input
                          className="form-control"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={handleCardExpiryChange}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold text-secondary small">CVV</label>
                        <input
                          type="password"
                          className="form-control"
                          placeholder="123"
                          value={cardCvv}
                          onChange={handleCardCvvChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Elegant virtual card visual preview */}
                  <div className="col-12 col-md-5 d-flex align-items-center justify-content-center">
                    <div
                      style={{
                        background: "linear-gradient(135deg, #0b192c 0%, #1e3e62 100%)",
                        borderRadius: "16px",
                        width: "280px",
                        height: "170px",
                        padding: "20px",
                        color: "white",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        border: "1px solid rgba(255,255,255,0.1)"
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="small text-white-50 fw-semibold">AEROGLIDE PLATINUM</span>
                        <FaPlane style={{ color: "var(--accent-color)" }} />
                      </div>
                      <div className="fs-5 fw-bold font-monospace mt-3" style={{ letterSpacing: "1.5px" }}>
                        {cardNumber || "•••• •••• •••• ••••"}
                      </div>
                      <div className="d-flex justify-content-between align-items-end mt-2">
                        <div>
                          <span style={{ fontSize: "9px" }} className="text-white-50 d-block">CARD HOLDER</span>
                          <span className="text-uppercase fw-semibold" style={{ fontSize: "12px" }}>{cardHolder || "YOUR NAME"}</span>
                        </div>
                        <div>
                          <span style={{ fontSize: "9px" }} className="text-white-50 d-block">EXPIRES</span>
                          <span className="fw-semibold" style={{ fontSize: "12px" }}>{cardExpiry || "MM/YY"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* UPI DETAILS */}
              {paymentMethod === "UPI" && (
                <div>
                  <div className="mb-3" style={{ maxWidth: "450px" }}>
                    <label className="form-label fw-semibold text-secondary small">UPI ID</label>
                    <input
                      className="form-control"
                      placeholder="username@bank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </div>
                  <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-3 border small text-muted">
                    <span style={{ fontSize: "1.5rem" }}>📱</span>
                    <span>A push request will be sent to your UPI app. Please approve the request to finalize the reservation.</span>
                  </div>
                </div>
              )}

              {/* NET BANKING DETAILS */}
              {paymentMethod === "NETBANK" && (
                <div style={{ maxWidth: "450px" }}>
                  <label className="form-label fw-semibold text-secondary small">Select Bank</label>
                  <select
                    className="form-control"
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                  >
                    <option value="">Choose a bank...</option>
                    <option value="SBI">State Bank of India (SBI)</option>
                    <option value="HDFC">HDFC Bank</option>
                    <option value="ICICI">ICICI Bank</option>
                    <option value="AXIS">Axis Bank</option>
                    <option value="KOTAK">Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}
            </div>

            {/* ── Submit Row ── */}
            <div className="mt-5 pt-3 d-flex justify-content-between align-items-center border-top">
              <div className="text-muted small">
                {passengers.length} passenger{passengers.length > 1 ? "s" : ""} &nbsp;·&nbsp;
                Total: <strong className="text-dark">₹{totalFare.toLocaleString("en-IN")}</strong>
              </div>
              <button
                className="btn btn-primary px-5 py-3 fw-bold d-flex align-items-center gap-2"
                style={{ borderRadius: "12px" }}
                onClick={handleSubmit}
                disabled={submitting}
              >
                <FaLock size={12} className="text-white-50" />
                <span>Pay & Confirm Booking</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ── Payment Process Simulation Overlay ── */}
      {showPaymentOverlay && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(11, 25, 44, 0.85)",
            backdropFilter: "blur(8px)",
            zIndex: 999999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white"
          }}
        >
          <div
            className="text-center p-5 card shadow-lg border-0"
            style={{ maxWidth: "420px", background: "white", color: "#0b192c", borderRadius: "24px" }}
          >
            {paymentStep === 0 && (
              <div>
                <div className="spinner-border text-primary mb-4" style={{ width: "3.5rem", height: "3.5rem" }} role="status" />
                <h5 className="fw-bold mb-2">Verifying Payment</h5>
                <p className="text-muted small mb-0">Establishing secure connection to payment gateway...</p>
              </div>
            )}
            {paymentStep === 1 && (
              <div>
                <div className="spinner-border text-warning mb-4" style={{ width: "3.5rem", height: "3.5rem" }} role="status" />
                <h5 className="fw-bold mb-2">Processing Transaction</h5>
                <p className="text-muted small mb-0">Authorizing amount of <strong>₹{totalFare.toLocaleString("en-IN")}</strong> with your financial institution...</p>
              </div>
            )}
            {paymentStep === 2 && (
              <div>
                <div className="text-success mb-4 animate__animated animate__bounceIn">
                  <FaCheckCircle size={60} />
                </div>
                <h5 className="fw-bold text-success mb-2">Payment Successful!</h5>
                <p className="text-muted small mb-0">Seat allocations confirmed. Finalizing your ticket reservation...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}