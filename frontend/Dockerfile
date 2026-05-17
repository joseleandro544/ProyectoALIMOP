# ETAPA 1: Construcción (Build)
FROM node:18-alpine AS builder

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar código fuente
COPY . .

# Compilar la aplicación React para producción
RUN npm run build

# ETAPA 2: Servidor Web de Producción (Nginx)
FROM nginx:alpine

# Limpiar directorio por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar la aplicación compilada desde la etapa 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Sobrescribir configuración de Nginx para permitir enrutamiento de React (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80 (HTTP)
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
