/* =========================================================
   LA VALENCIANA v2 · ilus.js · PROPIETARIO: B8
   Ilustraciones de producto: «bodegón de mesa de costura».
   Vista cenital sobre lino pastel, trazo fino del tono del objeto,
   luz arriba-izquierda, sombra proyectada ciruela + sombra de contacto.

   Núcleo: color (tono), defs compartidos, ayudantes de dibujo y API.
   Los dibujos viven en ilus-merceria.js e ilus-complementos.js y se
   registran en LV.ilus.D (este archivo trae formas genéricas de reserva
   para que ningún tipo se quede sin imagen).

   API (ARQUITECTURA §4.7):
     iniciar()                        inserta el <svg id="lv-ilus-defs"> compartido
     dibujar(prod, idx, opciones)     svg completo de un producto
     icono(nombre, color, opciones)   svg completo sin producto
     pieza(nombre, color, {rot})      <g> sin lienzo en el espacio 0-200
     bodegon(piezas, opciones)        svg con lienzo y varias piezas
     tono(hex)                        {base, hi, lo, line, rim}
     tipos()                          nombres con dibujo propio
   ========================================================= */
window.LV = window.LV || {};
LV.ilus = (() => {
"use strict";

/* ---------------- color ---------------- */
const h2rgb = h => { h = h.replace("#", ""); if (h.length === 3) h = h.split("").map(x => x + x).join(""); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)); };
const rgb2hsl = ([r, g, b]) => {
  r /= 255; g /= 255; b /= 255;
  const M = Math.max(r, g, b), m = Math.min(r, g, b), l = (M + m) / 2; let h = 0, s = 0;
  if (M !== m) { const d = M - m; s = l > .5 ? d / (2 - M - m) : d / (M + m); h = M === r ? (g - b) / d + (g < b ? 6 : 0) : M === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; }
  return [h, s, l];
};
const hsl = (h, s, l) => `hsl(${h.toFixed(0)} ${(s * 100).toFixed(0)}% ${(l * 100).toFixed(0)}%)`;
const esHex = c => typeof c === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(c);
const CACHE_TONO = new Map();

/** De un hex: base, luz (hi), sombra propia (lo), trazo (line) y brillo (rim). Blanco y negro aparte. */
function tono(hex){
  if (!esHex(hex)) hex = "#E9B9C3";
  const k = hex.toUpperCase();
  if (CACHE_TONO.has(k)) return CACHE_TONO.get(k);
  const [h, s, l] = rgb2hsl(h2rgb(hex));
  const oscuro = l < .22, claro = l > .9;
  const t = {
    base: oscuro ? hsl(h, s, .2) : hex,
    hi:   hsl(h, Math.min(s, .6), oscuro ? .42 : Math.min(.98, l + .14)),
    lo:   hsl(h, Math.min(1, s * 1.1), oscuro ? .08 : claro ? .80 : Math.max(.12, l - .2)),
    line: hsl(h, Math.min(.5, s), oscuro ? .58 : claro ? .50 : Math.max(.2, l - .38)),
    rim:  oscuro ? "rgba(255,255,255,.55)" : "rgba(255,255,255,.85)",
    oscuro, claro, hex: k
  };
  CACHE_TONO.set(k, t);
  return t;
}

/* Colores especiales del catálogo (LV.datos.COL) */
const MULTI = ["#EE8FB0", "#F2D45C", "#A8CDEB", "#A8D8C0", "#B9A3D6", "#EE7F6A"];
const ESPECIAL = {
  linear:  { hex: "#E9B9C3", fill: "url(#lv-multi)", line: "hsl(330 30% 42%)" },
  flores:  { hex: "#F7E3E8", fill: "url(#lv-flores)", line: "hsl(338 35% 45%)" },
  lunares: { hex: "#24365C", fill: "url(#lv-lunares)", line: null },
};
const METAL = "#C9CDD2", ORO = "#C9A54B", MADERA = "#E6CFAE", CIRUELA = "#7A4E2D", TINTA = "#2F2A26";

/* ---------------- defs compartidos (una vez por documento) ---------------- */
const DEFS_BASE = `
<filter id="lv-grano" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 .35  0 0 0 0 .22  0 0 0 0 .28  0 0 0 .5 -.12"/></filter>
<filter id="lv-lino" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".02 .9" numOctaves="2" seed="2" result="a"/><feTurbulence type="fractalNoise" baseFrequency=".9 .02" numOctaves="2" seed="7" result="b"/><feBlend in="a" in2="b" mode="multiply"/><feColorMatrix type="matrix" values="0 0 0 0 .4  0 0 0 0 .28  0 0 0 0 .32  0 0 0 .45 -.1"/></filter>
<filter id="lv-suave" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3.2"/></filter>
<filter id="lv-contacto" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.2"/></filter>
<radialGradient id="lv-luz" cx=".3" cy=".25" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".08"/></radialGradient>
<linearGradient id="lv-relieve" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#2a2018" stop-opacity=".22"/></linearGradient>
<linearGradient id="lv-multi" x1="0" y1="0" x2="1" y2=".35">${MULTI.map((c, i) => `<stop offset="${(i / (MULTI.length - 1)).toFixed(2)}" stop-color="${c}"/>`).join("")}</linearGradient>
<pattern id="lv-flores" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(-12)"><rect width="26" height="26" fill="#F7E3E8"/>${[[7, 7, "#C2185B"], [20, 19, "#B48AA3"]].map(([x, y, c]) => `<g transform="translate(${x} ${y})"><path d="M0-3.2c1.6-1.8 3.6.2 2.2 1.6 2.4-.2 2.4 2.6.2 2.4 1.2 1.8-1.4 3.4-2.4 1.6-1 1.8-3.6.2-2.4-1.6-2.2.2-2.2-2.6.2-2.4C-3.6-1.4-1.6-5 0-3.2z" fill="${c}" opacity=".85"/><circle r="1" fill="#F2D45C"/></g>`).join("")}<path d="M14 4q3 1 4 4M3 18q2-3 5-3" stroke="#7D9A7F" stroke-width="1" fill="none" stroke-linecap="round"/></pattern>
<pattern id="lv-lunares" width="18" height="18" patternUnits="userSpaceOnUse"><rect width="18" height="18" fill="#24365C"/><circle cx="4.5" cy="4.5" r="2.3" fill="#FAF6F0"/><circle cx="13.5" cy="13.5" r="2.3" fill="#FAF6F0"/></pattern>
<pattern id="lv-carey" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(20)"><rect width="40" height="40" fill="#A86B34"/><path d="M4 6c6-4 10 2 8 6s-9 3-8-6zM22 2c5 1 7 6 3 9s-8-3-3-9zM28 22c6-1 9 5 5 9s-11-1-5-9zM6 26c4-2 8 1 7 5s-8 4-7-5z" fill="#5A3416" opacity=".75"/><path d="M16 16c3 0 4 3 2 4s-4-2-2-4zM34 10c2 0 3 2 1 3s-3-2-1-3z" fill="#D9A563" opacity=".7"/></pattern>`;

let defsEl = null, texturaLista = false;
const gradCache = new Set();
let colaGrad = [];          // gradientes creados antes de que exista el <svg> de defs

function asegurar(){
  if (defsEl && defsEl.isConnected) return defsEl.querySelector("defs");
  if (typeof document === "undefined" || !document.body) return null;
  let svg = document.getElementById("lv-ilus-defs");
  if (!svg) {
    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = "lv-ilus-defs";
    svg.setAttribute("width", "0"); svg.setAttribute("height", "0");
    svg.setAttribute("aria-hidden", "true"); svg.setAttribute("focusable", "false");
    svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";   // nunca display:none (rompe filtros)
    svg.innerHTML = `<defs>${DEFS_BASE}${texturas()}</defs>`;
    document.body.insertBefore(svg, document.body.firstChild);
    gradCache.clear();
  }
  defsEl = svg;
  const d = svg.querySelector("defs");
  if (colaGrad.length) { d.insertAdjacentHTML("beforeend", colaGrad.join("")); colaGrad = []; }
  return d;
}

/* Textura de lino y grano: se pinta UNA vez en un <canvas> y se usa como <pattern> de imagen.
   Mucho más barata que feTurbulence en cada tarjeta (rejillas de 30+). Si no hay canvas,
   el patrón usa los filtros lv-lino / lv-grano. */
function texturas(){
  let lino = null, grano = null;
  try { const r = ruido(); lino = r.lino; grano = r.grano; } catch (e) { lino = grano = null; }
  texturaLista = !!lino;
  const pat = (id, img, alt) => `<pattern id="${id}" width="200" height="200" patternUnits="userSpaceOnUse">${img ? `<image href="${img}" width="200" height="200" preserveAspectRatio="none"/>` : alt}</pattern>`;
  return pat("lv-textura", lino, `<rect width="200" height="200" filter="url(#lv-lino)" opacity=".75"/><rect width="200" height="200" filter="url(#lv-grano)" opacity=".7"/>`)
       + pat("lv-grano-p", grano, `<rect width="200" height="200" filter="url(#lv-grano)"/>`);
}
function ruido(){
  const N = 400, cv = document.createElement("canvas"); cv.width = cv.height = N;
  const cx = cv.getContext("2d"); if (!cx) throw 0;
  let sem = 7; const rnd = () => (sem = (sem * 16807) % 2147483647) / 2147483647;
  // hilos: valor por fila (trama) y por columna (urdimbre) que varía despacio a lo largo del hilo
  const suave = (len, paso) => { const k = Array.from({ length: Math.ceil(len / paso) }, rnd), o = new Float32Array(len);
    for (let i = 0; i < len; i++) { const p = i / paso, a = Math.floor(p), f = p - a, u = f * f * (3 - 2 * f); o[i] = k[a % k.length] * (1 - u) + k[(a + 1) % k.length] * u; } return o; };
  const filas = Array.from({ length: N }, () => suave(N, 60 + rnd() * 80)), cols = Array.from({ length: N }, () => suave(N, 60 + rnd() * 80));
  const fb = Float32Array.from({ length: N }, rnd), cb = Float32Array.from({ length: N }, rnd);
  const L = cx.createImageData(N, N), G = cx.createImageData(N, N);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const i = (y * N + x) * 4;
    const tr = fb[y] * .55 + filas[y][x] * .45, ur = cb[x] * .55 + cols[x][y] * .45;
    const v = Math.max(0, (tr * ur) - .18) * 1.25 + (y % 2 ? .05 : 0) + (x % 2 ? .04 : 0);
    L.data[i] = 102; L.data[i + 1] = 71; L.data[i + 2] = 82; L.data[i + 3] = Math.min(255, v * 120);
    const g = rnd(); G.data[i] = 89; G.data[i + 1] = 56; G.data[i + 2] = 71; G.data[i + 3] = g > .55 ? (g - .55) * 140 : 0;
  }
  cx.putImageData(L, 0, 0); const lino = cv.toDataURL("image/png");
  cx.clearRect(0, 0, N, N); cx.putImageData(G, 0, 0); const grano = cv.toDataURL("image/png");
  return { lino, grano };
}

/* Degradados por color: se crean una vez por (color, dirección) en los defs compartidos.
   Ids estables «lv-g-<dir>-<hex>»: nunca se duplican aunque haya 40 tarjetas iguales. */
const DIRS = {
  d: [`x1="0" y1="0" x2="1" y2="1"`, t => [[0, t.hi], [.55, t.base], [1, t.lo]]],
  v: [`x1="0" y1="0" x2="0" y2="1"`, t => [[0, t.hi], [.5, t.base], [1, t.lo]]],
  h: [`x1="0" y1="0" x2="1" y2="0"`, t => [[0, t.lo], [.22, t.hi], [.55, t.base], [1, t.lo]]],   // cilindro de eje vertical
  y: [`x1="0" y1="0" x2="0" y2="1"`, t => [[0, t.lo], [.22, t.hi], [.55, t.base], [1, t.lo]]],   // cilindro de eje horizontal
};
function gradiente(t, dir){
  const id = `lv-g-${dir}-${t.hex.slice(1)}`;
  if (gradCache.has(id)) return id;
  gradCache.add(id);
  let html;
  if (dir === "r") html = `<radialGradient id="${id}" cx=".36" cy=".32" r=".72"><stop offset="0" stop-color="${t.hi}"/><stop offset=".55" stop-color="${t.base}"/><stop offset="1" stop-color="${t.lo}"/></radialGradient>`;
  else { const [a, f] = DIRS[dir] || DIRS.d; html = `<linearGradient id="${id}" ${a}>${f(t).map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("")}</linearGradient>`; }
  const d = asegurar();
  if (d) { if (!d.querySelector("#" + id)) d.insertAdjacentHTML("beforeend", html); }
  else colaGrad.push(html);
  return id;
}

/** Pintura de una superficie a partir del color de catálogo (hex, "linear", "flores", "lunares").
    Devuelve el tono más t.f(dir) → atributos de relleno listos para el <path>. */
function P(c, porDefecto){
  if (c == null || c === "") c = porDefecto || "#E9B9C3";
  const esp = ESPECIAL[c];
  if (esp) {
    const t = Object.assign({}, tono(esp.hex));
    if (esp.line) t.line = esp.line;
    t.esp = c;
    t.f = () => `fill="${esp.fill}"`;
    t.relieve = true;     // patrón plano: se le pone encima lv-relieve para dar volumen
    t.multi = c === "linear" ? MULTI.map(tono) : null;
    return t;
  }
  if (!esHex(c)) c = porDefecto || "#E9B9C3";
  const t = Object.assign({}, tono(c));
  const transp = c.toUpperCase() === "#EAF2F5";            // «Transparente»
  if (transp) { t.line = "hsl(200 22% 52%)"; t.lo = "hsl(200 20% 78%)"; }
  t.transp = transp;
  if (c.toUpperCase() === "#8B5A2B") { t.f = () => `fill="url(#lv-carey)"`; t.relieve = true; t.esp = "carey"; return t; }
  t.f = (dir = "d") => `fill="url(#${gradiente(t, dir)})"${transp ? ` fill-opacity=".72"` : ""}`;
  return t;
}
/** Tono i-ésimo para objetos con varias piezas: multicolor reparte la paleta; si no, el mismo. */
const enesimo = (t, i, c) => t.multi ? P(MULTI[i % MULTI.length]) : t;

/* ---------------- ayudantes de dibujo ---------------- */
const SW = 1.25;
const f1 = n => +n.toFixed(1);
let nId = 0;
const uid = p => `lvi-${p}${++nId}`;
const ln = (t, w = SW, extra = "") => `fill="none" stroke="${t.line}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}`;
/** Sombra proyectada (ciruela 20 %, desenfocada, +5 +7). Marcada con data-lvs para poder girarla en bodegones. */
const som = (inner, dx = 5, dy = 7, op = .2) => `<g data-lvs transform="translate(${dx} ${dy})" filter="url(#lv-suave)" fill="${CIRUELA}" opacity="${op}">${inner}</g>`;
/** Sombra de contacto (tinta 16 %, poco desenfoque, pegada al objeto). */
const con = (inner, op = .16) => `<g transform="translate(1 2.4)" filter="url(#lv-contacto)" fill="${TINTA}" opacity="${op}">${inner}</g>`;
/** Superficie completa: relleno degradado + luz + (relieve si es estampado) + trazo. Sin sombras. */
const sup = (d, t, { dir = "d", luz = true, w = SW, extra = "" } = {}) =>
  `<path d="${d}" ${t.f(dir)}${extra}/>` +
  (luz ? `<path d="${d}" fill="url(#lv-luz)"/>` : "") +
  (t.relieve ? `<path d="${d}" fill="url(#lv-relieve)"/>` : "") +
  (w ? `<path d="${d}" ${ln(t, w)}/>` : "");
/** Las 6 capas de una forma simple: sombra → contacto → relleno → luz → trazo (el detalle y el brillo los pone el dibujo). */
const capa = (d, t, o = {}) => (o.sombra === false ? "" : som(`<path d="${d}"/>`, o.dx, o.dy)) + (o.contacto === false ? "" : con(`<path d="${d}"/>`)) + sup(d, t, o);
/** Brillo: un arco blanco de 2,2 px en el borde de luz. */
const rim = (d, t, w = 2.2, op = 1) => `<path d="${d}" fill="none" stroke="${t.rim}" stroke-width="${w}" stroke-linecap="round" opacity="${op}"/>`;

/* formas como «d» de path */
const circ = (cx, cy, r) => `M${f1(cx - r)} ${f1(cy)}a${r} ${r} 0 1 0 ${f1(2 * r)} 0a${r} ${r} 0 1 0 ${f1(-2 * r)} 0Z`;
const elip = (cx, cy, rx, ry) => `M${f1(cx - rx)} ${f1(cy)}a${rx} ${ry} 0 1 0 ${f1(2 * rx)} 0a${rx} ${ry} 0 1 0 ${f1(-2 * rx)} 0Z`;
const rr = (x, y, w, h, r = 0) => { r = Math.min(r, w / 2, h / 2); return `M${f1(x + r)} ${f1(y)}H${f1(x + w - r)}${r ? `a${r} ${r} 0 0 1 ${r} ${r}` : ""}V${f1(y + h - r)}${r ? `a${r} ${r} 0 0 1 ${-r} ${r}` : ""}H${f1(x + r)}${r ? `a${r} ${r} 0 0 1 ${-r} ${-r}` : ""}V${f1(y + r)}${r ? `a${r} ${r} 0 0 1 ${r} ${-r}` : ""}Z`; };
const pol = pts => "M" + pts.map(p => p.map(f1).join(" ")).join("L") + "Z";
const pt = (cx, cy, r, a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
const arco = (cx, cy, r, a0, a1) => { const [x0, y0] = pt(cx, cy, r, a0), [x1, y1] = pt(cx, cy, r, a1); return `M${f1(x0)} ${f1(y0)}A${r} ${r} 0 ${Math.abs(a1 - a0) > Math.PI ? 1 : 0} ${a1 > a0 ? 1 : 0} ${f1(x1)} ${f1(y1)}`; };
const rot = (s, a, cx = 100, cy = 100) => `<g transform="rotate(${a} ${cx} ${cy})">${s}</g>`;
const rango = (n, f) => Array.from({ length: n }, (_, i) => f(i)).join("");
/** Esfera pequeña (perla, cabeza de alfiler, cuenta): relleno radial + punto de luz. */
const esfera = (cx, cy, r, t, { sombra = true, w = SW * .8 } = {}) =>
  (sombra ? `<circle cx="${f1(cx + r * .3)}" cy="${f1(cy + r * .45)}" r="${r}" fill="${CIRUELA}" opacity=".16" filter="url(#lv-contacto)"/>` : "") +
  `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${r}" ${t.esp ? t.f() : `fill="url(#${gradiente(t, "r")})"`}/>` +
  (t.relieve ? `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${r}" fill="url(#lv-relieve)"/>` : "") +
  `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${r}" ${ln(t, w)}/>` +
  `<circle cx="${f1(cx - r * .35)}" cy="${f1(cy - r * .38)}" r="${f1(Math.max(.8, r * .28))}" fill="#fff" opacity="${t.oscuro ? .5 : .75}"/>`;
/** Texto pequeño dentro de una ilustración (vale, regla). */
const texto = (x, y, s, size = 10, fill = TINTA, extra = "") => `<text x="${x}" y="${y}" font-family="Newsreader, Georgia, 'Times New Roman', serif" font-size="${size}" fill="${fill}" text-anchor="middle"${extra}>${String(s).replace(/[&<>"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[m])}</text>`;

/* Banda trazada (cordón, cinta, diadema): contorno + relleno degradado como trazo + luz. ¡d nunca debe ser una recta pura (bbox nulo)! */
const banda = (d, t, w, { dir = "d", luz = true } = {}) =>
  `<path d="${d}" fill="none" stroke="${t.line}" stroke-width="${f1(w + 2 * SW)}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" ${t.f(dir).replace(/fill/g, "stroke")} stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` +
  (luz ? `<path d="${d}" fill="none" stroke="url(#lv-luz)" stroke-width="${w}" stroke-linecap="round"/>` : "");
const somBanda = (d, w, dx = 5, dy = 7) => som(`<path d="${d}" fill="none" stroke="${CIRUELA}" stroke-width="${w}" stroke-linecap="round"/>`, dx, dy);
/* Gira un grupo y recoloca sus sombras (la luz sigue arriba-izquierda). */
const R = (s, a, cx = 100, cy = 100) => a ? `<g transform="rotate(${a} ${cx} ${cy})">${girarSombras(s, a)}</g>` : s;
/* Polar: contorno cerrado r(θ) */
const polar = (cx, cy, rf, n = 120) => "M" + Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2, r = rf(a); return `${f1(cx + r * Math.cos(a))} ${f1(cy + r * Math.sin(a))}`; }).join("L") + "Z";

/* hilo suelto (doble trazo: contorno + color) */
const hebra = (d, t, w = 2.2) => `<path d="${d}" fill="none" stroke="${t.line}" stroke-width="${w + 1.1}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${t.hi}" stroke-width="${w}" stroke-linecap="round"/>`;
/* alambre metálico (alfiler, corchete, imperdible) */
const alambre = (d, t, w = 2.4) => `<path d="${d}" fill="none" stroke="${t.line}" stroke-width="${f1(w + 1)}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${t.base}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#fff" stroke-width="${f1(w * .3)}" stroke-linecap="round" opacity=".7" transform="translate(-.4 -.5)"/>`;
const sombraAlambre = (d, w = 3) => som(`<path d="${d}" fill="none" stroke="${CIRUELA}" stroke-width="${w}" stroke-linecap="round"/>`, 3, 4, .22);

const H = { hebra, alambre, sombraAlambre, banda, somBanda, R, polar, girarSombras, esHex, P, enesimo, MULTI, METAL, ORO, MADERA, CIRUELA, TINTA, SW, f1, uid, ln, som, con, sup, capa, rim, circ, elip, rr, pol, pt, arco, rot, rango, esfera, texto };

/* ---------------- dibujos ----------------
   D[nombre] = (color, info) → markup en el espacio 0-200 (objeto dentro de 30-170).
   info = {n: nombre de la versión, prod, medida}.  POR_DEFECTO: color cuando la versión no es un color. */
const D = {};
const POR_DEFECTO = {
  aguja: METAL, dedal: METAL, "agujas-punto": "#D9BC92", ganchillo: "#B9A3D6", bastidor: MADERA,
  vale: "#E9B9C3", imperdible: METAL, corchete: METAL, tijera: METAL, "cremallera-metal": ORO,
  "boton-metal": ORO, enhebrador: METAL, marcador: "linear"
};
/* Formas genéricas de reserva (versión 0): cada tipo del catálogo tiene una familia.
   Los archivos ilus-*.js sustituyen cada entrada por su dibujo propio. */
const G = {
  disco(c){ const t = P(c); return capa(circ(100, 100, 52), t) + `<path d="${circ(100, 100, 41)}" ${ln(t, SW, ` opacity=".7"`)}/>` + rango(4, i => esfera(91 + (i % 2) * 18, 91 + (i > 1) * 18, 4.4, t, { sombra: false })) + rim(arco(100, 100, 46, Math.PI * 1.05, Math.PI * 1.4), t); },
  carrete(c){ const t = P(c), m = P(MADERA); return som(`<path d="${rr(64, 40, 74, 124, 6)}"/>`) + capa(rr(62, 40, 76, 13, 5), m, { sombra: false }) + capa(rr(62, 147, 76, 13, 5), m, { sombra: false }) + sup(rr(69, 53, 62, 94), t, { dir: "h" }) + `<g ${ln(t, .8, ` opacity=".5"`)}>${rango(15, i => `<path d="M69 ${58 + i * 6}q31 3 62 0"/>`)}</g>`; },
  tira(c){ const t = P(c); const d = "M34 118C60 86 92 132 122 98S160 70 168 78L170 96C150 92 140 118 122 122S66 116 40 138Z"; return capa(d, t) + rim("M44 120C64 98 90 126 118 102", t, 1.8, .8); },
  prenda(c){ const t = P(c); const d = "M70 36H130L138 70Q150 110 146 164H54Q50 110 62 70Z"; return capa(d, t, { dir: "v" }) + `<path d="M70 48H130" ${ln(t, .8, ` stroke-dasharray="2 2.5"`)}/>`; },
  bolso(c){ const t = P(c); const d = "M50 82H150L160 160Q100 170 40 160Z"; return som(`<path d="${d}"/>`) + `<path d="M74 84Q74 40 100 40T126 84" ${ln(t, 5)} stroke="${t.base}"/>` + capa(d, t, { sombra: false }) + `<path d="M50 82H150V108Q100 118 50 108Z" ${t.f("v")} ${ln(t)}/>`; },
  joya(c){ const t = P(c); return som(`<path d="${circ(100, 100, 52)}" fill="none" stroke="#000" stroke-width="10"/>`) + rango(22, i => { const [x, y] = pt(100, 100, 52, i / 22 * Math.PI * 2); return esfera(x, y, 7, enesimo(t, i), { sombra: false }); }); },
  palito(c){ const t = P(c); return capa(rr(40, 94, 120, 12, 6), t, { dir: "y" }) + rim("M48 97H140", t, 1.4, .8); },
  tela(c){ const t = P(c); const d = "M44 52L150 40L160 150L52 162Z"; return capa(d, t) + `<path d="M50 60L150 48" ${ln(t, .8, ` stroke-dasharray="2 2.5"`)}/>`; },
};
const FAMILIA = {
  disco: "boton boton-flor boton-metal boton-pie broche broche-flor dedal acerico ovillo enhebrador jaboncillo parche aplique pendiente metro coletero paraguas",
  carrete: "bobina madeja cinta elastico cordon",
  tira: "cremallera cremallera-metal puntilla velcro tirador corchete",
  prenda: "media calcetin camiseta braga sujetador camison",
  tela: "tela panuelo panuelito fular bufanda vale kit costurero bastidor",
  bolso: "bolso bandolera monedero cartera bolsa funda",
  joya: "collar pulsera marcador",
  palito: "alfiler imperdible aguja agujas-punto ganchillo tijera descosedor pinza diadema horquilla abanico",
};
for (const [fam, lista] of Object.entries(FAMILIA)) for (const k of lista.split(" ")) D[k] = G[fam];

let avisados = new Set();
function cuerpo(nombre, c, info = {}){
  let f = D[nombre];
  if (!f) {
    if (!avisados.has(nombre)) { avisados.add(nombre); console.warn(`[LV.ilus] no hay dibujo para «${nombre}»: se usa un botón genérico.`); }
    f = D.boton || G.disco;
  }
  const col = (c == null || c === "" || (!esHex(c) && !ESPECIAL[c])) ? (POR_DEFECTO[nombre] || "#E9B9C3") : c;
  try { return f(col, info); }
  catch (e) { console.error(`[LV.ilus] error al dibujar «${nombre}»`, e); return G.disco(col); }
}

/* Gira la sombra proyectada en sentido contrario a la pieza: la luz sigue viniendo de arriba-izquierda. */
function girarSombras(markup, ang){
  if (!ang) return markup;
  const r = -ang * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
  return markup.replace(/<g data-lvs transform="translate\(([-\d.]+) ([-\d.]+)\)"/g, (m, dx, dy) =>
    `<g data-lvs transform="translate(${f1(dx * c - dy * s)} ${f1(dx * s + dy * c)})"`);
}

/* ---------------- lienzo ---------------- */
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]);
const fondo = (lienzo, w, h, lino) =>
  `<rect width="${w}" height="${h}" style="fill:${lienzo}"/>` +
  (lino ? `<rect width="${w}" height="${h}" fill="url(#lv-textura)" opacity="${texturaLista ? .7 : .3}"/>` : "");
const granoEncima = (w, h, lino) => lino ? `<rect width="${w}" height="${h}" fill="url(#lv-grano-p)" opacity=".35" pointer-events="none"/>` : "";
function envolver(inner, { w = 200, h = 200, lienzo = "var(--c-rosa)", lino = true, decorativa = true, alt = "", vb, clase = "" }){
  asegurar();
  const aria = decorativa || !alt ? `aria-hidden="true" focusable="false"` : `role="img" aria-label="${esc(alt)}"`;
  return `<svg class="ilu${clase ? " " + clase : ""}" viewBox="${vb || `0 0 ${w} ${h}`}" preserveAspectRatio="xMidYMid slice" ${aria} xmlns="http://www.w3.org/2000/svg">` +
    fondo(lienzo, w, h, lino) + inner + granoEncima(w, h, lino) + `</svg>`;
}

/* Regla de escala (vista «escala») */
function regla(){
  const t = P("#F2D45C");
  return capa(rr(26, 150, 148, 22, 2), t, { dir: "v", dx: 3, dy: 4 }) +
    `<g ${ln(t, .9)}>${rango(29, i => `<path d="M${30 + i * 5} 150v${i % 2 ? 4 : i % 10 === 0 ? 9 : 6.5}"/>`)}</g>` +
    [0, 5, 10].map((v, i) => texto(30 + i * 50 + (i ? 0 : 4), 168, v, 8, t.line)).join("") + texto(166, 168, "cm", 7, t.line);
}

/* ---------------- API ---------------- */
function pieza(nombre, color, { rot: ang = 0, info } = {}){
  return `<g class="ilu-pieza" data-ilu="${esc(nombre)}">${girarSombras(cuerpo(nombre, color, info), ang)}</g>`;
}

function rotulo(prod, v){
  if (!v) return prod.nombre;
  if (prod.tipoVar === "color") return `${prod.nombre}, color ${v.n}`;
  if (prod.tipoVar && prod.variantes.length > 1) return `${prod.nombre}, ${v.n}`;
  return prod.nombre;
}

function dibujar(prod, idx = 0, { decorativa = true, lienzo, vista = "principal", lino = true, clase = "" } = {}){
  if (!prod) return icono("boton", null, { decorativa });
  const vs = prod.variantes || [], v = vs[idx] || vs[0] || null;
  const c = v ? v.c : null, nombre = prod.icono || "boton";
  const info = { n: v ? v.n : "", prod, tipoVar: prod.tipoVar };
  const fondoCss = lienzo || (LV.datos && LV.datos.lienzo ? LV.datos.lienzo(prod) : "var(--c-rosa)");
  const alt = rotulo(prod, v);
  let inner, vb;
  if (vista === "detalle") {
    inner = cuerpo(nombre, c, info);
    const fz = FOCO[nombre] || [100, 100]; vb = `${fz[0] - 52} ${fz[1] - 52} 104 104`;
  } else if (vista === "escala") {
    inner = `<g transform="translate(100 84) scale(.66) translate(-100 -100)">${cuerpo(nombre, c, info)}</g>` + regla();
  } else if (vista === "combinada") {
    let comp = null;
    try { comp = LV.datos && LV.datos.aJuego ? LV.datos.aJuego(prod, 1)[0] : null; } catch (e) { comp = null; }
    const ci = comp ? comp.icono : (prod.cat === "complementos" ? "panuelito" : "bobina");
    const cc = comp && comp.variantes && comp.variantes[0] ? comp.variantes[0].c : "#E9B9C3";
    inner = `<g transform="translate(140 136) rotate(10) scale(.5) translate(-100 -100)">${girarSombras(cuerpo(ci, cc, { n: comp && comp.variantes[0] ? comp.variantes[0].n : "" }), 10)}</g>` +
            `<g transform="translate(86 88) rotate(-8) scale(.7) translate(-100 -100)">${girarSombras(cuerpo(nombre, c, info), -8)}</g>`;
  } else inner = cuerpo(nombre, c, info);
  return envolver(inner, { lienzo: fondoCss, lino, decorativa, alt, vb, clase });
}

function icono(nombre, color, { decorativa = true, alt = "", lienzo = "var(--c-rosa)", lino = true, vista, clase = "", info } = {}){
  let inner = cuerpo(nombre, color, info || {}), vb;
  if (vista === "detalle") { const fz = FOCO[nombre] || [100, 100]; vb = `${fz[0] - 52} ${fz[1] - 52} 104 104`; }
  return envolver(inner, { lienzo, lino, decorativa, alt, vb, clase });
}

/** piezas: [{icono, color, x, y, rot=0, escala=1}] — x, y = centro de la pieza en el lienzo (ancho × alto);
    escala 1 = la pieza ocupa su tamaño de ficha (200 unidades). */
function bodegon(piezas = [], { lienzo = "var(--c-rosa)", ancho = 200, alto = 200, alt = "", lino = true, clase = "" } = {}){
  const inner = piezas.map(p => {
    const x = p.x == null ? ancho / 2 : p.x, y = p.y == null ? alto / 2 : p.y, r = p.rot || 0, e = p.escala || 1;
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${r}) scale(${e}) translate(-100 -100)">${pieza(p.icono, p.color, { rot: r, info: p.info })}</g>`;
  }).join("");
  return envolver(inner, { w: ancho, h: alto, lienzo, lino, decorativa: !alt, alt, clase });
}

/* Centro de interés para la vista «detalle» (zoom). Los archivos de dibujos pueden ampliarlo. */
const FOCO = {};

function iniciar(){ asegurar(); }

const tipos = () => Object.keys(D).sort();

/** ¿Tiene sentido ofrecer esta vista para el producto? (B4/B5) */
function tieneVista(prod, vista = "principal"){
  if (!prod) return false;
  if (vista === "principal" || vista === "detalle" || vista === "escala") return true;
  if (vista === "combinada") { try { return !!(LV.datos && LV.datos.aJuego && LV.datos.aJuego(prod, 1).length); } catch (e) { return false; } }
  return false;
}

return { tieneVista, iniciar, dibujar, icono, pieza, bodegon, tono, tipos, D, H, FOCO, POR_DEFECTO, _G: G };
})();
