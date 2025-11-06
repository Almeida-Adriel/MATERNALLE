import express from 'express';
import { obterPostosDeSaudeProximos } from '../controllers/mapaUbs.js';

const router = express.Router();

router.get('/postos_de_saude', obterPostosDeSaudeProximos);

export default router;