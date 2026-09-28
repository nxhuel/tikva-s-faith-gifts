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
 * - data-URLs y URLs (las de Cloudinary, subidas desde el panel) se devuelven tal cual
 * - claves conocidas (semilla) se mapean a los assets locales
 * - cualquier otra cosa cae a la imagen de respaldo
 */
export const productImage = (src?: string | null): string => {
  if (!src) return historia;
  if (src.startsWith("data:") || src.startsWith("http") || src.startsWith("/")) return src;
  return IMG[src] ?? historia;
};

export function slugify(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
