import Client from "../models/Client.js";
import Devis from "../models/devis.js";
import Facture from "../models/facture.js";


// 🔍 Obtenir un client par ID
export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client introuvable" });
    }
    res.json(client);
  } catch (error) {
    console.error("❌ Erreur getClientById :", error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ➕ Créer un client
export const createClient = async (req, res) => {
  try {
    const { email } = req.body;

    const existing = await Client.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Client existe déjà." });
    }

    const newClient = new Client(req.body);
    await newClient.save();
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ message: "Erreur création", error: error.message });
  }
};

// 📄 Liste des clients
export const getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Modifier un client
export const updateClient = async (req, res) => {
  try {
    const updated = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Erreur modification", error: error.message });
  }
};

// 🗑️ Supprimer un client
export const deleteClient = async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Client supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur suppression", error: error.message });
  }
};
export const getTauxClientsActifs = async (req, res) => {
  try {
    const now = new Date();

    // 🔹 Mois courant
    const startCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // 🔹 Mois précédent
    const startPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endPrevMonth = startCurrentMonth;

    // 🔢 Nombre total de clients
    const totalClients = await Client.countDocuments();

    // 📊 Fonction utilisant aggregate pour obtenir les clients actifs par période
    const getClientsActifs = async (start, end) => {
      const result = await Facture.aggregate([
        { $match: { createdAt: { $gte: start, $lt: end } } },
        { $group: { _id: "$client" } },
        { $count: "nbClients" }
      ]);
      return result.length > 0 ? result[0].nbClients : 0;
    };

    const [actifsPrecedent, actifsCourant] = await Promise.all([
      getClientsActifs(startPrevMonth, endPrevMonth),
      getClientsActifs(startCurrentMonth, endCurrentMonth),
    ]);

    const tauxPrec = totalClients ? (actifsPrecedent / totalClients) * 100 : 0;
    const tauxCourant = totalClients ? (actifsCourant / totalClients) * 100 : 0;

    const tendanceValue = tauxPrec
      ? ((tauxCourant - tauxPrec) / tauxPrec) * 100
      : 0;

    const tendance =
      tendanceValue > 0 ? "en hausse" :
      tendanceValue < 0 ? "en baisse" :
      "stable";

    res.json({
      mois: `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}`,
      taux: tauxCourant.toFixed(1),
      variation: Math.abs(tendanceValue).toFixed(1),
      tendance
    });

  } catch (err) {
    console.error("❌ Erreur taux clients actifs :", err);
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
};
