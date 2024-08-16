const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getAnswersForQuestion, postAnswer, updateAnswer, deleteAnswer, voteAnswer } = require('../Controller/answerController');

router.get('/:question_id', authMiddleware, getAnswersForQuestion);
router.post("/", authMiddleware, postAnswer);
router.put("/:answer_id", authMiddleware, updateAnswer);
router.delete("/:answer_id", authMiddleware, deleteAnswer);
router.post("/:answer_id/vote", authMiddleware, voteAnswer);

module.exports = router;
