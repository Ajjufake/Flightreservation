import "../styles/SeatSelector.css";

/**
 * SeatSelector supports multi-passenger mode.
 *
 * Props:
 *   selectedSeat   – the seat chosen for the CURRENT passenger (string, e.g. "A3")
 *   setSelectedSeat – callback to update the current passenger's seat
 *   bookedSeats    – seats already booked in the DB (array of strings)
 *   takenByOthers  – seats chosen by OTHER passengers in this session (array of strings)
 */
export default function SeatSelector({
  selectedSeat,
  setSelectedSeat,
  bookedSeats = [],
  takenByOthers = [],
}) {
  const rows = ["A", "B", "C", "D", "E", "F"];

  const getStatus = (seat) => {
    if (bookedSeats.includes(seat)) return "booked";
    if (takenByOthers.includes(seat)) return "taken";
    if (selectedSeat === seat) return "selected";
    return "available";
  };

  return (
    <div className="cabin-container">
      <div className="cockpit">COCKPIT</div>

      <div className="cabin-seats">
        {rows.map((row) => (
          <div className="seat-row" key={row}>
            {[1, 2, 3, 4, 5, 6].map((number) => {
              const seat = row + number;
              const status = getStatus(seat);
              const disabled = status === "booked" || status === "taken";

              return (
                <div key={seat} style={{ display: "flex", gap: "10px" }}>
                  {number === 4 && <div className="aisle-gap">{row}</div>}
                  <button
                    disabled={disabled}
                    className={`seat ${status}`}
                    onClick={() => !disabled && setSelectedSeat(seat)}
                    title={
                      status === "booked"
                        ? `Seat ${seat} is already booked`
                        : status === "taken"
                        ? `Seat ${seat} is selected by another passenger`
                        : `Select seat ${seat}`
                    }
                  >
                    {number}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="seat-legend">
        <div className="legend-item">
          <div className="legend-box available" />
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-box selected" />
          <span>Mine</span>
        </div>
        <div className="legend-item">
          <div className="legend-box taken" />
          <span>Others</span>
        </div>
        <div className="legend-item">
          <div className="legend-box booked" />
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
}