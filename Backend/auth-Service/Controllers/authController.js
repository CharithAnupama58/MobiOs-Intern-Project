import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../model/db.js';
import nodemailer from 'nodemailer';

export const register = async (req, res) => {
    const { regEmail, regPassword } = req.body;
    console.log(regEmail, regPassword);
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [regEmail]);
        console.log(rows[0]);
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
    console.log(email, password);
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

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    console.log(email);
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        // console.log(rows[0]);
        if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

        const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // console.log(resetToken);

        const expires = new Date(Date.now() + 3600000).toISOString().slice(0, 19).replace('T', ' ');
        console.log(expires);

        await pool.query('UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE email = ?', 
        [resetToken, expires, email]);


        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
        // console.log(resetUrl);

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        // console.log(transporter);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste it into your browser to complete the process within one hour of receiving it:\n\n
            ${resetUrl}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };
        // console.log(mailOptions);

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        res.status(200).json({ message: 'Password reset link sent!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword  } = req.body;
    // console.log(token, newPassword );

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [decoded.email]);
        // console.log(rows[0]);  

        if (rows.length === 0) return res.status(400).json({ message: 'Token is invalid or has expired' });

        const user = rows[0];
        
        const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

        if (user.reset_password_expires < currentTime) {
            return res.status(400).json({ message: 'Token has expired' });
        }

        const hashedPassword = await bcrypt.hash(newPassword , 10);
        console.log(hashedPassword);

        pool.query('UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE email = ?', 
            [hashedPassword, decoded.email]);

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

