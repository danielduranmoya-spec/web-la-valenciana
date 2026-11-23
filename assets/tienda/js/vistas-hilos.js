/* =========================================================
   LA VALENCIANA · vistas-hilos.js
   - LV.vistas.hilo (#/hilo/:tipo y #/hilo/:tipo/:labor): «Valores» (trabajos hechos con ese
     material, cada uno con su guía), guía del material y sus ovillos.
   - Portada orientativa: «Elija por dónde empezar», «¿Qué le apetece crear hoy?»,
     «Elija por tipo de hilo» y la franja de servicios.
   - En «Lanas y labores» y en la ficha de cada ovillo, enlaces a sus valores.
   Datos en hilos.js.
   ========================================================= */
(() => {
"use strict";
const U = () => LV.util, D = () => LV.datos, H = () => LV.hilos, R = () => LV.rutas;
const esc = s => LV.util.esc(s);
const ic = n => (LV.IC && LV.IC[n]) || "";
const whats = (clase, texto, msg) => `<a class="boton ${clase}" href="${U().whatsURL(msg)}" target="_blank" rel="noopener">${ic("whats")}<span>${esc(texto)}<span class="visualmente-oculto"> (se abre WhatsApp)</span></span></a>`;

/* Proyectos de la portada: la pregunta que se hace la clienta → la labor que la resuelve */
const PROYECTOS = [
  ["algodon", "conejito", "Hacer un amigurumi"],
  ["merino", "chaquetita", "Cositas para bebé"],
  ["algodon", "posavasos", "Posavasos para casa"],
  ["merino", "patucos", "Unos patucos"],
  ["algodon", "monedero", "Un monedero hecho a mano"],
  ["merino", "manta", "Mantita de cochecito"],
  ["merino", "gorrito", "Un gorrito de invierno"],
  ["algodon", "frutas", "Juguetes de ganchillo"]
];
/* «Elija por dónde empezar»: subsecciones con su dibujo (o foto real) */
const ENTRADAS = [
  { t: "Lanas y ovillos", cat: "merceria", sub: "lanas", foto: "assets/tienda/fotos/baby-3/crudo.webp" },
  { t: "Hilos de coser", cat: "merceria", sub: "hilos", icono: "bobina", color: "#E9B9C3" },
  { t: "Botones", cat: "merceria", sub: "botones", icono: "boton", color: "#B98A55" },
  { t: "Cremalleras", cat: "merceria", sub: "cremalleras", icono: "cremallera", color: "#24365C" },
  { t: "Cintas y puntillas", cat: "merceria", sub: "cintas", icono: "cinta", color: "#E9B9C3" },
  { t: "Medias y calcetines", cat: "complementos", sub: "medias", icono: "media", color: "#E6C3A6" },
  { t: "Bolsos y monederos", cat: "complementos", sub: "bolsos", icono: "bolso", color: "#B98A55" },
  { t: "Cápsulas", cat: "capsulas", icono: "kit", color: "#E9B9C3" }
];

function icono(nombre, color){
  try { if (LV.ilus && LV.ilus.icono) return LV.ilus.icono(nombre, color, { decorativa: true, lino: false }); } catch (e) { console.error(e); }
  return "";
}
const hay = (cat, sub) => D().productosDe(cat, sub).length > 0;

/* ---------------- piezas ---------------- */
function circulos(items, { clase = "" } = {}){
  return `<ul class="hil-circulos ${clase}" role="list" data-r-grupo>
    ${items.map(it => `<li data-r><a class="hil-circulo" href="${esc(it.href)}">
      <span class="hil-circulo__img"${it.fondo ? ` style="--hil-fondo:${esc(it.fondo)}"` : ""}>${it.img}</span>
      <span class="hil-circulo__t">${esc(it.t)}</span>
      ${it.sub ? `<span class="hil-circulo__sub">${esc(it.sub)}</span>` : ""}
    </a></li>`).join("")}
  </ul>`;
}
function circulosTipos(){
  return circulos(H().TIPOS.map(t => ({
    t: t.nombre, sub: "Ver valores y guía", href: R().url.hilo(t.id), fondo: t.color,
    img: `<img src="${esc(t.foto)}" alt="" loading="lazy" decoding="async">`
  })), { clase: "hil-circulos--tipos" });
}
function carrusel(lista, { id, titulo, entradilla = "", nivel = "h2", ante = "" }){
  const u = U(), tid = u.uid("hil-crear");
  return `<section class="hil-crear" id="${id}" aria-labelledby="${tid}">
  <div class="contenedor">
    <div class="hil-crear__cabeza" data-r>
      ${ante ? `<p class="caja-antetitulo">${esc(ante)}</p>` : ""}
      <${nivel} id="${tid}">${esc(titulo)}</${nivel}>
      ${entradilla ? `<p class="hil-crear__entradilla">${esc(entradilla)}</p>` : ""}
    </div>
    <div class="hil-crear__marco">
      <ul class="hil-crear__pista" role="list" tabindex="0" aria-label="${esc(titulo)}">
        ${lista.map(([t, l, texto], i) => {
          const tipo = H().tipo(t), lab = H().labor(tipo, l); if (!lab) return "";
          return `<li class="hil-proy" style="--hil-lienzo:${H().tono(lab.c, .78)}">
            <a class="hil-proy__enlace" href="${R().url.hilo(t, l)}">
              <span class="hil-proy__t">${esc(texto)}</span>
              ${H().flecha(i, H().tono(lab.c, -.35))}
              ${H().dibujo(lab, { clase: "hil-proy__dib" })}
              <span class="hil-proy__pie">${esc(lab.t)} · ${esc(tipo.nombre.toLowerCase())}</span>
            </a></li>`;
        }).join("")}
      </ul>
      <div class="hil-crear__botones">
        <button type="button" class="boton boton--secundario hil-crear__boton" data-hil-mover="-1" aria-label="Proyectos anteriores">${ic("flechaIzq") || "‹"}</button>
        <button type="button" class="boton boton--secundario hil-crear__boton" data-hil-mover="1" aria-label="Más proyectos">${ic("flechaDer") || "›"}</button>
      </div>
    </div>
  </div>
</section>`;
}
function montarCarrusel(el){
  if (!el) return;
  el.querySelectorAll(".hil-crear").forEach(sec => {
    const pista = sec.querySelector(".hil-crear__pista"); if (!pista) return;
    const botones = sec.querySelectorAll("[data-hil-mover]");
    const estado = () => {
      const max = pista.scrollWidth - pista.clientWidth - 2;
      botones[0].disabled = pista.scrollLeft <= 2; botones[1].disabled = pista.scrollLeft >= max;
      sec.classList.toggle("hil-crear--quieta", max <= 0);
    };
    botones.forEach(b => b.addEventListener("click", () => {
      const paso = (pista.querySelector(".hil-proy") || pista).getBoundingClientRect().width + 20;
      pista.scrollBy({ left: +b.dataset.hilMover * paso, behavior: U().reducido && U().reducido() ? "auto" : "smooth" });
    }));
    pista.addEventListener("scroll", () => requestAnimationFrame(estado), { passive: true });
    estado();
  });
}

/* ---------------- PORTADA ---------------- */
function empezarHTML(){
  const items = ENTRADAS.filter(e => hay(e.cat, e.sub)).map(e => ({
    t: e.t, href: R().url.categoria(e.cat, e.sub),
    img: e.foto ? `<img src="${esc(e.foto)}" alt="" loading="lazy" decoding="async">` : icono(e.icono, e.color)
  }));
  return `<section class="hil-empezar seccion" aria-labelledby="hil-empezar-t">
  <div class="contenedor">
    <div class="hil-seccion-cabeza" data-r>
      <p class="caja-antetitulo">Para orientarse</p>
      <h2 id="hil-empezar-t">Elija por dónde empezar</h2>
      <p>Toque lo que necesita y le llevamos directo. Si no lo tiene claro, más abajo le proponemos ideas.</p>
    </div>
    ${circulos(items, { clase: "hil-circulos--empezar" })}
  </div>
</section>`;
}
const crearHTML = () => carrusel(PROYECTOS, { id: "hil-crear-portada", titulo: "¿Qué le apetece crear hoy?", ante: "Ideas con nuestras lanas",
  entradilla: "Cada idea lleva su guía: cuántos ovillos, qué agujas y los pasos. Así sabe qué comprar antes de empezar." });
function tiposHTML(){
  return `<section class="hil-tipos seccion seccion--rosa" aria-labelledby="hil-tipos-t">
  <div class="contenedor hil-tipos__rejilla">
    <div class="hil-seccion-cabeza" data-r>
      <p class="caja-antetitulo">Valores</p>
      <h2 id="hil-tipos-t">Elija por tipo de hilo</h2>
      <p>En cada material le enseñamos trabajos hechos con él, para que vea cómo queda, y una guía para acertar con las agujas, la cantidad y el lavado.</p>
    </div>
    ${circulosTipos()}
  </div>
</section>`;
}
function serviciosHTML(){
  const T = D().TIENDA;
  const it = (icono, t, x) => `<li data-r><span class="hil-serv__ic" aria-hidden="true">${ic(icono)}</span><span><strong>${esc(t)}</strong><span>${esc(x)}</span></span></li>`;
  return `<section class="hil-serv" aria-label="Cómo trabajamos">
  <ul class="contenedor hil-serv__lista" role="list" data-r-grupo>
    ${it("camion", `Envío gratis desde ${T.envioGratis} €`, `${T.plazoEnvio}, a toda la península.`)}
    ${it("tienda", "Recogida en tienda", "Gratis, en la calle Moreno Nieto, 7.")}
    ${it("candado", "Pago seguro", "Con tarjeta o PayPal, o al recoger.")}
    ${it("whats", "Le aconsejamos", "Por WhatsApp o en el mostrador, sin prisas.")}
  </ul>
</section>`;
}

/* ---------------- VISTA #/hilo/:tipo ---------------- */
function tarjetaLabor(t, l, i){
  const prod = H().productos(t)[0];
  const msg = `Hola, quiero hacer «${l.t}» con ${t.nombre.toLowerCase()}. ¿Me preparáis el material? (${l.material})`;
  return `<article class="hil-labor" id="labor-${esc(l.id)}" data-r>
    <div class="hil-labor__lienzo" style="--hil-lienzo:${H().tono(l.c, .8)}">${H().dibujo(l, { clase: "hil-labor__dib", alt: `${l.t} hecho con ${t.nombre.toLowerCase()}` })}</div>
    <div class="hil-labor__cuerpo">
      <h3 class="hil-labor__t">${esc(l.t)}</h3>
      <p class="hil-labor__x">${esc(l.x)}</p>
      <dl class="hil-labor__datos">
        <div><dt>Nivel</dt><dd>${esc(l.nivel)}</dd></div>
        <div><dt>Tiempo</dt><dd>${esc(l.tiempo)}</dd></div>
        <div><dt>Mide</dt><dd>${esc(l.mide)}</dd></div>
      </dl>
      <p class="hil-labor__material"><strong>Necesita:</strong> ${esc(l.material)}.</p>
      <details class="hil-guia"${i === 0 ? "" : ""}>
        <summary>Guía paso a paso</summary>
        <ol>${l.pasos.map(p => `<li>${esc(p)}</li>`).join("")}</ol>
        <p class="hil-guia__nota">Cantidades orientativas: cambian con la talla y con cómo teja cada una. Si duda, pregúntenos.</p>
      </details>
      <div class="hil-labor__botones">
        ${whats("boton--primario", "Pedir el material", msg)}
        ${prod ? `<a class="boton boton--secundario" href="${R().url.producto(prod.id)}">Ver la lana</a>` : ""}
      </div>
    </div>
  </article>`;
}
const GUIA = [["sirve", "¿Para qué sirve?"], ["herramienta", "Agujas y ganchillo"], ["rinde", "Cuánto rinde"], ["nivel", "Nivel"], ["cuidado", "Lavado y cuidados"], ["truco", "Un truco de la tienda"]];

LV.vistas.hilo = {
  titulo: p => `${p.tipo.titulo}: valores y guía`,
  nav: () => R().url.categoria("merceria"),
  html(p){
    const t = p.tipo, url = R().url, prods = H().productos(t), otros = H().TIPOS.filter(x => x.id !== t.id);
    return `<div class="hil">
<div class="contenedor lis-migas">${U().migas([["Inicio", url.inicio()], ["Mercería", url.categoria("merceria")], ["Lanas y labores", url.categoria("merceria", "lanas")], [t.nombre]])}</div>
<header class="hil-cab">
  <div class="contenedor hil-cab__rejilla">
    <div class="hil-cab__texto">
      <p class="caja-antetitulo">Tipo de hilo</p>
      <h1 data-titular>${esc(t.titulo)}</h1>
      <p class="t-entradilla" data-r data-r-retardo="250">${esc(t.frase)}</p>
      <ul class="pildoras hil-cab__anclas" role="list" data-r data-r-retardo="350">
        <li><a class="pildora" href="#valores">Valores</a></li>
        <li><a class="pildora" href="#guia">Guía</a></li>
        ${prods.length ? `<li><a class="pildora" href="#comprar">Comprar</a></li>` : ""}
      </ul>
    </div>
    <div class="hil-cab__foto" data-r="escala"><img src="${esc(t.foto)}" alt="" decoding="async"></div>
  </div>
</header>

<section class="hil-valores seccion" id="valores" aria-labelledby="hil-valores-t">
  <div class="contenedor">
    <div class="hil-seccion-cabeza" data-r>
      <h2 id="hil-valores-t">Valores</h2>
      <p>Trabajos hechos con ${esc(t.nombre.toLowerCase())}, como referencia de lo que sale de cada ovillo. Cada uno trae lo que necesita y su guía.</p>
    </div>
    <div class="hil-labores">${t.labores.map((l, i) => tarjetaLabor(t, l, i)).join("")}</div>
    <p class="hil-nota">Los dibujos son orientativos. Muy pronto los cambiaremos por fotos de labores reales hechas con nuestras lanas.</p>
  </div>
</section>

<section class="hil-guia-gen seccion seccion--rosa" id="guia" aria-labelledby="hil-guia-t">
  <div class="contenedor">
    <div class="hil-seccion-cabeza" data-r>
      <h2 id="hil-guia-t">Guía del ${esc(t.nombre.toLowerCase())}</h2>
      <p>Lo que le contaríamos en el mostrador antes de llevarse los ovillos.</p>
    </div>
    <dl class="hil-guia-gen__lista" data-r-grupo>
      ${GUIA.map(([k, n]) => `<div class="hil-guia-gen__item" data-r><dt>${esc(n)}</dt><dd>${esc(t.guia[k])}</dd></div>`).join("")}
    </dl>
  </div>
</section>

${prods.length ? `<section class="hil-comprar seccion" id="comprar" aria-labelledby="hil-comprar-t">
  <div class="contenedor">
    <div class="hil-seccion-cabeza" data-r><h2 id="hil-comprar-t">Ovillos de ${esc(t.nombre.toLowerCase())}</h2></div>
    ${LV.tarjeta.rejilla(prods)}
  </div>
</section>` : ""}

${otros.length ? `<section class="hil-otros seccion" aria-labelledby="hil-otros-t">
  <div class="contenedor">
    <div class="hil-seccion-cabeza" data-r><h2 id="hil-otros-t">Otros tipos de hilo</h2></div>
    ${circulos(otros.map(x => ({ t: x.nombre, sub: "Ver valores y guía", href: url.hilo(x.id), fondo: x.color, img: `<img src="${esc(x.foto)}" alt="" loading="lazy">` })), { clase: "hil-circulos--tipos" })}
  </div>
</section>` : ""}

<section class="hil-ayuda seccion seccion--rosa" aria-labelledby="hil-ayuda-t">
  <div class="contenedor hil-ayuda__rejilla">
    <div data-r><h2 id="hil-ayuda-t">¿Tiene una idea y no sabe por dónde empezar?</h2>
    <p>Cuéntenos qué quiere hacer y le preparamos los ovillos, las agujas y el patrón.</p></div>
    <div data-r>${whats("boton--primario boton--grande", "Escribir por WhatsApp", `Hola, quiero hacer una labor con ${t.nombre.toLowerCase()} y no sé qué necesito: `)}</div>
  </div>
</section>
</div>`;
  },
  montar(main, p){
    try { LV.tarjeta.montar(main); } catch (e) {}
    if (p.labor) {
      const el = main.querySelector(`#labor-${CSS.escape(p.labor)}`);
      if (el) {
        const d = el.querySelector("details"); if (d) d.open = true;
        el.classList.add("hil-labor--elegida");
        requestAnimationFrame(() => setTimeout(() => el.scrollIntoView({ block: "start" }), 60));
      }
    }
  }
};

/* ---------------- en «Lanas y labores» y en la ficha de cada ovillo ---------------- */
const ATTR = "data-hil-extra";
function quitarExtras(main){ main.querySelectorAll(`[${ATTR}]`).forEach(n => n.remove()); }
function extraLanas(main){
  const cab = main.querySelector(".lis-cab"); if (!cab) return;
  const div = document.createElement("div"); div.setAttribute(ATTR, "");
  div.innerHTML = carrusel(PROYECTOS, { id: "hil-crear-lanas", titulo: "¿Qué quiere tejer hoy?", nivel: "h2" }) +
    `<section class="hil-tipos hil-tipos--lanas" aria-labelledby="hil-tipos-lanas-t"><div class="contenedor hil-tipos__rejilla">
      <div class="hil-seccion-cabeza"><h2 id="hil-tipos-lanas-t">Elija por tipo de hilo</h2><p>Con sus valores (trabajos hechos con él) y su guía.</p></div>
      ${circulosTipos()}</div></section>`;
  cab.after(div);
  montarCarrusel(div);
  try { LV.mov && LV.mov.revelar && LV.mov.revelar(div); } catch (e) {}
}
function extraFicha(main, prod){
  const t = H().deProducto(prod); if (!t) return;
  const fila = main.querySelector(".tarjeta-fila");
  const ancla = (fila && fila.closest("section, .contenedor")) || null;
  const div = document.createElement("section"); div.setAttribute(ATTR, ""); div.className = "hil-ficha seccion";
  div.setAttribute("aria-labelledby", "hil-ficha-t");
  div.innerHTML = `<div>
    <div class="hil-seccion-cabeza">
      <p class="caja-antetitulo">Valores</p>
      <h2 id="hil-ficha-t">Qué puede hacer con esta lana</h2>
      <p>Trabajos hechos con ${esc(t.nombre.toLowerCase())}, con lo que necesita y su guía paso a paso.</p>
    </div>
    <ul class="hil-mini" role="list">${t.labores.map(l => `<li><a class="hil-mini__enlace" href="${R().url.hilo(t.id, l.id)}">
      <span class="hil-mini__lienzo" style="--hil-lienzo:${H().tono(l.c, .8)}">${H().dibujo(l, { clase: "hil-mini__dib" })}</span>
      <span class="hil-mini__t">${esc(l.t)}</span><span class="hil-mini__x">${esc(l.nivel)} · ${esc(l.tiempo.toLowerCase())}</span></a></li>`).join("")}</ul>
    <a class="boton boton--secundario hil-ficha__todo" href="${R().url.hilo(t.id)}">Ver valores y guía del ${esc(t.nombre.toLowerCase())}</a>
  </div>`;
  if (ancla && ancla.parentNode) ancla.parentNode.insertBefore(div, ancla);
  else (main.firstElementChild || main).appendChild(div);
}
document.addEventListener("lv:ruta-cambiada", e => {
  const d = e.detail || {}, main = document.getElementById("contenido"); if (!main || !LV.hilos) return;
  try {
    quitarExtras(main);
    if (d.vista === "categoria" && d.params && d.params.cat === "merceria" && d.params.sub === "lanas") extraLanas(main);
    if (d.vista === "producto" && d.params && d.params.prod) extraFicha(main, d.params.prod);
  } catch (err) { console.error("[LV.hilos] extras:", err); }
});

/* ---------------- registro en la portada ---------------- */
function registrar(){
  if (!LV.rutas || !LV.rutas.seccion) return;
  LV.rutas.seccion("inicio", { id: "empezar", orden: 12, html: empezarHTML });
  LV.rutas.seccion("inicio", { id: "crear", orden: 14, html: crearHTML, montar: montarCarrusel });
  LV.rutas.seccion("inicio", { id: "tipos-hilo", orden: 16, html: tiposHTML });
  LV.rutas.seccion("inicio", { id: "servicios", orden: 45, html: serviciosHTML });
}
registrar();
})();
