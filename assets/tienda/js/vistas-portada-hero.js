/* =========================================================
   LA VALENCIANA v2 · vistas/portada-hero.js · PROPIETARIO: B2
   Portada, secciones 1 y 2 (DISENO §7.1, §8 coreografía, §9):
     · «hero»    (orden 10): titular de 3 líneas, hilo que sale del
                 carrete y cose bajo el titular hasta una aguja,
                 puertas Mercería / Complementos, bodegón de 6 piezas.
     · «mosaico» (orden 20): Mercería (cols 1-7) y Complementos
                 (cols 8-12, bajado 80 px) con todas sus subcategorías.
   La coreografía del hero la temporiza este archivo con UNA clase
   (.por-vivo) y retardos CSS exactos; el resto usa los atributos de B7.
   ========================================================= */
(() => {
"use strict";

/* ---------- utilidades locales (todo defensivo: otros módulos pueden faltar) ---------- */
const U = () => LV.util;
const esc = s => (LV.util && LV.util.esc ? LV.util.esc(s) : String(s ?? ""));
const reducido = () => {
  try { if (LV.mov && typeof LV.mov.reducido === "function") return !!LV.mov.reducido(); } catch (e) {}
  return !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
};
const url = {
  cat: (c, s) => (LV.rutas && LV.rutas.url ? LV.rutas.url.categoria(c, s) : `#/c/${c}${s ? "/" + s : ""}`)
};
const tienda = () => (LV.datos && LV.datos.TIENDA) || { tel: "924 67 08 39", telHref: "tel:+34924670839" };
const telHref = () => { try { return LV.util.telURL(); } catch (e) { return tienda().telHref || "tel:+34924670839"; } };
const telTxt = () => esc(tienda().tel || "924 67 08 39").replace(/ /g, "&nbsp;");

/* ¿Están ya los dibujos de verdad de B8? (el suplente de arranque devuelve tipos() vacío) */
const ilusReal = () => { try { return !!(LV.ilus && LV.ilus.tipos && LV.ilus.tipos().length); } catch (e) { return false; } };

/* Colores de los objetos (son ilustración: DISENO §9 permite hex aquí) */
const COLOR = {
  rosaPalo: "#E8BEC4", ciruela: "#7A4E2D", blanco: "#FFFFFF", mantequilla: "#EED9A0",
  metal: "#C9CDD2", lavanda: "#B9A3D6", alfiler: "#E9B9C3", metro: "#EBD38F",
  madera: "#E6CFAE", carne: "#D9B8A6", bolso: "#B48AA3"
};

/* Pieza de dibujo sin lienzo (espacio 0-200). Con los dibujos de B8 si existen;
   si no, un suplente propio sobrio para que la portada no se vea rota. */
function pieza(icono, color, rot = 0){
  if (ilusReal() && typeof LV.ilus.pieza === "function") {
    try { return LV.ilus.pieza(icono, color, { rot }); } catch (e) { console.warn("[B2] LV.ilus.pieza falló:", icono, e); }
  }
  return suplente(icono, color);
}
function suplente(icono, c){
  const l = "#7A4E2D", sw = 'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';
  const sombra = s => `<g transform="translate(5 7)" fill="${l}" opacity=".14">${s}</g>`;
  switch (icono) {
    case "bobina": return `${sombra('<rect x="62" y="40" width="76" height="120" rx="6"/>')}<rect x="62" y="40" width="76" height="13" rx="5" fill="${COLOR.madera}" stroke="#A88B62" ${sw}/><rect x="62" y="147" width="76" height="13" rx="5" fill="${COLOR.madera}" stroke="#A88B62" ${sw}/><rect x="69" y="53" width="62" height="94" fill="${c}" stroke="${l}" stroke-opacity=".45" ${sw}/>${Array.from({length: 13}, (_, i) => `<path d="M69 ${60 + i * 7}q31 3 62 0" fill="none" stroke="${l}" stroke-opacity=".22"/>`).join("")}`;
    case "boton": return `${sombra('<circle cx="100" cy="100" r="54"/>')}<circle cx="100" cy="100" r="54" fill="${c}" stroke="${l}" stroke-opacity=".45" ${sw}/><circle cx="100" cy="100" r="42" fill="none" stroke="${l}" stroke-opacity=".3" ${sw}/>${[[89, 89], [111, 89], [89, 111], [111, 111]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${l}" opacity=".35"/>`).join("")}`;
    case "abanico": return `${sombra('<path d="M100 160 22 82a110 110 0 0 1 156 0z"/>')}<path d="M100 160 22 82a110 110 0 0 1 156 0z" fill="${c}" stroke="${l}" stroke-opacity=".45" ${sw}/>${Array.from({length: 9}, (_, i) => { const a = Math.PI * (1.25 + i * .0625), x = 100 + Math.cos(a) * 108, y = 160 + Math.sin(a) * 108; return `<path d="M100 160L${x.toFixed(1)} ${y.toFixed(1)}" stroke="${l}" stroke-opacity=".25"/>`; }).join("")}<circle cx="100" cy="158" r="6" fill="${COLOR.madera}" stroke="#A88B62"/>`;
    case "tijera": return `${sombra('<circle cx="70" cy="140" r="20"/><circle cx="130" cy="140" r="20"/>')}<path d="M82 126 140 36M118 126 60 36" stroke="#8E949B" stroke-width="7" stroke-linecap="round"/><circle cx="70" cy="140" r="20" fill="none" stroke="${c}" stroke-width="8"/><circle cx="130" cy="140" r="20" fill="none" stroke="${c}" stroke-width="8"/><circle cx="100" cy="98" r="4" fill="#8E949B"/>`;
    case "alfiler": return `<path d="M100 60v100" stroke="#9AA0A6" stroke-width="2.5" stroke-linecap="round"/><circle cx="100" cy="56" r="11" fill="${c}" stroke="${l}" stroke-opacity=".45" ${sw}/>`;
    case "metro": return `${sombra('<circle cx="100" cy="100" r="48"/>')}<circle cx="100" cy="100" r="48" fill="${c}" stroke="#A88B62" ${sw}/><circle cx="100" cy="100" r="16" fill="#fff" opacity=".7"/><path d="M148 100h30v18h-30" fill="${c}" stroke="#A88B62" ${sw}/>`;
    case "cremallera": return `${sombra('<rect x="80" y="30" width="40" height="140" rx="3"/>')}<rect x="80" y="30" width="40" height="140" rx="3" fill="${c}" stroke="${l}" stroke-opacity=".4" ${sw}/><path d="M100 40v120" stroke="#9AA0A6" stroke-width="6" stroke-dasharray="3 3"/><rect x="92" y="60" width="16" height="22" rx="3" fill="#B8BDC3"/>`;
    case "media": return `${sombra('<path d="M78 30h44v100l18 20-24 22-38-40z"/>')}<path d="M78 30h44v100c6 8 18 14 18 24 0 12-14 18-26 14-10-4-36-34-36-48z" fill="${c}" stroke="${l}" stroke-opacity=".4" ${sw}/><path d="M78 42h44" stroke="${l}" stroke-opacity=".3"/>`;
    case "bolso": return `${sombra('<rect x="44" y="76" width="112" height="84" rx="10"/>')}<path d="M70 80c0-34 60-34 60 0" fill="none" stroke="${l}" stroke-opacity=".5" stroke-width="5"/><rect x="44" y="76" width="112" height="84" rx="10" fill="${c}" stroke="${l}" stroke-opacity=".45" ${sw}/><path d="M44 104h112" stroke="${l}" stroke-opacity=".3"/>`;
    default: return `<circle cx="100" cy="100" r="48" fill="${c}"/>`;
  }
}

/* Coloca una pieza centrada en (cx, cy) con escala y giro. Tres <g>:
   .por-pieza (entrada M4, CSS) > .por-par (parallax M21, CSS) > posición (atributo SVG). */
function colocar({ icono, color, x, y, escala = 1, rot = 0, i = 0, clase = "" }){
  const tx = x - 100 * escala, ty = y - 100 * escala;
  return `<g class="por-pieza ${clase}" style="--i:${i}"><g class="por-par"><g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${escala}) rotate(${rot} 100 100)" data-icono="${esc(icono)}">${pieza(icono, color, rot)}</g></g></g>`;
}

/* ---------- Bodegón del hero (DISENO §9): 6 dibujos sobre lino rosa ---------- */
const BODEGON_HERO = [
  { icono: "bobina",  color: COLOR.rosaPalo,   x: 196, y: 232, escala: 1.6,  rot: -8, clase: "por-carrete" },
  { icono: "boton",   color: COLOR.ciruela,    x: 392, y: 140, escala: .5,  rot: 0 },
  { icono: "boton",   color: COLOR.blanco,     x: 458, y: 206, escala: .5,  rot: 18 },
  { icono: "boton",   color: COLOR.mantequilla,x: 524, y: 272, escala: .5,  rot: -10 },
  { icono: "tijera",  color: COLOR.metal,      x: 420, y: 430, escala: 1.25, rot: 14 },
  { icono: "abanico", color: COLOR.lavanda,    x: 470, y: 600, escala: 1.4,  rot: -10 },
  { icono: "alfiler", color: COLOR.alfiler,    x: 222, y: 456, escala: .62,  rot: 32 },
  { icono: "alfiler", color: COLOR.alfiler,    x: 282, y: 486, escala: .62,  rot: -22 },
  { icono: "metro",   color: COLOR.metro,      x: 178, y: 604, escala: 1.05, rot: -6 }
];
/* orden de caída (M4): carrete, botones, tijera, abanico, alfileres, metro */
const ORDEN_CAIDA = { bobina: 0, boton: 1, tijera: 2, abanico: 3, alfiler: 4, metro: 5 };

function bodegonHero(){
  const piezas = BODEGON_HERO.map((p, n) => colocar({ ...p, i: ORDEN_CAIDA[p.icono] + (p.icono === "boton" ? (n - 1) * .35 : 0) + (p.icono === "alfiler" ? (n - 6) * .4 : 0) })).join("");
  return `<svg class="por-bodegon__svg" viewBox="0 0 640 720" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">${piezas}</svg>`;
}

/* ---------- Bodegón de 3 en el mosaico ---------- */
function bodegon3(lista, w, h){
  const paso = w / (lista.length + 1);
  const piezas = lista.map((p, n) => colocar({ ...p, x: paso * (n + 1), y: h * (.36 + n * .14), i: n })).join("");
  return `<svg class="por-tesela__svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">${piezas}</svg>`;
}

/* dibujo pequeño de las puertas (64 px) */
const dibujoPuerta = (icono, color) =>
  `<svg class="puerta__dibujo" viewBox="0 0 200 200" aria-hidden="true" focusable="false">${pieza(icono, color)}</svg>`;

/* =========================================================
   SECCIÓN 1 · HERO
   ========================================================= */
const LINEAS = ["Hilos, botones,", "medias y abanicos,", "como en el mostrador."];

function htmlHero(){
  const lineas = LINEAS.map((t, i) => `<span class="por-ln"><span style="--i:${i}">${esc(t)}</span></span>`).join(" ");
  return `
<section class="por-hero por-espera" aria-labelledby="por-titular">
  <div class="contenedor rejilla por-hero__rejilla">
    <div class="por-hero__texto">
      <h1 class="t-display por-hero__titular" id="por-titular">${lineas}</h1>
      <div class="por-hero__costura" aria-hidden="true"></div>
      <p class="t-entradilla por-hero__entradilla">Somos La Valenciana, mercería de Almendralejo desde el siglo&nbsp;XIX, en la calle Moreno Nieto. Elija con calma: se lo preparamos para recoger o se lo enviamos a casa.</p>
      <nav class="por-puertas" aria-label="Secciones de la tienda">
        <a class="puerta puerta--merceria" href="${url.cat("merceria")}">
          ${dibujoPuerta("bobina", COLOR.rosaPalo)}
          <span class="puerta__textos"><span class="puerta__titulo">Mercería</span><span class="puerta__linea">Hilos, botones, cremalleras, lanas</span></span>
        </a>
        <a class="puerta puerta--complementos" href="${url.cat("complementos")}">
          ${dibujoPuerta("abanico", COLOR.lavanda)}
          <span class="puerta__textos"><span class="puerta__titulo">Complementos</span><span class="puerta__linea">Medias, calcetines, pañuelos, bolsos</span></span>
        </a>
      </nav>
      <p class="por-hero__llame">¿Prefiere hablar con nosotros? Llame al <a href="${telHref()}">${telTxt()}</a>.</p>
    </div>
    <figure class="por-bodegon con-lino" aria-hidden="true">${bodegonHero()}</figure>
  </div>
  <svg class="por-hilo" aria-hidden="true" focusable="false"></svg>
</section>`;
}

/* ---------- el hilo (M5) ----------
   Un SVG a todo el hero, en píxeles del hero. Dos tramos:
   1) hilo suelto (trazo continuo) desde el carrete del bodegón hasta el titular;
   2) costura bajo el titular: pespunte 9/6 revelado por una máscara de trazo
      sólido que avanza (stroke-dashoffset). La aguja va delante, siguiendo la
      tangente del recorrido, y se queda al final (a la izquierda; en móvil, a
      la derecha). La geometría se recalcula si cambia el tamaño o la letra. */
const NS = "http://www.w3.org/2000/svg";
const AGUJA = `<g class="por-aguja__cuerpo">
  <path d="M-4 0C-4-2.6-1.8-3.4 2-3.4L58-1C61-.6 62-.3 62 0S61 .6 58 1L2 3.4C-1.8 3.4-4 2.6-4 0Z" fill="url(#ID-metal)" stroke="#7E858C" stroke-width=".9"/>
  <path d="M1.5 0C1.5-1 2.3-1.4 3.5-1.4H11C12-1.4 12.4-.8 12.4 0S12 1.4 11 1.4H3.5C2.3 1.4 1.5 1 1.5 0Z" fill="var(--c-fondo)" stroke="#7E858C" stroke-width=".7"/>
  <path d="M6-2.2H54" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".8"/>
</g>`;

function crearHilo(hero){
  const svg = hero.querySelector(".por-hilo");
  const titular = hero.querySelector(".por-hero__titular");
  const costura = hero.querySelector(".por-hero__costura");
  const carrete = hero.querySelector(".por-carrete [data-icono]");
  if (!svg || !titular || !costura) return null;
  const id = (LV.util && LV.util.uid) ? LV.util.uid("por-hilo") : "por-hilo-" + Math.random().toString(36).slice(2, 8);
  svg.innerHTML = `<defs>
      <linearGradient id="${id}-metal" x1="0" y1="-4" x2="0" y2="4" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#F1F3F5"/><stop offset=".5" stop-color="#C9CDD2"/><stop offset="1" stop-color="#9AA0A6"/></linearGradient>
      <mask id="${id}-m" maskUnits="userSpaceOnUse"><path class="por-hilo__mascara" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="butt"/></mask>
    </defs>
    <g class="por-hilo__todo">
      <path class="por-hilo__suelto" fill="none"/>
      <path class="por-hilo__costura" fill="none" mask="url(#${id}-m)"/>
      <g class="por-aguja">${AGUJA.replace("ID", id)}</g>
    </g>`;
  const suelto = svg.querySelector(".por-hilo__suelto");
  const pespunte = svg.querySelector(".por-hilo__costura");
  const mascara = svg.querySelector(".por-hilo__mascara");
  const aguja = svg.querySelector(".por-aguja");
  const todo = svg.querySelector(".por-hilo__todo");
  let L1 = 0, L2 = 0, p = 0, haciaDerecha = false;

  /* recalcula el recorrido con las posiciones reales */
  function geometria(){
    const r = hero.getBoundingClientRect();
    if (!r.width) return;
    svg.setAttribute("viewBox", `0 0 ${r.width.toFixed(1)} ${r.height.toFixed(1)}`);
    svg.setAttribute("width", r.width.toFixed(1)); svg.setAttribute("height", r.height.toFixed(1));
    const lineas = [...titular.querySelectorAll(".por-ln > span")];
    const rt = titular.getBoundingClientRect();
    const izq = rt.left - r.left;
    const derTexto = Math.max(...lineas.map(s => s.getBoundingClientRect().right - r.left), izq + 120);
    const rc = costura.getBoundingClientRect();
    const y = rc.top - r.top + rc.height / 2;
    const bodegon = hero.querySelector(".por-bodegon");
    const rb = bodegon ? bodegon.getBoundingClientRect() : null;
    const apilado = !rb || rb.top - r.top > y;          // móvil: el bodegón está debajo del texto
    let d1, d2;
    if (!apilado && carrete && carrete.getScreenCTM) {
      // ESCRITORIO: del costado izquierdo del carrete, hacia la izquierda, baja y cose de derecha a izquierda
      haciaDerecha = false;
      const m = carrete.getScreenCTM(), pt = (x, yy) => ({ x: m.a * x + m.c * yy + m.e - r.left, y: m.b * x + m.d * yy + m.f - r.top });
      const a = pt(70, 104);
      // La aguja (≈71 px: 62 de su eje × 1,15) reposa con la punta justo en el margen del titular:
      // el ojo queda en «fin» y la punta no sale de la columna de texto (revisión R2).
      const fin = izq + 72;
      const ini = Math.min(derTexto + 28, a.x - 60);           // la costura empieza tras la línea más larga
      const bx = rb.left - r.left;                             // borde izquierdo del lienzo
      d1 = `M${a.x.toFixed(1)} ${a.y.toFixed(1)} C${(a.x - 90).toFixed(1)} ${(a.y - 2).toFixed(1)} ${(ini + 110).toFixed(1)} ${y.toFixed(1)} ${ini.toFixed(1)} ${y.toFixed(1)}`;
      d2 = `M${ini.toFixed(1)} ${y.toFixed(1)} C${(ini - (ini - fin) * .33).toFixed(1)} ${(y + 3).toFixed(1)} ${(fin + (ini - fin) * .33).toFixed(1)} ${(y - 3).toFixed(1)} ${fin.toFixed(1)} ${y.toFixed(1)}`;
    } else {
      // MÓVIL: el hilo arranca con un nudo al inicio del titular y cose hacia la derecha; la aguja queda a la derecha
      haciaDerecha = true;
      const ini = izq + 8, fin = Math.min(Math.max(derTexto - 70, izq + 140), r.width - (r.width - rt.right) - 66);
      d1 = `M${(ini - 7).toFixed(1)} ${y.toFixed(1)} a3.5 3.5 0 1 1 3.5 3.5 C${(ini - 1).toFixed(1)} ${(y + 3).toFixed(1)} ${(ini - 1).toFixed(1)} ${y.toFixed(1)} ${ini.toFixed(1)} ${y.toFixed(1)}`;
      d2 = `M${ini.toFixed(1)} ${y.toFixed(1)} C${(ini + (fin - ini) * .33).toFixed(1)} ${(y - 3).toFixed(1)} ${(fin - (fin - ini) * .33).toFixed(1)} ${(y + 3).toFixed(1)} ${fin.toFixed(1)} ${y.toFixed(1)}`;
    }
    suelto.setAttribute("d", d1); pespunte.setAttribute("d", d2); mascara.setAttribute("d", d2);
    L1 = suelto.getTotalLength(); L2 = pespunte.getTotalLength();
    suelto.style.strokeDasharray = `${L1} ${L1 + 2}`;
    mascara.style.strokeDasharray = `${L2} ${L2 + 2}`;
    dibujar(p);
  }

  /* pinta el progreso p ∈ [0,1] (proporcional a la longitud de los dos tramos) */
  function dibujar(q){
    p = q;
    const total = L1 + L2; if (!total) return;
    const hecho = total * q;
    const h1 = Math.min(hecho, L1), h2 = Math.max(0, hecho - L1);
    suelto.style.strokeDashoffset = (L1 - h1).toFixed(2);
    mascara.style.strokeDashoffset = (L2 - h2).toFixed(2);
    // aguja: punta delante, ojo en el extremo del hilo
    const camino = hecho <= L1 ? suelto : pespunte, l = hecho <= L1 ? h1 : h2;
    const a = camino.getPointAtLength(Math.max(0, l)), b = camino.getPointAtLength(Math.max(0, l - 2));
    let ang = Math.atan2(a.y - b.y, a.x - b.x) * 180 / Math.PI;
    if (l < 2) ang = hecho <= L1 ? 180 : (haciaDerecha ? 0 : 180);
    if (haciaDerecha && hecho <= L1) ang = 0;                // móvil: el nudo es un bucle diminuto; la aguja no gira con él (R2)
    if (q >= 1) ang = haciaDerecha ? -8 : 188;               // al acabar, la aguja reposa casi horizontal
    aguja.setAttribute("transform", `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${ang.toFixed(1)}) scale(1.15)`);
  }

  return { geometria, dibujar, todo, get p(){ return p; } };
}

/* ---------- coreografía (DISENO §8) ---------- */
let estado = null;   // {hero, hilo, tiempos[], raf, ro, quitar[]}

function curvaEntre(t){ return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; } // ≈ --ease-entre

function montarHero(el){
  desmontarHero();
  const hero = el && el.querySelector(".por-hero");
  if (!hero) return;
  const st = estado = { hero, hilo: null, tiempos: [], raf: 0, ro: null, quitar: [], hecho: false };
  const RM = reducido();

  try { st.hilo = crearHilo(hero); } catch (e) { console.error("[B2] no se pudo crear el hilo:", e); }
  // El titular va en 3 líneas fijas: si con la letra real alguna no cabe en su columna, se reduce lo justo.
  const titularEl = hero.querySelector(".por-hero__titular");
  const ajustarTitular = () => {
    if (!titularEl) return;
    const spans = [...titularEl.querySelectorAll(".por-ln > span")];
    if (!spans.length) return;
    const ancho = titularEl.clientWidth;
    if (!ancho) return;
    const medir = () => Math.max(...spans.map(sp => sp.scrollWidth));
    if (titularEl.style.fontSize) { titularEl.style.fontSize = ""; }
    const max = medir();
    if (max > ancho) {
      const fs = parseFloat(getComputedStyle(titularEl).fontSize);
      titularEl.style.fontSize = (fs * ancho / max * 0.985).toFixed(2) + "px";
    }
  };
  let ajustando = false;
  const recalcular = () => {
    if (!ajustando) { ajustando = true; try { ajustarTitular(); } catch (e) {} ajustando = false; }
    try { st.hilo && st.hilo.geometria(); } catch (e) { console.error("[B2] hilo:", e); }
  };
  recalcular();

  // recalcular si cambia el tamaño, la letra o llegan las fuentes
  if (window.ResizeObserver) { st.ro = new ResizeObserver(() => recalcular()); st.ro.observe(hero); const t = hero.querySelector(".por-hero__titular"); t && st.ro.observe(t); }
  const enLetra = () => requestAnimationFrame(recalcular);
  document.addEventListener("lv:letra-cambiada", enLetra);
  st.quitar.push(() => document.removeEventListener("lv:letra-cambiada", enLetra));
  try { document.fonts && document.fonts.addEventListener && (document.fonts.addEventListener("loadingdone", enLetra), st.quitar.push(() => document.fonts.removeEventListener("loadingdone", enLetra))); } catch (e) {}

  const terminarYa = () => {               // probar.js / B7 mostrarTodo(): todo en su sitio al instante
    hero.classList.add("por-ya", "por-vivo"); hero.classList.remove("por-espera");
    cancelAnimationFrame(st.raf); st.hecho = true;
    if (st.hilo) { st.hilo.todo.style.opacity = "1"; st.hilo.dibujar(1); }
  };
  document.addEventListener("lv:mostrar-todo", terminarYa);
  st.quitar.push(() => document.removeEventListener("lv:mostrar-todo", terminarYa));
  // LV.mov.mostrarTodo() (B7) marca <html class="mov-ya">: lo detectamos sin tocar su módulo
  if (window.MutationObserver) {
    const mo = new MutationObserver(() => { if (document.documentElement.classList.contains("mov-ya")) terminarYa(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    st.quitar.push(() => mo.disconnect());
  }

  const despues = (ms, fn) => st.tiempos.push(setTimeout(fn, ms));
  let arrancado = false;
  const arrancar = () => {
    if (arrancado || estado !== st) return; arrancado = true;
    recalcular();
    // t = 0: una sola clase dispara titular, lienzo, piezas, entradilla y puertas con los retardos de CSS
    void hero.offsetWidth; getComputedStyle(hero.querySelector(".por-ln > span") || hero).transform;   // fija el estado inicial antes de animar
    requestAnimationFrame(() => requestAnimationFrame(() => { if (estado === st) { hero.classList.add("por-vivo"); hero.classList.remove("por-espera"); } }));
    // 1150 ms: el hilo (M5). Con movimiento reducido: aparece entero con un fundido de 600 ms.
    despues(1150, () => {
      if (!st.hilo || st.hecho) return;
      if (RM) { st.hilo.dibujar(1); st.hilo.todo.classList.add("por-hilo--fundido"); st.hecho = true; return; }
      st.hilo.todo.style.opacity = "1";
      const dur = 1600, t0 = performance.now();
      const paso = t => {
        if (estado !== st || st.hecho) return;
        const q = Math.min(1, (t - t0) / dur);
        st.hilo.dibujar(curvaEntre(q));
        if (q < 1) st.raf = requestAnimationFrame(paso); else st.hecho = true;
      };
      st.raf = requestAnimationFrame(paso);
    });
  };
  // t = 0 cuando las fuentes estén listas o a los 300 ms, lo que llegue antes
  despues(300, arrancar);
  try { document.fonts && document.fonts.ready && document.fonts.ready.then(arrancar); } catch (e) {}
  // seguro (2,5 s del sistema + margen del hilo): nada se queda oculto
  despues(3200, () => { if (!st.hecho) terminarYa(); });
}

function desmontarHero(){
  const st = estado; if (!st) return;
  st.tiempos.forEach(clearTimeout); cancelAnimationFrame(st.raf);
  st.ro && st.ro.disconnect(); st.quitar.forEach(f => { try { f(); } catch (e) {} });
  estado = null;
}

/* =========================================================
   SECCIÓN 2 · MOSAICO DE CATEGORÍAS
   ========================================================= */
const TESELAS = {
  merceria: {
    frase: "Lo que hace falta para coser, arreglar y terminar bien una prenda.",
    boton: "Ver toda la mercería",
    piezas: [{ icono: "bobina", color: COLOR.rosaPalo, escala: 1.3, rot: -10 }, { icono: "boton", color: COLOR.ciruela, escala: .85, rot: 0 }, { icono: "cremallera", color: COLOR.mantequilla, escala: 1.2, rot: 24 }],
    w: 700, h: 300
  },
  complementos: {
    frase: "Medias, calcetines, pañuelos, bolsos y detalles para vestir cada día y para las fiestas.",
    boton: "Ver todos los complementos",
    piezas: [{ icono: "abanico", color: COLOR.lavanda, escala: 1.15, rot: -8 }, { icono: "media", color: COLOR.carne, escala: 1.15, rot: 14 }, { icono: "bolso", color: COLOR.bolso, escala: 1.05, rot: -4 }],
    w: 520, h: 300
  },
  capsulas: {
    frase: "Selecciones cerradas y preparadas en una caja: para empezar una labor, para la temporada o para regalar.",
    boton: "Ver todas las cápsulas",
    piezas: [{ icono: "kit", color: "#E9B9C3", escala: 1.1, rot: -6 }, { icono: "costurero", color: "#B98A55", escala: 1, rot: 8 }, { icono: "vale", color: "#F1ECE4", escala: .95, rot: -10 }],
    w: 620, h: 260
  }
};

function tesela(cat){
  const D = LV.datos, c = D && D.categoria(cat), t = TESELAS[cat];
  if (!c) return "";
  const subs = D.subcategorias(cat);
  const idt = `por-t-${cat}`;
  return `
  <article class="por-tesela por-tesela--${cat} con-lino" aria-labelledby="${idt}" data-r>
    <div class="por-tesela__lienzo">${bodegon3(t.piezas, t.w, t.h)}</div>
    <div class="por-tesela__cuerpo">
      <h2 class="por-tesela__titulo" id="${idt}"><a href="${url.cat(cat)}">${esc(c.nombre)}</a></h2>
      <p class="por-tesela__frase">${esc(t.frase)}</p>
      <ul class="por-tesela__subs" role="list">
        ${subs.map(s => `<li><a class="por-sub" href="${url.cat(cat, s.id)}"><span><span class="por-sub__n">${esc(s.n)}</span>&nbsp;<span class="por-sub__cuenta">(${s.cuenta})</span></span></a></li>`).join("")}
      </ul>
      <a class="boton boton--secundario por-tesela__boton" href="${url.cat(cat)}">${esc(t.boton)}</a>
    </div>
  </article>`;
}

function htmlMosaico(){
  return `
<section class="por-mosaico" aria-label="Mercería, complementos y cápsulas">
  <div class="contenedor rejilla por-mosaico__rejilla">
    ${tesela("merceria")}
    ${tesela("complementos")}
    ${tesela("capsulas")}
  </div>
</section>`;
}

/* ---------- registro (ARQUITECTURA §5.3) ---------- */
function registrar(){
  if (!LV.rutas || typeof LV.rutas.seccion !== "function") return false;
  /* v3: el hero lo pone portada-caja.js (caja 3D) */
  LV.rutas.seccion("inicio", { id: "mosaico", orden: 20, html: htmlMosaico });
  return true;
}
// rutas.js va antes que este archivo en la concatenación: registrar ya es seguro
// (solo guarda funciones; no llama a otros módulos hasta pintar).
if (!registrar()) document.addEventListener("DOMContentLoaded", registrar, { once: true });
})();
