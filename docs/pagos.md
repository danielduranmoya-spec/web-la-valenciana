# Pagos con tarjeta (PayPal)

La web cobra con PayPal, que funciona en una web estática como GitHub Pages sin servidor propio. El cliente puede pagar con **tarjeta de débito o crédito sin tener cuenta de PayPal**, o con su cuenta de PayPal.

## Ahora mismo: modo de prueba
`assets/js/pago-config.js` tiene `clientId: 'sb'` y `prueba: true`. Los pagos son simulados (no se cobra) y la página de pedido muestra un aviso amarillo.

## Para cobrar de verdad
1. Crea una cuenta **PayPal Business** (gratis) a nombre del negocio y verifica la cuenta bancaria.
2. Entra en https://developer.paypal.com → *Apps & Credentials* → pestaña **Live** → *Create App*.
3. Copia el **Client ID** (es público). **No** copies nunca el *Secret*.
4. En `assets/js/pago-config.js` pon ese Client ID en `clientId` y cambia `prueba` a `false`.
5. Completa el titular y el NIF en `docs/generar.py` (aviso legal, privacidad y condiciones de venta) y ejecuta `python3 docs/generar.py`.

## Cuando entra un pedido
- PayPal envía un correo a la tienda con: número de pedido (LV-…), productos, cantidades, importe, y en la descripción el nombre y teléfono del cliente; el correo del cliente y sus indicaciones van en el campo «custom».
- **Comprueba siempre en PayPal que el importe cobrado coincide con los productos** antes de entregar (el cálculo se hace en el navegador).
- Prepara el pedido y avisa al cliente para que lo recoja.
- Devoluciones: desde PayPal → actividad → reembolsar.

## Comisiones
PayPal cobra una comisión por venta (consulta la tarifa vigente para comercios en España en paypal.com/es/webapps/mpp/merchant-fees).
