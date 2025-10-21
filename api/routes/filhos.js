import express from 'express';
import { postFilhos } from '../controllers/filhos.js'
import authMiddleware from '../utils/middleaware.js';

const router = express.Router();

router.post('/', authMiddleware, postFilhos);

export default router;