import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  // Create refs
  const nameRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get values from refs
    const user = {
      name: nameRef.current.value,
      password: passwordRef.current.value,
    };

    // console.log(user);

    // Navigate to songs page
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
            placeholder="Enter Username"
            ref={nameRef}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter Password"
            ref={passwordRef}
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