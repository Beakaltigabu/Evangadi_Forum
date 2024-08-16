const { getConnection } = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");

const getVotesForQuestion = async (req, res) => {
  const { question_id } = req.params;

  try {
    const connection = getConnection();
    const [votes] = await connection.execute(
      `SELECT v.answerid, v.vote
       FROM votes v
       JOIN answers a ON v.answerid = a.answerid
       WHERE a.questionid = ?`,
      [question_id]
    );

    const userVotes = votes.reduce((acc, vote) => {
      acc[vote.answerid] = vote.vote;
      return acc;
    }, {});

    return res.status(StatusCodes.OK).json({ votes: userVotes });
  } catch (error) {
    console.error("Error in getVotesForQuestion:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while fetching votes" });
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

      // Set the vote count in the answers table to 1 for upvote and 0 for downvote
      const newVoteCount = vote === 1 ? 1 : 0;
      await connection.execute(
        "UPDATE answers SET votes = ? WHERE answerid = ?",
        [newVoteCount, answer_id]
      );
    } else {
      // Insert the new vote
      await connection.execute(
        "INSERT INTO votes (answerid, userid, vote) VALUES (?, ?, ?)",
        [answer_id, userid, vote]
      );

      // Set the vote count in the answers table to 1 for upvote and 0 for downvote
      const newVoteCount = vote === 1 ? 1 : 0;
      await connection.execute(
        "UPDATE answers SET votes = ? WHERE answerid = ?",
        [newVoteCount, answer_id]
      );
    }

    return res.status(StatusCodes.OK).json({ msg: "Vote recorded successfully" });
  } catch (error) {
    console.error("Error in voteAnswer:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while voting" });
  }
};

module.exports = { getVotesForQuestion, voteAnswer };
