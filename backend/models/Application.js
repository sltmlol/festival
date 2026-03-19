// МОДЕЛЬ ЗАЯВОК
const db = require('../config/database');
class Application {
    static async create(applicationData) {
        const { user_id, competency_id, experience } = applicationData;
        
        const [result] = await db.execute(
            'INSERT INTO applications (user_id, competency_id, experience) VALUES (?, ?, ?)',
            [user_id, competency_id, experience || null]
        );
        
        return result.insertId;
    }

    static async findByUserId(userId) {
        const [rows] = await db.execute(
            `SELECT a.*, c.name as competency_name 
             FROM applications a 
             JOIN competencies c ON a.competency_id = c.id 
             WHERE a.user_id = ? 
             ORDER BY a.created_at DESC`,
            [userId]
        );
        return rows;
    }

    static async cancel(id, userId) {
        const [result] = await db.execute(
            'DELETE FROM applications WHERE id = ? AND user_id = ? AND status = "pending"',
            [id, userId]
        );
        return result.affectedRows > 0;
    }

    static async findAll() {
        const [rows] = await db.execute(
            `SELECT a.*, c.name as competency_name, 
                    u.lastname, u.firstname, u.email
             FROM applications a 
             JOIN competencies c ON a.competency_id = c.id 
             JOIN users u ON a.user_id = u.id 
             ORDER BY a.created_at DESC`
        );
        return rows;
    }

    static async updateStatus(id, status) {
        const [result] = await db.execute(
            'UPDATE applications SET status = ? WHERE id = ?',
            [status, id]
        );
        return result.affectedRows > 0;
    }
}

module.exports = Application;