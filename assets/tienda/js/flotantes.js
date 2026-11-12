/* =========================================================
   LA VALENCIANA · flotantes.js
   Botones flotantes de la web anterior: la cesta (aparece cuando
   lleva algo; en el móvil ya está en la barra inferior) y WhatsApp.
   La ruta #/legal lleva a las páginas legales completas.
   ========================================================= */
(() => {
"use strict";
const ic = n => (LV.IC && LV.IC[n]) || "";

function iniciar(){
  const caja = document.createElement("div");
  caja.className = "flotantes";
  caja.innerHTML = `
    <a class="flotante flotante--whats" href="${LV.util.whatsURL("Hola, La Valenciana")}" target="_blank" rel="noopener">${ic("whats")}<span>WhatsApp</span><span class="visualmente-oculto">: escríbanos (se abre en otra ventana)</span></a>
    <button type="button" class="flotante flotante--cesta" aria-haspopup="dialog" aria-controls="ces-panel" hidden>${ic("cesta")}<span>Cesta</span><span class="flotante__n" aria-hidden="true">0</span><span class="visualmente-oculto" data-flot-sr></span></button>`;
  document.body.appendChild(caja);
  const cesta = caja.querySelector(".flotante--cesta");
  cesta.addEventListener("click", e => { try { LV.cesta.abrir(e.currentTarget); } catch (x) {} });

  const contar = latido => {
    let n = 0; try { n = LV.tienda.articulos(); } catch (e) {}
    cesta.hidden = !n;
    const b = cesta.querySelector(".flotante__n");
    b.textContent = LV.util.num(n);
    cesta.querySelector("[data-flot-sr]").textContent = `, ${n} ${n === 1 ? "artículo" : "artículos"}`;
    if (latido && n) { cesta.classList.remove("flotante--late"); void cesta.offsetWidth; cesta.classList.add("flotante--late"); }
  };
  const ruta = () => {
    const h = location.hash || "#/";
    caja.classList.toggle("flotantes--ocultos", /^#\/(p\/|pedido)/.test(h));
  };
  document.addEventListener("lv:cesta-cambiada", e => contar(e.detail && e.detail.accion === "anadir"));
  document.addEventListener("lv:ruta-cambiada", ruta);
  contar(false); ruta();
}

/* la información legal completa está en páginas propias */
LV.vistas = LV.vistas || {};
LV.vistas.legal = {
  titulo: () => "Información legal",
  html: () => `<div class="contenedor" style="padding-block:4rem"><h1>Información legal</h1><p><a href="aviso-legal/">Aviso legal</a> · <a href="privacidad/">Privacidad</a> · <a href="cookies/">Cookies</a> · <a href="condiciones-de-venta/">Condiciones de venta</a></p></div>`,
  montar(){ location.replace("aviso-legal/"); }
};

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar, { once: true });
else iniciar();
})();
