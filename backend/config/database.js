const mysql = require('mysql2');
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'festival_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4'
});
const promisePool = pool.promise();

// Тест подключения
const testConnection = async () => {
    try {
        const connection = await promisePool.getConnection();
        console.log('База данных подключена');
        await connection.query('SET NAMES utf8mb4');
        connection.release();
        return true;
    } catch (error) {
        console.error('Ошибка подключения к БД:', error.message);
        return false;
    }
};
testConnection();
module.exports = promisePool;