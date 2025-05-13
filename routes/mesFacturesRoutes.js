import express from "express";
import {
  getFacturesByClient,
  getFacturesImpayeesClient
} from "../controllers/mesFacturesController.js";

const router = express.Router();

// ✅ Toutes les factures envoyées à un client
router.get("/:clientId", getFacturesByClient);

// 🔴 Factures impayées du client
router.get("/client/impayees/:id", getFacturesImpayeesClient);

export default router;
