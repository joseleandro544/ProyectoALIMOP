import express from 'express';
import { createOrder, getOrders } from '../controllers/orderController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas de pedidos requieren estar autenticado
router.use(protect);

// Ruta para obtener pedidos (adaptado por rol - privado)
router.get('/', getOrders);

// Ruta para que un cliente cree un pedido (compra o donación - privado)
router.post('/', authorize('cliente'), createOrder);

export default router;
