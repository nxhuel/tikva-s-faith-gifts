FROM node:20-slim AS backend
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
WORKDIR /app/backend

COPY backend/package.json backend/tsconfig.json ./
COPY backend/src ./src
COPY backend/entrypoint.sh ./

RUN npm install --omit=dev --include=dev && chmod +x entrypoint.sh

EXPOSE 3001
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "entrypoint.sh"]
