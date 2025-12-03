import express from "express";
import { salvarRespostasEdimburgo, calcularPontuacaoEdimburgo } from "../controllers/edimburgo.js";

const router = express.Router();

router.post("/", salvarRespostasEdimburgo);
router.post("/calcular", calcularPontuacaoEdimburgo);

export default router;
