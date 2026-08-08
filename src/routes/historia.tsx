import { createFileRoute, Link } from "@tanstack/react-router";
import { PACKS_IMG, NOTA_IMG } from "@/lib/images";

export const Route = createFileRoute("/historia")({
  head: () => ({
    meta: [
      { title: "Nuestra historia · Tikva" },
      {
        name: "description",
        content:
          "Tikva nació para regalar esperanza: frascos con versículos y papelería hecha a mano en Buenos Aires.",
      },
      { property: "og:title", content: "Nuestra historia · Tikva" },
      {
        property: "og:description",
        content: "Cómo nació Tikva y por qué cada frasco se arma a mano.",
      },
    ],
  }),
  component: Historia,
});

function Historia() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <p className="eyebrow">Nuestra historia</p>
      <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">
        Tikva quiere decir esperanza.
      </h1>

      <div className="mt-10 grid gap-10 md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-5 text-[15px] leading-relaxed text-muted-foreground">
          <p>
            Empezamos con un frasco y una idea simple: que alguien pudiera abrir un papelito cada
            mañana y encontrarse con una Palabra justa para ese día. El primero fue un regalo. El
            segundo lo pidió una amiga. Después llegaron los mensajes por Instagram.
          </p>
          <p>
            Hoy seguimos armando todo a mano en Buenos Aires: imprimimos, cortamos, enrollamos y
            atamos cada versículo. Cuidamos la etiqueta, el tul en la boca del frasco y la tarjeta de
            dedicatoria, porque casi siempre lo que se compra acá es para regalar.
          </p>
          <p>
            Estamos creciendo de a poco hacia papelería devocional: anotadores, agendas, separadores y
            stickers. Todo con la misma idea de fondo —que la Palabra acompañe el día a día.
          </p>
          <div className="hairline" />
          <p className="font-display text-xl text-ink">
            “Porque yo sé los pensamientos que tengo acerca de vosotros, pensamientos de paz, y no de
            mal, para daros el fin que esperáis.” <span className="text-sm">— Jeremías 29:11</span>
          </p>
          <Link
            to="/tienda"
            className="mt-4 inline-flex rounded-full bg-ink px-6 py-3 text-sm text-primary-foreground"
          >
            Ver los productos
          </Link>
        </div>

        <div className="space-y-5">
          <img
            src={PACKS_IMG}
            alt="Packs de regalo Tikva listos para entregar"
            width={720}
            height={960}
            loading="lazy"
            className="paper-card label-notch w-full object-cover"
          />
          <img
            src={NOTA_IMG}
            alt="Papelito con un versículo del frasco"
            width={720}
            height={960}
            loading="lazy"
            className="paper-card label-notch w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
