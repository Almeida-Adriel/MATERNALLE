import express from 'express';
import { loginUser, register, logoutUser } from '../controllers/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

export default router;