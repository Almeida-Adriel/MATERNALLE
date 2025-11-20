import express from 'express';
import { forgotPassword, validateRecoveryCode } from '../controllers/esqueci_minha_senha.js';

const router = express.Router();

// Rota para enviar o código de recuperação
router.post('/forgot-password', forgotPassword);

// Rota para validar o código e alterar a senha
router.post('/reset-password', validateRecoveryCode);

export default router;