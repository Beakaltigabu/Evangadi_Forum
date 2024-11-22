import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaQuestionCircle, FaUsers, FaCheckCircle, FaArrowRight, FaSignInAlt, FaSearch, FaComments } from 'react-icons/fa';
import classes from './GetStarted.module.css';

const GetStarted = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (hasVisited) {
      navigate('/auth');
    }
  }, [navigate]);

  const features = [
    {
      icon: <FaQuestionCircle />,
      title: "Ask Questions",
      description: "Post your tech questions and get help from the community"
    },
    {
      icon: <FaUsers />,
      title: "Community Support",
      description: "Connect with fellow developers and share knowledge"
    },
    {
      icon: <FaCheckCircle />,
      title: "Find Solutions",
      description: "Get answers from experienced developers in the community"
    }
  ];

  const steps = [
    {
      icon: <FaSignInAlt />,
      title: "Sign Up",
      description: "Create your account in seconds"
    },
    {
      icon: <FaSearch />,
      title: "Explore",
      description: "Browse questions or ask your own"
    },
    {
      icon: <FaComments />,
      title: "Engage",
      description: "Answer questions and grow together"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const handleGetStarted = () => {
    localStorage.setItem('hasVisited', 'true');
    navigate('/auth');
  };

  return (
    <div className={classes.container}>
      <motion.div
        className={classes.hero}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Welcome to Evangadi Tech Community</h1>
        <p>Your platform for asking questions, sharing knowledge, and growing together</p>
      </motion.div>

      <motion.div
        className={classes.features}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className={classes.featureCard}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <div className={classes.icon}>{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className={classes.howItWorks}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <h2>How It Works</h2>
        <div className={classes.steps}>
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={classes.step}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 1 + (index * 0.2) }}
              whileHover={{ scale: 1.05 }}
            >
              <div className={classes.stepIcon}>{step.icon}</div>
              <h4>{step.title}</h4>
              <p>{step.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.button
        className={classes.getStartedButton}
        onClick={handleGetStarted}
        whileHover={{ scale: 1.05, backgroundColor: '#e98f39' }}
        whileTap={{ scale: 0.95 }}
      >
        Get Started <FaArrowRight />
      </motion.button>
    </div>
  );
};

export default GetStarted;
