import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Submitted User:", user);

    // Navigate to App page
    navigate("/songs");
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>

          <label>Username</label>
          <input
            type="text"
            value={user.name}
            placeholder="Enter Username"
            onChange={(e) =>
              setUser({ ...user, name: e.target.value })
            }
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={user.password}
            placeholder="Enter Username"
            onChange={(e) =>
              setUser({ ...user, password: e.target.value })
            }
            required
          />

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;