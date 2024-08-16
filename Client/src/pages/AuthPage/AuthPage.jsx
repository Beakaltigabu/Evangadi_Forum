import React, { useState, useEffect, useContext } from 'react';
import SignUp from "../../components/Auth/SignUp";
import Login from "../../components/Login/Login";
import About from "../../components/About/About";
import { useNavigate } from 'react-router-dom';
import "./AuthPage.css";
import { AuthContext } from '../../Context/authContext';

function AuthPage({ showLogin }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [isLoginVisible, setIsLoginVisible] = useState(showLogin);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const toggleAuthComponent = (showLogin) => {
    setIsLoginVisible(showLogin);
  };

  return (
    <div>
      <div className='Auth-container'>
        <div className="auth-section">
          {isLoginVisible ? (
            <Login toggleAuth={() => toggleAuthComponent(false)} />
          ) : (
            <SignUp toggleAuth={() => toggleAuthComponent(true)} />
          )}
        </div>
        <div className="about-section">
          <About />
        </div>
      </div>
    </div>
  );
}

export default AuthPage;

