import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaQuestionCircle, FaComments, FaLightbulb } from 'react-icons/fa';
import classes from './HowItWorks.module.css';

const HowItWorks = () => {
  const steps = [
    {
      icon: <FaUsers />,
      title: "Join the Community",
      description: "Create your account and become part of our growing knowledge-sharing network."
    },
    {
      icon: <FaQuestionCircle />,
      title: "Ask Questions",
      description: "Post your questions and get help from experienced community members."
    },
    {
      icon: <FaComments />,
      title: "Share Knowledge",
      description: "Answer questions from others and share your expertise to help fellow members."
    },
    {
      icon: <FaLightbulb />,
      title: "Learn and Grow",
      description: "Gain insights from diverse perspectives and expand your understanding."
    }
  ];

  return (
    <motion.div
      className={classes.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className={classes.title}
        initial={{ y: -20 }}
        animate={{ y: 0 }}
      >
        How Evangadi Forum Works
      </motion.h1>

      <div className={classes.stepsContainer}>
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className={classes.step}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className={classes.iconContainer}>
              {step.icon}
            </div>
            <h2>{step.title}</h2>
            <p>{step.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className={classes.features}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h2>Why Choose Evangadi Forum?</h2>
        <ul>
          <li>Connect with industry experts and peers</li>
          <li>Get answers to your technical questions</li>
          <li>Share your knowledge and experience</li>
          <li>Build your professional network</li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default HowItWorks;
