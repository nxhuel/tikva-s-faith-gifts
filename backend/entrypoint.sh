#!/bin/sh
set -e
echo "Ejecutando migración y seed..."
node --import tsx src/db-migrate.ts
echo "Migración completada. Arrancando servidor..."
exec node --import tsx src/index.ts
