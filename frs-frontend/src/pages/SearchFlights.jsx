import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { FaPlane, FaCalendarAlt, FaSearch, FaMapMarkerAlt, FaArrowRight, FaTimesCircle } from "react-icons/fa";
import { CITIES } from "../constants/cities";

// Reusable city autocomplete input for the search sidebar
function CityDropdown({ label, value, onChange, placeholder, excludeCity }) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  const filtered = CITIES.filter(
    (c) =>
      c !== excludeCity &&
      c.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className="position-relative">
      <label className="form-label fw-semibold text-secondary d-flex align-items-center gap-2">
        <FaMapMarkerAlt size={12} />
        <span>{label}</span>
      </label>
      <div className="position-relative">
        <input
          ref={inputRef}
          className="form-control"
          placeholder={placeholder}
          value={value}
          onChange={(e) => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 180)}
          style={{ paddingRight: value ? "36px" : undefined }}
          autoComplete="off"
        />
        {value && (
          <button
            className="btn btn-link position-absolute top-50 end-0 translate-middle-y pe-2 text-muted p-0"
            style={{ zIndex: 5 }}
            tabIndex={-1}
            onMouseDown={(e) => { e.preventDefault(); onChange(""); inputRef.current?.focus(); }}
          >
            <FaTimesCircle size={13} />
          </button>
        )}
      </div>
      {open && (
        <div
          className="position-absolute w-100 shadow-sm rounded-3 bg-white border mt-1"
          style={{ zIndex: 1050, top: "100%", left: 0, maxHeight: "200px", overflowY: "auto" }}
        >
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-muted small">No matching cities</div>
          ) : (
            filtered.map((city) => (
              <div
                key={city}
                className="px-3 py-2 dropdown-item-city"
                style={{ cursor: "pointer", fontSize: "13px" }}
                onMouseDown={() => { onChange(city); setOpen(false); }}
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

function SearchFlights() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [source, setSource] = useState(searchParams.get("source") || "");
  const [destination, setDestination] = useState(searchParams.get("destination") || "");
  const [departureDate, setDepartureDate] = useState(searchParams.get("departureDate") || "");

  const [flights, setFlights] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const runSearch = (src, dest, date) => {
    if (!src && !dest) {
      // No params — load all flights
      setLoading(true);
      axios.get("http://localhost:8080/api/flights")
        .then((res) => { setFlights(res.data); setHasSearched(true); setLoading(false); })
        .catch(() => { setFlights([]); setHasSearched(true); setLoading(false); });
      return;
    }

    let url = "http://localhost:8080/api/flights/route";
    const params = {};
    if (src) params.source = src;
    if (dest) params.destination = dest;

    if (date) {
      url = "http://localhost:8080/api/flights/search";
      params.departureDate = date;
    }

    setLoading(true);
    axios.get(url, { params })
      .then((res) => { setFlights(res.data); setHasSearched(true); setLoading(false); })
      .catch(() => { setFlights([]); setHasSearched(true); setLoading(false); });
  };

  // Auto-run when arriving from homepage with query params
  useEffect(() => {
    const src = searchParams.get("source");
    const dest = searchParams.get("destination");
    const date = searchParams.get("departureDate");
    if (src || dest) {
      runSearch(src || "", dest || "", date || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    if (source && destination && source.trim().toLowerCase() === destination.trim().toLowerCase()) {
      setFormError("Departure and destination cities cannot be the same.");
      return;
    }
    setFormError("");
    const params = {};
    if (source) params.source = source;
    if (destination) params.destination = destination;
    if (departureDate) params.departureDate = departureDate;
    setSearchParams(params);
    runSearch(source, destination, departureDate);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        {/* Left Column — Search Sidebar */}
        <div className="col-lg-4 mb-4">
          <div
            className="card shadow-sm p-4"
            style={{ borderRadius: "16px", border: "1px solid var(--border-color)", overflow: "visible" }}
          >
            <h4 className="fw-bold mb-4 text-primary d-flex align-items-center gap-2">
              <FaSearch style={{ fontSize: "1.1rem" }} />
              <span>Search Parameters</span>
            </h4>

            {formError && (
              <div className="alert alert-warning py-2 px-3 mb-3 rounded-3" style={{ fontSize: "13px" }}>
                {formError}
              </div>
            )}

            {/* Origin */}
            <div className="mb-3">
              <CityDropdown
                label="Origin"
                value={source}
                onChange={(v) => { setSource(v); setFormError(""); }}
                placeholder="Departure city"
                excludeCity={destination}
              />
            </div>

            {/* Destination */}
            <div className="mb-3">
              <CityDropdown
                label="Destination"
                value={destination}
                onChange={(v) => { setDestination(v); setFormError(""); }}
                placeholder="Arrival city"
                excludeCity={source}
              />
            </div>

            {/* Date */}
            <div className="mb-4">
              <label className="form-label fw-semibold text-secondary d-flex align-items-center gap-2">
                <FaCalendarAlt size={12} />
                <span>Departure Date <span className="fw-normal text-muted">(optional)</span></span>
              </label>
              <input
                type="date"
                className="form-control"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <button
              className="btn btn-primary w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? <span className="spinner-border spinner-border-sm" /> : <FaSearch />}
              <span>{loading ? "Searching..." : "Search Flights"}</span>
            </button>

            {hasSearched && (
              <button
                className="btn btn-link btn-sm mt-2 text-muted w-100"
                onClick={() => {
                  setSource(""); setDestination(""); setDepartureDate("");
                  setFlights([]); setHasSearched(false);
                  setSearchParams({});
                  setFormError("");
                }}
              >
                Clear search
              </button>
            )}
          </div>
        </div>

        {/* Right Column — Results */}
        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold mb-0">Available Flights</h3>
            {hasSearched && !loading && (
              <span
                className="badge px-3 py-2 rounded-pill fs-6"
                style={{ background: "var(--secondary-color)" }}
              >
                {flights.length} flight{flights.length !== 1 ? "s" : ""} found
              </span>
            )}
          </div>

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
              <p className="text-muted mt-3 small">Searching available flights...</p>
            </div>
          )}

          {!loading && !hasSearched && (
            <div
              className="text-center py-5 card shadow-sm border-0"
              style={{ borderRadius: "16px", background: "#ffffff" }}
            >
              <FaPlane style={{ fontSize: "3rem", color: "#d1d5db", transform: "rotate(45deg)", marginBottom: "1rem" }} />
              <h5 className="fw-semibold text-secondary">Enter search details to find flights</h5>
              <p className="text-muted small mb-0">We search across multiple top-tier partner airlines</p>
            </div>
          )}

          {!loading && hasSearched && flights.length === 0 && (
            <div
              className="text-center py-5 card shadow-sm border-0"
              style={{ borderRadius: "16px", background: "#fffefe", border: "1px dashed #f5c2c2" }}
            >
              <FaPlane style={{ fontSize: "3rem", color: "#f8d7da", transform: "rotate(45deg)", marginBottom: "1rem" }} />
              <h5 className="fw-semibold text-danger">No Flights Found</h5>
              <p className="text-muted small mb-0">Try modifying your search criteria or dates</p>
            </div>
          )}

          {!loading && flights.length > 0 && (
            <div className="d-flex flex-column gap-3">
              {flights.map((flight) => (
                <div
                  key={flight.id}
                  className="card shadow-sm p-4 border-0"
                  style={{ borderRadius: "16px", background: "#ffffff" }}
                >
                  <div className="row align-items-center">
                    {/* Airline & Number */}
                    <div className="col-md-3 mb-3 mb-md-0">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            width: "42px", height: "42px", borderRadius: "10px",
                            background: "rgba(30,62,98,0.08)", color: "var(--secondary-color)"
                          }}
                        >
                          <FaPlane style={{ transform: "rotate(45deg)" }} />
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0 text-dark">{flight.airline}</h6>
                          <small className="text-muted">{flight.flightNumber}</small>
                        </div>
                      </div>
                    </div>

                    {/* Route Timeline */}
                    <div className="col-md-5 mb-3 mb-md-0">
                      <div className="d-flex align-items-center justify-content-center gap-3 px-2">
                        <div className="text-center">
                          <h5 className="fw-bold mb-0 text-dark">{flight.source}</h5>
                          <small className="text-muted">{flight.departureTime?.substring(0, 5)}</small>
                        </div>
                        <div className="flex-grow-1 position-relative d-flex align-items-center justify-content-center" style={{ minWidth: "60px" }}>
                          <div style={{ width: "100%", height: "2px", background: "var(--border-color)" }}></div>
                          <FaPlane
                            className="position-absolute"
                            style={{ color: "var(--secondary-color)", transform: "rotate(90deg)", background: "#fff", padding: "2px", fontSize: "18px" }}
                          />
                        </div>
                        <div className="text-center">
                          <h5 className="fw-bold mb-0 text-dark">{flight.destination}</h5>
                          <small className="text-muted">{flight.arrivalTime?.substring(0, 5)}</small>
                        </div>
                      </div>
                    </div>

                    {/* Date, Price, Book */}
                    <div className="col-md-4 text-md-end d-flex flex-row flex-md-column justify-content-between align-items-center align-items-md-end gap-2">
                      <span className="badge bg-light text-secondary border px-2 py-1 fw-semibold d-inline-flex align-items-center gap-1">
                        <FaCalendarAlt size={11} />
                        <span>{flight.departureDate}</span>
                      </span>
                      <div className="d-flex align-items-center gap-3">
                        <div className="text-md-end">
                          <span className="text-muted small d-block">Per adult</span>
                          <span className="fs-4 fw-bold text-primary">
                            ₹{Number(flight.price).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <Link
                          className="btn btn-success px-3 py-2 fw-semibold d-flex align-items-center gap-1"
                          to={`/booking?flightId=${flight.id}`}
                          style={{ borderRadius: "10px" }}
                        >
                          Book <FaArrowRight size={11} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchFlights;