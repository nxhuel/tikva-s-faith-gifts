import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import seed from "@/data/db.json";
import { slugify } from "@/lib/images";

export type Rol = "admin" | "cliente";

export type Usuario = {
  id: string;
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
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
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string; // YYYY-MM-DD
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

export type Negocio = typeof seed.negocio;

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

const KEY = "tikva-db-v2";
const SESSION_KEY = "tikva-session-v1";
const CART_KEY = "tikva-cart-v1";

const baseDB = seed as unknown as DB;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
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
  if (descuento.alcance === "categoria") return descuento.categoriaId === producto.categoriaId;
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
  ) => { ok: boolean; mensaje: string; usuario?: Usuario };
  registrar: (nombre: string, email: string, password: string) => { ok: boolean; mensaje: string };
  salir: () => void;
  crearPedido: (cliente: Pedido["cliente"]) => Pedido;
  cambiarEstado: (id: string, estado: EstadoPedido) => void;
  guardarProducto: (p: Producto) => void;
  borrarProducto: (id: string) => void;
  actualizarStock: (id: string, stock: number) => void;
  guardarCategoria: (c: Categoria) => void;
  borrarCategoria: (id: string) => { ok: boolean; mensaje: string };
  guardarCliente: (c: Cliente) => void;
  borrarCliente: (id: string) => void;
  guardarDescuento: (d: Descuento) => void;
  borrarDescuento: (id: string) => void;
  guardarNegocio: (n: Partial<Negocio>) => void;
  agregarGasto: (g: Omit<Gasto, "id">) => void;
  borrarGasto: (id: string) => void;
  guardarPromo: (p: Promo) => void;
  reset: () => void;
};

const TikvaContext = createContext<Ctx | null>(null);

export function TikvaProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DB>(baseDB);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [cupon, setCupon] = useState<Promo | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDb(read<DB>(KEY, baseDB));
    setUsuario(read<Usuario | null>(SESSION_KEY, null));
    setCarrito(read<ItemCarrito[]>(CART_KEY, []));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) write(KEY, db);
  }, [db, ready]);
  useEffect(() => {
    if (ready) write(CART_KEY, carrito);
  }, [carrito, ready]);
  useEffect(() => {
    if (ready) write(SESSION_KEY, usuario);
  }, [usuario, ready]);

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

  const ingresar = useCallback(
    (email: string, password: string) => {
      const found = db.usuarios.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
      );
      if (!found) return { ok: false, mensaje: "Usuario o contraseña incorrectos." };
      setUsuario(found);
      return { ok: true, mensaje: `Bienvenida, ${found.nombre}.`, usuario: found };
    },
    [db.usuarios],
  );

  const registrar = useCallback(
    (nombre: string, email: string, password: string) => {
      const existe = db.usuarios.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (existe) return { ok: false, mensaje: "Ya existe una cuenta con ese email." };
      const nuevo: Usuario = {
        id: `u-${Date.now()}`,
        nombre: nombre.trim(),
        email: email.trim(),
        password,
        rol: "cliente",
      };
      setDb((prev) => ({
        ...prev,
        usuarios: [...prev.usuarios, nuevo],
        clientes: upsertCliente(prev.clientes, {
          id: `c-${Date.now()}`,
          nombre: nombre.trim(),
          email: email.trim(),
          telefono: "",
          direccion: "",
          notas: "",
          fechaAlta: new Date().toISOString(),
        }),
      }));
      setUsuario(nuevo);
      return { ok: true, mensaje: "Cuenta creada." };
    },
    [db.usuarios],
  );

  const salir = useCallback(() => setUsuario(null), []);

  const crearPedido = useCallback(
    (cliente: Pedido["cliente"]) => {
      const pedido: Pedido = {
        id: `TK-${1044 + db.pedidos.length}`,
        fecha: new Date().toISOString(),
        usuarioId: usuario?.id ?? null,
        cliente,
        items: carrito,
        subtotal,
        descuento,
        envio: envio(cliente.entrega),
        total: total(cliente.entrega),
        estado: "nuevo",
      };
      setDb((prev) => ({
        ...prev,
        pedidos: [pedido, ...prev.pedidos],
        productos: prev.productos.map((p) => {
          const item = carrito.find((i) => i.id === p.id);
          return item ? { ...p, stock: Math.max(0, p.stock - item.cantidad) } : p;
        }),
        clientes: upsertCliente(prev.clientes, {
          id: `c-${Date.now()}`,
          nombre: cliente.nombre,
          email: cliente.email,
          telefono: cliente.telefono,
          direccion: cliente.direccion,
          notas: cliente.notas,
          fechaAlta: new Date().toISOString(),
        }),
      }));
      return pedido;
    },
    [carrito, db.pedidos.length, descuento, envio, subtotal, total, usuario],
  );

  const cambiarEstado = useCallback((id: string, estado: EstadoPedido) => {
    setDb((prev) => ({
      ...prev,
      pedidos: prev.pedidos.map((p) => (p.id === id ? { ...p, estado } : p)),
    }));
  }, []);

  const guardarProducto = useCallback((p: Producto) => {
    setDb((prev) => {
      const existe = prev.productos.some((x) => x.id === p.id);
      const id = existe ? p.id : p.id || `p-${Date.now()}`;
      let slug = slugify(p.nombre) || `producto-${id}`;
      const ocupado = prev.productos.some((x) => x.slug === slug && x.id !== id);
      if (ocupado) slug = `${slug}-${id}`;
      const limpio: Producto = { ...p, id, slug };
      return {
        ...prev,
        productos: existe
          ? prev.productos.map((x) => (x.id === id ? limpio : x))
          : [...prev.productos, limpio],
      };
    });
  }, []);

  const borrarProducto = useCallback((id: string) => {
    setDb((prev) => ({ ...prev, productos: prev.productos.filter((p) => p.id !== id) }));
  }, []);

  const actualizarStock = useCallback((id: string, stock: number) => {
    setDb((prev) => ({
      ...prev,
      productos: prev.productos.map((p) => (p.id === id ? { ...p, stock } : p)),
    }));
  }, []);

  const guardarCategoria = useCallback((c: Categoria) => {
    setDb((prev) => {
      const existe = prev.categorias.some((x) => x.id === c.id);
      const id = existe ? c.id : c.id || `cat-${Date.now()}`;
      return {
        ...prev,
        categorias: existe
          ? prev.categorias.map((x) => (x.id === id ? { ...c, id } : x))
          : [...prev.categorias, { ...c, id }],
      };
    });
  }, []);

  const borrarCategoria = useCallback(
    (id: string) => {
      const enUso = db.productos.some((p) => p.categoriaId === id);
      if (enUso) {
        return {
          ok: false,
          mensaje: "No se puede borrar: hay productos asignados a esta categoría.",
        };
      }
      setDb((prev) => ({
        ...prev,
        categorias: prev.categorias.filter((c) => c.id !== id),
        descuentos: prev.descuentos.map((d) =>
          d.categoriaId === id ? { ...d, categoriaId: null } : d,
        ),
      }));
      return { ok: true, mensaje: "Categoría eliminada." };
    },
    [db.productos],
  );

  const guardarCliente = useCallback((c: Cliente) => {
    setDb((prev) => {
      const existe = prev.clientes.some((x) => x.id === c.id);
      const id = existe ? c.id : c.id || `c-${Date.now()}`;
      return {
        ...prev,
        clientes: existe
          ? prev.clientes.map((x) => (x.id === id ? { ...c, id } : x))
          : [...prev.clientes, { ...c, id }],
      };
    });
  }, []);

  const borrarCliente = useCallback((id: string) => {
    setDb((prev) => ({ ...prev, clientes: prev.clientes.filter((c) => c.id !== id) }));
  }, []);

  const guardarDescuento = useCallback((d: Descuento) => {
    setDb((prev) => {
      const existe = prev.descuentos.some((x) => x.id === d.id);
      const id = existe ? d.id : d.id || `d-${Date.now()}`;
      return {
        ...prev,
        descuentos: existe
          ? prev.descuentos.map((x) => (x.id === id ? { ...d, id } : x))
          : [...prev.descuentos, { ...d, id }],
      };
    });
  }, []);

  const borrarDescuento = useCallback((id: string) => {
    setDb((prev) => ({ ...prev, descuentos: prev.descuentos.filter((d) => d.id !== id) }));
  }, []);

  const guardarNegocio = useCallback((n: Partial<Negocio>) => {
    setDb((prev) => ({ ...prev, negocio: { ...prev.negocio, ...n } }));
  }, []);

  const agregarGasto = useCallback((g: Omit<Gasto, "id">) => {
    setDb((prev) => ({ ...prev, gastos: [{ ...g, id: `g-${Date.now()}` }, ...prev.gastos] }));
  }, []);

  const borrarGasto = useCallback((id: string) => {
    setDb((prev) => ({ ...prev, gastos: prev.gastos.filter((g) => g.id !== id) }));
  }, []);

  const guardarPromo = useCallback((promo: Promo) => {
    setDb((prev) => ({
      ...prev,
      promos: prev.promos.some((p) => p.codigo === promo.codigo)
        ? prev.promos.map((p) => (p.codigo === promo.codigo ? promo : p))
        : [...prev.promos, promo],
    }));
  }, []);

  const reset = useCallback(() => {
    setDb(baseDB);
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
    borrarGasto,
    guardarPromo,
    reset,
  };

  return <TikvaContext.Provider value={value}>{children}</TikvaContext.Provider>;
}

/** Actualiza o crea un cliente a partir de un pedido o registro. */
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

export function linkWhatsapp(numero: string, texto: string) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}
