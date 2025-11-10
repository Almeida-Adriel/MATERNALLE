import express from 'express';
import { postNotas, getNota, getNotas, updateNota, deleteNota } from '../controllers/notas.js';
import authMiddleware from '../utils/middleaware.js';

const router = express.Router();

router.post('/', authMiddleware, postNotas);
router.get('/', authMiddleware, getNotas);
router.get('/:id', authMiddleware, getNota);
router.put('/:id', authMiddleware, updateNota);
router.delete('/:id', authMiddleware, deleteNota);

export default router;