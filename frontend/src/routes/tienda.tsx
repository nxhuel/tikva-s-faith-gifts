import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { useTikva } from "@/lib/store";

export const Route = createFileRoute("/tienda")({
  head: () => ({
    meta: [
      { title: "Tienda · Tikva Regalería Cristiana" },
      {
        name: "description",
        content:
          "Frascos con versículos, anotadores, agendas, separadores y stickers. Comprá online y coordinamos la entrega por WhatsApp.",
      },
      { property: "og:title", content: "Tienda Tikva" },
      { property: "og:description", content: "Frascos con versículos y papelería devocional." },
    ],
  }),
  component: Tienda,
});

function Tienda() {
  const { productos, categorias, promos } = useTikva();
  const [cat, setCat] = useState("Todo");
  const lista = productos.filter((p) => p.activo && (cat === "Todo" || p.categoriaId === cat));
  const promoActiva = promos.find((p) => p.activa);
  const contar = (id?: string) =>
    productos.filter((p) => p.activo && (id ? p.categoriaId === id : true)).length;

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="eyebrow">Catálogo</p>
      <h1 className="mt-3 font-display text-4xl md:text-5xl">Tienda</h1>
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
        Todo se arma a mano por encargo. Si algo figura sin stock, podés escribirnos y te avisamos
        cuando vuelve.
      </p>

      {promoActiva && (
        <div className="mt-8 label-notch inline-flex flex-wrap items-center gap-3 bg-ink px-5 py-3 text-primary-foreground">
          <span className="text-[10px] uppercase tracking-[0.25em] text-sky">Promo vigente</span>
          <span className="text-sm">
            {promoActiva.descripcion} con el código{" "}
            <strong className="font-display tracking-wide">{promoActiva.codigo}</strong>
          </span>
        </div>
      )}

      <div className="mt-10">
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Filtrá por categoría
        </p>
        <div className="mt-3 flex flex-wrap gap-2.5">
          <button
            onClick={() => setCat("Todo")}
            className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium tracking-wide transition-all hover:-translate-y-0.5 ${
              cat === "Todo"
                ? "border-ink bg-ink text-primary-foreground shadow-md"
                : "border-border bg-card text-muted-foreground hover:border-ink hover:text-ink"
            }`}
          >
            Todo
            <span
              className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums ${
                cat === "Todo"
                  ? "bg-paper/20 text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {contar()}
            </span>
          </button>
          {categorias.map((c) => {
            const activa = cat === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium tracking-wide transition-all hover:-translate-y-0.5 ${
                  activa
                    ? "border-ink bg-ink text-primary-foreground shadow-md"
                    : "border-border bg-card text-muted-foreground hover:border-ink hover:text-ink"
                }`}
              >
                {c.nombre}
                <span
                  className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums ${
                    activa
                      ? "bg-paper/20 text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {contar(c.id)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((p) => (
          <ProductCard key={p.id} producto={p} />
        ))}
      </div>
    </div>
  );
}
