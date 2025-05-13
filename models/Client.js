import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  societe: String,
  telephone: String,
  email: { type: String, required: true, unique: true },
  adresse: String,
  motDePasse: String,
}, { timestamps: true });

const Client = mongoose.model("Client", clientSchema);
export default Client;
