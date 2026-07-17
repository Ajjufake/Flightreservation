import { Link } from "react-router-dom";
import heroImage from "../assets/hero/plane.jpg";
import "../styles/hero.css";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-left">

        <h1>Seamless Sky Booking</h1>

        <p>
          Discover a smarter way to fly with reliable airlines,
          best prices and secure online booking.
        </p>

        <div className="hero-buttons">

          <Link to="/search" className="btn btn-primary">
            Search Flights
          </Link>

          <Link to="/login" className="btn btn-outline-primary">
            Login
          </Link>

        </div>

      </div>

      <div className="hero-right">

        <img
          src={heroImage}
          alt="Plane"
        />

      </div>

    </section>
  );
}

export default Hero;