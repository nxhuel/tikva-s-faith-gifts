import crypto from "node:crypto";

/**
 * Hash de contraseñas con scrypt (incluido en Node, sin dependencias nuevas).
 *
 * Las contraseñas nunca se guardan ni se devuelven en texto plano. El formato
 * almacenado es:
 *
 *   scrypt$<N>$<r>$<p>$<sal en base64>$<hash en base64>
 *
 * Guardar los parámetros dentro del propio valor permite endurecerlos en el
 * futuro sin invalidar los hashes viejos (se migran solos al iniciar sesión).
 */

const PREFIJO = "scrypt";
const COSTO = 16384; // N
const BLOQUE = 8; // r
const PARALELISMO = 1; // p
const LARGO = 64; // bytes de la clave derivada
const MAXMEM = 64 * 1024 * 1024;

/** ¿El valor ya está hasheado (o es de una versión vieja en texto plano)? */
export function esHash(valor: string): boolean {
  return typeof valor === "string" && valor.startsWith(`${PREFIJO}$`);
}

function derivar(
  clave: string,
  sal: Buffer,
  N: number,
  r: number,
  p: number,
): Promise<Buffer> {
  return new Promise((resolver, rechazar) => {
    crypto.scrypt(clave, sal, LARGO, { N, r, p, maxmem: MAXMEM }, (error, derivada) => {
      if (error) rechazar(error);
      else resolver(derivada as Buffer);
    });
  });
}

/** Devuelve el hash listo para guardar en `usuarios.password`. */
export async function hashearClave(clave: string): Promise<string> {
  const sal = crypto.randomBytes(16);
  const derivada = await derivar(clave, sal, COSTO, BLOQUE, PARALELISMO);
  return [
    PREFIJO,
    COSTO,
    BLOQUE,
    PARALELISMO,
    sal.toString("base64"),
    derivada.toString("base64"),
  ].join("$");
}

/** Comparación en tiempo constante (no filtra información por el tiempo). */
function compararSeguro(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  return bufferA.length === bufferB.length && crypto.timingSafeEqual(bufferA, bufferB);
}

/**
 * Verifica una contraseña contra el valor guardado.
 * Acepta hashes scrypt y, por compatibilidad, contraseñas viejas en texto plano
 * (mientras la migración de arranque las convierte).
 */
export async function verificarClave(clave: string, guardada: string): Promise<boolean> {
  if (!esHash(guardada)) return compararSeguro(clave, guardada);

  const partes = guardada.split("$");
  if (partes.length !== 6) return false;
  const [, n, r, p, salBase64, hashBase64] = partes;
  const esperada = Buffer.from(hashBase64, "base64");
  const derivada = await derivar(clave, Buffer.from(salBase64, "base64"), Number(n), Number(r), Number(p));
  return derivada.length === esperada.length && crypto.timingSafeEqual(derivada, esperada);
}
