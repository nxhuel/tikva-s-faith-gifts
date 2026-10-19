import { r as __toESM } from "../_runtime.mjs";
import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { c as HeadContent, d as Outlet, f as lazyRouteComponent, g as useRouter, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { f as Menu, o as ShoppingBag, t as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DMPxSAz3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-ink group-[.toaster]:border group-[.toaster]:border-ink/20 group-[.toaster]:shadow-lg",
			title: "group-[.toast]:text-ink",
			description: "group-[.toast]:text-ink/70",
			icon: "group-[.toast]:text-ink",
			actionButton: "group-[.toast]:bg-ink group-[.toast]:text-white",
			cancelButton: "group-[.toast]:bg-ink/10 group-[.toast]:text-ink"
		} },
		...props
	});
};
var styles_default = "/assets/styles-IfWTIL5g.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var CART_KEY = "tikva-cart-v1";
var SESSION_KEY = "tikva-session-v1";
var DB_VACIO = {
	negocio: {
		nombre: "TIKVA",
		rubro: "Regalería Cristiana",
		instagram: "",
		whatsapp: "",
		whatsappVisible: "",
		envioCosto: 0,
		envioGratisDesde: 0
	},
	categorias: [],
	productos: [],
	clientes: [],
	descuentos: [],
	promos: [],
	pedidos: [],
	gastos: [],
	usuarios: []
};
var BACKEND = (typeof window !== "undefined" && window.__BACKEND_URL) ?? (typeof import.meta !== "undefined" && {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_BACKEND_URL": "/api"
}["VITE_BACKEND_URL"]) ?? "http://localhost:3001";
/**
* Origen del backend **sin** el sufijo `/api`.
*
* `backendUrl` puede llegar como ruta relativa ("/api", típico en Docker
* detrás del proxy) o como URL absoluta ("http://localhost:3001", típico en
* desarrollo). Normalizamos ambos casos acá para no duplicar `/api`.
*/
function backendOrigin() {
	const base = (typeof window !== "undefined" && window.__BACKEND_URL || BACKEND || "").trim().replace(/\/+$/, "");
	return base.endsWith("/api") ? base.slice(0, -4) : base;
}
function apiUrl(path) {
	const limpio = path.startsWith("/") ? path : `/${path}`;
	return `${backendOrigin()}/api${limpio}`;
}
function readSession() {
	if (typeof window === "undefined") return null;
	try {
		return window.localStorage.getItem(SESSION_KEY);
	} catch {
		return null;
	}
}
function writeSession(id) {
	if (typeof window === "undefined") return;
	try {
		if (id) window.localStorage.setItem(SESSION_KEY, id);
		else window.localStorage.removeItem(SESSION_KEY);
	} catch {}
}
/**
* Petición al backend. Se exporta para que otros módulos (por ejemplo las
* subidas a Cloudinary) reusen la misma base, headers y sesión.
*/
async function api(path, opts) {
	const controller = new AbortController();
	const t = setTimeout(() => controller.abort(), 12e3);
	const sid = typeof window !== "undefined" && (window.__BACKEND_SESSION ?? readSession()) || null;
	const out = await fetch(apiUrl(path), {
		signal: controller.signal,
		headers: {
			"Content-Type": "application/json",
			...sid ? { "x-session": String(sid) } : {}
		},
		...opts
	});
	clearTimeout(t);
	const raw = await out.text().catch(() => "");
	let body = {};
	try {
		body = raw ? JSON.parse(raw) : {};
	} catch {
		body = {};
	}
	if (!out.ok) {
		const mensaje = body?.mensaje ?? (out.status === 404 ? "Recurso no encontrado (404)" : out.statusText || `Error del servidor (${out.status})`);
		throw Object.assign(new Error(String(mensaje)), {
			status: out.status,
			data: body
		});
	}
	return body;
}
function readCart() {
	if (typeof window === "undefined") return [];
	try {
		const raw = window.localStorage.getItem(CART_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}
function writeCart(value) {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(CART_KEY, JSON.stringify(value));
	} catch {}
}
/** Fecha local de hoy en formato YYYY-MM-DD. */
function hoyLocal() {
	return (/* @__PURE__ */ new Date()).toLocaleDateString("en-CA");
}
function descuentoAplica(descuento, producto) {
	const hoy = hoyLocal();
	if (!descuento.activo) return false;
	if (hoy < descuento.fechaInicio || hoy > descuento.fechaFin) return false;
	if (descuento.alcance === "todos") return true;
	if (descuento.alcance === "categoria") return Boolean(descuento.categoriaId) && descuento.categoriaId === producto.categoriaId;
	return descuento.productoIds.includes(producto.id);
}
function ahorroDe(descuento, precio) {
	const ahorro = descuento.tipo === "porcentaje" ? Math.round(precio * descuento.valor / 100) : descuento.valor;
	return Math.max(0, Math.min(ahorro, precio));
}
function precioConDescuento(producto, descuentos) {
	const aplicables = descuentos.filter((d) => descuentoAplica(d, producto));
	if (aplicables.length === 0) return producto.precio;
	const mejor = aplicables.reduce((best, d) => ahorroDe(d, producto.precio) > ahorroDe(best, producto.precio) ? d : best);
	return Math.max(0, producto.precio - ahorroDe(mejor, producto.precio));
}
function textoDescuento(descuento) {
	return descuento.tipo === "porcentaje" ? `${descuento.valor}%` : `$${descuento.valor.toLocaleString("es-AR")}`;
}
var TikvaContext = (0, import_react.createContext)(null);
function TikvaProvider({ children, backendUrl }) {
	const [db, setDb] = (0, import_react.useState)(DB_VACIO);
	const [usuario, setUsuario] = (0, import_react.useState)(null);
	const [carrito, setCarrito] = (0, import_react.useState)(readCart);
	const [cupon, setCupon] = (0, import_react.useState)(null);
	const [sessionId, setSessionId] = (0, import_react.useState)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	/** Carga el estado completo desde la API (catálogo, pedidos, etc.). */
	const recargar = (0, import_react.useCallback)(async () => {
		if (typeof window === "undefined") return;
		try {
			const [negocio, categorias, productos, clientes, descuentos, promos, pedidos, gastos, usuarios] = await Promise.all([
				api("/negocio"),
				api("/categorias"),
				api("/productos"),
				api("/clientes"),
				api("/descuentos"),
				api("/promos"),
				api("/pedidos"),
				api("/gastos"),
				api("/usuarios")
			]);
			setDb((prev) => ({
				...prev,
				negocio,
				categorias,
				productos,
				clientes,
				descuentos,
				promos,
				pedidos,
				gastos,
				usuarios
			}));
		} catch (e) {
			console.warn("No se pudo conectar con el backend:", e?.message ?? e);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		if (backendUrl) window.__BACKEND_URL = backendUrl.startsWith("/") ? window.location.origin + backendUrl : backendUrl;
		recargar();
		setReady(true);
	}, [backendUrl, recargar]);
	/** Restaura la sesión activa si hay un sessionId guardado. */
	(0, import_react.useEffect)(() => {
		const sid = readSession();
		if (!sid) return;
		window.__BACKEND_SESSION = sid;
		(async () => {
			try {
				const body = await api("/auth/me");
				if (body?.ok && body.usuario) {
					setUsuario(body.usuario);
					setSessionId(sid);
				} else writeSession(null);
			} catch {
				writeSession(null);
			}
		})();
	}, []);
	(0, import_react.useEffect)(() => {
		if (ready) writeCart(carrito);
	}, [carrito, ready]);
	const subtotal = (0, import_react.useMemo)(() => carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0), [carrito]);
	const descuento = (0, import_react.useMemo)(() => cupon ? Math.round(subtotal * cupon.porcentaje / 100) : 0, [cupon, subtotal]);
	const envio = (0, import_react.useCallback)((entrega) => {
		if (entrega === "retiro" || subtotal === 0) return 0;
		return subtotal - descuento >= db.negocio.envioGratisDesde ? 0 : db.negocio.envioCosto;
	}, [
		db.negocio.envioCosto,
		db.negocio.envioGratisDesde,
		descuento,
		subtotal
	]);
	const total = (0, import_react.useCallback)((entrega) => subtotal - descuento + envio(entrega), [
		subtotal,
		descuento,
		envio
	]);
	const descuentoDe = (0, import_react.useCallback)((p) => {
		const aplicables = db.descuentos.filter((d) => descuentoAplica(d, p));
		if (aplicables.length === 0) return void 0;
		return aplicables.reduce((best, d) => ahorroDe(d, p.precio) > ahorroDe(best, p.precio) ? d : best);
	}, [db.descuentos]);
	const precioFinal = (0, import_react.useCallback)((p) => precioConDescuento(p, db.descuentos), [db.descuentos]);
	const agregar = (0, import_react.useCallback)((p, cantidad = 1) => {
		const precio = precioFinal(p);
		setCarrito((prev) => {
			if (prev.find((i) => i.id === p.id)) return prev.map((i) => i.id === p.id ? {
				...i,
				cantidad: Math.min(i.cantidad + cantidad, p.stock),
				precio
			} : i);
			return [...prev, {
				id: p.id,
				nombre: p.nombre,
				precio,
				cantidad
			}];
		});
	}, [precioFinal]);
	const cambiarCantidad = (0, import_react.useCallback)((id, cantidad) => {
		setCarrito((prev) => prev.map((i) => i.id === id ? {
			...i,
			cantidad
		} : i).filter((i) => i.cantidad > 0));
	}, []);
	const quitar = (0, import_react.useCallback)((id) => {
		setCarrito((prev) => prev.filter((i) => i.id !== id));
	}, []);
	const vaciar = (0, import_react.useCallback)(() => {
		setCarrito([]);
		setCupon(null);
	}, []);
	const aplicarCupon = (0, import_react.useCallback)((codigo) => {
		const found = db.promos.find((p) => p.codigo.toLowerCase() === codigo.trim().toLowerCase() && p.activa);
		if (!found) return {
			ok: false,
			mensaje: "Ese código no existe o no está vigente."
		};
		setCupon(found);
		return {
			ok: true,
			mensaje: `Listo: ${found.descripcion}.`
		};
	}, [db.promos]);
	const ingresar = (0, import_react.useCallback)(async (email, password) => {
		try {
			const body = await api("/auth/login", {
				method: "POST",
				body: JSON.stringify({
					email,
					password
				})
			});
			if (!body.ok) return {
				ok: false,
				mensaje: body.mensaje
			};
			setUsuario(body.usuario);
			setSessionId(body.sessionId);
			window.__BACKEND_SESSION = body.sessionId;
			writeSession(body.sessionId);
			return {
				ok: true,
				mensaje: body.mensaje,
				usuario: body.usuario
			};
		} catch (e) {
			return {
				ok: false,
				mensaje: e?.message ?? "Error al iniciar sesión"
			};
		}
	}, []);
	const registrar = (0, import_react.useCallback)(async (nombre, email, password) => {
		try {
			const body = await api("/auth/register", {
				method: "POST",
				body: JSON.stringify({
					nombre,
					email,
					password
				})
			});
			if (!body.ok) return {
				ok: false,
				mensaje: body.mensaje
			};
			setUsuario(body.usuario);
			setSessionId(body.sessionId);
			window.__BACKEND_SESSION = body.sessionId;
			writeSession(body.sessionId);
			return {
				ok: true,
				mensaje: body.mensaje
			};
		} catch (e) {
			return {
				ok: false,
				mensaje: e?.message ?? "Error al crear la cuenta"
			};
		}
	}, []);
	/** Cambia la contraseña de la persona que tiene la sesión abierta. */
	const cambiarClave = (0, import_react.useCallback)(async (actual, nueva) => {
		try {
			const body = await api("/auth/password", {
				method: "PATCH",
				body: JSON.stringify({
					actual,
					nueva
				})
			});
			return {
				ok: true,
				mensaje: String(body?.mensaje ?? "Contraseña actualizada.")
			};
		} catch (e) {
			return {
				ok: false,
				mensaje: e?.message ?? "No se pudo cambiar la contraseña"
			};
		}
	}, []);
	const resetearClave = (0, import_react.useCallback)(async (id) => {
		try {
			const body = await api(`/usuarios/${id}/reset-password`, { method: "POST" });
			return {
				ok: true,
				password: body.password,
				mensaje: String(body?.mensaje ?? "Contraseña actualizada.")
			};
		} catch (e) {
			return {
				ok: false,
				mensaje: e?.message ?? "No se pudo cambiar la contraseña"
			};
		}
	}, []);
	const salir = (0, import_react.useCallback)(async () => {
		try {
			await api("/auth/logout", { method: "POST" });
		} catch {}
		setUsuario(null);
		setSessionId(null);
		window.__BACKEND_SESSION = void 0;
		writeSession(null);
	}, []);
	/** Envía la mutación a la API y refresca el estado local desde la DB. */
	const mutar = (0, import_react.useCallback)(async (fn) => {
		await fn();
		await recargar();
	}, [recargar]);
	const crearPedido = (0, import_react.useCallback)(async (cliente) => {
		const created = await api("/pedidos", {
			method: "POST",
			body: JSON.stringify({
				cliente,
				items: carrito,
				subtotal,
				descuento,
				envio: envio(cliente.entrega),
				total: total(cliente.entrega),
				usuarioId: usuario?.id ?? null
			})
		});
		await recargar();
		setCarrito([]);
		setCupon(null);
		return created;
	}, [
		carrito,
		descuento,
		envio,
		total,
		usuario,
		recargar
	]);
	const cambiarEstado = (0, import_react.useCallback)((id, estado) => mutar(() => api(`/pedidos/${id}/estado`, {
		method: "PATCH",
		body: JSON.stringify({ estado })
	})), [mutar]);
	const guardarProducto = (0, import_react.useCallback)((p) => mutar(() => api("/productos", {
		method: "POST",
		body: JSON.stringify(p)
	})), [mutar]);
	const borrarProducto = (0, import_react.useCallback)((id) => mutar(() => api(`/productos/${id}`, { method: "DELETE" })), [mutar]);
	const actualizarStock = (0, import_react.useCallback)((id, stock) => mutar(() => api(`/productos/${id}/stock`, {
		method: "PATCH",
		body: JSON.stringify({ stock })
	})), [mutar]);
	const guardarCategoria = (0, import_react.useCallback)((c) => mutar(() => api("/categorias", {
		method: "POST",
		body: JSON.stringify(c)
	})), [mutar]);
	const borrarCategoria = (0, import_react.useCallback)(async (id) => {
		const body = await api(`/categorias/${id}`, { method: "DELETE" });
		await recargar();
		return body;
	}, [recargar]);
	const guardarCliente = (0, import_react.useCallback)((c) => mutar(() => api("/clientes", {
		method: "POST",
		body: JSON.stringify(c)
	})), [mutar]);
	const borrarCliente = (0, import_react.useCallback)((id) => mutar(() => api(`/clientes/${id}`, { method: "DELETE" })), [mutar]);
	const guardarDescuento = (0, import_react.useCallback)((d) => mutar(() => api("/descuentos", {
		method: "POST",
		body: JSON.stringify(d)
	})), [mutar]);
	const borrarDescuento = (0, import_react.useCallback)((id) => mutar(() => api(`/descuentos/${id}`, { method: "DELETE" })), [mutar]);
	const guardarNegocio = (0, import_react.useCallback)((n) => mutar(() => api("/negocio", {
		method: "PATCH",
		body: JSON.stringify(n)
	})), [mutar]);
	const agregarGasto = (0, import_react.useCallback)((g) => mutar(() => api("/gastos", {
		method: "POST",
		body: JSON.stringify(g)
	})), [mutar]);
	const editarGasto = (0, import_react.useCallback)((id, g) => mutar(() => api(`/gastos/${id}`, {
		method: "PATCH",
		body: JSON.stringify(g)
	})), [mutar]);
	const borrarGasto = (0, import_react.useCallback)((id) => mutar(() => api(`/gastos/${id}`, { method: "DELETE" })), [mutar]);
	const guardarPromo = (0, import_react.useCallback)((p) => mutar(() => api("/promos", {
		method: "POST",
		body: JSON.stringify(p)
	})), [mutar]);
	const borrarPromo = (0, import_react.useCallback)((codigo) => mutar(() => api(`/promos/${encodeURIComponent(codigo)}`, { method: "DELETE" })), [mutar]);
	const reset = (0, import_react.useCallback)(() => {
		setCarrito([]);
		setCupon(null);
	}, []);
	const value = {
		ready,
		db,
		negocio: db.negocio,
		categorias: db.categorias,
		productos: db.productos,
		clientes: db.clientes,
		descuentos: db.descuentos,
		promos: db.promos,
		pedidos: db.pedidos,
		gastos: db.gastos,
		usuario,
		carrito,
		cupon,
		cantidadCarrito: carrito.reduce((a, i) => a + i.cantidad, 0),
		subtotal,
		descuento,
		envio,
		total,
		productoPorSlug: (slug) => db.productos.find((p) => p.slug === slug),
		categoriaPorId: (id) => db.categorias.find((c) => c.id === id),
		descuentoDe,
		precioFinal,
		agregar,
		cambiarCantidad,
		quitar,
		vaciar,
		aplicarCupon,
		quitarCupon: () => setCupon(null),
		ingresar,
		registrar,
		cambiarClave,
		resetearClave,
		salir,
		crearPedido,
		cambiarEstado,
		guardarProducto,
		borrarProducto,
		actualizarStock,
		guardarCategoria,
		borrarCategoria,
		guardarCliente,
		borrarCliente,
		guardarDescuento,
		borrarDescuento,
		guardarNegocio,
		agregarGasto,
		editarGasto,
		borrarGasto,
		guardarPromo,
		borrarPromo,
		reset
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TikvaContext.Provider, {
		value,
		children
	});
}
function useTikva() {
	const ctx = (0, import_react.useContext)(TikvaContext);
	if (!ctx) throw new Error("useTikva debe usarse dentro de TikvaProvider");
	return ctx;
}
function mensajeWhatsapp(pedido, negocio) {
	return [
		`Hola ${negocio.nombre}! Quiero confirmar mi pedido *${pedido.id}*`,
		"",
		...pedido.items.map((i) => `• ${i.cantidad} x ${i.nombre} — $${i.precio * i.cantidad}`),
		"",
		`Subtotal: $${pedido.subtotal}`,
		pedido.descuento ? `Descuento: -$${pedido.descuento}` : null,
		`${pedido.cliente.entrega === "envio" ? `Envío: $${pedido.envio}` : "Retiro en persona"}`,
		`*Total: $${pedido.total}*`,
		"",
		`Nombre: ${pedido.cliente.nombre}`,
		`Teléfono: ${pedido.cliente.telefono}`,
		pedido.cliente.entrega === "envio" ? `Dirección: ${pedido.cliente.direccion}` : null,
		pedido.cliente.notas ? `Notas: ${pedido.cliente.notas}` : null
	].filter(Boolean).join("\n");
}
/** Número de respaldo por si el panel todavía no tiene cargado el WhatsApp. */
var WHATSAPP_FALLBACK = "5491156582298";
/**
* Deja solo los dígitos del número y, si no queda nada usable, devuelve el de
* respaldo. Sin esto un WhatsApp vacío generaba `https://wa.me/?text=...`,
* que WhatsApp rechaza y por lo tanto no abría ningún chat.
*/
function numeroWhatsapp(numero) {
	const limpio = String(numero ?? "").replace(/\D/g, "");
	return limpio.length >= 8 ? limpio : WHATSAPP_FALLBACK;
}
/** Link de WhatsApp listo para usar en un `href`, con mensaje ya escrito. */
function linkWhatsapp(numero, texto) {
	const base = `https://wa.me/${numeroWhatsapp(numero)}`;
	return texto ? `${base}?text=${encodeURIComponent(texto)}` : base;
}
/**
* Mensaje prellenado para escribir por un producto puntual: al tocar el botón
* de WhatsApp desde el detalle ya viaja el nombre, la cantidad y el precio.
*/
function mensajeProducto(producto, negocio, opciones) {
	const cantidad = opciones?.cantidad ?? 1;
	const precio = opciones?.precio ?? producto.precio;
	return (opciones?.avisoStock ? [
		`Hola ${negocio.nombre}! Quiero que me avisen cuando vuelva *${producto.nombre}*.`,
		"",
		"¿Me confirmás cuándo llega el próximo lote?"
	] : [
		`Hola ${negocio.nombre}! Me interesa este producto:`,
		"",
		`• ${cantidad} x ${producto.nombre}`,
		`Precio: $${precio.toLocaleString("es-AR")}`,
		opciones?.url ? `Link: ${opciones.url}` : null,
		"",
		"¿Está disponible?"
	]).filter(Boolean).join("\n");
}
var nav = [
	{
		to: "/",
		label: "Inicio"
	},
	{
		to: "/tienda",
		label: "Tienda"
	},
	{
		to: "/historia",
		label: "Nuestra historia"
	},
	{
		to: "/contacto",
		label: "Contacto"
	}
];
function SiteHeader() {
	const { cantidadCarrito, usuario, salir } = useTikva();
	const [open, setOpen] = (0, import_react.useState)(false);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-40 border-b border-border/70 bg-paper/85 backdrop-blur-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid h-20 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 md:h-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "rounded-full p-2 text-ink transition-colors hover:bg-secondary md:hidden",
						"aria-label": open ? "Cerrar menú" : "Abrir menú",
						onClick: () => setOpen((v) => !v),
						children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "ml-6 hidden items-center gap-7 md:flex",
						children: nav.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: n.to,
							activeOptions: { exact: n.to === "/" },
							className: "text-[15px] font-medium text-muted-foreground transition-colors hover:text-ink data-[status=active]:text-ink data-[status=active]:underline data-[status=active]:decoration-gold data-[status=active]:decoration-[3px] data-[status=active]:underline-offset-[10px]",
							children: n.label
						}, n.to))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "group select-none text-center leading-none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-marker -rotate-1 block text-[2rem] font-bold tracking-wide text-ink transition-transform duration-300 group-hover:-rotate-2 md:text-4xl",
						children: "Tikva"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1.5 block text-[8px] uppercase tracking-[0.34em] text-muted-foreground",
						children: "Regalería cristiana"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden items-center gap-2 sm:flex",
						children: usuario ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: usuario.rol === "admin" ? "/admin" : "/cuenta",
							className: "rounded-full border border-border px-4 py-2 text-xs font-medium tracking-wide transition-colors hover:bg-secondary",
							children: usuario.rol === "admin" ? "Panel" : usuario.nombre.split(" ")[0]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								salir();
								router.navigate({ to: "/" });
							},
							className: "text-xs text-muted-foreground hover:text-ink",
							children: "Salir"
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/ingresar",
							className: "rounded-full border border-border px-4 py-2 text-xs font-medium tracking-wide transition-colors hover:bg-secondary",
							children: "Ingresar"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/carrito",
						className: "relative flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-xs font-medium tracking-wide text-primary-foreground transition-transform hover:-translate-y-0.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "Carrito"
							}),
							cantidadCarrito > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-semibold text-ink shadow-sm",
								children: cantidadCarrito
							})
						]
					})]
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border bg-paper px-5 py-4 md:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3",
				children: [nav.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: n.to,
					onClick: () => setOpen(false),
					className: "py-1 text-[15px]",
					children: n.label
				}, n.to)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: usuario ? usuario.rol === "admin" ? "/admin" : "/cuenta" : "/ingresar",
					onClick: () => setOpen(false),
					className: "py-1 text-[15px] font-medium text-muted-foreground",
					children: usuario ? "Mi cuenta" : "Ingresar"
				})]
			})
		})]
	});
}
/**
* Logo de Instagram con su degradado original (amarillo → naranja → magenta →
* violeta). Reemplaza al `Instagram` de lucide-react, que es monocromo y no
* tiene los colores de la marca.
*
* El glifo (cuadrado redondeado + lente + punto) se dibuja con trazos
* geométricos y el degradado se aplica a los trazos, así se ve idéntico al
* logo real sin depender de archivos externos.
*/
function InstagramIcon({ className, title }) {
	const gradId = `ig-${(0, import_react.useId)().replace(/[^a-zA-Z0-9]/g, "")}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		xmlns: "http://www.w3.org/2000/svg",
		className,
		role: title ? "img" : void 0,
		"aria-hidden": title ? void 0 : true,
		focusable: "false",
		children: [
			title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { children: title }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
				id: gradId,
				gradientUnits: "userSpaceOnUse",
				x1: "2",
				y1: "22",
				x2: "22",
				y2: "2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "0%",
						stopColor: "#FEDA75"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "26%",
						stopColor: "#FA7E1E"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "52%",
						stopColor: "#D62976"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "76%",
						stopColor: "#962FBF"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "100%",
						stopColor: "#4F5BD5"
					})
				]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
				fill: "none",
				stroke: `url(#${gradId})`,
				strokeWidth: "2",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						x: "2",
						y: "2",
						width: "20",
						height: "20",
						rx: "5.6",
						ry: "5.6"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "12",
						cy: "12",
						r: "4.7"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "17.7",
						cy: "6.3",
						r: "1.15",
						fill: `url(#${gradId})`,
						stroke: "none"
					})
				]
			})
		]
	});
}
/**
* Medios de pago aceptados (Mercado Pago + las tarjetas que procesa en
* Argentina), dibujados como tarjetas con los colores originales de cada marca.
*
* Son SVG locales: no dependen de imágenes externas que puedan caerse y se
* adaptan al tema (el borde usa `currentColor`).
*/
var FONT = "Helvetica Neue, Helvetica, Arial, sans-serif";
var CARDSIZES = "h-8 w-[52px]";
/** Marco de tarjeta: fondo redondeado + borde sutil que hereda el color del sitio. */
function CardShape({ fill }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
		x: "0.5",
		y: "0.5",
		width: "51",
		height: "31",
		rx: "4",
		fill,
		stroke: "currentColor",
		strokeOpacity: "0.18"
	});
}
function MercadoPago({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 52 32",
		className,
		role: "img",
		"aria-label": "Mercado Pago",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardShape, { fill: "#009EE3" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "26",
				y: "14.5",
				textAnchor: "middle",
				fontFamily: FONT,
				fontSize: "9.5",
				fontWeight: "700",
				fill: "#fff",
				children: "Mercado"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "26",
				y: "25.5",
				textAnchor: "middle",
				fontFamily: FONT,
				fontSize: "9.5",
				fontWeight: "700",
				fill: "#fff",
				children: "Pago"
			})
		]
	});
}
function Visa({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 52 32",
		className,
		role: "img",
		"aria-label": "Visa",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardShape, { fill: "#fff" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: "26",
			y: "22.5",
			textAnchor: "middle",
			fontFamily: FONT,
			fontSize: "17",
			fontStyle: "italic",
			fontWeight: "700",
			letterSpacing: "0.5",
			fill: "#1A1F71",
			children: "VISA"
		})]
	});
}
function Mastercard({ className }) {
	const lensId = `mc-${(0, import_react.useId)().replace(/[^a-zA-Z0-9]/g, "")}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 52 32",
		className,
		role: "img",
		"aria-label": "Mastercard",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardShape, { fill: "#fff" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("clipPath", {
				id: lensId,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "20",
					cy: "14",
					r: "8.5"
				})
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "20",
				cy: "14",
				r: "8.5",
				fill: "#EB001B"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "32",
				cy: "14",
				r: "8.5",
				fill: "#F79E1B"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "32",
				cy: "14",
				r: "8.5",
				fill: "#FF5F00",
				clipPath: `url(#${lensId})`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "26",
				y: "29.5",
				textAnchor: "middle",
				fontFamily: FONT,
				fontSize: "6.4",
				fontWeight: "600",
				fill: "#231F20",
				children: "mastercard"
			})
		]
	});
}
function NaranjaX({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 52 32",
		className,
		role: "img",
		"aria-label": "Naranja X",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardShape, { fill: "#fff" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: "26",
			y: "20.5",
			textAnchor: "middle",
			fontFamily: FONT,
			fontSize: "9.5",
			fontWeight: "700",
			fill: "#FF5A00",
			children: "Naranja X"
		})]
	});
}
function PaymentMethods({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs font-medium text-ink",
				children: ["Pagá con ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[#009EE3]",
					children: "Mercado Pago"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-[11px] leading-relaxed text-muted-foreground",
				children: "Tarjetas de crédito y débito de todos los bancos."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap items-center gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MercadoPago, { className: CARDSIZES }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Visa, { className: CARDSIZES }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mastercard, { className: CARDSIZES }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NaranjaX, { className: CARDSIZES })
				]
			})
		]
	});
}
/**
* Logo oficial de WhatsApp (glifo de marca).
*
* lucide-react no incluye logos de marcas, así que usábamos el genérico
* `MessageCircle`. Este componente dibuja el glifo real de WhatsApp para que
* la clienta reconozca al toque el canal y gane confianza.
*
* Hereda el color con `currentColor`: usalo con `text-[#25D366]` para el verde
* de marca, o `text-white` sobre un fondo verde.
*/
function WhatsAppIcon({ className, title }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		fill: "currentColor",
		xmlns: "http://www.w3.org/2000/svg",
		className,
		role: title ? "img" : void 0,
		"aria-hidden": title ? void 0 : true,
		focusable: "false",
		children: [title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { children: title }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" })]
	});
}
var tikva_historia_default = "/assets/tikva-historia-D9Fx-ll0.jpeg";
var tikva_testimonio_default = "/assets/tikva-testimonio-DBTj0Jyx.jpeg";
var tikva_logo_default = "/assets/tikva-logo-C9Pcx6wi.png";
var HERO_IMG = "/assets/tikva-hero-WnlYAXHg.png";
var LOGO_IMG = tikva_logo_default;
var NOTA_IMG = tikva_testimonio_default;
var IMG = {
	"frasco-365": tikva_historia_default,
	packs: tikva_historia_default,
	anotadores: tikva_testimonio_default,
	separadores: tikva_testimonio_default,
	nota: tikva_testimonio_default
};
/**
* Resuelve la imagen de un producto:
* - data-URLs y URLs (las de Cloudinary, subidas desde el panel) se devuelven tal cual
* - claves conocidas (semilla) se mapean a los assets locales
* - cualquier otra cosa cae a la imagen de respaldo
*/
var productImage = (src) => {
	if (!src) return tikva_historia_default;
	if (src.startsWith("data:") || src.startsWith("http") || src.startsWith("/")) return src;
	return IMG[src] ?? tikva_historia_default;
};
function SiteFooter() {
	const { negocio } = useTikva();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "mt-24 border-t border-border bg-paper-deep/60",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: LOGO_IMG,
						alt: "Tikva",
						width: 44,
						height: 44,
						className: "h-11 w-11 rounded-full",
						loading: "lazy"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl",
						children: "Tikva"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground",
					children: "Tikva significa esperanza. Regalería cristiana hecha a mano en Buenos Aires: frascos con versículos, papelería y packs para regalar Palabra."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "Tienda"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-col gap-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/tienda",
							className: "text-muted-foreground hover:text-ink",
							children: "Productos"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/carrito",
							className: "text-muted-foreground hover:text-ink",
							children: "Carrito"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/cuenta",
							className: "text-muted-foreground hover:text-ink",
							children: "Mis pedidos"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/historia",
							className: "text-muted-foreground hover:text-ink",
							children: "Nuestra historia"
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "Escribinos"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-col gap-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: linkWhatsapp(negocio.whatsapp),
								target: "_blank",
								rel: "noreferrer",
								className: "inline-flex items-center gap-2 text-muted-foreground hover:text-ink",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppIcon, { className: "h-4 w-4 text-[#25D366]" }), negocio.whatsappVisible || numeroWhatsapp(negocio.whatsapp)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `https://instagram.com/${negocio.instagram}`,
								target: "_blank",
								rel: "noreferrer",
								className: "inline-flex items-center gap-2 text-muted-foreground hover:text-ink",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InstagramIcon, { className: "h-4 w-4" }),
									" @",
									negocio.instagram
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: "Envíos a todo el país · Retiro en CABA"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentMethods, { className: "mt-6 border-t border-border/70 pt-5" })
				] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
			className: "mx-auto flex max-w-6xl items-center justify-between border-t border-border/70 px-5 py-5 text-xs text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
				"© ",
				(/* @__PURE__ */ new Date()).getFullYear(),
				" Tikva Regalería Cristiana · Hecho a mano, con esperanza."
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Desarrollado por Clik — Tikva" })]
		})]
	});
}
function WhatsAppFab() {
	const { negocio, ready } = useTikva();
	if (!ready || typeof window === "undefined") return null;
	if (window.location.pathname.startsWith("/admin")) return null;
	const href = linkWhatsapp(negocio.whatsapp, `Hola ${negocio.nombre}! Me interesa conocer los productos. ¿Me pasás más información?`);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href,
		target: "_blank",
		rel: "noreferrer",
		"aria-label": "Escribinos por WhatsApp",
		className: "fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppIcon, { className: "h-8 w-8" })
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "Tikva"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-display text-4xl",
					children: "No encontramos esta página"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: "Puede que el enlace haya cambiado. Volvé al inicio y seguimos desde ahí."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm text-primary-foreground",
						children: "Ir al inicio"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl",
					children: "Esta página no cargó"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Probá de nuevo o volvé al inicio."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "rounded-full bg-ink px-5 py-2.5 text-sm text-primary-foreground",
						children: "Reintentar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "rounded-full border border-input px-5 py-2.5 text-sm",
						children: "Ir al inicio"
					})]
				})
			]
		})
	});
}
var Route$10 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Tikva · Regalería Cristiana" },
			{
				name: "description",
				content: "Frascos con 365 versículos, papelería y packs de regalo hechos a mano. Tikva, regalería cristiana en Buenos Aires."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400&family=Karla:wght@300..600&display=swap"
			},
			{
				rel: "icon",
				type: "image/png",
				href: "/favicon.png"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "es",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$10.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TikvaProvider, {
			backendUrl: "/api",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-screen flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppFab, {})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})]
		})
	});
}
var $$splitComponentImporter$9 = () => import("./routes-Dvg1QT5W.mjs");
var Route$9 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Tikva · Frascos con 365 versículos y regalería cristiana" },
		{
			name: "description",
			content: "Regalá esperanza: frascos con 365 versículos enrollados a mano, papelería devocional y packs listos para entregar. Envíos a todo el país."
		},
		{
			property: "og:title",
			content: "Tikva · Regalería Cristiana hecha a mano"
		},
		{
			property: "og:description",
			content: "Frascos con 365 versículos, papelería devocional y packs de regalo."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./admin-CuH5Sf8D.mjs");
var Route$8 = createFileRoute("/admin")({
	head: () => ({ meta: [
		{ title: "Panel · Tikva" },
		{
			name: "description",
			content: "Panel interno de Tikva: ventas, stock, gastos y promos."
		},
		{
			name: "robots",
			content: "noindex"
		},
		{
			property: "og:title",
			content: "Panel · Tikva"
		},
		{
			property: "og:description",
			content: "Gestión interna del negocio."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./carrito-CBWeCZhn.mjs");
var Route$7 = createFileRoute("/carrito")({
	head: () => ({ meta: [
		{ title: "Tu carrito · Tikva" },
		{
			name: "description",
			content: "Revisá tu pedido, aplicá promos y seguí al checkout."
		},
		{
			property: "og:title",
			content: "Tu carrito · Tikva"
		},
		{
			property: "og:description",
			content: "Revisá tu pedido antes de confirmarlo."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./checkout-DudPsVJT.mjs");
var Route$6 = createFileRoute("/checkout")({
	head: () => ({ meta: [
		{ title: "Checkout · Tikva" },
		{
			name: "description",
			content: "Completá tus datos y confirmá el pedido por WhatsApp."
		},
		{
			property: "og:title",
			content: "Checkout · Tikva"
		},
		{
			property: "og:description",
			content: "Últimos datos para preparar tu pedido."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./contacto-DdXIHahF.mjs");
var Route$5 = createFileRoute("/contacto")({
	head: () => ({ meta: [
		{ title: "Contacto · Tikva" },
		{
			name: "description",
			content: "Escribinos por WhatsApp o Instagram para pedidos a medida, packs para eventos y consultas."
		},
		{
			property: "og:title",
			content: "Contacto · Tikva"
		},
		{
			property: "og:description",
			content: "Pedidos a medida y packs para eventos."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./cuenta-BwIVdZm3.mjs");
var Route$4 = createFileRoute("/cuenta")({
	head: () => ({ meta: [
		{ title: "Mis pedidos · Tikva" },
		{
			name: "description",
			content: "Seguí el estado de tus pedidos Tikva."
		},
		{
			property: "og:title",
			content: "Mis pedidos · Tikva"
		},
		{
			property: "og:description",
			content: "Historial y estado de tus pedidos."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./historia-DT1EOq52.mjs");
var Route$3 = createFileRoute("/historia")({
	head: () => ({ meta: [
		{ title: "Nuestra historia · Tikva" },
		{
			name: "description",
			content: "Tikva nació para regalar esperanza: frascos con versículos y papelería hecha a mano en Buenos Aires."
		},
		{
			property: "og:title",
			content: "Nuestra historia · Tikva"
		},
		{
			property: "og:description",
			content: "Cómo nació Tikva y por qué cada frasco se arma a mano."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./ingresar-jInToOTq.mjs");
var Route$2 = createFileRoute("/ingresar")({
	head: () => ({ meta: [
		{ title: "Ingresar · Tikva" },
		{
			name: "description",
			content: "Entrá a tu cuenta Tikva para ver tus pedidos."
		},
		{
			property: "og:title",
			content: "Ingresar · Tikva"
		},
		{
			property: "og:description",
			content: "Accedé a tu cuenta y seguí tus pedidos."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./tienda-Cjwgmmxq.mjs");
var Route$1 = createFileRoute("/tienda")({
	head: () => ({ meta: [
		{ title: "Tienda · Tikva Regalería Cristiana" },
		{
			name: "description",
			content: "Frascos con versículos, anotadores, agendas, separadores y stickers. Comprá online y coordinamos la entrega por WhatsApp."
		},
		{
			property: "og:title",
			content: "Tienda Tikva"
		},
		{
			property: "og:description",
			content: "Frascos con versículos y papelería devocional."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitNotFoundComponentImporter = () => import("./producto._slug-73hQIOFk.mjs");
var $$splitComponentImporter = () => import("./producto._slug-C38_xALO.mjs");
var Route = createFileRoute("/producto/$slug")({
	head: () => ({ meta: [
		{ title: "Producto · Tikva" },
		{
			name: "description",
			content: "Detalle del producto, stock y compra por WhatsApp."
		},
		{
			property: "og:title",
			content: "Producto · Tikva"
		},
		{
			property: "og:description",
			content: "Regalería cristiana hecha a mano."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
var rootRouteChildren = {
	IndexRoute: Route$9.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$10
	}),
	AdminRoute: Route$8.update({
		id: "/admin",
		path: "/admin",
		getParentRoute: () => Route$10
	}),
	CarritoRoute: Route$7.update({
		id: "/carrito",
		path: "/carrito",
		getParentRoute: () => Route$10
	}),
	CheckoutRoute: Route$6.update({
		id: "/checkout",
		path: "/checkout",
		getParentRoute: () => Route$10
	}),
	ContactoRoute: Route$5.update({
		id: "/contacto",
		path: "/contacto",
		getParentRoute: () => Route$10
	}),
	CuentaRoute: Route$4.update({
		id: "/cuenta",
		path: "/cuenta",
		getParentRoute: () => Route$10
	}),
	HistoriaRoute: Route$3.update({
		id: "/historia",
		path: "/historia",
		getParentRoute: () => Route$10
	}),
	IngresarRoute: Route$2.update({
		id: "/ingresar",
		path: "/ingresar",
		getParentRoute: () => Route$10
	}),
	TiendaRoute: Route$1.update({
		id: "/tienda",
		path: "/tienda",
		getParentRoute: () => Route$10
	}),
	ProductoSlugRoute: Route.update({
		id: "/producto/$slug",
		path: "/producto/$slug",
		getParentRoute: () => Route$10
	})
};
var routeTree = Route$10._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { NOTA_IMG as a, InstagramIcon as c, mensajeProducto as d, mensajeWhatsapp as f, useTikva as h, LOGO_IMG as i, api as l, textoDescuento as m, Route as n, productImage as o, numeroWhatsapp as p, HERO_IMG as r, WhatsAppIcon as s, router_exports as t, linkWhatsapp as u };
