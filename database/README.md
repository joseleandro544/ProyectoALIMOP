# Base de Datos ALIMOP 🥗🇨🇴

Este directorio contiene la definición estructural y los datos semilla para la base de datos de **ALIMOP**, una plataforma enfocada en la reducción del desperdicio de alimentos y optimización logística en Colombia.

---

## 📂 Contenido del Directorio
- [`schema.sql`](file:///c:/Users/ENBOG16/OneDrive%20-%20Grupo%20Energia%20Bogota/Escritorio/alimop/ProyectoALIMOP/database/schema.sql): Script DDL (Data Definition Language) que define tipos ENUM, tablas, relaciones, claves primarias/foráneas, restricciones (`CHECK`), índices de rendimiento y datos semilla realistas de prueba.

---

## 📐 Modelo de Datos y Diseño Conceptual

### Jerarquía de Usuarios (Especialización 1:1)
Para gestionar de forma eficiente los múltiples perfiles del sistema (`cliente`, `proveedor`, `domiciliario`, `administrador`), implementamos el patrón de **Especialización 1:1**. 

La tabla `usuarios` almacena los datos globales e inicio de sesión (email, clave, teléfono, rol). Cada rol específico posee su propia tabla asociada, compartiendo el mismo ID de la tabla `usuarios` como Clave Primaria (`PK`) y Clave Foránea (`FK`):

```
  ┌────────────────────────────────────────────────────────┐
  │                        usuarios                        │
  │  (id [PK], nombre, email, password_hash, rol, estado)  │
  └───────────────────────────┬────────────────────────────┘
                              │
         ┌────────────┬───────┴────────┬─────────────┐
        1:1          1:1              1:1           1:1
         ▼            ▼                ▼             ▼
  ┌───────────┐┌──────────────┐┌──────────────┐┌──────────────┐
  │ clientes  ││ proveedores  ││domiciliarios ││administradores│
  │ (id_user) ││ (id_u, nit)  ││ (id_u, placa)││ (id_u, nivel)│
  └───────────┘└──────────────┘└──────────────┘└──────────────┘
```

#### Ventajas de este enfoque:
1. **Evita Valores Nulos (`NULL`)**: El proveedor no tiene campos vacíos de cliente (ej. fecha de nacimiento) ni viceversa.
2. **Escalabilidad Limpia**: Podemos añadir atributos exclusivos a cualquier rol (ej. tipo de vehículo en `domiciliarios` o nit en `proveedores`) sin afectar las demás tablas.
3. **Compatibilidad con ORMs**: Simplifica el mapeo objeto-relacional en Prisma o Sequelize al pasar a la **Fase 2**.

---

## 🔗 Relaciones Clave del Negocio

1. **Ubicaciones e Inteligencia de Cercanía**:
   - Cada usuario puede tener múltiples `ubicaciones` (latitud y longitud reales en Bogotá/Medellín). Esto permite al motor realizar consultas espaciales dinámicas en la **Fase 2** para mostrar alimentos con descuento a menos de X km de distancia.
2. **Catálogo de Alimentos (Productos)**:
   - Los `productos` pertenecen a un `proveedor`. Tienen atributos clave para el desperdicio: `fecha_vencimiento`, `precio_original` y `precio_descuento` (un precio rebajado dinámico conforme se acerca la fecha de expiración), o la bandera `es_donacion` para productos gratuitos.
3. **Flujo de Compra**:
   - Un `cliente` genera un `pedido`.
   - Se asocia un `domiciliario` para la entrega.
   - El pedido tiene múltiples `detalle_pedidos` que enlazan productos y cantidades.
   - Los pedidos no gratuitos requieren un registro único en la tabla `pagos`.
4. **PQR (Atención al Cliente)**:
   - Vincula quejas, sugerencias o reclamos directos de cualquier `usuario` hacia los administradores de la plataforma.

---

## 🚀 Cómo Ejecutar el Script en tu PostgreSQL Local

Para aplicar la estructura a tu base de datos local `db.alimop` con la clave `Leo1406`, puedes seguir cualquiera de estos métodos:

### Método A: Desde pgAdmin (Interfaz Gráfica)
1. Abre **pgAdmin** en tu computadora.
2. Conéctate a tu servidor local de PostgreSQL.
3. Haz clic derecho sobre tu base de datos **`db.alimop`** y selecciona **Query Tool** (Herramienta de Consultas).
4. Copia todo el contenido del archivo [`schema.sql`](file:///c:/Users/ENBOG16/OneDrive%20-%20Grupo%20Energia%20Bogota/Escritorio/alimop/ProyectoALIMOP/database/schema.sql).
5. Pégalo en el editor de pgAdmin y presiona **F5** (o el botón de reproducir/ejecutar).
6. ¡Listo! Se habrán creado todas las tablas y los datos semilla de prueba se habrán insertado automáticamente.

### Método B: Desde la Línea de Comandos (PowerShell / CMD)
Ejecuta la herramienta interactiva de consola `psql` apuntando al archivo:

```bash
psql -U postgres -d db.alimop -f "c:\Users\ENBOG16\OneDrive - Grupo Energia Bogota\Escritorio\alimop\ProyectoALIMOP\database\schema.sql"
```
*(Ingresa tu clave `Leo1406` cuando te sea solicitada)*.

---

## 📊 Visualización de Datos Semilla de Prueba
El script SQL inserta registros colombianos reales de ejemplo para que puedas probar la aplicación inmediatamente:
- **Proveedores**: *Carulla Calle 116* y *Panadería El Trigal Norte*.
- **Productos**: Ensaladas César César 300g (estado `casi_vencido`), Pan rústico de masa madre, Donas de chocolate y una caja de Bananos para Donación (gratuita).
- **Clientes**: Juan Carlos Gómez y Camila Restrepo (ubicados en el norte de Bogotá).
- **Domiciliarios**: Andrés Felipe Barbosa (con moto de placas `XYZ-98F`).
- **Pagos y PQRs**: Ejemplos reales de transacciones aprobadas y PQRs resueltas con respuestas administrativas.
