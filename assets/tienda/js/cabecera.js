/* =========================================================
   LA VALENCIANA v2 · cabecera.js · PROPIETARIO: B1
   Cabecera (anuncio, buscador, logotipo, teléfono, «Mi cesta (n)»),
   navegación con megamenú (patrón disclosure, sin role=menu),
   menú móvil (<dialog> a pantalla completa), control de letra y
   cabecera fija que encoge al bajar (M18) sin tapar contenido.
   API: LV.ui.iniciar(), LV.ui.cerrarPaneles(), LV.ui.letra(valor?),
        LV.ui.modo() → "ancha" | "estrecha"
   Expone en <html> la variable CSS --alto-cab-actual (px de cabecera
   fija que tapa la parte de arriba de la ventana; 0 si no hay).
   ========================================================= */
window.LV = window.LV || {};
LV.ui = (() => {
"use strict";

/* ancho mínimo para la cabecera de escritorio según el tamaño de letra */
const UMBRAL = { normal: 1100, grande: 1280, muygrande: 1520 };
const ENCOGE = 120;            // px de scroll a partir de los que encoge (DISENO M18)
const RETARDO_HOVER = 150, RETARDO_SALIR = 300;
const LETRAS = [["normal", "Letra normal"], ["grande", "Letra grande"], ["muygrande", "Letra muy grande"]];

/* destacado de cada megamenú: subcategoría real del catálogo + bodegón de 3 piezas */
const DESTACADO = {
  merceria: { sub: "lanas", titulo: "Lanas para el invierno", frase: "Ovillos suaves, agujas de punto y ganchillos para tejer en casa.", boton: "Ver lanas y labores",
    piezas: [{ icono: "ovillo", color: "#B48AA3" }, { icono: "agujas-punto", color: "#E6CFAE" }, { icono: "ovillo", color: "#F1ECE4" }] },
  complementos: { sub: "medias", titulo: "Medias para el frío", frase: "Tupidas, transparentes y de descanso, en todas las tallas.", boton: "Ver medias y pantis",
    piezas: [{ icono: "media", color: "#24365C" }, { icono: "bufanda", color: "#7B2335" }, { icono: "calcetin", color: "#C9C9CC" }] },
  capsulas: { sub: "empezar", titulo: "Para su primera labor", frase: "Todo lo necesario en una caja, con un patrón sencillo explicado paso a paso.", boton: "Ver cápsulas para empezar",
    piezas: [{ icono: "kit", color: "#E9B9C3" }, { icono: "costurero", color: "#B98A55" }, { icono: "vale", color: "#F1ECE4" }] }
};

let cab, barra, U, D, IC;
let modoActual = "", encogida = false, fija = false;
let mmAbierto = null, mmPor = "", tHover = 0, tSalir = 0;
let dialogo = null, abridorMenu = null;
let iniciado = false;

const ic = n => (IC && IC[n]) || "";
const raiz = () => document.documentElement;
const textoActual = () => raiz().getAttribute("data-texto") || "normal";

/* ---------------- marcado ---------------- */
function htmlLetra(pref){
  return "";   /* sin control de tamaño de letra (lo pidió la tienda) */
  const id = `${pref}-letra`;
  const t = textoActual();
  return `<div class="letra" role="group" aria-labelledby="${id}">
    <span class="letra-rotulo" id="${id}">Letra</span>
    ${LETRAS.map(([v, nombre], i) => `<button type="button" class="letra-b letra-b--${i + 1}" data-texto="${v}" aria-pressed="${v === t}" aria-label="${nombre}"><span aria-hidden="true">A</span></button>`).join("")}
  </div>`;
}

function htmlBusca(id, clase, ejemplo = "Botones, lana, medias…"){
  /* el buscador es la ventana flotante (buscador-flotante.js) */
  return `<button type="button" class="cab-abre-buscador ${clase}" data-abre-buscador aria-haspopup="dialog" aria-controls="buscador">${ic("buscar")}<span>${ejemplo}</span><span class="cab-abre-buscador__pill">Buscar</span></button>`;
  return `<form class="cab-busca ${clase}" role="search" data-busca>
    <label class="visualmente-oculto" for="${id}">Buscar productos</label>
    <input class="cab-busca__campo" id="${id}" name="q" type="search" placeholder="${ejemplo}" autocomplete="off" enterkeyhint="search" spellcheck="false">
    <button class="boton boton--primario cab-busca__boton" type="submit">${ic("buscar")}<span>Buscar</span></button>
  </form>`;
}

const cuentaSR = n => `<span class="mm-n"><span class="visualmente-oculto">, </span>${n}<span class="visualmente-oculto"> artículos</span></span>`;

function htmlMegamenu(cat){
  const C = D.categoria(cat), subs = D.subcategorias(cat), d = DESTACADO[cat];
  const todo = {merceria:"Ver toda la mercería",complementos:"Ver todos los complementos",capsulas:"Ver todas las cápsulas"}[cat];
  return `<div class="megamenu megamenu--${cat}" id="mm-${cat}" hidden>
    <div class="contenedor rejilla mm-in">
      <div class="mm-enlaces">
        <p class="mm-intro">${U.esc(C.texto)}</p>
        <a class="boton boton--texto mm-todo" href="${LV.rutas.url.categoria(cat)}" data-nav>${todo}</a>
        <ul class="mm-lista">
          ${subs.map((s, i) => `<li style="--i:${i}"><a class="mm-enlace" href="${LV.rutas.url.categoria(cat, s.id)}" data-nav><span class="mm-nombre">${U.esc(s.n)}</span>${cuentaSR(s.cuenta)}</a></li>`).join("")}
        </ul>
      </div>
      <a class="mm-destacado" href="${LV.rutas.url.categoria(cat, d.sub)}">
        <span class="mm-lienzo" data-ilus="${cat}" style="--mm-lienzo:var(--c-${C.lienzo})"></span>
        <span class="mm-destacado__t">${U.esc(d.titulo)}</span>
        <span class="mm-destacado__frase">${U.esc(d.frase)}</span>
        <span class="boton boton--texto mm-destacado__ir">${U.esc(d.boton)}</span>
      </a>
    </div>
  </div>`;
}

function htmlMenuMovil(){
  const T = D.TIENDA;
  const pantallaCat = cat => {
    const C = D.categoria(cat), subs = D.subcategorias(cat);
    const todo = {merceria:"Ver toda la mercería",complementos:"Ver todos los complementos",capsulas:"Ver todas las cápsulas"}[cat];
    return `<div class="mnu-pantalla mnu-pantalla--sub" data-pantalla="${cat}" id="mnu-${cat}" hidden>
      <button type="button" class="mnu-volver" data-volver="${cat}">${ic("izquierda")}<span>Volver al menú</span></button>
      <h2 class="mnu-sub-t" id="mnu-${cat}-t">${U.esc(C.nombre)}</h2>
      <a class="boton boton--secundario boton--ancho mnu-todo" href="${LV.rutas.url.categoria(cat)}" data-nav>${todo}</a>
      <ul class="mnu-lista" aria-labelledby="mnu-${cat}-t">
        ${subs.map((s, i) => `<li style="--i:${i}"><a class="mnu-fila" href="${LV.rutas.url.categoria(cat, s.id)}" data-nav><span>${U.esc(s.n)}</span>${cuentaSR(s.cuenta)}</a></li>`).join("")}
      </ul>
    </div>`;
  };
  return `<dialog class="menu-movil" id="mnu" aria-labelledby="mnu-t">
    <div class="mnu-cab">
      <h2 class="mnu-titulo" id="mnu-t">Menú</h2>
      <button type="button" class="mnu-cerrar" data-cerrar-menu>${ic("cerrar")}<span>Cerrar</span></button>
    </div>
    <div class="mnu-cuerpo">
      <div class="mnu-pantalla" data-pantalla="raiz">
        <nav aria-label="Menú de la tienda">
          <ul class="mnu-lista">
            ${["merceria", "complementos", "capsulas"].map((cat, i) => `<li style="--i:${i}"><button type="button" class="mnu-fila mnu-fila--abre" data-abre="${cat}" data-cat="${cat}" aria-controls="mnu-${cat}"><span>${U.esc(D.categoria(cat).nombre)}</span>${ic("derecha")}</button></li>`).join("")}
            <li style="--i:3"><a class="mnu-fila" href="${LV.rutas.url.novedades()}" data-nav><span>Novedades</span></a></li>
            <li style="--i:3"><a class="mnu-fila" href="${LV.rutas.url.comoComprar()}" data-nav><span>Cómo comprar</span></a></li>
            <li style="--i:4"><a class="mnu-fila" href="${LV.rutas.url.colores()}" data-nav><span>Buscar por color</span></a></li>
            <li style="--i:4"><a class="mnu-fila" href="${LV.rutas.url.horario()}" data-nav><span>Horario</span></a></li>
            <li style="--i:5"><a class="mnu-fila" href="${LV.rutas.url.redes()}" data-nav><span>Redes sociales</span></a></li>
            <li style="--i:6"><a class="mnu-fila" href="${LV.rutas.url.visitanos()}" data-nav><span>Visítenos</span></a></li>
          </ul>
        </nav>
        <div class="mnu-extra">
          ${htmlLetra("mnu")}
          <a class="boton boton--secundario boton--ancho" href="${U.telURL()}">${ic("tel")}<span>Llamar a la tienda</span></a>
          <a class="boton boton--secundario boton--ancho" href="${U.whatsURL()}" target="_blank" rel="noopener">${ic("whats")}<span>Escribir por WhatsApp</span></a>
          <div class="mnu-horario">
            <p class="mnu-estado" data-estado></p>
            <p>De lunes a sábado,<br>de 10:00&nbsp;a&nbsp;14:00 y de 17:00&nbsp;a&nbsp;20:00.<br>Domingos y festivos, cerrado.</p>
            <p>${U.esc(T.calle)}, ${U.esc(T.ciudad)}</p>
          </div>
        </div>
      </div>
      ${pantallaCat("merceria")}
      ${pantallaCat("complementos")}
      ${pantallaCat("capsulas")}
    </div>
  </dialog>`;
}

function htmlCabecera(){
  const T = D.TIENDA;
  return `<div class="cab-anuncio">
    <div class="contenedor cab-anuncio__in">
      <p class="cab-anuncio__txt">Envío gratis desde 50&nbsp;€. Pague con tarjeta o pídalo por WhatsApp: <a href="${U.whatsURL()}" target="_blank" rel="noopener">633&nbsp;930&nbsp;935</a></p>
      ${htmlLetra("cab")}
    </div>
  </div>
  <div class="cab-barra">
    <div class="contenedor cab-barra__in">
      <button type="button" class="cab-boton cab-menu" aria-haspopup="dialog" aria-controls="mnu">${ic("menu")}<span>Menú</span></button>
      ${htmlBusca("cab-q", "cab-busca--barra")}
      <a class="cab-logo" href="${LV.rutas.url.inicio()}">
        <span class="cab-logo__nombre">La Valenciana</span>
        <span class="cab-logo__lema">Mercería y complementos en Almendralejo</span>
      </a>
      <div class="cab-acciones">
        <a class="cab-tel" href="${U.telURL()}">${ic("tel")}<span><span class="visualmente-oculto">Llamar al </span>${T.tel.replace(/ /g, "&nbsp;")}</span></a>
        <button type="button" class="cab-boton cab-buscar-btn" data-abre-buscador aria-haspopup="dialog" aria-controls="buscador">${ic("buscar")}<span>Buscar</span></button>
        <button type="button" class="cab-boton cab-cesta" aria-haspopup="dialog" aria-controls="ces-panel" aria-expanded="false">${ic("cesta")}<span class="cab-cesta__largo">Mi cesta</span><span class="cab-cesta__corto">Cesta</span> <span class="cab-cesta__n" data-n="0">0</span><span class="visualmente-oculto"> artículos</span></button>
      </div>
      <nav class="cab-nav" aria-label="Principal">
        <ul class="cab-nav__lista">
          ${["merceria", "complementos", "capsulas"].map(cat => `<li class="cab-nav__item" data-mm="${cat}">
            <button type="button" class="cab-nav__raiz" aria-expanded="false" aria-controls="mm-${cat}" data-cat="${cat}"><span>${U.esc(D.categoria(cat).nombre)}</span>${ic("abajo")}</button>
            ${htmlMegamenu(cat)}
          </li>`).join("")}
          <li class="cab-nav__item cab-nav__item--extra2"><a class="cab-nav__enlace" href="${LV.rutas.url.comoComprar()}" data-nav><span>Cómo comprar</span></a></li>
          <li class="cab-nav__item cab-nav__item--extra"><a class="cab-nav__enlace" href="${LV.rutas.url.horario()}" data-nav><span>Horario</span></a></li>
          <li class="cab-nav__item cab-nav__item--extra"><a class="cab-nav__enlace" href="${LV.rutas.url.redes()}" data-nav><span>Redes sociales</span></a></li>
          <li class="cab-nav__item cab-nav__item--extra2"><a class="cab-nav__enlace" href="${LV.rutas.url.visitanos()}" data-nav><span>Visítenos</span></a></li>
        </ul>
      </nav>
    </div>
  </div>
  ${htmlMenuMovil()}`;
}

/* ---------------- tamaño de letra ---------------- */
function letra(valor){
  if (valor === undefined) return textoActual();
  if (!UMBRAL[valor]) valor = "normal";
  if (valor === "normal") raiz().removeAttribute("data-texto"); else raiz().setAttribute("data-texto", valor);
  U.guardar("lv-texto", valor);
  U.$$(".letra-b", cab).forEach(b => b.setAttribute("aria-pressed", String(b.dataset.texto === valor)));
  evaluarModo();
  medir();
  document.dispatchEvent(new CustomEvent("lv:letra-cambiada", { detail: { texto: valor } }));
  U.anunciar(LETRAS.find(l => l[0] === valor)[1]);
  return valor;
}

/* ---------------- modo ancha / estrecha y cabecera fija ---------------- */
function evaluarModo(){
  const m = innerWidth >= UMBRAL[textoActual()] ? "ancha" : "estrecha";
  if (m === modoActual) return;
  modoActual = m;
  cerrarPaneles(false);
  if (m === "ancha" && dialogo && dialogo.open) cerrarMenu(false, true);
  cab.classList.toggle("cab--ancha", m === "ancha");
  cab.classList.toggle("cab--estrecha", m === "estrecha");
  encoger(false, true);
  alScroll();
}

function ponerAltoActual(px){ raiz().style.setProperty("--alto-cab-actual", `${Math.round(px)}px`); }

function medir(){
  if (!barra) return;
  cab.style.setProperty("--cab-barra-h", `${barra.offsetHeight}px`);
  ponerAltoActual(fija || encogida ? barra.offsetHeight : 0);
}

function encoger(si, sinAnim){
  if (si === encogida) return;
  if (si){
    // fija el hueco de la cabecera completa para que el contenido no salte
    cab.style.height = `${cab.offsetHeight}px`;
    encogida = true;
    cab.classList.add("cab--encogida");
    if (!sinAnim){ barra.classList.remove("cab-barra--entra"); void barra.offsetWidth; barra.classList.add("cab-barra--entra"); }
  } else {
    encogida = false;
    cab.classList.remove("cab--encogida", "cab--busca-abierta", "cab-barra--entra");
    barra.classList.remove("cab-barra--entra");
    cab.style.height = "";
    const b = U.$(".cab-buscar-btn", cab); if (b) b.setAttribute("aria-expanded", "false");
  }
  medir();
}

function alScroll(){
  const y = window.scrollY || 0;
  const puedeFijar = innerHeight >= 500;          // móvil apaisado: no fijar (WCAG 2.4.11 / inv-7)
  if (modoActual === "estrecha"){
    if (fija !== puedeFijar){ fija = puedeFijar; cab.classList.toggle("cab--fija", fija); }
    cab.classList.toggle("cab--sombra", fija && y > 4);
    medir();
    return;
  }
  if (fija){ fija = false; cab.classList.remove("cab--fija"); }
  cab.classList.remove("cab--sombra");
  if (!puedeFijar){ encoger(false, true); return; }
  if (!encogida && y > ENCOGE) encoger(true);
  else if (encogida && y < ENCOGE - 40) encoger(false);   // histéresis: sin parpadeos
}

/* ---------------- megamenú (disclosure) ---------------- */
function pintarDestacado(panel, cat){
  const hueco = U.$("[data-ilus]", panel);
  if (!hueco || hueco.dataset.pintado) return;
  const d = DESTACADO[cat], C = D.categoria(cat), lienzo = `var(--c-${C.lienzo})`;
  let svg = "";
  try {
    if (LV.ilus && typeof LV.ilus.bodegon === "function" && LV.ilus.tipos && LV.ilus.tipos().length){
      // x, y = centro de la pieza en el lienzo 480 × 300; escala 1 = 200 unidades
      const pos = [{ x: 112, y: 158, rot: -10, escala: 0.82 }, { x: 250, y: 132, rot: 12, escala: 0.9 }, { x: 384, y: 170, rot: -6, escala: 0.7 }];
      svg = LV.ilus.bodegon(d.piezas.map((p, i) => ({ ...p, ...pos[i] })), { lienzo, ancho: 480, alto: 300, alt: "" });
    } else if (LV.ilus && typeof LV.ilus.icono === "function"){
      svg = LV.ilus.icono(d.piezas[0].icono, d.piezas[0].color, { lienzo });
    }
  } catch (e) { console.warn("[LV.ui] no se pudo dibujar el destacado del megamenú", e); }
  if (svg) hueco.innerHTML = svg;
  hueco.dataset.pintado = "1";
}

function abrirMM(cat, por){
  clearTimeout(tSalir); clearTimeout(tHover);
  if (mmAbierto === cat){ if (por === "clic") mmPor = "clic"; return; }
  if (mmAbierto) cerrarMM(false, true);
  const li = U.$(`[data-mm="${cat}"]`, cab), panel = U.$(".megamenu", li), btn = U.$(".cab-nav__raiz", li);
  pintarDestacado(panel, cat);
  panel.hidden = false;
  void panel.offsetWidth;
  panel.classList.add("megamenu--abierto");
  btn.setAttribute("aria-expanded", "true");
  li.classList.add("cab-nav__item--abierto");
  mmAbierto = cat; mmPor = por;
  if (LV.mov && LV.mov.revelar) { try { LV.mov.revelar(panel); } catch (e) {} }
}

function cerrarMM(devolverFoco, inmediato){
  clearTimeout(tHover); clearTimeout(tSalir);
  if (!mmAbierto) return;
  const cat = mmAbierto;
  const li = U.$(`[data-mm="${cat}"]`, cab), panel = U.$(".megamenu", li), btn = U.$(".cab-nav__raiz", li);
  panel.classList.remove("megamenu--abierto");
  btn.setAttribute("aria-expanded", "false");
  li.classList.remove("cab-nav__item--abierto");
  mmAbierto = null; mmPor = "";
  const ocultar = () => { if (mmAbierto !== cat) panel.hidden = true; };
  if (inmediato) ocultar(); else setTimeout(ocultar, 260);
  if (devolverFoco) btn.focus();
}

function montarMegamenu(){
  U.$$(".cab-nav__item[data-mm]", cab).forEach(li => {
    const cat = li.dataset.mm, btn = U.$(".cab-nav__raiz", li);
    btn.addEventListener("click", () => {
      if (mmAbierto === cat) cerrarMM(false);
      else abrirMM(cat, "clic");
    });
    // Por petición del cliente, Mercería y Complementos se despliegan SOLO al pulsar (no al pasar el ratón).
    // Tab fuera del panel lo cierra
    li.addEventListener("focusout", e => {
      if (mmAbierto === cat && e.relatedTarget && !li.contains(e.relatedTarget)) cerrarMM(false);
    });
    // flechas izquierda/derecha entre las raíces (opcional, inv-7)
    btn.addEventListener("keydown", e => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const raices = U.$$(".cab-nav__raiz, .cab-nav__enlace", cab);
      const i = raices.indexOf(btn), j = (i + (e.key === "ArrowRight" ? 1 : -1) + raices.length) % raices.length;
      e.preventDefault(); raices[j].focus();
    });
  });
  // clic fuera
  document.addEventListener("pointerdown", e => {
    if (mmAbierto && !e.target.closest(`[data-mm="${mmAbierto}"]`)) cerrarMM(false);
    if (cab.classList.contains("cab--busca-abierta") && !e.target.closest(".cab-busca--barra, .cab-buscar-btn")) cerrarBuscaFlotante(false);
  });
  // Esc
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    if (mmAbierto){ e.preventDefault(); cerrarMM(true); }
    else if (cab.classList.contains("cab--busca-abierta")){ e.preventDefault(); cerrarBuscaFlotante(true); }
  });
}

/* ---------------- buscador ---------------- */
function montarBuscadores(){
  return;   /* los botones de buscar abren la ventana flotante (buscador-flotante.js) */
  U.$$("[data-busca]", cab).forEach(f => {
    f.addEventListener("submit", e => {
      e.preventDefault();
      const campo = U.$("input", f), q = campo.value.trim();
      if (!q){ campo.focus(); U.anunciar("Escriba lo que busca, por ejemplo: botones."); return; }
      cerrarPaneles(false);
      LV.rutas.ir(LV.rutas.url.buscar(q));
    });
  });
  const btn = U.$(".cab-buscar-btn", cab);
  btn.addEventListener("click", () => {
    if (cab.classList.contains("cab--busca-abierta")) cerrarBuscaFlotante(true);
    else {
      cerrarMM(false);
      cab.classList.add("cab--busca-abierta");
      btn.setAttribute("aria-expanded", "true");
      setTimeout(() => { const c = U.$("#cab-q", cab); if (c) c.focus(); }, 30);
    }
  });
}
function cerrarBuscaFlotante(devolverFoco){
  if (!cab.classList.contains("cab--busca-abierta")) return;
  cab.classList.remove("cab--busca-abierta");
  const btn = U.$(".cab-buscar-btn", cab);
  btn.setAttribute("aria-expanded", "false");
  if (devolverFoco) btn.focus();
}

/* ---------------- menú móvil (<dialog>) ---------------- */
function irPantalla(nombre, focoEn){
  U.$$(".mnu-pantalla", dialogo).forEach(p => {
    const es = p.dataset.pantalla === nombre;
    p.hidden = !es;
    p.classList.toggle("mnu-pantalla--entra", es);
  });
  const cuerpo = U.$(".mnu-cuerpo", dialogo); if (cuerpo) cuerpo.scrollTop = 0;
  if (focoEn) focoEn.focus();
}

function abrirMenu(boton){
  if (!dialogo || dialogo.open) return;
  abridorMenu = boton || null;
  cerrarMM(false);
  irPantalla("raiz");
  actualizarEstado();
  try { dialogo.showModal(); } catch (e) { dialogo.setAttribute("open", ""); }
  raiz().classList.add("lv-bloqueo");
  void dialogo.offsetWidth;
  dialogo.classList.add("menu-movil--abierto");
  U.$$(".cab-menu", cab).forEach(b => b.setAttribute("aria-expanded", "true"));
  const c = U.$("[data-cerrar-menu]", dialogo); if (c) c.focus();
}

function cerrarMenu(devolverFoco = true, inmediato = false){
  if (!dialogo || !dialogo.open) return;
  dialogo.classList.remove("menu-movil--abierto");
  U.$$(".cab-menu", cab).forEach(b => b.setAttribute("aria-expanded", "false"));
  const fin = () => {
    if (dialogo.classList.contains("menu-movil--abierto")) return;
    try { dialogo.close(); } catch (e) { dialogo.removeAttribute("open"); }
    if (!U.$("dialog[open]")) raiz().classList.remove("lv-bloqueo");
    if (devolverFoco && abridorMenu && abridorMenu.isConnected) abridorMenu.focus();
  };
  if (inmediato) fin(); else setTimeout(fin, U.reducido() ? 260 : 380);
}

function montarMenu(){
  dialogo = U.$("#mnu", cab);
  U.$(".cab-menu", cab).addEventListener("click", e => abrirMenu(e.currentTarget));
  dialogo.addEventListener("cancel", e => { e.preventDefault(); cerrarMenu(true); });
  dialogo.addEventListener("click", e => {
    if (e.target.closest("[data-cerrar-menu]")) { cerrarMenu(true); return; }
    const abre = e.target.closest("[data-abre]");
    if (abre){ const p = U.$(`#mnu-${abre.dataset.abre}`, dialogo); irPantalla(abre.dataset.abre, U.$(".mnu-volver", p)); return; }
    const volver = e.target.closest("[data-volver]");
    if (volver){ irPantalla("raiz", U.$(`[data-abre="${volver.dataset.volver}"]`, dialogo)); return; }
    const a = e.target.closest("a[href]");
    if (a){
      // al elegir un destino, el menú se cierra; el router enfoca el h1
      const h = a.getAttribute("href");
      if (h.startsWith("#/")) cerrarMenu(h === location.hash, h !== location.hash);
    }
  });
}

/* ---------------- cesta ---------------- */
function pintarContador(n, latir){
  U.$$(".cab-cesta__n", cab).forEach(el => {
    el.textContent = String(n);
    el.dataset.n = String(n);
    if (latir){
      if (LV.mov && typeof LV.mov.latido === "function") { try { LV.mov.latido(el); } catch (e) {} }
      else if (el.animate) {
        el.animate(U.reducido()
          ? [{ opacity: 1 }, { opacity: .35 }, { opacity: 1 }]
          : [{ transform: "scale(1)" }, { transform: "scale(1.3)" }, { transform: "scale(1)" }],
          { duration: U.reducido() ? 600 : 400, easing: "cubic-bezier(.34,1.56,.64,1)" });
      }
    }
  });
}

/* ---------------- estado de la tienda (texto del menú móvil) ---------------- */
function actualizarEstado(){
  if (!cab) return;
  let e = null; try { e = U.estadoTienda(); } catch (x) {}
  U.$$("[data-estado]", cab).forEach(p => {
    if (!e) { p.textContent = ""; return; }
    p.textContent = e.txt + ".";
    p.classList.toggle("mnu-estado--abierto", !!e.abierto);
  });
}

/* ---------------- rutas ---------------- */
function marcarSeccion(d){
  const p = (d && d.params) || {};
  const cat = p.cat || (p.prod && p.prod.cat) || null;
  U.$$("[data-cat]", cab).forEach(b => {
    if (cat && b.dataset.cat === cat) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current");
  });
  const q = d && d.vista === "buscar" ? (p.q || "") : "";
  U.$$(".cab-busca__campo", cab).forEach(c => { if (document.activeElement !== c) c.value = q; });
}

/* ---------------- API ---------------- */
function cerrarPaneles(devolverFoco = false){
  if (!cab) return;
  cerrarMM(devolverFoco);
  cerrarBuscaFlotante(false);
  cerrarMenu(devolverFoco, true);
}

function iniciar(){
  if (iniciado) return;
  cab = document.getElementById("cabecera");
  if (!cab) return;
  U = LV.util; D = LV.datos; IC = LV.IC;
  iniciado = true;
  cab.classList.add("cab");
  cab.innerHTML = htmlCabecera();
  barra = U.$(".cab-barra", cab);

  // letra (las dos copias: cabecera y menú móvil)
  cab.addEventListener("click", e => {
    const b = e.target.closest(".letra-b");
    if (b) letra(b.dataset.texto);
  });
  U.$(".cab-cesta", cab).addEventListener("click", e => {
    cerrarPaneles(false);
    if (LV.cesta && typeof LV.cesta.abrir === "function") LV.cesta.abrir(e.currentTarget);
  });
  montarMegamenu();
  montarBuscadores();
  montarMenu();

  // contador
  try { if (LV.tienda && LV.tienda.articulos) pintarContador(LV.tienda.articulos(), false); } catch (e) {}
  document.addEventListener("lv:cesta-cambiada", e => {
    const d = e.detail || {};
    const n = typeof d.articulos === "number" ? d.articulos : (LV.tienda && LV.tienda.articulos ? LV.tienda.articulos() : 0);
    pintarContador(n, d.accion === "anadir");
  });
  document.addEventListener("lv:ruta-saliendo", () => cerrarPaneles(false));
  document.addEventListener("lv:ruta-cambiada", e => marcarSeccion(e.detail));

  // fija / encoge
  evaluarModo();
  let pend = false;
  window.addEventListener("scroll", () => {
    if (pend) return; pend = true;
    requestAnimationFrame(() => { pend = false; alScroll(); });
  }, { passive: true });
  window.addEventListener("resize", () => { evaluarModo(); alScroll(); medir(); }, { passive: true });
  if (window.ResizeObserver) new ResizeObserver(() => medir()).observe(barra);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(medir).catch(() => {});
  barra.addEventListener("animationend", () => barra.classList.remove("cab-barra--entra"));
  actualizarEstado();
  setInterval(actualizarEstado, 60000);
  medir();
}

return { iniciar, cerrarPaneles, letra, modo: () => modoActual, abrirMenu, cerrarMenu };
})();
