import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser, FaPhone, FaPlaneDeparture } from "react-icons/fa";
import "../styles/login.css";

function Register() {
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    const { fullName, email, phone, password } = user;
    if (!fullName || !email || !phone || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:8080/api/auth/register", user);
      setLoading(false);
      navigate("/login");
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data || "Registration failed. Please try again.";
      setError(typeof msg === "string" ? msg : "Registration failed. Please try again.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleRegister();
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Brand */}
        <div className="auth-brand">
          <FaPlaneDeparture />
          <span>Aeroglide</span>
        </div>

        <h2 className="auth-title">Create account</h2>
        <p className="auth-subtitle">Join Aeroglide to manage your reservations</p>

        {error && (
          <div className="alert alert-danger py-2 px-3 mb-3 rounded-3" style={{ fontSize: "14px" }}>
            {error}
          </div>
        )}

        <div className="auth-form">
          <div className="input-icon-group">
            <FaUser className="input-icon" />
            <input
              className="form-control auth-input"
              placeholder="Full Name"
              name="fullName"
              value={user.fullName}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              autoComplete="name"
            />
          </div>

          <div className="input-icon-group">
            <FaEnvelope className="input-icon" />
            <input
              className="form-control auth-input"
              type="email"
              placeholder="Email address"
              name="email"
              value={user.email}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              autoComplete="email"
            />
          </div>

          <div className="input-icon-group">
            <FaPhone className="input-icon" />
            <input
              className="form-control auth-input"
              type="tel"
              placeholder="Phone number"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              autoComplete="tel"
            />
          </div>

          <div className="input-icon-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              className="form-control auth-input"
              placeholder="Create password (min. 6 chars)"
              name="password"
              value={user.password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              autoComplete="new-password"
            />
          </div>

          <button
            className="btn btn-primary w-100 auth-btn"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" />
            ) : null}
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;