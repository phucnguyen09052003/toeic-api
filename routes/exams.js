const express = require('express');
const router = express.Router();
const examsController = require('../controllers/examsController');

router.get('/level/:level', examsController.getExamsByLevel);
router.get('/',examsController.getAllExams)
router.get('/:examId', examsController.getExamById);
router.post('/create', examsController.createExam);
router.get('/results/user/:userId', examsController.getResultByUser);
router.post('/results/create', examsController.createExamResult);
router.put('/results/:resultId', examsController.updateExamResult);
router.get('/:examId', examsController.getExamDetails);
router.delete('/:examId', examsController.deleteExam);
router.post('/add-questions', examsController.addQuestionToExam);

module.exports = router;
