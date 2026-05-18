import pool from './config/db.js';

async function seed45Products() {
  try {
    console.log('\n======================================================');
    console.log('🚀 INICIANDO INYECCIÓN MAESTRA DE 45 PRODUCTOS PREMIUM');
    console.log('======================================================');

    // 1. Obtener los IDs reales de los tres proveedores en tu base de datos
    const carullaRes = await pool.query("SELECT id FROM usuarios WHERE email = 'contacto@carullapepe.com'");
    const trigalRes = await pool.query("SELECT id FROM usuarios WHERE email = 'ventas@eltrigal.com'");
    const joseRes = await pool.query("SELECT id FROM usuarios WHERE email = 'jose@hotmail.com'");

    if (carullaRes.rows.length === 0 || trigalRes.rows.length === 0) {
      throw new Error('No se encontraron las cuentas semilla principales de Carulla o El Trigal en PostgreSQL.');
    }

    const idCarulla = carullaRes.rows[0].id;
    const idTrigal = trigalRes.rows[0].id;
    let idJose = joseRes.rows.length > 0 ? joseRes.rows[0].id : null;

    if (!idJose) {
      console.log('⚠️ Proveedor "jose@hotmail.com" no encontrado. Se usarán Carulla y El Trigal para su cuota.');
      idJose = idCarulla;
    } else {
      console.log(`✅ Proveedor "jose@hotmail.com" detectado con éxito con ID: ${idJose}`);
      
      // PARCHE RETROACTIVO: Asegurar que José tenga ubicación principal para poder visualizar sus productos
      const locCheck = await pool.query("SELECT id FROM ubicaciones WHERE id_usuario = $1", [idJose]);
      if (locCheck.rows.length === 0) {
        console.log('🔧 José no tiene ubicación. Inyectando ubicación principal central en Bogotá para José...');
        await pool.query(`
          INSERT INTO ubicaciones (id_usuario, direccion, latitud, longitud, es_principal)
          VALUES ($1, 'Calle 100 # 15-20, Chicó, Bogotá', 4.682300, -74.042500, TRUE)
        `, [idJose]);
      }
      
      // PARCHE DE FECHAS: Actualizar productos previos de José a fechas futuras (evitar bloqueo UTC)
      await pool.query(`
        UPDATE productos 
        SET fecha_vencimiento = CURRENT_DATE + INTERVAL '5 days', estado = 'disponible'
        WHERE id_proveedor = $1
      `, [idJose]);
      console.log('✅ Fechas de productos previos de José corregidas a 5 días en el futuro (visibles 100%).');
    }

    // 2. Limpiar productos viejos para no saturar y tener un catálogo limpio de 45 + clásicos
    console.log('🧹 Limpiando catálogo anterior para inyección limpia (conservando clásicos)...');
    await pool.query('DELETE FROM productos WHERE id > 6');

    // 3. Definir los 45 productos distribuidos en las 9 categorías (5 por categoría)
    const listado = [
      // 🍏 CATEGORÍA: Frutas
      { id_proveedor: idJose, nombre: 'Fresas Orgánicas Silvestres 500g', descripcion: 'Fresas recién cosechadas. Ideales para jugos, postres y consumo fresco.', precio_orig: 12000, precio_desc: 5500, stock: 12, categoria: 'Frutas', url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idCarulla, nombre: 'Mangos de Azúcar Selección 2kg', descripcion: 'Mangos muy dulces y jugosos en perfecto estado de madurez.', precio_orig: 16000, precio_desc: 7000, stock: 8, categoria: 'Frutas', url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idTrigal, nombre: 'Bolsa de Manzanas Verdes x6', descripcion: 'Manzanas ácidas y crocantes, ideales para ensaladas o repostería.', precio_orig: 10000, precio_desc: 4500, stock: 15, categoria: 'Frutas', url: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idJose, nombre: 'Piña Oro Miel Extra Madura', descripcion: 'Piña sumamente dulce lista para consumir hoy o mañana.', precio_orig: 8000, precio_desc: 3000, stock: 6, categoria: 'Frutas', url: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idCarulla, nombre: 'Uvas Negras Sin Semilla 1kg', descripcion: 'Racimos de uvas frescas de mesa con un gran descuento comercial.', precio_orig: 18000, precio_desc: 8500, stock: 10, categoria: 'Frutas', url: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&auto=format&fit=crop&q=80' },

      // 🥦 CATEGORÍA: Verduras
      { id_proveedor: idJose, nombre: 'Lechuga Crespa Hidropónica', descripcion: 'Lechuga fresca cultivada en agua. Deliciosa y crujiente.', precio_orig: 6000, precio_desc: 2500, stock: 14, categoria: 'Verduras', url: 'https://images.unsplash.com/photo-1622484211148-716598e04141?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idCarulla, nombre: 'Tomates Chonto Rojos 1kg', descripcion: 'Tomates bien maduros perfectos para salsas y guisos.', precio_orig: 7500, precio_desc: 3000, stock: 20, categoria: 'Verduras', url: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idTrigal, nombre: 'Zanahorias Lavadas Premium 1kg', descripcion: 'Zanahorias seleccionadas y limpias de excelente sabor.', precio_orig: 5000, precio_desc: 2000, stock: 18, categoria: 'Verduras', url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idJose, nombre: 'Cebolla Cabezona Blanca 1.5kg', descripcion: 'Malla de cebollas frescas listas para sazonar tus comidas.', precio_orig: 8000, precio_desc: 3500, stock: 11, categoria: 'Verduras', url: 'https://images.unsplash.com/photo-1618512496248-a07fe8376604?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idCarulla, nombre: 'Aguacates Hass Maduros x3', descripcion: 'Aguacates cremosos en perfecto estado listos para guacamole hoy.', precio_orig: 12000, precio_desc: 5500, stock: 9, categoria: 'Verduras', url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&auto=format&fit=crop&q=80' },

      // 🥩 CATEGORÍA: Carnes
      { id_proveedor: idJose, nombre: 'Pechuga de Pollo Fileteada 500g', descripcion: 'Pollo fresco cortado en filetes listo para asar.', precio_orig: 14000, precio_desc: 7000, stock: 7, categoria: 'Carnes', url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idCarulla, nombre: 'Lomo de Res Premium Corte 1kg', descripcion: 'Lomo fino de res empacado al vacío. Cadena de frío controlada.', precio_orig: 42000, precio_desc: 22000, stock: 5, categoria: 'Carnes', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idTrigal, nombre: 'Costilla de Cerdo en Salsa 800g', descripcion: 'Costilla de cerdo marinada lista para hornear o freír.', precio_orig: 28000, precio_desc: 13000, stock: 4, categoria: 'Carnes', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idJose, nombre: 'Carne Molida Especial Res 500g', descripcion: 'Carne magra molida ideal para albóndigas o boloñesa.', precio_orig: 15000, precio_desc: 7500, stock: 10, categoria: 'Carnes', url: 'https://images.unsplash.com/photo-1588168333986-50d898dd3702?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idCarulla, nombre: 'Muslos de Pollo Campesino x6', descripcion: 'Bandeja de pollo fresco. Consumo sugerido en los próximos 3 días.', precio_orig: 13500, precio_desc: 6000, stock: 8, categoria: 'Carnes', url: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80' },

      // 🌾 CATEGORÍA: Granos
      { id_proveedor: idJose, nombre: 'Arroz Integral Extra 1kg', descripcion: 'Arroz rico en fibra ideal para dietas saludables.', precio_orig: 7000, precio_desc: 3000, stock: 25, categoria: 'Granos', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idCarulla, nombre: 'Frijol Bola Roja Seleccionado 1kg', descripcion: 'Frijoles secos ideales para bandejas paisas tradicionales.', precio_orig: 12000, precio_desc: 6000, stock: 15, categoria: 'Granos', url: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idTrigal, nombre: 'Lentejas de la Casa Extra 1kg', descripcion: 'Granos limpios de rápida cocción y alto valor nutricional.', precio_orig: 8000, precio_desc: 3500, stock: 19, categoria: 'Granos', url: 'https://images.unsplash.com/photo-1545159495-2c8c62faef5a?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idJose, nombre: 'Garbanzos Importados Bolsa 500g', descripcion: 'Garbanzos secos ideales para hummus o cocidos.', precio_orig: 6500, precio_desc: 2800, stock: 12, categoria: 'Granos', url: 'https://images.unsplash.com/photo-1545159495-2c8c62faef5a?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idCarulla, nombre: 'Quinoa Orgánica Real 500g', descripcion: 'Súper alimento andino en empaque resellable.', precio_orig: 15000, precio_desc: 7500, stock: 10, categoria: 'Granos', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80' },

      // 🍔 CATEGORÍA: Comidas Rápidas
      { id_proveedor: idJose, nombre: 'Combo Hamburguesa Res + Papas', descripcion: 'Hamburguesa artesanal con carne de 150g, queso cheddar y papas.', precio_orig: 24000, precio_desc: 11000, stock: 5, categoria: 'Comidas Rápidas', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idCarulla, nombre: 'Pizza Familiar Jamón y Queso', descripcion: 'Pizza gigante recién salida del horno. Ideal para compartir.', precio_orig: 32000, precio_desc: 16000, stock: 3, categoria: 'Comidas Rápidas', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idTrigal, nombre: 'Perro Caliente Gigante + Papas', descripcion: 'Salchicha americana, salsas de la casa y papas crujientes.', precio_orig: 18000, precio_desc: 8000, stock: 6, categoria: 'Comidas Rápidas', url: 'https://images.unsplash.com/photo-1541214113241-21578d2d9b62?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idJose, nombre: 'Papas Fritas con Tocino y Queso', descripcion: 'Porción grande de papas bañadas en queso fundido y tocineta picada.', precio_orig: 15000, precio_desc: 6900, stock: 7, categoria: 'Comidas Rápidas', url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idCarulla, nombre: 'Alitas de Pollo Picantes x12', descripcion: 'Alitas bañadas en salsa búfalo picante con aderezo ranch.', precio_orig: 26000, precio_desc: 12500, stock: 4, categoria: 'Comidas Rápidas', url: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80' },

      // 🧂 CATEGORÍA: Tienda
      { id_proveedor: idJose, nombre: 'Aceite de Girasol Puro 1L', descripcion: 'Aceite vegetal ideal para cocinar de forma saludable.', precio_orig: 14000, precio_desc: 6500, stock: 15, categoria: 'Tienda', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idCarulla, nombre: 'Café Molido Colombiano 500g', descripcion: 'Café de origen con notas dulces y cuerpo medio.', precio_orig: 19000, precio_desc: 9500, stock: 12, categoria: 'Tienda', url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idTrigal, nombre: 'Sal Marina Refinada 1kg', descripcion: 'Sal marina ideal para realzar los sabores de tus comidas.', precio_orig: 5000, precio_desc: 2000, stock: 30, categoria: 'Tienda', url: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idJose, nombre: 'Chocolate de Mesa Corona x10', descripcion: 'Pastillas de chocolate listas para preparar caliente en el desayuno.', precio_orig: 9500, precio_desc: 4500, stock: 14, categoria: 'Tienda', url: 'https://images.unsplash.com/photo-1548907040-4d42b52125e0?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idCarulla, nombre: 'Azúcar Morena Orgánica 1kg', descripcion: 'Azúcar natural sin refinar para endulzar saludablemente.', precio_orig: 8000, precio_desc: 3900, stock: 22, categoria: 'Tienda', url: 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?w=600&auto=format&fit=crop&q=80' },

      // 🥛 CATEGORÍA: Lácteos
      { id_proveedor: idJose, nombre: 'Queso Doble Crema Bloque 500g', descripcion: 'Queso semi-maduro ideal para fundir y sándwiches.', precio_orig: 16000, precio_desc: 7900, stock: 8, categoria: 'Lácteos', url: 'https://images.unsplash.com/photo-1486887396153-fa416525c108?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idCarulla, nombre: 'Leche Entera Colanta Pack x6', descripcion: 'Caja con 6 bolsas de leche de alta calidad.', precio_orig: 24000, precio_desc: 12500, stock: 10, categoria: 'Lácteos', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idTrigal, nombre: 'Mantequilla de Vaca con Sal 250g', descripcion: 'Mantequilla cremosa ideal para untar en panes calientes.', precio_orig: 9000, precio_desc: 4000, stock: 16, categoria: 'Lácteos', url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idJose, nombre: 'Crema de Leche Premium 300g', descripcion: 'Textura espesa ideal para postres y salsas gourmet.', precio_orig: 7000, precio_desc: 3200, stock: 12, categoria: 'Lácteos', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idCarulla, nombre: 'Kumis Tradicional Vaso 1L', descripcion: 'Bebida láctea fermentada refrescante y nutritiva.', precio_orig: 8500, precio_desc: 4000, stock: 11, categoria: 'Lácteos', url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80' },

      // 🍞 CATEGORÍA: Panadería
      { id_proveedor: idJose, nombre: 'Mantecada Casera Tradicional Grande', descripcion: 'Mantecada suave y esponjosa horneada esta mañana.', precio_orig: 15000, precio_desc: 6900, stock: 5, categoria: 'Panadería', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idCarulla, nombre: 'Croissant Mantequilla Caja x4', descripcion: 'Croissants hojaldrados y crujientes con gran descuento.', precio_orig: 12000, precio_desc: 5000, stock: 6, categoria: 'Panadería', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idTrigal, nombre: 'Pandebonos Vallunos Recién Horneados x10', descripcion: 'Exquisitos pandebonos con queso listos para acompañar el café.', precio_orig: 15000, precio_desc: 7000, stock: 10, categoria: 'Panadería', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idJose, nombre: 'Torta de Chocolate Familiar Humeda', descripcion: 'Torta de chocolate cubierta de fudge. Perfecta para cumpleaños o postre.', precio_orig: 35000, precio_desc: 16900, stock: 4, categoria: 'Panadería', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idCarulla, nombre: 'Galletas de Avena y Pasas Caja x12', descripcion: 'Galletas saludables horneadas con ingredientes orgánicos.', precio_orig: 11000, precio_desc: 4900, stock: 8, categoria: 'Panadería', url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&auto=format&fit=crop&q=80' },

      // 🍽️ CATEGORÍA: Restaurante
      { id_proveedor: idJose, nombre: 'Almuerzo Ejecutivo Casero Completo', descripcion: 'Incluye arroz blanco, carne asada, ensalada fresca y sopa del día.', precio_orig: 18000, precio_desc: 8900, stock: 6, categoria: 'Restaurante', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idCarulla, nombre: 'Salmón Plancha + Vegetales Vapor', descripcion: 'Filete de salmón rosado asado a la perfección con verduras.', precio_orig: 36000, precio_desc: 18000, stock: 4, categoria: 'Restaurante', url: 'https://images.unsplash.com/photo-1485962398705-ef6a17c260ea?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idTrigal, nombre: 'Sushi Teriyaki Roll x10 piezas', descripcion: 'Roll de sushi relleno de salmón y aguacate bañado en salsa dulce.', precio_orig: 28000, precio_desc: 12500, stock: 7, categoria: 'Restaurante', url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idJose, nombre: 'Pasta Carbonara Tocino Parmesano', descripcion: 'Espagueti cremoso con tocineta crocante y abundante queso.', precio_orig: 22000, precio_desc: 9900, stock: 5, categoria: 'Restaurante', url: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&auto=format&fit=crop&q=80' },
      { id_proveedor: idCarulla, nombre: 'Cazuela de Mariscos Tradicional', descripcion: 'Sopa de mariscos cremosa con arroz con coco de acompañamiento.', precio_orig: 38000, precio_desc: 19000, stock: 3, categoria: 'Restaurante', url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80' },
    ];

    console.log(`Inyectando ${listado.length} productos con fechas de vencimiento futuras (visibilidad perpetua)...`);

    for (const p of listado) {
      const insertQuery = `
        INSERT INTO productos (id_proveedor, nombre, descripcion, precio_original, precio_descuento, stock, fecha_vencimiento, imagen_url, categoria, es_donacion, estado)
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE + INTERVAL '8 days', $7, $8, FALSE, 'disponible')
      `;
      await pool.query(insertQuery, [
        p.id_proveedor,
        p.nombre,
        p.descripcion,
        p.precio_orig,
        p.precio_desc,
        p.stock,
        p.url,
        p.categoria
      ]);
    }

    console.log('======================================================');
    console.log('🎉 INYECCIÓN COMPLETADA CON ÉXITO ABSOLUTO');
    console.log('======================================================\n');

  } catch (error) {
    console.error('❌ Error inyectando los 45 productos:', error.message);
  } finally {
    await pool.end();
  }
}

seed45Products();
