const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getVotesForQuestion, voteAnswer } = require("../Controller/voteController");

router.get("/:question_id", authMiddleware, getVotesForQuestion);
router.post("/:answer_id/vote", authMiddleware, voteAnswer);

module.exports = router;

