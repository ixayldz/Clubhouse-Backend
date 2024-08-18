const express = require('express');
const { createEvent, getUpcomingEvents } = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createEvent);
router.get('/upcoming', authMiddleware, getUpcomingEvents);

module.exports = router;
