require("dotenv").config();
const mysql = require("mysql2");
const { userTable, questionTable, answerTable } = require("../Models/mySqlTable");

// Create a connection pool
const myConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Convert the pool to use promises
const getConnection = () => {
  return myConnection.promise();
};

// Create tables if they don't exist
const createTables = async () => {
  try {
    const connection = getConnection();
    await connection.query(userTable);
    await connection.query(questionTable);
    await connection.query(answerTable);
    console.log("All tables created or already exist");
  } catch (err) {
    console.error("Error creating tables:", err.message);
    

  }
};

module.exports = { getConnection, createTables };
