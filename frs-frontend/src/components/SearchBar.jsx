import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlaneDeparture, FaPlaneArrival, FaSearch, FaTimesCircle } from "react-icons/fa";
import { CITIES } from "../constants/cities";

function CityInput({ label, icon: Icon, value, onChange, placeholder, excludeCity }) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  const filtered = CITIES.filter(
    (city) =>
      city !== excludeCity &&
      city.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className="position-relative">
      <label className="form-label fw-bold text-secondary d-flex align-items-center gap-2 mb-2">
        <Icon style={{ color: "var(--secondary-color)" }} />
        <span>{label}</span>
      </label>
      <div className="position-relative">
        <input
          ref={inputRef}
          className="form-control shadow-sm border-0 bg-light"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 180)}
          style={{ paddingLeft: "15px", paddingRight: value ? "36px" : "15px", height: "48px" }}
          autoComplete="off"
        />
        {value && (
          <button
            className="btn btn-link position-absolute top-50 end-0 translate-middle-y pe-2 text-muted p-0"
            style={{ zIndex: 5 }}
            tabIndex={-1}
            onMouseDown={(e) => { e.preventDefault(); onChange(""); inputRef.current?.focus(); }}
          >
            <FaTimesCircle size={14} />
          </button>
        )}
      </div>

      {open && (
        <div
          className="position-absolute w-100 shadow-sm rounded-3 bg-white border mt-1"
          style={{ zIndex: 1050, top: "100%", left: 0, maxHeight: "220px", overflowY: "auto" }}
        >
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-muted small">No matching cities</div>
          ) : (
            filtered.map((city) => (
              <div
                key={city}
                className="px-3 py-2 dropdown-item-city"
                style={{ cursor: "pointer", fontSize: "14px" }}
                onMouseDown={() => {
                  onChange(city);
                  setOpen(false);
                }}
              >
                {city}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function SearchBar() {
  const navigate = useNavigate();
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [error, setError] = useState("");

  const search = () => {
    if (!source || !destination) {
      setError("Please select both departure and destination cities.");
      return;
    }
    if (source.trim().toLowerCase() === destination.trim().toLowerCase()) {
      setError("Departure and destination cities cannot be the same.");
      return;
    }
    setError("");
    navigate(`/search?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`);
  };

  return (
    <div
      className="card shadow-lg p-4 mt-5 position-relative overflow-visible"
      style={{
        border: "1px solid rgba(255,255,255,0.8)",
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(10px)",
        borderRadius: "20px"
      }}
    >
      <div
        className="position-absolute top-0 start-50 translate-middle badge px-4 py-2 fs-6 shadow-sm"
        style={{
          letterSpacing: "1px",
          background: "linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%)"
        }}
      >
        BOOK YOUR FLIGHT
      </div>

      {error && (
        <div className="alert alert-warning py-2 px-3 mt-2 mb-0 rounded-3" style={{ fontSize: "13px" }}>
          {error}
        </div>
      )}

      <div className="row g-3 mt-2">
        {/* Origin */}
        <div className="col-md-5">
          <CityInput
            label="Departure City"
            icon={FaPlaneDeparture}
            value={source}
            onChange={(v) => { setSource(v); setError(""); }}
            placeholder="e.g. Delhi"
            excludeCity={destination}
          />
        </div>

        {/* Destination */}
        <div className="col-md-5">
          <CityInput
            label="Destination City"
            icon={FaPlaneArrival}
            value={destination}
            onChange={(v) => { setDestination(v); setError(""); }}
            placeholder="e.g. Mumbai"
            excludeCity={source}
          />
        </div>

        {/* Button */}
        <div className="col-md-2 d-flex align-items-end">
          <button
            className="btn btn-primary w-100 shadow-sm d-flex align-items-center justify-content-center gap-2"
            onClick={search}
            style={{
              height: "48px",
              background: "linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%)"
            }}
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