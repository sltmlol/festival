
//  Контроллер для управления заявками на участие в фестивале
//  Обрабатывает создание, просмотр и отмену заявок

const Application = require('../models/Application');

// СОЗДАНИЕ НОВОЙ ЗАЯВКИ
const createApplication = async (req, res) => {
    try {
        const { competency_id, experience } = req.body;
        const user_id = req.user.id;
        if (!competency_id) {
            return res.status(400).json({ message: 'Выберите компетенцию' });
        }
        const applicationId = await Application.create({
            user_id,
            competency_id,
            experience
        });
        res.status(201).json({
            message: 'Заявка успешно создана',
            applicationId
        });
    } catch (error) {
        console.error('Ошибка создания заявки:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};
// ПОЛУЧЕНИЕ ВСЕХ ЗАЯВОК ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.findByUserId(req.user.id);
        res.json(applications);
    } catch (error) {
        console.error('Ошибка получения заявок:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};
// ОТМЕНА ЗАЯВКИ (удаление, если статус 'pending')
const cancelApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const cancelled = await Application.cancel(id, req.user.id);
        if (!cancelled) {
            return res.status(404).json({ 
                message: 'Заявка не найдена или не может быть отменена' 
            });
        }
        res.json({ message: 'Заявка отменена' });
    } catch (error) {
        console.error('Ошибка отмены заявки:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};
module.exports = { createApplication, getMyApplications, cancelApplication };