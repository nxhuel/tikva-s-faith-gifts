import { r as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { g as useRouter, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as Plus, d as Minus, h as Check, r as Truck } from "../_libs/lucide-react.mjs";
import { d as mensajeProducto, h as useTikva, m as textoDescuento, n as Route, o as productImage, s as WhatsAppIcon, u as linkWhatsapp } from "./router-DMPxSAz3.mjs";
import { n as money } from "./format-C7TA0ORf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/producto._slug-C38_xALO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DetalleProducto() {
	const { slug } = Route.useParams();
	const { productoPorSlug, agregar, negocio, ready, categoriaPorId, descuentoDe, precioFinal } = useTikva();
	const producto = productoPorSlug(slug);
	const [cantidad, setCantidad] = (0, import_react.useState)(1);
	const [activa, setActiva] = (0, import_react.useState)(0);
	const router = useRouter();
	if (!producto) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-5 py-24 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: ready ? "No encontramos ese producto" : "Cargando…"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/tienda",
			className: "mt-6 inline-flex text-sm underline underline-offset-8",
			children: "Volver a la tienda"
		})]
	});
	const agotado = producto.stock <= 0;
	const categoria = categoriaPorId(producto.categoriaId);
	const descuento = descuentoDe(producto);
	const final = precioFinal(producto);
	const enDescuento = descuento && final < producto.precio;
	const imagenes = producto.imagenes.length > 0 ? producto.imagenes : [productImage("")];
	const activaClamp = Math.min(activa, imagenes.length - 1);
	/** URL del producto para que el mensaje de WhatsApp lo incluya (solo cliente). */
	const urlProducto = typeof window !== "undefined" ? window.location.href : void 0;
	const linkConsulta = linkWhatsapp(negocio.whatsapp, mensajeProducto(producto, negocio, {
		cantidad,
		precio: final,
		...urlProducto ? { url: urlProducto } : {}
	}));
	const linkAviso = linkWhatsapp(negocio.whatsapp, mensajeProducto(producto, negocio, { avisoStock: true }));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-5 py-14",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			className: "text-xs text-muted-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/tienda",
					className: "hover:text-ink",
					children: "Tienda"
				}),
				" ",
				"/ ",
				categoria?.nombre ?? "Producto"
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 grid gap-12 md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "paper-card label-notch overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: productImage(imagenes[activaClamp]),
					alt: producto.nombre,
					width: 1e3,
					height: 1e3,
					className: `h-full w-full object-cover ${agotado ? "saturate-50" : ""}`
				})
			}), imagenes.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex gap-3",
				children: imagenes.map((img, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setActiva(i),
					className: `h-20 w-16 shrink-0 overflow-hidden border-2 transition-colors ${activaClamp === i ? "border-sky-deep" : "border-border hover:border-ink/50"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: productImage(img),
						alt: `${producto.nombre} ${i + 1}`,
						className: "h-full w-full object-cover"
					})
				}, i))
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: categoria?.nombre ?? "Producto"
						}),
						" ",
						enDescuento && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "label-notch bg-gradient-to-b from-gold to-[#c9a254] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-ink",
							children: [
								descuento.etiqueta,
								" −",
								textoDescuento(descuento)
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-4xl leading-tight",
					children: producto.nombre
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 flex items-baseline gap-3 font-display text-2xl",
					children: [enDescuento && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-base text-muted-foreground line-through decoration-destructive/70",
						children: money(producto.precio)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(final) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 leading-relaxed text-muted-foreground",
					children: producto.descripcion
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-7 space-y-2.5",
					children: producto.detalles.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-start gap-2.5 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-0.5 h-4 w-4 shrink-0 text-sky-deep" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: d
						})]
					}, d))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-9 paper-card label-notch p-5",
					children: agotado ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Sin stock por ahora." }), " Lo armamos por encargo: escribinos y te reservamos el próximo lote."]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: linkAviso,
							target: "_blank",
							rel: "noreferrer",
							className: "inline-flex rounded-full bg-ink px-5 py-2.5 text-sm text-primary-foreground",
							children: "Avisarme por WhatsApp"
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										"aria-label": "Restar",
										onClick: () => setCantidad((c) => Math.max(1, c - 1)),
										className: "grid h-9 w-9 place-items-center border border-border",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3.5 w-3.5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-lg",
										children: cantidad
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										"aria-label": "Sumar",
										onClick: () => setCantidad((c) => Math.min(producto.stock, c + 1)),
										className: "grid h-9 w-9 place-items-center border border-border",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" })
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: [producto.stock, " disponibles"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										agregar(producto, cantidad);
										toast.success("Agregado al carrito", { description: producto.nombre });
									},
									className: "rounded-full bg-ink px-6 py-3 text-sm text-primary-foreground transition-transform hover:-translate-y-0.5",
									children: "Agregar al carrito"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										agregar(producto, cantidad);
										router.navigate({ to: "/checkout" });
									},
									className: "rounded-full border border-ink px-6 py-3 text-sm transition-colors hover:bg-ink hover:text-primary-foreground",
									children: "Comprar ahora"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: linkConsulta,
									target: "_blank",
									rel: "noreferrer",
									className: "inline-flex items-center gap-2 rounded-full border border-sky-deep px-6 py-3 text-sm text-sky-deep transition-colors hover:bg-sky-deep hover:text-primary-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppIcon, { className: "h-4 w-4" }), "Consultar por WhatsApp"]
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 flex items-center gap-2 text-xs text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4" }),
						"Envío ",
						money(negocio.envioCosto),
						" · gratis desde ",
						money(negocio.envioGratisDesde),
						" · retiro en CABA sin cargo"
					]
				})
			] })]
		})]
	});
}
//#endregion
export { DetalleProducto as component };
