import mongoose from "mongoose";
import Devis from "../models/devis.js";

// ✅ Ajouter un devis
export const ajouterDevis = async (req, res) => {
  try {
    const data = req.body;

    const lignesFormatées = data.lignes.map(ligne => ({
      itemId: ligne.itemId,
      type: ligne.type,
      designation: ligne.designation,
      quantite: ligne.quantite,
      prixUnitaire: ligne.prixUnitaire,
    }));

    const nouveauDevis = new Devis({
      clientId: data.clientId,
      client: data.client,
      nomEntreprise: data.nomEntreprise,
      telephone: data.telephone,
      date: data.date,
      numeroDevis: data.numeroDevis,
      reference: data.reference,
      lignes: lignesFormatées,
      subtotal: data.subtotal,
      tax: data.tax,
      total: data.total,
      statut: "en attente",
      logo: data.logo || "", // ✅ Ajouté ici
    });

    const saved = await nouveauDevis.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Erreur lors de l'ajout du devis :", error);
    res.status(500).json({ message: "Erreur lors de l'ajout du devis" });
  }
};

// ✅ Obtenir tous les devis
export const getAllDevis = async (req, res) => {
  try {
    const devis = await Devis.find();
    res.json(devis);
  } catch (error) {
    console.error("Erreur backend getAllDevis :", error);
    res.status(500).json({ message: "Erreur lors du chargement des devis" });
  }
};

// ✅ Modifier un devis
export const updateDevis = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const lignesFormatées = data.lignes.map(ligne => ({
      itemId: ligne.itemId,
      type: ligne.type,
      designation: ligne.designation,
      quantite: ligne.quantite,
      prixUnitaire: ligne.prixUnitaire,
    }));

    const updated = await Devis.findByIdAndUpdate(
      id,
      {
        clientId: data.clientId,
        client: data.client,
        nomEntreprise: data.nomEntreprise,
        telephone: data.telephone,
        date: data.date,
        numeroDevis: data.numeroDevis,
        reference: data.reference,
        lignes: lignesFormatées,
        subtotal: data.subtotal,
        tax: data.tax,
        total: data.total,
        statut: "en attente",
        logo: data.logo || "", // ✅ Ajouté ici aussi
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error("Erreur lors de la modification du devis :", error);
    res.status(500).json({ message: "Erreur modification devis" });
  }
};

// ✅ Supprimer un devis
export const deleteDevis = async (req, res) => {
  try {
    await Devis.findByIdAndDelete(req.params.id);
    res.json({ message: "Devis supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur suppression devis" });
  }
};

// ✅ Envoyer un devis (changer statut en "envoyé")
export const envoyerDevis = async (req, res) => {
  try {
    const devis = await Devis.findByIdAndUpdate(
      req.params.id,
      { statut: "envoyé" },
      { new: true }
    );
    res.json(devis);
  } catch (error) {
    console.error("Erreur lors de l'envoi du devis :", error);
    res.status(500).json({ message: "Erreur envoi devis" });
  }
};

// ✅ Accepter un devis
export const acceptDevis = async (req, res) => {
  try {
    const devis = await Devis.findByIdAndUpdate(
      req.params.id,
      { statut: "accepté" },
      { new: true }
    );
    res.json(devis);
  } catch (error) {
    console.error("Erreur lors de l'acceptation du devis :", error);
    res.status(500).json({ message: "Erreur acceptation devis" });
  }
};

// ✅ Refuser un devis
export const refuseDevis = async (req, res) => {
  try {
    const devis = await Devis.findByIdAndUpdate(
      req.params.id,
      { statut: "refusé" },
      { new: true }
    );
    res.json(devis);
  } catch (error) {
    console.error("Erreur lors du refus du devis :", error);
    res.status(500).json({ message: "Erreur refus devis" });
  }
};

// ✅ Lister les devis d'un client (interface client)
export const getDevisByClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({ error: "ID client invalide." });
    }

    const devis = await Devis.find({ clientId });
    res.json(devis);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des devis." });
  }
};

// (non utilisé ici mais utile)
async function getNextDevisNumber() {
  const counter = await Counter.findOneAndUpdate(
    { name: "devis" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq.toString().padStart(6, "0");
}
// ✅ Obtenir les KPI devis
export const getKpiDevis = async (req, res) => {
  try {
    // On ne compte que les devis "accepté", "refusé" et "en attente"
    const [total, acceptés, refusés, enAttente] = await Promise.all([
      Devis.countDocuments({ statut: { $in: ["accepté", "refusé", "en attente"] } }),
      Devis.countDocuments({ statut: "accepté" }),
      Devis.countDocuments({ statut: "refusé" }),
      Devis.countDocuments({ statut: "en attente" }),
    ]);

    // Pour éviter division par 0
    const base = total || 1;

    res.json({
      total,
      acceptés,
      refusés,
      enAttente,
      taux: {
        acceptés: ((acceptés / base) * 100).toFixed(1),
        refusés: ((refusés / base) * 100).toFixed(1),
        enAttente: ((enAttente / base) * 100).toFixed(1),
      },
    });
  } catch (error) {
    console.error("Erreur KPI devis :", error);
    res.status(500).json({ message: "Erreur lors du calcul des KPI devis" });
  }
};
// ✅ Derniers devis (limite 10, triés par date descendante)
export const getDerniersDevis = async (req, res) => {
  try {
    const derniers = await Devis.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("numeroDevis client date statut");

    res.json(derniers);
  } catch (error) {
    console.error("Erreur chargement derniers devis :", error);
    res.status(500).json({ message: "Erreur lors du chargement des derniers devis" });
  }
};
// ✅ Total des devis (nombre)
export const getTotalDevis = async (req, res) => {
  try {
    const total = await Devis.countDocuments();
    res.json({ total });
  } catch (error) {
    console.error("Erreur total devis :", error);
    res.status(500).json({ message: "Erreur chargement total devis" });
  }
};

export const getTauxConversionParMois = async (req, res) => {
  try {
    const now = new Date();

    const startPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Agrégation sur deux mois (mois courant et précédent)
    const stats = await Devis.aggregate([
      {
        $match: {
          createdAt: { $gte: startPrevMonth, $lt: endCurrentMonth }
        }
      },
      {
        $addFields: {
          mois: { $month: "$createdAt" }
        }
      },
      {
        $group: {
          _id: "$mois",
          total: { $sum: 1 },
          convertis: {
            $sum: {
              $cond: [{ $eq: ["$convertiEnFacture", true] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          mois: "$_id",
          taux: {
            $cond: [
              { $gt: ["$total", 0] },
              { $multiply: [{ $divide: ["$convertis", "$total"] }, 100] },
              0
            ]
          }
        }
      },
      { $sort: { mois: 1 } }
    ]);

    // Reformater les données pour séparer les deux mois (précédent et courant)
    const moisActuel = now.getMonth() + 1;
    const moisPrecedent = now.getMonth() === 0 ? 12 : now.getMonth();

    const tauxCourant = stats.find((s) => s.mois === moisActuel)?.taux || 0;
    const tauxPrecedent = stats.find((s) => s.mois === moisPrecedent)?.taux || 0;

    const tendance = tauxPrecedent !== 0
      ? ((tauxCourant - tauxPrecedent) / tauxPrecedent) * 100
      : 0;

    const variation =
      tendance > 0 ? "en hausse" :
      tendance < 0 ? "en baisse" : "stable";

    res.json({
      mois: `${now.getFullYear()}-${moisActuel.toString().padStart(2, "0")}`,
      taux: tauxCourant.toFixed(1),
      tendance: tendance.toFixed(1),
      variation
    });

  } catch (err) {
    console.error("❌ Erreur calcul taux conversion :", err);
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
};
