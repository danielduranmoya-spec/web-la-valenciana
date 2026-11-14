/* =========================================================
   LA VALENCIANA · remoto.js
   Une la tienda con la base de datos (Supabase) que se gestiona desde /trastienda/.
   - Al arrancar, trae precios, stock, visibilidad, ofertas, productos nuevos y ajustes,
     y los aplica sobre el catálogo de datos.js. Si la base no responde en 3 s,
     la tienda funciona igual con datos.js.
   - Registra cada pedido con crear_pedido() (la base recalcula precios y descuenta stock).
   API: LV.remoto.listo → Promise · LV.remoto.pedido(datos, extra) → Promise<{ref,total}|null>
   ========================================================= */
window.LV = window.LV || {};
LV.remoto = (() => {
"use strict";
const cfg = window.LV_DB || {};
const D = LV.datos;
const cab = () => ({ apikey: cfg.clave, "Content-Type": "application/json" });
const COLS = "id,cat,sub,nombre,precio,icono,descripcion,variantes,tipo_var,medidas,tipo_medida,por_metro,precios,etiqueta,detalles,destacado,novedad,oferta,uds,umbral,orden";
let conectado = false;

function pedir(ruta, opciones = {}){
  return fetch(cfg.url + "/rest/v1/" + ruta, { ...opciones, headers: { ...cab(), ...(opciones.headers || {}) } })
    .then(r => r.ok ? r.json() : r.text().then(t => { throw new Error(t || r.status); }));
}
const conTiempo = (pr, ms) => Promise.race([pr, new Promise((_, mal) => setTimeout(() => mal(new Error("tiempo")), ms))]);

function estado(r){ return r.uds <= 0 ? "agotado" : r.uds <= r.umbral ? "pocas" : "si"; }
function nuevo(r){
  const porMetro = !!r.por_metro, variantes = (r.variantes && r.variantes.length ? r.variantes : [{ n: "Único" }]).map(v => ({ n: v.n, c: v.c || D.COL[v.n] || null }));
  const conColor = variantes.some(v => v.c);
  return { id: r.id, cat: r.cat, sub: r.sub, nombre: r.nombre, precio: +r.precio, icono: r.icono || "kit", desc: r.descripcion || "",
    variantes, tipoVar: r.tipo_var || (conColor ? "color" : variantes.length > 1 ? "modelo" : null), conColor,
    medidas: r.medidas || [], tipoMedida: r.tipo_medida || ((r.medidas || []).length ? "medida" : null), porMetro,
    unidad: porMetro ? "m" : "ud.", min: porMetro ? 0.5 : 1, paso: porMetro ? 0.5 : 1, max: porMetro ? 50 : 20,
    precios: r.precios || null, etiqueta: r.etiqueta || null, stock: "si", detalles: r.detalles || [],
    destacado: !!r.destacado, novedad: !!r.novedad, orden: r.orden || 0 };
}
function aplicar(filas, ajustes, subs){
  const P = D.PRODUCTOS, porId = Object.fromEntries(filas.map(r => [r.id, r]));
  // subsecciones nuevas o renombradas
  (subs || []).forEach(s => { const c = D.CATS[s.cat]; if (!c) return; c.subs[s.id] = { ...(c.subs[s.id] || {}), n: s.nombre, txt: s.texto || (c.subs[s.id] || {}).txt || "" }; });
  // quitar lo que ya no está (oculto o borrado)
  for (let i = P.length - 1; i >= 0; i--) if (!porId[P[i].id]) { delete D.PORID[P[i].id]; P.splice(i, 1); }
  for (const r of filas) {
    let p = D.PORID[r.id];
    if (!p) { if (!D.subcategoria(r.cat, r.sub)) continue; p = nuevo(r); P.push(p); D.PORID[p.id] = p; }
    else {
      p.nombre = r.nombre; p.desc = r.descripcion || p.desc; p.cat = r.cat; p.sub = r.sub;
      if (r.variantes && r.variantes.length) p.variantes = r.variantes.map(v => ({ n: v.n, c: v.c || D.COL[v.n] || null }));
      if (Array.isArray(r.medidas)) p.medidas = r.medidas;
      if (r.detalles) p.detalles = r.detalles;
      p.etiqueta = r.etiqueta || null; p.destacado = !!r.destacado; p.novedad = !!r.novedad; p.precios = r.precios || null; p.orden = r.orden;
    }
    p.precioNormal = +r.precio;
    p.oferta = r.oferta || null;
    p.precio = r.oferta ? Math.round(r.precio * (100 - r.oferta)) / 100 : +r.precio;
    if (r.oferta) p.etiqueta = `Rebajado −${r.oferta} %`;
    p.stock = estado(r);
    p.uds = +r.uds;
    if (r.uds > 0) p.max = Math.min(p.porMetro ? 50 : 20, Math.max(p.min, Math.floor(r.uds / p.paso) * p.paso));
  }
  P.sort((a, b) => (a.orden || 0) - (b.orden || 0));
  // portada: destacados y novedades
  const fijar = (lista, campo) => { lista.splice(0, lista.length, ...P.filter(p => p[campo]).map(p => p.id)); };
  fijar(D.DESTACADOS, "destacado"); fijar(D.NOVEDADES, "novedad");
  // ajustes de la tienda
  const T = D.TIENDA, a = Object.fromEntries((ajustes || []).map(x => [x.clave, x.valor]));
  ["envio", "envioGratis", "plazoEnvio", "horaCorte", "diasCambio", "horario", "festivos"].forEach(k => { if (a[k] != null) T[k] = a[k]; });
  T.vacaciones = !!a.vacaciones; T.avisoTexto = a.avisoTexto || "";
}
function aviso(){
  const T = D.TIENDA, txt = T.vacaciones ? (T.avisoTexto || "La tienda está de vacaciones: puede ver el catálogo, pero ahora no admitimos pedidos.") : T.avisoTexto;
  if (!txt) return;
  const d = document.createElement("div");
  d.className = "lv-aviso-tienda"; d.setAttribute("role", "status"); d.textContent = txt;
  d.style.cssText = "background:var(--c-tinta,#2F2A26);color:#fff;text-align:center;padding:8px 16px;font:500 1rem/1.4 var(--f-texto,sans-serif)";
  document.body.prepend(d);
}

const listo = !cfg.url ? Promise.resolve(false) : conTiempo(Promise.all([
  pedir(`productos?select=${COLS}&order=orden`),
  pedir("ajustes?select=clave,valor"),
  pedir("subcategorias?select=id,cat,nombre,texto,orden&order=orden")
]), 3000).then(([filas, ajustes, subs]) => {
  if (!Array.isArray(filas) || !filas.length) return false;
  aplicar(filas, ajustes, subs); conectado = true;
  if (document.body) aviso(); else document.addEventListener("DOMContentLoaded", aviso);
  return true;
}).catch(e => { console.warn("[LV.remoto] sin base de datos, se usa datos.js:", e.message); return false; });

/** Registra el pedido en la base de datos. extra: {canal, paypal_id, ref}. Nunca lanza error. */
function pedido(datos, extra = {}){
  if (!cfg.url) return Promise.resolve(null);
  const lineas = LV.tienda.lista().map(l => ({ id: l.id, version: [l.v, l.m].filter(Boolean).join(" · ") || null, q: +l.q }));
  const cuerpo = { cliente: datos.nombre, tel: datos.tel, email: datos.email || null, direccion: datos.dir || null, localidad: datos.loc || null, cp: datos.cp || null,
    entrega: datos.entrega === "casa" ? "casa" : "tienda", canal: extra.canal || datos.pago || "whatsapp", lineas, paypal_id: extra.paypal_id || null,
    notas: [datos.notas, extra.ref ? "Ref. PayPal " + extra.ref : ""].filter(Boolean).join(" · ") || null };
  return pedir("rpc/crear_pedido", { method: "POST", body: JSON.stringify({ datos: cuerpo }), keepalive: true })
    .catch(e => { console.error("[LV.remoto] no se pudo registrar el pedido:", e.message); return null; });
}

return { listo, pedido, conectado: () => conectado };
})();
