# Usar la imagen oficial y ligera de Node.js 18
FROM node:18-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar el manifiesto de dependencias
COPY package*.json ./

# Instalar dependencias en producción
RUN npm install --only=production

# Copiar el código fuente
COPY . .

# Exponer el puerto del Backend (usualmente 5000)
EXPOSE 5000

# Comando para inicializar la aplicación de manera estándar
CMD ["node", "src/index.js"]
