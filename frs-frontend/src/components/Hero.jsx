import { Link } from "react-router-dom";
import heroImage from "../assets/hero/plane.jpg";
import { FaSearch, FaTachometerAlt } from "react-icons/fa";
import "../styles/hero.css";

function Hero() {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <section className="hero">
      <div className="hero-left">
        <h1>Seamless <span>Sky Booking</span></h1>
        <p>
          Discover a smarter way to fly with reliable airlines,
          best prices and secure online booking.
        </p>

        <div className="hero-buttons">
          <Link to="/search" className="btn btn-primary d-inline-flex align-items-center gap-2">
            <FaSearch size={14} />
            Search Flights
          </Link>

          {isLoggedIn ? (
            <Link to="/dashboard" className="btn btn-outline-primary d-inline-flex align-items-center gap-2">
              <FaTachometerAlt size={14} />
              My Dashboard
            </Link>
          ) : (
            <Link to="/login" className="btn btn-outline-primary">
              Login
            </Link>
          )}
        </div>
      </div>

      <div className="hero-right">
        <img src={heroImage} alt="Plane" />
      </div>
    </section>
  );
}

export default Hero;