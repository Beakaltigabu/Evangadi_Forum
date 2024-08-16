import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegUserCircle, FaAngleRight, FaAngleLeft, FaEdit, FaTrash } from 'react-icons/fa';
import api from '../../axios';
import classes from './Home.module.css';
import { AuthContext } from '../../Context/authContext';
import preloader from '../../assets/preloader.gif';
import Modal from '../../components/Modal/Modal';

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
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  const fetchQuestions = async () => {
    try {
      console.log('Fetching questions');
      const response = await api.get('/questions');
      console.log('Fetched questions:', response.data.questions);
      setQuestions(response.data.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const filteredQuestions = questions.filter(question =>
    question.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredQuestions.length / questionsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const openModal = (question) => {
    setSelectedQuestion(question);
    setUpdatedTitle(question.title);
    setUpdatedDescription(question.description);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedQuestion(null);
  };

  const handleUpdate = async () => {
    if (!selectedQuestion) return;

    try {
      await api.put(`/questions/${selectedQuestion.questionid}`, {
        title: updatedTitle,
        description: updatedDescription,
      });
      fetchQuestions();
      closeModal();
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  const openDeleteModal = (question) => {
    setSelectedQuestion(question);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedQuestion(null);
  };

  const handleDelete = async () => {
    if (!selectedQuestion) return;

    try {
      await api.delete(`/questions/${selectedQuestion.questionid}`);
      fetchQuestions();
      closeDeleteModal();
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
          onKeyPress={handleSearch}
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
            {user === question.username && (
              <div className={classes.questionActions}>
                <button onClick={() => openModal(question)} className={classes.iconButton}>
                  <FaEdit />
                </button>
                <button onClick={() => openDeleteModal(question)} className={classes.iconButton}>
                  <FaTrash />
                </button>
              </div>
            )}
            <FaAngleRight className={classes.questionArrow} />
          </div>
        ))}
      </div>
      <div className={classes.pagination}>
        <FaAngleLeft onClick={prevPage} className={`${classes.paginationIcon} ${currentPage === 1 ? classes.disabled : ''}`} />
        <span className={classes.pageNumber}>{currentPage}</span>
        <FaAngleRight onClick={nextPage} className={`${classes.paginationIcon} ${currentPage === Math.ceil(filteredQuestions.length / questionsPerPage) ? classes.disabled : ''}`} />
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2>Edit Question</h2>
        <form>
          <input
            type="text"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            placeholder="Question title"
            className={classes.input}
          />
          <textarea
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
            placeholder="Question detail..."
            className={classes.textarea}
          />
          <div className={classes.modalButtons}>
            <button type="button" onClick={handleUpdate} className={classes.modalButton}>Update</button>
          </div>
        </form>
      </Modal>
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this question?</p>
        <div className={classes.modalButtons}>
          <button onClick={closeDeleteModal} className={`${classes.modalButton} ${classes.cancel}`}>Cancel</button>
          <button onClick={handleDelete} className={`${classes.modalButton} ${classes.confirm}`}>Confirm</button>
        </div>
      </Modal>
    </div>
  );
}

export default Home;
