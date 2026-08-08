import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Star, Trash2, Upload, X } from "lucide-react";
import { ConfirmDelete } from "@/components/confirm-delete";
import { fecha, money } from "@/lib/format";
import { filesToDataUrls, productImage } from "@/lib/images";
import {
  textoDescuento,
  useTikva,
  type Categoria,
  type Cliente,
  type Descuento,
  type EstadoPedido,
  type Producto,
} from "@/lib/store";

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
const tabs = [
  "Resumen",
  "Productos",
  "Categorías",
  "Clientes",
  "Descuentos",
  "Pedidos",
  "Gastos",
  "Promos",
] as const;

const field =
  "mt-2 w-full border border-input bg-card px-3.5 py-2.5 text-sm outline-none focus:border-sky-deep";
const labelCls = "block text-xs uppercase tracking-widest text-muted-foreground";

function productoVacio(categoriaId = ""): Producto {
  return {
    id: "",
    slug: "",
    nombre: "",
    resumen: "",
    descripcion: "",
    detalles: [],
    precio: 0,
    costo: 0,
    stock: 0,
    categoriaId,
    imagenes: [],
    destacado: false,
    activo: true,
  };
}

function Admin() {
  const { usuario } = useTikva();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Resumen");

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

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Panel Tikva</p>
          <h1 className="mt-3 font-display text-4xl">Cuentas, stock y pedidos</h1>
        </div>
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

      <div className="mt-8">
        {tab === "Resumen" && <ResumenTab />}
        {tab === "Productos" && <ProductosTab />}
        {tab === "Categorías" && <CategoriasTab />}
        {tab === "Clientes" && <ClientesTab />}
        {tab === "Descuentos" && <DescuentosTab />}
        {tab === "Pedidos" && <PedidosTab />}
        {tab === "Gastos" && <GastosTab />}
        {tab === "Promos" && <PromosTab />}
      </div>
    </div>
  );
}

/* ---------------------------------- Resumen --------------------------------- */

function ResumenTab() {
  const { pedidos, productos, gastos, reset, negocio, guardarNegocio } = useTikva();

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

  const maxRank = Math.max(1, ...ranking.map((r) => r.total));

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
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
                        ? "text-gold-dark"
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

      {/* Ajustes del negocio */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          guardarNegocio({
            nombre: String(fd.get("nombre") ?? negocio.nombre).slice(0, 60),
            whatsapp: String(fd.get("whatsapp") ?? negocio.whatsapp).trim(),
            whatsappVisible: String(fd.get("whatsappVisible") ?? negocio.whatsappVisible).slice(
              0,
              30,
            ),
            instagram: String(fd.get("instagram") ?? negocio.instagram)
              .replace(/^@/, "")
              .slice(0, 40),
            envioCosto: Math.max(0, Number(fd.get("envioCosto"))),
            envioGratisDesde: Math.max(0, Number(fd.get("envioGratisDesde"))),
          });
          toast.success("Ajustes guardados");
        }}
        className="paper-card label-notch p-6"
      >
        <h2 className="font-display text-lg">Ajustes del negocio</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className={labelCls}>
            Nombre
            <input name="nombre" defaultValue={negocio.nombre} maxLength={60} className={field} />
          </label>
          <label className={labelCls}>
            WhatsApp (con código país, ej. 5491156582298)
            <input
              name="whatsapp"
              defaultValue={negocio.whatsapp}
              maxLength={20}
              className={field}
            />
          </label>
          <label className={labelCls}>
            WhatsApp visible
            <input
              name="whatsappVisible"
              defaultValue={negocio.whatsappVisible}
              maxLength={30}
              className={field}
            />
          </label>
          <label className={labelCls}>
            Instagram (sin @)
            <input
              name="instagram"
              defaultValue={negocio.instagram}
              maxLength={40}
              className={field}
            />
          </label>
          <label className={labelCls}>
            Costo de envío ($)
            <input
              name="envioCosto"
              type="number"
              min={0}
              defaultValue={negocio.envioCosto}
              className={field}
            />
          </label>
          <label className={labelCls}>
            Envío gratis desde ($)
            <input
              name="envioGratisDesde"
              type="number"
              min={0}
              defaultValue={negocio.envioGratisDesde}
              className={field}
            />
          </label>
        </div>
        <button className="mt-6 rounded-full bg-ink px-6 py-2.5 text-sm text-primary-foreground">
          Guardar ajustes
        </button>
      </form>
    </div>
  );
}

/* -------------------------------- Productos -------------------------------- */

function ImageUploader({
  imagenes,
  onChange,
}: {
  imagenes: string[];
  onChange: (imgs: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [arrastrando, setArrastrando] = useState(false);

  const agregar = async (files: ArrayLike<File>) => {
    const nuevas = await filesToDataUrls(files);
    if (nuevas.length === 0) {
      toast.error("Elegí archivos de imagen válidos.");
      return;
    }
    onChange([...imagenes, ...nuevas].slice(0, 6));
    if (imagenes.length + nuevas.length > 6) toast.info("Máximo 6 imágenes por producto.");
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setArrastrando(true);
        }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={(e) => {
          e.preventDefault();
          setArrastrando(false);
          void agregar(e.dataTransfer.files);
        }}
        className={`mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed px-4 py-8 text-center transition-colors ${
          arrastrando ? "border-sky-deep bg-sky/40" : "border-border hover:border-sky-deep/60"
        }`}
      >
        <Upload className="h-5 w-5 text-sky-deep" />
        <p className="text-sm">Arrastrá las fotos acá o tocá para elegir archivos</p>
        <p className="text-xs text-muted-foreground">
          JPG o PNG · varias a la vez · la primera es la portada
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          void agregar(e.target.files ?? []);
          e.currentTarget.value = "";
        }}
      />
      {imagenes.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {imagenes.map((img, i) => (
            <div key={i} className="relative">
              <img
                src={img}
                alt={`Foto ${i + 1}`}
                className={`h-20 w-16 border object-cover ${i === 0 ? "border-sky-deep" : "border-border"}`}
              />
              <div className="mt-1 flex items-center justify-center gap-2">
                {i === 0 ? (
                  <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest text-sky-deep">
                    <Star className="h-3 w-3 fill-current" /> Portada
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onChange([img, ...imagenes.filter((_, j) => j !== i)])}
                    className="text-[9px] uppercase tracking-widest text-muted-foreground hover:text-sky-deep"
                  >
                    Hacer portada
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onChange(imagenes.filter((_, j) => j !== i))}
                  aria-label="Quitar imagen"
                  className="ml-1 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductosTab() {
  const {
    productos,
    categorias,
    guardarProducto,
    borrarProducto,
    categoriaPorId,
    descuentoDe,
    precioFinal,
  } = useTikva();
  const [draft, setDraft] = useState<Producto>(() => productoVacio(categorias[0]?.id ?? ""));

  const set = <K extends keyof Producto>(k: K, v: Producto[K]) =>
    setDraft((d) => ({ ...d, [k]: v }));

  const guardar = () => {
    if (draft.nombre.trim().length < 2) {
      toast.error("El producto necesita un nombre.");
      return;
    }
    if (draft.precio <= 0) {
      toast.error("El precio debe ser mayor a cero.");
      return;
    }
    guardarProducto({ ...draft, nombre: draft.nombre.trim() });
    toast.success(draft.id ? "Producto actualizado" : "Producto creado");
    setDraft(productoVacio(categorias[0]?.id ?? ""));
  };

  const eliminar = (p: Producto) => {
    borrarProducto(p.id);
    if (draft.id === p.id) setDraft(productoVacio(categorias[0]?.id ?? ""));
    toast.success("Producto eliminado");
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_1.1fr]">
      {/* Lista */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg">Productos ({productos.length})</h2>
          <button
            onClick={() => setDraft(productoVacio(categorias[0]?.id ?? ""))}
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs text-primary-foreground"
          >
            <Plus className="h-3.5 w-3.5" /> Nuevo producto
          </button>
        </div>
        {productos.map((p) => {
          const d = descuentoDe(p);
          return (
            <div
              key={p.id}
              className={`paper-card label-notch flex items-center gap-4 p-3 transition-colors ${
                draft.id === p.id ? "ring-2 ring-sky-deep" : ""
              }`}
            >
              <button
                onClick={() =>
                  setDraft({ ...p, detalles: [...p.detalles], imagenes: [...p.imagenes] })
                }
                className="flex flex-1 items-center gap-4 text-left"
              >
                <img
                  src={productImage(p.imagenes[0])}
                  alt={p.nombre}
                  width={64}
                  height={64}
                  loading="lazy"
                  className="h-14 w-12 shrink-0 object-cover"
                />
                <span className="min-w-0">
                  <span className="block truncate font-display text-sm">{p.nombre}</span>
                  <span className="block text-xs text-muted-foreground">
                    {categoriaPorId(p.categoriaId)?.nombre ?? "Sin categoría"} · stock {p.stock}
                  </span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs">
                    {d && (
                      <span className="bg-gold/70 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-ink">
                        {d.etiqueta} −{textoDescuento(d)}
                      </span>
                    )}
                    {d ? (
                      <>
                        <span className="text-muted-foreground line-through">
                          {money(p.precio)}
                        </span>
                        <span className="text-gold-dark">{money(precioFinal(p))}</span>
                      </>
                    ) : (
                      <span>{money(p.precio)}</span>
                    )}
                  </span>
                </span>
              </button>
              <button
                onClick={() =>
                  setDraft({ ...p, detalles: [...p.detalles], imagenes: [...p.imagenes] })
                }
                aria-label="Editar"
                className="text-muted-foreground hover:text-ink"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <ConfirmDelete
                onConfirm={() => eliminar(p)}
                title={`¿Eliminar "${p.nombre}"?`}
                description="Se borra del catálogo. Los pedidos ya registrados no se modifican."
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </ConfirmDelete>
            </div>
          );
        })}
        {productos.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Todavía no hay productos. Creá el primero.
          </p>
        )}
      </div>

      {/* Editor */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          guardar();
        }}
        className="paper-card label-notch p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg">
            {draft.id ? "Editar producto" : "Nuevo producto"}
          </h2>
          {draft.id && (
            <ConfirmDelete
              onConfirm={() => eliminar(draft)}
              title={`¿Eliminar "${draft.nombre}"?`}
              confirmLabel="Eliminar producto"
              className="text-xs text-muted-foreground underline underline-offset-4 hover:text-destructive"
            >
              Eliminar
            </ConfirmDelete>
          )}
        </div>

        <div className="mt-4 space-y-4">
          <label className={labelCls}>
            Nombre *
            <input
              value={draft.nombre}
              onChange={(e) => set("nombre", e.target.value)}
              maxLength={90}
              className={field}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelCls}>
              Precio ($) *
              <input
                type="number"
                min={0}
                value={draft.precio || ""}
                onChange={(e) => set("precio", Math.max(0, Number(e.target.value)))}
                className={field}
              />
            </label>
            <label className={labelCls}>
              Costo ($)
              <input
                type="number"
                min={0}
                value={draft.costo || ""}
                onChange={(e) => set("costo", Math.max(0, Number(e.target.value)))}
                className={field}
              />
            </label>
            <label className={labelCls}>
              Stock
              <input
                type="number"
                min={0}
                value={draft.stock}
                onChange={(e) => set("stock", Math.max(0, Number(e.target.value)))}
                className={field}
              />
            </label>
            <label className={labelCls}>
              Categoría
              <select
                value={draft.categoriaId}
                onChange={(e) => set("categoriaId", e.target.value)}
                className={field}
              >
                <option value="">Sin categoría</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className={labelCls}>
            Resumen (aparece en la tarjeta)
            <input
              value={draft.resumen}
              onChange={(e) => set("resumen", e.target.value)}
              maxLength={120}
              className={field}
            />
          </label>

          <label className={labelCls}>
            Descripción
            <textarea
              value={draft.descripcion}
              onChange={(e) => set("descripcion", e.target.value)}
              rows={4}
              maxLength={1200}
              className={field}
            />
          </label>

          <label className={labelCls}>
            Detalles (uno por línea)
            <textarea
              value={draft.detalles.join("\n")}
              onChange={(e) =>
                set(
                  "detalles",
                  e.target.value
                    .split("\n")
                    .map((l) => l.trim())
                    .filter(Boolean),
                )
              }
              rows={4}
              className={field}
            />
          </label>

          <div>
            <span className={labelCls}>Fotos del producto</span>
            <ImageUploader imagenes={draft.imagenes} onChange={(imgs) => set("imagenes", imgs)} />
          </div>

          <div className="flex flex-wrap gap-6 pt-1">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.destacado}
                onChange={(e) => set("destacado", e.target.checked)}
                className="accent-sky-deep"
              />
              Destacado en la portada
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.activo}
                onChange={(e) => set("activo", e.target.checked)}
                className="accent-sky-deep"
              />
              Visible en la tienda
            </label>
          </div>

          <button className="w-full rounded-full bg-ink py-3 text-sm text-primary-foreground">
            {draft.id ? "Guardar cambios" : "Crear producto"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* -------------------------------- Categorías ------------------------------- */

function CategoriasTab() {
  const { categorias, productos, guardarCategoria, borrarCategoria } = useTikva();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editando, setEditando] = useState<Categoria | null>(null);

  const guardar = () => {
    if (nombre.trim().length < 2) {
      toast.error("La categoría necesita un nombre.");
      return;
    }
    guardarCategoria({
      id: editando?.id ?? "",
      nombre: nombre.trim(),
      ...(descripcion.trim() ? { descripcion: descripcion.trim() } : {}),
    });
    toast.success(editando ? "Categoría actualizada" : "Categoría creada");
    setNombre("");
    setDescripcion("");
    setEditando(null);
  };

  const eliminar = (c: Categoria) => {
    const r = borrarCategoria(c.id);
    if (r.ok) toast.success(r.mensaje);
    else toast.error(r.mensaje);
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_1.2fr]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          guardar();
        }}
        className="paper-card label-notch h-fit p-6"
      >
        <h2 className="font-display text-lg">
          {editando ? "Editar categoría" : "Nueva categoría"}
        </h2>
        <label className={`${labelCls} mt-4`}>
          Nombre *
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            maxLength={40}
            className={field}
          />
        </label>
        <label className={`${labelCls} mt-3`}>
          Descripción (opcional)
          <input
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            maxLength={120}
            className={field}
          />
        </label>
        <div className="mt-5 flex gap-2">
          <button className="flex-1 rounded-full bg-ink py-2.5 text-sm text-primary-foreground">
            {editando ? "Guardar" : "Crear"}
          </button>
          {editando && (
            <button
              type="button"
              onClick={() => {
                setEditando(null);
                setNombre("");
                setDescripcion("");
              }}
              className="rounded-full border border-border px-5 text-sm text-muted-foreground"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {categorias.map((c) => {
          const usados = productos.filter((p) => p.categoriaId === c.id).length;
          return (
            <div key={c.id} className="paper-card label-notch flex items-center gap-4 p-4">
              <div className="flex-1">
                <p className="font-display">{c.nombre}</p>
                {c.descripcion && <p className="text-xs text-muted-foreground">{c.descripcion}</p>}
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {usados} producto{usados === 1 ? "" : "s"} asignado{usados === 1 ? "" : "s"}
                </p>
              </div>
              <button
                onClick={() => {
                  setEditando(c);
                  setNombre(c.nombre);
                  setDescripcion(c.descripcion ?? "");
                }}
                aria-label="Editar"
                className="text-muted-foreground hover:text-ink"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <ConfirmDelete
                onConfirm={() => eliminar(c)}
                title={`¿Eliminar la categoría "${c.nombre}"?`}
                description="Solo se puede borrar si no tiene productos asignados."
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </ConfirmDelete>
            </div>
          );
        })}
        {categorias.length === 0 && (
          <p className="text-sm text-muted-foreground">Sin categorías todavía.</p>
        )}
      </div>
    </div>
  );
}

/* --------------------------------- Clientes -------------------------------- */

function ClientesTab() {
  const { clientes, pedidos, guardarCliente, borrarCliente } = useTikva();
  const [draft, setDraft] = useState<Cliente | null>(null);
  const [nuevo, setNuevo] = useState(false);

  const stats = useMemo(() => {
    const map = new Map<string, { pedidos: number; total: number }>();
    pedidos.forEach((p) => {
      const key = p.cliente.email.toLowerCase();
      const prev = map.get(key) ?? { pedidos: 0, total: 0 };
      map.set(key, { pedidos: prev.pedidos + 1, total: prev.total + p.total });
    });
    return map;
  }, [pedidos]);

  const guardar = () => {
    if (!draft) return;
    if (draft.nombre.trim().length < 2) {
      toast.error("El cliente necesita un nombre.");
      return;
    }
    guardarCliente({ ...draft, nombre: draft.nombre.trim() });
    toast.success("Cliente guardado");
    setDraft(null);
    setNuevo(false);
  };

  const eliminar = (c: Cliente) => {
    borrarCliente(c.id);
    if (draft?.id === c.id) setDraft(null);
    toast.success("Cliente eliminado");
  };

  const form = (c: Cliente) => (
    <form
      key={c.id}
      onSubmit={(e) => {
        e.preventDefault();
        guardar();
      }}
      className="paper-card label-notch h-fit p-6"
    >
      <h2 className="font-display text-lg">
        {nuevo ? "Nuevo cliente" : `Editar · ${c.nombre.split(" ")[0]}`}
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className={labelCls}>
          Nombre *
          <input
            value={draft?.nombre ?? ""}
            onChange={(e) => setDraft((d) => (d ? { ...d, nombre: e.target.value } : d))}
            maxLength={80}
            className={field}
          />
        </label>
        <label className={labelCls}>
          Teléfono / WhatsApp
          <input
            value={draft?.telefono ?? ""}
            onChange={(e) => setDraft((d) => (d ? { ...d, telefono: e.target.value } : d))}
            maxLength={25}
            className={field}
          />
        </label>
        <label className={labelCls}>
          Email
          <input
            type="email"
            value={draft?.email ?? ""}
            onChange={(e) => setDraft((d) => (d ? { ...d, email: e.target.value } : d))}
            maxLength={120}
            className={field}
          />
        </label>
        <label className={labelCls}>
          Dirección
          <input
            value={draft?.direccion ?? ""}
            onChange={(e) => setDraft((d) => (d ? { ...d, direccion: e.target.value } : d))}
            maxLength={160}
            className={field}
          />
        </label>
        <label className={`${labelCls} sm:col-span-2`}>
          Notas
          <textarea
            value={draft?.notas ?? ""}
            onChange={(e) => setDraft((d) => (d ? { ...d, notas: e.target.value } : d))}
            rows={2}
            maxLength={300}
            className={field}
          />
        </label>
      </div>
      <div className="mt-5 flex gap-2">
        <button className="flex-1 rounded-full bg-ink py-2.5 text-sm text-primary-foreground">
          Guardar cliente
        </button>
        <button
          type="button"
          onClick={() => {
            setDraft(null);
            setNuevo(false);
          }}
          className="rounded-full border border-border px-5 text-sm text-muted-foreground"
        >
          Cancelar
        </button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg">Clientes ({clientes.length})</h2>
        <button
          onClick={() => {
            setNuevo(true);
            setDraft({
              id: "",
              nombre: "",
              email: "",
              telefono: "",
              direccion: "",
              notas: "",
              fechaAlta: new Date().toISOString(),
            });
          }}
          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs text-primary-foreground"
        >
          <Plus className="h-3.5 w-3.5" /> Nuevo cliente
        </button>
      </div>

      {draft && (nuevo || draft.id) && form(draft)}

      <div className="space-y-3">
        {clientes.map((c) => {
          const st = stats.get(c.email.toLowerCase());
          return (
            <div
              key={c.id}
              className="paper-card label-notch flex flex-wrap items-center gap-4 p-4"
            >
              <div className="flex-1">
                <p className="font-display">{c.nombre}</p>
                <p className="text-xs text-muted-foreground">
                  {c.email || "sin email"} · {c.telefono || "sin teléfono"} · alta{" "}
                  {fecha(c.fechaAlta)}
                </p>
                {c.direccion && <p className="text-xs text-muted-foreground">{c.direccion}</p>}
                {c.notas && (
                  <p className="mt-1 text-xs italic text-muted-foreground">“{c.notas}”</p>
                )}
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>
                  <span className="font-display text-base text-ink">{st?.pedidos ?? 0}</span> pedido
                  {st?.pedidos === 1 ? "" : "s"}
                </p>
                <p>total {money(st?.total ?? 0)}</p>
              </div>
              <button
                onClick={() => {
                  setNuevo(false);
                  setDraft({ ...c });
                }}
                aria-label="Editar"
                className="text-muted-foreground hover:text-ink"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <ConfirmDelete
                onConfirm={() => eliminar(c)}
                title={`¿Eliminar a "${c.nombre}"?`}
                description="Se saca del registro de clientes. Sus pedidos quedan intactos."
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </ConfirmDelete>
            </div>
          );
        })}
        {clientes.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Todavía no hay clientes registrados. Se van cargando solos con cada pedido o registro.
          </p>
        )}
      </div>
    </div>
  );
}

/* -------------------------------- Descuentos ------------------------------- */

function DescuentosTab() {
  const { descuentos, categorias, productos, guardarDescuento, borrarDescuento } = useTikva();
  const [draft, setDraft] = useState<Descuento | null>(null);
  const [nuevo, setNuevo] = useState(false);

  const vacio = (): Descuento => ({
    id: "",
    nombre: "",
    etiqueta: "",
    tipo: "porcentaje",
    valor: 0,
    fechaInicio: new Date().toLocaleDateString("en-CA"),
    fechaFin: new Date().toLocaleDateString("en-CA"),
    alcance: "todos",
    categoriaId: categorias[0]?.id ?? null,
    productoIds: [],
    activo: true,
  });

  const guardar = () => {
    if (!draft) return;
    if (draft.nombre.trim().length < 2 || draft.valor <= 0) {
      toast.error("Completá el nombre y un descuento mayor a cero.");
      return;
    }
    if (draft.fechaInicio > draft.fechaFin) {
      toast.error("La fecha de fin no puede ser anterior al inicio.");
      return;
    }
    guardarDescuento({
      ...draft,
      nombre: draft.nombre.trim(),
      etiqueta: draft.etiqueta.trim() || draft.nombre.trim(),
    });
    toast.success(draft.id ? "Descuento actualizado" : "Descuento creado");
    setDraft(null);
    setNuevo(false);
  };

  const eliminar = (d: Descuento) => {
    borrarDescuento(d.id);
    if (draft?.id === d.id) setDraft(null);
    toast.success("Descuento eliminado");
  };

  const form = (d: Descuento) => (
    <form
      key={d.id || "nuevo"}
      onSubmit={(e) => {
        e.preventDefault();
        guardar();
      }}
      className="paper-card label-notch p-6"
    >
      <h2 className="font-display text-lg">
        {nuevo ? "Nuevo descuento por fecha" : `Editar · ${d.nombre}`}
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className={labelCls}>
          Nombre de la fecha especial *
          <input
            value={draft?.nombre ?? ""}
            onChange={(e) => setDraft((x) => (x ? { ...x, nombre: e.target.value } : x))}
            placeholder="Día de la Madre"
            maxLength={60}
            className={field}
          />
        </label>
        <label className={labelCls}>
          Etiqueta de la tira (corta)
          <input
            value={draft?.etiqueta ?? ""}
            onChange={(e) => setDraft((x) => (x ? { ...x, etiqueta: e.target.value } : x))}
            placeholder="Día de la Madre"
            maxLength={30}
            className={field}
          />
        </label>
        <label className={labelCls}>
          Tipo de descuento
          <select
            value={draft?.tipo ?? "porcentaje"}
            onChange={(e) =>
              setDraft((x) => (x ? { ...x, tipo: e.target.value as "porcentaje" | "monto" } : x))
            }
            className={field}
          >
            <option value="porcentaje">Porcentaje (%)</option>
            <option value="monto">Monto fijo ($)</option>
          </select>
        </label>
        <label className={labelCls}>
          {draft?.tipo === "porcentaje" ? "Descuento (%)" : "Descuento ($)"}
          <input
            type="number"
            min={0}
            max={draft?.tipo === "porcentaje" ? 90 : undefined}
            value={draft?.valor || ""}
            onChange={(e) =>
              setDraft((x) => (x ? { ...x, valor: Math.max(0, Number(e.target.value)) } : x))
            }
            className={field}
          />
        </label>
        <label className={labelCls}>
          Desde (incluido)
          <input
            type="date"
            value={draft?.fechaInicio ?? ""}
            onChange={(e) => setDraft((x) => (x ? { ...x, fechaInicio: e.target.value } : x))}
            className={field}
          />
        </label>
        <label className={labelCls}>
          Hasta (incluido)
          <input
            type="date"
            value={draft?.fechaFin ?? ""}
            onChange={(e) => setDraft((x) => (x ? { ...x, fechaFin: e.target.value } : x))}
            className={field}
          />
        </label>
        <label className={labelCls}>
          Aplicar a
          <select
            value={draft?.alcance ?? "todos"}
            onChange={(e) =>
              setDraft((x) => (x ? { ...x, alcance: e.target.value as Descuento["alcance"] } : x))
            }
            className={field}
          >
            <option value="todos">Todos los productos</option>
            <option value="categoria">Una categoría</option>
            <option value="productos">Productos elegidos</option>
          </select>
        </label>
        <label className="flex items-end gap-2 pb-2 text-sm">
          <input
            type="checkbox"
            checked={draft?.activo ?? true}
            onChange={(e) => setDraft((x) => (x ? { ...x, activo: e.target.checked } : x))}
            className="accent-sky-deep"
          />
          Activo
        </label>
      </div>

      {draft?.alcance === "categoria" && (
        <label className={`${labelCls} mt-4`}>
          Categoría
          <select
            value={draft.categoriaId ?? ""}
            onChange={(e) => setDraft((x) => (x ? { ...x, categoriaId: e.target.value } : x))}
            className={field}
          >
            <option value="">Elegí una categoría</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </label>
      )}

      {draft?.alcance === "productos" && (
        <div className="mt-4">
          <span className={labelCls}>Productos incluidos</span>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {productos.map((p) => (
              <label key={p.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={draft.productoIds.includes(p.id)}
                  onChange={(e) =>
                    setDraft((x) =>
                      x
                        ? {
                            ...x,
                            productoIds: e.target.checked
                              ? [...x.productoIds, p.id]
                              : x.productoIds.filter((id) => id !== p.id),
                          }
                        : x,
                    )
                  }
                  className="accent-sky-deep"
                />
                <span className="truncate">{p.nombre}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {draft && draft.nombre && (
        <p className="mt-5 text-xs text-muted-foreground">
          Tira de la card:{" "}
          <span className="ml-1 inline-block bg-gold/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">
            {draft.etiqueta || draft.nombre} −{textoDescuento(draft)}
          </span>
        </p>
      )}

      <div className="mt-6 flex gap-2">
        <button className="flex-1 rounded-full bg-ink py-2.5 text-sm text-primary-foreground">
          {draft?.id ? "Guardar cambios" : "Crear descuento"}
        </button>
        <button
          type="button"
          onClick={() => {
            setDraft(null);
            setNuevo(false);
          }}
          className="rounded-full border border-border px-5 text-sm text-muted-foreground"
        >
          Cancelar
        </button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg">Descuentos por días especiales</h2>
          <p className="text-xs text-muted-foreground">
            Solo se activan dentro del rango de fechas y muestran una tira en la tarjeta del
            producto.
          </p>
        </div>
        <button
          onClick={() => {
            setNuevo(true);
            setDraft(vacio());
          }}
          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs text-primary-foreground"
        >
          <Plus className="h-3.5 w-3.5" /> Nuevo descuento
        </button>
      </div>

      {draft && (nuevo || draft.id) && form(draft)}

      <div className="grid gap-4 sm:grid-cols-2">
        {descuentos.map((d) => {
          const vigente =
            d.activo &&
            d.fechaInicio <= new Date().toLocaleDateString("en-CA") &&
            d.fechaFin >= new Date().toLocaleDateString("en-CA");
          const cantidad = productos.filter((p) =>
            d.alcance === "todos"
              ? true
              : d.alcance === "categoria"
                ? p.categoriaId === d.categoriaId
                : d.productoIds.includes(p.id),
          ).length;
          return (
            <div key={d.id} className="paper-card label-notch p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display">{d.nombre}</p>
                  <p className="text-xs text-muted-foreground">
                    {fecha(d.fechaInicio + "T00:00:00")} → {fecha(d.fechaFin + "T00:00:00")} ·{" "}
                    {textoDescuento(d)}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {d.alcance === "todos"
                      ? "Todos los productos"
                      : d.alcance === "categoria"
                        ? `Categoría: ${categorias.find((c) => c.id === d.categoriaId)?.nombre ?? "—"}`
                        : `${d.productoIds.length} producto(s) elegidos`}{" "}
                    · {cantidad} afectado(s)
                  </p>
                  <p className="mt-1 text-[11px]">
                    {vigente ? (
                      <span className="font-semibold text-sage">● Vigente hoy</span>
                    ) : (
                      <span className="text-muted-foreground">○ Fuera de fecha</span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => guardarDescuento({ ...d, activo: !d.activo })}
                  className={`border px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${
                    d.activo
                      ? "border-ink bg-ink text-primary-foreground"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {d.activo ? "Activa" : "Pausada"}
                </button>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 bg-gold/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">
                  Tira: {d.etiqueta} −{textoDescuento(d)}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setNuevo(false);
                      setDraft({ ...d, productoIds: [...d.productoIds] });
                    }}
                    aria-label="Editar"
                    className="text-muted-foreground hover:text-ink"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <ConfirmDelete
                    onConfirm={() => eliminar(d)}
                    title={`¿Eliminar el descuento "${d.nombre}"?`}
                    description="Los productos vuelven a su precio normal cuando se elimina."
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </ConfirmDelete>
                </div>
              </div>
            </div>
          );
        })}
        {descuentos.length === 0 && (
          <p className="text-sm text-muted-foreground sm:col-span-2">
            Todavía no hay descuentos por fechas especiales.
          </p>
        )}
      </div>
    </div>
  );
}

/* --------------------------------- Pedidos -------------------------------- */

function PedidosTab() {
  const { pedidos, cambiarEstado } = useTikva();
  return (
    <div className="space-y-4">
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
      {pedidos.length === 0 && (
        <p className="text-sm text-muted-foreground">Sin pedidos todavía.</p>
      )}
    </div>
  );
}

/* ---------------------------------- Gastos --------------------------------- */

function GastosTab() {
  const { gastos, agregarGasto, borrarGasto } = useTikva();
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
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
        <label className={`${labelCls} mt-4`}>
          Concepto
          <input name="concepto" maxLength={90} className={field} />
        </label>
        <label className={`${labelCls} mt-3`}>
          Categoría
          <select name="categoria" className={`${field} mt-1`}>
            {["Insumos", "Impresión", "Marketing", "Envíos", "Otros"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className={`${labelCls} mt-3`}>
          Monto
          <input name="monto" type="number" min={1} className={field} />
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
  );
}

/* ---------------------------------- Promos --------------------------------- */

function PromosTab() {
  const { promos, guardarPromo } = useTikva();
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const codigo = String(fd.get("codigo") ?? "")
            .trim()
            .toUpperCase();
          const porcentaje = Number(fd.get("porcentaje"));
          if (codigo.length < 3 || porcentaje <= 0 || porcentaje > 90) {
            toast.error("Código de 3+ letras y descuento entre 1 y 90.");
            return;
          }
          guardarPromo({
            codigo,
            porcentaje,
            descripcion:
              String(fd.get("descripcion") ?? "").slice(0, 90) || `${porcentaje}% de descuento`,
            activa: true,
          });
          e.currentTarget.reset();
          toast.success("Promo creada y activada");
        }}
        className="paper-card label-notch h-fit p-6"
      >
        <h2 className="font-display text-lg">Nueva promo</h2>
        <label className={`${labelCls} mt-4`}>
          Código
          <input name="codigo" maxLength={20} className={field} />
        </label>
        <label className={`${labelCls} mt-3`}>
          Descripción
          <input name="descripcion" maxLength={90} className={field} />
        </label>
        <label className={`${labelCls} mt-3`}>
          % descuento
          <input name="porcentaje" type="number" min={1} max={90} className={field} />
        </label>
        <button className="mt-6 w-full rounded-full bg-ink py-2.5 text-sm text-primary-foreground">
          Crear
        </button>
      </form>

      <div className="paper-card label-notch p-6">
        <h2 className="font-display text-lg">Promos y cupones</h2>
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
                  p.activa
                    ? "border-ink bg-ink text-primary-foreground"
                    : "border-border text-muted-foreground"
                }`}
              >
                {p.activa ? "Activa" : "Pausada"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
