import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaHome, FaInfoCircle, FaSignOutAlt } from 'react-icons/fa';
import api from '../../axios';
import classes from './Header.module.css';
import logo from '../../assets/evangadi-logo.png';
import { AuthContext } from '../../Context/authContext';

const Header = ({ toggleAuth }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, logout } = useContext(AuthContext);

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
          setIsAuthenticated(false);
          localStorage.removeItem('token');
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkUserStatus();
  }, [setIsAuthenticated]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.header
      className={classes.header}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <motion.div className={classes.logo}>
        <Link to="/">
          <img src={logo} alt="Evangadi Forum Logo" />
        </Link>
      </motion.div>

      <FaBars
        className={`${classes.menuToggle} ${isMenuOpen ? classes.hidden : ''}`}
        onClick={toggleMenu}
      />

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className={classes.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.nav className={`${classes.navLinks} ${isMenuOpen ? classes.open : ''}`}>
        <div className={classes.sidebarHeader}>
          <img src={logo} alt="Evangadi Logo" className={classes.sidebarLogo} />
          <button
            className={classes.closeButton}
            onClick={toggleMenu}
          >
            <FaTimes />
          </button>
        </div>

        <div className={classes.navItems}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            <FaHome /> Home
          </Link>
          <Link to="/how-it-works" onClick={() => setIsMenuOpen(false)}>
            <FaInfoCircle /> How it Works
          </Link>
        </div>

        {isAuthenticated ? (
          <motion.button
            className={`${classes.authButton} ${classes.logoutButton}`}
            onClick={handleLogout}
            whileHover={{ scale: 1.05, backgroundColor: '#e98f39' }}
            whileTap={{ scale: 0.95 }}
          >
            <FaSignOutAlt /> LOG OUT
          </motion.button>
        ) : (
          <Link
            to="/"
            className={classes.authButton}
            onClick={() => {
              setIsMenuOpen(false);
              toggleAuth && toggleAuth(true);
            }}
          >
            SIGN IN
          </Link>
        )}
      </motion.nav>
    </motion.header>
  );
};

export default Header;
