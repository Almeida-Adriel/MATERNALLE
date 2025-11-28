import express from 'express';
import { loginUser, register } from '../controllers/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', loginUser);

export default router;