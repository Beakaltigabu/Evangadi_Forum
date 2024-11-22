import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SignUp from "../../components/Auth/SignUp";
import Login from "../../components/Login/Login";
import About from "../../components/About/About";
import { useNavigate } from 'react-router-dom';
import classes from './AuthPage.module.css';
import { AuthContext } from '../../Context/authContext';

function AuthPage({ showLogin }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [isLoginVisible, setIsLoginVisible] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3
      }
    }
  };

  return (
    <motion.div
      className={classes.pageWrapper}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <div className={classes.authContainer}>
        <motion.div
          className={classes.authContent}
          variants={pageVariants}
        >
          <div className={classes.authSection}>
            <AnimatePresence mode='wait'>
              {isLoginVisible ? (
                <motion.div
                  key="login"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Login toggleAuth={() => setIsLoginVisible(false)} />
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <SignUp toggleAuth={() => setIsLoginVisible(true)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            className={classes.aboutSection}
            variants={pageVariants}
          >
            <About variant={isLoginVisible ? 'login' : 'signup'} />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default AuthPage;
