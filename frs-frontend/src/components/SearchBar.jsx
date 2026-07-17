import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlaneDeparture, FaPlaneArrival, FaSearch } from "react-icons/fa";
import axios from "axios";

function SearchBar() {
  const navigate = useNavigate();
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const [sourcesList, setSourcesList] = useState([]);
  const [destinationsList, setDestinationsList] = useState([]);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  useEffect(() => {
    // Fetch unique cities from the flight list
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
        {/* Origin Input */}
        <div className="col-md-5 position-relative">
          <label className="form-label fw-bold text-secondary d-flex align-items-center gap-2 mb-2">
            <FaPlaneDeparture style={{ color: "var(--secondary-color)" }} />
            <span>Departure City</span>
          </label>
          <div className="input-group">
            <input
              className="form-control shadow-sm border-0 bg-light"
              placeholder="e.g. New Delhi"
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
                setShowSourceDropdown(true);
              }}
              onFocus={() => setShowSourceDropdown(true)}
              onBlur={() => setTimeout(() => setShowSourceDropdown(false), 200)}
              style={{ paddingLeft: "15px", height: "48px" }}
            />
          </div>
          {showSourceDropdown && (
            <div className="position-absolute w-100 shadow rounded-3 bg-white mt-1 border" style={{ zIndex: 1000, left: 0, top: "100%", maxHeight: "200px", overflowY: "auto" }}>
              {sourcesList
                .filter(city => city.toLowerCase().includes(source.toLowerCase()))
                .map(city => (
                  <div
                    key={city}
                    className="px-3 py-2 cursor-pointer dropdown-item-city"
                    style={{ cursor: "pointer" }}
                    onMouseDown={() => {
                      setSource(city);
                      setShowSourceDropdown(false);
                    }}
                  >
                    {city}
                  </div>
                ))
              }
              {sourcesList.filter(city => city.toLowerCase().includes(source.toLowerCase())).length === 0 && (
                <div className="px-3 py-2 text-muted small">No matching cities</div>
              )}
            </div>
          )}
        </div>

        {/* Destination Input */}
        <div className="col-md-5 position-relative">
          <label className="form-label fw-bold text-secondary d-flex align-items-center gap-2 mb-2">
            <FaPlaneArrival style={{ color: "var(--secondary-color)" }} />
            <span>Destination City</span>
          </label>
          <div className="input-group">
            <input
              className="form-control shadow-sm border-0 bg-light"
              placeholder="e.g. Mumbai"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setShowDestDropdown(true);
              }}
              onFocus={() => setShowDestDropdown(true)}
              onBlur={() => setTimeout(() => setShowDestDropdown(false), 200)}
              style={{ paddingLeft: "15px", height: "48px" }}
            />
          </div>
          {showDestDropdown && (
            <div className="position-absolute w-100 shadow rounded-3 bg-white mt-1 border" style={{ zIndex: 1000, left: 0, top: "100%", maxHeight: "200px", overflowY: "auto" }}>
              {destinationsList
                .filter(city => city.toLowerCase().includes(destination.toLowerCase()))
                .map(city => (
                  <div
                    key={city}
                    className="px-3 py-2 cursor-pointer dropdown-item-city"
                    style={{ cursor: "pointer" }}
                    onMouseDown={() => {
                      setDestination(city);
                      setShowDestDropdown(false);
                    }}
                  >
                    {city}
                  </div>
                ))
              }
              {destinationsList.filter(city => city.toLowerCase().includes(destination.toLowerCase())).length === 0 && (
                <div className="px-3 py-2 text-muted small">No matching cities</div>
              )}
            </div>
          )}
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