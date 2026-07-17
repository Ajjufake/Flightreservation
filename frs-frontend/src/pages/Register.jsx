import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";

function Register() {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: ""
    });

    const handleChange = (e) => {

        setUser({
            ...user,
            [e.target.name]: e.target.value
        });

    };

    const handleRegister = () => {

        axios.post(
            "http://localhost:8080/api/auth/register",
            user
        )

        .then(() => {

            alert("Registration Successful!");

            navigate("/login");

        })

        .catch((err) => {

            console.log(err);

            alert("Registration Failed");

        });

    };

    return (
      <div className="container mt-5">
        <div className="auth-container">
          <h2 className="mb-4 text-center">Create Account</h2>
          <div className="auth-form">
            <input
              className="form-control"
              placeholder="Full Name"
              name="fullName"
              onChange={handleChange}
            />

            <input
              className="form-control"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />

            <input
              className="form-control"
              placeholder="Phone Number"
              name="phone"
              onChange={handleChange}
            />

            <input
              type="password"
              className="form-control"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />

            <button
              className="btn btn-primary w-100"
              onClick={handleRegister}
            >
              Register
            </button>

            <p className="text-center mt-3">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>

    );
}

export default Register;