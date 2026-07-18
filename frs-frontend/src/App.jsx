import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Flights from "./pages/Flights";
import SearchFlights from "./pages/SearchFlights";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import AdminFlights from "./pages/AdminFlights";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminBookings from "./pages/AdminBookings";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";

// Redirects authenticated users away from Login/Register pages
function GuestRoute({ element }) {
  return localStorage.getItem("token") ? <Navigate to="/" replace /> : element;
}

// Redirects unauthenticated users to Login for protected pages
function ProtectedRoute({ element }) {
  return localStorage.getItem("token") ? element : <Navigate to="/login" replace />;
}

// Redirects non-admin users away from admin pages
function AdminRoute({ element }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");
  if (!token) return <Navigate to="/login" replace />;
  if (role !== "ADMIN") return <Navigate to="/" replace />;
  return element;
}

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/search" element={<SearchFlights />} />

        {/* Guest-only: redirect to home if already logged in */}
        <Route path="/login" element={<GuestRoute element={<Login />} />} />
        <Route path="/register" element={<GuestRoute element={<Register />} />} />

        {/* User-protected routes */}
        <Route path="/booking" element={<ProtectedRoute element={<Booking />} />} />
        <Route path="/mybookings" element={<ProtectedRoute element={<MyBookings />} />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />

        {/* Admin-only routes */}
        <Route path="/admin" element={<AdminRoute element={<AdminFlights />} />} />
        <Route path="/admin/dashboard" element={<AdminRoute element={<AdminDashboard />} />} />
        <Route path="/admin/users" element={<AdminRoute element={<AdminUsers />} />} />
        <Route path="/admin/bookings" element={<AdminRoute element={<AdminBookings />} />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;