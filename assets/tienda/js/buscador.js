/* =========================================================
   LA VALENCIANA v2 · buscador.js · PROPIETARIO: SUP-B
   LV.buscador.buscar(q) → [prod] ordenados por relevancia.
   Corrige la v1: sinónimos sin tildes (pañuelo, moño), prefijos
   («boto» → botones), una errata tolerada en palabras largas
   («cremayera»), y búsqueda por nombre de color.
   ========================================================= */
window.LV = window.LV || {};
LV.buscador = (() => {
"use strict";
const D = LV.datos, U = LV.util;
const VACIAS = new Set(["de","del","la","el","los","las","para","con","y","o","en","un","una","unos","unas","por","al","a","que","me","mi","se","quiero","busco","tienen","teneis","hay"]);

// Las claves se normalizan (sin tildes, raíz) al cargar: así «pañuelo» y «panuelo» valen igual.
const SIN_CRUDO = {
  cierre:["cremallera","corchete","broche","velcro"], cremallera:["cierre","tirador"], boton:["botones"],
  panty:["panti","media"], panti:["media"], media:["panti"], leotardo:["panti","tupido"],
  lana:["ovillo"], ovillo:["lana"], ganchillo:["algodon"], croche:["ganchillo"], crochet:["ganchillo"], punto:["agujas-punto","ovillo"],
  calcetin:["pinkies"], goma:["elastico","coletero"], elastico:["goma"],
  alfiler:["imperdible"], imperdible:["alfiler"], aguja:["ganchillo","enhebrador"], tijera:["corta-hilos"],
  bolso:["bandolera","bolsa"], cartera:["monedero"], monedero:["cartera"], pañuelo:["fular","bufanda"], bufanda:["fular","pañuelo"],
  pendiente:["perla"], perla:["pendiente","collar"], regalo:["regalar","tarjeta","costurero","lote"], vale:["tarjeta"],
  sosten:["sujetador"], sujetador:["sosten"], braga:["braga"], camison:["camison"], pijama:["camison"], ropa:["camiseta","braga","sujetador"],
  hilo:["madeja"], bordar:["bordado","bastidor","madeja"], bordado:["bordar","bastidor","madeja"], coser:["hilo","aguja","costura"], costura:["coser","hilo"],
  metro:["metrica"], centimetro:["metrica"], cinta:["puntilla","cordon"], encaje:["puntilla","encaje"], parche:["rodillera","aplique"], remiendo:["parche","rodillera"],
  pelo:["pinza","diadema","horquilla","coletero"], moño:["pinza","horquilla"], diabetico:["diabetes","compresion","puño","aprieta"], diabetes:["compresion","puño","aprieta"],
  descanso:["compresion"], varice:["compresion","descanso"], cansada:["descanso","compresion"], abrigo:["termico","bufanda"], frio:["termico","bufanda","tupido"],
  lluvia:["paraguas"], calor:["abanico"], boda:["ceremonia","encaje","abanico"], comunion:["ceremonia","encaje"]
};
// forma «fonética» para erratas frecuentes: ll/y, v/b (cremayera, balero…)
const fon = w => w.replace(/ll/g, "y").replace(/v/g, "b");
const raiz = w => { w = fon(U.sinTildes(w)); if (w.length > 4) w = w.replace(/(es|s)$/, ""); if (w.length > 4) w = w.replace(/[ao]$/, ""); return w; };
const SINONIMOS = {};
for (const [k, v] of Object.entries(SIN_CRUDO)) SINONIMOS[raiz(k)] = [...new Set([...(SINONIMOS[raiz(k)]||[]), ...v.map(raiz)])];

const tokens = t => U.sinTildes(t).split(/[^a-z0-9]+/).filter(Boolean).map(raiz);
// distancia de edición ≤ 1 (sustitución, inserción o borrado)
function casiIgual(a, b){
  if (a === b) return true;
  const la = a.length, lb = b.length; if (Math.abs(la - lb) > 1) return false;
  let i = 0, j = 0, dif = 0;
  while (i < la && j < lb){
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++dif > 1) return false;
    if (la > lb) i++; else if (lb > la) j++; else { i++; j++; }
  }
  return dif + (la - i) + (lb - j) <= 1;
}
// índice precalculado
const INDICE = D.PRODUCTOS.map(prod => {
  const sub = D.subcategoria(prod.cat, prod.sub), cat = D.categoria(prod.cat);
  const nombre = new Set(tokens(`${prod.nombre} ${sub.n}`));
  const texto = new Set(tokens([prod.nombre, prod.desc, sub.n, cat.nombre, prod.variantes.map(v=>v.n).join(" "), prod.medidas.join(" "), prod.detalles.join(" "), prod.etiqueta||"", prod.icono.replace(/-/g," ")].join(" ")));
  // colores de sus versiones (para usar el color como FILTRO, no como coincidencia)
  const colores = new Set(prod.conColor === false ? [] : tokens(prod.variantes.map(v => v.n).join(" ")));
  return { prod, nombre: [...nombre], nombreSet: nombre, texto: [...texto], textoSet: texto, colores };
});
// Palabras de color: las de la paleta, salvo las que forman parte del NOMBRE de algún artículo
// («transparente», «carey», «perla», «estampado»…), que cuentan como palabra de producto.
const EN_NOMBRES = new Set(INDICE.flatMap(e => e.nombre));
const COLORES = new Set(tokens(Object.keys(D.COL || {}).join(" ")).filter(t => !EN_NOMBRES.has(t)));
const esColor = w => COLORES.has(raiz(w));

/** Palabras útiles de una consulta (sin tildes, sin palabras vacías). */
const palabras = q => U.sinTildes(q).split(/[\s,.;:/¿?¡!()"«»]+/).filter(w => w.length > 1 && !VACIAS.has(w));

/* Puntuación de UNA palabra de producto en una ficha:
   3 nombre/subcategoría · 2 prefijo en el nombre · 1,5 errata en el nombre · 1 palabra exacta en el texto
   · 0,7 prefijo largo en el texto · 0,5 errata en el texto (el sinónimo vale ×0,8). */
function puntoPalabra(e, w){
  const r = raiz(w), entera = fon(U.sinTildes(w)), alt = [r, ...(SINONIMOS[r] || [])];
  let mejor = 0;
  for (const a of alt){
    const peso = a === r ? 1 : 0.8;
    // el prefijo se mira con la palabra tal cual la escribió («boto» → botones), no con su raíz
    // recortada: así «medias» (raíz «medi») no casa con «medición»
    const pre = a === r ? entera : a;
    if (e.nombreSet.has(a)) mejor = Math.max(mejor, 3 * peso);
    else if (pre.length >= 3 && e.nombre.some(t => t.startsWith(pre))) mejor = Math.max(mejor, 2 * peso);
    else if (a.length >= 5 && e.nombre.some(t => casiIgual(t, a))) mejor = Math.max(mejor, 1.5 * peso);
    else if (e.textoSet.has(a)) mejor = Math.max(mejor, 1 * peso);
    // prefijo en el texto solo si es largo y casi la palabra entera («medi» NO casa con «medida»)
    else if (pre.length >= 5 && e.texto.some(t => t.startsWith(pre) && t.length - pre.length <= 3)) mejor = Math.max(mejor, 0.7 * peso);
    else if (a.length >= 6 && e.texto.some(t => casiIgual(t, a))) mejor = Math.max(mejor, 0.5 * peso);
  }
  return mejor;
}
const tieneColor = (e, w) => { const r = raiz(w); return [...e.colores].some(t => t === r || t.startsWith(r)); };

/**
 * Busca productos. q: texto libre ("botones rojos", "medias de descanso", "cremayera").
 * buscarDetallado(q) → {resultados:[prod], parcial:boolean, palabras:[...]}
 *   parcial=true: ningún producto tenía todas las palabras y se muestran los que más se parecen
 *   (la vista lo dice: «No hay nada con todas sus palabras; esto se parece»).
 * Reglas: las palabras de producto mandan (todas deben casar; si en varias fichas casan en el
 * NOMBRE, se descartan las que solo casan en la descripción); el color solo FILTRA lo anterior.
 * Un color solo («negro») lista lo que hay en ese color. Un color nunca basta por sí mismo
 * cuando hay palabras de producto: «medias negras» no trae tijeras negras.
 * buscar(q) → [prod] (igual que resultados).
 */
function buscarDetallado(q){
  const ws = palabras(q || "");
  if (!ws.length) return { resultados: [], parcial: false, palabras: ws };
  const cols = ws.filter(esColor), prods = ws.filter(w => !esColor(w));
  const ordenar = lista => lista.sort((a, b) => b.p - a.p || a.e.prod.orden - b.e.prod.orden).map(x => x.e.prod);
  const conColores = e => cols.filter(c => tieneColor(e, c)).length;

  // 1) solo colores
  if (!prods.length) {
    const res = INDICE.map(e => ({ e, n: conColores(e) })).filter(x => x.n)
      .map(x => ({ e: x.e, p: x.n * 2 + (x.e.prod.destacado ? 0.1 : 0) }));
    const todas = res.filter(x => conColores(x.e) === cols.length);
    return { resultados: ordenar(todas.length ? todas : res), parcial: !todas.length && res.length > 0, palabras: ws };
  }
  // 2) palabras de producto: todas deben casar
  const puntos = INDICE.map(e => {
    const pp = prods.map(w => puntoPalabra(e, w));
    return { e, pp, min: Math.min(...pp), suma: pp.reduce((a, b) => a + b, 0), aciertos: pp.filter(Boolean).length };
  });
  let base = puntos.filter(x => x.min > 0), parcial = false;
  if (base.length) {
    // escalones: si algunas casan en el nombre con todas las palabras, sobran las que solo casan en el texto
    // si hay coincidencias claras en el nombre, sobran las que solo casan por errata («botones» ≠ «otoño»)
    const claras = base.filter(x => x.min >= 2);
    const fuertes = claras.length ? claras : base.filter(x => x.min >= 1.5);
    if (fuertes.length) base = fuertes;
    else { const medias = base.filter(x => x.min >= 1); if (medias.length) base = medias; }
  } else if (prods.length > 1) {
    // ninguna con todas: las que tienen alguna palabra de producto de forma clara (nunca solo el color)
    base = puntos.filter(x => x.pp.some(v => v >= 1)); parcial = base.length > 0;
  }
  if (!base.length) return { resultados: [], parcial: false, palabras: ws };
  // 3) el color filtra; si nada de lo encontrado está en ese color, se enseña igual y se avisa
  if (cols.length) {
    const enColor = base.filter(x => conColores(x.e) === cols.length);
    if (enColor.length) base = enColor; else parcial = true;
  }
  return { resultados: ordenar(base.map(x => ({ e: x.e, p: x.suma + x.aciertos * 2 + conColores(x.e) + (x.e.prod.destacado ? 0.1 : 0) }))), parcial, palabras: ws };
}
const buscar = q => buscarDetallado(q).resultados;
/**
 * Sugerencias rápidas para el buscador mientras se escribe.
 * → {productos:[prod] (máx. n), subcategorias:[{cat, id, n}] (máx. 3)}
 */
function sugerir(q, n = 6){
  const ws = palabras(q || "");
  if (!ws.length) return { productos: [], subcategorias: [] };
  const subs = [];
  for (const cat of Object.keys(D.CATS)) for (const s of D.subcategorias(cat)) {
    const t = tokens(s.n);
    if (ws.every(w => t.some(x => x.startsWith(raiz(w)) || (SINONIMOS[raiz(w)]||[]).includes(x)))) subs.push({ cat, id: s.id, n: s.n });
  }
  return { productos: buscar(q).slice(0, n), subcategorias: subs.slice(0, 3) };
}

return Object.freeze({ buscar, buscarDetallado, sugerir, palabras, raiz });
})();
