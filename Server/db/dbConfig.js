const mysql = require('mysql2/promise');
const { userTable, questionTable, answerTable, voteTable } = require('../Models/mySqlTable');

let connection;
const getConnection = () => {
  if (!connection) {
    connection = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 3, 
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });
  }
  return connection;
};


const createTables = async () => {
  const conn = getConnection();
  try {
    await conn.execute(userTable);
    await conn.execute(questionTable);
    await conn.execute(answerTable);
    await conn.execute(voteTable);
    console.log('All tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error.message);
  }
};

module.exports = { getConnection, createTables };
