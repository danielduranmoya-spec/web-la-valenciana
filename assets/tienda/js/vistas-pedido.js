/* =========================================================
   LA VALENCIANA v2 · vistas/pedido.js · PROPIETARIO: B6
   LV.vistas.pedido        #/pedido        una página, 3 pasos, resumen fijo
   LV.vistas.confirmacion  #/pedido/hecho  «Su pedido está preparado» (M23)
   Caminos: tarjeta o PayPal (pasarela de PayPal, solo autoriza el importe;
   la tienda lo cobra después de comprobar que tiene todo), WhatsApp y correo.
   Configuración de la pasarela: assets/js/pago-config.js (window.LV_PAGO).
   Datos del formulario guardados en «lv-datos-pedido» (ARQUITECTURA §4.2).
   ========================================================= */
(() => {
"use strict";
const CLAVE_DATOS = "lv-datos-pedido";
const U = () => LV.util, T = () => LV.tienda, D = () => LV.datos;
const ic = n => (LV.IC && LV.IC[n]) || "";
const esc = s => U().esc(s);
const euros = n => U().euros(n).replace(/\s€/, " €");
const nombreCorto = prod => String(prod.nombre).replace(/\s*\(metro\)$/i, "");
const telTxt = () => esc(D().TIENDA.tel).replace(/ /g, " ");
const plural = (n, s, p) => `${U().num(n)} ${n === 1 ? s : p}`;

let limpiar = [];
let aperturaFallida = false;      // window.open devolvió null (bloqueo de ventanas)

function mini(prod, vi){
  try { return LV.ilus.dibujar(prod, vi, { decorativa: true, lino: false }); } catch (e) { return ""; }
}

/* ---------------- validación ---------------- */
const soloCifras = s => String(s || "").replace(/\D/g, "");
const REGLAS = {
  nombre: v => v.trim().length < 3 || !/\s/.test(v.trim()) ? "Escriba su nombre y apellidos." : "",
  tel: v => {
    let c = soloCifras(v);
    if (c.length === 11 && c.startsWith("34")) c = c.slice(2);
    if (c.length === 13 && c.startsWith("0034")) c = c.slice(4);
    return /^[6789]\d{8}$/.test(c) ? "" : "El teléfono tiene 9 cifras, por ejemplo 600 123 456.";
  },
  email: v => {
    v = v.trim(); if (!v) return "";
    if (!v.includes("@")) return "Revise el correo: falta la @.";
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Revise el correo: parece incompleto, por ejemplo nombre@correo.es.";
  },
  dir: v => v.trim().length < 5 ? "Escriba la calle y el número donde quiere recibirlo." : "",
  cp: v => {
    const c = soloCifras(v);
    if (c.length !== 5 || c !== v.trim()) return "El código postal tiene 5 cifras.";
    const pr = +c.slice(0, 2);
    if (pr < 1 || pr > 52) return "El código postal tiene 5 cifras.";
    if ([7, 35, 38, 51, 52].includes(pr)) return `Por ahora solo enviamos a la Península. Llámenos al ${D().TIENDA.tel} y lo vemos.`;
    return "";
  },
  loc: v => v.trim().length < 2 ? "Escriba la localidad." : ""
};

/* ---------------- marcado del pedido ---------------- */
function campo(id, nombre, etiqueta, { tipo = "text", auto = "", modo = "", ayuda = "", extra = "", opcional = false } = {}){
  const idAy = ayuda ? `${id}-ayuda` : "";
  return `<div class="campo ped-campo" data-campo="${nombre}">
    <label class="campo__etiqueta" for="${id}">${esc(etiqueta)}${opcional ? ` <span class="ped-opcional">(opcional)</span>` : ""}</label>
    ${ayuda ? `<p class="campo__ayuda" id="${idAy}">${esc(ayuda)}</p>` : ""}
    <input class="campo__control" id="${id}" name="${nombre}" type="${tipo}"${auto ? ` autocomplete="${auto}"` : ""}${modo ? ` inputmode="${modo}"` : ""}${idAy ? ` aria-describedby="${idAy}"` : ""}${extra}>
    <p class="campo__error" id="${id}-error" hidden></p>
  </div>`;
}

function opcion(nombre, valor, { titulo, detalle = "", etiqueta = "", marcado = false, desactivado = false, icono = "" }){
  return `<label class="ped-opcion${desactivado ? " ped-opcion--no" : ""}">
    <input type="radio" name="${nombre}" value="${valor}"${marcado ? " checked" : ""}${desactivado ? ' disabled aria-disabled="true"' : ""}>
    <span class="ped-opcion__marca" aria-hidden="true"></span>
    <span class="ped-opcion__texto">
      <span class="ped-opcion__titulo">${icono ? ic(icono) : ""}<span>${titulo}</span>${etiqueta}</span>
      ${detalle ? `<span class="ped-opcion__detalle">${detalle}</span>` : ""}
    </span>
  </label>`;
}

function htmlLineasResumen(){
  return `<ul class="ped-lineas">${T().lista().map(l => `<li class="ped-linea">
      <span class="ped-mini" aria-hidden="true" style="background:${D().lienzo(l.prod)}">${mini(l.prod, l.vi)}</span>
      <span class="ped-linea__txt">
        <span class="ped-linea__nombre">${esc(nombreCorto(l.prod))}</span>
        <span class="ped-linea__detalle">${esc([String(l.textoVersion || "").replace(/ · /g, ", "), l.textoCantidad].filter(Boolean).join(", "))}</span>
      </span>
      <span class="ped-linea__importe">${euros(l.importe)}</span>
    </li>`).join("")}</ul>`;
}
function htmlCifras(modo){
  const t = T(), env = t.envio(modo);
  const textoEnv = modo === "tienda" ? "Gratis (recogida)" : env ? euros(env) : "Gratis";
  return `<dl class="ped-cifras">
    <div><dt>Productos</dt><dd>${euros(t.subtotal())}</dd></div>
    <div><dt>Entrega</dt><dd${env ? "" : ' class="ped-gratis"'}>${textoEnv}</dd></div>
    <div class="ped-cifras__total"><dt>Total <span>(IVA incluido)</span></dt><dd>${euros(t.total(modo))}</dd></div>
  </dl>`;
}
function htmlCuerpoResumen(modo){
  const n = T().articulos();
  return `${htmlLineasResumen()}
    <button type="button" class="boton boton--texto ped-cambiar" data-ped="cesta" aria-controls="ces-panel" aria-haspopup="dialog">Cambiar artículos o cantidades</button>
    ${htmlCifras(modo)}`;
}
function textoBoton(pago){ return pago === "tarjeta" ? "Pagar con tarjeta" : pago === "correo" ? "Enviar pedido por correo" : "Enviar pedido por WhatsApp"; }
const iconoPago = pago => ic(pago === "tarjeta" ? "candado" : pago === "correo" ? "correo" : "whats");
function htmlBotonEnviar(pago, idForm, extraClase = ""){
  return `<button type="submit" form="${idForm}" class="boton boton--primario boton--ancho boton--grande ped-enviar ${extraClase}">${iconoPago(pago)}<span>${textoBoton(pago)}</span></button>`;
}
function htmlConfianza(){
  const e = U().estadoTienda();
  return `<ul class="ped-confianza">
    <li>${ic("tienda")}<span>Tienda en Almendralejo desde el siglo XIX, en la calle Moreno Nieto.</span></li>
    <li>${ic("tel")}<span>Atención en el <a href="${U().telURL()}">${telTxt()}</a> y por WhatsApp en el ${esc(D().TIENDA.whatsTxt).replace(/ /g, " ")}. <span class="ped-estado${e.abierto ? " ped-estado--abierto" : ""}">${esc(e.txt)}.</span></span></li>
    <li>${ic("cambio")}<span>Tiene ${D().TIENDA.diasCambio} días para cambiarlo.</span></li>
  </ul>`;
}

function htmlVacio(){
  return `<div class="ped ped--vacio contenedor">
    <h1 data-titular>Hacer el pedido</h1>
    <p class="t-entradilla ped-vacio__txt">Todavía no ha elegido nada.</p>
    <p class="ped-vacio__ayuda">Cuando añada algo a su cesta, aquí podrá pagarlo con tarjeta o enviarnos el pedido por WhatsApp o por correo.</p>
    <div class="ped-vacio__botones">
      <a class="boton boton--primario" href="${LV.rutas.url.categoria("merceria")}">Ver la mercería</a>
      <a class="boton boton--secundario" href="${LV.rutas.url.categoria("complementos")}">Ver los complementos</a>
    </div>
    <p class="ped-vacio__tel">¿Prefiere pedirlo por teléfono? Llame al <a href="${U().telURL()}">${telTxt()}</a>.</p>
  </div>`;
}

function htmlPedido(){
  const g = U().leer(CLAVE_DATOS, {}) || {};
  const entrega = g.entrega === "casa" ? "casa" : "tienda";
  const pago = g.pago === "correo" || g.pago === "whatsapp" ? g.pago : "tarjeta";
  const prueba = !!(window.LV_PAGO && window.LV_PAGO.prueba);
  const f = U().uid("ped-f"), p = U().uid("ped-paso");
  const n = T().articulos(), gratisCasa = T().envio("casa") === 0;
  const TI = D().TIENDA;
  return `<div class="ped contenedor" data-entrega="${entrega}" data-pago="${pago}">
  <header class="ped-cab">
    <h1 data-titular>Hacer el pedido</h1>
    <div class="aviso ped-aviso" data-r="fundir">${ic("info")}<p>Pague con tarjeta o PayPal: solo reservamos el importe y no se cobra hasta que comprobemos que tenemos todo. Si lo prefiere, envíenos el pedido por WhatsApp o por correo y pague al recoger o por Bizum.${prueba ? " <strong>La pasarela está en modo de prueba: no se cobra nada de verdad.</strong>" : ""}</p></div>
  </header>

  <details class="ped-resumen-movil">
    <summary><span class="ped-resumen-movil__txt">Ver resumen: <span data-ped="resumen-txt">${plural(n, "artículo", "artículos")}, ${euros(T().total(entrega))}</span></span>${ic("abajo")}</summary>
    <div class="ped-resumen-movil__cuerpo" data-ped="cuerpo-resumen">${htmlCuerpoResumen(entrega)}</div>
  </details>

  <div class="ped-rejilla">
    <form class="ped-form" id="${f}" novalidate>
      <nav class="ped-pasos" aria-label="Pasos del pedido">
        <ol>
          <li><a href="#${p}-1" data-paso="1" aria-current="step"><span class="ped-pasos__n">1</span><span class="ped-pasos__t">Sus datos</span></a></li>
          <li><a href="#${p}-2" data-paso="2"><span class="ped-pasos__n">2</span><span class="ped-pasos__t">Entrega</span></a></li>
          <li><a href="#${p}-3" data-paso="3"><span class="ped-pasos__n">3</span><span class="ped-pasos__t">Pago</span></a></li>
        </ol>
      </nav>

      <div class="aviso aviso--error ped-errores" tabindex="-1" hidden></div>

      <section class="ped-paso" id="${p}-1" aria-labelledby="${p}-1t" data-r>
        <span class="ped-paso__num" aria-hidden="true">1</span>
        <div class="ped-paso__cuerpo">
          <h2 id="${p}-1t"><span class="visualmente-oculto">Paso 1: </span>Sus datos</h2>
          <div class="ped-campos">
            ${campo(`${f}-nombre`, "nombre", "Nombre y apellidos", { auto: "name" })}
            ${campo(`${f}-tel`, "tel", "Teléfono", { tipo: "tel", auto: "tel", modo: "tel", ayuda: "Solo le llamaremos si hay alguna duda con el pedido." })}
            ${campo(`${f}-email`, "email", "Correo electrónico", { tipo: "email", auto: "email", modo: "email", opcional: true, ayuda: "Si nos lo deja, también podemos contestarle por correo." })}
          </div>
        </div>
      </section>

      <section class="ped-paso" id="${p}-2" aria-labelledby="${p}-2t" data-r>
        <span class="ped-paso__num" aria-hidden="true">2</span>
        <div class="ped-paso__cuerpo">
          <h2 id="${p}-2t"><span class="visualmente-oculto">Paso 2: </span>¿Cómo lo recibe?</h2>
          <fieldset class="ped-grupo">
            <legend class="visualmente-oculto">¿Cómo lo recibe?</legend>
            ${opcion("entrega", "tienda", { titulo: "Lo recojo en la tienda. Gratis.", icono: "tienda", marcado: entrega === "tienda",
              detalle: `${esc(TI.calle || "Calle Moreno Nieto, 7")}, Almendralejo. Le avisamos cuando esté preparado.` })}
            ${opcion("entrega", "casa", { titulo: `Envío a casa. ${euros(TI.envio)} (gratis desde ${euros(TI.envioGratis)}).`, icono: "camion", marcado: entrega === "casa",
              etiqueta: gratisCasa ? `<span class="etiqueta etiqueta--salvia ped-etq">Gratis para su pedido</span>` : "",
              detalle: `A la Península, en 2 a 4 días laborables. Si pide antes de las 14:00, sale hoy.` })}
          </fieldset>
          <div class="ped-direccion" data-ped="direccion"${entrega === "casa" ? "" : " hidden"}>
            ${campo(`${f}-dir`, "dir", "Dirección (calle, número, piso)", { auto: "street-address" })}
            <div class="ped-direccion__fila">
              ${campo(`${f}-cp`, "cp", "Código postal", { auto: "postal-code", modo: "numeric", extra: ' maxlength="5"' })}
              ${campo(`${f}-loc`, "loc", "Localidad", { auto: "address-level2" })}
            </div>
          </div>
        </div>
      </section>

      <section class="ped-paso" id="${p}-3" aria-labelledby="${p}-3t" data-r>
        <span class="ped-paso__num" aria-hidden="true">3</span>
        <div class="ped-paso__cuerpo">
          <h2 id="${p}-3t"><span class="visualmente-oculto">Paso 3: </span>¿Cómo quiere pagar?</h2>
          <fieldset class="ped-grupo">
            <legend class="visualmente-oculto">¿Cómo quiere pagar?</legend>
            ${opcion("pago", "tarjeta", { titulo: "Tarjeta o PayPal, ahora", icono: "candado", marcado: pago === "tarjeta",
              etiqueta: `<span class="etiqueta etiqueta--salvia ped-etq">Pago seguro</span>`,
              detalle: "Con tarjeta de débito o crédito, sin necesidad de cuenta de PayPal. Solo reservamos el importe: no se cobra hasta que comprobemos que tenemos todo." })}
            ${opcion("pago", "whatsapp", { titulo: "Enviar el pedido por WhatsApp", icono: "whats", marcado: pago === "whatsapp",
              detalle: "Se abre WhatsApp con el pedido ya escrito. Paga al recoger o por Bizum cuando se lo confirmemos." })}
            ${opcion("pago", "correo", { titulo: "Enviar el pedido por correo", icono: "correo", marcado: pago === "correo",
              detalle: `Se abre su correo con el pedido escrito, dirigido a ${esc(T().correoPedido())}. Paga al recoger o por Bizum.` })}
          </fieldset>
          <div class="campo ped-campo ped-notas">
            <label class="campo__etiqueta" for="${f}-notas">Notas para la tienda <span class="ped-opcional">(opcional)</span></label>
            <p class="campo__ayuda" id="${f}-notas-ayuda">Por ejemplo, si le vale un color parecido cuando no quede el que ha elegido.</p>
            <textarea class="campo__control" id="${f}-notas" name="notas" rows="3" aria-describedby="${f}-notas-ayuda"></textarea>
          </div>
          <div class="ped-final">
            ${htmlBotonEnviar(pago, f, "ped-enviar--form")}
            <p class="ped-sin">${ic("candado")}<span>Sin registro. No se cobra nada hasta que lo confirmemos con usted.</span></p>
          </div>
            <div class="ped-pasarela" data-ped="pasarela" tabindex="-1" hidden>
              <p class="ped-pasarela__titulo">Último paso: elija cómo pagar ${euros(T().total(entrega))}</p>
              <p class="ped-pasarela__txt">Se abre la ventana segura de PayPal. Puede pagar con tarjeta sin tener cuenta.</p>
              <div class="ped-pasarela__botones" id="${f}-paypal"></div>
              <p class="ped-pasarela__estado" data-ped="estado-pago" role="status" aria-live="polite"></p>
            </div>
        </div>
      </section>
    </form>

    <aside class="ped-resumen" aria-labelledby="${p}-rt">
      <div class="ped-resumen__caja">
        <h2 class="ped-resumen__titulo" id="${p}-rt">Su pedido <span data-ped="n">(${plural(n, "artículo", "artículos")})</span></h2>
        <div data-ped="cuerpo-resumen">${htmlCuerpoResumen(entrega)}</div>
        ${htmlBotonEnviar(pago, f)}
        <p class="ped-sin">${ic("candado")}<span>Sin registro. No se cobra nada hasta que lo confirmemos con usted.</span></p>
        <p class="ped-dudas"><a href="${U().telURL()}">${ic("tel")}<span>¿Dudas? ${telTxt()}</span></a></p>
      </div>
      ${htmlConfianza()}
    </aside>
  </div>

  <div class="ped-barra">
    <div class="ped-barra__total"><span>Total</span><strong data-ped="total-barra">${euros(T().total(entrega))}</strong></div>
    ${htmlBotonEnviar(pago, f)}
  </div>
</div>`;
}

/* ---------------- montaje del pedido ---------------- */
function montarPedido(main){
  const raiz = main.querySelector(".ped:not(.ped--vacio)"); if (!raiz) return;
  const form = raiz.querySelector(".ped-form");
  const errores = raiz.querySelector(".ped-errores");
  const tocado = new Set();
  let enviado = false;

  // restaurar datos guardados
  const g = U().leer(CLAVE_DATOS, {}) || {};
  ["nombre", "tel", "email", "dir", "cp", "loc", "notas"].forEach(k => { if (g[k] && form.elements[k]) form.elements[k].value = g[k]; });

  const entrega = () => (form.querySelector('input[name="entrega"]:checked') || {}).value || "tienda";
  const pago = () => (form.querySelector('input[name="pago"]:checked') || {}).value || "tarjeta";
  const camposActivos = () => ["nombre", "tel", "email", ...(entrega() === "casa" ? ["dir", "cp", "loc"] : [])];
  const leerDatos = () => {
    const v = k => (form.elements[k] ? form.elements[k].value.trim() : "");
    const d = { nombre: v("nombre"), tel: v("tel"), entrega: entrega(), pago: pago() };
    if (v("email")) d.email = v("email");
    if (d.entrega === "casa") { d.dir = v("dir"); d.cp = v("cp"); d.loc = v("loc"); }
    if (v("notas")) d.notas = v("notas");
    return d;
  };
  const guardar = () => {
    const d = leerDatos();
    ["dir", "cp", "loc"].forEach(k => { if (form.elements[k]) d[k] = form.elements[k].value.trim(); });
    U().guardar(CLAVE_DATOS, d);
  };

  function mostrarError(nombre, msg){
    const c = form.querySelector(`[data-campo="${nombre}"]`); if (!c) return;
    const inp = c.querySelector(".campo__control"), err = c.querySelector(".campo__error");
    const ay = c.querySelector(".campo__ayuda");
    c.classList.toggle("campo--error", !!msg);
    if (msg) {
      err.innerHTML = `${ic("aviso")}<span>${esc(msg)}</span>`; err.hidden = false;
      inp.setAttribute("aria-invalid", "true");
      inp.setAttribute("aria-describedby", [err.id, ay && ay.id].filter(Boolean).join(" "));
    } else {
      err.hidden = true; err.innerHTML = "";
      inp.removeAttribute("aria-invalid");
      if (ay) inp.setAttribute("aria-describedby", ay.id); else inp.removeAttribute("aria-describedby");
    }
  }
  const errorDe = k => REGLAS[k] ? REGLAS[k](form.elements[k].value || "") : "";
  function validarTodo(mostrar){
    const lista = [];
    camposActivos().forEach(k => { const m = errorDe(k); if (m) lista.push([k, m]); if (mostrar) mostrarError(k, m); });
    return lista;
  }
  function pintarResumenErrores(lista){
    if (!lista.length) { errores.hidden = true; errores.innerHTML = ""; return; }
    const n = lista.length;
    errores.innerHTML = `${ic("aviso")}<div><p class="ped-errores__titulo">${n === 1 ? "Hay 1 dato por completar. Revíselo abajo." : `Hay ${n} datos por completar. Revíselos abajo.`}</p>
      <ul>${lista.map(([k, m]) => `<li><a href="#${form.elements[k].id}" data-ir="${k}">${esc(m)}</a></li>`).join("")}</ul></div>`;
    errores.hidden = false;
  }

  // indicador de pasos: hecho (✓) y actual
  const enlacesPaso = [...raiz.querySelectorAll(".ped-pasos a")];
  function marcarHechos(){
    const ok1 = ["nombre", "tel", "email"].every(k => !errorDe(k));
    const ok2 = entrega() === "tienda" || ["dir", "cp", "loc"].every(k => !errorDe(k));
    [ok1, ok2, false].forEach((ok, i) => enlacesPaso[i].classList.toggle("ped-pasos--hecho", ok));
  }
  function marcarActual(i){
    enlacesPaso.forEach((a, j) => { if (j === i) a.setAttribute("aria-current", "step"); else a.removeAttribute("aria-current"); });
  }
  if ("IntersectionObserver" in window) {
    const secciones = [...raiz.querySelectorAll(".ped-paso")];
    const io = new IntersectionObserver(ents => {
      ents.forEach(en => { if (en.isIntersecting) marcarActual(secciones.indexOf(en.target)); });
    }, { rootMargin: "-35% 0px -55% 0px" });
    secciones.forEach(s => io.observe(s));
    limpiar.push(() => io.disconnect());
  }
  enlacesPaso.forEach((a, i) => a.addEventListener("click", e => {
    e.preventDefault();
    const s = raiz.querySelectorAll(".ped-paso")[i];
    s.scrollIntoView({ behavior: U().reducido() ? "auto" : "smooth", block: "start" });
    const primero = s.querySelector("input:not([disabled]), textarea");
    marcarActual(i);
    setTimeout(() => primero && primero.focus({ preventScroll: true }), U().reducido() ? 0 : 450);
  }));

  // resumen y totales
  function refrescar(){
    if (T().vacia()) { LV.rutas.recargar(); return; }
    const m = entrega(), n = T().articulos();
    raiz.querySelectorAll('[data-ped="cuerpo-resumen"]').forEach(el => { el.innerHTML = htmlCuerpoResumen(m); });
    raiz.querySelectorAll('[data-ped="n"]').forEach(el => { el.textContent = `(${plural(n, "artículo", "artículos")})`; });
    raiz.querySelectorAll('[data-ped="resumen-txt"]').forEach(el => { el.textContent = `${plural(n, "artículo", "artículos")}, ${U().euros(T().total(m))}`; });
    raiz.querySelectorAll('[data-ped="total-barra"]').forEach(el => { el.textContent = euros(T().total(m)); });
    const etq = form.querySelector('input[value="casa"]').closest(".ped-opcion").querySelector(".ped-opcion__titulo");
    const ya = etq.querySelector(".etiqueta--salvia");
    if (T().envio("casa") === 0 && !ya) etq.insertAdjacentHTML("beforeend", `<span class="etiqueta etiqueta--salvia ped-etq">Gratis para su pedido</span>`);
    if (T().envio("casa") !== 0 && ya) ya.remove();
  }
  function cambiarPago(){
    const pg = pago();
    raiz.dataset.pago = pg;
    raiz.querySelectorAll(".ped-enviar").forEach(b => { b.innerHTML = `${iconoPago(pg)}<span>${textoBoton(pg)}</span>`; });
    if (pg !== "tarjeta") pasarela.hidden = true;
  }

  /* ---------- pasarela de pago (PayPal: tarjeta o PayPal, solo autoriza) ---------- */
  const pasarela = raiz.querySelector('[data-ped="pasarela"]');
  const estadoPago = raiz.querySelector('[data-ped="estado-pago"]');
  const decir = (t, mal) => { estadoPago.textContent = t || ""; estadoPago.classList.toggle("ped-pasarela__estado--mal", !!mal); };
  let pintada = false;
  function mostrarPasarela(){
    pasarela.hidden = false;
    const tit = pasarela.querySelector(".ped-pasarela__titulo");
    if (tit) tit.textContent = `Último paso: elija cómo pagar ${euros(T().total(entrega()))}`;
    pasarela.scrollIntoView({ block: "center", behavior: U().reducido() ? "auto" : "smooth" });
    pasarela.focus({ preventScroll: true });
    if (pintada) return;
    pintada = true;
    decir("Cargando la pasarela de pago…");
    LV.pago.cargar().then(pp => {
      decir("");
      return LV.pago.botones(pp, pasarela.querySelector(".ped-pasarela__botones"), {
        validar: () => { const l = validarTodo(true); pintarResumenErrores(l); return !l.length && !T().vacia(); },
        datos: () => { guardar(); return leerDatos(); },
        decir,
        hecho: (datos, res) => {
          T().guardarPedido({ ...datos, pago: "tarjeta", ref: res.ref, paypal: res.id, pagado: true });
          T().vaciar();
          LV.rutas.ir(LV.rutas.url.hecho());
        }
      });
    }).catch(err => {
      console.error("[pago]", err); pintada = false;
      decir("No se ha podido cargar la pasarela de pago. Compruebe su conexión, inténtelo de nuevo o envíenos el pedido por WhatsApp.", true);
    });
  }

  form.addEventListener("change", e => {
    const t = e.target;
    if (t.name === "entrega") {
      raiz.dataset.entrega = t.value;
      const dir = raiz.querySelector('[data-ped="direccion"]');
      dir.hidden = t.value !== "casa";
      if (t.value !== "casa") ["dir", "cp", "loc"].forEach(k => mostrarError(k, ""));
      refrescar();
      U().anunciar(`Total: ${U().euros(T().total(t.value))}.`);
    }
    if (t.name === "pago") cambiarPago();
    marcarHechos(); guardar();
    if (enviado) pintarResumenErrores(validarTodo(false));
  });
  form.addEventListener("focusout", e => {
    const k = e.target.name; if (!REGLAS[k]) return;
    if (e.target.value.trim() || enviado) tocado.add(k);
    if (tocado.has(k)) mostrarError(k, errorDe(k));
    marcarHechos();
    if (enviado) pintarResumenErrores(validarTodo(false));
  });
  let tG = 0;
  form.addEventListener("input", e => {
    const k = e.target.name;
    // si ya mostraba error, se quita en cuanto queda bien (no se añaden errores mientras se escribe)
    if (REGLAS[k] && tocado.has(k) && !errorDe(k)) mostrarError(k, "");
    clearTimeout(tG); tG = setTimeout(guardar, 300);
  });
  limpiar.push(() => clearTimeout(tG));
  errores.addEventListener("click", e => {
    const a = e.target.closest("[data-ir]"); if (!a) return;
    e.preventDefault();
    const inp = form.elements[a.dataset.ir];
    inp.scrollIntoView({ block: "center", behavior: U().reducido() ? "auto" : "smooth" });
    inp.focus({ preventScroll: true });
  });
  raiz.addEventListener("click", e => {
    const b = e.target.closest('[data-ped="cesta"]'); if (!b) return;
    LV.cesta && LV.cesta.abrir && LV.cesta.abrir(b);
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    enviado = true;
    if (T().vacia()) { LV.rutas.recargar(); return; }
    const lista = validarTodo(true);
    lista.forEach(([k]) => tocado.add(k));
    pintarResumenErrores(lista);
    marcarHechos();
    if (lista.length) {
      const primero = form.elements[lista[0][0]];
      errores.scrollIntoView({ block: "start", behavior: U().reducido() ? "auto" : "smooth" });
      primero.focus({ preventScroll: true });
      U().anunciar(lista.length === 1 ? "Hay 1 dato por completar." : `Hay ${lista.length} datos por completar.`, true);
      return;
    }
    const datos = leerDatos();
    guardar();
    if (datos.pago === "tarjeta") { mostrarPasarela(); return; }
    const ped = T().guardarPedido(datos);
    aperturaFallida = false;
    if (datos.pago === "correo") {
      const a = document.createElement("a");
      a.href = U().correoURL("Pedido en La Valenciana", ped.texto, T().correoPedido());
      a.rel = "noopener"; document.body.appendChild(a); a.click(); a.remove();
    } else {
      let w = null;
      try { w = window.open(ped.whatsURL, "_blank"); } catch (err) { w = null; }
      if (w) { try { w.opener = null; } catch (err) {} } else aperturaFallida = true;
    }
    LV.rutas.ir(LV.rutas.url.hecho());
  });

  const alCambiarCesta = () => refrescar();
  document.addEventListener("lv:cesta-cambiada", alCambiarCesta);
  limpiar.push(() => document.removeEventListener("lv:cesta-cambiada", alCambiarCesta));

  // estado inicial
  ["nombre", "tel", "email", "dir", "cp", "loc"].forEach(k => { if (form.elements[k] && form.elements[k].value) tocado.add(k); });
  marcarHechos();
}

LV.vistas.pedido = {
  titulo: () => "Hacer el pedido",
  html: () => T().vacia() ? htmlVacio() : htmlPedido(),
  montar(main){ montarPedido(main); },
  desmontar(){ limpiar.forEach(f => { try { f(); } catch (e) {} }); limpiar = []; }
};

/* ---------------- confirmación ---------------- */
function fechaBonita(iso){
  try {
    const f = new Date(iso);
    const dia = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", timeZone: "Europe/Madrid" }).format(f);
    const hora = new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid" }).format(f);
    return `el ${dia} a las ${hora}`;
  } catch (e) { return ""; }
}
function htmlCheck(){
  return `<svg class="ped-check" viewBox="0 0 72 72" aria-hidden="true">
    <circle class="ped-check__fondo" cx="36" cy="36" r="34"/>
    <circle class="ped-check__aro" cx="36" cy="36" r="34" pathLength="100"/>
    <path class="ped-check__marca" d="M22 37.5l9.5 9.5L51 27" pathLength="100"/>
  </svg>`;
}
function htmlConfirmacion(){
  const ped = T().ultimoPedido();
  if (!ped || !Array.isArray(ped.lineas) || !ped.lineas.length) {
    return `<div class="ped ped--vacio contenedor">
      <h1 data-titular>No hay ningún pedido preparado</h1>
      <p class="t-entradilla ped-vacio__txt">Cuando prepare un pedido desde su cesta, lo verá aquí.</p>
      <div class="ped-vacio__botones">
        <a class="boton boton--primario" href="${LV.rutas.url.pedido()}">Ir a mi pedido</a>
        <a class="boton boton--secundario" href="${LV.rutas.url.categoria("merceria")}">Ver la mercería</a>
      </div>
      <p class="ped-vacio__tel">¿Prefiere pedirlo por teléfono? Llame al <a href="${U().telURL()}">${telTxt()}</a>.</p>
    </div>`;
  }
  const dat = ped.datos || {}, correo = dat.pago === "correo", tarjeta = dat.pago === "tarjeta";
  if (tarjeta) return htmlPagado(ped);
  const urlReabrir = correo ? U().correoURL("Pedido en La Valenciana", ped.texto, T().correoPedido(ped.lineas)) : ped.whatsURL;
  const cuando = fechaBonita(ped.fecha);
  const entregaTxt = dat.entrega === "casa"
    ? `Envío a ${esc([dat.dir, [dat.cp, dat.loc].filter(Boolean).join(" ")].filter(Boolean).join(", "))}`
    : "Recogida en la tienda, calle Moreno Nieto, 7";
  const yaVacia = T().vacia();
  return `<div class="ped ped-hecho contenedor">
  <div class="ped-hecho__cab">
    ${htmlCheck()}
    <h1 data-titular>Su pedido está preparado</h1>
    <p class="t-entradilla ped-hecho__entradilla">${correo
      ? "Falta un paso: pulse «Enviar» en su correo para que nos llegue."
      : "Falta un paso: pulse «Enviar» en WhatsApp para que nos llegue."}</p>
    ${aperturaFallida && !correo ? `<div class="aviso aviso--error ped-hecho__fallo" role="alert">${ic("aviso")}<p>Parece que WhatsApp no se ha abierto. Copie su pedido o llámenos al ${telTxt()}.</p></div>` : ""}
    <div class="ped-hecho__botones">
      <a class="boton boton--primario boton--grande" href="${esc(urlReabrir)}"${correo ? "" : ' target="_blank" rel="noopener"'}>${ic(correo ? "correo" : "whats")}<span>${correo ? "Abrir el correo de nuevo" : "Abrir WhatsApp de nuevo"}</span>${correo ? "" : '<span class="visualmente-oculto"> (se abre en otra ventana)</span>'}</a>
      <button type="button" class="boton boton--secundario boton--grande" data-hecho="copiar">${ic("check").replace('class="ico"', 'class="ico ped-copiado-ico"')}<span>Copiar el pedido</span></button>
    </div>
    ${aperturaFallida && !correo ? "" : `<p class="ped-hecho__nota">¿No se ha abierto ${correo ? "su correo" : "WhatsApp"}? Copie el pedido y envíenoslo como prefiera, o llámenos al <a href="${U().telURL()}">${telTxt()}</a>.</p>`}
    <div class="ped-hecho__vaciar" data-hecho="bloque-vaciar">${yaVacia
      ? `<p class="ped-hecho__vacia">${ic("check")}<span>Su cesta ya está vacía.</span></p>`
      : `<p>¿Ya lo ha enviado?</p><button type="button" class="boton boton--texto" data-hecho="vaciar">Sí, vaciar mi cesta</button>`}</div>
  </div>

  <section class="ped-hecho__resumen" aria-labelledby="ped-hecho-rt" data-r>
    <h2 id="ped-hecho-rt">Resumen del pedido</h2>
    ${cuando ? `<p class="ped-hecho__fecha">Preparado ${esc(cuando)}.</p>` : ""}
    <ul class="ped-lineas ped-lineas--hecho">${ped.lineas.map(l => {
      const prod = D().producto(l.id);
      const vi = prod ? D().idxVariante(prod, l.v) : 0;
      return `<li class="ped-linea">
        ${prod ? `<span class="ped-mini" aria-hidden="true" style="background:${D().lienzo(prod)}">${mini(prod, vi)}</span>` : `<span class="ped-mini" aria-hidden="true"></span>`}
        <span class="ped-linea__txt">
          <span class="ped-linea__nombre">${esc(String(l.nombre || "").replace(/\s*\(metro\)$/i, ""))}</span>
          <span class="ped-linea__detalle">${esc([String(l.textoVersion || "").replace(/ · /g, ", "), l.textoCantidad].filter(Boolean).join(", "))}</span>
        </span>
        <span class="ped-linea__importe">${euros(l.importe)}</span>
      </li>`;
    }).join("")}</ul>
    <dl class="ped-cifras">
      <div><dt>Productos</dt><dd>${euros(ped.subtotal)}</dd></div>
      <div><dt>Entrega</dt><dd${ped.envio ? "" : ' class="ped-gratis"'}>${ped.envio ? euros(ped.envio) : "Gratis"}</dd></div>
      <div class="ped-cifras__total"><dt>Total <span>(IVA incluido)</span></dt><dd>${euros(ped.total)}</dd></div>
    </dl>
    <dl class="ped-hecho__datos">
      <div><dt>Entrega</dt><dd>${entregaTxt}</dd></div>
      ${dat.nombre ? `<div><dt>A nombre de</dt><dd>${esc(dat.nombre)}</dd></div>` : ""}
      ${dat.tel ? `<div><dt>Teléfono</dt><dd>${esc(dat.tel)}</dd></div>` : ""}
    </dl>
    <details class="ped-hecho__texto">
      <summary>${ic("abajo")}<span>Ver el texto del pedido</span></summary>
      <pre>${esc(ped.texto)}</pre>
    </details>
  </section>

  <section class="ped-hecho__siguiente" aria-labelledby="ped-hecho-st" data-r>
    <h2 id="ped-hecho-st">Y ahora</h2>
    <p>Le llamaremos o escribiremos para confirmar el pago y la entrega.</p>
    <p>¿Prefiere llamar? <a href="${U().telURL()}">${telTxt()}</a>. ${esc(U().horarioResumen())}</p>
    <p class="ped-estado${U().estadoTienda().abierto ? " ped-estado--abierto" : ""}">${esc(U().estadoTienda().txt)}.</p>
    <a class="boton boton--secundario" href="${LV.rutas.url.inicio()}">Volver al inicio</a>
  </section>
</div>`;
}

/* confirmación de un pedido pagado con tarjeta o PayPal (importe reservado) */
function htmlPagado(ped){
  const dat = ped.datos || {};
  const cuando = fechaBonita(ped.fecha);
  const lugar = dat.entrega === "casa"
    ? `Se lo enviamos a ${esc([dat.dir, [dat.cp, dat.loc].filter(Boolean).join(" ")].filter(Boolean).join(", "))} y le mandamos el número de seguimiento.`
    : `Le avisamos al ${esc(dat.tel || "teléfono que nos ha dado")} para que lo recoja en la calle Moreno Nieto, 7.`;
  const aviso = [`Hola, La Valenciana. He hecho el pedido ${dat.ref || ""} en la web y lo he pagado con tarjeta${dat.paypal ? ` (PayPal ${dat.paypal})` : ""}.`, `Nombre: ${dat.nombre || ""}`, `Teléfono: ${dat.tel || ""}`].join("\n");
  return `<div class="ped ped-hecho contenedor">
  <div class="ped-hecho__cab">
    ${htmlCheck()}
    <h1 data-titular>Pedido recibido. Gracias</h1>
    <p class="t-entradilla ped-hecho__entradilla">Hemos reservado ${euros(ped.total)} en su tarjeta, pero no se cobra hasta que comprobemos que tenemos todo. Si falta algo, le avisamos antes.</p>
    ${dat.ref ? `<p class="ped-hecho__ref">Número de pedido: <strong>${esc(dat.ref)}</strong></p>` : ""}
    <div class="ped-hecho__botones">
      <a class="boton boton--secundario boton--grande" href="${esc(U().whatsURL(aviso))}" target="_blank" rel="noopener">${ic("whats")}<span>Avisarnos por WhatsApp</span><span class="visualmente-oculto"> (se abre en otra ventana)</span></a>
    </div>
    <p class="ped-hecho__nota">${lugar} PayPal le enviará el justificante por correo.</p>
  </div>
  <section class="ped-hecho__resumen" aria-labelledby="ped-hecho-rt" data-r>
    <h2 id="ped-hecho-rt">Resumen del pedido</h2>
    ${cuando ? `<p class="ped-hecho__fecha">Pagado ${esc(cuando)}.</p>` : ""}
    <ul class="ped-lineas ped-lineas--hecho">${ped.lineas.map(l => `<li class="ped-linea">
        <span class="ped-linea__txt">
          <span class="ped-linea__nombre">${esc(String(l.nombre || "").replace(/\s*\(metro\)$/i, ""))}</span>
          <span class="ped-linea__detalle">${esc([String(l.textoVersion || "").replace(/ · /g, ", "), l.textoCantidad].filter(Boolean).join(", "))}</span>
        </span>
        <span class="ped-linea__importe">${euros(l.importe)}</span>
      </li>`).join("")}</ul>
    <dl class="ped-cifras">
      <div><dt>Productos</dt><dd>${euros(ped.subtotal)}</dd></div>
      <div><dt>Entrega</dt><dd${ped.envio ? "" : ' class="ped-gratis"'}>${ped.envio ? euros(ped.envio) : "Gratis"}</dd></div>
      <div class="ped-cifras__total"><dt>Total <span>(IVA incluido)</span></dt><dd>${euros(ped.total)}</dd></div>
    </dl>
  </section>
  <section class="ped-hecho__siguiente" aria-labelledby="ped-hecho-st" data-r>
    <h2 id="ped-hecho-st">Y ahora</h2>
    <p>Preparamos su pedido y le avisamos. ¿Alguna duda? Llámenos al <a href="${U().telURL()}">${telTxt()}</a>. ${esc(U().horarioResumen())}</p>
    <a class="boton boton--secundario" href="${LV.rutas.url.inicio()}">Volver al inicio</a>
  </section>
</div>`;
}

async function copiar(texto){
  try { if (navigator.clipboard && window.isSecureContext !== false) { await navigator.clipboard.writeText(texto); return true; } } catch (e) {}
  try {
    const ta = document.createElement("textarea");
    ta.value = texto; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand("copy"); ta.remove(); return ok;
  } catch (e) { return false; }
}

function montarConfirmacion(main){
  const raiz = main.querySelector(".ped-hecho"); if (!raiz) return;
  if (!raiz.querySelector("[data-hecho]")) return;
  const ped = T().ultimoPedido();
  let tCop = 0;
  raiz.addEventListener("click", async e => {
    const b = e.target.closest("[data-hecho]"); if (!b) return;
    if (b.dataset.hecho === "copiar") {
      const ok = await copiar(ped ? ped.texto : "");
      const span = b.querySelector("span");
      if (ok) {
        b.classList.add("ped--copiado"); span.textContent = "Copiado";
        U().anunciar("Pedido copiado. Puede pegarlo en WhatsApp o en un correo.");
        clearTimeout(tCop); tCop = setTimeout(() => { b.classList.remove("ped--copiado"); span.textContent = "Copiar el pedido"; }, 2500);
      } else {
        const det = raiz.querySelector(".ped-hecho__texto"); det.open = true;
        U().anunciar("No se ha podido copiar. Debajo tiene el texto del pedido para copiarlo a mano.", true);
      }
    }
    if (b.dataset.hecho === "vaciar") {
      T().vaciar();
      const bloque = raiz.querySelector('[data-hecho="bloque-vaciar"]');
      bloque.innerHTML = `<p class="ped-hecho__vacia" tabindex="-1">${ic("check")}<span>Hecho. Su cesta está vacía. Gracias por su pedido.</span></p>`;
      bloque.querySelector("p").focus();
      U().anunciar("Su cesta está vacía. Gracias por su pedido.");
    }
  });
  limpiar.push(() => clearTimeout(tCop));
}

LV.vistas.confirmacion = {
  titulo: () => "Pedido preparado",
  nav: () => "",
  html: () => htmlConfirmacion(),
  montar(main){ montarConfirmacion(main); },
  // el aviso «WhatsApp no se ha abierto» es solo para la visita que sigue al envío:
  // al salir de la confirmación se olvida (si vuelve más tarde, ve la nota normal)
  desmontar(){ aperturaFallida = false; limpiar.forEach(f => { try { f(); } catch (e) {} }); limpiar = []; }
};
})();
