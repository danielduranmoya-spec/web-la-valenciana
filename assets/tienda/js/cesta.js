/* =========================================================
   LA VALENCIANA v2 · cesta.js · PROPIETARIO: B6
   Panel lateral de la cesta (.panel) + mini-panel al añadir (.anadido).
   Contrato (ARQUITECTURA §4.11):
     LV.cesta.iniciar()            pinta en #capa-cesta (lo llama arranque.js)
     LV.cesta.abrir(origenEl?)     abre el panel; al cerrar, el foco vuelve a origenEl
     LV.cesta.cerrar()             cierra (devuelve el foco)
     LV.cesta.alternar(origenEl?)  abre o cierra
     LV.cesta.abierta() → bool
     LV.cesta.cerrarAviso()        cierra el mini-panel «Añadido»
   La cesta en sí es LV.tienda: aquí solo hay interfaz.
   ========================================================= */
window.LV = window.LV || {};
LV.cesta = (() => {
"use strict";

const T_DESHACER = 6000;   // «Quitado. Deshacer» visible 6 s
const T_AVISO = 6000;      // mini-panel 6 s (se pausa al pasar o enfocar)

let capa, velo, panel, cuerpo, pie, titulo, aviso;
let estaAbierta = false, origen = null, liberarFoco = null, tCierre = 0;
let quitado = null, tQuitado = 0;   // {k, idx, nombre}
let iniciado = false;

const U = () => LV.util;
const T = () => LV.tienda;
const ic = n => (LV.IC && LV.IC[n]) || "";
const esc = s => U().esc(s);
const euros = n => U().euros(n).replace(/\s€/, " €");
const nombreCorto = prod => String(prod.nombre).replace(/\s*\(metro\)$/i, "");
const version = l => String(l.textoVersion || "").replace(/ · /g, ", ");

function mini(prod, vi = 0){
  try { return LV.ilus.dibujar(prod, vi, { decorativa: true, lino: false }); }
  catch (e) { return ""; }
}

/* ---------------- marcado ---------------- */
function htmlEstructura(){
  const idT = "ces-titulo";
  return `
  <div class="ces-velo" data-ces="cerrar" hidden></div>
  <section class="panel" id="ces-panel" role="dialog" aria-modal="true" aria-labelledby="${idT}" hidden>
    <header class="ces-cab">
      <h2 class="ces-cab__titulo" id="${idT}">Su cesta</h2>
      <button type="button" class="ces-cerrar" data-ces="cerrar">${ic("cerrar")}<span>Cerrar</span></button>
    </header>
    <div class="ces-cuerpo" tabindex="-1"></div>
    <footer class="ces-pie"></footer>
  </section>
  <div class="anadido" role="region" aria-label="Producto añadido a su cesta" hidden></div>`;
}

function htmlEnvio(){
  const t = T(), falta = t.faltaEnvioGratis(), p = t.progresoEnvio(), gratis = falta <= 0;
  return `<div class="ces-envio${gratis ? " ces-envio--gratis" : ""}">
    <p class="ces-envio__txt">${gratis
      ? `${ic("check")}<span>Su pedido tiene envío gratis.</span>`
      : `<span>Le faltan <strong>${euros(falta)}</strong> para el envío gratis.</span>`}</p>
    <div class="ces-hilo" aria-hidden="true" style="--p:${p.toFixed(3)}">
      <span class="ces-hilo__base"></span>
      <span class="ces-hilo__lleno"></span>
      <span class="ces-hilo__guia"><span class="ces-hilo__nudo"></span></span>
    </div>
  </div>`;
}

function htmlCantidad(l){
  const p = l.prod, metros = p.porMetro, alMax = l.q >= p.max;
  const menos = metros ? "Quitar medio metro" : "Quitar una";
  const mas = metros ? "Añadir medio metro" : "Añadir una";
  return `<div class="ces-cant" role="group" aria-label="Cantidad de ${esc(nombreCorto(p))}">
    <button type="button" class="ces-cant__btn" data-ces="menos" aria-label="${menos}">${ic("menos")}</button>
    <span class="ces-cant__valor">${esc(metros ? U().num(l.q) + " m" : U().num(l.q))}</span>
    <button type="button" class="ces-cant__btn" data-ces="mas" aria-label="${mas}"${alMax ? ' aria-disabled="true"' : ""}>${ic("mas")}</button>
  </div>`;
}

function textoLimite(prod){
  return prod.porMetro ? "Para más de 50 metros, llámenos y le hacemos precio." : "Para más de 20 unidades, llámenos y le hacemos precio.";
}

function htmlLinea(l){
  const p = l.prod, url = LV.rutas.url.producto(p.id), v = version(l);
  return `<li class="ces-linea" data-k="${esc(l.k)}">
    <a class="ces-linea__mini" href="${url}" tabindex="-1" aria-hidden="true" style="background:${LV.datos.lienzo(p)}">${mini(p, l.vi)}</a>
    <div class="ces-linea__info">
      <h3 class="ces-linea__nombre"><a href="${url}">${esc(nombreCorto(p))}</a></h3>
      ${v ? `<p class="ces-linea__version">${esc(v)}</p>` : ""}
      <p class="ces-linea__ud">${euros(l.precioUd)} ${p.porMetro ? "el metro" : "la unidad"}</p>
      <div class="ces-linea__fila">
        ${htmlCantidad(l)}
        <p class="ces-linea__importe">${euros(l.importe)}</p>
      </div>
      <p class="ces-linea__limite" ${l.q >= p.max ? "" : "hidden"}>${ic("info")}<span>${textoLimite(p)} <a href="${U().telURL()}">${esc(LV.datos.TIENDA.tel)}</a></span></p>
      <button type="button" class="boton boton--texto ces-quitar" data-ces="quitar" aria-label="Quitar ${esc(nombreCorto(p))} de la cesta">Quitar</button>
    </div>
  </li>`;
}

function htmlQuitado(q){
  return `<li class="ces-quitado" data-quitado="${esc(q.k)}">
    <p><span>Quitado: ${esc(q.nombre)}.</span></p>
    <button type="button" class="boton boton--secundario ces-deshacer" data-ces="deshacer">Deshacer</button>
  </li>`;
}

function htmlRecos(){
  const recos = T().recomendaciones(2);
  if (!recos.length) return "";
  return `<section class="ces-recos" aria-labelledby="ces-recos-t">
    <h3 class="ces-recos__titulo" id="ces-recos-t">Le puede interesar</h3>
    <ul class="ces-recos__lista">${recos.map(p => {
      const url = LV.rutas.url.producto(p.id), elegir = LV.datos.hayQueElegir(p);
      const rot = p.variantes.length > 1 ? LV.datos.rotulo(p.tipoVar) : LV.datos.rotulo(p.tipoMedida);
      return `<li class="ces-reco">
        <a class="ces-reco__mini" href="${url}" tabindex="-1" aria-hidden="true" style="background:${LV.datos.lienzo(p)}">${mini(p, 0)}</a>
        <div class="ces-reco__info">
          <a class="ces-reco__nombre" href="${url}">${esc(nombreCorto(p))}</a>
          <span class="ces-reco__precio">${LV.datos.tieneDesde(p) ? "desde " : ""}${euros(p.precio)}</span>
        </div>
        ${elegir
          ? `<a class="boton boton--secundario ces-reco__btn" href="${url}" aria-label="Elegir ${esc(rot.toLowerCase())} de ${esc(nombreCorto(p))}">Elegir ${esc(rot.toLowerCase())}</a>`
          : `<button type="button" class="boton boton--secundario ces-reco__btn" data-ces="anadir" data-id="${esc(p.id)}" aria-label="Añadir ${esc(nombreCorto(p))} a la cesta">Añadir</button>`}
      </li>`;
    }).join("")}</ul>
  </section>`;
}

function htmlPago(){
  return `<div class="ces-pago">
    ${ic("info")}
    <p>Puede pagar con tarjeta o PayPal en la web: solo reservamos el importe y no se cobra hasta que comprobemos que tenemos todo. Si lo prefiere, envíenos el pedido por WhatsApp o por correo y pague al recoger o por Bizum.</p>
  </div>`;
}

/* En teléfono, «¿Dudas?» baja al cuerpo para que el pie fijo deje sitio a los artículos (rev. R1) */
function htmlDudasCuerpo(){
  return `<p class="ces-dudas-cuerpo"><a class="ces-pie__tel" href="${U().telURL()}">${ic("tel")}<span>¿Dudas? Llame al ${esc(LV.datos.TIENDA.tel).replace(/ /g, "\u00a0")}</span></a></p>`;
}

function htmlVacia(){
  const C = LV.datos.CATS;
  let dib = "";
  try { dib = LV.ilus.icono("costurero", "#E9B9C3", { decorativa: true, lino: false }); } catch (e) {}
  return `<div class="ces-vacia">
    <div class="ces-vacia__dibujo" aria-hidden="true">${dib}</div>
    <p class="ces-vacia__titulo">Su cesta está vacía.</p>
    <p class="ces-vacia__txt">Cuando vea algo que le guste, pulse «Añadir a la cesta» y lo guardaremos aquí.</p>
    <div class="ces-vacia__botones">
      <a class="boton boton--secundario boton--ancho" href="${LV.rutas.url.categoria("merceria")}">Ver la mercería</a>
      <a class="boton boton--secundario boton--ancho" href="${LV.rutas.url.categoria("complementos")}">Ver los complementos</a>
    </div>
  </div>`;
}

function htmlPie(){
  const t = T(), D = LV.datos.TIENDA;
  return `<div class="ces-total">
      <span class="ces-total__rot">Total (IVA incluido)</span>
      <span class="ces-total__cifra">${euros(t.subtotal())}</span>
    </div>
    <p class="ces-total__nota">${t.faltaEnvioGratis() <= 0 ? "Envío a casa gratis." : `Envío a casa ${euros(D.envio)}.`} Recogida en la tienda, gratis.</p>
    <a class="boton boton--primario boton--ancho boton--grande ces-pedir" href="${LV.rutas.url.pedido()}" data-ces="pedir">Hacer el pedido</a>
    <div class="ces-pie__fila">
      <button type="button" class="boton boton--texto" data-ces="cerrar">Seguir comprando</button>
      <a class="ces-pie__tel" href="${U().telURL()}">${ic("tel")}<span>¿Dudas? Llame al ${esc(D.tel).replace(/ /g, " ")}</span></a>
    </div>`;
}

/* ---------------- pintar ---------------- */
function pintar({ animarHilo = false } = {}){
  if (!panel) return;
  const t = T(), vacia = t.vacia();
  titulo.textContent = vacia ? "Su cesta" : `Su cesta (${t.articulos()})`;
  if (vacia && !quitado) {
    cuerpo.innerHTML = htmlVacia();
    pie.innerHTML = ""; pie.hidden = true;
  } else {
    const lineas = t.lista().map(htmlLinea);
    if (quitado) lineas.splice(Math.min(quitado.idx, lineas.length), 0, htmlQuitado(quitado));
    cuerpo.innerHTML = `${vacia ? "" : htmlEnvio()}
      <ul class="ces-lineas" aria-label="Artículos de su cesta">${lineas.join("")}</ul>
      ${vacia ? `<p class="ces-vacia__txt ces-vacia__txt--tras">Su cesta está vacía.</p>` : htmlPago() + htmlDudasCuerpo() + htmlRecos()}`;
    if (vacia) { pie.innerHTML = ""; pie.hidden = true; }
    else { pie.innerHTML = htmlPie(); pie.hidden = false; }
  }
  if (animarHilo) animarEnvio();
}

/** El pespunte de envío se cose desde 0 hasta el progreso actual (M19). */
function animarEnvio(desde){
  const h = cuerpo && cuerpo.querySelector(".ces-hilo"); if (!h) return;
  const p = h.style.getPropertyValue("--p");
  h.style.setProperty("--p", desde != null ? desde : 0);
  h.classList.add("ces-hilo--sin");
  void h.offsetWidth;
  h.classList.remove("ces-hilo--sin");
  requestAnimationFrame(() => requestAnimationFrame(() => h.style.setProperty("--p", p)));
}

/** Cambio de cantidad: actualiza solo lo necesario (no se pierde el foco). */
function actualizarLinea(k){
  const l = T().linea(k), li = cuerpo.querySelector(`.ces-linea[data-k="${CSS.escape(k)}"]`);
  if (!l || !li) { pintar(); return; }
  const p = l.prod;
  li.querySelector(".ces-cant__valor").textContent = p.porMetro ? U().num(l.q) + " m" : U().num(l.q);
  li.querySelector(".ces-linea__importe").textContent = euros(l.importe);
  const bMas = li.querySelector('[data-ces="mas"]');
  if (l.q >= p.max) bMas.setAttribute("aria-disabled", "true"); else bMas.removeAttribute("aria-disabled");
  li.querySelector(".ces-linea__limite").hidden = l.q < p.max;
  // barra de envío, totales y título
  const viejo = cuerpo.querySelector(".ces-envio");
  const hiloViejo = viejo && viejo.querySelector(".ces-hilo");
  const pAnterior = hiloViejo ? hiloViejo.style.getPropertyValue("--p") : 0;
  if (viejo) { viejo.outerHTML = htmlEnvio(); animarEnvio(pAnterior); }
  pie.innerHTML = htmlPie();
  titulo.textContent = `Su cesta (${T().articulos()})`;
}

/* ---------------- abrir / cerrar ---------------- */
function abrir(origenEl){
  if (!panel) iniciar();
  if (!panel) return;
  cerrarAviso();
  origen = (origenEl && origenEl.nodeType === 1) ? origenEl : (document.activeElement !== document.body ? document.activeElement : null);
  if (estaAbierta) { enfocarCerrar(); return; }
  clearTimeout(tCierre);
  estaAbierta = true;
  pintar({ animarHilo: true });
  velo.hidden = false; panel.hidden = false;
  capa.classList.add("ces--visible");
  void panel.offsetWidth;
  capa.classList.add("ces--abierta");
  try { U().fondoInerte(true, panel); } catch (e) {}
  liberarFoco = U().atraparFoco(panel, () => cerrar());
  enfocarCerrar();
  try { LV.mov && LV.mov.revelar && LV.mov.revelar(panel); } catch (e) {}
  document.querySelectorAll('[aria-controls="ces-panel"]').forEach(b => b.setAttribute("aria-expanded", "true"));
}
function enfocarCerrar(){
  const b = panel.querySelector(".ces-cerrar");
  try { b.focus({ preventScroll: true }); } catch (e) { b.focus(); }
}
function cerrar({ devolverFoco = true } = {}){
  if (!estaAbierta) return;
  estaAbierta = false;
  if (liberarFoco) { liberarFoco(); liberarFoco = null; }
  try { U().fondoInerte(false); } catch (e) {}
  capa.classList.remove("ces--abierta");
  document.querySelectorAll('[aria-controls="ces-panel"]').forEach(b => b.setAttribute("aria-expanded", "false"));
  clearTimeout(tCierre);
  tCierre = setTimeout(() => { if (!estaAbierta) { panel.hidden = true; velo.hidden = true; capa.classList.remove("ces--visible"); } }, 520);
  if (quitado) { quitado = null; clearTimeout(tQuitado); }
  if (devolverFoco) {
    let destino = origen && origen.isConnected ? origen : botonCabecera();
    if (destino) { try { destino.focus({ preventScroll: true }); } catch (e) {} }
  }
  origen = null;
}
const alternar = el => estaAbierta ? cerrar() : abrir(el);
const abierta = () => estaAbierta;
function botonCabecera(){
  return document.querySelector('#cabecera [aria-controls="ces-panel"], #cabecera .cab-cesta, #cabecera [data-abrir-cesta]');
}

/* ---------------- acciones dentro del panel ---------------- */
function alPulsar(e){
  const b = e.target.closest("[data-ces]"); if (!b || !capa.contains(b)) return;
  const acc = b.dataset.ces, li = b.closest(".ces-linea"), k = li && li.dataset.k;
  if (acc === "cerrar") { e.preventDefault(); cerrar(); return; }
  if (acc === "pedir") {                       // el enlace navega; el router enfoca el h1
    if (location.hash === LV.rutas.url.pedido()) { e.preventDefault(); cerrar(); LV.rutas.recargar && LV.rutas.recargar(); return; }
    cerrar({ devolverFoco: false }); return;
  }
  if (acc === "menos" || acc === "mas") {
    e.preventDefault();
    const l = T().linea(k); if (!l) return;
    if (acc === "mas" && l.q >= l.prod.max) {
      li.querySelector(".ces-linea__limite").hidden = false;
      U().anunciar(textoLimite(l.prod), true);
      return;
    }
    if (acc === "menos" && Math.round((l.q - l.prod.paso) * 100) / 100 < l.prod.min) { quitarLinea(k); return; }
    T().sumar(k, acc === "mas" ? 1 : -1);
    return;
  }
  if (acc === "quitar") { e.preventDefault(); quitarLinea(k); return; }
  if (acc === "deshacer") {
    e.preventDefault();
    const kq = quitado && quitado.k;
    quitado = null; clearTimeout(tQuitado);
    const l = T().deshacer();
    if (l) {
      U().anunciar(`Vuelve a estar en su cesta: ${nombreCorto(l.prod)}.`);
      enfocar(`.ces-linea[data-k="${CSS.escape(l.k || kq)}"] .ces-linea__nombre a`);
    } else pintar();
    return;
  }
  if (acc === "anadir") {
    e.preventDefault();
    const r = T().anadir(b.dataset.id, null, null, 1, b);
    if (r) {
      U().anunciar(`Añadido: ${nombreCorto(r.linea.prod)}. Su cesta tiene ${T().articulos()} ${T().articulos() === 1 ? "artículo" : "artículos"}.`);
      enfocar(`.ces-linea[data-k="${CSS.escape(r.linea.k)}"] .ces-linea__nombre a`);
      const li2 = cuerpo.querySelector(`.ces-linea[data-k="${CSS.escape(r.linea.k)}"]`);
      if (li2) li2.classList.add("ces-linea--nueva");
    }
  }
}
function quitarLinea(k){
  const lista = T().lista(), idx = lista.findIndex(x => x.k === k);
  const l = lista[idx]; if (!l) return;
  quitado = { k, idx, nombre: nombreCorto(l.prod) };
  clearTimeout(tQuitado);
  T().quitar(k);   // → evento «quitar» → pintar()
  enfocar(".ces-deshacer");
  U().anunciar(`Quitado: ${quitado.nombre}. Puede deshacerlo durante unos segundos.`);
  tQuitado = setTimeout(() => {
    const habiaFoco = cuerpo.contains(document.activeElement) && document.activeElement.matches(".ces-deshacer");
    quitado = null;
    if (estaAbierta) { pintar(); if (habiaFoco) enfocarSiguiente(); }
  }, T_DESHACER);
}
function enfocar(sel){
  requestAnimationFrame(() => {
    const el = panel.querySelector(sel);
    if (el) { try { el.focus({ preventScroll: false }); } catch (e) { el.focus(); } }
  });
}
function enfocarSiguiente(){
  const el = panel.querySelector(".ces-linea__nombre a") || panel.querySelector(".ces-vacia a") || panel.querySelector(".ces-cerrar");
  if (el) el.focus();
}

/* ---------------- mini-panel «Añadido a su cesta» ---------------- */
let avisoOrigen = null;
function mostrarAviso(det){
  if (!aviso || !det.linea) return;
  const l = det.linea, p = l.prod, n = det.articulos;
  avisoOrigen = det.origenEl && det.origenEl.nodeType === 1 ? det.origenEl : null;
  const partes = [version(l), U().textoCantidad(p, det.cantidad || l.q)].filter(Boolean).join(", ");
  aviso.innerHTML = `
    <div class="anadido__mini" aria-hidden="true" style="background:${LV.datos.lienzo(p)}">${mini(p, l.vi)}</div>
    <div class="anadido__texto">
      <p class="anadido__titulo">${ic("check")}<span>Añadido a su cesta</span></p>
      <p class="anadido__nombre">${esc(nombreCorto(p))}</p>
      ${partes ? `<p class="anadido__version">${esc(partes)}</p>` : ""}
      ${det.limitado ? `<p class="anadido__limite">${textoLimite(p)}</p>` : ""}
    </div>
    <div class="anadido__botones">
      <button type="button" class="boton boton--secundario" data-aviso="ver">Ver mi cesta (${n})</button>
      <button type="button" class="boton boton--texto" data-aviso="seguir">Seguir comprando</button>
    </div>
    <span class="anadido__tiempo" aria-hidden="true"></span>`;
  aviso.hidden = false;
  colocarAviso();
  requestAnimationFrame(colocarAviso);   // la cabecera puede encoger justo en este fotograma (scroll reciente)
  aviso.classList.remove("anadido--visible", "anadido--pausa");
  void aviso.offsetWidth;
  aviso.classList.add("anadido--visible");
  const barra = aviso.querySelector(".anadido__tiempo");
  barra.addEventListener("animationend", () => cerrarAviso(), { once: true });
  U().anunciar(`Añadido: ${nombreCorto(p)}. Su cesta tiene ${n} ${n === 1 ? "artículo" : "artículos"}.`);
  if (det.limitado) setTimeout(() => U().anunciar(textoLimite(p), true), 400);
}
/** Justo bajo la cabecera visible (fija, encogida o en su sitio). Se recoloca al hacer scroll
    mientras se ve, para no quedar nunca debajo de la cabecera que encoge (rev. R1). */
function colocarAviso(){
  if (!aviso || aviso.hidden) return;
  try {
    const cab = document.getElementById("cabecera"), barra = cab && cab.querySelector(".cab-barra");
    const r = cab ? cab.getBoundingClientRect() : null;
    const fija = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--alto-cab-actual")) || 0;
    const rb = barra && getComputedStyle(barra).position === "fixed" ? barra.getBoundingClientRect().bottom : 0;
    aviso.style.setProperty("--anadido-top", `${Math.round(Math.max(r ? r.bottom : 0, fija, rb, 0))}px`);
    // en escritorio el aviso cuelga del botón «Mi cesta» visible (cabecera grande o encogida) y no tapa el h1
    // (el de la cabecera grande sigue en el DOM aunque se haya ido hacia arriba: solo vale el que está a la vista)
    const boton = [...document.querySelectorAll("#cabecera .cab-cesta")].find(b => {
      if (!b.getClientRects().length || getComputedStyle(b).visibility === "hidden") return false;
      const rc = b.getBoundingClientRect(); return rc.top >= -1 && rc.bottom > 0 && rc.top < innerHeight;
    });
    if (boton) {
      const rc = boton.getBoundingClientRect();
      aviso.style.setProperty("--anadido-boton", `${Math.round(Math.max(rc.bottom, 0))}px`);
      aviso.style.setProperty("--anadido-boton-centro", `${Math.round(innerWidth - (rc.left + rc.width / 2))}px`);
    } else { aviso.style.removeProperty("--anadido-boton"); aviso.style.removeProperty("--anadido-boton-centro"); }
  } catch (e) {}
}
let pendColocar = false;
function alScrollAviso(){
  if (pendColocar || !aviso || aviso.hidden) return;
  pendColocar = true;
  requestAnimationFrame(() => { pendColocar = false; colocarAviso(); });
}

function cerrarAviso({ devolverFoco = false } = {}){
  if (!aviso || aviso.hidden) return;
  const teniaFoco = aviso.contains(document.activeElement);
  aviso.classList.remove("anadido--visible");
  aviso.classList.add("anadido--saliendo");
  setTimeout(() => { aviso.classList.remove("anadido--saliendo"); if (!aviso.classList.contains("anadido--visible")) { aviso.hidden = true; aviso.innerHTML = ""; } }, 360);
  if (teniaFoco || devolverFoco) {
    const d = avisoOrigen && avisoOrigen.isConnected ? avisoOrigen : document.getElementById("contenido");
    try { d && d.focus({ preventScroll: true }); } catch (e) {}
  }
}
function pausar(si){ if (aviso) aviso.classList.toggle("anadido--pausa", si); }

/* ---------------- iniciar ---------------- */
function iniciar(){
  if (iniciado) return;
  capa = document.getElementById("capa-cesta");
  if (!capa) { capa = document.createElement("div"); capa.id = "capa-cesta"; document.body.appendChild(capa); }
  capa.innerHTML = htmlEstructura();
  velo = capa.querySelector(".ces-velo");
  panel = capa.querySelector(".panel");
  cuerpo = panel.querySelector(".ces-cuerpo");
  pie = panel.querySelector(".ces-pie");
  titulo = panel.querySelector(".ces-cab__titulo");
  aviso = capa.querySelector(".anadido");
  iniciado = true;

  capa.addEventListener("click", alPulsar);
  aviso.addEventListener("click", e => {
    const b = e.target.closest("[data-aviso]"); if (!b) return;
    if (b.dataset.aviso === "ver") { const o = avisoOrigen; cerrarAviso(); abrir(o && o.isConnected ? o : botonCabecera()); }
    else cerrarAviso({ devolverFoco: true });
  });
  aviso.addEventListener("mouseenter", () => pausar(true));
  aviso.addEventListener("mouseleave", () => { if (!aviso.contains(document.activeElement)) pausar(false); });
  aviso.addEventListener("focusin", () => pausar(true));
  aviso.addEventListener("focusout", e => { if (!aviso.contains(e.relatedTarget)) pausar(false); });
  aviso.addEventListener("keydown", e => { if (e.key === "Escape") { e.preventDefault(); cerrarAviso({ devolverFoco: true }); } });

  document.addEventListener("lv:cesta-cambiada", e => {
    const d = e.detail || {};
    if (estaAbierta) {
      if (d.accion === "cambiar" && d.linea) {
        actualizarLinea(d.linea.k);
        U().anunciar(`${nombreCorto(d.linea.prod)}: ${d.linea.textoCantidad}. Total ${U().euros(T().subtotal())}.`);
      } else pintar();
      return;
    }
    if (d.accion === "anadir") {
      const desdePanel = d.origenEl && panel.contains(d.origenEl);
      if (!desdePanel) mostrarAviso(d);
    }
    if (d.accion === "vaciar") cerrarAviso();
  });
  document.addEventListener("lv:ruta-saliendo", () => { cerrar({ devolverFoco: false }); cerrarAviso(); });
  window.addEventListener("scroll", alScrollAviso, { passive: true });
  window.addEventListener("resize", alScrollAviso, { passive: true });
}

return Object.freeze({ iniciar, abrir, cerrar, alternar, abierta, cerrarAviso });
})();
