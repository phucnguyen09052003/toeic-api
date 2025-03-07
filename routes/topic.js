const express = require('express');
const router = express.Router();
const topicsController = require('../controllers/topicsController');

/**
 * @swagger
 * tags:
 *   name: Topics
 *   description: API quản lý chủ đề
 */

/**
 * @swagger
 * /api/topic:
 *   get:
 *     summary: Lấy danh sách tất cả các chủ đề
 *     tags: [Topics]
 *     responses:
 *       200:
 *         description: Trả về danh sách chủ đề
 */
router.get('', topicsController.getAllTopics);

/**
 * @swagger
 * /api/topic:
 *   post:
 *     summary: Thêm một chủ đề mới
 *     tags: [Topics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               TopicID:
 *                  type: string
 *                  example: "TP00"
 *               Name:
 *                 type: string
 *                 example: "Grammar"
 *     responses:
 *       201:
 *         description: Chủ đề đã được tạo thành công
 */
router.post('', topicsController.addTopic);

/**
 * @swagger
 * /api/topic/{topicID}:
 *   put:
 *     summary: Cập nhật thông tin của một chủ đề
 *     tags: [Topics]
 *     parameters:
 *       - in: path
 *         name: topicID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của chủ đề cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *                 example: "Updated Grammar"
 *     responses:
 *       200:
 *         description: Chủ đề đã được cập nhật thành công
 */
router.put('/:topicID', topicsController.updateTopic);

/**
 * @swagger
 * /api/topic/{topicID}:
 *   delete:
 *     summary: Xóa một chủ đề
 *     tags: [Topics]
 *     parameters:
 *       - in: path
 *         name: topicID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của chủ đề cần xóa
 *     responses:
 *       200:
 *         description: Chủ đề đã được xóa thành công
 */
router.delete('/:topicID', topicsController.deleteTopic);

module.exports = router;
