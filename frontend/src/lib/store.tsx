import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Rol = "admin" | "cliente";

export type Usuario = {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  telefono?: string | null;
};

export type Categoria = {
  id: string;
  nombre: string;
  descripcion?: string;
};

export type Producto = {
  id: string;
  slug: string;
  nombre: string;
  resumen: string;
  descripcion: string;
  detalles: string[];
  precio: number;
  costo: number;
  stock: number;
  categoriaId: string;
  imagenes: string[];
  destacado: boolean;
  activo: boolean;
};

export type TipoDescuento = "porcentaje" | "monto";
export type AlcanceDescuento = "todos" | "categoria" | "productos";

export type Descuento = {
  id: string;
  nombre: string;
  etiqueta: string;
  tipo: TipoDescuento;
  valor: number;
  fechaInicio: string;
  fechaFin: string;
  alcance: AlcanceDescuento;
  categoriaId: string | null;
  productoIds: string[];
  activo: boolean;
};

export type Cliente = {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  notas: string;
  fechaAlta: string;
};

export type Promo = {
  codigo: string;
  descripcion: string;
  porcentaje: number;
  activa: boolean;
};

export type ItemCarrito = { id: string; nombre: string; precio: number; cantidad: number };

export type EstadoPedido = "nuevo" | "preparando" | "enviado" | "entregado" | "cancelado";

export type Pedido = {
  id: string;
  fecha: string;
  usuarioId: string | null;
  cliente: {
    nombre: string;
    telefono: string;
    email: string;
    entrega: "envio" | "retiro";
    direccion: string;
    notas: string;
  };
  items: ItemCarrito[];
  subtotal: number;
  descuento: number;
  envio: number;
  total: number;
  estado: EstadoPedido;
};

export type Gasto = {
  id: string;
  fecha: string;
  concepto: string;
  categoria: string;
  monto: number;
};

export type Negocio = {
  nombre: string;
  rubro?: string;
  instagram?: string;
  whatsapp: string;
  whatsappVisible: string;
  envioCosto: number;
  envioGratisDesde: number;
};

type DB = {
  negocio: Negocio;
  categorias: Categoria[];
  productos: Producto[];
  clientes: Cliente[];
  descuentos: Descuento[];
  promos: Promo[];
  pedidos: Pedido[];
  gastos: Gasto[];
  usuarios: Usuario[];
};

const CART_KEY = "tikva-cart-v1";
const SESSION_KEY = "tikva-session-v1";

const DEFAULT_NEGOCIO: Negocio = {
  nombre: "TIKVA",
  rubro: "Regalería Cristiana",
  instagram: "",
  whatsapp: "",
  whatsappVisible: "",
  envioCosto: 0,
  envioGratisDesde: 0,
};

const DB_VACIO: DB = {
  negocio: DEFAULT_NEGOCIO,
  categorias: [],
  productos: [],
  clientes: [],
  descuentos: [],
  promos: [],
  pedidos: [],
  gastos: [],
  usuarios: [],
};

const BACKEND = (typeof window !== "undefined" && (window as any).__BACKEND_URL) ?? (typeof import.meta !== "undefined" && import.meta.env?.["VITE_BACKEND_URL"]) ?? "http://localhost:3001";

/**
 * Origen del backend **sin** el sufijo `/api`.
 *
 * `backendUrl` puede llegar como ruta relativa ("/api", típico en Docker
 * detrás del proxy) o como URL absoluta ("http://localhost:3001", típico en
 * desarrollo). Normalizamos ambos casos acá para no duplicar `/api`.
 */
function backendOrigin(): string {
  const raw = ((typeof window !== "undefined" && (window as any).__BACKEND_URL) || BACKEND || "").trim();
  const base = raw.replace(/\/+$/, "");
  return base.endsWith("/api") ? base.slice(0, -4) : base;
}

function apiUrl(path: string): string {
  const limpio = path.startsWith("/") ? path : `/${path}`;
  return `${backendOrigin()}/api${limpio}`;
}

function readSession(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

function writeSession(id: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (id) window.localStorage.setItem(SESSION_KEY, id);
    else window.localStorage.removeItem(SESSION_KEY);
  } catch {
    /* noop */
  }
}

/**
 * Petición al backend. Se exporta para que otros módulos (por ejemplo las
 * subidas a Cloudinary) reusen la misma base, headers y sesión.
 */
export async function api(path: string, opts?: RequestInit) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 12_000);
  const sid =
    (typeof window !== "undefined" && ((window as any).__BACKEND_SESSION ?? readSession())) || null;
  const out = await fetch(apiUrl(path), {
    signal: controller.signal,
    headers: {
      "Content-Type": "application/json",
      ...(sid ? { "x-session": String(sid) } : {}),
    },
    ...opts,
  });
  clearTimeout(t);
  const raw = await out.text().catch(() => "");
  let body: any = {};
  try {
    body = raw ? JSON.parse(raw) : {};
  } catch {
    body = {};
  }
  if (!out.ok) {
    const mensaje =
      body?.mensaje ??
      (out.status === 404
        ? "Recurso no encontrado (404)"
        : out.statusText || `Error del servidor (${out.status})`);
    throw Object.assign(new Error(String(mensaje)), { status: out.status, data: body });
  }
  return body;
}

function readCart(): ItemCarrito[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as ItemCarrito[]) : [];
  } catch {
    return [];
  }
}

function writeCart(value: ItemCarrito[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(value));
  } catch {
    /* noop */
  }
}

/** Fecha local de hoy en formato YYYY-MM-DD. */
function hoyLocal(): string {
  return new Date().toLocaleDateString("en-CA");
}

export function descuentoAplica(descuento: Descuento, producto: Producto): boolean {
  const hoy = hoyLocal();
  if (!descuento.activo) return false;
  if (hoy < descuento.fechaInicio || hoy > descuento.fechaFin) return false;
  if (descuento.alcance === "todos") return true;
  // Ojo: sin categoría elegida no debe alcanzar a los productos sin categoría.
  if (descuento.alcance === "categoria") {
    return Boolean(descuento.categoriaId) && descuento.categoriaId === producto.categoriaId;
  }
  return descuento.productoIds.includes(producto.id);
}

export function ahorroDe(descuento: Descuento, precio: number): number {
  const ahorro =
    descuento.tipo === "porcentaje"
      ? Math.round((precio * descuento.valor) / 100)
      : descuento.valor;
  return Math.max(0, Math.min(ahorro, precio));
}

export function precioConDescuento(producto: Producto, descuentos: Descuento[]): number {
  const aplicables = descuentos.filter((d) => descuentoAplica(d, producto));
  if (aplicables.length === 0) return producto.precio;
  const mejor = aplicables.reduce((best, d) =>
    ahorroDe(d, producto.precio) > ahorroDe(best, producto.precio) ? d : best,
  );
  return Math.max(0, producto.precio - ahorroDe(mejor, producto.precio));
}

export function textoDescuento(descuento: Descuento): string {
  return descuento.tipo === "porcentaje"
    ? `${descuento.valor}%`
    : `$${descuento.valor.toLocaleString("es-AR")}`;
}

type Ctx = {
  ready: boolean;
  db: DB;
  negocio: Negocio;
  categorias: Categoria[];
  productos: Producto[];
  clientes: Cliente[];
  descuentos: Descuento[];
  promos: Promo[];
  pedidos: Pedido[];
  gastos: Gasto[];
  usuario: Usuario | null;
  carrito: ItemCarrito[];
  cupon: Promo | null;
  cantidadCarrito: number;
  subtotal: number;
  descuento: number;
  envio: (entrega: "envio" | "retiro") => number;
  total: (entrega: "envio" | "retiro") => number;
  productoPorSlug: (slug: string) => Producto | undefined;
  categoriaPorId: (id: string) => Categoria | undefined;
  descuentoDe: (p: Producto) => Descuento | undefined;
  precioFinal: (p: Producto) => number;
  agregar: (p: Producto, cantidad?: number) => void;
  cambiarCantidad: (id: string, cantidad: number) => void;
  quitar: (id: string) => void;
  vaciar: () => void;
  aplicarCupon: (codigo: string) => { ok: boolean; mensaje: string };
  quitarCupon: () => void;
  ingresar: (
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; mensaje: string; usuario?: Usuario }>;
  registrar: (nombre: string, email: string, password: string) => Promise<{ ok: boolean; mensaje: string }>;
  cambiarClave: (actual: string, nueva: string) => Promise<{ ok: boolean; mensaje: string }>;
  salir: () => Promise<void>;
  crearPedido: (cliente: Pedido["cliente"]) => Promise<Pedido>;
  cambiarEstado: (id: string, estado: EstadoPedido) => Promise<void>;
  guardarProducto: (p: Producto) => Promise<void>;
  borrarProducto: (id: string) => Promise<void>;
  actualizarStock: (id: string, stock: number) => Promise<void>;
  guardarCategoria: (c: Categoria) => Promise<void>;
  borrarCategoria: (id: string) => Promise<{ ok: boolean; mensaje: string }>;
  guardarCliente: (c: Cliente) => Promise<void>;
  borrarCliente: (id: string) => Promise<void>;
  guardarDescuento: (d: Descuento) => Promise<void>;
  borrarDescuento: (id: string) => Promise<void>;
  guardarNegocio: (n: Partial<Negocio>) => Promise<void>;
  agregarGasto: (g: Omit<Gasto, "id">) => Promise<void>;
  editarGasto: (id: string, g: Partial<Omit<Gasto, "id">>) => Promise<void>;
  borrarGasto: (id: string) => Promise<void>;
  guardarPromo: (p: Promo) => Promise<void>;
  borrarPromo: (codigo: string) => Promise<void>;
  resetearClave: (id: string) => Promise<{ ok: boolean; password?: string; mensaje?: string }>;
  reset: () => void;
};

const TikvaContext = createContext<Ctx | null>(null);

export function TikvaProvider({ children, backendUrl }: { children: ReactNode; backendUrl?: string }) {
  const [db, setDb] = useState<DB>(DB_VACIO);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carrito, setCarrito] = useState<ItemCarrito[]>(readCart);
  const [cupon, setCupon] = useState<Promo | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  /** Carga el estado completo desde la API (catálogo, pedidos, etc.). */
  const recargar = useCallback(async () => {
    if (typeof window === "undefined") return;
    try {
      const [negocio, categorias, productos, clientes, descuentos, promos, pedidos, gastos, usuarios] =
        await Promise.all([
          api("/negocio"),
          api("/categorias"),
          api("/productos"),
          api("/clientes"),
          api("/descuentos"),
          api("/promos"),
          api("/pedidos"),
          api("/gastos"),
          api("/usuarios"),
        ]);
      setDb((prev) => ({
        ...prev,
        negocio: negocio as Negocio,
        categorias: categorias as Categoria[],
        productos: productos as Producto[],
        clientes: clientes as Cliente[],
        descuentos: descuentos as Descuento[],
        promos: promos as Promo[],
        pedidos: pedidos as Pedido[],
        gastos: gastos as Gasto[],
        usuarios: usuarios as Usuario[],
      }));
    } catch (e: any) {
      console.warn("No se pudo conectar con el backend:", e?.message ?? e);
    }
  }, []);

  useEffect(() => {
    if (backendUrl) {
      (window as any).__BACKEND_URL = backendUrl.startsWith("/")
        ? window.location.origin + backendUrl
        : backendUrl;
    }
    void recargar();
    setReady(true);
  }, [backendUrl, recargar]);

  /** Restaura la sesión activa si hay un sessionId guardado. */
  useEffect(() => {
    const sid = readSession();
    if (!sid) return;
    (window as any).__BACKEND_SESSION = sid;
    void (async () => {
      try {
        const body = await api("/auth/me");
        if (body?.ok && body.usuario) {
          setUsuario(body.usuario as Usuario);
          setSessionId(sid);
        } else {
          writeSession(null);
        }
      } catch {
        writeSession(null);
      }
    })();
  }, []);

  useEffect(() => {
    if (ready) writeCart(carrito);
  }, [carrito, ready]);

  const subtotal = useMemo(
    () => carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0),
    [carrito],
  );
  const descuento = useMemo(
    () => (cupon ? Math.round((subtotal * cupon.porcentaje) / 100) : 0),
    [cupon, subtotal],
  );

  const envio = useCallback(
    (entrega: "envio" | "retiro") => {
      if (entrega === "retiro" || subtotal === 0) return 0;
      return subtotal - descuento >= db.negocio.envioGratisDesde ? 0 : db.negocio.envioCosto;
    },
    [db.negocio.envioCosto, db.negocio.envioGratisDesde, descuento, subtotal],
  );

  const total = useCallback(
    (entrega: "envio" | "retiro") => subtotal - descuento + envio(entrega),
    [subtotal, descuento, envio],
  );

  const descuentoDe = useCallback(
    (p: Producto) => {
      const aplicables = db.descuentos.filter((d) => descuentoAplica(d, p));
      if (aplicables.length === 0) return undefined;
      return aplicables.reduce((best, d) =>
        ahorroDe(d, p.precio) > ahorroDe(best, p.precio) ? d : best,
      );
    },
    [db.descuentos],
  );

  const precioFinal = useCallback(
    (p: Producto) => precioConDescuento(p, db.descuentos),
    [db.descuentos],
  );

  const agregar = useCallback(
    (p: Producto, cantidad = 1) => {
      const precio = precioFinal(p);
      setCarrito((prev) => {
        const existe = prev.find((i) => i.id === p.id);
        if (existe) {
          return prev.map((i) =>
            i.id === p.id
              ? { ...i, cantidad: Math.min(i.cantidad + cantidad, p.stock), precio }
              : i,
          );
        }
        return [...prev, { id: p.id, nombre: p.nombre, precio, cantidad }];
      });
    },
    [precioFinal],
  );

  const cambiarCantidad = useCallback((id: string, cantidad: number) => {
    setCarrito((prev) =>
      prev.map((i) => (i.id === id ? { ...i, cantidad } : i)).filter((i) => i.cantidad > 0),
    );
  }, []);

  const quitar = useCallback((id: string) => {
    setCarrito((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const vaciar = useCallback(() => {
    setCarrito([]);
    setCupon(null);
  }, []);

  const aplicarCupon = useCallback(
    (codigo: string) => {
      const found = db.promos.find(
        (p) => p.codigo.toLowerCase() === codigo.trim().toLowerCase() && p.activa,
      );
      if (!found) return { ok: false, mensaje: "Ese código no existe o no está vigente." };
      setCupon(found);
      return { ok: true, mensaje: `Listo: ${found.descripcion}.` };
    },
    [db.promos],
  );

  const ingresar = useCallback(async (email: string, password: string) => {
    try {
      const body = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (!body.ok) return { ok: false, mensaje: body.mensaje };
      setUsuario(body.usuario);
      setSessionId(body.sessionId);
      (window as any).__BACKEND_SESSION = body.sessionId;
      writeSession(body.sessionId);
      return { ok: true, mensaje: body.mensaje, usuario: body.usuario };
    } catch (e: any) {
      return { ok: false, mensaje: e?.message ?? "Error al iniciar sesión" };
    }
  }, []);

  const registrar = useCallback(async (nombre: string, email: string, password: string) => {
    try {
      const body = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({ nombre, email, password }),
      });
      if (!body.ok) return { ok: false, mensaje: body.mensaje };
      setUsuario(body.usuario);
      setSessionId(body.sessionId);
      (window as any).__BACKEND_SESSION = body.sessionId;
      writeSession(body.sessionId);
      return { ok: true, mensaje: body.mensaje };
    } catch (e: any) {
      return { ok: false, mensaje: e?.message ?? "Error al crear la cuenta" };
    }
  }, []);

  /** Cambia la contraseña de la persona que tiene la sesión abierta. */
  const cambiarClave = useCallback(async (actual: string, nueva: string) => {
    try {
      const body = await api("/auth/password", {
        method: "PATCH",
        body: JSON.stringify({ actual, nueva }),
      });
      return { ok: true, mensaje: String(body?.mensaje ?? "Contraseña actualizada.") };
    } catch (e: any) {
      return { ok: false, mensaje: e?.message ?? "No se pudo cambiar la contraseña" };
    }
  }, []);

  const resetearClave = useCallback(async (id: string) => {
    try {
      const body = await api(`/usuarios/${id}/reset-password`, {
        method: "POST",
      });
      return { ok: true, password: body.password, mensaje: String(body?.mensaje ?? "Contraseña actualizada.") };
    } catch (e: any) {
      return { ok: false, mensaje: e?.message ?? "No se pudo cambiar la contraseña" };
    }
  }, []);

  const salir = useCallback(async () => {
    try {
      await api("/auth/logout", { method: "POST" });
    } catch { /* noop */ }
    setUsuario(null);
    setSessionId(null);
    (window as any).__BACKEND_SESSION = undefined;
    writeSession(null);
  }, []);

  /** Envía la mutación a la API y refresca el estado local desde la DB. */
  const mutar = useCallback(
    async (fn: () => Promise<unknown>) => {
      await fn();
      await recargar();
    },
    [recargar],
  );

  const crearPedido = useCallback(
    async (cliente: Pedido["cliente"]) => {
      const created = await api("/pedidos", {
        method: "POST",
        body: JSON.stringify({
          cliente,
          items: carrito,
          subtotal,
          descuento,
          envio: envio(cliente.entrega),
          total: total(cliente.entrega),
          usuarioId: usuario?.id ?? null,
        }),
      });
      await recargar();
      setCarrito([]);
      setCupon(null);
      return created as unknown as Pedido;
    },
    [carrito, descuento, envio, total, usuario, recargar],
  );

  const cambiarEstado = useCallback(
    (id: string, estado: EstadoPedido) =>
      mutar(() =>
        api(`/pedidos/${id}/estado`, {
          method: "PATCH",
          body: JSON.stringify({ estado }),
        }),
      ),
    [mutar],
  );

  const guardarProducto = useCallback(
    (p: Producto) => mutar(() => api("/productos", { method: "POST", body: JSON.stringify(p) })),
    [mutar],
  );

  const borrarProducto = useCallback(
    (id: string) => mutar(() => api(`/productos/${id}`, { method: "DELETE" })),
    [mutar],
  );

  const actualizarStock = useCallback(
    (id: string, stock: number) =>
      mutar(() =>
        api(`/productos/${id}/stock`, {
          method: "PATCH",
          body: JSON.stringify({ stock }),
        }),
      ),
    [mutar],
  );

  const guardarCategoria = useCallback(
    (c: Categoria) => mutar(() => api("/categorias", { method: "POST", body: JSON.stringify(c) })),
    [mutar],
  );

  const borrarCategoria = useCallback(
    async (id: string) => {
      const body = await api(`/categorias/${id}`, { method: "DELETE" });
      await recargar();
      return body as { ok: boolean; mensaje: string };
    },
    [recargar],
  );

  const guardarCliente = useCallback(
    (c: Cliente) => mutar(() => api("/clientes", { method: "POST", body: JSON.stringify(c) })),
    [mutar],
  );

  const borrarCliente = useCallback(
    (id: string) => mutar(() => api(`/clientes/${id}`, { method: "DELETE" })),
    [mutar],
  );

  const guardarDescuento = useCallback(
    (d: Descuento) => mutar(() => api("/descuentos", { method: "POST", body: JSON.stringify(d) })),
    [mutar],
  );

  const borrarDescuento = useCallback(
    (id: string) => mutar(() => api(`/descuentos/${id}`, { method: "DELETE" })),
    [mutar],
  );

  const guardarNegocio = useCallback(
    (n: Partial<Negocio>) => mutar(() => api("/negocio", { method: "PATCH", body: JSON.stringify(n) })),
    [mutar],
  );

  const agregarGasto = useCallback(
    (g: Omit<Gasto, "id">) => mutar(() => api("/gastos", { method: "POST", body: JSON.stringify(g) })),
    [mutar],
  );

  const editarGasto = useCallback(
    (id: string, g: Partial<Omit<Gasto, "id">>) =>
      mutar(() => api(`/gastos/${id}`, { method: "PATCH", body: JSON.stringify(g) })),
    [mutar],
  );

  const borrarGasto = useCallback(
    (id: string) => mutar(() => api(`/gastos/${id}`, { method: "DELETE" })),
    [mutar],
  );

  const guardarPromo = useCallback(
    (p: Promo) => mutar(() => api("/promos", { method: "POST", body: JSON.stringify(p) })),
    [mutar],
  );

  const borrarPromo = useCallback(
    (codigo: string) =>
      mutar(() => api(`/promos/${encodeURIComponent(codigo)}`, { method: "DELETE" })),
    [mutar],
  );

  const reset = useCallback(() => {
    setCarrito([]);
    setCupon(null);
  }, []);

  const value: Ctx = {
    ready,
    db,
    negocio: db.negocio,
    categorias: db.categorias,
    productos: db.productos,
    clientes: db.clientes,
    descuentos: db.descuentos,
    promos: db.promos,
    pedidos: db.pedidos,
    gastos: db.gastos,
    usuario,
    carrito,
    cupon,
    cantidadCarrito: carrito.reduce((a, i) => a + i.cantidad, 0),
    subtotal,
    descuento,
    envio,
    total,
    productoPorSlug: (slug) => db.productos.find((p) => p.slug === slug),
    categoriaPorId: (id) => db.categorias.find((c) => c.id === id),
    descuentoDe,
    precioFinal,
    agregar,
    cambiarCantidad,
    quitar,
    vaciar,
    aplicarCupon,
    quitarCupon: () => setCupon(null),
    ingresar,
    registrar,
    cambiarClave,
    resetearClave,
    salir,
    crearPedido,
    cambiarEstado,
    guardarProducto,
    borrarProducto,
    actualizarStock,
    guardarCategoria,
    borrarCategoria,
    guardarCliente,
    borrarCliente,
    guardarDescuento,
    borrarDescuento,
    guardarNegocio,
    agregarGasto,
    editarGasto,
    borrarGasto,
    guardarPromo,
    borrarPromo,
    reset,
  };

  return <TikvaContext.Provider value={value}>{children}</TikvaContext.Provider>;
}



/** Crear o actualizar un cliente a partir de un pedido o registro. */
function upsertCliente(clientes: Cliente[], nuevo: Cliente): Cliente[] {
  const existente = clientes.find(
    (c) =>
      c.email.toLowerCase() === nuevo.email.toLowerCase() ||
      (nuevo.telefono && c.telefono === nuevo.telefono),
  );
  if (existente) {
    return clientes.map((c) =>
      c.id === existente.id
        ? {
            ...c,
            nombre: nuevo.nombre || c.nombre,
            email: nuevo.email || c.email,
            telefono: nuevo.telefono || c.telefono,
            direccion: nuevo.direccion || c.direccion,
            notas: nuevo.notas || c.notas,
          }
        : c,
    );
  }
  return [...clientes, nuevo];
}

export function useTikva() {
  const ctx = useContext(TikvaContext);
  if (!ctx) throw new Error("useTikva debe usarse dentro de TikvaProvider");
  return ctx;
}

export function mensajeWhatsapp(pedido: Pedido, negocio: Negocio) {
  const lineas = [
    `Hola ${negocio.nombre}! Quiero confirmar mi pedido *${pedido.id}*`,
    "",
    ...pedido.items.map((i) => `• ${i.cantidad} x ${i.nombre} — $${i.precio * i.cantidad}`),
    "",
    `Subtotal: $${pedido.subtotal}`,
    pedido.descuento ? `Descuento: -$${pedido.descuento}` : null,
    `${pedido.cliente.entrega === "envio" ? `Envío: $${pedido.envio}` : "Retiro en persona"}`,
    `*Total: $${pedido.total}*`,
    "",
    `Nombre: ${pedido.cliente.nombre}`,
    `Teléfono: ${pedido.cliente.telefono}`,
    pedido.cliente.entrega === "envio" ? `Dirección: ${pedido.cliente.direccion}` : null,
    pedido.cliente.notas ? `Notas: ${pedido.cliente.notas}` : null,
  ].filter(Boolean);
  return lineas.join("\n");
}

/** Número de respaldo por si el panel todavía no tiene cargado el WhatsApp. */
export const WHATSAPP_FALLBACK = "5491156582298";

/**
 * Deja solo los dígitos del número y, si no queda nada usable, devuelve el de
 * respaldo. Sin esto un WhatsApp vacío generaba `https://wa.me/?text=...`,
 * que WhatsApp rechaza y por lo tanto no abría ningún chat.
 */
export function numeroWhatsapp(numero?: string | null): string {
  const limpio = String(numero ?? "").replace(/\D/g, "");
  return limpio.length >= 8 ? limpio : WHATSAPP_FALLBACK;
}

/** Link de WhatsApp listo para usar en un `href`, con mensaje ya escrito. */
export function linkWhatsapp(numero: string, texto?: string) {
  const base = `https://wa.me/${numeroWhatsapp(numero)}`;
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base;
}

/**
 * Mensaje prellenado para escribir por un producto puntual: al tocar el botón
 * de WhatsApp desde el detalle ya viaja el nombre, la cantidad y el precio.
 */
export function mensajeProducto(
  producto: Producto,
  negocio: Negocio,
  opciones?: { cantidad?: number; precio?: number; url?: string; avisoStock?: boolean },
) {
  const cantidad = opciones?.cantidad ?? 1;
  const precio = opciones?.precio ?? producto.precio;
  const lineas = opciones?.avisoStock
    ? [
        `Hola ${negocio.nombre}! Quiero que me avisen cuando vuelva *${producto.nombre}*.`,
        "",
        "¿Me confirmás cuándo llega el próximo lote?",
      ]
    : [
        `Hola ${negocio.nombre}! Me interesa este producto:`,
        "",
        `• ${cantidad} x ${producto.nombre}`,
        `Precio: $${precio.toLocaleString("es-AR")}`,
        opciones?.url ? `Link: ${opciones.url}` : null,
        "",
        "¿Está disponible?",
      ];
  return lineas.filter(Boolean).join("\n");
}
