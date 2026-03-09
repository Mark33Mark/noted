import mysql from 'mysql2/promise';

export const connection =
  mysql.createPool({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    connectionLimit: 10,  // Manage multiple connections efficiently
    charset: 'utf8mb4',   // CRITICAL FOR EMOJIS
  });
