# ALIMOP - Frontend Web 🥗💻

Este es el portal frontend interactivo de **ALIMOP** (Sistema de Prevención de Pérdida de Alimentos) desarrollado con **React, Vite y Tailwind CSS**. Cuenta con un diseño premium adaptado 100% en español según sus indicaciones específicas.

---

## 🎨 Especificaciones Visuales Aplicadas

- **Logotipo Corporativo**: Se carga e integra automáticamente utilizando la imagen corporativa [`logo.jpg`](file:///c:/Users/ENBOG16/OneDrive%20-%20Grupo%20Energia%20Bogota/Escritorio/alimop/ProyectoALIMOP/logo.jpg) en el encabezado.
- **Fondo de la Interfaz**: Totalmente blanco (`#ffffff`) para máxima legibilidad y estética limpia.
- **Cabecera (Header)**: Azul corporativo vibrante (`#1e40af`) con texto blanco y buscador integrado.
- **Pie de Página (Footer)**: Azul sólido oscuro (`#1e3a8a`) con enlaces institucionales e información del proyecto.
- **Idioma**: 100% de la interfaz traducida y escrita en español.

---

## 🛠️ Instrucciones de Arranque Rápido

### 1. Requisitos Previos
Asegúrate de contar con **Node.js** (Versión 18 o superior) en tu sistema.

### 2. Instalación de Dependencias
Abre tu terminal en la carpeta `/frontend` y ejecuta:
```bash
npm install
```

### 3. Copiar el Logotipo Corporativo
Para que la aplicación de React pueda mostrar tu logotipo `logo.jpg` de forma estática en la web, ejecuta el script automatizado que hemos creado para ti (en sistemas Windows):
```bash
npm run copy-logo
```
*(Este comando copiará automáticamente `logo.jpg` desde la raíz a la carpeta pública `frontend/public/` del servidor web)*.

### 4. Lanzar el Servidor de Desarrollo
Para abrir la web interactiva localmente, ejecuta:
```bash
npm run dev
```
🔗 **Abre en tu navegador:** **`http://localhost:3000`**

---

## 🧭 Estructura de Secciones y Características

1. **Inicio**: Renders del banner principal en color azul, estadísticas animadas de Kg de alimentos salvados y toneladas de CO₂ reducidas en Colombia (gracias a gráficos integrados en Tailwind y CSS).
2. **¿Qué es ALIMOP?**: Sección corporativa oficial que despliega el subtítulo *Sistema de Prevención de Pérdida de Alimentos* y los **3 objetivos estratégicos** de sostenibilidad que nos indicaste.
3. **Compras**: Catálogo dinámico de excedentes de comida. Permite añadir alimentos al carrito de compras, ver precios tachados con hasta un 70% de descuento y calcular la cercanía GPS.
4. **Registro**: Formulario interactivo donde puedes registrarte en el sistema. Captura campos comunes (email, clave, teléfono) y **campos de rol específicos (modelo 1:1)** para Clientes (preferencias), Proveedores (NIT, Razón Social) y Domiciliarios (vehículo).
5. **Un Buscador**: Barra de búsqueda directa integrada en la cabecera azul que filtra el catálogo en tiempo real a medida que escribes.
6. **Simulación GPS**: Selector en el header que te permite simular que estás en Pepe Sierra, Cedritos o el Centro de Bogotá, recalculando y ordenando instantáneamente las distancias de los alimentos del catálogo.
