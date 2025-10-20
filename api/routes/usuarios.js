import express from 'express';
import { getAllUsuarios, getUsuario, postFilhos } from '../controllers/usuarios.js';
import authMiddleware from '../utils/middleaware.js';

const router = express.Router();

router.get('/', authMiddleware, getAllUsuarios);
router.get('/usuario', authMiddleware, getUsuario);
router.post('/usuario/:userId/filhos', authMiddleware, postFilhos);

export default router;