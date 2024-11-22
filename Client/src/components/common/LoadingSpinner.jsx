import React from 'react';
import { motion } from 'framer-motion';
import './LoadingSpinner.module.css';

const LoadingSpinner = () => {
  return (
    <div className="spinner-container">
      <motion.div
        className="spinner"
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

export default LoadingSpinner;
