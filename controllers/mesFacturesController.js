import Facture from "../models/facture.js";

// 📥 Toutes les factures envoyées à un client donné
export const getFacturesByClient = async (req, res) => {
  try {
    const factures = await Facture.find({
      client: req.params.clientId,
      envoyée: true,
    })
      .sort({ createdAt: -1 })
      .populate("client");

    res.status(200).json(factures);
  } catch (error) {
    console.error("❌ Erreur récupération factures client :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 🔴 Factures impayées du client
export const getFacturesImpayeesClient = async (req, res) => {
  try {
    const clientId = req.params.id;
    const factures = await Facture.find({
      client: clientId,
      envoyée: true,
    });

    const impayees = factures.filter((facture) => facture.statut !== "payé");

    res.status(200).json(impayees);
  } catch (error) {
    console.error("❌ Erreur récupération factures impayées :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
