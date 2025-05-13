import express from 'express';
const router = express.Router();

import { login } from '../controllers/authController.js';

// 🔐 Routes auth
router.post('/login', login);


// 🔍 Route de test
router.get('/test', (req, res) => {
  res.json({ message: "✅ Route auth fonctionne" });
});

export default router;
