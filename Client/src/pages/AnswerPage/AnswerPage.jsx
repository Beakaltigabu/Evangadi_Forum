import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowCircleRight, FaEdit, FaTrash, FaArrowUp, FaArrowDown, FaPaperPlane } from "react-icons/fa";
import { RiAccountCircleFill } from "react-icons/ri";
import { toast, Toaster } from 'react-hot-toast';
import api from "../../axios";
import classes from "./AnswerPage.module.css";

function AnswerPage() {
  const { id } = useParams();
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [answersPerPage] = useState(5);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingAnswer, setEditingAnswer] = useState(null);
  const [editText, setEditText] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [answerToDelete, setAnswerToDelete] = useState(null);
  const [userVotes, setUserVotes] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAnswer, setNewAnswer] = useState("");

  useEffect(() => {
    fetchQuestionAndAnswers();
    fetchCurrentUser();
  }, [id]);

  const fetchQuestionAndAnswers = async () => {
    try {
      const [questionRes, answersRes, votesRes] = await Promise.all([
        api.get(`/questions/${id}`),
        api.get(`/answers/${id}`),
        api.get(`/votes/${id}`)
      ]);
      setQuestion(questionRes.data.question);
      setAnswers(answersRes.data.answers);
      setUserVotes(votesRes.data.votes || {});
    } catch (err) {
      toast.error("Failed to load content");
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/users/check');
      setCurrentUser(response.data.username);
    } catch (error) {
      toast.error("Error fetching user data");
    }
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) {
      toast.error("Please provide an answer");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post(`/answers`, {
        question_id: id,
        answer: newAnswer,
      });
      toast.success("Answer posted successfully");
      setNewAnswer("");
      fetchQuestionAndAnswers();
    } catch (error) {
      toast.error("Failed to post answer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!editText.trim()) {
      toast.error("Answer cannot be empty");
      return;
    }

    try {
      await api.put(`/answers/${editingAnswer.answerid}`, { answer: editText });
      toast.success("Answer updated successfully");
      fetchQuestionAndAnswers();
      setEditingAnswer(null);
    } catch (error) {
      toast.error("Failed to update answer");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/answers/${answerToDelete}`);
      toast.success("Answer deleted successfully");
      fetchQuestionAndAnswers();
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error("Failed to delete answer");
    }
  };

  const handleVote = async (answerid, vote) => {
    try {
      await api.post(`/answers/${answerid}/vote`, { vote });
      fetchQuestionAndAnswers();
    } catch (error) {
      toast.error("Failed to record vote");
    }
  };

  const indexOfLastAnswer = currentPage * answersPerPage;
  const indexOfFirstAnswer = indexOfLastAnswer - answersPerPage;
  const currentAnswers = answers
    .sort((a, b) => (b.votes || 0) - (a.votes || 0))
    .slice(indexOfFirstAnswer, indexOfLastAnswer);

  const pageCount = Math.ceil(answers.length / answersPerPage);
  const pageNumbers = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <motion.div
      className={classes.answerPage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Toaster position="top-right" />

      <motion.div className={classes.questionSection}>
        <h1>QUESTION</h1>
        <div className={classes.questionTitle}>
          <FaArrowCircleRight className={classes.arrowIcon} />
          <h2><span>{question.title}</span></h2>
        </div>
        <p className={classes.questionDescription}>{question.description}</p>
      </motion.div>

      <motion.div className={classes.answersSection}>
        <h4 className={classes.communityAnswers}>
          Answers from the Community
        </h4>

        <AnimatePresence>
          {currentAnswers.map((answer, index) => (
            <motion.div
              key={answer.answerid}
              className={classes.answerBox}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={classes.userInfo}>
                <RiAccountCircleFill className={classes.userIcon} />
                <span className={classes.username}>{answer.username}</span>
              </div>

              <div className={classes.answerContent}>
                <p className={classes.answerText}>{answer.answer}</p>

                <div className={classes.answerFooter}>
                  <span className={classes.timestamp}>
                    {new Date(answer.created_at).toLocaleString()}
                  </span>

                  <div className={classes.voteButtons}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleVote(answer.answerid, 1)}
                      className={`${classes.voteButton} ${
                        userVotes && userVotes[answer.answerid] === 1 ? classes.voted : ''
                      }`}
                    >
                      <FaArrowUp />
                    </motion.button>
                    <span className={classes.voteCount}>{answer.votes || 0}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleVote(answer.answerid, -1)}
                      className={`${classes.voteButton} ${
                        userVotes && userVotes[answer.answerid] === -1 ? classes.voted : ''
                      }`}
                    >
                      <FaArrowDown />
                    </motion.button>
                  </div>

                  {currentUser === answer.username && (
                    <div className={classes.answerActions}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => {
                          setEditingAnswer(answer);
                          setEditText(answer.answer);
                        }}
                        className={classes.actionButton}
                      >
                        <FaEdit />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => {
                          setAnswerToDelete(answer.answerid);
                          setIsDeleteModalOpen(true);
                        }}
                        className={`${classes.actionButton} ${classes.deleteButton}`}
                      >
                        <FaTrash />
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {pageCount > 1 && (
          <div className={classes.pagination}>
            <div className={classes.pageNumbers}>
              {pageNumbers.map(number => (
                <button
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  className={`${classes.pageButton} ${currentPage === number ? classes.active : ''}`}
                >
                  {number}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <motion.div className={classes.answerFormSection}>
        <form onSubmit={handleAnswerSubmit}>
          <textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Share your answer..."
            className={classes.answerInput}
            required
          />
          <motion.button
            type="submit"
            className={classes.postAnswerButton}
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaPaperPlane />
            {isSubmitting ? 'Posting...' : 'Post Answer'}
          </motion.button>
        </form>
      </motion.div>

      {editingAnswer && (
        <div className={classes.modalOverlay}>
          <motion.div
            className={classes.modalContent}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className={classes.modalHeader}>
              <h2>Edit Answer</h2>
            </div>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className={classes.modalTextarea}
            />
            <div className={classes.modalActions}>
              <button
                onClick={() => setEditingAnswer(null)}
                className={`${classes.modalButton} ${classes.cancelButton}`}
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                className={`${classes.modalButton} ${classes.updateButton}`}
              >
                Update
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className={classes.modalOverlay}>
          <motion.div
            className={classes.modalContent}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className={classes.modalHeader}>
              <h2>Delete Answer</h2>
            </div>
            <p>Are you sure you want to delete this answer? This action cannot be undone.</p>
            <div className={classes.modalActions}>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className={`${classes.modalButton} ${classes.cancelButton}`}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className={`${classes.modalButton} ${classes.deleteButton}`}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

export default AnswerPage;
