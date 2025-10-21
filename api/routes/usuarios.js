import express from 'express';
import { getAllUsuarios, getUsuario } from '../controllers/usuarios.js';
import authMiddleware from '../utils/middleaware.js';

const router = express.Router();

router.get('/', authMiddleware, getAllUsuarios);
router.get('/usuario', authMiddleware, getUsuario);

export default router;