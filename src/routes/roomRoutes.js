const express = require('express');
const { createRoom, getRooms, getRoomById } = require('../controllers/roomController');
const { checkRole } = require('../middleware/roleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createRoom);
router.get('/', authMiddleware, getRooms);
router.get('/:id', authMiddleware, getRoomById);

// Example: Only moderators can invite users to a room
router.post('/:roomId/invite', authMiddleware, checkRole('moderator'), (req, res) => {
  // Invitation logic goes here
  res.send('User invited');
});

module.exports = router;
