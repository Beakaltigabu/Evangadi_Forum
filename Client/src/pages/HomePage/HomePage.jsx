import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaAngleRight } from 'react-icons/fa';
import api from '../../axios';
import './HomePage.module.css';

function Home() {
  const [user, setUser] = useState('');
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUser();
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      fetchQuestions();
    }
  }, [searchTerm]);

  const fetchUser = async () => {
    try {
      const response = await api.get('/users/check');
      setUser(response.data.username);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/questions', {
        params: { search: searchTerm }
      });
      setQuestions(response.data.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      fetchQuestions();
    }
  };

  return (
    <div className="home-page">
      <div className="home-header">
        <Link to="/question" className="ask-question-btn">Ask Question</Link>
        {user && (
          <div className="user-info">
            <p className="welcome-user">Welcome: {user}</p>
          </div>
        )}
      </div>
      <form className="search-form">
        <input
          type="text"
          placeholder="Search questions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleSearch}
        />
      </form>
      <div className="questions-list">
        {questions.map((question) => (
          <Link to={`/question/${question.questionid}`} key={question.questionid} className="question-item">
            <span className="question-user">
              <FaUser className="user-icon" />
              {question.username}
            </span>
            <span className="question-title">{question.title}</span>
            <FaAngleRight className="question-arrow" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
