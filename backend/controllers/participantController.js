// КОНТРОЛЛЕР УЧАСТНИКОВ
const db = require('../config/database');
// ПОЛУЧЕНИЕ СПИСКА УЧАСТНИКОВ С ФИЛЬТРАЦИЕЙ
const getParticipants = async (req, res) => {
    try {
        const { name, competency_id, category, region_id } = req.query;
        let sql = `
            SELECT 
                u.id,
                u.lastname,
                u.firstname,
                u.middlename,
                u.category,
                u.photo,
                MAX(r.name) as region_name,
                MAX(c.name) as competency_name
            FROM users u
            LEFT JOIN regions r ON u.region_id = r.id
            LEFT JOIN applications a ON u.id = a.user_id AND a.status = 'approved'
            LEFT JOIN competencies c ON a.competency_id = c.id
            WHERE u.role = 'user'
        `;
        const params = [];
        if (name) {
            sql += ` AND (u.firstname LIKE ? OR u.lastname LIKE ?)`;
            params.push(`%${name}%`, `%${name}%`);
        }
        if (competency_id) {
            sql += ` AND a.competency_id = ?`;
            params.push(competency_id);
        }
        if (category) {
            sql += ` AND u.category = ?`;
            params.push(category);
        }
        if (region_id) {
            sql += ` AND u.region_id = ?`;
            params.push(region_id);
        }
        sql += ` GROUP BY u.id, u.lastname, u.firstname, u.middlename, u.category, u.photo
                 ORDER BY u.lastname, u.firstname`;
        console.log('SQL Query:', sql);
        console.log('Params:', params);
        const [rows] = await db.execute(sql, params);
        const participants = rows.map(row => ({
            id: row.id,
            firstname: row.firstname,
            lastname: row.lastname,
            middlename: row.middlename,
            category: row.category,
            region_name: row.region_name,
            competency_name: row.competency_name,
            photo: row.photo
        }));
        res.json(participants);
    } catch (error) {
        console.error('Ошибка в getParticipants:', error);
        res.status(500).json({ 
            message: 'Ошибка сервера',
            error: error.message
        });
    }
};

module.exports = { getParticipants };