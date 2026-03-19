// МАРШРУТЫ КОМПЕТЕНЦИЙ
const express = require('express');
const router = express.Router();
const { getCompetencies, searchCompetencies, getCompetencyById } = require('../controllers/competencyController');

router.get('/', getCompetencies);
router.get('/search', searchCompetencies);
router.get('/:id', getCompetencyById);

module.exports = router;