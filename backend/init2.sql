DROP DATABASE IF EXISTS festival_db;
CREATE DATABASE festival_db 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE festival_db;

-- таблица регионов
CREATE TABLE regions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- таблица пользователей
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lastname VARCHAR(50) NOT NULL,
    firstname VARCHAR(50) NOT NULL,
    middlename VARCHAR(50),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    education ENUM('secondary', 'secondary_special', 'higher') DEFAULT 'secondary',
    institution VARCHAR(200),
    region_id INT,
    photo VARCHAR(255),
    category ENUM('schoolboy', 'student', 'specialist') NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE SET NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- таблица компетенций
CREATE TABLE competencies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    task_file VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- таблица заявок
CREATE TABLE applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    competency_id INT NOT NULL,
    experience TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (competency_id) REFERENCES competencies(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO regions (name) VALUES 
('Москва'),
('Санкт-Петербург'),
('Московская область'),
('Ленинградская область'),
('Республика Татарстан'),
('Свердловская область'),
('Новосибирская область'),
('Краснодарский край'),
('Нижегородская область'),
('Самарская область');

INSERT INTO competencies (name, description) VALUES 
('Веб-дизайн', 'Создание современных интерфейсов и пользовательских решений.'),
('Разработка ПО', 'Программирование на различных языках и платформах.'),
('Кибербезопасность', 'Защита информации и предотвращение атак.'),
('Data Science', 'Анализ данных и машинное обучение.'),
('Мобильная разработка', 'Создание приложений для iOS и Android.');

-- пароль для админа: passadmin
-- пароль для пользователей: user123 

-- хеши паролей
-- passadmin = $2a$10$KnymnazMoDtVbW81Pr7wju0D4.ECwKLRhJ9SsBOTTODIPY6Gt7DG2
-- user123 = $2a$10$KnymnazMoDtVbW81Pr7wjuWlXdxFsReM2mU0Ou6nmEuCUdQc1hILq

-- создаем администратора
INSERT INTO users (lastname, firstname, middlename, email, password, education, institution, region_id, category, role) VALUES 
('Админ', 'Админ', 'Админович', 'admin@festival.ru', '$2a$10$KnymnazMoDtVbW81Pr7wju0D4.ECwKLRhJ9SsBOTTODIPY6Gt7DG2', 'higher', 'Административная академия', 1, 'specialist', 'admin');

INSERT INTO users (lastname, firstname, middlename, email, password, education, institution, region_id, category, role) VALUES 
('Иванов', 'Иван', 'Иванович', 'ivan@example.com', '$2a$10$KnymnazMoDtVbW81Pr7wjuWlXdxFsReM2mU0Ou6nmEuCUdQc1hILq', 'higher', 'МГУ', 1, 'student', 'user'),
('Петрова', 'Мария', 'Сергеевна', 'maria@example.com', '$2a$10$KnymnazMoDtVbW81Pr7wjuWlXdxFsReM2mU0Ou6nmEuCUdQc1hILq', 'secondary_special', 'Колледж №54', 2, 'schoolboy', 'user'),
('Сидоров', 'Петр', 'Алексеевич', 'petr@example.com', '$2a$10$KnymnazMoDtVbW81Pr7wjuWlXdxFsReM2mU0Ou6nmEuCUdQc1hILq', 'higher', 'СПбГУ', 2, 'specialist', 'user');

INSERT INTO applications (user_id, competency_id, experience, status) VALUES 
(11, 11, 'Создал приложение на Flutter', 'pending'),
(12, 10, 'Участие в хакатонах', 'approved'),
(13, 9, 'Сертификаты по безопасности', 'pending');