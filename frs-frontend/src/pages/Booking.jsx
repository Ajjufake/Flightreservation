import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import SeatSelector from "../components/SeatSelector";
import { FaPlane, FaCalendarAlt, FaClock, FaUser, FaIdCard, FaChevronRight } from "react-icons/fa";
import "../styles/booking.css";

export default function Booking() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const flightId = params.get("flightId");

  const [bookedSeats, setBookedSeats] = useState([]);
  const [flight, setFlight] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [booking, setBooking] = useState({
    passengerName: "",
    age: "",
    gender: "",
    seatNumber: ""
  });

  useEffect(() => {
    // Fetch booked seats
    axios.get(`http://localhost:8080/api/bookings/seats/${flightId}`)
      .then(res => setBookedSeats(res.data))
      .catch(err => console.error(err));

    // Fetch flight details
    axios.get(`http://localhost:8080/api/flights/id/${flightId}`)
      .then(res => setFlight(res.data))
      .catch(err => console.error(err));

    // Fetch user profile
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://localhost:8080/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        setCurrentUser(res.data);
        // Pre-fill passenger name from profile
        setBooking(prev => ({
          ...prev,
          passengerName: res.data.fullName
        }));
      })
      .catch(err => console.error(err));
    }
  }, [flightId]);

  const handleChange = (e) => {
    setBooking({
      ...booking,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    if (!currentUser) {
      alert("Please login first to book a flight.");
      navigate("/login");
      return;
    }
    if (!booking.passengerName || !booking.age || !booking.gender || !booking.seatNumber) {
      alert("Please fill in all passenger details and select a seat.");
      return;
    }

    axios.post(
      `http://localhost:8080/api/bookings/book?userId=${currentUser.id}&flightId=${flightId}`,
      booking,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }
    )
    .then(() => {
      alert("Booking Successful!");
      navigate("/mybookings");
    })
    .catch(err => {
      alert(err.response?.data || "Booking Failed");
    });
  };

  return (
    <div className="booking-page py-5">
      <div className="container">
        <div className="row g-4">
          {/* Flight Summary Card */}
          <div className="col-lg-4">
            <div className="flight-summary card border-0 p-4 shadow-sm" style={{ borderRadius: "16px" }}>
              <h4 className="fw-bold mb-4 text-primary d-flex align-items-center gap-2">
                <FaPlane style={{ transform: "rotate(45deg)", color: "var(--accent-color)" }} />
                <span>Flight Details</span>
              </h4>

              {flight ? (
                <div>
                  <div className="mb-4">
                    <h5 className="fw-bold text-dark mb-1">{flight.airline}</h5>
                    <span className="badge bg-light text-secondary border px-2 py-1">{flight.flightNumber}</span>
                  </div>

                  <div className="p-3 bg-light rounded-3 mb-4" style={{ border: "1px solid var(--border-color)" }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold text-dark">{flight.source}</span>
                      <FaChevronRight className="text-muted" size={12} />
                      <span className="fw-bold text-dark">{flight.destination}</span>
                    </div>
                    <div className="small text-muted d-flex align-items-center gap-1.5">
                      <FaCalendarAlt size={12} />
                      <span>{flight.departureDate}</span>
                    </div>
                  </div>

                  <div className="mb-4 d-flex justify-content-between text-muted small">
                    <div>
                      <span>Departure</span>
                      <strong className="d-block text-dark mt-1"><FaClock size={12} className="me-1" />{flight.departureTime}</strong>
                    </div>
                    <div className="text-end">
                      <span>Arrival</span>
                      <strong className="d-block text-dark mt-1"><FaClock size={12} className="me-1" />{flight.arrivalTime}</strong>
                    </div>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <span className="text-muted">Total Fare:</span>
                    <span className="fs-3 fw-extrabold text-primary">₹{flight.price.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-muted">
                  Loading flight details...
                </div>
              )}
            </div>
          </div>

          {/* Passenger Info & Seat Selection */}
          <div className="col-lg-8">
            <div className="booking-form card border-0 p-4 shadow-sm" style={{ borderRadius: "16px" }}>
              <h3 className="fw-bold mb-4 text-dark d-flex align-items-center gap-2">
                <FaUser style={{ color: "var(--secondary-color)" }} />
                <span>Passenger & Seat Information</span>
              </h3>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-secondary">Passenger Name</label>
                  <input
                    className="form-control"
                    placeholder="Full Name"
                    name="passengerName"
                    value={booking.passengerName}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-semibold text-secondary">Age</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Age"
                    name="age"
                    value={booking.age}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-semibold text-secondary">Gender</label>
                  <select
                    className="form-control"
                    name="gender"
                    value={booking.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                  <FaIdCard style={{ color: "var(--secondary-color)" }} />
                  <span>Choose Seat</span>
                </h5>
                <SeatSelector
                  selectedSeat={booking.seatNumber}
                  setSelectedSeat={(seat) =>
                    setBooking(prev => ({
                      ...prev,
                      seatNumber: seat
                    }))
                  }
                  bookedSeats={bookedSeats}
                />
              </div>

              <div className="d-flex justify-content-between align-items-center mt-5 pt-3 border-top">
                <div>
                  {booking.seatNumber && (
                    <span className="text-secondary fw-semibold">
                      Selected Seat: <span className="badge bg-warning text-dark fs-6 ms-2 px-3 py-1.5">{booking.seatNumber}</span>
                    </span>
                  )}
                </div>
                <button
                  className="confirm-btn btn btn-primary py-3 px-5 fw-bold"
                  onClick={handleSubmit}
                  style={{ width: "auto", borderRadius: "12px" }}
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}