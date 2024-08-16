import React, { useRef, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import api from "../../axios";
import "./Login.css";
import { AuthContext } from '../../Context/authContext';

function Login({ toggleAuth }) {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const emailValue = emailRef.current.value;
    const passwordValue = passwordRef.current.value;

    if (!emailValue || !passwordValue) {
      setErrorMessage("Please provide all required information");
      return;
    }

    try {
      const response = await api.post("/users/login", {
        email: emailValue,
        password: passwordValue,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      navigate("/home");
    } catch (error) {
      console.error("Full error object:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        setErrorMessage(error.response.data.message || "Login failed");
      } else if (error.request) {
        console.error("No response received:", error.request);
        setErrorMessage("No response from server");
      } else {
        console.error("Error message:", error.message);
        setErrorMessage("Something went wrong");
      }
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="login-page">
      <div className="login-container">
        <h3>Login to your account</h3>
        <p>
          Don't have an account?{" "}
          <span onClick={() => toggleAuth(false)} className="auth-link">
            Create a new account
          </span>
        </p>
        <form onSubmit={handleSubmit}>
          <div>
            <input ref={emailRef} type="text" placeholder="Email address" />
          </div>
          <div className="password-container">
            <input
              ref={passwordRef}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />
            <span
              className="toggle-password"
              onClick={togglePasswordVisibility}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>
          <div className="forgot-password">
            <a href="/#">Forgot password?</a>
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
