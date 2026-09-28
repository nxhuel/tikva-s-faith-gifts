# Levantar con Docker

Suponemos que Docker y Docker Compose están instalados.

```bash
docker compose up -d db
docker compose up -d api
```

## URLs de prueba

- Backend API: http://localhost:3001/api/negocio
- Frontend (desarrollo): http://localhost:5173 (perfil `dev`)

## Frontend dev

```bash
docker compose --profile dev up -d
```

## Variables de entorno

Las variables opcionales viven en `backend/.env` o se pasan por docker-compose. El frontend lee `VITE_BACKEND_URL` (default: `http://localhost:3001`).
