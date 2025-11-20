import express from 'express';
import { getAllUsuarios, getUsuario, updateUsuario, deleteUsuario, postUsuario } from '../controllers/usuarios.js';
import authMiddleware from '../utils/middleaware.js';

const router = express.Router();

router.post('/', authMiddleware, postUsuario)
router.get('/', authMiddleware, getUsuario);
router.get('/todos', authMiddleware, getAllUsuarios);
router.put('/:id', authMiddleware, updateUsuario);
router.delete('/:id', authMiddleware, deleteUsuario);

export default router;