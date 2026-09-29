import { createFileRoute, Link } from "@tanstack/react-router";
import { CambiarClave } from "@/components/cambiar-clave";
import { fecha, money } from "@/lib/format";
import { linkWhatsapp, mensajeWhatsapp, useTikva } from "@/lib/store";

export const Route = createFileRoute("/cuenta")({
  head: () => ({
    meta: [
      { title: "Mis pedidos · Tikva" },
      { name: "description", content: "Seguí el estado de tus pedidos Tikva." },
      { property: "og:title", content: "Mis pedidos · Tikva" },
      { property: "og:description", content: "Historial y estado de tus pedidos." },
    ],
  }),
  component: Cuenta,
});

const estados: Record<string, string> = {
  nuevo: "Recibido",
  preparando: "En preparación",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

function Cuenta() {
  const { usuario, pedidos, negocio } = useTikva();

  if (!usuario) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="font-display text-3xl">Ingresá para ver tus pedidos</h1>
        <Link
          to="/ingresar"
          className="mt-7 inline-flex rounded-full bg-ink px-6 py-3 text-sm text-primary-foreground"
        >
          Ingresar
        </Link>
      </div>
    );
  }

  const mios = pedidos.filter(
    (p) => p.usuarioId === usuario.id || p.cliente.email === usuario.email,
  );

  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <p className="eyebrow">Mi cuenta</p>
      <h1 className="mt-3 font-display text-4xl">Hola, {usuario.nombre.split(" ")[0]}</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {mios.length === 0
          ? "Todavía no tenés pedidos registrados."
          : `Tenés ${mios.length} pedido${mios.length > 1 ? "s" : ""}.`}
      </p>

      <div className="mt-10 space-y-4">
        {mios.map((p) => (
          <article key={p.id} className="paper-card label-notch p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl">{p.id}</h2>
                <p className="text-xs text-muted-foreground">{fecha(p.fecha)}</p>
              </div>
              <span className="border border-ink px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
                {estados[p.estado]}
              </span>
            </div>
            <div className="my-4 hairline" />
            {p.items.map((i) => (
              <div key={i.id} className="flex justify-between py-0.5 text-sm">
                <span className="text-muted-foreground">
                  {i.cantidad} x {i.nombre}
                </span>
                <span>{money(i.precio * i.cantidad)}</span>
              </div>
            ))}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span className="font-display text-lg">Total {money(p.total)}</span>
              <a
                href={linkWhatsapp(negocio.whatsapp, mensajeWhatsapp(p, negocio))}
                target="_blank"
                rel="noreferrer"
                className="text-xs underline decoration-sky-deep decoration-2 underline-offset-4"
              >
                Consultar por WhatsApp
              </a>
            </div>
          </article>
        ))}
      </div>

      {mios.length === 0 && (
        <Link
          to="/tienda"
          className="mt-4 inline-flex rounded-full bg-ink px-6 py-3 text-sm text-primary-foreground"
        >
          Ver la tienda
        </Link>
      )}

      <div className="paper-card label-notch mt-14 max-w-xl p-6">
        <h2 className="font-display text-lg">Cambiar contraseña</h2>
        <p className="mt-2 text-xs text-muted-foreground">
          Tu cuenta es {usuario.email}. Elegí una contraseña que no uses en otro lado.
        </p>
        <CambiarClave className="mt-5" />
      </div>
    </div>
  );
}
