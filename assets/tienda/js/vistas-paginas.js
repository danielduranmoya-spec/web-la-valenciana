/* =========================================================
   LA VALENCIANA v2 · vistas/paginas.js · PROPIETARIO: B3
   LV.vistas.comoComprar, .visitanos, .legal, .noEncontrada
   (DISENO §7.7–7.10, textos §10). Usa LV.ed (portada-secciones.js).
   ========================================================= */
(() => {
"use strict";
const U = () => LV.util, D = () => LV.datos, R = () => LV.rutas;
const ic = n => (LV.IC && LV.IC[n]) || "";
const esc = s => LV.util.esc(s);
const E = () => LV.ed || {};
const nb = s => (E().nb ? E().nb(s) : s);
const eur = n => U().euros(n).replace(/,00(?=\s)/, "").replace(/\s/g, "&nbsp;");

/* ---------- piezas comunes ---------- */
function dibujo(icono, color, alt = ""){
  try {
    if (LV.ilus && LV.ilus.icono) return LV.ilus.icono(icono, color, { decorativa: !alt, lino: false });
  } catch (e) { console.error("[B3] LV.ilus.icono falló", e); }
  return "";
}
function pieza(icono, color){
  try { if (LV.ilus && LV.ilus.pieza) return `<svg viewBox="0 0 200 200" aria-hidden="true" focusable="false">${LV.ilus.pieza(icono, color)}</svg>`; } catch (e) { console.error(e); }
  return dibujo(icono, color);
}
const COLOR = n => (D().COL && D().COL[n]) || "#E9B9C3";

function bandaContacto(titulo, texto, { conWhats = true } = {}){
  const id = U().uid("pag-banda");
  return `<section class="pag-banda seccion seccion--rosa" aria-labelledby="${id}">
  <div class="contenedor pag-banda__rejilla">
    <div data-r>
      <h2 id="${id}">${titulo}</h2>
      <p class="pag-banda__texto">${texto}</p>
    </div>
    <div class="pag-banda__botones" data-r data-r-retardo="150">
      ${conWhats && E().whats ? E().whats("boton--primario boton--grande", "Escribir por WhatsApp") : ""}
      <a class="boton ${conWhats ? "boton--secundario" : "boton--primario"} boton--grande" href="${U().telURL()}">${ic("tel")}<span>Llamar a la tienda</span></a>
    </div>
  </div>
</section>`;
}
const cabeza = (titulo, entradilla, extra = "") => `<header class="pag-cabeza">
  <h1 data-titular>${titulo}</h1>
  ${entradilla ? `<p class="t-entradilla pag-cabeza__entradilla" data-r data-r-retardo="250">${entradilla}</p>` : ""}${extra}
</header>`;

/* =================================================================
   CÓMO COMPRAR (§7.7)
   ================================================================= */
const GUIAS = [
  { t:"Cómo elegir el hilo", icono:"bobina", color:"Rosa empolvado",
    x:"Para coser a mano o a máquina en prendas corrientes, un hilo de poliéster multiuso sirve para casi todo. Escoja un tono algo más oscuro que la tela: al coser se ve más claro. Para botones y telas gruesas, use hilo reforzado. Si duda, traiga un recorte de tela o envíenos una foto por WhatsApp y lo emparejamos." },
  { t:"Cómo medir una cremallera", icono:"cremallera", color:"Azul marino",
    x:"Se mide la parte dentada, desde el tope de arriba hasta el de abajo, con la cremallera cerrada y sin contar las cintas de tela. Si es para sustituir otra, mida la vieja así y fíjese en si es separable (chaquetas) o cerrada (faldas y pantalones). Ante la duda, pida un centímetro de más: se recorta." },
  { t:"Medias y pantis: qué talla pedir", icono:"media", color:"Carne",
    x:"Casi todas las tallas se guían por la estatura y el peso, no por el número de calzado. Si está entre dos tallas, elija la mayor: una media justa se tensa y se rompe antes. Si tiene dudas, díganos su estatura y su peso por teléfono o por WhatsApp y le aconsejamos. Recuerde que las medias con el envase abierto no admiten cambio." }
];
function preguntas(){
  const T = D().TIENDA;
  return [
    ["¿Cuánto cuesta el envío?", `El envío a la Península cuesta ${eur(T.envio)}. Si su pedido llega a ${eur(T.envioGratis)}, el envío es gratis. Recoger en la tienda no cuesta nada.`],
    ["¿Cuánto tarda en llegar?", `Entre ${esc(T.plazoEnvio)}. Si hace el pedido antes de las ${T.horaCorte}:00 en un día laborable, sale de la tienda ese mismo día.`],
    ["¿Tengo que registrarme o crear una cuenta?", "No. Solo le pedimos su nombre y un teléfono para confirmar el pedido con usted."],
    ["¿Puedo pagar con tarjeta, Bizum o PayPal?", "Sí. En la web paga con tarjeta de débito o crédito (sin cuenta de PayPal) o con PayPal; solo reservamos el importe y no se cobra hasta que comprobemos que tenemos todo. Si envía el pedido por WhatsApp, puede pagar por Bizum cuando se lo confirmemos. En la tienda puede pagar como siempre."],
    ["¿Cortan la cinta o el elástico a la medida?", "Sí. Los artículos por metros se piden de medio metro en medio metro: 0,5 m, 1 m, 1,5 m… Si necesita otra medida, díganoslo en las notas del pedido. Lo que se corta a medida no admite cambio."],
    ["¿Y si quiero muchas unidades?", "En la web puede pedir hasta 20 unidades de cada artículo. Para más, llámenos y le hacemos precio."],
    ["No encuentro lo que busco. ¿Qué hago?", `Escríbanos por WhatsApp al ${nb(esc(T.whatsTxt))} o llame al ${nb(esc(T.tel))}. A veces lo tenemos en la tienda y aún no está en la web; si no, se lo buscamos.`]
  ];
}
function comoComprarHTML(){
  const T = D().TIENDA, id = U().uid("pag");
  const indice = [["envios","Envíos y plazos"],["recogida","Recogida en tienda"],["pago","Formas de pago"],["cambios","Cambios y devoluciones"],["telefono","Pedir por teléfono o WhatsApp"],["guias","Guías breves"],["preguntas","Preguntas frecuentes"]];
  const sec = (k, titulo, cuerpo) => `<section class="pag-bloque" id="${id}-${k}" aria-labelledby="${id}-${k}-t" data-r><h2 id="${id}-${k}-t">${titulo}</h2>${cuerpo}</section>`;
  return `<div class="pag pag--comprar">
${E().comprarHTML ? E().comprarHTML({ h1: true, envios: `#${id}-envios` }) : cabeza("Cómo comprar", "")}
<div class="contenedor--estrecho">
  <nav class="pag-indice" aria-label="En esta página" data-r>
    <p class="pag-indice__titulo">En esta página</p>
    <ul>${indice.map(([k, t]) => `<li><a class="boton boton--texto" href="#${id}-${k}">${t}</a></li>`).join("")}</ul>
  </nav>
  ${sec("envios", "Envíos y plazos", `<p>Enviamos a toda la Península por ${eur(T.envio)}. <strong>Desde ${eur(T.envioGratis)}, el envío es gratis.</strong> El pedido llega en ${esc(T.plazoEnvio)}; si lo hace antes de las ${T.horaCorte}:00, sale de la tienda el mismo día.</p><p>Para Baleares, Canarias, Ceuta o Melilla, llámenos y le decimos el coste.</p>`)}
  ${sec("recogida", "Recogida en tienda", `<p>Elija «Lo recojo en la tienda» al hacer el pedido. Es gratis. Le avisamos cuando esté preparado y lo recoge en ${esc(T.calle)}, en horario de tienda.</p><div class="pag-horario">${E().estadoHTML ? E().estadoHTML() : ""}${E().horarioHTML ? E().horarioHTML() : ""}</div>`)}
  ${sec("pago", "Formas de pago", `<div class="aviso" role="note">${ic("info")}<p>Puede pagar con tarjeta o PayPal en la web: solo reservamos el importe y no se cobra hasta que comprobemos que tenemos todo. Si lo prefiere, envíenos el pedido por WhatsApp o por correo y pague al recoger o por Bizum.</p></div>
    <ul class="pag-lista"><li><strong>Tarjeta o PayPal</strong>: en el último paso del pedido, en la ventana segura de PayPal.</li><li><strong>Por WhatsApp</strong>: el pedido se escribe solo; usted solo tiene que pulsar «Enviar».</li><li><strong>Por correo electrónico</strong>: se abre su correo con el pedido escrito.</li><li><strong>Bizum</strong>: cuando le confirmemos el pedido por WhatsApp.</li><li><strong>En la tienda</strong>: al recoger, como siempre.</li></ul>`)}
  ${sec("cambios", "Cambios y devoluciones", `<p>Tiene ${T.diasCambio} días para cambiarlo. No admitimos cambios de medias, calcetines ni ropa interior con el precinto abierto, ni de artículos cortados a medida.</p><p>Para hacer un cambio, tráigalo a la tienda con el artículo en buen estado o llámenos y le decimos cómo enviárnoslo.</p>`)}
  ${sec("telefono", "Pedir por teléfono o WhatsApp", `<p>Si lo prefiere, llámenos al <a href="${U().telURL()}">${nb(esc(T.tel))}</a> o escríbanos por WhatsApp al <a href="${U().whatsURL()}" target="_blank" rel="noopener">${nb(esc(T.whatsTxt))}</a>. Díganos qué necesita y se lo preparamos. Si duda con un color, envíenos una foto.</p>`)}
  <section class="pag-bloque" id="${id}-guias" aria-labelledby="${id}-guias-t">
    <h2 id="${id}-guias-t" data-r>Guías breves</h2>
    <div class="pag-guias" data-r-grupo>
      ${GUIAS.map(g => `<article class="pag-guia" data-r><div class="pag-guia__dibujo">${dibujo(g.icono, COLOR(g.color))}</div><div><h3>${g.t}</h3><p>${g.x}</p></div></article>`).join("")}
    </div>
  </section>
  <section class="pag-bloque" id="${id}-preguntas" aria-labelledby="${id}-preguntas-t">
    <h2 id="${id}-preguntas-t" data-r>Preguntas frecuentes</h2>
    <div class="pag-preguntas" data-r>
      ${preguntas().map(([q, a], i) => { const k = `${id}-faq-${i}`, ab = i === 0; return `<div class="acordeon${ab ? " acordeon--abierto" : ""}">
        <h3 class="acordeon__titulo"><button type="button" class="acordeon__boton" id="${k}-b" aria-expanded="${ab}" aria-controls="${k}"><span>${q}</span><span class="acordeon__icono" aria-hidden="true"></span></button></h3>
        <div class="acordeon__panel" id="${k}" role="region" aria-labelledby="${k}-b"${ab ? "" : " inert"}><div class="acordeon__interior"><div class="acordeon__contenido"><p>${a}</p></div></div></div>
      </div>`; }).join("")}
    </div>
  </section>
</div>
${bandaContacto("¿Prefiere que se lo preparemos nosotros?", `Llámenos o escríbanos y díganos qué necesita. Le atendemos de lunes a sábado, de 10:00 a 14:00 y de 17:00 a 20:00.`)}
</div>`;
}

/* =================================================================
   VISÍTENOS (§7.8)
   ================================================================= */
function visitanosHTML(){
  const T = D().TIENDA, id = U().uid("pag");
  return `<div class="pag pag--visitanos">
<div class="contenedor">
  ${cabeza("Visítenos", "Estamos en la calle Moreno Nieto, 7, a un paso de la Plaza de la Iglesia. Venga a vernos: le atendemos con calma.")}
  <div class="rejilla pag-visita">
    <div class="pag-visita__mapa">${E().mapa ? E().mapa({ grande: true }) : ""}</div>
    <div class="pag-visita__datos" data-r-grupo>
      <section aria-labelledby="${id}-dir" data-r>
        <h2 id="${id}-dir" class="pag-visita__h">Dirección</h2>
        <address class="ed-direccion">${esc(T.calle)}.<br>${esc(T.cp)} ${esc(T.ciudad)} (${esc(T.provincia || "Badajoz")})</address>
        <div class="ed-botones">${E().comoLlegar ? E().comoLlegar() : ""}</div>
      </section>
      <section aria-labelledby="${id}-hor" data-r>
        <h2 id="${id}-hor" class="pag-visita__h">Horario</h2>
        ${E().estadoHTML ? E().estadoHTML() : ""}
        ${E().horarioHTML ? E().horarioHTML() : ""}
      </section>
      <section aria-labelledby="${id}-con" data-r>
        <h2 id="${id}-con" class="pag-visita__h">Teléfono, WhatsApp y correo</h2>
        ${E().contactoHTML ? E().contactoHTML() : ""}
      </section>
    </div>
  </div>
</div>
${bandaContacto("Pida por teléfono y recójalo en la tienda", `Díganos qué necesita y se lo dejamos preparado. Recogerlo no cuesta nada.`)}
</div>`;
}


/* =================================================================
   HORARIO (apartado propio, petición del cliente)
   ================================================================= */
function hhmm(h){ const H = Math.floor(h), M = Math.round((h - H) * 60); return `${String(H).padStart(2, "0")}:${String(M).padStart(2, "0")}`; }
function horarioPaginaHTML(){
  const T = D().TIENDA, id = U().uid("pag");
  const NOMBRES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  let hoy = new Date().getDay();
  try { const a = U().ahoraMadrid && U().ahoraMadrid(); if (a && typeof a.dia === "number") hoy = a.dia; else if (a && typeof a.d === "number") hoy = a.d; } catch (e) {}
  const filas = [1, 2, 3, 4, 5, 6, 0].map(d => {
    const t = T.horario[d] || [];
    const man = t[0] ? `${hhmm(t[0][0])} a ${hhmm(t[0][1])}` : "Cerrado";
    const tar = t[1] ? `${hhmm(t[1][0])} a ${hhmm(t[1][1])}` : (t.length ? "Cerrado" : "Cerrado");
    const esHoy = d === hoy;
    return `<tr${esHoy ? ' class="pag-hor__hoy"' : ""}><th scope="row">${NOMBRES[d]}${esHoy ? ' <span class="pag-hor__marca">hoy</span>' : ""}</th><td>${man}</td><td>${tar}</td></tr>`;
  }).join("");
  const fmt = f => { try { const d = new Date(f + "T12:00:00"); return d.toLocaleDateString("es-ES", { day: "numeric", month: "long" }) + " (" + d.toLocaleDateString("es-ES", { weekday: "long" }) + ")"; } catch (e) { return f; } };
  const hoyISO = new Date().toISOString().slice(0, 10);
  const proximos = (T.festivos || []).filter(f => f >= hoyISO).slice(0, 4);
  return `<div class="pag pag--horario">
<div class="contenedor">
  ${cabeza("Horario de apertura y cierre", "Abrimos de lunes a sábado, por la mañana y por la tarde. Domingos y festivos, cerrado.")}
  <div class="pag-hor">
    <section class="pag-hor__tabla" aria-labelledby="${id}-sem" data-r>
      <h2 id="${id}-sem" class="pag-hor__h">La semana en la tienda</h2>
      ${E().estadoHTML ? `<div class="pag-hor__estado">${E().estadoHTML()}</div>` : ""}
      <table class="pag-hor__t">
        <caption class="visualmente-oculto">Horario de La Valenciana por días</caption>
        <thead><tr><th scope="col">Día</th><th scope="col">Mañana</th><th scope="col">Tarde</th></tr></thead>
        <tbody>${filas}</tbody>
      </table>
    </section>
    <div class="pag-hor__lado" data-r-grupo>
      <section class="pag-hor__tarjeta" aria-labelledby="${id}-man" data-r>
        <p class="pag-hor__franja">Mañanas</p>
        <p class="pag-hor__horas" id="${id}-man">10:00 – 14:00</p>
        <p class="pag-hor__nota">De lunes a sábado</p>
      </section>
      <section class="pag-hor__tarjeta" aria-labelledby="${id}-tar" data-r>
        <p class="pag-hor__franja">Tardes</p>
        <p class="pag-hor__horas" id="${id}-tar">17:00 – 20:00</p>
        <p class="pag-hor__nota">De lunes a sábado</p>
      </section>
      <section class="pag-hor__tarjeta pag-hor__tarjeta--cerrado" aria-labelledby="${id}-cer" data-r>
        <p class="pag-hor__franja">Cerrado</p>
        <p class="pag-hor__horas pag-hor__horas--texto" id="${id}-cer">Domingos y festivos</p>
        ${proximos.length ? `<p class="pag-hor__nota">Próximos festivos: ${proximos.map(fmt).join("; ")}.</p>` : ""}
      </section>
    </div>
  </div>
  <p class="pag-hor__aviso" data-r>Puede escribirnos por WhatsApp a cualquier hora: le contestamos en cuanto abramos. En fiestas como la Feria o Navidad el horario puede cambiar; lo avisamos en nuestras <a href="${R().url.redes()}">redes sociales</a>.</p>
</div>
${bandaContacto("¿Viene a recoger un pedido?", "Llámenos antes y se lo tenemos preparado en el mostrador cuando llegue.")}
</div>`;
}

/* =================================================================
   REDES SOCIALES (apartado propio, petición del cliente)
   ================================================================= */
const ICONO_RED = {
  instagram: `<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><rect x="7" y="7" width="34" height="34" rx="10" fill="none" stroke="currentColor" stroke-width="2.6"/><circle cx="24" cy="24" r="8" fill="none" stroke="currentColor" stroke-width="2.6"/><circle cx="34" cy="14" r="2.2" fill="currentColor"/></svg>`,
  facebook: `<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><circle cx="24" cy="24" r="17" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M26.5 41V27h4.6l.7-5.3h-5.3v-3.3c0-1.5.5-2.6 2.7-2.6h2.8v-4.7a37 37 0 0 0-4.1-.2c-4.1 0-6.8 2.5-6.8 7v3.8H16.5V27h4.6v14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/></svg>`,
  tiktok: `<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M27 8v21.5a6.5 6.5 0 1 1-6.5-6.5" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><path d="M27 8c.6 4.8 3.8 8.2 8.8 8.6" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/></svg>`
};
function redesHTML(){
  const T = D().TIENDA, redes = T.redes || [];
  const tarjetas = redes.map(r => `<li class="pag-red pag-red--${esc(r.red)}" data-r>
      <span class="pag-red__icono">${ICONO_RED[r.red] || ""}</span>
      <h2 class="pag-red__nombre">${esc(r.nombre)}</h2>
      <p class="pag-red__usuario">${esc(r.usuario)}</p>
      <p class="pag-red__texto">${esc(r.texto)}</p>
      <a class="boton boton--secundario boton--ancho pag-red__boton" href="${esc(r.url)}" target="_blank" rel="noopener">
        <span>Ver en ${esc(r.nombre)}</span><span class="visualmente-oculto"> (se abre en otra ventana)</span></a>
    </li>`).join("");
  return `<div class="pag pag--redes">
<div class="contenedor">
  ${cabeza("Síganos en redes sociales", "Ahí contamos las novedades que llegan a la tienda, los avisos de horario en fiestas y algún que otro truco de costura.")}
  <ul class="pag-redes" role="list" data-r-grupo>${tarjetas}</ul>
  <p class="pag-hor__aviso" data-r>¿Prefiere hablar con una persona? Escríbanos por <a href="${U().whatsURL()}" target="_blank" rel="noopener">WhatsApp</a> o llame al <a href="${U().telURL()}">${nb(esc(T.tel))}</a>.</p>
</div>
${bandaContacto("¿Ha visto algo en nuestras redes?", "Mándenos la foto o el vídeo por WhatsApp y le decimos si lo tenemos y en qué colores.")}
</div>`;
}

/* =================================================================
   LEGAL (§7.9)
   ================================================================= */
function legalHTML(){
  const T = D().TIENDA, id = U().uid("pag");
  const S = [
    ["aviso", "Aviso legal", `<p>Esta web pertenece a La Valenciana, mercería y complementos, con domicilio en ${esc(T.dir)}. Puede escribirnos a <a href="mailto:${esc(T.correo)}">${esc(T.correo)}</a> o llamarnos al <a href="${U().telURL()}">${nb(esc(T.tel))}</a>.</p><p>Los datos del titular (razón social y NIF) se facilitan a quien los solicite en esa misma dirección de correo.</p><p>Los textos, ilustraciones y el diseño de esta web son de La Valenciana. No se pueden copiar para uso comercial sin nuestro permiso.</p>`],
    ["privacidad", "Privacidad", `<p>Esta web no tiene registro de usuarios ni guarda sus datos en ningún servidor.</p><p>Cuando hace un pedido, su nombre, teléfono y, si lo da, su dirección, viajan en el mensaje de WhatsApp o en el correo que usted mismo envía. Los usamos solo para preparar y entregar su pedido y para hablar con usted sobre él. No los cedemos a nadie, salvo a la empresa de transporte cuando hay envío a casa.</p><p>Puede pedirnos en cualquier momento que le digamos qué datos suyos tenemos, que los corrijamos o que los borremos, escribiendo a <a href="mailto:${esc(T.correo)}">${esc(T.correo)}</a>. También puede reclamar ante la Agencia Española de Protección de Datos.</p>`],
    ["cookies", "Cookies", `<p>No usamos cookies de publicidad ni de seguimiento.</p><p>Su navegador guarda en su propio equipo la cesta, el tamaño de letra que haya elegido y los datos del último pedido, para que no los pierda al volver. No nos llegan a nosotros. Puede borrarlos cuando quiera desde la configuración de su navegador.</p><p>Para mostrar el tipo de letra, la web lo descarga de Google Fonts; al hacerlo, Google recibe la dirección de internet de su equipo.</p>`],
    ["condiciones", "Condiciones de venta", `<p>Los precios incluyen el IVA. El envío a la Península cuesta ${eur(T.envio)} y es gratis a partir de ${eur(T.envioGratis)}. El plazo de entrega es de ${esc(T.plazoEnvio)}. Recoger en la tienda es gratis.</p><p>El pedido no es firme hasta que lo confirmamos con usted por teléfono, WhatsApp o correo. No se cobra nada antes. El pago con tarjeta, Bizum y PayPal desde la web estará disponible próximamente.</p><p>Tiene ${T.diasCambio} días para cambiarlo. No admitimos cambios de medias, calcetines ni ropa interior con el precinto abierto, ni de artículos cortados a medida.</p>`]
  ];
  return `<div class="pag pag--legal">
<div class="contenedor">
  ${cabeza("Aviso legal y privacidad", "Quiénes somos, qué hacemos con sus datos y en qué condiciones vendemos. Sin letra pequeña.")}
  <div class="pag-legal">
    <nav class="pag-legal__indice pag-indice" aria-label="Apartados" data-r>
      <p class="pag-indice__titulo">Apartados</p>
      <ul>${S.map(([k, t]) => `<li><a class="boton boton--texto" href="#${id}-${k}">${t}</a></li>`).join("")}</ul>
    </nav>
    <div class="pag-legal__texto">
      ${S.map(([k, t, x]) => `<section class="pag-bloque" id="${id}-${k}" aria-labelledby="${id}-${k}-t" data-r><h2 id="${id}-${k}-t">${t}</h2>${x}</section>`).join("")}
      <p class="pag-legal__fecha t-pequeno t-suave">Última revisión: noviembre de 2026.</p>
    </div>
  </div>
</div>
</div>`;
}

/* =================================================================
   404 (§7.10)
   ================================================================= */
function noEncontradaHTML(){
  const id = U().uid("pag-404");
  return `<div class="pag pag--404">
<div class="contenedor pag-404">
  <div class="pag-404__boton" aria-hidden="true"><div class="pag-404__rueda">${pieza("boton", COLOR("Rosa empolvado"))}</div><span class="pag-404__sombra"></span></div>
  <h1 data-titular>Aquí no hay nada</h1>
  <p class="t-entradilla pag-404__texto" data-r data-r-retardo="250">La página que busca no existe o ha cambiado de sitio.</p>
  <form class="pag-404__buscar" role="search" data-r data-r-retardo="350">
    <label class="campo__etiqueta" for="${id}-q">¿Qué estaba buscando?</label>
    <div class="pag-404__fila">
      <input class="campo__control" id="${id}-q" name="q" type="search" placeholder="Escriba aquí: botones, lana, medias…" autocomplete="off" enterkeyhint="search">
      <button class="boton boton--secundario" type="submit">${ic("buscar")}<span>Buscar</span></button>
    </div>
  </form>
  <div class="pag-404__botones" data-r data-r-retardo="450">
    <a class="boton boton--primario" href="${R().url.inicio()}">Ir al inicio</a>
    <a class="boton boton--secundario" href="${R().url.categoria("merceria")}">Ver la mercería</a>
  </div>
</div>
</div>`;
}

/* ---------- montaje ---------- */
let limpiar = [];
const desmontar = () => { limpiar.forEach(f => { try { f(); } catch (e) {} }); limpiar = []; };
/* acordeones: los activa B5 (LV.vistas.producto.acordeones); si aún no existe, este respaldo hace lo mismo */
function acordeones(main){
  try { if (LV.vistas.producto && LV.vistas.producto.acordeones) return LV.vistas.producto.acordeones(main); } catch (e) { console.error(e); }
  U().$$(".acordeon", main).forEach(a => {
    const b = a.querySelector(".acordeon__boton"), panel = a.querySelector(".acordeon__panel"); if (!b || !panel) return;
    b.addEventListener("click", () => { const abrir = b.getAttribute("aria-expanded") !== "true";
      b.setAttribute("aria-expanded", abrir); a.classList.toggle("acordeon--abierto", abrir); abrir ? panel.removeAttribute("inert") : panel.setAttribute("inert", ""); });
  });
}
const vigilar = main => { if (E().vigilarEstado) limpiar.push(E().vigilarEstado(main)); };

LV.vistas.comoComprar = { titulo: () => "Cómo comprar", html: comoComprarHTML, desmontar,
  montar(main){ vigilar(main); acordeones(main); } };
LV.vistas.visitanos = { titulo: () => "Visítenos", html: visitanosHTML, desmontar,
  montar(main){ vigilar(main); if (E().respaldoRev) limpiar.push(E().respaldoRev(main)); } };
LV.vistas.legal = { titulo: () => "Aviso legal y privacidad", html: legalHTML, desmontar };
LV.vistas.horario = { titulo: () => "Horario", html: horarioPaginaHTML, desmontar,
  montar(main){ vigilar(main); } };
LV.vistas.redes = { titulo: () => "Redes sociales", html: redesHTML, desmontar };
LV.vistas.noEncontrada = {
  titulo: () => "Página no encontrada",
  nav: () => "",
  html: noEncontradaHTML,
  montar(main){
    const f = main.querySelector(".pag-404__buscar"); if (!f) return;
    f.addEventListener("submit", e => {
      e.preventDefault();
      const q = (f.q.value || "").trim();
      if (!q) { f.q.focus(); return; }
      R().ir(R().url.buscar(q));
    });
  },
  desmontar
};
})();
