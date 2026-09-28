/**
 * Opciones de conexión a Postgres en un solo lugar: así los tres clientes
 * (server, init y migración) se conectan siempre igual.
 *
 * Acepta dos formas de configurar la base:
 * - `DATABASE_URL` (lo más cómodo en Render: pegás la "Internal Database URL")
 * - o las variables sueltas `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
 *
 * Sobre el SSL en Render:
 * - las conexiones **internas** (usando la internal URL) funcionan sin SSL;
 * - las **externas** exigen SSL, así que en ese caso hay que poner `DB_SSL=true`.
 *   También se activa solo si la URL trae `sslmode=require`.
 * (Los certificados de Render son self-signed, por eso `rejectUnauthorized: false`.)
 */
export function opcionesConexion() {
  const url = (process.env.DATABASE_URL ?? "").trim();

  let host = process.env.DB_HOST ?? "db";
  let port = Number(process.env.DB_PORT ?? 5432);
  let database = process.env.DB_NAME ?? "tikva";
  let user = process.env.DB_USER ?? "tikva";
  let password = process.env.DB_PASSWORD ?? "tikva";
  let sslmode = "";

  if (url) {
    const u = new URL(url);
    host = u.hostname;
    port = Number(u.port || 5432);
    database = decodeURIComponent(u.pathname.replace(/^\//, ""));
    user = decodeURIComponent(u.username);
    password = decodeURIComponent(u.password);
    sslmode = u.searchParams.get("sslmode") ?? "";
  }

  const pideSsl =
    String(process.env.DB_SSL ?? "").toLowerCase() === "true" || sslmode === "require";

  return {
    host,
    port,
    database,
    user,
    password,
    max: Number(process.env.DB_POOL ?? 10),
    ssl: pideSsl ? { rejectUnauthorized: false } : undefined,
  };
}
