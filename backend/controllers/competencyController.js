// КОНТРОЛЛЕР КОМПЕТЕНЦИЙ
const Competency = require('../models/Competency');
// ПОЛУЧЕНИЕ ВСЕХ КОМПЕТЕНЦИЙ
const getCompetencies = async (req, res) => {
    try {
        const competencies = await Competency.findAll();
        res.json(competencies);
    } catch (error) {
        console.error('Ошибка получения компетенций:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};
// ПОИСК КОМПЕТЕНЦИЙ ПО КЛЮЧЕВЫМ СЛОВАМ
const searchCompetencies = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.json([]);
        }
        
        const competencies = await Competency.search(q);
        res.json(competencies);
    } catch (error) {
        console.error('Ошибка поиска компетенций:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};
// ПОЛУЧЕНИЕ КОМПЕТЕНЦИИ ПО ID
const getCompetencyById = async (req, res) => {
    try {
        const { id } = req.params;
        const competency = await Competency.findById(id);  
        if (!competency) {
            return res.status(404).json({ message: 'Компетенция не найдена' });
        }    
        res.json(competency);
    } catch (error) {
        console.error('Ошибка получения компетенции:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};
// АДМИН-ПАНЕЛЬ: УПРАВЛЕНИЕ КОМПЕТЕНЦИЯМИ
const addCompetency = async (req, res) => {
    try {
        const { name, description } = req.body;
        const task_file = req.file ? req.file.filename : null;
        if (!name || !description) {
            return res.status(400).json({ message: 'Заполните обязательные поля' });
        }
        const competencyId = await Competency.create({
            name,
            description,
            task_file
        });
        res.status(201).json({
            message: 'Компетенция добавлена',
            competencyId
        });
    } catch (error) {
        console.error('Ошибка добавления компетенции:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

const deleteCompetency = async (req, res) => {
    try {
        const { id } = req.params; 
        const deleted = await Competency.delete(id);       
        if (!deleted) {
            return res.status(404).json({ message: 'Компетенция не найдена' });
        }
        res.json({ message: 'Компетенция удалена' });
    } catch (error) {
        console.error('Ошибка удаления компетенции:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

module.exports = { 
    getCompetencies, 
    searchCompetencies, 
    getCompetencyById,
    addCompetency, 
    deleteCompetency 
};