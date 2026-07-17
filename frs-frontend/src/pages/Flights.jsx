import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import FlightCard from "../components/FlightCard";

function Flights() {

    const [flights, setFlights] = useState([]);

    const [searchParams] = useSearchParams();

    const source = searchParams.get("source");

    const destination = searchParams.get("destination");

    useEffect(() => {

        if (source && destination) {

            axios

                .get(

                    `http://localhost:8080/api/flights/route?source=${source}&destination=${destination}`

                )

                .then((response) => {

                    setFlights(response.data);

                })

                .catch((error) => {

                    console.log(error);

                });

        }

        else {

            axios

                .get("http://localhost:8080/api/flights")

                .then((response) => {

                    setFlights(response.data);

                });

        }

    }, [source, destination]);

    return (

        <div className="container mt-5">

            <h2 className="mb-4">

                Available Flights

            </h2>

            <div className="row">

                {flights.length > 0 ? (

                    flights.map((flight) => (

                        <FlightCard

                            key={flight.id}

                            flight={flight}

                        />

                    ))

                ) : (

                    <h4>No Flights Found</h4>

                )}

            </div>

        </div>

    );

}

export default Flights;