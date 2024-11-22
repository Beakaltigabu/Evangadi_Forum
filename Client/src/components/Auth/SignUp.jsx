import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import api from '../../axios';
import classes from './SignUp.module.css';

const SignUp = ({ toggleAuth }) => {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!isChecked) newErrors.checkbox = "You must agree to the terms";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await api.post("/users/register", formData);
        if (response.status === 201) {
          setSuccessMessage("Registration successful!");
          setTimeout(() => {
            toggleAuth(true);
          }, 2000);
        }
      } catch (error) {
        setErrors({ submit: error.response?.data?.message || "Registration failed" });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <motion.div
      className={classes.signupContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h3>Join the Network</h3>
      <p>
        Already have an account?{" "}
        <motion.span
          onClick={() => toggleAuth(true)}
          className={classes.authLink}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Sign in
        </motion.span>
      </p>

      <AnimatePresence>
        {successMessage && (
          <motion.div
            className={classes.successMessage}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit}>
        <div className={classes.inputGroup}>
          <FontAwesomeIcon icon={faUser} className={classes.inputIcon} />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <span className={classes.error}>{errors.username}</span>}
        </div>

        <div className={classes.formRow}>
          <div className={classes.inputGroup}>
            <FontAwesomeIcon icon={faUser} className={classes.inputIcon} />
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && <span className={classes.error}>{errors.firstName}</span>}
          </div>

          <div className={classes.inputGroup}>
            <FontAwesomeIcon icon={faUser} className={classes.inputIcon} />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && <span className={classes.error}>{errors.lastName}</span>}
          </div>
        </div>

        <div className={classes.inputGroup}>
          <FontAwesomeIcon icon={faEnvelope} className={classes.inputIcon} />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className={classes.error}>{errors.email}</span>}
        </div>

        <div className={classes.inputGroup}>
          <FontAwesomeIcon icon={faLock} className={classes.inputIcon} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <motion.span
            className={classes.passwordToggle}
            onClick={() => setShowPassword(!showPassword)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </motion.span>
          {errors.password && <span className={classes.error}>{errors.password}</span>}
        </div>

        <div className={classes.checkboxContainer}>
          <input
            type="checkbox"
            id="terms"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          <label htmlFor="terms">
            I agree to the <a href="/#">privacy policy</a> and <a href="/#">terms of service</a>
          </label>
          {errors.checkbox && <span className={classes.error}>{errors.checkbox}</span>}
        </div>

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
            "Agree and Join"
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default SignUp;
