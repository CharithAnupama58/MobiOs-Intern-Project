import express from 'express';
import dotenv from 'dotenv';
import connection from './model/db.js';
import authRoutes from './Routes/authRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 4000;

// Function to check the database connection
async function checkDatabaseConnection() {
    try {
        const response = await connection.query('SELECT * FROM users');
        console.log('Database connection successful');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1); // Exit the process with a failure code
    }
}

// Start the server and check the database connection
app.listen(PORT, async () => {
    console.log(`Auth service running on port ${PORT}`);
    await checkDatabaseConnection(); // Check the database connection
});
