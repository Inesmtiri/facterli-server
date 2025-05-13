import express from 'express';
import {
  creerDepense,
  getDepenses,
  modifierDepense,
  supprimerDepense,
  getStatsDepensesMensuelles,
  getTotalDepenses // ✅ Nouveau import
} from '../controllers/depenseController.js';

const router = express.Router();

// ➕ Créer une dépense
router.post('/', creerDepense);

// 📄 Lister toutes les dépenses
router.get('/', getDepenses);

// 📈 Obtenir les dépenses mensuelles (KPI)
router.get('/stats-mensuelles', getStatsDepensesMensuelles); // ✅ Nouvelle route

// ✏️ Modifier une dépense
router.put('/:id', modifierDepense);


router.delete('/:id', supprimerDepense);


router.get("/total", getTotalDepenses);

export default router;
