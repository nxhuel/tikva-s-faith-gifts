import { r as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as Plus, d as Minus, i as Trash2 } from "../_libs/lucide-react.mjs";
import { h as useTikva, o as productImage } from "./router-DMPxSAz3.mjs";
import { n as money } from "./format-C7TA0ORf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/carrito-CBWeCZhn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Carrito() {
	const { carrito, productos, cambiarCantidad, quitar, subtotal, descuento, cupon, aplicarCupon, quitarCupon, negocio } = useTikva();
	const [codigo, setCodigo] = (0, import_react.useState)("");
	if (carrito.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-5 py-24 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: "Carrito"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-4xl",
				children: "Todavía no hay nada acá"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: "Empezá por el frasco de 365 versículos: es el que más se regala."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/tienda",
				className: "mt-8 inline-flex rounded-full bg-ink px-6 py-3 text-sm text-primary-foreground",
				children: "Ir a la tienda"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-5 py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: "Paso 1 de 3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl",
				children: "Tu carrito"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4",
					children: carrito.map((item) => {
						const prod = productos.find((p) => p.id === item.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "paper-card label-notch flex gap-4 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: productImage(prod?.imagenes[0]),
								alt: item.nombre,
								width: 120,
								height: 140,
								loading: "lazy",
								className: "h-28 w-24 shrink-0 object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-1 flex-col",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-lg leading-snug",
										children: item.nombre
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 flex items-baseline gap-2 text-xs text-muted-foreground",
										children: [prod && item.precio < prod.precio && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "line-through decoration-destructive/60",
											children: money(prod.precio)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: prod && item.precio < prod.precio ? "text-sky-deep" : "",
											children: [money(item.precio), " por unidad"]
										})]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => quitar(item.id),
										"aria-label": "Quitar",
										className: "text-muted-foreground hover:text-destructive",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-auto flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												"aria-label": "Restar",
												onClick: () => cambiarCantidad(item.id, item.cantidad - 1),
												className: "grid h-8 w-8 place-items-center border border-border",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3 w-3" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-6 text-center text-sm",
												children: item.cantidad
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												"aria-label": "Sumar",
												onClick: () => cambiarCantidad(item.id, Math.min(item.cantidad + 1, prod?.stock ?? item.cantidad)),
												className: "grid h-8 w-8 place-items-center border border-border",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" })
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-lg",
										children: money(item.precio * item.cantidad)
									})]
								})]
							})]
						}, item.id);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "paper-card label-notch h-fit p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl",
							children: "Resumen"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 space-y-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Subtotal"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(subtotal) })]
								}),
								descuento > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-sky-deep",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Descuento ", cupon?.codigo] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["-", money(descuento)] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Envío" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "se calcula en el checkout" })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-5 hairline" }),
						cupon ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: quitarCupon,
							className: "text-xs underline underline-offset-4",
							children: ["Quitar cupón ", cupon.codigo]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: (e) => {
								e.preventDefault();
								const r = aplicarCupon(codigo);
								if (r.ok) toast.success(r.mensaje);
								else toast.error(r.mensaje);
							},
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: codigo,
								onChange: (e) => setCodigo(e.target.value),
								placeholder: "Código de promo",
								className: "flex-1 border border-input bg-card px-3 py-2 text-sm outline-none focus:border-sky-deep"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "border border-ink px-4 py-2 text-xs uppercase tracking-widest",
								children: "Aplicar"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex items-baseline justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "eyebrow",
								children: "Total estimado"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-2xl",
								children: money(subtotal - descuento)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/checkout",
							className: "mt-6 block rounded-full bg-ink py-3 text-center text-sm text-primary-foreground",
							children: "Continuar"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-center text-[11px] leading-relaxed text-muted-foreground",
							children: [
								"El pago final se coordina por WhatsApp (",
								negocio.whatsappVisible,
								") con transferencia o efectivo."
							]
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { Carrito as component };
