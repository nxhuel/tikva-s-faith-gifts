import { Link } from "@tanstack/react-router";
import { InstagramIcon } from "@/components/instagram-icon";
import { PaymentMethods } from "@/components/payment-methods";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { linkWhatsapp, numeroWhatsapp, useTikva } from "@/lib/store";
import { LOGO_IMG } from "@/lib/images";

export function SiteFooter() {
  const { negocio } = useTikva();
  return (
    <footer className="mt-24 border-t border-border bg-paper-deep/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src={LOGO_IMG} alt="Tikva" width={44} height={44} className="h-11 w-11 rounded-full" loading="lazy" />
            <p className="font-display text-2xl">Tikva</p>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Tikva significa esperanza. Regalería cristiana hecha a mano en Buenos Aires: frascos con
            versículos, papelería y packs para regalar Palabra.
          </p>
        </div>

        <div>
          <p className="eyebrow">Tienda</p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link to="/tienda" className="text-muted-foreground hover:text-ink">Productos</Link>
            <Link to="/carrito" className="text-muted-foreground hover:text-ink">Carrito</Link>
            <Link to="/cuenta" className="text-muted-foreground hover:text-ink">Mis pedidos</Link>
            <Link to="/historia" className="text-muted-foreground hover:text-ink">Nuestra historia</Link>
          </div>
        </div>

        <div>
          <p className="eyebrow">Escribinos</p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <a
              href={linkWhatsapp(negocio.whatsapp)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-ink"
            >
              <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
              {negocio.whatsappVisible || numeroWhatsapp(negocio.whatsapp)}
            </a>
            <a
              href={`https://instagram.com/${negocio.instagram}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-ink"
            >
              <InstagramIcon className="h-4 w-4" /> @{negocio.instagram}
            </a>
            <p className="text-muted-foreground">Envíos a todo el país · Retiro en CABA</p>
          </div>

          <PaymentMethods className="mt-6 border-t border-border/70 pt-5" />
        </div>
      </div>
      <footer className="mx-auto flex max-w-6xl items-center justify-between border-t border-border/70 px-5 py-5 text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} Tikva Regalería Cristiana · Hecho a mano, con esperanza.</span>
        <span>Desarrollado por Clik — Tikva</span>
      </footer>
    </footer>
  );
}
