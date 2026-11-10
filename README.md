# La Valenciana · Web

Web de **La Valenciana**, con sus dos secciones: **Mercería** y **Complementos**.

- Estilo minimalista en rosas y grises pastel.
- En la portada, una caja que se abre y despliega el menú principal.
- Web estática (HTML, CSS y JavaScript), publicada gratis con GitHub Pages.

## Estructura

```
index.html                    Inicio: caja animada, secciones, Nosotras y Visítanos
merceria/                     Mercería y sus subsecciones (anclas #hilos-y-lanas, ...)
complementos/                 Complementos y sus subsecciones
aviso-legal/ privacidad/ cookies/   Textos legales (faltan titular y NIF)
404.html                      Página de error
assets/css/tokens.css         Colores y tipografías de marca
assets/css/estilos.css        Estilos comunes
assets/css/caja.css           Animación 3D de la caja (solo Inicio)
assets/js/web.js              Menú móvil, índice de subsecciones y animación
assets/fonts/                 Playfair Display y Jost alojadas en la web
assets/img/marca/             Logotipos y monograma
docs/                         Plan e identidad
```

Las fotos son huecos con el color de la paleta (`.foto`). Para poner una foto real, añade dentro un `<img src="..." alt="...">`.

## Ver la web en local

Abre `index.html` en el navegador o, desde la carpeta del proyecto:

```
python3 -m http.server 8000
```

y visita http://localhost:8000.

## Contacto del negocio

- Instagram: [@_lavalenciana](https://www.instagram.com/_lavalenciana)
- TikTok: _lavalenciana_
- Facebook: La Valenciana
- WhatsApp: 633 930 935
- Dominios: lavalencianamerceria.com · lavalencianacomplementos.com (ver docs/dominios.md)

Web publicada: https://danielduranmoya-spec.github.io/web-la-valenciana/

- Plan de trabajo: [docs/plan.md](docs/plan.md)
- Identidad visual: [docs/identidad.md](docs/identidad.md)
- Conectar los dominios: [docs/dominios.md](docs/dominios.md)
- Las páginas se generan con `python3 docs/generar.py` (cabecera y pie compartidos). Si cambias textos, edita ese archivo y vuelve a ejecutarlo.
