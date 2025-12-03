import express from "express";
import { salvarRespostasEdimburgo } from "../controllers/edimburgo.js";

const router = express.Router();

router.post("/", salvarRespostasEdimburgo);

export default router;
