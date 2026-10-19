import { r as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { h as useTikva } from "./router-DMPxSAz3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cambiar-clave-C_U7hmtW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var field = "mt-2 w-full border border-input bg-card px-3.5 py-2.5 text-sm outline-none focus:border-sky-deep";
var label = "block text-xs uppercase tracking-widest text-muted-foreground";
/**
* Formulario para cambiar la contraseña de la cuenta con la sesión abierta.
* Es el mismo componente para la administradora y para las clientas: el backend
* sólo permite cambiar la propia contraseña, así que no hace falta distinguir.
*/
function CambiarClave({ className }) {
	const { cambiarClave } = useTikva();
	const [enviando, setEnviando] = (0, import_react.useState)(false);
	const enviar = async (e) => {
		e.preventDefault();
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: enviar,
		className,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: label,
				children: ["Contraseña actual", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					name: "actual",
					type: "password",
					required: true,
					maxLength: 60,
					autoComplete: "current-password",
					className: field
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: `${label} mt-4`,
				children: ["Contraseña nueva", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					name: "nueva",
					type: "password",
					required: true,
					minLength: 6,
					maxLength: 60,
					autoComplete: "new-password",
					className: field
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: `${label} mt-4`,
				children: ["Repetir la nueva", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					name: "repetir",
					type: "password",
					required: true,
					minLength: 6,
					maxLength: 60,
					autoComplete: "new-password",
					className: field
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				disabled: enviando,
				className: "mt-6 w-full rounded-full bg-ink py-2.5 text-sm text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60",
				children: enviando ? "Cambiando…" : "Cambiar contraseña"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-[11px] leading-relaxed text-muted-foreground",
				children: "Se guarda hasheada (nadie puede verla, ni desde el panel) y al cambiarla se cierran las sesiones abiertas en otros dispositivos."
			})
		]
	});
}
//#endregion
export { CambiarClave as t };
