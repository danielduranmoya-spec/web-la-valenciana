/* =========================================================
   LA VALENCIANA v2 · vistas/portada-secciones.js · PROPIETARIO: B3
   Secciones editoriales de la portada (DISENO §7.1, 3-7):
     30 destacados  «Lo que más nos piden» (carrusel con tarjetas de B4)
     40 encargo     banda rosa «¿No encuentra el color o la medida?»
     50 historia    cronología cosida con el scroll (M17)
     55 cita        voz del mostrador
     60 comprar     cómo comprar en 3 pasos
     70 visitenos   mapa ilustrado + horario + estado abierto/cerrado
   Además expone LV.ed (ayudas internas de B3 que también usa paginas.js:
   mapa(), estado(), horarioHTML(), contactoHTML()). No las use nadie más.
   ========================================================= */
window.LV = window.LV || {};
LV.ed = (() => {
"use strict";

const U = () => LV.util, D = () => LV.datos;
const ic = n => (LV.IC && LV.IC[n]) || "";
const esc = s => LV.util.esc(s);
const nb = s => String(s).replace(/ (?=\d)/g, "&nbsp;").replace(/(\d) /g, "$1&nbsp;");   // 924&nbsp;67&nbsp;08&nbsp;39

/* ---------------- estado de la tienda (texto de DISENO §10) ---------------- */
function estado(fecha = new Date()){
  let e = { abierto:false, txt:"" };
  try { e = U().estadoTienda(fecha); } catch (err) { return { abierto:false, txt:"Consulte el horario.", corto:"Horario" }; }
  // la etiqueta ya dice «Abierto ahora» / «Cerrado ahora»: la frase de al lado no lo repite
  if (e.abierto) return { abierto:true, txt:`Cierra hoy a las ${e.hasta}.`, corto:"Abierto ahora" };
  const resto = String(e.txt || "").replace(/^Cerrado ahora\.?\s*/, "");
  return { abierto:false, txt: resto ? resto + "." : "Consulte el horario.", corto:"Cerrado ahora" };
}
function estadoHTML(){
  const e = estado();
  return `<p class="ed-estado ${e.abierto ? "ed-estado--abierto" : ""}" data-ed-estado>
    <span class="etiqueta ${e.abierto ? "etiqueta--salvia" : "etiqueta--borde"}">${ic("reloj")}${esc(e.corto)}</span>
    <span class="ed-estado__txt">${esc(e.txt)}</span></p>`;
}
/** Refresca los estados abierto/cerrado dentro de el cada minuto. Devuelve la función que lo para. */
function vigilarEstado(el){
  const pintar = () => U().$$("[data-ed-estado]", el).forEach(p => { p.outerHTML = estadoHTML(); });
  const t = setInterval(pintar, 60000);
  return () => clearInterval(t);
}

/** Respaldo: si B7 no revela un .rev (el observador no lo ve con clip-path al 100 %), lo revelamos al verse su padre. */
function respaldoRev(el){
  if (!el || !("IntersectionObserver" in window)) return () => {};
  const revs = U().$$(".rev", el);
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    const r = e.target.__edRev;
    setTimeout(() => { if (r.isConnected && !r.classList.contains("in")) r.classList.add("in"); }, 900);
  }), { threshold: .2 });
  revs.forEach(r => { const padre = r.parentElement; if (!padre) return; padre.__edRev = r; io.observe(padre); });
  return () => io.disconnect();
}

/* ---------------- horario en tabla, agrupando días iguales ---------------- */
function horarioHTML(){
  let sem = [];
  try { sem = U().horarioSemana(); } catch (e) { sem = []; }
  const hoyFestivo = (() => { try { const a = U().ahoraMadrid(); return D().TIENDA.festivos.includes(a.fecha); } catch (e) { return false; } })();
  const grupos = [];
  sem.forEach(d => {
    const g = grupos[grupos.length - 1];
    if (g && g.texto === d.texto) { g.hasta = d; g.hoy = g.hoy || d.hoy; }
    else grupos.push({ desde:d, hasta:d, texto:d.texto, hoy:d.hoy, cerrado:!d.tramos.length });
  });
  const nombre = g => {
    if (g.cerrado && g.desde.d === 0 && g.hasta.d === 0) return "Domingos y festivos";
    return g.desde === g.hasta ? g.desde.dia : `${g.desde.dia} a ${g.hasta.dia.toLowerCase()}`;
  };
  const filas = grupos.map(g => {
    const esHoy = hoyFestivo ? g.cerrado : g.hoy;
    return `<tr class="${esHoy ? "ed-horario__hoy" : ""}"><th scope="row">${esc(nombre(g))}${esHoy ? ` <span class="ed-horario__marca">(hoy)</span>` : ""}</th>
      <td>${g.cerrado ? "Cerrado" : esc(g.texto).replace(/ y /, "<br>y ")}</td></tr>`;
  }).join("");
  return `<table class="ed-horario"><caption class="visualmente-oculto">Horario de la tienda</caption><tbody>${filas}</tbody></table>`;
}

/* ---------------- enlaces de contacto ---------------- */
function contactoHTML(){
  const T = D().TIENDA;
  return `<ul class="ed-contacto">
    <li><a href="${U().telURL()}">${ic("tel")}<span><span class="ed-contacto__que">Teléfono</span>${nb(esc(T.tel))}</span></a></li>
    <li><a href="${U().whatsURL()}" target="_blank" rel="noopener">${ic("whats")}<span><span class="ed-contacto__que">WhatsApp</span>${nb(esc(T.whatsTxt))}</span></a></li>
    <li><a href="mailto:${esc(T.correo)}">${ic("correo")}<span><span class="ed-contacto__que">Correo</span><span class="ed-contacto__largo">${esc(T.correo)}</span></span></a></li>
  </ul>`;
}

/* ---------------- mapa ilustrado de la Plaza de Espronceda ----------------
   SVG propio (sin iframe). Colores por clase CSS (tokens), en portada.css.
   R2: rehecho como plano a línea fina, en el estilo de las ilustraciones:
   papel rosa velo, manzanas irregulares de casco antiguo con sus parcelas
   en trazo fino, la plaza en lino rosa con enlosado, árboles y fuente a
   línea, y la tienda rellena en ciruela con el marcador del carrete.
   Calles sin nombre a propósito: no inventamos callejero. */
let nMapa = 0;
const MANZANAS = [
  "M-10 -10H140L136 92L138 172L-10 176Z",                 // noroeste
  "M164 -10H318L318 88L160 94Z",                           // norte (la de la tienda)
  "M342 -10H490V186L344 192Z",                             // noreste
  "M-10 198L138 194L134 270L110 370H-10Z",                 // suroeste
  "M158 270L318 264L298 370H134Z",                         // sur
  "M346 214L490 208V370H322Z"                              // sureste
];
const PARCELAS = [
  "M-10 60H138", "M88 60V174", "M40 -10V60", "M-10 120H88",
  "M196 92.6V40", "M276 89.6V40", "M162 40H318", "M318 40H342",
  "M344 96H490", "M400 -10V96", "M446 96V188", "M400 96V190",
  "M-10 262H136", "M70 196V370", "M70 312H-10",
  "M200 268L188 370", "M252 266L236 370", "M146 320H310",
  "M338 290H490", "M410 210V370", "M410 318H490"
];
function mapa({ grande = false } = {}){
  const id = `ed-mapa-${++nMapa}`;
  // árboles a línea alrededor de la plaza (copa + tronco visto desde arriba)
  const arboles = [[176,124],[216,121],[268,119],[310,120],[174,236],[220,238],[268,236],[312,233],[172,180],[314,176]]
    .map(([x,y],i) => `<g class="ed-mapa__arbol" transform="translate(${x} ${y})"><circle r="${i%3 ? 8 : 9.5}"/><path d="M-4 0a4 4 0 0 1 8 0"/></g>`).join("");
  // enlosado de la plaza: retícula fina recortada a la plaza
  const losas = Array.from({length: 10}, (_, i) => `<path d="M${158 + i*18} 96V270"/>`).join("") + Array.from({length: 9}, (_, i) => `<path d="M150 ${112 + i*18}H340"/>`).join("");
  const PLAZA = "M162 108L326 102L332 252L156 258Z";
  return `<figure class="ed-mapa con-lino rev${grande ? " ed-mapa--grande" : ""}">
  <svg viewBox="0 0 480 360" role="img" aria-labelledby="${id}-t" preserveAspectRatio="xMidYMid slice">
    <title id="${id}-t">Mapa ilustrado: La Valenciana está en la Plaza de Espronceda, número 2, en Almendralejo.</title>
    <defs><clipPath id="${id}-p"><path d="${PLAZA}"/></clipPath></defs>
    <rect class="ed-mapa__fondo" width="480" height="360"/>
    <g class="ed-mapa__manzanas">${MANZANAS.map(d => `<path d="${d}"/>`).join("")}</g>
    <g class="ed-mapa__parcelas">${PARCELAS.map(d => `<path d="${d}"/>`).join("")}</g>
    <path class="ed-mapa__plaza" d="${PLAZA}"/>
    <g class="ed-mapa__losas" clip-path="url(#${id}-p)">${losas}</g>
    <path class="ed-mapa__plaza-borde" d="M168 114L320 108L326 246L162 252Z"/>
    <g class="ed-mapa__fuente" transform="translate(244 180)"><circle r="20"/><circle r="13"/><circle r="3"/></g>
    ${arboles}
    <text class="ed-mapa__rotulo-plaza" x="244" y="222" text-anchor="middle">Plaza de Espronceda</text>
    <g class="ed-mapa__norte" transform="translate(448 330)"><circle r="14"/><path d="M0 -10L4 2H-4Z"/><path class="ed-mapa__norte-sur" d="M0 10L4 2H-4Z"/><text y="-18" text-anchor="middle">N</text></g>
    <g class="ed-mapa__tienda">
      <path class="ed-mapa__local" d="M236 40H276V89.6L236 91.1Z"/>
      <path class="ed-mapa__guia" d="M276 52H330"/>
      <g class="ed-mapa__cartel" transform="translate(330 38)">
        <rect width="118" height="28" rx="2"/>
        <text x="59" y="19" text-anchor="middle">La Valenciana</text>
      </g>
      <g class="ed-mapa__pin" transform="translate(256 92)">
        <ellipse class="ed-mapa__onda" cx="0" cy="1" rx="14" ry="5"/>
        <ellipse class="ed-mapa__pin-sombra" cx="3" cy="2" rx="10" ry="3.5"/>
        <g class="ed-mapa__pin-cae">
          <path class="ed-mapa__pin-gota" d="M0 0 C-4 -9 -16 -18 -16 -32 A16 16 0 0 1 16 -32 C16 -18 4 -9 0 0 Z"/>
          <g class="ed-mapa__carrete" transform="translate(0 -32)">
            <rect x="-7" y="-9" width="14" height="3" rx="1"/><rect x="-7" y="6" width="14" height="3" rx="1"/>
            <rect class="ed-mapa__carrete-hilo" x="-5" y="-6" width="10" height="12"/>
          </g>
        </g>
      </g>
    </g>
  </svg>
  <figcaption class="ed-mapa__pie t-pequeno">Plaza de Espronceda, 2. Almendralejo.</figcaption>
</figure>`;
}

const comoLlegar = (clase = "boton--primario") =>
  `<a class="boton ${clase}" href="${esc(D().TIENDA.mapa)}" target="_blank" rel="noopener">${ic("mapa")}<span>Cómo llegar<span class="visualmente-oculto"> (se abre en Google Maps)</span></span></a>`;
const llamar = (clase = "boton--secundario") => `<a class="boton ${clase}" href="${U().telURL()}">${ic("tel")}<span>Llamar a la tienda</span></a>`;
const whats = (clase = "boton--primario boton--grande", texto = "Escribir por WhatsApp", msg = "") =>
  `<a class="boton ${clase}" href="${U().whatsURL(msg)}" target="_blank" rel="noopener">${ic("whats")}<span>${esc(texto)}<span class="visualmente-oculto"> (se abre WhatsApp)</span></span></a>`;

/* =================================================================
   SECCIONES DE LA PORTADA
   ================================================================= */
const R = () => LV.rutas;
let limpiar = [];
const alSalir = f => limpiar.push(f);

/* ---- 30 · Lo que más nos piden ---- */
function tarjetaHTML(p){
  try { if (LV.tarjeta && LV.tarjeta.html) return LV.tarjeta.html(p, { titulo:"h3" }); } catch (e) { console.error("[B3] LV.tarjeta.html falló", e); }
  return `<article class="ed-tarjeta-sup"><a href="${R().url.producto(p.id)}"><h3>${esc(p.nombre)}</h3></a><p>${U().euros(p.precio)}</p></article>`;
}
function destacadosHTML(){
  const lista = (D().DESTACADOS || []).map(id => D().producto(id)).filter(Boolean);
  if (!lista.length) return "";
  const id = U().uid("ed-dest");
  return `<section class="ed-dest seccion" aria-labelledby="${id}">
  <div class="contenedor ed-dest__rejilla">
    <div class="ed-dest__cabeza" data-r>
      <h2 id="${id}">Lo que más nos piden</h2>
      <p class="ed-dest__frase">Los artículos que más salen del mostrador.</p>
      <a class="boton boton--texto" href="${R().url.novedades()}">Ver novedades</a>
    </div>
    <div class="ed-dest__mandos" data-r data-r-retardo="150">
      <button type="button" class="boton boton--secundario ed-dest__boton" data-ed-carril="-1" aria-controls="${id}-carril">${ic("flechaIzq")}<span>Anterior</span></button>
      <button type="button" class="boton boton--secundario ed-dest__boton" data-ed-carril="1" aria-controls="${id}-carril">${ic("flechaDer")}<span>Siguiente</span></button>
    </div>
    <ul class="ed-carril" id="${id}-carril" data-r-grupo aria-label="Lo que más nos piden: ${lista.length} artículos">
      ${lista.map((p, i) => `<li class="ed-carril__item">${tarjetaHTML(p)}</li>`).join("")}
    </ul>
  </div>
</section>`;
}
function montarDestacados(el){
  if (!el) return;
  // la sección se crea de nuevo en cada visita a la portada: al salir se sueltan sus escuchas (antes quedaba un «resize» por visita)
  try { const q = LV.tarjeta && LV.tarjeta.montar && LV.tarjeta.montar(el); if (typeof q === "function") alSalir(q); } catch (e) { console.error(e); }
  const carril = U().$(".ed-carril", el); if (!carril) return;
  const sec = U().$(".ed-dest", el);
  const botones = U().$$("[data-ed-carril]", el);
  // sangrado a la derecha: lo que va del borde del contenedor al borde de la ventana
  const medir = () => {
    const c = U().$(".ed-dest__rejilla", el); if (!c) return;
    const r = c.getBoundingClientRect();
    const sangre = Math.max(0, document.documentElement.clientWidth - r.right);
    sec.style.setProperty("--ed-sangre", sangre + "px");
    estadoBotones();
  };
  const paso = () => {
    const it = carril.querySelector(".ed-carril__item"); if (!it) return carril.clientWidth * .8;
    const gap = parseFloat(getComputedStyle(carril).columnGap) || 0;
    const visibles = Math.max(1, Math.floor((carril.clientWidth + gap) / (it.offsetWidth + gap)) - 1);
    return visibles * (it.offsetWidth + gap);
  };
  const estadoBotones = () => {
    const max = carril.scrollWidth - carril.clientWidth - 2;
    botones.forEach(b => {
      const fin = +b.dataset.edCarril < 0 ? carril.scrollLeft <= 2 : carril.scrollLeft >= max;
      b.setAttribute("aria-disabled", fin ? "true" : "false");
    });
  };
  el.addEventListener("click", e => {
    const b = e.target.closest("[data-ed-carril]"); if (!b || b.getAttribute("aria-disabled") === "true") return;
    carril.scrollBy({ left: +b.dataset.edCarril * paso(), behavior: U().reducido() ? "auto" : "smooth" });
  });
  let t = 0;
  carril.addEventListener("scroll", () => { cancelAnimationFrame(t); t = requestAnimationFrame(estadoBotones); }, { passive:true });
  window.addEventListener("resize", medir);
  alSalir(() => window.removeEventListener("resize", medir));
  medir();
  setTimeout(medir, 400);   // tras fuentes / transición
}

/* ---- 40 · Encargo por WhatsApp (la única banda rosa de la portada) ---- */
function encargoHTML(){
  const T = D().TIENDA, id = U().uid("ed-enc");
  let metro = "";
  try { if (LV.ilus && LV.ilus.pieza) metro = `<svg class="ed-encargo__metro" viewBox="0 0 200 200" aria-hidden="true" focusable="false">${LV.ilus.pieza("metro", "#F2D45C")}</svg>`; } catch (e) { metro = ""; }
  return `<section class="ed-encargo seccion seccion--rosa" aria-labelledby="${id}">
  <div class="contenedor rejilla ed-encargo__rejilla">
    <div class="ed-encargo__texto" data-r>
      <h2 id="${id}">¿No encuentra el color o la medida?</h2>
      <p>Escríbanos y se lo buscamos. A veces lo tenemos en la tienda y aún no está en la web.</p>
    </div>
    <div class="ed-encargo__accion" data-r data-r-retardo="180">
      ${whats("boton--primario boton--grande", "Escribir por WhatsApp", "Hola, busco un artículo que no encuentro en la web: ")}
      <p class="ed-encargo__tel">o llame al <a href="${U().telURL()}">${nb(esc(T.tel))}</a></p>
    </div>
    ${metro ? `<div class="ed-encargo__dibujo" data-r="escala" data-r-retardo="300">${metro}</div>` : ""}
  </div>
</section>`;
}

/* ---- 50 · Historia con cronología cosida (M17) ---- */
const HITOS = [
  ["Siglo XIX", "Un comerciante de Enguera abre la tienda y le da nombre."],
  ["1892", "Rogelio Triviño menciona La Valenciana en su libro «Resquemores»."],
  ["1940", "La familia Díaz se pone detrás del mostrador."],
  ["2007", "Finalista de los premios Extremadura Emprendedora por su constancia empresarial."],
  ["2009", "Renovamos la tienda sin perder el trato de siempre."],
  ["Hoy", "Cuarta generación, y ahora también en internet."]
];
function historiaHTML(){
  const id = U().uid("ed-his"), m = U().uid("ed-cos");
  return `<section class="ed-historia seccion" aria-labelledby="${id}">
  <div class="contenedor">
    <div class="ed-historia__cabeza" data-r>
      <h2 id="${id}">Una tienda de Almendralejo con acento de Enguera</h2>
      <p class="ed-historia__texto">Un comerciante de Enguera (Valencia) abrió esta mercería en el siglo XIX; de ahí el nombre. Desde 1940 la lleva la familia Díaz, hoy ya en su cuarta generación con Cándido Díaz Navia.</p>
    </div>
    <div class="ed-costura">
      <svg class="ed-costura__svg" aria-hidden="true" focusable="false">
        <defs><mask id="${m}" maskUnits="userSpaceOnUse"><path class="ed-costura__mascara" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/></mask></defs>
        <path class="ed-costura__guia"/>
        <path class="ed-costura__hilo" mask="url(#${m})"/>
        <path class="ed-costura__tenso"/>
        <path class="ed-costura__aux"/>
        <g class="ed-costura__aguja"><g class="ed-costura__aguja-in">
          <path class="ed-costura__metal" d="M-4 0C-4-2.6-2.4-3.4 0-3.4L58-1.1C62.5-.6 66-.2 70 0 66 .2 62.5.6 58 1.1L0 3.4C-2.4 3.4-4 2.6-4 0Z"/>
          <path class="ed-costura__brillo" d="M4-1.6 52-.6"/>
          <rect class="ed-costura__ojo" x="2" y="-1.1" width="11" height="2.2" rx="1.1"/>
        </g></g>
      </svg>
      <ol class="ed-costura__lista">
        ${HITOS.map(([a, t], i) => `<li class="ed-hito ed-hito--${i % 2 ? "der" : "izq"}" data-r>
          <span class="ed-hito__boton" aria-hidden="true"><span></span></span>
          <div class="ed-hito__cuerpo"><p class="ed-hito__anio t-anio">${esc(a)}</p><p class="ed-hito__txt">${esc(t)}</p></div>
        </li>`).join("")}
      </ol>
    </div>
  </div>
</section>`;
}
/* La aguja cose de un lado a otro: el hilo baja junto a cada fecha y cruza
   la sección entera por debajo hasta la siguiente, que está en el otro lado.
   El avance va con el scroll; la aguja entra y sale de la tela mientras cose. */
function montarHistoria(el){
  const caja = el && U().$(".ed-costura", el); if (!caja) return;
  const svg = U().$(".ed-costura__svg", caja);
  const guia = U().$(".ed-costura__guia", svg), hilo = U().$(".ed-costura__hilo", svg);
  const mascara = U().$(".ed-costura__mascara", svg), tenso = U().$(".ed-costura__tenso", svg);
  const aux = U().$(".ed-costura__aux", svg);
  const aguja = U().$(".ed-costura__aguja", svg), agujaIn = U().$(".ed-costura__aguja-in", svg);
  const hitos = U().$$(".ed-hito", caja);
  const quieto = U().reducido() || !("requestAnimationFrame" in window);
  let L = 0, marcas = [], pedido = 0, ultimo = -1;

  function trazar(){
    const r = caja.getBoundingClientRect();
    const w = r.width, h = r.height;
    svg.setAttribute("viewBox", `0 0 ${w.toFixed(1)} ${h.toFixed(1)}`);
    const pts = hitos.map(li => {
      const b = U().$(".ed-hito__boton", li).getBoundingClientRect(), lr = li.getBoundingClientRect();
      return { x: b.left + b.width / 2 - r.left, y: b.top + b.height / 2 - r.top, fondo: lr.bottom - r.top };
    });
    if (!pts.length) return;
    const f = n => n.toFixed(1);
    let d = `M${f(pts[0].x)} 0V${f(pts[0].y)}`;
    const trozos = [d];
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      const cruce = a.fondo + Math.max(12, (b.y - a.fondo) * .45);     // cruza por el hueco entre las dos fechas
      const R = Math.max(6, Math.min(44, Math.abs(b.x - a.x) / 4, cruce - a.y - 4, b.y - cruce - 4));
      const dir = b.x > a.x ? 1 : -1;
      d += `V${f(cruce - R)}Q${f(a.x)} ${f(cruce)} ${f(a.x + dir * R)} ${f(cruce)}H${f(b.x - dir * R)}Q${f(b.x)} ${f(cruce)} ${f(b.x)} ${f(cruce + R)}V${f(b.y)}`;
      trozos.push(d);
    }
    const ult = pts[pts.length - 1];
    d += `V${f(Math.min(h, ult.fondo + 24))}`;
    [guia, hilo, mascara, tenso].forEach(p => p.setAttribute("d", d));
    L = hilo.getTotalLength();
    marcas = trozos.map(t => { aux.setAttribute("d", t); return aux.getTotalLength(); });
    aux.setAttribute("d", "");
    mascara.style.strokeDasharray = `${L} ${L + 20}`;
    ultimo = -1;
  }

  function pintar(av){
    const hecho = av * L;
    mascara.style.strokeDashoffset = (L - hecho).toFixed(1);
    hitos.forEach((li, i) => li.classList.toggle("ed-hito--cosido", hecho >= marcas[i] - 2));
    caja.classList.toggle("ed-costura--completa", av >= .999);
    caja.classList.toggle("ed-costura--empieza", av <= .001);
    if (!L) return;
    const p = hilo.getPointAtLength(hecho), q = hilo.getPointAtLength(Math.min(L, hecho + 2));
    const p0 = hecho > 2 ? hilo.getPointAtLength(hecho - 2) : p;
    const ang = Math.atan2(q.y - p0.y, q.x - p0.x) * 180 / Math.PI;
    const fase = Math.sin(hecho / 11);                   // entra y sale de la tela
    aguja.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${ang.toFixed(1)})`);
    agujaIn.setAttribute("transform", `translate(${(-8 + fase * 4).toFixed(1)} ${(fase * 3.2).toFixed(1)}) rotate(${(fase * 16 - 4).toFixed(1)}) scale(1.4)`);
    agujaIn.style.opacity = (.78 + .22 * Math.abs(Math.cos(hecho / 11))).toFixed(2);
    // tramo de hilo tenso entre la última puntada y el ojo de la aguja
    tenso.style.strokeDasharray = `0 ${Math.max(0, hecho - 26).toFixed(1)} ${Math.min(26, hecho).toFixed(1)} ${L}`;
  }

  const calcular = () => {
    pedido = 0;
    const r = caja.getBoundingClientRect(), vh = window.innerHeight || 800;
    const av = Math.min(1, Math.max(0, (vh * .62 - r.top) / Math.max(1, r.height - vh * .1)));
    if (Math.abs(av - ultimo) < .0008) return;
    ultimo = av; pintar(av);
  };
  const alMedir = () => { trazar(); if (quieto) pintar(1); else calcular(); };
  if (quieto) caja.classList.add("ed-costura--quieta");
  alMedir();
  const alScroll = () => { if (!pedido) pedido = requestAnimationFrame(calcular); };
  window.addEventListener("scroll", alScroll, { passive: true });
  window.addEventListener("resize", alMedir);
  const ro = window.ResizeObserver ? new ResizeObserver(alMedir) : null;
  if (ro) ro.observe(caja);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(alMedir).catch(() => {});
  alSalir(() => { window.removeEventListener("scroll", alScroll); window.removeEventListener("resize", alMedir); if (ro) ro.disconnect(); cancelAnimationFrame(pedido); });
}

/* ---- 55 · Cita ---- */
function citaHTML(){
  return `<section class="ed-cita" aria-label="Nuestra forma de atender">
  <figure class="contenedor ed-cita__figura" data-r>
    <blockquote class="ed-cita__texto"><p>Un botón, un metro de cinta o unas medias: lo que necesite, se lo buscamos con calma, como se ha hecho siempre en este mostrador.</p></blockquote>
    <figcaption class="ed-cita__firma">La familia Díaz, en la Plaza de Espronceda</figcaption>
  </figure>
</section>`;
}

/* ---- 60 · Cómo comprar en 3 pasos ---- */
const PASOS = [
  ["Elija", "Busque por categoría o escriba lo que necesita."],
  ["Haga su pedido", "Desde la cesta, pagando con tarjeta, o directamente por WhatsApp."],
  ["Recójalo o se lo enviamos", "Recogida gratis en la tienda. Envío a casa 4,95&nbsp;€, gratis desde 50&nbsp;€."]
];
function comprarHTML(){
  const id = U().uid("ed-com");
  return `<section class="ed-comprar seccion" aria-labelledby="${id}">
  <div class="contenedor rejilla ed-comprar__rejilla">
    <div class="ed-comprar__cabeza" data-r>
      <h2 id="${id}">Comprar es sencillo</h2>
      <a class="boton boton--texto" href="${R().url.comoComprar()}">Ver cómo comprar</a>
    </div>
    <ol class="ed-pasos" data-r-grupo>
      ${PASOS.map(([t, x], i) => `<li class="ed-paso" data-r><span class="ed-paso__num" aria-hidden="true">${i + 1}</span><h3 class="ed-paso__titulo"><span class="visualmente-oculto">Paso ${i + 1}: </span>${t}</h3><p>${x}</p></li>`).join("")}
    </ol>
  </div>
</section>`;
}

/* ---- 70 · Visítenos ---- */
function visitenosHTML(){
  const T = D().TIENDA, id = U().uid("ed-vis");
  return `<section class="ed-visitenos seccion" aria-labelledby="${id}">
  <div class="contenedor rejilla ed-visitenos__rejilla">
    <div class="ed-visitenos__mapa">${mapa()}</div>
    <div class="ed-visitenos__datos" data-r-grupo>
      <h2 id="${id}" data-r>Venga a vernos</h2>
      <address class="ed-direccion" data-r>${esc(T.calle)}.<br>${esc(T.cp)} ${esc(T.ciudad)} (${esc(T.provincia || "Badajoz")})</address>
      <div data-r>${estadoHTML()}</div>
      <div data-r>${horarioHTML()}</div>
      <div class="ed-botones" data-r>${comoLlegar()}${llamar()}</div>
    </div>
  </div>
</section>`;
}

function registrar(){
  if (!LV.rutas || !LV.rutas.seccion) { console.error("[B3] LV.rutas.seccion no existe"); return; }
  const S = (id, orden, html, montar) => LV.rutas.seccion("inicio", { id, orden, html, montar,
    desmontar: id === "destacados" ? () => { limpiar.forEach(f => { try { f(); } catch (e) {} }); limpiar = []; } : undefined });
  S("destacados", 30, destacadosHTML, montarDestacados);
  S("encargo", 40, encargoHTML);
  S("historia", 50, historiaHTML, montarHistoria);
  S("cita", 55, citaHTML);
  S("comprar", 60, comprarHTML);
  S("visitenos", 70, visitenosHTML, el => { alSalir(vigilarEstado(el)); alSalir(respaldoRev(el)); });
}
registrar();   // registrar no llama a otros módulos: solo guarda funciones en LV.rutas (que ya existe)

return Object.freeze({ respaldoRev, mapa, estado, estadoHTML, vigilarEstado, horarioHTML, contactoHTML, comoLlegar, llamar, whats, nb });
})();
