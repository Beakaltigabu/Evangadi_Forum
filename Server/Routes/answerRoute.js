const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getAnswersForQuestion, postAnswer, updateAnswer } = require('../Controller/answerController');

router.get('/:question_id', authMiddleware, getAnswersForQuestion);
router.post("/", authMiddleware, postAnswer);
router.put("/:answer_id", authMiddleware, updateAnswer);

module.exports = router;
