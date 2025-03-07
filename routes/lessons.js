const express = require('express');
const router = express.Router();
const lessonsController = require('../controllers/lessonsController');


router.get('', lessonsController.getLesson);
router.post('', lessonsController.addLesson);
router.put('/:id', lessonsController.updateLesson);
router.delete('/:id', lessonsController.deleteLesson);


module.exports = router;