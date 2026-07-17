import { useState, useEffect } from "react";
import { login } from "../services/AuthService";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaPlaneDeparture } from "react-icons/fa";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If already logged in, redirect to homepage immediately
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const loginUser = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await login(email, password);
      localStorage.setItem("token", response.token);
      localStorage.setItem("userEmail", email);
      setLoading(false);
      // Navigate and reload so Navbar & Hero pick up the new auth state
      navigate("/");
      window.location.replace("/");
    } catch (err) {
      setLoading(false);
      setError("Invalid email or password. Please try again.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") loginUser();
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Brand */}
        <div className="auth-brand">
          <FaPlaneDeparture />
          <span>Aeroglide</span>
        </div>

        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to manage your flight reservations</p>

        {error && (
          <div className="alert alert-danger py-2 px-3 mb-3 rounded-3" style={{ fontSize: "14px" }}>
            {error}
          </div>
        )}

        <div className="auth-form">
          <div className="input-icon-group">
            <FaEnvelope className="input-icon" />
            <input
              className="form-control auth-input"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="email"
            />
          </div>

          <div className="input-icon-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              className="form-control auth-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="current-password"
            />
          </div>

          <button
            className="btn btn-primary w-100 auth-btn"
            onClick={loginUser}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" />
            ) : null}
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;