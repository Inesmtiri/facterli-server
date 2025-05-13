import mongoose from "mongoose";

const produitSchema = new mongoose.Schema({
  reference: { type: String, required: true },
  categorie: { type: String },
  stockActuel: { type: Number, default: 0 },
  statut: { type: String, enum: ["en stock", "rupture"], default: "en stock" },
  prixVente: { type: Number, required: false } ,// 🆕 Prix de vente ajouté
  prixAchat: { type: Number, required: false } // 🆕 Prix de vente ajouté

});

export default mongoose.model("Produit", produitSchema);
