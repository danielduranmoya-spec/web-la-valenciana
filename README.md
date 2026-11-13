# La Valenciana · Web

Web de **La Valenciana**, mercería y complementos en la calle Moreno Nieto 7 de Almendralejo, con tres secciones: **Mercería**, **Complementos** y **Cápsulas**.

- Paleta blanca, crema y kraft (la de la v3), con Playfair Display y Jost alojadas en la propia web.
- En la portada, una caja de cartón que se abre y de la que salen las secciones.
- Catálogo con vistas de colores, medidas y tallas, búsqueda por color, cesta y pedido con pago con tarjeta (PayPal), WhatsApp o correo.
- Web estática (HTML, CSS y JavaScript), publicada gratis con GitHub Pages.

## Estructura

```
index.html                     La tienda (una sola página; las vistas van por #/…: #/c/merceria, #/p/<id>, #/pedido…)
assets/tienda/css/             Estilos de la tienda (tokens.css = colores y tipografías; fusion.css = lo traído de la web anterior)
assets/tienda/js/datos.js      Datos de la tienda (teléfono, correos, horario, envíos) y CATÁLOGO completo
assets/tienda/js/              Resto de la tienda: cabecera, cesta, fichas, pedido, ilustraciones, animaciones…
assets/tienda/js/buscador-flotante.js   Buscador en ventana flotante
assets/tienda/js/pago.js       Pasarela de pago (PayPal); se configura en assets/js/pago-config.js
aviso-legal/ privacidad/ cookies/ condiciones-de-venta/ envios-y-devoluciones/ accesibilidad/   Textos legales
merceria/ complementos/ capsulas/ pedido/   Redirecciones de las direcciones antiguas a la tienda
docs/generar.py                Genera los textos legales, el 404 y las redirecciones
```

## Cambiar cosas

- **Productos, precios, colores, tallas y stock**: `assets/tienda/js/datos.js`.
- **Teléfono, correos, horario, envío y festivos**: objeto `TIENDA` al principio de `assets/tienda/js/datos.js`.
- **Pago con tarjeta**: ver [docs/pagos.md](docs/pagos.md).
- **Textos legales**: edita `docs/generar.py` y ejecuta `python3 docs/generar.py`.

## Ver la web en local

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
