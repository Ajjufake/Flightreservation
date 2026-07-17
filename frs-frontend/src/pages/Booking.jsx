import {useState,useEffect} from "react";
import axios from "axios";
import {useSearchParams} from "react-router-dom";
import SeatSelector from "../components/SeatSelector";
import "../styles/booking.css";

export default function Booking(){

const [params]=useSearchParams();

const flightId=params.get("flightId");

const [bookedSeats,setBookedSeats]=useState([]);

const [booking,setBooking]=useState({

passengerName:"",
age:"",
gender:"",
seatNumber:""

});

useEffect(()=>{

axios.get(

`http://localhost:8080/api/bookings/seats/${flightId}`

)

.then(res=>setBookedSeats(res.data))

.catch(()=>{});

},[]);

const handleChange=(e)=>{

setBooking({

...booking,

[e.target.name]:e.target.value

})

}

const handleSubmit=()=>{

axios.post(

`http://localhost:8080/api/bookings/book?userId=2&flightId=${flightId}`,

booking,

{

headers:{

Authorization:

"Bearer "+localStorage.getItem("token")

}

}

)

.then(()=>{

alert("Booking Successful");

window.location="/mybookings";

})

.catch(err=>{

alert(err.response?.data || "Booking Failed");

})

}

return(

<div className="booking-page">

<div className="container">

<div className="row">

<div className="col-md-4">

<div className="flight-summary">

<h4>Flight Summary</h4>

<hr/>

<p>Flight ID : {flightId}</p>

<div className="price-box">

₹5500

</div>

</div>

</div>

<div className="col-md-8">

<div className="booking-form">

<div className="booking-title">

Passenger Details

</div>

<input

className="form-control mb-3"

placeholder="Passenger Name"

name="passengerName"

onChange={handleChange}

/>

<input

className="form-control mb-3"

placeholder="Age"

name="age"

onChange={handleChange}

/>

<select

className="form-control mb-4"

name="gender"

onChange={handleChange}

>

<option>Select Gender</option>

<option>Male</option>

<option>Female</option>

<option>Other</option>

</select>

<h5 className="section-title">

Choose Seat

</h5>

<SeatSelector

selectedSeat={booking.seatNumber}

setSelectedSeat={(seat)=>

setBooking({

...booking,

seatNumber:seat

})

}

bookedSeats={bookedSeats}

/>

<br/>

<button

className="confirm-btn"

onClick={handleSubmit}

>

Confirm Booking

</button>

</div>

</div>

</div>

</div>

</div>

)

}