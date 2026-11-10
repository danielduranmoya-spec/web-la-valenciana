import os, json, urllib.parse
import pathlib
R=str(pathlib.Path(__file__).resolve().parent.parent)
WA='34633930935'
WA_ICO='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>'
def wa(msg): return f"https://wa.me/{WA}?text="+urllib.parse.quote(msg)
NAV=[('merceria/','Mercería'),('complementos/','Complementos'),('#nosotras','Nosotras'),('#visitanos','Visítanos')]
def cab(p,actual):
    items=[]
    for href,t in NAV:
        h=(p+href) if not href.startswith('#') else ((href) if actual=='inicio' else p+href)
        cur=' aria-current="page"' if (actual=='merceria' and t=='Mercería') or (actual=='complementos' and t=='Complementos') else ''
        items.append(f'<li><a href="{h}"{cur}>{t}</a></li>')
    return f'''<a class="salto" href="#contenido">Saltar al contenido</a>
<header class="cabecera">
  <div class="envoltura">
    <a class="marca" href="{p or './'}"><img src="{p}assets/img/marca/monograma.svg" alt="" width="34" height="34">La Valenciana</a>
    <button class="boton-menu" type="button" aria-expanded="false" aria-controls="menu-principal">Menú</button>
    <nav class="menu-principal" id="menu-principal" aria-label="Menú principal"><ul>{''.join(items)}</ul></nav>
  </div>
</header>'''
def pie(p):
    return f'''<footer class="pie">
  <div class="envoltura">
    <div class="rejilla">
      <div><img class="logo-pie" src="{p}assets/img/marca/logo-blanco.svg" alt="La Valenciana" width="220" height="110"></div>
      <div><h2>Visítanos</h2><ul><li>Plaza de Espronceda 2<br>06200 Almendralejo (Badajoz)</li><li class="horario">Lunes a sábado<br>10:00–14:00 y 17:00–21:00</li></ul></div>
      <div><h2>Contacto</h2><ul><li><a href="tel:+34924670839">924 67 08 39</a></li><li><a href="{wa('Hola, La Valenciana')}">WhatsApp 633 930 935</a></li><li><a href="mailto:administracion@lavalencianamerceria.com">administracion@lavalencianamerceria.com</a></li></ul></div>
      <div><h2>Síguenos</h2><ul><li><a href="https://www.instagram.com/_lavalenciana">Instagram</a></li><li><a href="https://www.tiktok.com/@_lavalenciana_">TikTok</a></li><li><a href="https://www.facebook.com/mercerialavalenciana/">Facebook</a></li></ul></div>
    </div>
    <div class="legal"><span>© 2026 La Valenciana · Mercería y Complementos</span><ul><li><a href="{p}aviso-legal/">Aviso legal</a></li><li><a href="{p}privacidad/">Privacidad</a></li><li><a href="{p}cookies/">Cookies</a></li></ul></div>
  </div>
</footer>
<a class="wa-flotante" href="{wa('Hola, La Valenciana')}" aria-label="Escríbenos por WhatsApp">{WA_ICO}<span>WhatsApp</span></a>
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
<link rel="stylesheet" href="{p}assets/fonts/fuentes.css">
<link rel="stylesheet" href="{p}assets/css/tokens.css">
<link rel="stylesheet" href="{p}assets/css/estilos.css">
{extra_css}{extra_head}</head>
<body{(' class="'+clase+'"') if clase else ''}>
{cab(p,actual)}
<main id="contenido">
{cuerpo}
</main>
{pie(p)}
</body>
</html>
'''
def w(path,txt):
    full=os.path.join(R,path); os.makedirs(os.path.dirname(full),exist_ok=True); open(full,'w').write(txt)

MERC=[('hilos-y-lanas','Hilos y lanas','Hilos de coser, de bordar y de ganchillo, y lanas para tejer en todos los grosores y colores.',['Hilo de coser','Mouliné','Algodón para ganchillo','Lanas']),
 ('botones-y-cremalleras','Botones y cremalleras','Botones de todos los tamaños y materiales, y cremalleras a la medida que necesites.',['Botones','Corchetes y broches','Cremalleras','Velcro']),
 ('cintas-y-puntillas','Cintas y puntillas','Cintas, bieses, gomas, puntillas y entredoses para rematar cualquier prenda.',['Cintas','Bieses','Gomas','Puntillas']),
 ('agujas-y-accesorios','Agujas y accesorios de costura','Todo lo básico del costurero: agujas, alfileres, dedales, tijeras y cintas métricas.',['Agujas','Alfileres','Dedales','Tijeras']),
 ('labores','Labores','Material para punto, ganchillo, bordado y punto de cruz, con consejo si estás empezando.',['Punto','Ganchillo','Bordado','Punto de cruz']),
 ('arreglos','Arreglos','Bajos, cremalleras y pequeños arreglos. Tráenos la prenda y te decimos plazo y precio.',['Bajos','Cambio de cremallera','Pequeños arreglos'])]
COMP=[('medias-y-pantis','Medias y pantis','Medias, pantis y leggins para el día a día y para las ocasiones especiales, en varias densidades y tallas.',['Pantis','Medias','Leggins','Tallas grandes']),
 ('calcetines','Calcetines','Calcetines de algodón, de lana y de fantasía para toda la familia.',['Algodón','Lana','Pinkies','Infantil']),
 ('lenceria','Lencería y ropa interior','Ropa interior cómoda y bonita: sujetadores, braguitas, camisetas interiores y lencería.',['Sujetadores','Braguitas','Camisetas interiores','Lencería']),
 ('panuelos-y-bufandas','Pañuelos y bufandas','Pañuelos, fulares y bufandas para dar el toque final.',['Pañuelos','Fulares','Bufandas']),
 ('bolsos-y-bisuteria','Bolsos y bisutería','Bolsos, carteras y bisutería para completar tu estilo.',['Bolsos','Carteras','Bisutería'])]

# ---------- INICIO ----------
logo_caja='assets/img/marca/logo-grafito.svg'
inicio=f'''<section class="hero" aria-label="Bienvenida">
  <div class="escenario">
    <div class="sombra" aria-hidden="true"></div>
    <div class="escala"><div class="mundo">
      <div class="cara fondo" aria-hidden="true"></div>
      <div class="cara seda" aria-hidden="true"></div>
      <div class="cara trasera" aria-hidden="true"></div>
      <div class="cara izq" aria-hidden="true"></div>
      <div class="cara der" aria-hidden="true"></div>
      <a class="tarjeta m" href="merceria/" tabindex="-1"><span class="t">Mercería</span><span class="s">Hilos, lanas, botones y labores</span><span class="ir">Entrar</span></a>
      <a class="tarjeta c" href="complementos/" tabindex="-1"><span class="t">Complementos</span><span class="s">Medias, lencería y detalles</span><span class="ir">Entrar</span></a>
      <div class="cara frente" aria-hidden="true"><span class="datos-caja">lavalencianamerceria.com · lavalencianacomplementos.com<br>@_lavalenciana · 633 930 935</span></div>
      <div class="bisagra" aria-hidden="true"><div class="cara tapa"><img src="{logo_caja}" alt="" width="600" height="300"><div class="tapa-dentro"></div><div class="cara solapa"></div></div></div>
    </div></div>
    <span class="abriendo" aria-hidden="true">Abriendo la caja</span>
  </div>
  <div class="pie-hero">
    <h1>Mercería y complementos en el corazón de Almendralejo</h1>
    <p>Plaza de Espronceda 2 · Lunes a sábado, 10:00–14:00 y 17:00–21:00</p>
    <a class="bajar" href="#secciones">Descubre la tienda ↓</a>
  </div>
</section>

<section class="bloque" id="secciones">
  <div class="envoltura">
    <div class="cabeza-bloque"><p class="etiqueta">Una tienda, dos secciones</p><h2>¿Qué estás buscando hoy?</h2></div>
    <div class="puertas">
      <a class="puerta m" href="merceria/"><div class="foto"><span>Foto · Mercería</span></div><div class="texto"><h3>Mercería</h3><p>Hilos, lanas, botones, cremalleras y todo lo necesario para coser, tejer y arreglar.</p><span class="ir">Entrar en Mercería →</span></div></a>
      <a class="puerta c" href="complementos/"><div class="foto gris"><span>Foto · Complementos</span></div><div class="texto"><h3>Complementos</h3><p>Medias, calcetines, lencería, pañuelos y bolsos para completar tu estilo.</p><span class="ir">Entrar en Complementos →</span></div></a>
    </div>
  </div>
</section>

<section class="bloque blanco" id="nosotras">
  <div class="envoltura dos">
    <div class="foto"><span>Foto · el local</span></div>
    <div class="pila">
      <p class="etiqueta">Nosotras</p>
      <h2>Una tienda de las de siempre, con trato cercano</h2>
      <p class="entradilla">En La Valenciana te atendemos con calma y te aconsejamos, tanto si buscas el botón exacto para una chaqueta como unas medias para una boda.</p>
      <p>Si no lo tenemos, te lo buscamos. Escríbenos por WhatsApp o pásate por la tienda.</p>
      <div class="botones"><a class="boton" href="https://www.instagram.com/_lavalenciana">Instagram</a><a class="boton" href="https://www.tiktok.com/@_lavalenciana_">TikTok</a><a class="boton" href="https://www.facebook.com/mercerialavalenciana/">Facebook</a></div>
    </div>
  </div>
</section>

<section class="bloque perla" id="visitanos">
  <div class="envoltura dos">
    <div class="pila">
      <p class="etiqueta">Visítanos</p>
      <h2>Te esperamos en la Plaza de Espronceda</h2>
      <dl class="datos">
        <div><dt>Dirección</dt><dd>Plaza de Espronceda 2, 06200 Almendralejo (Badajoz)</dd></div>
        <div><dt>Horario</dt><dd class="horario">Lunes a sábado: 10:00–14:00 y 17:00–21:00<br>Domingos y festivos: cerrado</dd></div>
        <div><dt>Teléfono</dt><dd><a href="tel:+34924670839">924 67 08 39</a></dd></div>
        <div><dt>WhatsApp</dt><dd><a href="{wa('Hola, La Valenciana')}">633 930 935</a></dd></div>
        <div><dt>Correo</dt><dd><a href="mailto:administracion@lavalencianamerceria.com">administracion@lavalencianamerceria.com</a></dd></div>
      </dl>
      <div class="botones">
        <a class="boton lleno" href="https://www.google.com/maps/search/?api=1&amp;query=La+Valenciana+Plaza+de+Espronceda+2+Almendralejo">Cómo llegar</a>
        <a class="boton" href="{wa('Hola, La Valenciana')}">{WA_ICO}Escríbenos</a>
      </div>
    </div>
    <div class="foto gris"><span>Foto · fachada</span></div>
  </div>
</section>'''
ld={"@context":"https://schema.org","@type":"Store","name":"La Valenciana","description":"Mercería y complementos en Almendralejo.",
 "address":{"@type":"PostalAddress","streetAddress":"Plaza de Espronceda 2","postalCode":"06200","addressLocality":"Almendralejo","addressRegion":"Badajoz","addressCountry":"ES"},
 "telephone":"+34924670839","email":"administracion@lavalencianamerceria.com",
 "openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"opens":"10:00","closes":"14:00"},
   {"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"opens":"17:00","closes":"21:00"}],
 "sameAs":["https://www.instagram.com/_lavalenciana","https://www.tiktok.com/@_lavalenciana_","https://www.facebook.com/mercerialavalenciana/"]}
w('index.html',doc('','La Valenciana · Mercería y Complementos en Almendralejo','Mercería y complementos en la Plaza de Espronceda de Almendralejo: hilos, lanas, botones, labores, medias, lencería y más.',inicio,'inicio','con-caja',
  '<link rel="stylesheet" href="assets/css/caja.css">\n','<script type="application/ld+json">'+json.dumps(ld,ensure_ascii=False)+'</script>\n'))

# ---------- SECCIONES ----------
def seccion(slug,nombre,clase,intro,subs,otra,otra_nombre,otra_txt,correo,gris):
    indice=''.join(f'<li><a href="#{s}">{t}</a></li>' for s,t,_,_ in subs)
    bloques=''
    for i,(s,t,txt,lst) in enumerate(subs):
        f='foto gris' if gris else 'foto'
        bloques+=f'''
    <article class="subseccion" id="{s}">
      <div class="{f}"><span>Foto · {t.lower()}</span></div>
      <div class="pila">
        <h2>{t}</h2>
        <p>{txt}</p>
        <ul class="lista">{''.join(f'<li>{x}</li>' for x in lst)}</ul>
        <a class="enlace-wa" href="{wa(f'Hola, quería preguntar por {t.lower()}')}">{WA_ICO}Preguntar por WhatsApp</a>
      </div>
    </article>'''
    cuerpo=f'''<div class="{clase}">
<section class="portada-seccion">
  <div class="envoltura dos">
    <div class="pila"><p class="etiqueta">La Valenciana</p><h1>{nombre}</h1><p class="entradilla">{intro}</p>
      <p>Pedidos y consultas: <a href="mailto:{correo}">{correo}</a></p></div>
    <div class="{'foto gris' if gris else 'foto'}"><span>Foto · {nombre.lower()}</span></div>
  </div>
</section>
<nav class="indice" aria-label="Apartados de {nombre}"><div class="envoltura"><ul>{indice}</ul></div></nav>
<div class="envoltura subsecciones">{bloques}
</div>
<div class="envoltura" style="padding-bottom:clamp(64px,10vw,120px)">
  <a class="cambio {'a-c' if otra=='complementos' else 'a-m'}" href="../{otra}/"><div class="pila"><span class="etiqueta">La otra sección</span><h2>{otra_nombre}</h2><p>{otra_txt}</p></div><span class="flecha" aria-hidden="true">→</span></a>
</div>
</div>'''
    return cuerpo
w('merceria/index.html',doc('../','Mercería · La Valenciana','Hilos, lanas, botones, cremalleras, cintas, labores y arreglos en La Valenciana, Almendralejo.',
  seccion('merceria','Mercería','seccion-merceria','Todo lo que necesitas para coser, tejer y arreglar, y el consejo de quien sabe.',MERC,'complementos','Complementos','Medias, calcetines, lencería, pañuelos y bolsos.','pedidos@lavalencianamerceria.com',False),'merceria'))
w('complementos/index.html',doc('../','Complementos · La Valenciana','Medias, pantis, calcetines, lencería, pañuelos, bolsos y bisutería en La Valenciana, Almendralejo.',
  seccion('complementos','Complementos','seccion-complementos','Medias, lencería y detalles elegidos con mimo para el día a día y para las ocasiones especiales.',COMP,'merceria','Mercería','Hilos, lanas, botones, labores y arreglos.','pedidos@lavalencianacomplementos.com',True),'complementos'))

# ---------- LEGALES ----------
P='<span class="pendiente">[pendiente]</span>'
legales={
'aviso-legal':('Aviso legal',f'''<p>En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de los datos del titular de esta web.</p>
<h2>Titular</h2>
<p>Nombre o razón social: {P}<br>NIF: {P}<br>Domicilio: Plaza de Espronceda 2, 06200 Almendralejo (Badajoz)<br>Correo: administracion@lavalencianamerceria.com<br>Teléfono: 924 67 08 39</p>
<h2>Uso de la web</h2>
<p>Esta web informa sobre la tienda La Valenciana y sus productos. No se realizan ventas a través de ella. El uso de la web implica la aceptación de este aviso.</p>
<h2>Propiedad intelectual</h2>
<p>Los textos, el logotipo y las imágenes de esta web pertenecen a La Valenciana o se usan con permiso. No se permite su reproducción sin autorización.</p>'''),
'privacidad':('Política de privacidad',f'''<p>Esta web no tiene formularios ni recoge datos personales por sí misma.</p>
<h2>Responsable</h2>
<p>{P} (NIF {P}), con domicilio en Plaza de Espronceda 2, 06200 Almendralejo. Contacto: administracion@lavalencianamerceria.com</p>
<h2>Datos que nos envías</h2>
<p>Si nos escribes por correo electrónico o por WhatsApp, usaremos tus datos solo para responderte y atender tu pedido o consulta. La base legal es tu consentimiento al contactarnos. No cedemos tus datos a terceros salvo obligación legal.</p>
<h2>Tus derechos</h2>
<p>Puedes pedir acceso, rectificación, supresión, oposición, limitación y portabilidad de tus datos escribiendo a administracion@lavalencianamerceria.com. También puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).</p>'''),
'cookies':('Política de cookies','''<p>Esta web no usa cookies propias ni de terceros, ni herramientas de analítica o publicidad. Las tipografías se sirven desde la propia web.</p>
<h2>Almacenamiento local</h2>
<p>El navegador guarda una única marca técnica (<code>lv-caja</code>) para que la animación de la caja de la portada sea más rápida en tus siguientes visitas. No contiene datos personales y puedes borrarla desde la configuración de tu navegador.</p>
<h2>Enlaces externos</h2>
<p>Los enlaces a Instagram, TikTok, Facebook, WhatsApp y Google Maps te llevan a esos servicios, que tienen sus propias políticas de cookies.</p>''')}
for slug,(t,body) in legales.items():
    w(f'{slug}/index.html',doc('../',f'{t} · La Valenciana',f'{t} de la web de La Valenciana.',f'<div class="envoltura legal-texto"><p class="etiqueta">Información legal</p><h1>{t}</h1>{body}</div>',slug))

# 404 (GitHub Pages lo sirve desde cualquier ruta: enlaces absolutos al subdirectorio)
base='/web-la-valenciana/'
w('404.html',doc(base,'Página no encontrada · La Valenciana','Esta página no existe.',
  f'<div class="envoltura legal-texto" style="text-align:center;justify-items:center"><p class="etiqueta">Error 404</p><h1>Esta página se ha descosido</h1><p>No encontramos lo que buscabas. Vuelve al inicio o elige una sección.</p><div class="botones" style="justify-content:center"><a class="boton lleno" href="{base}">Volver al inicio</a><a class="boton" href="{base}merceria/">Mercería</a><a class="boton" href="{base}complementos/">Complementos</a></div></div>','404'))
print('ok')
