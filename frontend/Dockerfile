# ---------- BUILD ----------
FROM node:20-slim AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --include=dev

COPY tsconfig.json vite.config.ts ./
COPY src src
COPY public public

# Compila el server TanStack Start con el preset node-server (server Node + estáticos)
ENV NITRO_PRESET=node-server
ENV VITE_BACKEND_URL=/api
ARG BACKEND_ORIGIN=http://api:3001
ENV BACKEND_ORIGIN=${BACKEND_ORIGIN}
RUN npm run build

# ---------- RUN ----------
FROM node:20-slim AS runner
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /app/.output/server ./server
COPY --from=builder /app/.output/public ./public

ENV PORT=3000
EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server/index.mjs"]
