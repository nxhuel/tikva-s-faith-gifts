import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { linkWhatsapp, useTikva } from "@/lib/store";

export function WhatsAppFab() {
  const { negocio, ready } = useTikva();

  if (!ready || typeof window === "undefined") return null;
  if (window.location.pathname.startsWith("/admin")) return null;

  const href = linkWhatsapp(
    negocio.whatsapp,
    `Hola ${negocio.nombre}! Me interesa conocer los productos. ¿Me pasás más información?`,
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <WhatsAppIcon className="h-8 w-8" />
    </a>
  );
}
