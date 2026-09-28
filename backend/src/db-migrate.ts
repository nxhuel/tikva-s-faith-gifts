import inicializarEsquema from "./init.js";

console.log("Inicializando base de datos (migración)...");
await inicializarEsquema();
console.log("Migración completada. Solo se crearon: esquema, negocio y usuario admin.");
