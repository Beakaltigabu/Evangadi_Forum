const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getSingleQuestion, postQuestion, allQuestions, updateQuestion } = require("../Controller/questionController");

router.get('/:question_id', authMiddleware, getSingleQuestion);
router.get("/", authMiddleware, allQuestions);
router.post("/", authMiddleware, postQuestion);
router.put("/:question_id", authMiddleware, updateQuestion);

module.exports = router;
