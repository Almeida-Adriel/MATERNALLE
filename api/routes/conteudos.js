import express from 'express';
import { postConteudos, getConteudos } from '../controllers/conteudos.js';

const router = express.Router();

router.post('/', postConteudos);
router.get('/', getConteudos);

export default router;