import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const registerUser = async (req, res) => {
  const { prenom, nom, email, password, telephone, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      prenom,
      nom,
      email,
      password: hashedPassword,
      telephone,
      role,
    });

    res.status(201).json({
      id: user._id,
      prenom: user.prenom,
      nom: user.nom,
      email: user.email,
      telephone: user.telephone,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const updatedFields = {
      firstName,
      lastName,
      email,
    };

    if (password) {
      updatedFields.password = password; // seulement si un nouveau mot de passe est fourni
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(user);
  } catch (error) {
    console.error("Erreur updateUser:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};