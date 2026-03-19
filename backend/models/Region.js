// МОДЕЛЬ РЕГИОНОВ
const db = require('../config/database');
class Region {
    static async findAll() {
        const [rows] = await db.execute('SELECT * FROM regions ORDER BY name');
        return rows;
    }
}

module.exports = Region;