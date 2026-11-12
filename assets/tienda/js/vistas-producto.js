/* =========================================================
   LA VALENCIANA v2 · vistas/producto.js · PROPIETARIO: B5
   Ficha de producto: #/p/:id  y  #/p/:id/(versiones|parecidos|juego|detalles)
   Clases compartidas que define B5 (estilo en css/ficha.css):
     .muestra (+ __color, --clara, --agotada, --tarjeta) · .medida (+ __marca)
     .stepper (+ __boton, __valor, __unidad, --compacto) · .acordeon (+ __titulo,
     __boton, __icono, __panel, __interior, __contenido)
   Ayudas expuestas (por si otros las necesitan):
     LV.vistas.producto.acordeones(contenedor) → activa los .acordeon de dentro
     LV.vistas.producto.radiogrupo(grupoEl, alElegir) → flechas en un role=radiogroup
   ========================================================= */
window.LV = window.LV || {};
LV.vistas = LV.vistas || {};
(() => {
"use strict";

/* ---------- estado de la ficha montada ---------- */
let E = null;            // {prod, vi, m, q, ids, main, …}
let limpiar = [];
let pendiente = null;    // pestaña a la que ir cuando el router termine

const IC = n => (LV.IC && LV.IC[n]) || "";
const r2 = n => Math.round((n + Number.EPSILON) * 100) / 100;
const DESTINOS = { versiones: "versiones", parecidos: "parecidos", juego: "juego", detalles: "detalles" };

/* ---------- textos ---------- */
const nombreCorto = prod => prod.nombre.replace(/ \((metro|par)\)$/, "");
function textoSeleccion(st){
  const { prod } = st, v = prod.variantes[st.vi], partes = [];
  if (prod.variantes.length > 1 || prod.tipoVar === "color") partes.push(`${LV.datos.rotulo(prod.tipoVar)}: ${v.n}`);
  if (st.m) partes.push(`${LV.datos.rotulo(prod.tipoMedida)}: ${st.m}`);
  return partes.join(", ");
}
function textoUnidades(prod, q){
  const U = LV.util;
  if (prod.porMetro) return `${U.num(q)} ${q === 1 ? "metro" : "metros"}`;
  return `${U.num(q)} ${q === 1 ? "unidad" : "unidades"}`;
}
function textoPedirWhats(st){
  const sel = textoSeleccion(st);
  return `Hola, quería pedir ${textoUnidades(st.prod, st.q)} de «${nombreCorto(st.prod)}»${sel ? ` (${sel})` : ""}. ¿Lo tienen disponible?`;
}
function textoPreguntaWhats(st){
  const sel = textoSeleccion(st);
  return `Hola, tengo una pregunta sobre «${nombreCorto(st.prod)}»${sel ? ` (${sel})` : ""}: `;
}
/* «Otro formato» = el mismo artículo en otra presentación (p. ej. hilo de 100 m y de 500 m):
   mismo icono y subcategoría (LV.datos.hermanos) Y el mismo nombre quitando cifras, unidades y paréntesis.
   Dos abanicos o dos cintas distintas NO son otro formato: van a «Le pueden interesar». (R3) */
const nombreBase = n => n.toLowerCase().replace(/\([^)]*\)/g, " ")
  .replace(/\b\d+([.,]\d+)?\s*(m|cm|mm|g|kg|ud\.?|uds\.?|den|ml)?(?=\s|$)/g, " ").replace(/\s+/g, " ").trim();
function formatosDe(prod){
  const base = nombreBase(prod.nombre);
  return base ? LV.datos.hermanos(prod).filter(x => nombreBase(x.nombre) === base) : [];
}
const precioUd = st => LV.datos.precioDe(st.prod, st.prod.variantes[st.vi].n);

/* ---------- piezas de marcado ---------- */
function ilustracion(prod, vi, vista = "principal", decorativa = false){
  try {
    return LV.ilus.dibujar(prod, vi, { decorativa, vista, lino: vista === "principal" || !decorativa, lienzo: LV.datos.lienzo(prod) });
  } catch (e) { console.error("[B5] fallo al dibujar", prod.id, e); return ""; }
}

const VISTAS = [["principal", "Entera"], ["detalle", "De cerca"], ["escala", "A escala"], ["combinada", "Combinada"]];
function hayVistas(){ try { return !!(LV.ilus && LV.ilus.tipos && LV.ilus.tipos().length); } catch (e) { return false; } }

function galeria(st){
  const { prod, ids } = st, U = LV.util;
  const minis = hayVistas() ? `
    <div class="fic-vistas" role="group" aria-label="Vistas de la ilustración">
      ${VISTAS.map(([v, t], i) => `
        <button type="button" class="fic-vista" data-fic="vista" data-valor="${v}" aria-pressed="${i === 0}">
          <span class="fic-vista__dibujo">${ilustracion(prod, st.vi, v, true)}</span>
          <span class="fic-vista__texto">${t}</span>
        </button>`).join("")}
    </div>` : "";
  return `
  <div class="fic-galeria">
    <figure class="fic-lienzo rev" style="--fic-lienzo:${U.esc(LV.datos.lienzo(prod))}">
      <div class="fic-lienzo__capa fic-lienzo__capa--visible" data-fic-capa>${ilustracion(prod, st.vi, "principal")}</div>
      <figcaption class="visualmente-oculto" id="${ids.leyenda}">Ilustración de ${U.esc(prod.nombre)}</figcaption>
    </figure>
    ${minis}
    <p class="fic-galeria__desc t-entradilla" data-r>${U.esc(prod.desc)}</p>
  </div>`;
}

function muestras(st){
  const { prod } = st, U = LV.util;
  return prod.variantes.map((v, i) => {
    const sel = i === st.vi, clara = U.esClaro(v.c) || v.c === "#EAF2F5";
    return `<button type="button" role="radio" class="muestra${clara ? " muestra--clara" : ""}" data-fic="variante" data-valor="${i}"
      aria-checked="${sel}" tabindex="${sel ? 0 : -1}" aria-label="${U.esc(v.n)}" title="${U.esc(v.n)}">
      <span class="muestra__color" style="${U.esc(U.muestraCSS(v.c))}"></span></button>`;
  }).join("");
}
function botonesMedida(lista, actual, fic){
  const U = LV.util;
  return lista.map((n, i) => {
    const sel = n === actual;
    return `<button type="button" role="radio" class="medida" data-fic="${fic}" data-valor="${U.esc(String(i))}"
      aria-checked="${sel}" tabindex="${sel ? 0 : -1}"><span class="medida__marca">${IC("check")}</span><span class="medida__texto">${U.esc(n)}</span></button>`;
  }).join("");
}

function selector(st){
  const { prod, ids } = st, U = LV.util, D = LV.datos;
  const v = prod.variantes[st.vi];
  let h = "";
  // versiones (color, talla, tipo, importe, modelo)
  if (prod.variantes.length > 1) {
    const rot = D.rotulo(prod.tipoVar);
    h += `
    <div class="fic-grupo" data-r>
      <p class="fic-grupo__rotulo" id="${ids.rotV}">${U.esc(rot)}: <strong data-fic-nombre-v>${U.esc(v.n)}</strong></p>
      <div class="fic-opciones ${prod.conColor ? "fic-opciones--muestras" : "fic-opciones--medidas"}" role="radiogroup" aria-labelledby="${ids.rotV}" data-fic-grupo="variante">
        ${prod.conColor ? muestras(st) : botonesMedida(prod.variantes.map(x => x.n), v.n, "variante")}
      </div>
    </div>`;
  } else if (prod.tipoVar === "color" || v.c) {
    h += `<div class="fic-grupo" data-r><p class="fic-grupo__rotulo">Color: <strong>${U.esc(v.n)}</strong></p></div>`;
  }
  // medidas / tallas
  if (prod.medidas.length > 1) {
    const rot = D.rotulo(prod.tipoMedida);
    h += `
    <div class="fic-grupo" data-r>
      <p class="fic-grupo__rotulo" id="${ids.rotM}">${U.esc(rot)}: <strong data-fic-nombre-m>${U.esc(st.m)}</strong></p>
      <div class="fic-opciones fic-opciones--medidas" role="radiogroup" aria-labelledby="${ids.rotM}" data-fic-grupo="medida">
        ${botonesMedida(prod.medidas, st.m, "medida")}
      </div>
    </div>`;
  } else if (prod.medidas.length === 1) {
    h += `<div class="fic-grupo" data-r><p class="fic-grupo__rotulo">${U.esc(D.rotulo(prod.tipoMedida))}: <strong>${U.esc(prod.medidas[0])}</strong></p></div>`;
  }
  if (prod.tipoMedida === "talla" || prod.tipoVar === "talla") {
    h += `<p class="fic-ayuda" data-r><a href="${U.esc(U.whatsURL(`Hola, tengo una duda con la talla de «${nombreCorto(prod)}».`))}" target="_blank" rel="noopener" data-fic="whats-talla">¿Dudas con la talla? Pregúntenos por WhatsApp<span class="visualmente-oculto"> (se abre WhatsApp)</span></a></p>`;
  }
  if (!h) {
    h = `<p class="fic-unica" data-r>Este artículo se vende en una sola versión. Si busca otro color o medida, pregúntenos: a veces lo tenemos en la tienda.</p>`;
  }
  const form = st.listas.formatos;
  if (form.length) {
    const url = LV.rutas.url;
    h += `<p class="fic-ayuda" data-r>También lo tenemos en otro formato: ${form.map(x => `<a href="${url.producto(x.id)}">${U.esc(x.nombre)}</a>`).join(", ")}.</p>`;
  }
  return h;
}

function cantidad(st){
  const { prod, ids } = st, U = LV.util, T = LV.datos.TIENDA;
  const metros = prod.porMetro;
  return `
  <div class="fic-cantidad" data-r>
    <label class="fic-grupo__rotulo" for="${ids.cant}">${metros ? "Metros" : "Cantidad"}</label>
    <div class="fic-cantidad__fila">
      <div class="stepper${metros ? " stepper--metros" : ""}">
        <button type="button" class="stepper__boton" data-fic="menos" aria-label="${metros ? "Quitar medio metro" : "Quitar una"}" aria-controls="${ids.cant}">${IC("menos")}</button>
        <input class="stepper__valor" id="${ids.cant}" type="text" inputmode="decimal" autocomplete="off" value="${U.num(st.q)}"
          aria-describedby="${ids.ayudaCant}" data-fic="cantidad">
        ${metros ? `<span class="stepper__unidad" aria-hidden="true">m</span>` : ""}
        <button type="button" class="stepper__boton" data-fic="mas" aria-label="${metros ? "Añadir medio metro" : "Añadir una"}" aria-controls="${ids.cant}">${IC("mas")}</button>
      </div>
      <p class="fic-total" aria-live="polite" aria-atomic="true"><span class="fic-total__rotulo">Total</span> <strong class="fic-total__cifra" data-fic-total>${U.euros(r2(precioUd(st) * st.q))}</strong></p>
    </div>
    <p class="fic-ayuda fic-ayuda--suave" id="${ids.ayudaCant}">${metros
      ? `Se corta a la medida, de medio en medio metro. ${U.euros(precioUd(st))} el metro.`
      : `Hasta ${prod.max} unidades por pedido en la web.`}</p>
    <p class="fic-limite" data-fic-limite hidden>${IC("info")}<span>Para más de ${metros ? `${prod.max} metros` : `${prod.max} unidades`}, llámenos al <a href="${U.esc(U.telURL())}">${T.tel.replace(/ /g, "&nbsp;")}</a> y le hacemos precio.</span></p>
  </div>`;
}

function compra(st){
  const { prod, ids } = st, U = LV.util, T = LV.datos.TIENDA;
  const etiquetas = [
    prod.novedad ? `<span class="etiqueta etiqueta--mantequilla">Novedad</span>` : "",
    prod.etiqueta ? `<span class="etiqueta">${U.esc(prod.etiqueta)}</span>` : ""
  ].join("");
  return `
  <div class="fic-compra">
    ${etiquetas ? `<p class="fic-etiquetas" data-r>${etiquetas}</p>` : ""}
    <h1 class="fic-nombre" data-titular>${U.esc(prod.nombre)}</h1>
    <div class="fic-precio" data-r>
      <p class="fic-precio__linea"><span class="fic-precio__cifra" data-fic-precio>${U.euros(precioUd(st))}</span>
        <span class="fic-precio__nota">${prod.porMetro ? "el metro, IVA incluido" : "IVA incluido"}</span></p>
      ${prod.stock === "pocas" ? `<span class="etiqueta lv-pocas">Quedan pocas unidades</span>` : `<span class="etiqueta etiqueta--salvia">${IC("check")}Disponible</span>`}
    </div>
    <hr class="filete fic-filete">
    <div class="fic-elegir" id="${ids.elegir}" data-fic-destino="versiones">
      <h2 class="visualmente-oculto">Elija su versión</h2>
      ${selector(st)}
      ${cantidad(st)}
      <div class="fic-acciones" data-r>
        <p class="fic-ya" data-fic-ya hidden></p>
        <button type="button" class="boton boton--primario boton--grande boton--ancho fic-anadir" data-fic="anadir">
          <span class="fic-anadir__estado fic-anadir__estado--normal">${IC("cesta")}<span>Añadir a la cesta</span></span>
          <span class="fic-anadir__estado fic-anadir__estado--hecho" aria-hidden="true">
            <svg class="fic-anadir__check" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12.5l4.5 4.5L19 7.5" pathLength="1"/></svg>
            <span>Añadido</span></span>
        </button>
        <a class="boton boton--secundario boton--ancho fic-whats" data-fic="pedir-whats" target="_blank" rel="noopener"
          href="${U.esc(U.whatsURL(textoPedirWhats(st)))}">${IC("whats")}<span>Pedir por WhatsApp</span><span class="visualmente-oculto"> (se abre WhatsApp)</span></a>
      </div>
      <ul class="fic-envio" data-r>
        <li>${IC("camion")}<span>Envío ${U.euros(T.envio).replace(" ", "&nbsp;")}, gratis desde ${T.envioGratis}&nbsp;€. Si pide antes de las ${T.horaCorte}:00, sale hoy.</span></li>
        <li>${IC("tienda")}<span>Recogida en la tienda, gratis.</span></li>
      </ul>
    </div>
    ${masOpciones(st)}
  </div>`;
}

/** Primer botón de «Más opciones»: dice exactamente qué versiones hay (o, si no hay, lleva a los detalles). */
function opcionVersiones(st){
  const { prod } = st, D = LV.datos, nv = prod.variantes.length, nm = prod.medidas.length;
  const pv = D.PLURALES[prod.tipoVar] || "opciones", pm = D.PLURALES[prod.tipoMedida] || "medidas";
  const nf = st.listas.formatos.length;
  if (nv > 1 && nm > 1) return ["versiones", "colores", `Ver ${prod.conColor ? "colores" : pv} y ${pm}`, `${nv} ${pv} y ${nm} ${pm}`];
  if (nv > 1) return ["versiones", "colores", `Ver los ${pv}`, `${nv} ${pv} para elegir`];
  if (nm > 1) return ["versiones", "colores", `Ver las ${pm}`, `${nm} ${pm} para elegir`];
  if (nf) return ["versiones", "colores", "Ver otros formatos", nf === 1 ? "También en otra presentación" : `${nf} presentaciones más`];
  return ["detalles", "info", "Detalles y cuidados", "Medidas, cuidados y envíos"];
}
function masOpciones(st){
  const { prod, ids } = st, U = LV.util, url = LV.rutas.url, T = LV.datos.TIENDA;
  const art = n => `${n} ${n === 1 ? "artículo" : "artículos"}`;
  const cuerpo = (icono, texto, sub) => `<span class="fic-opcion__icono" aria-hidden="true">${IC(icono)}</span>
        <span class="fic-opcion__textos"><span class="fic-opcion__texto">${texto}</span><span class="fic-opcion__sub">${sub}</span></span>`;
  const op = (pest, icono, texto, sub) => `<li><a class="boton boton--secundario fic-opcion" href="${url.producto(prod.id, pest)}" data-fic-ir="${pest}">${cuerpo(icono, texto, sub)}</a></li>`;
  const [pv, iv, tv, sv] = opcionVersiones(st);
  const { parecidos, juego } = st.listas;
  return `
  <section class="fic-mas" aria-labelledby="${ids.mas}" data-r>
    <h2 class="fic-mas__titulo" id="${ids.mas}">Más opciones para este producto</h2>
    <ul class="fic-mas__lista">
      ${op(pv, iv, tv, sv)}
      ${parecidos.length ? op("parecidos", "parecidos", "Productos parecidos", `${art(parecidos.length)} para comparar`) : ""}
      ${juego.length ? op("juego", "juego", "Llévelo a juego", `${art(juego.length)} que combinan`) : ""}
      <li><a class="boton boton--secundario fic-opcion" data-fic="preguntar-whats" target="_blank" rel="noopener"
        href="${U.esc(U.whatsURL(textoPreguntaWhats(st)))}">${cuerpo("whats", "Preguntar por WhatsApp", `Escríbanos al ${T.whatsTxt.replace(/ /g, "&nbsp;")}`)}<span class="visualmente-oculto"> (se abre WhatsApp)</span></a></li>
    </ul>
  </section>`;
}

function acordeon(id, titulo, contenido, abierto){
  return `
  <div class="acordeon${abierto ? " acordeon--abierto" : ""}">
    <h3 class="acordeon__titulo"><button type="button" class="acordeon__boton" id="${id}-b" aria-expanded="${abierto}" aria-controls="${id}">
      <span>${titulo}</span><span class="acordeon__icono" aria-hidden="true"></span></button></h3>
    <div class="acordeon__panel" id="${id}" role="region" aria-labelledby="${id}-b"${abierto ? "" : " inert"}>
      <div class="acordeon__interior"><div class="acordeon__contenido">${contenido}</div></div>
    </div>
  </div>`;
}

function detalles(st){
  const { prod, ids } = st, U = LV.util, D = LV.datos, T = D.TIENDA;
  const lista = items => items.length ? `<ul class="fic-lista">${items.map(x => `<li>${x}</li>`).join("")}</ul>` : "";
  const desc = `<p class="fic-desc-repetida">${U.esc(prod.desc)}</p>${lista(prod.detalles.map(U.esc))}`
    + (prod.variantes.length > 1 ? `<p>Disponible en ${U.esc(D.textoVersiones(prod))}.</p>` : "");
  const medidasTxt = [];
  if (prod.medidas.length) medidasTxt.push(`${U.esc(D.PLURALES[prod.tipoMedida] ? D.PLURALES[prod.tipoMedida][0].toUpperCase() + D.PLURALES[prod.tipoMedida].slice(1) : "Medidas")} disponibles: ${prod.medidas.map(U.esc).join(", ")}.`);
  if (!prod.conColor && prod.variantes.length > 1) medidasTxt.push(`${U.esc(D.rotulo(prod.tipoVar))}: ${prod.variantes.map(v => U.esc(v.n)).join(", ")}.`);
  if (prod.porMetro) medidasTxt.push(`Se vende por metros, desde ${U.num(prod.min)} m y de medio en medio metro. Lo cortamos en la tienda a la medida que pida.`);
  if (prod.tipoMedida === "talla") medidasTxt.push("Si duda entre dos tallas, díganos su talla habitual y le aconsejamos.");
  medidasTxt.push("Para lavar y planchar, siga las indicaciones de la etiqueta del artículo. Si tiene dudas, pregúntenos.");
  const envios = `
    <p>Envío a la Península por ${U.euros(T.envio)}, y gratis a partir de ${T.envioGratis}&nbsp;€. Tarda de ${U.esc(T.plazoEnvio)}; si hace el pedido antes de las ${T.horaCorte}:00, sale el mismo día.</p>
    <p>También puede recogerlo en la tienda, sin coste: ${U.esc(T.dir)}.</p>
    <p>Tiene ${T.diasCambio} días para cambiarlo. No admitimos cambios de ${U.esc(T.sinCambio)}.${prod.porMetro ? " Este artículo se corta a medida, así que no admite cambio." : ""}</p>
    <p>Puede pagar con tarjeta o PayPal en la web: solo reservamos el importe y no se cobra hasta que comprobemos que tenemos todo. Si lo prefiere, envíenos el pedido por WhatsApp o por correo y pague al recoger o por Bizum.</p>`;
  let estado = "";
  try { estado = U.estadoTienda().txt + "."; } catch (e) {}
  const dudas = `
    <p>Llámenos o escríbanos y le atendemos como en el mostrador.</p>
    <ul class="fic-contacto">
      <li>${IC("tel")}<a href="${U.esc(U.telURL())}">Llamar al ${T.tel.replace(/ /g, "&nbsp;")}</a></li>
      <li>${IC("whats")}<a href="${U.esc(U.whatsURL(textoPreguntaWhats(st)))}" target="_blank" rel="noopener" data-fic="preguntar-whats">WhatsApp ${T.whatsTxt.replace(/ /g, "&nbsp;")}<span class="visualmente-oculto"> (se abre WhatsApp)</span></a></li>
      <li>${IC("correo")}<a href="${U.esc(U.correoURL(`Pregunta sobre ${nombreCorto(prod)}`))}">${U.esc(T.correo)}</a></li>
      <li>${IC("reloj")}<span>${U.esc(U.horarioResumen())}${estado ? ` <strong>${U.esc(estado)}</strong>` : ""}</span></li>
    </ul>`;
  return `
  <section class="fic-detalles" id="${ids.detalles}" data-fic-destino="detalles" aria-labelledby="${ids.detallesT}">
    <h2 class="visualmente-oculto" id="${ids.detallesT}">Detalles del producto</h2>
    ${acordeon(ids.acc + "-1", "Descripción y detalles", desc, true)}
    ${acordeon(ids.acc + "-2", "Medidas y cuidados", medidasTxt.map(t => `<p>${t}</p>`).join(""), false)}
    ${acordeon(ids.acc + "-3", "Envíos y cambios", envios, false)}
    ${acordeon(ids.acc + "-4", "¿Tiene dudas?", dudas, false)}
  </section>`;
}

function bloque(clave, id, titulo, texto, lista){
  if (!lista.length) return "";
  const U = LV.util, T = LV.tarjeta;
  let dentro = "";
  if (lista.length === 1 && clave === "versiones-otras") {
    const o = lista[0];
    let dib = "";
    try { dib = LV.ilus.dibujar(o, 0, { decorativa: true }); } catch (e) {}
    dentro = `<h2 class="fic-bloque__titulo" data-r>${U.esc(titulo)}</h2>
      <a class="fic-formato" href="#/p/${U.esc(o.id)}" data-r>
        <span class="fic-formato__lienzo">${dib}</span>
        <span class="fic-formato__textos"><span class="fic-formato__nombre">${U.esc(o.nombre)}</span>
        <span class="fic-formato__precio">${U.euros(o.precio)}</span>
        <span class="fic-formato__ver">Ver este formato</span></span>
      </a>`;
  }
  try {
    if (!dentro && T && typeof T.fila === "function") dentro = T.fila(lista, { titulo, id: id + "-fila" });
  } catch (e) { console.error("[B5] LV.tarjeta.fila falló", e); }
  if (!dentro) {
    let rej = "";
    try { rej = T.rejilla(lista, { clase: "fic-rejilla" }); } catch (e) { rej = ""; }
    dentro = `<h2 class="fic-bloque__titulo" data-r>${U.esc(titulo)}</h2>${rej}`;
  }
  return `
  <div class="fic-bloque" id="${id}" data-fic-destino="${clave}">
    <div class="contenedor">
      ${texto ? `<p class="fic-bloque__texto t-suave">${U.esc(texto)}</p>` : ""}
      ${dentro}
    </div>
  </div>`;
}

function barra(st){
  const U = LV.util;
  return `
  <div class="fic-barra" data-fic-barra inert>
    <div class="fic-barra__dentro">
      <p class="fic-barra__info"><span class="fic-barra__nombre">${U.esc(nombreCorto(st.prod))}</span>
        <span class="fic-barra__precio" data-fic-total-barra>${U.euros(r2(precioUd(st) * st.q))}</span></p>
      <button type="button" class="boton boton--primario fic-barra__boton" data-fic="anadir-barra">${IC("cesta")}<span>Añadir a la cesta</span></button>
    </div>
  </div>`;
}

/* ---------- vista ---------- */
function html(p){
  const prod = p.prod, U = LV.util, D = LV.datos;
  if (!prod) return null;
  const u = pref => U.uid("fic-" + pref);
  const ids = { leyenda: u("ley"), rotV: u("rv"), rotM: u("rm"), cant: u("cant"), ayudaCant: u("ac"), elegir: u("elegir"),
    mas: u("mas"), detalles: u("det"), detallesT: u("dett"), acc: u("acc"),
    bloqueVersiones: u("versiones"), bloqueJuego: u("juego"), bloqueParecidos: u("parecidos") };
  const formatos = formatosDe(prod);
  const hIds = new Set(formatos.map(x => x.id));
  const parecidos = D.parecidos(prod, 8 + formatos.length).filter(x => !hIds.has(x.id)).slice(0, 8);
  const juego = D.aJuego(prod, 8, [...hIds]);
  let vi0 = 0;
  try { const el = LV.tarjeta && LV.tarjeta.elegida ? LV.tarjeta.elegida(prod.id) : null; if (el != null && prod.variantes[el]) vi0 = +el; } catch (e) {}
  E = { prod, vi: vi0, m: prod.medidas[0] || "", q: U.ajustarCantidad(prod, 1), ids, listas: { formatos, parecidos, juego } };
  const cat = D.categoria(prod.cat), sub = D.subcategoria(prod.cat, prod.sub);
  const url = LV.rutas.url;
  const migas = U.migas([["Inicio", url.inicio()], [cat.nombre, url.categoria(prod.cat)], [sub.n, url.categoria(prod.cat, prod.sub)], [prod.nombre]]);
  return `
  <article class="fic" data-fic-id="${U.esc(prod.id)}" data-lienzo="${U.esc(D.lienzoDe(prod.cat, prod.sub))}">
    <div class="contenedor fic-migas">${migas}</div>
    <div class="contenedor">
      <div class="fic-principal">
        ${galeria(E)}
        ${compra(E)}
        ${detalles(E)}
      </div>
    </div>
    ${bloque("versiones-otras", ids.bloqueVersiones, "Otros formatos de este producto", "", formatos)}
    ${bloque("juego", ids.bloqueJuego, "Llévelo a juego", "", juego)}
    ${bloque("parecidos", ids.bloqueParecidos, "Le pueden interesar", "", parecidos)}
    ${barra(E)}
  </article>`;
}

/* ---------- comportamiento ---------- */
const $ = (s, el) => (el || document).querySelector(s);
const $$ = (s, el) => [...(el || document).querySelectorAll(s)];

/** Radiogroup con flechas (patrón ARIA): flechas mueven y eligen, Inicio/Fin, foco itinerante. */
function radiogrupo(grupo, alElegir){
  if (!grupo || grupo.dataset.ficRg) return;
  grupo.dataset.ficRg = "1";
  const radios = () => $$('[role="radio"]', grupo).filter(r => r.getAttribute("aria-disabled") !== "true");
  const elegir = (r, foco) => {
    $$('[role="radio"]', grupo).forEach(x => { const s = x === r; x.setAttribute("aria-checked", s); x.tabIndex = s ? 0 : -1; });
    if (foco) r.focus();
    alElegir && alElegir(r);
  };
  grupo.addEventListener("click", e => {
    const r = e.target.closest('[role="radio"]'); if (!r || !grupo.contains(r) || r.getAttribute("aria-disabled") === "true") return;
    if (r.getAttribute("aria-checked") === "true") return;
    elegir(r, false);
  });
  grupo.addEventListener("keydown", e => {
    const l = radios(); const i = l.indexOf(document.activeElement); if (i < 0) return;
    let j = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") j = (i + 1) % l.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") j = (i - 1 + l.length) % l.length;
    else if (e.key === "Home") j = 0;
    else if (e.key === "End") j = l.length - 1;
    else if (e.key === " " || e.key === "Enter") { e.preventDefault(); if (l[i].getAttribute("aria-checked") !== "true") elegir(l[i], true); return; }
    if (j == null) return;
    e.preventDefault();
    elegir(l[j], true);
  });
}

/** Acordeones .acordeon (botón aria-expanded + panel con grid-rows 0fr→1fr). Idempotente. */
function acordeones(cont){
  $$(".acordeon", cont).forEach(a => {
    if (a.dataset.ficAc) return; a.dataset.ficAc = "1";
    const b = $(".acordeon__boton", a), panel = $(".acordeon__panel", a);
    if (!b || !panel) return;
    b.addEventListener("click", () => abrirAcordeon(a, b.getAttribute("aria-expanded") !== "true"));
  });
}
function abrirAcordeon(a, abrir){
  const b = $(".acordeon__boton", a), panel = $(".acordeon__panel", a);
  b.setAttribute("aria-expanded", abrir);
  a.classList.toggle("acordeon--abierto", abrir);
  if (abrir) panel.removeAttribute("inert"); else panel.setAttribute("inert", "");
}

function pintarLienzo(){
  const fig = $(".fic-lienzo", E.main); if (!fig) return;
  const viejas = $$("[data-fic-capa]", fig);
  const capa = document.createElement("div");
  capa.className = "fic-lienzo__capa";
  capa.setAttribute("data-fic-capa", "");
  capa.innerHTML = ilustracion(E.prod, E.vi, E.vista || "principal");
  fig.insertBefore(capa, $("figcaption", fig));
  // fuerza el estado inicial y fundido cruzado (M11)
  void capa.offsetWidth;
  requestAnimationFrame(() => {
    capa.classList.add("fic-lienzo__capa--visible");
    viejas.forEach(v => v.classList.add("fic-lienzo__capa--sale"));
  });
  const quitar = () => viejas.forEach(v => v.remove());
  setTimeout(quitar, 700);
  // miniaturas con el color nuevo
  $$(".fic-vista", E.main).forEach(btn => { const d = $(".fic-vista__dibujo", btn); if (d) d.innerHTML = ilustracion(E.prod, E.vi, btn.dataset.valor, true); });
}

function actualizarPrecios(){
  const U = LV.util, pu = precioUd(E), tot = U.euros(r2(pu * E.q));
  const m = E.main;
  const pr = $("[data-fic-precio]", m); if (pr) pr.textContent = U.euros(pu);
  const t = $("[data-fic-total]", m); if (t) t.textContent = tot;
  const tb = $("[data-fic-total-barra]", m); if (tb) tb.textContent = tot;
  const ayuda = E.prod.porMetro && $("#" + E.ids.ayudaCant, m);
  if (ayuda) ayuda.textContent = `Se corta a la medida, de medio en medio metro. ${U.euros(pu)} el metro.`;
  $$('[data-fic="pedir-whats"]', m).forEach(a => a.href = U.whatsURL(textoPedirWhats(E)));
  $$('[data-fic="preguntar-whats"]', m).forEach(a => a.href = U.whatsURL(textoPreguntaWhats(E)));
}

function ponerCantidad(q, desdeTeclado){
  const U = LV.util, prod = E.prod;
  const pedido = +q;
  const nueva = U.ajustarCantidad(prod, q);
  E.q = nueva;
  const inp = $("#" + E.ids.cant, E.main);
  if (inp && !desdeTeclado) inp.value = U.num(nueva);
  const menos = $('[data-fic="menos"]', E.main), mas = $('[data-fic="mas"]', E.main);
  if (menos) menos.setAttribute("aria-disabled", nueva <= prod.min);
  if (mas) mas.setAttribute("aria-disabled", nueva >= prod.max);
  const lim = $("[data-fic-limite]", E.main);
  if (lim) lim.hidden = !(pedido > prod.max || (nueva >= prod.max && E.tocoMax));
  actualizarPrecios();
}

function textoYa(){
  const U = LV.util, T = LV.tienda, prod = E.prod;
  const el = $("[data-fic-ya]", E.main); if (!el || !T) return;
  const n = T.cantidadDe ? T.cantidadDe(prod.id) : 0;
  if (!n) { el.hidden = true; el.innerHTML = ""; return; }
  el.hidden = false;
  el.innerHTML = `${IC("check")}<span>Ya tiene ${U.esc(textoUnidades(prod, n))} en su cesta.</span>
    <button type="button" class="boton boton--texto fic-ya__ver" data-fic="ver-cesta">Ver mi cesta</button>`;
}

function anadir(boton){
  const T = LV.tienda, U = LV.util, prod = E.prod;
  if (!T || !T.anadir) return;
  const v = prod.variantes[E.vi].n;
  const r = T.anadir(prod.id, v, E.m, E.q, boton);
  if (!r) return;
  // estado del botón principal (M20): «Añadido» con ✓ que se dibuja, 2 s
  const principal = $(".fic-anadir", E.main);
  [principal, boton].forEach(b => {
    if (!b) return;
    b.classList.remove("fic-anadir--hecho"); void b.offsetWidth; b.classList.add("fic-anadir--hecho");
    clearTimeout(b._ficT); b._ficT = setTimeout(() => b.classList.remove("fic-anadir--hecho"), 2000);
  });
  if (r.limitado) { E.tocoMax = true; const lim = $("[data-fic-limite]", E.main); if (lim) lim.hidden = false; }
  // si no hay mini-panel de B6 que lo anuncie, lo anunciamos aquí
  if (!document.querySelector(".anadido")) {
    U.anunciar(`Añadido: ${prod.nombre}. Su cesta tiene ${T.articulos()} ${T.articulos() === 1 ? "artículo" : "artículos"}.`);
  }
}

function irA(pestana, { suave = true, foco = true } = {}){
  if (!E || !E.main) return;
  const m = E.main;
  let el = null;
  if (pestana === "versiones") {
    el = $('[data-fic-destino="versiones"]', m);
    // sin nada que elegir pero con otros formatos: al bloque de formatos
    if (el && !$('[role="radiogroup"]', el)) el = $('[data-fic-destino="versiones-otras"]', m) || el;
  }
  else if (pestana === "parecidos") el = $('[data-fic-destino="parecidos"]', m);
  else if (pestana === "juego") el = $('[data-fic-destino="juego"]', m);
  else if (pestana === "detalles") el = $('[data-fic-destino="detalles"]', m);
  if (!el) return;
  if (pestana === "detalles") { const a = $(".acordeon", el); if (a) abrirAcordeon(a, true); }
  const rm = LV.util.reducido();
  const comp = $(".fic-compra", m), gal = $(".fic-galeria", m);
  if (comp && gal && comp.contains(el) && getComputedStyle(comp).position === "sticky") {
    // la columna de compra es «sticky»: scrollIntoView la deja bajo la cabecera. Se calcula su sitio natural
    // (empieza a la misma altura que la galería) y se baja hasta ahí, dejando sitio a la cabecera encogida. (R3)
    const dentro = el.getBoundingClientRect().top - comp.getBoundingClientRect().top;
    const y = gal.getBoundingClientRect().top + window.scrollY + dentro - 72 - 24;
    window.scrollTo({ top: Math.max(0, y), behavior: suave && !rm ? "smooth" : "auto" });
  } else el.scrollIntoView({ behavior: suave && !rm ? "smooth" : "auto", block: "start" });
  if (!foco) return;
  // foco: en versiones, la opción elegida; si no, el título del bloque
  let f = pestana === "versiones" ? $('[role="radio"][aria-checked="true"]', el)
    : pestana === "detalles" ? $(".acordeon__boton", el) : null;
  if (!f) f = $("h2:not(.visualmente-oculto)", el) || el;
  if (f.tagName !== "BUTTON" && !f.hasAttribute("tabindex")) f.setAttribute("tabindex", "-1");
  try { f.focus({ preventScroll: true }); } catch (e) { f.focus(); }
  // aviso visual breve en el bloque elegido
  el.classList.remove("fic-destacado"); void el.offsetWidth; el.classList.add("fic-destacado");
  setTimeout(() => el.classList.remove("fic-destacado"), 1600);
}

function montar(main, p){
  if (!E || E.prod !== p.prod) html(p);
  E.main = main;
  const raiz = $(".fic", main); if (!raiz) return;
  try { LV.tarjeta && LV.tarjeta.montar && LV.tarjeta.montar(main); } catch (e) { console.error(e); }
  acordeones(raiz);

  radiogrupo($('[data-fic-grupo="variante"]', raiz), r => {
    E.vi = +r.dataset.valor || 0;
    const n = $("[data-fic-nombre-v]", raiz); if (n) n.textContent = E.prod.variantes[E.vi].n;
    pintarLienzo(); actualizarPrecios();
  });
  radiogrupo($('[data-fic-grupo="medida"]', raiz), r => {
    E.m = E.prod.medidas[+r.dataset.valor] || "";
    const n = $("[data-fic-nombre-m]", raiz); if (n) n.textContent = E.m;
    actualizarPrecios();
  });

  raiz.addEventListener("click", e => {
    const b = e.target.closest("[data-fic]"); if (!b || !raiz.contains(b)) return;
    const acc = b.dataset.fic;
    if (acc === "menos" || acc === "mas") {
      if (b.getAttribute("aria-disabled") === "true") { if (acc === "mas") { E.tocoMax = true; ponerCantidad(E.q + E.prod.paso); } return; }
      ponerCantidad(Math.round((E.q + (acc === "mas" ? 1 : -1) * E.prod.paso) * 100) / 100);
    } else if (acc === "anadir" || acc === "anadir-barra") {
      anadir(b);
    } else if (acc === "ver-cesta") {
      LV.cesta && LV.cesta.abrir && LV.cesta.abrir(b);
    } else if (acc === "vista") {
      E.vista = b.dataset.valor;
      $$(".fic-vista", raiz).forEach(x => x.setAttribute("aria-pressed", x === b));
      pintarLienzo();
    }
  });
  // cantidad escrita a mano
  const inp = $("#" + E.ids.cant, raiz);
  if (inp) {
    const leer = () => { const v = parseFloat(String(inp.value).replace(",", ".")); return isFinite(v) ? v : E.q; };
    inp.addEventListener("input", () => { const v = parseFloat(String(inp.value).replace(",", ".")); if (isFinite(v) && v > 0) ponerCantidad(v, true); });
    inp.addEventListener("change", () => ponerCantidad(leer()));
    inp.addEventListener("blur", () => ponerCantidad(leer()));
    inp.addEventListener("keydown", e => {
      if (e.key === "ArrowUp") { e.preventDefault(); ponerCantidad(E.q + E.prod.paso); }
      else if (e.key === "ArrowDown") { e.preventDefault(); ponerCantidad(E.q - E.prod.paso); }
      else if (e.key === "Enter") { e.preventDefault(); ponerCantidad(leer()); }
    });
  }
  ponerCantidad(E.q);

  // «Más opciones»: si ya estamos en esa pestaña, el hash no cambia → movemos nosotros
  raiz.addEventListener("click", e => {
    const a = e.target.closest("[data-fic-ir]"); if (!a) return;
    if (a.getAttribute("href") === location.hash) { e.preventDefault(); irA(a.dataset.ficIr); }
  });

  // cesta: «ya tiene N»
  const alCambiar = () => textoYa();
  document.addEventListener("lv:cesta-cambiada", alCambiar);
  limpiar.push(() => document.removeEventListener("lv:cesta-cambiada", alCambiar));
  textoYa();

  // barra fija en móvil: aparece cuando el botón principal ha salido por arriba
  const barraEl = $("[data-fic-barra]", raiz), boton = $(".fic-anadir", raiz);
  if (barraEl && boton && "IntersectionObserver" in window) {
    const html = document.documentElement;
    const io = new IntersectionObserver(([en]) => {
      const pasado = !en.isIntersecting && en.boundingClientRect.top < 0;
      barraEl.classList.toggle("fic-barra--visible", pasado);
      if (pasado) barraEl.removeAttribute("inert"); else barraEl.setAttribute("inert", "");
      html.classList.toggle("fic-con-barra", pasado);
    }, { threshold: 0 });
    io.observe(boton);
    limpiar.push(() => { io.disconnect(); html.classList.remove("fic-con-barra"); });
  }

  // columna de compra fija (sticky): si es más alta que la ventana, se pega por abajo
  const col = $(".fic-compra", raiz);
  if (col) {
    let pend = false;
    const ajustar = () => { pend = false;
      if (!col.isConnected) return;
      const cab = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--alto-cab-actual")) || 72;
      const arriba = cab + 24, top = Math.min(arriba, window.innerHeight - col.offsetHeight - 24);
      col.style.setProperty("--fic-top", Math.round(top) + "px");
    };
    const pedir = () => { if (!pend) { pend = true; requestAnimationFrame(ajustar); } };
    window.addEventListener("resize", pedir, { passive: true });
    window.addEventListener("scroll", pedir, { passive: true });
    document.addEventListener("lv:letra-cambiada", pedir);
    limpiar.push(() => { window.removeEventListener("resize", pedir); window.removeEventListener("scroll", pedir); document.removeEventListener("lv:letra-cambiada", pedir); });
    ajustar();
  }

  // pestaña inicial (#/p/x/parecidos): esperar a que el router acabe (scroll arriba + foco al h1)
  pendiente = p.pestana || null;
  if (pendiente) {
    const tras = () => { const t = pendiente; pendiente = null; if (t) setTimeout(() => irA(t, { suave: false }), 30); };
    document.addEventListener("lv:ruta-cambiada", tras, { once: true });
    limpiar.push(() => document.removeEventListener("lv:ruta-cambiada", tras));
  }
}

function desmontar(){
  limpiar.forEach(f => { try { f(); } catch (e) {} });
  limpiar = []; pendiente = null;   // E no se borra: html() de la vista nueva ya lo ha rellenado
}

function actualizar(p, anterior){
  if (!E || !anterior || p.id !== anterior.id) return false;
  if (p.pestana) irA(p.pestana);
  else { window.scrollTo({ top: 0, behavior: LV.util.reducido() ? "auto" : "smooth" }); const h = $("h1", E.main); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); } }
  return true;
}

LV.vistas.producto = {
  titulo: p => p.prod.nombre,
  html, montar, desmontar, actualizar,
  acordeones, radiogrupo
};
})();
