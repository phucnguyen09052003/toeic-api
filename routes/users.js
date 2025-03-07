const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.get('', userController.getUser);
router.post('', userController.createUser);
router.post('/reset-password/:userId', userController.resetpassword);
router.get('/:username', userController.getUserByName);
router.delete('/:username', userController.deleteUser);

//chua check
router.put('/:username', userController.updateUser);
router.get('/question/:userId', userController.getUserQuestionsByUserId); // Thêm route mới
router.post('/question/create', userController.createUserQuestion);
router.put('/question/:id', userController.updateUserQuestion);
router.get('/question/:userId', userController.getUserQuestionsByUserId); 
router.get('/question/saved/:userId', userController.getSavedQuestions); 
module.exports = router;