import { useId } from "react";

/**
 * Medios de pago aceptados (Mercado Pago + las tarjetas que procesa en
 * Argentina), dibujados como tarjetas con los colores originales de cada marca.
 *
 * Son SVG locales: no dependen de imágenes externas que puedan caerse y se
 * adaptan al tema (el borde usa `currentColor`).
 */

const FONT = "Helvetica Neue, Helvetica, Arial, sans-serif";
const CARDSIZES = "h-8 w-[52px]";

type IconProps = { className?: string };

/** Marco de tarjeta: fondo redondeado + borde sutil que hereda el color del sitio. */
function CardShape({ fill }: { fill: string }) {
  return (
    <rect
      x="0.5"
      y="0.5"
      width="51"
      height="31"
      rx="4"
      fill={fill}
      stroke="currentColor"
      strokeOpacity="0.18"
    />
  );
}

function MercadoPago({ className }: IconProps) {
  return (
    <svg viewBox="0 0 52 32" className={className} role="img" aria-label="Mercado Pago">
      <CardShape fill="#009EE3" />
      <text x="26" y="14.5" textAnchor="middle" fontFamily={FONT} fontSize="9.5" fontWeight="700" fill="#fff">
        Mercado
      </text>
      <text x="26" y="25.5" textAnchor="middle" fontFamily={FONT} fontSize="9.5" fontWeight="700" fill="#fff">
        Pago
      </text>
    </svg>
  );
}

function Visa({ className }: IconProps) {
  return (
    <svg viewBox="0 0 52 32" className={className} role="img" aria-label="Visa">
      <CardShape fill="#fff" />
      <text
        x="26"
        y="22.5"
        textAnchor="middle"
        fontFamily={FONT}
        fontSize="17"
        fontStyle="italic"
        fontWeight="700"
        letterSpacing="0.5"
        fill="#1A1F71"
      >
        VISA
      </text>
    </svg>
  );
}

function Mastercard({ className }: IconProps) {
  const lensId = `mc-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg viewBox="0 0 52 32" className={className} role="img" aria-label="Mastercard">
      <CardShape fill="#fff" />
      <defs>
        {/* El lente naranja es la intersección de los dos círculos. */}
        <clipPath id={lensId}>
          <circle cx="20" cy="14" r="8.5" />
        </clipPath>
      </defs>
      <circle cx="20" cy="14" r="8.5" fill="#EB001B" />
      <circle cx="32" cy="14" r="8.5" fill="#F79E1B" />
      <circle cx="32" cy="14" r="8.5" fill="#FF5F00" clipPath={`url(#${lensId})`} />
      <text x="26" y="29.5" textAnchor="middle" fontFamily={FONT} fontSize="6.4" fontWeight="600" fill="#231F20">
        mastercard
      </text>
    </svg>
  );
}

function AmericanExpress({ className }: IconProps) {
  return (
    <svg viewBox="0 0 52 32" className={className} role="img" aria-label="American Express">
      <CardShape fill="#006FCF" />
      <rect x="3.5" y="3.5" width="45" height="25" rx="2" fill="none" stroke="#fff" strokeWidth="0.8" />
      <text
        x="26"
        y="21.5"
        textAnchor="middle"
        fontFamily={FONT}
        fontSize="12"
        fontWeight="700"
        letterSpacing="1.2"
        fill="#fff"
      >
        AMEX
      </text>
    </svg>
  );
}

function Cabal({ className }: IconProps) {
  return (
    <svg viewBox="0 0 52 32" className={className} role="img" aria-label="Cabal">
      <CardShape fill="#fff" />
      <text
        x="26"
        y="21.5"
        textAnchor="middle"
        fontFamily={FONT}
        fontSize="13"
        fontStyle="italic"
        fontWeight="800"
        letterSpacing="0.8"
        fill="#0089CF"
      >
        CABAL
      </text>
    </svg>
  );
}

function NaranjaX({ className }: IconProps) {
  return (
    <svg viewBox="0 0 52 32" className={className} role="img" aria-label="Naranja X">
      <CardShape fill="#fff" />
      <text
        x="26"
        y="20.5"
        textAnchor="middle"
        fontFamily={FONT}
        fontSize="9.5"
        fontWeight="700"
        fill="#FF5A00"
      >
        Naranja X
      </text>
    </svg>
  );
}

function DinersClub({ className }: IconProps) {
  return (
    <svg viewBox="0 0 52 32" className={className} role="img" aria-label="Diners Club">
      <CardShape fill="#0079BE" />
      <text
        x="26"
        y="14"
        textAnchor="middle"
        fontFamily={FONT}
        fontSize="8"
        fontWeight="700"
        letterSpacing="0.6"
        fill="#fff"
      >
        DINERS
      </text>
      <text
        x="26"
        y="24.5"
        textAnchor="middle"
        fontFamily={FONT}
        fontSize="8"
        fontWeight="700"
        letterSpacing="0.6"
        fill="#fff"
      >
        CLUB
      </text>
    </svg>
  );
}

export function PaymentMethods({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs font-medium text-ink">
        Pagá con <span className="text-[#009EE3]">Mercado Pago</span>
      </p>
      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
        Tarjetas de crédito y débito de todos los bancos.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <MercadoPago className={CARDSIZES} />
        <Visa className={CARDSIZES} />
        <Mastercard className={CARDSIZES} />
        <NaranjaX className={CARDSIZES} />
      </div>
    </div>
  );
}
