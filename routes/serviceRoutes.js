import express from 'express';
import {
  ajouterService,
  getAllServices,
  modifierService,
  supprimerService
} from '../controllers/serviceController.js';

const router = express.Router();

router.post('/', ajouterService);         // ➕ Ajouter un service
router.get('/', getAllServices);  
router.put("/:id", modifierService);        // 📋 Lister tous les services
router.delete('/:id', supprimerService);  // 🗑️ Supprimer un service

export default router;
