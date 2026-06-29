const mysql = require('mysql2/promise'); // promise gives the async/await

require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true, // if all 10 used, the other will be in queue,
    connectionLimit: 10, // 10 user at a time
    queueLimit: 0,
    port: process.env.DB_PORT,

});
module.exports = pool;