import pool from './config/db.js';

async function patchLocations() {
  try {
    // 1. Obtener usuarios que no tienen ubicación
    const findQuery = `
      SELECT id, nombre_completo, email, rol 
      FROM usuarios 
      WHERE id NOT IN (SELECT id_usuario FROM ubicaciones)
    `;
    const findResult = await pool.query(findQuery);
    
    console.log('\n======================================================');
    console.log('🔧 PARCHE RETROACTIVO DE UBICACIONES EN POSTGRESQL');
    console.log('======================================================');
    
    if (findResult.rows.length === 0) {
      console.log('✅ ¡Excelente! Todos los usuarios existentes ya tienen ubicación.');
      return;
    }
    
    console.log(`Se encontraron ${findResult.rows.length} usuarios sin ubicación. Creando ubicaciones principales...`);
    
    for (const user of findResult.rows) {
      const insertQuery = `
        INSERT INTO ubicaciones (id_usuario, direccion, latitud, longitud, es_principal)
        VALUES ($1, $2, $3, $4, TRUE)
      `;
      await pool.query(insertQuery, [
        user.id,
        'Calle 100 # 15-20, Chicó, Bogotá',
        4.682300,
        -74.042500
      ]);
      console.log(`• [ID: ${user.id}] Ubicación creada para: ${user.nombre_completo} (${user.email} - Rol: ${user.rol})`);
    }
    
    console.log('======================================================');
    console.log('🎉 ¡Parche aplicado con éxito! Todos los usuarios tienen ubicación.');
    console.log('======================================================\n');
    
  } catch (error) {
    console.error('❌ Error aplicando el parche:', error.message);
  } finally {
    await pool.end();
  }
}

patchLocations();
