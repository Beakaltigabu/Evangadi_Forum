import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaAngleRight, FaEdit } from 'react-icons/fa';
import api from '../../axios';
import styles from './HomePage.module.css';

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
    <div className={styles.homePage}>
      <div className={styles.homeHeader}>
        <Link to="/question" className={styles.askQuestionBtn}>Ask Question</Link>
        {user && (
          <div className={styles.userInfo}>
            <p className={styles.welcomeUser}>Welcome: <span>{user}</span></p>
          </div>
        )}
      </div>
      <form className={styles.searchForm}>
        <input
          type="text"
          placeholder="Search questions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleSearch}
        />
      </form>
      <div className={styles.questionsList}>
        {questions.map((question) => (
          <div key={question.questionid} className={styles.questionItem}>
            <span className={styles.questionUser}>
              <FaUser className={styles.userIcon} />
              {question.username}
            </span>
            <Link to={`/question/${question.questionid}`} className={styles.questionTitle}>
              {question.title}
            </Link>
            {user === question.username && (
              <Link to={`/edit-question/${question.questionid}`} className={styles.editButton}>
                <FaEdit />
              </Link>
            )}
            <FaAngleRight className={styles.questionArrow} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
