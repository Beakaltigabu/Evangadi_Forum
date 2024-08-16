import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import api from '../../axios';
import classes from './Header.module.css';
import logo from '../../assets/evangadi-logo.png';
import { AuthContext } from '../../Context/authContext';

const Header = ({ toggleAuth }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, logout } = useContext(AuthContext);
  const menuRef = useRef(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await api.get('/users/check', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setIsAuthenticated(true);
        } catch (error) {
          console.error('User check error:', error);
          setIsAuthenticated(false);
          localStorage.removeItem('token');
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkUserStatus();
  }, [setIsAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        <Link to="/">
          <img src={logo} alt="Evangadi Forum Logo" />
        </Link>
      </div>
      <button className={classes.menuToggle} onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>
      <nav ref={menuRef} className={`${classes.navLinks} ${isMenuOpen ? classes.open : ''}`}>
        <Link to="/">Home</Link>
        <Link to="/#">How it Works</Link>
        {isAuthenticated ? (
          <button className={classes.authButton} onClick={handleLogout}>
            LOG OUT
          </button>
        ) : (
          <Link to="/" onClick={() => toggleAuth(true)} className={`${classes.authButton} ${classes.authLink}`}>
            SIGN IN
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
