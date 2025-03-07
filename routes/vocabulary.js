const express = require('express');
const router = express.Router();
const vocabularyController = require('../controllers/vocabularyController');

// Route lấy danh sách từ vựng
router.get('', vocabularyController.getAllVocabulary);

// Route thêm từ vựng mới
router.post('', vocabularyController.createWord);
router.put('/:id', vocabularyController.updateWord);
router.delete('/:id', vocabularyController.deleteWord);
// Route lấy từ vựng theo TopicID
router.get('/topic/:topicId', vocabularyController.getVocabularyByTopic);

module.exports = router;
