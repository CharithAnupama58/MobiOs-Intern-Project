import express from 'express';
import { login, register, forgotPassword, resetPassword } from '../Controllers/authController.js';
import { validateResetToken } from '../Middleware/authFileMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/validate-token/:token', validateResetToken);

export default router;
