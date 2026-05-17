import pkg from 'pg';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  max: 20, // Máximo número de conexiones simultáneas en el pool
  idleTimeoutMillis: 30000, // Tiempo límite para liberar una conexión inactiva
  connectionTimeoutMillis: 2000, // Tiempo límite para establecer conexión antes de fallar
});

// Evento al abrir una conexión exitosa
pool.on('connect', () => {
  console.log('🔌 Conexión exitosa establecida con el Pool de PostgreSQL (db.alimop)');
});

// Evento en caso de error en un cliente inactivo en el pool
pool.on('error', (err) => {
  console.error('❌ Error inesperado en un cliente inactivo de PostgreSQL:', err.message);
  process.exit(-1);
});

// Función helper para realizar consultas directamente usando el pool
export const query = (text, params) => pool.query(text, params);

export default pool;
