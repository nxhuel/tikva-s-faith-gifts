import historia from "@/assets/tikva-historia.jpeg";
import testimonio from "@/assets/tikva-testimonio.jpeg";
import logo from "@/assets/tikva-logo.png";
import hero from "@/assets/tikva-hero.png";

export const HERO_IMG = hero;
export const LOGO_IMG = logo;
export const NOTA_IMG = testimonio;
export const PACKS_IMG = historia;

// Mapa de imágenes "clásicas" por si algún producto seed las referencia por nombre.
const IMG: Record<string, string> = {
  "frasco-365": historia,
  packs: historia,
  anotadores: testimonio,
  separadores: testimonio,
  nota: testimonio,
};

/**
 * Resuelve la imagen de un producto:
 * - data-URLs y URLs (subidas por el admin) se devuelven tal cual
 * - claves conocidas (semilla) se mapean a los assets locales
 * - cualquier otra cosa cae a la imagen de respaldo
 */
export const productImage = (src?: string | null): string => {
  if (!src) return historia;
  if (src.startsWith("data:") || src.startsWith("http") || src.startsWith("/")) return src;
  return IMG[src] ?? historia;
};

/**
 * Convierte un archivo de imagen a data-URL, redimensionándolo antes
 * para no saturar el localStorage del MVP. Máximo maxDim px por lado, JPEG.
 */
export function fileToDataUrl(file: File, maxDim = 900, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer el archivo"));
    reader.onload = () => {
      const raw = String(reader.result ?? "");
      const img = new Image();
      img.onerror = () => resolve(raw);
      img.onload = () => {
        try {
          const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(raw);
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", quality));
        } catch {
          resolve(raw);
        }
      };
      img.src = raw;
    };
    reader.readAsDataURL(file);
  });
}

export async function filesToDataUrls(files: ArrayLike<File> | File[]): Promise<string[]> {
  const out: string[] = [];
  for (const file of Array.from(files)) {
    if (!file.type.startsWith("image/")) continue;
    try {
      out.push(await fileToDataUrl(file));
    } catch {
      /* skip */
    }
  }
  return out;
}

export function slugify(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
