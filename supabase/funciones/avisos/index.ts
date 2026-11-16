// La Valenciana · función «avisos» (Supabase Edge Function)
// Envía un correo cuando entra un pedido o cuando un producto baja de su mínimo.
// La llama la propia base de datos (ver supabase/actualizar-2.sql) con solo la referencia
// del pedido o el id del producto: la función lee los datos reales, y nunca avisa dos veces
// de lo mismo, así que nadie puede usarla para enviar correos inventados.
//
// Instalación (una vez): Supabase → Edge Functions → Deploy a new function → Via Editor,
// nombre «avisos», pegar este archivo entero y desplegar. Después, en los ajustes de la función,
// desactivar «Verify JWT». En Edge Functions → Secrets, añadir BREVO_API_KEY (de brevo.com → SMTP & API → API Keys).
// También funciona con Resend: en lugar de BREVO_API_KEY, poner RESEND_API_KEY.

import { createClient } from "jsr:@supabase/supabase-js@2";

const PANEL = "https://danielduranmoya-spec.github.io/web-la-valenciana/trastienda/";
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });

const responder = (estado: number, datos: unknown) =>
  new Response(JSON.stringify(datos), { status: estado, headers: { ...CORS, "Content-Type": "application/json" } });
const esc = (s: unknown) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
const euros = (n: unknown) => Number(n || 0).toLocaleString("es-ES", { style: "currency", currency: "EUR" });
const CANAL: Record<string, string> = { tarjeta: "Tarjeta (PayPal, pago reservado: hay que cobrarlo)", whatsapp: "WhatsApp", correo: "Correo", tienda: "En la tienda" };

async function ajustes() {
  const { data } = await db.from("ajustes").select("clave,valor").in("clave", ["avisos", "contacto"]);
  const a = Object.fromEntries((data || []).map((f) => [f.clave, f.valor]));
  const av = a.avisos || {};
  return { correo: av.correo || a.contacto?.correo, remitente: av.remitente || "", pedidos: av.pedidos !== false, stock: av.stock !== false };
}

async function enviar(para: string, asunto: string, cuerpo: string, remitente: string) {
  const brevo = Deno.env.get("BREVO_API_KEY"), resend = Deno.env.get("RESEND_API_KEY");
  if (!brevo && !resend) throw new Error("Falta el secreto BREVO_API_KEY");
  const destinos = para.split(/[,;\s]+/).filter(Boolean);
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#2b2420;max-width:560px">${cuerpo}
    <p style="margin-top:24px"><a href="${PANEL}" style="background:#6b4a2f;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">Abrir la Trastienda</a></p>
    <p style="color:#8a7d72;font-size:12px;margin-top:24px">Aviso automático de la web de La Valenciana. Se cambia en la Trastienda → Ajustes → Avisos por correo.</p></div>`;
  if (brevo) {
    // Brevo: el remitente debe ser un correo verificado en Brevo (el de la cuenta lo está). Por defecto, el primer destinatario.
    const r = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": brevo, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ sender: { name: "La Valenciana", email: remitente || destinos[0] }, to: destinos.map((email) => ({ email })), subject: asunto, htmlContent: html }),
    });
    if (!r.ok) throw new Error(`Brevo ${r.status}: ${await r.text()}`);
    return;
  }
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resend}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: remitente ? `La Valenciana <${remitente}>` : "La Valenciana <onboarding@resend.dev>", to: destinos, subject: asunto, html }),
  });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${await r.text()}`);
}

async function avisoPedido(ref: string) {
  const cfg = await ajustes();
  if (!cfg.pedidos || !cfg.correo) return "avisos de pedidos desactivados";
  const hace = new Date(Date.now() - 15 * 60e3).toISOString();
  // se marca como avisado a la vez que se lee: si llega dos veces, solo se envía una
  const { data: p } = await db.from("pedidos").update({ avisado: true }).eq("ref", ref).eq("avisado", false).gt("creado", hace).select().maybeSingle();
  if (!p) return "nada que avisar";
  const lineas = (p.lineas || []).map((l: any) =>
    `<tr><td style="padding:4px 8px 4px 0">${esc(l.q)} ×</td><td style="padding:4px 8px">${esc(l.nombre)}${l.version ? ` <span style="color:#8a7d72">(${esc(l.version)})</span>` : ""}</td><td style="padding:4px 0;text-align:right">${euros(l.precio * l.q)}</td></tr>`).join("");
  const entrega = p.entrega === "casa" ? `Envío a casa: ${esc(p.direccion)}, ${esc(p.cp)} ${esc(p.localidad)}` : "Recoge en la tienda";
  const cuerpo = `<h2 style="margin:0 0 4px">Pedido nuevo ${esc(p.ref)}</h2>
    <p style="margin:0 0 16px;color:#6b4a2f"><b>${euros(p.total)}</b> · ${esc(CANAL[p.canal] || p.canal)}</p>
    <p style="margin:0"><b>${esc(p.cliente)}</b>${p.tel ? ` · ${esc(p.tel)}` : ""}${p.email ? ` · ${esc(p.email)}` : ""}</p>
    <p style="margin:4px 0 16px">${entrega}</p>
    <table style="border-collapse:collapse;width:100%">${lineas}</table>
    <p style="margin:12px 0 0;text-align:right">Productos ${euros(p.subtotal)}${+p.descuento ? ` · Descuento${p.codigo ? ` (${esc(p.codigo)})` : ""} −${euros(p.descuento)}` : ""} · Envío ${euros(p.envio)}<br><b>Total ${euros(p.total)}</b></p>
    ${p.notas ? `<p style="margin-top:16px"><b>Notas:</b> ${esc(p.notas)}</p>` : ""}`;
  await enviar(cfg.correo, `Pedido nuevo ${p.ref} · ${euros(p.total)} · ${p.cliente}`, cuerpo, cfg.remitente);
  return "enviado";
}

async function avisoStock(id: string) {
  const cfg = await ajustes();
  if (!cfg.stock || !cfg.correo) return "avisos de stock desactivados";
  const { data: p } = await db.from("productos").select("id,nombre,uds,umbral,por_metro,aviso_stock").eq("id", id).maybeSingle();
  if (!p || +p.uds > +p.umbral) return "nada que avisar";
  // como mucho un aviso cada 12 horas por producto
  if (p.aviso_stock && Date.now() - Date.parse(p.aviso_stock) < 12 * 3600e3 && +p.uds > 0) return "ya avisado";
  await db.from("productos").update({ aviso_stock: new Date().toISOString() }).eq("id", id);
  const ud = p.por_metro ? "m" : "uds.";
  const agotado = +p.uds <= 0;
  const cuerpo = `<h2 style="margin:0 0 8px">${agotado ? "Agotado" : "Quedan pocas"}: ${esc(p.nombre)}</h2>
    <p style="margin:0">${agotado ? "Ya no queda ninguna y la web lo muestra como agotado." : `Quedan <b>${esc(+p.uds)} ${ud}</b> (el mínimo es ${esc(+p.umbral)}).`}</p>
    <p style="margin:8px 0 0">Cuando reponga, cambie el stock en la Trastienda → Stock.</p>`;
  await enviar(cfg.correo, `${agotado ? "Agotado" : "Stock bajo"}: ${p.nombre}`, cuerpo, cfg.remitente);
  return "enviado";
}

async function avisoPrueba(req: Request) {
  // solo alguien de la administración, con su sesión del panel
  const token = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  const { data: u } = await db.auth.getUser(token);
  if (!u?.user) return null;
  const { data: a } = await db.from("admins").select("rol").eq("user_id", u.user.id).maybeSingle();
  if (a?.rol !== "admin") return null;
  const cfg = await ajustes();
  if (!cfg.correo) throw new Error("No hay correo de avisos");
  await enviar(cfg.correo, "Prueba de avisos de La Valenciana", `<h2 style="margin:0 0 8px">¡Los avisos funcionan!</h2>
    <p>A partir de ahora llegará aquí un correo con cada pedido nuevo${cfg.stock ? " y cuando un producto se esté acabando" : ""}.</p>`, cfg.remitente);
  return cfg.correo;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return responder(405, { error: "Solo POST" });
  try {
    const b = await req.json().catch(() => ({}));
    if (b.tipo === "pedido" && typeof b.ref === "string") return responder(200, { ok: await avisoPedido(b.ref) });
    if (b.tipo === "stock" && typeof b.id === "string") return responder(200, { ok: await avisoStock(b.id) });
    if (b.tipo === "prueba") {
      const r = await avisoPrueba(req);
      return r ? responder(200, { ok: r }) : responder(403, { error: "Solo la administración puede enviar la prueba" });
    }
    return responder(400, { error: "Petición no válida" });
  } catch (e) {
    console.error(e);
    return responder(500, { error: String((e as Error).message || e) });
  }
});
