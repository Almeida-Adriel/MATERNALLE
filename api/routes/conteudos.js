import express from 'express';
import { postConteudos, getConteudos, getAllConteudos  } from '../controllers/conteudos.js';
import authMiddleware from '../utils/middleaware.js';

const router = express.Router();

router.post('/', authMiddleware, postConteudos);
router.get('/', authMiddleware, getConteudos);
router.get('/todos', authMiddleware, getAllConteudos);

export default router;