/* =========================================================
   LA VALENCIANA v2 · vistas/categoria.js · PROPIETARIO: B4
   LV.vistas.categoria (#/c/:cat y #/c/:cat/:sub)
   LV.vistas.buscar    (#/buscar/:q)
   LV.vistas.novedades (#/novedades)
   Maquetación: spec/DISENO.md §7.2 y §7.3. Estilos: css/listado.css
   ========================================================= */
(() => {
"use strict";

const TANDA = 24;
const estado = new Map();         // clave de listado → {mostrar, orden, filtro} (memoria de la sesión, para volver atrás)
const ORDENES = [
  ["recomendados", "Recomendados"],
  ["precio-asc", "Precio: de menor a mayor"],
  ["precio-desc", "Precio: de mayor a menor"],
  ["nombre", "Nombre"]
];
const PRUEBE = ["hilo", "botones", "cremallera", "medias", "abanico", "lana"];

/* piezas del bodegón de cabecera (DISENO §9) */
const BODEGON = {
  merceria: [["bobina", "#E8BEC4"], ["boton", "#7A4E2D"], ["cremallera", "#C9CDD2"]],
  complementos: [["abanico", "#B9A3D6"], ["media", "#2F2A26"], ["bolso", "#B98A55"]]
};
const POS = [
  { x: -6, y: -14, e: 1.24, r: -12 },
  { x: 140, y: 92, e: 1.02, r: 9 },
  { x: 262, y: 128, e: 1.12, r: -5 }
];

/* ---------------- utilidades ---------------- */
const U = () => LV.util, D = () => LV.datos;
const precioMin = p => p.precios ? Math.min(...Object.values(p.precios)) : p.precio;
function ordenar(lista, orden){
  const l = lista.slice();
  if (orden === "precio-asc") l.sort((a, b) => precioMin(a) - precioMin(b) || a.orden - b.orden);
  else if (orden === "precio-desc") l.sort((a, b) => precioMin(b) - precioMin(a) || a.orden - b.orden);
  else if (orden === "nombre") l.sort((a, b) => a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" }));
  else l.sort((a, b) => (b.destacado - a.destacado) || (b.novedad - a.novedad) || a.orden - b.orden);
  return l;
}
const articulos = n => `${n} ${n === 1 ? "artículo" : "artículos"}`;
const cuantos = (n, total) => `Viendo ${Math.min(n, total)} de ${total}`;
const ic = n => (LV.IC && LV.IC[n]) || "";
const tit = t => { document.title = `${t} · La Valenciana`; };

const NEUTROS = new Set(["Blanco", "Negro", "Gris perla", "Gris marengo", "Plata", "Crudo", "Beige", "Transparente", "Nácar", "Carne"]);
/** Color con más gracia para el bodegón: el primero que no sea neutro. */
function colorDe(prod){
  const v = prod.variantes.find(x => x.c && x.c[0] === "#" && !NEUTROS.has(x.n)) || prod.variantes.find(x => x.c && x.c[0] === "#");
  return v ? v.c : "#E8BEC4";
}
/** <g> de una pieza sin lienzo; si B8 aún no la tiene, nada (la cabecera se ve igual sin bodegón) */
function pieza(icono, color, rot = 0){
  try { return (LV.ilus && LV.ilus.pieza) ? LV.ilus.pieza(icono, color, { rot }) : ""; } catch (e) { console.error("[B4] LV.ilus.pieza", icono, e); return ""; }
}
/** Bodegón de 3 piezas en diagonal, sobre el propio paño de la banda (svg transparente). */
function bodegon(piezas){
  const gs = piezas.map(([icono, color], i) => {
    const p = POS[i], g = pieza(icono, color, p.r); if (!g) return "";
    return `<g transform="translate(${p.x} ${p.y}) rotate(${p.r} ${100 * p.e} ${100 * p.e}) scale(${p.e})"><g class="lis-pieza" data-r="caer" style="--i:${i + 2}">${g}</g></g>`;
  }).join("");
  if (!gs) return "";
  return `<svg class="lis-bodegon__svg" viewBox="0 0 480 360" aria-hidden="true" focusable="false">${gs}</svg>`;
}
function miniatura([icono, color]){
  const g = pieza(icono, color); if (!g) return "";
  return `<svg class="lis-mini__svg" viewBox="0 0 200 200" aria-hidden="true" focusable="false">${g}</svg>`;
}
function piezasDe(cat, sub){
  if (!sub) return BODEGON[cat] || BODEGON.merceria;
  const vistos = new Set(), out = [];
  for (const p of D().productosDe(cat, sub)) {
    if (vistos.has(p.icono)) continue;
    vistos.add(p.icono); out.push([p.icono, colorDe(p)]);
    if (out.length === 3) break;
  }
  for (const p of D().productosDe(cat, sub)) { if (out.length >= 3) break; if (out.length < 3 && !out.some(x => x[1] === colorDe(p) && x[0] === p.icono)) out.push([p.icono, (p.variantes[1] && p.variantes[1].c) || colorDe(p)]); }
  return out.length ? out : (BODEGON[cat] || BODEGON.merceria);
}
function ayudaHTML(){
  const u = U(), T = D().TIENDA;
  return `<aside class="lis-ayuda contenedor" aria-labelledby="lis-ayuda-t">
<div class="lis-ayuda__texto"><h2 id="lis-ayuda-t" class="lis-ayuda__titulo" data-r>¿No lo encuentra?</h2>
<p data-r>Pregúntenos por WhatsApp: a veces lo tenemos en la tienda y aún no está en la web.</p></div>
<div class="lis-ayuda__acciones" data-r>
<a class="boton boton--secundario" href="${u.esc(u.whatsURL("Hola, estoy buscando: "))}" target="_blank" rel="noopener">${ic("whats")}<span>Escribir por WhatsApp</span></a>
<p class="lis-ayuda__tel">o llame al <a href="${u.telURL()}">${T.tel.replace(/ /g, "&nbsp;")}</a></p>
</div>
</aside>`;
}
function masHTML(mostrar, total){
  const pct = total ? Math.round(Math.min(mostrar, total) / total * 100) : 100;
  return `<div class="lis-mas contenedor"${mostrar >= total ? " hidden" : ""}>
<p class="lis-mas__cuenta" data-lis-viendo>${cuantos(mostrar, total)}</p>
<div class="lis-mas__barra" aria-hidden="true"><span style="--p:${pct}%"></span></div>
<button type="button" class="boton boton--secundario lis-mas__boton" data-lis-mas>Ver más productos</button>
</div>`;
}
function selectOrden(orden){
  const id = U().uid("lis-orden");
  return `<div class="lis-orden"><label class="lis-orden__etiqueta" for="${id}">Ordenar</label>
<span class="lis-orden__marco"><select class="campo__control lis-orden__select" id="${id}" data-lis-orden>${ORDENES.map(([v, t]) => `<option value="${v}"${v === orden ? " selected" : ""}>${t}</option>`).join("")}</select>${ic("abajo")}</span></div>`;
}
/* Búsqueda con color («medias negras»): la tarjeta se abre ya en ese color. (R3)
   Se compara la raíz de cada palabra (4 letras, sin tildes) con el nombre de cada versión. */
const sinTildes = t => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
function varianteBuscada(prod, q){
  if (!q || !prod.conColor || prod.variantes.length < 2) return 0;
  const raices = sinTildes(q).split(/[^a-zñ]+/).filter(w => w.length >= 4).map(w => w.slice(0, 4));
  if (!raices.length) return 0;
  const i = prod.variantes.findIndex(v => sinTildes(v.n).split(/\s+/).some(w => raices.includes(w.slice(0, 4))));
  return i < 0 ? 0 : i;
}
const opcionesBus = q => p => ({ variante: varianteBuscada(p, q) });
function rejillaCon(lista, opcionesDe){
  if (!opcionesDe) return LV.tarjeta.rejilla(lista);
  return `<div class="tarjeta-rejilla-marco"><div class="tarjeta-rejilla" data-r-grupo>${lista.map(p => LV.tarjeta.html(p, opcionesDe(p))).join("")}</div></div>`;
}
const vacioRejilla = () => `<p class="lis-vacio">Ahora mismo no tenemos artículos aquí. Pregúntenos: puede que esté en la tienda.</p>`;

/* ---------------- listado genérico (rejilla + ver más + ordenar) ---------------- */
/**
 * Crea el controlador de un listado montado en `main`.
 * cfg = {clave, lista() → [prod] ya filtrada, nombre (para avisos)}
 */
function controlador(main, cfg){
  const st = estado.get(cfg.clave) || { mostrar: TANDA, orden: "recomendados", filtro: "todo" };
  estado.set(cfg.clave, st);
  const rejilla = () => main.querySelector(".lis-productos .tarjeta-rejilla");
  const lista = () => ordenar(cfg.lista(st), st.orden);

  function pintar(fundido, anuncio){
    const l = lista(), cont = main.querySelector(".lis-productos");
    if (!cont) return;
    const poner = () => {
      cont.innerHTML = l.length ? rejillaCon(l.slice(0, st.mostrar), cfg.opcionesDe) : vacioRejilla();
      const mas = main.querySelector(".lis-mas");
      if (mas) mas.outerHTML = masHTML(st.mostrar, l.length);
      cfg.alPintar && cfg.alPintar(l, st);
      cont.classList.remove("lis-productos--sale");
      try { LV.mov && LV.mov.revelar && LV.mov.revelar(main); } catch (e) {}
      if (anuncio) U().anunciar(anuncio);
    };
    if (fundido && !U().reducido()) { cont.classList.add("lis-productos--sale"); setTimeout(poner, 200); }
    else if (fundido) { cont.classList.add("lis-productos--sale"); setTimeout(poner, 150); }
    else poner();
  }
  function verMas(){
    const l = lista(), r = rejilla(); if (!r) return;
    const desde = st.mostrar;
    st.mostrar = Math.min(l.length, st.mostrar + TANDA);
    r.insertAdjacentHTML("beforeend", l.slice(desde, st.mostrar).map(p => LV.tarjeta.html(p, cfg.opcionesDe ? cfg.opcionesDe(p) : {})).join(""));
    const mas = main.querySelector(".lis-mas");
    if (mas) {
      mas.querySelector("[data-lis-viendo]").textContent = cuantos(st.mostrar, l.length);
      mas.querySelector(".lis-mas__barra span").style.setProperty("--p", `${Math.round(st.mostrar / l.length * 100)}%`);
      if (st.mostrar >= l.length) mas.hidden = true;
    }
    try { LV.mov && LV.mov.revelar && LV.mov.revelar(main); } catch (e) {}
    const nueva = r.children[desde] && r.children[desde].querySelector(".tarjeta__enlace");
    if (nueva) { try { nueva.focus({ preventScroll: true }); } catch (e) { nueva.focus(); } nueva.closest(".tarjeta").scrollIntoView({ block: "nearest", behavior: U().reducido() ? "auto" : "smooth" }); }
    U().anunciar(`${cuantos(st.mostrar, l.length)} artículos.`);
  }
  const clic = e => {
    if (e.target.closest("[data-lis-mas]")) { verMas(); return; }
    const f = e.target.closest("[data-lis-filtro]");
    if (f) {
      st.filtro = f.dataset.lisFiltro; st.mostrar = TANDA;
      main.querySelectorAll("[data-lis-filtro]").forEach(b => b.setAttribute("aria-pressed", b === f ? "true" : "false"));
      const n = cfg.lista(st).length;
      pintar(true, `${articulos(n)}.`);
    }
  };
  const cambio = e => {
    const s = e.target.closest("[data-lis-orden]"); if (!s) return;
    st.orden = s.value;
    pintar(true, `Ordenado: ${s.options[s.selectedIndex].text}.`);
  };
  main.addEventListener("click", clic);
  main.addEventListener("change", cambio);
  return {
    st, pintar,
    quitar(){ main.removeEventListener("click", clic); main.removeEventListener("change", cambio); }
  };
}

/* =========================================================
   CATEGORÍA / SUBCATEGORÍA
   ========================================================= */
let ctl = null;
const claveCat = p => `c/${p.cat}/${p.sub || ""}`;

function cabeceraCat(p){
  const u = U(), cat = p.categoria, sub = p.subcategoria;
  const n = D().productosDe(p.cat, p.sub).length;
  const piezas = piezasDe(p.cat, p.sub);
  const bod = bodegon(piezas);
  return `<header class="lis-cab lis-cab--${u.esc(p.cat)}">
<div class="lis-cab__pano rev" aria-hidden="true"></div>
<div class="contenedor lis-cab__rejilla">
<div class="lis-cab__texto">
<div class="lis-cab__fila-h1"><h1 class="lis-cab__h1" data-titular>${u.esc(sub ? sub.n : cat.nombre)}</h1><div class="lis-mini" aria-hidden="true">${miniatura(piezas[0])}</div></div>
<p class="t-entradilla lis-cab__entradilla" data-r data-r-retardo="250">${u.esc(sub ? sub.txt : cat.texto)}</p>
<p class="lis-cab__cuenta" data-r data-r-retardo="350" aria-live="polite" data-lis-cuenta>${articulos(n)}</p>
</div>
<div class="lis-bodegon" aria-hidden="true">${bod}</div>
</div>
</header>`;
}
function pildorasCat(p){
  const u = U(), url = LV.rutas.url;
  const total = D().productosDe(p.cat).length;
  const ch = `<span class="pildora__check" aria-hidden="true">${ic("check")}</span>`;
  const una = (href, txt, n, activa) => `<li><a class="pildora" href="${href}"${activa ? ' aria-current="page"' : ""}>${ch}<span>${u.esc(txt)}</span> <span class="pildora__n">(${n})</span></a></li>`;
  return `<nav class="lis-subs" aria-label="Secciones de ${u.esc(p.categoria.nombre)}"><ul class="pildoras pildoras--desliza">
${una(url.categoria(p.cat), "Todo", total, !p.sub)}
${D().subcategorias(p.cat).filter(s => s.cuenta).map(s => una(url.categoria(p.cat, s.id), s.n, s.cuenta, s.id === p.sub)).join("")}
</ul></nav>`;
}
function migasCat(p){
  const url = LV.rutas.url;
  return p.sub
    ? U().migas([["Inicio", url.inicio()], [p.categoria.nombre, url.categoria(p.cat)], [p.subcategoria.n]])
    : U().migas([["Inicio", url.inicio()], [p.categoria.nombre]]);
}

LV.vistas.categoria = {
  titulo: p => p.sub ? `${p.subcategoria.n} · ${p.categoria.nombre}` : p.categoria.nombre,
  html(p){
    if (!p || !p.categoria) return null;
    const st = estado.get(claveCat(p)) || { mostrar: TANDA, orden: "recomendados", filtro: "todo" };
    const lista = ordenar(D().productosDe(p.cat, p.sub), st.orden);
    return `<div class="lis lis--cat lis--${U().esc(p.cat)}">
<div class="contenedor lis-migas" data-lis-migas>${migasCat(p)}</div>
${cabeceraCat(p)}
<div class="contenedor lis-controles" data-r="fundir" data-r-retardo="700">${pildorasCat(p)}${selectOrden(st.orden)}</div>
<h2 class="visualmente-oculto" data-lis-h2>Artículos de ${U().esc(p.sub ? p.subcategoria.n : p.categoria.nombre)}</h2>
<div class="contenedor lis-productos">${lista.length ? LV.tarjeta.rejilla(lista.slice(0, st.mostrar)) : vacioRejilla()}</div>
${masHTML(st.mostrar, lista.length)}
${ayudaHTML()}
</div>`;
  },
  montar(main, p){
    this._p = p;
    // orden de entrada (DISENO §8): cabecera → píldoras y «Ordenar» (700 ms) → rejilla (desde 800 ms).
    // Solo en la primera pintura: al cambiar de subcategoría o con «Ver más», las tarjetas entran sin espera.
    main.querySelectorAll(".lis-productos .tarjeta[data-r]:not([data-r-retardo])").forEach(t => t.setAttribute("data-r-retardo", "800"));
    LV.tarjeta.montar(main);
    // en móvil, la píldora activa a la vista dentro de la tira deslizante
    const act = main.querySelector('.lis-subs [aria-current="page"]'), tira = act && act.closest(".pildoras");
    if (act && tira && tira.scrollWidth > tira.clientWidth) tira.scrollLeft = Math.max(0, act.offsetLeft - tira.offsetLeft - 16);
    ctl = controlador(main, { clave: claveCat(p), lista: () => D().productosDe(this._p.cat, this._p.sub) });
  },
  desmontar(){ if (ctl) ctl.quitar(); ctl = null; },
  /** Cambiar de subcategoría dentro de la misma categoría: se actualiza en el sitio (sin repintar la página). */
  actualizar(p, anterior){
    const main = document.getElementById("contenido");
    if (!main || !anterior || p.cat !== anterior.cat || !ctl || !main.querySelector(".lis--cat")) return false;
    if (p.sub === anterior.sub) return false;
    this._p = p;
    const u = U();
    // migas, cabecera y píldoras
    const migas = main.querySelector("[data-lis-migas]"); if (migas) migas.innerHTML = migasCat(p);
    const cab = main.querySelector(".lis-cab");
    if (cab) {
      const nuevo = document.createElement("div"); nuevo.innerHTML = cabeceraCat(p);
      const h = nuevo.firstElementChild;
      h.querySelector(".lis-cab__pano").classList.add("in");          // el paño ya está puesto: no se vuelve a desenrollar
      cab.replaceWith(h);
    }
    main.querySelectorAll(".lis-subs .pildora").forEach(a => {
      const si = a.getAttribute("href") === LV.rutas.url.categoria(p.cat, p.sub || undefined);
      if (si) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    const h2 = main.querySelector("[data-lis-h2]"); if (h2) h2.textContent = `Artículos de ${p.sub ? p.subcategoria.n : p.categoria.nombre}`;
    tit(this.titulo(p));
    // foco: si la persona pulsó una píldora, se queda en ella; si no (Atrás, enlace externo…), al nuevo <h1>
    const act = document.activeElement;
    if (!act || act === document.body || act === main || !main.contains(act)) {
      const h1 = main.querySelector("h1");
      if (h1) { h1.setAttribute("tabindex", "-1"); try { h1.focus({ preventScroll: true }); } catch (e) { h1.focus(); } }
    }
    // productos
    const st = estado.get(claveCat(p)) || { mostrar: TANDA, orden: ctl.st.orden, filtro: "todo" };
    ctl.quitar();
    estado.set(claveCat(p), st);
    ctl = controlador(main, { clave: claveCat(p), lista: () => D().productosDe(this._p.cat, this._p.sub) });
    const sel = main.querySelector("[data-lis-orden]"); if (sel) sel.value = st.orden;
    const n = D().productosDe(p.cat, p.sub).length;
    ctl.pintar(true, `${p.sub ? p.subcategoria.n : p.categoria.nombre}: ${articulos(n)}.`);
    return true;
  }
};

/* =========================================================
   BÚSQUEDA
   ========================================================= */
let ctlB = null;
function formBusqueda(q){
  const u = U(), id = u.uid("bus-q");
  return `<form class="bus-form" role="search" data-bus-form>
<label class="bus-form__etiqueta" for="${id}">¿Qué busca?</label>
<div class="bus-form__fila">
<input class="campo__control bus-form__campo" id="${id}" type="search" name="q" value="${u.esc(q)}" placeholder="Escriba aquí: botones, lana, medias…" autocomplete="off" enterkeyhint="search" spellcheck="false">
<button type="submit" class="boton boton--primario bus-form__boton">${ic("buscar")}<span>Buscar</span></button>
</div>
</form>`;
}
function pruebeHTML(){
  const url = LV.rutas.url;
  return `<section class="bus-pruebe" aria-labelledby="bus-pruebe-t">
<h2 class="bus-pruebe__titulo" id="bus-pruebe-t">Pruebe con:</h2>
<ul class="pildoras">${PRUEBE.map(t => `<li><a class="pildora" href="${url.buscar(t)}">${t}</a></li>`).join("")}</ul>
</section>`;
}
function destacadosHTML(n = 4){
  const l = D().DESTACADOS.map(D().producto).filter(Boolean).slice(0, n);
  if (!l.length) return "";
  return `<section class="bus-destacados contenedor" aria-labelledby="bus-dest-t">
<h2 id="bus-dest-t" class="bus-destacados__titulo" data-r>Lo que más nos piden</h2>
${LV.tarjeta.rejilla(l)}
</section>`;
}
function cuentaBusqueda(n){ return n === 1 ? "1 artículo encontrado" : `${n} artículos encontrados`; }

LV.vistas.buscar = {
  titulo: p => p.q ? `Buscar «${p.q}»` : "Buscar",
  html(p){
    const u = U(), q = (p && p.q || "").trim();
    if (!q) {
      return `<div class="bus bus--vacia">
<div class="contenedor bus-cab"><h1 class="bus-cab__h1" data-titular>Buscar en la tienda</h1>
<p class="t-entradilla bus-cab__entradilla" data-r>Escriba lo que necesita, como lo diría en el mostrador.</p>
${formBusqueda("")}${pruebeHTML()}</div>
${destacadosHTML()}
</div>`;
    }
    const B = LV.buscador;
    const r = B && B.buscarDetallado ? B.buscarDetallado(q) : { resultados: B ? B.buscar(q) : [], parcial: false };
    const res = r.resultados || [];
    if (!res.length) {
      const T = D().TIENDA;
      return `<div class="bus bus--sin">
<div class="contenedor bus-cab">
<h1 class="bus-cab__h1" data-titular>No encontramos «${u.esc(q)}»</h1>
<p class="bus-sin__texto" data-r>Pruebe con otra palabra o pregúntenos por WhatsApp: a veces lo tenemos y aún no está en la web.</p>
<div class="bus-sin__acciones" data-r>
<a class="boton boton--primario" href="${u.esc(u.whatsURL(`Hola, busco: ${q}. ¿Lo tienen?`))}" target="_blank" rel="noopener">${ic("whats")}<span>Escribir por WhatsApp</span></a>
<a class="boton boton--secundario" href="${u.telURL()}">${ic("tel")}<span>Llamar al ${T.tel.replace(/ /g, "&nbsp;")}</span></a>
</div>
${formBusqueda(q)}${pruebeHTML()}
</div>
${destacadosHTML()}
</div>`;
    }
    const clave = `b/${q.toLowerCase()}`;
    const st = estado.get(clave) || { mostrar: TANDA, orden: "relevancia", filtro: "todo" };
    const lista = st.filtro === "todo" ? res : res.filter(x => x.cat === st.filtro);
    const cats = ["merceria", "complementos", "capsulas"].map(c => [c, res.filter(x => x.cat === c).length]).filter(x => x[1]);
    const ch = `<span class="pildora__check" aria-hidden="true">${ic("check")}</span>`;
    const filtro = cats.length > 1 ? `<div class="bus-filtros" role="group" aria-label="Mostrar"><ul class="pildoras pildoras--desliza">
<li><button type="button" class="pildora" data-lis-filtro="todo" aria-pressed="${st.filtro === "todo"}">${ch}<span>Todo</span> <span class="pildora__n">(${res.length})</span></button></li>
${cats.map(([c, n]) => `<li><button type="button" class="pildora" data-lis-filtro="${c}" aria-pressed="${st.filtro === c}">${ch}<span>${u.esc(D().categoria(c).nombre)}</span> <span class="pildora__n">(${n})</span></button></li>`).join("")}
</ul></div>` : "";
    const parcial = r.parcial ? `<div class="aviso bus-parcial" data-r>${ic("info")}<p><strong>No hay nada con todas sus palabras.</strong> Le mostramos lo que más se parece a «${u.esc(q)}».</p></div>` : "";
    return `<div class="bus bus--con">
<div class="contenedor bus-cab">
<h1 class="bus-cab__h1" data-titular>Resultados para «${u.esc(q)}»</h1>
${formBusqueda(q)}
<p class="bus-cab__cuenta" aria-live="polite" data-bus-cuenta>${cuentaBusqueda(lista.length)}</p>
${parcial}
${filtro}
</div>
<h2 class="visualmente-oculto">Artículos encontrados</h2>
<div class="contenedor lis-productos">${rejillaCon(lista.slice(0, st.mostrar), opcionesBus(q))}</div>
${masHTML(st.mostrar, lista.length)}
${ayudaHTML()}
</div>`;
  },
  montar(main, p){
    LV.tarjeta.montar(main);
    const q = (p && p.q || "").trim();
    const f = main.querySelector("[data-bus-form]");
    if (f) f.addEventListener("submit", e => {
      e.preventDefault();
      const v = f.querySelector("input").value.trim();
      if (!v) { f.querySelector("input").focus(); return; }
      LV.rutas.ir(LV.rutas.url.buscar(v));
    });
    if (!q || !main.querySelector(".bus--con")) return;
    const B = LV.buscador;
    const r = B.buscarDetallado ? B.buscarDetallado(q) : { resultados: B.buscar(q) };
    const res = r.resultados || [];
    ctlB = controlador(main, {
      clave: `b/${q.toLowerCase()}`,
      lista: st => st.filtro === "todo" ? res : res.filter(x => x.cat === st.filtro),
      opcionesDe: opcionesBus(q),
      alPintar: l => { const c = main.querySelector("[data-bus-cuenta]"); if (c) c.textContent = cuentaBusqueda(l.length); }
    });
    // la búsqueda mantiene el orden por relevancia (no hay «Ordenar»)
    ordenarRelevancia(ctlB);
    U().anunciar(cuentaBusqueda(res.length) + (r.parcial ? ". No hay nada con todas sus palabras; le mostramos lo que más se parece." : "."));
  },
  desmontar(){ if (ctlB) ctlB.quitar(); ctlB = null; }
};
function ordenarRelevancia(c){ c.st.orden = "relevancia"; }
// «relevancia» = el orden que da el buscador: ordenar() no lo toca
const _ordenar = ordenar;

/* =========================================================
   NOVEDADES
   ========================================================= */
let ctlN = null;
LV.vistas.novedades = {
  titulo: () => "Novedades",
  html(){
    const u = U();
    const lista = D().NOVEDADES.map(D().producto).filter(Boolean);
    const st = estado.get("novedades") || { mostrar: TANDA, orden: "relevancia", filtro: "todo" };
    const piezas = lista.slice(0, 3).map(p => [p.icono, colorDe(p)]);
    return `<div class="lis lis--novedades">
<div class="contenedor lis-migas">${u.migas([["Inicio", LV.rutas.url.inicio()], ["Novedades"]])}</div>
<header class="lis-cab lis-cab--novedades">
<div class="lis-cab__pano rev" aria-hidden="true"></div>
<div class="contenedor lis-cab__rejilla">
<div class="lis-cab__texto">
<div class="lis-cab__fila-h1"><h1 class="lis-cab__h1" data-titular>Novedades</h1><div class="lis-mini" aria-hidden="true">${piezas[0] ? miniatura(piezas[0]) : ""}</div></div>
<p class="t-entradilla lis-cab__entradilla" data-r data-r-retardo="250">Lo último que ha llegado a la tienda para el otoño y el invierno: lanas, prendas de abrigo y algún capricho.</p>
<p class="lis-cab__cuenta" data-r data-r-retardo="350">${articulos(lista.length)}</p>
</div>
<div class="lis-bodegon" aria-hidden="true">${bodegon(piezas)}</div>
</div>
</header>
<h2 class="visualmente-oculto">Artículos nuevos</h2>
<div class="contenedor lis-productos lis-productos--sin-controles">${LV.tarjeta.rejilla(lista.slice(0, st.mostrar))}</div>
${masHTML(st.mostrar, lista.length)}
${ayudaHTML()}
</div>`;
  },
  montar(main){
    LV.tarjeta.montar(main);
    ctlN = controlador(main, { clave: "novedades", lista: () => D().NOVEDADES.map(D().producto).filter(Boolean) });
    ctlN.st.orden = "relevancia";
  },
  desmontar(){ if (ctlN) ctlN.quitar(); ctlN = null; }
};

void _ordenar;
})();
