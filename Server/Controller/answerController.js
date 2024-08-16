const { getConnection } = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid");

const getAnswersForQuestion = async (req, res) => {
  const { question_id } = req.params;

  try {
    const allAnswersForQuestion = `
      SELECT username, answer, created_at, votes, answerid FROM
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

const deleteAnswer = async (req, res) => {
  const { answer_id } = req.params;

  try {
    const connection = getConnection();
    await connection.execute(
      "DELETE FROM answers WHERE answerid = ? AND userid = ?",
      [answer_id, req.user.userid]
    );

    return res.status(200).json({ msg: "Answer deleted successfully" });
  } catch (error) {
    console.error("Error in deleteAnswer:", error.message);
    return res.status(500).json({ error: "An error occurred while deleting the answer" });
  }
};

const voteAnswer = async (req, res) => {
  const { answer_id } = req.params;
  const { vote } = req.body; // 1 for upvote, -1 for downvote
  const userid = req.user.userid;

  if (vote !== 1 && vote !== -1) {
    return res.status(400).json({ error: "Invalid vote value" });
  }

  try {
    const connection = getConnection();

    // Check if the user has already voted on this answer
    const [existingVote] = await connection.execute(
      "SELECT vote FROM votes WHERE answerid = ? AND userid = ?",
      [answer_id, userid]
    );

    if (existingVote.length > 0) {
      // If the user has already voted, update the existing vote
      await connection.execute(
        "UPDATE votes SET vote = ? WHERE answerid = ? AND userid = ?",
        [vote, answer_id, userid]
      );

      // Adjust the vote count in the answers table
      const voteDifference = vote - existingVote[0].vote;
      await connection.execute(
        "UPDATE answers SET votes = votes + ? WHERE answerid = ?",
        [voteDifference, answer_id]
      );
    } else {
      // Insert the new vote
      await connection.execute(
        "INSERT INTO votes (answerid, userid, vote) VALUES (?, ?, ?)",
        [answer_id, userid, vote]
      );

      // Update the vote count in the answers table
      await connection.execute(
        "UPDATE answers SET votes = votes + ? WHERE answerid = ?",
        [vote, answer_id]
      );
    }


    return res.status(StatusCodes.OK).json({ msg: "Vote recorded successfully" });
  } catch (error) {
    console.error("Error in voteAnswer:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while voting" });
  }
};

module.exports = { getAnswersForQuestion, postAnswer, updateAnswer, deleteAnswer, voteAnswer };
