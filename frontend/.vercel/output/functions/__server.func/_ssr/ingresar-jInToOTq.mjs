import { r as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { g as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { h as useTikva, i as LOGO_IMG } from "./router-DMPxSAz3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ingresar-jInToOTq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Ingresar() {
	const { ingresar, registrar } = useTikva();
	const [modo, setModo] = (0, import_react.useState)("login");
	const router = useRouter();
	const field = "mt-2 w-full border border-input bg-card px-3.5 py-2.5 text-sm outline-none focus:border-sky-deep";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-5xl items-center gap-14 px-5 py-20 md:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: LOGO_IMG,
				alt: "Tikva",
				width: 72,
				height: 72,
				className: "h-18 w-18 rounded-full"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-6 font-display text-4xl leading-tight",
				children: modo === "login" ? "Entrá a tu cuenta" : "Creá tu cuenta"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground",
				children: "Guardá tus datos para comprar más rápido y ver el estado de cada pedido. Si sos del equipo, usá tu usuario de administración."
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: async (e) => {
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
					const r = await registrar(String(fd.get("nombre")), String(fd.get("email")), String(fd.get("password")));
					if (!r.ok) {
						toast.error(r.mensaje || "No se pudo crear la cuenta");
						return;
					}
					toast.success(r.mensaje);
					router.navigate({ to: "/cuenta" });
				}
				form.reset();
			},
			className: "paper-card label-notch p-7",
			children: [
				modo === "registro" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-xs uppercase tracking-widest text-muted-foreground",
					children: ["Nombre", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						name: "nombre",
						required: true,
						maxLength: 80,
						className: field
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-4 block text-xs uppercase tracking-widest text-muted-foreground",
					children: [modo === "login" ? "Email o usuario" : "Email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						name: "email",
						required: true,
						maxLength: 120,
						className: field
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-4 block text-xs uppercase tracking-widest text-muted-foreground",
					children: ["Contraseña", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						name: "password",
						type: "password",
						required: true,
						maxLength: 60,
						className: field
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "mt-7 w-full rounded-full bg-ink py-3 text-sm text-primary-foreground",
					children: modo === "login" ? "Ingresar" : "Crear cuenta"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setModo(modo === "login" ? "registro" : "login"),
					className: "mt-4 w-full text-center text-xs text-muted-foreground underline underline-offset-4",
					children: modo === "login" ? "No tengo cuenta, quiero crearla" : "Ya tengo cuenta"
				})
			]
		})]
	});
}
//#endregion
export { Ingresar as component };
