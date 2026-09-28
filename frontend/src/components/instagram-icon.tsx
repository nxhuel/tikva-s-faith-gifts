import { useId } from "react";

type InstagramIconProps = {
  className?: string;
  /** Si se pasa, el ícono se anuncia a los lectores de pantalla con este texto. */
  title?: string;
};

/**
 * Logo de Instagram con su degradado original (amarillo → naranja → magenta →
 * violeta). Reemplaza al `Instagram` de lucide-react, que es monocromo y no
 * tiene los colores de la marca.
 *
 * El glifo (cuadrado redondeado + lente + punto) se dibuja con trazos
 * geométricos y el degradado se aplica a los trazos, así se ve idéntico al
 * logo real sin depender de archivos externos.
 */
export function InstagramIcon({ className, title }: InstagramIconProps) {
  // useId evita ids de degradado repetidos si el ícono aparece más de una vez.
  const gradId = `ig-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <defs>
        {/* Degradado oficial: amarillo abajo-izquierda → violeta arriba-derecha. */}
        <linearGradient
          id={gradId}
          gradientUnits="userSpaceOnUse"
          x1="2"
          y1="22"
          x2="22"
          y2="2"
        >
          <stop offset="0%" stopColor="#FEDA75" />
          <stop offset="26%" stopColor="#FA7E1E" />
          <stop offset="52%" stopColor="#D62976" />
          <stop offset="76%" stopColor="#962FBF" />
          <stop offset="100%" stopColor="#4F5BD5" />
        </linearGradient>
      </defs>
      <g
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="2" width="20" height="20" rx="5.6" ry="5.6" />
        <circle cx="12" cy="12" r="4.7" />
        <circle cx="17.7" cy="6.3" r="1.15" fill={`url(#${gradId})`} stroke="none" />
      </g>
    </svg>
  );
}
