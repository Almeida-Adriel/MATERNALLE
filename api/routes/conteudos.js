import express from 'express';
import { postConteudos, getConteudos, getAllConteudos, deleteConteudo } from '../controllers/conteudos.js';
import authMiddleware from '../utils/middleaware.js';

const router = express.Router();

router.post('/', authMiddleware, postConteudos);
router.get('/', authMiddleware, getConteudos);
router.get('/todos', authMiddleware, getAllConteudos);
router.delete('/:id', authMiddleware, deleteConteudo);

export default router;