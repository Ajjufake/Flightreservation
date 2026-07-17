import { useNavigate } from "react-router-dom";
import airIndiaLogo from "../assets/airlines/air india.jpg";
import indigoLogo from "../assets/airlines/indigo.jpg";
import "../styles/flightcard.css";

function FlightCard({ flight }) {
  const navigate = useNavigate();

  const airlineLogos = {
    "Air India": airIndiaLogo,
    IndiGo: indigoLogo
  };
  const logoSrc = airlineLogos[flight.airline] || null;

  return (
    <div className="col-lg-4 col-md-6 mb-4">

      <div className="card shadow-lg border-0 rounded-4 h-100">

        <div className="card-body">

          <div className="d-flex justify-content-between align-items-center flight-card-header">

            <div>
              <h3 className="text-primary mb-1">
                ✈ {flight.flightNumber}
              </h3>
              <div className="text-muted small">
                {flight.airline}
              </div>
            </div>

            {logoSrc && (
              <div className="airline-logo-wrapper">
                <img
                  src={logoSrc}
                  alt={`${flight.airline} logo`}
                  className="airline-logo"
                />
              </div>
            )}

          </div>

          <hr />

          <div className="route-block mb-3 p-3 rounded-3 border">
            <div className="route-city">{flight.source}</div>
            <div className="route-arrow">→</div>
            <div className="route-city">{flight.destination}</div>
          </div>

          <p>
            <b>Date :</b> {flight.departureDate}
          </p>

          <p>
            <b>Departure :</b> {flight.departureTime}
          </p>

          <p>
            <b>Arrival :</b> {flight.arrivalTime}
          </p>

          <h4 className="text-success">

            ₹ {flight.price}

          </h4>

          <p>

            Seats Left :
            <span className="badge bg-warning text-dark ms-2">

              {flight.availableSeats}

            </span>

          </p>

          <button

            className="btn btn-primary w-100"

            onClick={() =>
              navigate(`/booking?flightId=${flight.id}`)
            }

          >

            Book Now

          </button>

        </div>

      </div>

    </div>
  );
}

export default FlightCard;