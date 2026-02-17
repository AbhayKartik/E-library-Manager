require("dotenv").config();
const mysql = require("mysql2");
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
});

module.exports = connection;
