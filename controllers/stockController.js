import Produit from "../models/Produit.js";
import Facture from "../models/facture.js";

export const getStockPrevision = async (req, res) => {
  try {
    const dateLimite = new Date();
    dateLimite.setDate(dateLimite.getDate() - 30); // 🔁 30 derniers jours

    const consommation = await Facture.aggregate([
      { $match: { date: { $gte: dateLimite } } },
      { $unwind: "$lignes" },
      {
        $match: {
          "lignes.itemId": { $ne: null },
          "lignes.type": "produit",
          "lignes.quantite": { $gt: 0 },
        },
      },
      {
        $group: {
          _id: "$lignes.itemId",
          qteFacturee30j: { $sum: "$lignes.quantite" },
        },
      },
    ]);

    const produits = await Produit.find();

    const resultats = produits.map((prod) => {
      const conso = consommation.find((c) => c._id.equals(prod._id)); // ✅ comparaison correcte
      const qte30j = conso ? conso.qteFacturee30j : 0;
      const consoJ = qte30j / 30;
      const prevision = prod.stockActuel - consoJ * 7;
      const critique = prevision < prod.stockMin;

      return {
        produit: prod.reference || prod.nom || "Produit inconnu",
        stockActuel: prod.stockActuel,
        stockMin: prod.stockMin,
        qteFacturee30j: qte30j,
        consoJ: consoJ.toFixed(2),
        prevision: prevision.toFixed(1),
        critique,
      };
    });

    res.json(resultats);
  } catch (err) {
    console.error("❌ Erreur calcul prévision :", err);
    res.status(500).json({ message: "Erreur calcul prévision" });
  }
};
