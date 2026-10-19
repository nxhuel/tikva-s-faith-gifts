import { r as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { c as InstagramIcon, h as useTikva, p as numeroWhatsapp, s as WhatsAppIcon, u as linkWhatsapp } from "./router-DMPxSAz3.mjs";
import { n as objectType, r as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contacto-DdXIHahF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var schema = objectType({
	nombre: stringType().trim().min(2, "Ingresá tu nombre").max(80),
	mensaje: stringType().trim().min(10, "Contanos un poco más").max(500)
});
function Contacto() {
	const { negocio } = useTikva();
	const [nombre, setNombre] = (0, import_react.useState)("");
	const [mensaje, setMensaje] = (0, import_react.useState)("");
	const [errores, setErrores] = (0, import_react.useState)({});
	const field = "mt-2 w-full border border-input bg-card px-3.5 py-2.5 text-sm outline-none focus:border-sky-deep";
	const numero = numeroWhatsapp(negocio.whatsapp);
	const texto = `Hola ${negocio.nombre}! Soy ${nombre.trim()}.\n${mensaje.trim()}`;
	const href = linkWhatsapp(negocio.whatsapp, texto);
	/** Valida con zod y devuelve si se puede abrir WhatsApp. */
	const valido = () => {
		const parsed = schema.safeParse({
			nombre,
			mensaje
		});
		if (parsed.success) {
			setErrores({});
			return true;
		}
		const errs = {};
		parsed.error.issues.forEach((i) => errs[String(i.path[0])] = i.message);
		setErrores(errs);
		return false;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto grid max-w-5xl gap-12 px-5 py-16 md:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: "Contacto"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl leading-tight",
				children: "Hablemos por WhatsApp"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-sm leading-relaxed text-muted-foreground",
				children: "Respondemos de lunes a sábado. Si buscás algo a medida —colores, cantidades, packs para un evento o dedicatorias especiales— contanos y lo armamos."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: linkWhatsapp(negocio.whatsapp, `Hola ${negocio.nombre}! Quería hacerles una consulta.`),
					target: "_blank",
					rel: "noreferrer",
					className: "paper-card label-notch flex items-center gap-3 p-4 text-sm transition-transform hover:-translate-y-0.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppIcon, { className: "h-5 w-5 text-[#25D366]" }),
						"WhatsApp ",
						negocio.whatsappVisible || numero
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: `https://instagram.com/${negocio.instagram}`,
					target: "_blank",
					rel: "noreferrer",
					className: "paper-card label-notch flex items-center gap-3 p-4 text-sm transition-transform hover:-translate-y-0.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InstagramIcon, { className: "h-5 w-5" }),
						"@",
						negocio.instagram
					]
				})]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "paper-card label-notch h-fit p-7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Escribinos tu consulta"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-muted-foreground",
					children: "Se abre WhatsApp con el mensaje ya escrito."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-5 block text-xs uppercase tracking-widest text-muted-foreground",
					children: [
						"Tu nombre",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: nombre,
							onChange: (e) => setNombre(e.target.value),
							maxLength: 80,
							className: field
						}),
						errores["nombre"] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-[11px] normal-case tracking-normal text-destructive",
							children: errores["nombre"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-4 block text-xs uppercase tracking-widest text-muted-foreground",
					children: [
						"Mensaje",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: mensaje,
							onChange: (e) => setMensaje(e.target.value),
							rows: 5,
							maxLength: 500,
							className: field
						}),
						errores["mensaje"] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-[11px] normal-case tracking-normal text-destructive",
							children: errores["mensaje"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href,
					target: "_blank",
					rel: "noreferrer",
					onClick: (e) => {
						if (!valido()) e.preventDefault();
					},
					className: "mt-6 block w-full rounded-full bg-ink py-3 text-center text-sm text-primary-foreground transition-transform hover:-translate-y-0.5",
					children: "Abrir WhatsApp"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-center text-[11px] text-muted-foreground",
					children: ["¿No se abrió? Escribinos al ", negocio.whatsappVisible || numero]
				})
			]
		})]
	});
}
//#endregion
export { Contacto as component };
