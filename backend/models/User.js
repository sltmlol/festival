// МОДЕЛЬ ПОЛЬЗОВАТЕЛЕЙ
const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    static async create(userData) {
        const { lastname, firstname, middlename, email, password, 
                education, institution, region_id, category, photo } = userData;
        
        const [result] = await db.execute(
            `INSERT INTO users (lastname, firstname, middlename, email, password, 
                              education, institution, region_id, category, photo) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [lastname, firstname, middlename || null, email, password, 
             education || 'secondary', institution || null, region_id || null, category, photo || null]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.execute(
            `SELECT u.*, r.name as region_name 
             FROM users u 
             LEFT JOIN regions r ON u.region_id = r.id 
             WHERE u.id = ?`,
            [id]
        );
        return rows[0];
    }

    static async updatePhoto(id, photoPath) {
        const [result] = await db.execute(
            'UPDATE users SET photo = ? WHERE id = ?',
            [photoPath, id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = User;