require("dotenv").config();
const mysql = require("mysql2/promise");
const connection = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST,
  user: process.env.MYSQLUSER || process.env.USER,
  password: process.env.MYSQLPASSWORD || process.env.PASSWORD,
  database: process.env.MYSQLDATABASE || process.env.DATABASE,
  port: process.env.MYSQLPORT || process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 5,
});

module.exports = connection;
