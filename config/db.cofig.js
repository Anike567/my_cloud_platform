const mysql = require('mysql2/promise');
const os = require('os');
/**
 * 
 * Database configuration using environment variables.
 * this will create a connection pool with 10 connections.
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: os.platform() === "darwin" ? "your_password" : process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the connection immediately on startup
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Connected to MySQL Database successfully.');
        connection.release(); // Return the connection to the pool
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
        process.exit(1); // Stop the server if DB is not reachable
    }
};



module.exports = {pool, testConnection};