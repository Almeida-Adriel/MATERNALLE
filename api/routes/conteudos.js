import express from 'express';
import { postConteudos, getConteudos, getAllConteudos, deleteConteudo, updateConteudo } from '../controllers/conteudos.js';
import authMiddleware from '../utils/middleaware.js';

const router = express.Router();

router.post('/', authMiddleware, postConteudos);
router.get('/', authMiddleware, getConteudos);
router.get('/todos', authMiddleware, getAllConteudos);
router.delete('/:id', authMiddleware, deleteConteudo);
router.put('/:id', authMiddleware, updateConteudo);

export default router;