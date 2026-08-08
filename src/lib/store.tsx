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

export type Rol = "admin" | "cliente";

export type Usuario = {
  id: string;
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
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
  categoria: string;
  imagen: string;
  destacado: boolean;
  activo: boolean;
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
  usuarios: Usuario[];
  productos: Producto[];
  promos: Promo[];
  pedidos: Pedido[];
  gastos: Gasto[];
};

const KEY = "tikva-db-v1";
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

type Ctx = {
  ready: boolean;
  db: DB;
  negocio: Negocio;
  productos: Producto[];
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
  agregar: (p: Producto, cantidad?: number) => void;
  cambiarCantidad: (id: string, cantidad: number) => void
  quitar: (id: string) => void;
  vaciar: () => void;
  aplicarCupon: (codigo: string) => { ok: boolean; mensaje: string };
  quitarCupon: () => void;
  ingresar: (email: string, password: string) => { ok: boolean; mensaje: string; usuario?: Usuario };
  registrar: (
    nombre: string,
    email: string,
    password: string,
  ) => { ok: boolean; mensaje: string };
  salir: () => void;
  crearPedido: (cliente: Pedido["cliente"]) => Pedido;
  cambiarEstado: (id: string, estado: EstadoPedido) => void;
  guardarProducto: (p: Producto) => void;
  actualizarStock: (id: string, stock: number) => void;
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

  const agregar = useCallback((p: Producto, cantidad = 1) => {
    setCarrito((prev) => {
      const existe = prev.find((i) => i.id === p.id);
      if (existe) {
        return prev.map((i) =>
          i.id === p.id ? { ...i, cantidad: Math.min(i.cantidad + cantidad, p.stock) } : i,
        );
      }
      return [...prev, { id: p.id, nombre: p.nombre, precio: p.precio, cantidad }];
    });
  }, []);

  const cambiarCantidad = useCallback((id: string, cantidad: number) => {
    setCarrito((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, cantidad } : i))
        .filter((i) => i.cantidad > 0),
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
      setDb((prev) => ({ ...prev, usuarios: [...prev.usuarios, nuevo] }));
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
    setDb((prev) => ({
      ...prev,
      productos: prev.productos.some((x) => x.id === p.id)
        ? prev.productos.map((x) => (x.id === p.id ? p : x))
        : [...prev.productos, p],
    }));
  }, []);

  const actualizarStock = useCallback((id: string, stock: number) => {
    setDb((prev) => ({
      ...prev,
      productos: prev.productos.map((p) => (p.id === id ? { ...p, stock } : p)),
    }));
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
    productos: db.productos,
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
    actualizarStock,
    agregarGasto,
    borrarGasto,
    guardarPromo,
    reset,
  };

  return <TikvaContext.Provider value={value}>{children}</TikvaContext.Provider>;
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
