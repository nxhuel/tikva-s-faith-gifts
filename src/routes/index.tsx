import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Hand, Heart, PenLine, Scroll } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { HERO_IMG, NOTA_IMG } from "@/lib/images";
import { useTikva } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tikva · Frascos con 365 versículos y regalería cristiana" },
      {
        name: "description",
        content:
          "Regalá esperanza: frascos con 365 versículos enrollados a mano, papelería devocional y packs listos para entregar. Envíos a todo el país.",
      },
      { property: "og:title", content: "Tikva · Regalería Cristiana hecha a mano" },
      {
        property: "og:description",
        content: "Frascos con 365 versículos, papelería devocional y packs de regalo.",
      },
    ],
  }),
  component: Home,
});

const pasos = [
  { icon: Scroll, titulo: "Elegimos los versículos", texto: "365 pasajes seleccionados uno por uno, para cada día del año." },
  { icon: PenLine, titulo: "Se imprimen y enrollan", texto: "Papel ilustración, corte a mano y atado con hilo de algodón." },
  { icon: Hand, titulo: "Se arma el frasco", texto: "Tapa dorada, tul y etiqueta acuarelada colocada a mano." },
  { icon: Heart, titulo: "Llega listo para regalar", texto: "Con tarjeta de dedicatoria y bolsa con moño si lo pedís." },
];

function Home() {
  const { productos, negocio } = useTikva();
  const destacados = productos.filter((p) => p.activo);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <img
          src={HERO_IMG}
          alt="Biblia abierta junto a un frasco con versículos enrollados"
          width={1600}
          height={1104}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-paper via-paper/85 to-paper/10" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-24 md:py-32">
          <div className="max-w-xl">
            <p className="eyebrow">Regalería cristiana · Buenos Aires</p>
            <h1 className="mt-5 font-display text-5xl leading-[1.05] md:text-6xl">
              Un versículo por día,
              <span className="block italic text-sky-deep">enrollado a mano.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              Tikva significa <em>esperanza</em>. Hacemos frascos con 365 versículos y papelería para
              que abras uno cada mañana —o para que se lo regales a alguien que necesita leerlo.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/tienda"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm tracking-wide text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Ver la tienda
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <a
                href={`https://wa.me/${negocio.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm underline decoration-sky-deep decoration-2 underline-offset-8"
              >
                Escribinos por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CINTA */}
      <div className="border-b border-border bg-ink py-3 text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-10 gap-y-2 px-5 text-[11px] uppercase tracking-[0.25em]">
          <span>Hecho a mano</span>
          <span className="text-sky">·</span>
          <span>Envíos a todo el país</span>
          <span className="text-sky">·</span>
          <span>Retiro en CABA</span>
          <span className="text-sky">·</span>
          <span>Tarjeta con dedicatoria</span>
        </div>
      </div>

      {/* PRODUCTOS */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">La tienda</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">Lo que armamos hoy</h2>
          </div>
          <Link to="/tienda" className="text-sm underline decoration-sky-deep decoration-2 underline-offset-8">
            Ver todo
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destacados.map((p) => (
            <ProductCard key={p.id} producto={p} />
          ))}
        </div>
      </section>

      {/* PROCESO */}
      <section className="border-y border-border sky-panel">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <p className="eyebrow">Cómo se hace</p>
          <h2 className="mt-3 max-w-lg font-display text-3xl md:text-4xl">
            Cuatro pasos, todos con las manos.
          </h2>
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {pasos.map((p, i) => (
              <li key={p.titulo} className="relative border-t-2 border-ink/70 pt-5">
                <div className="flex items-center gap-3">
                  <p.icon className="h-5 w-5" />
                  <span className="font-display text-sm">0{i + 1}</span>
                </div>
                <h3 className="mt-3 font-display text-lg">{p.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{p.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* TESTIMONIO */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-24 md:grid-cols-2">
        <figure className="paper-card label-notch overflow-hidden">
          <img
            src={NOTA_IMG}
            alt="Versículo de Romanos 5:1 sacado del frasco"
            width={720}
            height={960}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </figure>
        <div>
          <p className="eyebrow">Lo que nos escriben</p>
          <blockquote className="mt-6 font-display text-2xl leading-snug md:text-3xl">
            “Mirá cómo la chica va leyendo cada día un versículo de tu frasquito. Gloria a Dios le
            doy.”
          </blockquote>
          <p className="mt-5 text-sm text-muted-foreground">— Mensaje de una clienta, julio 2026</p>
          <div className="mt-9 hairline" />
          <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
            Cada pedido se arma por encargo. Si querés algo especial —colores, cantidad, dedicatoria,
            packs para eventos— escribinos y lo pensamos juntas.
          </p>
          <Link
            to="/contacto"
            className="mt-6 inline-flex rounded-full border border-ink px-5 py-2.5 text-sm transition-colors hover:bg-ink hover:text-primary-foreground"
          >
            Pedir algo a medida
          </Link>
        </div>
      </section>
    </>
  );
}
