import { Link } from "@tanstack/react-router";
import { money } from "@/lib/format";
import { productImage } from "@/lib/images";
import { textoDescuento, useTikva, type Producto } from "@/lib/store";

export function ProductCard({ producto }: { producto: Producto }) {
  const { descuentoDe, precioFinal, categoriaPorId } = useTikva();
  const agotado = producto.stock <= 0;
  const descuento = descuentoDe(producto);
  const final = precioFinal(producto);
  const categoria = categoriaPorId(producto.categoriaId);

  return (
    <Link
      to="/producto/$slug"
      params={{ slug: producto.slug }}
      className="group block paper-card label-notch overflow-hidden transition-transform hover:-translate-y-1"
    >
      <div className="relative aspect-4/5 overflow-hidden bg-secondary">
        <img
          src={productImage(producto.imagenes[0])}
          alt={producto.nombre}
          width={800}
          height={1000}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${agotado ? "opacity-55 saturate-50" : ""}`}
        />
        <span className="absolute left-3 top-3 bg-paper/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {categoria?.nombre ?? "Producto"}
        </span>

        {/* Tira inclinada: descuento por día especial. La cinta es larga y pasa
            por detrás de la esquina (doble de cinta que “abraza” la card). */}
        {descuento && (
          <span className="absolute right-0 top-0 z-10 h-0 w-0">
            <span className="absolute right-18 top-6 block w-[520px] translate-x-1/2 translate-y-1/2 rotate-45 bg-gradient-to-b from-gold to-[#c9a254] px-6 pb-2.5 pt-3.5 text-center shadow-[0_18px_36px_-18px_rgba(28,36,60,0.75)] ring-1 ring-[#b98d3e]/60">
              <span className="block truncate text-xs font-bold uppercase tracking-[0.16em] text-ink">
                {descuento.etiqueta}
              </span>
              <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/75">
                −{textoDescuento(descuento)}
              </span>
            </span>
          </span>
        )}

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
          <span className="flex items-baseline gap-2">
            {descuento && final < producto.precio && (
              <span className="text-sm text-muted-foreground line-through decoration-destructive/70">
                {money(producto.precio)}
              </span>
            )}
            <span className={`font-display text-xl ${descuento ? "text-gold-dark" : ""}`}>
              {money(final)}
            </span>
          </span>
          <span className="text-xs uppercase tracking-[0.2em] text-sky-deep group-hover:text-ink">
            {agotado ? "Avisarme" : "Ver más"}
          </span>
        </div>
      </div>
    </Link>
  );
}
