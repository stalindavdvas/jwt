# Usa la imagen base de Node.js
FROM node:14

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de configuración de Node.js
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install

# Copia los archivos del proyecto
COPY . .

# Establece la variable de entorno para el puerto
ENV PORT=3001

# Expone el puerto en el contenedor
EXPOSE 3001

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
