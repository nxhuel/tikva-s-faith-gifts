FROM node:20-slim AS backend
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
WORKDIR /app/backend

# El contexto de build es la carpeta backend/ (en Render: Root Directory = backend)
COPY package.json tsconfig.json ./
COPY src ./src
COPY entrypoint.sh ./

# Defensa ante checkouts en Windows: si el .sh llega con CRLF, /bin/sh
# falla con "set: Illegal option -". Se normaliza dentro de la imagen.
RUN npm install --omit=dev --include=dev \
    && sed -i 's/\r$//' entrypoint.sh \
    && chmod +x entrypoint.sh

EXPOSE 3001
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "entrypoint.sh"]
