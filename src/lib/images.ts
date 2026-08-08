import frasco from "@/assets/frasco-365.jpg.asset.json";
import packs from "@/assets/packs-tikva.jpg.asset.json";
import nota from "@/assets/versiculo-nota.jpg.asset.json";
import anotadores from "@/assets/anotadores.jpg.asset.json";
import separadores from "@/assets/separadores.jpg.asset.json";
import hero from "@/assets/hero-tikva.jpg.asset.json";
import logo from "@/assets/tikva-logo.png.asset.json";

export const IMG: Record<string, string> = {
  "frasco-365": frasco.url,
  packs: packs.url,
  nota: nota.url,
  anotadores: anotadores.url,
  separadores: separadores.url,
};

export const HERO_IMG = hero.url;
export const LOGO_IMG = logo.url;
export const NOTA_IMG = nota.url;
export const PACKS_IMG = packs.url;

export const productImage = (key: string) => IMG[key] ?? IMG["frasco-365"];
