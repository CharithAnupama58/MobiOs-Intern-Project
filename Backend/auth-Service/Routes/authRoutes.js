import express from 'express';
import { login, register, forgotPassword, resetPassword } from '../Controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
