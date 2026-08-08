import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { money } from "@/lib/format";
import { productImage } from "@/lib/images";
import { useTikva } from "@/lib/store";

export const Route = createFileRoute("/carrito")({
  head: () => ({
    meta: [
      { title: "Tu carrito · Tikva" },
      { name: "description", content: "Revisá tu pedido, aplicá promos y seguí al checkout." },
      { property: "og:title", content: "Tu carrito · Tikva" },
      { property: "og:description", content: "Revisá tu pedido antes de confirmarlo." },
    ],
  }),
  component: Carrito,
});

function Carrito() {
  const {
    carrito,
    productos,
    cambiarCantidad,
    quitar,
    subtotal,
    descuento,
    cupon,
    aplicarCupon,
    quitarCupon,
    negocio,
  } = useTikva();
  const [codigo, setCodigo] = useState("");

  if (carrito.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <p className="eyebrow">Carrito</p>
        <h1 className="mt-4 font-display text-4xl">Todavía no hay nada acá</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Empezá por el frasco de 365 versículos: es el que más se regala.
        </p>
        <Link
          to="/tienda"
          className="mt-8 inline-flex rounded-full bg-ink px-6 py-3 text-sm text-primary-foreground"
        >
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="eyebrow">Paso 1 de 3</p>
      <h1 className="mt-3 font-display text-4xl">Tu carrito</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          {carrito.map((item) => {
            const prod = productos.find((p) => p.id === item.id);
            return (
              <div key={item.id} className="paper-card label-notch flex gap-4 p-4">
                <img
                  src={productImage(prod?.imagen ?? "")}
                  alt={item.nombre}
                  width={120}
                  height={140}
                  loading="lazy"
                  className="h-28 w-24 shrink-0 object-cover"
                />
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-display text-lg leading-snug">{item.nombre}</h2>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {money(item.precio)} por unidad
                      </p>
                    </div>
                    <button
                      onClick={() => quitar(item.id)}
                      aria-label="Quitar"
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        aria-label="Restar"
                        onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                        className="grid h-8 w-8 place-items-center border border-border"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm">{item.cantidad}</span>
                      <button
                        aria-label="Sumar"
                        onClick={() =>
                          cambiarCantidad(
                            item.id,
                            Math.min(item.cantidad + 1, prod?.stock ?? item.cantidad),
                          )
                        }
                        className="grid h-8 w-8 place-items-center border border-border"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="font-display text-lg">{money(item.precio * item.cantidad)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="paper-card label-notch h-fit p-6">
          <h2 className="font-display text-xl">Resumen</h2>

          <div className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            {descuento > 0 && (
              <div className="flex justify-between text-sky-deep">
                <span>Descuento {cupon?.codigo}</span>
                <span>-{money(descuento)}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>Envío</span>
              <span>se calcula en el checkout</span>
            </div>
          </div>

          <div className="my-5 hairline" />

          {cupon ? (
            <button onClick={quitarCupon} className="text-xs underline underline-offset-4">
              Quitar cupón {cupon.codigo}
            </button>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const r = aplicarCupon(codigo);
                r.ok ? toast.success(r.mensaje) : toast.error(r.mensaje);
              }}
              className="flex gap-2"
            >
              <input
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Código de promo"
                className="flex-1 border border-input bg-card px-3 py-2 text-sm outline-none focus:border-sky-deep"
              />
              <button className="border border-ink px-4 py-2 text-xs uppercase tracking-widest">
                Aplicar
              </button>
            </form>
          )}

          <div className="mt-6 flex items-baseline justify-between">
            <span className="eyebrow">Total estimado</span>
            <span className="font-display text-2xl">{money(subtotal - descuento)}</span>
          </div>

          <Link
            to="/checkout"
            className="mt-6 block rounded-full bg-ink py-3 text-center text-sm text-primary-foreground"
          >
            Continuar
          </Link>
          <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground">
            El pago final se coordina por WhatsApp ({negocio.whatsappVisible}) con transferencia o
            efectivo.
          </p>
        </aside>
      </div>
    </div>
  );
}
