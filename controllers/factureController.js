import Facture from "../models/facture.js";
import Produit from "../models/Produit.js"; // Gestion des stocks
import Paiement from "../models/Paiement.js";
import Depense from "../models/depense.js";
// ➕ Créer une facture
export const ajouterFacture = async (req, res) => {
  try {
    const data = req.body;

    // 🛡 Vérifications de base
    if (!data.client) {
      return res.status(400).json({ message: "Client manquant" });
    }

    if (!Array.isArray(data.lignes) || data.lignes.length === 0) {
      return res.status(400).json({ message: "Aucune ligne de produit/service fournie" });
    }

    // 🧼 Nettoyage d'un éventuel _id injecté par erreur
    delete data._id;

    // ✅ Formatage des lignes
    const lignesFormatées = data.lignes.map((ligne, index) => {
      if (!ligne.itemId || !ligne.type || !ligne.designation || ligne.quantite == null || ligne.prixUnitaire == null) {
        throw new Error(`Ligne ${index + 1} invalide : données manquantes`);
      }

      return {
        itemId: ligne.itemId,
        type: ligne.type,
        designation: ligne.designation,
        quantite: ligne.quantite,
        prixUnitaire: ligne.prixUnitaire,
      };
    });

    // ✅ Création de la facture
    const nouvelleFacture = new Facture({
      client: data.client,
      date: data.date,
      numeroFacture: data.numeroFacture,
      reference: data.reference,
      lignes: lignesFormatées,
      subtotal: data.subtotal,
      tax: data.tax,
      total: data.total,
      montantPaye: data.montantPaye || 0,
      montantRestant: data.montantRestant || (data.total - (data.montantPaye || 0)),
      tvaRate: data.tvaRate,
      modePaiement: data.modePaiement,
      nomEntreprise: data.nomEntreprise,
      telephone: data.telephone,
      statut: data.statut || "non payé",
      envoyée: data.envoyée || false,
      logo: data.logo || "",
    });

    const saved = await nouvelleFacture.save();

    // 🛠 Mise à jour du stock pour les produits
    for (const ligne of lignesFormatées) {
      if (ligne.type === "produit") {
        const produit = await Produit.findById(ligne.itemId);
        if (produit) {
          produit.stockActuel = Math.max(0, produit.stockActuel - ligne.quantite);
          produit.statut = produit.stockActuel === 0 ? "rupture" : "en stock";
          await produit.save();
        } else {
          console.warn(`⚠ Produit non trouvé pour l'ID : ${ligne.itemId}`);
        }
      }
    }

    // ✅ Marquer le devis comme converti si un devisId est fourni
    if (data.devisId) {
      const Devis = (await import("../models/devis.js")).default;
      await Devis.findByIdAndUpdate(data.devisId, {
        convertiEnFacture: true,
      });
    }

    res.status(201).json(saved);
  } catch (error) {
    console.error("❌ Erreur ajout facture :", error.message);
    console.error("🧠 Stack :", error.stack);
    res.status(500).json({ message: "Erreur lors de l'ajout de la facture", error: error.message });
  }
};

// 📄 Lister toutes les factures
export const getAllFactures = async (req, res) => {
  try {
    const factures = await Facture.find().populate("client");
    res.json(factures);
  } catch (err) {
    console.error("❌ Erreur chargement factures :", err);
    res.status(500).json({ message: "Erreur chargement factures." });
  }
};

// ✏️ Modifier une facture
export const updateFacture = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const factureExistante = await Facture.findById(id);

    // 🛠 Restaurer les stocks des anciennes lignes
    for (const ligne of factureExistante.lignes) {
      if (ligne.type === "produit") {
        const produit = await Produit.findById(ligne.itemId);
        if (produit) {
          produit.stockActuel += ligne.quantite;
          produit.statut = "en stock";
          await produit.save();
        }
      }
    }

    const lignesFormatées = data.lignes.map(ligne => ({
      itemId: ligne.itemId,
      type: ligne.type,
      designation: ligne.designation,
      quantite: ligne.quantite,
      prixUnitaire: ligne.prixUnitaire,
    }));

    const updated = await Facture.findByIdAndUpdate(
      id,
      {
        client: data.client,
        date: data.date,
        numeroFacture: data.numeroFacture,
        reference: data.reference,
        lignes: lignesFormatées,
        subtotal: data.subtotal,
        tax: data.tax,
        total: data.total,
        montantPaye: data.montantPaye || 0,
        montantRestant: data.montantRestant || (data.total - (data.montantPaye || 0)),
        tvaRate: data.tvaRate,
        modePaiement: data.modePaiement,
        nomEntreprise: data.nomEntreprise,
        telephone: data.telephone,
        statut: data.statut || "non payé",
        envoyée: data.envoyée || false,
        logo: data.logo || "",
      },
      { new: true }
    );

    // 🛠 Décrémenter les stocks avec les nouvelles lignes
    for (const ligne of lignesFormatées) {
      if (ligne.type === "produit") {
        const produit = await Produit.findById(ligne.itemId);
        if (produit) {
          produit.stockActuel = Math.max(0, produit.stockActuel - ligne.quantite);
          produit.statut = produit.stockActuel === 0 ? "rupture" : "en stock";
          await produit.save();
        }
      }
    }

    res.json(updated);
  } catch (error) {
    console.error("❌ Erreur modification facture :", error);
    res.status(500).json({ message: "Erreur lors de la modification de la facture." });
  }
};

// 🗑 Supprimer une facture
export const deleteFacture = async (req, res) => {
  try {
    const facture = await Facture.findByIdAndDelete(req.params.id);
    if (!facture) {
      return res.status(404).json({ message: "Facture non trouvée." });
    }
    res.json({ message: "Facture supprimée." });
  } catch (error) {
    console.error("❌ Erreur suppression facture :", error);
    res.status(500).json({ message: "Erreur suppression facture." });
  }
};

// 📬 Marquer une facture comme envoyée
export const envoyerFacture = async (req, res) => {
  try {
    const facture = await Facture.findByIdAndUpdate(
      req.params.id,
      { envoyée: true },
      { new: true }
    );

    if (!facture) {
      return res.status(404).json({ message: "Facture non trouvée." });
    }

    res.json(facture);
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de la facture :", error);
    res.status(500).json({ message: "Erreur envoi facture." });
  }
};
export const getStatsFacturesParStatut = async (req, res) => {
  try {
    const moisNoms = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];

    const stats = await Facture.aggregate([
      // ➕ Extraire l’index du mois depuis createdAt
      {
        $addFields: {
          moisIndex: { $month: "$createdAt" }
        }
      },
      // 📊 Grouper par mois et statut
      {
        $group: {
          _id: { moisIndex: "$moisIndex", statut: "$statut" },
          count: { $sum: 1 }
        }
      },
      // 🧱 Regrouper par mois (clé => valeur)
      {
        $group: {
          _id: "$_id.moisIndex",
          stats: {
            $push: {
              k: "$_id.statut",
              v: "$count"
            }
          }
        }
      },
      // 🔁 Transformer le tableau statuts => objet
      {
        $addFields: {
          statObject: { $arrayToObject: "$stats" }
        }
      },
      // 🎯 Reformater les champs pour affichage
      {
        $project: {
          _id: 0,
          mois: {
            $arrayElemAt: [moisNoms, { $subtract: ["$_id", 1] }]
          },
          moisIndex: "$_id", // pour trier
          payé: { $ifNull: ["$statObject.payé", 0] },
          partiel: { $ifNull: ["$statObject.partiellement payé", 0] },
          nonPayé: { $ifNull: ["$statObject.non payé", 0] }
        }
      },
      // 📅 Tri final par moisIndex
      {
        $sort: { moisIndex: 1 }
      }
    ]);

    // ❌ Optionnel : retirer moisIndex du résultat
    const cleanStats = stats.map(({ moisIndex, ...rest }) => rest);

    res.json(cleanStats);
  } catch (err) {
    console.error("❌ Erreur stats factures par statut :", err);
    res.status(500).json({ message: "Erreur d'agrégation", error: err });
  }
};

export const getProduitsServicesRentables = async (req, res) => {
  try {
    const stats = await Facture.aggregate([
      { $unwind: "$lignes" },
      {
        $group: {
          _id: "$lignes.itemId",
          totalVendu: { $sum: "$lignes.quantite" },
          revenuTotal: {
            $sum: { $multiply: ["$lignes.quantite", "$lignes.prixUnitaire"] }
          },
        },
      },
      {
        $lookup: {
          from: "produits",
          localField: "_id",
          foreignField: "_id",
          as: "produit"
        }
      },
      { $unwind: "$produit" },
      {
        $addFields: {
          coutTotal: { $multiply: ["$totalVendu", "$produit.prixAchat"] },
          profit: {
            $subtract: [
              { $multiply: ["$totalVendu", "$produit.prixVente"] },
              { $multiply: ["$totalVendu", "$produit.prixAchat"] }
            ]
          },
          nom: "$produit.reference",
          type: "$produit.categorie"
        }
      },
      {
        $project: {
          _id: 0,
          nom: 1,
          type: 1,
          totalVendu: 1,
          revenuTotal: 1,
          coutTotal: 1,
          profit: 1,
        }
      },
      { $sort: { profit: -1 } },
      { $limit: 5 }
    ]);

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: "Erreur produits rentables", error: err.message });
  }
};


// ✅ Obtenir le total des factures
export const getTotalFactures = async (req, res) => {
  try {
    const total = await Facture.countDocuments();
    res.json({ total });
  } catch (err) {
    console.error("Erreur total factures :", err);
    res.status(500).json({ message: "Erreur lors du calcul du total des factures" });
  }
};
export const getTotalProfit = async (req, res) => {
  try {
    const [factureAgg, depenseAgg] = await Promise.all([
      Facture.aggregate([
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Depense.aggregate([
        { $group: { _id: null, total: { $sum: "$montant" } } },
      ]),
    ]);

    const totalFactures = factureAgg[0]?.total || 0;
    const totalDepenses = depenseAgg[0]?.total || 0;
    const profit = totalFactures - totalDepenses;

    res.json({ profit, totalFactures, totalDepenses });
  } catch (err) {
    console.error("❌ Erreur calcul profit :", err);
    res.status(500).json({ message: "Erreur lors du calcul du profit" });
  }
};
// 📄 Obtenir les factures d’un client spécifique (interface client)
export const getFacturesParClient = async (req, res) => {
  try {
    const clientId = req.params.clientId;

    // ⚠ Si l’ID est vide ou mal formé
    if (!clientId || clientId.length < 10) {
      return res.status(400).json({ message: "ID client invalide" });
    }

    // 🔍 Factures du client sans doublons
    const factures = await Facture.find({ client: clientId })
      .lean() // supprime les méthodes Mongoose, donne un tableau "pur"
      .populate("client");

    // ✅ Retirer les doublons (sûreté supplémentaire)
    const facturesUniques = factures.filter(
      (f, index, self) => index === self.findIndex((x) => x._id.toString() === f._id.toString())
    );

    res.json(facturesUniques);
  } catch (err) {
    console.error("❌ Erreur chargement factures client :", err);
    res.status(500).json({ message: "Erreur chargement factures client" });
  }
};
