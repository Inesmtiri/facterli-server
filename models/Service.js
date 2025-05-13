import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String },
  tarif: { type: Number, default: 0 }
});

const Service = mongoose.model("Service", serviceSchema);

export default Service;
