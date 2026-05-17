import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// Ruta para registrar un nuevo usuario (público)
router.post('/register', registerUser);

// Ruta para iniciar sesión (público)
router.post('/login', loginUser);

export default router;
