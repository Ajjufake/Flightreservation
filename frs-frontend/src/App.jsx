import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Flights from "./pages/Flights";
import SearchFlights from "./pages/SearchFlights";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import AdminFlights from "./pages/AdminFlights";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
    <Navbar />

    <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/search" element={<SearchFlights />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/mybookings" element={<MyBookings />} />
        <Route path="/admin" element={<AdminFlights />} />
        <Route path="/dashboard" element={<Dashboard />} />


    </Routes>
</>
  );
}

export default App;