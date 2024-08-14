import express from 'express';
import dotenv from 'dotenv';
import connection from './model/db.js';
import authRoutes from './Routes/authRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); 
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 4000;


async function checkDatabaseConnection() {
    try {
        const response = await connection.query('SELECT * FROM users');
        console.log('Database connection successful');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1); 
    }
}


app.listen(PORT, async () => {
    console.log(`Auth service running on port ${PORT}`);
    await checkDatabaseConnection(); 
});
