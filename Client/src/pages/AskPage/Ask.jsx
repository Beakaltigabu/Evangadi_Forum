import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { FaCircleArrowRight, FaMarkdown } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import api from '../../axios';
import classes from './Ask.module.css';
import { AuthContext } from '../../Context/authContext';

function Ask() {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: '',
    detail: ''
  });
  const [charCount, setCharCount] = useState({ title: 0, detail: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setCharCount(prev => ({ ...prev, [name]: value.length }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.detail.trim()) {
      toast.error('Please provide input in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/questions', {
        title: formData.title,
        description: formData.detail
      });
      toast.success('Question posted successfully!');
      navigate('/home');
    } catch (error) {
      toast.error('Failed to post question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className={classes.questionPage}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Toaster position="top-right" />

      <div className={classes.steps}>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          Steps to Write A Good Question
        </motion.h2>

        {[
          'Summarize your problem in a one-line title.',
          'Describe your problem in more detail.',
          'Describe what you tried and what you expected to happen.',
          'Review your question and post it here.'
        ].map((step, index) => (
          <motion.div
            key={index}
            className={classes.stepItem}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <FaCircleArrowRight className={classes.stepIcon} />
            <p>{step}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className={classes.formSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h1>Post Your Question</h1>
        <form onSubmit={handleSubmit}>
          <div className={classes.inputGroup}>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Question title"
              maxLength={150}
              className={classes.input}
            />
            <span className={classes.charCount}>
              {charCount.title}/150
            </span>
          </div>

          <div className={classes.inputGroup}>
            <div className={classes.textareaHeader}>
              <FaMarkdown className={classes.markdownIcon} />
              <span>Markdown supported</span>
            </div>
            <textarea
              name="detail"
              value={formData.detail}
              onChange={handleChange}
              placeholder="Question detail..."
              maxLength={3000}
              className={classes.textarea}
            />
            <span className={classes.charCount}>
              {charCount.detail}/3000
            </span>
          </div>

          <motion.button
            type="submit"
            className={classes.submitButton}
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? 'Posting...' : 'Post Question'}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default Ask;
