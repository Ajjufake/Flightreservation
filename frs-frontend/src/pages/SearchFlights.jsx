import { useState, useEffect, useRef, useCallback } from "react";
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
      <label className="form-label fw-semibold d-flex align-items-center gap-2" style={{ color: "rgba(255,255,255,0.75)" }}>
        <FaMapMarkerAlt size={12} style={{ color: "var(--accent-color)" }} />
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
          className="position-absolute w-100 shadow rounded-3 mt-1"
          style={{
            zIndex: 1050,
            top: "100%",
            left: 0,
            maxHeight: "200px",
            overflowY: "auto",
            background: "rgba(16, 30, 51, 0.95)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-muted small">No matching cities</div>
          ) : (
            filtered.map((city) => (
              <div
                key={city}
                className="px-3 py-2 dropdown-item-city text-white"
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

  // Airline and Sort states
  const [selectedAirline, setSelectedAirline] = useState("");
  const [sortBy, setSortBy] = useState("priceAsc");

  const uniqueAirlines = [...new Set(flights.map(f => f.airline))];

  const filteredAndSortedFlights = flights
    .filter(flight => {
      if (selectedAirline && flight.airline !== selectedAirline) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "priceAsc") return a.price - b.price;
      if (sortBy === "priceDesc") return b.price - a.price;
      if (sortBy === "timeAsc") return a.departureTime.localeCompare(b.departureTime);
      return 0;
    });

  const runSearch = useCallback((src, dest, date) => {
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
  }, []);

  // Auto-run when arriving from homepage with query params
  useEffect(() => {
    const src = searchParams.get("source");
    const dest = searchParams.get("destination");
    const date = searchParams.get("departureDate");
    if (src || dest) {
      runSearch(src || "", dest || "", date || "");
    }
  }, [runSearch]);

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
              <label className="form-label fw-semibold d-flex align-items-center gap-2" style={{ color: "rgba(255,255,255,0.75)" }}>
                <FaCalendarAlt size={12} style={{ color: "#10b981" }} />
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
                className="btn btn-link btn-sm mt-2 text-warning w-100"
                style={{ textDecoration: "none", fontWeight: "600" }}
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
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <h3 className="fw-bold mb-0 text-slate">Available Flights</h3>
            {hasSearched && !loading && (
              <span
                className="badge px-3 py-2 rounded-pill fs-6"
                style={{ background: "rgba(180, 83, 9, 0.1)", color: "var(--accent-color)", border: "1px solid rgba(180, 83, 9, 0.2)" }}
              >
                {filteredAndSortedFlights.length} of {flights.length} flight{flights.length !== 1 ? "s" : ""} shown
              </span>
            )}
          </div>

          {/* Filters strip */}
          {hasSearched && !loading && flights.length > 0 && (
            <div className="card shadow-sm p-3 mb-4 d-flex flex-row align-items-center justify-content-between flex-wrap gap-3" style={{ borderRadius: "16px", background: "rgba(255, 255, 255, 0.55)" }}>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                {/* Airline Filter */}
                <div className="d-flex align-items-center gap-2">
                  <label className="small fw-bold text-secondary mb-0">Airline:</label>
                  <select
                    className="form-select form-select-sm"
                    value={selectedAirline}
                    onChange={(e) => setSelectedAirline(e.target.value)}
                    style={{ width: "160px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.08)", background: "white", color: "var(--text-dark)" }}
                  >
                    <option value="">All Airlines</option>
                    {uniqueAirlines.map(airline => (
                      <option key={airline} value={airline}>{airline}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sorting */}
              <div className="d-flex align-items-center gap-2">
                <label className="small fw-bold text-secondary mb-0">Sort By:</label>
                <select
                  className="form-select form-select-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ width: "180px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.08)", background: "white", color: "var(--text-dark)" }}
                >
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="timeAsc">Departure Time</option>
                </select>
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status" />
              <p className="text-muted mt-3 small">Searching available flights...</p>
            </div>
          )}

          {!loading && !hasSearched && (
            <div
              className="text-center py-5 card shadow border-0"
              style={{ borderRadius: "20px" }}
            >
              <FaPlane style={{ fontSize: "3rem", color: "var(--accent-color)", transform: "rotate(45deg)", marginBottom: "1rem" }} />
              <h5 className="fw-semibold text-slate">Enter search details to find flights</h5>
              <p className="text-muted small mb-0">We search across multiple top-tier partner airlines</p>
            </div>
          )}

          {!loading && hasSearched && flights.length === 0 && (
            <div
              className="text-center py-5 card shadow border-0"
              style={{ borderRadius: "20px", border: "1px dashed rgba(239, 68, 68, 0.4)" }}
            >
              <FaPlane style={{ fontSize: "3rem", color: "#f87171", transform: "rotate(45deg)", marginBottom: "1rem" }} />
              <h5 className="fw-semibold text-danger">No Flights Found</h5>
              <p className="text-muted small mb-0">Try modifying your search criteria or dates</p>
            </div>
          )}

          {!loading && flights.length > 0 && filteredAndSortedFlights.length === 0 && (
            <div
              className="text-center py-5 card shadow border-0"
              style={{ borderRadius: "20px", border: "1px dashed rgba(180, 83, 9, 0.2)" }}
            >
              <FaPlane style={{ fontSize: "3rem", color: "var(--accent-color)", transform: "rotate(45deg)", marginBottom: "1rem" }} />
              <h5 className="fw-semibold text-slate">No flights match the selected airline</h5>
              <p className="text-muted small mb-0">Try changing your filters or choosing another airline</p>
            </div>
          )}

          {!loading && filteredAndSortedFlights.length > 0 && (
            <div className="d-flex flex-column gap-3">
              {filteredAndSortedFlights.map((flight) => (
                <div
                  key={flight.id}
                  className="card shadow p-4 border-0"
                  style={{ borderRadius: "20px" }}
                >
                  <div className="row align-items-center">
                    {/* Airline & Number */}
                    <div className="col-md-3 mb-3 mb-md-0">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            width: "42px", height: "42px", borderRadius: "10px",
                            background: "rgba(180, 83, 9, 0.08)", color: "var(--accent-color)"
                          }}
                        >
                          <FaPlane style={{ transform: "rotate(45deg)" }} />
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0 text-slate">{flight.airline}</h6>
                          <small className="text-muted">{flight.flightNumber}</small>
                        </div>
                      </div>
                    </div>

                    {/* Route Timeline */}
                    <div className="col-md-5 mb-3 mb-md-0">
                      <div className="d-flex align-items-center justify-content-center gap-3 px-2">
                        <div className="text-center">
                          <h5 className="fw-bold mb-0 text-slate">{flight.source}</h5>
                          <small className="text-muted">{flight.departureTime?.substring(0, 5)}</small>
                        </div>
                        <div className="flex-grow-1 position-relative d-flex align-items-center justify-content-center" style={{ minWidth: "60px" }}>
                          <div style={{ width: "100%", height: "2px", background: "rgba(0, 0, 0, 0.08)" }}></div>
                          <FaPlane
                            className="position-absolute animate-float"
                            style={{
                              color: "var(--accent-color)",
                              transform: "rotate(90deg)",
                              background: "rgba(255, 255, 255, 0.95)",
                              border: "1px solid rgba(0, 0, 0, 0.1)",
                              borderRadius: "50%",
                              padding: "4px",
                              fontSize: "24px"
                            }}
                          />
                        </div>
                        <div className="text-center">
                          <h5 className="fw-bold mb-0 text-slate">{flight.destination}</h5>
                          <small className="text-muted">{flight.arrivalTime?.substring(0, 5)}</small>
                        </div>
                      </div>
                    </div>

                    {/* Date, Price, Book */}
                    <div className="col-md-4 text-md-end d-flex flex-row flex-md-column justify-content-between align-items-center align-items-md-end gap-2">
                      <span
                        className="badge px-3 py-2 fw-semibold d-inline-flex align-items-center gap-1"
                        style={{ background: "rgba(0, 0, 0, 0.03)", border: "1px solid rgba(0, 0, 0, 0.06)", color: "rgba(30, 41, 59, 0.7)" }}
                      >
                        <FaCalendarAlt size={11} style={{ color: "#10b981" }} />
                        <span>{flight.departureDate}</span>
                      </span>
                      <div className="d-flex align-items-center gap-3">
                        <div className="text-md-end">
                          <span className="text-muted small d-block">Per adult</span>
                          <span className="fs-4 fw-bold" style={{ color: "var(--accent-color)" }}>
                            ₹{Number(flight.price).toLocaleString("en-IN")}
                          </span>
                        </div>
                        <Link
                          className="btn btn-success px-4 py-2 fw-semibold d-flex align-items-center gap-1"
                          to={`/booking?flightId=${flight.id}`}
                          style={{ borderRadius: "12px" }}
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