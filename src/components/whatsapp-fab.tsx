import { useTikva } from "@/lib/store";

const WHATSAPP_NUMBER = "5491156582298";
const DEFAULT_MESSAGE =
  "Hola, me interesa conocer tus frascos y regalos. ¿Podés pasarme información? Gracias.";

export function WhatsAppFab() {
  const { usuario, ready } = useTikva();

  if (!ready || typeof window === "undefined") return null;
  if (window.location.pathname.startsWith("/admin")) return null;

  const handleClick = () => {
    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;
  };

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp"
      className="
        fixed
        bottom-6
        right-6
        z-50
        flex
        items-center
        justify-center
        rounded-full
        shadow-lg
        transition-transform
        hover:scale-105
      "
    >
      <img
        src="https://images.icon-icons.com/1571/PNG/512/1024881-whatsapp_107716.png"
        className="h-16 w-16 text-white"
        alt="WhatsApp"
      />
    </a>
  );
}
