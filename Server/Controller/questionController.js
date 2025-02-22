const { getConnection } = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid");

const postQuestion = async (req, res) => {
  const { title, description } = req.body;
  const userid = req.user.userid;

  try {
    const connection = getConnection();
    const questionid = uuidv4();

    await connection.execute(
      "INSERT INTO questions(questionid, userid, title, description) VALUES (?, ?, ?, ?)",
      [questionid, userid, title, description]
    );

    return res.status(201).json({ msg: "Question added successfully" });
  } catch (error) {
    console.error("Error in postQuestion:", error.message);
    return res.status(500).json({ error: "An error occurred while posting the question" });
  }
};

const getSingleQuestion = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const [question] = await conn.execute(
      "SELECT * FROM questions WHERE questionid = ?",
      [req.params.question_id]
    );

    if (question.length === 0) {
      return res.status(404).json({
        error: "Not Found",
        message: "Question not found"
      });
    }

    res.status(200).json({ question: question[0] });
  } catch (error) {
    console.error('Error in getSingleQuestion:', error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message
    });
  }
};


const allQuestions = async (req, res) => {
  try {
    const connection = getConnection();
    const [questions] = await connection.execute(
      "SELECT q.title, q.description, q.questionid, u.username FROM questions q JOIN user u ON u.userid = q.userid ORDER BY q.id DESC"
    );

    return res.status(StatusCodes.OK).json({ questions });
  } catch (error) {
    console.error("Error in allQuestions:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred."
    });
  }
};

const updateQuestion = async (req, res) => {
  const { question_id } = req.params;
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required" });
  }

  try {
    const connection = getConnection();
    const [result] = await connection.execute(
      "UPDATE questions SET title = ?, description = ? WHERE questionid = ? AND userid = ?",
      [title, description, question_id, req.user.userid]
    );

    if (result.affectedRows === 0) {
      return res.status(403).json({ error: "You can only edit your own questions" });
    }

    return res.status(200).json({ msg: "Question updated successfully" });
  } catch (error) {
    console.error("Error in updateQuestion:", error.message);
    return res.status(500).json({ error: "An error occurred while updating the question" });
  }
};

const deleteQuestion = async (req, res) => {
  const { question_id } = req.params;

  try {
    const connection = getConnection();
    const [result] = await connection.execute(
      "DELETE FROM questions WHERE questionid = ? AND userid = ?",
      [question_id, req.user.userid]
    );

    if (result.affectedRows === 0) {
      return res.status(403).json({ error: "You can only delete your own questions" });
    }

    return res.status(200).json({ msg: "Question deleted successfully" });
  } catch (error) {
    console.error("Error in deleteQuestion:", error.message);
    return res.status(500).json({ error: "An error occurred while deleting the question" });
  }
};

module.exports = { getSingleQuestion, postQuestion, allQuestions, updateQuestion, deleteQuestion };
