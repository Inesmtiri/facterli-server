import express from "express";
import {
  ajouterPaiement,
  getPaiements,
  updatePaiement,
  deletePaiement,
  getStatsPaiementsMensuels // ✅ nouveau import
} from "../controllers/paiementController.js";

const router = express.Router();

// ➕ Créer un paiement
router.post("/", ajouterPaiement);

// 📄 Lister tous les paiements
router.get("/", getPaiements);

// 📈 Obtenir les revenus mensuels (KPI)
router.get("/stats-mensuelles", getStatsPaiementsMensuels); // ✅ nouvelle route

// ✏️ Modifier un paiement
router.put("/:id", updatePaiement);

// ❌ Supprimer un paiement
router.delete("/:id", deletePaiement);

export default router;
