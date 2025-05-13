import express from "express";
import {
  ajouterDevis,
  getAllDevis,
  updateDevis,
  deleteDevis,
  envoyerDevis,
  getDevisByClient,
  getKpiDevis,
  getDerniersDevis,
  getTotalDevis ,//  KPI
  getTauxConversionParMois 
} from "../controllers/devisController.js";

const router = express.Router();

//  KPI - Taux devis acceptés / refusés / en attente
router.get("/kpi", getKpiDevis);

//  Créer un devis
router.post("/", ajouterDevis);

// Lister tous les devis
router.get("/", getAllDevis);

//  Lister les devis par client
router.get("/client/:clientId", getDevisByClient);

//  Modifier un devis
router.put("/:id", updateDevis);

//  Marquer un devis comme envoyé
router.put("/:id/envoyer", envoyerDevis);

//  Supprimer un devis
router.delete("/:id", deleteDevis);
router.get("/recents", getDerniersDevis);
router.get("/total", getTotalDevis); 
router.get("/taux-conversion", getTauxConversionParMois);

export default router;
