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
 ('labores','Labores','Material para punto, ganchillo, bordado y punto de cruz. Si estás empezando, te aconsejamos qué agujas y qué hilo elegir.',['Punto','Ganchillo','Bordado','Punto de cruz']),]
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
# Stock de EJEMPLO por nombre de producto: 'si' (por defecto), 'pocas' o 'agotado'. EDITAR con el stock real.
STOCK={'Lana merino':'pocas','Tijeras de costura':'pocas','Bastidor de bordado':'agotado','Medias de descanso':'agotado','Camisón':'pocas','Bolso bandolera':'pocas'}
# Productos que se eligen por color: se pide la referencia del fabricante para acertar con el tono.
CON_COLOR={'Hilo de coser poliéster','Madeja de mouliné','Algodón para ganchillo','Lana merino','Botones de nácar','Cremallera invisible','Cinta de raso','Bies de algodón','Puntilla de algodón','Panty transparente','Panty tupido','Fular liso'}
ESTADO_TXT={'si':'En stock','pocas':'Últimas unidades','agotado':'Agotado'}
ENVIO_GRATIS=50; ENVIO_PRECIO=4.95; PLAZO_ENVIO='2 a 4 días laborables'
def euros(x): return f"{x:,.2f}".replace(',','X').replace('.',',').replace('X','.')+' €'
import re as _re
def slugify(t): return _re.sub(r'[^a-z0-9]+','-',t.lower().translate(str.maketrans('áéíóúñü','aeiouñu')).replace('ñ','n')).strip('-')
TARJETA_ICO='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm0 4v8h18V9zm0-2h18V7H3zm2 6h6v2H5z"/></svg>'
CANDADO_ICO='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 10V8a5 5 0 0 1 10 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2zm2 0h6V8a3 3 0 0 0-6 0z"/></svg>'
LUPA_ICO='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M10 3a7 7 0 0 1 5.6 11.2l4.6 4.6-1.4 1.4-4.6-4.6A7 7 0 1 1 10 3zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"/></svg>'
BIZUM_TEL='633 930 935'  # SUPUESTO: móvil de WhatsApp. Cambiar si el Bizum de la tienda es otro número.
CESTA_ICO='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 7V6a5 5 0 0 1 10 0v1h3a1 1 0 0 1 1 1.1l-1.2 12A2 2 0 0 1 17.8 22H6.2a2 2 0 0 1-2-1.9L3 8.1A1 1 0 0 1 4 7zm2 0h6V6a3 3 0 0 0-6 0zm-1 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg>'
def productos_html(slug,seccion,gris):
    ps=PRODUCTOS.get(slug)
    if not ps: return ''
    out=''
    for n,d,pr in ps:
        pid=slug+'--'+slugify(n); st=STOCK.get(n,'si')
        color='<p class="ref-color">Indica el nº de color del fabricante en las indicaciones del pedido, o pídenos una foto real por WhatsApp.</p>' if n in CON_COLOR else ''
        if st=='agotado':
            accion=f'<button class="boton anadir" type="button" disabled aria-disabled="true">Agotado<span class="vh">: {n}</span></button><a class="enlace-aviso" href="{wa(f"Hola, avisadme cuando volváis a tener: {n}")}">Avísame cuando llegue</a>'
        else:
            accion=f'<button class="boton anadir" type="button" data-id="{pid}" data-nombre="{n}" data-detalle="{d}" data-precio="{pr}" data-seccion="{seccion}">{CESTA_ICO}<span class="txt">Añadir a la cesta</span><span class="vh">: {n}</span></button>'
        out+=f'''<li class="producto" id="{pid}"><div class="muestra{' gris' if gris else ''}" aria-hidden="true"></div><div class="producto-texto"><h3>{n}</h3><p class="secundario">{d}</p><p class="stock stock-{st}"><span class="punto" aria-hidden="true"></span>{ESTADO_TXT[st]}</p><p class="precio num">{euros(pr)}</p>{color}</div><div class="producto-accion">{accion}</div></li>'''
    return f'<ul class="productos" aria-label="Productos de ejemplo">{out}</ul>'

NAV=[('merceria/','Mercería','merceria'),('complementos/','Complementos','complementos'),('#como-comprar','Cómo comprar',''),('#visitanos','Horario y dirección','')]
def cab(p,actual):
    items=[]
    for href,t,clave in NAV:
        h=(p+href) if not href.startswith('#') else (href if actual=='inicio' else (p or './')+href)
        cur=' aria-current="page"' if clave and clave==actual else ''
        cos=' class="cosido"' if clave=='merceria' else ''
        items.append(f'<li><a{cos} href="{h}"{cur}>{t}</a></li>')
    contacto=f'<li class="menu-contacto"><a href="{TEL_HREF}">Llamar al <span class="num">{TEL}</span></a><a href="{wa("Hola, La Valenciana")}">WhatsApp <span class="num">{WA_TXT}</span></a></li>'
    return f'''<a class="salto" href="#contenido">Saltar al contenido</a>
<p class="barra-envio"><span><strong>Envío gratis desde {ENVIO_GRATIS} €</strong> en la Península</span><span class="sep" aria-hidden="true">·</span><span>Recogida gratis en la tienda</span><span class="sep" aria-hidden="true">·</span><span>Te asesoramos por WhatsApp</span></p>
<header class="cabecera">
  <div class="envoltura">
    <a class="marca" href="{p or './'}"><img src="{p}assets/img/marca/monograma.svg" alt="" width="38" height="38"><span class="marca-texto">La Valenciana</span><span class="vh">, ir al inicio</span></a>
    <nav class="menu-principal" id="menu-principal" aria-label="Menú principal"><ul>{''.join(items)}{contacto}</ul></nav>
    <button class="control boton-buscar" type="button" aria-haspopup="dialog" aria-controls="buscador">{LUPA_ICO}<span class="buscar-texto">Buscar</span></button>
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
    <div class="legal"><span>© 2026 La Valenciana · Mercería y Complementos</span><ul><li><a href="{p}envios-y-devoluciones/">Envíos y devoluciones</a></li><li><a href="{p}condiciones-de-venta/">Condiciones de venta</a></li><li><a href="{p}accesibilidad/">Accesibilidad</a></li><li><a href="{p}aviso-legal/">Aviso legal</a></li><li><a href="{p}privacidad/">Privacidad</a></li><li><a href="{p}cookies/">Cookies</a></li><li><a href="#contenido">Volver arriba ↑</a></li></ul></div>
  </div>
</footer>
<a class="wa-flotante" href="{wa('Hola, La Valenciana')}">{WA_ICO}<span>WhatsApp<span class="vh">: escríbenos</span></span></a>
<button class="cesta-flotante" type="button" hidden aria-haspopup="dialog" aria-controls="cesta">{CESTA_ICO}<span>Cesta</span><span class="contador num" aria-hidden="true">0</span><span class="vh cesta-resumen"></span></button>
<p class="aviso-cesta" role="status" aria-live="polite"></p>
<dialog class="buscador" id="buscador" aria-labelledby="titulo-buscador" data-base="{p}">
  <div class="buscador-cabeza"><h2 id="titulo-buscador">Buscar en la tienda</h2><button class="control cerrar-buscador" type="button">Cerrar<span class="vh"> el buscador</span> <span aria-hidden="true">✕</span></button></div>
  <div class="buscador-cuerpo">
    <label for="buscador-q">¿Qué buscas?</label>
    <input id="buscador-q" type="search" autocomplete="off" placeholder="Por ejemplo: cremallera, lana, panty…" aria-describedby="buscador-estado">
    <p id="buscador-estado" class="secundario" role="status" aria-live="polite">Escribe al menos 2 letras.</p>
    <ul class="buscador-resultados"></ul>
  </div>
</dialog>
<dialog class="cesta" id="cesta" aria-labelledby="titulo-cesta" data-wa="{WA}" data-correo-m="{PED_M}" data-correo-c="{PED_C}">
  <div class="cesta-cabeza"><h2 id="titulo-cesta">Tu cesta</h2><button class="control cerrar-cesta" type="button">Cerrar<span class="vh"> la cesta</span> <span aria-hidden="true">✕</span></button></div>
  <div class="cesta-cuerpo">
    <p class="cesta-vacia">Tu cesta está vacía. Entra en <a href="{p}merceria/">Mercería</a> o en <a href="{p}complementos/">Complementos</a> y pulsa «Añadir a la cesta».</p>
    <ul class="cesta-lista"></ul>
    <p class="cesta-envio" data-gratis="{ENVIO_GRATIS}"></p>
    <div class="cesta-total"><span>Total <span class="secundario">(IVA incluido)</span></span><strong class="num cesta-importe">0,00 €</strong></div>
    <form class="cesta-form">
      <label for="cesta-notas">Tallas, colores u otras indicaciones <span class="secundario">(opcional)</span></label>
      <textarea id="cesta-notas" name="notas" rows="3"></textarea>
    </form>
    <p class="nota">Recogida gratis en la tienda ({DIR1}) o envío a domicilio ({euros(ENVIO_PRECIO)}, gratis desde {ENVIO_GRATIS} €). Paga con tarjeta, PayPal o Bizum.</p>
    <div class="cesta-acciones">
      <a class="boton lleno ir-pago" href="{p}pedido/">{TARJETA_ICO}Tramitar pedido y pagar</a>
      <a class="boton enviar-wa" href="#">{WA_ICO}Prefiero pedir por WhatsApp</a>
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
<script src="{p}assets/js/catalogo.js" defer></script>
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


# Objetos de la tienda que salen de la caja (SVG planos con la paleta). x,y,z en px respecto al centro de la caja; r = giro.
OBJETOS=[
 ('carrete',-290,-70,20,-12,'<svg viewBox="0 0 60 80"><rect x="6" y="2" width="48" height="10" rx="3" fill="#C8A27A"/><rect x="6" y="68" width="48" height="10" rx="3" fill="#B48D64"/><rect x="12" y="12" width="36" height="56" fill="#9C5A6C"/><g stroke="#7E4556" stroke-width="1.6" opacity=".7"><path d="M12 20h36M12 28h36M12 36h36M12 44h36M12 52h36M12 60h36"/></g><path d="M12 16l36 4M12 58l36-6" stroke="#C98C9C" stroke-width="1.2"/><path d="M48 40c8 2 10 10 6 16" fill="none" stroke="#9C5A6C" stroke-width="1.6"/></svg>',62),
 ('ovillo',290,-50,30,8,'<svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="34" fill="#E9BCC6"/><g fill="none" stroke="#C98C9C" stroke-width="2.2" stroke-linecap="round"><path d="M10 34c18-10 42-12 60 2"/><path d="M8 46c20-8 46-6 64 6"/><path d="M22 12c-6 18-4 42 10 60"/><path d="M40 6c-10 20-10 46 4 68"/><path d="M58 10c-12 16-16 40-6 62"/></g><circle cx="40" cy="40" r="34" fill="none" stroke="#9C5A6C" stroke-opacity=".35" stroke-width="2"/><path d="M70 52c8 6 6 14-2 18" fill="none" stroke="#C98C9C" stroke-width="2.2" stroke-linecap="round"/></svg>',78),
 ('boton-obj',-300,-215,40,0,'<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="27" fill="#EEECEF"/><circle cx="30" cy="30" r="27" fill="none" stroke="#C9C4CC" stroke-width="3"/><circle cx="30" cy="30" r="18" fill="none" stroke="#C9C4CC" stroke-width="2"/><g fill="#5E5864"><circle cx="24" cy="24" r="3.2"/><circle cx="36" cy="24" r="3.2"/><circle cx="24" cy="36" r="3.2"/><circle cx="36" cy="36" r="3.2"/></g><path d="M24 24l12 12M36 24L24 36" stroke="#9C5A6C" stroke-width="1.8"/></svg>',44),
 ('tijeras',300,-220,40,-28,'<svg viewBox="0 0 90 60"><g fill="none" stroke="#4A4450" stroke-width="5"><circle cx="16" cy="16" r="10"/><circle cx="16" cy="44" r="10"/></g><path d="M24 22L86 40l-4 4L22 30z" fill="#C9C4CC" stroke="#5E5864" stroke-width="1.5"/><path d="M24 38L86 20l-4-4L22 30z" fill="#EEECEF" stroke="#5E5864" stroke-width="1.5"/><circle cx="40" cy="30" r="3" fill="#5E5864"/></svg>',74),
 ('dedal',-170,-365,-20,10,'<svg viewBox="0 0 50 60"><path d="M8 54V24C8 10 16 4 25 4s17 6 17 20v30z" fill="#C9C4CC"/><rect x="5" y="50" width="40" height="8" rx="3" fill="#9C5A6C"/><g fill="#7E7684"><circle cx="17" cy="18" r="1.8"/><circle cx="25" cy="14" r="1.8"/><circle cx="33" cy="18" r="1.8"/><circle cx="15" cy="27" r="1.8"/><circle cx="23" cy="24" r="1.8"/><circle cx="31" cy="24" r="1.8"/><circle cx="37" cy="29" r="1.8"/><circle cx="17" cy="35" r="1.8"/><circle cx="25" cy="33" r="1.8"/><circle cx="33" cy="36" r="1.8"/><circle cx="20" cy="43" r="1.8"/><circle cx="29" cy="42" r="1.8"/></g><path d="M12 22c2-8 6-12 10-13" stroke="#fff" stroke-opacity=".7" stroke-width="2" fill="none"/></svg>',40),
 ('cinta-metrica',175,-370,-20,-6,'<svg viewBox="0 0 100 70"><path d="M44 36h52v14H44z" fill="#F2D27A"/><g stroke="#4A4450" stroke-width="1.2"><path d="M52 36v5M60 36v8M68 36v5M76 36v8M84 36v5M92 36v8"/></g><circle cx="34" cy="38" r="30" fill="#E9BCC6"/><circle cx="34" cy="38" r="30" fill="none" stroke="#C98C9C" stroke-width="3"/><circle cx="34" cy="38" r="9" fill="#F6E4E7" stroke="#9C5A6C" stroke-width="2"/></svg>',84),
 ('calcetin',0,-380,-40,14,'<svg viewBox="0 0 60 80"><path d="M14 2h28v40c0 6 2 10 8 14 8 6 8 20-4 22-6 1-12-2-18-6L10 62C4 58 2 52 6 46l8-12z" fill="#EEECEF" stroke="#C9C4CC" stroke-width="2"/><path d="M14 2h28v10H14z" fill="#C98C9C"/><path d="M14 16h28M14 20h28" stroke="#E9BCC6" stroke-width="2"/><path d="M36 70c4 3 10 5 14 4 4-2 6-8 4-12" fill="#E9BCC6"/></svg>',52),
 ('aguja',-20,-118,95,30,'<svg viewBox="0 0 90 40"><path d="M6 20L76 18l8 2-8 2z" fill="#7E7684"/><ellipse cx="72" cy="20" rx="5" ry="1.6" fill="#F6E4E7"/><path d="M72 20c8-10 16 4 6 10S54 34 40 32 14 30 6 36" fill="none" stroke="#9C5A6C" stroke-width="1.8" stroke-linecap="round"/></svg>',70),
]
def objetos_html():
    out=''
    for i,(c,x,y,z,r,svg,ancho) in enumerate(OBJETOS):
        out+=f'<div class="objeto {c}" style="--ox:{x}px;--oy:{y}px;--oz:{z}px;--or:{r}deg;--oi:{i};--ow:{ancho}px"><div class="flota">{svg}</div></div>'
    return out

# ---------- INICIO ----------
logo_caja='assets/img/marca/logo-grafito.svg'
def puerta(clave,nombre,txt,subs,gris):
    sub=''.join(f'<li><a href="{clave}/#{s}">{t}</a></li>' for s,t,_,_ in subs)
    return f'''<article class="puerta {clave[0]}{' cosido' if clave=='merceria' else ''}">
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
 ('Estoy empezando a tejer o a bordar. ¿Me ayudáis?','<p>Claro. Te aconsejamos el material para empezar: qué agujas, qué hilo o lana y cuánto vas a necesitar.</p>'),
 ('¿Se puede comprar por internet?',f'<p>Sí. En Mercería y en Complementos pulsa «Añadir a la cesta», abre la cesta y pulsa «Tramitar pedido y pagar». Puedes pagar con tarjeta, PayPal o Bizum, y elegir recogida gratis en la tienda o envío a casa (gratis desde 50 €). Si prefieres, también puedes hacer el encargo por WhatsApp o por correo:</p><ul><li>Mercería: <a href="mailto:{PED_M}">{PED_M}</a></li><li>Complementos: <a href="mailto:{PED_C}">{PED_C}</a></li></ul>'),
 ('¿Cuánto cuesta el envío y cuánto tarda?',f'<p>{euros(ENVIO_PRECIO)} en la Península y <strong>gratis desde {ENVIO_GRATIS} €</strong>. Llega en {PLAZO_ENVIO} si pides antes de las 14:00. Recoger en la tienda es siempre gratis. <a href="envios-y-devoluciones/">Más detalles</a>.</p>'),
 ('¿Puedo devolver algo?','<p>Sí, tienes 14 días. No se pueden devolver los productos cortados a medida ni la ropa interior, medias o calcetines con el precinto abierto.</p>'),
 ('¿Cómo acierto con el color de un hilo o un botón?','<p>Indica el número de color del fabricante en tu pedido, o pídenos por WhatsApp una foto real con luz natural antes de comprar.</p>'),
 ('¿Qué días abrís?',f'<p>De lunes a sábado, de 10:00 a 14:00 y de 17:00 a 21:00. Domingos y festivos, cerrado.</p>'),
]
preg=''.join(f'<details><summary>{q}</summary><div class="respuesta">{a}</div></details>' for q,a in PREGUNTAS)
redes_txt=''.join(f'<li><a href="{u}">{n}<span class="vh"> ({h})</span></a></li>' for u,n,h in REDES)

inicio=f'''<section class="hero" aria-labelledby="titulo-inicio">
  <div class="envoltura">
    <div class="hero-texto">
      <p class="etiqueta">Mercería · Medias · Complementos · Almendralejo</p>
      <h1 id="titulo-inicio">Hilos, botones, medias y lencería en el centro de Almendralejo</h1>
      <p class="entradilla">Una tienda de las de siempre en la Plaza de Espronceda. Te atendemos con calma y, si no lo tenemos, te lo buscamos.</p>
      {estado()}
      <div class="botones">
        <a class="boton lleno cosido" href="merceria/">Ver Mercería {FLECHA}</a>
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
        {objetos_html()}
        <a class="tarjeta m cosido" href="merceria/" tabindex="-1"><span class="t">Mercería</span><span class="s">Hilos, lanas, botones y labores</span><span class="ir">Entrar →</span></a>
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
      {puerta('merceria','Mercería','Hilos, lanas, botones, cremalleras, cintas y todo lo necesario para coser, tejer y bordar.',MERC,False)}
      {puerta('complementos','Complementos','Medias, calcetines, lencería, pañuelos y bolsos para el día a día y para las ocasiones especiales.',COMP,True)}
    </div>
  </div>
</section>

<section class="bloque crema" id="como-comprar" aria-labelledby="titulo-comprar">
  <div class="envoltura">
    <div class="cabeza-bloque"><p class="etiqueta">Cómo comprar</p><h2 id="titulo-comprar">Fácil, como en la tienda de toda la vida</h2></div>
    <ol class="pasos">
      <li><h3>Llena tu cesta</h3><p>Entra en Mercería o en Complementos y pulsa «Añadir a la cesta» en lo que quieras. Si no lo encuentras, pregúntanos por WhatsApp.</p><div class="botones"><a class="boton cosido" href="merceria/">Ver Mercería {FLECHA}</a><a class="boton" href="complementos/">Ver Complementos {FLECHA}</a></div></li>
      <li><h3>Paga como prefieras</h3><p>Tarjeta, PayPal o Bizum. Solo cobramos cuando comprobamos que tenemos todo: si falta algo, te avisamos antes.</p></li>
      <li><h3>Recógelo o te lo enviamos</h3><p>Recogida gratis en la Plaza de Espronceda 2, o envío a casa en {PLAZO_ENVIO} (gratis desde {ENVIO_GRATIS} €).</p><div class="botones"><a class="boton" href="{MAPS}">{MAPA_ICO}Cómo llegar</a></div></li>
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
w('index.html',doc('','La Valenciana · Mercería y Complementos en Almendralejo','Mercería y complementos en la Plaza de Espronceda 2 de Almendralejo: hilos, lanas, botones, labores, medias, lencería y más. Lunes a sábado.',inicio,'inicio','con-caja',
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
      <p class="aviso-compra">{CANDADO_ICO}<span><strong>Recogida gratis en la tienda</strong> o envío a casa ({euros(ENVIO_PRECIO)}, <strong>gratis desde {ENVIO_GRATIS} €</strong>). Paga con tarjeta, PayPal o Bizum; solo cobramos cuando comprobamos que tenemos todo. <a href="../envios-y-devoluciones/">Envíos y devoluciones</a>.</span></p>
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
  <a class="cambio {'a-c' if otra=='complementos' else 'a-m cosido'}" href="../{otra}/"><div class="pila junta"><span class="etiqueta">La otra sección</span><h2>{otra_nombre}</h2><p>{otra_txt}</p></div><span class="flecha" aria-hidden="true">→</span></a>
</div>
</div>'''
w('merceria/index.html',doc('../','Mercería · La Valenciana','Hilos, lanas, botones, cremalleras, cintas y labores en La Valenciana, Plaza de Espronceda 2, Almendralejo.',
  seccion('merceria','Mercería','seccion-merceria','Todo lo que necesitas para coser, tejer y bordar, y el consejo de quien sabe.',MERC,'complementos','Complementos','Medias, calcetines, lencería, pañuelos y bolsos.',PED_M,False),'merceria'))
w('complementos/index.html',doc('../','Complementos · La Valenciana','Medias, pantis, calcetines, lencería, pañuelos, bolsos y bisutería en La Valenciana, Plaza de Espronceda 2, Almendralejo.',
  seccion('complementos','Complementos','seccion-complementos','Medias, lencería y detalles elegidos con mimo para el día a día y para las ocasiones especiales.',COMP,'merceria','Mercería','Hilos, lanas, botones, cintas y labores.',PED_C,True),'complementos'))

# ---------- CATÁLOGO PARA EL PAGO (precios de referencia) ----------
catalogo={}
for sec,subs in (('merceria',MERC),('complementos',COMP)):
    for slug_,*_ in subs:
        for n,d,pr in PRODUCTOS.get(slug_,[]):
            catalogo[slug_+'--'+slugify(n)]={'n':n,'d':d,'p':pr,'s':sec,'a':slug_,'st':STOCK.get(n,'si')}
apartados={s_:t_ for s_,t_,*_ in MERC+COMP}
w('assets/js/catalogo.js','/* Generado por docs/generar.py: no editar a mano */\nwindow.LV_CATALOGO='+json.dumps(catalogo,ensure_ascii=False)+';\nwindow.LV_APARTADOS='+json.dumps(apartados,ensure_ascii=False)+';\nwindow.LV_ENVIO='+json.dumps({'gratis':ENVIO_GRATIS,'precio':ENVIO_PRECIO})+';\n')

# ---------- PEDIDO (pago con tarjeta) ----------
pedido=f'''<div class="envoltura pedido-pagina">
  <nav class="migas" aria-label="Estás aquí"><ol><li><a href="../">Inicio</a></li><li><span aria-current="page">Tramitar pedido</span></li></ol></nav>
  <div class="pedido-cabeza"><p class="etiqueta">Compra segura</p><h1 id="titulo-pedido">Tramitar pedido</h1>
    <ol class="progreso" aria-label="Pasos"><li class="hecho">Cesta</li><li aria-current="step">Tus datos y pago</li><li>Recogida en tienda</li></ol></div>
  <div class="aviso-prueba" hidden role="note"><strong>Modo de prueba.</strong> Los pagos de esta página no son reales y no se cobra nada.</div>

  <div class="pedido-vacio" hidden>
    <p class="entradilla">Tu cesta está vacía.</p>
    <div class="botones"><a class="boton lleno cosido" href="../merceria/">Ver Mercería {FLECHA}</a><a class="boton lleno" href="../complementos/">Ver Complementos {FLECHA}</a></div>
  </div>

  <div class="pedido-rejilla">
    <form class="pedido-form" novalidate aria-labelledby="titulo-pedido">
      <div class="resumen-errores" role="alert" tabindex="-1" hidden><h2>Revisa estos datos</h2><ul></ul></div>
      <fieldset>
        <legend><span class="paso-num">1</span> Tus datos</legend>
        <p class="secundario">Los usamos para avisarte cuando tu pedido esté listo.</p>
        <div class="campo"><label for="p-nombre">Nombre y apellidos</label><input id="p-nombre" name="nombre" type="text" autocomplete="name" required aria-describedby="p-nombre-error"><p class="error" id="p-nombre-error"></p></div>
        <div class="campo"><label for="p-email">Correo electrónico</label><input id="p-email" name="email" type="email" autocomplete="email" inputmode="email" required aria-describedby="p-email-ayuda p-email-error"><p class="ayuda-campo" id="p-email-ayuda">Ejemplo: nombre@correo.com</p><p class="error" id="p-email-error"></p></div>
        <div class="campo"><label for="p-tel">Teléfono móvil</label><input id="p-tel" name="telefono" type="tel" autocomplete="tel" inputmode="tel" required aria-describedby="p-tel-ayuda p-tel-error"><p class="ayuda-campo" id="p-tel-ayuda">9 cifras. Ejemplo: 600 123 456</p><p class="error" id="p-tel-error"></p></div>
        <div class="campo"><label for="p-notas">Tallas, colores u otras indicaciones <span class="secundario">(opcional)</span></label><textarea id="p-notas" name="notas" rows="3" maxlength="300"></textarea></div>
      </fieldset>
      <fieldset>
        <legend><span class="paso-num">2</span> Entrega</legend>
        <div class="opciones">
          <label class="opcion"><input type="radio" name="entrega" value="tienda" checked><span><strong>Recoger en la tienda · Gratis</strong><small>{DIR1}. Listo en 1 o 2 días laborables; te avisamos por teléfono.</small></span></label>
          <label class="opcion"><input type="radio" name="entrega" value="envio"><span><strong>Envío a domicilio · <span class="precio-envio num">{euros(ENVIO_PRECIO)}</span></strong><small>Gratis desde {ENVIO_GRATIS} €. Península: {PLAZO_ENVIO} si pides antes de las 14:00, con número de seguimiento.</small></span></label>
        </div>
        <div class="direccion" hidden>
          <div class="campo"><label for="p-dir">Dirección (calle, número, piso)</label><input id="p-dir" name="direccion" type="text" autocomplete="street-address" aria-describedby="p-dir-error"><p class="error" id="p-dir-error"></p></div>
          <div class="campo-fila">
            <div class="campo"><label for="p-cp">Código postal</label><input id="p-cp" name="cp" type="text" inputmode="numeric" autocomplete="postal-code" maxlength="5" aria-describedby="p-cp-ayuda p-cp-error"><p class="ayuda-campo" id="p-cp-ayuda">5 cifras. Solo Península.</p><p class="error" id="p-cp-error"></p></div>
            <div class="campo"><label for="p-loc">Localidad</label><input id="p-loc" name="localidad" type="text" autocomplete="address-level2" aria-describedby="p-loc-error"><p class="error" id="p-loc-error"></p></div>
          </div>
          <div class="campo"><label for="p-prov">Provincia</label><input id="p-prov" name="provincia" type="text" autocomplete="address-level1" aria-describedby="p-prov-error"><p class="error" id="p-prov-error"></p></div>
        </div>
      </fieldset>
      <fieldset>
        <legend><span class="paso-num">3</span> Pago</legend>
        <div class="campo campo-check"><input id="p-acepto" name="acepto" type="checkbox" required aria-describedby="p-acepto-error"><label for="p-acepto">He leído y acepto las <a href="../condiciones-de-venta/" target="_blank" rel="noopener">condiciones de venta<span class="vh"> (se abre en otra pestaña)</span></a> y la <a href="../privacidad/" target="_blank" rel="noopener">política de privacidad<span class="vh"> (se abre en otra pestaña)</span></a>.</label><p class="error" id="p-acepto-error"></p></div>
        <div class="opciones">
          <label class="opcion"><input type="radio" name="metodo" value="tarjeta" checked><span><strong>Tarjeta de débito o crédito, o PayPal</strong><small>No necesitas cuenta de PayPal.</small></span></label>
          <label class="opcion"><input type="radio" name="metodo" value="bizum"><span><strong>Bizum</strong><small>Te enviamos la confirmación por WhatsApp y haces el Bizum.</small></span></label>
        </div>
        <p class="pago-info">{CANDADO_ICO}<span><strong>Solo cobramos cuando comprobamos que tenemos todo.</strong> Si falta algo, te avisamos antes de cobrar. Nunca vemos los datos de tu tarjeta.</span></p>
        <div class="pago-estado" role="status" aria-live="polite"></div>
        <div class="bloque-tarjeta"><div id="pago-botones" class="pago-botones"></div></div>
        <div class="bloque-bizum" hidden>
          <ol class="pasos-bizum"><li>Pulsa «Enviar pedido» y se abrirá WhatsApp con tu pedido. Envíanos el mensaje.</li><li>Comprobamos que tenemos todo y te confirmamos el total.</li><li>Haces el Bizum al <strong class="num">{BIZUM_TEL}</strong> con tu número de pedido como concepto.</li></ol>
          <button class="boton lleno confirmar-bizum" type="button">{WA_ICO}Enviar pedido y pagar con Bizum</button>
        </div>
        <div class="pago-alternativa" hidden><p>Si el pago no funciona, puedes hacer el pedido por WhatsApp y pagarlo al recogerlo.</p><a class="boton enviar-wa-pedido" href="#">{WA_ICO}Pedir por WhatsApp</a></div>
      </fieldset>
    </form>

    <aside class="pedido-resumen" aria-labelledby="titulo-resumen">
      <div class="resumen-caja">
        <h2 id="titulo-resumen">Tu pedido</h2>
        <ul class="resumen-lista"></ul>
        <dl class="resumen-totales"><div><dt>Productos</dt><dd class="num r-subtotal">0,00 €</dd></div><div><dt class="r-envio-txt">Recogida en tienda</dt><dd class="num r-envio">Gratis</dd></div><div class="total"><dt>Total <span class="secundario">(IVA incluido)</span></dt><dd class="num r-total">0,00 €</dd></div></dl>
        <p class="r-falta" aria-live="polite"></p>
        <button class="boton editar-cesta" type="button" aria-haspopup="dialog" aria-controls="cesta">Cambiar cantidades</button>
      </div>
    </aside>
  </div>

  <section class="pedido-ok" hidden aria-labelledby="titulo-ok" tabindex="-1">
    <div class="ok-sello" aria-hidden="true">✓</div>
    <h2 id="titulo-ok">¡Gracias! Hemos recibido tu pedido</h2>
    <p class="entradilla">Número de pedido: <strong class="num ok-numero"></strong></p>
    <p class="ok-texto"></p>
    <ul class="resumen-lista ok-lista"></ul>
    <p class="ok-total"></p>
    <div class="botones"><a class="boton lleno" href="../">Volver al inicio</a><a class="boton ok-wa" href="#">{WA_ICO}Avisarnos por WhatsApp</a></div>
  </section>
</div>'''
w('pedido/index.html',doc('../','Tramitar pedido · La Valenciana','Paga tu pedido con tarjeta, PayPal o Bizum y recógelo gratis en la tienda o recíbelo en casa.',pedido,'pedido','pagina-pedido','',
  '<meta name="robots" content="noindex">\n<script src="../assets/js/pago-config.js" defer></script>\n<script src="../assets/js/pedido.js" defer></script>\n'))

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
'envios-y-devoluciones':('Envíos y devoluciones',f'''<p class="entradilla">Lo importante, en pocas palabras.</p>
<div class="claves">
<section><h2>Recogida en la tienda</h2><p><strong>Gratis.</strong> Listo en 1 o 2 días laborables. Te avisamos por teléfono y lo recoges en {DIR1}.</p></section>
<section><h2>Envío a domicilio</h2><p><strong>{euros(ENVIO_PRECIO)}, gratis desde {ENVIO_GRATIS} €.</strong> Península: {PLAZO_ENVIO} si pides antes de las 14:00. Con número de seguimiento.</p></section>
<section><h2>Si falta algo</h2><p>Comprobamos el pedido antes de cobrar. Si falta un producto, <strong>te avisamos antes</strong> y no se te cobra.</p></section>
<section><h2>Devoluciones</h2><p><strong>14 días</strong> para devolver lo que no te convenza, en la tienda o por envío. Te devolvemos el dinero como máximo en 14 días.</p></section>
</div>
<h2>Qué no se puede devolver</h2>
<ul><li>Cintas, puntillas, gomas y cualquier producto <strong>cortado a medida</strong>.</li><li>Ropa interior, lencería, medias y calcetines si se ha <strong>abierto el precinto</strong>, por higiene.</li></ul>
<h2>¿Dudas o algún problema?</h2>
<p>Escríbenos por <a href="{wa('Hola, tengo una duda con un pedido')}">WhatsApp al {WA_TXT}</a> o llámanos al <a class="num" href="{TEL_HREF}">{TEL}</a>, de lunes a sábado en horario de tienda. Tienes todos los detalles en las <a href="../condiciones-de-venta/">condiciones de venta</a>.</p>'''),
'condiciones-de-venta':('Condiciones de venta',f'''<p class="entradilla">Estas condiciones se aplican a las compras hechas en esta web. Léelas antes de pagar.</p>
<h2>1. Quién vende</h2>
<p>{P} (NIF {P}), con domicilio en {DIR1}, {DIR2}. Teléfono {TEL}. Correo {CORREO}.</p>
<h2>2. Precios</h2>
<p>Los precios están en euros e incluyen el IVA. La recogida en la tienda es gratuita. El envío a domicilio en la Península cuesta {euros(ENVIO_PRECIO)} y es gratis en pedidos desde {ENVIO_GRATIS} €. Por ahora no enviamos a Baleares, Canarias, Ceuta ni Melilla: escríbenos y buscamos una solución.</p>
<h2>3. Cómo se compra</h2>
<ol><li>Añade productos a la cesta.</li><li>Pulsa «Tramitar pedido y pagar», rellena tus datos, elige recogida o envío y acepta estas condiciones.</li><li>Elige cómo pagar. Verás un número de pedido en pantalla.</li><li>Comprobamos que tenemos todo. Si falta algún producto, te avisamos <strong>antes de cobrar</strong> y decides si quieres el resto.</li></ol>
<h2>4. Pago</h2>
<p><strong>Tarjeta o PayPal:</strong> lo procesa PayPal de forma segura, sin necesidad de tener cuenta. Al pagar solo se <em>reserva</em> el importe; el cobro se hace cuando confirmamos el pedido. Si no podemos servirlo, la reserva se anula y no se te cobra nada. No guardamos los datos de tu tarjeta.</p>
<p><strong>Bizum:</strong> cuando confirmamos el pedido por WhatsApp, haces el Bizum al {BIZUM_TEL} indicando el número de pedido.</p>
<h2>5. Recogida y envío</h2>
<p><strong>Recogida:</strong> te avisamos por teléfono cuando el pedido esté listo, normalmente en 1 o 2 días laborables. Puedes recogerlo en {DIR1} en horario de tienda ({HORARIO_CORTO}) durante 30 días.</p>
<p><strong>Envío:</strong> en la Península lo entregamos en {PLAZO_ENVIO} si pides antes de las 14:00 de un día laborable. Te mandamos el número de seguimiento. Si hay algún retraso, te avisamos.</p>
<h2>6. Derecho de desistimiento</h2>
<p>Tienes 14 días naturales desde que recibes o recoges el pedido para devolver los productos sin dar explicaciones. Tráelos a la tienda o envíanoslos en el mismo estado; avísanos antes por WhatsApp o correo. Si nos lo envías, el coste de la devolución corre de tu cuenta, salvo que el producto sea defectuoso o no sea el que pediste. Te devolvemos el importe por el mismo medio de pago en un plazo máximo de 14 días.</p>
<p>Por motivos de higiene, no se admite la devolución de ropa interior, lencería, medias ni calcetines si se ha abierto su precinto o envoltorio. Tampoco de productos cortados a medida (cintas, puntillas o gomas por metros).</p>
<h2>7. Garantía</h2>
<p>Los productos tienen la garantía legal de 3 años por falta de conformidad. Si algo llega defectuoso, tráelo a la tienda y lo cambiamos o te devolvemos el dinero.</p>
<h2>8. Reclamaciones</h2>
<p>Puedes reclamar en la tienda, por correo a {CORREO} o en las hojas de reclamaciones oficiales de la Junta de Extremadura que tenemos a tu disposición.</p>'''),
'aviso-legal':('Aviso legal',f'''<p>En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de los datos del titular de esta web.</p>
<h2>Titular</h2>
<p>Nombre o razón social: {P}<br>NIF: {P}<br>Domicilio: {DIR1}, {DIR2}<br>Correo: {CORREO}<br>Teléfono: {TEL}</p>
<h2>Uso de la web</h2>
<p>Esta web informa sobre la tienda La Valenciana y sus productos. A través de ella se pueden comprar productos con pago en línea y recogida en la tienda, según las <a href="../condiciones-de-venta/">condiciones de venta</a>. El uso de la web implica la aceptación de este aviso.</p>
<h2>Propiedad intelectual</h2>
<p>Los textos, el logotipo y las imágenes de esta web pertenecen a La Valenciana o se usan con permiso. No se permite su reproducción sin autorización.</p>'''),
'privacidad':('Política de privacidad',f'''<p>La cesta se guarda solo en tu navegador. Cuando pagas un pedido, tus datos se envían a PayPal, que gestiona el pago, y nos llegan a través de esa plataforma.</p>
<h2>Responsable</h2>
<p>{P} (NIF {P}), con domicilio en {DIR1}, {DIR2}. Contacto: {CORREO}</p>
<h2>Datos que nos envías</h2>
<p>Si compras en la web, usaremos tus datos (nombre, correo, teléfono y el contenido del pedido) para preparar el pedido, avisarte cuando esté listo y cumplir las obligaciones legales y fiscales. La base legal es la ejecución del contrato de compra. Si nos escribes por correo o WhatsApp, usaremos tus datos solo para responderte, con tu consentimiento.</p>
<h2>Pagos</h2>
<p>Los pagos los procesa PayPal (Europe) S.à r.l. et Cie, S.C.A. Nosotros nunca vemos ni guardamos los datos de tu tarjeta. Consulta su política de privacidad en paypal.com.</p>
<p>No cedemos tus datos a otros terceros salvo obligación legal.</p>
<h2>Tus derechos</h2>
<p>Puedes pedir acceso, rectificación, supresión, oposición, limitación y portabilidad de tus datos escribiendo a {CORREO}. También puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).</p>'''),
'cookies':('Política de cookies','''<p>Esta web no usa cookies propias ni herramientas de analítica o publicidad. Las tipografías se sirven desde la propia web.</p>
<h2>Cookies de la pasarela de pago</h2>
<p>Solo en la página de pago («Tramitar pedido») se carga el servicio de PayPal, que instala cookies técnicas necesarias para procesar el pago de forma segura y prevenir el fraude. Son imprescindibles para pagar y no se usan para publicidad en esta web. Más información en la política de cookies de PayPal.</p>
<h2>Almacenamiento local</h2>
<p>El navegador guarda estas marcas técnicas, que no contienen datos personales:</p>
<ul><li><code>lv-caja</code>: para que la animación de la caja de la portada sea más rápida en tus siguientes visitas.</li><li><code>lv-letra</code>: para recordar si has elegido «Letra grande».</li><li><code>lv-cesta</code>: los productos que añades a la cesta, para que no se pierdan al cambiar de página. Solo se guardan en tu navegador; no nos llegan hasta que pagas el pedido.</li><li><code>lv-ultimo-pedido</code>: el resumen de tu último pedido pagado, para mostrarte la confirmación (se borra al cerrar la pestaña).</li></ul>
<p>Puedes borrarlas desde la configuración de tu navegador.</p>
<h2>Enlaces externos</h2>
<p>Los enlaces a Instagram, TikTok, Facebook, WhatsApp y Google Maps te llevan a esos servicios, que tienen sus propias políticas de cookies.</p>''')}
for slug,(t,body) in legales.items():
    etiqueta='Accesibilidad' if slug=='accesibilidad' else ('Compras' if slug in ('condiciones-de-venta','envios-y-devoluciones') else 'Información legal')
    w(f'{slug}/index.html',doc('../',f'{t} · La Valenciana',f'{t} de la web de La Valenciana.',f'<div class="envoltura legal-texto"><nav class="migas" aria-label="Estás aquí"><ol><li><a href="../">Inicio</a></li><li><span aria-current="page">{t}</span></li></ol></nav><p class="etiqueta">{etiqueta}</p><h1>{t}</h1>{body}</div>',slug))

# 404 (GitHub Pages lo sirve desde cualquier ruta: enlaces absolutos al subdirectorio)
base='/web-la-valenciana/'
w('404.html',doc(base,'Página no encontrada · La Valenciana','Esta página no existe.',
  f'<div class="envoltura legal-texto centrado"><p class="etiqueta">Error 404</p><h1>Esta página se ha descosido</h1><p class="entradilla">No encontramos lo que buscabas. Vuelve al inicio o elige una sección.</p><div class="botones" style="justify-content:center"><a class="boton lleno" href="{base}">Volver al inicio</a><a class="boton cosido" href="{base}merceria/">Mercería</a><a class="boton" href="{base}complementos/">Complementos</a></div><p>¿Necesitas ayuda? Llámanos al <a class="num" href="{TEL_HREF}">{TEL}</a>.</p></div>','404'))
print('ok')
