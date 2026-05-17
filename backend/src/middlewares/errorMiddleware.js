// Middleware global para el manejo unificado de errores HTTP
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  console.error(`❌ Error atrapado en Express [${req.method} ${req.url}]:`, err.stack || err.message);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    // Solo muestra la pila de error en desarrollo
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
