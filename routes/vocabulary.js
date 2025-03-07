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

router.post("", vocabularyController.createWord);
router.put("/:id", vocabularyController.updateWord);
router.delete("/:id", vocabularyController.deleteWord);

module.exports = router;
