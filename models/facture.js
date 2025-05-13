import mongoose from "mongoose";

// ✅ Schéma pour une ligne (produit ou service)
const ligneSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // ❌ Supprimé refPath car non compatible dans un array
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

// ✅ Schéma principal de facture
const factureSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    numeroFacture: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
      required: true,
    },
    lignes: [ligneSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    montantPaye: {
      type: Number,
      default: 0,
    },
    montantRestant: {
      type: Number,
      default: function () {
        return this.total - this.montantPaye;
      },
    },
    tvaRate: {
      type: Number,
      default: 0,
    },
    modePaiement: {
      type: String,
      default: "non spécifié",
    },
    nomEntreprise: String,
    telephone: String,
    statut: {
      type: String,
      enum: ["payé", "non payé", "partiellement payé"],
      default: "non payé", // ✅ Ajout d'une valeur par défaut pour éviter les erreurs
    },
    envoyée: {
      type: Boolean,
      default: false,
    },
    logo: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Facture = mongoose.model("Facture", factureSchema);
export default Facture;
