import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { FaArrowCircleRight, FaAngleLeft, FaAngleRight } from "react-icons/fa";
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


  const fetchQuestionAndAnswers = async () => {
    try {

      const questionResponse = await api.get(`/questions/${id}`);
      setQuestion(questionResponse.data.question);


      const answersResponse = await api.get(`/answers/${id}`);
      setAnswers(answersResponse.data.answers);
    } catch (err) {
      setError("Error fetching data");
      console.error("Error fetching question and answers: ", err);
    }
  };

  useEffect(() => {
    fetchQuestionAndAnswers();
  }, [id]);

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
          id: response.data.id,
          username: "You",
          answer: answer,
          created_at: new Date().toISOString(),
        },
      ]);

      alert("Answer submitted successfully");
      answerRef.current.value = "";
    } catch (error) {
      console.error("Error submitting answer: ", error);
      alert("Something went wrong while submitting the answer");
    }
  };


  const indexOfLastAnswer = currentPage * answersPerPage;
  const indexOfFirstAnswer = indexOfLastAnswer - answersPerPage;
  const currentAnswers = answers.slice(indexOfFirstAnswer, indexOfLastAnswer);

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
                <div key={answer.id} className="answer-box">
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
                    <p className="answer-timestamp">Posted at: {new Date(answer.created_at).toLocaleString()}</p>
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
        </>
      )}
    </div>
  );
}

export default AnswerPage;
