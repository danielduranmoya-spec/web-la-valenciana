/* =========================================================
   LA VALENCIANA v3 · efectos.js — animaciones extra de toda la web
   Barra de lectura, tarjetas que se inclinan con luz,
   pespunte que corre alrededor, botones imán con onda, títulos subrayados,
   piezas flotantes en las bandas y deriva de las ilustraciones.
   Todo se desactiva (o queda en fundidos) con «reducir movimiento».
   ========================================================= */
(() => {
"use strict";
const RM = () => { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } };
const RATON = () => { try { return matchMedia("(hover: hover) and (pointer: fine)").matches; } catch (e) { return false; } };
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- barra de lectura ---------- */
function progreso(){
  const b = document.createElement("div"); b.className = "fx-progreso"; b.setAttribute("aria-hidden", "true");
  document.body.appendChild(b);
  let raf = 0;
  const pintar = () => { raf = 0; const h = document.documentElement.scrollHeight - innerHeight; b.style.setProperty("--p", h > 0 ? Math.min(1, scrollY / h).toFixed(4) : 0); };
  addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(pintar); }, { passive: true });
  addEventListener("resize", pintar);
  document.addEventListener("lv:ruta-cambiada", () => setTimeout(pintar, 50));
  pintar();
}


/* ---------- tarjetas: inclinación 3D + luz (sin pespunte: no casaba con la estética) ---------- */
const SEL_TARJETA = ".tarjeta__lienzo, .por-tesela, .pag-red, .pag-hor__tarjeta, .mm-lienzo, .fic-formato";
function tarjetas(){
  const inclinar = RATON() && !RM();
  document.addEventListener("pointerover", e => {
    const el = e.target.closest && e.target.closest(SEL_TARJETA);
    if (!el || el.dataset.fx) return;
    el.dataset.fx = "1";
    el.classList.add("fx-luz");
    if (!inclinar) return;
    el.classList.add("fx-inclina");
    const mover = ev => {
      const r = el.getBoundingClientRect();
      const px = (ev.clientX - r.left) / r.width, py = (ev.clientY - r.top) / r.height;
      el.style.setProperty("--mx", (px * 100).toFixed(1) + "%"); el.style.setProperty("--my", (py * 100).toFixed(1) + "%");
      el.style.transform = `perspective(900px) rotateX(${((.5 - py) * 7).toFixed(2)}deg) rotateY(${((px - .5) * 9).toFixed(2)}deg) translateZ(0)`;
    };
    const salir = () => { el.style.transform = ""; };
    el.addEventListener("pointermove", mover);
    el.addEventListener("pointerleave", salir);
  }, { passive: true });
}

/* ---------- botones: imán + onda ---------- */
function botones(){
  document.addEventListener("pointerdown", e => {
    const b = e.target.closest && e.target.closest(".boton");
    if (!b || RM()) return;
    const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height);
    const o = document.createElement("span"); o.className = "fx-onda"; o.setAttribute("aria-hidden", "true");
    Object.assign(o.style, { width: d + "px", height: d + "px", left: (e.clientX - r.left - d / 2) + "px", top: (e.clientY - r.top - d / 2) + "px" });
    b.appendChild(o); setTimeout(() => o.remove(), 750);
  });
  if (!RATON() || RM()) return;
  document.addEventListener("pointermove", e => {
    const b = e.target.closest && e.target.closest(".boton--primario, [data-iman], .cab-cesta");
    $$("[data-iman-activo]").forEach(x => { if (x !== b){ x.style.translate = ""; x.removeAttribute("data-iman-activo"); } });
    if (!b) return;
    const r = b.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * .18, dy = (e.clientY - (r.top + r.height / 2)) * .28;
    b.setAttribute("data-iman-activo", "");
    b.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
    b.style.transition = (b.style.transition || "") .includes("translate") ? b.style.transition : "translate .25s cubic-bezier(.22,1,.36,1)";
  }, { passive: true });
}

/* ---------- títulos de sección subrayados al aparecer ---------- */
let io = null;
function subrayados(raiz){
  if (!("IntersectionObserver" in window)) return;
  io = io || new IntersectionObserver(ents => ents.forEach(en => { if (en.isIntersecting){ en.target.classList.add("fx-visto"); io.unobserve(en.target); } }), { threshold: .6 });
  $$("main section", raiz).forEach(sec => {
    const h = sec.querySelector("h2"); if (!h || h.closest(".tarjeta, .pag-red, .megamenu, .caja-hero")) return;
    if (h.classList.contains("fx-subraya")) return;
    h.classList.add("fx-subraya"); io.observe(h);
  });
}

/* ---------- piezas flotantes en las bandas crema ---------- */
const PIEZAS = [["boton", "Camel"], ["bobina", "Rosa empolvado"], ["boton", "Burdeos"], ["dedal", "Plata"], ["boton", "Crudo"]];
function flotantes(raiz){
  if (RM() || !(LV.ilus && LV.ilus.pieza)) return;
  $$(".seccion--rosa", raiz).forEach((sec, n) => {
    if (sec.querySelector(":scope > .fx-flotante")) return;
    for (let i = 0; i < 3; i++){
      const [ic, col] = PIEZAS[(n + i) % PIEZAS.length];
      const c = (LV.datos && LV.datos.COL && LV.datos.COL[col]) || "#C8A27A";
      const f = document.createElement("span"); f.className = "fx-flotante"; f.setAttribute("aria-hidden", "true");
      const izq = i === 0 ? 3 + Math.random() * 6 : i === 1 ? 84 + Math.random() * 4 : 45 + Math.random() * 20;
      const top = i === 2 ? 78 + Math.random() * 10 : 10 + Math.random() * 25;
      f.style.cssText = `left:${izq}%;top:${top}%;--t:${40 + Math.random() * 30}px;--dur:${8 + Math.random() * 6}s;--ret:${-Math.random() * 6}s;--g:${(Math.random() * 40 - 20).toFixed(0)}deg;--dx:${(Math.random() * 30 - 15).toFixed(0)}px`;
      try { f.innerHTML = `<svg viewBox="0 0 200 200" focusable="false">${LV.ilus.pieza(ic, c)}</svg>`; } catch (e) { continue; }
      sec.appendChild(f);
    }
  });
}

/* ---------- ilustraciones de las tarjetas: leve deriva con el scroll ---------- */
function deriva(){
  if (RM()) return;
  let raf = 0;
  const pintar = () => {
    raf = 0;
    const h = innerHeight;
    $$(".tarjeta__lienzo").forEach(el => {
      const r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > h) return;
      el.classList.add("fx-deriva");
      el.style.setProperty("--dy", (((r.top + r.height / 2) / h - .5) * -10).toFixed(1) + "px");
    });
  };
  addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(pintar); }, { passive: true });
  document.addEventListener("lv:ruta-cambiada", () => setTimeout(pintar, 100));
}

function alCambiarRuta(){
  const main = document.getElementById("contenido") || document;
  setTimeout(() => { subrayados(main); flotantes(main); }, 120);
}

function iniciar(){
  try { progreso(); } catch (e) { console.error("[fx] progreso", e); }
  try { tarjetas(); } catch (e) { console.error("[fx] tarjetas", e); }
  try { botones(); } catch (e) { console.error("[fx] botones", e); }
  try { deriva(); } catch (e) { console.error("[fx] deriva", e); }
  document.addEventListener("lv:ruta-cambiada", alCambiarRuta);
  alCambiarRuta();
}
window.LV = window.LV || {};
LV.fx = { iniciar };
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar, { once: true });
else iniciar();
})();
