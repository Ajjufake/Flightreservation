import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import Footer from "../components/Footer";
import dubaiImage from "../assets/cities/dubai.jpg";
import tokyoImage from "../assets/cities/tokyo.jpg";
import newYorkImage from "../assets/cities/newyork.jpg";
import {
  FaPlane, FaShieldAlt, FaHeadset, FaTag, FaArrowRight,
  FaStar, FaMapMarkerAlt, FaUsers, FaTicketAlt,
} from "react-icons/fa";

const FEATURES = [
  {
    icon: <FaTag size={22} />,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    title: "Best Price Guarantee",
    desc: "We compare hundreds of airlines to get you the most competitive fares available.",
  },
  {
    icon: <FaShieldAlt size={22} />,
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    title: "Secure Booking",
    desc: "Your personal data and payments are protected with bank-level encryption.",
  },
  {
    icon: <FaHeadset size={22} />,
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.08)",
    title: "24/7 Support",
    desc: "Round-the-clock customer support to help you with any travel needs.",
  },
  {
    icon: <FaPlane size={22} />,
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    title: "500+ Airlines",
    desc: "Access to a global network of airlines covering 1,000+ destinations worldwide.",
  },
];

const DESTINATIONS = [
  { image: dubaiImage, city: "Dubai", country: "UAE", price: "17,000", rating: "4.9", tag: "Popular" },
  { image: tokyoImage, city: "Tokyo", country: "Japan", price: "30,000", rating: "4.8", tag: "Trending" },
  { image: newYorkImage, city: "New York", country: "USA", price: "54,000", rating: "4.7", tag: "Must Visit" },
];

const STATS = [
  { icon: <FaPlane size={20} />, value: "500+", label: "Airlines" },
  { icon: <FaMapMarkerAlt size={20} />, value: "1,200+", label: "Destinations" },
  { icon: <FaUsers size={20} />, value: "2M+", label: "Happy Travelers" },
  { icon: <FaTicketAlt size={20} />, value: "10M+", label: "Tickets Booked" },
];

function DestinationCard({ image, city, country, price, rating, tag }) {
  const navigate = useNavigate();
  return (
    <div
      className="col-lg-4 col-md-6"
      onClick={() => navigate(`/search?destination=${encodeURIComponent(city)}`)}
      style={{ cursor: "pointer" }}
    >
      <div
        style={{
          borderRadius: "20px",
          overflow: "hidden",
          position: "relative",
          height: "320px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.boxShadow = "0 20px 50px rgba(0,0,0,0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)";
        }}
      >
        <img
          src={image}
          alt={city}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)",
          }}
        />
        {/* Tag */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            background: "var(--accent-color)",
            color: "#0b192c",
            borderRadius: "20px",
            padding: "4px 12px",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.5px",
          }}
        >
          {tag}
        </div>
        {/* Rating */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
            color: "white",
            borderRadius: "20px",
            padding: "4px 10px",
            fontSize: "12px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "4px",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <FaStar size={10} style={{ color: "#fbbf24" }} />
          {rating}
        </div>
        {/* Info */}
        <div style={{ position: "absolute", bottom: "20px", left: "20px", right: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", margin: 0 }}>{country}</p>
              <h3 style={{ color: "white", fontWeight: 800, fontSize: "24px", margin: "2px 0 0" }}>{city}</h3>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", margin: 0 }}>From</p>
              <p style={{ color: "var(--accent-color)", fontWeight: 800, fontSize: "18px", margin: 0 }}>₹{price}</p>
            </div>
          </div>
          <div
            style={{
              marginTop: "12px",
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "10px",
              padding: "8px 14px",
              color: "white",
              fontSize: "13px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            Explore Flights <FaArrowRight size={11} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Home() {
  const [flightCount, setFlightCount] = useState(0);

  useEffect(() => {
    // Animate counter
    const target = 500;
    let count = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      count = Math.min(count + step, target);
      setFlightCount(count);
      if (count >= target) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* ═══════════════════════════════════════════════
          HERO SECTION — Full-bleed gradient
      ═══════════════════════════════════════════════ */}
      <section
        style={{
          background: "linear-gradient(135deg, #0b192c 0%, #0f2d4a 40%, #1a3e5c 70%, #0d2137 100%)",
          minHeight: "92vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          padding: "60px 0 80px",
        }}
      >
        {/* Animated background orbs */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(226,182,89,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-200px",
            left: "-100px",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(30,62,98,0.4) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "80px",
              flexWrap: "wrap",
            }}
          >
            {/* LEFT — Copy */}
            <div style={{ flex: "1 1 480px" }}>
              {/* Pill badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(226,182,89,0.12)",
                  border: "1px solid rgba(226,182,89,0.3)",
                  borderRadius: "100px",
                  padding: "6px 16px",
                  marginBottom: "28px",
                }}
              >
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#e2b659", display: "inline-block" }} />
                <span style={{ color: "#e2b659", fontSize: "13px", fontWeight: 600, letterSpacing: "0.5px" }}>
                  #1 Flight Booking Platform in India
                </span>
              </div>

              <h1
                style={{
                  fontSize: "clamp(40px, 5vw, 68px)",
                  fontWeight: 900,
                  color: "white",
                  lineHeight: 1.08,
                  letterSpacing: "-2px",
                  marginBottom: "24px",
                }}
              >
                Fly Anywhere,{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #e2b659 0%, #f0d080 50%, #e2b659 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Anytime.
                </span>
                <br />
                Dream Bigger.
              </h1>

              <p
                style={{
                  fontSize: "18px",
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.7,
                  maxWidth: "460px",
                  marginBottom: "40px",
                }}
              >
                Discover incredible flights at unbeatable prices. Seamless booking,
                real-time availability, and 24/7 support for your perfect journey.
              </p>

              {/* CTA Buttons */}
              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                <Link
                  to="/search"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    background: "linear-gradient(135deg, #e2b659 0%, #c9942a 100%)",
                    color: "#0b192c",
                    padding: "14px 32px",
                    borderRadius: "14px",
                    fontWeight: 800,
                    fontSize: "15px",
                    textDecoration: "none",
                    boxShadow: "0 8px 24px rgba(226,182,89,0.35)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(226,182,89,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(226,182,89,0.35)";
                  }}
                >
                  <FaPlane size={15} /> Search Flights
                </Link>
                <Link
                  to="/flights"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(255,255,255,0.08)",
                    color: "white",
                    padding: "14px 28px",
                    borderRadius: "14px",
                    fontWeight: 700,
                    fontSize: "15px",
                    textDecoration: "none",
                    border: "1px solid rgba(255,255,255,0.15)",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                >
                  View All Flights <FaArrowRight size={12} />
                </Link>
              </div>

              {/* Trust bar */}
              <div style={{ display: "flex", gap: "28px", marginTop: "40px", flexWrap: "wrap" }}>
                {[
                  { val: `${flightCount}+`, label: "Airlines" },
                  { val: "1,200+", label: "Destinations" },
                  { val: "2M+", label: "Happy Travelers" },
                ].map((s, i) => (
                  <div key={i}>
                    <p style={{ color: "white", fontWeight: 800, fontSize: "22px", margin: 0 }}>{s.val}</p>
                    <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px", margin: 0 }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Search card */}
            <div style={{ flex: "1 1 400px", maxWidth: "560px" }}>
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FEATURES STRIP
      ═══════════════════════════════════════════════ */}
      <section style={{ padding: "80px 0", background: "transparent" }}>
        <div className="container animate-fade-in-up">
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{ color: "var(--accent-color)", fontWeight: 700, fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 12px" }}>
              Why Choose Aeroglide
            </p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "var(--primary-color)", margin: 0 }}>
              Trusted by millions of travelers
            </h2>
          </div>

          <div className="row g-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="col-lg-3 col-md-6">
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(0, 0, 0, 0.06)",
                    borderRadius: "20px",
                    padding: "32px 28px",
                    height: "100%",
                    transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 15px 35px rgba(180, 83, 9, 0.15)";
                    e.currentTarget.style.borderColor = f.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.06)";
                  }}
                >
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "14px",
                      background: f.bg,
                      color: f.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "20px",
                    }}
                  >
                    {f.icon}
                  </div>
                  <h4 style={{ fontWeight: 700, fontSize: "17px", marginBottom: "10px", color: "var(--primary-color)" }}>
                    {f.title}
                  </h4>
                  <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          DESTINATIONS
      ═══════════════════════════════════════════════ */}
      <section style={{ padding: "80px 0", background: "transparent" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <p style={{ color: "var(--accent-color)", fontWeight: 700, fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 10px" }}>
                Explore the World
              </p>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, color: "var(--primary-color)", margin: 0 }}>
                Top Destinations
              </h2>
            </div>
            <Link
              to="/flights"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--accent-color)",
                fontWeight: 700,
                fontSize: "14px",
                textDecoration: "none",
                border: "2px solid var(--accent-color)",
                borderRadius: "12px",
                padding: "10px 22px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--accent-color)";
                e.currentTarget.style.color = "var(--primary-color)";
                e.currentTarget.style.boxShadow = "var(--glow-gold)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--accent-color)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              View All <FaArrowRight size={12} />
            </Link>
          </div>

          <div className="row g-4">
            {DESTINATIONS.map((d, i) => (
              <DestinationCard key={i} {...d} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          STATS BAND
      ═══════════════════════════════════════════════ */}
      <section
        style={{
          background: "rgba(16, 30, 51, 0.4)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "64px 0",
          margin: "40px 0",
        }}
      >
        <div className="container">
          <div className="row g-4 text-center">
            {STATS.map((s, i) => (
              <div key={i} className="col-lg-3 col-6">
                <div style={{ color: "var(--accent-color)", marginBottom: "12px" }}>{s.icon}</div>
                <h2 style={{ color: "white", fontWeight: 900, fontSize: "clamp(28px, 4vw, 42px)", margin: "0 0 6px" }}>
                  {s.value}
                </h2>
                <p style={{ color: "rgba(255,255,255,0.5)", margin: 0, fontSize: "14px" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CTA BANNER
      ═══════════════════════════════════════════════ */}
      <section style={{ padding: "80px 0", background: "transparent" }}>
        <div className="container">
          <div
            style={{
              background: "linear-gradient(135deg, rgba(226, 182, 89, 0.95) 0%, rgba(201, 148, 42, 0.95) 100%)",
              borderRadius: "28px",
              padding: "60px 48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "32px",
              boxShadow: "0 20px 60px rgba(226,182,89,0.15), 0 0 40px rgba(30, 62, 98, 0.2)",
              position: "relative",
              overflow: "hidden",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Background pattern */}
            <div
              style={{
                position: "absolute",
                right: "-60px",
                top: "-60px",
                width: "300px",
                height: "300px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.08)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: "120px",
                bottom: "-80px",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
                pointerEvents: "none",
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <h2 style={{ fontWeight: 900, fontSize: "clamp(24px, 3.5vw, 36px)", color: "#0b192c", margin: "0 0 10px" }}>
                Ready for your next adventure?
              </h2>
              <p style={{ color: "rgba(11,25,44,0.7)", fontSize: "16px", margin: 0 }}>
                Join 2 million+ travelers who trust Aeroglide for their journeys.
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
              <Link
                to="/register"
                style={{
                  background: "#0b192c",
                  color: "white",
                  padding: "14px 32px",
                  borderRadius: "12px",
                  fontWeight: 800,
                  fontSize: "15px",
                  textDecoration: "none",
                  boxShadow: "0 8px 20px rgba(11,25,44,0.25)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                Create Free Account
              </Link>
              <Link
                to="/search"
                style={{
                  background: "rgba(255,255,255,0.25)",
                  color: "#0b192c",
                  padding: "14px 28px",
                  borderRadius: "12px",
                  fontWeight: 700,
                  fontSize: "15px",
                  textDecoration: "none",
                  border: "2px solid rgba(11,25,44,0.15)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.4)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.25)"; }}
              >
                Search Flights
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;