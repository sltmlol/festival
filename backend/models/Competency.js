// МОДЕЛЬ КОМПЕТЕНЦИЙ
const db = require('../config/database');

class Competency {
    static async findAll() {
        const [rows] = await db.execute(
            'SELECT * FROM competencies ORDER BY name'
        );
        return rows;
    }

    static async search(query) {
        const [rows] = await db.execute(
            'SELECT * FROM competencies WHERE name LIKE ? OR description LIKE ? ORDER BY name',
            [`%${query}%`, `%${query}%`]
        );
        return rows;
    }

    static async create(competencyData) {
        const { name, description, task_file } = competencyData;
        
        const [result] = await db.execute(
            'INSERT INTO competencies (name, description, task_file) VALUES (?, ?, ?)',
            [name, description, task_file || null]
        );
        return result.insertId;
    }

    static async update(id, competencyData) {
        const { name, description, task_file } = competencyData;
        
        const [result] = await db.execute(
            'UPDATE competencies SET name = ?, description = ?, task_file = ? WHERE id = ?',
            [name, description, task_file, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.execute(
            'DELETE FROM competencies WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }

    static async findById(id) {
        const [rows] = await db.execute(
            'SELECT * FROM competencies WHERE id = ?',
            [id]
        );
        return rows[0];
    }
}

module.exports = Competency;