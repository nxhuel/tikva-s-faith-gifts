import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as mensajeWhatsapp, h as useTikva, u as linkWhatsapp } from "./router-DMPxSAz3.mjs";
import { t as CambiarClave } from "./cambiar-clave-C_U7hmtW.mjs";
import { n as money, t as fecha } from "./format-C7TA0ORf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cuenta-BwIVdZm3.js
var import_jsx_runtime = require_jsx_runtime();
var estados = {
	nuevo: "Recibido",
	preparando: "En preparación",
	enviado: "Enviado",
	entregado: "Entregado",
	cancelado: "Cancelado"
};
function Cuenta() {
	const { usuario, pedidos, negocio } = useTikva();
	if (!usuario) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl px-5 py-24 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: "Ingresá para ver tus pedidos"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/ingresar",
			className: "mt-7 inline-flex rounded-full bg-ink px-6 py-3 text-sm text-primary-foreground",
			children: "Ingresar"
		})]
	});
	const mios = pedidos.filter((p) => p.usuarioId === usuario.id || p.cliente.email === usuario.email);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl px-5 py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: "Mi cuenta"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "mt-3 font-display text-4xl",
				children: ["Hola, ", usuario.nombre.split(" ")[0]]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: mios.length === 0 ? "Todavía no tenés pedidos registrados." : `Tenés ${mios.length} pedido${mios.length > 1 ? "s" : ""}.`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 space-y-4",
				children: mios.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "paper-card label-notch p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl",
								children: p.id
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: fecha(p.fecha)
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "border border-ink px-3 py-1 text-[10px] uppercase tracking-[0.2em]",
								children: estados[p.estado]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-4 hairline" }),
						p.items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between py-0.5 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [
									i.cantidad,
									" x ",
									i.nombre
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(i.precio * i.cantidad) })]
						}, i.id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-display text-lg",
								children: ["Total ", money(p.total)]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: linkWhatsapp(negocio.whatsapp, mensajeWhatsapp(p, negocio)),
								target: "_blank",
								rel: "noreferrer",
								className: "text-xs underline decoration-sky-deep decoration-2 underline-offset-4",
								children: "Consultar por WhatsApp"
							})]
						})
					]
				}, p.id))
			}),
			mios.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/tienda",
				className: "mt-4 inline-flex rounded-full bg-ink px-6 py-3 text-sm text-primary-foreground",
				children: "Ver la tienda"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "paper-card label-notch mt-14 max-w-xl p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg",
						children: "Cambiar contraseña"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: [
							"Tu cuenta es ",
							usuario.email,
							". Elegí una contraseña que no uses en otro lado."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CambiarClave, { className: "mt-5" })
				]
			})
		]
	});
}
//#endregion
export { Cuenta as component };
