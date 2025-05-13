import Service from '../models/Service.js';


// ➕ Ajouter un service
export const ajouterService = async (req, res) => {
  try {
    const nouveauService = new Service(req.body);
    const saved = await nouveauService.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'ajout du service", error: err });
  }
};

// 📋 Récupérer tous les services
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Erreur de récupération", error: err });
  }
};

// 🗑️ Supprimer un service
export const supprimerService = async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Service non trouvé" });
    res.json({ message: "Service supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur de suppression", error: err });
  }
};
// ✅ Fonction pour modifier un service
export const modifierService = async (req, res) => {
    try {
      const updatedService = await Service.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedService) return res.status(404).json({ message: "Service non trouvé" });
  
      res.json(updatedService);
    } catch (err) {
      res.status(500).json({ message: "Erreur de modification", error: err });
    }
  };
  
