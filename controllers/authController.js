import User from '../models/User.js';
import Client from '../models/Client.js';
import bcrypt from 'bcryptjs';
import sendEmail from '../utils/sendEmail.js';

// 🔐 Connexion : Admin + Client
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 🔍 Admin ?
    const admin = await User.findOne({ email });
    if (admin && await bcrypt.compare(password, admin.password)) {
      return res.status(200).json({
        _id: admin._id,
        nom: admin.nom,
        prenom: admin.prenom,
        email: admin.email,
        role: 'admin',
      });
    }

    // 🔍 Client ?
    const client = await Client.findOne({ email });
    if (client && password === client.motDePasse) {
      return res.status(200).json({
        _id: client._id,
        nom: client.nom,
        prenom: client.prenom,
        email: client.email,
        role: 'client',
      });
    }

    return res.status(401).json({ message: "Email ou mot de passe invalide." });

  } catch (err) {
    console.error("❌ Erreur connexion :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};
