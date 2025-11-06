import express from 'express';
import { buscarUfEMunicipio } from '../controllers/mapaUbs.js';

const router = express.Router();

router.get('/uf_municipio', buscarUfEMunicipio);

export default router;