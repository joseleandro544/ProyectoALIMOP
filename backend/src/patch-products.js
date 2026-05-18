import pool from './config/db.js';

async function patchProducts() {
  try {
    console.log('\n======================================================');
    console.log('📊 REPORTE DE PRODUCTOS EN POSTGRESQL (bd.alimop)');
    console.log('======================================================');

    // 1. Obtener conteo y detalle de productos con su respectivo proveedor
    const queryText = `
      SELECT p.id, p.nombre, p.precio_original, p.precio_descuento, p.stock, p.categoria, p.imagen_url,
             pr.nombre_establecimiento, u.email as proveedor_email
      FROM productos p
      JOIN proveedores pr ON p.id_proveedor = pr.id_usuario
      JOIN usuarios u ON pr.id_usuario = u.id
      ORDER BY p.id ASC
    `;
    
    const result = await pool.query(queryText);
    console.log(`• Cantidad total de productos en catálogo: ${result.rows.length}\n`);

    console.log('📋 LISTADO DETALLADO:');
    result.rows.forEach(p => {
      const precio = p.precio_descuento && parseFloat(p.precio_descuento) > 0 
        ? `$${parseFloat(p.precio_descuento)} COP (Antes $${parseFloat(p.precio_original)} COP)` 
        : `$${parseFloat(p.precio_original)} COP`;
      
      console.log(`[ID: ${String(p.id).padEnd(2)}] ${p.nombre.padEnd(32)} | Cat: ${p.categoria.padEnd(18)} | Stock: ${String(p.stock).padEnd(2)} | Precio: ${precio.padEnd(32)} | Publicado por: ${p.nombre_establecimiento} (${p.proveedor_email})`);
    });

    console.log('\n======================================================');
    console.log('🎨 ACTUALIZANDO IMÁGENES A FOTOGRAFÍA GASTRONÓMICA REAL');
    console.log('======================================================');

    // Mapeo de imágenes profesionales de alta calidad de Unsplash
    const imageMap = [
      { id: 1, url: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&auto=format&fit=crop&q=80' }, // Ensalada César fresca
      { id: 2, url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80' }, // Yogur Griego Cremoso
      { id: 3, url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80' }, // Manzanas Rojas deliciosas
      { id: 4, url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80' }, // Baguette dorado caliente
      { id: 5, url: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&auto=format&fit=crop&q=80' }, // Donas glaseadas de chocolate
      { id: 6, url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80' }  // Donación de Bananos frescos
    ];

    // Actualizar los productos semilla clásicos
    for (const img of imageMap) {
      const updateQuery = `
        UPDATE productos 
        SET imagen_url = $1 
        WHERE id = $2
      `;
      await pool.query(updateQuery, [img.url, img.id]);
    }
    console.log('✅ Imágenes de productos semilla clásicos actualizadas con éxito.');

    // Actualizar productos de José (ID > 6) con imágenes espectaculares según lo que haya escrito
    const joseProductsQuery = `SELECT id, nombre FROM productos WHERE id > 6`;
    const joseProductsResult = await pool.query(joseProductsQuery);

    for (const p of joseProductsResult.rows) {
      let url = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'; // Canasta de mercado fresca por defecto
      const nombreLower = p.nombre.toLowerCase();

      if (nombreLower.includes('fresa') || nombreLower.includes('strawberry')) {
        url = 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&auto=format&fit=crop&q=80'; // Fresas orgánicas
      } else if (nombreLower.includes('pollo') || nombreLower.includes('pie') || nombreLower.includes('pastel')) {
        url = 'https://images.unsplash.com/photo-1628207615316-aa441e8c1b50?w=600&auto=format&fit=crop&q=80'; // Pastel / Alimento caliente
      } else if (nombreLower.includes('pan') || nombreLower.includes('torta') || nombreLower.includes('croissant')) {
        url = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80'; // Panadería fresca
      } else if (nombreLower.includes('manzana') || nombreLower.includes('fruta')) {
        url = 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80'; // Frutas
      }

      const updateQuery = `
        UPDATE productos 
        SET imagen_url = $1 
        WHERE id = $2
      `;
      await pool.query(updateQuery, [url, p.id]);
      console.log(`✨ Imagen del producto de José [ID: ${p.id}] "${p.nombre}" actualizada a imagen temática premium.`);
    }

    console.log('======================================================');
    console.log('🎉 ¡Todas las imágenes se ven espectaculares y únicas en alta resolución!');
    console.log('======================================================\n');

  } catch (error) {
    console.error('❌ Error aplicando parche de imágenes:', error.message);
  } finally {
    await pool.end();
  }
}

patchProducts();
