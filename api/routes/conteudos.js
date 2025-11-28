import express from 'express';
import { 
  postConteudos,
  getConteudo,
  getConteudos, 
  deleteConteudo, 
  updateConteudo 
} from '../controllers/conteudos.js';

import authMiddleware from '../utils/middleaware.js';
import upload from '../utils/upload.js';

const router = express.Router();

router.post('/', authMiddleware, upload.single("imagem"), postConteudos);
router.put('/:id', authMiddleware, upload.single("imagem"), updateConteudo);
router.get('/:id', authMiddleware, getConteudo);
router.get('/', authMiddleware, getConteudos);
router.delete('/:id', authMiddleware, deleteConteudo);

export default router;
