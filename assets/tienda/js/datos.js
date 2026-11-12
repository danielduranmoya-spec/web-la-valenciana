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
  dir: "Plaza de Espronceda, 2, 06200 Almendralejo (Badajoz)",
  calle: "Plaza de Espronceda, 2", cp: "06200", ciudad: "Almendralejo", provincia: "Badajoz",
  mapa: "https://www.google.com/maps/search/?api=1&query=Plaza+de+Espronceda+2+Almendralejo",
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

function p(id,cat,sub,nombre,precio,icono,vars,desc,extra={}){
  id = quitarTildesId(id);                       // p. ej. 'cinta-biés' → 'cinta-bies'
  const aj = AJUSTES[id] || {};
  const variantes = vars.map(v => typeof v==="string" ? {n:v, c:COL[v]||null} : {n:v.n, c:v.c||null});
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
p("hilo-coser-100","merceria","hilos","Hilo de coser poliéster 100 m",1.95,"bobina",colores("Blanco","Negro","Azul marino","Rojo","Beige","Gris perla","Rosa empolvado","Verde botella","Burdeos","Mostaza"),"Hilo resistente para coser a mano y a máquina. Sirve para casi todos los tejidos: algodón, mezcla y sintético.",{mas:true,detalles:["Bobina de 100 metros","100 % poliéster","Para máquina y para coser a mano"]});
p("hilo-coser-500","merceria","hilos","Hilo de coser poliéster 500 m",4.80,"bobina",colores("Blanco","Negro","Azul marino","Gris marengo","Crudo","Beige"),"Bobina grande para quien cose a menudo. Mismo hilo de confianza, más metros y mejor precio.",{detalles:["Bobina de 500 metros","100 % poliéster","Ideal para máquina de coser"]});
p("hilo-bordar","merceria","hilos","Madeja de hilo de bordar algodón",1.10,"madeja",colores("Rojo","Celeste","Verde menta","Amarillo","Lila","Rosa chicle","Negro","Blanco","Naranja","Turquesa"),"Madeja de 6 cabos que se pueden separar. Brillo suave y colores que aguantan el lavado.",{mas:true,detalles:["8 metros por madeja","100 % algodón mercerizado","Se separa en cabos"]});
p("hilo-invisible","merceria","hilos","Hilo invisible de nailon",2.50,"bobina",colores("Transparente","Negro"),"Para dobladillos y arreglos que no se deben notar. Se adapta a cualquier color de tela.",{detalles:["Bobina de 200 metros","Nailon monofilamento"]});
p("hilo-pespunte","merceria","hilos","Hilo grueso para pespunte vaquero",2.95,"bobina",colores("Mostaza","Crudo","Azul marino","Negro"),"Hilo de grosor extra para costuras vistas en vaqueros, bolsos y tapicería.",{detalles:["Bobina de 30 metros","Grosor 30","Usar con aguja de vaquero"]});
p("hilo-elastico","merceria","hilos","Hilo elástico para fruncir",1.85,"bobina",colores("Blanco","Negro"),"Para hacer fruncidos y nido de abeja en la canilla de la máquina.",{detalles:["Bobina de 20 metros"]});

p("boton-camisa","merceria","botones","Botones de camisa 4 agujeros (12 ud.)",1.60,"boton",colores("Blanco","Nácar","Negro","Celeste","Rosa empolvado","Beige"),"Botón clásico de 11 mm para camisas y blusas. Bolsita de 12 unidades.",{mas:true,detalles:["12 unidades","Diámetro 11 mm","Resina"],tamanos:["11 mm","14 mm"]});
p("boton-abrigo","merceria","botones","Botón de abrigo con pie (4 ud.)",3.40,"boton-pie",colores("Negro","Marrón","Camel","Gris marengo","Azul marino","Carey"),"Botón grande con pie para abrigos y chaquetones. Cose sin que la prenda tire.",{detalles:["4 unidades","Diámetro 25 mm"],tamanos:["20 mm","25 mm","30 mm"]});
p("boton-madera","merceria","botones","Botones de madera natural (6 ud.)",2.20,"boton",colores("Camel","Marrón","Beige"),"Botón de madera de dos agujeros. Ideal para punto, rebecas y ropa de bebé.",{detalles:["6 unidades","Diámetro 18 mm"]});
p("boton-metal","merceria","botones","Botón metálico con ancla (4 ud.)",3.90,"boton-metal",colores("Dorado","Plata","Gris marengo"),"Botón de aire marinero con relieve. Da un toque elegante a chaquetas y blazers.",{detalles:["4 unidades","Diámetro 18 mm","Metal con pie"]});
p("boton-infantil","merceria","botones","Botones infantiles de colores (8 ud.)",2.40,"boton-flor",colores("Rosa chicle","Celeste","Amarillo","Verde menta","Lila"),"Botones con forma de flor para ropa de niño y manualidades.",{detalles:["8 unidades","Diámetro 15 mm"]});
p("boton-forrar","merceria","botones","Botones para forrar con tela (5 ud.)",2.75,"boton",colores("Plata"),"Botón metálico con tapa para forrar con la misma tela de la prenda.",{detalles:["5 unidades","Incluye tapas"],tamanos:["15 mm","19 mm","23 mm"]});
p("broche-presion","merceria","cierres","Broches de presión para coser (10 ud.)",1.70,"broche",colores("Negro","Plata","Transparente"),"Automáticos de coser para cierres discretos en blusas, vestidos y cojines.",{detalles:["10 juegos","Varias medidas"]});

p("cremallera-fija","merceria","cremalleras","Cremallera de nailon fija",1.40,"cremallera",colores("Negro","Blanco","Azul marino","Rojo","Beige","Gris perla","Burdeos","Verde botella","Rosa empolvado"),"Cremallera para faldas, pantalones y cojines. Cerrada por abajo.",{mas:true,tamanos:["15 cm","20 cm","25 cm"]});
p("cremallera-invisible","merceria","cremalleras","Cremallera invisible",1.75,"cremallera",colores("Negro","Blanco","Azul marino","Beige","Rojo","Rosa empolvado"),"Queda oculta en la costura. Perfecta para vestidos y faldas de fiesta.",{tamanos:["20 cm","40 cm","55 cm"]});
p("cremallera-separable","merceria","cremalleras","Cremallera separable para chaqueta",3.95,"cremallera",colores("Negro","Azul marino","Gris marengo","Rojo","Marrón"),"Se abre por completo. Para cazadoras, chaquetas de punto y abrigos.",{tamanos:["50 cm","60 cm","70 cm"]});
p("cremallera-metal","merceria","cremalleras","Cremallera metálica vaquera",1.95,"cremallera-metal",colores("Dorado","Plata","Gris marengo"),"Dientes de metal resistentes para vaqueros y prendas de trabajo.",{tamanos:["12 cm","18 cm"]});
p("tirador","merceria","cremalleras","Tirador de repuesto para cremallera (3 ud.)",1.50,"tirador",colores("Negro","Plata","Dorado"),"Si se ha roto el tirador, no hace falta cambiar toda la cremallera.",{detalles:["3 unidades","Para dientes de 5 mm"]});

p("puntilla-algodon","merceria","cintas","Puntilla de algodón (metro)",1.80,"puntilla",colores("Blanco","Crudo","Beige"),"Puntilla tradicional para sábanas, toallas y ropa de bebé. Se vende por metros.",{mas:true,porMetro:true,tamanos:["2 cm de ancho","4 cm de ancho"]});
p("cinta-raso","merceria","cintas","Cinta de raso doble cara (metro)",0.65,"cinta",colores("Rosa empolvado","Blanco","Rojo","Azul marino","Celeste","Dorado","Negro","Burdeos","Verde menta","Lila"),"Brillante por ambos lados. Para lazos, regalos, ramos y arreglos.",{porMetro:true,tamanos:["6 mm","10 mm","25 mm"]});
p("cinta-terciopelo","merceria","cintas","Cinta de terciopelo (metro)",0.95,"cinta",colores("Negro","Burdeos","Verde botella","Azul marino","Rosa empolvado"),"Tacto suave y aspecto elegante. Muy usada en sombreros, vestidos y adornos de Navidad.",{porMetro:true,tamanos:["10 mm","22 mm"]});
p("cinta-bies","merceria","cintas","Cinta al bies (rollo 3 m)",1.95,"cinta",colores("Blanco","Negro","Azul marino","Rojo","Estampado lunares","Estampado flores"),"Para rematar bordes, delantales y escotes con un acabado limpio.",{tamanos:["18 mm","25 mm"]});
p("cinta-mochila","merceria","cintas","Cinta de mochila (metro)",1.20,"cinta",colores("Negro","Azul marino","Kaki","Rojo"),"Cinta fuerte de polipropileno para asas de bolsos y mochilas.",{porMetro:true,tamanos:["25 mm","30 mm"]});
p("cordon","merceria","cintas","Cordón de algodón trenzado (metro)",0.85,"cordon",colores("Blanco","Crudo","Negro","Rosa empolvado","Azul marino"),"Para capuchas, pantalones de deporte y bolsitas.",{porMetro:true,tamanos:["3 mm","5 mm"]});

p("alfiler-cabeza","merceria","agujas","Alfileres de cabeza de cristal (40 ud.)",3.20,"alfiler",colores("Multicolor","Rosa chicle","Celeste","Blanco"),"Alfileres con cabeza de cristal que se ve bien y no se derrite con la plancha.",{mas:true,detalles:["40 unidades","Largo 38 mm","Cabeza de cristal"]});
p("alfiler-perla","merceria","agujas","Alfileres de cabeza de perla (100 ud.)",2.60,"alfiler",colores("Blanco","Nácar","Multicolor"),"Cabeza redonda grande, fáciles de coger. Muy cómodos si cuesta ver o sujetar.",{detalles:["100 unidades","Largo 36 mm"]});
p("imperdibles","merceria","agujas","Imperdibles surtidos (30 ud.)",1.50,"imperdible",colores("Plata","Dorado","Negro"),"Tres tamaños en un estuche. Siempre vienen bien a mano.",{detalles:["30 unidades","3 tamaños"]});
p("agujas-mano","merceria","agujas","Agujas de coser a mano surtidas (20 ud.)",1.95,"aguja",[{n:"Surtido"}],"Estuche con agujas finas, medianas y de zurcir. Ojo amplio para enhebrar mejor.",{detalles:["20 unidades","Varios tamaños"]});
p("agujas-maquina","merceria","agujas","Agujas para máquina de coser (5 ud.)",3.50,"aguja",tallas("Nº 70 · tejido fino","Nº 80 · universal","Nº 90 · universal","Nº 100 · vaquero","Punta bola · punto"),"Agujas de máquina doméstica. Cambie la aguja cada pocas horas de costura para que el punto salga bien.",{detalles:["5 unidades","Para máquina doméstica"]});
p("enhebrador","merceria","agujas","Enhebrador de agujas (3 ud.)",1.20,"enhebrador",colores("Plata","Rosa chicle"),"Pasa el hilo por el ojo de la aguja sin esfuerzo. Muy recomendado si cuesta ver de cerca.",{detalles:["3 unidades"]});
p("dedal","merceria","agujas","Dedal metálico",1.80,"dedal",tallas("Talla S","Talla M","Talla L"),"Dedal clásico para proteger el dedo al coser a mano.");
p("acerico","merceria","agujas","Acerico de pulsera",4.50,"acerico",colores("Rosa empolvado","Estampado flores","Verde menta"),"Alfiletero con pulsera para tener los alfileres siempre a mano mientras cose.");

p("ovillo-acrilico","merceria","lanas","Ovillo de lana acrílica 100 g",2.95,"ovillo",colores("Blanco","Crudo","Rosa empolvado","Celeste","Gris perla","Mostaza","Burdeos","Azul marino","Verde botella","Lila","Negro","Coral"),"Suave, lavable a máquina y que no pica. Rinde mucho para mantas, bufandas y jerséis.",{mas:true,detalles:["100 g, unos 280 m","100 % acrílico","Aguja recomendada 4-4,5 mm"]});
p("ovillo-bebe","merceria","lanas","Lana de bebé antialérgica 50 g",3.40,"ovillo",colores("Blanco","Celeste","Rosa empolvado","Amarillo","Verde menta","Crudo"),"Hilado muy fino y suave para patucos, chaquetitas y mantas de bebé.",{detalles:["50 g","Aguja recomendada 3 mm"]});
p("ovillo-algodon","merceria","lanas","Algodón para ganchillo 50 g",2.75,"ovillo",colores("Blanco","Crudo","Beige","Rosa empolvado","Turquesa","Amarillo","Coral"),"Algodón mercerizado para tapetes, puntillas y amigurumis.",{detalles:["50 g, unos 170 m","Ganchillo 2,5-3 mm"]});
p("agujas-punto","merceria","lanas","Agujas de punto de bambú (par)",4.95,"agujas-punto",tallas("3 mm","3,5 mm","4 mm","4,5 mm","5 mm","6 mm","8 mm"),"Ligeras y cálidas al tacto, no resbalan los puntos.",{detalles:["Par de agujas","Largo 35 cm"]});
p("ganchillo","merceria","lanas","Aguja de ganchillo con mango blando",3.60,"ganchillo",tallas("2 mm","2,5 mm","3 mm","3,5 mm","4 mm","5 mm","6 mm"),"Mango ergonómico que cansa menos la mano. Recomendado si se teje mucho rato.");
p("bastidor","merceria","lanas","Bastidor de bordar de madera",3.25,"bastidor",tallas("15 cm","20 cm","25 cm"),"Mantiene la tela tensa para bordar con comodidad.");
p("marcadores","merceria","lanas","Marcadores de puntos (20 ud.)",2.10,"marcador",colores("Multicolor"),"Anillas para señalar vueltas y aumentos en punto y ganchillo.");

p("tijera-costura","merceria","corte","Tijeras de costura 21 cm",12.90,"tijera",colores("Negro","Rosa empolvado"),"Hoja de acero afilada para cortar tela con precisión. Mango cómodo.",{mas:true,detalles:["21 cm","Acero inoxidable"],stock:"pocas"});
p("tijera-hilo","merceria","corte","Tijera corta-hilos",3.95,"tijera",colores("Plata","Dorado"),"Pequeña y práctica para cortar hilos junto a la máquina.");
p("cinta-metrica","merceria","corte","Cinta métrica 150 cm",1.60,"metro",colores("Amarillo","Rosa chicle","Blanco"),"Cinta de modista con números grandes por las dos caras.",{detalles:["150 cm","Números grandes"]});
p("jaboncillo","merceria","corte","Jaboncillo de sastre (2 ud.)",1.40,"jaboncillo",colores("Blanco","Celeste","Rojo"),"Marca la tela y se borra al cepillar o lavar.");
p("descosedor","merceria","corte","Descosedor con capuchón",1.75,"descosedor",colores("Rosa chicle","Celeste"),"Para deshacer costuras sin estropear la tela.");

p("elastico-plano","merceria","cierres","Elástico plano (metro)",0.70,"elastico",colores("Blanco","Negro"),"Para cinturillas de faldas y pantalones. Se vende por metros.",{mas:true,porMetro:true,tamanos:["10 mm","20 mm","30 mm"]});
p("elastico-redondo","merceria","cierres","Goma redonda (metro)",0.45,"elastico",colores("Blanco","Negro","Plata"),"Goma fina de sección redonda para mascarillas, puños y manualidades.",{porMetro:true});
p("corchetes","merceria","cierres","Corchetes de coser (12 juegos)",1.30,"corchete",colores("Negro","Plata"),"Macho y hembra para cierres de faldas y sujetadores.");
p("velcro","merceria","cierres","Cinta de velcro para coser (metro)",1.90,"velcro",colores("Blanco","Negro","Beige"),"Cierre rápido y fácil. Muy útil para ropa adaptada.",{porMetro:true,tamanos:["20 mm","25 mm"]});

p("parche-rodilla","merceria","apliques","Rodilleras termoadhesivas (2 ud.)",2.95,"parche",colores("Azul marino","Negro","Gris marengo","Azulón"),"Se pegan con la plancha. Para reparar pantalones de niño y de trabajo.",{mas:true,detalles:["Par","Termoadhesivas"]});
p("aplique-flor","merceria","apliques","Aplique bordado de flor",1.95,"aplique",colores("Rosa empolvado","Rojo","Amarillo","Celeste","Lila"),"Flor bordada para tapar un roto o decorar una prenda. Se pega o se cose.");
p("entretela","merceria","apliques","Entretela termoadhesiva (metro)",3.40,"tela",colores("Blanco","Negro"),"Da cuerpo a cuellos, puños y tapetas. Se fija con la plancha.",{porMetro:true});

p("kit-costurero","capsulas","empezar","Cápsula Costurero básico",9.95,"costurero",colores("Rosa empolvado","Azul marino","Estampado flores"),"Estuche con hilos, agujas, botones, imperdibles, enhebrador y tijera. Un regalo práctico.",{mas:true,etiqueta:"Para regalar",detalles:["Más de 40 piezas","Estuche con cremallera"]});
p("kit-iniciacion-punto","capsulas","empezar","Cápsula Primer punto",19.90,"kit",colores("Rosa empolvado","Gris perla","Celeste"),"Dos ovillos, agujas de bambú, marcadores y una hoja con un patrón sencillo de bufanda.",{etiqueta:"Para empezar"});
p("kit-bordado","capsulas","empezar","Cápsula Punto de cruz",16.50,"kit",colores("Estampado flores","Lila"),"Tela marcada, bastidor, seis madejas y aguja. Explicado paso a paso.",{etiqueta:"Para empezar"});
p("vale-regalo","capsulas","regalar","Tarjeta regalo La Valenciana",20,"vale",tallas("20 €","30 €","50 €"),"Para canjear en la tienda o en la web. La preparamos en sobre para regalar.",{tipoVar:"importes",precios:{"20 €":20,"30 €":30,"50 €":50}});

/* ---------- COMPLEMENTOS ---------- */
p("panti-20","complementos","medias","Panti transparente 20 den",3.95,"media",colores("Carne","Visón","Negro","Gris marengo","Azul marino"),"Panti fino de uso diario, con braguita reforzada y cintura cómoda.",{mas:true,tallas:["P","M","G","XG"],detalles:["20 deniers","Cintura ancha"]});
p("panti-tupido","complementos","medias","Panti tupido opaco 60 den",5.90,"media",colores("Negro","Azul marino","Gris marengo","Marrón","Burdeos"),"Abriga en invierno y no transparenta. Mantiene el color lavado tras lavado.",{tallas:["P","M","G","XG"]});
p("panti-descanso","complementos","medias","Panti de descanso compresión suave",9.95,"media",colores("Carne","Visón","Negro"),"Compresión ligera que alivia las piernas cansadas. Muy pedido para el día a día.",{etiqueta:"Muy pedido",tallas:["P","M","G","XG"]});
p("media-liga","complementos","medias","Media con blonda autoadherente",7.50,"media",colores("Negro","Carne"),"Media de fiesta con blonda de silicona que se sujeta sola.",{tallas:["P-M","G-XG"]});
p("calcetin-ejecutivo","complementos","calcetines","Calcetín de caballero hilo de Escocia",4.50,"calcetin",colores("Negro","Azul marino","Gris marengo","Marrón","Burdeos"),"Fino, fresco y resistente. El clásico de vestir.",{mas:true,tallas:["39-42","43-46"]});
p("calcetin-diabetico","complementos","calcetines","Calcetín sin puño que no aprieta",5.50,"calcetin",colores("Blanco","Negro","Gris perla","Azul marino"),"Sin goma en el puño para no marcar ni dificultar la circulación. Recomendado para pies sensibles y personas con diabetes.",{etiqueta:"Sin presión",tallas:["35-38","39-42","43-46"]});
p("calcetin-termico","complementos","calcetines","Calcetín térmico de invierno",6.20,"calcetin",colores("Gris perla","Burdeos","Azul marino","Rosa empolvado"),"Interior afelpado que mantiene los pies calientes.",{tallas:["35-38","39-42","43-46"]});
p("pinkies","complementos","calcetines","Pinkies invisibles (3 pares)",3.95,"calcetin",colores("Carne","Negro","Blanco"),"No se ven con bailarinas ni zapato bajo. Antideslizante en el talón.",{tallas:["35-38","39-42"]});
p("camiseta-interior","complementos","lenceria","Camiseta interior de algodón tirante ancho",8.90,"camiseta",colores("Blanco","Carne","Negro"),"Algodón suave que transpira. Puntilla discreta en el escote.",{mas:true,tallas:["S","M","L","XL","XXL"]});
p("braga-algodon","complementos","lenceria","Braga alta de algodón (2 ud.)",9.50,"braga",colores("Blanco","Carne","Negro"),"Cintura alta, costuras planas y tejido sin picores.",{tallas:["S","M","L","XL","XXL"]});
p("sujetador-sin-aros","complementos","lenceria","Sujetador sin aros de algodón",17.90,"sujetador",colores("Blanco","Carne","Negro"),"Sujeción cómoda, tirantes anchos y cierre delantero, más fácil de abrochar.",{tallas:["90","95","100","105","110"]});
p("camison","complementos","lenceria","Camisón de algodón manga corta",22.50,"camison",colores("Rosa empolvado","Celeste","Estampado flores"),"Fresco, amplio y con botones en el escote.",{tallas:["M","L","XL","XXL"],stock:"pocas"});
p("panuelo-seda","complementos","panuelos","Pañuelo de seda estampado",18.90,"panuelo",colores("Estampado flores","Azul marino","Burdeos","Verde botella","Rosa empolvado"),"Pañuelo cuadrado de 90 × 90 cm. Para el cuello, el pelo o el asa del bolso.",{mas:true});
p("fular","complementos","panuelos","Fular de viscosa ligero",12.50,"fular",colores("Rosa empolvado","Gris perla","Mostaza","Celeste","Estampado flores","Kaki"),"Suave y amplio, abriga sin pesar. Ideal para entretiempo.");
p("bufanda-punto","complementos","panuelos","Bufanda de punto suave",14.90,"bufanda",colores("Gris perla","Burdeos","Camel","Azul marino","Rosa empolvado"),"Punto grueso y esponjoso. No pica.");
p("panuelo-bolsillo","complementos","panuelos","Pañuelos de bolsillo de algodón (3 ud.)",6.50,"panuelito",colores("Blanco","Estampado flores","Celeste"),"Pañuelos de tela de los de siempre, en caja para regalar.",{etiqueta:"Para regalar"});
p("bolso-hombro","complementos","bolsos","Bolso de hombro de piel sintética",34.90,"bolso",colores("Negro","Camel","Marrón","Burdeos","Gris marengo"),"Tamaño mediano, varios bolsillos y cierre de cremallera. Asa ajustable.",{mas:true,stock:"pocas"});
p("bandolera","complementos","bolsos","Bandolera pequeña",24.90,"bandolera",colores("Negro","Camel","Rosa empolvado","Azul marino"),"Lo justo, con las manos libres. Correa larga regulable.");
p("monedero","complementos","bolsos","Monedero de boquilla",9.90,"monedero",colores("Negro","Burdeos","Estampado flores","Rosa empolvado","Azul marino"),"El monedero de toda la vida, con cierre de boquilla que se abre con facilidad.",{etiqueta:"Muy pedido"});
p("cartera","complementos","bolsos","Cartera de señora con tarjetero",19.90,"cartera",colores("Negro","Camel","Burdeos","Rosa empolvado"),"Cartera con monedero, ocho tarjetas y departamento para billetes.");
p("bolsa-compra","complementos","bolsos","Bolsa de la compra plegable",7.95,"bolsa",colores("Estampado flores","Estampado lunares","Azul marino"),"Se pliega en una bolsita y aguanta hasta 15 kg.");
p("pendientes-perla","complementos","bisuteria","Pendientes de perla de presión",8.90,"pendiente",colores("Nácar","Rosa empolvado","Gris perla"),"Perla sintética con cierre de presión fácil de poner.",{mas:true,tamanos:["6 mm","8 mm","10 mm"]});
p("collar-perlas","complementos","bisuteria","Collar de perlas sintéticas",16.90,"collar",colores("Nácar","Gris perla","Rosa empolvado"),"Una vuelta, cierre de imán sencillo de abrochar.");
p("pulsera","complementos","bisuteria","Pulsera elástica de cuentas",7.50,"pulsera",colores("Rosa empolvado","Turquesa","Dorado","Plata"),"Se pone sin cierre. Combina con todo.");
p("broche-flor","complementos","bisuteria","Broche de flor para solapa",9.50,"broche-flor",colores("Dorado","Plata","Rosa empolvado","Burdeos"),"Un detalle para chaquetas, abrigos y pañuelos.");
p("abanico-madera","complementos","abanicos","Abanico de madera y tela",9.90,"abanico",colores("Rosa empolvado","Negro","Celeste","Estampado flores","Rojo","Lila"),"Abanico clásico de 23 cm con varillaje de madera.",{mas:true});
p("abanico-encaje","complementos","abanicos","Abanico de encaje para ceremonia",19.50,"abanico",colores("Blanco","Negro","Crudo"),"Tela con encaje fino. Ideal para bodas, comuniones y bautizos.");
p("funda-abanico","complementos","abanicos","Funda para abanico",4.50,"funda",colores("Negro","Rosa empolvado","Estampado flores"),"Protege las varillas dentro del bolso.");
p("paraguas-plegable","complementos","paraguas","Paraguas plegable automático",14.90,"paraguas",colores("Negro","Azul marino","Burdeos","Estampado lunares","Estampado flores"),"Se abre y se cierra con un botón. Cabe en el bolso.",{mas:true});
p("paraguas-baston","complementos","paraguas","Paraguas de bastón grande",19.90,"paraguas",colores("Negro","Azul marino","Verde botella"),"Puño curvo de madera que sirve de apoyo y cubre a dos personas.",{etiqueta:"Muy resistente"});
p("pinza-pelo","complementos","pelo","Pinza de pelo de carey",4.95,"pinza",colores("Carey","Negro","Nácar","Rosa empolvado"),"Pinza tipo garra que sujeta el moño sin tirones.",{mas:true,tamanos:["Pequeña","Mediana","Grande"]});
p("diadema","complementos","pelo","Diadema forrada de tela",5.90,"diadema",colores("Negro","Burdeos","Azul marino","Estampado flores","Rosa empolvado"),"Forrada para no apretar detrás de las orejas.");
p("horquillas","complementos","pelo","Horquillas de moño (50 ud.)",1.95,"horquilla",colores("Negro","Marrón","Dorado"),"Las de toda la vida, en caja con tapa.");
p("coleteros","complementos","pelo","Coleteros de tela (4 ud.)",3.50,"coletero",colores("Estampado flores","Rosa empolvado","Negro","Multicolor"),"No dejan marca ni rompen el pelo.");


/* ---------------- índices y consultas ---------------- */

/* ---------- CÁPSULAS (las de la web de referencia) y productos que faltaban ---------- */
p("capsula-ganchillo","capsulas","empezar","Cápsula Ganchillo fácil",14.50,"kit",colores("Crudo","Rosa empolvado","Turquesa"),"Ganchillo de 4 mm, tres ovillos de algodón y el patrón de unos posavasos. Ideal para aprender.",{etiqueta:"Para empezar",detalles:["Ganchillo de 4 mm","3 ovillos de algodón de 50 g","Patrón de posavasos"]});
p("capsula-otono","capsulas","temporada","Cápsula Otoño cálido",24.50,"kit",colores("Burdeos","Camel","Gris marengo"),"Calcetines de lana, panti tupido de 40 den y un fular liso, a juego entre sí.",{stock:"pocas",detalles:["Calcetines de lana","Panti tupido 40 den","Fular liso"],tallas:["P","M","G","XG"]});
p("capsula-invierno","capsulas","temporada","Cápsula Invierno en casa",27.90,"kit",colores("Gris perla","Rosa empolvado","Azul marino"),"Leggins térmicos, calcetines de lana y bufanda de punto para estar a gusto en casa.",{detalles:["Leggins térmicos","Calcetines de lana","Bufanda de punto"],tallas:["P","M","G","XG"]});
p("capsula-detalle","capsulas","regalar","Cápsula Detalle",15.90,"panuelito",colores("Estampado flores","Rosa empolvado","Azul marino"),"Pañuelo estampado y pendientes de perla, en caja con lazo. Un regalo resuelto.",{etiqueta:"Para regalar",detalles:["Pañuelo estampado de 70 × 70 cm","Pendientes de perla","Caja con lazo"]});
p("capsula-tejer-companía","capsulas","regalar","Cápsula Para tejer en compañía",29.90,"kit",colores("Crudo","Mostaza","Verde menta"),"Dos juegos de agujas, cuatro ovillos y un patrón pensado para tejer de dos en dos.",{stock:"pocas",etiqueta:"Para regalar",detalles:["2 pares de agujas de bambú","4 ovillos de 100 g","Patrón para dos"]});
p("leggins-termicos","complementos","medias","Leggins térmicos",9.90,"media",colores("Negro","Gris marengo","Marrón","Azul marino"),"Interior afelpado que abriga sin abultar. Cintura alta y cómoda.",{tallas:["S","M","L","XL"]});
p("calcetin-infantil","complementos","calcetines","Calcetín infantil de algodón (3 pares)",5.90,"calcetin",colores("Celeste","Rosa empolvado","Blanco","Multicolor"),"Algodón suave y puño que no aprieta, para el colegio y para casa.",{tallas:["1-2 años","3-4 años","5-6 años","7-8 años"]});
p("lana-merino","merceria","lanas","Lana merino 50 g",4.90,"ovillo",colores("Crudo","Gris perla","Camel","Burdeos","Azul marino","Verde botella"),"Lana merino fina y suave que no pica. Para jerséis, gorros y prendas de bebé.",{stock:"pocas",detalles:["50 g, unos 125 m","100 % merino","Aguja recomendada 4 mm"]});
p("tela-aida","merceria","lanas","Tela Aida para punto de cruz",6.90,"tela",colores("Blanco","Crudo","Beige"),"Tela de cuadrícula marcada para bordar punto de cruz. Pieza de 50 × 50 cm.",{detalles:["50 × 50 cm","14 puntos por pulgada","Algodón"]});
p("boton-nacar","merceria","botones","Botones de nácar (6 ud.)",2.40,"boton",colores("Nácar","Blanco","Crudo"),"Nácar natural con brillo suave, para camisas y blusas de vestir.",{tamanos:["12 mm","15 mm","18 mm"],detalles:["6 unidades","Nácar natural","2 agujeros"]});

const PORID = Object.fromEntries(PRODUCTOS.map(x=>[x.id,x]));
/* «Lo que más nos piden» (portada) y «Novedades» (temporada de otoño-invierno). Listas de ids editables. */
const NOVEDADES = ["ovillo-bebe","bufanda-punto","calcetin-termico","panti-tupido","kit-iniciacion-punto","capsula-invierno","ganchillo","fular","paraguas-plegable"].filter(id=>PORID[id]);
NOVEDADES.forEach(id => { PORID[id].novedad = true; });
const DESTACADOS = ["panti-descanso","hilo-coser-100","ovillo-acrilico","monedero","boton-camisa","abanico-madera","calcetin-diabetico","kit-costurero"].filter(id=>PORID[id]);

const producto = id => PORID[id] || null;
const categoria = cat => CATS[cat] || null;
const subcategoria = (cat, sub) => (CATS[cat] && CATS[cat].subs[sub]) || null;
/** Lista de subcategorías de una categoría: [{id, n, fondo, txt, cuenta}] */
const subcategorias = cat => CATS[cat] ? Object.entries(CATS[cat].subs).map(([id,s])=>({id, ...s, cuenta: productosDe(cat,id).length})) : [];
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
