import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlaneDeparture, FaPlaneArrival, FaSearch } from "react-icons/fa";

function SearchBar() {
  const navigate = useNavigate();
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const search = () => {
    if (!source || !destination) {
      alert("Please enter both departure and destination cities.");
      return;
    }
    navigate(`/search?source=${source}&destination=${destination}`);
  };

  return (
    <div 
      className="card shadow-lg p-4 mt-5 position-relative overflow-visible" 
      style={{ 
        border: "1px solid rgba(255, 255, 255, 0.8)", 
        background: "rgba(255, 255, 255, 0.9)", 
        backdropFilter: "blur(10px)",
        borderRadius: "20px"
      }}
    >
      <div className="position-absolute top-0 start-50 translate-middle badge bg-primary px-4 py-2 fs-6 shadow-sm" style={{ letterSpacing: "1px", background: "linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%)" }}>
        BOOK YOUR FLIGHT
      </div>

      <div className="row g-3 mt-2">
        <div className="col-md-5">
          <label className="form-label fw-bold text-secondary d-flex align-items-center gap-2 mb-2">
            <FaPlaneDeparture style={{ color: "var(--secondary-color)" }} />
            <span>Departure City</span>
          </label>
          <div className="input-group">
            <input
              className="form-control shadow-sm border-0 bg-light"
              placeholder="e.g. New Delhi"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              style={{ paddingLeft: "15px", height: "48px" }}
            />
          </div>
        </div>

        <div className="col-md-5">
          <label className="form-label fw-bold text-secondary d-flex align-items-center gap-2 mb-2">
            <FaPlaneArrival style={{ color: "var(--secondary-color)" }} />
            <span>Destination City</span>
          </label>
          <div className="input-group">
            <input
              className="form-control shadow-sm border-0 bg-light"
              placeholder="e.g. Mumbai"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              style={{ paddingLeft: "15px", height: "48px" }}
            />
          </div>
        </div>

        <div className="col-md-2 d-flex align-items-end">
          <button
            className="btn btn-primary w-100 shadow-sm d-flex align-items-center justify-content-center gap-2"
            onClick={search}
            style={{ height: "48px", background: "linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%)" }}
          >
            <FaSearch />
            <span>Find</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;