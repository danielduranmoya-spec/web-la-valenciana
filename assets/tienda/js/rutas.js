/* =========================================================
   LA VALENCIANA v2 · rutas.js · PROPIETARIO: SUP-B
   Enrutador por hash. Contrato completo: spec/ARQUITECTURA.md §5
   ========================================================= */
window.LV = window.LV || {};
LV.vistas = LV.vistas || {};
LV.rutas = (() => {
"use strict";
const D = LV.datos, U = LV.util;
const TITULO_BASE = "La Valenciana";
const TITULO_INICIO = "La Valenciana · Mercería y complementos en Almendralejo";
const PESTANAS = ["versiones", "parecidos", "juego", "detalles"];

let actualRuta = null;           // {vista, params, hash}
let vistaMontada = null;         // objeto vista montado
let primera = true;
let enCurso = Promise.resolve();
const SECCIONES = {};            // vista → [{id, orden, html, montar, desmontar}]

/* ---------------- utilidades de URL ---------------- */
const dec = s => { try { return decodeURIComponent(s); } catch (e) { try { return decodeURIComponent(s.replace(/%(?![0-9a-f]{2})/gi, "%25")); } catch (e2) { return s; } } };
const url = {
  inicio: () => "#/",
  categoria: (cat, sub) => `#/c/${cat}${sub ? "/" + sub : ""}`,
  producto: (id, pestana) => `#/p/${id}${pestana ? "/" + pestana : ""}`,
  buscar: q => `#/buscar/${encodeURIComponent(q || "")}`,
  novedades: () => "#/novedades",
  pedido: () => "#/pedido", hecho: () => "#/pedido/hecho",
  comoComprar: () => "#/como-comprar", visitanos: () => "#/visitanos", legal: () => "#/legal",
  horario: () => "#/horario", redes: () => "#/redes",
  colores: (g, c) => `#/colores${g ? "/" + g : ""}${c ? "/" + c : ""}`
};

/**
 * Traduce un hash a {vista, params}. Valida catálogo: si la categoría,
 * subcategoría o producto no existen → vista "noEncontrada".
 */
function resolver(hash){
  let h = (hash || "").replace(/^#/, "");
  if (!h.startsWith("/")) h = "/";
  const partes = h.split("/").filter(Boolean).map(dec);
  const [a, b, c] = partes;
  const nf = { vista: "noEncontrada", params: { ruta: h } };
  if (!a) return { vista: "inicio", params: {} };
  if (a === "c") {
    const categoria = D.categoria(b); if (!categoria) return nf;
    if (c && !D.subcategoria(b, c)) return nf;
    if (partes.length > 3) return nf;
    return { vista: "categoria", params: { cat: b, sub: c || null, categoria, subcategoria: c ? D.subcategoria(b, c) : null } };
  }
  if (a === "p") {
    const prod = D.producto(b); if (!prod) return nf;
    return { vista: "producto", params: { id: b, prod, pestana: PESTANAS.includes(c) ? c : null } };
  }
  if (a === "novedades" && !b) return { vista: "novedades", params: {} };
  if (a === "buscar") return { vista: "buscar", params: { q: partes.slice(1).join("/").trim() } };
  if (a === "pedido" && !b) return { vista: "pedido", params: {} };
  if (a === "pedido" && b === "hecho") return { vista: "confirmacion", params: {} };
  if (partes.length === 1 && a === "como-comprar") return { vista: "comoComprar", params: {} };
  if (partes.length === 1 && a === "visitanos") return { vista: "visitanos", params: {} };
  if (partes.length === 1 && a === "legal") return { vista: "legal", params: {} };
  if (a === "colores" && partes.length <= 3) return { vista: "colores", params: { grupo: b || null, color: c || null } };
  if (partes.length === 1 && a === "horario") return { vista: "horario", params: {} };
  if (partes.length === 1 && a === "redes") return { vista: "redes", params: {} };
  return nf;
}

/* títulos y menú por defecto (la vista puede sobreescribirlos con titulo()/nav()) */
const TITULOS = {
  inicio: () => null,
  categoria: p => p.sub ? `${p.subcategoria.n} · ${p.categoria.nombre}` : p.categoria.nombre,
  producto: p => p.prod.nombre,
  buscar: p => p.q ? `Buscar «${p.q}»` : "Buscar",
  novedades: () => "Novedades",
  pedido: () => "Hacer el pedido", confirmacion: () => "Pedido preparado",
  comoComprar: () => "Cómo comprar", visitanos: () => "Visítenos", legal: () => "Información legal",
  horario: () => "Horario", redes: () => "Redes sociales", colores: () => "Buscar por color",
  noEncontrada: () => "Página no encontrada"
};
const NAV = {
  inicio: () => "#/", novedades: () => url.novedades(), categoria: p => url.categoria(p.cat), producto: p => url.categoria(p.prod.cat),
  comoComprar: () => url.comoComprar(), visitanos: () => url.visitanos(), legal: () => url.legal(),
  horario: () => url.horario(), redes: () => url.redes()
};

/* ---------------- secciones (vistas compuestas: portada) ---------------- */
/**
 * Registra una sección de una vista compuesta (hoy: "inicio").
 * def = {id:"hero", orden:10, html(params)→string, montar?(el, params), desmontar?()}
 * Orden reservado en inicio: B2 hero=10, mosaico=20; B3 desde 30 en adelante (de 10 en 10).
 */
function seccion(vista, def){
  if (!def || !def.id || typeof def.html !== "function") { console.error("[LV.rutas] sección inválida", vista, def); return; }
  const l = SECCIONES[vista] = (SECCIONES[vista] || []).filter(s => s.id !== def.id);
  l.push({ orden: 100, ...def });
  l.sort((x, y) => x.orden - y.orden);
}
const secciones = vista => (SECCIONES[vista] || []).slice();

/** Construye una vista a partir de sus secciones. Cada sección va en <div data-seccion="id"> (display:contents). */
function vistaCompuesta(nombre){
  let montadas = [];
  return {
    compuesta: true,
    html: params => !secciones(nombre).length ? provisional(nombre, params).html() : secciones(nombre).map(s => {
      let h = "";
      try { h = s.html(params) || ""; } catch (e) { console.error(`[LV.rutas] error en sección ${nombre}/${s.id}:`, e); }
      return `<div data-seccion="${U.esc(s.id)}">${h}</div>`;
    }).join(""),
    montar: (main, params) => {
      montadas = secciones(nombre);
      for (const s of montadas) {
        const el = main.querySelector(`[data-seccion="${CSS.escape(s.id)}"]`);
        try { s.montar && s.montar(el, params); } catch (e) { console.error(`[LV.rutas] error al montar ${nombre}/${s.id}:`, e); }
      }
    },
    desmontar: () => { for (const s of montadas) { try { s.desmontar && s.desmontar(); } catch (e) { console.error(e); } } montadas = []; }
  };
}

/* vista provisional mientras el constructor no la entrega */
function provisional(nombre, params){
  console.warn(`[LV.rutas] la vista "${nombre}" aún no existe: se muestra una provisional`);
  const t = (TITULOS[nombre] && TITULOS[nombre](params)) || TITULO_BASE;
  return { html: () => `<div class="contenedor lv-provisional"><h1>${U.esc(t)}</h1><p>Esta página se está preparando.</p><p><a href="#/">Volver al inicio</a></p></div>` };
}
function obtenerVista(nombre, params){
  if (nombre === "inicio" && !LV.vistas.inicio) LV.vistas.inicio = vistaCompuesta("inicio");
  return LV.vistas[nombre] || provisional(nombre, params);
}

/* ---------------- render ---------------- */
function marcarMenu(nav){
  U.$$("[data-nav]").forEach(a => {
    const h = a.getAttribute("href");
    if (nav && h === location.hash) a.setAttribute("aria-current", "page");
    else if (nav && h === nav) a.setAttribute("aria-current", "true");
    else a.removeAttribute("aria-current");
  });
}
function enfocarTitulo(main){
  const h1 = main.querySelector("h1") || main;
  if (!h1.hasAttribute("tabindex")) h1.setAttribute("tabindex", "-1");
  try { h1.focus({ preventScroll: true }); } catch (e) { h1.focus(); }
}
const evento = (n, detail) => document.dispatchEvent(new CustomEvent(n, { detail }));

async function render(){
  const main = document.getElementById("contenido");
  const hash = location.hash || "#/";
  const { vista: nombre, params } = resolver(hash);
  const anterior = actualRuta;
  const st = (() => { try { return history.state; } catch (e) { return null; } })();
  const restaurarY = (!primera && st && typeof st.lvY === "number") ? st.lvY : null;

  // ¿misma vista y sabe actualizarse sin repintar? (p. ej. cambiar de pestaña en la ficha)
  if (anterior && anterior.vista === nombre && vistaMontada && typeof vistaMontada.actualizar === "function") {
    let hecho = false;
    try { hecho = vistaMontada.actualizar(params, anterior.params) === true; } catch (e) { console.error(`[LV.rutas] error en ${nombre}.actualizar:`, e); }
    if (hecho) {
      actualRuta = { vista: nombre, params, hash };
      marcarMenu(calcularNav(vistaMontada, nombre, params));
      evento("lv:ruta-cambiada", { vista: nombre, params, hash, anterior, parcial: true });
      return;
    }
  }

  evento("lv:ruta-saliendo", { vista: nombre, params, hash, anterior });
  let vista = obtenerVista(nombre, params);
  let html = null;
  try { html = vista.html(params); } catch (e) { console.error(`[LV.rutas] error al pintar la vista "${nombre}":`, e); html = errorHTML(); vista = { html: () => html }; }
  let nombreFinal = nombre;
  if (html == null) {               // la vista dice «no existe» → 404
    nombreFinal = "noEncontrada";
    vista = obtenerVista("noEncontrada", { ruta: hash });
    try { html = vista.html({ ruta: hash }); } catch (e) { console.error(e); html = errorHTML(); }
  }

  const cambiar = () => {
    if (vistaMontada && vistaMontada.desmontar) { try { vistaMontada.desmontar(); } catch (e) { console.error("[LV.rutas] error al desmontar:", e); } }
    main.innerHTML = html;
    document.body.dataset.vista = nombreFinal;
    const t = calcularTitulo(vista, nombreFinal, params);
    document.title = t ? `${t} · ${TITULO_BASE}` : TITULO_INICIO;
    marcarMenu(calcularNav(vista, nombreFinal, params));
    vistaMontada = vista;
    try { vista.montar && vista.montar(main, params); } catch (e) { console.error(`[LV.rutas] error al montar la vista "${nombreFinal}":`, e); }
    if (!primera) window.scrollTo(0, restaurarY ?? 0);
  };
  try {
    if (!primera && LV.mov && typeof LV.mov.transicion === "function") await LV.mov.transicion(cambiar);
    else cambiar();
  } catch (e) { console.error("[LV.rutas] error en la transición:", e); if (vistaMontada !== vista) cambiar(); }

  if (restaurarY != null) requestAnimationFrame(() => window.scrollTo(0, restaurarY));
  if (!primera) enfocarTitulo(main);
  try { LV.mov && LV.mov.revelar && LV.mov.revelar(main); } catch (e) { console.error("[LV.rutas] LV.mov.revelar falló:", e); }
  actualRuta = { vista: nombreFinal, params, hash };
  const fueLaPrimera = primera; primera = false;
  evento("lv:ruta-cambiada", { vista: nombreFinal, params, hash, anterior, primera: fueLaPrimera, restaurado: restaurarY != null });
}
function calcularTitulo(vista, nombre, params){
  try { if (typeof vista.titulo === "function") return vista.titulo(params); } catch (e) { console.error(e); }
  return TITULOS[nombre] ? TITULOS[nombre](params) : null;
}
function calcularNav(vista, nombre, params){
  try { if (typeof vista.nav === "function") return vista.nav(params); } catch (e) { console.error(e); }
  return NAV[nombre] ? NAV[nombre](params) : "";
}
const errorHTML = () => `<div class="contenedor"><h1>Algo no ha ido bien</h1><p>No hemos podido mostrar esta página. Pruebe a recargarla o llámenos al ${U.esc(D.TIENDA.tel)}.</p><p><a href="#/">Volver al inicio</a></p></div>`;

/* ---------------- navegación ---------------- */
/** Navega a un hash ("#/c/merceria"). reemplazar=true no crea entrada en el historial. */
function ir(hash, { reemplazar = false } = {}){
  if (!hash.startsWith("#")) hash = "#" + hash;
  if (hash === location.hash) { return recargar(); }
  if (reemplazar) { history.replaceState(null, "", hash); return encolar(); }
  location.hash = hash;
}
/** Vuelve a pintar la vista actual conservando el scroll (p. ej. tras cambiar algo en el pedido). */
function recargar(){
  const y = window.scrollY;
  actualRuta = null;                       // fuerza repintado completo
  return encolar().then(() => window.scrollTo(0, y));
}
const encolar = () => (enCurso = enCurso.then(render, render));
const actual = () => actualRuta ? { ...actualRuta } : null;

// guardar posición de scroll en la entrada actual del historial (para volver atrás)
let tGuardar = 0;
function guardarY(){ try { history.replaceState({ ...(history.state || {}), lvY: window.scrollY }, ""); } catch (e) {} }

function iniciar(){
  const main = document.getElementById("contenido");
  try { history.scrollRestoration = "manual"; } catch (e) {}
  window.addEventListener("hashchange", () => {
    const h = location.hash;
    // anclas internas que no son rutas (p. ej. #contenido): enfocar y no repintar
    if (h && h !== "#" && !h.startsWith("#/")) {
      const el = document.getElementById(dec(h.slice(1)));
      if (el) { if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1"); el.focus(); el.scrollIntoView(); }
      if (actualRuta) { try { history.replaceState(history.state, "", actualRuta.hash); } catch (e) {} }
      return;
    }
    encolar();
  });
  // enlaces a anclas internas (href="#algo" que no empieza por "#/"): no tocan la ruta
  document.addEventListener("click", e => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return;
    const h = a.getAttribute("href");
    if (h.startsWith("#/")) { guardarY(); return; }
    e.preventDefault();
    const el = h.length > 1 && document.getElementById(dec(h.slice(1)));
    if (!el) return;
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.scrollIntoView({ behavior: U.reducido() ? "auto" : "smooth", block: "start" });
    el.focus({ preventScroll: true });
  });
  window.addEventListener("scroll", () => { clearTimeout(tGuardar); tGuardar = setTimeout(guardarY, 200); }, { passive: true });
  if (!location.hash || !location.hash.startsWith("#/")) { try { history.replaceState(null, "", "#/" ); } catch (e) {} }
  return encolar();
}

return Object.freeze({ iniciar, ir, recargar, actual, resolver, seccion, secciones, url, PESTANAS });
})();
