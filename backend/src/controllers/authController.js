import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

// Generar Token JWT helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Registrar un nuevo usuario (Cliente, Proveedor o Domiciliario)
// @route   POST /api/auth/register
// @access  Público
export const registerUser = async (req, res, next) => {
  const {
    nombre_completo,
    email,
    password,
    telefono,
    rol, // 'cliente', 'proveedor', 'domiciliario', 'administrador'
    // Campos para Clientes
    fecha_nacimiento,
    preferencias_alimentarias,
    // Campos para Proveedores
    nit,
    razon_social,
    nombre_establecimiento,
    tipo_establecimiento,
    // Campos para Domiciliarios
    vehiculo_tipo,
    vehiculo_placa,
  } = req.body;

  // 1. Validaciones iniciales
  if (!nombre_completo || !email || !password || !rol) {
    res.status(400);
    return next(new Error('Por favor, ingrese todos los campos comunes requeridos'));
  }

  // Validar rol permitido
  const rolesPermitidos = ['cliente', 'proveedor', 'domiciliario'];
  if (!rolesPermitidos.includes(rol)) {
    res.status(400);
    return next(new Error('Rol de registro no válido. Debe ser cliente, proveedor o domiciliario.'));
  }

  const client = await pool.connect(); // Obtener un cliente del pool para iniciar transacción

  try {
    // 2. Verificar si el email ya existe
    const checkEmailQuery = 'SELECT id FROM usuarios WHERE email = $1';
    const emailCheck = await client.query(checkEmailQuery, [email]);
    if (emailCheck.rows.length > 0) {
      res.status(400);
      throw new Error('El correo electrónico ya se encuentra registrado');
    }

    // 3. Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. INICIAR TRANSACCIÓN SQL
    await client.query('BEGIN');

    // 5. Insertar en tabla padre: usuarios
    const insertUserQuery = `
      INSERT INTO usuarios (nombre_completo, email, password_hash, telefono, rol)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, nombre_completo, email, rol, estado, fecha_registro
    `;
    const userResult = await client.query(insertUserQuery, [
      nombre_completo,
      email,
      passwordHash,
      telefono,
      rol,
    ]);

    const newUser = userResult.rows[0];
    const userId = newUser.id;

    // 6. Insertar en subtablas correspondientes según el rol
    if (rol === 'cliente') {
      const insertClienteQuery = `
        INSERT INTO clientes (id_usuario, fecha_nacimiento, preferencias_alimentarias)
        VALUES ($1, $2, $3)
      `;
      await client.query(insertClienteQuery, [userId, fecha_nacimiento, preferencias_alimentarias]);
    } else if (rol === 'proveedor') {
      if (!nit || !razon_social || !nombre_establecimiento || !tipo_establecimiento) {
        throw new Error('Faltan campos específicos obligatorios para el perfil de proveedor (nit, razon_social, establecimiento, tipo)');
      }
      
      const insertProveedorQuery = `
        INSERT INTO proveedores (id_usuario, nit, razon_social, nombre_establecimiento, tipo_establecimiento)
        VALUES ($1, $2, $3, $4, $5)
      `;
      await client.query(insertProveedorQuery, [
        userId,
        nit,
        razon_social,
        nombre_establecimiento,
        tipo_establecimiento,
      ]);
    } else if (rol === 'domiciliario') {
      if (!vehiculo_tipo) {
        throw new Error('El tipo de vehículo es obligatorio para el perfil de domiciliario');
      }

      const insertDomiciliarioQuery = `
        INSERT INTO domiciliarios (id_usuario, vehiculo_tipo, vehiculo_placa)
        VALUES ($1, $2, $3)
      `;
      await client.query(insertDomiciliarioQuery, [userId, vehiculo_tipo, vehiculo_placa]);
    }

    // 7. CONFIRMAR TRANSACCIÓN
    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: {
        id: newUser.id,
        nombre_completo: newUser.nombre_completo,
        email: newUser.email,
        rol: newUser.rol,
        estado: newUser.estado,
        fecha_registro: newUser.fecha_registro,
      },
      token: generateToken(newUser.id),
    });
  } catch (error) {
    // 8. CANCELAR TRANSACCIÓN EN CASO DE ERROR
    await client.query('ROLLBACK');
    console.error('❌ Error transaccional en registro de usuario:', error.message);
    res.status(error.statusCode || 500);
    next(error);
  } finally {
    // Liberar cliente de la transacción
    client.release();
  }
};

// @desc    Iniciar sesión
// @route   POST /api/auth/login
// @access  Público
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    return next(new Error('Por favor, ingrese correo electrónico y contraseña'));
  }

  try {
    // Buscar usuario en tabla principal
    const userQuery = 'SELECT * FROM usuarios WHERE email = $1';
    const userResult = await pool.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      res.status(401);
      return next(new Error('Credenciales inválidas, correo no registrado'));
    }

    const user = userResult.rows[0];

    // Verificar si está activo
    if (user.estado !== 'activo') {
      res.status(403);
      return next(new Error('Esta cuenta ha sido desactivada o suspendida.'));
    }

    // Comparar hashes de contraseñas
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(401);
      return next(new Error('Credenciales inválidas, contraseña incorrecta'));
    }

    // Buscar información específica de perfil según rol
    let profileData = {};
    if (user.rol === 'cliente') {
      const q = 'SELECT fecha_nacimiento, preferencias_alimentarias, puntos_fidelidad FROM clientes WHERE id_usuario = $1';
      const r = await pool.query(q, [user.id]);
      if (r.rows.length > 0) profileData = r.rows[0];
    } else if (user.rol === 'proveedor') {
      const q = 'SELECT nit, razon_social, nombre_establecimiento, tipo_establecimiento, calificacion, puntos_sostenibilidad FROM proveedores WHERE id_usuario = $1';
      const r = await pool.query(q, [user.id]);
      if (r.rows.length > 0) profileData = r.rows[0];
    } else if (user.rol === 'domiciliario') {
      const q = 'SELECT vehiculo_tipo, vehiculo_placa, disponible, calificacion FROM domiciliarios WHERE id_usuario = $1';
      const r = await pool.query(q, [user.id]);
      if (r.rows.length > 0) profileData = r.rows[0];
    } else if (user.rol === 'administrador') {
      const q = 'SELECT nivel_acceso FROM administradores WHERE id_usuario = $1';
      const r = await pool.query(q, [user.id]);
      if (r.rows.length > 0) profileData = r.rows[0];
    }

    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        nombre_completo: user.nombre_completo,
        email: user.email,
        telefono: user.telefono,
        rol: user.rol,
        estado: user.estado,
        fecha_registro: user.fecha_registro,
        perfil: profileData,
      },
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error('❌ Error en inicio de sesión:', error.message);
    res.status(500);
    next(error);
  }
};
