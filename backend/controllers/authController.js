// КОНТРОЛЛЕР АУТЕНТИФИКАЦИИ
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const db = require('../config/database');
// ГЕНЕРАЦИЯ JWT ТОКЕНА
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};
// регистрация
const register = async (req, res) => {
    try {
        const { email, password, ...userData } = req.body;
        // проверка существующего пользователя
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
        }
        // хеш пароля
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // путь к фото 
        let photoPath = null;
        if (req.file) {
            photoPath = '/uploads/' + req.file.filename;
            console.log('Фото сохранено:', photoPath);
        }
        // создание пользователя
        const userId = await User.create({
            ...userData,
            email,
            password: hashedPassword,
            photo: photoPath
        });
        const user = await User.findById(userId);
        const token = generateToken(userId);
        res.status(201).json({
            message: 'Регистрация успешна',
            token,
            user: {
                id: user.id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role,
                photo: user.photo
            }
        });
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};
// авторизация
const login = async (req, res) => {
    try {
        const { login, password } = req.body; 
        // проверяем, что поля не пустые
        if (!login || !password) {
            return res.status(400).json({ 
                message: 'Введите логин и пароль' 
            });
        }
        let user;
        
        if (login.toLowerCase() === 'admin') {
            const [rows] = await db.execute(
                'SELECT * FROM users WHERE role = "admin" LIMIT 1'
            );
            user = rows[0];
        } else {
            user = await User.findByEmail(login);
        }
        // пользователь не найден
        if (!user) {
            return res.status(401).json({ 
                message: 'Неверный логин или пароль' 
            });
        }
        // сравниваем введенный пароль с хешем из базы
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ 
                message: 'Неверный логин или пароль' 
            });
        }
        // JWT токен
        const token = generateToken(user.id);
        // отправляем успешный ответ
        res.json({
            message: 'Вход выполнен успешно',
            token,
            user: {
                id: user.id,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role,
                photo: user.photo
            }
        });

    } catch (error) {
        console.error('Ошибка входа:', error);
        res.status(500).json({ 
            message: 'Ошибка сервера при входе' 
        });
    }
};
module.exports = { register, login };