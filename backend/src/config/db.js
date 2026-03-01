const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  host:process.env.DB_HOST,
  user:process.env.DB_USER,
  password:process.env.DB_PASSWORD,
  database:process.env.DB_NAME
});

console.log("Connected to MySQL Database");


module.exports = db;
