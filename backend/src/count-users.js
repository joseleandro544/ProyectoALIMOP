import pool from './config/db.js';

async function countUsers() {
  try {
    // 1. Obtener conteo por rol
    const countQuery = `
      SELECT rol, COUNT(*) as cantidad 
      FROM usuarios 
      GROUP BY rol
    `;
    const countResult = await pool.query(countQuery);
    
    console.log('\n======================================================');
    console.log('📊 RESUMEN DE USUARIOS EN PostgreSQL (bd.alimop)');
    console.log('======================================================');
    countResult.rows.forEach(row => {
      console.log(`• Tipo: ${row.rol.toUpperCase().padEnd(15)} | Cantidad: ${row.cantidad}`);
    });
    
    // 2. Obtener lista detallada de usuarios
    const usersQuery = `
      SELECT id, nombre_completo, email, rol, estado 
      FROM usuarios 
      ORDER BY id ASC
    `;
    const usersResult = await pool.query(usersQuery);
    
    console.log('\n======================================================');
    console.log('📋 DETALLE DE USUARIOS REGISTRADOS');
    console.log('======================================================');
    usersResult.rows.forEach(u => {
      console.log(`[ID: ${String(u.id).padEnd(2)}] ${u.nombre_completo.padEnd(20)} | ${u.email.padEnd(28)} | Rol: ${u.rol}`);
    });
    console.log('======================================================\n');
    
  } catch (error) {
    console.error('❌ Error consultando la base de datos:', error.message);
  } finally {
    // Cerrar la conexión del pool para liberar la consola
    await pool.end();
  }
}

countUsers();
