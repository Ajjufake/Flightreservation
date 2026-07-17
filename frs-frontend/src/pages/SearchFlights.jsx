import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { FaPlane, FaCalendarAlt, FaSearch, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";

function SearchFlights() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState({
    source: searchParams.get("source") || "",
    destination: searchParams.get("destination") || "",
    departureDate: searchParams.get("departureDate") || ""
  });

  const [flights, setFlights] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const [sourcesList, setSourcesList] = useState([]);
  const [destinationsList, setDestinationsList] = useState([]);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  useEffect(() => {
    // Fetch unique cities from the flight list for autocomplete
    axios.get("http://localhost:8080/api/flights")
      .then(res => {
        const flights = res.data;
        const uniqueSources = [...new Set(flights.map(f => f.source))];
        const uniqueDests = [...new Set(flights.map(f => f.destination))];
        setSourcesList(uniqueSources);
        setDestinationsList(uniqueDests);
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setSearch({
      ...search,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = () => {
    const params = {};
    if (search.source) params.source = search.source;
    if (search.destination) params.destination = search.destination;
    
    let url = "http://localhost:8080/api/flights/search";
    if (search.departureDate) {
      params.departureDate = search.departureDate;
    } else {
      url = "http://localhost:8080/api/flights/route";
    }

    axios.get(url, { params })
      .then((response) => {
        setFlights(response.data);
        setHasSearched(true);
        // Sync URL search params
        setSearchParams(params);
      })
      .catch((error) => {
        console.log(error);
        setFlights([]);
        setHasSearched(true);
      });
  };

  // Run search on mount if query parameters exist
  useEffect(() => {
    const src = searchParams.get("source");
    const dest = searchParams.get("destination");
    const date = searchParams.get("departureDate");
    
    if (src && dest) {
      const params = { source: src, destination: dest };
      let url = "http://localhost:8080/api/flights/search";
      if (date) {
        params.departureDate = date;
      } else {
        url = "http://localhost:8080/api/flights/route";
      }

      axios.get(url, { params })
        .then((response) => {
          setFlights(response.data);
          setHasSearched(true);
        })
        .catch((error) => {
          console.log(error);
          setFlights([]);
          setHasSearched(true);
        });
    }
  }, [searchParams]);

  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        {/* Left Column - Search Inputs */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm p-4" style={{ borderRadius: "16px", border: "1px solid var(--border-color)", overflow: "visible" }}>
            <h4 className="fw-bold mb-4 text-primary d-flex align-items-center gap-2">
              <FaSearch style={{ fontSize: "1.2rem" }} />
              <span>Search Parameters</span>
            </h4>
            
            {/* Origin City */}
            <div className="mb-3 position-relative">
              <label className="form-label fw-semibold text-secondary d-flex align-items-center gap-2">
                <FaMapMarkerAlt />
                <span>Origin</span>
              </label>
              <input
                className="form-control"
                placeholder="Departure city"
                name="source"
                value={search.source}
                onChange={(e) => {
                  setSearch(prev => ({ ...prev, source: e.target.value }));
                  setShowSourceDropdown(true);
                }}
                onFocus={() => setShowSourceDropdown(true)}
                onBlur={() => setTimeout(() => setShowSourceDropdown(false), 200)}
              />
              {showSourceDropdown && (
                <div className="position-absolute w-100 shadow rounded-3 bg-white mt-1 border" style={{ zIndex: 1000, left: 0, top: "100%", maxHeight: "150px", overflowY: "auto" }}>
                  {sourcesList
                    .filter(city => city.toLowerCase().includes(search.source.toLowerCase()))
                    .map(city => (
                      <div
                        key={city}
                        className="px-3 py-2 cursor-pointer dropdown-item-city"
                        style={{ cursor: "pointer" }}
                        onMouseDown={() => {
                          setSearch(prev => ({ ...prev, source: city }));
                          setShowSourceDropdown(false);
                        }}
                      >
                        {city}
                      </div>
                    ))
                  }
                  {sourcesList.filter(city => city.toLowerCase().includes(search.source.toLowerCase())).length === 0 && (
                    <div className="px-3 py-2 text-muted small">No matching cities</div>
                  )}
                </div>
              )}
            </div>

            {/* Destination City */}
            <div className="mb-3 position-relative">
              <label className="form-label fw-semibold text-secondary d-flex align-items-center gap-2">
                <FaMapMarkerAlt />
                <span>Destination</span>
              </label>
              <input
                className="form-control"
                placeholder="Arrival city"
                name="destination"
                value={search.destination}
                onChange={(e) => {
                  setSearch(prev => ({ ...prev, destination: e.target.value }));
                  setShowDestDropdown(true);
                }}
                onFocus={() => setShowDestDropdown(true)}
                onBlur={() => setTimeout(() => setShowDestDropdown(false), 200)}
              />
              {showDestDropdown && (
                <div className="position-absolute w-100 shadow rounded-3 bg-white mt-1 border" style={{ zIndex: 1000, left: 0, top: "100%", maxHeight: "150px", overflowY: "auto" }}>
                  {destinationsList
                    .filter(city => city.toLowerCase().includes(search.destination.toLowerCase()))
                    .map(city => (
                      <div
                        key={city}
                        className="px-3 py-2 cursor-pointer dropdown-item-city"
                        style={{ cursor: "pointer" }}
                        onMouseDown={() => {
                          setSearch(prev => ({ ...prev, destination: city }));
                          setShowDestDropdown(false);
                        }}
                      >
                        {city}
                      </div>
                    ))
                  }
                  {destinationsList.filter(city => city.toLowerCase().includes(search.destination.toLowerCase())).length === 0 && (
                    <div className="px-3 py-2 text-muted small">No matching cities</div>
                  )}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-secondary d-flex align-items-center gap-2">
                <FaCalendarAlt />
                <span>Departure Date</span>
              </label>
              <input
                type="date"
                className="form-control"
                name="departureDate"
                value={search.departureDate}
                onChange={handleChange}
              />
            </div>

            <button
              className="btn btn-primary w-100 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2"
              onClick={handleSearch}
            >
              <FaSearch />
              <span>Search Flights</span>
            </button>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold mb-0">Available Flights</h3>
            {hasSearched && (
              <span className="badge bg-secondary px-3 py-2 rounded-pill fs-6" style={{ background: "var(--secondary-color) !important" }}>
                {flights.length} flights found
              </span>
            )}
          </div>

          {!hasSearched && (
            <div className="text-center py-5 card shadow-sm" style={{ border: "1px dashed var(--border-color)", background: "#ffffff" }}>
              <div className="text-muted mb-3">
                <FaPlane style={{ fontSize: "3rem", color: "var(--border-color)", transform: "rotate(45deg)" }} />
              </div>
              <h5 className="fw-semibold text-secondary">Enter search details to find flights</h5>
              <p className="text-muted small">We search across multiple top-tier partner airlines</p>
            </div>
          )}

          {hasSearched && flights.length === 0 && (
            <div className="text-center py-5 card shadow-sm" style={{ border: "1px dashed #f5c2c2", background: "#fffefe" }}>
              <div className="text-danger mb-3">
                <FaPlane style={{ fontSize: "3rem", color: "#f8d7da", transform: "rotate(45deg)" }} />
              </div>
              <h5 className="fw-semibold text-danger">No Flights Found</h5>
              <p className="text-muted small">Try modifying your search criteria or dates</p>
            </div>
          )}

          {flights.length > 0 && (
            <div className="d-flex flex-column gap-3">
              {flights.map((flight) => (
                <div 
                  key={flight.id} 
                  className="card shadow-sm p-4 border-0" 
                  style={{ 
                    borderRadius: "16px", 
                    background: "#ffffff", 
                    borderLeft: "5px solid var(--accent-color) !important",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.02)"
                  }}
                >
                  <div className="row align-items-center">
                    {/* Airline & Number */}
                    <div className="col-md-3 mb-3 mb-md-0">
                      <div className="d-flex align-items-center gap-2">
                        <div 
                          className="d-flex align-items-center justify-content-center" 
                          style={{ 
                            width: "42px", 
                            height: "42px", 
                            borderRadius: "10px", 
                            background: "rgba(30, 62, 98, 0.08)",
                            color: "var(--secondary-color)"
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

                    {/* Timeline Path */}
                    <div className="col-md-5 mb-3 mb-md-0">
                      <div className="d-flex align-items-center justify-content-center gap-3 px-2">
                        <div className="text-center">
                          <h5 className="fw-bold mb-0 text-dark" style={{ letterSpacing: "1px" }}>{flight.source}</h5>
                          <small className="text-muted">Origin</small>
                        </div>
                        
                        <div className="flex-grow-1 position-relative d-flex align-items-center justify-content-center" style={{ minWidth: "80px" }}>
                          <div style={{ width: "100%", height: "2px", background: "var(--border-color)" }}></div>
                          <FaPlane 
                            className="position-absolute" 
                            style={{ 
                              color: "var(--secondary-color)", 
                              transform: "rotate(90deg)",
                              background: "#ffffff",
                              padding: "2px",
                              fontSize: "18px"
                            }} 
                          />
                        </div>

                        <div className="text-center">
                          <h5 className="fw-bold mb-0 text-dark" style={{ letterSpacing: "1px" }}>{flight.destination}</h5>
                          <small className="text-muted">Destination</small>
                        </div>
                      </div>
                    </div>

                    {/* Date & Price */}
                    <div className="col-md-4 text-md-end d-flex flex-row flex-md-column justify-content-between align-items-center align-items-md-end gap-2">
                      <div>
                        <span className="badge bg-light text-secondary border px-2.5 py-1.5 fw-semibold d-inline-flex align-items-center gap-1.5">
                          <FaCalendarAlt size={12} />
                          <span>{flight.departureDate}</span>
                        </span>
                      </div>
                      
                      <div className="mt-md-2 d-flex align-items-center gap-3">
                        <div className="text-md-end">
                          <span className="text-muted small d-block">Price per adult</span>
                          <span className="fs-4 fw-extrabold text-primary" style={{ letterSpacing: "-0.5px" }}>
                            ₹{flight.price.toLocaleString("en-IN")}
                          </span>
                        </div>
                        
                        <Link
                          className="btn btn-success px-4 py-2"
                          to={`/booking?flightId=${flight.id}`}
                        >
                          Book <FaArrowRight className="ms-1" size={12} />
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