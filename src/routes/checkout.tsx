import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { z } from "zod";
import { money } from "@/lib/format";
import { linkWhatsapp, mensajeWhatsapp, useTikva, type Pedido } from "@/lib/store";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout · Tikva" },
      { name: "description", content: "Completá tus datos y confirmá el pedido por WhatsApp." },
      { property: "og:title", content: "Checkout · Tikva" },
      { property: "og:description", content: "Últimos datos para preparar tu pedido." },
    ],
  }),
  component: Checkout,
});

const schema = z.object({
  nombre: z.string().trim().min(2, "Ingresá tu nombre").max(80),
  telefono: z.string().trim().min(6, "Ingresá un teléfono válido").max(25),
  email: z.string().trim().email("Email inválido").max(120),
  entrega: z.enum(["envio", "retiro"]),
  direccion: z.string().trim().max(160),
  notas: z.string().trim().max(300),
});

function Checkout() {
  const { carrito, subtotal, descuento, envio, total, crearPedido, vaciar, negocio, usuario } =
    useTikva();
  const [entrega, setEntrega] = useState<"envio" | "retiro">("envio");
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [pedido, setPedido] = useState<Pedido | null>(null);

  if (pedido) {
    const texto = mensajeWhatsapp(pedido, negocio);
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <p className="eyebrow">Paso 3 de 3</p>
        <h1 className="mt-4 font-display text-4xl">Pedido {pedido.id} registrado</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Ya reservamos tu pedido y descontamos el stock. El último paso es confirmarlo por WhatsApp,
          donde coordinamos el pago (transferencia o efectivo) y la entrega.
        </p>

        <div className="mt-10 paper-card label-notch p-6 text-left">
          {pedido.items.map((i) => (
            <div key={i.id} className="flex justify-between py-1 text-sm">
              <span className="text-muted-foreground">
                {i.cantidad} x {i.nombre}
              </span>
              <span>{money(i.precio * i.cantidad)}</span>
            </div>
          ))}
          <div className="my-4 hairline" />
          <div className="flex justify-between font-display text-xl">
            <span>Total</span>
            <span>{money(pedido.total)}</span>
          </div>
        </div>

        <a
          href={linkWhatsapp(negocio.whatsapp, texto)}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          <MessageCircle className="h-4 w-4" />
          Confirmar por WhatsApp
        </a>
        <div className="mt-6">
          <Link to="/cuenta" className="text-sm underline underline-offset-8">
            Ver mis pedidos
          </Link>
        </div>
      </div>
    );
  }

  if (carrito.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="font-display text-3xl">Tu carrito está vacío</h1>
        <Link to="/tienda" className="mt-6 inline-flex text-sm underline underline-offset-8">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      nombre: String(fd.get("nombre") ?? ""),
      telefono: String(fd.get("telefono") ?? ""),
      email: String(fd.get("email") ?? ""),
      entrega,
      direccion: String(fd.get("direccion") ?? ""),
      notas: String(fd.get("notas") ?? ""),
    };
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
      setErrores(errs);
      return;
    }
    if (entrega === "envio" && parsed.data.direccion.length < 6) {
      setErrores({ direccion: "Necesitamos la dirección para el envío" });
      return;
    }
    setErrores({});
    const nuevo = crearPedido(parsed.data);
    setPedido(nuevo);
    vaciar();
  };

  const field =
    "mt-2 w-full border border-input bg-card px-3.5 py-2.5 text-sm outline-none focus:border-sky-deep";

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="eyebrow">Paso 2 de 3</p>
      <h1 className="mt-3 font-display text-4xl">Tus datos</h1>

      <form onSubmit={onSubmit} className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <div className="paper-card label-notch p-6">
            <h2 className="font-display text-lg">Contacto</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">
                Nombre y apellido
                <input name="nombre" defaultValue={usuario?.nombre ?? ""} maxLength={80} className={field} />
                {errores['nombre'] && <span className="mt-1 block text-[11px] normal-case tracking-normal text-destructive">{errores['nombre']}</span>}
              </label>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">
                WhatsApp
                <input name="telefono" maxLength={25} placeholder="11 5555 5555" className={field} />
                {errores['telefono'] && <span className="mt-1 block text-[11px] normal-case tracking-normal text-destructive">{errores['telefono']}</span>}
              </label>
              <label className="text-xs uppercase tracking-widest text-muted-foreground sm:col-span-2">
                Email
                <input name="email" defaultValue={usuario?.email.includes("@") ? usuario.email : ""} maxLength={120} className={field} />
                {errores['email'] && <span className="mt-1 block text-[11px] normal-case tracking-normal text-destructive">{errores['email']}</span>}
              </label>
            </div>
          </div>

          <div className="paper-card label-notch p-6">
            <h2 className="font-display text-lg">Entrega</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(
                [
                  { v: "envio", t: "Envío a domicilio", d: `${money(negocio.envioCosto)} · gratis desde ${money(negocio.envioGratisDesde)}` },
                  { v: "retiro", t: "Retiro en CABA", d: "Coordinamos punto y horario" },
                ] as const
              ).map((o) => (
                <button
                  type="button"
                  key={o.v}
                  onClick={() => setEntrega(o.v)}
                  className={`border p-4 text-left transition-colors ${
                    entrega === o.v ? "border-ink bg-secondary" : "border-border hover:border-ink"
                  }`}
                >
                  <span className="block text-sm">{o.t}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{o.d}</span>
                </button>
              ))}
            </div>

            {entrega === "envio" && (
              <label className="mt-4 block text-xs uppercase tracking-widest text-muted-foreground">
                Dirección, localidad y CP
                <input name="direccion" maxLength={160} className={field} />
                {errores['direccion'] && <span className="mt-1 block text-[11px] normal-case tracking-normal text-destructive">{errores['direccion']}</span>}
              </label>
            )}

            <label className="mt-4 block text-xs uppercase tracking-widest text-muted-foreground">
              Dedicatoria o notas (opcional)
              <textarea name="notas" rows={3} maxLength={300} className={field} />
            </label>
          </div>
        </div>

        <aside className="paper-card label-notch h-fit p-6">
          <h2 className="font-display text-xl">Tu pedido</h2>
          <div className="mt-4 space-y-1.5 text-sm">
            {carrito.map((i) => (
              <div key={i.id} className="flex justify-between gap-3">
                <span className="text-muted-foreground">
                  {i.cantidad} x {i.nombre}
                </span>
                <span>{money(i.precio * i.cantidad)}</span>
              </div>
            ))}
          </div>
          <div className="my-4 hairline" />
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            {descuento > 0 && (
              <div className="flex justify-between text-sky-deep">
                <span>Descuento</span>
                <span>-{money(descuento)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Envío</span>
              <span>{envio(entrega) === 0 ? "Sin cargo" : money(envio(entrega))}</span>
            </div>
          </div>
          <div className="mt-5 flex items-baseline justify-between">
            <span className="eyebrow">Total</span>
            <span className="font-display text-2xl">{money(total(entrega))}</span>
          </div>
          <button className="mt-6 w-full rounded-full bg-ink py-3 text-sm text-primary-foreground">
            Generar pedido
          </button>
          <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
            En el próximo paso te abrimos WhatsApp con el detalle listo para enviar.
          </p>
        </aside>
      </form>
    </div>
  );
}
