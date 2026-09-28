import postgres from "postgres";

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

export default makeClient;
