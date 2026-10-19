// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

/**
 * URL base del backend Express, normalizada: sin barra final y sin un "/api"
 * pegado de más. El proxy ya agrega el `/api/**` solo, así que si BACKEND_ORIGIN
 * viene como `https://mi-api.onrender.com/` o `https://mi-api.onrender.com/api`
 * el request salía a `/api/api/...` y el API respondía 404 en todas las llamadas.
 */
const backendOrigin = (process.env["BACKEND_ORIGIN"] ?? "http://localhost:3001")
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

/**
 * Preset de Nitro:
 * - Docker/local: el Dockerfile define NITRO_PRESET=node-server.
 * - Vercel: fuerza `vercel` para que el build genere `.vercel/output`
 *   (Build Output API) aunque el default de la config sea Cloudflare.
 */
const nitroPreset = process.env["NITRO_PRESET"] || (process.env["VERCEL"] ? "vercel" : undefined);

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
  // Proxy de /api al backend Express (válido en build Nitro y en dev).
  nitro: {
    ...(nitroPreset ? { preset: nitroPreset } : {}),
    routeRules: {
      "/api/**": {
        proxy: `${backendOrigin}/api/**`,
      },
    },
  },
});
