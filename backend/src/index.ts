import cors from "cors";
import express from "express";
import helmet from "helmet";
import postgres from "postgres";

import { inicializarEsquema } from "./init.js";
import { cloudinaryConfigurado, cloudinaryPublico, firmarParametros } from "./cloudinary.js";
import type { Request, Response, NextFunction } from "express";

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

/**
 * Express 4 no captura los rechazos de los handlers `async`: una query que
 * falla deja la request colgada y, peor, el proceso se apaga por unhandled
 * rejection (eso pasaba al crear un producto con fotos o detalles).
 * Este wrapper deriva cualquier error al middleware de errores.
 */
function envolver<T extends (...args: any[]) => any>(handler: T): T {
  if (typeof handler !== "function" || handler.length >= 4) return handler;
  const envuelto = (req: any, res: any, next: any) => {
    try {
      const result = handler(req, res, next);
      if (result && typeof result.then === "function") void result.catch(next);
    } catch (error) {
      next(error);
    }
  };
  return envuelto as unknown as T;
}

for (const metodo of ["get", "post", "patch", "put", "delete", "use"] as const) {
  const original = (app as any)[metodo].bind(app);
  (app as any)[metodo] = (...args: any[]) =>
    original(...args.map((arg) => (typeof arg === "function" ? envolver(arg) : arg)));
}

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(cors({ origin: true }));
app.use(express.json({ limit: "1mb" }));

function makeClient() {
  return postgres({
    host: process.env.DB_HOST ?? "db",
    port: Number(process.env.DB_PORT ?? 5432),
    database: process.env.DB_NAME ?? "tikva",
    user: process.env.DB_USER ?? "tikva",
    password: process.env.DB_PASSWORD ?? "tikva",
    max: Number(process.env.DB_POOL ?? 10),
  });
}

/**
 * El panel manda `id: ""` cuando el registro es nuevo. Un string vacío NO lo
 * captura `??`, así que antes se guardaban filas con id vacío (y encima el
 * upsert hacía que la segunda creación pisara la primera). Acá se genera uno.
 */
function idNuevo(valor: unknown): string {
  const id = String(valor ?? "").trim();
  return id || crypto.randomUUID().slice(0, 8);
}

/** Un `<select>` sin elegir llega como "": en la base eso es NULL, no una FK rota. */
function idONulo(valor: unknown): string | null {
  const id = String(valor ?? "").trim();
  return id || null;
}

/** Las columnas JSONB pueden llegar como string según el driver: se normalizan. */
function parseJson<T>(value: unknown, fallback: T): T {
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return (value ?? fallback) as T;
}

// Migración al arrancar: crea esquema, negocio y usuario admin si no existen.
await inicializarEsquema();

// ---------------- sesiones (solo para mantener la demo simple) ----------------
app.use(async (req: Request, _res: Response, next: NextFunction) => {
  const sid = (req.headers["x-session"] as string | undefined) ?? (req.headers["x-session-id"] as string | undefined);
  if (sid) {
    const client = makeClient();
    try {
      const [s] = await client<{ usuario_id: string }[]>`SELECT usuario_id FROM sesiones WHERE id = ${sid} AND expires_at > now()`;
      if (s) (req as any).usuarioId = s.usuario_id;
    } finally {
      await client.end();
    }
  }
  next();
});

// ---------------- negocio ----------------
app.get("/api/negocio", async (_req, res) => {
  const client = makeClient();
  try {
    const [row] = await client<{ nombre: string; rubro: string; instagram: string; whatsapp: string; whatsapp_visible: string; envio_costo: number; envio_gratis_desde: number }[]>`SELECT * FROM negocio WHERE id = 1`;
    if (!row) return res.status(404).json({ ok: false, mensaje: "Negocio no configurado" });
    res.json({
      nombre: row.nombre,
      rubro: row.rubro,
      instagram: row.instagram,
      whatsapp: row.whatsapp,
      whatsappVisible: row.whatsapp_visible,
      envioCosto: row.envio_costo,
      envioGratisDesde: row.envio_gratis_desde,
    });
  } finally {
    await client.end();
  }
});

app.patch("/api/negocio", async (req, res) => {
  const body = req.body as {
    nombre?: string;
    whatsapp?: string;
    whatsappVisible?: string;
    instagram?: string;
    envioCosto?: number;
    envioGratisDesde?: number;
  };
  const client = makeClient();
  try {
    const nombre = body.nombre ?? null;
    const whatsapp = body.whatsapp ?? null;
    const whatsappVisible = body.whatsappVisible ?? null;
    const instagram = body.instagram ?? null;
    const envioCosto = body.envioCosto ?? null;
    const envioGratisDesde = body.envioGratisDesde ?? null;
    const [row] = await client<{ nombre: string; rubro: string; instagram: string; whatsapp: string; whatsapp_visible: string; envio_costo: number; envio_gratis_desde: number }[]>`
      UPDATE negocio SET
        nombre = COALESCE(NULLIF(${nombre}, ''), nombre),
        whatsapp = COALESCE(${whatsapp}, whatsapp),
        whatsapp_visible = COALESCE(${whatsappVisible}, whatsapp_visible),
        instagram = COALESCE(${instagram}, instagram),
        envio_costo = COALESCE(${envioCosto}, envio_costo)::int,
        envio_gratis_desde = COALESCE(${envioGratisDesde}, envio_gratis_desde)::int
      WHERE id = 1
      RETURNING *
    `;
    if (!row) return res.status(404).json({ ok: false, mensaje: "Negocio no encontrado" });
    res.json({
      nombre: row.nombre,
      whatsapp: row.whatsapp,
      whatsappVisible: row.whatsapp_visible,
      instagram: row.instagram,
      envioCosto: row.envio_costo,
      envioGratisDesde: row.envio_gratis_desde,
    });
  } finally {
    await client.end();
  }
});

// ---------------- categorias ----------------
app.get("/api/categorias", async (_req, res) => {
  const client = makeClient();
  try {
    const rows = await client<{ id: string; nombre: string; descripcion: string | null }[]>`SELECT * FROM categorias ORDER BY nombre`;
    res.json(rows.map((r) => ({ id: r.id, nombre: r.nombre, descripcion: r.descripcion ?? undefined })));
  } finally {
    await client.end();
  }
});

app.post("/api/categorias", async (req, res) => {
  const body = req.body as { id?: string; nombre: string; descripcion?: string };
  if (!body.nombre || body.nombre.trim().length < 2) return res.status(400).json({ ok: false, mensaje: "Nombre inválido" });
  const client = makeClient();
  try {
    const id = idNuevo(body.id);
    const [row] = await client<{ id: string; nombre: string; descripcion: string | null }[]>`
      INSERT INTO categorias (id, nombre, descripcion)
      VALUES (${id}, ${body.nombre.trim()}, ${body.descripcion ?? null})
      ON CONFLICT (id) DO UPDATE SET nombre = EXCLUDED.nombre, descripcion = EXCLUDED.descripcion
      RETURNING *
    `;
    res.status(201).json({ id: row.id, nombre: row.nombre, descripcion: row.descripcion ?? undefined });
  } finally {
    await client.end();
  }
});

app.patch("/api/categorias/:id", async (req, res) => {
  const body = req.body as { nombre?: string; descripcion?: string };
  const client = makeClient();
  try {
    const [row] = await client<{ id: string; nombre: string; descripcion: string | null }[]>`
      UPDATE categorias
      SET nombre = COALESCE(NULLIF(${body.nombre ?? null}, ''), nombre),
          descripcion = COALESCE(${body.descripcion ?? null}, descripcion)
      WHERE id = ${req.params.id}
      RETURNING *
    `;
    if (!row) return res.status(404).json({ ok: false, mensaje: "Categoría no encontrada" });
    res.json({ id: row.id, nombre: row.nombre, descripcion: row.descripcion ?? undefined });
  } finally {
    await client.end();
  }
});

app.delete("/api/categorias/:id", async (req, res) => {
  const client = makeClient();
  try {
    const used = await client<{ c: number }[]>`SELECT count(*)::int AS c FROM productos WHERE categoria_id = ${req.params.id}`;
    if (used[0]?.c > 0) {
      return res.status(400).json({ ok: false, mensaje: "No se puede borrar: hay productos asignados" });
    }
    await client`DELETE FROM categorias WHERE id = ${req.params.id}`;
    await client`UPDATE descuentos SET categoria_id = NULL WHERE categoria_id = ${req.params.id}`;
    res.json({ ok: true, mensaje: "Categoría eliminada" });
  } finally {
    await client.end();
  }
});

// ---------------- productos ----------------
app.get("/api/productos", async (req, res) => {
  const activo = req.query.activo === "1";
  const client = makeClient();
  try {
    const rows = await client<{
      id: string;
      slug: string;
      nombre: string;
      resumen: string;
      descripcion: string;
      detalles: string[];
      precio: number;
      costo: number;
      stock: number;
      categoria_id: string | null;
      imagenes: string[];
      destacado: boolean;
      activo: boolean;
    }[]>`SELECT * FROM productos ${activo ? client`WHERE activo = true` : client``} ORDER BY destacado DESC, nombre`;
    res.json(
      rows.map((r) => ({
        id: r.id,
        slug: r.slug,
        nombre: r.nombre,
        resumen: r.resumen,
        descripcion: r.descripcion,
        detalles: parseJson<string[]>(r.detalles, []),
        precio: r.precio,
        costo: r.costo,
        stock: r.stock,
        categoriaId: r.categoria_id,
        imagenes: parseJson<string[]>(r.imagenes, []),
        destacado: r.destacado,
        activo: r.activo,
      })),
    );
  } finally {
    await client.end();
  }
});

app.get("/api/productos/:id", async (req, res) => {
  const client = makeClient();
  try {
    const [row] = await client<{
      id: string;
      slug: string;
      nombre: string;
      resumen: string;
      descripcion: string;
      detalles: string[];
      precio: number;
      costo: number;
      stock: number;
      categoria_id: string | null;
      imagenes: string[];
      destacado: boolean;
      activo: boolean;
    }[]>`SELECT * FROM productos WHERE id = ${req.params.id}`;
    if (!row) return res.status(404).json({ ok: false, mensaje: "Producto no encontrado" });
    res.json({
      id: row.id,
      slug: row.slug,
      nombre: row.nombre,
      resumen: row.resumen,
      descripcion: row.descripcion,
      detalles: parseJson<string[]>(row.detalles, []),
      precio: row.precio,
      costo: row.costo,
      stock: row.stock,
      categoriaId: row.categoria_id,
      imagenes: parseJson<string[]>(row.imagenes, []),
      destacado: row.destacado,
      activo: row.activo,
    });
  } finally {
    await client.end();
  }
});

app.get("/api/productos/slug/:slug", async (req, res) => {
  const client = makeClient();
  try {
    const [row] = await client<{
      id: string;
      slug: string;
      nombre: string;
      resumen: string;
      descripcion: string;
      detalles: string[];
      precio: number;
      costo: number;
      stock: number;
      categoria_id: string | null;
      imagenes: string[];
      destacado: boolean;
      activo: boolean;
    }[]>`SELECT * FROM productos WHERE slug = ${req.params.slug}`;
    if (!row) return res.status(404).json({ ok: false, mensaje: "Producto no encontrado" });
    res.json({
      id: row.id,
      slug: row.slug,
      nombre: row.nombre,
      resumen: row.resumen,
      descripcion: row.descripcion,
      detalles: parseJson<string[]>(row.detalles, []),
      precio: row.precio,
      costo: row.costo,
      stock: row.stock,
      categoriaId: row.categoria_id,
      imagenes: parseJson<string[]>(row.imagenes, []),
      destacado: row.destacado,
      activo: row.activo,
    });
  } finally {
    await client.end();
  }
});

app.post("/api/productos", async (req, res) => {
  const body = req.body as {
    id?: string;
    slug?: string;
    nombre?: string;
    resumen?: string;
    descripcion?: string;
    detalles?: string[];
    precio?: number;
    costo?: number;
    stock?: number;
    categoriaId?: string;
    imagenes?: string[];
    destacado?: boolean;
    activo?: boolean;
  };
  if (!body.nombre || body.nombre.trim().length < 2) return res.status(400).json({ ok: false, mensaje: "Nombre inválido" });
  if (!body.precio || body.precio <= 0) return res.status(400).json({ ok: false, mensaje: "Precio inválido" });

  const client = makeClient();
  try {
    const id = idNuevo(body.id);
    let slug = slugify(body.nombre) || `producto-${id}`;
    const exists = await client<{ c: number }[]>`SELECT count(*)::int AS c FROM productos WHERE slug = ${slug} AND id != ${id}`;
    if (exists[0]?.c > 0) slug = `${slug}-${id}`;

    const [row] = await client<{
      id: string;
      slug: string;
      nombre: string;
      resumen: string;
      descripcion: string;
      detalles: string[];
      precio: number;
      costo: number;
      stock: number;
      categoria_id: string | null;
      imagenes: string[];
      destacado: boolean;
      activo: boolean;
    }[]>`
      INSERT INTO productos
        (id, slug, nombre, resumen, descripcion, detalles, precio, costo, stock, categoria_id, imagenes, destacado, activo)
      VALUES
        (${id}, ${slug}, ${body.nombre.trim()}, ${body.resumen ?? ""}, ${body.descripcion ?? ""}, ${JSON.stringify(body.detalles ?? [])}::jsonb, ${body.precio}, ${body.costo ?? 0}, ${body.stock ?? 0}, ${idONulo(body.categoriaId)}, ${JSON.stringify(body.imagenes ?? [])}::jsonb, ${body.destacado ?? false}, ${body.activo ?? true})
      ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug, nombre = EXCLUDED.nombre, resumen = EXCLUDED.resumen, descripcion = EXCLUDED.descripcion,
        detalles = EXCLUDED.detalles, precio = EXCLUDED.precio, costo = EXCLUDED.costo, stock = EXCLUDED.stock,
        categoria_id = EXCLUDED.categoria_id, imagenes = EXCLUDED.imagenes, destacado = EXCLUDED.destacado, activo = EXCLUDED.activo
      RETURNING *
    `;
    res.status(201).json({
      id: row.id,
      slug: row.slug,
      nombre: row.nombre,
      resumen: row.resumen,
      descripcion: row.descripcion,
      detalles: parseJson<string[]>(row.detalles, []),
      precio: row.precio,
      costo: row.costo,
      stock: row.stock,
      categoriaId: row.categoria_id,
      imagenes: parseJson<string[]>(row.imagenes, []),
      destacado: row.destacado,
      activo: row.activo,
    });
  } finally {
    await client.end();
  }
});

app.patch("/api/productos/:id/stock", async (req, res) => {
  const { stock } = req.body as { stock: number };
  if (stock == null || stock < 0) return res.status(400).json({ ok: false, mensaje: "Stock inválido" });
  const client = makeClient();
  try {
    const [row] = await client<{ id: string; stock: number }[]>`UPDATE productos SET stock = ${stock}::int WHERE id = ${req.params.id} RETURNING id, stock`;
    if (!row) return res.status(404).json({ ok: false, mensaje: "Producto no encontrado" });
    res.json({ id: row.id, stock: row.stock });
  } finally {
    await client.end();
  }
});

app.delete("/api/productos/:id", async (req, res) => {
  const client = makeClient();
  try {
    const [row] = await client<{ id: string }[]>`DELETE FROM productos WHERE id = ${req.params.id} RETURNING id`;
    if (!row) return res.status(404).json({ ok: false, mensaje: "Producto no encontrado" });
    res.json({ ok: true, id: row.id });
  } finally {
    await client.end();
  }
});

// ---------------- clientes ----------------
app.get("/api/clientes", async (_req, res) => {
  const client = makeClient();
  try {
    const rows = await client<{
      id: string;
      nombre: string;
      email: string;
      telefono: string;
      direccion: string;
      notas: string;
      fecha_alta: Date;
    }[]>`SELECT * FROM clientes ORDER BY nombre`;
    res.json(
      rows.map((r) => ({
        id: r.id,
        nombre: r.nombre,
        email: r.email,
        telefono: r.telefono,
        direccion: r.direccion,
        notas: r.notas,
        fechaAlta: r.fecha_alta.toISOString(),
      })),
    );
  } finally {
    await client.end();
  }
});

app.post("/api/clientes", async (req, res) => {
  const body = req.body as { id?: string; nombre?: string; email?: string; telefono?: string; direccion?: string; notas?: string };
  if (!body.nombre || body.nombre.trim().length < 2) return res.status(400).json({ ok: false, mensaje: "Nombre inválido" });
  const client = makeClient();
  try {
    const id = idNuevo(body.id);
    const [row] = await client<{
      id: string;
      nombre: string;
      email: string;
      telefono: string;
      direccion: string;
      notas: string;
      fecha_alta: Date;
    }[]>`
      INSERT INTO clientes (id, nombre, email, telefono, direccion, notas)
      VALUES (${id}, ${body.nombre.trim()}, ${body.email ?? ""}, ${body.telefono ?? ""}, ${body.direccion ?? ""}, ${body.notas ?? ""})
      ON CONFLICT (id) DO UPDATE SET nombre = EXCLUDED.nombre, email = EXCLUDED.email, telefono = EXCLUDED.telefono, direccion = EXCLUDED.direccion, notas = EXCLUDED.notas
      RETURNING *
    `;
    res.status(201).json({
      id: row.id,
      nombre: row.nombre,
      email: row.email,
      telefono: row.telefono,
      direccion: row.direccion,
      notas: row.notas,
      fechaAlta: row.fecha_alta.toISOString(),
    });
  } finally {
    await client.end();
  }
});

app.patch("/api/clientes/:id", async (req, res) => {
  const body = req.body as { nombre?: string; email?: string; telefono?: string; direccion?: string; notas?: string };
  const client = makeClient();
  try {
    const [row] = await client<{
      id: string;
      nombre: string;
      email: string;
      telefono: string;
      direccion: string;
      notas: string;
      fecha_alta: Date;
    }[]>`
      UPDATE clientes SET
        nombre = COALESCE(NULLIF(${body.nombre ?? null}, ''), nombre),
        email = COALESCE(${body.email ?? null}, email),
        telefono = COALESCE(${body.telefono ?? null}, telefono),
        direccion = COALESCE(${body.direccion ?? null}, direccion),
        notas = COALESCE(${body.notas ?? null}, notas)
      WHERE id = ${req.params.id}
      RETURNING *
    `;
    if (!row) return res.status(404).json({ ok: false, mensaje: "Cliente no encontrado" });
    res.json({
      id: row.id,
      nombre: row.nombre,
      email: row.email,
      telefono: row.telefono,
      direccion: row.direccion,
      notas: row.notas,
      fechaAlta: row.fecha_alta.toISOString(),
    });
  } finally {
    await client.end();
  }
});

app.delete("/api/clientes/:id", async (req, res) => {
  const client = makeClient();
  try {
    const [row] = await client<{ id: string }[]>`DELETE FROM clientes WHERE id = ${req.params.id} RETURNING id`;
    if (!row) return res.status(404).json({ ok: false, mensaje: "Cliente no encontrado" });
    res.json({ ok: true, id: row.id });
  } finally {
    await client.end();
  }
});

// ---------------- descuentos ----------------
app.get("/api/descuentos", async (_req, res) => {
  const client = makeClient();
  try {
    const rows = await client<{
      id: string;
      nombre: string;
      etiqueta: string;
      tipo: string;
      valor: number;
      fecha_inicio: Date;
      fecha_fin: Date;
      alcance: string;
      categoria_id: string | null;
      producto_ids: string[];
      activo: boolean;
    }[]>`SELECT * FROM descuentos ORDER BY nombre`;
    res.json(
      rows.map((r) => ({
        id: r.id,
        nombre: r.nombre,
        etiqueta: r.etiqueta,
        tipo: r.tipo,
        valor: r.valor,
        fechaInicio: r.fecha_inicio.toISOString().slice(0, 10),
        fechaFin: r.fecha_fin.toISOString().slice(0, 10),
        alcance: r.alcance,
        categoriaId: r.categoria_id,
        productoIds: parseJson<string[]>(r.producto_ids, []),
        activo: r.activo,
      })),
    );
  } finally {
    await client.end();
  }
});

app.post("/api/descuentos", async (req, res) => {
  const body = req.body as {
    id?: string;
    nombre?: string;
    etiqueta?: string;
    tipo?: string;
    valor?: number;
    fechaInicio?: string;
    fechaFin?: string;
    alcance?: string;
    categoriaId?: string | null;
    productoIds?: string[];
    activo?: boolean;
  };
  if (!body.nombre || body.nombre.trim().length < 2) return res.status(400).json({ ok: false, mensaje: "Nombre inválido" });
  if (!body.valor || body.valor <= 0) return res.status(400).json({ ok: false, mensaje: "Descuento inválido" });

  const client = makeClient();
  try {
    const id = idNuevo(body.id);
    const [row] = await client<{
      id: string;
      nombre: string;
      etiqueta: string;
      tipo: string;
      valor: number;
      fecha_inicio: Date;
      fecha_fin: Date;
      alcance: string;
      categoria_id: string | null;
      producto_ids: string[];
      activo: boolean;
    }[]>`
      INSERT INTO descuentos
        (id, nombre, etiqueta, tipo, valor, fecha_inicio, fecha_fin, alcance, categoria_id, producto_ids, activo)
      VALUES
        (${id}, ${body.nombre.trim()}, ${body.etiqueta ?? body.nombre.trim()}, ${body.tipo ?? "porcentaje"}, ${body.valor}, ${body.fechaInicio ?? new Date().toISOString().slice(0, 10)}, ${body.fechaFin ?? new Date().toISOString().slice(0, 10)}, ${body.alcance ?? "todos"}, ${idONulo(body.categoriaId)}, ${JSON.stringify(body.productoIds ?? [])}::jsonb, ${body.activo ?? true})
      ON CONFLICT (id) DO UPDATE SET
        nombre = EXCLUDED.nombre, etiqueta = EXCLUDED.etiqueta, tipo = EXCLUDED.tipo, valor = EXCLUDED.valor,
        fecha_inicio = EXCLUDED.fecha_inicio, fecha_fin = EXCLUDED.fecha_fin, alcance = EXCLUDED.alcance,
        categoria_id = EXCLUDED.categoria_id, producto_ids = EXCLUDED.producto_ids, activo = EXCLUDED.activo
      RETURNING *
    `;
    res.status(201).json({
      id: row.id,
      nombre: row.nombre,
      etiqueta: row.etiqueta,
      tipo: row.tipo,
      valor: row.valor,
      fechaInicio: row.fecha_inicio.toISOString().slice(0, 10),
      fechaFin: row.fecha_fin.toISOString().slice(0, 10),
      alcance: row.alcance,
      categoriaId: row.categoria_id,
      productoIds: parseJson<string[]>(row.producto_ids, []),
      activo: row.activo,
    });
  } finally {
    await client.end();
  }
});

app.patch("/api/descuentos/:id", async (req, res) => {
  const body = req.body as {
    nombre?: string;
    etiqueta?: string;
    tipo?: string;
    valor?: number;
    fechaInicio?: string;
    fechaFin?: string;
    alcance?: string;
    categoriaId?: string | null;
    productoIds?: string[];
    activo?: boolean;
  };
  const client = makeClient();
  try {
    const [row] = await client<{
      id: string;
      nombre: string;
      etiqueta: string;
      tipo: string;
      valor: number;
      fecha_inicio: Date;
      fecha_fin: Date;
      alcance: string;
      categoria_id: string | null;
      producto_ids: string[];
      activo: boolean;
    }[]>`
      UPDATE descuentos SET
        nombre = COALESCE(NULLIF(${body.nombre ?? null}, ''), nombre),
        etiqueta = COALESCE(${body.etiqueta ?? null}, etiqueta),
        tipo = COALESCE(${body.tipo ?? null}, tipo),
        valor = COALESCE(${body.valor ?? null}, valor)::int,
        fecha_inicio = COALESCE(${body.fechaInicio ?? null}, fecha_inicio),
        fecha_fin = COALESCE(${body.fechaFin ?? null}, fecha_fin),
        alcance = COALESCE(${body.alcance ?? null}, alcance),
        categoria_id = COALESCE(${body.categoriaId ?? null}, categoria_id),
        producto_ids = COALESCE(${body.productoIds ? JSON.stringify(body.productoIds) : null}::jsonb, producto_ids),
        activo = COALESCE(${body.activo ?? null}, activo)
      WHERE id = ${req.params.id}
      RETURNING *
    `;
    if (!row) return res.status(404).json({ ok: false, mensaje: "Descuento no encontrado" });
    res.json({
      id: row.id,
      nombre: row.nombre,
      etiqueta: row.etiqueta,
      tipo: row.tipo,
      valor: row.valor,
      fechaInicio: row.fecha_inicio.toISOString().slice(0, 10),
      fechaFin: row.fecha_fin.toISOString().slice(0, 10),
      alcance: row.alcance,
      categoriaId: row.categoria_id,
      productoIds: parseJson<string[]>(row.producto_ids, []),
      activo: row.activo,
    });
  } finally {
    await client.end();
  }
});

app.delete("/api/descuentos/:id", async (req, res) => {
  const client = makeClient();
  try {
    const [row] = await client<{ id: string }[]>`DELETE FROM descuentos WHERE id = ${req.params.id} RETURNING id`;
    if (!row) return res.status(404).json({ ok: false, mensaje: "Descuento no encontrado" });
    res.json({ ok: true, id: row.id });
  } finally {
    await client.end();
  }
});

// ---------------- promos ----------------
app.get("/api/promos", async (_req, res) => {
  const client = makeClient();
  try {
    const rows = await client<{ codigo: string; descripcion: string; porcentaje: number; activa: boolean }[]>`SELECT * FROM promos ORDER BY codigo`;
    res.json(rows.map((r) => ({ codigo: r.codigo, descripcion: r.descripcion, porcentaje: r.porcentaje, activa: r.activa })));
  } finally {
    await client.end();
  }
});

app.post("/api/promos", async (req, res) => {
  const body = req.body as { codigo?: string; descripcion?: string; porcentaje?: number; activa?: boolean };
  if (!body.codigo || body.codigo.trim().length < 2) return res.status(400).json({ ok: false, mensaje: "Código inválido" });
  if (!body.porcentaje || body.porcentaje <= 0) return res.status(400).json({ ok: false, mensaje: "Porcentaje inválido" });
  const client = makeClient();
  try {
    const [row] = await client<{ codigo: string; descripcion: string; porcentaje: number; activa: boolean }[]>`
      INSERT INTO promos (codigo, descripcion, porcentaje, activa)
      VALUES (${body.codigo.trim().toUpperCase()}, ${body.descripcion ?? ""}, ${body.porcentaje}, ${body.activa ?? true})
      ON CONFLICT (codigo) DO UPDATE SET descripcion = EXCLUDED.descripcion, porcentaje = EXCLUDED.porcentaje, activa = EXCLUDED.activa
      RETURNING *
    `;
    res.status(201).json({ codigo: row.codigo, descripcion: row.descripcion, porcentaje: row.porcentaje, activa: row.activa });
  } finally {
    await client.end();
  }
});

app.patch("/api/promos/:codigo", async (req, res) => {
  const body = req.body as { descripcion?: string; porcentaje?: number; activa?: boolean };
  const client = makeClient();
  try {
    const [row] = await client<{ codigo: string; descripcion: string; porcentaje: number; activa: boolean }[]>`
      UPDATE promos SET
        descripcion = COALESCE(${body.descripcion ?? null}, descripcion),
        porcentaje = COALESCE(${body.porcentaje ?? null}, porcentaje)::int,
        activa = COALESCE(${body.activa ?? null}, activa)
      WHERE codigo = ${req.params.codigo.toUpperCase()}
      RETURNING *
    `;
    if (!row) return res.status(404).json({ ok: false, mensaje: "Promo no encontrada" });
    res.json({ codigo: row.codigo, descripcion: row.descripcion, porcentaje: row.porcentaje, activa: row.activa });
  } finally {
    await client.end();
  }
});

app.delete("/api/promos/:codigo", async (req, res) => {
  const client = makeClient();
  try {
    const [row] = await client<{ codigo: string }[]>`DELETE FROM promos WHERE codigo = ${req.params.codigo.toUpperCase()} RETURNING codigo`;
    if (!row) return res.status(404).json({ ok: false, mensaje: "Promo no encontrada" });
    res.json({ ok: true, codigo: row.codigo });
  } finally {
    await client.end();
  }
});

// ---------------- auth ----------------
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) return res.status(400).json({ ok: false, mensaje: "Completá email y contraseña" });
  const client = makeClient();
  try {
    const [row] = await client<{ id: string; nombre: string; email: string; password: string; rol: string }[]>`SELECT * FROM usuarios WHERE lower(email) = lower(${email}) AND password = ${password}`;
    if (!row) return res.status(401).json({ ok: false, mensaje: "Usuario o contraseña incorrectos" });
    const sessionId = crypto.randomUUID();
    await client`INSERT INTO sesiones (id, usuario_id, created_at, expires_at) VALUES (${sessionId}, ${row.id}, now(), now() + interval '2 days') ON CONFLICT DO NOTHING`;
    res.json({
      ok: true,
      mensaje: `Bienvenida, ${row.nombre}.`,
      usuario: { id: row.id, nombre: row.nombre, email: row.email, password: row.password, rol: row.rol },
      sessionId,
    });
  } finally {
    await client.end();
  }
});

app.post("/api/auth/register", async (req, res) => {
  const body = req.body as { nombre: string; email: string; password: string };
  if (!body.nombre || body.nombre.trim().length < 2) return res.status(400).json({ ok: false, mensaje: "Nombre inválido" });
  const client = makeClient();
  try {
    const exists = await client<{ c: number }[]>`SELECT count(*)::int AS c FROM usuarios WHERE lower(email) = lower(${body.email})`;
    if (exists[0]?.c > 0) return res.status(400).json({ ok: false, mensaje: "Ya existe una cuenta con ese email" });
    const id = crypto.randomUUID().slice(0, 8);
    const cid = crypto.randomUUID().slice(0, 8);
    await client`INSERT INTO usuarios (id, nombre, email, password, rol) VALUES (${id}, ${body.nombre.trim()}, ${body.email.trim().toLowerCase()}, ${body.password}, 'cliente')`;
    await client`INSERT INTO clientes (id, nombre, email, fecha_alta) VALUES (${cid}, ${body.nombre.trim()}, ${body.email.trim().toLowerCase()}, now()) ON CONFLICT DO NOTHING`;
    const sessionId = crypto.randomUUID();
    await client`INSERT INTO sesiones (id, usuario_id, created_at, expires_at) VALUES (${sessionId}, ${id}, now(), now() + interval '2 days') ON CONFLICT DO NOTHING`;
    res.status(201).json({
      ok: true,
      mensaje: "Cuenta creada.",
      usuario: { id, nombre: body.nombre.trim(), email: body.email.trim().toLowerCase(), password: body.password, rol: "cliente" },
      sessionId,
    });
  } finally {
    await client.end();
  }
});

app.get("/api/auth/me", async (req, res) => {
  const sid = (req.headers["x-session"] as string | undefined) ?? (req.headers["x-session-id"] as string | undefined);
  if (!sid) return res.status(401).json({ ok: false, mensaje: "No hay sesión" });
  const client = makeClient();
  try {
    const [s] = await client<{ usuario_id: string }[]>`SELECT usuario_id FROM sesiones WHERE id = ${sid} AND expires_at > now()`;
    if (!s) return res.status(401).json({ ok: false, mensaje: "Sesión inválida" });
    const [u] = await client<{ id: string; nombre: string; email: string; password: string; rol: string }[]>`SELECT * FROM usuarios WHERE id = ${s.usuario_id}`;
    if (!u) return res.status(401).json({ ok: false, mensaje: "Sesión inválida" });
    res.json({ ok: true, usuario: { id: u.id, nombre: u.nombre, email: u.email, password: u.password, rol: u.rol } });
  } finally {
    await client.end();
  }
});

app.post("/api/auth/logout", async (_req, res) => {
  res.json({ ok: true, mensaje: "Sesión cerrada" });
});

// ---------------- pedidos ----------------
app.get("/api/pedidos", async (_req, res) => {
  const client = makeClient();
  try {
    const rows = await client<{
      id: string;
      fecha: Date;
      usuario_id: string | null;
      cliente_nombre: string;
      cliente_telefono: string;
      cliente_email: string;
      cliente_entrega: string;
      cliente_direccion: string;
      cliente_notas: string;
      items: { id: string; nombre: string; precio: number; cantidad: number }[];
      subtotal: number;
      descuento: number;
      envio: number;
      total: number;
      estado: string;
    }[]>`SELECT * FROM pedidos ORDER BY fecha DESC`;
    res.json(
      rows.map((r) => ({
        id: r.id,
        fecha: r.fecha.toISOString(),
        usuarioId: r.usuario_id,
        cliente: {
          nombre: r.cliente_nombre,
          telefono: r.cliente_telefono,
          email: r.cliente_email,
          entrega: r.cliente_entrega as "envio" | "retiro",
          direccion: r.cliente_direccion,
          notas: r.cliente_notas,
        },
        items: parseJson<typeof r.items>(r.items, []),
        subtotal: r.subtotal,
        descuento: r.descuento,
        envio: r.envio,
        total: r.total,
        estado: r.estado,
      })),
    );
  } finally {
    await client.end();
  }
});

app.post("/api/pedidos", async (req, res) => {
  const body = req.body as {
    cliente: { nombre: string; telefono: string; email: string; entrega: "envio" | "retiro"; direccion: string; notas: string };
    items: { id: string; nombre: string; precio: number; cantidad: number }[];
    subtotal: number;
    descuento: number;
    envio: number;
    total: number;
    usuarioId?: string | null;
  };
  if (!body.cliente?.nombre || !body.items || body.items.length === 0) {
    return res.status(400).json({ ok: false, mensaje: "Datos de pedido inválidos" });
  }
  const client = makeClient();
  try {
    const count = (await client<{ c: number }[]>`SELECT count(*)::int AS c FROM pedidos`)[0]?.c ?? 0;
    const id = `TK-${1044 + count + 1}`;
    const [row] = await client<{
      id: string;
      fecha: Date;
      usuario_id: string | null;
      cliente_nombre: string;
      cliente_telefono: string;
      cliente_email: string;
      cliente_entrega: string;
      cliente_direccion: string;
      cliente_notas: string;
      items: { id: string; nombre: string; precio: number; cantidad: number }[];
      subtotal: number;
      descuento: number;
      envio: number;
      total: number;
      estado: string;
    }[]>`
      INSERT INTO pedidos (id, fecha, usuario_id, cliente_nombre, cliente_telefono, cliente_email, cliente_entrega, cliente_direccion, cliente_notas, items, subtotal, descuento, envio, total, estado)
      VALUES (${id}, now(), ${body.usuarioId ?? null}, ${body.cliente.nombre}, ${body.cliente.telefono}, ${body.cliente.email}, ${body.cliente.entrega}, ${body.cliente.direccion}, ${body.cliente.notas}, ${JSON.stringify(body.items)}::jsonb, ${body.subtotal}, ${body.descuento}, ${body.envio}, ${body.total}, 'nuevo')
      RETURNING *
    `;
    for (const item of body.items) {
      await client`UPDATE productos SET stock = GREATEST(0, stock - ${item.cantidad}::int) WHERE id = ${item.id}`;
    }

    // El pedido también carga (o actualiza) la ficha de la clienta, que es lo
    // que el panel muestra en la pestaña Clientes. No debe romper la venta.
    try {
      const email = (body.cliente.email ?? "").trim().toLowerCase();
      const telefono = (body.cliente.telefono ?? "").trim();
      const [existente] = await client<{ id: string }[]>`
        SELECT id FROM clientes
        WHERE (${email} <> '' AND lower(email) = ${email})
           OR (${telefono} <> '' AND telefono = ${telefono})
        LIMIT 1
      `;
      if (existente) {
        await client`
          UPDATE clientes SET
            nombre = COALESCE(NULLIF(${body.cliente.nombre ?? ""}, ''), nombre),
            email = COALESCE(NULLIF(${email}, ''), email),
            telefono = COALESCE(NULLIF(${telefono}, ''), telefono),
            direccion = COALESCE(NULLIF(${body.cliente.direccion ?? ""}, ''), direccion),
            notas = COALESCE(NULLIF(${body.cliente.notas ?? ""}, ''), notas)
          WHERE id = ${existente.id}
        `;
      } else {
        await client`
          INSERT INTO clientes (id, nombre, email, telefono, direccion, notas)
          VALUES (${crypto.randomUUID().slice(0, 8)}, ${body.cliente.nombre}, ${email}, ${telefono}, ${body.cliente.direccion ?? ""}, ${body.cliente.notas ?? ""})
        `;
      }
    } catch (e) {
      console.error("[api] no se pudo cargar la clienta del pedido:", e);
    }
    res.status(201).json({
      id: row.id,
      fecha: row.fecha.toISOString(),
      usuarioId: row.usuario_id,
      cliente: { nombre: row.cliente_nombre, telefono: row.cliente_telefono, email: row.cliente_email, entrega: row.cliente_entrega as "envio" | "retiro", direccion: row.cliente_direccion, notas: row.cliente_notas },
      items: parseJson<typeof row.items>(row.items, []),
      subtotal: row.subtotal,
      descuento: row.descuento,
      envio: row.envio,
      total: row.total,
      estado: row.estado,
    });
  } finally {
    await client.end();
  }
});

app.patch("/api/pedidos/:id/estado", async (req, res) => {
  const { estado } = req.body as { estado: string };
  const estadosValidos = ["nuevo", "preparando", "enviado", "entregado", "cancelado"];
  if (!estadosValidos.includes(estado)) return res.status(400).json({ ok: false, mensaje: "Estado inválido" });
  const client = makeClient();
  try {
    const [row] = await client<{ id: string; estado: string }[]>`UPDATE pedidos SET estado = ${estado} WHERE id = ${req.params.id} RETURNING id, estado`;
    if (!row) return res.status(404).json({ ok: false, mensaje: "Pedido no encontrado" });
    res.json({ id: row.id, estado: row.estado });
  } finally {
    await client.end();
  }
});

// ---------------- gastos ----------------
app.get("/api/gastos", async (_req, res) => {
  const client = makeClient();
  try {
    const rows = await client<{ id: string; fecha: Date; concepto: string; categoria: string; monto: number }[]>`SELECT * FROM gastos ORDER BY fecha DESC`;
    res.json(rows.map((r) => ({ id: r.id, fecha: r.fecha.toISOString(), concepto: r.concepto, categoria: r.categoria, monto: r.monto })));
  } finally {
    await client.end();
  }
});

app.post("/api/gastos", async (req, res) => {
  const body = req.body as { concepto?: string; categoria?: string; monto?: number };
  if (!body.concepto || body.concepto.trim().length < 2) return res.status(400).json({ ok: false, mensaje: "Concepto inválido" });
  if (!body.monto || body.monto <= 0) return res.status(400).json({ ok: false, mensaje: "Monto inválido" });
  const client = makeClient();
  try {
    const id = crypto.randomUUID().slice(0, 8);
    const [row] = await client<{ id: string; fecha: Date; concepto: string; categoria: string; monto: number }[]>`
      INSERT INTO gastos (id, fecha, concepto, categoria, monto) VALUES (${id}, now(), ${body.concepto.trim().slice(0, 90)}, ${body.categoria ?? "Otros"}, ${body.monto}::int)
      RETURNING *
    `;
    res.status(201).json({
      id: row.id,
      fecha: row.fecha.toISOString(),
      concepto: row.concepto,
      categoria: row.categoria,
      monto: row.monto,
    });
  } finally {
    await client.end();
  }
});

app.patch("/api/gastos/:id", async (req, res) => {
  const body = req.body as { concepto?: string; categoria?: string; monto?: number };
  const client = makeClient();
  try {
    const [row] = await client<{ id: string; fecha: Date; concepto: string; categoria: string; monto: number }[]>`
      UPDATE gastos SET
        concepto = COALESCE(NULLIF(${body.concepto ?? null}, ''), concepto),
        categoria = COALESCE(NULLIF(${body.categoria ?? null}, ''), categoria),
        monto = COALESCE(${body.monto ?? null}, monto)::int
      WHERE id = ${req.params.id}
      RETURNING *
    `;
    if (!row) return res.status(404).json({ ok: false, mensaje: "Gasto no encontrado" });
    res.json({ id: row.id, fecha: row.fecha.toISOString(), concepto: row.concepto, categoria: row.categoria, monto: row.monto });
  } finally {
    await client.end();
  }
});

app.delete("/api/gastos/:id", async (req, res) => {
  const client = makeClient();
  try {
    const [row] = await client<{ id: string }[]>`DELETE FROM gastos WHERE id = ${req.params.id} RETURNING id`;
    if (!row) return res.status(404).json({ ok: false, mensaje: "Gasto no encontrado" });
    res.json({ ok: true, id: row.id });
  } finally {
    await client.end();
  }
});

// ---------------- subidas a Cloudinary ----------------

/**
 * Exige una sesión de administradora. Las subidas consumen la cuota de
 * Cloudinary del cliente, así que no quedan abiertas a cualquiera.
 */
async function soloAdmin(req: Request, res: Response, next: NextFunction) {
  const sid =
    (req.headers["x-session"] as string | undefined) ??
    (req.headers["x-session-id"] as string | undefined);
  if (!sid) {
    return res.status(401).json({ ok: false, mensaje: "Necesitás ingresar como administradora" });
  }
  const client = makeClient();
  try {
    const [row] = await client<{ rol: string }[]>`
      SELECT u.rol FROM sesiones s
      JOIN usuarios u ON u.id = s.usuario_id
      WHERE s.id = ${sid} AND s.expires_at > now()
    `;
    if (!row || row.rol !== "admin") {
      return res.status(403).json({ ok: false, mensaje: "Solo la administradora puede hacer esto" });
    }
    next();
  } finally {
    await client.end();
  }
}

/** Devuelve la firma para que el navegador suba la imagen directo a Cloudinary. */
app.post("/api/uploads/firma", soloAdmin, async (req, res) => {
  if (!cloudinaryConfigurado()) {
    return res.status(503).json({
      ok: false,
      mensaje: "Cloudinary no está configurado en el servidor (faltan las credenciales)",
    });
  }
  const { carpeta } = (req.body ?? {}) as { carpeta?: string };
  const folder = String(carpeta ?? "tikva/productos")
    .replace(/[^a-zA-Z0-9/_-]/g, "")
    .slice(0, 80) || "tikva/productos";
  const timestamp = Math.floor(Date.now() / 1000);
  res.json({
    ok: true,
    ...cloudinaryPublico(),
    timestamp,
    folder,
    signature: firmarParametros({ folder, timestamp }),
  });
});

/** Da de baja una imagen de Cloudinary (por ejemplo si se quita del producto). */
app.post("/api/uploads/eliminar", soloAdmin, async (req, res) => {
  if (!cloudinaryConfigurado()) {
    return res.status(503).json({ ok: false, mensaje: "Cloudinary no está configurado" });
  }
  const { publicId } = (req.body ?? {}) as { publicId?: string };
  if (!publicId || !publicId.trim()) {
    return res.status(400).json({ ok: false, mensaje: "Falta el publicId de la imagen" });
  }
  const id = publicId.trim();
  const timestamp = Math.floor(Date.now() / 1000);
  const form = new URLSearchParams({
    public_id: id,
    api_key: cloudinaryPublico().apiKey,
    timestamp: String(timestamp),
    signature: firmarParametros({ public_id: id, timestamp }),
  });
  const out = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryPublico().cloudName}/image/destroy`,
    { method: "POST", body: form },
  );
  const body: any = await out.json().catch(() => ({}));
  if (!out.ok || (body?.result && body.result !== "ok" && body.result !== "not found")) {
    return res.status(502).json({
      ok: false,
      mensaje: body?.error?.message ?? "Cloudinary rechazó la baja de la imagen",
    });
  }
  res.json({ ok: true, result: body?.result ?? "ok" });
});

// ---------------- errores ----------------
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[api] error:", err?.code ?? "", err?.message ?? err);
  if (res.headersSent) return;
  // 23503 = clave foránea: casi siempre una categoría borrada o inexistente.
  if (err?.code === "23503") {
    return res.status(400).json({
      ok: false,
      mensaje: "La categoría elegida ya no existe: recargá la página y volvé a intentar",
    });
  }
  res.status(500).json({ ok: false, mensaje: "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`API backend escuchando en http://localhost:${PORT}`);
});

function slugify(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
