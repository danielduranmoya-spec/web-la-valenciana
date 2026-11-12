/* =========================================================
   LA VALENCIANA v2 · arranque.js · PROPIETARIO: SUP-B
   Último archivo de la concatenación. Pone suplentes para los
   módulos que falten (para que una construcción parcial funcione)
   e inicia todo en orden. Cada iniciar() va en su try/catch.
   ========================================================= */
(() => {
"use strict";
const U = LV.util;
const faltan = [];
const suplente = (nombre, obj) => { if (!LV[nombre]) { LV[nombre] = obj; faltan.push(nombre); } };

/* ---- suplentes mínimos (se usan solo si el constructor aún no ha entregado su módulo) ---- */
suplente("IC", new Proxy({}, { get: () => "" }));
suplente("ilus", {
  iniciar(){},
  dibujar(prod, i = 0, { decorativa = true } = {}){
    const v = prod.variantes[i] || prod.variantes[0], c = (v.c && v.c[0] === "#") ? v.c : "#E9B9C3";
    const etq = decorativa ? 'aria-hidden="true"' : `role="img" aria-label="${U.esc(prod.nombre + (v.c ? ", color " + v.n : ""))}"`;
    return `<svg viewBox="0 0 200 200" ${etq} preserveAspectRatio="xMidYMid slice"><rect width="200" height="200" fill="#FBF0F0"/><circle cx="100" cy="100" r="54" fill="${c}" stroke="#2F2A26" stroke-opacity=".4" stroke-width="1.25"/></svg>`;
  },
  icono(nombre, color = "#E9B9C3"){ return `<svg viewBox="0 0 200 200" aria-hidden="true"><rect width="200" height="200" fill="#FBF0F0"/><circle cx="100" cy="100" r="54" fill="${color}"/></svg>`; },
  pieza: (icono, color = "#E9B9C3") => `<g><circle cx="100" cy="100" r="40" fill="${color}"/></g>`,
  bodegon: (piezas, { alt = "" } = {}) => `<svg viewBox="0 0 200 200" ${alt ? `role="img" aria-label="${U.esc(alt)}"` : 'aria-hidden="true"'}><rect width="200" height="200" fill="#FBF0F0"/></svg>`,
  tono: c => ({ base: c, hi: c, lo: c, line: c, rim: "#fff" }),
  tipos: () => []
});
suplente("mov", {
  iniciar(){}, titular(){}, latido(){},
  revelar(c = document){ c.querySelectorAll("[data-r],[data-titular],.ln").forEach(e => e.classList.add("in")); },
  mostrarTodo(){ this.revelar(document); },
  transicion(fn){ fn(); return Promise.resolve(); },
  reducido: U.reducido
});
suplente("tarjeta", {
  html(prod){ return `<article class="tar"><a href="${LV.rutas.url.producto(prod.id)}">${LV.ilus.dibujar(prod, 0)}<h3>${U.esc(prod.nombre)}</h3></a><p>${U.euros(prod.precio)}</p></article>`; },
  rejilla(lista){ return `<div class="tar-rejilla">${lista.map(p => LV.tarjeta.html(p)).join("")}</div>`; },
  montar(){}
});
suplente("ui", { iniciar(){}, cerrarPaneles(){} });
suplente("pie", { iniciar(){} });
suplente("cesta", { iniciar(){}, abrir(){}, cerrar(){}, abierta: () => false });

const iniciar = (nombre, fn) => { try { fn(); } catch (e) { console.error(`[LV.arranque] error al iniciar ${nombre}:`, e); } };

/* ---- el foco de teclado nunca queda tapado (WCAG 2.4.11) ----
   La cabecera fija arriba y las barras fijas de abajo (ficha y pedido en móvil) pueden tapar
   el elemento al que llega el Tab: si pasa, se desplaza la página lo justo para verlo. */
const BARRAS_ABAJO = [".fic-barra", ".ped-barra"];
function fijoDentro(el){
  for (let p = el; p && p !== document.body; p = p.parentElement) { const s = getComputedStyle(p); if (s.position === "fixed" || s.position === "sticky") return true; }
  return false;
}
function destaparFoco(e){
  const el = e.target;
  if (!el || !el.getBoundingClientRect || el === document.body || !el.matches(":focus-visible") || fijoDentro(el)) return;
  requestAnimationFrame(() => {
    if (document.activeElement !== el) return;
    const r = el.getBoundingClientRect(), alto = innerHeight;
    const arriba = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--alto-cab-actual")) || 0;
    let abajo = 0;
    for (const sel of BARRAS_ABAJO) for (const b of document.querySelectorAll(sel)) {
      const s = getComputedStyle(b); if (s.display === "none" || s.visibility === "hidden" || (s.position !== "fixed" && s.position !== "sticky")) continue;
      const rb = b.getBoundingClientRect(); if (rb.height && rb.top < alto && rb.bottom > alto - 4) abajo = Math.max(abajo, alto - rb.top);
    }
    const margen = 12;
    let dy = 0;
    if (r.bottom > alto - abajo - margen && r.height < alto - abajo - arriba) dy = r.bottom - (alto - abajo - margen);
    else if (r.top < arriba + margen && r.bottom > 0) dy = r.top - (arriba + margen);
    if (Math.abs(dy) > 1) window.scrollBy({ top: dy, behavior: "auto" });
  });
}

function arrancar(){
  if (faltan.length) console.warn("[LV.arranque] módulos provisionales (faltan sus archivos):", faltan.join(", "));
  document.documentElement.classList.add("lv-listo");
  iniciar("ilus", () => LV.ilus.iniciar());          // inserta <svg> de filtros compartidos al principio del <body>
  iniciar("mov", () => LV.mov.iniciar());            // motor de revelado, transiciones
  iniciar("ui", () => LV.ui.iniciar());              // cabecera, megamenú, menú móvil, letra → #cabecera
  iniciar("pie", () => LV.pie.iniciar());            // pie → #pie
  iniciar("cesta", () => LV.cesta.iniciar());        // panel lateral + mini-panel → #capa-cesta
  iniciar("tienda", () => LV.tienda.iniciar());      // carga la cesta y emite lv:cesta-cambiada {accion:"cargar"}
  document.addEventListener("focusin", destaparFoco);
  // «Saltar al contenido» (href="#contenido") lo resuelve LV.rutas: enfoca <main> sin cambiar la ruta.
  Promise.resolve(LV.rutas.iniciar()).then(() => {
    document.dispatchEvent(new CustomEvent("lv:listo"));
    LV.listo = true;
  });
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", arrancar);
else arrancar();
})();
