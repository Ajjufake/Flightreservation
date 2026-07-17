import "../styles/SeatSelector.css";

export default function SeatSelector({
  selectedSeat,
  setSelectedSeat,
  bookedSeats
}) {
  const rows = ["A", "B", "C", "D", "E", "F"];

  return (
    <div className="cabin-container">
      <div className="cockpit">
        Cockpit
      </div>

      <div className="cabin-seats">
        {rows.map((row) => (
          <div className="seat-row" key={row}>
            {[1, 2, 3, 4, 5, 6].map((number) => {
              const seat = row + number;
              const booked = bookedSeats.includes(seat);

              return (
                <div key={seat} style={{ display: "flex", gap: "10px" }}>
                  {number === 4 && (
                    <div className="aisle-gap">
                      {row}
                    </div>
                  )}
                  <button
                    disabled={booked}
                    className={`seat ${booked ? "booked" : ""} ${selectedSeat === seat ? "selected" : ""}`}
                    onClick={() => setSelectedSeat(seat)}
                    title={booked ? `Seat ${seat} is booked` : `Seat ${seat}`}
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
          <div className="legend-box available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-box selected"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-box booked"></div>
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
}