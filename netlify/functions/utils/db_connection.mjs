import mysql from 'mysql2/promise';

export const connection =
  mysql.createPool({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    charset: 'utf8mb4',   // critical setting for emojis
    connectionLimit: 2,  // do not exceed 5, for low traffic 1-2 is optimum.
    maxIdel: 1,
    idleTimeout: 30000,  // 30 sec idle before closing
    enableKeepAlive: true,  // proactively checks connection health
    keepAliveInitialDelay: 20000, 
  });
