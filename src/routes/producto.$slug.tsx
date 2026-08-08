import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Minus, Plus, Truck } from "lucide-react";
import { toast } from "sonner";
import { money } from "@/lib/format";
import { productImage } from "@/lib/images";
import { textoDescuento, useTikva } from "@/lib/store";

export const Route = createFileRoute("/producto/$slug")({
  head: () => ({
    meta: [
      { title: "Producto · Tikva" },
      { name: "description", content: "Detalle del producto, stock y compra por WhatsApp." },
      { property: "og:title", content: "Producto · Tikva" },
      { property: "og:description", content: "Regalería cristiana hecha a mano." },
    ],
  }),
  component: DetalleProducto,
  notFoundComponent: () => <p className="p-16 text-center">Producto no encontrado.</p>,
});

function DetalleProducto() {
  const { slug } = Route.useParams();
  const { productoPorSlug, agregar, negocio, ready, categoriaPorId, descuentoDe, precioFinal } =
    useTikva();
  const producto = productoPorSlug(slug);
  const [cantidad, setCantidad] = useState(1);
  const [activa, setActiva] = useState(0);
  const router = useRouter();

  if (!producto) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="font-display text-3xl">
          {ready ? "No encontramos ese producto" : "Cargando…"}
        </h1>
        <Link to="/tienda" className="mt-6 inline-flex text-sm underline underline-offset-8">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  const agotado = producto.stock <= 0;
  const categoria = categoriaPorId(producto.categoriaId);
  const descuento = descuentoDe(producto);
  const final = precioFinal(producto);
  const enDescuento = descuento && final < producto.precio;
  const imagenes = producto.imagenes.length > 0 ? producto.imagenes : [productImage("")];
  const activaClamp = Math.min(activa, imagenes.length - 1);

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <nav className="text-xs text-muted-foreground">
        <Link to="/tienda" className="hover:text-ink">
          Tienda
        </Link>{" "}
        / {categoria?.nombre ?? "Producto"}
      </nav>

      <div className="mt-8 grid gap-12 md:grid-cols-2">
        <div>
          <div className="paper-card label-notch overflow-hidden">
            <img
              src={productImage(imagenes[activaClamp])}
              alt={producto.nombre}
              width={1000}
              height={1000}
              className={`h-full w-full object-cover ${agotado ? "saturate-50" : ""}`}
            />
          </div>
          {imagenes.length > 1 && (
            <div className="mt-4 flex gap-3">
              {imagenes.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiva(i)}
                  className={`h-20 w-16 shrink-0 overflow-hidden border-2 transition-colors ${
                    activaClamp === i ? "border-sky-deep" : "border-border hover:border-ink/50"
                  }`}
                >
                  <img
                    src={productImage(img)}
                    alt={`${producto.nombre} ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="eyebrow">{categoria?.nombre ?? "Producto"}</p>{" "}
            {enDescuento && (
              <span className="label-notch bg-gradient-to-b from-gold to-[#c9a254] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-ink">
                {descuento.etiqueta} −{textoDescuento(descuento)}
              </span>
            )}
          </div>
          <h1 className="mt-3 font-display text-4xl leading-tight">{producto.nombre}</h1>
          <p className="mt-4 flex items-baseline gap-3 font-display text-2xl">
            {enDescuento && (
              <span className="text-base text-muted-foreground line-through decoration-destructive/70">
                {money(producto.precio)}
              </span>
            )}
            <span>{money(final)}</span>
          </p>
          <p className="mt-5 leading-relaxed text-muted-foreground">{producto.descripcion}</p>

          <ul className="mt-7 space-y-2.5">
            {producto.detalles.map((d) => (
              <li key={d} className="flex items-start gap-2.5 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-sky-deep" />
                <span className="text-muted-foreground">{d}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9 paper-card label-notch p-5">
            {agotado ? (
              <div className="space-y-4">
                <p className="text-sm">
                  <strong>Sin stock por ahora.</strong> Lo armamos por encargo: escribinos y te
                  reservamos el próximo lote.
                </p>
                <a
                  href={`https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent(
                    `Hola Tikva! Quiero que me avisen cuando vuelva ${producto.nombre}.`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full bg-ink px-5 py-2.5 text-sm text-primary-foreground"
                >
                  Avisarme por WhatsApp
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      aria-label="Restar"
                      onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                      className="grid h-9 w-9 place-items-center border border-border"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="font-display text-lg">{cantidad}</span>
                    <button
                      aria-label="Sumar"
                      onClick={() => setCantidad((c) => Math.min(producto.stock, c + 1))}
                      className="grid h-9 w-9 place-items-center border border-border"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {producto.stock} disponibles
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      agregar(producto, cantidad);
                      toast.success("Agregado al carrito", { description: producto.nombre });
                    }}
                    className="rounded-full bg-ink px-6 py-3 text-sm text-primary-foreground transition-transform hover:-translate-y-0.5"
                  >
                    Agregar al carrito
                  </button>
                  <button
                    onClick={() => {
                      agregar(producto, cantidad);
                      router.navigate({ to: "/checkout" });
                    }}
                    className="rounded-full border border-ink px-6 py-3 text-sm transition-colors hover:bg-ink hover:text-primary-foreground"
                  >
                    Comprar ahora
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Truck className="h-4 w-4" />
            Envío {money(negocio.envioCosto)} · gratis desde {money(negocio.envioGratisDesde)} ·
            retiro en CABA sin cargo
          </p>
        </div>
      </div>
    </div>
  );
}
