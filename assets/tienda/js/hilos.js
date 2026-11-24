/* =========================================================
   LA VALENCIANA · hilos.js
   Tipos de hilo (material) con su sección «Valores»: trabajos hechos con ese material
   como referencia, cada uno con su guía, y una guía general del material.
   Datos editables: TIPOS. Los productos se enlazan por id (datos.js / trastienda).
   Las labores llevan dibujo provisional hasta tener fotos de trabajos reales:
   cuando las haya, poner `foto: "assets/tienda/fotos/valores/<archivo>.webp"` en la labor.
   API: LV.hilos.TIPOS, .tipo(id), .labor(tipo, id), .deProducto(prod), .dibujo(labor, opc)
   ========================================================= */
window.LV = window.LV || {};
LV.hilos = (() => {
"use strict";

const TIPOS = [
  {
    id: "algodon", nombre: "Algodón", titulo: "Hilo de algodón",
    frase: "Fresco, con brillo suave y muy definido: los puntos se ven limpios. El material de los amigurumis.",
    foto: "assets/tienda/fotos/happy-cotton/760.webp", color: "#EFB8C7",
    productos: ["happy-cotton"],
    guia: {
      sirve: "Amigurumis, posavasos, monederos, llaveros y labores pequeñas que tienen que mantener la forma. También prendas de verano.",
      herramienta: "Ganchillo o agujas de 2,5 a 3 mm. Con amigurumis, medio número menos de lo que diga la etiqueta para que el relleno no se vea.",
      rinde: "Un ovillo de Happy Cotton (20 g) da unos 43 m: lo justo para una pieza pequeña o un posavasos y medio.",
      nivel: "Fácil. No se abre ni se enreda y deshacer no lo estropea, así que es muy agradecido para aprender ganchillo.",
      cuidado: "A mano o a máquina en programa delicado a 30 °C. Secar en plano y sin secadora para que no encoja.",
      truco: "Usa un marcador de puntos al empezar cada vuelta: en espiral, sin él, es muy fácil perder la cuenta."
    },
    labores: [
      { id: "conejito", t: "Conejito amigurumi", dib: "conejito", c: "#F7CBD3", c2: "#FFFFFF",
        x: "El primer amigurumi de casi todas: cuerpo, cabeza y orejas por separado, y se cosen al final.",
        material: "4 ovillos (3 del color del cuerpo y 1 para detalles), ganchillo de 2,5 mm, relleno y ojos de seguridad",
        nivel: "Intermedio", tiempo: "Unas 8 horas", mide: "Unos 20 cm",
        pasos: ["Anillo mágico de 6 puntos bajos y aumentos hasta 36 para la cabeza.", "Cuerpo igual, algo más alargado; rellena antes de cerrar.", "Orejas en tubo de 6 a 10 puntos, sin rellenar.", "Cose las piezas con aguja lanera y borda ojos y hocico."] },
      { id: "posavasos", t: "Posavasos de colores", dib: "posavasos", c: "#69898D", c2: "#EFD45E",
        x: "Círculos en espiral cambiando de color: la labor perfecta para una tarde y para aprovechar restos.",
        material: "1 ovillo da para 2 posavasos; mejor combinar 2 o 3 colores. Ganchillo de 3 mm",
        nivel: "Fácil", tiempo: "40 minutos cada uno", mide: "10 cm de diámetro",
        pasos: ["Anillo mágico con 12 puntos altos.", "Aumenta 12 puntos en cada vuelta hasta tener 5 vueltas.", "Cambia de color en el último punto de la vuelta.", "Remata con una vuelta de punto cangrejo."] },
      { id: "monedero", t: "Monedero con cremallera", dib: "monedero", c: "#FC7D57", c2: "#F9DEE4",
        x: "Un rectángulo doblado y una cremallera cosida a mano. Queda firme gracias al algodón.",
        material: "3 ovillos, ganchillo de 3 mm, una cremallera de 15 cm e hilo de coser del mismo tono",
        nivel: "Fácil", tiempo: "Unas 3 horas", mide: "15 × 10 cm",
        pasos: ["Cadeneta de 30 puntos y filas de punto bajo hasta 20 cm.", "Dobla por la mitad y cierra los laterales con punto raso.", "Hilvana la cremallera abierta y cósela a punto atrás.", "Si quieres, añade un pompón o una borla al tirador."] },
      { id: "frutas", t: "Frutitas para jugar", dib: "frutas", c: "#CB0420", c2: "#5C9149",
        x: "Fresas, cerezas y limones en miniatura. Sirven de llavero, de adorno o para la cocinita.",
        material: "1 ovillo de cada color de fruta y uno verde para las hojas; ganchillo de 2,5 mm y relleno",
        nivel: "Fácil", tiempo: "1 hora por fruta", mide: "4 a 6 cm",
        pasos: ["Anillo mágico de 6 puntos y aumentos hasta 18.", "Tres vueltas rectas y disminuciones hasta cerrar.", "Rellena antes de las últimas disminuciones.", "Hojita en cadeneta y bordado de las pepitas con hilo amarillo."] }
    ]
  },
  {
    id: "merino", nombre: "Merino", titulo: "Lana merino para bebé",
    frase: "Lana extrafina que no pica, abriga sin pesar y se lava a máquina. La de las primeras prendas.",
    foto: "assets/tienda/fotos/baby-3/grupo.webp", color: "#BDD0DC",
    productos: ["baby-3"],
    guia: {
      sirve: "Chaquetitas, patucos, gorros, mantas de cochecito y cualquier prenda que vaya directa a la piel del bebé.",
      herramienta: "Agujas de 2,5 a 3,5 mm o ganchillo de 3 mm. Con agujas de 3 mm el tejido queda tupido y abriga más.",
      rinde: "Un ovillo de 100% Baby 3 (50 g) da unos 165 m. Una chaquetita de 6 meses lleva 2 ovillos.",
      nivel: "Fácil. Es elástica y perdona la tensión irregular de las primeras labores.",
      cuidado: "Es superwash: a máquina en programa de lana a 30 °C, con jabón suave. Secar en plano, nunca colgada.",
      truco: "Compra todos los ovillos de la misma partida (viene en la etiqueta): de una partida a otra el tono cambia un poco."
    },
    labores: [
      { id: "chaquetita", t: "Chaquetita de 6 meses", dib: "chaquetita", c: "#BDD0DC", c2: "#F4EEE1",
        x: "Una pieza de arriba abajo, sin costuras: se teje el canesú y se separan mangas y cuerpo.",
        material: "2 ovillos, agujas circulares de 3 mm, 4 o 5 botones de 12 mm y marcadores",
        nivel: "Intermedio", tiempo: "Unas 15 horas", mide: "Talla 6 meses",
        pasos: ["Monta 70 puntos y teje 6 vueltas de punto bobo para el cuello.", "Aumenta en las cuatro marcas del raglán hasta tener 180 puntos.", "Deja las mangas en espera y sigue con el cuerpo hasta 15 cm.", "Retoma las mangas, remata con punto bobo y cosa los botones."] },
      { id: "patucos", t: "Patucos con cordón", dib: "patucos", c: "#F7CFCC", c2: "#FFFFFF",
        x: "Los patucos de siempre: suela, empeine y una vuelta de calados para pasar la cinta.",
        material: "1 ovillo (sobra para dos pares), agujas de 3 mm y 1 m de cinta de raso",
        nivel: "Fácil", tiempo: "2 horas el par", mide: "0 a 6 meses",
        pasos: ["Monta 36 puntos y teje la suela en punto bobo con aumentos en el centro.", "Teje 8 vueltas rectas para el lateral.", "Disminuye en el centro para formar el empeine.", "Haz una vuelta de calados y teje el puño; pasa la cinta."] },
      { id: "gorrito", t: "Gorrito con pompón", dib: "gorrito", c: "#D4D9C1", c2: "#F4EEE1",
        x: "Tejido en redondo con elástico 1/1 y menguado en estrella. Se acaba en una tarde.",
        material: "1 ovillo, agujas circulares de 3 mm y un juego de agujas de doble punta",
        nivel: "Fácil", tiempo: "4 horas", mide: "3 a 6 meses",
        pasos: ["Monta 88 puntos en redondo y teje 3 cm de elástico 1/1.", "Sigue en punto jersey hasta 11 cm desde el inicio.", "Mengua 8 puntos cada dos vueltas hasta que queden 8.", "Cierra pasando la hebra por los puntos y cose el pompón."] },
      { id: "manta", t: "Mantita de cochecito", dib: "manta", c: "#F4EEE1", c2: "#D3CAC4",
        x: "Punto arroz con borde de punto bobo: reversible, no se enrolla y es muy suave.",
        material: "7 ovillos y agujas circulares de 3,5 mm (para que quepan todos los puntos)",
        nivel: "Fácil", tiempo: "Unas 25 horas", mide: "70 × 80 cm",
        pasos: ["Monta 180 puntos y teje 8 vueltas de punto bobo.", "Sigue en punto arroz dejando 6 puntos de bobo a cada lado.", "Al llegar a 78 cm, termina con 8 vueltas de bobo.", "Cierra flojo y esconde las hebras; lávala y sécala en plano."] }
    ]
  }
];

/* ---------- dibujos de labores (provisionales hasta tener fotos) ----------
   Espacio 0-200, luz arriba a la izquierda, mismos tonos que el resto de dibujos. */
const tono = (hex, f) => {                 // aclara (f>0) u oscurece (f<0) un color
  const n = parseInt((hex || "#CCCCCC").slice(1), 16);
  const ch = s => { const v = (n >> s) & 255; return Math.round(f > 0 ? v + (255 - v) * f : v * (1 + f)); };
  return "#" + [16, 8, 0].map(s => ch(s).toString(16).padStart(2, "0")).join("");
};
const sombra = (cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${(rx * .16).toFixed(1)}" fill="#3B2A1F" opacity=".12"/>`;
const filas = (x1, x2, y1, y2, paso, color, op = .35) => {   // textura de puntos
  let s = ""; for (let y = y1; y <= y2; y += paso) s += `<path d="M${x1} ${y}h${x2 - x1}" stroke="${color}" stroke-width="1.4" stroke-dasharray="3 2.4" opacity="${op}"/>`;
  return s;
};
const DIB = {
  conejito(c, c2){
    const o = tono(c, -.28), l = tono(c, .45);
    return sombra(100, 176, 46) +
      `<ellipse cx="82" cy="46" rx="11" ry="30" fill="${c}" stroke="${o}" stroke-width="2" transform="rotate(-10 82 46)"/><ellipse cx="82" cy="48" rx="5" ry="20" fill="${c2}" opacity=".7" transform="rotate(-10 82 48)"/>` +
      `<ellipse cx="118" cy="46" rx="11" ry="30" fill="${c}" stroke="${o}" stroke-width="2" transform="rotate(10 118 46)"/><ellipse cx="118" cy="48" rx="5" ry="20" fill="${c2}" opacity=".7" transform="rotate(10 118 48)"/>` +
      `<ellipse cx="100" cy="140" rx="38" ry="38" fill="${c}" stroke="${o}" stroke-width="2"/>` +
      `<ellipse cx="74" cy="168" rx="14" ry="9" fill="${c}" stroke="${o}" stroke-width="2"/><ellipse cx="126" cy="168" rx="14" ry="9" fill="${c}" stroke="${o}" stroke-width="2"/>` +
      `<ellipse cx="66" cy="132" rx="9" ry="16" fill="${c}" stroke="${o}" stroke-width="2" transform="rotate(20 66 132)"/><ellipse cx="134" cy="132" rx="9" ry="16" fill="${c}" stroke="${o}" stroke-width="2" transform="rotate(-20 134 132)"/>` +
      `<circle cx="100" cy="92" r="32" fill="${c}" stroke="${o}" stroke-width="2"/>` +
      `<g clip-path="none">${filas(72, 128, 70, 118, 6, o, .22)}</g>` +
      `<ellipse cx="88" cy="80" rx="12" ry="8" fill="${l}" opacity=".6"/>` +
      `<circle cx="88" cy="94" r="3.4" fill="#2F2A26"/><circle cx="112" cy="94" r="3.4" fill="#2F2A26"/>` +
      `<path d="M96 103q4 4 8 0" stroke="#2F2A26" stroke-width="1.8" fill="none" stroke-linecap="round"/>` +
      `<circle cx="80" cy="104" r="5" fill="#EE8FB0" opacity=".45"/><circle cx="120" cy="104" r="5" fill="#EE8FB0" opacity=".45"/>` +
      `<path d="M84 118q16 10 32 0l-4 8q-12 6-24 0z" fill="${c2}" stroke="${o}" stroke-width="1.5"/>`;
  },
  posavasos(c, c2){
    const anillo = (cx, cy, r, a, b) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${a}" stroke="${tono(a, -.3)}" stroke-width="2"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${r * .66}" fill="${b}" stroke="${tono(b, -.25)}" stroke-width="1.5"/>` +
      `<circle cx="${cx}" cy="${cy}" r="${r * .32}" fill="${a}" stroke="${tono(a, -.3)}" stroke-width="1.5"/>` +
      [.84, .5].map(k => `<circle cx="${cx}" cy="${cy}" r="${(r * k).toFixed(1)}" fill="none" stroke="#FFFFFF" stroke-width="1.3" stroke-dasharray="3 3" opacity=".45"/>`).join("");
    return sombra(100, 168, 64) + `<g transform="rotate(-8 74 116)">${anillo(74, 116, 44, c2, c)}</g>` + anillo(124, 104, 48, c, c2) +
      `<path d="M150 64q14-6 22 2" stroke="${tono(c, -.3)}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  },
  monedero(c, c2){
    const o = tono(c, -.3);
    return sombra(100, 160, 58) +
      `<path d="M44 74h112q8 0 8 10v58q0 14-14 14H50q-14 0-14-14V84q0-10 8-10z" fill="${c}" stroke="${o}" stroke-width="2"/>` +
      filas(42, 158, 86, 150, 7, o, .28) +
      `<path d="M40 74h120" stroke="#8A8F96" stroke-width="7" stroke-linecap="round"/><path d="M40 74h120" stroke="#C3C7CC" stroke-width="3" stroke-dasharray="2 2" stroke-linecap="round"/>` +
      `<rect x="146" y="68" width="10" height="16" rx="3" fill="#C3C7CC" stroke="#8A8F96" stroke-width="1.5"/>` +
      `<path d="M151 84v20" stroke="${c2}" stroke-width="3"/><circle cx="151" cy="110" r="8" fill="${c2}" stroke="${tono(c2, -.3)}" stroke-width="1.5"/>` +
      `<ellipse cx="66" cy="96" rx="16" ry="8" fill="#FFFFFF" opacity=".18"/>`;
  },
  frutas(c, c2){
    const fresa = `<path d="M64 92q-26 2-24 30q4 28 26 40q22-12 26-40q2-28-24-30z" fill="${c}" stroke="${tono(c, -.3)}" stroke-width="2"/>` +
      [[56, 110], [72, 108], [64, 124], [52, 130], [76, 126], [64, 142]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.6" ry="2.4" fill="#F2D45C"/>`).join("") +
      `<path d="M50 94l8-10 6 8 6-8 8 10q-14 6-28 0z" fill="${c2}" stroke="${tono(c2, -.3)}" stroke-width="1.5"/>`;
    const limon = `<ellipse cx="138" cy="132" rx="30" ry="24" fill="#F6E503" stroke="#C9A54B" stroke-width="2"/><ellipse cx="128" cy="122" rx="10" ry="6" fill="#FFFFFF" opacity=".35"/>` +
      `<path d="M106 132l-6 0M170 132l6 0" stroke="#C9A54B" stroke-width="3" stroke-linecap="round"/>` + filas(114, 162, 116, 148, 6, "#C9A54B", .25);
    const cereza = `<path d="M118 46q8 18 0 40M118 46q20 8 26 36" stroke="${c2}" stroke-width="2.4" fill="none"/>` +
      `<circle cx="116" cy="92" r="11" fill="${c}" stroke="${tono(c, -.3)}" stroke-width="2"/><circle cx="144" cy="88" r="11" fill="${c}" stroke="${tono(c, -.3)}" stroke-width="2"/>` +
      `<path d="M118 46q12-12 26-6q-12 10-26 6z" fill="${c2}"/>`;
    return sombra(100, 170, 70) + cereza + limon + fresa;
  },
  chaquetita(c, c2){
    const o = tono(c, -.3);
    return sombra(100, 176, 66) +
      `<path d="M70 40q30 14 60 0l34 22 14 54-24 8-10-30v74H56V86l-10 30-24-8 14-54z" fill="${c}" stroke="${o}" stroke-width="2" stroke-linejoin="round"/>` +
      filas(58, 142, 70, 156, 7, o, .25) +
      `<path d="M70 40q30 14 60 0l-4 10q-26 12-52 0z" fill="${c2}" stroke="${o}" stroke-width="1.5"/>` +
      `<path d="M100 54v106" stroke="${o}" stroke-width="2"/>` +
      `<path d="M56 152h88v8H56z" fill="${c2}" stroke="${o}" stroke-width="1.5"/>` +
      [72, 94, 116, 138].map(y => `<circle cx="108" cy="${y}" r="4" fill="${c2}" stroke="${o}" stroke-width="1.5"/>`).join("") +
      `<path d="M150 112l24-8" stroke="${c2}" stroke-width="6"/><path d="M50 112l-24-8" stroke="${c2}" stroke-width="6"/>`;
  },
  patucos(c, c2){
    const o = tono(c, -.3);
    const pie = (dx, rot) => `<g transform="translate(${dx} 0) rotate(${rot} 60 130)">` +
      `<path d="M38 92h40v38q30 2 34 22q2 14-20 14H44q-14 0-14-14z" fill="${c}" stroke="${o}" stroke-width="2" stroke-linejoin="round"/>` +
      filas(34, 108, 100, 160, 6, o, .25) +
      `<path d="M36 92h44v10H36z" fill="${c2}" stroke="${o}" stroke-width="1.5"/>` +
      `<path d="M36 112h44" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="4 4"/>` +
      `<path d="M72 112q16 2 18 14q-14 4-18-14zM72 112q4 16-6 22q-6-14 6-22z" fill="${c2}" stroke="${o}" stroke-width="1.2"/></g>`;
    return sombra(100, 172, 70) + pie(0, -4) + pie(62, 6);
  },
  gorrito(c, c2){
    const o = tono(c, -.3);
    return sombra(100, 166, 56) +
      `<path d="M50 132q-4-70 50-74q54 4 50 74z" fill="${c}" stroke="${o}" stroke-width="2"/>` +
      [64, 76, 88, 100, 112, 124, 136].map(x => `<path d="M${x} 70q${(x - 100) * .12} 30 ${(x - 100) * .3} 62" stroke="${o}" stroke-width="1.3" fill="none" opacity=".25"/>`).join("") +
      `<path d="M44 128h112q4 0 4 6v14q0 6-6 6H46q-6 0-6-6v-14q0-6 4-6z" fill="${tono(c, .2)}" stroke="${o}" stroke-width="2"/>` +
      Array.from({ length: 15 }, (_, i) => `<path d="M${48 + i * 7.4} 132v18" stroke="${o}" stroke-width="1.4" opacity=".3"/>`).join("") +
      `<circle cx="100" cy="50" r="18" fill="${c2}" stroke="${tono(c2, -.25)}" stroke-width="2"/>` +
      Array.from({ length: 10 }, (_, i) => { const a = i * Math.PI / 5; return `<path d="M${(100 + Math.cos(a) * 8).toFixed(1)} ${(50 + Math.sin(a) * 8).toFixed(1)}L${(100 + Math.cos(a) * 18).toFixed(1)} ${(50 + Math.sin(a) * 18).toFixed(1)}" stroke="${tono(c2, -.2)}" stroke-width="1.3"/>`; }).join("");
  },
  manta(c, c2){
    const o = tono(c, -.3);
    let arroz = ""; for (let y = 64; y < 140; y += 7) for (let x = 48 + ((y / 7) % 2) * 5; x < 150; x += 10) arroz += `<circle cx="${x}" cy="${y}" r="1.3" fill="${o}" opacity=".35"/>`;
    return sombra(100, 170, 74) +
      `<path d="M36 150l14-6h108l10 6-8 10H44z" fill="${tono(c2, .1)}" stroke="${tono(c2, -.3)}" stroke-width="2"/>` +
      `<path d="M40 50h120q6 0 6 6v84q0 6-6 6H40q-6 0-6-6V56q0-6 6-6z" fill="${c}" stroke="${o}" stroke-width="2"/>` +
      `<path d="M40 50h120q6 0 6 6v6H34v-6q0-6 6-6zM34 136h132v4q0 6-6 6H40q-6 0-6-6z" fill="${c2}" stroke="${o}" stroke-width="1.5"/>` + arroz +
      `<path d="M120 50q30 10 46 40v-34q0-6-6-6z" fill="${tono(c, -.08)}" stroke="${o}" stroke-width="1.5"/>`;
  }
};

/* Flecha a mano (como un hilo que señala), para las tarjetas de proyectos */
const FLECHAS = [
  c => `<path d="M30 20c-12 30 30 34 14 62c-8 14-22 10-20-2c2-14 30-12 40 8" stroke="${c}" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M60 80l6 10 4-12" stroke="${c}" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  c => `<path d="M22 22q-6 40 30 52q20 6 26-6" stroke="${c}" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-dasharray="7 6"/><path d="M70 62l8 6-10 6" stroke="${c}" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  c => `<path d="M24 18c0 26 10 44 40 52" stroke="${c}" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M56 60l10 10-14 4" stroke="${c}" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
];

function dibujo(labor, { clase = "", alt = "" } = {}){
  const aria = alt ? `role="img" aria-label="${LV.util ? LV.util.esc(alt) : alt}"` : `aria-hidden="true" focusable="false"`;
  if (labor.foto) return `<img class="${clase}" src="${labor.foto}" alt="${alt}" loading="lazy" decoding="async">`;
  const f = DIB[labor.dib]; if (!f) return "";
  return `<svg class="${clase}" viewBox="0 0 200 200" ${aria} xmlns="http://www.w3.org/2000/svg">${f(labor.c, labor.c2)}</svg>`;
}
const flecha = (i, color = "#B08A62") => `<svg class="hil-flecha" viewBox="0 0 90 100" aria-hidden="true" focusable="false">${FLECHAS[i % FLECHAS.length](color)}</svg>`;

const tipo = id => TIPOS.find(t => t.id === id) || null;
const labor = (t, id) => { const x = typeof t === "string" ? tipo(t) : t; return x ? x.labores.find(l => l.id === id) || null : null; };
const deProducto = prod => prod ? TIPOS.find(t => t.productos.includes(prod.id)) || null : null;
/** Productos (que existan en la tienda) de un tipo de hilo */
const productos = t => (t.productos || []).map(id => LV.datos && LV.datos.producto(id)).filter(Boolean);

return Object.freeze({ TIPOS, tipo, labor, deProducto, productos, dibujo, flecha, tono });
})();
