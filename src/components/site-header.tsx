import { Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { LOGO_IMG } from "@/lib/images";
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
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={LOGO_IMG} alt="Tikva" width={36} height={36} className="h-9 w-9 rounded-full" />
          <span className="font-display text-lg tracking-tight">Tikva</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-6 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="text-sm text-muted-foreground transition-colors hover:text-ink data-[status=active]:text-ink data-[status=active]:underline data-[status=active]:decoration-sky-deep data-[status=active]:decoration-2 data-[status=active]:underline-offset-8"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            {usuario ? (
              <>
                <Link
                  to={usuario.rol === "admin" ? "/admin" : "/cuenta"}
                  className="rounded-full border border-border px-3.5 py-1.5 text-xs tracking-wide transition-colors hover:bg-secondary"
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
                className="rounded-full border border-border px-3.5 py-1.5 text-xs tracking-wide transition-colors hover:bg-secondary"
              >
                Ingresar
              </Link>
            )}
          </div>

          <Link
            to="/carrito"
            className="relative flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs tracking-wide text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Carrito
            {cantidadCarrito > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-semibold text-ink">
                {cantidadCarrito}
              </span>
            )}
          </Link>

          <button
            className="md:hidden"
            aria-label="Menú"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-paper px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="text-sm">
                {n.label}
              </Link>
            ))}
            <Link to={usuario ? (usuario.rol === "admin" ? "/admin" : "/cuenta") : "/ingresar"} onClick={() => setOpen(false)} className="text-sm">
              {usuario ? "Mi cuenta" : "Ingresar"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
