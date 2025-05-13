// ✅ server/routes/produitRoutes.js

import express from 'express';
import {
  getProduits,
  addProduit,
  modifierProduit,
  deleteProduit
} from '../controllers/produitController.js';

const router = express.Router();

// 🔹 Récupérer tous les produits
router.get('/', getProduits);

// 🔹 Ajouter un produit
router.post('/', addProduit);

// 🔹 Supprimer un produit par ID
router.delete('/:id', deleteProduit);
router.put('/:id', modifierProduit);
export default router;

