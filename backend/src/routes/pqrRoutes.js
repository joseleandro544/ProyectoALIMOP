import express from 'express';
import { createPqr, getPqrs, resolvePqr } from '../controllers/pqrController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas de PQR requieren inicio de sesión previo
router.use(protect);

// Obtener PQRs (Filtrado por cliente o lista completa para admin - privado)
router.get('/', getPqrs);

// Radicar una nueva PQR (Clientes/Proveedores/Domiciliarios - privado)
router.post('/', createPqr);

// Resolver una PQR (Solo Administradores - privado)
router.put('/:id/resolver', authorize('administrador'), resolvePqr);

export default router;
