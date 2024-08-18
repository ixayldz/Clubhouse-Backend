const express = require('express');
const { assignRole } = require('../controllers/roleController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:roomId', authMiddleware, assignRole);

module.exports = router;
