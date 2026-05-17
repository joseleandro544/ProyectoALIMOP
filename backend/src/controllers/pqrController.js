import pool from '../config/db.js';

// @desc    Radicar una nueva PQR
// @route   POST /api/pqrs
// @access  Privado (Cualquier usuario autenticado)
export const createPqr = async (req, res, next) => {
  const { tipo, asunto, descripcion } = req.body;
  const id_usuario = req.user.id;

  if (!tipo || !asunto || !descripcion) {
    res.status(400);
    return next(new Error('Faltan campos obligatorios para radicar la PQR (tipo, asunto, descripcion)'));
  }

  // Validar tipos permitidos
  const tiposPermitidos = ['peticion', 'queja', 'reclamo', 'sugerencia'];
  if (!tiposPermitidos.includes(tipo)) {
    res.status(400);
    return next(new Error('El tipo de PQR debe ser: peticion, queja, reclamo o sugerencia'));
  }

  try {
    const insertQuery = `
      INSERT INTO pqrs (id_usuario, tipo, asunto, descripcion, estado)
      VALUES ($1, $2, $3, $4, 'abierto')
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [id_usuario, tipo, asunto, descripcion]);

    res.status(201).json({
      success: true,
      message: 'Tu solicitud PQR ha sido radicada correctamente con estado "abierto". Responderemos lo antes posible.',
      pqr: result.rows[0],
    });
  } catch (error) {
    console.error('❌ Error al registrar PQR:', error.message);
    res.status(500);
    next(error);
  }
};

// @desc    Obtener lista de PQRs (Usuarios ven las suyas, administradores ven todas)
// @route   GET /api/pqrs
// @access  Privado (Cualquier usuario autenticado)
export const getPqrs = async (req, res, next) => {
  const { id, rol } = req.user;

  try {
    let queryText = '';
    const queryParams = [];

    if (rol === 'administrador') {
      // Admin ve todas
      queryText = `
        SELECT p.*, u.nombre_completo AS nombre_usuario, u.email AS email_usuario, u.rol AS rol_usuario
        FROM pqrs p
        JOIN usuarios u ON p.id_usuario = u.id
        ORDER BY p.fecha_creacion DESC
      `;
    } else {
      // Clientes/Proveedores/Domiciliarios ven sus propias solicitudes
      queryText = `
        SELECT * FROM pqrs
        WHERE id_usuario = $1
        ORDER BY fecha_creacion DESC
      `;
      queryParams.push(id);
    }

    const result = await pool.query(queryText, queryParams);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      pqrs: result.rows,
    });
  } catch (error) {
    console.error('❌ Error al obtener PQRs:', error.message);
    res.status(500);
    next(error);
  }
};

// @desc    Responder y resolver una PQR
// @route   PUT /api/pqrs/:id/resolver
// @access  Privado (Solo Administradores)
export const resolvePqr = async (req, res, next) => {
  const { id } = req.params;
  const { respuesta } = req.body;

  if (!respuesta || respuesta.trim() === '') {
    res.status(400);
    return next(new Error('Debe ingresar una respuesta textual para solucionar la PQR'));
  }

  try {
    // Verificar si el ticket existe
    const pqrCheck = await pool.query('SELECT id, estado FROM pqrs WHERE id = $1', [id]);
    if (pqrCheck.rows.length === 0) {
      res.status(404);
      throw new Error(`La PQR con ID ${id} no existe`);
    }

    const updateQuery = `
      UPDATE pqrs 
      SET respuesta = $1, estado = 'resuelto', fecha_resolucion = CURRENT_TIMESTAMP 
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [respuesta, id]);

    res.status(200).json({
      success: true,
      message: 'PQR resuelta exitosamente',
      pqr: result.rows[0],
    });
  } catch (error) {
    console.error('❌ Error al resolver PQR:', error.message);
    res.status(res.statusCode || 500);
    next(error);
  }
};
