import express from 'express';
import dotenv from 'dotenv';
import connection from './model/db.js';
import nicRoutes from './Routes/nicRoutes.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.json());
app.use(cors()); 
app.use('/nicRoutes', nicRoutes);

const PORT = process.env.PORT || 4100;


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
    console.log(`NIC Validation service running on port ${PORT}`);
    await checkDatabaseConnection(); 
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
