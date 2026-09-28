import { api } from "@/lib/store";

/**
 * Subida de imágenes a Cloudinary.
 *
 * El navegador comprime la foto y la sube directo a Cloudinary usando una firma
 * que pide al backend: así el api_secret no sale del servidor y la base guarda
 * sólo la URL (~80 caracteres) en lugar del archivo en base64.
 */

const CARPETA_POR_DEFECTO = "tikva/productos";

type Firma = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
};

/**
 * Reduce la foto en el navegador antes de subirla (1600 px de lado mayor, JPEG).
 * Las fotos de celular pesan varios MB; esto ahorra datos y cuota de Cloudinary.
 */
export function comprimirImagen(file: File, maxDim = 1600, calidad = 0.85): Promise<Blob> {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/")) return resolve(file);
    const reader = new FileReader();
    reader.onerror = () => resolve(file);
    reader.onload = () => {
      const raw = String(reader.result ?? "");
      const img = new Image();
      img.onerror = () => resolve(file);
      img.onload = () => {
        try {
          const escala = Math.min(1, maxDim / Math.max(img.width, img.height));
          if (escala === 1 && file.size <= 900_000) return resolve(file);
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(img.width * escala));
          canvas.height = Math.max(1, Math.round(img.height * escala));
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(file);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => resolve(blob ?? file), "image/jpeg", calidad);
        } catch {
          resolve(file);
        }
      };
      img.src = raw;
    };
    reader.readAsDataURL(file);
  });
}

/** Sube una o varias imágenes y devuelve sus URLs públicas de Cloudinary. */
export async function subirImagenes(
  files: ArrayLike<File> | File[],
  carpeta = CARPETA_POR_DEFECTO,
): Promise<string[]> {
  const validos = Array.from(files).filter((f) => f.type.startsWith("image/"));
  if (validos.length === 0) return [];

  const firma = (await api("/uploads/firma", {
    method: "POST",
    body: JSON.stringify({ carpeta }),
  })) as Firma;

  const urls: string[] = [];
  for (const file of validos) {
    const blob = await comprimirImagen(file);
    const form = new FormData();
    form.append("file", blob, file.name || "foto.jpg");
    form.append("api_key", firma.apiKey);
    form.append("timestamp", String(firma.timestamp));
    form.append("folder", firma.folder);
    form.append("signature", firma.signature);

    const out = await fetch(
      `https://api.cloudinary.com/v1_1/${firma.cloudName}/image/upload`,
      { method: "POST", body: form },
    );
    const body: any = await out.json().catch(() => ({}));
    if (!out.ok || !body?.secure_url) {
      throw new Error(body?.error?.message ?? `No se pudo subir la imagen (${out.status})`);
    }
    urls.push(String(body.secure_url));
  }
  return urls;
}

/** Extrae el public_id de una URL de Cloudinary (null si no es de Cloudinary). */
export function publicIdDeUrl(url: string): string | null {
  if (!/res\.cloudinary\.com\//.test(url)) return null;
  const limpia = url.split("?")[0] ?? "";
  const m = limpia.match(/\/image\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z0-9]+)?$/i);
  return m?.[1] ?? null;
}

/** Borra de Cloudinary una imagen que ya no se usa (mejor esfuerzo, no rompe). */
export async function borrarImagen(url: string): Promise<void> {
  const publicId = publicIdDeUrl(url);
  if (!publicId) return;
  try {
    await api("/uploads/eliminar", { method: "POST", body: JSON.stringify({ publicId }) });
  } catch {
    /* la imagen queda huérfana en Cloudinary, no es crítico */
  }
}
