const { getConnection } = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid");

const getAnswersForQuestion = async (req, res) => {
  const { question_id } = req.params;

  try {
    const allAnswersForQuestion = `
      SELECT username, answer, created_at FROM
        answers JOIN user
          ON answers.userid = user.userid
        WHERE answers.questionid = ?
    `;
    const connection = getConnection();
    const [answers] = await connection.query(allAnswersForQuestion, [question_id]);

    return res.status(StatusCodes.OK).json({ answers });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Some error occurred. Please try again" });
  }
};

const postAnswer = async (req, res) => {
  const { question_id, answer } = req.body;
  const userid = req.user.userid;

  if (!question_id || !answer) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Please provide answer" });
  }

  try {
    const answerid = uuidv4();
    const connection = getConnection();
    await connection.query(
      "INSERT INTO answers (answerid, questionid, answer, userid) VALUES (?, ?, ?, ?)",
      [answerid, question_id, answer, userid]
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "Answer posted successfully" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Some error occurred. Please try again" });
  }
};

const updateAnswer = async (req, res) => {
  const { answer_id } = req.params;
  const { answer } = req.body;

  if (!answer) {
    return res.status(400).json({ error: "Answer is required" });
  }

  try {
    const connection = getConnection();
    await connection.execute(
      "UPDATE answers SET answer = ? WHERE answerid = ? AND userid = ?",
      [answer, answer_id, req.user.userid]
    );

    return res.status(200).json({ msg: "Answer updated successfully" });
  } catch (error) {
    console.error("Error in updateAnswer:", error.message);
    return res.status(500).json({ error: "An error occurred while updating the answer" });
  }
};

module.exports = { getAnswersForQuestion, postAnswer, updateAnswer };
