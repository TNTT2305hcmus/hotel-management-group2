import mysql from 'mysql2/promise'; // Using mysql2 to support async/await
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config(); 

// Create a connection Pool (Better than a single connection)
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'HOTEL_MANAGEMENT',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4'
});

// Function to check connection (to be called in server.js)
export const connectDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("✅ MySQL CONNECTION SUCCESSFUL!");
        connection.release(); // Release connection back to the pool immediately
    } catch (err) {
        console.error("❌ DATABASE CONNECTION ERROR:", err.message);
        // Check if it's a password error or if Docker is not running
        if (err.code === 'ECONNREFUSED') {
            console.error("Check if Docker MySQL is running?");
        }
        process.exit(1);
    }
};

// Export pool for use in other Model/Service files
export default pool;