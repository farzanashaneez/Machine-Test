
import express from 'express';
import { register, login, resetPassword,forgotPassword,validateOTP, verifyEmail, findUser } from '../controller/userController';

const router = express.Router();
router.get('/:id',findUser)
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/validate-otp', validateOTP);
router.post('/reset-password', resetPassword);
router.post('/verifyEmail',verifyEmail);

export default router;
