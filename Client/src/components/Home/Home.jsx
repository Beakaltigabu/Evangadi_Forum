import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRegUserCircle, FaSearch, FaSort, FaEdit, FaTrash, FaCheck, FaComment, FaThumbsUp } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import api from '../../axios';
import classes from './Home.module.css';
import { AuthContext } from '../../Context/authContext';
import Modal from '../Modal/Modal';
import LoadingSpinner from '../common/LoadingSpinner';

function Home() {
  const { isAuthenticated } = useContext(AuthContext);
  const [user, setUser] = useState('');
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const loadData = async () => {
        await Promise.all([fetchUser(), fetchQuestions()]);
      };
      loadData();
    } else {
      navigate('/login');
    }
  }, [isAuthenticated]);

  const fetchUser = async () => {
    try {
      const response = await api.get('/users/check');
      setUser(response.data.username);
    } catch (error) {
      toast.error('Failed to fetch user data');
      if (error.response?.status === 401) navigate('/login');
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/questions');
      const questionsWithCounts = await Promise.all(
        response.data.questions.map(async (question) => {
          const [votesRes, answersRes] = await Promise.all([
            api.get(`/votes/${question.questionid}`),
            api.get(`/answers/${question.questionid}`)
          ]);
          return {
            ...question,
            votes: Object.values(votesRes.data.votes || {}).reduce((sum, vote) => sum + vote, 0),
            answers_count: answersRes.data.answers?.length || 0,
            created_at: question.created_at || new Date().toISOString()
          };
        })
      );
      setQuestions(questionsWithCounts);
    } catch (error) {
      toast.error('Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      if (!updatedTitle.trim() || !updatedDescription.trim()) {
        toast.error('Title and description are required');
        return;
      }

      await api.put(`/questions/${selectedQuestion.questionid}`, {
        title: updatedTitle,
        description: updatedDescription,
      });

      toast.success('Question updated successfully');
      fetchQuestions();
      setEditModalOpen(false);
    } catch (error) {
      toast.error('Failed to update question');
    }
  };

  const handleDelete = async (questionId) => {
    try {
      await api.delete(`/questions/${questionId}`);
      toast.success('Question deleted successfully');
      fetchQuestions();
      setDeleteModalOpen(false);
    } catch (error) {
      toast.error('Failed to delete question');
    }
  };

  const formatTimeAgo = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return 'recently';
    }
  };

  const filteredQuestions = questions.filter(question =>
    question.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSortedQuestions = () => {
    return [...filteredQuestions].sort((a, b) => {
      switch(sortBy) {
        case 'votes':
          return (b.votes || 0) - (a.votes || 0);
        case 'answers':
          return (b.answers_count || 0) - (a.answers_count || 0);
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });
  };

  const sortedQuestions = getSortedQuestions();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <motion.div
      className={classes.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          success: {
            style: {
              background: '#4caf50',
              color: 'white',
            },
          },
          error: {
            style: {
              background: '#ef5350',
              color: 'white',
            },
          },
        }}
      />

      <div className={classes.header}>
        <div className={classes.headerLeft}>
          <div className={classes.userProfile}>
            <motion.div
              className={classes.userAvatar}
              whileHover={{ scale: 1.1 }}
            >
              {user[0]?.toUpperCase()}
            </motion.div>
            <span className={classes.userName}>{user}</span>
          </div>
        </div>

        <div className={classes.headerRight}>
          <div className={classes.searchBar}>
            <FaSearch className={classes.searchIcon} />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={classes.actions}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={classes.sortSelect}
            >
              <option value="newest">Newest</option>
              <option value="votes">Most Votes</option>
              <option value="answers">Most Answers</option>
            </select>

            <Link to="/questions">
              <motion.button
                className={classes.askButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ask Question
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

      <div className={classes.questionsList}>
        <AnimatePresence>
          {sortedQuestions.map((question, index) => (
            <motion.div
              key={question.questionid}
              className={classes.questionItem}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={classes.stats}>
                <motion.div
                  className={`${classes.statItem} ${question.votes > 0 ? classes.hasVotes : ''}`}
                  whileHover={{ scale: 1.05 }}
                >
                  <span>{question.votes || 0}</span>
                  <label>{question.votes === 1 ? 'vote' : 'votes'}</label>
                </motion.div>
                <motion.div
                  className={`${classes.statItem} ${question.answers_count > 0 ? classes.hasAnswers : ''}`}
                  whileHover={{ scale: 1.05 }}
                >
                  <span>{question.answers_count || 0}</span>
                  <label>{question.answers_count === 1 ? 'answer' : 'answers'}</label>
                </motion.div>
              </div>

              <div className={classes.questionContent}>
                <Link to={`/questions/${question.questionid}`} className={classes.questionTitle}>
                  {question.title}
                </Link>
                <p className={classes.questionExcerpt}>{question.description}</p>

                <div className={classes.questionMeta}>
                  <div className={classes.tags}>
                    {question.tags?.split(',').map((tag, i) => (
                      <span key={i} className={classes.tag}>{tag.trim()}</span>
                    ))}
                  </div>

                  <div className={classes.userInfo}>
                    <span className={classes.askedBy}>
                      asked {formatTimeAgo(question.created_at)} by{' '}
                      <span className={classes.username}>{question.username}</span>
                    </span>
                  </div>
                </div>
              </div>

              {user === question.username && (
                <div className={classes.questionActions}>
                  <motion.button
                    className={classes.actionButton}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setSelectedQuestion(question);
                      setUpdatedTitle(question.title);
                      setUpdatedDescription(question.description);
                      setEditModalOpen(true);
                    }}
                  >
                    <FaEdit />
                  </motion.button>
                  <motion.button
                    className={`${classes.actionButton} ${classes.deleteButton}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setSelectedQuestion(question);
                      setDeleteModalOpen(true);
                    }}
                  >
                    <FaTrash />
                  </motion.button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <h2>Edit Question</h2>
        <input
          type="text"
          value={updatedTitle}
          onChange={(e) => setUpdatedTitle(e.target.value)}
          className={classes.modalInput}
          placeholder="Question Title"
        />
        <textarea
          value={updatedDescription}
          onChange={(e) => setUpdatedDescription(e.target.value)}
          className={classes.modalTextarea}
          placeholder="Question Description"
        />
        <div className={classes.modalActions}>
          <motion.button
            onClick={() => setEditModalOpen(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={classes.cancelButton}
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={handleUpdate}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={classes.updateButton}
          >
            Update
          </motion.button>
        </div>
      </Modal>

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <h2>Delete Question</h2>
        <p className={classes.modalMessage}>
          Are you sure you want to delete this question? This action cannot be undone.
        </p>
        <div className={classes.modalActions}>
          <motion.button
            onClick={() => setDeleteModalOpen(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={classes.cancelButton}
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={() => handleDelete(selectedQuestion?.questionid)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={classes.deleteButton}
          >
            Delete
          </motion.button>
        </div>
      </Modal>
    </motion.div>
  );
}

export default Home;
