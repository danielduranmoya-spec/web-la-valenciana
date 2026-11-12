/* =========================================================
   LA VALENCIANA v2 · mov.js · PROPIETARIO: B7
   Sistema de movimiento global → LV.mov
   - Revelados al hacer scroll ([data-r], data-r-grupo, data-r-retardo)
   - Titulares por líneas con máscara ([data-titular], .ln > span)
   - Lienzos que se descubren (.rev), hilos que se cosen ([data-hilo])
   - Contadores ([data-contador]), latido del contador de la cesta
   - Transición entre páginas (View Transitions o fundido por clase)
   Reduced-motion: NO se apaga nada; los desplazamientos pasan a fundidos
   (lo resuelve movimiento.css con los tokens). Si este archivo falla,
   movimiento.css muestra todo a los 2,5 s sin JS.
   ========================================================= */
window.LV = window.LV || {};
LV.mov = (() => {
"use strict";

const raiz = document.documentElement;
const SEL = "[data-r],[data-titular],.rev,[data-hilo],[data-contador]";
const SEGURO_MS = 2500;
const LINEA_MS = 120;            // escalonado entre líneas del titular (M2)
const MAX_TANDA = 8;             // máx. elementos escalonados por tanda (M6)
const hayIO = "IntersectionObserver" in window;

const reducido = () => !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
const ms = v => { const n = parseFloat(v); return isFinite(n) ? n : 0; };
const retardoDe = el => ms(el.getAttribute("data-r-retardo"));
const durVar = (nombre, porDefecto) => {
  const v = getComputedStyle(raiz).getPropertyValue(nombre).trim();
  if (!v) return porDefecto;
  return v.endsWith("ms") ? ms(v) : v.endsWith("s") ? ms(v) * 1000 : porDefecto;
};

/* ---------------- estado ---------------- */
let io = null;
let mo = null;
let iniciado = false;
let bloqueo = Promise.resolve();   // las revelaciones esperan a esto (fuentes en la 1.ª carga, transición de página)
let pendientes = new Set();
let programado = false;
const destinos = new Map();        // elemento observado → Set de elementos que revela (piezas SVG → su <svg>)
const hilosScroll = new Set();
let uidN = 0;

/* ---------------- fuentes (t = 0 de la coreografía) ---------------- */
let promesaFuentes = null;
function cuandoFuentes(maximo = 300){
  if (!promesaFuentes) {
    promesaFuentes = new Promise(res => {
      const fin = () => res();
      setTimeout(fin, maximo);
      try { document.fonts && document.fonts.ready.then(fin, fin); } catch (e) { fin(); }
    });
  }
  return promesaFuentes;
}

/* ---------------- preparación ---------------- */
function preparar(el){
  if (el.__movListo) return false;
  el.__movListo = true;
  const r = retardoDe(el);
  if (r) el.style.setProperty("--mov-retardo", r + "ms");
  if (el.style.getPropertyValue("--i") !== "") el.__movIManual = true;
  if (el.hasAttribute("data-hilo")) prepararHilo(el);
  if (el.hasAttribute("data-contador")) prepararContador(el);
  if (el.classList.contains("in")) { finalizar(el); return false; }
  return true;
}

function objetivoDe(el){
  // un lienzo .rev recortado del todo no «cruza» para el observador: se observa a su padre
  if (el.classList && el.classList.contains("rev") && el.parentElement && el.parentElement !== document.body) return el.parentElement;
  // Las piezas dentro de un <svg> se observan a través del <svg> exterior
  if (el instanceof SVGElement && el.tagName.toLowerCase() !== "svg") {
    let s = el.ownerSVGElement, ext = s;
    while (s && s.ownerSVGElement) { s = s.ownerSVGElement; ext = s; }
    return ext || el;
  }
  return el;
}

function observar(el){
  const obj = objetivoDe(el);
  let set = destinos.get(obj);
  if (!set) { set = new Set(); destinos.set(obj, set); }
  set.add(el);
  if (io) io.observe(obj);
}

/** Busca dentro de contenedor y prepara/observa todo lo animable. Idempotente. */
function revelar(contenedor = document){
  if (!contenedor || !contenedor.querySelectorAll) return;
  const lista = [];
  if (contenedor.matches && contenedor.matches(SEL)) lista.push(contenedor);
  contenedor.querySelectorAll(SEL).forEach(el => lista.push(el));
  const nuevos = lista.filter(preparar);
  if (!nuevos.length) return;
  if (!hayIO) { encolar(nuevos); return; }
  nuevos.forEach(observar);
  setTimeout(() => seguro(nuevos), SEGURO_MS);
}

/* seguro: lo que ya debería verse (encima del borde inferior) y no se ha revelado, se revela */
function seguro(lista){
  const alto = window.innerHeight || 800;
  const tarde = lista.filter(el => {
    if (el.classList.contains("in") || !el.isConnected) return false;
    if (!el.getClientRects().length) return false;          // oculto (panel cerrado): ya lo hará el observador
    return el.getBoundingClientRect().top < alto;
  });
  if (tarde.length) { tarde.forEach(aplicar); }
}

/* ---------------- observador ---------------- */
function alCruzar(entradas){
  const entran = [];
  entradas.forEach(e => {
    if (!e.isIntersecting) return;
    const alto = (e.rootBounds && e.rootBounds.height) || window.innerHeight;
    if (e.intersectionRatio < .15 && e.intersectionRect.height < alto * .15) return;
    const set = destinos.get(e.target);
    io.unobserve(e.target);
    destinos.delete(e.target);
    if (set) set.forEach(el => entran.push(el));
  });
  if (entran.length) encolar(entran);
}

function encolar(lista){
  lista.forEach(el => pendientes.add(el));
  if (programado) return;
  programado = true;
  bloqueo.then(() => requestAnimationFrame(vaciar));
}

function vaciar(){
  programado = false;
  const lista = [...pendientes].filter(el => el.isConnected && !el.classList.contains("in"));
  pendientes = new Set();
  escalonar(lista);
  lista.forEach(aplicar);
}

/* escalonado por filas: dentro de cada [data-r-grupo], de arriba abajo y de izquierda a derecha */
function escalonar(lista){
  const grupos = new Map();
  lista.forEach(el => {
    if (!el.hasAttribute("data-r") || el.__movIManual) return;
    const g = el.parentElement && el.parentElement.closest("[data-r-grupo]");
    if (!g) return;
    if (!grupos.has(g)) grupos.set(g, []);
    grupos.get(g).push(el);
  });
  grupos.forEach(els => {
    const pos = els.map(el => { const r = el.getBoundingClientRect(); return { el, y: Math.round(r.top / 8), x: r.left }; });
    pos.sort((a, b) => a.y - b.y || a.x - b.x);
    pos.forEach((p, k) => p.el.style.setProperty("--i", Math.min(k, MAX_TANDA - 1)));
  });
}

/* ---------------- aplicar (el elemento entra) ---------------- */
function aplicar(el){
  if (el.classList.contains("in")) return;
  if (el.hasAttribute("data-titular")) {
    partir(el);
    void el.offsetWidth;            // fija el estado inicial de las líneas antes de animar
  }
  if (el.hasAttribute("data-hilo")) {
    if (el.__movHiloScroll) { hilosScroll.add(el); alScroll(); }
    else void el.getBoundingClientRect();
  }
  el.classList.add("in");
  if (el.hasAttribute("data-contador")) contar(el);
  if (el.__movPartido) programarRestaurar(el);
}

/* ---------------- titular por líneas (M2) ---------------- */
function partir(el){
  if (el.__movPartido || el.classList.contains("mov-partido")) return;
  const manuales = el.querySelectorAll(".ln");
  if (manuales.length) {
    manuales.forEach((ln, k) => ln.style.setProperty("--l", k));
    el.classList.add("mov-partido");
    return;
  }
  const texto = el.textContent.replace(/\s+/g, " ").trim();
  if (!texto) { el.classList.add("mov-partido"); return; }
  const original = el.innerHTML;
  // 1) cada palabra en un <span> en línea para medir dónde parte el navegador
  const piezas = [];   // {nodo, salto}
  const frag = document.createDocumentFragment();
  const recorrer = nodos => {
    nodos.forEach(n => {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach(t => {
          if (!t) return;
          if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(" ")); return; }
          const s = document.createElement("span"); s.className = "mov-p"; s.textContent = t;
          frag.appendChild(s); piezas.push({ nodo: s });
        });
      } else if (n.nodeType === 1 && n.tagName === "BR") {
        piezas.push({ salto: true });
      } else if (n.nodeType === 1) {
        const s = document.createElement("span"); s.className = "mov-p"; s.appendChild(n.cloneNode(true));
        frag.appendChild(s); piezas.push({ nodo: s });
      }
    });
  };
  recorrer([...el.childNodes]);
  el.textContent = "";
  el.appendChild(frag);
  // 2) agrupar por altura de línea
  const lineas = [];
  let actual = null, yPrev = null, forzar = true;
  piezas.forEach(p => {
    if (p.salto) { forzar = true; return; }
    const y = p.nodo.getBoundingClientRect().top;
    if (forzar || yPrev === null || y > yPrev + 3) { actual = []; lineas.push(actual); forzar = false; }
    actual.push(p.nodo);
    yPrev = y;
  });
  // 3) montar: copia accesible oculta + líneas visuales aria-hidden
  const oculto = document.createElement("span");
  oculto.className = "visualmente-oculto";
  oculto.textContent = texto;
  const vis = document.createElement("span");
  vis.className = "mov-lineas";
  vis.setAttribute("aria-hidden", "true");
  lineas.forEach((ps, k) => {
    const ln = document.createElement("span"); ln.className = "ln"; ln.style.setProperty("--l", k);
    const sp = document.createElement("span");
    ps.forEach((p, j) => {
      if (j) sp.appendChild(document.createTextNode(" "));
      while (p.firstChild) sp.appendChild(p.firstChild);
    });
    ln.appendChild(sp); vis.appendChild(ln);
  });
  el.textContent = "";
  el.appendChild(oculto); el.appendChild(vis);
  el.__movOriginal = original;
  el.__movPartido = true;
  el.__movLineas = lineas.length;
  el.classList.add("mov-partido");
}

/* al terminar, se devuelve el marcado original (vuelve a ajustar si cambia el ancho) */
function programarRestaurar(el){
  const dur = reducido() ? 600 : durVar("--dur-hero", 1000);
  const espera = ms(el.style.getPropertyValue("--mov-retardo")) + (el.__movLineas - 1) * LINEA_MS + dur + 150;
  setTimeout(() => restaurar(el), espera);
}
function restaurar(el){
  if (!el.__movPartido || !el.isConnected) return;
  el.innerHTML = el.__movOriginal;
  el.__movPartido = false;
}

/** API: parte el texto de el en líneas y lo anima ahora (M2). */
function titular(el){
  if (!el) return;
  if (!el.hasAttribute("data-titular")) el.setAttribute("data-titular", "");
  preparar(el);
  el.classList.remove("in");
  bloqueo.then(() => requestAnimationFrame(() => aplicar(el)));
}

/* ---------------- hilo que se cose (M5 / M17) ---------------- */
const NS = "http://www.w3.org/2000/svg";
function prepararHilo(svg){
  if (svg.__movHilo) return;
  svg.__movHilo = true;
  svg.__movHiloScroll = svg.getAttribute("data-hilo") === "scroll";
  const trazos = [...svg.querySelectorAll("path, line, polyline")].filter(t => !t.closest("mask, clipPath, defs, symbol, marker"));
  let defs = null;
  svg.__movTrazos = [];
  trazos.forEach(t => {
    let len = parseFloat(t.getAttribute("pathLength"));
    if (!len) { try { len = t.getTotalLength(); } catch (e) { len = 0; } }
    if (!len) return;
    len = Math.ceil(len) + 2;
    const da = getComputedStyle(t).strokeDasharray;
    const discontinuo = da && da !== "none" && da !== "0" && da !== "0px";
    if (!discontinuo) {
      t.classList.add("mov-trazo");
      t.style.setProperty("--mov-len", len);
      svg.__movTrazos.push({ el: t, len });
      return;
    }
    // pespunte: se revela con una máscara de trazo sólido que avanza
    if (!defs) { defs = document.createElementNS(NS, "defs"); svg.insertBefore(defs, svg.firstChild); }
    const id = "mov-mascara-" + (++uidN);
    const mask = document.createElementNS(NS, "mask");
    mask.setAttribute("id", id);
    mask.setAttribute("maskUnits", "userSpaceOnUse");
    ["x", "y"].forEach(a => mask.setAttribute(a, "-5000"));
    ["width", "height"].forEach(a => mask.setAttribute(a, "10000"));
    const c = t.cloneNode(false);
    c.removeAttribute("id"); c.removeAttribute("stroke-dasharray"); c.removeAttribute("mask"); c.removeAttribute("style");
    c.setAttribute("class", "mov-trazo mov-mascara");
    c.setAttribute("fill", "none");
    const sw = parseFloat(getComputedStyle(t).strokeWidth) || 2;
    c.setAttribute("stroke-width", String(Math.max(sw * 4, 10)));
    c.setAttribute("stroke-linecap", "round");
    c.style.setProperty("--mov-len", len);
    mask.appendChild(c); defs.appendChild(mask);
    t.setAttribute("mask", `url(#${id})`);
    svg.__movTrazos.push({ el: c, len });
  });
}

let scrollProgramado = false;
function alScroll(){
  if (scrollProgramado || !hilosScroll.size) return;
  scrollProgramado = true;
  requestAnimationFrame(() => {
    scrollProgramado = false;
    const alto = window.innerHeight;
    hilosScroll.forEach(svg => {
      if (!svg.isConnected) { hilosScroll.delete(svg); return; }
      if (reducido()) { svg.style.setProperty("--mov-progreso", 1); svg.__movTrazos.forEach(t => t.el.style.strokeDashoffset = 0); return; }
      const r = svg.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (alto * .82 - r.top) / Math.max(r.height, 1)));
      svg.style.setProperty("--mov-progreso", p.toFixed(4));
      svg.__movTrazos.forEach(t => { t.el.style.strokeDashoffset = (t.len * (1 - p)).toFixed(1); });
    });
  });
}

/** API: vuelve a coser (dibujar) los trazos de un <svg> ahora. Útil para el ✓ de «Añadido» (M20) o la confirmación (M23). */
function dibujar(svg){
  if (!svg) return;
  if (!svg.hasAttribute("data-hilo")) svg.setAttribute("data-hilo", "");
  preparar(svg);
  svg.classList.remove("in");
  void svg.getBoundingClientRect();
  requestAnimationFrame(() => svg.classList.add("in"));
}

/* ---------------- contadores ---------------- */
const esAnio = n => Number.isInteger(n) && n >= 1000 && n <= 2100;
const formatear = (n, anio) => {
  const r = Math.round(n);
  return anio ? String(r) : String(r).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
function prepararContador(el){
  const fin = parseFloat(el.getAttribute("data-contador"));
  if (!isFinite(fin)) return;
  const txt = el.textContent;
  const m = txt.match(/\d[\d.]*/);
  const anio = esAnio(fin) && !(m && m[0].includes("."));      // «1.000» escrito con punto: no es un año
  const desdeAttr = el.getAttribute("data-contador-desde");
  const desde = desdeAttr != null ? parseFloat(desdeAttr) || 0 : (anio ? fin - 120 : 0);
  el.__movCont = { fin, desde, anio, antes: m ? txt.slice(0, m.index) : "", despues: m ? txt.slice(m.index + m[0].length) : "", conTexto: !!m };
  if (!el.getAttribute("aria-label") && !el.closest("[aria-hidden='true']")) el.setAttribute("aria-label", txt.trim());
  if (!reducido()) pintarContador(el, desde);
}
function pintarContador(el, v){
  const c = el.__movCont; if (!c) return;
  el.textContent = c.conTexto ? c.antes + formatear(v, c.anio) + c.despues : formatear(v, c.anio);
}
function contar(el){
  const c = el.__movCont; if (!c) return;
  if (reducido()) { pintarContador(el, c.fin); return; }
  const dur = 1200, espera = ms(el.style.getPropertyValue("--mov-retardo"));
  setTimeout(() => {
    const t0 = performance.now();
    const paso = t => {
      const p = Math.min((t - t0) / dur, 1);
      pintarContador(el, c.desde + (c.fin - c.desde) * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  }, espera);
}

/* ---------------- final instantáneo ---------------- */
function finalizar(el){
  el.classList.add("in");
  if (el.__movCont) pintarContador(el, el.__movCont.fin);
  if (el.__movHiloScroll) { el.__movTrazos.forEach(t => t.el.style.strokeDashoffset = 0); el.style.setProperty("--mov-progreso", 1); hilosScroll.delete(el); }
  if (el.__movPartido) restaurar(el);
  if (el.hasAttribute("data-titular")) el.classList.add("mov-partido");
}

/** Todo visible al instante, sin animación (lo usa probar.js antes de las capturas). */
function mostrarTodo(){
  raiz.classList.add("mov-ya", "mov-t0");
  revelar(document);
  document.querySelectorAll(SEL).forEach(el => { preparar(el); finalizar(el); });
  destinos.forEach((set, obj) => io && io.unobserve(obj));
  destinos.clear();
  pendientes.clear();
  try { document.dispatchEvent(new CustomEvent("lv:mostrar-todo")); } catch (e) {}
  requestAnimationFrame(() => requestAnimationFrame(() => raiz.classList.remove("mov-ya")));
}

/* ---------------- latido del contador de la cesta (M13) ---------------- */
function rgba(hex, a){
  const h = (hex || "").trim().replace("#", "");
  if (h.length !== 6) return `rgba(140,43,77,${a})`;
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;
}
function latido(el){
  if (!el || !el.animate) return;
  // si hay un vuelo a la cesta en curso, el globo late cuando el objeto llega
  if (vueloEnCurso) { const v = vueloEnCurso; v.then(() => latidoYa(el)); return; }
  latidoYa(el);
}
function latidoYa(el){
  if (!el || !el.isConnected) return;
  const cs = getComputedStyle(raiz);
  const anillo = rgba(cs.getPropertyValue("--c-acento"), .5);
  const sin = rgba(cs.getPropertyValue("--c-acento"), 0);
  try {
    if (reducido()) {
      // destello de color, sin desplazamiento ni escala
      el.animate([
        { boxShadow: `0 0 0 0 ${anillo}`, filter: "brightness(1)" },
        { boxShadow: `0 0 0 6px ${anillo}`, filter: "brightness(1.35)", offset: .3 },
        { boxShadow: `0 0 0 10px ${sin}`, filter: "brightness(1)" }
      ], { duration: 600, easing: "ease-out" });
      return;
    }
    const e = parseFloat(cs.getPropertyValue("--escala-latido")) || 1.3;
    el.animate([
      { transform: "scale(1)" }, { transform: `scale(${e})`, offset: .4 }, { transform: "scale(1)" }
    ], { duration: 400, easing: cs.getPropertyValue("--ease-rebote").trim() || "cubic-bezier(.34,1.56,.64,1)" });
    el.animate([
      { boxShadow: `0 0 0 0 ${anillo}` }, { boxShadow: `0 0 0 12px ${sin}` }
    ], { duration: 700, easing: "ease-out" });
  } catch (e) { /* sin animación: el número ya ha cambiado */ }
}

/* ---------------- vuelo a la cesta ----------------
   Al añadir (lv:cesta-cambiada «anadir»), una copia pequeña del dibujo del producto
   vuela en arco desde la ficha hasta «Mi cesta» y el globo late al llegar.
   Con «reducir movimiento» no hay desplazamiento: la copia aparece junto a la cesta
   y se funde (el globo destella). Solo transform/opacity, capa fija sin eventos. */
let vueloEnCurso = null;
const visibleEnPantalla = r => r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
function destinoCesta(){
  const cands = [...document.querySelectorAll("#cabecera .cab-cesta")];
  for (const b of cands) {
    const r = b.getBoundingClientRect();
    if (!visibleEnPantalla(r) || getComputedStyle(b).visibility === "hidden") continue;
    const n = b.querySelector(".cab-cesta__n");
    const rn = n && n.getBoundingClientRect();
    return rn && rn.width ? rn : r;
  }
  return null;
}
function origenVuelo(origenEl){
  if (!origenEl || !origenEl.isConnected) return null;
  if (origenEl.closest("dialog, [role='dialog'], #capa-cesta")) return null;   // desde la propia cesta: no tiene sentido
  const ficha = origenEl.closest(".fic") || document.querySelector("#contenido .fic");
  const lienzo = ficha && ficha.querySelector(".fic-lienzo");
  const tarjeta = origenEl.closest(".tarjeta");
  const fuente = lienzo || (tarjeta && tarjeta.querySelector("svg.ilu") && tarjeta.querySelector("svg.ilu").parentElement);
  const svg = fuente && fuente.querySelector(".fic-lienzo__capa--visible svg.ilu, svg.ilu");
  if (!svg) return null;
  let r = fuente.getBoundingClientRect();
  const visible = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0));
  if (!visibleEnPantalla(r) || visible < r.height * .4) {
    // el dibujo ya no se ve (barra fija del móvil): sale del botón pulsado
    const b = origenEl.getBoundingClientRect(), lado = 72;
    r = { left: b.left + b.width / 2 - lado / 2, top: b.top + b.height / 2 - lado / 2, width: lado, height: lado };
  }
  return { svg, r };
}
function volar(origenEl){
  try {
    const dest = destinoCesta(), org = dest && origenVuelo(origenEl);
    if (!org || typeof document.body.animate !== "function") return null;
    const red = reducido();
    const lado = Math.min(140, Math.max(56, Math.min(org.r.width, org.r.height) * .42));
    const x0 = org.r.left + org.r.width / 2 - lado / 2, y0 = org.r.top + org.r.height / 2 - lado / 2;
    const xd = dest.left + dest.width / 2 - lado / 2, yd = dest.top + dest.height / 2 - lado / 2;
    const capa = document.createElement("div");
    capa.className = "mov-vuelo";
    capa.setAttribute("aria-hidden", "true");
    capa.appendChild(org.svg.cloneNode(true));
    capa.style.cssText = `width:${lado}px;height:${lado}px;left:0;top:0;`;
    document.body.appendChild(capa);
    const fin = 24 / lado;
    let anim;
    if (red) {
      // sin desplazamiento: aparece junto a la cesta y se funde
      const xr = Math.max(8, Math.min(innerWidth - 64, dest.left + dest.width / 2 - 28)), yr = dest.bottom + 8;
      capa.style.width = capa.style.height = "56px";
      anim = capa.animate([
        { transform: `translate(${xr}px, ${yr}px)`, opacity: 0 },
        { transform: `translate(${xr}px, ${yr}px)`, opacity: 1, offset: .35 },
        { transform: `translate(${xr}px, ${yr}px)`, opacity: 0 }
      ], { duration: 700, easing: "cubic-bezier(.4,0,.2,1)" });
    } else {
      // arco: sube un poco y cae sobre la cesta mientras se encoge
      const xm = x0 + (xd - x0) * .5, ym = Math.min(y0, yd) - Math.min(160, Math.abs(y0 - yd) * .35 + 60);
      anim = capa.animate([
        { transform: `translate(${x0}px, ${y0}px) scale(1) rotate(0deg)`, opacity: 0, offset: 0 },
        { transform: `translate(${x0}px, ${y0 - 10}px) scale(1.04) rotate(-4deg)`, opacity: 1, offset: .12 },
        { transform: `translate(${xm}px, ${ym}px) scale(.62) rotate(8deg)`, opacity: 1, offset: .55 },
        { transform: `translate(${xd}px, ${yd}px) scale(${fin.toFixed(3)}) rotate(14deg)`, opacity: .85, offset: .94 },
        { transform: `translate(${xd}px, ${yd}px) scale(${(fin * .6).toFixed(3)}) rotate(14deg)`, opacity: 0, offset: 1 }
      ], { duration: 820, easing: "cubic-bezier(.45,.05,.35,1)" });
    }
    const p = new Promise(res => {
      let hecho = false;
      const acabar = () => { if (hecho) return; hecho = true; capa.remove(); if (vueloEnCurso === p) vueloEnCurso = null; res(); };
      anim.finished.then(acabar, acabar);
      setTimeout(acabar, 1200);       // por si la animación no termina (pestaña oculta)
    });
    vueloEnCurso = red ? null : p;    // con reduced-motion el destello no espera
    return p;
  } catch (e) { vueloEnCurso = null; return null; }
}

/* ---------------- fundido al cambiar contenido (M11) ---------------- */
/** Funde el elemento, ejecuta fn (que cambia su contenido) y lo vuelve a mostrar. Llama a fn SIEMPRE. */
function fundirCambio(el, fn){
  const mitad = 175;
  if (!el || !el.animate) { fn && fn(); return Promise.resolve(); }
  return new Promise(res => {
    let hecho = false;
    const cambiar = () => { if (hecho) return; hecho = true; try { fn && fn(); } finally {
      try { el.animate([{ opacity: .15 }, { opacity: 1 }], { duration: mitad, easing: "cubic-bezier(.4,0,.2,1)" }).finished.then(res, res); } catch (e) { res(); }
    } };
    try {
      const a = el.animate([{ opacity: 1 }, { opacity: .15 }], { duration: mitad, easing: "cubic-bezier(.4,0,.2,1)" });
      a.finished.then(cambiar, cambiar);
      setTimeout(cambiar, mitad + 120);
    } catch (e) { cambiar(); }
  });
}

/* ---------------- transición entre páginas (M7) ---------------- */
/** Ejecuta fn (cambia el DOM) dentro de una transición. Llama a fn SIEMPRE una vez. Resuelve con el DOM nuevo puesto. */
function transicion(fn){
  let llamado = false, errorFn = null;
  const ejecutar = () => { if (llamado) return; llamado = true; try { fn(); } catch (e) { errorFn = e; } };
  const terminar = () => { if (!llamado) ejecutar(); if (errorFn) throw errorFn; };
  let soltar;
  bloqueo = new Promise(r => { soltar = r; });
  const liberar = (t) => setTimeout(soltar, t);

  if (typeof document.startViewTransition === "function" && !document.hidden) {
    raiz.classList.add("mov-vt");
    let vt;
    try { vt = document.startViewTransition(ejecutar); }
    catch (e) { raiz.classList.remove("mov-vt"); ejecutar(); liberar(0); return Promise.resolve().then(terminar); }
    const quitar = () => raiz.classList.remove("mov-vt");
    vt.ready.catch(() => {});
    vt.finished.then(quitar, quitar);
    return vt.updateCallbackDone.then(() => { liberar(140); terminar(); }, () => { liberar(0); terminar(); });
  }
  // alternativa: el contenido sale con fundido y el nuevo entra
  const main = document.getElementById("contenido");
  return new Promise(res => {
    raiz.classList.add("mov-sale");
    setTimeout(() => {
      ejecutar();
      raiz.classList.remove("mov-sale");
      raiz.classList.add("mov-entra");
      liberar(80);
      setTimeout(() => raiz.classList.remove("mov-entra"), 520);
      res();
    }, main ? 200 : 0);
  }).then(terminar);
}

/* ---------------- limpieza entre rutas ---------------- */
function podar(){
  destinos.forEach((set, obj) => {
    if (obj.isConnected) { set.forEach(el => { if (!el.isConnected) set.delete(el); }); if (set.size) return; }
    if (io) io.unobserve(obj);
    destinos.delete(obj);
  });
  pendientes.forEach(el => { if (!el.isConnected) pendientes.delete(el); });
  hilosScroll.forEach(el => { if (!el.isConnected) hilosScroll.delete(el); });
}

/* ---------------- arranque ---------------- */
function iniciar(){
  if (iniciado) return;
  iniciado = true;
  raiz.classList.add("js", "mov-activo");
  if (hayIO) io = new IntersectionObserver(alCruzar, { threshold: [0, .05, .1, .15], rootMargin: "0px 0px -8% 0px" });
  // t = 0 de la coreografía: fuentes listas o 300 ms
  bloqueo = cuandoFuentes(300).then(() => { raiz.classList.add("mov-t0"); });
  // lo que otros módulos inserten más tarde también se prepara (por si olvidan llamar a revelar)
  if ("MutationObserver" in window) {
    let cola = false;
    mo = new MutationObserver(muts => {
      if (cola) return;
      if (!muts.some(m => m.addedNodes.length)) return;
      cola = true;
      requestAnimationFrame(() => { cola = false; revelar(document.body); });
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }
  // vuelo a la cesta: este oyente se registra antes que el de la cabecera (arranque inicia mov antes que ui),
  // así el vuelo ya está en curso cuando la cabecera pide el latido y este espera a la llegada
  document.addEventListener("lv:cesta-cambiada", e => {
    const d = e.detail || {};
    if (d.accion === "anadir" && d.origenEl) volar(d.origenEl);
  });
  window.addEventListener("scroll", alScroll, { passive: true });
  window.addEventListener("resize", alScroll, { passive: true });
  // al cambiar de página se sueltan los elementos de la página anterior que nunca llegaron a verse
  // (si no, el observador y el mapa de destinos retenían el DOM viejo ruta tras ruta)
  document.addEventListener("lv:ruta-cambiada", podar);
  revelar(document);
  // seguro general por si algo no llega a observarse
  setTimeout(() => seguro([...document.querySelectorAll(SEL)]), SEGURO_MS);
}

return { iniciar, revelar, titular, transicion, latido, volar, mostrarTodo, reducido, dibujar, fundirCambio, cuandoFuentes };
})();
