/* =========================================================
   LA VALENCIANA v3 · vistas/portada-caja.js
   Portada: titular palabra a palabra + caja de cartón kraft en 3D
   que se abre y de la que salen Mercería y Complementos.
   Sustituye al hero de la v2 (orden 10). El mosaico (orden 20) sigue.
   ========================================================= */
(() => {
"use strict";
const esc = s => (LV.util && LV.util.esc ? LV.util.esc(s) : String(s ?? ""));
const reducido = () => { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } };
const url = c => (LV.rutas && LV.rutas.url ? LV.rutas.url.categoria(c) : `#/c/${c}`);
const T = () => (LV.datos && LV.datos.TIENDA) || {};

function pieza(icono, color, rot = 0){
  try { if (LV.ilus && LV.ilus.pieza) return `<svg viewBox="0 0 200 200" aria-hidden="true" focusable="false">${LV.ilus.pieza(icono, color, { rot })}</svg>`; } catch (e) {}
  return "";
}
const COL = n => (LV.datos && LV.datos.COL && LV.datos.COL[n]) || n;

const TITULAR = ["Hilos,", "botones,", "medias", "y", "abanicos,", "como", "en", "el", "mostrador."];

function estadoPildora(){
  let e = { abierto: false, corto: "Lunes a sábado, 10:00–14:00 y 17:00–20:00" };
  try { e = LV.util.estadoTienda(); } catch (x) {}
  return `<p class="caja-estado ${e.abierto ? "caja-estado--abierto" : ""}" data-caja-estado><span class="caja-estado__punto" aria-hidden="true"></span><span>${esc(e.corto || e.txt || "")}</span></p>`;
}

function html(){
  const palabras = TITULAR.map((p, i) => `<span class="caja-pal"><span style="--i:${i}">${esc(p)}</span></span>`).join(" ");
  const t = T();
  return `
<section class="caja-hero" aria-labelledby="caja-titular">
  <div class="caja-aura" aria-hidden="true"><span></span><span></span><span></span></div>
  <div class="contenedor caja-hero__rejilla">
    <div class="caja-hero__texto">
      <p class="caja-antetitulo">Mercería · Complementos · Cápsulas · Almendralejo</p>
      <h1 class="caja-titular" id="caja-titular" aria-label="Hilos, botones, medias y abanicos, como en el mostrador.">${palabras}</h1>
      <p class="caja-entradilla">Somos La Valenciana, la mercería de la Plaza de Espronceda desde el siglo&nbsp;XIX. Elija con calma: se lo preparamos para recoger o se lo enviamos a casa.</p>
      ${estadoPildora()}
      <div class="caja-botones">
        <a class="boton boton--primario boton--grande caja-boton" href="${url("merceria")}" data-iman><span>Ver Mercería</span><span class="caja-flecha" aria-hidden="true">→</span></a>
        <a class="boton boton--secundario boton--grande caja-boton" href="${url("complementos")}" data-iman><span>Ver Complementos</span><span class="caja-flecha" aria-hidden="true">→</span></a>
        <a class="boton boton--secundario boton--grande caja-boton" href="${url("capsulas")}" data-iman><span>Ver Cápsulas</span><span class="caja-flecha" aria-hidden="true">→</span></a>
      </div>
      <p class="caja-llame">¿Prefiere hablar con nosotros? Llame al <a href="${LV.util && LV.util.telURL ? LV.util.telURL() : "tel:+34924670839"}">${esc(t.tel || "924 67 08 39").replace(/ /g, "&nbsp;")}</a>.</p>
    </div>

    <div class="caja-escenario" aria-hidden="true">
      <div class="caja-escala">
        <div class="caja-sombra"></div>
        <div class="caja-mundo">
          <div class="caja-cara caja-fondo"></div>
          <div class="caja-cara caja-trasera"></div>
          <div class="caja-cara caja-izq"></div>
          <div class="caja-cara caja-der"></div>
          <div class="caja-seda"><span></span><span></span></div>
          <div class="caja-cara caja-frente">
            <span class="caja-cinta"></span>
            <span class="caja-sello">LV</span>
            <span class="caja-impreso">La Valenciana · Mercería y complementos · Almendralejo</span>
          </div>

          <a class="caja-tarjeta caja-tarjeta--m" href="${url("merceria")}" tabindex="-1">
            <span class="caja-tarjeta__in">
              <span class="caja-tarjeta__dib">${pieza("bobina", COL("Rosa empolvado"), -8)}</span>
              <span class="caja-tarjeta__t">Mercería</span>
              <span class="caja-tarjeta__s">Hilos, botones, lanas</span>
              <span class="caja-tarjeta__ir">Entrar →</span>
            </span>
          </a>
          <a class="caja-tarjeta caja-tarjeta--c" href="${url("complementos")}" tabindex="-1">
            <span class="caja-tarjeta__in">
              <span class="caja-tarjeta__dib">${pieza("abanico", COL("Camel"), 6)}</span>
              <span class="caja-tarjeta__t">Complementos</span>
              <span class="caja-tarjeta__s">Medias, pañuelos, bolsos</span>
              <span class="caja-tarjeta__ir">Entrar →</span>
            </span>
          </a>

          <a class="caja-tarjeta caja-tarjeta--k" href="${url("capsulas")}" tabindex="-1">
            <span class="caja-tarjeta__in">
              <span class="caja-tarjeta__dib">${pieza("kit", COL("Rosa empolvado"), 0)}</span>
              <span class="caja-tarjeta__t">Cápsulas</span>
              <span class="caja-tarjeta__s">Para empezar o regalar</span>
              <span class="caja-tarjeta__ir">Entrar →</span>
            </span>
          </a>
          <span class="caja-pieza caja-pieza--1"><span>${pieza("boton", COL("Camel"))}</span></span>
          <span class="caja-pieza caja-pieza--2"><span>${pieza("boton", COL("Burdeos"))}</span></span>
          <span class="caja-pieza caja-pieza--3"><span>${pieza("dedal", COL("Plata"))}</span></span>

          <div class="caja-bisagra"><div class="caja-tapa"><span class="caja-tapa__logo">La&nbsp;Valenciana</span><span class="caja-tapa__dentro"></span></div></div>
        </div>
      </div>
      <p class="caja-rotulo">Abriendo la caja…</p>
      <button type="button" class="caja-otra" tabindex="-1">↻ Abrirla otra vez</button>
    </div>
  </div>
</section>
<div class="cinta-envoltura" aria-hidden="true"><div class="cinta-marquesina">
  <div class="cinta-marquesina__pista">${("Hilos ✦ Botones ✦ Cremalleras ✦ Lanas ✦ Puntillas ✦ Medias ✦ Pañuelos ✦ Abanicos ✦ Bolsos ✦ Bisutería ✦ ").repeat(4)}</div>
</div></div>`;
}

let estado = null;
function desmontar(){
  if (!estado) return;
  estado.tiempos.forEach(clearTimeout);
  estado.quitar.forEach(f => { try { f(); } catch (e) {} });
  estado = null;
}

function montar(el){
  desmontar();
  const hero = el && el.querySelector(".caja-hero");
  if (!hero) return;
  const st = estado = { tiempos: [], quitar: [] };
  const esc_ = hero.querySelector(".caja-escenario");
  const escala = hero.querySelector(".caja-escala");
  const RM = reducido();

  /* tamaño: la escena necesita ~720 px de ancho a escala 1 */
  const ajustar = () => {
    if (!esc_) return;
    const w = esc_.clientWidth || 600;
    const s = Math.max(.48, Math.min(1, w / 780));
    escala.style.setProperty("--escala", s.toFixed(3));
  };
  ajustar();
  if (window.ResizeObserver){ const ro = new ResizeObserver(ajustar); ro.observe(esc_); st.quitar.push(() => ro.disconnect()); }

  /* coreografía */
  const fases = ["fase-entra", "fase-abierta", "fase-sale", "fase-abanico"];
  const despues = (ms, fn) => st.tiempos.push(setTimeout(fn, ms));
  const poner = f => esc_.classList.add(f);
  const reproducir = () => {
    st.tiempos.forEach(clearTimeout); st.tiempos = [];
    esc_.classList.remove(...fases, "fase-fin");
    void esc_.offsetWidth;
    if (RM){ esc_.classList.add(...fases, "fase-fin"); return; }
    despues(60, () => poner("fase-entra"));
    despues(1000, () => poner("fase-abierta"));
    despues(1900, () => poner("fase-sale"));
    despues(2700, () => poner("fase-abanico"));
    despues(3700, () => poner("fase-fin"));
  };
  requestAnimationFrame(() => { hero.classList.add("vivo"); reproducir(); });

  const otra = hero.querySelector(".caja-otra");
  otra && otra.addEventListener("click", reproducir);

  /* la caja sigue al puntero (solo ratón y sin movimiento reducido) */
  if (!RM && matchMedia("(hover: hover) and (pointer: fine)").matches){
    let raf = 0, px = 0, py = 0;
    const mover = e => {
      const r = hero.getBoundingClientRect();
      px = ((e.clientX - r.left) / r.width - .5) * 2;
      py = ((e.clientY - r.top) / r.height - .5) * 2;
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; esc_.style.setProperty("--px", px.toFixed(3)); esc_.style.setProperty("--py", py.toFixed(3)); });
    };
    const salir = () => { esc_.style.setProperty("--px", 0); esc_.style.setProperty("--py", 0); };
    hero.addEventListener("pointermove", mover);
    hero.addEventListener("pointerleave", salir);
    st.quitar.push(() => { hero.removeEventListener("pointermove", mover); hero.removeEventListener("pointerleave", salir); });
  }

  /* estado abierto/cerrado al minuto */
  const iv = setInterval(() => {
    const p = hero.querySelector("[data-caja-estado]"); if (!p) return;
    const tmp = document.createElement("div"); tmp.innerHTML = estadoPildora(); p.replaceWith(tmp.firstElementChild);
  }, 60000);
  st.quitar.push(() => clearInterval(iv));

  /* probar.js / mostrarTodo: todo en su sitio */
  const yaTodo = () => { st.tiempos.forEach(clearTimeout); esc_.classList.add(...fases, "fase-fin"); hero.classList.add("vivo"); };
  document.addEventListener("lv:mostrar-todo", yaTodo);
  st.quitar.push(() => document.removeEventListener("lv:mostrar-todo", yaTodo));
}

function registrar(){
  if (!LV.rutas || typeof LV.rutas.seccion !== "function") return false;
  LV.rutas.seccion("inicio", { id: "caja", orden: 10, html, montar, desmontar });
  return true;
}
if (!registrar()) document.addEventListener("DOMContentLoaded", registrar, { once: true });
})();
