import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function SearchFlights() {

  const [search, setSearch] = useState({
    source: "",
    destination: "",
    departureDate: ""
  });

  const [flights, setFlights] = useState([]);

  const handleChange = (e) => {

    setSearch({
      ...search,
      [e.target.name]: e.target.value
    });

  };

  const handleSearch = () => {
    const params = {};
    if (search.source) params.source = search.source;
    if (search.destination) params.destination = search.destination;
    if (search.departureDate) {
      params.departureDate = search.departureDate;
    } else {
      params.allDates = true;
    }

    axios.get(

      `http://localhost:8080/api/flights/search`,

      {
        params
      }

    )

    .then((response) => {

      setFlights(response.data);

    })

    .catch((error) => {

      console.log(error);

      alert("No Flights Found");

    });

  };

  return (

    <div className="container mt-5">

      <h2 className="mb-4">
        Search Flights
      </h2>

      <input
        className="form-control mb-3"
        placeholder="Source"
        name="source"
        value={search.source}
        onChange={handleChange}
      />

      <input
        className="form-control mb-3"
        placeholder="Destination"
        name="destination"
        value={search.destination}
        onChange={handleChange}
      />

      <input
        type="date"
        className="form-control mb-3"
        name="departureDate"
        value={search.departureDate}
        onChange={handleChange}
      />

      <button
        className="btn btn-primary mb-4"
        onClick={handleSearch}
      >
        Search Flights
      </button>

      {flights.length > 0 && (

        <table className="table table-bordered">

          <thead>

            <tr>

              <th>Flight</th>
              <th>Airline</th>
              <th>Source</th>
              <th>Destination</th>
              <th>Date</th>
              <th>Price</th>
              <th></th>

            </tr>

          </thead>

          <tbody>

            {flights.map((flight) => (

              <tr key={flight.id}>

                <td>{flight.flightNumber}</td>

                <td>{flight.airline}</td>

                <td>{flight.source}</td>

                <td>{flight.destination}</td>

                <td>{flight.departureDate}</td>

                <td>₹{flight.price}</td>

                <td>

                  <Link
                    className="btn btn-success"
                    to={`/booking?flightId=${flight.id}`}
                  >
                    Book
                  </Link>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>

  );

}

export default SearchFlights;