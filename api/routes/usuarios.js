import express from 'express';
import { getAllUsuarios, createUsuario } from '../controllers/usuarios.js';

const router = express.Router();

router.get('/', getAllUsuarios);
router.post('/', createUsuario);

export default router;