import React, { useRef, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import api from "../../axios";
import classes from './Login.module.css';
import { AuthContext } from '../../Context/authContext';

function Login({ toggleAuth }) {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await api.post("/users/login", formData);
      const token = response.data.token;
      localStorage.setItem("token", token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      navigate("/home");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className={classes.loginContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h3>Login to your account</h3>
      <p>
        Don't have an account?{" "}
        <motion.span
          onClick={toggleAuth}
          className={classes.authLink}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Create a new account
        </motion.span>
      </p>

      <form onSubmit={handleSubmit}>
        <div className={classes.inputGroup}>
          <FontAwesomeIcon icon={faEnvelope} className={classes.inputIcon} />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className={fieldErrors.email ? classes.errorInput : ''}
          />
          <AnimatePresence>
            {fieldErrors.email && (
              <motion.span
                className={classes.errorMessage}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {fieldErrors.email}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className={classes.inputGroup}>
          <FontAwesomeIcon icon={faLock} className={classes.inputIcon} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={fieldErrors.password ? classes.errorInput : ''}
          />
          <motion.span
            className={classes.passwordToggle}
            onClick={() => setShowPassword(!showPassword)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </motion.span>
          <AnimatePresence>
            {fieldErrors.password && (
              <motion.span
                className={classes.errorMessage}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {fieldErrors.password}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

      {/*   <div className={classes.forgotPassword}>
          <a href="/#">Forgot password?</a>
        </div> */}

        <AnimatePresence>
          {errorMessage && (
            <motion.div
              className={classes.errorAlert}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <motion.div
              className={classes.spinner}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            "Login"
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}

export default Login;
