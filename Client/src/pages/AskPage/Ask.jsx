import React, { useState, useEffect, useContext } from 'react';
import { FaCircleArrowRight } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import api from '../../axios';
import './Ask.css';
import { AuthContext } from '../../Context/authContext';

function Ask() {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !detail.trim()) {
      setError('Please provide input in all fields');
      return;
    }
    try {
      await api.post('/questions', { title, description: detail });
      setTitle('');
      setDetail('');
      setError('');
      navigate('/home');
    } catch (error) {
      console.error('Error posting question:', error.response?.data || error.message);
      setError('Failed to post question. Please try again.');
    }
  };

  return (
    <div className="question-page">
      <div className="steps">
        <h2>Steps to Write A Good Question</h2>
        <p><FaCircleArrowRight /> Summarize your problem in a one-line title.</p>
        <p><FaCircleArrowRight /> Describe your problem in more detail.</p>
        <p><FaCircleArrowRight /> Describe what you tried and what you expected to happen.</p>
        <p><FaCircleArrowRight /> Review your question and post it here.</p>
      </div>
      <h1>Post Your Question</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Question title"
        />
        <textarea
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="Question detail..."
        />
        <button type="submit">Post Question</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Ask;
