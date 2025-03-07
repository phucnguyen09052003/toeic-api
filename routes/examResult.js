const express = require('express');
const router = express.Router();
const examResultsController = require('../controllers/examResultController');

// Lấy tất cả kết quả thi của một người dùng
router.get('/user/:userId', examResultsController.getResultsByUser);
router.post('/', examResultsController.createOrUpdateExamResult);
router.put('/:resultId', examResultsController.updateExamResult);


module.exports = router;
