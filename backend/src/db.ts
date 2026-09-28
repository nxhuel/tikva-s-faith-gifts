import postgres from "postgres";

import { opcionesConexion } from "./dbconfig.js";

function makeClient() {
  return postgres(opcionesConexion());
}

export default makeClient;
