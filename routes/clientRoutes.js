import express from 'express';
import {
  createClient,
  getClients,
  updateClient,
  deleteClient,
  getTauxClientsActifs,
  getClientById 
} from '../controllers/clientController.js';

const router = express.Router();

router.get('/', getClients);              // 🔄 Lister
router.post('/', createClient);          // ➕ Créer
router.put('/:id', updateClient);        // ✏️ Modifier
router.delete('/:id', deleteClient);     // 🗑️ Supprimer
router.get("/taux-actifs", getTauxClientsActifs);
router.get('/:id', getClientById);
export default router;
