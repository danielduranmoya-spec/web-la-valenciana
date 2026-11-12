/* =========================================================
   LA VALENCIANA v2 · ilus-merceria.js · PROPIETARIO: B8
   Dibujos de Mercería (y lotes). Se registran en LV.ilus.D.
   Plantilla de 6 capas: sombra → contacto → relleno → luz → trazo → detalle + brillo.
   Espacio 0-200, objeto dentro de 30-170, luz arriba-izquierda.
   ========================================================= */
(() => {
"use strict";
const I = window.LV && LV.ilus; if (!I || !I.H) return;
const { P, enesimo, MULTI, METAL, ORO, MADERA, CIRUELA, TINTA, SW, f1, uid, ln, som, con, sup, capa, rim, circ, elip, rr, pol, pt, arco, rango, esfera, texto, banda, somBanda, R, polar } = I.H;
const D = I.D, PI = Math.PI;
const { hebra, alambre, sombraAlambre } = I.H;
const agujeros = (pts, t, r = 5) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${t.lo}" stroke="${t.line}" stroke-width="${SW}"/><circle cx="${f1(x + .6)}" cy="${f1(y + .9)}" r="${f1(r * .55)}" fill="${TINTA}" opacity=".18"/>`).join("");
const tamano = (n, base = 1) => /\bS\b|pequeñ/i.test(n || "") ? base * .86 : /\bL\b|grande/i.test(n || "") ? base * 1.12 : base;

Object.assign(D, {

/* ---------- hilos ---------- */
bobina(c){
  const t = P(c), m = P(MADERA);
  return som(`<path d="${rr(64, 40, 76, 122, 6)}"/><path d="M136 112c20 6 28 24 36 36l-5 5z"/>`, 6, 8) +
    con(`<path d="${rr(62, 40, 76, 120, 6)}"/>`) +
    sup(rr(69, 52, 62, 96), t, { dir: "h", w: 0 }) +
    `<g ${ln(t, .75, ` opacity=".5"`)}>${rango(15, i => `<path d="M69 ${f1(57.5 + i * 6.05)}q31 3 62 0"/>`)}</g>` +
    `<path d="${rr(69, 52, 62, 96)}" ${ln(t)}/>` + rim("M75 58v84", t, 2.2, .8) +
    sup(rr(62, 40, 76, 13, 5), m, { dir: "v" }) + sup(rr(62, 147, 76, 13, 5), m, { dir: "v" }) +
    `<ellipse cx="100" cy="46.5" rx="7" ry="2.6" fill="${m.lo}" opacity=".8"/>` + rim("M68 43.5h40", m, 1.6, .9) +
    hebra("M131 110c20 4 26 22 40 36", t, 2);
},
madeja(c){
  const t = P(c), papel = P("#F7F1E6"), body = "M38 100C38 86 50 82 64 84H136C150 82 162 86 162 100S150 118 136 116H64C50 118 38 114 38 100Z";
  const s = som(`<path d="${body}"/>`) + con(`<path d="${body}"/>`) + sup(body, t, { dir: "v" }) +
    `<g ${ln(t, .7, ` opacity=".55"`)}>${rango(7, i => `<path d="M46 ${88 + i * 4}C80 ${86 + i * 4.6} 120 ${90 + i * 3.6} 154 ${88 + i * 4}"/>`)}</g>` +
    `<path d="M44 100c4-9 14-10 20-6M156 100c-4 9-14 10-20 6" ${ln(t, .9)}/>` + rim("M52 89C80 85 120 86 148 89", t, 1.8, .85) +
    [[70, 22], [114, 20]].map(([x, w]) => capa(rr(x, 79, w, 42, 2), papel, { sombra: false }) + `<path d="M${x + 3} 92h${w - 6}M${x + 3} 108h${w - 6}" stroke="${CIRUELA}" stroke-width="1" opacity=".7"/>`).join("") +
    texto(124, 103, "6", 8, CIRUELA, ` font-style="italic"`);
  return R(s, -16);
},

/* ---------- botones ---------- */
boton(c){
  const t = P(c);
  return capa(circ(100, 100, 54), t) +
    `<circle cx="100" cy="100" r="43" fill="${t.lo}" opacity=".2"/><circle cx="100" cy="100" r="43" ${ln(t, SW, ` opacity=".8"`)}/>` +
    rim("M62 78a44 44 0 0 1 30-26", t, 2.4) +
    agujeros([[89, 89], [111, 89], [89, 111], [111, 111]], t, 5.2) +
    `<path d="M89 89 111 111M111 89 89 111" stroke="${t.line}" stroke-width="1.1" fill="none" stroke-dasharray="1.5 2.5" opacity=".9"/>`;
},
"boton-flor"(c){
  const t = P(c), d = polar(100, 100, a => 46 + 9 * Math.cos(5 * (a + PI / 2)), 150);
  return capa(d, t) + `<path d="${polar(100, 100, a => 35 + 6 * Math.cos(5 * (a + PI / 2)), 150)}" ${ln(t, .9, ` stroke-dasharray="2 2.6" opacity=".8"`)}/>` +
    rango(5, i => { const a = -PI / 2 + i * 2 * PI / 5, [x1, y1] = pt(100, 100, 18, a), [x2, y2] = pt(100, 100, 40, a); return `<path d="M${f1(x1)} ${f1(y1)}L${f1(x2)} ${f1(y2)}" ${ln(t, .8, ` opacity=".45"`)}/>`; }) +
    rim(I.H.arco(100, 100, 48, PI * 1.08, PI * 1.38), t, 2.2) + agujeros([[92, 100], [108, 100]], t, 5);
},
"boton-metal"(c){
  const t = P(c);
  return capa(circ(100, 100, 52), t) +
    `<g transform="rotate(180 100 100)"><path d="${circ(100, 100, 40)}" fill="url(#lv-relieve)"/></g><circle cx="100" cy="100" r="40" ${ln(t)}/>` +
    `<circle cx="100" cy="100" r="46.5" ${ln(t, .8, ` stroke-dasharray=".1 4.2" stroke-width="2.2" opacity=".75"`)}/>` +
    rango(8, i => { const a = i * PI / 4; const [x, y] = pt(100, 100, 21, a); return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="9" ry="4" transform="rotate(${i * 45} ${f1(x)} ${f1(y)})" fill="${t.hi}" ${ln(t, .9).replace('fill="none" ', "")}/>`; }) +
    esfera(100, 100, 7.5, t, { sombra: false }) + rim("M60 76a46 46 0 0 1 34-28", t, 2.6) + rim("M140 124a46 46 0 0 1-20 18", t, 1.4, .5);
},
"boton-pie"(c){
  const t = P(c), m = P(METAL);
  return som(`<path d="${circ(100, 100, 52)}"/>`) +
    `<path d="M128 132q14 4 12 16q-4 8-14 2" ${ln(m, 3.2)} stroke="${m.lo}"/>` +
    con(`<path d="${circ(100, 100, 52)}"/>`) + sup(circ(100, 100, 52), t, { dir: "r" }) +
    `<circle cx="100" cy="100" r="38" ${ln(t, .9, ` opacity=".55"`)}/><circle cx="100" cy="100" r="44" ${ln(t, .8, ` stroke-dasharray="1.6 3" opacity=".6"`)}/>` +
    `<ellipse cx="84" cy="80" rx="18" ry="10" transform="rotate(-35 84 80)" fill="#fff" opacity="${t.oscuro ? .14 : .3}"/>` +
    rim("M58 86a46 46 0 0 1 26-34", t, 2.4);
},

/* ---------- cierres ---------- */
broche(c){
  const t = P(c);
  const pieza = (x, y, macho) => capa(circ(x, y, 32), t, { dx: 4, dy: 6 }) +
    rango(4, i => { const [hx, hy] = pt(x, y, 24.5, PI / 4 + i * PI / 2); return `<circle cx="${f1(hx)}" cy="${f1(hy)}" r="3.4" fill="${t.lo}" ${ln(t, .9).replace('fill="none" ', "")}/>`; }) +
    `<circle cx="${x}" cy="${y}" r="16" ${ln(t)}/>` +
    (macho ? esfera(x, y, 9, t) : `<circle cx="${x}" cy="${y}" r="8" fill="${t.lo}" ${ln(t).replace('fill="none" ', "")}/><circle cx="${x + 1}" cy="${y + 1.5}" r="5" fill="${TINTA}" opacity=".25"/>`) +
    rim(I.H.arco(x, y, 28, PI * 1.05, PI * 1.4), t, 2);
  return pieza(76, 84, false) + pieza(124, 118, true);
},
"broche-flor"(c){
  const t = P(c), perla = P("#F1ECE4"), hoja = P("#7D9A7F");
  const petalo = i => { const a = i * 60 - 90; return `<g transform="rotate(${a} 100 96)"><path d="M100 96C88 80 90 54 100 46C110 54 112 80 100 96Z" ${t.f()}/><path d="M100 96C88 80 90 54 100 46C110 54 112 80 100 96Z" fill="url(#lv-luz)"/><path d="M100 96C88 80 90 54 100 46C110 54 112 80 100 96Z" ${ln(t)}/><path d="M100 90V56" ${ln(t, .7, ` opacity=".6"`)}/></g>`; };
  const forma = rango(6, i => `<path transform="rotate(${i * 60 - 90} 100 96)" d="M100 96C88 80 90 54 100 46C110 54 112 80 100 96Z"/>`) + `<path d="${circ(100, 96, 16)}"/>`;
  return som(forma + `<path d="M104 140c10 10 26 14 40 10c-8-14-24-18-40-10Z"/>`) +
    `<path d="M104 140c10 10 26 14 40 10c-8-14-24-18-40-10Z" ${hoja.f()}/><path d="M104 140c10 10 26 14 40 10c-8-14-24-18-40-10Z" ${ln(hoja)}/><path d="M106 141c12 4 22 6 34 8" ${ln(hoja, .7)}/>` +
    `<path d="M100 120 104 140" ${ln(t, 3)} stroke="${t.base}"/>` +
    con(forma) + rango(6, petalo) +
    rango(6, i => esfera(...pt(100, 96, 22, i * PI / 3 - PI / 6), 3, P("#FFFFFF"), { sombra: false, w: .6 })) +
    esfera(100, 96, 12, perla);
},
cremallera(c, info, metal){
  const tc = P(metal ? "#3E4A5E" : c), td = metal ? P(c) : P(c), m = metal ? td : P(METAL);
  const izq = "M70 168V84L56 34L80 31L99 80V168Z", der = "M130 168V84L144 34L120 31L101 80V168Z";
  const dientes = (lado) => {
    let s = "";
    for (let y = 92; y < 164; y += 5) s += `<rect x="${lado ? 99.5 : 94.5}" y="${y + (lado ? 2.5 : 0)}" width="6" height="3.2" rx="1" fill="${td.hi}" stroke="${td.line}" stroke-width=".7"/>`;
    for (let k = 0; k < 9; k++) { const u = k / 9, x = lado ? 101 + u * 18.5 : 99 - u * 18.5, y = 80 - u * 47; s += `<rect x="${f1(x - 3)}" y="${f1(y)}" width="6" height="3.2" rx="1" transform="rotate(${lado ? 22 : -22} ${f1(x)} ${f1(y)})" fill="${td.hi}" stroke="${td.line}" stroke-width=".7"/>`; }
    return s;
  };
  const s = som(`<path d="${izq}"/><path d="${der}"/>`) + con(`<path d="${izq}"/><path d="${der}"/>`) +
    sup(izq, tc, { dir: "h" }) + sup(der, tc, { dir: "h" }) +
    `<path d="M76 166V86L64 40M124 166V86L136 40" ${ln(tc, .7, ` stroke-dasharray="2 2.4" opacity=".7"`)}/>` +
    dientes(0) + dientes(1) +
    capa(rr(94, 162, 12, 7, 2), m, { sombra: false }) +
    capa("M90 68Q100 62 110 68L108 92Q100 96 92 92Z", m, { dx: 3, dy: 4 }) +
    capa(rr(95.5, 86, 9, 34, 4.5), m, { dx: 3, dy: 5 }) + `<path d="${rr(98, 104, 4, 11, 2)}" fill="${m.lo}" ${ln(m, .8).replace('fill="none" ', "")}/>` + rim("M93 70l2 18", m, 1.4);
  return R(s, -28);
},
"cremallera-metal"(c, info){ return D.cremallera(c, info, true); },
tirador(c){
  const t = P(c);
  const tir = (x, y, a, e = 1) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${e})">` +
    som(`<path d="M-9-24h18l2 14h-22zM-7-10h14l5 46a12 12 0 0 1-24 0z"/>`, 4, 5) +
    capa("M-7-12h14l5 48a12 12 0 0 1-24 0Z", t, { sombra: false, dir: "v" }) + `<path d="${rr(-4, 22, 8, 16, 4)}" fill="${t.lo}" ${ln(t, .9).replace('fill="none" ', "")}/>` +
    capa("M-10-26h20l3 16h-26Z", t, { sombra: false }) + `<path d="M-5-22h10" ${ln(t, .8)}/>` + rim("M-4-8l-2 38", t, 1.6, .8) + `</g>`;
  return tir(66, 86, 18, .95) + tir(102, 78, -4) + tir(140, 92, -22, .9);
},

/* ---------- cintas, puntillas, cordones ---------- */
puntilla(c){
  const t = P(c), id = uid("pu");
  const borde = "M52 80H168V108" + rango(8, i => `a7.25 7.25 0 0 1 -14.5 0`) + "Z";
  const s = som(`<path d="${borde}"/><path d="${rr(32, 72, 24, 48, 6)}"/>`) + con(`<path d="${borde}"/>`) +
    `<defs><clipPath id="${id}"><path d="${borde}"/></clipPath></defs>` +
    sup(borde, t, { dir: "v" }) +
    `<g clip-path="url(#${id})">${rango(8, i => { const x = 160.75 - i * 14.5; return `<circle cx="${x}" cy="104" r="4.2" ${ln(t, .9)}/><circle cx="${x}" cy="104" r="1.4" fill="${t.line}" opacity=".6"/>` + `<circle cx="${x - 7.25}" cy="92" r="2" fill="${TINTA}" opacity=".18" ${ln(t, .7).replace('fill="none" ', "")}/>`; })}` +
    `<path d="M52 86H168" ${ln(t, .8, ` stroke-dasharray="1.6 2.2"`)}/></g>` +
    capa(rr(32, 72, 24, 48, 6), t, { sombra: false, dir: "h" }) + `<g ${ln(t, .7, ` opacity=".5"`)}>${rango(5, i => `<path d="M${36 + i * 4} 74v44"/>`)}</g>` + rim("M37 78v36", t, 1.8, .8);
  return R(s, -14);
},
cinta(c){
  const t = P(c), carton = P("#D9BC92"), cola = "M118 128C138 134 150 146 164 160";
  return som(`<path d="${circ(88, 88, 48)}"/>`) + somBanda(cola, 20) +
    banda(cola, t, 18, { dir: "d" }) + `<path d="M118 128C138 134 150 146 164 160" fill="none" stroke="${t.rim}" stroke-width="1.6" opacity=".7" transform="translate(-3 -4)"/>` +
    con(`<path d="${circ(88, 88, 48)}"/>`) + sup(circ(88, 88, 48), t, { dir: "d" }) +
    rango(9, i => `<circle cx="88" cy="88" r="${20 + i * 3.1}" ${ln(t, .6, ` opacity="${(.25 + (i % 2) * .15).toFixed(2)}"`)}/>`) +
    sup(circ(88, 88, 17), carton) + `<circle cx="88" cy="88" r="9" fill="${carton.lo}" ${ln(carton, 1).replace('fill="none" ', "")}/><circle cx="89" cy="90" r="6.5" fill="${TINTA}" opacity=".18"/>` +
    rim(I.H.arco(88, 88, 44, PI * 1.05, PI * 1.45), t, 2.2);
},
cordon(c){
  const t = P(c), m = P(METAL);
  const pares = []; for (let i = 0; i <= 110; i++) { const a = i / 110 * PI * 4.4 + PI, r = 12 + i * .36; pares.push(`${f1(96 + r * Math.cos(a))} ${f1(94 + r * Math.sin(a))}`); }
  const espiral = "M" + pares.join("L"), ult = pares[pares.length - 1].split(" ").map(Number);
  const cola = `M${ult[0]} ${ult[1]}C${ult[0] + 20} ${ult[1] + 8} 150 140 160 158`;
  return somBanda(espiral + " " + cola, 8) + banda(espiral, t, 6.5, { dir: "d" }) + banda(cola, t, 6.5) +
    `<path d="${espiral}" fill="none" stroke="${t.lo}" stroke-width="6" stroke-dasharray="1.3 3" opacity=".55"/><path d="${cola}" fill="none" stroke="${t.lo}" stroke-width="6" stroke-dasharray="1.3 3" opacity=".55"/>` +
    `<g transform="rotate(42 160 158)">${capa(rr(152, 154, 16, 7, 2), m, { dx: 2, dy: 3 })}</g>`;
},

/* ---------- alfileres, agujas ---------- */
alfiler(c){
  const t = P(c), m = P(METAL);
  const s = rango(5, i => {
    const y = 64 + i * 18, x0 = 44 + (i % 2) * 10, x1 = x0 + 108, h = enesimo(t, i * 2 + 1);
    return sombraAlambre(`M${x0} ${y}L${x1} ${y + 1}`, 2.4) + alambre(`M${x0 + 4} ${y}L${x1} ${y + .6}`, m, 1.3) + esfera(x0, y, 8.5, h);
  });
  return R(s, -24);
},
imperdible(c){
  const t = P(c);
  const imp = (x, y, a, e) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${e})">` +
    sombraAlambre("M-50 0H44M-48-10H40", 3) +
    alambre("M-44 4H40", t, 2.2) + alambre("M-44-6C-20-9 10-10 36-8", t, 2.2) +
    alambre("M-44 4A5.5 5.5 0 1 1 -44 -6", t, 2.2) + `<circle cx="-46" cy="-1" r="4.2" ${ln(t, 1)}/>` +
    capa("M34-12H52Q56-12 56-6V4Q56 8 52 8H34Z", t, { dx: 2, dy: 3 }) + `<path d="M38-6H52" ${ln(t, .8)}/>` + `</g>`;
  return imp(100, 82, -14, 1.05) + imp(100, 126, 8, .85);
},
aguja(c){
  const m = P(c), hilo = P("#B08A62");
  const ag = (y, largo) => { const x0 = 100 - largo / 2, x1 = 100 + largo / 2, h = 3.4;
    const d = `M${x0} ${y - h}Q${x0 - 4.5} ${y} ${x0} ${y + h}L${x1 - 20} ${y + h * .75}L${x1} ${y}L${x1 - 20} ${y - h * .75}Z`;
    return som(`<path d="${d}"/>`, 3, 5) + con(`<path d="${d}"/>`) + sup(d, m, { dir: "y" }) +
      `<path d="${elip(x0 + 8, y, 5, 1.3)}" fill="${TINTA}" opacity=".55"/>` + rim(`M${x0 + 17} ${y - 1.5}H${x1 - 26}`, m, 1.1, .9); };
  const s = ag(72, 128) + ag(100, 112) + ag(128, 94) + hebra("M44 72C34 72 30 82 37 89C48 100 70 98 78 140C80 150 92 156 106 152", hilo, 2.2);
  return R(s, -22);
},
enhebrador(c){
  const t = P(c), m = P(METAL);
  const s = sombraAlambre("M118 100L160 86L168 100L160 114Z", 2) + alambre("M118 98L160 86Q166 100 160 114L118 102", m, .9) +
    capa("M120 100C120 84 104 74 84 74C58 74 40 86 40 100S58 126 84 126C104 126 120 116 120 100Z", t, { dir: "d" }) +
    `<path d="M74 88c-6 2-8 8-6 13c1 4 6 6 10 4c-2 6 2 10 7 9" ${ln(t, 1, ` opacity=".7"`)}/>` + `<ellipse cx="82" cy="100" rx="28" ry="18" ${ln(t, .8, ` stroke-dasharray="1.5 2.6" opacity=".6"`)}/>` +
    rim("M50 92C56 82 70 78 82 78", t, 2.2);
  return R(s, -26);
},
dedal(c, info){
  const t = P(c), e = tamano(info && info.n);
  const s = capa(circ(100, 100, 52), t, { dir: "d" }) + `<circle cx="100" cy="100" r="44" fill="${t.lo}" opacity=".18"/><circle cx="100" cy="100" r="44" ${ln(t)}/>` +
    `<g fill="${t.lo}" stroke="${t.line}" stroke-width=".55">${[6, 13, 20, 27, 34, 40].map((r, k) => { const n = Math.max(1, Math.round(2 * PI * r / 6.6)); return Array.from({ length: n }, (_, i) => { const [x, y] = pt(100, 100, r, i / n * 2 * PI + k * .3); return `<circle cx="${f1(x)}" cy="${f1(y)}" r="1.5"/>`; }).join(""); }).join("")}<circle cx="100" cy="100" r="1.5"/></g>` +
    `<circle cx="100" cy="100" r="48" ${ln(t, .8, ` stroke-dasharray="1 2.4" opacity=".8"`)}/>` + rim("M60 80a46 46 0 0 1 32-30", t, 2.6) + rim("M70 92a32 32 0 0 1 20-20", t, 1.4, .6);
  return `<g transform="translate(100 100) scale(${e}) translate(-100 -100)">${s}</g>`;
},
acerico(c){
  const t = P(c), verde = P("#7D9A7F"), d = polar(100, 104, a => 50 + 2.5 * Math.cos(8 * a), 160);
  const alf = [[-2.2, 8], [-1.5, 3], [-.6, 1], [.4, 5], [2.6, 0]];
  return capa(d, t, { dir: "r" }) +
    rango(8, i => { const a = i * PI / 4; const [x, y] = pt(100, 104, 50, a); return `<path d="M100 104Q${f1(100 + 30 * Math.cos(a + .25))} ${f1(104 + 30 * Math.sin(a + .25))} ${f1(x)} ${f1(y)}" ${ln(t, .9, ` opacity=".7"`)}/>`; }) +
    `<path d="${polar(100, 104, a => 12 + 7 * Math.cos(5 * a), 60)}" ${verde.f()} ${ln(verde).replace('fill="none" ', "")}/>` +
    alf.map(([a, i]) => { const [x0, y0] = pt(100, 104, 22, a), [x1, y1] = pt(100, 104, 52, a); return alambre(`M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}`, P(METAL), 1.1) + esfera(x1, y1, 6, P(MULTI[i])); }).join("") +
    rim(I.H.arco(100, 104, 44, PI * 1.08, PI * 1.38), t, 2.2);
},

/* ---------- lanas y labores ---------- */
ovillo(c){
  const t = P(c), id = uid("ov");
  const fam = (ang, n, desp) => `<g transform="rotate(${ang} 96 98)">${rango(n, i => { const y = 52 + i * (92 / n) + desp; return `<path d="M36 ${f1(y)}Q96 ${f1(y + 22)} 156 ${f1(y)}"/>`; })}</g>`;
  return som(`<path d="${circ(96, 98, 50)}"/>`) + con(`<path d="${circ(96, 98, 50)}"/>`) +
    `<path d="M130 134C150 140 150 158 168 160" fill="none" stroke="${t.line}" stroke-width="4.6" stroke-linecap="round"/><path d="M130 134C150 140 150 158 168 160" fill="none" stroke="${t.base}" stroke-width="3.4" stroke-linecap="round"/>` +
    `<defs><clipPath id="${id}"><path d="${circ(96, 98, 50)}"/></clipPath></defs>` +
    `<path d="${circ(96, 98, 50)}" ${t.f("r")}/>` +
    `<g clip-path="url(#${id})"><g ${ln(t, 1, ` opacity=".55"`)}>${fam(-35, 9, 0)}</g><g ${ln(t, 1, ` opacity=".4"`)}>${fam(50, 8, 3)}</g>` +
    `<g fill="none" stroke="${t.rim}" stroke-width="1.3" opacity=".6">${fam(-35, 4, 2)}</g><path d="${circ(96, 98, 50)}" fill="url(#lv-luz)"/></g>` +
    `<path d="${circ(96, 98, 50)}" ${ln(t)}/>` + rim(I.H.arco(96, 98, 45, PI * 1.05, PI * 1.42), t, 2.2);
},
"agujas-punto"(c){
  const t = P(c), bola = P(CIRUELA), punto = P("#E9B9C3");
  const ag = (a) => `<g transform="rotate(${a} 100 100)">` + som(`<path d="${rr(32, 96.5, 136, 7, 3.5)}"/>`, 3, 5) +
    sup(`M40 97.2H160L168 100L160 102.8H40Z`, t, { dir: "y" }) + rim("M48 98.4H150", t, 1, .8) + esfera(38, 100, 7.5, bola) + `</g>`;
  const muestra = "M66 70H112L108 112H70Z";
  return ag(-38) + capa(muestra, punto, { dx: 3, dy: 5 }) +
    `<g ${ln(punto, .8, ` opacity=".75"`)}>${rango(5, r => rango(5, k => `<path d="M${70 + k * 8} ${76 + r * 7.5}l3 4l3-4"/>`))}</g>` + ag(38);
},
ganchillo(c, info){
  const t = P(c), med = (info && info.n) || "";
  const s = som(`<path d="M32 94.5H160Q170 100 160 105.5H32Z"/><path d="${rr(68, 85, 56, 30, 9)}"/>`, 3, 5) +
    con(`<path d="M32 94.5H160Q170 100 160 105.5H32Z"/>`) +
    sup("M32 94.5H155Q167 94 170 100L164 102Q161 98 157 101.5Q159 105.5 153 105.5H32Q26 100 32 94.5Z", t, { dir: "y" }) +
    capa(rr(66, 85, 58, 30, 9), t, { sombra: false, dir: "y" }) + rim("M38 97H150", t, 1.4, .8) + rim("M72 89H118", t, 1.6, .8) +
    (med ? texto(95, 104.4, med, 12, t.line, ` font-family="Atkinson Hyperlegible Next, sans-serif" font-weight="600"`) : "");
  return R(s, -32);
},
bastidor(c){
  const t = P(c), tela = P("#F5EFE4"), rosa = P("#C2185B"), verde = P("#7D9A7F"), m = P(METAL), id = uid("bs");
  const flor = rango(5, i => { const [x, y] = pt(100, 104, 10, i * 2 * PI / 5 - PI / 2); return `<path d="M${f1(x - 3.5)} ${f1(y - 3.5)}l7 7M${f1(x + 3.5)} ${f1(y - 3.5)}l-7 7" stroke="${i % 2 ? rosa.base : CIRUELA}" stroke-width="1.5" stroke-linecap="round"/>`; });
  return R(capa(rr(34, 40, 132, 128, 3), tela, { dx: 4, dy: 6 }) + `<g ${ln(tela, .5, ` opacity=".35"`)}>${rango(16, i => `<path d="M${38 + i * 8} 44v120"/>`)}</g>`, 6) +
    `<defs><clipPath id="${id}"><circle cx="100" cy="104" r="50"/></clipPath></defs>` +
    `<g clip-path="url(#${id})"><circle cx="100" cy="104" r="50" fill="${TINTA}" opacity=".05"/></g>` +
    flor + `<path d="M100 118v22M100 128c-8-6-14-4-16 0c4 4 10 4 16 0zM100 132c8-6 14-4 16 0c-4 4-10 4-16 0z" stroke="${verde.line}" stroke-width="1.3" fill="${verde.base}"/>` +
    som(`<circle cx="100" cy="104" r="56" fill="none" stroke="${CIRUELA}" stroke-width="10"/>`, 4, 6) +
    `<circle cx="100" cy="104" r="56" fill="none" stroke="${t.line}" stroke-width="11.5"/><circle cx="100" cy="104" r="56" fill="none" ${t.f("d").replace(/fill/g, "stroke")} stroke-width="9"/>` +
    `<circle cx="100" cy="104" r="56" fill="none" stroke="${t.line}" stroke-width=".7" opacity=".7"/>` + rim(I.H.arco(100, 104, 59, PI * 1.05, PI * 1.4), t, 1.8) +
    capa(rr(92, 38, 16, 14, 3), m, { dx: 2, dy: 3 }) + capa(rr(96, 28, 8, 12, 2), m, { sombra: false });
},
marcador(c){
  const t = P(c);
  const pos = [[64, 64, 20], [100, 54, -10], [138, 70, 30], [52, 104, -40], [88, 98, 15], [128, 108, -25], [74, 140, 40], [114, 142, 0]];
  return pos.map(([x, y, a], i) => { const h = enesimo(t, i), d = `M${x} ${y - 12}C${x + 12} ${y - 12} ${x + 10} ${y + 6} ${x} ${y + 14}C${x - 10} ${y + 6} ${x - 12} ${y - 12} ${x} ${y - 12}Z`;
    return `<g transform="rotate(${a} ${x} ${y})">` + som(`<path d="${d}" fill="none" stroke="${CIRUELA}" stroke-width="7"/>`, 3, 4) +
      `<path d="${d}" fill="none" stroke="${h.line}" stroke-width="8.2"/><path d="${d}" fill="none" ${h.f("d").replace(/fill/g, "stroke")} stroke-width="5.8"/><path d="${d}" fill="none" stroke="url(#lv-luz)" stroke-width="5.8"/><path d="M${x - 8} ${y - 8}C${x - 5} ${y - 12} ${x + 2} ${y - 12.5} ${x + 6} ${y - 10}" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".75"/></g>`; }).join("");
},

/* ---------- corte y medida ---------- */
tijera(c){
  const tm = P(c), metal = tm.esp ? P(METAL) : (["#C3C7CC", "#C9A54B", "#C9CDD2"].includes(tm.hex) ? tm : P(METAL)), mango = tm;
  const ojo = (cx, cy, rx, ry) => elip(cx, cy, rx, ry) + elip(cx + 1, cy, rx - 8, ry - 6.5);
  const mitad = (sig) => {
    const s = sig, cx = 100 + s * 28;
    const hoja = s > 0 ? "M106 106L66 32Q62 26 62 34L90 108Z" : "M94 106L134 32Q138 26 138 34L110 108Z";
    const cuerpo = `M${100 - s * 9} 100L${cx - s * 11} 136L${cx + s * 6} 133L${100 + s * 9} 110Z`;
    return { som: `<path d="${hoja}"/><path d="${cuerpo}"/><path d="${ojo(cx, 150, 21, 15)}" fill-rule="evenodd"/>`,
      cuerpo: sup(hoja, metal, { dir: "d" }) + rim(s > 0 ? "M92 100L66 38" : "M104 100L132 38", metal, 1.2, .9) + `<path d="${s > 0 ? "M98 104L65 34" : "M102 104L135 34"}" ${ln(metal, .6, ` opacity=".6"`)}/>` + sup(cuerpo, metal) + sup(ojo(cx, 150, 21, 15), mango, { extra: ` fill-rule="evenodd"` }) +
        rim(`M${cx - 15} 144a20 14 0 0 1 14-9`, mango, 1.8) };
  };
  const a = mitad(1), b = mitad(-1);
  const s = som(a.som + b.som) + con(a.som + b.som) + b.cuerpo + a.cuerpo + esfera(100, 104, 5, metal, { sombra: false });
  return R(`<g transform="translate(0 -8)">${s}</g>`, -14);
},
metro(c){
  const t = P(c), m = P(METAL);
  const cinta = `<g transform="rotate(-12 96 134)">` + capa(rr(96, 124, 76, 18, 1.5), t, { dir: "v" }) +
    `<g stroke="${t.line}" stroke-width=".8">${rango(18, i => `<path d="M${100 + i * 4} 124v${i % 5 === 0 ? 7 : 4}"/>`)}</g>` +
    [1, 2, 3].map((n, i) => texto(118 + i * 20, 138, String(n + 12), 7.5, t.line, ` font-family="Atkinson Hyperlegible Next, sans-serif"`)).join("") +
    capa(rr(168, 122, 6, 22, 1.5), m, { sombra: false }) + `</g>`;
  return cinta + capa(circ(88, 90, 46), t, { dir: "d" }) +
    rango(11, i => `<circle cx="88" cy="90" r="${10 + i * 3.4}" ${ln(t, .55, ` opacity="${i % 2 ? .45 : .25}"`)}/>`) +
    esfera(88, 90, 7, m, { sombra: false }) + rim(I.H.arco(88, 90, 42, PI * 1.05, PI * 1.42), t, 2.2);
},
jaboncillo(c){
  const t = P(c), d = "M56 58Q50 54 58 52L146 46Q156 46 152 54L112 144Q106 154 100 144Z", dentro = "M70 62L140 57L108 128Z";
  return `<path d="M108 150C120 156 136 158 164 152" fill="none" stroke="${t.base}" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="14 2 6 3 20 2" opacity=".65"/>` +
    capa(d, t) + `<path d="${dentro}" fill="${t.hi}" opacity=".55"/><path d="${dentro}" ${ln(t, .8, ` opacity=".7"`)}/>` +
    `<path d="M58 55L70 62M150 50L140 57M106 146L108 128" ${ln(t, .8, ` opacity=".7"`)}/>` + rim("M62 56L140 50", t, 2);
},
descosedor(c){
  const t = P(c), m = P(METAL), rojo = P("#C0392B");
  const s = som(`<path d="${rr(28, 86, 86, 28, 14)}"/><path d="M112 96H152L164 88L169 93L155 105H112Z"/>`, 4, 6) +
    alambre("M110 100H150", m, 4.4) + alambre("M150 100Q160 100 168 90", m, 2.2) + alambre("M150 100Q157 101 161 105", m, 2.2) + esfera(162, 106, 4.6, rojo, { sombra: false }) +
    capa(rr(28, 86, 86, 28, 14), t, { sombra: false, dir: "y" }) + `<path d="M100 87.5V112.5M105 87.5V112.5" ${ln(t, .9)}/>` + rim("M40 91H96", t, 2);
  return R(s, -34);
},

/* ---------- elásticos, cierres pequeños, parches ---------- */
elastico(c){
  const t = P(c), cola = "M112 126C132 144 112 162 138 166C150 168 160 160 164 150";
  return somBanda(cola, 16) + banda(cola, t, 15, { dir: "d" }) +
    `<path d="${cola}" fill="none" stroke="${t.line}" stroke-width="9.6" opacity=".55"/><path d="${cola}" fill="none" ${t.f().replace(/fill/g, "stroke")} stroke-width="8.4"/><path d="${cola}" fill="none" stroke="${t.line}" stroke-width="3.6" opacity=".5"/><path d="${cola}" fill="none" ${t.f().replace(/fill/g, "stroke")} stroke-width="2.4"/>` +
    capa(circ(90, 90, 42), t) + rango(10, i => `<circle cx="90" cy="90" r="${12 + i * 3}" ${ln(t, .55, ` opacity="${i % 2 ? .45 : .25}"`)}/>`) +
    `<circle cx="90" cy="90" r="10" fill="${t.lo}" opacity=".5" ${ln(t).replace('fill="none" ', "")}/>` + rim(I.H.arco(90, 90, 38, PI * 1.05, PI * 1.42), t, 2.2);
},
corchete(c){
  const t = P(c);
  const gancho = "M0-6A4 4 0 1 0 0 2M0 6A4 4 0 1 1 0-2M3-5H24A6 6 0 0 1 24 7H15M3 5H22", ojo = "M0-9A4 4 0 1 0 0-1M0 9A4 4 0 1 1 0 1M4-9H18A9 9 0 0 1 18 9H4";
  const par = (x, y, a) => `<g transform="translate(${x} ${y}) rotate(${a})">` + sombraAlambre(gancho, 3.6) + alambre(gancho, t, 2.3) +
    `<g transform="translate(44 0) scale(-1 1)">${sombraAlambre(ojo, 3.6)}${alambre(ojo, t, 2.3)}</g></g>`;
  return `<g transform="translate(100 100) scale(1.3) translate(-100 -100)">` + par(58, 70, -8) + par(64, 102, 6) + par(54, 134, -14) + `<g transform="translate(126 84) rotate(70) scale(1.1)">${sombraAlambre(gancho, 3.6)}${alambre(gancho, t, 2.3)}</g></g>`;
},
velcro(c){
  const t = P(c), id1 = uid("vc"), id2 = uid("vc");
  const a = rr(34, 72, 124, 30, 3), b = rr(42, 100, 124, 30, 3);
  return som(`<g transform="rotate(-14 96 87)"><path d="${a}"/></g><g transform="rotate(10 104 115)"><path d="${b}"/></g>`) +
    `<g transform="rotate(10 104 115)">${con(`<path d="${b}"/>`)}${sup(b, t, { dir: "v" })}<defs><clipPath id="${id2}"><path d="${b}"/></clipPath></defs><g clip-path="url(#${id2})" ${ln(t, .7, ` opacity=".5"`)}>${rango(9, r => `<path d="M42 ${103 + r * 3.2}h124" stroke-dasharray="${1 + (r % 3)} ${2 + (r % 2)}"/>`)}</g></g>` +
    `<g transform="rotate(-14 96 87)">${con(`<path d="${a}"/>`)}${sup(a, t, { dir: "v" })}<defs><clipPath id="${id1}"><path d="${a}"/></clipPath></defs><g clip-path="url(#${id1})" fill="${t.lo}" opacity=".7">${rango(6, r => rango(30, k => `<circle cx="${37 + k * 4.2 + (r % 2) * 2}" cy="${76 + r * 4.4}" r=".9"/>`))}</g>` +
    rim("M40 76H150", t, 1.6, .8) + `</g>`;
},
parche(c){
  const t = P(c), id = uid("pa"), d = elip(100, 100, 46, 60);
  return R(capa(d, t) + `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs>` +
    `<g clip-path="url(#${id})" ${ln(t, .6, ` opacity=".5"`)}>${rango(26, i => `<path d="M${30 + i * 6} 30l-40 150"/>`)}</g>` +
    `<path d="${elip(100, 100, 40, 54)}" fill="none" stroke="${t.claro || t.hex === "#FFFFFF" ? t.line : "#E9D9A6"}" stroke-width="1.3" stroke-dasharray="4 3" stroke-linecap="round"/>` +
    rim("M62 78C66 60 78 48 92 44", t, 2.2), 18);
},
aplique(c){
  const t = P(c), hoja = P("#7D9A7F"), cen = P("#F2D45C");
  const pet = i => { const a = i * 72 - 90, d = "M100 98C86 84 86 58 100 50C114 58 114 84 100 98Z";
    return `<g transform="rotate(${a} 100 98)">${sup(d, t, { dir: "v" })}<g ${ln(t, .6, ` opacity=".55"`)}>${rango(6, k => `<path d="M${93 + k * 2.6} ${60 + Math.abs(k - 2.5) * 3}L100 94"/>`)}</g></g>`; };
  // dos hojas que salen de debajo de la flor (antes una quedaba suelta, lejos de la flor)
  const HOJAS = [[96, 1.2], [18, 1]], trH = (a, e) => `rotate(${a} 100 98) translate(100 98) scale(${e}) translate(-100 -98)`;
  const hojas = HOJAS.map(([a, e]) => `<g transform="${trH(a, e)}">${sup("M100 98C116 112 140 112 152 100C140 88 116 86 100 98Z", hoja)}<path d="M104 98H146" ${ln(hoja, .7)}/></g>`).join("");
  const silueta = rango(5, i => `<path transform="rotate(${i * 72 - 90} 100 98)" d="M100 98C86 84 86 58 100 50C114 58 114 84 100 98Z"/>`) +
    HOJAS.map(([a, e]) => `<path transform="${trH(a, e)}" d="M100 98C116 112 140 112 152 100C140 88 116 86 100 98Z"/>`).join("");
  return som(silueta) + con(silueta) + hojas + rango(5, pet) +
    rango(7, i => { const [x, y] = i ? pt(100, 98, 6, i * PI / 3) : [100, 98]; return esfera(x, y, 3.4, cen, { sombra: false, w: .7 }); });
},
tela(c){
  const t = P(c), id = uid("te");
  const capaTela = (dx, dy, op) => { const d = `M${40 + dx} ${50 + dy}L${150 + dx} ${42 + dy}L${158 + dx} ${150 + dy}L${48 + dx} ${160 + dy}Z`;
    return capa(d, t, { dir: "d" }) + `<g ${ln(t, .45, ` opacity="${op}"`)}><path d="M${50 + dx} ${70 + dy}L${152 + dx} ${62 + dy}M${52 + dx} ${96 + dy}L${154 + dx} ${88 + dy}M${54 + dx} ${122 + dy}L${156 + dx} ${114 + dy}"/></g>`; };
  return capaTela(8, 8, .3) + capaTela(0, 0, .35) +
    `<path d="M108 156L156 150L150 100Z" fill="${t.lo}" opacity=".35"/><path d="M110 155.5L150 102L156 150Z" ${t.f("d")} ${ln(t).replace('fill="none" ', "")}/><path d="M110 155.5L150 102" ${ln(t, 1.6, ` opacity=".5"`)}/>` +
    rim("M46 54L140 47", t, 2);
},

/* ---------- lotes ---------- */
costurero(c){
  const t = P(c), m = P(MADERA), amarillo = P("#F2D45C");
  return `<g transform="rotate(-20 140 140)">${capa(rr(118, 132, 52, 12, 1.5), amarillo, { dir: "v" })}<g stroke="${amarillo.line}" stroke-width=".8">${rango(12, i => `<path d="M${124 + i * 4} 132v${i % 5 ? 3.5 : 6}"/>`)}</g></g>` +
    capa(circ(96, 96, 60), m, { dir: "d" }) + sup(circ(96, 96, 52), t, { dir: "d" }) +
    rango(8, i => { const [x, y] = pt(96, 96, 52, i * PI / 4); return `<path d="M96 96L${f1(x)} ${f1(y)}" ${ln(t, .8, ` stroke-dasharray="2 2.2" opacity=".75"`)}/>`; }) +
    `<circle cx="96" cy="96" r="52" fill="url(#lv-relieve)" opacity=".6"/>` + esfera(96, 96, 8, P(CIRUELA)) +
    rim(I.H.arco(96, 96, 57, PI * 1.05, PI * 1.4), m, 2) + rim(I.H.arco(96, 96, 46, PI * 1.1, PI * 1.38), t, 1.8, .8);
},
kit(c){
  const t = P(c), carton = P("#D9BC92"), papel = P("#F7F1E6");
  const ov = (x, y, e, cc) => `<g transform="translate(${x} ${y}) scale(${e}) translate(-96 -98)">${D.ovillo(cc)}</g>`;
  return capa(rr(34, 48, 132, 108, 3), carton, { dir: "d" }) + `<path d="${rr(42, 56, 116, 92, 2)}" fill="${carton.lo}" opacity=".35" ${ln(carton, .9).replace('fill="none" ', "")}/>` +
    ov(78, 92, .52, c) + ov(116, 116, .48, (P(c).multi ? MULTI[2] : c)) +
    `<g transform="rotate(-30 110 90)">${capa(rr(60, 86, 100, 5, 2.5), P("#D9BC92"), { dx: 2, dy: 3 })}${esfera(60, 88.5, 4.5, P(CIRUELA), { sombra: false })}</g>` +
    `<g transform="rotate(-6 70 136)">${capa(rr(48, 126, 44, 22, 2), papel, { dx: 2, dy: 3 })}${texto(70, 140, "Kit", 9, CIRUELA, ` font-style="italic"`)}</g>`;
},
vale(c, info){
  const t = P(c), lazo = P(CIRUELA), imp = (info && /€/.test(info.n || "")) ? info.n : "";
  const card = rr(34, 56, 132, 88, 4), tx = t.oscuro || t.esp === "lunares" ? "#FBF0F0" : CIRUELA;
  return R(capa(card, t, { dir: "d" }) + `<path d="${rr(40, 62, 120, 76, 2)}" ${ln(t, .8, ` opacity=".6"`)}/>` +
    `<path d="M124 56V144" stroke="${lazo.line}" stroke-width="11.5"/><path d="M124 56V144" stroke="${lazo.base}" stroke-width="9"/><path d="M121 58V142" stroke="#fff" stroke-width="1" opacity=".35"/>` +
    `<path d="M124 70C110 56 104 70 112 76C116 78 122 74 124 70ZM124 70C138 56 144 70 136 76C132 78 126 74 124 70Z" ${lazo.f()} ${ln(lazo).replace('fill="none" ', "")}/><circle cx="124" cy="71" r="3.5" fill="${lazo.base}" stroke="${lazo.line}"/>` +
    texto(78, 92, "Vale regalo", 12, tx, ` font-style="italic"`) +
    (imp ? texto(78, 122, imp, 22, tx, ` font-weight="600"`) : texto(78, 116, "La Valenciana", 9, tx)) +
    rim("M40 60H110", t, 1.8, .8), -6);
},
});

Object.assign(I.FOCO, { bobina: [100, 100], madeja: [100, 100], boton: [100, 100], cremallera: [100, 82], "cremallera-metal": [100, 82], puntilla: [110, 98], cinta: [88, 88], alfiler: [72, 82], aguja: [70, 84], tijera: [100, 112], metro: [104, 112], vale: [86, 104], dedal: [100, 100], bastidor: [100, 104], kit: [96, 100] });
})();
