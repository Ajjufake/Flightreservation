import "../styles/SeatSelector.css";

export default function SeatSelector({
    selectedSeat,
    setSelectedSeat,
    bookedSeats
}){

    const rows=["A","B","C","D","E","F"];

    return(

        <div>

            {rows.map(row=>(

                <div className="seat-row" key={row}>

                    {[1,2,3,4,5,6].map(number=>{

                        const seat=row+number;

                        const booked=bookedSeats.includes(seat);

                        return(

                            <button

                                key={seat}

                                disabled={booked}

                                className={`seat

                                ${booked?"booked":""}

                                ${selectedSeat===seat?"selected":""}

                                `}

                                onClick={()=>setSelectedSeat(seat)}

                            >

                                {seat}

                            </button>

                        )

                    })}

                </div>

            ))}

        </div>

    )

}