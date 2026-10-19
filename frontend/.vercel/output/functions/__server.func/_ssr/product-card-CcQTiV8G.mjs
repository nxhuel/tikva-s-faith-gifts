import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as useTikva, m as textoDescuento, o as productImage } from "./router-DMPxSAz3.mjs";
import { n as money } from "./format-C7TA0ORf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-card-CcQTiV8G.js
var import_jsx_runtime = require_jsx_runtime();
function ProductCard({ producto }) {
	const { descuentoDe, precioFinal, categoriaPorId } = useTikva();
	const agotado = producto.stock <= 0;
	const descuento = descuentoDe(producto);
	const final = precioFinal(producto);
	const categoria = categoriaPorId(producto.categoriaId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/producto/$slug",
		params: { slug: producto.slug },
		className: "group block paper-card label-notch overflow-hidden transition-transform hover:-translate-y-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-4/5 overflow-hidden bg-secondary",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: productImage(producto.imagenes[0]),
					alt: producto.nombre,
					width: 800,
					height: 1e3,
					loading: "lazy",
					className: `h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${agotado ? "opacity-55 saturate-50" : ""}`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute left-3 top-3 bg-paper/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground",
					children: categoria?.nombre ?? "Producto"
				}),
				descuento && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute right-0 top-0 z-10 h-0 w-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "absolute right-18 top-6 block w-[520px] translate-x-1/2 translate-y-1/2 rotate-45 bg-gradient-to-b from-gold to-[#c9a254] px-6 pb-2.5 pt-3.5 text-center shadow-[0_18px_36px_-18px_rgba(28,36,60,0.75)] ring-1 ring-[#b98d3e]/60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate text-xs font-bold uppercase tracking-[0.16em] text-ink",
							children: descuento.etiqueta
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-0.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/75",
							children: ["−", textoDescuento(descuento)]
						})]
					})
				}),
				agotado && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute bottom-3 left-3 bg-ink px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-primary-foreground",
					children: "Sin stock"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2 p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-lg leading-snug",
					children: producto.nombre
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted-foreground",
					children: producto.resumen
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between pt-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-baseline gap-2",
						children: [descuento && final < producto.precio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm text-muted-foreground line-through decoration-destructive/70",
							children: money(producto.precio)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `font-display text-xl ${descuento ? "text-gold-dark" : ""}`,
							children: money(final)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs uppercase tracking-[0.2em] text-sky-deep group-hover:text-ink",
						children: agotado ? "Avisarme" : "Ver más"
					})]
				})
			]
		})]
	});
}
//#endregion
export { ProductCard as t };
