// ✅ server/controllers/produitController.js

import Produit from '../models/Produit.js';

// ➕ Ajouter un produit
export const addProduit = async (req, res) => {
  try {
    const nouveauProduit = new Produit(req.body);
    const saved = await nouveauProduit.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'ajout du produit", error: err });
  }
};

// 📋 Récupérer tous les produits
export const getProduits = async (req, res) => {
  try {
    const produits = await Produit.find();
    res.json(produits);
  } catch (err) {
    res.status(500).json({ message: "Erreur de récupération", error: err });
  }
};

// 🗑️ Supprimer un produit
export const deleteProduit = async (req, res) => {
  try {
    const deleted = await Produit.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Produit non trouvé" });
    res.json({ message: "Produit supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur de suppression", error: err });
  }
};
// 🔁 Modifier un produit
export const modifierProduit = async (req, res) => {
  try {
    const produitModifie = await Produit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // retourne le document mis à jour
    );

    if (!produitModifie) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    res.status(200).json(produitModifie);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la modification", error: err });
  }
};
