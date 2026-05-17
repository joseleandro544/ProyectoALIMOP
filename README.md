# ALIMOP - Ecosistema de Prevención de Pérdida de Alimentos 🥗🇨🇴

¡Bienvenido al repositorio oficial de **ALIMOP**! Esta plataforma tiene como objetivo reducir el desperdicio de alimentos y optimizar las ventas online de productos cercanos a expirar en comercios colombianos, mitigando el impacto ambiental (CO₂) y ofreciendo ahorros significativos a los consumidores.

El desarrollo está organizado en 4 fases secuenciales de ingeniería de software. Actualmente, las fases de base de datos, backend y frontend están **100% implementadas**.

---

## 📐 Arquitectura del Sistema y Carpetas

El proyecto está estructurado de manera limpia y modularizada:

```
ProyectoALIMOP/
│
├── logo.jpg                 <-- Logotipo corporativo de ALIMOP
│
├── database/                <-- FASE 1: Diseño Conceptual y PostgreSQL 18
│   ├── schema.sql           <-- Script DDL de creación de tablas, índices y datos semilla
│   └── README.md            <-- Documentación técnica del Modelo Entidad-Relación (MER)
│
├── backend/                 <-- FASE 2: API REST en Node.js + Express
│   ├── src/                 <-- Controladores, rutas, middlewares y pool de base de datos
│   ├── .env                 <-- Variables de conexión local (db.alimop)
│   ├── package.json         <-- Configuración y dependencias de NPM
│   └── README.md            <-- Manual de endpoints y comandos de prueba cURL
│
├── frontend/                <-- FASE 3: Interfaz Web Interactiva en React
│   ├── src/                 <-- Componentes, vistas y hojas de estilo premium
│   ├── public/              <-- Recursos estáticos del servidor web
│   ├── package.json         <-- Configuración de compilación con Vite y Tailwind
│   └── README.md            <-- Guía de arranque rápido y paleta de colores blanca/azul
│
└── README.md                <-- Este archivo: Manual de entrada al ecosistema
```

---

## 🚀 Guía de Puesta en Marcha (Inicio Rápido)

Sigue estos tres pasos para levantar todo el ecosistema en tu máquina local:

### Paso 1: Configurar la Base de Datos (PostgreSQL)
1. Instala PostgreSQL 18.
2. Crea una base de datos llamada `db.alimop`.
3. Ejecuta el script [`database/schema.sql`](file:///c:/Users/ENBOG16/OneDrive%20-%20Grupo%20Energia%20Bogota/Escritorio/alimop/ProyectoALIMOP/database/schema.sql) para estructurar las tablas (jerarquía de usuarios 1:1, catálogos, pedidos transaccionales, pagos y PQRs) e insertar los datos semilla colombianos.
   *(Consulta las instrucciones detalladas en [database/README.md](file:///c:/Users/ENBOG16/OneDrive%20-%20Grupo%20Energia%20Bogota/Escritorio/alimop/ProyectoALIMOP/database/README.md))*.

### Paso 2: Iniciar el Servidor Backend (API REST)
1. Abre tu terminal en la carpeta `/backend`.
2. Instala las dependencias y arranca el servidor en modo desarrollo:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
3. El servidor correrá en `http://localhost:5000`. Puedes verificar la salud de la conexión abriendo:
   🔗 **`http://localhost:5000/api/health`**

### Paso 3: Iniciar la Interfaz Web (React Frontend)
1. Abre otra terminal en la carpeta `/frontend`.
2. Instala las dependencias y ejecuta el comando de copia de logotipo corporativo:
   ```bash
   cd frontend
   npm install
   npm run copy-logo
   npm run dev
   ```
3. El dev server de React con Vite arrancará en el puerto 3000:
   🔗 **`http://localhost:3000`**

---

## 📈 Ejes y Objetivos del Ecosistema ALIMOP

Implementados con fidelidad en la sección institucional de la aplicación web:
1. **Minimizar Pérdidas**: Consolidar una herramienta tecnológica (aplicación) que permita minimizar la pérdida de los alimentos, diseñada para empresas comercializadoras.
2. **Impulso de Ventas**: Incrementar las ventas online de productos alimenticios, próximos a vencerse o desperdiciarse.
3. **Sostenibilidad Ecológica**: Reducir la contaminación ambiental, especialmente con los desperdicios de los alimentos.

---

## 🎯 Siguiente Fase: Fase 4 (Sistema Distribuido e Integración GitLab)
En la última etapa del desarrollo llevaremos a cabo:
- La contenedorización de servicios con **Docker** y **Docker Compose**.
- La integración y despliegue del portafolio distribuido en **GitLab Pages**.
- La configuración de ramas y subida a tu cuenta de GitHub (`joseleandro544/ProyectoALIMOP`).