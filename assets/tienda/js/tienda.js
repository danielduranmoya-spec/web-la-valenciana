/* =========================================================
   LA VALENCIANA v2 · tienda.js · PROPIETARIO: SUP-B
   Estado de la cesta (sin UI). La UI de la cesta es de B6 (LV.cesta).
   Cada cambio emite en `document` el evento `lv:cesta-cambiada`.
   ========================================================= */
window.LV = window.LV || {};
LV.tienda = (() => {
"use strict";
const D = LV.datos, U = LV.util;
const CLAVE = "lv-cesta-v2", CLAVE_PEDIDO = "lv-ultimo-pedido";

/* Línea guardada: {k:"id|variante|medida", id, v:"Rojo", m:"25 mm" | "", q:1.5} */
let lineas = [];
let ultimoQuitado = null;      // {linea, idx} para «Deshacer»
const r2 = n => Math.round((n + Number.EPSILON) * 100) / 100;

function cargar(){
  let l = U.leer(CLAVE, null);
  if (!Array.isArray(l)) {
    // migración desde la v1 ("lv-cesta" con campo t para la medida)
    const v1 = U.leer("lv-cesta", []);
    l = Array.isArray(v1) ? v1.map(x => x && ({id:x.id, v:x.v, m:x.t||"", q:x.q})) : [];
  }
  lineas = l.filter(x => x && D.PORID[x.id] && +x.q > 0).map(x => {
    const prod = D.PORID[x.id];
    const v = prod.variantes.some(y => y.n === x.v) ? x.v : prod.variantes[0].n;
    const m = prod.medidas.includes(x.m) ? x.m : (prod.medidas[0] || "");
    return { k: clave(x.id, v, m), id: x.id, v, m, q: U.ajustarCantidad(prod, x.q) };
  });
}
const clave = (id, v, m) => [id, v||"", m||""].join("|");
const guardarYAvisar = (accion, extra={}) => {
  U.guardar(CLAVE, lineas.map(({k,id,v,m,q}) => ({k,id,v,m,q})));
  document.dispatchEvent(new CustomEvent("lv:cesta-cambiada", { detail: { accion, articulos: articulos(), subtotal: subtotal(), ...extra } }));
};

/** Línea enriquecida (copia): añade prod, vi (índice de variante), precioUd, importe, textoCantidad, textoVersion */
function enriquecer(l){
  const prod = D.PORID[l.id], precioUd = D.precioDe(prod, l.v);
  const partes = [];
  if (prod.variantes.length > 1 || prod.tipoVar === "color") partes.push(l.v);
  if (l.m) partes.push(l.m);
  return { ...l, prod, vi: D.idxVariante(prod, l.v), precioUd,
    importe: r2(precioUd * l.q),
    textoCantidad: U.textoCantidad(prod, l.q),
    textoVersion: partes.join(" · ") };
}

/* ---------------- API pública ---------------- */
/** Copia de las líneas, enriquecidas, en orden de inserción. */
const lista = () => lineas.map(enriquecer);
const linea = k => { const l = lineas.find(x => x.k === k); return l ? enriquecer(l) : null; };
/** Número de artículos: cada línea por metros cuenta 1; las demás, su cantidad. */
const articulos = () => lineas.reduce((s, l) => s + (D.PORID[l.id].porMetro ? 1 : l.q), 0);
const numLineas = () => lineas.length;
const vacia = () => lineas.length === 0;
/** Suma de los importes de cada línea (cada importe ya redondeado a céntimos, como se muestra). */
const subtotal = () => r2(lineas.reduce((s, l) => s + r2(D.precioDe(D.PORID[l.id], l.v) * l.q), 0));
/** Gastos de envío: modo "tienda" (recogida) → 0; "casa" → 4,95 € salvo subtotal ≥ 50 € o cesta vacía. */
const envio = (modo = "casa") => (modo === "tienda" || vacia() || subtotal() >= D.TIENDA.envioGratis) ? 0 : D.TIENDA.envio;
const total = (modo = "casa") => r2(subtotal() + envio(modo));
/** Lo que falta para el envío gratis (0 si ya lo tiene). */
const faltaEnvioGratis = () => Math.max(0, r2(D.TIENDA.envioGratis - subtotal()));
/** Progreso hacia el envío gratis, de 0 a 1. */
const progresoEnvio = () => Math.min(1, subtotal() / D.TIENDA.envioGratis);
/** Cantidad total de un producto en la cesta (todas sus versiones). */
const cantidadDe = id => lineas.filter(l => l.id === id).reduce((s, l) => s + l.q, 0);

/**
 * Añade a la cesta. variante y medida son NOMBRES (p. ej. "Rojo", "25 mm"); si faltan, se usa la primera.
 * cantidad se ajusta al paso del producto (0,5 m en metros) y al máximo (20 ud. / 50 m) por línea.
 * origenEl: elemento desde el que se añadió (para animaciones / mini-panel; puede ser null).
 * → {linea (enriquecida), limitado:boolean}
 * Evento: lv:cesta-cambiada {accion:"anadir", linea, cantidad, limitado, origenEl}
 */
function anadir(id, variante, medida, cantidad = 1, origenEl = null){
  const prod = D.PORID[id];
  if (!prod) { console.error("[LV.tienda] producto desconocido:", id); return null; }
  const v = prod.variantes.some(x => x.n === variante) ? variante : prod.variantes[0].n;
  const m = prod.medidas.includes(medida) ? medida : (prod.medidas[0] || "");
  const q = U.ajustarCantidad(prod, cantidad);
  const k = clave(id, v, m);
  let l = lineas.find(x => x.k === k);
  let limitado = false;
  if (l) { const nueva = l.q + q; limitado = nueva > prod.max; l.q = U.ajustarCantidad(prod, nueva); }
  else { l = { k, id, v, m, q }; lineas.push(l); }
  const e = enriquecer(l);
  guardarYAvisar("anadir", { linea: e, cantidad: q, limitado, origenEl });
  return { linea: e, limitado };
}
/** Fija la cantidad de una línea. q ≤ 0 → la quita (como quitar()). */
function cambiar(k, q){
  const l = lineas.find(x => x.k === k); if (!l) return null;
  if (+q <= 0) return quitar(k);
  const prod = D.PORID[l.id];
  const limitado = +q > prod.max;
  l.q = U.ajustarCantidad(prod, q);
  const e = enriquecer(l);
  guardarYAvisar("cambiar", { linea: e, limitado });
  return e;
}
/** Suma o resta pasos: sumar(k, +1) añade 1 ud. o 0,5 m; sumar(k, -1) resta. Bajo el mínimo → quita. */
function sumar(k, pasos){
  const l = lineas.find(x => x.k === k); if (!l) return null;
  const prod = D.PORID[l.id], q = Math.round((l.q + pasos * prod.paso) * 100) / 100;
  return q < prod.min ? quitar(k) : cambiar(k, q);
}
/** Quita una línea. Guarda para deshacer(). → línea quitada (enriquecida) o null */
function quitar(k){
  const idx = lineas.findIndex(x => x.k === k); if (idx < 0) return null;
  const [l] = lineas.splice(idx, 1);
  ultimoQuitado = { linea: l, idx };
  const e = enriquecer(l);
  guardarYAvisar("quitar", { linea: e, idx });
  return e;
}
/** Deshace el último quitar() (lo repone en su sitio). → línea o null */
function deshacer(){
  if (!ultimoQuitado) return null;
  const { linea: l, idx } = ultimoQuitado; ultimoQuitado = null;
  const ya = lineas.find(x => x.k === l.k);
  if (ya) ya.q = U.ajustarCantidad(D.PORID[l.id], ya.q + l.q); else lineas.splice(Math.min(idx, lineas.length), 0, l);
  const e = enriquecer(ya || l);
  guardarYAvisar("deshacer", { linea: e });
  return e;
}
const puedeDeshacer = () => !!ultimoQuitado;
/** Vacía la cesta. */
function vaciar(){ lineas = []; ultimoQuitado = null; guardarYAvisar("vaciar"); }

/**
 * Recomendaciones para la cesta: productos de las subcategorías de COMBINA de lo que hay,
 * que no estén ya en la cesta. Si la cesta está vacía → DESTACADOS. → [prod]
 */
function recomendaciones(n = 2){
  const dentro = new Set(lineas.map(l => l.id));
  if (!lineas.length) return D.DESTACADOS.map(D.producto).slice(0, n);
  const out = [];
  for (const l of [...lineas].reverse()) {
    for (const p of D.aJuego(D.PORID[l.id], 6, [...dentro, ...out.map(x => x.id)])) {
      if (out.length >= n) break;
      out.push(p);
    }
    if (out.length >= n) break;
  }
  return out;
}

/* ---------------- pedido ---------------- */
const NOMBRE_PAGO = { tarjeta: "con tarjeta o PayPal en la web (importe reservado)", whatsapp: "al recoger o por Bizum (lo confirmamos por WhatsApp)", correo: "al recoger o por Bizum (lo confirmamos por correo)", enlace: "con el enlace de pago que me enviéis", tienda: "al recoger en la tienda", tarjeta: "tarjeta", bizum: "Bizum", paypal: "PayPal" };
/**
 * Texto del pedido para WhatsApp.
 * datos: {nombre, tel, email?, entrega:"tienda"|"casa", dir?, cp?, loc?, pago?:"whatsapp"|"enlace"|…, notas?}
 */
function textoPedido(datos = {}){
  const modo = datos.entrega === "casa" ? "casa" : "tienda", env = envio(modo);
  const filas = lista().map(l => {
    const cant = l.prod.porMetro ? `${U.num(l.q)} m de` : `${U.num(l.q)} ×`;
    return `• ${cant} ${l.prod.nombre.replace(/ \(metro\)$/, "")}${l.textoVersion ? ` (${l.textoVersion})` : ""}: ${U.euros(l.importe)}`;
  });
  return [
    datos.ref ? `Pedido ${datos.ref} en La Valenciana:` : "Hola, quiero hacer este pedido en La Valenciana:", "",
    ...filas, "",
    `Productos: ${U.euros(subtotal())}`,
    `Envío: ${modo === "tienda" ? "recojo en la tienda (gratis)" : env ? U.euros(env) : "gratis"}`,
    `Total: ${U.euros(total(modo))}`, "",
    modo === "casa" ? `Entrega: envío a ${[datos.dir, [datos.cp, datos.loc].filter(Boolean).join(" ")].filter(Boolean).join(", ")}` : "Entrega: recojo en la tienda",
    datos.pago ? `Pago: ${NOMBRE_PAGO[datos.pago] || datos.pago}` : null,
    datos.nombre ? `Nombre: ${datos.nombre}` : null,
    datos.tel ? `Teléfono: ${datos.tel}` : null,
    datos.email ? `Correo: ${datos.email}` : null,
    datos.notas ? `Notas: ${datos.notas}` : null
  ].filter(x => x !== null).join("\n");
}
/** Guarda una instantánea del pedido (para #/pedido/hecho, sobrevive a recargar). → pedido */
function guardarPedido(datos){
  const modo = datos.entrega === "casa" ? "casa" : "tienda";
  const ped = { fecha: new Date().toISOString(), datos, lineas: lista().map(({k,id,v,m,q,importe,textoVersion,textoCantidad}) => ({k,id,v,m,q,importe,textoVersion,textoCantidad,nombre:D.PORID[id].nombre})),
    subtotal: subtotal(), envio: envio(modo), total: total(modo), texto: textoPedido(datos), whatsURL: U.whatsURL(textoPedido(datos)) };
  U.guardar(CLAVE_PEDIDO, ped);
  return ped;
}
const ultimoPedido = () => U.leer(CLAVE_PEDIDO, null);
/** Correo de pedidos según lo que lleve: Complementos, Mercería (y Cápsulas) o los dos. */
function correoPedido(ls){
  const cats = new Set((ls || lineas).map(l => (D.PORID[l.id] || {}).cat));
  const T = D.TIENDA, a = [];
  if (cats.has("merceria") || cats.has("capsulas") || !cats.has("complementos")) a.push(T.correoMerceria);
  if (cats.has("complementos")) a.push(T.correoComplementos);
  return a.join(",");
}

/** Inicialización: carga del almacenamiento y emite {accion:"cargar"}. La llama arranque.js. */
function iniciar(){
  cargar();
  guardarYAvisar("cargar");
  // otra pestaña cambió la cesta
  window.addEventListener("storage", e => { if (e.key === CLAVE) { cargar(); document.dispatchEvent(new CustomEvent("lv:cesta-cambiada", { detail: { accion: "cargar", articulos: articulos(), subtotal: subtotal() } })); } });
}
cargar();

return Object.freeze({
  iniciar, lista, linea, articulos, numLineas, vacia, subtotal, envio, total,
  faltaEnvioGratis, progresoEnvio, cantidadDe,
  anadir, cambiar, sumar, quitar, deshacer, puedeDeshacer, vaciar,
  recomendaciones, textoPedido, guardarPedido, ultimoPedido, correoPedido
});
})();
