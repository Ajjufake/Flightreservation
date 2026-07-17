import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar() {

    const navigate = useNavigate();

    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");

    const search = () => {

        navigate(
            `/search?source=${source}&destination=${destination}`
        );

    };

    return (

        <div className="card shadow p-4 mt-5">

            <div className="row">

                <div className="col-md-5">

                    <input
                        className="form-control"
                        placeholder="Departure City"
                        value={source}
                        onChange={(e)=>setSource(e.target.value)}
                    />

                </div>

                <div className="col-md-5">

                    <input
                        className="form-control"
                        placeholder="Destination"
                        value={destination}
                        onChange={(e)=>setDestination(e.target.value)}
                    />

                </div>

                <div className="col-md-2">

                    <button
                        className="btn btn-primary w-100"
                        onClick={search}
                    >

                        Search

                    </button>

                </div>

            </div>

        </div>

    );

}

export default SearchBar;