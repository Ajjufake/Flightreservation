import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { FaPlaneDeparture, FaPlaneArrival, FaSearch, FaTimesCircle, FaExchangeAlt, FaCalendarAlt } from "react-icons/fa";
import { CITIES } from "../constants/cities";

/* ─── Portal Dropdown ─────────────────────────────────────────────────────── */
// Renders outside the card DOM tree to avoid any overflow/z-index clipping.
function CityDropdown({ anchorRef, open, cities, onSelect }) {
  const [rect, setRect] = useState(null);

  useEffect(() => {
    if (!open || !anchorRef.current) return;
    const updateRect = () => {
      const r = anchorRef.current.getBoundingClientRect();
      setRect({ top: r.bottom + window.scrollY + 4, left: r.left + window.scrollX, width: r.width });
    };
    updateRect();
    window.addEventListener("scroll", updateRect, true);
    window.addEventListener("resize", updateRect);
    return () => {
      window.removeEventListener("scroll", updateRect, true);
      window.removeEventListener("resize", updateRect);
    };
  }, [open, anchorRef]);

  if (!open || !rect || cities.length === 0) return null;

  return createPortal(
    <div
      style={{
        position: "absolute",
        top: rect.top,
        left: rect.left,
        width: rect.width,
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
        zIndex: 99999,
        maxHeight: "230px",
        overflowY: "auto",
      }}
    >
      {cities.map((city) => (
        <div
          key={city}
          style={{
            padding: "10px 16px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
            color: "#1e3e62",
            transition: "background 0.15s",
          }}
          onMouseDown={(e) => { e.preventDefault(); onSelect(city); }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f6ff")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          ✈ {city}
        </div>
      ))}
    </div>,
    document.body
  );
}

/* ─── City Input ──────────────────────────────────────────────────────────── */
function CityInput({ label, icon: Icon, value, onChange, placeholder, excludeCity, accent }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const filtered = CITIES.filter(
    (c) => c !== excludeCity && c.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div ref={wrapRef} style={{ flex: 1, minWidth: 0, position: "relative" }}>
      <label
        style={{
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "0.8px",
          color: "#94a3b8",
          textTransform: "uppercase",
          marginBottom: "8px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <Icon size={11} style={{ color: accent }} />
        {label}
      </label>

      <div style={{ position: "relative" }}>
        <input
          className="city-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 180)}
          autoComplete="off"
          style={{
            width: "100%",
            height: "54px",
            border: "none",
            borderBottom: `2px solid ${open ? accent : "#e2e8f0"}`,
            borderRadius: 0,
            outline: "none",
            background: "transparent",
            fontSize: "18px",
            fontWeight: 700,
            color: "#0f172a",
            padding: "0 36px 0 0",
            transition: "border-color 0.2s ease",
            fontFamily: "inherit",
          }}
        />
        {value && (
          <button
            tabIndex={-1}
            onMouseDown={(e) => { e.preventDefault(); onChange(""); }}
            style={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94a3b8",
              padding: "4px",
            }}
          >
            <FaTimesCircle size={14} />
          </button>
        )}
      </div>

      <CityDropdown
        anchorRef={wrapRef}
        open={open && filtered.length > 0}
        cities={filtered}
        onSelect={(city) => { onChange(city); setOpen(false); }}
      />
    </div>
  );
}

/* ─── Main SearchBar ──────────────────────────────────────────────────────── */
function SearchBar() {
  const navigate = useNavigate();
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const swap = () => { setSource(destination); setDestination(source); };

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
    const params = new URLSearchParams({ source, destination });
    if (date) params.set("departureDate", date);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(20px)",
        borderRadius: "24px",
        padding: "36px 40px 32px",
        boxShadow: "0 20px 60px rgba(11,25,44,0.14)",
        border: "1px solid rgba(255,255,255,0.6)",
        marginTop: "2rem",
      }}
    >
      {/* Title */}
      <div style={{ marginBottom: "28px", textAlign: "center" }}>
        <p
          style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "2px",
            color: "var(--accent-color)",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          ✈ Book Your Next Adventure
        </p>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "10px",
            padding: "10px 16px",
            fontSize: "13px",
            color: "#dc2626",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {/* Search fields row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "0",
          flexWrap: "wrap",
        }}
      >
        {/* Source */}
        <CityInput
          label="From"
          icon={FaPlaneDeparture}
          value={source}
          onChange={(v) => { setSource(v); setError(""); }}
          placeholder="Departure city"
          excludeCity={destination}
          accent="#1e3e62"
        />

        {/* Swap divider */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 16px", paddingBottom: "10px" }}>
          <button
            onClick={swap}
            title="Swap cities"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "2px solid #e2e8f0",
              background: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--secondary-color)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--secondary-color)";
              e.currentTarget.style.color = "white";
              e.currentTarget.style.borderColor = "var(--secondary-color)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.color = "var(--secondary-color)";
              e.currentTarget.style.borderColor = "#e2e8f0";
            }}
          >
            <FaExchangeAlt size={13} />
          </button>
        </div>

        {/* Destination */}
        <CityInput
          label="To"
          icon={FaPlaneArrival}
          value={destination}
          onChange={(v) => { setDestination(v); setError(""); }}
          placeholder="Destination city"
          excludeCity={source}
          accent="#e2b659"
        />

        {/* Vertical divider */}
        <div style={{ width: "1px", background: "#e2e8f0", height: "40px", margin: "0 24px 12px" }} />

        {/* Date */}
        <div style={{ display: "flex", flexDirection: "column", minWidth: "160px" }}>
          <label
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.8px",
              color: "#94a3b8",
              textTransform: "uppercase",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <FaCalendarAlt size={11} style={{ color: "#10b981" }} />
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            style={{
              height: "54px",
              border: "none",
              borderBottom: "2px solid #e2e8f0",
              borderRadius: 0,
              outline: "none",
              background: "transparent",
              fontSize: "15px",
              fontWeight: 600,
              color: "#0f172a",
              padding: "0",
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          />
        </div>

        {/* Search button */}
        <div style={{ paddingLeft: "24px", paddingBottom: "2px" }}>
          <button
            onClick={search}
            style={{
              height: "54px",
              padding: "0 36px",
              background: "linear-gradient(135deg, #1e3e62 0%, #0b192c 100%)",
              color: "white",
              border: "none",
              borderRadius: "14px",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "0 8px 24px rgba(11,25,44,0.25)",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(11,25,44,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(11,25,44,0.25)";
            }}
          >
            <FaSearch size={14} />
            Search Flights
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;