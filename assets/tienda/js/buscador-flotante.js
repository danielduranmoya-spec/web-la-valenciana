/* =========================================================
   LA VALENCIANA · buscador-flotante.js
   Buscador en ventana flotante (el de la web anterior), con el
   catálogo y la búsqueda tolerante de LV.buscador.
   Lo abren todos los botones [data-abre-buscador] y la tecla «/».
   API: LV.buscadorFlotante.abrir(origen?), .cerrar()
   ========================================================= */
window.LV = window.LV || {};
LV.buscadorFlotante = (() => {
"use strict";
const MAX = 30;
let dlg, campo, lista, estado, focoPrevio = null, t = 0;

const U = () => LV.util, D = () => LV.datos;
const esc = s => U().esc(s);
const ic = n => (LV.IC && LV.IC[n]) || "";
const ESTADO = { si: "En stock", pocas: "Últimas unidades", agotado: "Agotado" };

function crear(){
  dlg = document.createElement("dialog");
  dlg.className = "buscador";
  dlg.id = "buscador";
  dlg.setAttribute("aria-labelledby", "buscador-t");
  dlg.innerHTML = `
  <div class="buscador-cabeza">
    <h2 id="buscador-t">Buscar en la tienda</h2>
    <button type="button" class="buscador-cerrar" data-cerrar-buscador>Cerrar<span class="visualmente-oculto"> el buscador</span> <span aria-hidden="true">✕</span></button>
  </div>
  <div class="buscador-cuerpo">
    <label for="buscador-q">¿Qué busca?</label>
    <input id="buscador-q" type="search" autocomplete="off" spellcheck="false" enterkeyhint="search" placeholder="Por ejemplo: cremallera, lana, panty…" aria-describedby="buscador-estado">
    <p id="buscador-estado" class="buscador-estado" role="status" aria-live="polite">Escriba al menos 2 letras.</p>
    <ul class="buscador-resultados" role="list"></ul>
  </div>`;
  document.body.appendChild(dlg);
  campo = dlg.querySelector("input");
  lista = dlg.querySelector(".buscador-resultados");
  estado = dlg.querySelector(".buscador-estado");

  campo.addEventListener("input", () => { clearTimeout(t); t = setTimeout(buscar, 90); });
  campo.addEventListener("keydown", e => {
    if (e.key === "Enter") { e.preventDefault(); const a = lista.querySelector("a"); if (a) a.click(); }
    if (e.key === "ArrowDown") { const a = lista.querySelector("a"); if (a) { e.preventDefault(); a.focus(); } }
  });
  lista.addEventListener("keydown", e => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const as = [...lista.querySelectorAll("a")], i = as.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    if (e.key === "ArrowUp" && i === 0) campo.focus();
    else (as[i + (e.key === "ArrowDown" ? 1 : -1)] || as[i]).focus();
  });
  lista.addEventListener("click", e => { if (e.target.closest("a")) cerrar(false); });
  dlg.querySelector("[data-cerrar-buscador]").addEventListener("click", () => cerrar(true));
  dlg.addEventListener("click", e => { if (e.target === dlg) cerrar(true); });
  dlg.addEventListener("close", () => {
    document.documentElement.classList.remove("buscador-abierto");
    if (focoPrevio && focoPrevio.isConnected && focoPrevio.focus) { try { focoPrevio.focus({ preventScroll: true }); } catch (e) {} }
  });
}

function miniatura(prod){
  try {
    const v = (prod.variantes || []).find(x => x.c) || {};
    if (LV.ilus && LV.ilus.pieza) return `<svg class="bus-r__dibujo" viewBox="0 0 200 200" aria-hidden="true" focusable="false">${LV.ilus.pieza(prod.icono, v.c || "#DCC8AA")}</svg>`;
  } catch (e) {}
  return `<span class="bus-r__dibujo" aria-hidden="true"></span>`;
}

function buscar(){
  const q = campo.value.trim();
  lista.innerHTML = "";
  if (q.length < 2) { estado.textContent = "Escriba al menos 2 letras."; return; }
  let prods = [], subs = [];
  try {
    prods = LV.buscador.buscar(q).slice(0, MAX);
    subs = LV.buscador.sugerir(q, 0).subcategorias || [];
  } catch (e) { console.error("[buscador]", e); }
  const R = LV.rutas.url;
  const filas = subs.map(s => `<li><a class="bus-r bus-r--apartado" href="${R.categoria(s.cat, s.id)}">
      <span class="bus-r__nombre">${esc(s.n)}</span>
      <span class="bus-r__dato">${esc(D().categoria(s.cat).nombre)}</span>
      <span class="bus-r__flecha" aria-hidden="true">→</span></a></li>`)
    .concat(prods.map(p => {
      const colores = (p.variantes || []).filter(v => v.c).length;
      const extra = [colores > 1 ? `${colores} colores` : "", p.medidas && p.medidas.length > 1 ? `${p.medidas.length} ${p.tipoMedida === "talla" ? "tallas" : "medidas"}` : "", ESTADO[p.stock] || ""].filter(Boolean).join(" · ");
      return `<li><a class="bus-r" href="${R.producto(p.id)}">
      ${miniatura(p)}
      <span class="bus-r__nombre">${esc(p.nombre)}</span>
      <span class="bus-r__dato">${esc(extra)}</span>
      <span class="bus-r__precio">${esc(U().euros(p.precio))}${p.porMetro ? "<small>/m</small>" : ""}</span></a></li>`;
    }));
  lista.innerHTML = filas.join("");
  const n = prods.length;
  estado.textContent = n
    ? (n === 1 ? "1 artículo." : `${n}${n === MAX ? " o más" : ""} artículos.`)
    : (subs.length ? "Pruebe en el apartado de arriba." : "No hemos encontrado nada. Pregúntenos por WhatsApp: si no lo tenemos, se lo buscamos.");
}

function abrir(origen){
  if (!dlg) crear();
  if (dlg.open) return;
  focoPrevio = origen || document.activeElement;
  try { LV.ui && LV.ui.cerrarPaneles && LV.ui.cerrarPaneles(false); } catch (e) {}
  if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
  document.documentElement.classList.add("buscador-abierto");
  campo.focus();
  campo.select();
  buscar();
}
function cerrar(devolverFoco = true){
  if (!dlg || !dlg.open) return;
  if (!devolverFoco) focoPrevio = null;
  if (dlg.close) dlg.close(); else { dlg.removeAttribute("open"); dlg.dispatchEvent(new Event("close")); }
}

document.addEventListener("click", e => {
  const b = e.target.closest && e.target.closest("[data-abre-buscador]");
  if (!b) return;
  e.preventDefault();
  abrir(b);
});
document.addEventListener("keydown", e => {
  if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
  const a = document.activeElement;
  if (a && (/^(input|textarea|select)$/i.test(a.tagName) || a.isContentEditable)) return;
  if (document.querySelector("dialog[open]")) return;
  e.preventDefault(); abrir();
});
document.addEventListener("lv:ruta-saliendo", () => cerrar(false));

return { abrir, cerrar };
})();
