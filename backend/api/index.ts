/**
 * Entry point serverless para Vercel.
 *
 * Vercel detecta este archivo dentro de `api/` y lo expone como una función.
 * El `vercel.json` redirige todas las rutas a `/api`, así que Express sigue
 * recibiendo la ruta original (`/api/productos`, `/api/auth/login`, etc.).
 */
import app from "../src/index.js";

export default app;
