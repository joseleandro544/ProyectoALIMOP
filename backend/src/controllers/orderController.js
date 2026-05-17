import pool from '../config/db.js';

// @desc    Crear un nuevo pedido (Compra o Donación) con validación transaccional de inventario
// @route   POST /api/pedidos
// @access  Privado (Solo Clientes)
export const createOrder = async (req, res, next) => {
  const { items, id_ubicacion_entrega, metodo_pago_solicitado } = req.body;
  const id_cliente = req.user.id;

  // 1. Validaciones iniciales
  if (!items || !Array.isArray(items) || items.length === 0 || !id_ubicacion_entrega) {
    res.status(400);
    return next(new Error('Para crear un pedido debe ingresar al menos un producto y una ubicación de entrega'));
  }

  const client = await pool.connect(); // Obtener conexión para la transacción

  try {
    // 2. Verificar que la ubicación pertenezca al cliente o exista
    const locationQuery = 'SELECT id FROM ubicaciones WHERE id = $1 AND id_usuario = $2';
    const locationCheck = await client.query(locationQuery, [id_ubicacion_entrega, id_cliente]);
    if (locationCheck.rows.length === 0) {
      res.status(400);
      throw new Error('La ubicación de entrega proporcionada no es válida o no pertenece al usuario autenticado');
    }

    // 3. INICIAR TRANSACCIÓN SQL
    await client.query('BEGIN');

    // 4. Crear el registro principal del pedido con total temporal en 0
    const insertPedidoQuery = `
      INSERT INTO pedidos (id_cliente, total, id_ubicacion_entrega, estado)
      VALUES ($1, 0.00, $2, 'pendiente')
      RETURNING id, fecha_pedido, estado
    `;
    const pedidoResult = await client.query(insertPedidoQuery, [id_cliente, id_ubicacion_entrega]);
    const newPedidoId = pedidoResult.rows[0].id;

    let totalCalculado = 0.00;
    const detallesInsertados = [];

    // 5. Procesar cada ítem de forma segura
    for (const item of items) {
      const { id_producto, cantidad } = item;

      if (!id_producto || !cantidad || cantidad <= 0) {
        throw new Error('Cada artículo del pedido debe tener un ID de producto y una cantidad mayor que cero');
      }

      // Obtener producto bloqueando la fila para actualización (evita problemas de concurrencia)
      const selectProductQuery = `
        SELECT id, nombre, stock, precio_original, precio_descuento, es_donacion, estado 
        FROM productos 
        WHERE id = $1 
        FOR UPDATE
      `;
      const productResult = await client.query(selectProductQuery, [id_producto]);

      if (productResult.rows.length === 0) {
        throw new Error(`El producto con ID ${id_producto} no existe en nuestro catálogo`);
      }

      const product = productResult.rows[0];

      // Validar stock disponible
      if (product.stock < cantidad) {
        throw new Error(`Stock insuficiente para el producto "${product.nombre}". Disponible: ${product.stock}, Solicitado: ${cantidad}`);
      }

      // Determinar precio unitario aplicable
      let precioUnitario = product.es_donacion ? 0.00 : product.precio_original;
      if (!product.es_donacion && product.precio_descuento !== null) {
        precioUnitario = product.precio_descuento;
      }

      const subtotalItem = parseFloat(precioUnitario) * cantidad;
      totalCalculado += subtotalItem;

      // Restar stock del producto
      const nuevoStock = product.stock - cantidad;
      const nuevoEstado = nuevoStock === 0 ? 'agotado' : product.estado;

      const updateStockQuery = `
        UPDATE productos 
        SET stock = $1, estado = $2 
        WHERE id = $3
      `;
      await client.query(updateStockQuery, [nuevoStock, nuevoEstado, id_producto]);

      // Insertar en detalle_pedidos
      const insertDetailQuery = `
        INSERT INTO detalle_pedidos (id_pedido, id_producto, cantidad, precio_unitario)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const detailResult = await client.query(insertDetailQuery, [newPedidoId, id_producto, cantidad, precioUnitario]);
      detallesInsertados.push({
        ...detailResult.rows[0],
        nombre_producto: product.nombre,
      });
    }

    // 6. Actualizar el total definitivo del pedido principal
    const updatePedidoTotalQuery = 'UPDATE pedidos SET total = $1 WHERE id = $2';
    await client.query(updatePedidoTotalQuery, [totalCalculado, newPedidoId]);

    // 7. Si es una compra de pago (total > 0), insertar registro en pagos
    let pagoCreado = null;
    if (totalCalculado > 0) {
      const metodo = metodo_pago_solicitado || 'efectivo';
      const insertPagoQuery = `
        INSERT INTO pagos (id_pedido, monto, metodo, estado, transaccion_id)
        VALUES ($1, $2, $3, 'pendiente', $4)
        RETURNING *
      `;
      // Simulamos un ID de pasarela transaccional de ALIMOP
      const simTransaccionId = `TX_${Date.now()}_${newPedidoId}`;
      const pagoResult = await client.query(insertPagoQuery, [newPedidoId, totalCalculado, metodo, simTransaccionId]);
      pagoCreado = pagoResult.rows[0];
    }

    // 8. CONFIRMAR TRANSACCIÓN
    await client.query('COMMIT');

    // 9. Otorgar puntos de fidelidad al cliente (1 punto por cada $1000 COP)
    if (totalCalculado > 0) {
      const puntosGanados = Math.floor(totalCalculado / 1000);
      if (puntosGanados > 0) {
        const updatePointsQuery = 'UPDATE clientes SET puntos_fidelidad = puntos_fidelidad + $1 WHERE id_usuario = $2';
        await pool.query(updatePointsQuery, [puntosGanados, id_cliente]);
        console.log(`🎁 Cliente ${id_cliente} acumuló +${puntosGanados} puntos de fidelidad`);
      }
    }

    res.status(201).json({
      success: true,
      message: totalCalculado > 0 ? 'Pedido de compra procesado exitosamente.' : 'Pedido de donación reservado exitosamente. ¡Gracias por salvar alimentos!',
      order: {
        id: newPedidoId,
        fecha_pedido: pedidoResult.rows[0].fecha_pedido,
        estado: pedidoResult.rows[0].estado,
        total: totalCalculado,
        id_ubicacion_entrega,
        items: detallesInsertados,
        pago: pagoCreado,
      },
    });
  } catch (error) {
    // 10. CANCELAR TRANSACCIÓN EN CASO DE ERROR
    await client.query('ROLLBACK');
    console.error('❌ Error transaccional en creación de pedido:', error.message);
    res.status(400);
    next(error);
  } finally {
    client.release(); // Devolver conexión al pool
  }
};

// @desc    Obtener lista de pedidos filtrados según el rol del usuario
// @route   GET /api/pedidos
// @access  Privado (Cualquier usuario autenticado)
export const getOrders = async (req, res, next) => {
  const { id, rol } = req.user;

  try {
    let queryText = '';
    const queryParams = [];

    if (rol === 'cliente') {
      // Clientes ven sus propios pedidos
      queryText = `
        SELECT p.*, u.direccion AS direccion_entrega, u.ciudad, u.latitud, u.longitud,
               pay.metodo AS pago_metodo, pay.estado AS pago_estado, pay.transaccion_id
        FROM pedidos p
        JOIN ubicaciones u ON p.id_ubicacion_entrega = u.id
        LEFT JOIN pagos pay ON pay.id_pedido = p.id
        WHERE p.id_cliente = $1
        ORDER BY p.fecha_pedido DESC
      `;
      queryParams.push(id);
    } else if (rol === 'proveedor') {
      // Proveedores ven pedidos que contienen productos que ellos ofrecen
      queryText = `
        SELECT DISTINCT p.id, p.fecha_pedido, p.estado, p.total, p.id_cliente,
                        u.direccion AS direccion_entrega, u.ciudad
        FROM pedidos p
        JOIN detalle_pedidos dp ON dp.id_pedido = p.id
        JOIN productos prod ON dp.id_producto = prod.id
        JOIN ubicaciones u ON p.id_ubicacion_entrega = u.id
        WHERE prod.id_proveedor = $1
        ORDER BY p.fecha_pedido DESC
      `;
      queryParams.push(id);
    } else if (rol === 'domiciliario') {
      // Domiciliarios ven pedidos asignados A ELLOS O pedidos pendientes disponibles en su ciudad
      queryText = `
        SELECT p.*, u.direccion AS direccion_entrega, u.ciudad, u.latitud, u.longitud,
               c.nombre_completo AS nombre_cliente, c.telefono AS telefono_cliente
        FROM pedidos p
        JOIN usuarios c ON p.id_cliente = c.id
        JOIN ubicaciones u ON p.id_ubicacion_entrega = u.id
        WHERE p.id_domiciliario = $1 OR (p.estado = 'pendiente' AND p.id_domiciliario IS NULL)
        ORDER BY p.fecha_pedido DESC
      `;
      queryParams.push(id);
    } else if (rol === 'administrador') {
      // Administradores ven absolutamente todo
      queryText = `
        SELECT p.*, u.direccion AS direccion_entrega, u.ciudad,
               cli.nombre_completo AS nombre_cliente, dom.nombre_completo AS nombre_domiciliario
        FROM pedidos p
        JOIN usuarios cli ON p.id_cliente = cli.id
        LEFT JOIN usuarios dom ON p.id_domiciliario = dom.id
        JOIN ubicaciones u ON p.id_ubicacion_entrega = u.id
        ORDER BY p.fecha_pedido DESC
      `;
    }

    const result = await pool.query(queryText, queryParams);

    // Adjuntar los ítems/desglose a cada pedido devuelto (para clientes y administradores principalmente)
    const ordersExtended = [];
    for (const order of result.rows) {
      const itemsQuery = `
        SELECT dp.*, p.nombre AS nombre_producto, p.imagen_url
        FROM detalle_pedidos dp
        JOIN productos p ON dp.id_producto = p.id
        WHERE dp.id_pedido = $1
      `;
      const itemsResult = await pool.query(itemsQuery, [order.id]);
      ordersExtended.push({
        ...order,
        items: itemsResult.rows,
      });
    }

    res.status(200).json({
      success: true,
      count: ordersExtended.length,
      orders: ordersExtended,
    });
  } catch (error) {
    console.error('❌ Error al obtener pedidos:', error.message);
    res.status(500);
    next(error);
  }
};
