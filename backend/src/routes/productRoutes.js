import express from 'express';
import { getProducts, createProduct } from '../controllers/productController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Ruta para listar todos los productos con filtros (público)
router.get('/', getProducts);

// Ruta para que un proveedor publique un producto (privado)
router.post('/', protect, authorize('proveedor'), createProduct);

export default router;
