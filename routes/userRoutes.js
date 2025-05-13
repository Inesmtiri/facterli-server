import express from 'express';
import { registerUser, updateUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.put('/:id', updateUser); // pour la modification profil

export default router;

