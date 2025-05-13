import express from "express";
import { getStockPrevision } from "../controllers/stockController.js";

const router = express.Router();

router.get("/prevision", getStockPrevision);

export default router;