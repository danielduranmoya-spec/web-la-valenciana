/* =========================================================
   LA VALENCIANA v2 · datos.js · PROPIETARIO: SUP-B
   Catálogo completo (migrado de la v1) + consultas.
   Nadie más edita este archivo: pida cambios en BITACORA.md
   ========================================================= */
window.LV = window.LV || {};
LV.datos = (() => {
"use strict";

const TIENDA = {
  nombre: "La Valenciana",
  lema: "Mercería y complementos en Almendralejo",
  tel: "924 67 08 39", telHref: "+34924670839",
  whats: "34633930935", whatsTxt: "633 930 935",
  correo: "administracion@lavalencianamerceria.com",
  correoMerceria: "pedidos@lavalencianamerceria.com", correoComplementos: "pedidos@lavalencianacomplementos.com",
  dir: "Calle Moreno Nieto, 7, 06200 Almendralejo (Badajoz)",
  calle: "Calle Moreno Nieto, 7", cp: "06200", ciudad: "Almendralejo", provincia: "Badajoz",
  mapa: "https://www.google.com/maps/search/?api=1&query=Calle+Moreno+Nieto+7,+06200+Almendralejo",
  envio: 4.95, envioGratis: 50, plazoEnvio: "2 a 4 días laborables", horaCorte: 14,
  diasCambio: 14,
  sinCambio: "medias, calcetines y ropa interior con el precinto abierto, ni artículos cortados a medida",
  pagoActivo: true,                  // pasarela de PayPal (tarjeta o PayPal); ver assets/js/pago-config.js
  desde: 1940, generaciones: 4,
  // 0 = domingo. Tramos [abre, cierra] en horas (admite decimales: 9.5 = 9:30)
  horario: {1:[[10,14],[17,20]],2:[[10,14],[17,20]],3:[[10,14],[17,20]],4:[[10,14],[17,20]],5:[[10,14],[17,20]],6:[[10,14],[17,20]],0:[]},
  // Festivos cerrados (AAAA-MM-DD). Ampliar cuando el cliente los facilite.
  // Redes sociales de la tienda (las mismas que enlaza su web actual)
  redes: [
    { red: "instagram", nombre: "Instagram", usuario: "@_lavalenciana",  url: "https://www.instagram.com/_lavalenciana",
      texto: "Fotos de las novedades que van llegando a la tienda, colores de temporada y escaparates." },
    { red: "facebook",  nombre: "Facebook",  usuario: "La Valenciana · Mercería, Medias, Complementos", url: "https://www.facebook.com/mercerialavalenciana/",
      texto: "Avisos de la tienda, horarios especiales en fiestas y todo lo que nos llega para la temporada." },
    { red: "tiktok",    nombre: "TikTok",    usuario: "@_lavalenciana_", url: "https://www.tiktok.com/@_lavalenciana_",
      texto: "Vídeos cortos de la tienda por dentro, ideas y artículos que le enseñamos de cerca." }
  ],
  festivos: ["2026-12-08","2026-12-25","2027-01-01","2027-01-06"]
};

/* Colores de las versiones. Valores especiales: "linear" (multicolor), "flores", "lunares". */
const COL = {
  "Blanco":"#FFFFFF","Crudo":"#EFE6D2","Beige":"#D8C3A5","Carne":"#E6C3A6","Visón":"#A89080","Camel":"#B98A55","Marrón":"#6F4A31",
  "Negro":"#2B2629","Gris perla":"#C9C9CC","Gris marengo":"#5C5F66","Plata":"#C3C7CC","Dorado":"#C9A54B","Oro rosa":"#D9A79A",
  "Rojo":"#C0392B","Burdeos":"#7B2335","Rosa empolvado":"#E9B9C3","Rosa chicle":"#EE8FB0","Fucsia":"#C2185B","Coral":"#EE7F6A",
  "Naranja":"#E07B39","Mostaza":"#D3A238","Amarillo":"#F2D45C","Verde menta":"#A8D8C0","Verde botella":"#2F5D45","Verde oliva":"#7D8550","Kaki":"#8E8A63",
  "Celeste":"#A8CDEB","Azulón":"#2C6E9B","Azul marino":"#24365C","Turquesa":"#3FB5B0","Lila":"#B9A3D6","Morado":"#6B3E86","Malva":"#B48AA3",
  "Transparente":"#EAF2F5","Multicolor":"linear","Estampado flores":"flores","Estampado lunares":"lunares","Carey":"#8B5A2B","Nácar":"#F1ECE4"
};

/* Categorías. Lienzo de ilustración (DISENO §3/§9): Mercería → rosa, Complementos → lavanda, Lotes y regalos → mantequilla.
   `lienzo` es el nombre del token: var(--c-<lienzo>). */
const CATS = {
  merceria:{
    id:"merceria", nombre:"Mercería", corto:"la mercería", lienzo:"rosa",
    texto:"Lo que hace falta para coser, arreglar y terminar bien: hilos, agujas, botones, cintas y cremalleras.",
    subs:{
      hilos:{n:"Hilos", txt:"Para coser a mano y a máquina, bordar y rematar. Si duda con el tono, envíenos una foto de la tela."},
      botones:{n:"Botones", txt:"De camisa, de abrigo, de madera y para forrar. Le ayudamos a encontrar el que se le ha caído."},
      cremalleras:{n:"Cremalleras", txt:"Fijas, invisibles, separables y metálicas, en varias medidas."},
      cintas:{n:"Cintas y puntillas", txt:"Raso, terciopelo, bies y puntillas de algodón. Las de metro se cortan a la medida que pida."},
      agujas:{n:"Agujas y alfileres", txt:"Agujas de mano y de máquina, alfileres, dedales y enhebradores."},
      lanas:{n:"Lanas y labores", txt:"Ovillos, agujas de punto, ganchillos y bastidores para tejer y bordar."},
      corte:{n:"Tijeras y medición", txt:"Tijeras de costura, cintas métricas y lo necesario para marcar y descoser."},
      cierres:{n:"Elásticos y cierres", txt:"Elásticos por metros, corchetes, broches de presión y velcro."},
      apliques:{n:"Parches y apliques", txt:"Rodilleras, apliques bordados y entretela para arreglos que duran."}
    }
  },
  complementos:{
    id:"complementos", nombre:"Complementos", corto:"los complementos", lienzo:"lavanda",
    texto:"Medias, calcetines, bolsos y detalles para completar el vestir de cada día y el de fiesta.",
    subs:{
      medias:{n:"Medias y pantis", txt:"Transparentes, tupidas y de descanso, en todas las tallas."},
      calcetines:{n:"Calcetines", txt:"De vestir, térmicos, invisibles y sin puño que no aprieta."},
      lenceria:{n:"Lencería y ropa interior", txt:"Algodón suave, costuras planas y tallas amplias."},
      panuelos:{n:"Pañuelos y bufandas", txt:"Seda, viscosa y punto para el cuello, el pelo o el bolso."},
      bolsos:{n:"Bolsos y monederos", txt:"Bolsos de hombro, bandoleras, carteras y el monedero de boquilla de siempre."},
      bisuteria:{n:"Bisutería", txt:"Perlas, pulseras y broches con cierres fáciles de poner."},
      abanicos:{n:"Abanicos", txt:"De madera y tela, de encaje para ceremonia, y su funda."},
      paraguas:{n:"Paraguas", txt:"Plegables automáticos y de bastón grande."},
      pelo:{n:"Accesorios para el pelo", txt:"Pinzas, diademas, horquillas y coleteros que no tiran."}
    }
  },
  capsulas:{
    id:"capsulas", nombre:"Cápsulas", corto:"las cápsulas", lienzo:"mantequilla",
    texto:"Selecciones cerradas y preparadas en una caja: para empezar una labor, para la temporada o para regalar.",
    subs:{
      empezar:{n:"Para empezar", txt:"Todo lo necesario para su primera labor, con un patrón sencillo explicado paso a paso."},
      temporada:{n:"De temporada", txt:"Lo que más se lleva cuando cambia el tiempo, ya combinado."},
      regalar:{n:"Para regalar", txt:"Detalles preparados en caja con lazo. Si quiere, le añadimos una tarjeta escrita."}
    }
  }
};

/* Qué subcategorías sugerir junto a cada una («Llévelo a juego»). */
const COMBINA = {
  hilos:["agujas","corte","botones"], botones:["hilos","agujas","cintas"], cremalleras:["hilos","agujas","corte"],
  cintas:["botones","apliques","cierres"], agujas:["hilos","corte","lanas"], lanas:["agujas","corte","empezar"],
  corte:["hilos","agujas","cierres"], cierres:["hilos","cintas","agujas"], apliques:["hilos","agujas","cintas"],
  empezar:["lanas","hilos","corte"], temporada:["medias","calcetines","panuelos"], regalar:["panuelos","bisuteria","abanicos"],
  medias:["calcetines","lenceria","bolsos"], calcetines:["medias","lenceria","panuelos"], lenceria:["medias","calcetines","panuelos"],
  panuelos:["bisuteria","bolsos","pelo"], bolsos:["panuelos","bisuteria","abanicos"], bisuteria:["panuelos","pelo","bolsos"],
  abanicos:["bolsos","panuelos","bisuteria"], paraguas:["panuelos","bolsos","medias"], pelo:["bisuteria","panuelos","abanicos"]
};

/* Rótulos de los tipos de versión / medida, para «Color: Rojo», «Talla: M»… */
const ROTULOS = { color:"Color", talla:"Talla", medida:"Medida", tipo:"Tipo", importe:"Importe", modelo:"Modelo" };
const PLURALES = { color:"colores", talla:"tallas", medida:"medidas", tipo:"tipos", importe:"importes", modelo:"modelos" };

/* Ajustes que la v1 no tenía (tipo de versión cuando no es color). */
const AJUSTES = {
  "dedal":{tipoVar:"talla"}, "agujas-maquina":{tipoVar:"tipo"}, "agujas-punto":{tipoVar:"medida"},
  "ganchillo":{tipoVar:"medida"}, "bastidor":{tipoVar:"medida"}, "vale-regalo":{tipoVar:"importe"}
};

const PRODUCTOS = [];
const quitarTildesId = s => s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[^a-z0-9-]+/g,"-");

/* Color con nombre propio (p. ej. «750 Beach Hut») → color de la carta más parecido, para «Buscar por color». */
const rgb = h => /^#[0-9a-f]{6}$/i.test(h||"") ? [1,3,5].map(i=>parseInt(h.slice(i,i+2),16)) : null;
function lab(h){
  const l = rgb(h); if (!l) return null;
  const [r,g,b] = l.map(x => { x/=255; return x>.04045 ? ((x+.055)/1.055)**2.4 : x/12.92; });
  const f = t => t>.008856 ? Math.cbrt(t) : 7.787*t+16/116;
  const X=f((r*.4124+g*.3576+b*.1805)/.95047), Y=f(r*.2126+g*.7152+b*.0722), Z=f((r*.0193+g*.1192+b*.9505)/1.08883);
  return [116*Y-16, 500*(X-Y), 200*(Y-Z)];
}
const NO_FAMILIA = new Set(["Transparente","Nácar","Plata","Dorado","Oro rosa"]);
function familia(hex){
  const a = lab(hex); if (!a) return null;
  let mejor = null, d0 = Infinity;
  for (const [n,h] of Object.entries(COL)) { if (NO_FAMILIA.has(n)) continue; const b = lab(h); if (!b) continue;
    const d = (a[0]-b[0])**2 + (a[1]-b[1])**2 + (a[2]-b[2])**2; if (d < d0) { d0 = d; mejor = n; } }
  return mejor;
}

function p(id,cat,sub,nombre,precio,icono,vars,desc,extra={}){
  id = quitarTildesId(id);                       // p. ej. 'cinta-biés' → 'cinta-bies'
  const aj = AJUSTES[id] || {};
  const variantes = vars.map(v => typeof v==="string" ? {n:v, c:COL[v]||null} : {n:v.n, c:v.c||null, ...(v.foto ? {foto:v.foto, fam:familia(v.c)} : {})});
  const conColor = variantes.some(v=>v.c);
  let tipoVar = aj.tipoVar || (extra.tipoVar==="importes" ? "importe" : null) || (conColor ? "color" : variantes.length>1 ? "modelo" : null);
  const medidas = extra.tallas || extra.tamanos || [];
  const tipoMedida = medidas.length ? (extra.tallas ? "talla" : "medida") : null;
  const porMetro = !!extra.porMetro;
  PRODUCTOS.push({
    id, cat, sub, nombre, precio, icono, desc,
    variantes, tipoVar, conColor,
    medidas, tipoMedida,
    porMetro,
    unidad: porMetro ? "m" : "ud.",
    min: porMetro ? 0.5 : 1, paso: porMetro ? 0.5 : 1, max: porMetro ? 50 : 20,
    precios: extra.precios || null,              // precio por nombre de variante (tarjeta regalo)
    etiqueta: extra.etiqueta || null,
    stock: extra.stock || "si",                  // "si" | "pocas" (de la web de referencia)
    detalles: extra.detalles || [],
    destacado: !!extra.mas,
    novedad: false,                              // se marca abajo con NOVEDADES
    orden: PRODUCTOS.length
  });
}
const colores = (...n)=>n;
const tallas = (...n)=>n.map(t=>({n:t}));

/* ---------- MERCERÍA ---------- */





/* ---------- EJEMPLOS (dibujos, sin foto real): uno por subsección para que ninguna quede vacía.
   Se sustituyen por productos con foto en cuanto lleguen a la carpeta de Drive. ---------- */
p("hilo-coser-100","merceria","hilos","Hilo de coser poliéster 100 m",1.95,"bobina",colores("Blanco","Negro","Azul marino","Rojo","Beige","Gris perla","Rosa empolvado","Verde botella","Burdeos","Mostaza"),"Hilo resistente para coser a mano y a máquina. Sirve para casi todos los tejidos: algodón, mezcla y sintético.",{mas:true,detalles:["Bobina de 100 metros","100 % poliéster","Para máquina y para coser a mano"]});
p("boton-camisa","merceria","botones","Botones de camisa 4 agujeros (12 ud.)",1.60,"boton",colores("Blanco","Nácar","Negro","Celeste","Rosa empolvado","Beige"),"Botón clásico de 11 mm para camisas y blusas. Bolsita de 12 unidades.",{mas:true,detalles:["12 unidades","Diámetro 11 mm","Resina"],tamanos:["11 mm","14 mm"]});
p("cremallera-invisible","merceria","cremalleras","Cremallera invisible",1.75,"cremallera",colores("Negro","Blanco","Azul marino","Beige","Rojo","Rosa empolvado"),"Queda oculta en la costura. Perfecta para vestidos y faldas de fiesta.",{tamanos:["20 cm","40 cm","55 cm"]});
p("cinta-raso","merceria","cintas","Cinta de raso doble cara (metro)",0.65,"cinta",colores("Rosa empolvado","Blanco","Rojo","Azul marino","Celeste","Dorado","Negro","Burdeos","Verde menta","Lila"),"Brillante por ambos lados. Para lazos, regalos, ramos y arreglos.",{porMetro:true,tamanos:["6 mm","10 mm","25 mm"]});
p("alfiler-cabeza","merceria","agujas","Alfileres de cabeza de cristal (40 ud.)",3.20,"alfiler",colores("Multicolor","Rosa chicle","Celeste","Blanco"),"Alfileres con cabeza de cristal que se ve bien y no se derrite con la plancha.",{mas:true,detalles:["40 unidades","Largo 38 mm","Cabeza de cristal"]});
p("agujas-punto","merceria","lanas","Agujas de punto de bambú (par)",4.95,"agujas-punto",tallas("3 mm","3,5 mm","4 mm","4,5 mm","5 mm","6 mm","8 mm"),"Ligeras y cálidas al tacto, no resbalan los puntos.",{detalles:["Par de agujas","Largo 35 cm"]});
p("tijera-costura","merceria","corte","Tijeras de costura 21 cm",12.90,"tijera",colores("Negro","Rosa empolvado"),"Hoja de acero afilada para cortar tela con precisión. Mango cómodo.",{mas:true,detalles:["21 cm","Acero inoxidable"],stock:"pocas"});
p("elastico-plano","merceria","cierres","Elástico plano (metro)",0.70,"elastico",colores("Blanco","Negro"),"Para cinturillas de faldas y pantalones. Se vende por metros.",{mas:true,porMetro:true,tamanos:["10 mm","20 mm","30 mm"]});
p("parche-rodilla","merceria","apliques","Rodilleras termoadhesivas (2 ud.)",2.95,"parche",colores("Azul marino","Negro","Gris marengo","Azulón"),"Se pegan con la plancha. Para reparar pantalones de niño y de trabajo.",{mas:true,detalles:["Par","Termoadhesivas"]});
p("panti-20","complementos","medias","Panti transparente 20 den",3.95,"media",colores("Carne","Visón","Negro","Gris marengo","Azul marino"),"Panti fino de uso diario, con braguita reforzada y cintura cómoda.",{mas:true,tallas:["P","M","G","XG"],detalles:["20 deniers","Cintura ancha"]});
p("calcetin-ejecutivo","complementos","calcetines","Calcetín de caballero hilo de Escocia",4.50,"calcetin",colores("Negro","Azul marino","Gris marengo","Marrón","Burdeos"),"Fino, fresco y resistente. El clásico de vestir.",{mas:true,tallas:["39-42","43-46"]});
p("camiseta-interior","complementos","lenceria","Camiseta interior de algodón tirante ancho",8.90,"camiseta",colores("Blanco","Carne","Negro"),"Algodón suave que transpira. Puntilla discreta en el escote.",{mas:true,tallas:["S","M","L","XL","XXL"]});
p("panuelo-seda","complementos","panuelos","Pañuelo de seda estampado",18.90,"panuelo",colores("Estampado flores","Azul marino","Burdeos","Verde botella","Rosa empolvado"),"Pañuelo cuadrado de 90 × 90 cm. Para el cuello, el pelo o el asa del bolso.",{mas:true});
p("monedero","complementos","bolsos","Monedero de boquilla",9.90,"monedero",colores("Negro","Burdeos","Estampado flores","Rosa empolvado","Azul marino"),"El monedero de toda la vida, con cierre de boquilla que se abre con facilidad.",{etiqueta:"Muy pedido"});
p("pendientes-perla","complementos","bisuteria","Pendientes de perla de presión",8.90,"pendiente",colores("Nácar","Rosa empolvado","Gris perla"),"Perla sintética con cierre de presión fácil de poner.",{mas:true,tamanos:["6 mm","8 mm","10 mm"]});
p("abanico-madera","complementos","abanicos","Abanico de madera y tela",9.90,"abanico",colores("Rosa empolvado","Negro","Celeste","Estampado flores","Rojo","Lila"),"Abanico clásico de 23 cm con varillaje de madera.",{mas:true});
p("paraguas-plegable","complementos","paraguas","Paraguas plegable automático",14.90,"paraguas",colores("Negro","Azul marino","Burdeos","Estampado lunares","Estampado flores"),"Se abre y se cierra con un botón. Cabe en el bolso.",{mas:true});
p("pinza-pelo","complementos","pelo","Pinza de pelo de carey",4.95,"pinza",colores("Carey","Negro","Nácar","Rosa empolvado"),"Pinza tipo garra que sujeta el moño sin tirones.",{mas:true,tamanos:["Pequeña","Mediana","Grande"]});
p("kit-costurero","capsulas","empezar","Cápsula Costurero básico",9.95,"costurero",colores("Rosa empolvado","Azul marino","Estampado flores"),"Estuche con hilos, agujas, botones, imperdibles, enhebrador y tijera. Un regalo práctico.",{mas:true,etiqueta:"Para regalar",detalles:["Más de 40 piezas","Estuche con cremallera"]});
p("capsula-otono","capsulas","temporada","Cápsula Otoño cálido",24.50,"kit",colores("Burdeos","Camel","Gris marengo"),"Calcetines de lana, panti tupido de 40 den y un fular liso, a juego entre sí.",{stock:"pocas",detalles:["Calcetines de lana","Panti tupido 40 den","Fular liso"],tallas:["P","M","G","XG"]});
p("vale-regalo","capsulas","regalar","Tarjeta regalo La Valenciana",20,"vale",tallas("20 €","30 €","50 €"),"Para canjear en la tienda o en la web. La preparamos en sobre para regalar.",{tipoVar:"importes",precios:{"20 €":20,"30 €":30,"50 €":50}});

/* 100% Baby 3 de DMC: fotos reales (carpeta de Drive «Web Valenciana» › Hilos y lanas › 100% Baby 3).
   Las fotos están en assets/tienda/fotos/baby-3/<color>.webp. Los nombres de color son descriptivos:
   las fotos no traen el número de DMC (cambiarlos aquí y en la trastienda cuando se sepan). */
{ const F = n => `assets/tienda/fotos/baby-3/${n}.webp`;
p("baby-3","merceria","lanas","100% Baby 3 DMC 50 g",5.50,"ovillo",[
  {n:"Crudo",c:"#F4EEE1",foto:F("crudo")},
  {n:"Rosa",c:"#F7CFCC",foto:F("rosa")},
  {n:"Celeste",c:"#BDD0DC",foto:F("celeste")},
  {n:"Azul hielo",c:"#BED3DE",foto:F("azul-hielo")},
  {n:"Verde pistacho",c:"#D4D9C1",foto:F("verde-pistacho")},
  {n:"Gris perla",c:"#DED8DF",foto:F("gris-perla")},
  {n:"Beige",c:"#D3CAC4",foto:F("beige")}
],"Lana merino extrafina superwash de DMC, pensada para la piel del bebé: no pica y se lava a máquina. Para chaquetitas, patucos, gorros y mantas.",{detalles:["50 g, unos 165 m","100 % lana merino extrafina superwash","Agujas de 2,5 a 3,5 mm · ganchillo de 3 mm","Una chaquetita de 6 meses lleva 2 ovillos"]}); }
/* Happy Cotton de DMC: fotos reales de cada color (carpeta de Drive «Web Valenciana» › Hilos y lanas › Happy Cotton DMC).
   Las fotos están en assets/tienda/fotos/happy-cotton/<número>.webp. */
{ const F = n => `assets/tienda/fotos/happy-cotton/${n}.webp`;
p("happy-cotton","merceria","lanas","Happy Cotton DMC 20 g",1.75,"ovillo",[
  {n:"750 Beach Hut",c:"#69898D",foto:F("750")},
  {n:"751 Tea Time",c:"#B8C2ED",foto:F("751")},
  {n:"752 Zesty",c:"#D8CB2D",foto:F("752")},
  {n:"753 Freckle",c:"#FC7D57",foto:F("753")},
  {n:"754 Cherryade",c:"#CF1441",foto:F("754")},
  {n:"755 Jammy",c:"#DA185B",foto:F("755")},
  {n:"756 Currant Bun",c:"#5D2350",foto:F("756")},
  {n:"757 Moonbeam",c:"#CCC4C3",foto:F("757")},
  {n:"758 School Days",c:"#192850",foto:F("758")},
  {n:"759 Pebble",c:"#C0B0AD",foto:F("759")},
  {n:"760 Flamingo",c:"#EFB8C7",foto:F("760")},
  {n:"761 Dolly",c:"#F7F5F2",foto:F("761")},
  {n:"763 Puff",c:"#F9DEE4",foto:F("763")},
  {n:"764 Piggy",c:"#FCBBC6",foto:F("764")},
  {n:"765 Bath Time",c:"#E9EDEC",foto:F("765")},
  {n:"766 Frilly",c:"#FCE4F2",foto:F("766")},
  {n:"767 Splash",c:"#95AAB1",foto:F("767")},
  {n:"768 Sulk",c:"#C6939B",foto:F("768")},
  {n:"769 Unicorn",c:"#E5B5CB",foto:F("769")},
  {n:"771 Buttercup",c:"#EFD45E",foto:F("771")},
  {n:"772 Safari",c:"#D0AB73",foto:F("772")},
  {n:"775 Liquorice",c:"#1E1D22",foto:F("775")},
  {n:"776 Biscuit",c:"#AC8354",foto:F("776")},
  {n:"777 Cookie",c:"#664432",foto:F("777")},
  {n:"778 Sherbet",c:"#D5D791",foto:F("778")},
  {n:"779 Fizz",c:"#BAE06A",foto:F("779")},
  {n:"780 Treetop",c:"#5C9149",foto:F("780")},
  {n:"781 Wicket",c:"#089B59",foto:F("781")},
  {n:"782 Laundry",c:"#75CB93",foto:F("782")},
  {n:"784 Seaside",c:"#3CBEBE",foto:F("784")},
  {n:"785 Bubbly",c:"#8EDBF3",foto:F("785")},
  {n:"786 Yarch",c:"#0B8DB3",foto:F("786")},
  {n:"787 Sunday",c:"#EDD98B",foto:F("787")},
  {n:"788 Quack",c:"#F6E503",foto:F("788")},
  {n:"789 Lippy",c:"#CB0420",foto:F("789")},
  {n:"790 Ketchup",c:"#D8553A",foto:F("790")},
  {n:"791 Chilli",c:"#871D2A",foto:F("791")},
  {n:"792 Juicy",c:"#F69404",foto:F("792")},
  {n:"793 Sorbet",c:"#FD8F6F",foto:F("793")},
  {n:"794 Melon",c:"#F1AC10",foto:F("794")},
  {n:"795 Giggle",c:"#C65C9D",foto:F("795")},
  {n:"796 Angel",c:"#C1C8DA",foto:F("796")},
  {n:"797 Bunting",c:"#7A87C7",foto:F("797")},
  {n:"798 Princess",c:"#3A4A89",foto:F("798")},
  {n:"799 Bubblegum",c:"#FA7199",foto:F("799")},
  {n:"801 Slipper",c:"#FDD3C6",foto:F("801")},
  {n:"802 Peachy",c:"#F9B594",foto:F("802")},
  {n:"804 Cinnabun",c:"#BF7B69",foto:F("804")},
  {n:"805 Treacle",c:"#74301F",foto:F("805")}
],"Ovillo de algodón 100 % de DMC, suave y con brillo, en 49 colores. Ideal para amigurumis, ganchillo y pequeñas labores de punto.",{detalles:["20 g, unos 43 m","100 % algodón","Ganchillo o agujas de 3 mm"]}); }





/* ---------- COMPLEMENTOS ---------- */


/* ---------------- índices y consultas ---------------- */

/* ---------- CÁPSULAS (las de la web de referencia) y productos que faltaban ---------- */

const PORID = Object.fromEntries(PRODUCTOS.map(x=>[x.id,x]));
/* «Lo que más nos piden» (portada) y «Novedades» (temporada de otoño-invierno). Listas de ids editables. */
const NOVEDADES = ["baby-3","happy-cotton","ovillo-bebe","bufanda-punto","calcetin-termico","panti-tupido","kit-iniciacion-punto","capsula-invierno","ganchillo","fular","paraguas-plegable"].filter(id=>PORID[id]);
NOVEDADES.forEach(id => { PORID[id].novedad = true; });
const DESTACADOS = ["panti-descanso","hilo-coser-100","ovillo-acrilico","monedero","boton-camisa","abanico-madera","calcetin-diabetico","kit-costurero"].filter(id=>PORID[id]);

const producto = id => PORID[id] || null;
const categoria = cat => CATS[cat] || null;
const subcategoria = (cat, sub) => (CATS[cat] && CATS[cat].subs[sub]) || null;
/** Lista de subcategorías de una categoría: [{id, n, fondo, txt, cuenta}] */
/*  Solo las que tienen productos: la tienda únicamente enseña artículos con foto real, y una subsección
    vacía no aparece en menús ni listados hasta que se le añade el primero (desde aquí o desde la trastienda). */
const subcategorias = cat => CATS[cat] ? Object.entries(CATS[cat].subs).map(([id,s])=>({id, ...s, cuenta: productosDe(cat,id).length})).filter(s=>s.cuenta) : [];
/** Productos de una categoría (y subcategoría opcional), en orden del catálogo. */
/** Nombre del token de lienzo de un producto o subcategoría: "rosa" | "lavanda" | "mantequilla" */
const lienzoDe = (cat, sub) => (CATS[cat] && CATS[cat].subs[sub] && CATS[cat].subs[sub].lienzo) || (CATS[cat] && CATS[cat].lienzo) || "rosa";
/** Color CSS del lienzo de un producto: "var(--c-rosa)" (sirve en style= y en fill= de SVG en línea) */
const lienzo = prod => `var(--c-${lienzoDe(prod.cat, prod.sub)})`;
const productosDe = (cat, sub) => PRODUCTOS.filter(x => x.cat===cat && (!sub || x.sub===sub));
/** Categoría de una subcategoría (las ids de sub son únicas en todo el catálogo). */
const catDeSub = sub => Object.keys(CATS).find(c => CATS[c].subs[sub]) || null;
/** Precio unitario de una versión (la tarjeta regalo cambia de precio por importe). */
const precioDe = (prod, nombreVariante) => (prod.precios && prod.precios[nombreVariante]) || prod.precio;
/** ¿Tiene precios distintos según versión? (para mostrar «desde») */
const tieneDesde = prod => !!prod.precios;
/** Índice de una variante por nombre (0 si no existe). */
const idxVariante = (prod, nombre) => Math.max(0, prod.variantes.findIndex(v=>v.n===nombre));
/** ¿Hay que elegir algo en la ficha antes de añadir? */
const hayQueElegir = prod => prod.variantes.length>1 || prod.medidas.length>1;
/** Rótulo para el tipo de versión: "Color", "Talla"… */
const rotulo = tipo => ROTULOS[tipo] || "Opción";
/** Texto corto de versiones: "10 colores", "3 tallas", "" */
function textoVersiones(prod){
  if (prod.variantes.length>1) return `${prod.variantes.length} ${PLURALES[prod.tipoVar]||"opciones"}`;
  if (prod.medidas.length>1) return `${prod.medidas.length} ${PLURALES[prod.tipoMedida]||"medidas"}`;
  return "";
}
/** Productos parecidos: misma subcategoría; si son pocos, se completa con la misma categoría. */
function parecidos(prod, n=8){
  const mismos = productosDe(prod.cat, prod.sub).filter(x=>x.id!==prod.id);
  const resto = mismos.length<n ? productosDe(prod.cat).filter(x=>x.id!==prod.id && x.sub!==prod.sub) : [];
  return [...mismos, ...resto].slice(0, n);
}
/** «Llévelo a juego»: productos de las subcategorías de COMBINA (2 de cada una, alternando). */
function aJuego(prod, n=6, excluir=[]){
  const fuera = new Set([prod.id, ...excluir]);
  const listas = (COMBINA[prod.sub]||[]).map(s => productosDe(catDeSub(s), s).filter(x=>!fuera.has(x.id)));
  const out = [];
  for (let i=0; out.length<n && listas.some(l=>l[i]); i++) for (const l of listas) if (l[i] && out.length<n) out.push(l[i]);
  return out;
}
/** Productos "hermanos" (otras versiones del mismo artículo con distinto id): mismo icono y subcategoría. */
const hermanos = prod => PRODUCTOS.filter(x=>x.id!==prod.id && x.sub===prod.sub && x.icono===prod.icono);
/** Iconos de dibujo usados en el catálogo (lista para B8). */
const iconos = () => [...new Set(PRODUCTOS.map(x=>x.icono))].sort();

// Comprobación de integridad (solo avisa por consola)
(function comprobar(){
  const ids = new Set();
  for (const x of PRODUCTOS){
    if (ids.has(x.id)) console.warn("[LV.datos] id repetido:", x.id);
    ids.add(x.id);
    if (!/^[a-z0-9-]+$/.test(x.id)) console.warn("[LV.datos] id no ASCII:", x.id);
    if (!subcategoria(x.cat,x.sub)) console.warn("[LV.datos] subcategoría desconocida:", x.id, x.cat, x.sub);
    for (const v of x.variantes) if (x.tipoVar==="color" && !v.c) console.warn("[LV.datos] color sin hex:", x.id, v.n);
  }
})();

return Object.freeze({
  TIENDA, COL, CATS, COMBINA, PRODUCTOS, PORID, DESTACADOS, NOVEDADES, ROTULOS, PLURALES,
  producto, categoria, subcategoria, subcategorias, productosDe, catDeSub, lienzoDe, lienzo,
  precioDe, tieneDesde, idxVariante, hayQueElegir, rotulo, textoVersiones,
  parecidos, aJuego, hermanos, iconos
});
})();
