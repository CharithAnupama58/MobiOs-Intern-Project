import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../model/db.js';

export const register = async (req, res) => {
    const { regEmail, regPassword } = req.body;
    console.log(regEmail,regPassword);
    try {
        
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [regEmail]);
        console.log(rowa[0]);
        if (rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

      
        const hashedPassword = await bcrypt.hash(regPassword, 10);
        console.log(hashedPassword);

        await pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [regEmail, hashedPassword]);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(email,password);
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

        const user = rows[0];

        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
