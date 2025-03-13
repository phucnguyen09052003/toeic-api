const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: API quản lý User
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lấy danh sách User
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Trả về danh sách từ vựng
 */
router.get('', userController.getUser);

router.post('', userController.createUser);
router.post('/reset-password/:userId', userController.resetpassword);

/**
 * @swagger
 * /api/users/{username}:
 *   get:
 *     summary: Lấy thông tin user theo username
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username
 *     responses:
 *       200:
 *         description: Trả về thông tin user
 */
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