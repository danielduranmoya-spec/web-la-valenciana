/* =========================================================
   LA VALENCIANA v3 · vistas/portada-caja.js
   Portada: titular palabra a palabra + la caja de cartón original
   (tapa con lazo, papel de seda, objetos de la tienda y las tarjetas
   de Mercería y Complementos en abanico). Estilos: css/caja-original.css
   Sustituye al hero de la v2 (orden 10). El mosaico (orden 20) sigue.
   ========================================================= */
(() => {
"use strict";
const esc = s => (LV.util && LV.util.esc ? LV.util.esc(s) : String(s ?? ""));
const reducido = () => { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } };
const url = c => (LV.rutas && LV.rutas.url ? LV.rutas.url.categoria(c) : `#/c/${c}`);
const T = () => (LV.datos && LV.datos.TIENDA) || {};


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

    <div class="cv" aria-hidden="true">
      <div class="cv-sombra"></div><div class="cv-sombra-contacto"></div>
      <div class="cv-escala"><div class="cv-mundo">
        <div class="cv-cara cv-fondo"></div>
        <div class="cv-cara cv-seda"></div>
        <div class="cv-seda-atras"></div>
        <div class="cv-cara cv-trasera"><span class="cv-borde-carton"></span></div>
        <div class="cv-cara cv-izq"><span class="cv-borde-carton"></span></div>
        <div class="cv-cara cv-der"><span class="cv-borde-carton"></span></div>
        <div class="cv-objeto cv-carrete" style="--ox:-290px;--oy:-70px;--oz:20px;--or:-12deg;--oi:0;--ow:62px"><div class="cv-flota"><svg viewBox="0 0 60 80"><rect x="6" y="2" width="48" height="10" rx="3" fill="#C8A27A"/><rect x="6" y="68" width="48" height="10" rx="3" fill="#B48D64"/><rect x="12" y="12" width="36" height="56" fill="#9C5A6C"/><g stroke="#7E4556" stroke-width="1.6" opacity=".7"><path d="M12 20h36M12 28h36M12 36h36M12 44h36M12 52h36M12 60h36"/></g><path d="M12 16l36 4M12 58l36-6" stroke="#C98C9C" stroke-width="1.2"/><path d="M48 40c8 2 10 10 6 16" fill="none" stroke="#9C5A6C" stroke-width="1.6"/></svg></div></div><div class="cv-objeto cv-ovillo" style="--ox:290px;--oy:-50px;--oz:30px;--or:8deg;--oi:1;--ow:78px"><div class="cv-flota"><svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="34" fill="#E9BCC6"/><g fill="none" stroke="#C98C9C" stroke-width="2.2" stroke-linecap="round"><path d="M10 34c18-10 42-12 60 2"/><path d="M8 46c20-8 46-6 64 6"/><path d="M22 12c-6 18-4 42 10 60"/><path d="M40 6c-10 20-10 46 4 68"/><path d="M58 10c-12 16-16 40-6 62"/></g><circle cx="40" cy="40" r="34" fill="none" stroke="#9C5A6C" stroke-opacity=".35" stroke-width="2"/><path d="M70 52c8 6 6 14-2 18" fill="none" stroke="#C98C9C" stroke-width="2.2" stroke-linecap="round"/></svg></div></div><div class="cv-objeto cv-boton-obj" style="--ox:-300px;--oy:-215px;--oz:40px;--or:0deg;--oi:2;--ow:44px"><div class="cv-flota"><svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="27" fill="#EEECEF"/><circle cx="30" cy="30" r="27" fill="none" stroke="#C9C4CC" stroke-width="3"/><circle cx="30" cy="30" r="18" fill="none" stroke="#C9C4CC" stroke-width="2"/><g fill="#5E5864"><circle cx="24" cy="24" r="3.2"/><circle cx="36" cy="24" r="3.2"/><circle cx="24" cy="36" r="3.2"/><circle cx="36" cy="36" r="3.2"/></g><path d="M24 24l12 12M36 24L24 36" stroke="#9C5A6C" stroke-width="1.8"/></svg></div></div><div class="cv-objeto cv-tijeras" style="--ox:300px;--oy:-220px;--oz:40px;--or:-28deg;--oi:3;--ow:74px"><div class="cv-flota"><svg viewBox="0 0 90 60"><g fill="none" stroke="#4A4450" stroke-width="5"><circle cx="16" cy="16" r="10"/><circle cx="16" cy="44" r="10"/></g><path d="M24 22L86 40l-4 4L22 30z" fill="#C9C4CC" stroke="#5E5864" stroke-width="1.5"/><path d="M24 38L86 20l-4-4L22 30z" fill="#EEECEF" stroke="#5E5864" stroke-width="1.5"/><circle cx="40" cy="30" r="3" fill="#5E5864"/></svg></div></div><div class="cv-objeto cv-dedal" style="--ox:-170px;--oy:-365px;--oz:-20px;--or:10deg;--oi:4;--ow:40px"><div class="cv-flota"><svg viewBox="0 0 50 60"><path d="M8 54V24C8 10 16 4 25 4s17 6 17 20v30z" fill="#C9C4CC"/><rect x="5" y="50" width="40" height="8" rx="3" fill="#9C5A6C"/><g fill="#7E7684"><circle cx="17" cy="18" r="1.8"/><circle cx="25" cy="14" r="1.8"/><circle cx="33" cy="18" r="1.8"/><circle cx="15" cy="27" r="1.8"/><circle cx="23" cy="24" r="1.8"/><circle cx="31" cy="24" r="1.8"/><circle cx="37" cy="29" r="1.8"/><circle cx="17" cy="35" r="1.8"/><circle cx="25" cy="33" r="1.8"/><circle cx="33" cy="36" r="1.8"/><circle cx="20" cy="43" r="1.8"/><circle cx="29" cy="42" r="1.8"/></g><path d="M12 22c2-8 6-12 10-13" stroke="#fff" stroke-opacity=".7" stroke-width="2" fill="none"/></svg></div></div><div class="cv-objeto cv-cinta-metrica" style="--ox:175px;--oy:-370px;--oz:-20px;--or:-6deg;--oi:5;--ow:84px"><div class="cv-flota"><svg viewBox="0 0 100 70"><path d="M44 36h52v14H44z" fill="#F2D27A"/><g stroke="#4A4450" stroke-width="1.2"><path d="M52 36v5M60 36v8M68 36v5M76 36v8M84 36v5M92 36v8"/></g><circle cx="34" cy="38" r="30" fill="#E9BCC6"/><circle cx="34" cy="38" r="30" fill="none" stroke="#C98C9C" stroke-width="3"/><circle cx="34" cy="38" r="9" fill="#F6E4E7" stroke="#9C5A6C" stroke-width="2"/></svg></div></div><div class="cv-objeto cv-calcetin" style="--ox:0px;--oy:-380px;--oz:-40px;--or:14deg;--oi:6;--ow:52px"><div class="cv-flota"><svg viewBox="0 0 60 80"><path d="M14 2h28v40c0 6 2 10 8 14 8 6 8 20-4 22-6 1-12-2-18-6L10 62C4 58 2 52 6 46l8-12z" fill="#EEECEF" stroke="#C9C4CC" stroke-width="2"/><path d="M14 2h28v10H14z" fill="#C98C9C"/><path d="M14 16h28M14 20h28" stroke="#E9BCC6" stroke-width="2"/><path d="M36 70c4 3 10 5 14 4 4-2 6-8 4-12" fill="#E9BCC6"/></svg></div></div><div class="cv-objeto cv-aguja" style="--ox:-20px;--oy:-118px;--oz:95px;--or:30deg;--oi:7;--ow:70px"><div class="cv-flota"><svg viewBox="0 0 90 40"><path d="M6 20L76 18l8 2-8 2z" fill="#7E7684"/><ellipse cx="72" cy="20" rx="5" ry="1.6" fill="#F6E4E7"/><path d="M72 20c8-10 16 4 6 10S54 34 40 32 14 30 6 36" fill="none" stroke="#9C5A6C" stroke-width="1.8" stroke-linecap="round"/></svg></div></div>
        <a class="cv-tarjeta cv-m" href="${url("merceria")}" tabindex="-1"><span class="cv-t">Mercería</span><span class="cv-s">Hilos, lanas, botones y labores</span><span class="cv-ir">Entrar →</span></a>
        <a class="cv-tarjeta cv-c" href="${url("complementos")}" tabindex="-1"><span class="cv-t">Complementos</span><span class="cv-s">Medias, lencería y detalles</span><span class="cv-ir">Entrar →</span></a>
        <div class="cv-cara cv-frente"><span class="cv-borde-carton"></span><span class="cv-cinta"></span><span class="cv-datos-caja">lavalencianamerceria.com · lavalencianacomplementos.com<br>@_lavalenciana · 633 930 935</span></div>
        <div class="cv-seda-ala"></div>
        <div class="cv-bisagra"><div class="cv-cara cv-tapa"><img src="assets/img/marca/logo-grafito.svg" alt="" width="600" height="300"><span class="cv-cinta"></span><span class="cv-lazo"><i></i><i></i><b></b></span><div class="cv-tapa-dentro"></div><div class="cv-cara cv-solapa"></div></div></div>
      </div></div>
      <span class="cv-abriendo">Abriendo la caja…</span>
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
  const esc_ = hero.querySelector(".cv");
  const RM = reducido();

  /* coreografía de la caja original: se abre la tapa, sale el papel de
     seda y luego los objetos y las dos tarjetas en abanico.
     La segunda visita va más deprisa (lv-caja en localStorage). */
  const fases = ["cv-entrada", "cv-abierta", "cv-sale", "cv-abanico"];
  let visto = false; try { visto = localStorage.getItem("lv-caja") === "1"; } catch (e) {}
  const k = visto ? .45 : 1;
  esc_.style.setProperty("--t", k);
  const despues = (ms, fn) => st.tiempos.push(setTimeout(fn, ms));
  requestAnimationFrame(() => {
    hero.classList.add("vivo");
    if (RM || window.scrollY > 200){ esc_.classList.add(...fases); return; }
    despues(50, () => esc_.classList.add("cv-entrada"));
    despues(700 * k, () => esc_.classList.add("cv-abierta"));
    despues(1700 * k, () => esc_.classList.add("cv-sale"));
    despues(2500 * k, () => esc_.classList.add("cv-abanico"));
    try { localStorage.setItem("lv-caja", "1"); } catch (e) {}
  });

  /* estado abierto/cerrado al minuto */
  const iv = setInterval(() => {
    const p = hero.querySelector("[data-caja-estado]"); if (!p) return;
    const tmp = document.createElement("div"); tmp.innerHTML = estadoPildora(); p.replaceWith(tmp.firstElementChild);
  }, 60000);
  st.quitar.push(() => clearInterval(iv));

  /* probar.js / mostrarTodo: todo en su sitio */
  const yaTodo = () => { st.tiempos.forEach(clearTimeout); esc_.classList.add(...fases); hero.classList.add("vivo"); };
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
