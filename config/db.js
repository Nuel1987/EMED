//import
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
);

// pool.connect(err => {
//     if (err) throw err;
//     console.log('MySQL Connected');
// });

module.exports = pool.promise();

