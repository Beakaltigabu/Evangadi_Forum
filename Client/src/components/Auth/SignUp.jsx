import React, { useState, useContext } from "react";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from '../../axios';
import classes from './SignUp.module.css';
import { AuthContext } from '../../Context/authContext';

const SignUp = ({ toggleAuth }) => {
  const { setIsAuthenticated } = useContext(AuthContext);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!isChecked) newErrors.checkbox = "You must agree to the privacy policy and terms of service";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await api.post("/users/register", formData);
        if (response.status === 201) {
          setSuccessMessage("Registration successful! Please log in.");
          setTimeout(() => {
            toggleAuth(true); // Toggle to login component
          }, 2000); // Show success message for 2 seconds
        }
      } catch (error) {
        console.error("Error:", error.response?.data?.message || error.message);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={classes.signupContainer}>
      <h5>Join the Network</h5>
      <p>
        Already have an account?{" "}
        <span onClick={() => toggleAuth(true)} className={classes.authLink}>
          Sign in
        </span>
      </p>
      {successMessage && <div className={classes.successMessage}>{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className={classes.formGroup}>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <span className={classes.error}>{errors.username}</span>}
        </div>
        <div className={classes.formRow}>
          <div className={classes.formGroupInline}>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && (
              <span className={classes.error}>{errors.firstName}</span>
            )}
          </div>
          <div className={classes.formGroupInline}>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && (
              <span className={classes.error}>{errors.lastName}</span>
            )}
          </div>
        </div>
        <div className={classes.formGroup}>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className={classes.error}>{errors.email}</span>}
        </div>
        <div className={`${classes.formGroup} ${classes.passwordGroup}`}>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <span className={classes.passwordToggle} onClick={togglePasswordVisibility}>
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </span>
          {errors.password && <span className={classes.error}>{errors.password}</span>}
        </div>
        <div className={`${classes.formGroup} ${classes.checkboxContainer}`}>
          <input
            type="checkbox"
            id="privacyPolicy"
            name="privacyPolicy"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className={classes.customCheckbox}
          />
          <label htmlFor="privacyPolicy" className={classes.customLabel}>
            I agree to the <a href="/#" className={classes.authLink}>privacy policy</a> and{" "}
            <a href="/#" className={classes.authLink}>terms of service</a>.
          </label>
          {errors.checkbox && <span className={classes.error}>{errors.checkbox}</span>}
        </div>
        <button type="submit" className={classes.agreeJoinBtn}>Agree and Join</button>
      </form>
      <div className={classes.signupFooter}>
        <p>
          <span onClick={() => toggleAuth(true)} className={classes.authLink}>
            Already have an account?
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
