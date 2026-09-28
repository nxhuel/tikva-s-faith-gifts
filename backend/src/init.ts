import postgres from "postgres";

function makeInitClient() {
  return postgres({
    host: process.env.DB_HOST ?? "db",
    port: Number(process.env.DB_PORT ?? 5432),
    database: process.env.DB_NAME ?? "tikva",
    user: process.env.DB_USER ?? "tikva",
    password: process.env.DB_PASSWORD ?? "tikva",
    max: Number(process.env.DB_POOL ?? 10),
  });
}

export async function inicializarEsquema() {
  const sql = makeInitClient();
  try {
    await sql`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS negocio (
        id INT PRIMARY KEY CHECK (id = 1),
        nombre TEXT NOT NULL DEFAULT 'TIKVA',
        rubro TEXT,
        instagram TEXT,
        whatsapp TEXT NOT NULL DEFAULT '',
        whatsapp_visible TEXT NOT NULL DEFAULT '',
        envio_costo INT NOT NULL DEFAULT 3500,
        envio_gratis_desde INT NOT NULL DEFAULT 45000
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS categorias (
        id TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        descripcion TEXT
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS productos (
        id TEXT PRIMARY KEY,
        slug TEXT NOT NULL UNIQUE,
        nombre TEXT NOT NULL,
        resumen TEXT NOT NULL DEFAULT '',
        descripcion TEXT NOT NULL DEFAULT '',
        detalles JSONB NOT NULL DEFAULT '[]',
        precio INT NOT NULL DEFAULT 0,
        costo INT NOT NULL DEFAULT 0,
        stock INT NOT NULL DEFAULT 0,
        categoria_id TEXT REFERENCES categorias(id),
        imagenes JSONB NOT NULL DEFAULT '[]',
        destacado BOOLEAN NOT NULL DEFAULT FALSE,
        activo BOOLEAN NOT NULL DEFAULT TRUE
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS clientes (
        id TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        email TEXT NOT NULL,
        telefono TEXT NOT NULL DEFAULT '',
        direccion TEXT NOT NULL DEFAULT '',
        notas TEXT NOT NULL DEFAULT '',
        fecha_alta TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS descuentos (
        id TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        etiqueta TEXT NOT NULL DEFAULT '',
        tipo TEXT NOT NULL DEFAULT 'porcentaje',
        valor INT NOT NULL DEFAULT 0,
        fecha_inicio DATE NOT NULL,
        fecha_fin DATE NOT NULL,
        alcance TEXT NOT NULL DEFAULT 'todos',
        categoria_id TEXT REFERENCES categorias(id),
        producto_ids JSONB NOT NULL DEFAULT '[]',
        activo BOOLEAN NOT NULL DEFAULT TRUE
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS promos (
        id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        codigo TEXT NOT NULL UNIQUE,
        descripcion TEXT NOT NULL DEFAULT '',
        porcentaje INT NOT NULL DEFAULT 0,
        activa BOOLEAN NOT NULL DEFAULT TRUE
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS pedidos (
        id TEXT PRIMARY KEY,
        fecha TIMESTAMPTZ NOT NULL DEFAULT now(),
        usuario_id TEXT,
        cliente_nombre TEXT NOT NULL,
        cliente_telefono TEXT NOT NULL DEFAULT '',
        cliente_email TEXT NOT NULL DEFAULT '',
        cliente_entrega TEXT NOT NULL CHECK (cliente_entrega IN ('envio', 'retiro')),
        cliente_direccion TEXT NOT NULL DEFAULT '',
        cliente_notas TEXT NOT NULL DEFAULT '',
        items JSONB NOT NULL DEFAULT '[]',
        subtotal INT NOT NULL DEFAULT 0,
        descuento INT NOT NULL DEFAULT 0,
        envio INT NOT NULL DEFAULT 0,
        total INT NOT NULL DEFAULT 0,
        estado TEXT NOT NULL DEFAULT 'nuevo'
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS gastos (
        id TEXT PRIMARY KEY,
        fecha TIMESTAMPTZ NOT NULL DEFAULT now(),
        concepto TEXT NOT NULL,
        categoria TEXT NOT NULL DEFAULT 'Otros',
        monto INT NOT NULL DEFAULT 0
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS usuarios (
        id TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        rol TEXT NOT NULL CHECK (rol IN ('admin', 'cliente'))
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS sesiones (
        id TEXT PRIMARY KEY,
        usuario_id TEXT NOT NULL REFERENCES usuarios(id),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        expires_at TIMESTAMPTZ NOT NULL DEFAULT now() + interval '2 days'
      )
    `;

    // Configuración inicial del negocio (únicamente si no existe).
    const negocioCount = (
      await sql`SELECT count(*)::int as c FROM negocio WHERE id = 1`
    )[0]?.c ?? 0;

    if (negocioCount === 0) {
      await sql`
        INSERT INTO negocio
          (id, nombre, rubro, instagram, whatsapp, whatsapp_visible, envio_costo, envio_gratis_desde)
        VALUES
          (1, 'TIKVA', 'Regalería Cristiana', 'tikva.regalos', '5491156582298', '11 5658-2298', 3500, 45000)
      `;
    }

    // Una fila de negocio creada por una versión anterior puede haber quedado
    // sin WhatsApp: sin número los links wa.me no abren el chat del negocio.
    await sql`
      UPDATE negocio SET
        whatsapp = CASE WHEN COALESCE(whatsapp, '') = '' THEN '5491156582298' ELSE whatsapp END,
        whatsapp_visible = CASE WHEN COALESCE(whatsapp_visible, '') = '' THEN '11 5658-2298' ELSE whatsapp_visible END
      WHERE id = 1
    `;

    // Usuario admin inicial (sin él no se puede entrar al panel).
    const adminCount = (
      await sql`SELECT count(*)::int as c FROM usuarios WHERE email = 'admin'`
    )[0]?.c ?? 0;

    if (adminCount === 0) {
      await sql`
        INSERT INTO usuarios (id, nombre, email, password, rol)
        VALUES ('u-admin', 'Equipo Tikva', 'admin', 'admin123', 'admin')
      `;
    }
  } catch (error: any) {
    // El caso más común al cambiar DB_PASSWORD: la contraseña del volumen de
    // Postgres es la vieja (sólo se aplica al crear la base por primera vez).
    if (error?.code === "28P01") {
      throw new Error(
        "Postgres rechazó la contraseña: DB_PASSWORD del .env no coincide con la del volumen.\n" +
          "  - Alineá el rol:  docker compose exec db psql -U tikva -d tikva -c \"ALTER USER tikva WITH PASSWORD '<DB_PASSWORD>'\"\n" +
          "  - O recreá la base vacía:  docker compose down -v && docker compose up -d",
      );
    }
    throw error;
  } finally {
    await sql.end?.();
  }
}

export default inicializarEsquema;
