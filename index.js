import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import paiementRoutes from './routes/paiementRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import produitRoutes from './routes/produitRoutes.js';
import devisRoutes from './routes/devisRoutes.js';
import factureRoutes from "./routes/factureRoutes.js";
import depenseRoutes from "./routes/depenseRoutes.js";
import authRoutes from './routes/authRoutes.js';
import clientDevisRoutes from "./routes/clientDevisRoutes.js";
import mesFacturesRoutes from "./routes/mesFacturesRoutes.js"; // ✅ export corrigé
import stockRoutes from "./routes/stockRoutes.js";

dotenv.config();

const app = express();

// 🔐 Middlewares
app.use(cors());
app.use(express.json());

// 🔗 Routes
app.use('/api/users/', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/paiements', paiementRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/produits', produitRoutes);
app.use('/api/devis', devisRoutes);
app.use('/api/factures', factureRoutes);
app.use('/api/depenses', depenseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/mes-devis', clientDevisRoutes);
app.use('/api/mes-factures', mesFacturesRoutes); // ✅ maintenant fonctionne
app.use("/api/stock", stockRoutes);

// 🌐 Route de test
app.get('/', (req, res) => {
  res.send("Bienvenue sur l'API Facterli !");
});

// 🌍 Connexion MongoDB
const PORT = process.env.PORT || 3001;
const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  console.error("❌ MONGODB_URL n'est pas défini !");
  process.exit(1);
}

mongoose.connect(MONGODB_URL)
  .then(() => {
    console.log("✅ Connexion MongoDB réussie !");
    app.listen(PORT, () => {
      console.log(`🚀 Serveur backend actif sur http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Erreur de connexion MongoDB :", error.message);
    process.exit(1);
  });
