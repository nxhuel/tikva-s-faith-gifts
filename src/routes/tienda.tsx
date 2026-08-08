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
  const { productos, promos } = useTikva();
  const [cat, setCat] = useState("Todo");
  const cats = ["Todo", ...Array.from(new Set(productos.map((p) => p.categoria)))];
  const lista = productos.filter((p) => p.activo && (cat === "Todo" || p.categoria === cat));
  const promoActiva = promos.find((p) => p.activa);

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

      <div className="mt-10 flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full border px-4 py-1.5 text-xs tracking-wide transition-colors ${
              cat === c
                ? "border-ink bg-ink text-primary-foreground"
                : "border-border text-muted-foreground hover:border-ink hover:text-ink"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((p) => (
          <ProductCard key={p.id} producto={p} />
        ))}
      </div>
    </div>
  );
}
