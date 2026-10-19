import { r as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { h as useTikva } from "./router-DMPxSAz3.mjs";
import { t as ProductCard } from "./product-card-CcQTiV8G.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tienda-Cjwgmmxq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Tienda() {
	const { productos, categorias, promos } = useTikva();
	const [cat, setCat] = (0, import_react.useState)("Todo");
	const lista = productos.filter((p) => p.activo && (cat === "Todo" || p.categoriaId === cat));
	const promoActiva = promos.find((p) => p.activa);
	const contar = (id) => productos.filter((p) => p.activo && (id ? p.categoriaId === id : true)).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-5 py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: "Catálogo"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl md:text-5xl",
				children: "Tienda"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground",
				children: "Todo se arma a mano por encargo. Si algo figura sin stock, podés escribirnos y te avisamos cuando vuelve."
			}),
			promoActiva && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 label-notch inline-flex flex-wrap items-center gap-3 bg-ink px-5 py-3 text-primary-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] uppercase tracking-[0.25em] text-sky",
					children: "Promo vigente"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-sm",
					children: [
						promoActiva.descripcion,
						" con el código",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "font-display tracking-wide",
							children: promoActiva.codigo
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] uppercase tracking-[0.25em] text-muted-foreground",
					children: "Filtrá por categoría"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setCat("Todo"),
						className: `inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium tracking-wide transition-all hover:-translate-y-0.5 ${cat === "Todo" ? "border-ink bg-ink text-primary-foreground shadow-md" : "border-border bg-card text-muted-foreground hover:border-ink hover:text-ink"}`,
						children: ["Todo", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums ${cat === "Todo" ? "bg-paper/20 text-primary-foreground" : "bg-secondary text-muted-foreground"}`,
							children: contar()
						})]
					}), categorias.map((c) => {
						const activa = cat === c.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setCat(c.id),
							className: `inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium tracking-wide transition-all hover:-translate-y-0.5 ${activa ? "border-ink bg-ink text-primary-foreground shadow-md" : "border-border bg-card text-muted-foreground hover:border-ink hover:text-ink"}`,
							children: [c.nombre, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums ${activa ? "bg-paper/20 text-primary-foreground" : "bg-secondary text-muted-foreground"}`,
								children: contar(c.id)
							})]
						}, c.id);
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
				children: lista.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { producto: p }, p.id))
			})
		]
	});
}
//#endregion
export { Tienda as component };
