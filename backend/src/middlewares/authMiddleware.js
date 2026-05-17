import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

// Middleware para proteger rutas (Verifica si el usuario está autenticado con JWT)
export const protect = async (req, res, next) => {
  let token;

  // Verificamos si viene el token en la cabecera Authorization y empieza con Bearer
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extraemos el token del string "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verificar y decodificar el token JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Consultar el usuario en la base de datos (excluyendo la contraseña)
      const userQuery = 'SELECT id, nombre_completo, email, rol, estado FROM usuarios WHERE id = $1';
      const userResult = await pool.query(userQuery, [decoded.id]);

      if (userResult.rows.length === 0) {
        res.status(401);
        throw new Error('No autorizado, el usuario ya no existe');
      }

      const user = userResult.rows[0];

      if (user.estado !== 'activo') {
        res.status(403);
        throw new Error('Usuario inactivo o suspendido');
      }

      // Adjuntar el usuario al objeto request para uso posterior en los controladores
      req.user = user;
      next();
    } catch (error) {
      console.error('❌ Error de validación de JWT:', error.message);
      res.status(401);
      next(new Error('No autorizado, token inválido o expirado'));
    }
  }

  if (!token) {
    res.status(401);
    next(new Error('No autorizado, no se proporcionó ningún token'));
  }
};

// Middleware para autorizar roles específicos (ej. authorize('proveedor'))
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.rol)) {
      res.status(403);
      return next(new Error(`Acceso denegado: Rol '${req.user?.rol || 'ninguno'}' no tiene privilegios para esta acción`));
    }
    next();
  };
};
