const express = require('express');
const router = express.Router();
const userQuestion = require('../controllers/userController');


router.get('/question/:userId', userQuestion.getUserQuestionsByUserId); // Thêm route mới
router.post('/question/create', userQuestion.createUserQuestion);
router.put('/question/:id', user.updateUserQuestion);
router.delete('/question/delete/:id', user.deleteUserQuestion);

module.exports = router;
