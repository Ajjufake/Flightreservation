import { useEffect, useState } from "react";
import axios from "axios";
import BookingService from "../services/BookingService";
import { 
  FaTicketAlt, FaUser, FaPlane, FaChair, FaInfoCircle, FaTrash, 
  FaCheck, FaTimes, FaQrcode, FaPrint, FaPlaneDeparture 
} from "react-icons/fa";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedTicketBooking, setSelectedTicketBooking] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://localhost:8080/api/users/me", {
        headers: { Authorization: `Bearer ${token}` }
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
    setCancellingId(id);
    BookingService.cancelBooking(id)
      .then(() => {
        setConfirmCancelId(null);
        setCancellingId(null);
        setSuccessMsg("Booking cancelled successfully.");
        setTimeout(() => setSuccessMsg(""), 3500);
        if (currentUser) loadBookings(currentUser.id);
      })
      .catch(err => {
        console.error(err);
        setCancellingId(null);
        setConfirmCancelId(null);
      });
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
    <div className="container mt-5 mb-5 animate-fade-in-up">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0 text-slate">My Bookings</h2>
        <span className="badge px-3 py-2 rounded-pill fs-6" style={{ background: "rgba(180, 83, 9, 0.1)", color: "var(--accent-color)", border: "1px solid rgba(180, 83, 9, 0.2)" }}>
          {bookings.length} Bookings Total
        </span>
      </div>

      {/* Inline success toast */}
      {successMsg && (
        <div
          className="alert alert-success d-flex align-items-center gap-2 py-2 px-4 mb-4 rounded-3"
          style={{ fontSize: "14px", border: "1px solid #10b981", background: "rgba(16, 185, 129, 0.08)", color: "#059669" }}
        >
          <FaCheck size={13} />
          {successMsg}
        </div>
      )}

      {!currentUser && (
        <div className="text-center py-5 card shadow" style={{ border: "1px dashed rgba(0,0,0,0.12)" }}>
          <h5 className="fw-semibold text-secondary">Please login to view your flight bookings</h5>
          <p className="text-muted small">You need to be authenticated to access your itineraries.</p>
        </div>
      )}

      {currentUser && bookings.length === 0 && (
        <div className="text-center py-5 card shadow" style={{ border: "1px dashed rgba(0,0,0,0.12)" }}>
          <div className="mb-3" style={{ color: "var(--accent-color)" }}>
            <FaTicketAlt style={{ fontSize: "3rem" }} />
          </div>
          <h5 className="fw-semibold text-slate">You don't have any upcoming bookings</h5>
          <p className="text-muted small">Search and book flights to view them here.</p>
        </div>
      )}

      {currentUser && bookings.length > 0 && (
        <div className="card card-no-hover shadow border-0 p-3" style={{ borderRadius: "20px" }}>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th><FaTicketAlt className="me-2" style={{ color: "var(--accent-color)" }} />Booking ID</th>
                  <th><FaUser className="me-2" style={{ color: "var(--accent-color)" }} />Passenger</th>
                  <th><FaPlane className="me-2" style={{ color: "var(--accent-color)" }} />Flight</th>
                  <th><FaChair className="me-2" style={{ color: "var(--accent-color)" }} />Seat</th>
                  <th><FaInfoCircle className="me-2" style={{ color: "var(--accent-color)" }} />Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <span className="fw-bold text-slate font-monospace">{b.bookingId}</span>
                    </td>
                    <td className="text-slate fw-semibold">{b.passengerName}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-bold text-slate">{b.flight.airline}</span>
                        <span className="badge px-2 py-1" style={{ background: "rgba(0, 0, 0, 0.03)", border: "1px solid rgba(0, 0, 0, 0.06)", color: "rgba(30, 41, 59, 0.7)" }}>{b.flight.flightNumber}</span>
                      </div>
                      <small className="text-muted d-block mt-1">
                        {b.flight.source} → {b.flight.destination}
                      </small>
                    </td>
                    <td>
                      <span className="badge bg-warning text-dark font-monospace fw-bold px-2 py-1" style={{ fontSize: "13px" }}>
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
                     <td>
                       {confirmCancelId === b.id ? (
                         <div className="d-flex align-items-center gap-2">
                           <span className="text-muted small">Are you sure?</span>
                           <button
                             className="btn btn-danger btn-sm px-2 py-1 fw-semibold d-inline-flex align-items-center gap-1"
                             style={{ borderRadius: "6px", fontSize: "12px" }}
                             onClick={() => cancelBooking(b.id)}
                             disabled={cancellingId === b.id}
                           >
                             {cancellingId === b.id
                               ? <span className="spinner-border spinner-border-sm" />
                               : <><FaCheck size={10} /> Yes</>}
                           </button>
                           <button
                             className="btn btn-light btn-sm px-2 py-1 fw-semibold d-inline-flex align-items-center gap-1"
                             style={{ borderRadius: "6px", fontSize: "12px", color: "var(--primary-color)" }}
                             onClick={() => setConfirmCancelId(null)}
                           >
                             <FaTimes size={10} /> No
                           </button>
                         </div>
                       ) : (
                         <div className="d-flex align-items-center gap-2">
                           {b.status === "CONFIRMED" && (
                             <button
                               className="btn btn-outline-primary btn-sm px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1.5"
                               onClick={() => setSelectedTicketBooking(b)}
                               style={{ borderRadius: "10px" }}
                             >
                               <FaTicketAlt size={12} />
                               <span>Ticket</span>
                             </button>
                           )}
                           <button
                             className="btn btn-outline-danger btn-sm px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1.5"
                             onClick={() => setConfirmCancelId(b.id)}
                             style={{ borderRadius: "10px" }}
                             disabled={b.status === "CANCELLED"}
                           >
                             <FaTrash size={12} />
                             <span>Cancel</span>
                           </button>
                         </div>
                       )}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         </div>
       )}

      {/* ── Boarding Pass & E-Ticket Modal ── */}
      {selectedTicketBooking && (
        <div
          className="modal-backdrop-blur d-flex align-items-center justify-content-center"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(30, 41, 59, 0.45)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            zIndex: 1050,
            padding: "20px",
          }}
          onClick={() => setSelectedTicketBooking(null)}
        >
          <div
            className="card border-0 shadow-lg p-0 text-dark overflow-hidden animate-fade-in-up"
            style={{
              width: "100%",
              maxWidth: "750px",
              borderRadius: "24px",
              background: "#ffffff",
              boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="d-flex justify-content-between align-items-center px-4 py-3"
              style={{ background: "linear-gradient(135deg, var(--accent-color) 0%, var(--accent-hover) 100%)", color: "#ffffff" }}
            >
              <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <FaPlaneDeparture />
                <span>Aeroglide E-Boarding Pass</span>
              </h5>
              <button
                className="btn-close btn-close-white"
                onClick={() => setSelectedTicketBooking(null)}
                aria-label="Close"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </div>

            {/* Modal Body / Boarding Pass */}
            <div className="p-4" id="printable-boarding-pass">
              {/* Ticket Card Style */}
              <div
                style={{
                  border: "2px solid #e2e8f0",
                  borderRadius: "16px",
                  background: "#fafaf9",
                  overflow: "hidden",
                }}
              >
                {/* Brand header */}
                <div
                  className="d-flex justify-content-between align-items-center px-4 py-3"
                  style={{ background: "#f1f5f9", borderBottom: "1px solid #e2e8f0" }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <FaPlane style={{ color: "var(--accent-color)", fontSize: "1.2rem", transform: "rotate(45deg)" }} />
                    <span className="fw-extrabold text-slate tracking-wider" style={{ letterSpacing: "1px", fontWeight: "800" }}>AEROGLIDE</span>
                  </div>
                  <span className="badge bg-success text-white fw-bold uppercase">BOARDING PASS</span>
                </div>

                {/* Ticket Details Grid */}
                <div className="p-4">
                  <div className="row g-4">
                    {/* Column Left: Flight Path */}
                    <div className="col-12 col-md-8 border-end-md">
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                          <span className="text-muted small uppercase d-block">Origin</span>
                          <h2 className="fw-black mb-0 text-slate" style={{ fontWeight: "900" }}>{selectedTicketBooking.flight.source}</h2>
                          <span className="text-muted small">{selectedTicketBooking.flight.departureTime?.substring(0, 5)}</span>
                        </div>
                        <div className="text-center px-3" style={{ flexGrow: 1 }}>
                          <span className="text-muted small d-block mb-1">{selectedTicketBooking.flight.flightNumber}</span>
                          <div className="position-relative d-flex align-items-center justify-content-center">
                            <div style={{ width: "100%", height: "2px", borderTop: "2px dashed #cbd5e1" }}></div>
                            <FaPlane style={{ color: "var(--accent-color)", transform: "rotate(90deg)", background: "#fafaf9", padding: "0 6px", fontSize: "1.45rem", zIndex: 2 }} />
                          </div>
                          <span className="badge bg-light text-secondary border px-2 py-0.5 mt-1 small" style={{ fontSize: "10px" }}>Economy Class</span>
                        </div>
                        <div className="text-end">
                          <span className="text-muted small uppercase d-block">Destination</span>
                          <h2 className="fw-black mb-0 text-slate" style={{ fontWeight: "900" }}>{selectedTicketBooking.flight.destination}</h2>
                          <span className="text-muted small">{selectedTicketBooking.flight.arrivalTime?.substring(0, 5)}</span>
                        </div>
                      </div>

                      <div className="row g-3">
                        <div className="col-6">
                          <span className="text-muted small uppercase d-block">Passenger</span>
                          <strong className="text-slate">{selectedTicketBooking.passengerName}</strong>
                        </div>
                        <div className="col-6">
                          <span className="text-muted small uppercase d-block">Booking Reference</span>
                          <strong className="text-slate font-monospace text-primary">{selectedTicketBooking.bookingId}</strong>
                        </div>
                        <div className="col-6 col-md-4">
                          <span className="text-muted small uppercase d-block">Departure Date</span>
                          <strong className="text-slate">{selectedTicketBooking.flight.departureDate}</strong>
                        </div>
                        <div className="col-6 col-md-4">
                          <span className="text-muted small uppercase d-block">Seat</span>
                          <span className="badge bg-warning text-dark fw-bold px-2 py-1 font-monospace">{selectedTicketBooking.seatNumber}</span>
                        </div>
                        <div className="col-6 col-md-4">
                          <span className="text-muted small uppercase d-block">Gate</span>
                          <strong className="text-slate">Gate 12B</strong>
                        </div>
                      </div>
                    </div>

                    {/* Column Right: Barcode & QR Code styling */}
                    <div className="col-12 col-md-4 d-flex flex-column align-items-center justify-content-center py-2 bg-light rounded-3-md" style={{ background: "#f8fafc" }}>
                      {/* Stylized QR Code placeholder */}
                      <div
                        className="mb-3 d-flex align-items-center justify-content-center"
                        style={{
                          width: "110px",
                          height: "110px",
                          border: "1px solid #e2e8f0",
                          borderRadius: "12px",
                          background: "#ffffff",
                          padding: "10px",
                        }}
                      >
                        <FaQrcode size={90} className="text-slate" />
                      </div>
                      <span className="small text-muted mb-2 text-center" style={{ fontSize: "11px" }}>Scan at Security Gate</span>
                      
                      {/* Barcode lines */}
                      <div className="d-flex flex-column align-items-center w-100">
                        <div
                          className="d-flex gap-0.5 justify-content-center w-100 mb-1"
                          style={{ height: "40px", overflow: "hidden", opacity: 0.8 }}
                        >
                          {[2,1,3,1,2,4,1,2,3,1,4,2,1,3,2,1,2,3,1,4,1,2,1,3].map((w, i) => (
                            <div key={i} style={{ width: `${w}px`, background: "#0f172a", height: "100%" }} />
                          ))}
                        </div>
                        <span className="font-monospace small text-secondary" style={{ fontSize: "10px", letterSpacing: "1px" }}>
                          *AG{selectedTicketBooking.id}FL{selectedTicketBooking.flight.id}*
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer / Action controls */}
            <div className="d-flex justify-content-end gap-3 px-4 py-3 bg-light border-top">
              <button
                className="btn btn-outline-secondary px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1.5"
                style={{ borderRadius: "10px" }}
                onClick={() => setSelectedTicketBooking(null)}
              >
                Close
              </button>
              <button
                className="btn btn-primary px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2"
                style={{ borderRadius: "10px" }}
                onClick={() => {
                  const printContents = document.getElementById("printable-boarding-pass").innerHTML;
                  const originalContents = document.body.innerHTML;
                  
                  // Setup temporary print layout
                  document.body.innerHTML = `
                    <html>
                      <head>
                        <title>Boarding Pass - Aeroglide</title>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                        <style>
                          body { background: white !important; color: black !important; padding: 20px; font-family: sans-serif; }
                          .col-md-8 { width: 66.66667%; float: left; }
                          .col-md-4 { width: 33.33333%; float: left; }
                          .row { margin-right: -15px; margin-left: -15px; display: flex; flex-wrap: wrap; }
                          .border-end-md { border-right: 1px solid #dee2e6; }
                          @media print {
                            .btn, .btn-close { display: none !important; }
                          }
                        </style>
                      </head>
                      <body onload="window.print(); window.location.reload();">
                        ${printContents}
                      </body>
                    </html>
                  `;
                  
                  // Restore window after printing
                  setTimeout(() => {
                    document.body.innerHTML = originalContents;
                    window.location.reload();
                  }, 1000);
                }}
              >
                <FaPrint />
                Print Boarding Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBookings;