import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { LOGO_IMG } from "@/lib/images";
import { useTikva } from "@/lib/store";

export const Route = createFileRoute("/ingresar")({
  head: () => ({
    meta: [
      { title: "Ingresar · Tikva" },
      { name: "description", content: "Entrá a tu cuenta Tikva para ver tus pedidos." },
      { property: "og:title", content: "Ingresar · Tikva" },
      { property: "og:description", content: "Accedé a tu cuenta y seguí tus pedidos." },
    ],
  }),
  component: Ingresar,
});

function Ingresar() {
  const { ingresar, registrar } = useTikva();
  const [modo, setModo] = useState<"login" | "registro">("login");
  const router = useRouter();

  const field =
    "mt-2 w-full border border-input bg-card px-3.5 py-2.5 text-sm outline-none focus:border-sky-deep";

  return (
    <div className="mx-auto grid max-w-5xl items-center gap-14 px-5 py-20 md:grid-cols-2">
      <div>
        <img src={LOGO_IMG} alt="Tikva" width={72} height={72} className="h-18 w-18 rounded-full" />
        <h1 className="mt-6 font-display text-4xl leading-tight">
          {modo === "login" ? "Entrá a tu cuenta" : "Creá tu cuenta"}
        </h1>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Guardá tus datos para comprar más rápido y ver el estado de cada pedido. Si sos del equipo,
          usá tu usuario de administración.
        </p>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const fd = new FormData(form);
          if (modo === "login") {
            const r = await ingresar(String(fd.get("email")), String(fd.get("password")));
            if (!r.ok) {
              toast.error(r.mensaje || "No se pudo iniciar sesión");
              return;
            }
            toast.success(r.mensaje);
            router.navigate({ to: r.usuario?.rol === "admin" ? "/admin" : "/cuenta" });
          } else {
            const r = await registrar(
              String(fd.get("nombre")),
              String(fd.get("email")),
              String(fd.get("password")),
            );
            if (!r.ok) {
              toast.error(r.mensaje || "No se pudo crear la cuenta");
              return;
            }
            toast.success(r.mensaje);
            router.navigate({ to: "/cuenta" });
          }
          form.reset();
        }}
        className="paper-card label-notch p-7"
      >
        {modo === "registro" && (
          <label className="block text-xs uppercase tracking-widest text-muted-foreground">
            Nombre
            <input name="nombre" required maxLength={80} className={field} />
          </label>
        )}
        <label className="mt-4 block text-xs uppercase tracking-widest text-muted-foreground">
          {modo === "login" ? "Email o usuario" : "Email"}
          <input name="email" required maxLength={120} className={field} />
        </label>
        <label className="mt-4 block text-xs uppercase tracking-widest text-muted-foreground">
          Contraseña
          <input name="password" type="password" required maxLength={60} className={field} />
        </label>
        <button className="mt-7 w-full rounded-full bg-ink py-3 text-sm text-primary-foreground">
          {modo === "login" ? "Ingresar" : "Crear cuenta"}
        </button>
        <button
          type="button"
          onClick={() => setModo(modo === "login" ? "registro" : "login")}
          className="mt-4 w-full text-center text-xs text-muted-foreground underline underline-offset-4"
        >
          {modo === "login" ? "No tengo cuenta, quiero crearla" : "Ya tengo cuenta"}
        </button>
      </form>
    </div>
  );
}
