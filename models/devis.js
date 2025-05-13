import mongoose from "mongoose";

const ligneSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "lignes.type",
  },
  type: {
    type: String,
    enum: ["produit", "service"],
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  quantite: {
    type: Number,
    required: true,
  },
  prixUnitaire: {
    type: Number,
    required: true,
  },
});

const devisSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  client: {
    type: String,
    required: true,
  },
  nomEntreprise: String,
  telephone: String,
  date: String,
  numeroDevis: String,
  reference: String,
  lignes: [ligneSchema],
  subtotal: Number,
  tax: Number,
  total: Number,
  statut: {
    type: String,
    enum: ["en attente", "envoyé", "accepté", "refusé"],
    default: "en attente",
  },
  logo: { // ✅ NOUVEAU
    type: String,
    default: "",
  },
  convertiEnFacture: {
    type: Boolean,
    default: false,
  },

}, {
  timestamps: true,
});

const Devis = mongoose.model("Devis", devisSchema);
export default Devis;