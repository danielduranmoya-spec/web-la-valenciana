/* =========================================================
   LA VALENCIANA v2 · pie.js · PROPIETARIO: B1
   Pie de página (DISENO §6 «Pie»): pespunte arriba, rosa velo con lino,
   4 columnas (La tienda · Comprar · Ayuda · Pídalo por WhatsApp),
   línea final en cursiva + «Subir arriba».
   API: LV.pie.iniciar()
   ========================================================= */
window.LV = window.LV || {};
LV.pie = (() => {
"use strict";
let iniciado = false;

function html(){
  const U = LV.util, T = LV.datos.TIENDA, IC = LV.IC || {}, R = LV.rutas.url;
  const tel = T.tel.replace(/ /g, "&nbsp;"), wa = T.whatsTxt.replace(/ /g, "&nbsp;");
  const anio = new Date().getFullYear();
  return `<hr class="pespunte pie-pespunte" aria-hidden="true">
  <div class="pie con-lino">
    <div class="contenedor">
      <p class="pie-marca">La Valenciana</p>
      <div class="rejilla pie-rejilla">
        <section class="pie-col pie-col--tienda" aria-labelledby="pie-t1">
          <h2 class="pie-t" id="pie-t1">La tienda</h2>
          <address class="pie-dir">${U.esc(T.calle)}<br>${U.esc(T.cp)} ${U.esc(T.ciudad)} (${U.esc(T.provincia || "Badajoz")})</address>
          <p class="pie-estado" data-pie-estado></p>
          <p class="pie-horario">De lunes a sábado,<br>de 10:00&nbsp;a&nbsp;14:00 y de 17:00&nbsp;a&nbsp;20:00.<br>Domingos y festivos, cerrado.</p>
          <ul class="pie-contacto">
            <li><a class="pie-enlace" href="${U.telURL()}">${IC.tel || ""}<span><span class="visualmente-oculto">Teléfono: </span>${tel}</span></a></li>
            <li><a class="pie-enlace" href="${U.whatsURL()}" target="_blank" rel="noopener">${IC.whats || ""}<span>WhatsApp: ${wa}</span></a></li>
            <li><a class="pie-enlace" href="mailto:${U.esc(T.correo)}">${IC.correo || ""}<span><span class="visualmente-oculto">Correo: </span>${U.esc(T.correo)}</span></a></li>
            <li><a class="pie-enlace" href="mailto:${U.esc(T.correoMerceria)}">${IC.correo || ""}<span><span class="visualmente-oculto">Pedidos de </span>Mercería: ${U.esc(T.correoMerceria)}</span></a></li>
            <li><a class="pie-enlace" href="mailto:${U.esc(T.correoComplementos)}">${IC.correo || ""}<span><span class="visualmente-oculto">Pedidos de </span>Complementos: ${U.esc(T.correoComplementos)}</span></a></li>
            <li><a class="pie-enlace" href="${U.esc(T.mapa)}" target="_blank" rel="noopener">${IC.mapa || ""}<span>Cómo llegar</span></a></li>
          </ul>
        </section>
        <nav class="pie-col pie-col--comprar" aria-labelledby="pie-t2">
          <h2 class="pie-t" id="pie-t2">Comprar</h2>
          <ul class="pie-lista">
            <li><a class="pie-enlace" href="${R.categoria("merceria")}" data-nav><span>Mercería</span></a></li>
            <li><a class="pie-enlace" href="${R.categoria("complementos")}" data-nav><span>Complementos</span></a></li>
            <li><a class="pie-enlace" href="${R.categoria("capsulas")}" data-nav><span>Cápsulas</span></a></li>
            <li><a class="pie-enlace" href="${R.colores()}" data-nav><span>Buscar por color</span></a></li>
            <li><a class="pie-enlace" href="${R.novedades()}" data-nav><span>Novedades</span></a></li>
          </ul>
        </nav>
        <nav class="pie-col pie-col--ayuda" aria-labelledby="pie-t3">
          <h2 class="pie-t" id="pie-t3">Ayuda</h2>
          <ul class="pie-lista">
            <li><a class="pie-enlace" href="${R.comoComprar()}" data-nav><span>Cómo comprar</span></a></li>
            <li><a class="pie-enlace" href="envios-y-devoluciones/"><span>Envíos y devoluciones</span></a></li>
            <li><a class="pie-enlace" href="condiciones-de-venta/"><span>Condiciones de venta</span></a></li>
            <li><a class="pie-enlace" href="${R.horario()}" data-nav><span>Horario</span></a></li>
            <li><a class="pie-enlace" href="${R.redes()}" data-nav><span>Redes sociales</span></a></li>
            <li><a class="pie-enlace" href="${R.visitanos()}" data-nav><span>Visítenos</span></a></li>
            <li><a class="pie-enlace" href="aviso-legal/"><span>Aviso legal</span></a></li>
            <li><a class="pie-enlace" href="privacidad/"><span>Privacidad</span></a></li>
            <li><a class="pie-enlace" href="cookies/"><span>Cookies</span></a></li>
            <li><a class="pie-enlace" href="accesibilidad/"><span>Accesibilidad</span></a></li>
          </ul>
        </nav>
        <section class="pie-col pie-col--whats" aria-labelledby="pie-t4">
          <h2 class="pie-t" id="pie-t4">Pídalo por WhatsApp</h2>
          <p class="pie-frase">Díganos qué necesita y se lo preparamos para recoger o se lo enviamos a casa. Envío ${U.euros(T.envio).replace(" ", "&nbsp;")}, gratis desde ${T.envioGratis}&nbsp;€.</p>
          <a class="boton boton--secundario pie-boton" href="${U.whatsURL("Hola, quería hacer un pedido.")}" target="_blank" rel="noopener">${IC.whats || ""}<span>Escribir por WhatsApp</span></a>
          <p class="pie-nota">En la web puede pagar con tarjeta o PayPal. Por WhatsApp, paga al recoger o por Bizum.</p>
        </section>
      </div>
      <div class="pie-final">
        <p class="pie-lema">Cuatro generaciones de la familia Díaz detrás del mostrador.</p>
        <div class="pie-final__der">
          <p class="pie-legal">© ${anio} La Valenciana, Almendralejo</p>
          <button type="button" class="boton boton--texto pie-subir">${IC.flechaArr || ""}<span>Subir arriba</span></button>
        </div>
      </div>
    </div>
  </div>`;
}

function actualizarEstado(raiz){
  let e = null; try { e = LV.util.estadoTienda(); } catch (x) {}
  LV.util.$$("[data-pie-estado]", raiz).forEach(p => {
    p.textContent = e ? e.txt + "." : "";
    p.classList.toggle("pie-estado--abierto", !!(e && e.abierto));
  });
}

function iniciar(){
  if (iniciado) return;
  const pie = document.getElementById("pie");
  if (!pie) return;
  iniciado = true;
  pie.innerHTML = html();
  actualizarEstado(pie);
  setInterval(() => actualizarEstado(pie), 60000);
  pie.addEventListener("click", e => {
    if (!e.target.closest(".pie-subir")) return;
    const suave = !(LV.util.reducido && LV.util.reducido());
    window.scrollTo({ top: 0, behavior: suave ? "smooth" : "auto" });
    const logo = document.querySelector("#cabecera .cab-logo");
    if (logo) { try { logo.focus({ preventScroll: true }); } catch (x) { logo.focus(); } }
  });
}

return { iniciar };
})();
