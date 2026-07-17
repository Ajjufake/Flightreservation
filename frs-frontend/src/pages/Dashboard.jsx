import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {

    const [dashboard, setDashboard] = useState(null);

    useEffect(() => {

        axios.get(
            "http://localhost:8080/api/dashboard/2",
            {
                headers: {
                    Authorization:
                        "Bearer " + localStorage.getItem("token")
                }
            }
        )
        .then(res => setDashboard(res.data))
        .catch(err => console.log(err));

    }, []);

    if (!dashboard) {

        return (
            <div className="container mt-5">
                Loading...
            </div>
        );
    }

    return (

        <div className="container mt-5">

            <h2>
                Welcome 👋
            </h2>

            <div className="row mt-4">

                <div className="col-md-3">
                    <div className="card shadow text-center p-3">
                        <h5>Bookings</h5>
                        <h2>{dashboard.totalBookings}</h2>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow text-center p-3">
                        <h5>Upcoming</h5>
                        <h2>{dashboard.upcomingBookings}</h2>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow text-center p-3">
                        <h5>Cancelled</h5>
                        <h2>{dashboard.cancelledBookings}</h2>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow text-center p-3">
                        <h5>Total Spent</h5>
                        <h2>₹{dashboard.totalSpent}</h2>
                    </div>
                </div>

            </div>

        </div>

    );

}

export default Dashboard;