import pool from '../config/db.js';

// @desc    Obtener lista de productos con filtros avanzados (categorías, estado, donaciones y distancia GPS)
// @route   GET /api/productos
// @access  Público
export const getProducts = async (req, res, next) => {
  const {
    categoria,
    es_donacion,
    estado,
    id_proveedor,
    lat,
    lng,
    max_dist_km, // Filtro de distancia en kilómetros
  } = req.query;

  try {
    let queryText = `
      SELECT p.*, pr.nombre_establecimiento, pr.tipo_establecimiento, 
             u.direccion, u.ciudad, u.latitud, u.longitud
    `;

    // Si se envían coordenadas del cliente, calculamos la distancia usando la fórmula Haversine en SQL (6371 km = Radio terrestre)
    const queryParams = [];
    let paramIndex = 1;

    if (lat && lng) {
      queryText += `,
        (6371 * acos(
          cos(radians($${paramIndex})) * 
          cos(radians(u.latitud)) * 
          cos(radians(u.longitud) - radians($${paramIndex + 1})) + 
          sin(radians($${paramIndex})) * 
          sin(radians(u.latitud))
        )) AS distancia_km
      `;
      queryParams.push(parseFloat(lat));
      queryParams.push(parseFloat(lng));
      paramIndex += 2;
    } else {
      queryText += `, NULL AS distancia_km`;
    }

    queryText += `
      FROM productos p
      JOIN proveedores pr ON p.id_proveedor = pr.id_usuario
      JOIN ubicaciones u ON pr.id_usuario = u.id_usuario AND u.es_principal = TRUE
      WHERE p.stock > 0 AND p.fecha_vencimiento >= CURRENT_DATE
    `;

    // Aplicar filtros dinámicos
    if (categoria) {
      queryText += ` AND p.categoria = $${paramIndex}`;
      queryParams.push(categoria);
      paramIndex++;
    }

    if (es_donacion !== undefined) {
      queryText += ` AND p.es_donacion = $${paramIndex}`;
      queryParams.push(es_donacion === 'true');
      paramIndex++;
    }

    if (estado) {
      queryText += ` AND p.estado = $${paramIndex}`;
      queryParams.push(estado);
      paramIndex++;
    }

    if (id_proveedor) {
      queryText += ` AND p.id_proveedor = $${paramIndex}`;
      queryParams.push(parseInt(id_proveedor));
      paramIndex++;
    }

    // Filtrar por distancia máxima si el usuario envió coordenadas y un límite
    if (lat && lng && max_dist_km) {
      queryText = `
        SELECT * FROM (${queryText}) AS productos_filtrados
        WHERE distancia_km <= $${paramIndex}
        ORDER BY distancia_km ASC
      `;
      queryParams.push(parseFloat(max_dist_km));
      paramIndex++;
    } else if (lat && lng) {
      // Ordenar por cercanía por defecto si hay coordenadas
      queryText += ` ORDER BY distancia_km ASC`;
    } else {
      // Ordenar por fecha de vencimiento más cercana por defecto para salvar comida
      queryText += ` ORDER BY p.fecha_vencimiento ASC, p.fecha_creacion DESC`;
    }

    const result = await pool.query(queryText, queryParams);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      products: result.rows,
    });
  } catch (error) {
    console.error('❌ Error al listar productos:', error.message);
    res.status(500);
    next(error);
  }
};

// @desc    Crear/Publicar un nuevo producto
// @route   POST /api/productos
// @access  Privado (Solo Proveedores)
export const createProduct = async (req, res, next) => {
  const {
    nombre,
    descripcion,
    precio_original,
    precio_descuento,
    stock,
    fecha_vencimiento,
    imagen_url,
    categoria,
    es_donacion,
  } = req.body;

  // El ID del proveedor proviene del token decodificado por req.user
  const id_proveedor = req.user.id;

  // 1. Validaciones requeridas
  if (!nombre || stock === undefined || !fecha_vencimiento || !categoria) {
    res.status(400);
    return next(new Error('Faltan campos obligatorios para la creación del producto'));
  }

  try {
    const isDonationBool = es_donacion === true || es_donacion === 'true';
    const originalPrice = isDonationBool ? 0 : parseFloat(precio_original);
    const discountPrice = isDonationBool ? 0 : (precio_descuento ? parseFloat(precio_descuento) : null);

    // Validar coherencia de precios
    if (!isDonationBool) {
      if (isNaN(originalPrice) || originalPrice <= 0) {
        res.status(400);
        throw new Error('Para productos de venta, el precio original debe ser mayor a 0');
      }
      if (discountPrice !== null && discountPrice > originalPrice) {
        res.status(400);
        throw new Error('El precio con descuento no puede ser mayor que el precio original');
      }
    }

    // Validar fecha de vencimiento
    const expiryDate = new Date(fecha_vencimiento);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (expiryDate < today) {
      res.status(400);
      throw new Error('La fecha de vencimiento no puede ser anterior al día de hoy');
    }

    // Determinar estado sugerido por vencimiento (casi_vencido si expira en <= 2 días)
    let estado = 'disponible';
    const diffTime = Math.abs(expiryDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 2) {
      estado = 'casi_vencido';
    }

    const insertQuery = `
      INSERT INTO productos (id_proveedor, nombre, descripcion, precio_original, precio_descuento, stock, fecha_vencimiento, imagen_url, categoria, es_donacion, estado)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      id_proveedor,
      nombre,
      descripcion,
      originalPrice,
      discountPrice,
      parseInt(stock),
      fecha_vencimiento,
      imagen_url || 'https://res.cloudinary.com/alimop/placeholder.jpg',
      categoria,
      isDonationBool,
      estado,
    ]);

    // Opcional: Otorgar puntos de sostenibilidad al proveedor por publicar
    const updatePointsQuery = `
      UPDATE proveedores 
      SET puntos_sostenibilidad = puntos_sostenibilidad + 10 
      WHERE id_usuario = $1
    `;
    await pool.query(updatePointsQuery, [id_proveedor]);

    res.status(201).json({
      success: true,
      message: 'Producto publicado exitosamente. ¡Ganaste +10 puntos de sostenibilidad!',
      product: result.rows[0],
    });
  } catch (error) {
    console.error('❌ Error al crear producto:', error.message);
    res.status(res.statusCode || 500);
    next(error);
  }
};
