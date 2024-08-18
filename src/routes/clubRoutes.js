const express = require('express');
const { createClub, getClubs } = require('../controllers/clubController');

const router = express.Router();

router.post('/', createClub);
router.get('/', getClubs);

module.exports = router;
