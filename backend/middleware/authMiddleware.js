// Проверка JWT токена в заголовках запроса, аутентификацию пользователя, проверку прав доступа

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id);
            
            if (!req.user) {
                return res.status(401).json({ message: 'Пользователь не найден' });
            }
            next();
        } catch (error) {
            console.error('Ошибка авторизации:', error);
            return res.status(401).json({ message: 'Не авторизован' });
        }
    } else {
        return res.status(401).json({ message: 'Не авторизован, нет токена' });
    }
};
// ПРОВЕРКА ПРАВ АДМИНИСТРАТОРА
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Доступ запрещен. Требуются права администратора' });
    }
};

module.exports = { protect, admin };