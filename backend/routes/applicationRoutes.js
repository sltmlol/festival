// МАРШРУТЫ ДЛЯ ЗАЯВОК
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createApplication, getMyApplications, cancelApplication } = require('../controllers/applicationController');

router.use(protect);

router.post('/', createApplication);
router.get('/my', getMyApplications);
router.delete('/:id', cancelApplication);

module.exports = router;