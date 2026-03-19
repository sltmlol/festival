// МАРШРУТЫ РЕГИОНОВ
const express = require('express');
const router = express.Router();
const Region = require('../models/Region');

router.get('/', async (req, res) => {
    try {
        const regions = await Region.findAll();
        res.json(regions);
    } catch (error) {
        console.error('Ошибка получения регионов:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

module.exports = router;