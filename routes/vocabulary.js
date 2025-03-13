const express = require("express");
const router = express.Router();
const vocabularyController = require("../controllers/vocabularyController");

/**
 * @swagger
 * tags:
 *   name: Vocabulary
 *   description: API quản lý từ vựng
 */

/**
 * @swagger
 * /api/vocabulary:
 *   get:
 *     summary: Lấy danh sách tất cả từ vựng
 *     tags: [Vocabulary]
 *     responses:
 *       200:
 *         description: Trả về danh sách từ vựng
 */
router.get("", vocabularyController.getAllVocabulary);

/**
 * @swagger
 * /api/vocabulary/{id}:
 *   get:
 *     summary: Lấy từ vựng theo ID
 *     tags: [Vocabulary]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của từ vựng
 *     responses:
 *       200:
 *         description: Trả về thông tin từ vựng
 */
router.get("/:id", vocabularyController.getWordById);

/**
 * @swagger
 * /api/vocabulary/topic/{topicId}:
 *   get:
 *     summary: Lấy danh sách từ vựng theo chủ đề
 *     tags: [Vocabulary]
 *     parameters:
 *       - in: path
 *         name: topicId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của chủ đề
 *     responses:
 *       200:
 *         description: Trả về danh sách từ vựng theo chủ đề
 */
router.get("/topic/:topicId", vocabularyController.getVocabularyByTopic);
/**
 * @swagger
 * /api/vocabulary:
 *   post:
 *     summary: Thêm một chủ đề mới
 *     tags: [Vocabulary]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               WordID:
 *                  type: string
 *                  example: "1"
 *               Word:
 *                 type: string
 *                 example: "Airport"
 *               Translation:
 *                 type: string
 *                 example: "Sân bay"
 *               TopicID:
 *                 type: string
 *                 example: "TP01"
 *               Image:
 *                 type: string
 *                 example: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDNst0wFSgr9qSPnI9pmjemMnKgHxShpSVUw&s"
 *     responses:
 *       201:
 *         description: Chủ đề đã được tạo thành công
 */
router.post("", vocabularyController.createWord);

/**
 * @swagger
 * /api/vocabulary/{WordID}:
 *   put:
 *     summary: Cập nhật thông tin của từ vựng
 *     tags: [Vocabulary]
 *     parameters:
 *       - in: path
 *         name: WordID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của từ cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Word:
 *                 type: string
 *                 example: "Updated Word"
 *               Translation:
 *                 type: string
 *                 example: "Updated Translation"
 *               TopicID:
 *                 type: string
 *                 example: "TP02"
 *               Image:
 *                 type: string
 *                 example: "https://cdn.shopify.com/s/files/1/0373/9909/articles/checked_vs_carry-on_luggage-10.jpg?v=1643026788&width=786&height=540&crop=center"
 *     responses:
 *       200:
 *         description: Chủ đề đã được cập nhật thành công
 */
router.put("/:id", vocabularyController.updateWord);
/**
 * @swagger
 * /api/vocabulary/{WordID}:
 *   delete:
 *     summary: Xóa một từ vựng
 *     tags: [Vocabulary]
 *     parameters:
 *       - in: path
 *         name: WordID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của từ vựng cần xóa
 *     responses:
 *       200:
 *         description: Từ vựng đã được xóa thành công
 */
router.delete("/:id", vocabularyController.deleteWord);

module.exports = router;
