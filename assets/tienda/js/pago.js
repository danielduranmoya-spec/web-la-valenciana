/* =========================================================
   LA VALENCIANA · pago.js
   Pasarela de pago con PayPal (tarjeta de débito o crédito sin cuenta,
   o cuenta de PayPal). Funciona en una web estática: no hay servidor.
   Solo AUTORIZA (reserva) el importe; la tienda lo cobra desde PayPal
   cuando comprueba que tiene todo (ver docs/pagos.md).
   Configuración: assets/js/pago-config.js (window.LV_PAGO).
   API: LV.pago.cargar() → Promise<paypal>
        LV.pago.botones(paypal, contenedor, {validar, datos, decir, hecho})
   ========================================================= */
window.LV = window.LV || {};
LV.pago = (() => {
"use strict";
const cfg = () => window.LV_PAGO || {};
let promesa = null;

function cargar(){
  if (window.paypal && window.paypal.Buttons) return Promise.resolve(window.paypal);
  if (promesa) return promesa;
  const c = cfg();
  if (!c.clientId) return Promise.reject(new Error("Falta clientId en pago-config.js"));
  promesa = new Promise((ok, mal) => {
    const sc = document.createElement("script");
    sc.src = "https://www.paypal.com/sdk/js?client-id=" + encodeURIComponent(c.clientId) +
      "&currency=" + (c.moneda || "EUR") +
      "&intent=authorize&components=buttons&enable-funding=card&disable-funding=paylater,sepa,credit&locale=es_ES";
    sc.setAttribute("data-namespace", "paypal");
    sc.onload = () => window.paypal && window.paypal.Buttons ? ok(window.paypal) : mal(new Error("SDK sin Buttons"));
    sc.onerror = () => { promesa = null; sc.remove(); mal(new Error("No carga el SDK de PayPal")); };
    document.head.appendChild(sc);
  });
  return promesa;
}

const cent = n => Math.round((+n || 0) * 100);
const dec = c => (c / 100).toFixed(2);
const corta = (s, n = 127) => String(s || "").slice(0, n);
function referencia(){
  const d = new Date();
  return "LV-" + String(d.getFullYear()).slice(2) + ("0" + (d.getMonth() + 1)).slice(-2) + ("0" + d.getDate()).slice(-2) + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
}

/** Artículos para PayPal: cantidades enteras; lo que va por metros, como 1 unidad con el importe. */
function articulos(){
  return LV.tienda.lista().map(l => {
    const imp = cent(l.importe), q = +l.q;
    const nombre = l.prod.nombre.replace(/\s*\(metro\)$/i, "");
    let quantity = 1, unit = imp, name = nombre;
    if (!l.prod.porMetro && Number.isInteger(q) && q > 0 && imp % q === 0) { quantity = q; unit = imp / q; }
    else name = `${LV.util.num(q)} ${l.prod.porMetro ? "m" : "×"} ${nombre}`;
    return { name: corta(name), description: corta(l.textoVersion || ""), sku: corta(l.id), quantity: String(quantity),
      category: "PHYSICAL_GOODS", unit_amount: { currency_code: cfg().moneda || "EUR", value: dec(unit) }, _c: unit * quantity };
  });
}

function botones(paypal, cont, { validar, datos, decir, hecho }){
  let ref = null;
  const mon = () => cfg().moneda || "EUR";
  return paypal.Buttons({
    style: { layout: "vertical", shape: "pill", color: "black", label: "pay", height: 52, tagline: false },
    onClick: (d, a) => {
      if (!validar()) { decir("Antes de pagar, complete sus datos.", true); return a.reject(); }
      decir(""); return a.resolve();
    },
    createOrder: (d, a) => {
      const dt = datos(), casa = dt.entrega === "casa";
      const items = articulos();
      const sub = items.reduce((s, i) => s + i._c, 0);
      const env = casa ? cent(LV.tienda.envio("casa")) : 0;
      items.forEach(i => delete i._c);
      ref = referencia();
      const desglose = { item_total: { currency_code: mon(), value: dec(sub) } };
      if (casa) desglose.shipping = { currency_code: mon(), value: dec(env) };
      const unidad = {
        reference_id: ref, invoice_id: ref,
        description: corta(`${casa ? "Envío" : "Recogida en tienda"} · ${dt.nombre} · ${dt.tel}`),
        custom_id: corta([dt.email, dt.notas].filter(Boolean).join(" | ")),
        amount: { currency_code: mon(), value: dec(sub + env), breakdown: desglose },
        items
      };
      if (casa) unidad.shipping = { name: { full_name: corta(dt.nombre, 300) },
        address: { address_line_1: corta(dt.dir, 300), admin_area_2: corta(dt.loc, 120), postal_code: dt.cp, country_code: "ES" } };
      return a.order.create({
        intent: "AUTHORIZE",
        purchase_units: [unidad],
        application_context: { brand_name: "La Valenciana", locale: "es-ES", shipping_preference: casa ? "SET_PROVIDED_ADDRESS" : "NO_SHIPPING", user_action: "CONTINUE" }
      });
    },
    onApprove: (d, a) => {
      decir("Confirmando el pago…");
      return a.order.authorize().then(det => {
        const pu = det && det.purchase_units && det.purchase_units[0];
        const au = pu && pu.payments && pu.payments.authorizations && pu.payments.authorizations[0];
        if (!(det.status === "COMPLETED" || (au && (au.status === "CREATED" || au.status === "PENDING")))) {
          decir("El pago no se ha completado. No se ha cobrado nada; inténtelo de nuevo.", true); return;
        }
        hecho(datos(), { ref: ref || det.id, id: det.id });
      });
    },
    onCancel: () => decir("Ha cancelado el pago. No se ha cobrado nada y su cesta sigue guardada."),
    onError: () => decir("Ha habido un problema con el pago y no se ha cobrado nada. Inténtelo otra vez o envíenos el pedido por WhatsApp.", true)
  }).render(cont);
}

return { cargar, botones };
})();
