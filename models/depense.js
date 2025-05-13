// models/depense.js
import mongoose from 'mongoose';

const depenseSchema = new mongoose.Schema(
  {
    categorie: {
      type: String,
      required: true,
      trim: true,
    },
    montant: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    commercant: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      default: "",
      trim: true, // 🔵 Optionnel : trim pour enlever espaces dans base64 ou url
    },
  },
  { timestamps: true }
);

export default mongoose.model('Depense', depenseSchema);
