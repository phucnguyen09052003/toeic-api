const express = require('express');
const router = express.Router();
const questionsController = require('../controllers/questionsController');

// Route lấy câu hỏi theo part
router.get('/part/:part', questionsController.getQuestionsByPart);
router.get('/random/:part/:examQuestion', questionsController.getRandomQuestionByPart);

router.get('/random', questionsController.getRandomQuestions);
// Lấy thống kê câu hỏi của người dùng
router.get('/user-question-stats/:userId', questionsController.getUserQuestionStats);
router.get('/group', questionsController.getRandomQuestionsByPartAndLevel);
// Lấy nhóm câu hỏi ngẫu nhiên bằng Stored Procedure
router.get('/random-group/:partId', questionsController.getRandomGroupByStoredProc);
router.get('/exam/:examId/', questionsController.getQuestionsByExamId);
router.get('/group-question/:questionId/', questionsController.getGroupQuestionById);
// Lấy group câu hỏi
router.get('/question-groups', questionsController.getQuestionsGroups);


router.post('/create', questionsController.createQuestion);
router.put('/update/:id', questionsController.updateQuestion);
router.delete('/delete/:id', questionsController.deleteQuestion);
router.get('/paging', questionsController.getQuestions); // Fetch paginated questions

router.get('/group/get/:groupId', questionsController.getQuestionGroupById); // Lấy thông tin 1 nhóm
router.post('/group/create', questionsController.createQuestionGroup); // Tạo nhóm mới
router.put('/group/update/:id', questionsController.updateQuestionGroup); // Cập nhật nhóm
router.delete('/group/delete/:id', questionsController.deleteQuestionGroup); // Xóa nhóm
router.get('/group/paging', questionsController.getPaginatedQuestionGroups); // Lấy danh sách nhóm với phân trang

module.exports = router;
