/* =================================================================
   LA VALENCIANA · ovillo.js
   Al entrar en el apartado de hilos (#/hilo/… o Mercería › Lanas y labores)
   y cada vez que se abre la ficha de un ovillo (con el color elegido),
   un ovillo entra por la izquierda a ras de la parte de abajo de la pantalla
   y rueda hacia la derecha dando botes, como una planta rodadora del oeste,
   deshaciéndose y dejando el hilo en el suelo. Cuando sale por la derecha,
   el hilo se va recogiendo poco a poco.
   - No bloquea nada (pointer-events: none) y no se anuncia (aria-hidden).
   - Con «reducir movimiento» no aparece.
   - En el móvil rueda sobre la barra inferior (.lv-dock) si está visible.
   - Pruebas: LV.ovillo.lanzar() lo lanza a mano.
   ================================================================= */
(function () {
"use strict";
window.LV = window.LV || {};

const NS = "http://www.w3.org/2000/svg";
const reducido = () => !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
const enHilos = d => !!d && (d.vista === "hilo" ||
  (d.vista === "categoria" && d.params && d.params.cat === "merceria" && d.params.sub === "lanas"));

/* color del ovillo = el del hilo en el que se entra:
   - #/hilo/<tipo>: el color propio del tipo (LV.hilos, campo color)
   - Mercería › Lanas: uno de los tipos al azar
   Si falta, lana teja. Las hebras y el hilo del suelo van un poco más oscuros
   para que se vean sobre el fondo blanco aunque el color sea muy claro. */
const TEJA = "#C77E62";
const aRGB = h => { const m = /^#?([0-9a-f]{6})$/i.exec(h || ""); if (!m) return null; const n = parseInt(m[1], 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
const mezcla = (a, b, t) => { const x = aRGB(a), y = aRGB(b); return "#" + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, "0")).join(""); };
const luz = h => { const [r, g, b] = aRGB(h); return (.2126 * r + .7152 * g + .0722 * b) / 255; };
function colorDe(d){
  const H = LV.hilos, tipos = H && H.TIPOS ? H.TIPOS : [];
  let c = null;
  if (d && d.vista === "hilo" && d.params && d.params.tipo) c = d.params.tipo.color;
  else if (esOvillo(d)) {                          // ficha de un ovillo: el color elegido en la ficha
    const prod = d.params.prod, r = document.querySelector('#contenido [role="radio"][aria-checked="true"][data-valor]');
    const v = prod.variantes[r ? +r.dataset.valor || 0 : 0];
    c = (v && v.c) || (H.deProducto(prod) || {}).color;
  }
  else if (tipos.length) c = (tipos[Math.floor(Math.random() * tipos.length)] || {}).color;
  return aRGB(c) ? c : TEJA;
}
function paleta(c){
  const claro = luz(c) > .72;                    // pasteles: oscurecer más el contorno y el hilo
  return {
    cuerpo: c,
    hebra: mezcla(c, "#2F2A26", claro ? .38 : .28),
    brillo: mezcla(c, "#FFFFFF", .45),
    hilo: mezcla(c, "#2F2A26", claro ? .3 : .12)
  };
}

/* ficha de un ovillo (producto enlazado a un tipo de hilo: Happy Cotton, 100% Baby 3…) */
const esOvillo = d => !!d && d.vista === "producto" && d.params && d.params.prod &&
  !!(LV.hilos && LV.hilos.deProducto && LV.hilos.deProducto(d.params.prod));

let enCurso = null;

const el = (n, at) => { const e = document.createElementNS(NS, n); for (const k in at) e.setAttribute(k, at[k]); return e; };
const lerp = (a, b, t) => a + (b - a) * t;
const suave = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

/* ¿Dónde está el «suelo»? Encima de la barra inferior del móvil si se ve; si no, el borde de abajo. */
function suelo(){
  const dock = document.querySelector(".lv-dock");
  if (dock && !dock.hidden) {
    const r = dock.getBoundingClientRect();
    if (r.height > 0 && getComputedStyle(dock).display !== "none" && r.top < innerHeight) return r.top + 1;
  }
  return innerHeight - 3;
}

function lanzar(colorBase){
  const P = paleta(colorBase || TEJA);
  if (enCurso || reducido() || document.hidden) return;
  const W = innerWidth, H = innerHeight, Y = suelo();
  const movil = W < 700;
  const R0 = movil ? 24 : 32, R1 = R0 * .5;      // el ovillo adelgaza al deshacerse
  const DUR = movil ? 3400 : 4400, RECOGER = 1900;
  const alto = Math.min(Y, 260);                 // la capa solo ocupa la franja de abajo

  const capa = document.createElement("div");
  capa.className = "ovi";
  capa.setAttribute("aria-hidden", "true");
  capa.style.top = (Y - alto) + "px";
  capa.style.height = alto + "px";
  const svg = el("svg", { width: W, height: alto, viewBox: `0 0 ${W} ${alto}` });
  const g0 = alto;                                // y del suelo dentro del svg

  const hilo = el("path", { class: "ovi-hilo", fill: "none", stroke: P.hilo, "stroke-width": movil ? 2 : 2.4, "stroke-linecap": "round", "stroke-linejoin": "round" });
  const sombra = el("ellipse", { class: "ovi-sombra", cx: 0, cy: g0 - 1.5, rx: R0, ry: 3.2, fill: "rgba(47,42,38,.16)" });
  const bola = el("g", {});
  const giro = el("g", {});
  // cuerpo del ovillo + hebras enrolladas (arcos recortados al círculo)
  const id = "ovi-c" + Date.now();
  const clip = el("clipPath", { id }); clip.appendChild(el("circle", { cx: 0, cy: 0, r: 1 }));
  const defs = el("defs", {}); defs.appendChild(clip);
  giro.appendChild(el("circle", { cx: 0, cy: 0, r: 1, fill: P.cuerpo }));
  const hebras = el("g", { "clip-path": `url(#${id})`, fill: "none", stroke: P.hebra, "stroke-width": .07, "stroke-linecap": "round" });
  [[-.35, .95, 25], [-.05, .9, 25], [.25, .85, 25], [.55, .7, 25], [-.6, .7, 25]].forEach(([dx, ry, rot]) =>
    hebras.appendChild(el("ellipse", { cx: dx, cy: 0, rx: .38, ry, transform: `rotate(${rot})` })));
  [[-.5, -.2, -50], [.1, .45, -50], [.45, -.45, -50]].forEach(([dx, dy, rot]) =>
    hebras.appendChild(el("ellipse", { cx: dx, cy: dy, rx: .75, ry: .3, transform: `rotate(${rot})`, stroke: P.brillo })));
  giro.appendChild(hebras);
  giro.appendChild(el("circle", { cx: 0, cy: 0, r: .97, fill: "none", stroke: P.hebra, "stroke-width": .05, opacity: .6 }));
  bola.appendChild(giro);
  svg.append(defs, sombra, hilo, bola);
  capa.appendChild(svg);
  document.body.appendChild(capa);

  /* el hilo en el suelo: hace ondas y rizos (bucles) como cuando se suelta lana.
     Trocoide: x = s - k·sen(ωs), y = suelo - k·(1 - cos(ωs))·0,7; con k·ω > 1 sale bucle. */
  const f1 = Math.random() * 6, f2 = Math.random() * 6;
  const w = 2 * Math.PI / (movil ? 46 : 58);
  const kMax = movil ? 13 : 17;
  const kDe = s => Math.max(2, kMax * (.62 + .38 * Math.sin(s / 110 + f1)) + 2.5 * Math.sin(s / 31 + f2));
  const curva = s => { const k = kDe(s); return [s - k * Math.sin(w * s), g0 - 2 - k * (1 - Math.cos(w * s)) * .7]; };
  const puntos = [];
  let sHecho = -R0 * 2;
  let ang = 0, xPrev = -R0;

  const xDe = t => { const u = t + .025 * Math.sin(t * Math.PI * 4); return lerp(-R0 * 1.2, W + R0 * 2.2, suave(Math.min(1, Math.max(0, u)) * .85 + u * .15)); };
  // botes de planta rodadora: cuatro saltos que van a menos
  const BOTES = 4;
  const boteY = t => { const p = t * BOTES; const n = Math.floor(p); const a = (movil ? 16 : 24) * Math.pow(.62, n); return a * Math.sin(Math.PI * (p - n)); };

  const t0 = performance.now();
  let fase = "rodar", tRecoger = 0, L = 0;

  const paso = ahora => {
    if (fase === "rodar") {
      const t = Math.min(1, (ahora - t0) / DUR);
      const x = xDe(t), r = lerp(R0, R1, t), sube = boteY(t);
      const cy = g0 - r - sube;
      ang += (x - xPrev) / r; xPrev = x;
      bola.setAttribute("transform", `translate(${x.toFixed(1)} ${cy.toFixed(1)})`);
      giro.setAttribute("transform", `rotate(${(ang * 180 / Math.PI).toFixed(1)}) scale(${r.toFixed(2)})`);
      sombra.setAttribute("cx", x.toFixed(1));
      sombra.setAttribute("rx", (r * (1 - sube / 60)).toFixed(1));
      sombra.setAttribute("opacity", (1 - sube / 40).toFixed(2));
      // el hilo queda en el suelo detrás del ovillo y sube hasta él
      const xs = x - r * 1.3;
      while (sHecho + 2.5 <= xs) { sHecho += 2.5; puntos.push(curva(sHecho)); }
      const sale = [x - r * .82, cy + r * .5];
      let d = "";
      puntos.forEach((p, i) => { d += (i ? " L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); });
      const u = puntos[puntos.length - 1];
      if (u) d += ` C${(u[0] + 10).toFixed(1)} ${(g0 - 1).toFixed(1)} ${(sale[0] - 14).toFixed(1)} ${(sale[1] + 6).toFixed(1)} ${sale[0].toFixed(1)} ${sale[1].toFixed(1)}`;
      hilo.setAttribute("d", d);
      if (t >= 1) {
        fase = "recoger"; tRecoger = ahora;
        bola.remove(); sombra.remove();
        L = hilo.getTotalLength();
        hilo.style.strokeDasharray = `${L} ${L}`;
      }
    } else {
      // se recoge desde el cabo de la izquierda hacia la derecha, como si tiraran del ovillo
      const t = Math.min(1, (ahora - tRecoger) / RECOGER);
      hilo.style.strokeDashoffset = String(-L * suave(t));
      if (t >= 1) return acabar();
    }
    enCurso.raf = requestAnimationFrame(paso);
  };
  const acabar = () => {
    if (!enCurso) return;
    cancelAnimationFrame(enCurso.raf);
    capa.remove();
    removeEventListener("resize", acabar);
    enCurso = null;
  };
  enCurso = { raf: requestAnimationFrame(paso), acabar };
  addEventListener("resize", acabar);           // si cambia el tamaño de la pantalla, se quita sin más
}

document.addEventListener("lv:ruta-cambiada", e => {
  const d = e.detail || {};
  if (d.parcial) return;
  if (enCurso) enCurso.acabar();
  if (esOvillo(d)) {                            // en cada ficha de ovillo, siempre
    setTimeout(() => lanzar(colorDe(d)), d.primera ? 900 : 450);
    return;
  }
  if (!enHilos(d)) return;
  // Algodón, Merino…: cada vez que se entra en uno (también al pasar de uno a otro).
  // Dentro del mismo tipo (sus labores) o en Lanas viniendo de hilos, no se repite.
  const a = d.anterior;
  if (d.vista === "hilo") { if (a && a.vista === "hilo" && a.params && a.params.tipo === d.params.tipo) return; }
  else if (enHilos(a)) return;
  const c = colorDe(d);
  setTimeout(() => lanzar(c), d.primera ? 900 : 450);    // tras la transición de página
});

/* al cambiar de color en la ficha de un ovillo, sale otro ovillo de ese color */
document.addEventListener("lv:variante-cambiada", e => {
  const d = e.detail || {}, prod = d.prod;
  if (!prod || !(LV.hilos && LV.hilos.deProducto && LV.hilos.deProducto(prod))) return;
  const v = prod.variantes[d.vi]; if (!v || !v.c) return;
  if (enCurso) enCurso.acabar();
  lanzar(v.c);
});

LV.ovillo = { lanzar };
})();
