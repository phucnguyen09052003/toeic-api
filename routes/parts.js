const express = require('express');
const partsController = require('../controllers/partsController');
const router = express.Router();

// Route lấy danh sách Parts
router.get('', partsController.getAllParts);
router.post('', partsController.addPart);
router.put('/:id', partsController.updatePart);
router.delete('/:id', partsController.deletePart);

module.exports = router;
