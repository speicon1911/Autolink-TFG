# Etapa 1: Construcción
FROM node:20-alpine AS build
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar código y construir la aplicación (SSR)
COPY . .
RUN npm run build

# Etapa 2: Ejecución
FROM node:20-alpine
WORKDIR /app

# Copiar los archivos construidos y las dependencias de producción
COPY --from=build /app/dist/autolink-frontend ./dist/autolink-frontend
COPY --from=build /app/package*.json ./

# Instalar solo dependencias de producción para mantener la imagen ligera
RUN npm install --omit=dev

# Exponer el puerto por defecto de Angular SSR
EXPOSE 4000

# Comando para arrancar el servidor de Node
CMD ["node", "dist/autolink-frontend/server/server.mjs"]
