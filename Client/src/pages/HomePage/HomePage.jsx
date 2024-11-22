import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegUserCircle, FaAngleRight, FaAngleLeft, FaEdit, FaTrash, FaClock } from 'react-icons/fa';
import api from '../../axios';
import classes from './Home.module.css';
import { AuthContext } from '../../Context/authContext';
import preloader from '../../assets/preloader.gif';
import Modal from '../Modal/Modal';

function Home() {
  const { isAuthenticated } = useContext(AuthContext);
  const [user, setUser] = useState('');
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const questionsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated) {
        try {
          await fetchUser();
          await fetchQuestions();
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/login');
      }
    };

    fetchData();
  }, [isAuthenticated, navigate]);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  };

  const fetchUser = async () => {
    try {
      const response = await api.get('/users/check');
      setUser(response.data.username);
    } catch (error) {
      console.error('Error fetching user:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/questions');
      setQuestions(response.data.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleUpdate = async () => {
    if (!selectedQuestion) return;

    try {
      await api.put(`/questions/${selectedQuestion.questionid}`, {
        title: updatedTitle,
        description: updatedDescription,
      });
      await fetchQuestions();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedQuestion) return;

    try {
      await api.delete(`/questions/${selectedQuestion.questionid}`);
      await fetchQuestions();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  if (loading) {
    return (
      <div className={classes.loadingContainer}>
        <img src={preloader} alt="Loading..." className={classes.preloader} />
      </div>
    );
  }

  const filteredQuestions = questions.filter(question =>
    question.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  return (
    <div className={classes.homePage}>
      <div className={classes.homeHeader}>
        <Link to="/questions" className={classes.askQuestionBtn}>Ask Question</Link>
        {user && (
          <div className={classes.userInfo}>
            <p className={classes.welcomeUser}>Welcome: <span>{user}</span></p>
          </div>
        )}
      </div>

      <form className={classes.searchForm}>
        <input
          type="text"
          placeholder="Search questions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

      <div className={classes.questionsList}>
        <h2 className={classes.questions__h2}>Questions</h2>
        {currentQuestions.map((question) => (
          <div key={question.questionid} className={classes.questionItem}>
            <span className={classes.questionUser}>
              <FaRegUserCircle className={classes.userIcon} />
              {question.username}
            </span>
            <Link to={`/questions/${question.questionid}`} className={classes.questionTitle}>
              {question.title}
            </Link>
            <div className={classes.questionMeta}>
              <span className={classes.timeAgo}>
                <FaClock />
                {formatTimeAgo(question.created_at)}
              </span>
              {user === question.username && (
                <div className={classes.questionActions}>
                  <button
                    onClick={() => {
                      setSelectedQuestion(question);
                      setUpdatedTitle(question.title);
                      setUpdatedDescription(question.description);
                      setIsModalOpen(true);
                    }}
                    className={`${classes.actionButton} ${classes.editButton}`}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedQuestion(question);
                      setIsDeleteModalOpen(true);
                    }}
                    className={`${classes.actionButton} ${classes.deleteButton}`}
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
            <FaAngleRight className={classes.questionArrow} />
          </div>
        ))}
      </div>

      <div className={classes.pagination}>
        <FaAngleLeft
          className={`${classes.paginationIcon} ${currentPage === 1 ? classes.disabled : ''}`}
          onClick={() => currentPage > 1 && setCurrentPage(prev => prev - 1)}
        />
        <span className={classes.pageNumber}>{currentPage}</span>
        <FaAngleRight
          className={`${classes.paginationIcon} ${indexOfLastQuestion >= filteredQuestions.length ? classes.disabled : ''}`}
          onClick={() => indexOfLastQuestion < filteredQuestions.length && setCurrentPage(prev => prev + 1)}
        />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Edit Question</h2>
        <form className={classes.editForm}>
          <input
            type="text"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            placeholder="Question title"
          />
          <textarea
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
            placeholder="Question detail..."
          />
          <div className={classes.modalButtons}>
            <button type="button" onClick={handleUpdate}>Update</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this question?</p>
        <div className={classes.modalButtons}>
          <button onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
          <button onClick={handleDelete} className={classes.deleteButton}>Delete</button>
        </div>
      </Modal>
    </div>
  );
}

export default Home;
