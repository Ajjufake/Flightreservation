import { useEffect, useState } from "react";
import BookingService from "../services/BookingService";

function MyBookings() {

    const [bookings, setBookings] = useState([]);

    const userId = 2;   // change later after login

    useEffect(() => {

        loadBookings();

    }, []);

    const loadBookings = () => {

        BookingService.getMyBookings(userId)
            .then((res) => {

                setBookings(res.data);

            })
            .catch(console.error);

    };

    const cancelBooking = (id) => {

        if (!window.confirm("Cancel this booking?"))
            return;

        BookingService.cancelBooking(id)
            .then(() => {

                alert("Booking Cancelled");

                loadBookings();

            })
            .catch(console.error);

    };

    return (

        <div className="container mt-5">

            <h2>My Bookings</h2>

            <table className="table table-bordered">

                <thead>

                    <tr>

                        <th>Booking ID</th>

                        <th>Passenger</th>

                        <th>Flight</th>

                        <th>Seat</th>

                        <th>Status</th>

                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {bookings.map((b) => (

                        <tr key={b.id}>

                            <td>{b.bookingId}</td>

                            <td>{b.passengerName}</td>

                            <td>{b.flight.flightNumber}</td>

                            <td>{b.seatNumber}</td>

                            <td>{b.status}</td>

                            <td>

                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => cancelBooking(b.id)}
                                >
                                    Cancel
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default MyBookings;