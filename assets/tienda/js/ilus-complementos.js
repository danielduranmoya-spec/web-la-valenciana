/* =========================================================
   LA VALENCIANA v2 · ilus-complementos.js · PROPIETARIO: B8
   Dibujos de Complementos: medias, lencería, pañuelos, bolsos,
   bisutería, abanicos, paraguas y accesorios de pelo.
   ========================================================= */
(() => {
"use strict";
const I = window.LV && LV.ilus; if (!I || !I.H) return;
const { P, enesimo, MULTI, METAL, ORO, MADERA, CIRUELA, TINTA, SW, f1, uid, ln, som, con, sup, capa, rim, circ, elip, rr, pol, pt, arco, rango, esfera, texto, banda, somBanda, R, polar } = I.H;
const { alambre } = I.H;
const D = I.D, PI = Math.PI;
const costura = (d, t, op = .75) => `<path d="${d}" ${ln(t, .8, ` stroke-dasharray="2.2 2.4" opacity="${op}"`)}/>`;
const pliegue = (d, t) => `<path d="${d}" fill="none" stroke="${t.lo}" stroke-width="2.2" stroke-linecap="round" opacity=".35"/>`;
/* puntilla de festón a lo largo de una recta horizontal (y), de x0 a x1 */
const festonH = (x0, x1, y, t, r = 3.2, abajo = true) => { let d = `M${x0} ${y}`; for (let x = x0; x < x1 - .1; x += 2 * r) d += `a${r} ${r} 0 0 ${abajo ? 0 : 1} ${2 * r} 0`; return `<path d="${d}" ${ln(t, .9)}/>`; };

Object.assign(D, {

/* ---------- medias y calcetines ---------- */
media(c){
  const t = P(c);
  const d = "M62 34H138L137 64Q135 76 127 80L121 148Q120 158 128 162L136 166Q140 171 132 171L112 170Q104 169 104 160L103 92Q100 88 97 92L96 160Q96 169 88 170L68 171Q60 171 64 166L72 162Q80 158 79 148L73 80Q65 76 63 64Z";
  return capa(d, t, { dir: "v", extra: ` fill-opacity="${t.oscuro ? .92 : .9}"` }) +
    `<path d="M63 44H137" ${ln(t, 1)}/><path d="M63 40H137M63 37H137" ${ln(t, .5, ` opacity=".5"`)}/>` +
    `<path d="M66 64Q100 74 134 64L130 80Q112 84 104 92Q100 88 96 92Q88 84 70 80Z" fill="${t.lo}" opacity=".18"/>` +
    `<path d="M94 86L100 80L106 86" ${ln(t, .8, ` opacity=".7"`)}/>` +
    `<path d="M68 171Q62 166 72 162L80 160M132 171Q138 166 128 162L120 160" fill="${t.lo}" opacity=".25"/>` +
    rim("M70 50Q74 100 82 150", t, 1.8, .7) + rim("M110 96L111 150", t, 1.4, .5) + pliegue("M88 100L90 140M116 104L114 140", t);
},
calcetin(c){
  const t = P(c), d = "M66 32H112V108Q112 122 126 126L150 132Q168 138 164 156Q160 170 142 168L96 162Q66 156 66 128Z";
  return R(capa(d, t, { dir: "d" }) +
    `<g ${ln(t, .8, ` opacity=".6"`)}>${rango(11, i => `<path d="M${70 + i * 4} 34V60"/>`)}</g><path d="M66 60H112" ${ln(t, 1)}/>` +
    `<path d="M66 128Q68 150 92 158L96 162Q70 158 66 128Z" fill="${t.lo}" opacity=".3"/><path d="M146 134Q168 140 162 160Q158 170 142 168Q154 156 146 134Z" fill="${t.lo}" opacity=".3"/>` +
    `<path d="M68 132Q74 150 94 156M146 135Q156 150 144 166" ${ln(t, .8, ` stroke-dasharray="2 2.4" opacity=".7"`)}/>` +
    rim("M72 66V124", t, 2, .8), -8);
},

/* ---------- ropa interior y de dormir ---------- */
camiseta(c){
  const t = P(c), d = "M68 34Q72 32 76 34L82 62Q100 76 118 62L124 34Q128 32 132 34L134 64Q136 84 150 92L152 164Q100 170 48 164L50 92Q64 84 66 64Z";
  return capa(d, t, { dir: "v" }) + costura("M84 62Q100 72 116 62", t) + costura("M136 66Q138 82 148 90", t) + costura("M64 66Q62 82 52 90", t) +
    costura("M50 158Q100 164 150 158", t) + pliegue("M80 100Q84 130 80 156M120 100Q116 130 122 156", t) + rim("M72 38L76 64", t, 1.8) + rim("M58 96L58 150", t, 1.6, .6);
},
braga(c){
  const t = P(c), d = "M42 58Q100 66 158 58L152 84Q128 98 114 140Q100 148 86 140Q72 98 48 84Z";
  return capa(d, t, { dir: "v" }) + `<path d="M43 64Q100 72 157 64" ${ln(t, .9)}/>` + festonH(44, 156, 59, t, 2.8) +
    costura("M50 86Q74 100 88 136", t) + costura("M150 86Q126 100 112 136", t) + `<path d="M92 128Q100 132 108 128" ${ln(t, .7, ` opacity=".6"`)}/>` +
    esfera(100, 70, 2.8, P("#E9B9C3"), { sombra: false, w: .6 }) + rim("M56 68Q80 72 92 72", t, 1.8, .8);
},
sujetador(c){
  const t = P(c);
  const izq = "M98 112Q96 78 72 64Q52 84 44 114Q72 124 98 112Z", der = "M102 112Q104 78 128 64Q148 84 156 114Q128 124 102 112Z", banda1 = "M34 112Q100 126 166 112L166 128Q100 140 34 128Z";
  return som(`<path d="${izq}"/><path d="${der}"/><path d="${banda1}"/>`) +
    `<path d="M72 64L66 30M128 64L134 30" fill="none" stroke="${t.line}" stroke-width="5"/><path d="M72 64L66 30M128 64L134 30" fill="none" stroke="${t.base}" stroke-width="3.4"/>` +
    sup(banda1, t, { dir: "v" }) + costura("M36 120Q100 133 164 120", t) +
    sup(izq, t, { dir: "d" }) + sup(der, t, { dir: "d" }) +
    `<path d="M72 66Q76 92 72 118M128 66Q124 92 128 118" ${ln(t, .7, ` opacity=".55"`)}/>` +
    `<path d="M73 66Q86 78 96 108M127 66Q114 78 104 108" ${ln(t, .8, ` stroke-dasharray="1.2 2.6" opacity=".8"`)}/>` + esfera(100, 112, 3.2, t, { sombra: false, w: .6 }) +
    rim("M66 76Q56 90 52 108", t, 1.8, .8);
},
camison(c){
  const t = P(c), d = "M76 60Q100 72 124 60L124 82Q122 88 122 90L152 164Q100 176 48 164L78 90Q76 88 76 82Z";
  return `<path d="M80 62L86 32M120 62L114 32" fill="none" stroke="${t.line}" stroke-width="3.6"/><path d="M80 62L86 32M120 62L114 32" fill="none" stroke="${t.base}" stroke-width="2.2"/>` +
    capa(d, t, { dir: "v" }) + `<path d="M77 72Q100 84 123 72" ${ln(t, .9)}/>` +
    `<g ${ln(t, .7, ` opacity=".7"`)}>${rango(7, i => `<circle cx="${82 + i * 6}" cy="${68 + Math.sin(i / 6 * PI) * 5}" r="1.8"/>`)}</g>` +
    `<path d="M49 164Q100 175 151 164" ${ln(t, .9)}/>` + `<g ${ln(t, .8)}>${rango(16, i => { const x = 50 + i * 6.3, y = 164.5 + Math.sin(i / 15 * PI) * 9.5; return `<path d="M${f1(x)} ${f1(y)}a3.1 3.1 0 0 0 6.2 .4"/>`; })}</g>` +
    pliegue("M90 96L78 160M110 96L122 160M100 92V166", t) + rim("M80 92L58 156", t, 1.8, .7);
},

/* ---------- pañuelos ---------- */
panuelo(c){
  const t = P(c), d = "M40 46L154 38L162 152L48 160Z";
  return R(capa(d, t, { dir: "d" }) + `<path d="M48 54L146 47L153 144L55 151Z" ${ln(t, .9, ` opacity=".75"`)}/><path d="M56 62L138 56L144 136L62 142Z" ${ln(t, .7, ` stroke-dasharray="1.5 2.5" opacity=".7"`)}/>` +
    `<path d="M128 160L162 152L156 118Z" fill="${t.lo}" opacity=".3"/><path d="M128 159L156 120L162 152Z" ${t.f()} ${ln(t).replace('fill="none" ', "")}/>` +
    rim("M46 50L140 43", t, 2) + `<path d="M60 70L130 140" stroke="#fff" stroke-width="12" opacity=".12" stroke-linecap="round"/>`, -4);
},
fular(c){
  const t = P(c), d = "M46 66C96 40 104 150 154 128", W = 38;
  /* flecos perpendiculares a cada extremo */
  const flecos = (x, y, tx, ty) => { const L = Math.hypot(tx, ty), ux = tx / L, uy = ty / L, nx = -uy, ny = ux;
    return rango(10, i => { const o = -W / 2 + 2 + i * (W - 4) / 9, x0 = x + nx * o, y0 = y + ny * o; return `<path d="M${f1(x0)} ${f1(y0)}l${f1(ux * 11)} ${f1(uy * 11)}" ${ln(t, 1.1)} stroke="${t.base}"/><path d="M${f1(x0)} ${f1(y0)}l${f1(ux * 11)} ${f1(uy * 11)}" ${ln(t, .5)}/>`; }); };
  const bandaRecta = `<path d="${d}" fill="none" stroke="${t.line}" stroke-width="${W + 2.5}"/><path d="${d}" fill="none" ${t.f("d").replace(/fill/g, "stroke")} stroke-width="${W}"/><path d="${d}" fill="none" stroke="url(#lv-luz)" stroke-width="${W}"/>`;
  return som(`<path d="${d}" fill="none" stroke="${CIRUELA}" stroke-width="${W}"/>`) + flecos(46, 66, -50, 26) + flecos(154, 128, 50, -22) + bandaRecta +
    pliegue("M50 60C96 36 108 138 152 120", t) + pliegue("M52 74C92 54 100 154 150 136", t) + `<path d="M48 52C92 30 100 126 148 112" fill="none" stroke="${t.rim}" stroke-width="1.6" opacity=".7"/>`;
},
bufanda(c){
  const t = P(c);
  const tira = (x, a) => { const d = rr(x, 34, 40, 118, 3); return `<g transform="rotate(${a} ${x + 20} 34)">` + capa(d, t, { dir: "h" }) +
    `<g ${ln(t, .8, ` opacity=".55"`)}>${rango(5, i => `<path d="M${x + 6 + i * 7} 38V148" stroke-dasharray="3 1.6"/>`)}</g>` +
    rango(8, i => `<path d="M${x + 3 + i * 5} 152v13" ${ln(t, 1.6)} stroke="${t.base}"/>`) + rim(`M${x + 5} 40V146`, t, 1.6, .7) + `</g>`; };
  return tira(98, 14) + tira(62, -14) + `<path d="${rr(60, 30, 80, 14, 4)}" ${t.f("v")} ${ln(t).replace('fill="none" ', "")}/>`;
},
panuelito(c){
  const t = P(c), d = "M52 50L148 46L152 150L56 154Z", cir = P(CIRUELA);
  return R(capa(d, t, { dir: "d" }) + `<path d="M58 56L142 52L146 144L62 148Z" ${ln(t, .8, ` opacity=".8"`)}/>` + `<path d="M58 56L146 144" stroke="${t.lo}" stroke-width="1.6" opacity=".25"/>` +
    texto(124, 134, "V", 18, cir.base, ` font-style="italic"`) + `<path d="M112 138q8 6 20 0" ${ln(cir, .9)}/>` +
    rim("M58 52L138 49", t, 2), 6);
},

/* ---------- bolsos ---------- */
bolso(c){
  const t = P(c), m = P(ORO), cuerpo = "M48 82H152L162 154Q162 164 152 164H48Q38 164 38 154Z", solapa = "M48 82H152L148 124Q100 136 52 124Z", asa = "M66 84C64 30 136 30 134 84";
  return somBanda(asa, 8) + som(`<path d="${cuerpo}"/>`) + banda(asa, t, 7, { dir: "v" }) + costura(asa, t, .6) + con(`<path d="${cuerpo}"/>`) +
    sup(cuerpo, t, { dir: "v" }) + costura("M44 156Q100 160 156 156", t, .6) + capa(solapa, t, { dir: "v", contacto: false, dx: 0, dy: 4 }) + costura("M54 88H146L143 119Q100 130 57 119Z", t) +
    capa(rr(92, 120, 16, 14, 3), m, { dx: 2, dy: 3 }) + rim("M52 86H120", t, 2, .8) + rim("M46 132L44 152", t, 1.6, .6);
},
bandolera(c){
  const t = P(c), m = P(ORO), cuerpo = rr(56, 92, 92, 68, 10), correa = "M60 100C20 60 52 26 104 32S176 62 144 100";
  return somBanda(correa, 6) + som(`<path d="${cuerpo}"/>`) + banda(correa, t, 5, { dir: "d" }) + con(`<path d="${cuerpo}"/>`) +
    sup(cuerpo, t, { dir: "v" }) + `<path d="M62 104H142" ${ln(t)}/>` + `<path d="M64 101H140" stroke="${m.base}" stroke-width="1.6" stroke-dasharray="1.6 1.2"/>` + capa(rr(130, 97, 6, 10, 2), m, { sombra: false }) +
    capa("M66 116H138V138Q102 148 66 138Z", t, { sombra: false, dir: "v" }) + costura("M70 120H134V135Q102 143 70 135Z", t) +
    `<circle cx="60" cy="100" r="5" fill="none" stroke="${m.line}" stroke-width="3"/><circle cx="60" cy="100" r="5" fill="none" stroke="${m.base}" stroke-width="2"/><circle cx="144" cy="100" r="5" fill="none" stroke="${m.line}" stroke-width="3"/><circle cx="144" cy="100" r="5" fill="none" stroke="${m.base}" stroke-width="2"/>` +
    rim("M64 112V148", t, 1.6, .6);
},
monedero(c){
  const t = P(c), m = P(ORO), cuerpo = "M50 86Q46 150 100 156Q154 150 150 86Z";
  return capa(cuerpo, t, { dir: "v" }) + costura("M56 92Q54 144 100 149Q146 144 144 92", t, .6) +
    som(`<path d="M48 86Q100 70 152 86" fill="none" stroke="${CIRUELA}" stroke-width="6"/>`, 2, 3) +
    `<path d="M48 86Q100 72 152 86" fill="none" stroke="${m.line}" stroke-width="6"/><path d="M48 86Q100 72 152 86" fill="none" ${m.f("y").replace(/fill/g, "stroke")} stroke-width="4.6"/>` +
    `<path d="M50 84Q100 70 150 84" fill="none" stroke="#fff" stroke-width=".9" opacity=".7"/>` +
    esfera(94, 72, 6, m) + esfera(106, 72, 6, m) + rim("M58 96Q58 126 72 140", t, 1.8, .7);
},
cartera(c){
  const t = P(c), m = P(METAL), cuerpo = rr(38, 62, 124, 80, 6), solapa = "M112 62H156Q162 62 162 68V136Q162 142 156 142H112Q106 102 112 62Z";
  return R(capa(cuerpo, t, { dir: "d" }) + costura(rr(43, 67, 114, 70, 4), t, .55) + `<path d="M52 82H100M52 92H100" ${ln(t, .9, ` opacity=".6"`)}/>` +
    capa(solapa, t, { sombra: false, dx: 0, dy: 0, dir: "d" }) + costura("M116 67H152Q157 67 157 72V132Q157 137 152 137H116Q111 102 116 67Z", t, .6) +
    esfera(134, 102, 5.5, m) + rim("M44 68H104", t, 1.8, .8), -6);
},
bolsa(c){
  const t = P(c), cuerpo = "M50 70H150L146 164H54Z", asa = (x) => `M${x} 72C${x - 2} 30 ${x + 30} 30 ${x + 28} 72`;
  return somBanda(asa(62) + asa(110), 7) + som(`<path d="${cuerpo}"/>`) + banda(asa(62), t, 6, { dir: "v" }) + banda(asa(110), t, 6, { dir: "v" }) +
    con(`<path d="${cuerpo}"/>`) + sup(cuerpo, t, { dir: "v" }) + `<path d="M50 70H150L149.4 82H50.6Z" fill="${t.lo}" opacity=".18"/>` + costura("M51 80H149", t) +
    pliegue("M80 90L78 158M120 90L124 158", t) + rim("M56 86L58 154", t, 1.8, .7);
},

/* ---------- bisutería ---------- */
pendiente(c){
  const t = P(c), carton = P("#FFFFFF"), m = P(ORO);
  const card = rr(54, 42, 92, 116, 3);
  return R(capa(card, carton, { dir: "d" }) + `<circle cx="100" cy="50" r="4" fill="${carton.lo}" ${ln(carton, .9).replace('fill="none" ', "")}/>` +
    texto(100, 146, "La Valenciana", 8, CIRUELA, ` font-style="italic"`) +
    [[80, 92], [120, 92]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="15" fill="${m.base}" stroke="${m.line}" stroke-width=".8" opacity=".8"/>` + esfera(x, y, 13.5, t)).join(""), 4);
},
collar(c){
  const t = P(c), m = P(ORO), N = 34;
  const pts = Array.from({ length: N }, (_, i) => { const a = -PI / 2 + (i + .5) / N * 2 * PI; return [100 + 50 * Math.cos(a), 104 + 60 * Math.sin(a) * (Math.sin(a) > 0 ? 1 : .9), 4.6 + 2.6 * (1 + Math.sin(a)) / 2]; });
  return som(`<path d="${elip(100, 104, 50, 58)}" fill="none" stroke="${CIRUELA}" stroke-width="10"/>`) +
    `<path d="${elip(100, 104, 50, 58)}" fill="none" stroke="${t.line}" stroke-width=".7" opacity=".5"/>` +
    pts.map(([x, y, r], i) => esfera(x, y, r, enesimo(t, i))).join("") + capa(rr(94, 40, 12, 8, 3), m, { dx: 2, dy: 3 });
},
pulsera(c){
  const t = P(c), m = P(ORO), N = 18;
  return som(`<circle cx="98" cy="96" r="46" fill="none" stroke="${CIRUELA}" stroke-width="16"/>`) +
    `<circle cx="98" cy="96" r="46" fill="none" stroke="${t.line}" stroke-width=".8" opacity=".6"/>` +
    rango(N, i => { const [x, y] = pt(98, 96, 46, i / N * 2 * PI - PI / 2); return i === 6 ? esfera(x, y, 6.6, m) : esfera(x, y, 8, enesimo(t, i)); }) +
    (() => { const [x, y] = pt(98, 96, 46, 6 / N * 2 * PI - PI / 2); const h = `M${f1(x + 8)} ${f1(y + 14)}c-6-6-1-12 4-7c5-5 10 1 4 7l-4 5z`;
      return alambre(`M${f1(x + 3)} ${f1(y + 5)}L${f1(x + 10)} ${f1(y + 12)}`, m, .9) + capa(`M${f1(x + 12)} ${f1(y + 12)}c-7-7-1-14 5-8c6-6 12 1 5 8l-5 6z`, m, { dx: 2, dy: 3 }); })();
},

/* ---------- abanicos, fundas, paraguas ---------- */
abanico(c){
  const t = P(c), m = P("#D9BC92"), R0 = 88, cx = 100, cy = 154, N = 9, a0 = -PI * .86, a1 = -PI * .14, id = uid("ab");
  const p = (a, r) => pt(cx, cy, r, a).map(f1).join(" ");
  const sector = `M${cx} ${cy}L${p(a0, R0)}A${R0} ${R0} 0 0 1 ${p(a1, R0)}Z`;
  const gajos = rango(N, i => { const A = a0 + (a1 - a0) * i / N, B = a0 + (a1 - a0) * (i + 1) / N; return `<path d="M${cx} ${cy}L${p(A, R0)}A${R0} ${R0} 0 0 1 ${p(B, R0)}Z" ${i % 2 ? `fill="#fff" opacity=".22"` : `fill="${TINTA}" opacity=".06"`}/>`; });
  const varillas = rango(N + 1, i => { const A = a0 + (a1 - a0) * i / N; return `<path d="M${cx} ${cy}L${p(A, R0 * .48)}"/>`; });
  const festón = rango(N, i => { const A = a0 + (a1 - a0) * i / N, B = a0 + (a1 - a0) * (i + 1) / N; return `<path d="M${p(A, R0)}Q${p((A + B) / 2, R0 + 7)} ${p(B, R0)}"/>`; });
  return `<defs><clipPath id="${id}"><path d="${sector}"/></clipPath></defs>` + som(`<path d="${sector}"/>`) + con(`<path d="${sector}"/>`) +
    `<path d="${sector}" ${t.f("d")}/><g clip-path="url(#${id})">${gajos}<rect width="200" height="200" fill="url(#lv-luz)"/>${t.relieve ? `<rect width="200" height="200" fill="url(#lv-relieve)"/>` : ""}` +
    `<g ${ln(t, .9, ` opacity=".8"`)}>${[.62, .8].map(k => `<path d="M${p(a0, R0 * k)}A${R0 * k} ${R0 * k} 0 0 1 ${p(a1, R0 * k)}" stroke-dasharray="2 3"/>`).join("")}</g></g>` +
    `<path d="M${p(a0, R0 * .5)}A${R0 * .5} ${R0 * .5} 0 0 1 ${p(a1, R0 * .5)}" ${ln(t, 1)}/>` +
    `<g ${ln(t, .7, ` opacity=".7"`)}>${festón}</g>` + `<path d="${sector}" ${ln(t)}/>` +
    `<path d="M${cx} ${cy}L${p(a0, R0 * .5)}A${R0 * .5} ${R0 * .5} 0 0 1 ${p(a1, R0 * .5)}Z" fill="${m.base}" opacity=".55"/>` +
    `<g ${ln(m, 1.2)}>${varillas}</g>` +
    `<path d="M${p(a0 + .1, R0 - 6)}A${R0 - 6} ${R0 - 6} 0 0 1 ${p(a0 + .75, R0 - 6)}" fill="none" stroke="${t.rim}" stroke-width="2.2" stroke-linecap="round"/>` +
    `<circle cx="${cx}" cy="${cy}" r="7" ${m.f("r")} ${ln(m).replace('fill="none" ', "")}/><circle cx="${cx}" cy="${cy}" r="2.2" fill="${m.lo}"/>`;
},
funda(c){
  const t = P(c), m = P("#D9BC92"), cuerpo = rr(70, 44, 60, 126, 12), hoja = P("#7D9A7F"), flor = P("#E9B9C3");
  return R(`<g>${capa(rr(80, 30, 40, 24, 3), m, { dir: "h" })}<g ${ln(m, .8)}>${rango(5, i => `<path d="M${84 + i * 8} 31v22"/>`)}</g></g>` +
    capa(cuerpo, t, { dir: "h" }) + costura(rr(75, 49, 50, 116, 9), t, .7) +
    capa("M70 56Q100 48 130 56V78Q100 92 70 78Z", t, { dir: "v", contacto: false, dx: 0, dy: 3 }) + esfera(100, 84, 4.4, P(CIRUELA)) +
    (t.esp ? "" : `<g transform="translate(100 126)">${rango(5, i => `<ellipse cx="0" cy="-6" rx="3.6" ry="6" transform="rotate(${i * 72})" fill="${flor.base}" stroke="${flor.line}" stroke-width=".7"/>`)}<circle r="2.6" fill="#F2D45C"/><path d="M-4 10q-8 6-14 2q4-8 14-2zM4 10q8 6 14 2q-4-8-14-2z" fill="${hoja.base}" stroke="${hoja.line}" stroke-width=".7"/></g>`) +
    rim("M76 92V160", t, 1.8, .7), -18);
},
paraguas(c){
  const t = P(c), m = P(METAL), madera = P("#8B5A2B"), N = 8, Rr = 62, cx = 98, cy = 96;
  const v = i => pt(cx, cy, Rr, -PI / 2 + i * 2 * PI / N);
  let borde = ""; for (let i = 0; i < N; i++) { const [x0, y0] = v(i), [x1, y1] = v(i + 1), [mx, my] = pt(cx, cy, Rr * .86, -PI / 2 + (i + .5) * 2 * PI / N); borde += (i ? "" : `M${f1(x0)} ${f1(y0)}`) + `Q${f1(mx)} ${f1(my)} ${f1(x1)} ${f1(y1)}`; }
  borde += "Z";
  const gajos = rango(N, i => { const [x0, y0] = v(i), [x1, y1] = v(i + 1), [mx, my] = pt(cx, cy, Rr * .86, -PI / 2 + (i + .5) * 2 * PI / N);
    return `<path d="M${cx} ${cy}L${f1(x0)} ${f1(y0)}Q${f1(mx)} ${f1(my)} ${f1(x1)} ${f1(y1)}Z" ${i % 2 ? `fill="#fff" opacity="${t.oscuro ? .1 : .2}"` : `fill="${TINTA}" opacity=".07"`}/>`; });
  return `<path d="M136 138C150 150 158 160 150 168C144 172 138 166 142 160" fill="none" stroke="${madera.line}" stroke-width="7" stroke-linecap="round"/><path d="M136 138C150 150 158 160 150 168C144 172 138 166 142 160" fill="none" stroke="url(#lv-carey)" stroke-width="5.2" stroke-linecap="round"/>` +
    capa(borde, t, { dir: "d" }) + gajos + `<path d="${borde}" fill="url(#lv-luz)"/>` +
    rango(N, i => { const [x, y] = v(i); return `<path d="M${cx} ${cy}L${f1(x)} ${f1(y)}" ${ln(t, .9, ` opacity=".8"`)}/>` + `<circle cx="${f1(x)}" cy="${f1(y)}" r="2.2" fill="${m.base}" stroke="${m.line}" stroke-width=".7"/>`; }) +
    esfera(cx, cy, 5.5, m) + rim(`M${f1(v(6)[0] + 6)} ${f1(v(6)[1] - 4)}Q${f1(cx - 46)} ${f1(cy - 44)} ${f1(v(7)[0])} ${f1(v(7)[1] + 2)}`, t, 2, .8);
},

/* ---------- pelo ---------- */
pinza(c){
  const t = P(c), m = P(METAL);
  const dedos = (arriba) => rango(6, i => { const x = 52 + i * 19 + (arriba ? 0 : 9.5), y0 = arriba ? 88 : 112, y1 = arriba ? 58 + Math.abs(i - 2.5) * 4 : 142 - Math.abs(i - 2.5) * 4;
    const s2 = arriba ? -1 : 1, d = `M${x - 6} ${y0}Q${x - 6} ${(y0 + y1) / 2} ${x - 3.5} ${y1 - s2 * 3}Q${x} ${y1 + s2 * 2} ${x + 3.5} ${y1 - s2 * 3}Q${x + 6} ${(y0 + y1) / 2} ${x + 6} ${y0}Z`; return d; });
  const ar = dedos(true).split("Z").filter(Boolean).map(d => d + "Z"), ab = dedos(false).split("Z").filter(Boolean).map(d => d + "Z");
  const lomo = rr(42, 84, 116, 32, 14);
  return R(som(ar.concat(ab).map(d => `<path d="${d}"/>`).join("") + `<path d="${lomo}"/>`) +
    ab.map(d => sup(d, t, { dir: "v" })).join("") + ar.map(d => sup(d, t, { dir: "v" })).join("") +
    con(`<path d="${lomo}"/>`) + sup(lomo, t, { dir: "y" }) + `<path d="M48 100H152" ${ln(t, .9, ` opacity=".6"`)}/>` +
    capa(rr(92, 94, 16, 12, 3), m, { sombra: false }) + rim("M52 89H120", t, 2, .8), -10);
},
diadema(c){
  const t = P(c), d = "M46 156C34 70 166 70 154 156";
  return somBanda(d, 18) + banda(d, t, 16, { dir: "v" }) +
    `<path d="M46 156C34 70 166 70 154 156" fill="none" stroke="${t.lo}" stroke-width="5" opacity=".2" transform="translate(1.5 3)"/>` +
    `<path d="M41.6 148C35.6 112 70 87 100 87" fill="none" stroke="${t.rim}" stroke-width="2.2" stroke-linecap="round" opacity=".8"/>` +
    `<path d="${d}" fill="none" stroke="${t.line}" stroke-width=".8" stroke-dasharray="1.6 2.6" opacity=".7"/>`;
},
horquilla(c){
  const t = P(c);
  const h = (x, y, a, e) => { const d = "M0 0H96A4 4 0 0 1 96 8H8L18 10.5L28 8L38 10.5L48 8L58 10.5L68 8L78 10.5L88 8"; const recta = "M0 0H96A4 4 0 0 1 96 8"; const ond = "M96 8H86L76 11L66 8L56 11L46 8L36 11L26 8L16 11L6 8";
    return `<g transform="translate(${x} ${y}) rotate(${a}) scale(${e})">` + som(`<path d="${recta}${ond.slice(5)}" fill="none" stroke="${CIRUELA}" stroke-width="3"/>`, 3, 4, .2) +
      `<path d="${recta}" fill="none" stroke="${t.line}" stroke-width="3.6" stroke-linecap="round"/><path d="${ond}" fill="none" stroke="${t.line}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="${recta}" fill="none" stroke="${t.base}" stroke-width="2.4" stroke-linecap="round"/><path d="${ond}" fill="none" stroke="${t.base}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="M4 -.4H90" stroke="#fff" stroke-width=".7" opacity=".55"/>` + `<circle cx="0" cy="0" r="2.4" fill="${t.lo}"/><circle cx="6" cy="8" r="2.4" fill="${t.lo}"/></g>`; };
  return h(50, 60, 8, 1) + h(46, 92, -4, 1.05) + h(56, 122, 10, .95) + h(60, 150, -6, .9);
},
coletero(c){
  const t = P(c);
  const anillo = (cx, cy, e) => { const ext = polar(cx, cy, a => (54 + 3.5 * Math.sin(22 * a)) * e, 220), int = polar(cx, cy, a => (22 + 2 * Math.sin(18 * a + 1)) * e, 120);
    return capa(ext + int, t, { dir: "d", extra: ` fill-rule="evenodd"` }) +
      `<g ${ln(t, .8, ` opacity=".55"`)}>${rango(22, i => { const a = i / 22 * 2 * PI + .07, [x0, y0] = pt(cx, cy, 25 * e, a), [x1, y1] = pt(cx, cy, 52 * e, a + .12); return `<path d="M${f1(x0)} ${f1(y0)}Q${f1((x0 + x1) / 2 + 3)} ${f1((y0 + y1) / 2 - 2)} ${f1(x1)} ${f1(y1)}"/>`; })}</g>` +
      `<path d="${ext}${int}" fill-rule="evenodd" fill="url(#lv-luz)"/>` + rim(arco(cx, cy, 46 * e, PI * 1.05, PI * 1.4), t, 2.2, .8); };
  return anillo(124, 122, .66) + anillo(86, 88, .9);
},
});

Object.assign(I.FOCO, { media: [100, 60], calcetin: [90, 60], bolso: [100, 120], abanico: [100, 100], paraguas: [98, 96], collar: [100, 130], pendiente: [100, 92], coletero: [86, 88], pinza: [100, 100] });
})();
