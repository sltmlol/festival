// МАРШРУТЫ УЧАСТНИКОВ
const express = require('express');
const router = express.Router();
const { getParticipants } = require('../controllers/participantController');

router.get('/', getParticipants);

module.exports = router;