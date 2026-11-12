/* =========================================================
   LA VALENCIANA v2 · iconos.js · PROPIETARIO: B1
   Juego único de iconos de interfaz (DISENO §6): 24×24, trazo 1,75,
   extremos redondos, currentColor, sin relleno, aria-hidden.
   Uso: LV.IC.tel, LV.IC.cesta… (cadenas SVG). Un icono SIEMPRE va
   acompañado de texto visible (o aria-label en su control).
   Nombres fijos (ARQUITECTURA §4.3). Nadie más edita este archivo.
   ========================================================= */
window.LV = window.LV || {};
LV.IC = (() => {
"use strict";
const s = d => `<svg class="ico" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${d}</svg>`;
const IC = {
  /* cesta de mimbre con asa: la de la compra en la plaza */
  cesta: s('<path d="M3.5 10h17l-1.6 8.4a2 2 0 0 1-2 1.6H7.1a2 2 0 0 1-2-1.6z"/><path d="M8 10l3-5.5M16 10l-3-5.5"/><path d="M9 13.5v3M12 13.5v3M15 13.5v3"/>'),
  buscar: s('<circle cx="10.5" cy="10.5" r="6.25"/><path d="M15.2 15.2L20 20"/>'),
  menu: s('<path d="M4 7h16M4 12h16M4 17h11"/>'),
  cerrar: s('<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>'),
  tel: s('<path d="M6.2 3.8h2.6l1.6 4.3-2.1 1.3a10.6 10.6 0 0 0 6.3 6.3l1.3-2.1 4.3 1.6v2.6a2 2 0 0 1-2.2 2A16.4 16.4 0 0 1 4.2 6a2 2 0 0 1 2-2.2z"/>'),
  /* bocadillo con auricular (monocromo, nunca verde) */
  whats: s('<path d="M4.2 19.8l1.2-3.7a8.3 8.3 0 1 1 3 2.8z"/><path d="M9.2 8.4h1.3l.7 1.8-.9.7a4.6 4.6 0 0 0 2.7 2.7l.7-.9 1.8.7v1.3a1 1 0 0 1-1.1 1 6.2 6.2 0 0 1-6.2-6.2 1 1 0 0 1 1-1.1z"/>'),
  correo: s('<rect x="3.25" y="5.25" width="17.5" height="13.5" rx="1.5"/><path d="M4 6.5l8 6 8-6"/>'),
  mapa: s('<path d="M12 21s6.75-6 6.75-11.25a6.75 6.75 0 0 0-13.5 0C5.25 15 12 21 12 21z"/><circle cx="12" cy="9.75" r="2.4"/>'),
  reloj: s('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.25V12l3.1 1.9"/>'),
  check: s('<path d="M5 12.6l4.4 4.4L19 7.4"/>'),
  mas: s('<path d="M12 5v14M5 12h14"/>'),
  menos: s('<path d="M5 12h14"/>'),
  flechaDer: s('<path d="M4.5 12h15M13.5 6l6 6-6 6"/>'),
  flechaIzq: s('<path d="M19.5 12h-15M10.5 6l-6 6 6 6"/>'),
  flechaArr: s('<path d="M12 19.5v-15M6 10.5l6-6 6 6"/>'),
  abajo: s('<path d="M6.5 9.25L12 14.75l5.5-5.5"/>'),
  derecha: s('<path d="M9.25 6.5L14.75 12l-5.5 5.5"/>'),
  izquierda: s('<path d="M14.75 6.5L9.25 12l5.5 5.5"/>'),
  /* escaparate con toldo */
  tienda: s('<path d="M4 9.5V20h16V9.5"/><path d="M3 9.5L4.6 4h14.8L21 9.5c0 1.4-1.2 2.5-2.6 2.5s-2.6-1.1-2.6-2.5c0 1.4-1.2 2.5-2.6 2.5h-2.4c-1.4 0-2.6-1.1-2.6-2.5 0 1.4-1.2 2.5-2.6 2.5S3 10.9 3 9.5z"/><path d="M9.5 20v-5h5v5"/>'),
  camion: s('<path d="M2.75 6.25h11v9.5h-11zM13.75 9.5h3.9l2.6 3v3.25h-6.5z"/><circle cx="6.5" cy="17.75" r="1.9"/><circle cx="16.75" cy="17.75" r="1.9"/>'),
  cambio: s('<path d="M4.5 8.75h14l-3.25-3.25"/><path d="M19.5 15.25h-14l3.25 3.25"/>'),
  candado: s('<rect x="5" y="10.75" width="14" height="9.5" rx="1.75"/><path d="M8.25 10.75V8a3.75 3.75 0 0 1 7.5 0v2.75M12 14.5v2"/>'),
  colores: s('<circle cx="8.25" cy="9" r="4.25"/><circle cx="15.75" cy="9" r="4.25"/><circle cx="12" cy="15.5" r="4.25"/>'),
  parecidos: s('<rect x="3.5" y="3.5" width="7.25" height="7.25" rx="1"/><rect x="13.25" y="3.5" width="7.25" height="7.25" rx="1"/><rect x="3.5" y="13.25" width="7.25" height="7.25" rx="1"/><rect x="13.25" y="13.25" width="7.25" height="7.25" rx="1"/>'),
  juego: s('<circle cx="9" cy="12" r="5.5"/><circle cx="15" cy="12" r="5.5"/>'),
  info: s('<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.25M12 7.75h.01"/>'),
  aviso: s('<path d="M10.4 4.6a1.85 1.85 0 0 1 3.2 0l7 12.4a1.85 1.85 0 0 1-1.6 2.75H5a1.85 1.85 0 0 1-1.6-2.75z"/><path d="M12 9.75v3.75M12 16.5h.01"/>'),
  letra: s('<path d="M3.5 19L8.5 5.5 13.5 19M5.4 14h6.2"/><path d="M14.5 19l3-8 3 8M15.6 16.25h3.8"/>'),
  regalo: s('<rect x="4" y="10.25" width="16" height="9.75" rx="1"/><path d="M3 7h18v3.25H3zM12 7v13"/><path d="M12 7C10.5 3.5 6.75 3.6 7.25 6c.2 1 2.5 1 4.75 1zM12 7c1.5-3.5 5.25-3.4 4.75-1-.2 1-2.5 1-4.75 1z"/>'),
  /* añadidos por B1 (nombres nuevos, no sustituyen a los anteriores) */
  ubicacion: s('<path d="M12 21s6.75-6 6.75-11.25a6.75 6.75 0 0 0-13.5 0C5.25 15 12 21 12 21z"/><circle cx="12" cy="9.75" r="2.4"/>'),
  aguja: s('<path d="M4.5 19.5L17.6 6.4"/><path d="M17.6 6.4a1.6 1.6 0 1 1 2.3-2.3 1.6 1.6 0 0 1-2.3 2.3z"/><path d="M15 9c-2.5 1.5-6.5-1-9 1.5"/>')
};
return Object.freeze(IC);
})();
