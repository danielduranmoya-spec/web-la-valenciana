/* =========================================================
   LA VALENCIANA v3 · vistas/colores.js
   1) «Buscar por color» (#/colores, #/colores/:grupo, #/colores/:grupo/:color):
      para casar hilo, botones o cintas con una tela, o encontrar unas medias a juego.
   2) Portada: tira «Busque por color» y fila «Lo último que ha mirado».
   3) Barra inferior fija en el móvil (Inicio · Mercería · Complementos · Cápsulas · Cesta).
   ========================================================= */
(() => {
"use strict";
const U = () => LV.util, D = () => LV.datos;
const esc = s => LV.util.esc(s);
const ic = n => (LV.IC && LV.IC[n]) || "";

const GRUPOS = [
  { id: "blancos",  n: "Blancos y crudos",      c: ["Blanco", "Crudo", "Nácar", "Beige", "Transparente"] },
  { id: "rosas",    n: "Rosas y rojos",         c: ["Rosa empolvado", "Rosa chicle", "Fucsia", "Coral", "Rojo", "Burdeos", "Malva", "Oro rosa"] },
  { id: "amarillos",n: "Amarillos y dorados",   c: ["Amarillo", "Mostaza", "Naranja", "Dorado"] },
  { id: "verdes",   n: "Verdes",                c: ["Verde menta", "Turquesa", "Verde oliva", "Kaki", "Verde botella"] },
  { id: "azules",   n: "Azules y lilas",        c: ["Celeste", "Azulón", "Azul marino", "Lila", "Morado"] },
  { id: "marrones", n: "Tostados y marrones",   c: ["Carne", "Visón", "Camel", "Carey", "Marrón"] },
  { id: "grises",   n: "Grises y negros",       c: ["Gris perla", "Plata", "Gris marengo", "Negro"] },
  { id: "estampados", n: "Estampados y multicolor", c: ["Multicolor", "Estampado flores", "Estampado lunares"] }
];
const grupo = id => GRUPOS.find(g => g.id === id) || null;
const slug = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
const urlColores = (g, c) => `#/colores${g ? "/" + g : ""}${c ? "/" + slug(c) : ""}`;

function fondo(nombre){
  const v = D().COL[nombre];
  if (v === "linear") return "conic-gradient(#EE8FB0, #F2D45C, #A8CDEB, #A8D8C0, #EE8FB0)";
  if (v === "flores") return "radial-gradient(circle at 35% 35%, #C2185B 0 18%, transparent 19%), radial-gradient(circle at 70% 70%, #C2185B 0 15%, transparent 16%), #F7E3E8";
  if (v === "lunares") return "radial-gradient(circle at 30% 30%, #fff 0 14%, transparent 15%), radial-gradient(circle at 72% 70%, #fff 0 14%, transparent 15%), #24365C";
  return v || "#ccc";
}
const punto = (nombre, tam = 22) => `<span class="col-punto" style="--t:${tam}px;background:${fondo(nombre)}" aria-hidden="true"></span>`;

/** productos que tienen alguna versión de esos colores, con el índice de la primera que coincide */
function conColores(nombres){
  const set = new Set(nombres);
  const out = [];
  for (const p of D().PRODUCTOS){
    if (!p.conColor) continue;
    const i = p.variantes.findIndex(v => set.has(v.n));
    if (i >= 0) out.push([p, i]);
  }
  return out;
}

function tarjetas(pares){
  const T = LV.tarjeta;
  if (!pares.length) return `<p class="col-vacio">Ahora mismo no tenemos artículos en este color en la web. Pregúntenos: en la tienda hay más.</p>`;
  return `<div class="tarjeta-rejilla-marco"><div class="tarjeta-rejilla" data-r-grupo>${pares.map(([p, i]) => T.html(p, { variante: i })).join("")}</div></div>`;
}

function vistaHTML(p){
  const g = p.grupo ? grupo(p.grupo) : null;
  if (p.grupo && !g) return null;
  const colorElegido = g && p.color ? g.c.find(c => slug(c) === p.color) : null;
  const paleta = GRUPOS.map(x => {
    const n = conColores(x.c).length;
    return `<li><a class="col-grupo${g && g.id === x.id ? " col-grupo--activo" : ""}" href="${urlColores(x.id)}"${g && g.id === x.id ? ' aria-current="true"' : ""} data-r>
      <span class="col-grupo__puntos">${x.c.slice(0, 5).map(c => punto(c, 26)).join("")}</span>
      <span class="col-grupo__n">${esc(x.n)}</span><span class="col-grupo__cuenta">${n} artículos</span></a></li>`;
  }).join("");
  let cuerpo = "";
  if (g){
    const nombres = colorElegido ? [colorElegido] : g.c;
    const lista = conColores(nombres);
    const chips = `<ul class="pildoras pildoras--desliza col-chips" role="list">
      <li><a class="pildora" href="${urlColores(g.id)}"${!colorElegido ? ' aria-current="true"' : ""}><span>Todos</span> <span class="pildora__n">(${conColores(g.c).length})</span></a></li>
      ${g.c.filter(c => conColores([c]).length).map(c => `<li><a class="pildora col-chip" href="${urlColores(g.id, c)}"${colorElegido === c ? ' aria-current="true"' : ""}>${punto(c, 18)}<span>${esc(c)}</span> <span class="pildora__n">(${conColores([c]).length})</span></a></li>`).join("")}
    </ul>`;
    cuerpo = `<section class="col-resultados" aria-labelledby="col-res-t">
      <div class="contenedor">
        <h2 id="col-res-t" class="col-res__t">${esc(colorElegido || g.n)}</h2>
        ${chips}
        <p class="col-res__n" aria-live="polite">${lista.length} ${lista.length === 1 ? "artículo" : "artículos"}. Cada uno se abre ya en este color.</p>
        ${tarjetas(lista)}
      </div>
    </section>`;
  }
  return `<div class="col">
  <header class="col-cab contenedor">
    <p class="caja-antetitulo">Buscar por color</p>
    <h1 data-titular>${g ? `Artículos en ${esc((colorElegido || g.n).toLowerCase())}` : "¿De qué color lo busca?"}</h1>
    <p class="t-entradilla col-cab__txt">Elija un color y le enseñamos todo lo que tenemos en ese tono: hilos, botones, cintas, medias, pañuelos… Si quiere casarlo con una tela, mándenos una foto por WhatsApp y le decimos cuál va mejor.</p>
  </header>
  <nav class="contenedor" aria-label="Colores"><ul class="col-paleta" role="list" data-r-grupo>${paleta}</ul></nav>
  ${cuerpo}
</div>`;
}

LV.vistas = LV.vistas || {};
LV.vistas.colores = {
  titulo: p => p.grupo && grupo(p.grupo) ? `${grupo(p.grupo).n} · Buscar por color` : "Buscar por color",
  nav: () => "",
  html: vistaHTML,
  montar(main){ try { LV.tarjeta.montar(main); } catch (e) {} }
};

/* ---------- portada: tira de colores y «lo último que ha mirado» ---------- */
const VISTOS = "lv-vistos";
const leerVistos = () => { try { return (U().leer ? U().leer(VISTOS, []) : JSON.parse(localStorage.getItem(VISTOS) || "[]")).filter(id => D().PORID[id]); } catch (e) { return []; } };
const guardarVistos = l => { try { U().guardar ? U().guardar(VISTOS, l) : localStorage.setItem(VISTOS, JSON.stringify(l)); } catch (e) {} };
document.addEventListener("lv:ruta-cambiada", e => {
  const d = e.detail || {};
  if (d.vista === "producto" && d.params && d.params.id){
    const l = leerVistos().filter(x => x !== d.params.id); l.unshift(d.params.id); guardarVistos(l.slice(0, 10));
  }
});

function tiraColores(){
  return `<section class="col-tira" aria-labelledby="col-tira-t">
  <div class="contenedor col-tira__in">
    <div class="col-tira__txt" data-r>
      <p class="caja-antetitulo">Novedad en la web</p>
      <h2 id="col-tira-t">Busque por color</h2>
      <p>¿Necesita un hilo, unos botones o unas medias de un tono concreto? Toque un color.</p>
    </div>
    <ul class="col-tira__lista" role="list" data-r-grupo>
      ${GRUPOS.map(g => `<li data-r><a class="col-gota" href="${urlColores(g.id)}"><span class="col-gota__mancha" style="background:${g.id === "estampados" ? fondo("Multicolor") : `linear-gradient(135deg, ${fondo(g.c[0])}, ${fondo(g.c[Math.min(2, g.c.length - 1)])})`}" aria-hidden="true"></span><span class="col-gota__n">${esc(g.n)}</span></a></li>`).join("")}
    </ul>
  </div>
</section>`;
}
function vistosHTML(){
  const l = leerVistos().map(id => D().PORID[id]).filter(Boolean);
  if (l.length < 2 || !LV.tarjeta || !LV.tarjeta.fila) return "";
  return `<div class="contenedor col-vistos">${LV.tarjeta.fila(l, { titulo: "Lo último que ha mirado", id: "col-vistos", entradilla: "Por si quiere volver a verlo." })}</div>`;
}
function registrar(){
  if (!LV.rutas || typeof LV.rutas.seccion !== "function") return false;
  LV.rutas.seccion("inicio", { id: "vistos", orden: 22, html: vistosHTML, montar: el => { try { LV.tarjeta.montar(el); } catch (e) {} } });
  LV.rutas.seccion("inicio", { id: "colores", orden: 25, html: tiraColores });
  return true;
}
if (!registrar()) document.addEventListener("DOMContentLoaded", registrar, { once: true });

/* ---------- barra inferior en el móvil ---------- */
function barra(){
  if (document.getElementById("lv-dock")) return;
  const R = LV.rutas && LV.rutas.url;
  const items = [
    ["#/", "Inicio", `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>`, h => h === "#/" || h === "" ],
    ["#/c/merceria", "Mercería", `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="7" y="3" width="10" height="3" rx="1"/><rect x="7" y="18" width="10" height="3" rx="1"/><path d="M8.5 6v12M15.5 6v12M8.5 9h7M8.5 12h7M8.5 15h7"/></svg>`, h => h.startsWith("#/c/merceria")],
    ["#/c/complementos", "Complem.", `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 20 3.5 11a9 9 0 0 1 17 0z"/><path d="M12 20 8 11.5M12 20l4-8.5M12 20V11"/></svg>`, h => h.startsWith("#/c/complementos")],
    ["#/c/capsulas", "Cápsulas", `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 8h18v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M2 5h20v3H2zM12 5v16M12 5c-2-3-6-3-5 0M12 5c2-3 6-3 5 0"/></svg>`, h => h.startsWith("#/c/capsulas")]
  ];
  const nav = document.createElement("nav");
  nav.id = "lv-dock"; nav.className = "lv-dock"; nav.setAttribute("aria-label", "Accesos rápidos");
  nav.innerHTML = items.map(([href, t, svg]) => `<a class="lv-dock__b" href="${href}">${svg}<span>${t}</span></a>`).join("") +
    `<button type="button" class="lv-dock__b lv-dock__cesta" aria-haspopup="dialog" aria-controls="ces-panel"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4 8h16l-1.5 12h-13z"/><path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8"/></svg><span>Cesta</span><span class="lv-dock__n" aria-hidden="true">0</span><span class="visualmente-oculto lv-dock__sr">, 0 artículos</span></button>`;
  document.body.appendChild(nav);
  nav.querySelector(".lv-dock__cesta").addEventListener("click", e => { try { LV.cesta.abrir(e.currentTarget); } catch (x) {} });
  const pintar = () => {
    const h = location.hash || "#/";
    nav.querySelectorAll("a.lv-dock__b").forEach((a, i) => { if (items[i][3](h)) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    const oculta = /^#\/(p\/|pedido)/.test(h);
    nav.hidden = oculta; document.documentElement.classList.toggle("con-dock", !oculta);
  };
  const cuenta = () => {
    let n = 0; try { n = LV.tienda.articulos(); } catch (e) {}
    const b = nav.querySelector(".lv-dock__n"); b.textContent = n; b.dataset.n = n;
    nav.querySelector(".lv-dock__sr").textContent = `, ${n} ${n === 1 ? "artículo" : "artículos"}`;
    if (n){ b.classList.remove("lv-dock__n--late"); void b.offsetWidth; b.classList.add("lv-dock__n--late"); }
  };
  document.addEventListener("lv:ruta-cambiada", pintar);
  document.addEventListener("lv:cesta-cambiada", cuenta);
  document.addEventListener("focusin", e => {
    if (nav.hidden || nav.contains(e.target) || getComputedStyle(nav).display === "none") return;
    const t = e.target.getBoundingClientRect(), d = nav.getBoundingClientRect();
    if (t.bottom > d.top - 8) window.scrollBy({ top: t.bottom - d.top + 24, behavior: "instant" });
  });
  pintar(); cuenta();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(barra, 0), { once: true });
else setTimeout(barra, 0);
})();
