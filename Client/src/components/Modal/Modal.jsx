import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Modal.css';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-content"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Modal;
