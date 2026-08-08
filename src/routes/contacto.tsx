import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Instagram, MessageCircle } from "lucide-react";
import { z } from "zod";
import { linkWhatsapp, useTikva } from "@/lib/store";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto · Tikva" },
      {
        name: "description",
        content:
          "Escribinos por WhatsApp o Instagram para pedidos a medida, packs para eventos y consultas.",
      },
      { property: "og:title", content: "Contacto · Tikva" },
      { property: "og:description", content: "Pedidos a medida y packs para eventos." },
    ],
  }),
  component: Contacto,
});

const schema = z.object({
  nombre: z.string().trim().min(2, "Ingresá tu nombre").max(80),
  mensaje: z.string().trim().min(10, "Contanos un poco más").max(500),
});

function Contacto() {
  const { negocio } = useTikva();
  const [errores, setErrores] = useState<Record<string, string>>({});

  const field =
    "mt-2 w-full border border-input bg-card px-3.5 py-2.5 text-sm outline-none focus:border-sky-deep";

  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-5 py-16 md:grid-cols-2">
      <div>
        <p className="eyebrow">Contacto</p>
        <h1 className="mt-3 font-display text-4xl leading-tight">Hablemos por WhatsApp</h1>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          Respondemos de lunes a sábado. Si buscás algo a medida —colores, cantidades, packs para un
          evento o dedicatorias especiales— contanos y lo armamos.
        </p>

        <div className="mt-8 space-y-3">
          <a
            href={`https://wa.me/${negocio.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="paper-card label-notch flex items-center gap-3 p-4 text-sm transition-transform hover:-translate-y-0.5"
          >
            <MessageCircle className="h-5 w-5 text-sky-deep" />
            WhatsApp {negocio.whatsappVisible}
          </a>
          <a
            href={`https://instagram.com/${negocio.instagram}`}
            target="_blank"
            rel="noreferrer"
            className="paper-card label-notch flex items-center gap-3 p-4 text-sm transition-transform hover:-translate-y-0.5"
          >
            <Instagram className="h-5 w-5 text-sky-deep" />@{negocio.instagram}
          </a>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const parsed = schema.safeParse({
            nombre: String(fd.get("nombre") ?? ""),
            mensaje: String(fd.get("mensaje") ?? ""),
          });
          if (!parsed.success) {
            const errs: Record<string, string> = {};
            parsed.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
            setErrores(errs);
            return;
          }
          setErrores({});
          const texto = `Hola Tikva! Soy ${parsed.data.nombre}.\n${parsed.data.mensaje}`;
          window.open(linkWhatsapp(negocio.whatsapp, texto), "_blank", "noopener");
        }}
        className="paper-card label-notch h-fit p-7"
      >
        <h2 className="font-display text-xl">Escribinos tu consulta</h2>
        <p className="mt-2 text-xs text-muted-foreground">
          Se abre WhatsApp con el mensaje ya escrito.
        </p>
        <label className="mt-5 block text-xs uppercase tracking-widest text-muted-foreground">
          Tu nombre
          <input name="nombre" maxLength={80} className={field} />
          {errores["nombre"] && (
            <span className="mt-1 block text-[11px] normal-case tracking-normal text-destructive">
              {errores["nombre"]}
            </span>
          )}
        </label>
        <label className="mt-4 block text-xs uppercase tracking-widest text-muted-foreground">
          Mensaje
          <textarea name="mensaje" rows={5} maxLength={500} className={field} />
          {errores["mensaje"] && (
            <span className="mt-1 block text-[11px] normal-case tracking-normal text-destructive">
              {errores["mensaje"]}
            </span>
          )}
        </label>
        <button className="mt-6 w-full rounded-full bg-ink py-3 text-sm text-primary-foreground">
          Abrir WhatsApp
        </button>
      </form>
    </div>
  );
}
