# Pagos con tarjeta (PayPal)

La web cobra con PayPal, que funciona en una web estática como GitHub Pages sin servidor propio. El cliente puede pagar con **tarjeta de débito o crédito sin tener cuenta de PayPal**, o con su cuenta de PayPal.

## Ahora mismo: modo de prueba
`assets/js/pago-config.js` tiene `clientId: 'sb'` y `prueba: true`. Los pagos son simulados (no se cobra) y la página del pedido avisa de que está en modo de prueba.

## Para cobrar de verdad
1. Crea una cuenta **PayPal Business** (gratis) a nombre del negocio y verifica la cuenta bancaria.
2. Entra en https://developer.paypal.com → *Apps & Credentials* → pestaña **Live** → *Create App*.
3. Copia el **Client ID** (es público). **No** copies nunca el *Secret*.
4. En `assets/js/pago-config.js` pon ese Client ID en `clientId` y cambia `prueba` a `false`.
5. Completa el titular y el NIF en `docs/generar.py` (aviso legal, privacidad y condiciones de venta) y ejecuta `python3 docs/generar.py`.

En la web, el cliente elige «Tarjeta o PayPal, ahora» en el paso 3 del pedido (#/pedido), pulsa «Pagar con tarjeta» y le aparecen los botones de PayPal. El código está en `assets/tienda/js/pago.js`.

## Cómo funciona el cobro (autorizar y después cobrar)
La web **no cobra al momento**: al pagar con tarjeta o PayPal solo se *autoriza* (reserva) el importe. Así podéis comprobar que tenéis todo antes de cobrar.
1. Entra en PayPal → *Actividad*. El pedido aparece como **«Autorizado»** (o «Pendiente»).
2. Comprueba stock y que el importe coincide con los productos.
3. Si está todo: abre el pago y pulsa **«Cobrar»** (Capture). Hazlo en los **3 días** siguientes; la autorización caduca a los 29 días.
4. Si falta algo: avisa al cliente por WhatsApp. Puedes cobrar solo una parte (cobro parcial) o **anular** la autorización y no se cobra nada.

## Bizum
Si el cliente envía el pedido por WhatsApp o por correo, comprobáis el stock, le confirmáis el total y paga al recoger o por Bizum. Entregad o enviad el pedido cuando llegue el pago.

## Envíos
Precio y umbral en `TIENDA` de `assets/tienda/js/datos.js`: `envio` (4,95 €), `envioGratis` (50 €) y `plazoEnvio`. Solo Península (los CP de Baleares, Canarias, Ceuta y Melilla se rechazan). La dirección llega en el detalle del pago de PayPal.

## Stock
El estado de cada producto se edita en el catálogo de `assets/tienda/js/datos.js` (campo `stock`).

## Cuando entra un pedido
- PayPal envía un correo a la tienda con: número de pedido (LV-…), productos, cantidades, importe, dirección de envío si la hay, y en la descripción el nombre y teléfono del cliente; el correo del cliente y sus notas van en el campo «custom». Cada artículo lleva su color o medida en la descripción.
- **Comprueba siempre en PayPal que el importe cobrado coincide con los productos** antes de entregar (el cálculo se hace en el navegador).
- Prepara el pedido y avisa al cliente para que lo recoja.
- Devoluciones: desde PayPal → actividad → reembolsar.

## Comisiones
PayPal cobra una comisión por venta (consulta la tarifa vigente para comercios en España en paypal.com/es/webapps/mpp/merchant-fees).
