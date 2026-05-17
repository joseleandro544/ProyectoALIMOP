import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importación de configuraciones
import pool from './config/db.js';

// Importación de enrutadores
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import pqrRoutes from './routes/pqrRoutes.js';

// Importación de middlewares
import { errorHandler } from './middlewares/errorMiddleware.js';

// Cargar configuraciones de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// Middlewares Básicos
// ==========================================
app.use(cors()); // Permitir peticiones cruzadas (CORS) desde el frontend React
app.use(express.json()); // Habilitar lectura de JSON en el cuerpo de las peticiones (req.body)

// ==========================================
// Rutas del Sistema
// ==========================================

// Diagnóstico de Salud (Health Check) del Backend y la Base de Datos
app.get('/api/health', async (req, res) => {
  try {
    // Validar conexión rápida ejecutando SELECT 1 en PostgreSQL
    const dbCheck = await pool.query('SELECT NOW()');
    res.status(200).json({
      status: 'OK',
      serverTime: new Date(),
      database: {
        status: 'CONECTADO',
        dbTime: dbCheck.rows[0].now,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'El backend funciona pero la base de datos PostgreSQL no responde.',
      error: error.message,
    });
  }
});

// Rutas de negocio
app.use('/api/auth', authRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/pedidos', orderRoutes);
app.use('/api/pqrs', pqrRoutes);

// Ruta no encontrada (404 Handler)
app.use((req, res, next) => {
  res.status(404);
  next(new Error(`Ruta no encontrada - [${req.method} ${req.url}]`));
});

// ==========================================
// Middleware de Manejo de Errores Global
// ==========================================
app.use(errorHandler);

// ==========================================
// Arranque del Servidor
// ==========================================
app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`🚀 Servidor ALIMOP corriendo exitosamente en el puerto ${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}`);
  console.log(`💓 Diagnóstico: http://localhost:${PORT}/api/health`);
  console.log(`================================================================`);
});
