//#region node_modules/.nitro/vite/services/ssr/assets/format-C7TA0ORf.js
var money = (n) => new Intl.NumberFormat("es-AR", {
	style: "currency",
	currency: "ARS",
	maximumFractionDigits: 0
}).format(n);
var fecha = (iso) => new Intl.DateTimeFormat("es-AR", {
	day: "2-digit",
	month: "short",
	year: "numeric"
}).format(new Date(iso));
//#endregion
export { money as n, fecha as t };
