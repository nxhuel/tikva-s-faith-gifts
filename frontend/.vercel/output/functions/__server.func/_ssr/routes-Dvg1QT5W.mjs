import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as ArrowUpRight, m as Hand, p as Heart, s as Scroll, u as PenLine } from "../_libs/lucide-react.mjs";
import { a as NOTA_IMG, h as useTikva, r as HERO_IMG, u as linkWhatsapp } from "./router-DMPxSAz3.mjs";
import { t as ProductCard } from "./product-card-CcQTiV8G.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Dvg1QT5W.js
var import_jsx_runtime = require_jsx_runtime();
var pasos = [
	{
		icon: Scroll,
		titulo: "Elegimos los versículos",
		texto: "365 pasajes seleccionados uno por uno, para cada día del año."
	},
	{
		icon: PenLine,
		titulo: "Se imprimen y enrollan",
		texto: "Papel ilustración, corte a mano y atado con hilo de algodón."
	},
	{
		icon: Hand,
		titulo: "Se arma el frasco",
		texto: "Tapa dorada, tul y etiqueta acuarelada colocada a mano."
	},
	{
		icon: Heart,
		titulo: "Llega listo para regalar",
		texto: "Con tarjeta de dedicatoria y bolsa con moño si lo pedís."
	}
];
function Home() {
	const { productos, negocio } = useTikva();
	const destacados = productos.filter((p) => p.activo);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden border-b border-border",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: HERO_IMG,
					alt: "Frasco 365 versículos bíblicos de Tikva, regalería cristiana",
					width: 1600,
					height: 1104,
					className: "absolute inset-0 h-full w-full object-cover"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-linear-to-r from-paper via-paper/65 to-paper/10" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative mx-auto grid max-w-6xl gap-10 px-5 py-24 md:py-32",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow",
								children: "Regalería cristiana · Buenos Aires"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "mt-5 font-display text-5xl leading-[1.05] md:text-6xl",
								children: ["Un versículo por día,", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block italic text-sky-deep",
									children: "enrollado a mano."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-6 max-w-md text-base leading-relaxed text-muted-foreground",
								children: [
									"Tikva significa ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "esperanza" }),
									". Hacemos frascos con 365 versículos y papelería para que abras uno cada mañana —o para que se lo regales a alguien que necesita leerlo."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-9 flex flex-wrap items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/tienda",
									className: "group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm tracking-wide text-primary-foreground transition-transform hover:-translate-y-0.5",
									children: ["Ver la tienda", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: linkWhatsapp(negocio.whatsapp, `Hola ${negocio.nombre}! Quería hacerles una consulta.`),
									target: "_blank",
									rel: "noreferrer",
									className: "text-sm underline decoration-sky-deep decoration-2 underline-offset-8",
									children: "Escribinos por WhatsApp"
								})]
							})
						]
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-b border-border bg-ink py-3 text-primary-foreground",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl flex-wrap justify-center gap-x-10 gap-y-2 px-5 text-[11px] uppercase tracking-[0.25em]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Hecho a mano" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sky",
						children: "·"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Envíos a todo el país" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sky",
						children: "·"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Retiro en CABA" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sky",
						children: "·"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tarjeta con dedicatoria" })
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-5 py-20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "La tienda"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 font-display text-3xl md:text-4xl",
					children: "Lo que armamos hoy"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/tienda",
					className: "text-sm underline decoration-sky-deep decoration-2 underline-offset-8",
					children: "Ver todo"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
				children: destacados.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { producto: p }, p.id))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-y border-border sky-panel",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl px-5 py-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "Cómo se hace"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 max-w-lg font-display text-3xl md:text-4xl",
						children: "Cuatro pasos, todos con las manos."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4",
						children: pasos.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "relative border-t-2 border-ink/70 pt-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(p.icon, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-display text-sm",
										children: ["0", i + 1]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-3 font-display text-lg",
									children: p.titulo
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm leading-relaxed text-ink/70",
									children: p.texto
								})
							]
						}, p.titulo))
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto grid max-w-6xl items-center gap-12 px-5 py-24 md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
				className: "paper-card label-notch overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: NOTA_IMG,
					alt: "Versículo de Romanos 5:1 sacado del frasco",
					width: 720,
					height: 960,
					loading: "lazy",
					className: "h-full w-full object-cover"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "Lo que nos escriben"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", {
					className: "mt-6 font-display text-2xl leading-snug md:text-3xl",
					children: "“Mirá cómo la chica va leyendo cada día un versículo de tu frasquito. Gloria a Dios le doy.”"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 text-sm text-muted-foreground",
					children: "— Lucía"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-9 hairline" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 max-w-md text-sm leading-relaxed text-muted-foreground",
					children: "Cada pedido se arma por encargo. Si querés algo especial —colores, cantidad, dedicatoria, packs para eventos— escribinos y lo pensamos juntas."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/contacto",
					className: "mt-6 inline-flex rounded-full border border-ink px-5 py-2.5 text-sm transition-colors hover:bg-ink hover:text-primary-foreground",
					children: "Pedir algo a medida"
				})
			] })]
		})
	] });
}
//#endregion
export { Home as component };
