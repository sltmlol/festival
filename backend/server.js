const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');
const multer = require('multer');

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// НАСТРОЙКА MULTER ДЛЯ ЗАГРУЗКИ ФОТО
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'uploads');
        // Создаем папку uploads, если её нет
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
            console.log('✅ Папка uploads создана');
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'photo-' + uniqueSuffix + ext);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Только изображения разрешены'), false);
        }
    }
});

// ТЕСТОВЫЙ МАРШРУТ
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Сервер работает!',
        time: new Date().toLocaleString()
    });
});

// API МАРШРУТЫ
const authController = require('./controllers/authController');
app.post('/api/auth/register', upload.single('photo'), authController.register);
app.post('/api/auth/login', authController.login);
app.use('/api/competencies', require('./routes/competencyRoutes'));
app.use('/api/participants', require('./routes/participantRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/regions', require('./routes/regionRoutes'));

// СТАТИЧЕСКИЕ ФАЙЛЫ
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// ОБРАБОТКА 404 ДЛЯ API
app.use('/api/*', (req, res) => {
    res.status(404).json({ message: 'API маршрут не найден' });
});

// ВСЕ ОСТАЛЬНЫЕ МАРШРУТЫ
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ОБРАБОТКА ОШИБОК
app.use((err, req, res, next) => {
    console.error('Ошибка:', err);
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'Файл слишком большой. Максимум 5MB' });
        }
    }
    res.status(500).json({ 
        message: 'Ошибка сервера',
        error: err.message 
    });
});

// ЗАПУСК СЕРВЕРА
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`СЕРВЕР ЗАПУЩЕН НА http://localhost:${PORT}`);
    console.log('\nAPI МАРШРУТЫ:');
    console.log(`   POST http://localhost:${PORT}/api/auth/register - регистрация`);
    console.log(`   POST http://localhost:${PORT}/api/auth/login - вход`);
    console.log(`   GET  http://localhost:${PORT}/api/regions - регионы`);
    console.log(`   GET  http://localhost:${PORT}/api/competencies - компетенции`);
    console.log(`   GET  http://localhost:${PORT}/api/participants - участники`);
});