import { r as __toESM } from "../_runtime.mjs";
import { f as require_jsx_runtime, p as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { f as mensajeWhatsapp, h as useTikva, s as WhatsAppIcon, u as linkWhatsapp } from "./router-DMPxSAz3.mjs";
import { n as money } from "./format-C7TA0ORf.mjs";
import { n as objectType, r as stringType, t as enumType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-DudPsVJT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var schema = objectType({
	nombre: stringType().trim().min(2, "Ingresá tu nombre").max(80),
	telefono: stringType().trim().min(6, "Ingresá un teléfono válido").max(25),
	email: stringType().trim().email("Email inválido").max(120),
	entrega: enumType(["envio", "retiro"]),
	direccion: stringType().trim().max(160),
	notas: stringType().trim().max(300)
});
function Checkout() {
	const { carrito, subtotal, descuento, envio, total, crearPedido, negocio, usuario } = useTikva();
	const [entrega, setEntrega] = (0, import_react.useState)("envio");
	const [errores, setErrores] = (0, import_react.useState)({});
	const [pedido, setPedido] = (0, import_react.useState)(null);
	const [enviando, setEnviando] = (0, import_react.useState)(false);
	if (pedido) {
		const texto = mensajeWhatsapp(pedido, negocio);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl px-5 py-20 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "Paso 3 de 3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-4 font-display text-4xl",
					children: [
						"Pedido ",
						pedido.id,
						" registrado"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm leading-relaxed text-muted-foreground",
					children: "Ya reservamos tu pedido y descontamos el stock. El último paso es confirmarlo por WhatsApp, donde coordinamos el pago (transferencia o efectivo) y la entrega."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 paper-card label-notch p-6 text-left",
					children: [
						pedido.items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between py-1 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [
									i.cantidad,
									" x ",
									i.nombre
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(i.precio * i.cantidad) })]
						}, i.id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-4 hairline" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between font-display text-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(pedido.total) })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: linkWhatsapp(negocio.whatsapp, texto),
					target: "_blank",
					rel: "noreferrer",
					className: "mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm text-primary-foreground transition-transform hover:-translate-y-0.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppIcon, { className: "h-4 w-4" }), "Confirmar por WhatsApp"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/cuenta",
						className: "text-sm underline underline-offset-8",
						children: "Ver mis pedidos"
					})
				})
			]
		});
	}
	if (carrito.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl px-5 py-24 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: "Tu carrito está vacío"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/tienda",
			className: "mt-6 inline-flex text-sm underline underline-offset-8",
			children: "Ir a la tienda"
		})]
	});
	const onSubmit = async (e) => {
		e.preventDefault();
		if (enviando) return;
		const fd = new FormData(e.currentTarget);
		const data = {
			nombre: String(fd.get("nombre") ?? ""),
			telefono: String(fd.get("telefono") ?? ""),
			email: String(fd.get("email") ?? ""),
			entrega,
			direccion: String(fd.get("direccion") ?? ""),
			notas: String(fd.get("notas") ?? "")
		};
		const parsed = schema.safeParse(data);
		if (!parsed.success) {
			const errs = {};
			parsed.error.issues.forEach((i) => errs[String(i.path[0])] = i.message);
			setErrores(errs);
			return;
		}
		if (entrega === "envio" && parsed.data.direccion.length < 6) {
			setErrores({ direccion: "Necesitamos la dirección para el envío" });
			return;
		}
		setErrores({});
		setEnviando(true);
		try {
			const nuevo = await crearPedido(parsed.data);
			setPedido(nuevo);
		} catch (err) {
			toast.error("No se pudo registrar el pedido", { description: err?.message ?? "Revisá tu conexión e intentá de nuevo." });
		} finally {
			setEnviando(false);
		}
	};
	const field = "mt-2 w-full border border-input bg-card px-3.5 py-2.5 text-sm outline-none focus:border-sky-deep";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-5 py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: "Paso 2 de 3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl",
				children: "Tus datos"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "paper-card label-notch p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg",
							children: "Contacto"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid gap-4 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-xs uppercase tracking-widest text-muted-foreground",
									children: [
										"Nombre y apellido",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											name: "nombre",
											defaultValue: usuario?.nombre ?? "",
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
									className: "text-xs uppercase tracking-widest text-muted-foreground",
									children: [
										"WhatsApp",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											name: "telefono",
											maxLength: 25,
											placeholder: "11 5555 5555",
											className: field
										}),
										errores["telefono"] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-1 block text-[11px] normal-case tracking-normal text-destructive",
											children: errores["telefono"]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-xs uppercase tracking-widest text-muted-foreground sm:col-span-2",
									children: [
										"Email",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											name: "email",
											defaultValue: usuario?.email.includes("@") ? usuario.email : "",
											maxLength: 120,
											className: field
										}),
										errores["email"] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mt-1 block text-[11px] normal-case tracking-normal text-destructive",
											children: errores["email"]
										})
									]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "paper-card label-notch p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg",
								children: "Entrega"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 grid gap-3 sm:grid-cols-2",
								children: [{
									v: "envio",
									t: "Envío a domicilio",
									d: `${money(negocio.envioCosto)} · gratis desde ${money(negocio.envioGratisDesde)}`
								}, {
									v: "retiro",
									t: "Retiro en CABA",
									d: "Coordinamos punto y horario"
								}].map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setEntrega(o.v),
									className: `border p-4 text-left transition-colors ${entrega === o.v ? "border-ink bg-secondary" : "border-border hover:border-ink"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-sm",
										children: o.t
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block text-xs text-muted-foreground",
										children: o.d
									})]
								}, o.v))
							}),
							entrega === "envio" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-4 block text-xs uppercase tracking-widest text-muted-foreground",
								children: [
									"Dirección, localidad y CP",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										name: "direccion",
										maxLength: 160,
										className: field
									}),
									errores["direccion"] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block text-[11px] normal-case tracking-normal text-destructive",
										children: errores["direccion"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-4 block text-xs uppercase tracking-widest text-muted-foreground",
								children: ["Dedicatoria o notas (opcional)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									name: "notas",
									rows: 3,
									maxLength: 300,
									className: field
								})]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "paper-card label-notch h-fit p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl",
							children: "Tu pedido"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 space-y-1.5 text-sm",
							children: carrito.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: [
										i.cantidad,
										" x ",
										i.nombre
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(i.precio * i.cantidad) })]
							}, i.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-4 hairline" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 text-sm",
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
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Descuento" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["-", money(descuento)] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Envío"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: envio(entrega) === 0 ? "Sin cargo" : money(envio(entrega)) })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex items-baseline justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "eyebrow",
								children: "Total"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-2xl",
								children: money(total(entrega))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							disabled: enviando,
							className: "mt-6 w-full rounded-full bg-ink py-3 text-sm text-primary-foreground disabled:opacity-60",
							children: enviando ? "Generando pedido…" : "Generar pedido"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-[11px] leading-relaxed text-muted-foreground",
							children: "En el próximo paso te abrimos WhatsApp con el detalle listo para enviar."
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { Checkout as component };
