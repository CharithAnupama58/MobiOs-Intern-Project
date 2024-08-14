import jwt from 'jsonwebtoken';
import pool from '../model/db.js';

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; 
    
    if (!token) return res.status(401).json({ message: 'No token provided' });
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });
        req.user = decoded; 
        next();
    });
};

export const validateResetToken = async (req, res, next) => {
    const { token } = req.params;
    console.log(token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);

        const [rows] = await pool.query('SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expires > NOW()', [token]);
        console.log(rows.length);

        if (rows.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        req.user = decoded.email;
        next();
    } catch (error) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }
};

export default authMiddleware;
