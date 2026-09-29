import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useTikva } from "@/lib/store";

const field =
  "mt-2 w-full border border-input bg-card px-3.5 py-2.5 text-sm outline-none focus:border-sky-deep";
const label = "block text-xs uppercase tracking-widest text-muted-foreground";

/**
 * Formulario para cambiar la contraseña de la cuenta con la sesión abierta.
 * Es el mismo componente para la administradora y para las clientas: el backend
 * sólo permite cambiar la propia contraseña, así que no hace falta distinguir.
 */
export function CambiarClave({ className }: { className?: string }) {
  const { cambiarClave } = useTikva();
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Se guarda la referencia antes del await: después el evento se recicla.
    const form = e.currentTarget;
    const fd = new FormData(form);
    const actual = String(fd.get("actual") ?? "");
    const nueva = String(fd.get("nueva") ?? "");
    const repetir = String(fd.get("repetir") ?? "");

    if (nueva.length < 6) {
      toast.error("La contraseña nueva necesita al menos 6 caracteres.");
      return;
    }
    if (nueva !== repetir) {
      toast.error("Las dos contraseñas nuevas no coinciden.");
      return;
    }
    if (nueva === actual) {
      toast.error("La contraseña nueva tiene que ser distinta a la actual.");
      return;
    }

    setEnviando(true);
    const resultado = await cambiarClave(actual, nueva);
    setEnviando(false);

    if (!resultado.ok) {
      toast.error("No se pudo cambiar la contraseña", { description: resultado.mensaje });
      return;
    }
    form.reset();
    toast.success("Contraseña actualizada", { description: resultado.mensaje });
  };

  return (
    <form onSubmit={enviar} className={className}>
      <label className={label}>
        Contraseña actual
        <input
          name="actual"
          type="password"
          required
          maxLength={60}
          autoComplete="current-password"
          className={field}
        />
      </label>
      <label className={`${label} mt-4`}>
        Contraseña nueva
        <input
          name="nueva"
          type="password"
          required
          minLength={6}
          maxLength={60}
          autoComplete="new-password"
          className={field}
        />
      </label>
      <label className={`${label} mt-4`}>
        Repetir la nueva
        <input
          name="repetir"
          type="password"
          required
          minLength={6}
          maxLength={60}
          autoComplete="new-password"
          className={field}
        />
      </label>
      <button
        disabled={enviando}
        className="mt-6 w-full rounded-full bg-ink py-2.5 text-sm text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {enviando ? "Cambiando…" : "Cambiar contraseña"}
      </button>
      <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
        Se guarda hasheada (nadie puede verla, ni desde el panel) y al cambiarla se cierran las
        sesiones abiertas en otros dispositivos.
      </p>
    </form>
  );
}
