const { getConnection } = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid");

const postQuestion = async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required" });
  }

  if (!req.user || !req.user.userid) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    const questionid = uuidv4();
    const connection = getConnection();
    await connection.execute(
      "INSERT INTO questions(questionid, userid, title, description) VALUES (?, ?, ?, ?)",
      [questionid, req.user.userid, title, description]
    );
    console.log("Authenticated User ID:", req.user.userid);



    return res.status(201).json({ msg: "Question added successfully" });
  } catch (error) {
    console.error("Error in postQuestion:", error.message);
    return res.status(500).json({ error: "An error occurred while posting the question" });
  }
};

const getSingleQuestion = async (req, res) => {
  const { question_id } = req.params;

  try {
    const connection = getConnection();
    const [question] = await connection.execute(
      "SELECT * FROM questions WHERE questionid = ?",
      [question_id]
    );

    if (question.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: "Not Found",
        message: "The requested question could not be found."
      });
    }

    res.status(StatusCodes.OK).json({ question: question[0] });
  } catch (error) {
    console.error('Error in getSingleQuestion:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
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
    await connection.execute(
      "UPDATE questions SET title = ?, description = ? WHERE questionid = ? AND userid = ?",
      [title, description, question_id, req.user.userid]
    );

    return res.status(200).json({ msg: "Question updated successfully" });
  } catch (error) {
    console.error("Error in updateQuestion:", error.message);
    return res.status(500).json({ error: "An error occurred while updating the question" });
  }
};

module.exports = { getSingleQuestion, postQuestion, allQuestions, updateQuestion };

