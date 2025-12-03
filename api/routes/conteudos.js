import express from 'express';
import { 
  postConteudos,
  getConteudo,
  getConteudos, 
  deleteConteudo,
  deleteImagemConteudo, 
  updateConteudo 
} from '../controllers/conteudos.js';

import authMiddleware from '../utils/middleaware.js';
import upload from '../utils/upload.js';

const router = express.Router();

router.post('/', authMiddleware, upload.single("imagem"), postConteudos);
router.put('/:id', authMiddleware, upload.single("imagem"), updateConteudo);
router.get('/', authMiddleware, getConteudo);
router.get('/todos', authMiddleware, getConteudos);
router.delete('/:id', authMiddleware, deleteConteudo);
router.delete('/:id/imagem', authMiddleware, deleteImagemConteudo);

export default router;
