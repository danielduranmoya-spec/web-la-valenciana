/* Configuración de la pasarela de pago (PayPal: tarjeta de débito/crédito y PayPal).
   Para cobrar de verdad:
   1. Crea una cuenta PayPal Business y en developer.paypal.com > Apps & Credentials (modo «Live») copia el «Client ID».
   2. Pégalo abajo en clientId y cambia prueba a false.
   El Client ID es público: se puede guardar aquí sin riesgo. NUNCA pongas aquí el «Secret». */
window.LV_PAGO = {
  clientId: 'sb',   // 'sb' = cuenta de pruebas de PayPal (no cobra)
  prueba: true,     // true muestra el aviso «Modo de prueba»
  moneda: 'EUR'
};
