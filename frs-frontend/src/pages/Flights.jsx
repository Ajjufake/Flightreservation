import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import FlightCard from "../components/FlightCard";
import { FaPlane } from "react-icons/fa";

function Flights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const source = searchParams.get("source");
  const destination = searchParams.get("destination");

  useEffect(() => {
    setLoading(true);
    const url =
      source && destination
        ? `http://localhost:8080/api/flights/route?source=${source}&destination=${destination}`
        : "http://localhost:8080/api/flights";

    axios
      .get(url)
      .then((response) => {
        setFlights(response.data);
        setLoading(false);
      })
      .catch(() => {
        setFlights([]);
        setLoading(false);
      });
  }, [source, destination]);

  return (
    <div className="container mt-5 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">
            {source && destination
              ? `${source} → ${destination}`
              : "All Available Flights"}
          </h2>
          {!loading && (
            <p className="text-muted small mt-1 mb-0">
              {flights.length} flight{flights.length !== 1 ? "s" : ""} found
            </p>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-3">Searching available flights...</p>
        </div>
      ) : flights.length === 0 ? (
        <div
          className="text-center py-5 card shadow-sm border-0"
          style={{ borderRadius: "16px", background: "#fff" }}
        >
          <FaPlane
            style={{
              fontSize: "3.5rem",
              color: "#d1d5db",
              transform: "rotate(45deg)",
              marginBottom: "1rem"
            }}
          />
          <h5 className="fw-semibold text-secondary mb-2">No Flights Found</h5>
          <p className="text-muted small mb-0">
            {source && destination
              ? `No flights from ${source} to ${destination}. Try different cities.`
              : "No flights are currently in the system."}
          </p>
        </div>
      ) : (
        <div className="row">
          {flights.map((flight) => (
            <FlightCard key={flight.id} flight={flight} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Flights;