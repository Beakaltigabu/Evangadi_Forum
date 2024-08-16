import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { FaArrowCircleRight, FaAngleLeft, FaAngleRight, FaEdit, FaTrash, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { RiAccountCircleFill } from "react-icons/ri";
import api from "../../axios";
import "./AnswerPage.css";

function AnswerPage() {
  const { id } = useParams();
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [answersPerPage] = useState(5);
  const answerRef = useRef();
  const [currentUser, setCurrentUser] = useState(null);
  const [editingAnswer, setEditingAnswer] = useState(null);
  const [editText, setEditText] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [answerToDelete, setAnswerToDelete] = useState(null);
  const [userVotes, setUserVotes] = useState({});

  const fetchQuestionAndAnswers = async () => {
    try {
      const questionResponse = await api.get(`/questions/${id}`);
      setQuestion(questionResponse.data.question);

      const answersResponse = await api.get(`/answers/${id}`);
      setAnswers(answersResponse.data.answers);

      const userVotesResponse = await api.get(`/votes/${id}`);
      setUserVotes(userVotesResponse.data.votes);
    } catch (err) {
      setError("Error fetching data");
      console.error("Error fetching question and answers: ", err);
    }
  };

  useEffect(() => {
    fetchQuestionAndAnswers();
    fetchCurrentUser();
  }, [id]);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/users/check');
      setCurrentUser(response.data.username);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    const answer = answerRef.current.value;

    if (!answer) {
      alert("Please provide an answer");
      return;
    }

    try {
      const response = await api.post(`/answers`, {
        question_id: id,
        answer: answer,
      });

      setAnswers((prevAnswers) => [
        ...prevAnswers,
        {
          answerid: response.data.id,
          username: currentUser,
          answer: answer,
          created_at: new Date().toISOString(),
          votes: 0,
        },
      ]);

      alert("Answer submitted successfully");
      answerRef.current.value = "";
    } catch (error) {
      console.error("Error submitting answer: ", error);
      alert("Something went wrong while submitting the answer");
    }
  };

  const handleEdit = (answer) => {
    setEditingAnswer(answer);
    setEditText(answer.answer);
  };

  const handleUpdate = async () => {
    if (!editingAnswer || !editingAnswer.answerid) {
      console.error("No answer selected for editing");
      return;
    }

    try {
      console.log(`Updating answer with ID: ${editingAnswer.answerid}`);
      await api.put(`/answers/${editingAnswer.answerid}`, { answer: editText });
      fetchQuestionAndAnswers();
      setEditingAnswer(null);
    } catch (error) {
      console.error("Error updating answer:", error);
    }
  };

  const handleDelete = async () => {
    if (!answerToDelete) return;

    try {
      await api.delete(`/answers/${answerToDelete}`);
      fetchQuestionAndAnswers();
      setIsDeleteModalOpen(false);
      setAnswerToDelete(null);
    } catch (error) {
      console.error("Error deleting answer:", error);
    }
  };

  const handleVote = async (answerid, vote) => {
    try {
      const response = await api.post(`/answers/${answerid}/vote`, { vote });
      if (response.data.error) {
        alert(response.data.error);
      } else {
        fetchQuestionAndAnswers();
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const openDeleteModal = (answerid) => {
    setAnswerToDelete(answerid);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setAnswerToDelete(null);
  };

  const indexOfLastAnswer = currentPage * answersPerPage;
  const indexOfFirstAnswer = indexOfLastAnswer - answersPerPage;
  const currentAnswers = answers
    .sort((a, b) => b.votes - a.votes)
    .slice(indexOfFirstAnswer, indexOfLastAnswer);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="answer-page">
      {error && <div className="error">{error}</div>}
      {!error && (
        <>
          <div className="question-section">
            <h1>QUESTION</h1>
            <div className="question-title">
              <FaArrowCircleRight className="arrow-icon" />
              <h2>
                <span>{question.title}</span>
              </h2>
            </div>
            <p>{question.description}</p>
          </div>
          <div className="answers-section">
            <h4 className="community-answers">Answer From The Community</h4>
            {currentAnswers.length > 0 ? (
              currentAnswers.map((answer) => (
                <div key={answer.answerid} className="answer-box">
                  <div className="user-icon">
                    <RiAccountCircleFill />
                    <p className="answer-username">
                      <strong>{answer.username}</strong>
                    </p>
                  </div>
                  <div className="answer-content">
                    <div className="answer-header">
                      <p className="answer-text">{answer.answer}</p>
                    </div>
                    <div className="answer-footer">
                      <p className="answer-timestamp">Posted at: {new Date(answer.created_at).toLocaleString()}</p>
                      <div className="vote-buttons">
                        <FaArrowUp
                          className={`vote-icon ${userVotes[answer.answerid] === 1 ? "disabled" : ""}`}
                          onClick={() => handleVote(answer.answerid, 1)}
                          disabled={userVotes[answer.answerid] === 1}
                        />
                        <span className="vote-count">{userVotes[answer.answerid] === 1 ? 1 : 0}</span>
                        <FaArrowDown
                          className={`vote-icon ${userVotes[answer.answerid] === -1 ? "disabled" : ""}`}
                          onClick={() => handleVote(answer.answerid, -1)}
                          disabled={userVotes[answer.answerid] === -1}
                        />
                      </div>
                      {currentUser === answer.username && (
                        <div className="answer-actions">
                          <FaEdit className="edit-icon" onClick={() => handleEdit(answer)} />
                          <FaTrash className="delete-icon" onClick={() => openDeleteModal(answer.answerid)} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No answers yet.</p>
            )}
          </div>
          <div className="pagination">
            <FaAngleLeft
              className={`paginationIcon ${currentPage === 1 ? "disabled" : ""}`}
              onClick={() => paginate(currentPage - 1)}
            />
            <span className="page-number">{currentPage}</span>
            <FaAngleRight
              className={`paginationIcon ${indexOfLastAnswer >= answers.length ? "disabled" : ""}`}
              onClick={() => paginate(currentPage + 1)}
            />
          </div>
          <div className="answer-form-section">
            <form onSubmit={handleAnswerSubmit}>
              <textarea
                ref={answerRef}
                placeholder="Your answer ..."
                rows="4"
                required
              ></textarea>
              <button type="submit">Post Answer</button>
            </form>
          </div>
          {editingAnswer && (
            <div className="modal">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
              <div className="modal-buttons">
                <button onClick={() => setEditingAnswer(null)}>Cancel</button>
                <button onClick={handleUpdate}>Update</button>
              </div>
            </div>
          )}
          {isDeleteModalOpen && (
            <div className="modal">
              <p>Are you sure you want to delete this answer?</p>
              <div className="modal-buttons">
                <button onClick={closeDeleteModal}>Cancel</button>
                <button onClick={handleDelete}>Delete</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AnswerPage;
