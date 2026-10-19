import { r as __toESM } from "../_runtime.mjs";
import { a as Overlay2, c as Title2, f as require_jsx_runtime, i as Description2, l as Trigger2, n as Cancel, o as Portal2, p as require_react, r as Content2, s as Root2, t as Action, u as Slot } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as Star, c as Plus, i as Trash2, l as Pencil, n as Upload, t as X } from "../_libs/lucide-react.mjs";
import { h as useTikva, l as api, m as textoDescuento, o as productImage } from "./router-DMPxSAz3.mjs";
import { t as CambiarClave } from "./cambiar-clave-C_U7hmtW.mjs";
import { n as money, t as fecha } from "./format-C7TA0ORf.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-CuH5Sf8D.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var AlertDialog = Root2;
var AlertDialogTrigger = Trigger2;
var AlertDialogPortal = Portal2;
var AlertDialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, {
	className: cn("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
AlertDialogOverlay.displayName = Overlay2.displayName;
var AlertDialogContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props
})] }));
AlertDialogContent.displayName = Content2.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
	ref,
	className: cn("text-lg font-semibold", className),
	...props
}));
AlertDialogTitle.displayName = Title2.displayName;
var AlertDialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
AlertDialogDescription.displayName = Description2.displayName;
var AlertDialogAction = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
	ref,
	className: cn(buttonVariants(), className),
	...props
}));
AlertDialogAction.displayName = Action.displayName;
var AlertDialogCancel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
	...props
}));
AlertDialogCancel.displayName = Cancel.displayName;
function ConfirmDelete({ onConfirm, title = "¿Eliminar?", description = "Esta acción no se puede deshacer.", confirmLabel = "Eliminar", children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className,
			"aria-label": title,
			children
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: description })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancelar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
		onClick: onConfirm,
		className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
		children: confirmLabel
	})] })] })] });
}
/**
* Subida de imágenes a Cloudinary.
*
* El navegador comprime la foto y la sube directo a Cloudinary usando una firma
* que pide al backend: así el api_secret no sale del servidor y la base guarda
* sólo la URL (~80 caracteres) en lugar del archivo en base64.
*/
var CARPETA_POR_DEFECTO = "tikva/productos";
/**
* Reduce la foto en el navegador antes de subirla (1600 px de lado mayor, JPEG).
* Las fotos de celular pesan varios MB; esto ahorra datos y cuota de Cloudinary.
*/
function comprimirImagen(file, maxDim = 1600, calidad = .85) {
	return new Promise((resolve) => {
		if (!file.type.startsWith("image/")) return resolve(file);
		const reader = new FileReader();
		reader.onerror = () => resolve(file);
		reader.onload = () => {
			const raw = String(reader.result ?? "");
			const img = new Image();
			img.onerror = () => resolve(file);
			img.onload = () => {
				try {
					const escala = Math.min(1, maxDim / Math.max(img.width, img.height));
					if (escala === 1 && file.size <= 9e5) return resolve(file);
					const canvas = document.createElement("canvas");
					canvas.width = Math.max(1, Math.round(img.width * escala));
					canvas.height = Math.max(1, Math.round(img.height * escala));
					const ctx = canvas.getContext("2d");
					if (!ctx) return resolve(file);
					ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
					canvas.toBlob((blob) => resolve(blob ?? file), "image/jpeg", calidad);
				} catch {
					resolve(file);
				}
			};
			img.src = raw;
		};
		reader.readAsDataURL(file);
	});
}
/** Sube una o varias imágenes y devuelve sus URLs públicas de Cloudinary. */
async function subirImagenes(files, carpeta = CARPETA_POR_DEFECTO) {
	const validos = Array.from(files).filter((f) => f.type.startsWith("image/"));
	if (validos.length === 0) return [];
	const firma = await api("/uploads/firma", {
		method: "POST",
		body: JSON.stringify({ carpeta })
	});
	const urls = [];
	for (const file of validos) {
		const blob = await comprimirImagen(file);
		const form = new FormData();
		form.append("file", blob, file.name || "foto.jpg");
		form.append("api_key", firma.apiKey);
		form.append("timestamp", String(firma.timestamp));
		form.append("folder", firma.folder);
		form.append("signature", firma.signature);
		const out = await fetch(`https://api.cloudinary.com/v1_1/${firma.cloudName}/image/upload`, {
			method: "POST",
			body: form
		});
		const body = await out.json().catch(() => ({}));
		if (!out.ok || !body?.secure_url) throw new Error(body?.error?.message ?? `No se pudo subir la imagen (${out.status})`);
		urls.push(String(body.secure_url));
	}
	return urls;
}
/** Extrae el public_id de una URL de Cloudinary (null si no es de Cloudinary). */
function publicIdDeUrl(url) {
	if (!/res\.cloudinary\.com\//.test(url)) return null;
	return (url.split("?")[0] ?? "").match(/\/image\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z0-9]+)?$/i)?.[1] ?? null;
}
/** Borra de Cloudinary una imagen que ya no se usa (mejor esfuerzo, no rompe). */
async function borrarImagen(url) {
	const publicId = publicIdDeUrl(url);
	if (!publicId) return;
	try {
		await api("/uploads/eliminar", {
			method: "POST",
			body: JSON.stringify({ publicId })
		});
	} catch {}
}
var ESTADOS = [
	"nuevo",
	"preparando",
	"enviado",
	"entregado",
	"cancelado"
];
var tabs = [
	"Resumen",
	"Productos",
	"Categorías",
	"Clientes",
	"Usuarios",
	"Descuentos",
	"Pedidos",
	"Gastos",
	"Promos",
	"Seguridad"
];
var field = "mt-2 w-full border border-input bg-card px-3.5 py-2.5 text-sm outline-none focus:border-sky-deep";
var labelCls = "block text-xs uppercase tracking-widest text-muted-foreground";
function productoVacio(categoriaId = "") {
	return {
		id: "",
		slug: "",
		nombre: "",
		resumen: "",
		descripcion: "",
		detalles: [],
		precio: 0,
		costo: 0,
		stock: 0,
		categoriaId,
		imagenes: [],
		destacado: false,
		activo: true
	};
}
function Admin() {
	const { usuario } = useTikva();
	const [tab, setTab] = (0, import_react.useState)("Resumen");
	if (!usuario || usuario.rol !== "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl px-5 py-24 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: "Área interna"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-3xl",
				children: "Necesitás ingresar como administradora"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: "Ingresá con tu usuario de administración."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/ingresar",
				className: "mt-7 inline-flex rounded-full bg-ink px-6 py-3 text-sm text-primary-foreground",
				children: "Ingresar"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-5 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "Panel Tikva"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-4xl",
					children: "Cuentas, stock y pedidos"
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 flex flex-wrap gap-2 border-b border-border pb-3",
				children: tabs.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setTab(t),
					className: `px-4 py-1.5 text-xs uppercase tracking-[0.18em] transition-colors ${tab === t ? "bg-ink text-primary-foreground" : "text-muted-foreground hover:text-ink"}`,
					children: t
				}, t))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8",
				children: [
					tab === "Resumen" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResumenTab, {}),
					tab === "Productos" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductosTab, {}),
					tab === "Categorías" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoriasTab, {}),
					tab === "Clientes" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientesTab, {}),
					tab === "Usuarios" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsuariosTab, {}),
					tab === "Descuentos" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DescuentosTab, {}),
					tab === "Pedidos" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PedidosTab, {}),
					tab === "Gastos" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GastosTab, {}),
					tab === "Promos" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromosTab, {}),
					tab === "Seguridad" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeguridadTab, {})
				]
			})
		]
	});
}
function ResumenTab() {
	const { pedidos, productos, gastos, negocio, guardarNegocio } = useTikva();
	const metricas = (0, import_react.useMemo)(() => {
		const validos = pedidos.filter((p) => p.estado !== "cancelado");
		const ingresos = validos.reduce((a, p) => a + p.total, 0);
		const costoMercaderia = validos.reduce((a, p) => a + p.items.reduce((s, i) => {
			return s + (productos.find((x) => x.id === i.id)?.costo ?? 0) * i.cantidad;
		}, 0), 0);
		const totalGastos = gastos.reduce((a, g) => a + g.monto, 0);
		const unidades = validos.reduce((a, p) => a + p.items.reduce((s, i) => s + i.cantidad, 0), 0);
		return {
			ingresos,
			costoMercaderia,
			totalGastos,
			ganancia: ingresos - costoMercaderia - totalGastos,
			unidades,
			ticket: validos.length ? Math.round(ingresos / validos.length) : 0,
			pedidosValidos: validos.length
		};
	}, [
		pedidos,
		productos,
		gastos
	]);
	const ranking = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		pedidos.filter((p) => p.estado !== "cancelado").forEach((p) => p.items.forEach((i) => {
			const prev = map.get(i.id) ?? {
				nombre: i.nombre,
				unidades: 0,
				total: 0
			};
			map.set(i.id, {
				nombre: i.nombre,
				unidades: prev.unidades + i.cantidad,
				total: prev.total + i.precio * i.cantidad
			});
		}));
		return [...map.values()].sort((a, b) => b.total - a.total);
	}, [pedidos]);
	const maxRank = Math.max(1, ...ranking.map((r) => r.total));
	const guardarAjustes = async (fd) => {
		try {
			await guardarNegocio({
				nombre: String(fd.get("nombre") ?? negocio.nombre).slice(0, 60),
				whatsapp: String(fd.get("whatsapp") ?? negocio.whatsapp).trim(),
				whatsappVisible: String(fd.get("whatsappVisible") ?? negocio.whatsappVisible).slice(0, 30),
				instagram: String(fd.get("instagram") ?? negocio.instagram).replace(/^@/, "").slice(0, 40),
				envioCosto: Math.max(0, Number(fd.get("envioCosto"))),
				envioGratisDesde: Math.max(0, Number(fd.get("envioGratisDesde")))
			});
			toast.success("Ajustes guardados");
		} catch (e) {
			toast.error("No se pudieron guardar los ajustes", { description: e?.message ?? "Revisá la conexión con el servidor." });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					{
						l: "Ingresos",
						v: money(metricas.ingresos)
					},
					{
						l: "Gastos + insumos",
						v: money(metricas.totalGastos + metricas.costoMercaderia)
					},
					{
						l: "Ganancia neta",
						v: money(metricas.ganancia)
					},
					{
						l: "Ticket promedio",
						v: money(metricas.ticket)
					}
				].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "paper-card label-notch p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: k.l
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-display text-2xl",
						children: k.v
					})]
				}, k.l))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "paper-card label-notch p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg",
						children: "Más vendidos"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 space-y-4",
						children: [ranking.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Todavía no hay ventas."
						}), ranking.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "pr-4",
								children: r.nombre
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "shrink-0 text-muted-foreground",
								children: [
									r.unidades,
									" u · ",
									money(r.total)
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 h-2 bg-secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-2 bg-sky-deep",
								style: { width: `${r.total / maxRank * 100}%` }
							})
						})] }, r.nombre))]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "paper-card label-notch p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg",
							children: "Alertas de stock"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 space-y-3",
							children: productos.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.nombre }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: p.stock === 0 ? "text-destructive" : p.stock <= 5 ? "text-gold-dark" : "text-muted-foreground",
									children: p.stock === 0 ? "Sin stock" : `${p.stock} u`
								})]
							}, p.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-5 text-xs leading-relaxed text-muted-foreground",
							children: [
								metricas.unidades,
								" unidades vendidas en ",
								metricas.pedidosValidos,
								" pedidos."
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					guardarAjustes(new FormData(e.currentTarget));
				},
				className: "paper-card label-notch p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg",
						children: "Ajustes del negocio"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: labelCls,
								children: ["Nombre", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									name: "nombre",
									defaultValue: negocio.nombre,
									maxLength: 60,
									className: field
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: labelCls,
								children: ["WhatsApp (con código país, ej. 5491156582298)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									name: "whatsapp",
									defaultValue: negocio.whatsapp,
									maxLength: 20,
									className: field
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: labelCls,
								children: ["WhatsApp visible", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									name: "whatsappVisible",
									defaultValue: negocio.whatsappVisible,
									maxLength: 30,
									className: field
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: labelCls,
								children: ["Instagram (sin @)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									name: "instagram",
									defaultValue: negocio.instagram,
									maxLength: 40,
									className: field
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: labelCls,
								children: ["Costo de envío ($)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									name: "envioCosto",
									type: "number",
									min: 0,
									defaultValue: negocio.envioCosto,
									className: field
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: labelCls,
								children: ["Envío gratis desde ($)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									name: "envioGratisDesde",
									type: "number",
									min: 0,
									defaultValue: negocio.envioGratisDesde,
									className: field
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "mt-6 rounded-full bg-ink px-6 py-2.5 text-sm text-primary-foreground",
						children: "Guardar ajustes"
					})
				]
			})
		]
	});
}
function ImageUploader({ imagenes, onChange }) {
	const inputRef = (0, import_react.useRef)(null);
	const [arrastrando, setArrastrando] = (0, import_react.useState)(false);
	const [subiendo, setSubiendo] = (0, import_react.useState)(false);
	/** Comprime y sube las fotos a Cloudinary; en el producto queda sólo la URL. */
	const agregar = async (files) => {
		const lista = Array.from(files);
		if (lista.length === 0 || subiendo) return;
		setSubiendo(true);
		try {
			const nuevas = await subirImagenes(lista);
			if (nuevas.length === 0) {
				toast.error("Elegí archivos de imagen válidos (JPG o PNG).");
				return;
			}
			onChange([...imagenes, ...nuevas].slice(0, 6));
			if (imagenes.length + nuevas.length > 6) toast.info("Máximo 6 imágenes por producto.");
			toast.success(nuevas.length === 1 ? "Foto subida" : `${nuevas.length} fotos subidas`);
		} catch (e) {
			toast.error("No se pudieron subir las fotos", { description: e?.message ?? "Revisá la conexión con el servidor." });
		} finally {
			setSubiendo(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "button",
			tabIndex: 0,
			onClick: () => inputRef.current?.click(),
			onKeyDown: (e) => e.key === "Enter" && inputRef.current?.click(),
			onDragOver: (e) => {
				e.preventDefault();
				setArrastrando(true);
			},
			onDragLeave: () => setArrastrando(false),
			onDrop: (e) => {
				e.preventDefault();
				setArrastrando(false);
				agregar(e.dataTransfer.files);
			},
			className: `mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed px-4 py-8 text-center transition-colors ${subiendo ? "cursor-wait border-sky-deep bg-sky/40" : arrastrando ? "border-sky-deep bg-sky/40" : "border-border hover:border-sky-deep/60"}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-5 w-5 text-sky-deep" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					children: subiendo ? "Subiendo fotos…" : "Arrastrá las fotos acá o tocá para elegir archivos"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "JPG o PNG · varias a la vez · la primera es la portada · se guardan en Cloudinary"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			ref: inputRef,
			type: "file",
			accept: "image/*",
			multiple: true,
			className: "hidden",
			onChange: (e) => {
				agregar(e.target.files ?? []);
				e.currentTarget.value = "";
			}
		}),
		imagenes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 flex flex-wrap gap-3",
			children: imagenes.map((img, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: img,
					alt: `Foto ${i + 1}`,
					className: `h-20 w-16 border object-cover ${i === 0 ? "border-sky-deep" : "border-border"}`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 flex items-center justify-center gap-2",
					children: [i === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 text-[9px] uppercase tracking-widest text-sky-deep",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3 w-3 fill-current" }), " Portada"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onChange([img, ...imagenes.filter((_, j) => j !== i)]),
						className: "text-[9px] uppercase tracking-widest text-muted-foreground hover:text-sky-deep",
						children: "Hacer portada"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onChange(imagenes.filter((_, j) => j !== i)),
						"aria-label": "Quitar imagen",
						className: "ml-1 text-muted-foreground hover:text-destructive",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
					})]
				})]
			}, i))
		})
	] });
}
function ProductosTab() {
	const { productos, categorias, guardarProducto, borrarProducto, categoriaPorId, descuentoDe, precioFinal } = useTikva();
	const [draft, setDraft] = (0, import_react.useState)(() => productoVacio(categorias[0]?.id ?? ""));
	const set = (k, v) => setDraft((d) => ({
		...d,
		[k]: v
	}));
	const guardar = async () => {
		if (draft.nombre.trim().length < 2) {
			toast.error("El producto necesita un nombre.");
			return;
		}
		if (draft.precio <= 0) {
			toast.error("El precio debe ser mayor a cero.");
			return;
		}
		try {
			const imagenesFinales = [...draft.imagenes];
			await guardarProducto({
				...draft,
				nombre: draft.nombre.trim(),
				resumen: draft.resumen.trim(),
				detalles: draft.detalles.map((d) => d.trim()).filter(Boolean)
			});
			productos.find((p) => p.id === draft.id)?.imagenes.filter((img) => !imagenesFinales.includes(img)).forEach((img) => void borrarImagen(img));
			toast.success(draft.id ? "Producto actualizado" : "Producto creado", { description: draft.nombre.trim() });
			setDraft(productoVacio(categorias[0]?.id ?? ""));
		} catch (e) {
			toast.error("No se pudo guardar el producto", { description: e?.message ?? "Revisá la conexión con el servidor." });
		}
	};
	const eliminar = async (p) => {
		try {
			await borrarProducto(p.id);
			p.imagenes.forEach((img) => void borrarImagen(img));
			if (draft.id === p.id) setDraft(productoVacio(categorias[0]?.id ?? ""));
			toast.success("Producto eliminado");
		} catch (e) {
			toast.error("No se pudo eliminar el producto", { description: e?.message });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid items-start gap-6 lg:grid-cols-[1fr_1.1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-display text-lg",
						children: [
							"Productos (",
							productos.length,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setDraft(productoVacio(categorias[0]?.id ?? "")),
						className: "inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs text-primary-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Nuevo producto"]
					})]
				}),
				productos.map((p) => {
					const d = descuentoDe(p);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `paper-card label-notch flex items-center gap-4 p-3 transition-colors ${draft.id === p.id ? "ring-2 ring-sky-deep" : ""}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setDraft({
									...p,
									detalles: [...p.detalles],
									imagenes: [...p.imagenes]
								}),
								className: "flex flex-1 items-center gap-4 text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: productImage(p.imagenes[0]),
									alt: p.nombre,
									width: 64,
									height: 64,
									loading: "lazy",
									className: "h-14 w-12 shrink-0 object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate font-display text-sm",
											children: p.nombre
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "block text-xs text-muted-foreground",
											children: [
												categoriaPorId(p.categoriaId)?.nombre ?? "Sin categoría",
												" · stock ",
												p.stock
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "mt-0.5 flex flex-wrap items-center gap-1.5 text-xs",
											children: [d && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "bg-gold/70 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-ink",
												children: [
													d.etiqueta,
													" −",
													textoDescuento(d)
												]
											}), d ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground line-through",
												children: money(p.precio)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-gold-dark",
												children: money(precioFinal(p))
											})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(p.precio) })]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setDraft({
									...p,
									detalles: [...p.detalles],
									imagenes: [...p.imagenes]
								}),
								"aria-label": "Editar",
								className: "text-muted-foreground hover:text-ink",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDelete, {
								onConfirm: () => eliminar(p),
								title: `¿Eliminar "${p.nombre}"?`,
								description: "Se borra del catálogo. Los pedidos ya registrados no se modifican.",
								className: "text-muted-foreground hover:text-destructive",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})
						]
					}, p.id);
				}),
				productos.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Todavía no hay productos. Creá el primero."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (e) => {
				e.preventDefault();
				guardar();
			},
			className: "paper-card label-notch p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg",
					children: draft.id ? "Editar producto" : "Nuevo producto"
				}), draft.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDelete, {
					onConfirm: () => eliminar(draft),
					title: `¿Eliminar "${draft.nombre}"?`,
					confirmLabel: "Eliminar producto",
					className: "text-xs text-muted-foreground underline underline-offset-4 hover:text-destructive",
					children: "Eliminar"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: labelCls,
						children: ["Nombre *", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: draft.nombre,
							onChange: (e) => set("nombre", e.target.value),
							maxLength: 90,
							className: field
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: labelCls,
								children: [
									"Precio de venta ($) *",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										min: 0,
										value: draft.precio || "",
										onChange: (e) => set("precio", Math.max(0, Number(e.target.value))),
										className: field
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block text-[11px] normal-case tracking-normal text-muted-foreground",
										children: "Lo que paga la clienta."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: labelCls,
								children: [
									"Costo de insumos ($)",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										min: 0,
										value: draft.costo || "",
										onChange: (e) => set("costo", Math.max(0, Number(e.target.value))),
										className: field
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block text-[11px] normal-case tracking-normal text-muted-foreground",
										children: "Lo que te cuesta armarlo: se usa para la ganancia del resumen."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: labelCls,
								children: ["Stock", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: 0,
									value: draft.stock,
									onChange: (e) => set("stock", Math.max(0, Number(e.target.value))),
									className: field
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: labelCls,
								children: ["Categoría", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: draft.categoriaId,
									onChange: (e) => set("categoriaId", e.target.value),
									className: field,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Sin categoría"
									}), categorias.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: c.id,
										children: c.nombre
									}, c.id))]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: labelCls,
						children: ["Resumen (aparece en la tarjeta)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: draft.resumen,
							onChange: (e) => set("resumen", e.target.value),
							maxLength: 120,
							className: field
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: labelCls,
						children: ["Descripción", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: draft.descripcion,
							onChange: (e) => set("descripcion", e.target.value),
							rows: 4,
							maxLength: 1200,
							className: field
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: labelCls,
						children: [
							"Detalles (uno por línea)",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: draft.detalles.join("\n"),
								onChange: (e) => set("detalles", e.target.value.split("\n")),
								rows: 4,
								placeholder: "Frasco de vidrio reciclado\n365 versículos enrollados a mano",
								className: field
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-[11px] normal-case tracking-normal text-muted-foreground",
								children: "Escribí un detalle y apretá Enter para agregar el siguiente."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: labelCls,
						children: "Fotos del producto"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploader, {
						imagenes: draft.imagenes,
						onChange: (imgs) => set("imagenes", imgs)
					})] }),
					draft.precio > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"Ganancia por unidad:",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-ink",
								children: money(draft.precio - draft.costo)
							}),
							draft.costo > 0 && ` (${Math.round((draft.precio - draft.costo) / draft.precio * 100)}% sobre el precio)`
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-6 pt-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: draft.destacado,
								onChange: (e) => set("destacado", e.target.checked),
								className: "accent-sky-deep"
							}), "Destacado en la portada"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: draft.activo,
								onChange: (e) => set("activo", e.target.checked),
								className: "accent-sky-deep"
							}), "Visible en la tienda"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "w-full rounded-full bg-ink py-3 text-sm text-primary-foreground",
						children: draft.id ? "Guardar cambios" : "Crear producto"
					})
				]
			})]
		})]
	});
}
function CategoriasTab() {
	const { categorias, productos, guardarCategoria, borrarCategoria } = useTikva();
	const [nombre, setNombre] = (0, import_react.useState)("");
	const [descripcion, setDescripcion] = (0, import_react.useState)("");
	const [editando, setEditando] = (0, import_react.useState)(null);
	const guardar = async () => {
		if (nombre.trim().length < 2) {
			toast.error("La categoría necesita un nombre.");
			return;
		}
		try {
			await guardarCategoria({
				id: editando?.id ?? "",
				nombre: nombre.trim(),
				...descripcion.trim() ? { descripcion: descripcion.trim() } : {}
			});
			toast.success(editando ? "Categoría actualizada" : "Categoría creada");
			setNombre("");
			setDescripcion("");
			setEditando(null);
		} catch (e) {
			toast.error("No se pudo guardar la categoría", { description: e?.message });
		}
	};
	const eliminar = async (c) => {
		try {
			const r = await borrarCategoria(c.id);
			if (r.ok) toast.success(r.mensaje);
			else toast.error(r.mensaje);
		} catch (e) {
			toast.error("No se pudo eliminar la categoría", { description: e?.message });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid items-start gap-6 lg:grid-cols-[1fr_1.2fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (e) => {
				e.preventDefault();
				guardar();
			},
			className: "paper-card label-notch h-fit p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg",
					children: editando ? "Editar categoría" : "Nueva categoría"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: `${labelCls} mt-4`,
					children: ["Nombre *", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: nombre,
						onChange: (e) => setNombre(e.target.value),
						maxLength: 40,
						className: field
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: `${labelCls} mt-3`,
					children: ["Descripción (opcional)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: descripcion,
						onChange: (e) => setDescripcion(e.target.value),
						maxLength: 120,
						className: field
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "flex-1 rounded-full bg-ink py-2.5 text-sm text-primary-foreground",
						children: editando ? "Guardar" : "Crear"
					}), editando && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setEditando(null);
							setNombre("");
							setDescripcion("");
						},
						className: "rounded-full border border-border px-5 text-sm text-muted-foreground",
						children: "Cancelar"
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [categorias.map((c) => {
				const usados = productos.filter((p) => p.categoriaId === c.id).length;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "paper-card label-notch flex items-center gap-4 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display",
									children: c.nombre
								}),
								c.descripcion && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: c.descripcion
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-0.5 text-[11px] text-muted-foreground",
									children: [
										usados,
										" producto",
										usados === 1 ? "" : "s",
										" asignado",
										usados === 1 ? "" : "s"
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setEditando(c);
								setNombre(c.nombre);
								setDescripcion(c.descripcion ?? "");
							},
							"aria-label": "Editar",
							className: "text-muted-foreground hover:text-ink",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDelete, {
							onConfirm: () => eliminar(c),
							title: `¿Eliminar la categoría "${c.nombre}"?`,
							description: "Solo se puede borrar si no tiene productos asignados.",
							className: "text-muted-foreground hover:text-destructive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
						})
					]
				}, c.id);
			}), categorias.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Sin categorías todavía."
			})]
		})]
	});
}
function ClientesTab() {
	const { clientes, pedidos, guardarCliente, borrarCliente } = useTikva();
	const [draft, setDraft] = (0, import_react.useState)(null);
	const [nuevo, setNuevo] = (0, import_react.useState)(false);
	const stats = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		pedidos.forEach((p) => {
			const key = p.cliente.email.toLowerCase();
			const prev = map.get(key) ?? {
				pedidos: 0,
				total: 0
			};
			map.set(key, {
				pedidos: prev.pedidos + 1,
				total: prev.total + p.total
			});
		});
		return map;
	}, [pedidos]);
	const guardar = async () => {
		if (!draft) return;
		if (draft.nombre.trim().length < 2) {
			toast.error("El cliente necesita un nombre.");
			return;
		}
		try {
			await guardarCliente({
				...draft,
				nombre: draft.nombre.trim()
			});
			toast.success("Cliente guardado");
			setDraft(null);
			setNuevo(false);
		} catch (e) {
			toast.error("No se pudo guardar el cliente", { description: e?.message });
		}
	};
	const eliminar = async (c) => {
		try {
			await borrarCliente(c.id);
			if (draft?.id === c.id) setDraft(null);
			toast.success("Cliente eliminado");
		} catch (e) {
			toast.error("No se pudo eliminar el cliente", { description: e?.message });
		}
	};
	const form = (c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: (e) => {
			e.preventDefault();
			guardar();
		},
		className: "paper-card label-notch h-fit p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg",
				children: nuevo ? "Nuevo cliente" : `Editar · ${c.nombre.split(" ")[0]}`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-4 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: labelCls,
						children: ["Nombre *", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: draft?.nombre ?? "",
							onChange: (e) => setDraft((d) => d ? {
								...d,
								nombre: e.target.value
							} : d),
							maxLength: 80,
							className: field
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: labelCls,
						children: ["Teléfono / WhatsApp", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: draft?.telefono ?? "",
							onChange: (e) => setDraft((d) => d ? {
								...d,
								telefono: e.target.value
							} : d),
							maxLength: 25,
							className: field
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: labelCls,
						children: ["Email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							value: draft?.email ?? "",
							onChange: (e) => setDraft((d) => d ? {
								...d,
								email: e.target.value
							} : d),
							maxLength: 120,
							className: field
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: labelCls,
						children: ["Dirección", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: draft?.direccion ?? "",
							onChange: (e) => setDraft((d) => d ? {
								...d,
								direccion: e.target.value
							} : d),
							maxLength: 160,
							className: field
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: `${labelCls} sm:col-span-2`,
						children: ["Notas", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: draft?.notas ?? "",
							onChange: (e) => setDraft((d) => d ? {
								...d,
								notas: e.target.value
							} : d),
							rows: 2,
							maxLength: 300,
							className: field
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "flex-1 rounded-full bg-ink py-2.5 text-sm text-primary-foreground",
					children: "Guardar cliente"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						setDraft(null);
						setNuevo(false);
					},
					className: "rounded-full border border-border px-5 text-sm text-muted-foreground",
					children: "Cancelar"
				})]
			})
		]
	}, c.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-display text-lg",
					children: [
						"Clientes (",
						clientes.length,
						")"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						setNuevo(true);
						setDraft({
							id: "",
							nombre: "",
							email: "",
							telefono: "",
							direccion: "",
							notas: "",
							fechaAlta: (/* @__PURE__ */ new Date()).toISOString()
						});
					},
					className: "inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs text-primary-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Nuevo cliente"]
				})]
			}),
			draft && (nuevo || draft.id) && form(draft),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [clientes.map((c) => {
					const st = stats.get(c.email.toLowerCase());
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "paper-card label-notch flex flex-wrap items-center gap-4 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display",
										children: c.nombre
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											c.email || "sin email",
											" · ",
											c.telefono || "sin teléfono",
											" · alta",
											" ",
											fecha(c.fechaAlta)
										]
									}),
									c.direccion && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: c.direccion
									}),
									c.notas && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs italic text-muted-foreground",
										children: [
											"“",
											c.notas,
											"”"
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-base text-ink",
										children: st?.pedidos ?? 0
									}),
									" pedido",
									st?.pedidos === 1 ? "" : "s"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["total ", money(st?.total ?? 0)] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setNuevo(false);
									setDraft({ ...c });
								},
								"aria-label": "Editar",
								className: "text-muted-foreground hover:text-ink",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDelete, {
								onConfirm: () => eliminar(c),
								title: `¿Eliminar a "${c.nombre}"?`,
								description: "Se saca del registro de clientes. Sus pedidos quedan intactos.",
								className: "text-muted-foreground hover:text-destructive",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})
						]
					}, c.id);
				}), clientes.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Todavía no hay clientes registrados. Se van cargando solos con cada pedido o registro."
				})]
			})
		]
	});
}
function UsuariosTab() {
	const { db, resetearClave } = useTikva();
	const [nuevaClave, setNuevaClave] = (0, import_react.useState)(null);
	const resetear = async (id, nombre) => {
		if (!confirm(`¿Estás seguro de restablecer la contraseña de ${nombre}?`)) return;
		const res = await resetearClave(id);
		if (res.ok && res.password) {
			setNuevaClave({
				id,
				clave: res.password
			});
			toast.success(res.mensaje);
		} else toast.error(res.mensaje);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-between",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "font-display text-lg",
				children: [
					"Usuarios (",
					db.usuarios.length,
					")"
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [db.usuarios.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "paper-card label-notch flex flex-wrap items-center gap-4 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-display",
						children: [u.nombre, u.rol === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-2 inline-flex items-center rounded-full bg-sky-deep/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-sky-deep",
							children: "ADMIN"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							u.email,
							" · ",
							u.telefono || "sin teléfono"
						]
					})]
				}), nuevaClave?.id === u.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 rounded-md bg-green-50 px-3 py-2 text-green-900 border border-green-200",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-mono",
						children: nuevaClave.clave
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setNuevaClave(null),
						className: "text-green-700 hover:text-green-900",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => resetear(u.id, u.nombre),
					className: "rounded border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted",
					children: "Restablecer contraseña"
				})]
			}, u.id)), db.usuarios.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Todavía no hay usuarios registrados."
			})]
		})]
	});
}
function DescuentosTab() {
	const { descuentos, categorias, productos, guardarDescuento, borrarDescuento } = useTikva();
	const [draft, setDraft] = (0, import_react.useState)(null);
	const [nuevo, setNuevo] = (0, import_react.useState)(false);
	const vacio = () => ({
		id: "",
		nombre: "",
		etiqueta: "",
		tipo: "porcentaje",
		valor: 0,
		fechaInicio: (/* @__PURE__ */ new Date()).toLocaleDateString("en-CA"),
		fechaFin: (/* @__PURE__ */ new Date()).toLocaleDateString("en-CA"),
		alcance: "todos",
		categoriaId: categorias[0]?.id ?? null,
		productoIds: [],
		activo: true
	});
	const guardar = async () => {
		if (!draft) return;
		if (draft.nombre.trim().length < 2 || draft.valor <= 0) {
			toast.error("Completá el nombre y un descuento mayor a cero.");
			return;
		}
		if (draft.fechaInicio > draft.fechaFin) {
			toast.error("La fecha de fin no puede ser anterior al inicio.");
			return;
		}
		try {
			await guardarDescuento({
				...draft,
				nombre: draft.nombre.trim(),
				etiqueta: draft.etiqueta.trim() || draft.nombre.trim()
			});
			toast.success(draft.id ? "Descuento actualizado" : "Descuento creado");
			setDraft(null);
			setNuevo(false);
		} catch (e) {
			toast.error("No se pudo guardar el descuento", { description: e?.message });
		}
	};
	const eliminar = async (d) => {
		try {
			await borrarDescuento(d.id);
			if (draft?.id === d.id) setDraft(null);
			toast.success("Descuento eliminado");
		} catch (e) {
			toast.error("No se pudo eliminar el descuento", { description: e?.message });
		}
	};
	const alternar = async (d) => {
		try {
			await guardarDescuento({
				...d,
				activo: !d.activo
			});
		} catch (e) {
			toast.error("No se pudo actualizar el descuento", { description: e?.message });
		}
	};
	const form = (d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: (e) => {
			e.preventDefault();
			guardar();
		},
		className: "paper-card label-notch p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg",
				children: nuevo ? "Nuevo descuento por fecha" : `Editar · ${d.nombre}`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-4 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: labelCls,
						children: ["Nombre de la fecha especial *", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: draft?.nombre ?? "",
							onChange: (e) => setDraft((x) => x ? {
								...x,
								nombre: e.target.value
							} : x),
							placeholder: "Día de la Madre",
							maxLength: 60,
							className: field
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: labelCls,
						children: ["Etiqueta de la tira (corta)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: draft?.etiqueta ?? "",
							onChange: (e) => setDraft((x) => x ? {
								...x,
								etiqueta: e.target.value
							} : x),
							placeholder: "Día de la Madre",
							maxLength: 30,
							className: field
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: labelCls,
						children: ["Tipo de descuento", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: draft?.tipo ?? "porcentaje",
							onChange: (e) => setDraft((x) => x ? {
								...x,
								tipo: e.target.value
							} : x),
							className: field,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "porcentaje",
								children: "Porcentaje (%)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "monto",
								children: "Monto fijo ($)"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: labelCls,
						children: [draft?.tipo === "porcentaje" ? "Descuento (%)" : "Descuento ($)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							min: 0,
							max: draft?.tipo === "porcentaje" ? 90 : void 0,
							value: draft?.valor || "",
							onChange: (e) => setDraft((x) => x ? {
								...x,
								valor: Math.max(0, Number(e.target.value))
							} : x),
							className: field
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: labelCls,
						children: ["Desde (incluido)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: draft?.fechaInicio ?? "",
							onChange: (e) => setDraft((x) => x ? {
								...x,
								fechaInicio: e.target.value
							} : x),
							className: field
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: labelCls,
						children: ["Hasta (incluido)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: draft?.fechaFin ?? "",
							onChange: (e) => setDraft((x) => x ? {
								...x,
								fechaFin: e.target.value
							} : x),
							className: field
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: labelCls,
						children: ["Aplicar a", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: draft?.alcance ?? "todos",
							onChange: (e) => setDraft((x) => x ? {
								...x,
								alcance: e.target.value
							} : x),
							className: field,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "todos",
									children: "Todos los productos"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "categoria",
									children: "Una categoría"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "productos",
									children: "Productos elegidos"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-end gap-2 pb-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: draft?.activo ?? true,
							onChange: (e) => setDraft((x) => x ? {
								...x,
								activo: e.target.checked
							} : x),
							className: "accent-sky-deep"
						}), "Activo"]
					})
				]
			}),
			draft?.alcance === "categoria" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: `${labelCls} mt-4`,
				children: ["Categoría", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: draft.categoriaId ?? "",
					onChange: (e) => setDraft((x) => x ? {
						...x,
						categoriaId: e.target.value
					} : x),
					className: field,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Elegí una categoría"
					}), categorias.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: c.id,
						children: c.nombre
					}, c.id))]
				})]
			}),
			draft?.alcance === "productos" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: labelCls,
					children: "Productos incluidos"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 grid gap-2 sm:grid-cols-2",
					children: productos.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: draft.productoIds.includes(p.id),
							onChange: (e) => setDraft((x) => x ? {
								...x,
								productoIds: e.target.checked ? [...x.productoIds, p.id] : x.productoIds.filter((id) => id !== p.id)
							} : x),
							className: "accent-sky-deep"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: p.nombre
						})]
					}, p.id))
				})]
			}),
			draft && draft.nombre && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-5 text-xs text-muted-foreground",
				children: [
					"Tira de la card:",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-1 inline-block bg-gold/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink",
						children: [
							draft.etiqueta || draft.nombre,
							" −",
							textoDescuento(draft)
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "flex-1 rounded-full bg-ink py-2.5 text-sm text-primary-foreground",
					children: draft?.id ? "Guardar cambios" : "Crear descuento"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						setDraft(null);
						setNuevo(false);
					},
					className: "rounded-full border border-border px-5 text-sm text-muted-foreground",
					children: "Cancelar"
				})]
			})
		]
	}, d.id || "nuevo");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg",
					children: "Descuentos por días especiales"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Solo se activan dentro del rango de fechas y muestran una tira en la tarjeta del producto."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						setNuevo(true);
						setDraft(vacio());
					},
					className: "inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs text-primary-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Nuevo descuento"]
				})]
			}),
			draft && (nuevo || draft.id) && form(draft),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [descuentos.map((d) => {
					const vigente = d.activo && d.fechaInicio <= (/* @__PURE__ */ new Date()).toLocaleDateString("en-CA") && d.fechaFin >= (/* @__PURE__ */ new Date()).toLocaleDateString("en-CA");
					const cantidad = productos.filter((p) => d.alcance === "todos" ? true : d.alcance === "categoria" ? p.categoriaId === d.categoriaId : d.productoIds.includes(p.id)).length;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "paper-card label-notch p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display",
									children: d.nombre
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										fecha(d.fechaInicio + "T00:00:00"),
										" → ",
										fecha(d.fechaFin + "T00:00:00"),
										" ·",
										" ",
										textoDescuento(d)
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-[11px] text-muted-foreground",
									children: [
										d.alcance === "todos" ? "Todos los productos" : d.alcance === "categoria" ? `Categoría: ${categorias.find((c) => c.id === d.categoriaId)?.nombre ?? "—"}` : `${d.productoIds.length} producto(s) elegidos`,
										" ",
										"· ",
										cantidad,
										" afectado(s)"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-[11px]",
									children: vigente ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-sage",
										children: "● Vigente hoy"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "○ Fuera de fecha"
									})
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => void alternar(d),
								className: `border px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${d.activo ? "border-ink bg-ink text-primary-foreground" : "border-border text-muted-foreground"}`,
								children: d.activo ? "Activa" : "Pausada"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5 bg-gold/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink",
								children: [
									"Tira: ",
									d.etiqueta,
									" −",
									textoDescuento(d)
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										setNuevo(false);
										setDraft({
											...d,
											productoIds: [...d.productoIds]
										});
									},
									"aria-label": "Editar",
									className: "text-muted-foreground hover:text-ink",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDelete, {
									onConfirm: () => eliminar(d),
									title: `¿Eliminar el descuento "${d.nombre}"?`,
									description: "Los productos vuelven a su precio normal cuando se elimina.",
									className: "text-muted-foreground hover:text-destructive",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
								})]
							})]
						})]
					}, d.id);
				}), descuentos.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground sm:col-span-2",
					children: "Todavía no hay descuentos por fechas especiales."
				})]
			})
		]
	});
}
function PedidosTab() {
	const { pedidos, cambiarEstado } = useTikva();
	const cambiar = async (id, estado) => {
		try {
			await cambiarEstado(id, estado);
			toast.success(`Pedido ${id} · ${estado}`);
		} catch (e) {
			toast.error("No se pudo cambiar el estado", { description: e?.message });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [pedidos.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "paper-card label-notch p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-display text-lg",
						children: [
							p.id,
							" · ",
							p.cliente.nombre
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							fecha(p.fecha),
							" · ",
							p.cliente.telefono,
							" ·",
							" ",
							p.cliente.entrega === "envio" ? p.cliente.direccion || "Envío" : "Retiro"
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-lg",
							children: money(p.total)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: p.estado,
							onChange: (e) => void cambiar(p.id, e.target.value),
							className: "border border-input bg-card px-2 py-1.5 text-xs",
							children: ESTADOS.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: e,
								children: e
							}, e))
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-3 hairline" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-sm text-muted-foreground",
					children: [p.items.map((i) => `${i.cantidad} x ${i.nombre}`).join(" · "), p.cliente.notas && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 italic",
						children: [
							"“",
							p.cliente.notas,
							"”"
						]
					})]
				})
			]
		}, p.id)), pedidos.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Sin pedidos todavía."
		})]
	});
}
function GastosTab() {
	const { gastos, agregarGasto, editarGasto, borrarGasto } = useTikva();
	const guardar = async (e) => {
		e.preventDefault();
		const form = e.currentTarget;
		const fd = new FormData(form);
		const concepto = String(fd.get("concepto") ?? "").trim();
		const monto = Number(fd.get("monto"));
		if (concepto.length < 2 || !monto || monto <= 0) {
			toast.error("Completá concepto y monto.");
			return;
		}
		try {
			await agregarGasto({
				concepto: concepto.slice(0, 90),
				categoria: String(fd.get("categoria") ?? "Otros"),
				monto,
				fecha: (/* @__PURE__ */ new Date()).toISOString()
			});
			form.reset();
			toast.success("Gasto registrado");
		} catch (err) {
			toast.error("No se pudo registrar el gasto", { description: err?.message });
		}
	};
	const editar = async (id, cambios) => {
		try {
			await editarGasto(id, cambios);
		} catch (err) {
			toast.error("No se pudo editar el gasto", { description: err?.message });
		}
	};
	const eliminar = async (id) => {
		try {
			await borrarGasto(id);
			toast.success("Gasto eliminado");
		} catch (err) {
			toast.error("No se pudo eliminar el gasto", { description: err?.message });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[1fr_1.4fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: guardar,
			className: "paper-card label-notch h-fit p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg",
					children: "Registrar gasto"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: `${labelCls} mt-4`,
					children: ["Concepto", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						name: "concepto",
						maxLength: 90,
						className: field
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: `${labelCls} mt-3`,
					children: ["Categoría", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						name: "categoria",
						className: `${field} mt-1`,
						children: [
							"Insumos",
							"Impresión",
							"Marketing",
							"Envíos",
							"Otros"
						].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: `${labelCls} mt-3`,
					children: ["Monto", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						name: "monto",
						type: "number",
						min: 1,
						className: field
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "mt-6 w-full rounded-full bg-ink py-2.5 text-sm text-primary-foreground",
					children: "Guardar"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "paper-card label-notch p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg",
					children: "Gastos del período"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-xl",
					children: money(gastos.reduce((a, g) => a + g.monto, 0))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 divide-y divide-border",
				children: gastos.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 py-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							defaultValue: g.concepto,
							maxLength: 90,
							"aria-label": "Concepto del gasto",
							onBlur: (e) => {
								const concepto = e.target.value.trim();
								if (concepto.length < 2) {
									e.target.value = g.concepto;
									toast.error("El concepto necesita al menos 2 letras.");
									return;
								}
								if (concepto !== g.concepto) editar(g.id, { concepto });
							},
							className: "w-full border border-transparent bg-transparent text-sm outline-none hover:border-border focus:border-sky-deep"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [
								g.categoria,
								" · ",
								fecha(g.fecha)
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							min: 1,
							defaultValue: g.monto,
							"aria-label": "Monto del gasto",
							onBlur: (e) => {
								const monto = Math.max(1, Number(e.target.value));
								e.target.value = String(monto);
								if (monto !== g.monto) editar(g.id, { monto });
							},
							className: "w-24 border border-transparent bg-transparent px-1 text-right text-sm outline-none hover:border-border focus:border-sky-deep"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => void eliminar(g.id),
							"aria-label": "Borrar gasto",
							className: "text-muted-foreground hover:text-destructive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
						})]
					})]
				}, g.id))
			})]
		})]
	});
}
function PromosTab() {
	const { promos, guardarPromo, borrarPromo } = useTikva();
	const guardar = async (e) => {
		e.preventDefault();
		const form = e.currentTarget;
		const fd = new FormData(form);
		const codigo = String(fd.get("codigo") ?? "").trim().toUpperCase();
		const porcentaje = Number(fd.get("porcentaje"));
		if (codigo.length < 3 || porcentaje <= 0 || porcentaje > 90) {
			toast.error("Código de 3+ letras y descuento entre 1 y 90.");
			return;
		}
		try {
			await guardarPromo({
				codigo,
				porcentaje,
				descripcion: String(fd.get("descripcion") ?? "").slice(0, 90) || `${porcentaje}% de descuento`,
				activa: true
			});
			form.reset();
			toast.success("Promo creada y activada", { description: codigo });
		} catch (err) {
			toast.error("No se pudo crear la promo", { description: err?.message });
		}
	};
	const editar = async (codigo, cambios) => {
		const promo = promos.find((p) => p.codigo === codigo);
		if (!promo) return;
		try {
			await guardarPromo({
				...promo,
				...cambios
			});
		} catch (err) {
			toast.error("No se pudo actualizar la promo", { description: err?.message });
		}
	};
	const eliminar = async (codigo) => {
		try {
			await borrarPromo(codigo);
			toast.success("Promo eliminada");
		} catch (err) {
			toast.error("No se pudo eliminar la promo", { description: err?.message });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[1fr_1.4fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: guardar,
			className: "paper-card label-notch h-fit p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg",
					children: "Nueva promo"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: `${labelCls} mt-4`,
					children: ["Código", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						name: "codigo",
						maxLength: 20,
						className: field
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: `${labelCls} mt-3`,
					children: ["Descripción", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						name: "descripcion",
						maxLength: 90,
						className: field
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: `${labelCls} mt-3`,
					children: ["% descuento", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						name: "porcentaje",
						type: "number",
						min: 1,
						max: 90,
						className: field
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "mt-6 w-full rounded-full bg-ink py-2.5 text-sm text-primary-foreground",
					children: "Crear"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "paper-card label-notch p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg",
				children: "Promos y cupones"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 divide-y divide-border",
				children: promos.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display",
						children: p.codigo
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							p.descripcion,
							" · ",
							p.porcentaje,
							"%"
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 1,
								max: 90,
								defaultValue: p.porcentaje,
								"aria-label": `Porcentaje de ${p.codigo}`,
								onBlur: (e) => {
									const valor = Math.min(90, Math.max(1, Number(e.target.value)));
									e.target.value = String(valor);
									if (valor !== p.porcentaje) editar(p.codigo, { porcentaje: valor });
								},
								className: "w-16 border border-input bg-card px-2 py-1 text-xs"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => void editar(p.codigo, { activa: !p.activa }),
								className: `border px-3 py-1 text-[10px] uppercase tracking-[0.2em] ${p.activa ? "border-ink bg-ink text-primary-foreground" : "border-border text-muted-foreground"}`,
								children: p.activa ? "Activa" : "Pausada"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmDelete, {
								onConfirm: () => void eliminar(p.codigo),
								title: `¿Eliminar la promo ${p.codigo}?`,
								description: "Los cupones con ese código dejan de funcionar.",
								className: "text-muted-foreground hover:text-destructive",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})
						]
					})]
				}, p.codigo))
			})]
		})]
	});
}
function SeguridadTab() {
	const { usuario } = useTikva();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[1fr_1.2fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "paper-card label-notch h-fit p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg",
					children: "Mi cuenta"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "mt-5 space-y-3",
					children: [
						{
							l: "Nombre",
							v: usuario?.nombre ?? ""
						},
						{
							l: "Usuario",
							v: usuario?.email ?? ""
						},
						{
							l: "Rol",
							v: usuario?.rol === "admin" ? "Administradora" : "Cliente"
						}
					].map((dato) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
						children: dato.l
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "text-sm",
						children: dato.v
					})] }, dato.l))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-xs leading-relaxed text-muted-foreground",
					children: "Desde acá sólo se cambia la contraseña de la cuenta con la que estás ingresada: las de las clientas no se pueden ver ni modificar desde el panel."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "paper-card label-notch p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg",
					children: "Cambiar contraseña"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-muted-foreground",
					children: "Elegí una que no uses en otro lado."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CambiarClave, { className: "mt-5" })
			]
		})]
	});
}
//#endregion
export { Admin as component };
