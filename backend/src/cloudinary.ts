import crypto from "node:crypto";

/**
 * Integración con Cloudinary sin dependencias extra: el navegador sube la foto
 * directo a Cloudinary y acá sólo se firma la operación, así el api_secret
 * nunca sale del servidor.
 *
 * Se aceptan las credenciales de las dos formas habituales:
 *   1. CLOUDINARY_CLOUD_NAME + CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET
 *   2. CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
 * Las variables sueltas tienen prioridad si están las dos cosas.
 */

type Credenciales = { cloudName: string; apiKey: string; apiSecret: string };

/** Parsea `cloudinary://api_key:api_secret@cloud_name`. */
function desdeUrl(valor: string): Partial<Credenciales> {
  const m = valor.trim().match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  if (!m) return {};
  return { apiKey: m[1], apiSecret: m[2], cloudName: m[3] };
}

function credenciales(): Credenciales {
  const url = desdeUrl(process.env.CLOUDINARY_URL ?? "");
  return {
    cloudName: (process.env.CLOUDINARY_CLOUD_NAME ?? "").trim() || url.cloudName || "",
    apiKey: (process.env.CLOUDINARY_API_KEY ?? "").trim() || url.apiKey || "",
    apiSecret: (process.env.CLOUDINARY_API_SECRET ?? "").trim() || url.apiSecret || "",
  };
}

export function cloudName(): string {
  return credenciales().cloudName;
}

export function apiKey(): string {
  return credenciales().apiKey;
}

/** ¿Están las credenciales cargadas en el entorno? */
export function cloudinaryConfigurado(): boolean {
  const c = credenciales();
  return Boolean(c.cloudName && c.apiKey && c.apiSecret);
}

/** Datos que sí pueden viajar al navegador (el secret no). */
export function cloudinaryPublico() {
  const c = credenciales();
  return { cloudName: c.cloudName, apiKey: c.apiKey };
}

/**
 * Firma SHA-1 de los parámetros de una operación: el api_secret se concatena al
 * final de los pares ordenados alfabéticamente, tal como espera Cloudinary.
 */
export function firmarParametros(params: Record<string, string | number>): string {
  const base = Object.keys(params)
    .sort()
    .map((clave) => `${clave}=${params[clave]}`)
    .join("&");
  return crypto
    .createHash("sha1")
    .update(base + credenciales().apiSecret)
    .digest("hex");
}
