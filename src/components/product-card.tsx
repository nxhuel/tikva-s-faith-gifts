import { Link } from "@tanstack/react-router";
import { money } from "@/lib/format";
import { productImage } from "@/lib/images";
import type { Producto } from "@/lib/store";

export function ProductCard({ producto }: { producto: Producto }) {
  const agotado = producto.stock <= 0;
  return (
    <Link
      to="/producto/$slug"
      params={{ slug: producto.slug }}
      className="group block paper-card label-notch overflow-hidden transition-transform hover:-translate-y-1"
    >
      <div className="relative aspect-4/5 overflow-hidden bg-secondary">
        <img
          src={productImage(producto.imagen)}
          alt={producto.nombre}
          width={800}
          height={1000}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${agotado ? "opacity-55 saturate-50" : ""}`}
        />
        <span className="absolute left-3 top-3 bg-paper/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {producto.categoria}
        </span>
        {agotado && (
          <span className="absolute bottom-3 left-3 bg-ink px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-primary-foreground">
            Sin stock
          </span>
        )}
      </div>
      <div className="space-y-2 p-5">
        <h3 className="font-display text-lg leading-snug">{producto.nombre}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{producto.resumen}</p>
        <div className="flex items-baseline justify-between pt-1">
          <span className="font-display text-xl">{money(producto.precio)}</span>
          <span className="text-xs uppercase tracking-[0.2em] text-sky-deep group-hover:text-ink">
            {agotado ? "Avisarme" : "Ver más"}
          </span>
        </div>
      </div>
    </Link>
  );
}
