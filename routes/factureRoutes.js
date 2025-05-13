import express from "express";
import {
  ajouterFacture,
  getAllFactures,
  updateFacture,
  deleteFacture,
  envoyerFacture,
  getStatsFacturesParStatut,
  getProduitsServicesRentables,
  getTotalFactures,
  getTotalProfit,
  getFacturesParClient, // ✅ nouvelle fonction importée
} from "../controllers/factureController.js";

const router = express.Router();

// ➕ Ajouter une facture
router.post("/", ajouterFacture);

// 📄 Récupérer toutes les factures (admin)
router.get("/", getAllFactures);

// ✏️ Modifier une facture
router.put("/:id", updateFacture);

// ❌ Supprimer une facture
router.delete("/:id", deleteFacture);

// 📤 Envoyer une facture (changer le statut à "envoyée")
router.patch("/:id/envoyer", envoyerFacture);

// 📊 Statistiques mensuelles par statut (histogramme empilé)
router.get("/statut-mensuel", getStatsFacturesParStatut);

// 📈 Produits/services les plus rentables (diagramme à bulles)
router.get("/produits-rentables", getProduitsServicesRentables);

// 🔢 KPI : Total factures et profit
router.get("/total", getTotalFactures);
router.get("/profit", getTotalProfit);

// ✅ Nouvelle route : factures du client connecté (interface client)
router.get("/mes-factures/:clientId", getFacturesParClient);

export default router;
