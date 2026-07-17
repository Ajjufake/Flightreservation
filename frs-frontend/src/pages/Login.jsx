import { useState } from "react";
import { login } from "../services/AuthService";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {
    try {
      const response = await login(email, password);

      localStorage.setItem("token", response.token);

      alert("Login Successful");

      navigate("/flights");
    } catch (error) {
      alert("Invalid Email or Password");
    }
  };

  return (
    <div className="container mt-5">
      <div className="auth-container">
        <h2 className="mb-4 text-center">Login</h2>
        <div className="auth-form">
          <input
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="btn btn-primary w-100"
            onClick={loginUser}
          >
            Login
          </button>

          <p className="text-center mt-3">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;