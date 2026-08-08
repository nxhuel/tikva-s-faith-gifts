export const money = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

export const fecha = (iso: string) =>
  new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(iso),
  );
