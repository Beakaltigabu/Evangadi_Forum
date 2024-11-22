import React from 'react';
import { motion } from 'framer-motion';
import classes from './LoadingCard.module.css';

const LoadingCard = () => {
  return (
    <motion.div
      className={classes.loadingCard}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className={classes.header}>
        <div className={classes.avatar} />
        <div className={classes.headerText}>
          <div className={classes.shimmer} style={{ width: '60%' }} />
          <div className={classes.shimmer} style={{ width: '40%' }} />
        </div>
      </div>
      <div className={classes.content}>
        <div className={classes.shimmer} style={{ width: '90%' }} />
        <div className={classes.shimmer} style={{ width: '80%' }} />
        <div className={classes.shimmer} style={{ width: '70%' }} />
      </div>
      <div className={classes.footer}>
        <div className={classes.shimmer} style={{ width: '30%' }} />
        <div className={classes.shimmer} style={{ width: '30%' }} />
      </div>
    </motion.div>
  );
};

export default LoadingCard;
