import express from 'express';
import { loginUser, register } from '../controllers/auth.js';

const router = express.Router();

router.post('/', register);
router.post('/', loginUser);

export default router;