/* =========================================================
   LA VALENCIANA v2 · util.js · PROPIETARIO: SUP-B
   Utilidades sin estado de UI. Ver spec/ARQUITECTURA.md §4.2
   ========================================================= */
window.LV = window.LV || {};
LV.util = (() => {
"use strict";
const D = LV.datos;

const $  = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmtEuro = new Intl.NumberFormat("es-ES", {style:"currency", currency:"EUR"});
/** 1.95 → "1,95 €" */
const euros = n => fmtEuro.format(Math.round((+n||0)*100)/100);
/** 1.5 → "1,5"; 2 → "2" */
const num = n => (+n||0).toLocaleString("es-ES", {maximumFractionDigits:2});
/** quita tildes y pasa a minúsculas (ñ → n) */
const sinTildes = s => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
/** ¿El sistema pide reducir movimiento? (se consulta cada vez) */
const reducido = () => !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);

/* ---------- almacenamiento seguro ---------- */
function guardar(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch(e){ return false; } }
function leer(k, porDefecto){ try { const v = localStorage.getItem(k); return v == null ? porDefecto : JSON.parse(v); } catch(e){ return porDefecto; } }
function borrar(k){ try { localStorage.removeItem(k); } catch(e){} }

/* ---------- enlaces de contacto ---------- */
/** URL de WhatsApp con el texto escrito (abre wa.me). */
const whatsURL = (txt="") => `https://wa.me/${D.TIENDA.whats}${txt ? "?text="+encodeURIComponent(txt) : ""}`;
const telURL = () => `tel:${D.TIENDA.telHref}`;
/** mailto: con asunto y cuerpo (p. ej. el pedido escrito): correoURL("Pedido", LV.tienda.textoPedido(datos)) */
const correoURL = (asunto="", cuerpo="", para=D.TIENDA.correo) => {
  const q = [asunto && "subject="+encodeURIComponent(asunto), cuerpo && "body="+encodeURIComponent(cuerpo)].filter(Boolean).join("&");
  return `mailto:${para}${q ? "?"+q : ""}`;
};

/* ---------- cantidades ---------- */
/** Redondea una cantidad al paso del producto y la limita a [min, max]. */
function ajustarCantidad(prod, q){
  q = +q; if (!isFinite(q)) q = prod.min;
  q = Math.round(q / prod.paso) * prod.paso;
  return Math.min(prod.max, Math.max(prod.min, Math.round(q*100)/100));
}
/** "1,5 m" · "1 metro" no: siempre "1 m" para metros; "3 ud." para unidades. */
const textoCantidad = (prod, q) => prod.porMetro ? `${num(q)} m` : `${num(q)} ${q===1 ? "unidad" : "unidades"}`;

/* ---------- horario (Europe/Madrid) ---------- */
const DIAS = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
const hhmm = h => `${Math.floor(h)}:${String(Math.round((h%1)*60)).padStart(2,"0")}`;
/** {d: 0-6 (0=domingo), h: hora decimal, fecha:"AAAA-MM-DD"} en Madrid */
function ahoraMadrid(fecha = new Date()){
  try {
    const f = new Intl.DateTimeFormat("en-GB", {timeZone:"Europe/Madrid", weekday:"short", year:"numeric", month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit", hour12:false}).formatToParts(fecha);
    const g = t => (f.find(x=>x.type===t)||{}).value;
    const d = {Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6}[g("weekday")];
    const h = (+g("hour") % 24) + (+g("minute"))/60;
    return { d: d ?? fecha.getDay(), h, fecha: `${g("year")}-${g("month")}-${g("day")}` };
  } catch(e){
    return { d: fecha.getDay(), h: fecha.getHours()+fecha.getMinutes()/60, fecha: fecha.toISOString().slice(0,10) };
  }
}
const tramosDe = (d, fecha) => (fecha && D.TIENDA.festivos.includes(fecha)) ? [] : (D.TIENDA.horario[d] || []);
/**
 * Estado de la tienda ahora.
 * → {abierto:boolean, txt:"Abierto ahora, hasta las 14:00", corto:"Abierto · cierra a las 14:00", hasta?:"14:00", abre?:"17:00"}
 */
function estadoTienda(fecha = new Date()){
  const {d, h, fecha:hoy} = ahoraMadrid(fecha);
  const tramos = tramosDe(d, hoy);
  const ab = tramos.find(([a,b]) => h>=a && h<b);
  if (ab) return {abierto:true, hasta:hhmm(ab[1]), txt:`Abierto ahora, hasta las ${hhmm(ab[1])}`, corto:`Abierto · cierra a las ${hhmm(ab[1])}`};
  const sig = tramos.find(([a]) => h<a);
  if (sig) return {abierto:false, abre:hhmm(sig[0]), txt:`Cerrado ahora. Abrimos hoy a las ${hhmm(sig[0])}`, corto:`Cerrado · abre a las ${hhmm(sig[0])}`};
  // buscar el próximo día con horario
  for (let i=1; i<=7; i++){
    const f2 = new Date(fecha.getTime() + i*864e5), a2 = ahoraMadrid(f2), t2 = tramosDe(a2.d, a2.fecha);
    if (t2.length){
      const cuando = i===1 ? "mañana" : `el ${DIAS[a2.d]}`;
      return {abierto:false, abre:hhmm(t2[0][0]), txt:`Cerrado ahora. Abrimos ${cuando} a las ${hhmm(t2[0][0])}`, corto:`Cerrado · abre ${cuando} a las ${hhmm(t2[0][0])}`};
    }
  }
  return {abierto:false, txt:"Cerrado ahora", corto:"Cerrado"};
}
/**
 * Horario de la semana, de lunes a domingo.
 * → [{d:1, dia:"Lunes", tramos:[[10,14],[17,20]], texto:"10:00 a 14:00 y 17:00 a 20:00", hoy:boolean}, …]
 */
function horarioSemana(fecha = new Date()){
  const {d:hoy} = ahoraMadrid(fecha);
  return [1,2,3,4,5,6,0].map(d => {
    const t = D.TIENDA.horario[d] || [];
    return { d, dia: DIAS[d][0].toUpperCase()+DIAS[d].slice(1), tramos:t, hoy: d===hoy,
      texto: t.length ? t.map(([a,b]) => `${hhmm(a)} a ${hhmm(b)}`).join(" y ") : "Cerrado" };
  });
}
/** "Lunes a sábado, de 10:00 a 14:00 y de 17:00 a 20:00. Domingos y festivos, cerrado." */
const horarioResumen = () => "Lunes a sábado, de 10:00 a 14:00 y de 17:00 a 20:00. Domingos y festivos, cerrado.";

/* ---------- accesibilidad ---------- */
let idN = 0;
/** id único para aria-labelledby, etc.: uid("fic") → "fic-7" */
const uid = (pref="lv") => `${pref}-${++idN}`;
/** Anuncia un texto en la región aria-live global (#avisos). urgente=true usa role=alert (#avisos-urgentes). */
function anunciar(txt, urgente=false){
  const r = document.getElementById(urgente ? "avisos-urgentes" : "avisos"); if (!r) return;
  r.textContent = "";
  setTimeout(() => { r.textContent = txt; }, 60);
}
const ENFOCABLES = 'a[href],area[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),summary,[tabindex]:not([tabindex="-1"])';
/** Elementos enfocables y visibles dentro de un contenedor. */
const enfocables = el => $$(ENFOCABLES, el).filter(x => x.offsetParent !== null || x === document.activeElement);
/**
 * Atrapa Tab/Mayús+Tab dentro de `el` y llama a `alEscape` con Esc.
 * Devuelve una función que lo libera.
 */
function atraparFoco(el, alEscape){
  const tecla = e => {
    if (e.key === "Escape" && alEscape){ e.preventDefault(); e.stopPropagation(); alEscape(e); return; }
    if (e.key !== "Tab") return;
    const f = enfocables(el); if (!f.length){ e.preventDefault(); return; }
    const i = f.indexOf(document.activeElement);
    if (e.shiftKey && (i <= 0)){ e.preventDefault(); f[f.length-1].focus(); }
    else if (!e.shiftKey && i === f.length-1){ e.preventDefault(); f[0].focus(); }
  };
  document.addEventListener("keydown", tecla, true);
  return () => document.removeEventListener("keydown", tecla, true);
}
/**
 * Pone `inert` (y aria-hidden) en las capas fijas de la página excepto `excepto`.
 * Capas: #saltar, #cabecera, #contenido, #pie, #capa-cesta (salvo la exceptuada).
 * fondoInerte(true, panelEl) / fondoInerte(false)
 */
function fondoInerte(activo, excepto){
  ["saltar","cabecera","contenido","pie","capa-cesta"].forEach(id => {
    const el = document.getElementById(id); if (!el || (excepto && el.contains(excepto))) return;
    if (activo){ el.setAttribute("inert",""); } else { el.removeAttribute("inert"); }
  });
  document.documentElement.classList.toggle("lv-bloqueo", !!activo);   // base.css: html.lv-bloqueo{overflow:hidden}
}

/* ---------- marcado común ---------- */
/** Migas: migas([["Inicio","#/"],["Mercería","#/c/merceria"],["Hilos"]]) → <nav class="migas">… */
function migas(items){
  return `<nav class="migas" aria-label="Está usted en"><ol>${items.map((it,i) =>
    i === items.length-1 ? `<li><span aria-current="page">${esc(it[0])}</span></li>` : `<li><a href="${esc(it[1])}">${esc(it[0])}</a></li>`).join("")}</ol></nav>`;
}
/** CSS `background` para una muestra de color (hex o especiales linear/flores/lunares). */
function muestraCSS(c){
  if (!c) return "background:transparent";
  if (c === "linear")  return "background:conic-gradient(#EE8FB0,#F2D45C,#A8CDEB,#A8D8C0,#EE8FB0)";
  if (c === "flores")  return "background:radial-gradient(circle at 35% 35%,#C2185B 0 18%,transparent 19%),radial-gradient(circle at 70% 70%,#C2185B 0 15%,transparent 16%),#F7E3E8";
  if (c === "lunares") return "background:radial-gradient(circle at 30% 30%,#fff 0 14%,transparent 15%),radial-gradient(circle at 72% 70%,#fff 0 14%,transparent 15%),#24365C";
  return `background:${c}`;
}
/** ¿Color muy claro? (para poner borde a la muestra blanca) */
function esClaro(c){
  if (!c || c[0] !== "#") return false;
  const n = parseInt(c.slice(1), 16), r = n>>16, g = n>>8&255, b = n&255;
  return (0.299*r + 0.587*g + 0.114*b) > 225;
}

return Object.freeze({
  $, $$, esc, euros, num, sinTildes, reducido,
  guardar, leer, borrar,
  whatsURL, telURL, correoURL,
  ajustarCantidad, textoCantidad,
  ahoraMadrid, estadoTienda, horarioSemana, horarioResumen, DIAS,
  uid, anunciar, enfocables, atraparFoco, fondoInerte,
  migas, muestraCSS, esClaro
});
})();
