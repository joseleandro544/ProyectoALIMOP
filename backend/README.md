# API REST ALIMOP (Backend) 🚀🥗

Este es el servidor Backend de la plataforma **ALIMOP** desarrollado con **Node.js, Express y PostgreSQL 18**. Utiliza un pool de conexiones optimizado, hashing seguro de contraseñas con `bcryptjs`, y autenticación basada en tokens `JWT`.

---

## 🛠️ Requisitos e Instalación

### 1. Requisitos Previos
Asegúrate de tener instalado:
- **Node.js** (Versión 18 o superior)
- **NPM** (incluido con Node.js)
- **PostgreSQL** corriendo en tu máquina con la base de datos `db.alimop` creada y estructurada con el archivo [`database/schema.sql`](file:///c:/Users/ENBOG16/OneDrive%20-%20Grupo%20Energia%20Bogota/Escritorio/alimop/ProyectoALIMOP/database/schema.sql).

### 2. Instalación de Dependencias
Abre tu terminal en la carpeta `/backend` y ejecuta:

```bash
npm install
```

### 3. Ejecución del Servidor
- **Modo Desarrollo (con auto-recarga / hot-reload)**:
  ```bash
  npm run dev
  ```
- **Modo Producción**:
  ```bash
  npm start
  ```

---

## 💓 Diagnóstico de Conexión
Puedes verificar si el servidor y la base de datos están conectados correctamente abriendo tu navegador en:
🔗 **`http://localhost:5000/api/health`**

---

## 🔗 Catálogo Completo de Endpoints y Ejemplos de Pruebas (cURL)

A continuación, tienes ejemplos listos para copiar y ejecutar en tu terminal (PowerShell o Git Bash) para validar el funcionamiento del sistema:

### 1. Registro de Usuarios (`POST /api/auth/register`)

#### A. Registrar un Cliente
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_completo": "Mateo Delgado",
    "email": "mateo.delgado@gmail.com",
    "password": "MiClaveSegura123",
    "telefono": "3187654321",
    "rol": "cliente",
    "fecha_nacimiento": "2000-05-15",
    "preferencias_alimentarias": "Lácteos y panadería"
  }'
```

#### B. Registrar un Proveedor
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_completo": "Restaurante Wok Pepe Sierra",
    "email": "wok.pepe@wok.com.co",
    "password": "ClaveProveedor999",
    "telefono": "3154448888",
    "rol": "proveedor",
    "nit": "900.883.111-9",
    "razon_social": "Restaurantes de Oriente S.A.S.",
    "nombre_establecimiento": "Wok Calle 116",
    "tipo_establecimiento": "Restaurante"
  }'
```

#### C. Registrar un Domiciliario
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_completo": "Camilo Torres",
    "email": "camilo.torres@gmail.com",
    "password": "ClaveDomiciliario2026",
    "telefono": "3101112233",
    "rol": "domiciliario",
    "vehiculo_tipo": "Bicicleta Eléctrica"
  }'
```

---

### 2. Inicio de Sesión (`POST /api/auth/login`)
Para acceder a rutas protegidas, debes iniciar sesión y extraer el `"token"` devuelto en la respuesta.

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan.gomez@gmail.com",
    "password": "Leo1406"
  }'
```
*(Nota: Para todos los usuarios semilla insertados en la Fase 1, la contraseña de prueba por defecto es `Leo1406`)*.

---

### 3. Catálogo de Productos

#### A. Listar Productos Públicos (Filtros por defecto: vigencia de fecha de vencimiento)
```bash
curl -X GET http://localhost:5000/api/productos
```

#### B. Buscar Alimentos Cercanos con GPS (Fórmula Haversine integrada)
Si envías tu latitud/longitud y un radio en kilómetros, la API calculará la distancia exacta y filtrará los más cercanos:
```bash
curl -X GET "http://localhost:5000/api/productos?lat=4.70780000&lng=-74.05450000&max_dist_km=5"
```

#### C. Publicar un Producto Excedente (Privado - Solo Proveedores)
*(Reemplaza `<TOKEN_PROVEEDOR>` con el token obtenido en el login del proveedor)*.
```bash
curl -X POST http://localhost:5000/api/productos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_PROVEEDOR>" \
  -d '{
    "nombre": "Porción Torta Tres Leches",
    "descripcion": "Deliciosa torta refrigerada. Excedente del almuerzo de hoy.",
    "precio_original": 12000,
    "precio_descuento": 4500,
    "stock": 3,
    "fecha_vencimiento": "2026-05-18",
    "categoria": "Pastelería",
    "es_donacion": false
  }'
```

---

### 4. Flujo transaccional de Pedidos

#### A. Crear un Pedido de Compra (Privado - Solo Clientes)
*(Reemplaza `<TOKEN_CLIENTE>` con el token de login del cliente)*.
```bash
curl -X POST http://localhost:5000/api/pedidos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_CLIENTE>" \
  -d '{
    "id_ubicacion_entrega": 2,
    "metodo_pago_solicitado": "tarjeta_debito",
    "items": [
      {
        "id_producto": 1,
        "cantidad": 2
      },
      {
        "id_producto": 2,
        "cantidad": 1
      }
    ]
  }'
```

#### B. Obtener Historial de Pedidos (Privado - Adaptable según rol)
- Si eres **Cliente**, verás tus compras.
- Si eres **Proveedor**, verás los pedidos de tus productos.
- Si eres **Domiciliario**, verás tus asignaciones y las entregas pendientes libres de tu zona.
```bash
curl -X GET http://localhost:5000/api/pedidos \
  -H "Authorization: Bearer <TOKEN_DE_SESION>"
```

---

### 5. Atención al Cliente: PQRs

#### A. Radicar una Queja o Sugerencia (Privado - Cualquier Usuario)
```bash
curl -X POST http://localhost:5000/api/pqrs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_USUARIO>" \
  -d '{
    "tipo": "queja",
    "asunto": "Producto no disponible en la entrega",
    "descripcion": "El restaurante aceptó la orden pero cuando llegó el domiciliario indicaron que no quedaban existencias de ensalada."
  }'
```

#### B. Resolver una PQR (Privado - Solo Administradores)
```bash
curl -X PUT http://localhost:5000/api/pqrs/1/resolver \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_ADMINISTRADOR>" \
  -d '{
    "respuesta": "Hemos verificado la situación con el restaurante y aplicado una sanción en sus puntos de sostenibilidad. Te hemos abonado 50 puntos de fidelidad en compensación."
  }'
```
