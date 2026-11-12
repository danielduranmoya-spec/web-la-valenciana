/* =========================================================
   LA VALENCIANA v2 · tarjeta.js · PROPIETARIO: B4
   Tarjeta de producto compartida (la usan B3, B4, B5, B6).
   Contrato: spec/ARQUITECTURA.md §4.9 y BITACORA [B4].
     LV.tarjeta.html(prod, {variante, titulo, conMuestras, maxMuestras, carga})
     LV.tarjeta.rejilla(lista, {clase, opciones})
     LV.tarjeta.fila(lista, {titulo, id, entradilla, nivel, enlace, opciones})
     LV.tarjeta.montar(contenedor) → limpiar()
     LV.tarjeta.elegida(id) → índice | null
   ========================================================= */
window.LV = window.LV || {};
LV.tarjeta = (() => {
"use strict";

const elegidas = new Map();          // id → índice de versión tocada en una tarjeta (solo esta sesión)
const ENLACES_RUTA = id => (LV.rutas && LV.rutas.url ? LV.rutas.url.producto(id) : `#/p/${id}`);
const ENLACE_VERS = id => (LV.rutas && LV.rutas.url ? LV.rutas.url.producto(id, "versiones") : `#/p/${id}/versiones`);
const NIVELES = ["h2", "h3", "h4", "p"];

/* ---------- dibujo ---------- */
function dibujo(prod, i, vista){
  const I = LV.ilus;
  let svg = "";
  try {
    svg = I && I.dibujar ? I.dibujar(prod, i, vista ? { decorativa: true, vista } : { decorativa: true }) : "";
  } catch (e) { console.error("[LV.tarjeta] LV.ilus.dibujar falló:", prod.id, e); }
  if (!svg) return "";
  // la tarjeta es 4:5 y el dibujo 1:1: rellenar el lienzo sin deformar
  if (!/preserveAspectRatio/.test(svg)) svg = svg.replace(/<svg\b/, '<svg preserveAspectRatio="xMidYMid slice"');
  return svg;
}
/** ¿Qué se ve al pasar el ratón? {i, vista}
    Con varios colores: el siguiente color (cambio de color animado, se entiende a la primera).
    Con uno solo: la vista «combinada» de B8 (el objeto con algo que va a juego). */
function segunda(prod, i){
  if (prod.variantes.filter(v => v.c).length > 1) return { i: (i + 1) % prod.variantes.length, vista: null };
  const I = LV.ilus || {};
  try { if (typeof I.tieneVista === "function" && !I.tieneVista(prod, "combinada")) return null; } catch (e) {}
  return { i, vista: "combinada" };
}

/* ---------- marcado ---------- */
function precioHTML(prod){
  const U = LV.util;
  if (LV.datos.tieneDesde(prod)) {
    const min = Math.min(...Object.values(prod.precios));
    return `<span class="tarjeta__desde">desde</span> ${U.euros(min).replace(" ", "&nbsp;")}`;
  }
  const p = U.euros(prod.precio).replace(" ", "&nbsp;");
  return prod.porMetro ? `${p} <span class="tarjeta__unidad">el metro</span>` : p;
}
function etiquetaHTML(prod){
  const U = LV.util;
  if (prod.stock === "pocas") return `<span class="etiqueta tarjeta__etiqueta lv-pocas">Quedan pocas</span>`;
  if (prod.novedad) return `<span class="etiqueta etiqueta--mantequilla tarjeta__etiqueta">Novedad</span>`;
  if (prod.etiqueta) return `<span class="etiqueta tarjeta__etiqueta tarjeta__etiqueta--blanca">${U.esc(prod.etiqueta)}</span>`;
  return "";
}
function muestrasHTML(prod, idx, max){
  const U = LV.util, D = LV.datos;
  const vs = prod.variantes;
  if (prod.conColor && vs.length > 1) {
    const ver = vs.slice(0, max);
    const nombre = U.esc(prod.nombre);
    const botones = ver.map((v, i) => {
      const claro = U.esClaro(v.c) || v.c === "#EAF2F5";
      return `<button type="button" class="tarjeta__muestra${i >= 3 ? " tarjeta__muestra--extra" : ""}" role="radio" aria-checked="${i === idx}" tabindex="${i === idx ? 0 : -1}" data-i="${i}" aria-label="${U.esc(v.n)}" title="${U.esc(v.n)}"><span class="tarjeta__punto${claro ? " tarjeta__punto--claro" : ""}" style="${U.muestraCSS(v.c)}"></span></button>`;
    }).join("");
    const resto = vs.length - ver.length, restoEstrecho = vs.length - Math.min(3, ver.length);
    const plural = D.PLURALES[prod.tipoVar] || "colores";
    const mas = (n, cl) => n > 0 ? `<a class="tarjeta__mas ${cl}" href="${ENLACE_VERS(prod.id)}" aria-label="Ver los ${vs.length} ${plural} de ${nombre}">+${n}</a>` : "";
    return `<div class="tarjeta__muestras" role="radiogroup" aria-label="${U.esc(D.rotulo(prod.tipoVar))} de ${nombre}">${botones}${mas(resto, "tarjeta__mas--ancho")}${mas(restoEstrecho, "tarjeta__mas--estrecho")}</div>`;
  }
  const t = D.textoVersiones(prod);
  return t ? `<p class="tarjeta__versiones">${U.esc(t)}</p>` : "";
}

/**
 * Tarjeta de producto. Un único enlace (dibujo + nombre + precio); las muestras son botones aparte
 * que solo cambian el dibujo. Sin botón «Añadir» (DISENO §6).
 */
function html(prod, o = {}){
  if (!prod) return "";
  const U = LV.util, D = LV.datos;
  const { variante = 0, titulo = "h3", conMuestras = true, maxMuestras = 5 } = o;
  const idx = Math.min(Math.max(0, variante | 0), prod.variantes.length - 1);
  const h = NIVELES.includes(titulo) ? titulo : "h3";
  const lienzo = D.lienzo(prod);
  return `<article class="tarjeta" data-id="${U.esc(prod.id)}" data-v="${idx}" data-r>
<a class="tarjeta__enlace" href="${ENLACES_RUTA(prod.id)}">
<div class="tarjeta__lienzo" style="--lienzo:${lienzo}"><div class="tarjeta__capa tarjeta__capa--principal">${dibujo(prod, idx)}</div>${etiquetaHTML(prod)}</div>
<${h} class="tarjeta__nombre"><span>${U.esc(prod.nombre)}</span></${h}>
<p class="tarjeta__precio t-precio">${precioHTML(prod)}</p>
</a>
${conMuestras ? muestrasHTML(prod, idx, Math.max(1, maxMuestras)) : ""}
</article>`;
}

function rejilla(lista, { clase = "", opciones = {} } = {}){
  return `<div class="tarjeta-rejilla-marco"><div class="tarjeta-rejilla ${LV.util.esc(clase)}" data-r-grupo>${(lista || []).map(p => html(p, opciones)).join("")}</div></div>`;
}

function fila(lista, { titulo = "", id, entradilla = "", nivel = "h2", enlace = null, opciones = {} } = {}){
  const U = LV.util;
  const fid = id || U.uid("fila");
  const tid = `${fid}-titulo`;
  const hn = ["h2", "h3"].includes(nivel) ? nivel : "h2";
  const IC = LV.IC || {};
  const items = (lista || []).map(p => `<div class="tarjeta-fila__item" role="listitem">${html(p, { titulo: hn === "h2" ? "h3" : "h4", ...opciones })}</div>`).join("");
  const cab = titulo ? `<div class="tarjeta-fila__cab">
<div class="tarjeta-fila__textos"><${hn} class="tarjeta-fila__titulo" id="${tid}" data-r>${U.esc(titulo)}</${hn}>${entradilla ? `<p class="t-entradilla tarjeta-fila__entradilla" data-r>${U.esc(entradilla)}</p>` : ""}</div>
<div class="tarjeta-fila__botones">
<button type="button" class="boton boton--secundario tarjeta-fila__boton" data-fila="-1" aria-controls="${fid}-pista">${IC.flechaIzq || ""}<span>Anterior</span></button>
<button type="button" class="boton boton--secundario tarjeta-fila__boton" data-fila="1" aria-controls="${fid}-pista">${IC.flechaDer || ""}<span>Siguiente</span></button>
</div></div>` : "";
  const pie = enlace && enlace.href ? `<p class="tarjeta-fila__pie"><a class="boton boton--texto" href="${U.esc(enlace.href)}">${U.esc(enlace.texto || "Ver más")}</a></p>` : "";
  return `<section class="tarjeta-fila" id="${fid}"${titulo ? ` aria-labelledby="${tid}"` : ""}>
${cab}
<div class="tarjeta-fila__pista" id="${fid}-pista" role="list"${titulo ? ` aria-labelledby="${tid}"` : ""} data-r-grupo>${items}</div>
${pie}
</section>`;
}

/* ---------- comportamiento ---------- */
function cambiarCapa(lienzo, svg, clase){
  // fundido cruzado (M11): la capa nueva entra encima y la vieja se retira al terminar
  const nueva = document.createElement("div");
  nueva.className = `tarjeta__capa ${clase} tarjeta__capa--entra`;
  nueva.innerHTML = svg;
  const vieja = lienzo.querySelector(`.${clase}:not(.tarjeta__capa--sale)`);
  lienzo.insertBefore(nueva, lienzo.querySelector(".tarjeta__etiqueta"));
  requestAnimationFrame(() => requestAnimationFrame(() => nueva.classList.remove("tarjeta__capa--entra")));
  if (vieja) {
    vieja.classList.add("tarjeta__capa--sale");
    setTimeout(() => vieja.remove(), 420);
  }
}
function elegir(art, boton, enfocar){
  const prod = LV.datos.producto(art.dataset.id); if (!prod) return;
  const i = +boton.dataset.i;
  const grupo = boton.closest(".tarjeta__muestras");
  grupo.querySelectorAll(".tarjeta__muestra").forEach(b => {
    const si = b === boton;
    b.setAttribute("aria-checked", si ? "true" : "false");
    b.tabIndex = si ? 0 : -1;
  });
  if (enfocar) boton.focus();
  if (+art.dataset.v === i) return;
  art.dataset.v = i;
  elegidas.set(prod.id, i);
  const lienzo = art.querySelector(".tarjeta__lienzo");
  lienzo.querySelectorAll(".tarjeta__capa--segunda").forEach(c => c.remove());
  delete art.dataset.segunda;
  art.classList.remove("tarjeta--segunda");
  cambiarCapa(lienzo, dibujo(prod, i), "tarjeta__capa--principal");
}
function mostrarSegunda(art, si){
  if (!si) { art.classList.remove("tarjeta--segunda"); return; }
  const prod = LV.datos.producto(art.dataset.id); if (!prod) return;
  if (!art.dataset.segunda) {
    const s = segunda(prod, +art.dataset.v || 0);
    if (!s) { art.dataset.segunda = "no"; }
    else {
      const capa = document.createElement("div");
      capa.className = "tarjeta__capa tarjeta__capa--segunda";
      capa.innerHTML = dibujo(prod, s.i, s.vista);
      const lienzo = art.querySelector(".tarjeta__lienzo");
      lienzo.insertBefore(capa, lienzo.querySelector(".tarjeta__etiqueta"));
      art.dataset.segunda = "si";
      void capa.offsetWidth;            // para que la primera vez también se vea el fundido
    }
  }
  if (art.dataset.segunda === "si") art.classList.add("tarjeta--segunda");
}
function moverFila(boton){
  const sec = boton.closest(".tarjeta-fila"); if (!sec) return;
  const pista = sec.querySelector(".tarjeta-fila__pista"); if (!pista) return;
  if (boton.getAttribute("aria-disabled") === "true") return;
  const dir = +boton.dataset.fila || 1;
  pista.scrollBy({ left: dir * pista.clientWidth * 0.85, behavior: LV.util.reducido() ? "auto" : "smooth" });
}
function estadoFila(sec){
  const pista = sec.querySelector(".tarjeta-fila__pista"); if (!pista) return;
  const max = pista.scrollWidth - pista.clientWidth - 2;
  const [a, s] = [sec.querySelector('[data-fila="-1"]'), sec.querySelector('[data-fila="1"]')];
  if (a) a.setAttribute("aria-disabled", pista.scrollLeft <= 2 ? "true" : "false");
  if (s) s.setAttribute("aria-disabled", pista.scrollLeft >= max ? "true" : "false");
  sec.classList.toggle("tarjeta-fila--sin-scroll", max <= 0);
}

const montados = new WeakMap();
function montar(cont){
  if (!cont) return () => {};
  if (montados.has(cont)) { cont.querySelectorAll(".tarjeta-fila").forEach(estadoFila); return montados.get(cont); }
  const hover = window.matchMedia ? matchMedia("(hover: hover)") : { matches: false };
  const clic = e => {
    const b = e.target.closest(".tarjeta__muestra");
    if (b && cont.contains(b)) { e.preventDefault(); elegir(b.closest(".tarjeta"), b, false); return; }
    // la ficha se abre en el color que enseñaba la tarjeta (p. ej. tras buscar «medias negras»)
    const en = e.target.closest(".tarjeta__enlace");
    if (en && cont.contains(en)) { const art = en.closest(".tarjeta"); if (art && +art.dataset.v > 0) elegidas.set(art.dataset.id, +art.dataset.v); }
    const f = e.target.closest("[data-fila]");
    if (f && cont.contains(f)) moverFila(f);
  };
  const tecla = e => {
    const b = e.target.closest && e.target.closest(".tarjeta__muestra"); if (!b) return;
    const lista = [...b.closest(".tarjeta__muestras").querySelectorAll(".tarjeta__muestra")].filter(x => x.offsetParent !== null);
    let i = lista.indexOf(b), n = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % lista.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + lista.length) % lista.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = lista.length - 1;
    if (n == null) return;
    e.preventDefault();
    elegir(b.closest(".tarjeta"), lista[n], true);
  };
  const entra = e => {
    if (!hover.matches) return;
    const art = e.target.closest && e.target.closest(".tarjeta");
    if (art && !art.contains(e.relatedTarget)) mostrarSegunda(art, true);
  };
  const sale = e => {
    const art = e.target.closest && e.target.closest(".tarjeta");
    if (art && !art.contains(e.relatedTarget)) mostrarSegunda(art, false);
  };
  const foco = e => {
    const a = e.target.closest && e.target.closest(".tarjeta__enlace");
    if (!a) return;
    let visible = true; try { visible = a.matches(":focus-visible"); } catch (x) {}
    if (visible) mostrarSegunda(a.closest(".tarjeta"), true);
  };
  const desenfoca = e => {
    const a = e.target.closest && e.target.closest(".tarjeta__enlace");
    if (a) mostrarSegunda(a.closest(".tarjeta"), false);
  };
  const desplaza = e => {
    const p = e.target; if (p.classList && p.classList.contains("tarjeta-fila__pista")) estadoFila(p.closest(".tarjeta-fila"));
  };
  cont.addEventListener("click", clic);
  cont.addEventListener("keydown", tecla);
  cont.addEventListener("mouseover", entra);
  cont.addEventListener("mouseout", sale);
  cont.addEventListener("focusin", foco);
  cont.addEventListener("focusout", desenfoca);
  cont.addEventListener("scroll", desplaza, true);
  // seguro: si el contenedor ya no está en la página (quien lo montó no llamó a limpiar), se suelta solo
  const redim = () => { if (!cont.isConnected) { limpiar(); return; } cont.querySelectorAll(".tarjeta-fila").forEach(estadoFila); };
  window.addEventListener("resize", redim, { passive: true });
  requestAnimationFrame(redim);
  const limpiar = () => {
    cont.removeEventListener("click", clic); cont.removeEventListener("keydown", tecla);
    cont.removeEventListener("mouseover", entra); cont.removeEventListener("mouseout", sale);
    cont.removeEventListener("focusin", foco); cont.removeEventListener("focusout", desenfoca);
    cont.removeEventListener("scroll", desplaza, true); window.removeEventListener("resize", redim);
    montados.delete(cont);
  };
  montados.set(cont, limpiar);
  return limpiar;
}

const elegida = id => elegidas.has(id) ? elegidas.get(id) : null;

return Object.freeze({ html, rejilla, fila, montar, elegida });
})();
