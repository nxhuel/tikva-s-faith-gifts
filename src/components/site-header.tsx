import { Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useTikva } from "@/lib/store";

const nav = [
  { to: "/", label: "Inicio" },
  { to: "/tienda", label: "Tienda" },
  { to: "/historia", label: "Nuestra historia" },
  { to: "/contacto", label: "Contacto" },
] as const;

export function SiteHeader() {
  const { cantidadCarrito, usuario, salir } = useTikva();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto grid h-20 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 md:h-24">
        {/* Izquierda: navegación */}
        <div className="flex items-center">
          <button
            className="rounded-full p-2 text-ink transition-colors hover:bg-secondary md:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <nav className="ml-6 hidden items-center gap-7 md:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="text-[15px] font-medium text-muted-foreground transition-colors hover:text-ink data-[status=active]:text-ink data-[status=active]:underline data-[status=active]:decoration-gold data-[status=active]:decoration-[3px] data-[status=active]:underline-offset-[10px]"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Centro: wordmark */}
        <Link to="/" className="group select-none text-center leading-none">
          <span className="font-marker -rotate-1 block text-[2rem] font-bold tracking-wide text-ink transition-transform duration-300 group-hover:-rotate-2 md:text-4xl">
            Tikva
          </span>
          <span className="mt-1.5 block text-[8px] uppercase tracking-[0.34em] text-muted-foreground">
            Regalería cristiana
          </span>
        </Link>

        {/* Derecha: acciones */}
        <div className="flex items-center justify-end gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            {usuario ? (
              <>
                <Link
                  to={usuario.rol === "admin" ? "/admin" : "/cuenta"}
                  className="rounded-full border border-border px-4 py-2 text-xs font-medium tracking-wide transition-colors hover:bg-secondary"
                >
                  {usuario.rol === "admin" ? "Panel" : usuario.nombre.split(" ")[0]}
                </Link>
                <button
                  onClick={() => {
                    salir();
                    router.navigate({ to: "/" });
                  }}
                  className="text-xs text-muted-foreground hover:text-ink"
                >
                  Salir
                </button>
              </>
            ) : (
              <Link
                to="/ingresar"
                className="rounded-full border border-border px-4 py-2 text-xs font-medium tracking-wide transition-colors hover:bg-secondary"
              >
                Ingresar
              </Link>
            )}
          </div>

          <Link
            to="/carrito"
            className="relative flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-xs font-medium tracking-wide text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Carrito</span>
            {cantidadCarrito > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-semibold text-ink shadow-sm">
                {cantidadCarrito}
              </span>
            )}
          </Link>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-paper px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-1 text-[15px]"
              >
                {n.label}
              </Link>
            ))}
            <Link
              to={usuario ? (usuario.rol === "admin" ? "/admin" : "/cuenta") : "/ingresar"}
              onClick={() => setOpen(false)}
              className="py-1 text-[15px] font-medium text-muted-foreground"
            >
              {usuario ? "Mi cuenta" : "Ingresar"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
