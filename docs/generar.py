# Genera todas las páginas de la web. Editar aquí y ejecutar: python3 docs/generar.py
import os, json, urllib.parse, pathlib
R=str(pathlib.Path(__file__).resolve().parent.parent)
WA='34633930935'
TEL='924 67 08 39'; TEL_HREF='tel:+34924670839'
WA_TXT='633 930 935'
CORREO='administracion@lavalencianamerceria.com'
PED_M='pedidos@lavalencianamerceria.com'; PED_C='pedidos@lavalencianacomplementos.com'
DIR1='Plaza de Espronceda 2'; DIR2='06200 Almendralejo (Badajoz)'
MAPS='https://www.google.com/maps/search/?api=1&amp;query=La+Valenciana+Plaza+de+Espronceda+2+Almendralejo'
HORARIO_CORTO='Lunes a sábado, de 10:00 a 14:00 y de 17:00 a 21:00'
REDES=[('https://www.instagram.com/_lavalenciana','Instagram','@_lavalenciana'),('https://www.tiktok.com/@_lavalenciana_','TikTok','@_lavalenciana_'),('https://www.facebook.com/mercerialavalenciana/','Facebook','La Valenciana')]
WA_ICO='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>'
TEL_ICO='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>'
MAPA_ICO='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>'
FLECHA='<span class="flecha" aria-hidden="true">→</span>'
def wa(msg): return f"https://wa.me/{WA}?text="+urllib.parse.quote(msg)
def btn_wa(msg,txt='Escríbenos por WhatsApp',cls='boton'): return f'<a class="{cls}" href="{wa(msg)}">{WA_ICO}{txt}</a>'
def btn_tel(cls='boton'): return f'<a class="{cls}" href="{TEL_HREF}">{TEL_ICO}Llamar al <span class="num">{TEL}</span></a>'

MERC=[('hilos-y-lanas','Hilos y lanas','Hilos de coser, de bordar y de ganchillo, y lanas para tejer en todos los grosores y colores. Si traes una muestra, buscamos el tono más parecido.',['Hilo de coser','Mouliné','Algodón para ganchillo','Lanas']),
 ('botones-y-cremalleras','Botones y cremalleras','Botones de todos los tamaños y materiales, y cremalleras a la medida que necesites. Trae el botón que te falta y lo comparamos en el mostrador.',['Botones','Corchetes y broches','Cremalleras','Velcro']),
 ('cintas-y-puntillas','Cintas y puntillas','Cintas, bieses, gomas, puntillas y entredoses para rematar cualquier prenda. Se venden por metros.',['Cintas','Bieses','Gomas','Puntillas']),
 ('agujas-y-accesorios','Agujas y accesorios de costura','Todo lo básico del costurero: agujas, alfileres, dedales, tijeras y cintas métricas.',['Agujas','Alfileres','Dedales','Tijeras']),
 ('labores','Labores','Material para punto, ganchillo, bordado y punto de cruz. Si estás empezando, te aconsejamos qué agujas y qué hilo elegir.',['Punto','Ganchillo','Bordado','Punto de cruz']),
 ('arreglos','Arreglos','Bajos, cremalleras y pequeños arreglos. Tráenos la prenda y te decimos plazo y precio antes de empezar.',['Bajos','Cambio de cremallera','Pequeños arreglos'])]
COMP=[('medias-y-pantis','Medias y pantis','Medias, pantis y leggins para el día a día y para las ocasiones especiales, en varias densidades y tallas.',['Pantis','Medias','Leggins','Tallas grandes']),
 ('calcetines','Calcetines','Calcetines de algodón, de lana y de fantasía para toda la familia.',['Algodón','Lana','Pinkies','Infantil']),
 ('lenceria','Lencería y ropa interior','Ropa interior cómoda y bonita: sujetadores, braguitas, camisetas interiores y lencería. Te ayudamos a encontrar tu talla.',['Sujetadores','Braguitas','Camisetas interiores','Lencería']),
 ('panuelos-y-bufandas','Pañuelos y bufandas','Pañuelos, fulares y bufandas para dar el toque final.',['Pañuelos','Fulares','Bufandas']),
 ('bolsos-y-bisuteria','Bolsos y bisutería','Bolsos, carteras y bisutería para completar tu estilo o para hacer un regalo.',['Bolsos','Carteras','Bisutería'])]

# Catálogo de ejemplo (nombre, detalle, precio en euros). EDITAR con productos y precios reales.
PRODUCTOS={
 'hilos-y-lanas':[('Hilo de coser poliéster','Bobina de 100 m · varios colores',1.50),('Madeja de mouliné','Algodón para bordar · 8 m',1.20),('Algodón para ganchillo','Ovillo de 50 g',3.50),('Lana merino','Ovillo de 50 g',4.90)],
 'botones-y-cremalleras':[('Botones de nácar','15 mm · bolsa de 6',2.40),('Cremallera invisible','20 cm · varios colores',1.80),('Corchetes metálicos','Caja de 12',1.50),('Velcro para coser','1 metro',2.20)],
 'cintas-y-puntillas':[('Cinta de raso','10 mm · por metro',0.60),('Bies de algodón','Por metro',0.80),('Goma plana','20 mm · por metro',0.90),('Puntilla de algodón','Por metro',1.90)],
 'agujas-y-accesorios':[('Agujas de coser surtidas','Sobre de 20',1.50),('Alfileres cabeza de perla','Caja de 50',2.90),('Dedal metálico','Varias tallas',1.80),('Tijeras de costura','21 cm',12.90)],
 'labores':[('Agujas de punto','Bambú · 4 mm',4.50),('Ganchillo de aluminio','3,5 mm',2.50),('Tela Aida','Punto de cruz · 50 × 50 cm',6.90),('Bastidor de bordado','Madera · 20 cm',3.90)],
 'medias-y-pantis':[('Panty transparente','20 den · tallas S a XL',3.95),('Panty tupido','40 den · tallas S a XL',5.50),('Medias de descanso','Compresión ligera',12.90),('Leggins térmicos','Interior afelpado',9.90)],
 'calcetines':[('Calcetín de algodón','Pack de 3',7.50),('Calcetín de lana','Par',4.90),('Pinkies','Pack de 3',4.50),('Calcetín infantil','Pack de 3',5.90)],
 'lenceria':[('Sujetador sin aros','Algodón · tallas 85 a 110',19.90),('Braguita de algodón','Tallas S a XXL',4.90),('Camiseta interior','Tirantes · algodón',8.90),('Camisón','Algodón estampado',24.90)],
 'panuelos-y-bufandas':[('Pañuelo estampado','70 × 70 cm',9.90),('Fular liso','Varios colores',12.90),('Bufanda de punto','Suave y cálida',14.90)],
 'bolsos-y-bisuteria':[('Bolso bandolera','Polipiel',29.90),('Monedero cartera','Con cremallera',12.90),('Pendientes','Bisutería',6.90),('Collar','Bisutería',9.90)],
}
def euros(x): return f"{x:,.2f}".replace(',','X').replace('.',',').replace('X','.')+' €'
import re as _re
def slugify(t): return _re.sub(r'[^a-z0-9]+','-',t.lower().translate(str.maketrans('áéíóúñü','aeiouñu')).replace('ñ','n')).strip('-')
CESTA_ICO='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 7V6a5 5 0 0 1 10 0v1h3a1 1 0 0 1 1 1.1l-1.2 12A2 2 0 0 1 17.8 22H6.2a2 2 0 0 1-2-1.9L3 8.1A1 1 0 0 1 4 7zm2 0h6V6a3 3 0 0 0-6 0zm-1 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg>'
def productos_html(slug,seccion,gris):
    ps=PRODUCTOS.get(slug)
    if not ps: return ''
    out=''
    for n,d,pr in ps:
        pid=slug+'--'+slugify(n)
        out+=f'''<li class="producto"><div class="muestra{' gris' if gris else ''}" aria-hidden="true"></div><div class="producto-texto"><h3>{n}</h3><p class="secundario">{d}</p><p class="precio num">{euros(pr)}</p></div><button class="boton anadir" type="button" data-id="{pid}" data-nombre="{n}" data-detalle="{d}" data-precio="{pr}" data-seccion="{seccion}">{CESTA_ICO}<span class="txt">Añadir a la cesta</span><span class="vh">: {n}</span></button></li>'''
    return f'<ul class="productos" aria-label="Productos de ejemplo">{out}</ul>'

NAV=[('merceria/','Mercería','merceria'),('complementos/','Complementos','complementos'),('#como-comprar','Cómo comprar',''),('#visitanos','Horario y dirección','')]
def cab(p,actual):
    items=[]
    for href,t,clave in NAV:
        h=(p+href) if not href.startswith('#') else (href if actual=='inicio' else (p or './')+href)
        cur=' aria-current="page"' if clave and clave==actual else ''
        items.append(f'<li><a href="{h}"{cur}>{t}</a></li>')
    contacto=f'<li class="menu-contacto"><a href="{TEL_HREF}">Llamar al <span class="num">{TEL}</span></a><a href="{wa("Hola, La Valenciana")}">WhatsApp <span class="num">{WA_TXT}</span></a></li>'
    return f'''<a class="salto" href="#contenido">Saltar al contenido</a>
<header class="cabecera">
  <div class="envoltura">
    <a class="marca" href="{p or './'}"><img src="{p}assets/img/marca/monograma.svg" alt="" width="38" height="38">La Valenciana<span class="vh">, ir al inicio</span></a>
    <nav class="menu-principal" id="menu-principal" aria-label="Menú principal"><ul>{''.join(items)}{contacto}</ul></nav>
    <button class="control boton-letra" type="button" aria-pressed="false"><span class="aa" aria-hidden="true">A<small>A</small></span><span class="letra-texto">Letra grande</span><span class="vh"> (letra más grande)</span></button>
    <button class="control boton-menu" type="button" aria-expanded="false" aria-controls="menu-principal"><span class="rayas" aria-hidden="true"></span><span class="txt">Menú</span></button>
  </div>
</header>'''
def pie(p):
    redes=''.join(f'<li><a href="{u}">{n}</a></li>' for u,n,_ in REDES)
    return f'''<footer class="pie">
  <div class="envoltura">
    <div class="rejilla">
      <div><img class="logo-pie" src="{p}assets/img/marca/logo-blanco.svg" alt="La Valenciana" width="220" height="110"></div>
      <div><h2>Visítanos</h2><ul><li>{DIR1}<br>{DIR2}</li><li class="num">Lunes a sábado<br>10:00–14:00 y 17:00–21:00</li><li>Domingos y festivos, cerrado</li></ul></div>
      <div><h2>Contacto</h2><ul><li><a href="{TEL_HREF}">Teléfono&nbsp;<span class="num">{TEL}</span></a></li><li><a href="{wa('Hola, La Valenciana')}">WhatsApp&nbsp;<span class="num">{WA_TXT}</span></a></li><li><a href="mailto:{CORREO}">{CORREO}</a></li></ul></div>
      <div><h2>Síguenos</h2><ul>{redes}</ul></div>
    </div>
    <div class="legal"><span>© 2026 La Valenciana · Mercería y Complementos</span><ul><li><a href="{p}accesibilidad/">Accesibilidad</a></li><li><a href="{p}aviso-legal/">Aviso legal</a></li><li><a href="{p}privacidad/">Privacidad</a></li><li><a href="{p}cookies/">Cookies</a></li><li><a href="#contenido">Volver arriba ↑</a></li></ul></div>
  </div>
</footer>
<a class="wa-flotante" href="{wa('Hola, La Valenciana')}">{WA_ICO}<span>WhatsApp<span class="vh">: escríbenos</span></span></a>
<button class="cesta-flotante" type="button" hidden aria-haspopup="dialog" aria-controls="cesta">{CESTA_ICO}<span>Cesta</span><span class="contador num" aria-hidden="true">0</span><span class="vh cesta-resumen"></span></button>
<p class="aviso-cesta" role="status" aria-live="polite"></p>
<dialog class="cesta" id="cesta" aria-labelledby="titulo-cesta" data-wa="{WA}" data-correo-m="{PED_M}" data-correo-c="{PED_C}">
  <div class="cesta-cabeza"><h2 id="titulo-cesta">Tu cesta</h2><button class="control cerrar-cesta" type="button">Cerrar<span class="vh"> la cesta</span> <span aria-hidden="true">✕</span></button></div>
  <div class="cesta-cuerpo">
    <p class="cesta-vacia">Tu cesta está vacía. Entra en <a href="{p}merceria/">Mercería</a> o en <a href="{p}complementos/">Complementos</a> y pulsa «Añadir a la cesta».</p>
    <ul class="cesta-lista"></ul>
    <div class="cesta-total"><span>Total orientativo</span><strong class="num cesta-importe">0,00 €</strong></div>
    <form class="cesta-form">
      <label for="cesta-nombre">Tu nombre <span class="secundario">(opcional)</span></label>
      <input id="cesta-nombre" name="nombre" type="text" autocomplete="name">
      <label for="cesta-notas">Tallas, colores u otras indicaciones <span class="secundario">(opcional)</span></label>
      <textarea id="cesta-notas" name="notas" rows="3"></textarea>
    </form>
    <p class="nota">Recoges y pagas el pedido en la tienda ({DIR1}). Te confirmamos disponibilidad y precio antes.</p>
    <div class="cesta-acciones">
      <a class="boton lleno enviar-wa" href="#">{WA_ICO}Enviar pedido por WhatsApp</a>
      <a class="boton enviar-correo" href="#">Enviar por correo</a>
      <button class="enlace-boton vaciar" type="button">Vaciar la cesta</button>
    </div>
  </div>
</dialog>
<script src="{p}assets/js/web.js" defer></script>'''
def doc(p,titulo,desc,cuerpo,actual,clase='',extra_css='',extra_head=''):
    return f'''<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{titulo}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#F6E4E7">
<meta property="og:title" content="{titulo}">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="website">
<meta property="og:locale" content="es_ES">
<link rel="icon" href="{p}favicon.svg" type="image/svg+xml">
<link rel="preload" href="{p}assets/fonts/PlayfairDisplay.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="{p}assets/fonts/Jost.woff2" as="font" type="font/woff2" crossorigin>
<script>try{{if(localStorage.getItem('lv-letra')==='1')document.documentElement.classList.add('letra-grande')}}catch(e){{}}</script>
<link rel="stylesheet" href="{p}assets/fonts/fuentes.css">
<link rel="stylesheet" href="{p}assets/css/tokens.css">
<link rel="stylesheet" href="{p}assets/css/estilos.css">
{extra_css}{extra_head}</head>
<body{(' class="'+clase+'"') if clase else ''}>
{cab(p,actual)}
<main id="contenido" tabindex="-1">
{cuerpo}
</main>
{pie(p)}
</body>
</html>
'''
def w(path,txt):
    full=os.path.join(R,path); os.makedirs(os.path.dirname(full),exist_ok=True); open(full,'w').write(txt)

def estado(): return f'<p class="estado" data-estado><span class="punto" aria-hidden="true"></span><span class="estado-txt num">{HORARIO_CORTO}</span></p>'
DIAS=[(1,'Lunes'),(2,'Martes'),(3,'Miércoles'),(4,'Jueves'),(5,'Viernes'),(6,'Sábado'),(0,'Domingo')]
def tabla_horario():
    filas=''.join(f'<tr data-dia="{n}"><th scope="row">{d}</th><td>{"Cerrado" if n==0 else "10:00 – 14:00<br>17:00 – 21:00"}</td></tr>' for n,d in DIAS)
    return f'<table class="tabla-horario"><caption>Horario de la tienda</caption><tbody>{filas}</tbody></table><p class="nota">Festivos: cerrado.</p>'

# ---------- INICIO ----------
logo_caja='assets/img/marca/logo-grafito.svg'
def puerta(clave,nombre,txt,subs,gris):
    sub=''.join(f'<li><a href="{clave}/#{s}">{t}</a></li>' for s,t,_,_ in subs)
    return f'''<article class="puerta {clave[0]}">
        <div class="foto{' gris' if gris else ''}"><span>Foto · {nombre.lower()}</span></div>
        <div class="texto">
          <h3><a href="{clave}/">{nombre}</a></h3>
          <p>{txt}</p>
          <p class="vh">Apartados de {nombre}:</p>
          <ul class="sub">{sub}</ul>
        </div>
        <a class="boton lleno" href="{clave}/" aria-hidden="true" tabindex="-1">Ver {nombre} {FLECHA}</a>
      </article>'''
PREGUNTAS=[
 ('¿Puedo preguntar si tenéis algo antes de ir?',f'<p>Sí. Escríbenos por WhatsApp al <a class="num" href="{wa("Hola, quería preguntar si tenéis")}">{WA_TXT}</a> o llámanos al <a class="num" href="{TEL_HREF}">{TEL}</a>. Si nos mandas una foto del botón, el hilo o la prenda, te decimos si lo tenemos.</p>'),
 ('¿Y si no tenéis lo que busco?','<p>Te lo buscamos. Cuéntanos qué necesitas y te avisamos cuando lo tengamos.</p>'),
 ('¿Hacéis arreglos de ropa?','<p>Sí: bajos, cambio de cremalleras y pequeños arreglos. Tráenos la prenda y te decimos plazo y precio antes de empezar.</p>'),
 ('Estoy empezando a tejer o a bordar. ¿Me ayudáis?','<p>Claro. Te aconsejamos el material para empezar: qué agujas, qué hilo o lana y cuánto vas a necesitar.</p>'),
 ('¿Se puede comprar por internet?',f'<p>Sí. En Mercería y en Complementos pulsa «Añadir a la cesta» y, cuando termines, envíanos el pedido por WhatsApp o por correo. Te confirmamos disponibilidad y precio, y lo recoges y pagas en la tienda. También puedes escribirnos directamente:</p><ul><li>Mercería: <a href="mailto:{PED_M}">{PED_M}</a></li><li>Complementos: <a href="mailto:{PED_C}">{PED_C}</a></li></ul>'),
 ('¿Qué días abrís?',f'<p>De lunes a sábado, de 10:00 a 14:00 y de 17:00 a 21:00. Domingos y festivos, cerrado.</p>'),
]
preg=''.join(f'<details><summary>{q}</summary><div class="respuesta">{a}</div></details>' for q,a in PREGUNTAS)
redes_txt=''.join(f'<li><a href="{u}">{n}<span class="vh"> ({h})</span></a></li>' for u,n,h in REDES)

inicio=f'''<section class="hero" aria-labelledby="titulo-inicio">
  <div class="envoltura">
    <div class="hero-texto">
      <p class="etiqueta">Mercería y complementos · Almendralejo</p>
      <h1 id="titulo-inicio">Hilos, botones, medias y lencería en el centro de Almendralejo</h1>
      <p class="entradilla">Una tienda de las de siempre en la Plaza de Espronceda. Te atendemos con calma y, si no lo tenemos, te lo buscamos.</p>
      {estado()}
      <div class="botones">
        <a class="boton lleno" href="merceria/">Ver Mercería {FLECHA}</a>
        <a class="boton lleno" href="complementos/">Ver Complementos {FLECHA}</a>
      </div>
    </div>
    <div class="escenario" aria-hidden="true">
      <div class="sombra"></div><div class="sombra-contacto"></div>
      <div class="escala"><div class="mundo">
        <div class="cara fondo"></div>
        <div class="cara seda"></div>
        <div class="seda-atras"></div>
        <div class="cara trasera"><span class="borde-carton"></span></div>
        <div class="cara izq"><span class="borde-carton"></span></div>
        <div class="cara der"><span class="borde-carton"></span></div>
        <a class="tarjeta m" href="merceria/" tabindex="-1"><span class="t">Mercería</span><span class="s">Hilos, lanas, botones y labores</span><span class="ir">Entrar →</span></a>
        <a class="tarjeta c" href="complementos/" tabindex="-1"><span class="t">Complementos</span><span class="s">Medias, lencería y detalles</span><span class="ir">Entrar →</span></a>
        <div class="cara frente"><span class="borde-carton"></span><span class="cinta"></span><span class="datos-caja">lavalencianamerceria.com · lavalencianacomplementos.com<br>@_lavalenciana · 633 930 935</span></div>
        <div class="seda-ala"></div>
        <div class="bisagra"><div class="cara tapa"><img src="{logo_caja}" alt="" width="600" height="300"><span class="cinta"></span><span class="lazo"><i></i><i></i><b></b></span><div class="tapa-dentro"></div><div class="cara solapa"></div></div></div>
      </div></div>
      <span class="abriendo">Abriendo la caja…</span>
    </div>
  </div>
</section>

<section class="franja" aria-label="Datos de contacto">
  <div class="envoltura">
    <ul>
      <li><span class="que">Dirección</span><a href="{MAPS}">{DIR1}, Almendralejo</a></li>
      <li><span class="que">Horario</span><strong class="num">L–S · 10–14 h y 17–21 h</strong></li>
      <li><span class="que">Teléfono</span><a class="num" href="{TEL_HREF}">{TEL}</a></li>
      <li><span class="que">WhatsApp</span><a class="num" href="{wa('Hola, La Valenciana')}">{WA_TXT}</a></li>
    </ul>
  </div>
</section>

<section class="bloque" id="secciones" aria-labelledby="titulo-secciones">
  <div class="envoltura">
    <div class="cabeza-bloque"><p class="etiqueta">Una tienda, dos secciones</p><h2 id="titulo-secciones">¿Qué estás buscando hoy?</h2><p class="entradilla">Elige una sección o ve directamente a lo que necesitas.</p></div>
    <div class="puertas">
      {puerta('merceria','Mercería','Hilos, lanas, botones, cremalleras y todo lo necesario para coser, tejer y arreglar.',MERC,False)}
      {puerta('complementos','Complementos','Medias, calcetines, lencería, pañuelos y bolsos para el día a día y para las ocasiones especiales.',COMP,True)}
    </div>
  </div>
</section>

<section class="bloque crema" id="como-comprar" aria-labelledby="titulo-comprar">
  <div class="envoltura">
    <div class="cabeza-bloque"><p class="etiqueta">Cómo comprar</p><h2 id="titulo-comprar">Fácil, como en la tienda de toda la vida</h2></div>
    <ol class="pasos">
      <li><h3>Prepara tu cesta o pregunta</h3><p>Añade productos a la cesta desde la web y envíanos el pedido, o escríbenos por WhatsApp con una foto de lo que buscas.</p><div class="botones"><a class="boton" href="merceria/">Ver productos {FLECHA}</a></div></li>
      <li><h3>Te lo preparamos</h3><p>Te confirmamos disponibilidad y precio. Si lo tenemos, te lo guardamos. Si no, te decimos si podemos conseguirlo y te avisamos cuando llegue.</p></li>
      <li><h3>Recoge y paga en la tienda</h3><p>Te esperamos en la Plaza de Espronceda 2, de lunes a sábado, por la mañana o por la tarde.</p><div class="botones"><a class="boton" href="{MAPS}">{MAPA_ICO}Cómo llegar</a></div></li>
    </ol>
  </div>
</section>

<section class="bloque" id="nosotras" aria-labelledby="titulo-nosotras">
  <div class="envoltura dos asim">
    <div class="foto alta"><span>Foto · el local</span></div>
    <div class="pila">
      <p class="etiqueta">Nosotras</p>
      <h2 id="titulo-nosotras">Una tienda de las de siempre, con trato cercano</h2>
      <p class="entradilla">Te atendemos con calma y te aconsejamos, tanto si buscas el botón exacto para una chaqueta como unas medias para una boda.</p>
      <p>Aquí no hay prisas: puedes traer la prenda, comparar colores en el mostrador y preguntar lo que necesites.</p>
      <div><p class="secundario">Síguenos para ver las novedades:</p><ul class="redes">{redes_txt}</ul></div>
    </div>
  </div>
</section>

<section class="bloque perla" id="preguntas" aria-labelledby="titulo-preguntas">
  <div class="envoltura dos asim" style="align-items:start">
    <div class="pila"><p class="etiqueta">Preguntas frecuentes</p><h2 id="titulo-preguntas">Lo que más nos preguntáis</h2><p class="secundario">Toca una pregunta para ver la respuesta.</p></div>
    <div class="preguntas">{preg}</div>
  </div>
</section>

<section class="bloque" id="visitanos" aria-labelledby="titulo-visitanos">
  <div class="envoltura dos" style="align-items:start">
    <div class="pila">
      <p class="etiqueta">Horario y dirección</p>
      <h2 id="titulo-visitanos">Te esperamos en la Plaza de Espronceda</h2>
      {estado()}
      <dl class="datos">
        <div><dt>Dirección</dt><dd>{DIR1}<br>{DIR2}</dd></div>
        <div><dt>Teléfono</dt><dd><a class="num" href="{TEL_HREF}">{TEL}</a></dd></div>
        <div><dt>WhatsApp</dt><dd><a class="num" href="{wa('Hola, La Valenciana')}">{WA_TXT}</a></dd></div>
        <div><dt>Correo</dt><dd><a href="mailto:{CORREO}">{CORREO}</a></dd></div>
        <div><dt>Pedidos</dt><dd>Mercería: <a href="mailto:{PED_M}">{PED_M}</a><br>Complementos: <a href="mailto:{PED_C}">{PED_C}</a></dd></div>
      </dl>
      <div class="botones">
        <a class="boton lleno" href="{MAPS}">{MAPA_ICO}Cómo llegar</a>
        {btn_tel()}
      </div>
    </div>
    <div class="pila">
      <div class="foto gris"><span>Foto · fachada</span></div>
      {tabla_horario()}
    </div>
  </div>
</section>'''
ld={"@context":"https://schema.org","@type":"Store","name":"La Valenciana","description":"Mercería y complementos en Almendralejo.",
 "address":{"@type":"PostalAddress","streetAddress":"Plaza de Espronceda 2","postalCode":"06200","addressLocality":"Almendralejo","addressRegion":"Badajoz","addressCountry":"ES"},
 "telephone":"+34924670839","email":CORREO,
 "openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"opens":"10:00","closes":"14:00"},
   {"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"opens":"17:00","closes":"21:00"}],
 "sameAs":[u for u,_,_ in REDES]}
faq={"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":__import__('re').sub('<[^>]+>','',a)}} for q,a in PREGUNTAS]}
w('index.html',doc('','La Valenciana · Mercería y Complementos en Almendralejo','Mercería y complementos en la Plaza de Espronceda 2 de Almendralejo: hilos, lanas, botones, labores, arreglos, medias, lencería y más. Lunes a sábado.',inicio,'inicio','con-caja',
  '<link rel="stylesheet" href="assets/css/caja.css">\n','<script type="application/ld+json">'+json.dumps(ld,ensure_ascii=False)+'</script>\n<script type="application/ld+json">'+json.dumps(faq,ensure_ascii=False)+'</script>\n'))

# ---------- SECCIONES ----------
def seccion(slug,nombre,clase,intro,subs,otra,otra_nombre,otra_txt,correo,gris):
    indice=''.join(f'<li><a href="#{s}">{t}</a></li>' for s,t,_,_ in subs)
    bloques=''
    for i,(s,t,txt,lst) in enumerate(subs):
        f='foto gris' if gris else 'foto'
        bloques+=f'''
    <article class="subseccion{' con-productos' if s in PRODUCTOS else ''}" id="{s}" aria-labelledby="t-{s}">
      <div class="{f}"><span>Foto · {t.lower()}</span></div>
      <div class="pila">
        <p class="numero" aria-hidden="true">{i+1:02d} / {len(subs):02d}</p>
        <h2 id="t-{s}">{t}</h2>
        <p>{txt}</p>
        <ul class="lista" aria-label="Algunos productos de {t.lower()}">{''.join(f'<li>{x}</li>' for x in lst)}</ul>
        <div class="botones">{btn_wa(f'Hola, quería preguntar por {t.lower()}',f'Preguntar por {t.lower()}')}</div>
      </div>
      {productos_html(s,slug,gris)}
    </article>'''
    return f'''<div class="{clase}">
<section class="portada-seccion" aria-labelledby="titulo-seccion">
  <div class="envoltura">
    <nav class="migas" aria-label="Estás aquí"><ol><li><a href="../">Inicio</a></li><li><span aria-current="page">{nombre}</span></li></ol></nav>
  </div>
  <div class="envoltura dos">
    <div class="pila"><p class="etiqueta">La Valenciana · {len(subs)} apartados</p><h1 id="titulo-seccion">{nombre}</h1><p class="entradilla">{intro}</p>
      <p>Pedidos y consultas: <a href="mailto:{correo}">{correo}</a></p>
      <p class="aviso-compra">Añade productos a la cesta y envíanos el pedido por WhatsApp o por correo. <strong>Lo recoges y lo pagas en la tienda.</strong> Precios orientativos: te confirmamos el total al preparar tu pedido.</p>
      <div class="botones">{btn_wa(f'Hola, tengo una consulta sobre {nombre.lower()}','Preguntar por WhatsApp','boton lleno')}{btn_tel()}</div></div>
    <div class="{'foto gris' if gris else 'foto'}"><span>Foto · {nombre.lower()}</span></div>
  </div>
</section>
<nav class="indice" aria-label="Apartados de {nombre}"><div class="envoltura"><span class="rotulo">Ir a:</span><ul>{indice}</ul></div></nav>
<div class="envoltura subsecciones">{bloques}
</div>
<div class="envoltura final-seccion">
  <section class="ayuda" aria-labelledby="titulo-ayuda">
    <div class="pila junta"><h2 id="titulo-ayuda">¿No encuentras lo que buscas?</h2><p>Pregúntanos. Si no lo tenemos, te lo buscamos. Atendemos de lunes a sábado, de 10:00 a 14:00 y de 17:00 a 21:00.</p></div>
    <div class="botones">{btn_wa(f'Hola, busco algo de {nombre.lower()}','WhatsApp','boton lleno')}{btn_tel()}</div>
  </section>
  <a class="cambio {'a-c' if otra=='complementos' else 'a-m'}" href="../{otra}/"><div class="pila junta"><span class="etiqueta">La otra sección</span><h2>{otra_nombre}</h2><p>{otra_txt}</p></div><span class="flecha" aria-hidden="true">→</span></a>
</div>
</div>'''
w('merceria/index.html',doc('../','Mercería · La Valenciana','Hilos, lanas, botones, cremalleras, cintas, labores y arreglos en La Valenciana, Plaza de Espronceda 2, Almendralejo.',
  seccion('merceria','Mercería','seccion-merceria','Todo lo que necesitas para coser, tejer y arreglar, y el consejo de quien sabe.',MERC,'complementos','Complementos','Medias, calcetines, lencería, pañuelos y bolsos.',PED_M,False),'merceria'))
w('complementos/index.html',doc('../','Complementos · La Valenciana','Medias, pantis, calcetines, lencería, pañuelos, bolsos y bisutería en La Valenciana, Plaza de Espronceda 2, Almendralejo.',
  seccion('complementos','Complementos','seccion-complementos','Medias, lencería y detalles elegidos con mimo para el día a día y para las ocasiones especiales.',COMP,'merceria','Mercería','Hilos, lanas, botones, labores y arreglos.',PED_C,True),'complementos'))

# ---------- LEGALES Y ACCESIBILIDAD ----------
P='<span class="pendiente">[pendiente]</span>'
legales={
'accesibilidad':('Accesibilidad',f'''<p class="entradilla">Queremos que cualquier persona, tenga la edad que tenga, pueda usar esta web con comodidad.</p>
<h2>Qué hemos hecho</h2>
<ul>
<li>Letra grande y botón <strong>«Letra grande»</strong> arriba a la derecha para agrandar todo el texto. La web lo recuerda en tu navegador.</li>
<li>Colores con buen contraste, según las pautas WCAG 2.2 nivel AA.</li>
<li>Botones y enlaces grandes, fáciles de tocar con el dedo.</li>
<li>Se puede usar entera con el teclado: el elemento activo siempre se ve resaltado. Al pulsar Tabulador, el primer enlace permite saltar al contenido.</li>
<li>Textos alternativos y estructura de títulos para lectores de pantalla.</li>
<li>Si tu dispositivo tiene activada la opción de reducir movimiento, la animación de la caja no se reproduce.</li>
<li>La web funciona en móvil, tableta y ordenador, y permite ampliar con los dedos.</li>
</ul>
<h2>Trucos útiles</h2>
<ul>
<li>Para ampliar aún más: en el ordenador pulsa <kbd>Ctrl</kbd> y <kbd>+</kbd> (en Mac, <kbd>Cmd</kbd> y <kbd>+</kbd>).</li>
<li>Para llamarnos desde el móvil, toca directamente el número de teléfono.</li>
</ul>
<h2>¿Algo no funciona bien?</h2>
<p>Cuéntanoslo y lo arreglamos. Llámanos al <a class="num" href="{TEL_HREF}">{TEL}</a>, escríbenos por <a href="{wa('Hola, he tenido un problema con la web')}">WhatsApp</a> o a <a href="mailto:{CORREO}">{CORREO}</a>.</p>'''),
'aviso-legal':('Aviso legal',f'''<p>En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de los datos del titular de esta web.</p>
<h2>Titular</h2>
<p>Nombre o razón social: {P}<br>NIF: {P}<br>Domicilio: {DIR1}, {DIR2}<br>Correo: {CORREO}<br>Teléfono: {TEL}</p>
<h2>Uso de la web</h2>
<p>Esta web informa sobre la tienda La Valenciana y sus productos. A través de ella puedes preparar un pedido y enviarlo por WhatsApp o por correo electrónico para recogerlo y pagarlo en la tienda. El pedido no es firme hasta que La Valenciana lo confirma; los precios mostrados son orientativos y el importe final se confirma antes de la recogida. El uso de la web implica la aceptación de este aviso.</p>
<h2>Propiedad intelectual</h2>
<p>Los textos, el logotipo y las imágenes de esta web pertenecen a La Valenciana o se usan con permiso. No se permite su reproducción sin autorización.</p>'''),
'privacidad':('Política de privacidad',f'''<p>Esta web no envía datos a ningún servidor. La cesta y lo que escribes en ella se guardan solo en tu navegador hasta que decides enviarnos el pedido por WhatsApp o por correo.</p>
<h2>Responsable</h2>
<p>{P} (NIF {P}), con domicilio en {DIR1}, {DIR2}. Contacto: {CORREO}</p>
<h2>Datos que nos envías</h2>
<p>Si nos envías un pedido desde la cesta o nos escribes por correo electrónico o por WhatsApp, usaremos tus datos (nombre, teléfono o correo y el contenido del pedido) solo para responderte y atender tu pedido o consulta. La base legal es tu consentimiento al contactarnos. No cedemos tus datos a terceros salvo obligación legal.</p>
<h2>Tus derechos</h2>
<p>Puedes pedir acceso, rectificación, supresión, oposición, limitación y portabilidad de tus datos escribiendo a {CORREO}. También puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).</p>'''),
'cookies':('Política de cookies','''<p>Esta web no usa cookies propias ni de terceros, ni herramientas de analítica o publicidad. Las tipografías se sirven desde la propia web.</p>
<h2>Almacenamiento local</h2>
<p>El navegador guarda estas marcas técnicas, que no contienen datos personales:</p>
<ul><li><code>lv-caja</code>: para que la animación de la caja de la portada sea más rápida en tus siguientes visitas.</li><li><code>lv-letra</code>: para recordar si has elegido «Letra grande».</li><li><code>lv-cesta</code>: los productos que añades a la cesta, para que no se pierdan al cambiar de página. Solo se guardan en tu navegador; no nos llegan hasta que envías el pedido.</li></ul>
<p>Puedes borrarlas desde la configuración de tu navegador.</p>
<h2>Enlaces externos</h2>
<p>Los enlaces a Instagram, TikTok, Facebook, WhatsApp y Google Maps te llevan a esos servicios, que tienen sus propias políticas de cookies.</p>''')}
for slug,(t,body) in legales.items():
    etiqueta='Accesibilidad' if slug=='accesibilidad' else 'Información legal'
    w(f'{slug}/index.html',doc('../',f'{t} · La Valenciana',f'{t} de la web de La Valenciana.',f'<div class="envoltura legal-texto"><nav class="migas" aria-label="Estás aquí"><ol><li><a href="../">Inicio</a></li><li><span aria-current="page">{t}</span></li></ol></nav><p class="etiqueta">{etiqueta}</p><h1>{t}</h1>{body}</div>',slug))

# 404 (GitHub Pages lo sirve desde cualquier ruta: enlaces absolutos al subdirectorio)
base='/web-la-valenciana/'
w('404.html',doc(base,'Página no encontrada · La Valenciana','Esta página no existe.',
  f'<div class="envoltura legal-texto centrado"><p class="etiqueta">Error 404</p><h1>Esta página se ha descosido</h1><p class="entradilla">No encontramos lo que buscabas. Vuelve al inicio o elige una sección.</p><div class="botones" style="justify-content:center"><a class="boton lleno" href="{base}">Volver al inicio</a><a class="boton" href="{base}merceria/">Mercería</a><a class="boton" href="{base}complementos/">Complementos</a></div><p>¿Necesitas ayuda? Llámanos al <a class="num" href="{TEL_HREF}">{TEL}</a>.</p></div>','404'))
print('ok')
