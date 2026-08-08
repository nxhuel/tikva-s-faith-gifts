import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { fecha, money } from "@/lib/format";
import { productImage } from "@/lib/images";
import { useTikva, type EstadoPedido } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel · Tikva" },
      { name: "description", content: "Panel interno de Tikva: ventas, stock, gastos y promos." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Panel · Tikva" },
      { property: "og:description", content: "Gestión interna del negocio." },
    ],
  }),
  component: Admin,
});

const ESTADOS: EstadoPedido[] = ["nuevo", "preparando", "enviado", "entregado", "cancelado"];
const tabs = ["Resumen", "Pedidos", "Stock", "Gastos", "Promos"] as const;

function Admin() {
  const {
    usuario,
    pedidos,
    productos,
    gastos,
    promos,
    cambiarEstado,
    actualizarStock,
    guardarProducto,
    agregarGasto,
    borrarGasto,
    guardarPromo,
    reset,
  } = useTikva();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Resumen");

  const metricas = useMemo(() => {
    const validos = pedidos.filter((p) => p.estado !== "cancelado");
    const ingresos = validos.reduce((a, p) => a + p.total, 0);
    const costoMercaderia = validos.reduce(
      (a, p) =>
        a +
        p.items.reduce((s, i) => {
          const prod = productos.find((x) => x.id === i.id);
          return s + (prod?.costo ?? 0) * i.cantidad;
        }, 0),
      0,
    );
    const totalGastos = gastos.reduce((a, g) => a + g.monto, 0);
    const unidades = validos.reduce((a, p) => a + p.items.reduce((s, i) => s + i.cantidad, 0), 0);
    return {
      ingresos,
      costoMercaderia,
      totalGastos,
      ganancia: ingresos - costoMercaderia - totalGastos,
      unidades,
      ticket: validos.length ? Math.round(ingresos / validos.length) : 0,
      pedidosValidos: validos.length,
    };
  }, [pedidos, productos, gastos]);

  const ranking = useMemo(() => {
    const map = new Map<string, { nombre: string; unidades: number; total: number }>();
    pedidos
      .filter((p) => p.estado !== "cancelado")
      .forEach((p) =>
        p.items.forEach((i) => {
          const prev = map.get(i.id) ?? { nombre: i.nombre, unidades: 0, total: 0 };
          map.set(i.id, {
            nombre: i.nombre,
            unidades: prev.unidades + i.cantidad,
            total: prev.total + i.precio * i.cantidad,
          });
        }),
      );
    return [...map.values()].sort((a, b) => b.total - a.total);
  }, [pedidos]);

  if (!usuario || usuario.rol !== "admin") {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <p className="eyebrow">Área interna</p>
        <h1 className="mt-4 font-display text-3xl">Necesitás ingresar como administradora</h1>
        <p className="mt-3 text-sm text-muted-foreground">Usuario: admin · Contraseña: admin123</p>
        <Link
          to="/ingresar"
          className="mt-7 inline-flex rounded-full bg-ink px-6 py-3 text-sm text-primary-foreground"
        >
          Ingresar
        </Link>
      </div>
    );
  }

  const field =
    "w-full border border-input bg-card px-3 py-2 text-sm outline-none focus:border-sky-deep";
  const maxRank = Math.max(1, ...ranking.map((r) => r.total));

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Panel Tikva</p>
          <h1 className="mt-3 font-display text-4xl">Cuentas, stock y pedidos</h1>
        </div>
        <button
          onClick={() => {
            reset();
            toast.success("Datos de demostración restaurados");
          }}
          className="text-xs text-muted-foreground underline underline-offset-4"
        >
          Restaurar datos de ejemplo
        </button>
      </div>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-border pb-3">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 text-xs uppercase tracking-[0.18em] transition-colors ${
              tab === t ? "bg-ink text-primary-foreground" : "text-muted-foreground hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Resumen" && (
        <div className="mt-8 space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { l: "Ingresos", v: money(metricas.ingresos) },
              { l: "Gastos + insumos", v: money(metricas.totalGastos + metricas.costoMercaderia) },
              { l: "Ganancia neta", v: money(metricas.ganancia) },
              { l: "Ticket promedio", v: money(metricas.ticket) },
            ].map((k) => (
              <div key={k.l} className="paper-card label-notch p-5">
                <p className="eyebrow">{k.l}</p>
                <p className="mt-3 font-display text-2xl">{k.v}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="paper-card label-notch p-6">
              <h2 className="font-display text-lg">Más vendidos</h2>
              <div className="mt-5 space-y-4">
                {ranking.length === 0 && (
                  <p className="text-sm text-muted-foreground">Todavía no hay ventas.</p>
                )}
                {ranking.map((r) => (
                  <div key={r.nombre}>
                    <div className="flex justify-between text-sm">
                      <span className="pr-4">{r.nombre}</span>
                      <span className="shrink-0 text-muted-foreground">
                        {r.unidades} u · {money(r.total)}
                      </span>
                    </div>
                    <div className="mt-2 h-2 bg-secondary">
                      <div
                        className="h-2 bg-sky-deep"
                        style={{ width: `${(r.total / maxRank) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="paper-card label-notch p-6">
              <h2 className="font-display text-lg">Alertas de stock</h2>
              <div className="mt-4 space-y-3">
                {productos.map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-sm">
                    <span>{p.nombre}</span>
                    <span
                      className={
                        p.stock === 0
                          ? "text-destructive"
                          : p.stock <= 5
                            ? "text-gold"
                            : "text-muted-foreground"
                      }
                    >
                      {p.stock === 0 ? "Sin stock" : `${p.stock} u`}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                {metricas.unidades} unidades vendidas en {metricas.pedidosValidos} pedidos.
              </p>
            </div>
          </div>
        </div>
      )}

      {tab === "Pedidos" && (
        <div className="mt-8 space-y-4">
          {pedidos.map((p) => (
            <div key={p.id} className="paper-card label-notch p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-display text-lg">
                    {p.id} · {p.cliente.nombre}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {fecha(p.fecha)} · {p.cliente.telefono} ·{" "}
                    {p.cliente.entrega === "envio" ? p.cliente.direccion || "Envío" : "Retiro"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display text-lg">{money(p.total)}</span>
                  <select
                    value={p.estado}
                    onChange={(e) => cambiarEstado(p.id, e.target.value as EstadoPedido)}
                    className="border border-input bg-card px-2 py-1.5 text-xs"
                  >
                    {ESTADOS.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="my-3 hairline" />
              <div className="text-sm text-muted-foreground">
                {p.items.map((i) => `${i.cantidad} x ${i.nombre}`).join(" · ")}
                {p.cliente.notas && <p className="mt-2 italic">“{p.cliente.notas}”</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "Stock" && (
        <div className="mt-8 space-y-4">
          {productos.map((p) => (
            <div key={p.id} className="paper-card label-notch flex flex-wrap items-center gap-5 p-4">
              <img
                src={productImage(p.imagen)}
                alt={p.nombre}
                width={80}
                height={80}
                loading="lazy"
                className="h-16 w-16 object-cover"
              />
              <div className="min-w-40 flex-1">
                <p className="font-display text-base">{p.nombre}</p>
                <p className="text-xs text-muted-foreground">
                  {p.categoria} · costo {money(p.costo)} · margen{" "}
                  {Math.round(((p.precio - p.costo) / p.precio) * 100)}%
                </p>
              </div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">
                Precio
                <input
                  type="number"
                  defaultValue={p.precio}
                  onBlur={(e) =>
                    guardarProducto({ ...p, precio: Math.max(0, Number(e.target.value)) })
                  }
                  className={`${field} mt-1 w-28`}
                />
              </label>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">
                Stock
                <input
                  type="number"
                  value={p.stock}
                  onChange={(e) => actualizarStock(p.id, Math.max(0, Number(e.target.value)))}
                  className={`${field} mt-1 w-24`}
                />
              </label>
            </div>
          ))}
        </div>
      )}

      {tab === "Gastos" && (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const concepto = String(fd.get("concepto") ?? "").trim();
              const monto = Number(fd.get("monto"));
              if (concepto.length < 2 || !monto || monto <= 0) {
                toast.error("Completá concepto y monto.");
                return;
              }
              agregarGasto({
                concepto: concepto.slice(0, 90),
                categoria: String(fd.get("categoria") ?? "Otros"),
                monto,
                fecha: new Date().toISOString(),
              });
              e.currentTarget.reset();
              toast.success("Gasto registrado");
            }}
            className="paper-card label-notch h-fit p-6"
          >
            <h2 className="font-display text-lg">Registrar gasto</h2>
            <label className="mt-4 block text-xs uppercase tracking-widest text-muted-foreground">
              Concepto
              <input name="concepto" maxLength={90} className={`${field} mt-1`} />
            </label>
            <label className="mt-3 block text-xs uppercase tracking-widest text-muted-foreground">
              Categoría
              <select name="categoria" className={`${field} mt-1`}>
                {["Insumos", "Impresión", "Marketing", "Envíos", "Otros"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="mt-3 block text-xs uppercase tracking-widest text-muted-foreground">
              Monto
              <input name="monto" type="number" min={1} className={`${field} mt-1`} />
            </label>
            <button className="mt-6 w-full rounded-full bg-ink py-2.5 text-sm text-primary-foreground">
              Guardar
            </button>
          </form>

          <div className="paper-card label-notch p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-lg">Gastos del período</h2>
              <span className="font-display text-xl">
                {money(gastos.reduce((a, g) => a + g.monto, 0))}
              </span>
            </div>
            <div className="mt-5 divide-y divide-border">
              {gastos.map((g) => (
                <div key={g.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div>
                    <p>{g.concepto}</p>
                    <p className="text-xs text-muted-foreground">
                      {g.categoria} · {fecha(g.fecha)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>{money(g.monto)}</span>
                    <button
                      onClick={() => borrarGasto(g.id)}
                      aria-label="Borrar gasto"
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "Promos" && (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const codigo = String(fd.get("codigo") ?? "").trim().toUpperCase();
              const porcentaje = Number(fd.get("porcentaje"));
              if (codigo.length < 3 || porcentaje <= 0 || porcentaje > 90) {
                toast.error("Código de 3+ letras y descuento entre 1 y 90.");
                return;
              }
              guardarPromo({
                codigo,
                porcentaje,
                descripcion: String(fd.get("descripcion") ?? "").slice(0, 90) || `${porcentaje}% de descuento`,
                activa: true,
              });
              e.currentTarget.reset();
              toast.success("Promo creada y activada");
            }}
            className="paper-card label-notch h-fit p-6"
          >
            <h2 className="font-display text-lg">Nueva promo</h2>
            <label className="mt-4 block text-xs uppercase tracking-widest text-muted-foreground">
              Código
              <input name="codigo" maxLength={20} className={`${field} mt-1`} />
            </label>
            <label className="mt-3 block text-xs uppercase tracking-widest text-muted-foreground">
              Descripción
              <input name="descripcion" maxLength={90} className={`${field} mt-1`} />
            </label>
            <label className="mt-3 block text-xs uppercase tracking-widest text-muted-foreground">
              % descuento
              <input name="porcentaje" type="number" min={1} max={90} className={`${field} mt-1`} />
            </label>
            <button className="mt-6 w-full rounded-full bg-ink py-2.5 text-sm text-primary-foreground">
              Crear
            </button>
          </form>

          <div className="paper-card label-notch p-6">
            <h2 className="font-display text-lg">Promos y fechas especiales</h2>
            <div className="mt-5 divide-y divide-border">
              {promos.map((p) => (
                <div key={p.codigo} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-display">{p.codigo}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.descripcion} · {p.porcentaje}%
                    </p>
                  </div>
                  <button
                    onClick={() => guardarPromo({ ...p, activa: !p.activa })}
                    className={`border px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${
                      p.activa ? "border-ink bg-ink text-primary-foreground" : "border-border text-muted-foreground"
                    }`}
                  >
                    {p.activa ? "Activa" : "Pausada"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
