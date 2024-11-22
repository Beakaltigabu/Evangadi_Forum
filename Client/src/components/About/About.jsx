import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import classes from './About.module.css';

function About({ variant = 'login' }) {
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      className={`${classes.aboutContainer} ${classes[variant]}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className={classes.content}
        variants={contentVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.span
          className={classes.badge}
          variants={itemVariants}
        >
          About
        </motion.span>

        <motion.h1
          variants={itemVariants}
          className={classes.title}
        >
          Evangadi Networks Q & A
        </motion.h1>

        <motion.div
          className={classes.description}
          variants={itemVariants}
        >
          <p>
            No matter what stage of life you are in, whether you're just
            starting elementary school or being promoted to CEO of a Fortune
            500 company, you have much to offer to those who are trying to
            follow in your footsteps.
          </p>

          <p>
            Whether you are willing to share your knowledge or you are just
            looking to meet mentors of your own, please start by joining the
            network here.
          </p>
        </motion.div>

        <Link to="/how-it-works">
          <motion.button
            className={classes.howItWorks}
            whileHover={{
              scale: 1.05,
              backgroundColor: '#e98f39'
            }}
            whileTap={{ scale: 0.95 }}
          >
            HOW IT WORKS
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default About;
