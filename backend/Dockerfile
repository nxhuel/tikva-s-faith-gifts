FROM node:20-slim AS backend
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
WORKDIR /app/backend

# El contexto de build es la carpeta backend/ (en Render: Root Directory = backend)
COPY package.json tsconfig.json ./
COPY src ./src
COPY entrypoint.sh ./

RUN npm install --omit=dev --include=dev && chmod +x entrypoint.sh

EXPOSE 3001
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "entrypoint.sh"]
