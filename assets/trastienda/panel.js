/* =========================================================
   LA VALENCIANA · Trastienda (panel de administración)
   Datos en Supabase (assets/js/supabase-config.js). Permisos en supabase/instalar.sql:
   solo las personas de la tabla «admins» pueden leer y cambiar nada.
   ========================================================= */
(() => {
"use strict";
/* ---------- utilidades ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const eur = n => (Math.round((+n || 0) * 100) / 100).toLocaleString("es-ES", { style: "currency", currency: "EUR" });
const nfmt = n => (+n || 0).toLocaleString("es-ES");
const DIA = 864e5;
const hoy0 = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); };
const fCorta = t => new Date(t).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
const fLarga = t => new Date(t).toLocaleString("es-ES", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
const hace = t => { const m = Math.round((Date.now() - t) / 6e4); if (m < 1) return "ahora mismo"; if (m < 60) return `hace ${m} min`; const h = Math.round(m / 60); if (h < 24) return `hace ${h} h`; const d = Math.round(h / 24); return d === 1 ? "ayer" : `hace ${d} días`; };
const leerNum = v => parseFloat(String(v).replace(",", "."));
const coma = n => String(+n).replace(".", ",");
const slug = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const iniciales = n => String(n || "?").split(/\s+/).map(x => x[0] || "").join("").slice(0, 2).toUpperCase();
const COL = (window.LV && LV.datos && LV.datos.COL) || {};
const ICONOS_POR_SUB = {}; ((window.LV && LV.datos && LV.datos.PRODUCTOS) || []).forEach(p => { ICONOS_POR_SUB[p.sub] = ICONOS_POR_SUB[p.sub] || p.icono; });

const SVG = {
  resumen: '<path d="M3 13h8V3H3zM13 21h8V11h-8zM3 21h8v-6H3zM13 3v6h8V3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
  pedidos: '<path d="M6 7h12l-1 13H7L6 7zM9 7a3 3 0 016 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
  productos: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
  stock: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  ofertas: '<path d="M3 12V4h8l10 10-8 8L3 12z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="7.5" cy="8.5" r="1.5" fill="currentColor"/>',
  categorias: '<path d="M4 6h16M4 12h16M4 18h10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  clientes: '<circle cx="9" cy="8" r="3.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5M16 4.5a3.5 3.5 0 010 7M18 14.5c1.9.7 3.1 2.5 3.5 5.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  ajustes: '<circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1L7 17M17 7l2.1-2.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  registro: '<path d="M12 7v5l3 2M21 12a9 9 0 11-3-6.7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  mas: '<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  editar: '<path d="M4 20h4L19 9l-4-4L4 16v4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
  copiar: '<rect x="8" y="8" width="12" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M16 8V5a1 1 0 00-1-1H5a1 1 0 00-1 1v10a1 1 0 001 1h3" fill="none" stroke="currentColor" stroke-width="1.8"/>',
  borrar: '<path d="M4 7h16M10 7V4h4v3M6 7l1 13h10l1-13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
  cerrar: '<path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  recargar: '<path d="M20 11a8 8 0 10-2.3 5.7M20 4v7h-7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'
};
const ic = n => `<svg viewBox="0 0 24 24" aria-hidden="true">${SVG[n]}</svg>`;

/* ---------- conexión ---------- */
const cfg = window.LV_DB || {};
const sb = window.supabase.createClient(cfg.url, cfg.clave, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
let YO = { nombre: "", rol: "consulta" };

/* ---------- estado ---------- */
const S = { productos: [], pedidos: [], movs: [], registro: [], codigos: [], ajustes: {}, admins: [], cats: [] };
let PID = {}, subN = {}, catN = {};

const aProd = r => ({ id: r.id, cat: r.cat, sub: r.sub, n: r.nombre, precio: +r.precio, coste: r.coste == null ? 0 : +r.coste,
  var: (r.variantes || []).map(v => v.n), _var: r.variantes || [], med: r.medidas || [], porMetro: !!r.por_metro, uds: +r.uds, umbral: +r.umbral,
  visible: !!r.visible, dest: !!r.destacado, nov: !!r.novedad, desc: r.descripcion || "", oferta: r.oferta || null, icono: r.icono, orden: r.orden || 0, _fila: r });
const aPed = r => ({ ref: r.ref, t: Date.parse(r.creado), cli: r.cliente, tel: r.tel || "—", email: r.email || "—",
  loc: r.entrega === "casa" ? [r.direccion, [r.cp, r.localidad].filter(Boolean).join(" ")].filter(Boolean).join(", ") || "Envío" : (r.canal === "tienda" ? "Mostrador" : "Recoge en tienda"),
  localidad: r.localidad || "", canal: r.canal, entrega: r.entrega, lineas: (r.lineas || []).map(l => ({ id: l.id, n: l.nombre, ver: l.version || "", q: +l.q, precio: +l.precio })),
  sub: +r.subtotal, envio: +r.envio, descuento: +r.descuento || 0, codigo: r.codigo, total: +r.total, estado: r.estado, notas: r.notas || "", interna: r.nota_interna || "", paypal: r.paypal_id });

async function cargar(){
  const q = (t, f) => f(sb.from(t)).then(({ data, error }) => { if (error) throw error; return data; });
  const [prods, peds, movs, reg, cods, ajs, adms, cats, subs] = await Promise.all([
    q("productos", t => t.select("*").order("orden")),
    q("pedidos", t => t.select("*").order("creado", { ascending: false }).limit(2000)),
    q("movimientos", t => t.select("*").order("t", { ascending: false }).limit(150)),
    q("registro", t => t.select("*").order("t", { ascending: false }).limit(300)),
    q("codigos", t => t.select("*").order("codigo")),
    q("ajustes", t => t.select("*")),
    q("admins", t => t.select("*")),
    q("categorias", t => t.select("*").order("orden")),
    q("subcategorias", t => t.select("*").order("orden"))
  ]);
  S.productos = prods.map(aProd); PID = Object.fromEntries(S.productos.map(p => [p.id, p]));
  S.pedidos = peds.map(aPed);
  S.movs = movs.map(m => ({ t: Date.parse(m.t), id: m.producto, q: +m.cantidad, motivo: m.motivo || "", quien: m.quien || "" }));
  S.registro = reg.map(r => ({ t: Date.parse(r.t), quien: r.quien || "", txt: r.texto }));
  S.codigos = cods.map(c => ({ cod: c.codigo, tipo: c.tipo, valor: +c.valor, usos: c.usos, activo: c.activo, hasta: c.hasta }));
  S.ajustes = Object.fromEntries(ajs.map(a => [a.clave, a.valor]));
  S.admins = adms;
  S.cats = cats.map(c => ({ id: c.id, n: c.nombre, subs: subs.filter(s => s.cat === c.id).map(s => ({ id: s.id, n: s.nombre, orden: s.orden })) }));
  subN = Object.fromEntries(subs.map(s => [s.id, s.nombre])); catN = Object.fromEntries(cats.map(c => [c.id, c.nombre]));
}

/** Ejecuta un cambio en la base de datos. Si falla, avisa y recarga los datos reales. */
async function bd(promesa, okTxt, deshacer){
  try {
    const r = await promesa;
    if (r && r.error) throw r.error;
    if (okTxt) tostada(okTxt, deshacer);
    return r;
  } catch (e) {
    console.error(e);
    const m = String(e.message || e);
    tostada(/permission|policy|row-level/i.test(m) ? "No tiene permiso para este cambio." : /JWT|token|session/i.test(m) ? "La sesión ha caducado. Vuelva a entrar." : "No se ha podido guardar: " + m);
    try { await cargar(); } catch (x) {}
    pintar();
    throw e;
  }
}
const registrar = texto => { S.registro.unshift({ t: Date.now(), quien: YO.nombre, txt: texto }); return sb.from("registro").insert({ quien: YO.nombre, texto }).then(() => {}); };
const movimiento = (id, q, motivo) => { S.movs.unshift({ t: Date.now(), id, q, motivo, quien: YO.nombre }); return sb.from("movimientos").insert({ producto: id, cantidad: q, motivo, quien: YO.nombre }).then(() => {}); };
const actProd = (id, campos) => sb.from("productos").update(campos).eq("id", id);

/* ---------- avisos ---------- */
let tTost;
function tostada(txt, deshacer){
  const el = $("#tost");
  el.innerHTML = `<div class="tostada" role="status"><span>${esc(txt)}</span>${deshacer ? '<button type="button" id="desh">Deshacer</button>' : ""}</div>`;
  if (deshacer) $("#desh").onclick = async () => { el.innerHTML = ""; try { await deshacer(); } catch (e) {} pintar(); };
  clearTimeout(tTost); tTost = setTimeout(() => el.innerHTML = "", deshacer ? 7000 : 3600);
}

/* ---------- acceso ---------- */
function pantallaAcceso(modo = "entrar", msg = ""){
  const nueva = modo === "nueva";
  $("#raiz").innerHTML = `<div class="acceso"><form id="facc" novalidate>
    <div class="marca"><b>La Valenciana</b><span>Trastienda</span></div>
    ${nueva ? `<p style="margin:0">Escriba su nueva contraseña.</p>
      <label class="c">Nueva contraseña<input class="campo" id="acp" type="password" autocomplete="new-password" minlength="8" required></label>`
    : `<label class="c">Correo<input class="campo" id="acc" type="email" autocomplete="username" required></label>
      <label class="c">Contraseña<input class="campo" id="acp" type="password" autocomplete="current-password" required></label>`}
    <p class="error" id="aerr" role="alert">${esc(msg)}</p>
    <button class="btn prin" type="submit">${nueva ? "Guardar contraseña" : "Entrar"}</button>
    ${nueva ? "" : '<button class="enlace" type="button" id="olv">He olvidado la contraseña</button>'}
  </form></div>`;
  const err = t => $("#aerr").textContent = t;
  $("#facc").onsubmit = async e => {
    e.preventDefault(); err("");
    const pass = $("#acp").value;
    if (nueva) {
      if (pass.length < 8) return err("Use al menos 8 caracteres.");
      const { error } = await sb.auth.updateUser({ password: pass });
      if (error) return err("No se ha podido cambiar: " + error.message);
      history.replaceState(null, "", location.pathname); return entrar();
    }
    const correo = $("#acc").value.trim();
    if (!correo || !pass) return err("Escriba su correo y su contraseña.");
    const { error } = await sb.auth.signInWithPassword({ email: correo, password: pass });
    if (error) return err(/invalid/i.test(error.message) ? "El correo o la contraseña no son correctos." : error.message);
    entrar();
  };
  const o = $("#olv"); if (o) o.onclick = async () => {
    const correo = $("#acc").value.trim();
    if (!correo) return err("Escriba primero su correo y vuelva a pulsar.");
    const { error } = await sb.auth.resetPasswordForEmail(correo, { redirectTo: location.origin + location.pathname });
    err(""); $("#aerr").style.color = "var(--exito)";
    $("#aerr").textContent = error ? "No se ha podido enviar: " + error.message : "Le hemos enviado un correo con un enlace para poner una contraseña nueva.";
  };
  const pri = $("#facc input"); pri && pri.focus();
}
sb.auth.onAuthStateChange(ev => { if (ev === "PASSWORD_RECOVERY") pantallaAcceso("nueva"); });

async function entrar(){
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return pantallaAcceso();
  if (/type=recovery/.test(location.hash)) return pantallaAcceso("nueva");
  $("#raiz").innerHTML = '<p class="cargando">Cargando los datos de la tienda…</p>';
  const { data: yo } = await sb.from("admins").select("*").eq("user_id", session.user.id).maybeSingle();
  if (!yo) { await sb.auth.signOut(); return pantallaAcceso("entrar", "Esta cuenta no tiene permiso para entrar en la trastienda. Pida acceso a la administradora."); }
  YO = { nombre: yo.nombre || session.user.email.split("@")[0], rol: yo.rol, correo: session.user.email };
  try { await cargar(); }
  catch (e) { console.error(e); $("#raiz").innerHTML = `<p class="cargando">No se han podido cargar los datos (${esc(e.message)}). Compruebe la conexión y recargue la página.</p>`; return; }
  montarApp(); ir();
  // pedidos nuevos: cada minuto y al volver a la pestaña
  setInterval(refrescarPedidos, 60000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) refrescarPedidos(); });
}
async function refrescarPedidos(){
  if (document.hidden || $("#capa").innerHTML) return;
  const { data, error } = await sb.from("pedidos").select("*").order("creado", { ascending: false }).limit(2000);
  if (error || !data) return;
  const antes = S.pedidos.length; S.pedidos = data.map(aPed);
  const { data: pr } = await sb.from("productos").select("*").order("orden");
  if (pr) { S.productos = pr.map(aProd); PID = Object.fromEntries(S.productos.map(p => [p.id, p])); }
  if (document.activeElement && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { nav(); return; }
  pintar();
  if (S.pedidos.length > antes) tostada(S.pedidos.length - antes === 1 ? "Ha entrado un pedido nuevo" : `Han entrado ${S.pedidos.length - antes} pedidos nuevos`);
}

/* ---------- estructura ---------- */
const VISTAS = [["resumen", "Resumen"], ["pedidos", "Pedidos"], ["productos", "Productos"], ["stock", "Stock"], ["ofertas", "Ofertas y códigos"],
  ["categorias", "Secciones"], ["clientes", "Clientes"], ["ajustes", "Ajustes de la tienda"], ["registro", "Registro de cambios"]];
const ROL = { admin: "Administración", pedidos: "Pedidos y stock", consulta: "Solo consultar" };
function montarApp(){
  $("#raiz").innerHTML = `<div class="app"><aside class="lado"><div class="marca"><b>La Valenciana</b><span>Trastienda</span></div>
    <nav class="nav" id="nav" aria-label="Secciones del panel"></nav>
    <div class="pie"><div class="yo"><span class="av">${esc(iniciales(YO.nombre))}</span><div><b>${esc(YO.nombre)}</b><br>${esc(ROL[YO.rol] || YO.rol)}</div></div>
    <a href="../" target="_blank" rel="noopener" style="color:var(--acento)">Ver la tienda</a><button class="salir" type="button" id="salir">Cerrar sesión</button></div></aside>
    <main><div id="vista"></div><p class="salir-movil"><a href="../" target="_blank" rel="noopener">Ver la tienda</a> · <button class="salir" type="button" id="salir2">Cerrar sesión</button></p></main></div>`;
  const salir = async () => { await sb.auth.signOut(); location.hash = ""; pantallaAcceso(); };
  $("#salir").onclick = salir; $("#salir2").onclick = salir;
}
const pendientes = () => S.pedidos.filter(p => ["cobrar", "preparar", "recoger"].includes(p.estado)).length;
const estadoStock = p => !p.visible ? { n: "Oculto", c: "p-ne" } : p.uds <= 0 ? { n: "Agotado", c: "p-er" } : p.uds <= p.umbral ? { n: "Quedan pocas", c: "p-av" } : { n: "Disponible", c: "p-ok" };
const bajos = () => S.productos.filter(p => p.visible && p.uds <= p.umbral).sort((a, b) => a.uds - b.uds);
let actual = "resumen";
function nav(){
  const n = $("#nav"); if (!n) return;
  n.innerHTML = VISTAS.map(([id, t]) => {
    const c = id === "pedidos" ? pendientes() : id === "stock" ? bajos().length : 0;
    return `<a href="#${id}" ${id === actual ? 'aria-current="page"' : ""}>${ic(id)}<span>${t}</span>${c ? `<span class="cnt">${c}</span>` : ""}</a>`;
  }).join("");
}
function ir(){ const h = location.hash.slice(1); actual = VISTAS.some(v => v[0] === h) ? h : "resumen"; cerrarCajon(); pintar(); window.scrollTo(0, 0); }
window.addEventListener("hashchange", () => { if ($("#vista")) ir(); });
function pintar(){ if (!$("#vista")) return; nav(); $("#vista").innerHTML = V[actual](); enlazar[actual] && enlazar[actual](); }
const cab = (t, s, botones = "") => `<div class="cab"><div><h1>${t}</h1>${s ? `<p class="sub">${s}</p>` : ""}</div><div class="acciones">${botones}<button class="btn pq recargar" type="button" data-recargar>${ic("recargar")}Actualizar</button></div></div>`;
document.addEventListener("click", async e => { if (e.target.closest("[data-recargar]")) { try { await cargar(); pintar(); tostada("Datos actualizados"); } catch (x) { tostada("No se han podido actualizar los datos"); } } });
const buscarEn = (id, clave) => { const b = $(id); if (!b) return; b.oninput = () => { F[clave].q = b.value; const pos = b.selectionStart; pintar(); const n = $(id); n.focus(); n.setSelectionRange(pos, pos); }; };

const F = { pedidos: { estado: "activos", q: "" }, productos: { cat: "todas", q: "", sel: new Set(), estado: "todos" }, stock: { q: "" }, clientes: { q: "" } };
const V = {}, enlazar = {};
const ESTADOS = { cobrar: { n: "Por cobrar", c: "p-av" }, preparar: { n: "Por preparar", c: "p-in" }, enviado: { n: "Enviado", c: "p-ne" }, recoger: { n: "Listo para recoger", c: "p-in" }, entregado: { n: "Entregado", c: "p-ok" }, cancelado: { n: "Cancelado", c: "p-er" } };
const CANAL = { tarjeta: "Web · tarjeta/PayPal", whatsapp: "Web · WhatsApp", correo: "Web · correo", tienda: "Mostrador" };

/* ===== RESUMEN ===== */
V.resumen = () => {
  const H0 = hoy0(), vivos = S.pedidos.filter(p => p.estado !== "cancelado");
  const suma = (a, b) => vivos.filter(p => p.t >= a && p.t < b).reduce((s, p) => s + p.total, 0);
  const cuenta = (a, b) => vivos.filter(p => p.t >= a && p.t < b).length;
  const d = new Date(H0), iniMes = new Date(d.getFullYear(), d.getMonth(), 1).getTime(), iniMesAnt = new Date(d.getFullYear(), d.getMonth() - 1, 1).getTime();
  const ahora = Date.now() + 1, mes = suma(iniMes, ahora), mesAnt = suma(iniMesAnt, iniMesAnt + (H0 - iniMes) + DIA);
  const dif = mesAnt ? Math.round((mes / mesAnt - 1) * 100) : null;
  const hoyV = suma(H0, ahora), hoyN = cuenta(H0, ahora), nPed = cuenta(iniMes, ahora), ticket = nPed ? mes / nPed : 0;
  const dias = []; for (let i = 29; i >= 0; i--) { const a = H0 - i * DIA; dias.push({ a, v: suma(a, a + DIA) }); }
  const max = Math.max(...dias.map(x => x.v)), tope = Math.ceil(max / 100) * 100 || 100;
  const W = 720, Ht = 220, ml = 50, mb = 26, mt = 10, aw = W - ml - 8, ah = Ht - mb - mt, bw = aw / 30, y = v => mt + ah - v / tope * ah;
  let g = "";
  for (let k = 0; k <= 4; k++) { const v = tope * k / 4; g += `<line class="rej" x1="${ml}" x2="${W - 8}" y1="${y(v)}" y2="${y(v)}"/><text x="${ml - 6}" y="${y(v) + 4}" text-anchor="end">${Math.round(v)} €</text>`; }
  dias.forEach((x, i) => { const h = x.v ? Math.max(2, ah - (y(x.v) - mt)) : 0; g += `<rect class="bar ${i === 29 ? "hoy" : ""}" x="${ml + i * bw + 2}" y="${mt + ah - h}" width="${bw - 4}" height="${h}" rx="3"><title>${fCorta(x.a)}: ${eur(x.v)}</title></rect>`;
    if (i % 5 === 4 || i === 29) g += `<text x="${ml + i * bw + bw / 2}" y="${Ht - 8}" text-anchor="middle">${i === 29 ? "hoy" : fCorta(x.a)}</text>`; });
  const porCat = {}, porProd = {};
  vivos.filter(p => p.t >= H0 - 29 * DIA).forEach(p => p.lineas.forEach(l => { const pr = PID[l.id]; const imp = l.q * l.precio; if (pr) porCat[pr.cat] = (porCat[pr.cat] || 0) + imp; porProd[l.id] = (porProd[l.id] || 0) + l.q; }));
  const maxC = Math.max(...Object.values(porCat), 1), top = Object.entries(porProd).filter(([id]) => PID[id]).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const pend = S.pedidos.filter(p => ["cobrar", "preparar", "recoger"].includes(p.estado)).slice(0, 6), bj = bajos().slice(0, 6);
  const hora = new Date().getHours(), saludo = hora < 14 ? "Buenos días" : hora < 21 ? "Buenas tardes" : "Buenas noches";
  return cab(`${saludo}, ${esc(YO.nombre.split(" ")[0])}`, `${new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}. Esto es lo que necesita su atención.`, `<button class="btn prin" type="button" data-nuevo>${ic("mas")}Añadir producto</button>`) + `<div class="vista">
  <div class="rejilla r4">
    <div class="kpi"><span class="et">Ventas de hoy</span><span class="v">${eur(hoyV)}</span><span class="d">${hoyN} ${hoyN === 1 ? "pedido" : "pedidos"}</span></div>
    <div class="kpi"><span class="et">Este mes</span><span class="v">${eur(mes)}</span><span class="d">${dif == null ? "Sin datos del mes pasado para comparar" : `<b class="${dif >= 0 ? "sube" : "baja"}">${dif >= 0 ? "▲" : "▼"} ${Math.abs(dif)} %</b> frente al mismo día del mes pasado`}</span></div>
    <button class="kpi" type="button" data-ir="pedidos"><span class="et">Pedidos por atender</span><span class="v">${pendientes()}</span><span class="d">Cobrar, preparar o entregar →</span></button>
    <button class="kpi" type="button" data-ir="stock"><span class="et">Stock bajo o agotado</span><span class="v">${bajos().length}</span><span class="d">Ticket medio del mes: ${eur(ticket)}</span></button>
  </div>
  <section class="bloque"><h2>Ventas de los últimos 30 días</h2><p class="mini" style="margin:-6px 0 10px">Importe de los pedidos (sin los cancelados), por día. Pase el ratón por una barra para ver la cifra.</p>
    <div style="overflow-x:auto"><svg class="graf" viewBox="0 0 ${W} ${Ht}" role="img" aria-label="Gráfico de barras de ventas diarias" style="min-width:520px">${g}</svg></div></section>
  <div class="rejilla r2">
    <section class="bloque"><h2>Pedidos por atender</h2><div class="lista">${pend.length ? pend.map(p => `<div class="fila" data-ped="${esc(p.ref)}" style="cursor:pointer"><div class="cr"><div class="prod-n">${esc(p.cli)} <span class="mini">· ${esc(p.ref)}</span></div><div class="prod-m">${hace(p.t)} · ${p.lineas.length} ${p.lineas.length === 1 ? "artículo" : "artículos"} · ${p.entrega === "casa" ? "Envío" : "Recoge en tienda"}</div></div><span class="pill ${ESTADOS[p.estado].c}">${ESTADOS[p.estado].n}</span><span class="num">${eur(p.total)}</span></div>`).join("") : '<p class="vacio">No hay pedidos pendientes.</p>'}</div></section>
    <section class="bloque"><h2>Hay que reponer</h2><div class="lista">${bj.length ? bj.map(p => `<div class="fila"><div class="cr"><div class="prod-n">${esc(p.n)}</div><div class="prod-m">${esc(subN[p.sub] || "")}</div></div><span class="pill ${estadoStock(p).c}">${coma(p.uds)} ${p.porMetro ? "m" : "uds."}</span><button class="btn pq" type="button" data-recibir="${esc(p.id)}">Recibir</button></div>`).join("") : '<p class="vacio">Todo el catálogo tiene stock suficiente.</p>'}</div></section>
  </div>
  <div class="rejilla r2">
    <section class="bloque"><h2>Ventas por sección · 30 días</h2><div class="barras-h">${S.cats.map(c => `<div class="bh"><span>${esc(c.n)}</span><span class="t"><i style="width:${(porCat[c.id] || 0) / maxC * 100}%"></i></span><span class="num" style="text-align:right">${eur(porCat[c.id] || 0)}</span></div>`).join("")}</div></section>
    <section class="bloque"><h2>Lo más vendido · 30 días</h2><div class="lista">${top.length ? top.map(([id, q], i) => `<div class="fila"><span class="av" style="background:var(--beis);color:var(--acento)">${i + 1}</span><div class="cr"><div class="prod-n">${esc(PID[id].n)}</div><div class="prod-m">${esc(catN[PID[id].cat])} · ${esc(subN[PID[id].sub] || "")}</div></div><span class="num">${nfmt(q)} ${PID[id].porMetro ? "m" : "uds."}</span></div>`).join("") : '<p class="vacio">Aún no hay ventas en los últimos 30 días.</p>'}</div></section>
  </div></div>`;
};
enlazar.resumen = () => {
  $$("[data-ir]").forEach(b => b.onclick = () => location.hash = b.dataset.ir);
  $$("[data-ped]").forEach(b => b.onclick = () => abrirPedido(b.dataset.ped));
  $$("[data-recibir]").forEach(b => b.onclick = () => abrirRecibir(b.dataset.recibir));
  const n = $("[data-nuevo]"); if (n) n.onclick = () => { location.hash = "productos"; setTimeout(() => abrirProducto(null), 0); };
};

/* ===== PEDIDOS ===== */
V.pedidos = () => {
  const f = F.pedidos;
  const grupos = { activos: ["cobrar", "preparar", "recoger"], ...Object.fromEntries(Object.keys(ESTADOS).map(k => [k, [k]])), todos: Object.keys(ESTADOS) };
  const nombres = { activos: "Por atender", todos: "Todos", ...Object.fromEntries(Object.entries(ESTADOS).map(([k, v]) => [k, v.n])) };
  const q = f.q.trim().toLowerCase();
  const lista = S.pedidos.filter(p => grupos[f.estado].includes(p.estado) && (!q || (p.ref + " " + p.cli + " " + p.loc + " " + p.tel + " " + p.email).toLowerCase().includes(q)));
  const total = lista.filter(p => p.estado !== "cancelado").reduce((s, p) => s + p.total, 0);
  return cab("Pedidos", "Los pedidos de la web entran aquí solos y descuentan el stock. Los pagos con tarjeta quedan reservados en PayPal hasta que los cobre.", `<button class="btn" type="button" id="nuevoMostrador">${ic("mas")}Anotar venta de mostrador</button>`) + `<div class="vista">
  <div class="filtros"><input class="campo buscar" id="pq" type="search" placeholder="Buscar por cliente, referencia, teléfono…" value="${esc(f.q)}" aria-label="Buscar pedidos">
  <div class="chips">${Object.keys(nombres).map(k => `<button type="button" class="chip" data-est="${k}" aria-pressed="${f.estado === k}">${nombres[k]}<span class="n">${S.pedidos.filter(p => grupos[k].includes(p.estado)).length}</span></button>`).join("")}</div></div>
  <p class="mini" style="margin:0">${lista.length} pedidos · ${eur(total)} en total</p>
  <div class="tabla-env"><table><thead><tr><th>Pedido</th><th>Cliente</th><th>Fecha</th><th>Entrega</th><th>Pago</th><th>Estado</th><th class="der">Total</th></tr></thead><tbody>
  ${lista.slice(0, 100).map(p => `<tr class="clic" data-ped="${esc(p.ref)}" tabindex="0"><td class="num">${esc(p.ref)}</td><td><div class="prod-n">${esc(p.cli)}</div><div class="prod-m">${esc(p.entrega === "casa" ? p.localidad || "Envío" : p.loc)}</div></td><td class="num">${fCorta(p.t)}<div class="prod-m">${new Date(p.t).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}</div></td><td>${p.entrega === "casa" ? "Envío" : "Recogida"}</td><td>${CANAL[p.canal] || esc(p.canal)}</td><td><span class="pill ${ESTADOS[p.estado].c}">${ESTADOS[p.estado].n}</span></td><td class="der num">${eur(p.total)}</td></tr>`).join("") || `<tr><td colspan="7" class="vacio">${S.pedidos.length ? "No hay pedidos con este filtro." : "Todavía no ha entrado ningún pedido. Aparecerán aquí en cuanto alguien compre en la web."}</td></tr>`}
  </tbody></table></div>${lista.length > 100 ? `<p class="mini">Se muestran los 100 más recientes. Use el buscador para encontrar otros.</p>` : ""}</div>`;
};
enlazar.pedidos = () => {
  buscarEn("#pq", "pedidos");
  $$("[data-est]").forEach(c => c.onclick = () => { F.pedidos.estado = c.dataset.est; pintar(); });
  $$("tr[data-ped]").forEach(r => { r.onclick = () => abrirPedido(r.dataset.ped); r.onkeydown = e => { if (e.key === "Enter") abrirPedido(r.dataset.ped); }; });
  $("#nuevoMostrador").onclick = abrirMostrador;
};
const FLUJO = { casa: ["cobrar", "preparar", "enviado", "entregado"], tienda: ["cobrar", "preparar", "recoger", "entregado"] };
function abrirPedido(ref){
  const p = S.pedidos.find(x => x.ref === ref); if (!p) return;
  const fl = FLUJO[p.entrega] || FLUJO.tienda, i = fl.indexOf(p.estado);
  const sig = p.estado === "cancelado" || p.estado === "entregado" ? null : fl[i + 1];
  const txtSig = { preparar: p.canal === "tarjeta" ? "Ya lo he cobrado en PayPal" : "Marcar como pagado", enviado: "Marcar como enviado", recoger: "Marcar: listo para recoger", entregado: "Marcar como entregado" }[sig];
  cajon(`Pedido ${p.ref}`, `
    <div class="pasos-estado">${p.estado === "cancelado" ? '<span class="ahora" style="background:var(--error)">Cancelado</span>' : fl.map((e, k) => `<span class="${k < i ? "hecho" : k === i ? "ahora" : ""}">${ESTADOS[e].n}</span>`).join("")}</div>
    ${p.canal === "tarjeta" && p.estado === "cobrar" ? `<p class="nota-pago">El importe está reservado en la tarjeta, pero aún no cobrado. Compruebe que tiene todo y cóbrelo en <a href="https://www.paypal.com/activities/" target="_blank" rel="noopener">su actividad de PayPal</a>${p.paypal ? ` (operación ${esc(p.paypal)})` : ""}. Después, pulse «Ya lo he cobrado».</p>` : ""}
    <dl class="dl"><dt>Cliente</dt><dd><b>${esc(p.cli)}</b></dd><dt>Teléfono</dt><dd class="num">${esc(p.tel)} ${p.tel !== "—" ? `<button class="icono" type="button" data-copia="${esc(p.tel)}" aria-label="Copiar teléfono">${ic("copiar")}</button>` : ""}</dd><dt>Correo</dt><dd>${esc(p.email)}</dd>
    <dt>Entrega</dt><dd>${p.entrega === "casa" ? "Envío a " + esc(p.loc) : esc(p.loc)}</dd><dt>Pago</dt><dd>${CANAL[p.canal] || esc(p.canal)}</dd><dt>Fecha</dt><dd>${fLarga(p.t)}</dd>${p.notas ? `<dt>Nota</dt><dd>${esc(p.notas)}</dd>` : ""}</dl>
    <div><h2>Artículos</h2><div class="lista lineas">${p.lineas.map(l => `<div class="fila"><div class="cr"><div class="prod-n">${esc(l.n)}</div><div class="prod-m">${esc(l.ver)}</div></div><span class="num mini">${coma(l.q)} × ${eur(l.precio)}</span><span class="num">${eur(l.q * l.precio)}</span></div>`).join("")}
    ${p.descuento ? `<div class="fila"><div class="cr">Descuento ${esc(p.codigo || "")}</div><span class="num">−${eur(p.descuento)}</span></div>` : ""}
    <div class="fila"><div class="cr">Envío</div><span class="num">${p.envio ? eur(p.envio) : "Gratis"}</span></div><div class="fila"><div class="cr"><b>Total</b></div><b class="num">${eur(p.total)}</b></div></div></div>
    <label class="c">Nota interna <small>Solo la ve el equipo</small><textarea class="campo" id="pnota">${esc(p.interna)}</textarea></label>
    <div id="pconf"></div>`,
    `${p.estado !== "cancelado" && p.estado !== "entregado" ? `<button class="btn peligro" type="button" id="pcanc">Cancelar pedido</button>` : ""}${sig ? `<button class="btn prin" type="button" id="psig">${txtSig}</button>` : ""}`);
  $("#pnota").onchange = async e => { p.interna = e.target.value; await bd(sb.from("pedidos").update({ nota_interna: p.interna }).eq("ref", p.ref), "Nota guardada"); };
  $$("[data-copia]").forEach(b => b.onclick = () => copiar(b.dataset.copia));
  if (sig) $("#psig").onclick = async () => {
    const ant = p.estado; p.estado = sig;
    await bd(sb.from("pedidos").update({ estado: sig }).eq("ref", p.ref), `Pedido ${ESTADOS[sig].n.toLowerCase()}`,
      async () => { p.estado = ant; await sb.from("pedidos").update({ estado: ant }).eq("ref", p.ref); });
    registrar(`Pedido ${p.ref}: ${ESTADOS[ant].n} → ${ESTADOS[sig].n}`); pintar(); abrirPedido(ref);
  };
  const c = $("#pcanc"); if (c) c.onclick = () => {
    $("#pconf").innerHTML = `<div class="confirmar"><b>¿Cancelar el pedido ${esc(p.ref)}?</b><span>Las unidades vuelven al stock.${p.canal === "tarjeta" ? " Recuerde anular también la reserva del pago en PayPal para que no se le cobre nada." : ""}</span><div class="acciones"><button class="btn peligro lleno" type="button" id="psi">Sí, cancelar</button><button class="btn" type="button" id="pno">No</button></div></div>`;
    $("#pno").onclick = () => $("#pconf").innerHTML = "";
    $("#psi").onclick = async () => {
      await bd(sb.rpc("cancelar_pedido", { pref: p.ref }), "Pedido cancelado y stock repuesto");
      registrar(`Canceló el pedido ${p.ref}; el stock se repuso`); await cargar(); pintar(); abrirPedido(ref);
    };
  };
}
function abrirMostrador(){
  cajon("Anotar venta de mostrador", `<p class="mini" style="margin:0">Para que el stock cuadre también con lo que se vende en la tienda.</p>
   <div class="form"><label class="c ancho">Artículo<select class="campo" id="mp">${S.productos.map(p => `<option value="${esc(p.id)}">${esc(p.n)} · ${eur(p.precio)} (hay ${coma(p.uds)})</option>`).join("")}</select></label>
   <label class="c">Cantidad<input class="campo" id="mq" inputmode="decimal" value="1"></label>
   <label class="c">Cliente <small>Opcional</small><input class="campo" id="mc" placeholder="Venta en tienda"></label></div>`,
   `<button class="btn" type="button" data-cerrar>Cancelar</button><button class="btn prin" type="button" id="mok">Anotar venta</button>`);
  $("#mok").onclick = async () => {
    const p = PID[$("#mp").value], q = leerNum($("#mq").value);
    if (!(q > 0)) return tostada("Escriba la cantidad vendida");
    const precio = p.oferta ? Math.round(p.precio * (100 - p.oferta)) / 100 : p.precio, imp = Math.round(precio * q * 100) / 100;
    const ref = "MOS-" + new Date().toISOString().slice(2, 10).replace(/-/g, "") + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
    await bd(sb.from("pedidos").insert({ ref, cliente: $("#mc").value.trim() || "Venta en tienda", entrega: "tienda", canal: "tienda", estado: "entregado",
      lineas: [{ id: p.id, nombre: p.n, version: null, q, precio }], subtotal: imp, envio: 0, total: imp }));
    p.uds = Math.round((p.uds - q) * 100) / 100;
    await bd(actProd(p.id, { uds: p.uds }));
    movimiento(p.id, -q, "Venta en mostrador"); registrar(`Anotó una venta de mostrador: ${coma(q)} × «${p.n}»`);
    await cargar(); cerrarCajon(); pintar(); tostada(`Venta anotada. Quedan ${coma(p.uds)} de «${p.n}»`);
  };
}

/* ===== PRODUCTOS ===== */
V.productos = () => {
  const f = F.productos, q = f.q.trim().toLowerCase();
  const lista = S.productos.filter(p => (f.cat === "todas" || p.cat === f.cat) && (!q || (p.n + " " + (subN[p.sub] || "") + " " + p.id).toLowerCase().includes(q))
    && (f.estado === "todos" || (f.estado === "ocultos" ? !p.visible : f.estado === "oferta" ? !!p.oferta : estadoStock(p).n === f.estado)));
  const sel = f.sel, todos = lista.length && lista.every(p => sel.has(p.id));
  return cab("Productos", `${S.productos.length} productos. Los cambios se ven en la tienda en cuanto alguien la abre o la recarga.`, `<button class="btn prin" type="button" id="nuevo">${ic("mas")}Añadir producto</button>`) + `<div class="vista">
  <div class="filtros"><input class="campo buscar" id="prq" type="search" placeholder="Buscar producto…" value="${esc(f.q)}" aria-label="Buscar productos">
  <select class="campo" id="prc" aria-label="Sección"><option value="todas">Todas las secciones</option>${S.cats.map(c => `<option value="${c.id}" ${f.cat === c.id ? "selected" : ""}>${esc(c.n)}</option>`).join("")}</select>
  <select class="campo" id="pre" aria-label="Estado">${[["todos", "Cualquier estado"], ["Disponible", "Disponible"], ["Quedan pocas", "Quedan pocas"], ["Agotado", "Agotado"], ["ocultos", "Ocultos"], ["oferta", "En oferta"]].map(([v, n]) => `<option value="${v}" ${f.estado === v ? "selected" : ""}>${n}</option>`).join("")}</select></div>
  ${sel.size ? `<div class="selbar"><b>${sel.size} seleccionados</b><button class="btn pq" type="button" data-masivo="precio">Cambiar precio en %</button><button class="btn pq" type="button" data-masivo="ocultar">Ocultar</button><button class="btn pq" type="button" data-masivo="mostrar">Mostrar</button><button class="btn pq" type="button" data-masivo="novedad">Marcar como novedad</button><button class="btn pq" type="button" data-masivo="sinnovedad">Quitar novedad</button><button class="btn pq" type="button" data-masivo="quitar">Quitar selección</button></div><div id="masivo"></div>` : ""}
  <div class="tabla-env"><table><thead><tr><th style="width:36px"><input type="checkbox" id="todos" ${todos ? "checked" : ""} aria-label="Seleccionar todos"></th><th>Producto</th><th>Sección</th><th class="der">Precio</th><th>Stock</th><th>Estado</th><th>En la web</th><th class="der">Acciones</th></tr></thead><tbody>
  ${lista.map(p => { const e = estadoStock(p); return `<tr><td><input type="checkbox" data-sel="${esc(p.id)}" ${sel.has(p.id) ? "checked" : ""} aria-label="Seleccionar ${esc(p.n)}"></td>
  <td><div class="prod-n">${esc(p.n)}${p.nov ? ' <span class="pill p-in" style="font-size:.74rem">Novedad</span>' : ""}</div><div class="prod-m">${p.var.length > 1 ? p.var.length + " versiones · " : ""}${p.porMetro ? "por metro" : "por unidad"}${p.oferta ? ` · <b class="baja">−${p.oferta} %</b>` : ""}</div></td>
  <td>${esc(catN[p.cat] || p.cat)}<div class="prod-m">${esc(subN[p.sub] || p.sub)}</div></td>
  <td class="der"><input class="precio-in" data-precio="${esc(p.id)}" value="${p.precio.toFixed(2).replace(".", ",")}" inputmode="decimal" aria-label="Precio de ${esc(p.n)}"> €</td>
  <td><div class="paso"><button type="button" data-st="${esc(p.id)}" data-d="-1" aria-label="Quitar uno">−</button><input data-uds="${esc(p.id)}" value="${coma(p.uds)}" inputmode="decimal" aria-label="Stock de ${esc(p.n)}"><button type="button" data-st="${esc(p.id)}" data-d="1" aria-label="Añadir uno">+</button></div></td>
  <td><span class="pill ${e.c}">${e.n}</span></td>
  <td><label class="interr"><input type="checkbox" data-vis="${esc(p.id)}" ${p.visible ? "checked" : ""} aria-label="Mostrar ${esc(p.n)} en la web"><span></span></label></td>
  <td class="der"><button class="icono" type="button" data-ed="${esc(p.id)}" aria-label="Editar">${ic("editar")}</button><button class="icono" type="button" data-dup="${esc(p.id)}" aria-label="Duplicar">${ic("copiar")}</button><button class="icono" type="button" data-bo="${esc(p.id)}" aria-label="Eliminar">${ic("borrar")}</button></td></tr>`; }).join("") || `<tr><td colspan="8" class="vacio">Ningún producto coincide con la búsqueda.</td></tr>`}
  </tbody></table></div></div>`;
};
let tStock = {};
function cambiarStock(p, nuevo, motivo){
  const ant = p.uds; p.uds = Math.max(0, Math.round(nuevo * 100) / 100); pintar();
  // los clics seguidos en +/− se guardan juntos
  clearTimeout(tStock[p.id] && tStock[p.id].t);
  const base = tStock[p.id] ? tStock[p.id].desde : ant;
  tStock[p.id] = { desde: base, t: setTimeout(async () => { delete tStock[p.id]; await bd(actProd(p.id, { uds: p.uds })); movimiento(p.id, Math.round((p.uds - base) * 100) / 100, motivo); }, 700) };
}
enlazar.productos = () => {
  const f = F.productos;
  buscarEn("#prq", "productos");
  $("#prc").onchange = e => { f.cat = e.target.value; pintar(); };
  $("#pre").onchange = e => { f.estado = e.target.value; pintar(); };
  $("#nuevo").onclick = () => abrirProducto(null);
  $("#todos").onchange = e => { $$("[data-sel]").forEach(c => e.target.checked ? f.sel.add(c.dataset.sel) : f.sel.delete(c.dataset.sel)); pintar(); };
  $$("[data-sel]").forEach(c => c.onchange = () => { c.checked ? f.sel.add(c.dataset.sel) : f.sel.delete(c.dataset.sel); pintar(); });
  $$("[data-precio]").forEach(i => { i.onkeydown = e => { if (e.key === "Enter") i.blur(); }; i.onchange = async () => {
    const p = PID[i.dataset.precio], v = leerNum(i.value);
    if (!(v > 0)) { tostada("Escriba un precio mayor que cero, por ejemplo 2,95"); i.value = p.precio.toFixed(2).replace(".", ","); return; }
    const ant = p.precio; p.precio = Math.round(v * 100) / 100;
    await bd(actProd(p.id, { precio: p.precio }), `Precio actualizado: ${eur(p.precio)}`, async () => { p.precio = ant; await actProd(p.id, { precio: ant }); });
    registrar(`Cambió el precio de «${p.n}» de ${eur(ant)} a ${eur(p.precio)}`); pintar(); }; });
  $$("[data-st]").forEach(x => x.onclick = () => { const p = PID[x.dataset.st]; cambiarStock(p, p.uds + +x.dataset.d, "Ajuste manual"); });
  $$("[data-uds]").forEach(i => i.onchange = () => { const p = PID[i.dataset.uds], v = leerNum(i.value); if (v >= 0) { cambiarStock(p, v, "Recuento"); registrar(`Ajustó el stock de «${p.n}» a ${coma(v)}`); } else pintar(); });
  $$("[data-vis]").forEach(c => c.onchange = async () => { const p = PID[c.dataset.vis]; p.visible = c.checked;
    await bd(actProd(p.id, { visible: p.visible }), p.visible ? "Ya se ve en la tienda" : "Oculto: ya no aparece en la tienda", async () => { p.visible = !p.visible; await actProd(p.id, { visible: p.visible }); });
    registrar(`${p.visible ? "Mostró" : "Ocultó"} «${p.n}» en la web`); pintar(); });
  $$("[data-ed]").forEach(x => x.onclick = () => abrirProducto(x.dataset.ed));
  $$("[data-dup]").forEach(x => x.onclick = async () => {
    const p = PID[x.dataset.dup], fila = { ...p._fila }; delete fila.actualizado;
    let id = p.id + "-copia", k = 2; while (PID[id]) id = p.id + "-copia-" + k++;
    Object.assign(fila, { id, nombre: p.n + " (copia)", visible: false, uds: 0, orden: p.orden });
    await bd(sb.from("productos").insert(fila), "Copia creada y oculta hasta que la revise");
    registrar(`Duplicó «${p.n}»`); await cargar(); pintar(); abrirProducto(id);
  });
  $$("[data-bo]").forEach(x => x.onclick = () => confirmarBorrado(PID[x.dataset.bo]));
  $$("[data-masivo]").forEach(x => x.onclick = async () => {
    const ids = [...f.sel], acc = x.dataset.masivo;
    if (acc === "quitar") { f.sel.clear(); return pintar(); }
    if (acc === "precio") {
      $("#masivo").innerHTML = `<div class="bloque filtros"><label class="c">Subir o bajar (%) <input class="campo" id="pct" type="number" step="1" value="5" style="width:110px"></label><span class="mini">Use un número negativo para bajar. Se redondea a 5 céntimos.</span><button class="btn prin" type="button" id="pctok">Aplicar a ${ids.length}</button></div>`;
      $("#pctok").onclick = async () => {
        const pct = +$("#pct").value || 0, k = 1 + pct / 100, ant = ids.map(id => [id, PID[id].precio]);
        await bd(Promise.all(ids.map(id => { PID[id].precio = Math.max(.05, Math.round(PID[id].precio * k * 20) / 20); return actProd(id, { precio: PID[id].precio }).then(r => { if (r.error) throw r.error; }); })),
          `Precios cambiados en ${ids.length} productos`, async () => { await Promise.all(ant.map(([id, v]) => { PID[id].precio = v; return actProd(id, { precio: v }); })); });
        registrar(`Cambió un ${pct} % el precio de ${ids.length} productos`); pintar();
      }; return;
    }
    const campos = { ocultar: { visible: false }, mostrar: { visible: true }, novedad: { novedad: true }, sinnovedad: { novedad: false } }[acc];
    await bd(sb.from("productos").update(campos).in("id", ids), "Hecho");
    registrar(`${{ ocultar: "Ocultó", mostrar: "Mostró", novedad: "Marcó como novedad", sinnovedad: "Quitó la novedad de" }[acc]} ${ids.length} productos`);
    await cargar(); pintar();
  });
};
function confirmarBorrado(p){
  cajon("Eliminar producto", `<div class="confirmar"><b>¿Eliminar «${esc(p.n)}»?</b><span>Desaparece de la tienda y del panel. Los pedidos antiguos que lo incluyen no cambian. Si solo quiere dejar de venderlo un tiempo, es mejor ocultarlo.</span></div>`,
    `<button class="btn" type="button" data-cerrar>No, dejarlo</button><button class="btn" type="button" id="bocul">Ocultarlo</button><button class="btn peligro lleno" type="button" id="bosi">Eliminar</button>`);
  $("#bocul").onclick = async () => { p.visible = false; await bd(actProd(p.id, { visible: false }), "Oculto: ya no aparece en la tienda"); registrar(`Ocultó «${p.n}» en la web`); cerrarCajon(); pintar(); };
  $("#bosi").onclick = async () => {
    const fila = { ...p._fila }; delete fila.actualizado;
    await bd(sb.from("productos").delete().eq("id", p.id), `«${p.n}» eliminado`, async () => { await sb.from("productos").insert(fila); registrar(`Recuperó «${p.n}»`); await cargar(); });
    F.productos.sel.delete(p.id); registrar(`Eliminó «${p.n}»`); await cargar(); cerrarCajon(); pintar();
  };
}
function abrirProducto(id){
  const p = id ? PID[id] : { id: "", cat: S.cats[0] ? S.cats[0].id : "", sub: "", n: "", precio: 0, var: [], _var: [], med: [], porMetro: false, uds: 0, umbral: 5, visible: true, dest: false, nov: true, desc: "", coste: 0, _fila: {} };
  if (!p) return;
  const subsDe = c => (S.cats.find(x => x.id === c) || { subs: [] }).subs;
  cajon(id ? "Editar producto" : "Añadir producto", `
  <form class="form" id="fp" novalidate>
    <label class="c ancho">Nombre<input class="campo" id="fn" value="${esc(p.n)}" placeholder="Ej.: Hilo de coser algodón 250 m"></label>
    <label class="c">Sección<select class="campo" id="fc">${S.cats.map(c => `<option value="${c.id}" ${p.cat === c.id ? "selected" : ""}>${esc(c.n)}</option>`).join("")}</select></label>
    <label class="c">Subsección<select class="campo" id="fs">${subsDe(p.cat).map(s => `<option value="${s.id}" ${p.sub === s.id ? "selected" : ""}>${esc(s.n)}</option>`).join("")}</select></label>
    <label class="c">Precio de venta (€) <small>IVA incluido</small><input class="campo" id="fpr" inputmode="decimal" value="${p.precio ? p.precio.toFixed(2).replace(".", ",") : ""}" placeholder="0,00"></label>
    <label class="c">Coste (€) <small>Para el margen; no se ve en la web</small><input class="campo" id="fco" inputmode="decimal" value="${p.coste ? p.coste.toFixed(2).replace(".", ",") : ""}" placeholder="0,00"></label>
    <label class="c">Stock<input class="campo" id="fu" inputmode="decimal" value="${coma(p.uds)}"></label>
    <label class="c">Avisar cuando queden <small>Pasa a «Quedan pocas»</small><input class="campo" id="fum" inputmode="decimal" value="${coma(p.umbral)}"></label>
    <label class="c ancho">Colores o versiones <small>Separados por comas. Ej.: Blanco, Negro, Azul marino</small><input class="campo" id="fv" value="${esc(p.var.join(", "))}"></label>
    <label class="c ancho">Tallas o medidas <small>Separadas por comas. Déjelo vacío si no tiene</small><input class="campo" id="fm" value="${esc(p.med.join(", "))}"></label>
    <label class="c ancho">Descripción<textarea class="campo" id="fd">${esc(p.desc)}</textarea></label>
    <div class="ancho" style="display:flex;flex-direction:column;gap:10px">
      <label class="marcar"><span class="interr"><input type="checkbox" id="fme" ${p.porMetro ? "checked" : ""}><span></span></span>Se vende por metros</label>
      <label class="marcar"><span class="interr"><input type="checkbox" id="fvi" ${p.visible ? "checked" : ""}><span></span></span>Visible en la web</label>
      <label class="marcar"><span class="interr"><input type="checkbox" id="fde" ${p.dest ? "checked" : ""}><span></span></span>Destacado en la portada</label>
      <label class="marcar"><span class="interr"><input type="checkbox" id="fno" ${p.nov ? "checked" : ""}><span></span></span>Marcar como novedad</label>
    </div>
    <p class="mini ancho" id="fmarg"></p>
    <p class="ancho error" id="ferr" role="alert"></p>
  </form>`, `<button class="btn" type="button" data-cerrar>Cancelar</button><button class="btn prin" type="button" id="fok">${id ? "Guardar cambios" : "Añadir a la tienda"}</button>`);
  $("#fc").onchange = e => $("#fs").innerHTML = subsDe(e.target.value).map(s => `<option value="${s.id}">${esc(s.n)}</option>`).join("");
  const marg = () => { const v = leerNum($("#fpr").value), c = leerNum($("#fco").value); $("#fmarg").textContent = v > 0 && c > 0 ? `Margen: ${eur(v / 1.21 - c)} por ${$("#fme").checked ? "metro" : "unidad"} (${Math.round((v / 1.21 - c) / (v / 1.21) * 100)} % sin IVA)` : ""; };
  $("#fpr").oninput = marg; $("#fco").oninput = marg; marg();
  $("#fok").onclick = async () => {
    const n = $("#fn").value.trim(), pr = leerNum($("#fpr").value), err = t => $("#ferr").textContent = t;
    if (!n) return err("Falta el nombre del producto.");
    if (!(pr > 0)) return err("Escriba un precio mayor que cero, por ejemplo 2,95.");
    if (!$("#fs").value) return err("Elija una subsección.");
    const lista = s => s.split(",").map(x => x.trim()).filter(Boolean);
    const viejos = Object.fromEntries((p._var || []).map(v => [v.n, v.c]));
    const variantes = lista($("#fv").value).map(nv => ({ n: nv, c: viejos[nv] || (COL[nv] && COL[nv][0] === "#" ? COL[nv] : COL[nv] || null) }));
    const medidas = lista($("#fm").value), sub = $("#fs").value;
    const fila = { nombre: n, cat: $("#fc").value, sub, precio: Math.round(pr * 100) / 100, coste: leerNum($("#fco").value) || null,
      uds: Math.max(0, leerNum($("#fu").value) || 0), umbral: Math.max(0, leerNum($("#fum").value) || 0),
      variantes: variantes.length ? variantes : [{ n: "Único" }], medidas, tipo_medida: medidas.length ? (p._fila.tipo_medida || "medida") : null,
      descripcion: $("#fd").value.trim(), por_metro: $("#fme").checked, visible: $("#fvi").checked, destacado: $("#fde").checked, novedad: $("#fno").checked };
    $("#fok").disabled = true;
    try {
      if (id) {
        if (fila.uds !== p.uds) movimiento(p.id, Math.round((fila.uds - p.uds) * 100) / 100, "Ajuste en la ficha");
        await bd(actProd(id, fila), "Cambios guardados"); registrar(`Editó «${n}»`);
      } else {
        let nid = slug(n) || "producto", k = 2; while (PID[nid]) nid = slug(n) + "-" + k++;
        fila.id = nid; fila.icono = ICONOS_POR_SUB[sub] || "kit"; fila.orden = Math.max(0, ...S.productos.map(x => x.orden || 0)) + 1;
        await bd(sb.from("productos").insert(fila), `«${n}» añadido a la tienda`);
        if (fila.uds) movimiento(nid, fila.uds, "Alta del producto");
        registrar(`Añadió «${n}» a ${catN[fila.cat]}`); F.productos.q = ""; F.productos.cat = "todas"; F.productos.estado = "todos";
      }
      await cargar(); cerrarCajon(); pintar();
    } catch (e) { $("#fok").disabled = false; }
  };
}

/* ===== STOCK ===== */
V.stock = () => {
  const q = F.stock.q.trim().toLowerCase();
  const lista = S.productos.filter(p => !q || p.n.toLowerCase().includes(q)).sort((a, b) => (a.uds / (a.umbral || 1)) - (b.uds / (b.umbral || 1)));
  const valor = S.productos.reduce((s, p) => s + Math.max(0, p.uds) * p.coste, 0), sinCoste = S.productos.filter(p => !p.coste).length;
  const ago = S.productos.filter(p => p.visible && p.uds <= 0).length;
  return cab("Stock", "Cada venta de la web o del mostrador lo descuenta sola. Aquí anota la mercancía que llega y corrige lo que haga falta.", `<button class="btn prin" type="button" id="recibir">${ic("mas")}Recibir mercancía</button>`) + `<div class="vista">
  <div class="rejilla r4"><div class="kpi"><span class="et">Agotados</span><span class="v">${ago}</span><span class="d">Se muestran como «Agotado» en la web</span></div>
  <div class="kpi"><span class="et">Quedan pocas</span><span class="v">${bajos().length - ago}</span><span class="d">Por debajo de su aviso</span></div>
  <div class="kpi"><span class="et">Valor del almacén</span><span class="v">${eur(valor)}</span><span class="d">A precio de coste${sinCoste ? ` · faltan ${sinCoste} costes` : ""}</span></div></div>
  <div class="rejilla r2" style="align-items:start">
  <section class="bloque"><h2>Ordenado por urgencia</h2><input class="campo buscar" id="sq" type="search" placeholder="Buscar producto…" value="${esc(F.stock.q)}" aria-label="Buscar en stock" style="max-width:none;width:100%;margin-bottom:6px">
  <div class="lista">${lista.slice(0, 40).map(p => { const e = estadoStock(p); return `<div class="fila"><div class="cr"><div class="prod-n">${esc(p.n)}</div><div class="prod-m">Aviso al llegar a ${coma(p.umbral)} · ${esc(subN[p.sub] || "")}</div></div><span class="pill ${e.c}">${e.n}</span>
  <div class="paso"><button type="button" data-st="${esc(p.id)}" data-d="-1" aria-label="Quitar uno">−</button><input data-uds="${esc(p.id)}" value="${coma(p.uds)}" inputmode="decimal" aria-label="Stock de ${esc(p.n)}"><button type="button" data-st="${esc(p.id)}" data-d="1" aria-label="Añadir uno">+</button></div></div>`; }).join("")}</div></section>
  <section class="bloque"><h2>Últimos movimientos</h2><div class="lista">${S.movs.slice(0, 15).map(m => `<div class="fila"><div class="cr"><div class="prod-n">${esc(PID[m.id] ? PID[m.id].n : m.id || "Producto eliminado")}</div><div class="prod-m">${esc(m.motivo)} · ${esc(m.quien)} · ${hace(m.t)}</div></div><b class="num ${m.q >= 0 ? "sube" : "baja"}">${m.q >= 0 ? "+" : ""}${coma(m.q)}</b></div>`).join("") || '<p class="vacio">Aún no hay movimientos.</p>'}</div></section></div></div>`;
};
enlazar.stock = () => {
  buscarEn("#sq", "stock");
  $("#recibir").onclick = () => abrirRecibir(null);
  $$("[data-st]").forEach(x => x.onclick = () => { const p = PID[x.dataset.st]; cambiarStock(p, p.uds + +x.dataset.d, "Ajuste manual"); });
  $$("[data-uds]").forEach(i => i.onchange = () => { const p = PID[i.dataset.uds], v = leerNum(i.value); if (v >= 0) { cambiarStock(p, v, "Recuento"); registrar(`Recontó «${p.n}»: ${coma(v)}`); } else pintar(); });
};
function abrirRecibir(id){
  cajon("Recibir mercancía", `<p class="mini" style="margin:0">Sume lo que ha llegado del proveedor. Si el producto estaba agotado, vuelve a venderse en la web en cuanto guarde.</p>
  <div class="form"><label class="c ancho">Producto<select class="campo" id="rp">${S.productos.map(p => `<option value="${esc(p.id)}" ${p.id === id ? "selected" : ""}>${esc(p.n)} (hay ${coma(p.uds)})</option>`).join("")}</select></label>
  <label class="c">Cantidad que entra<input class="campo" id="rq" inputmode="decimal" value="12"></label><label class="c">Proveedor o motivo <small>Opcional</small><input class="campo" id="rm" placeholder="Entrada de proveedor"></label></div>`,
  `<button class="btn" type="button" data-cerrar>Cancelar</button><button class="btn prin" type="button" id="rok">Sumar al stock</button>`);
  $("#rok").onclick = async () => {
    const p = PID[$("#rp").value], q = leerNum($("#rq").value); if (!(q > 0)) return tostada("Escriba cuántas unidades han llegado");
    const { data, error } = await sb.from("productos").select("uds").eq("id", p.id).single(); // stock real, por si se vendió algo mientras tanto
    if (!error && data) p.uds = +data.uds;
    p.uds = Math.round((p.uds + q) * 100) / 100;
    await bd(actProd(p.id, { uds: p.uds }), `Ahora hay ${coma(p.uds)} de «${p.n}»`);
    movimiento(p.id, q, $("#rm").value.trim() || "Entrada de proveedor"); registrar(`Recibió ${coma(q)} de «${p.n}»`); cerrarCajon(); pintar();
  };
}

/* ===== OFERTAS ===== */
V.ofertas = () => {
  const enOf = S.productos.filter(p => p.oferta);
  return cab("Ofertas y códigos", "Rebajas sobre productos o secciones enteras, y códigos de descuento para dar a sus clientas.") + `<div class="vista"><div class="rejilla r2" style="align-items:start">
  <section class="bloque"><h2>Poner una rebaja</h2><div class="form">
    <label class="c ancho">Aplicar a<select class="campo" id="oa"><optgroup label="Secciones enteras">${S.cats.map(c => `<option value="cat:${c.id}">Toda ${esc(c.n)}</option>`).join("")}${S.cats.flatMap(c => c.subs.map(s => `<option value="sub:${s.id}">${esc(c.n)} · ${esc(s.n)}</option>`)).join("")}</optgroup><optgroup label="Un producto">${S.productos.map(p => `<option value="p:${esc(p.id)}">${esc(p.n)}</option>`).join("")}</optgroup></select></label>
    <label class="c">Descuento (%)<input class="campo" id="op" type="number" min="1" max="90" value="20"></label></div>
    <div class="acciones" style="margin-top:14px"><button class="btn prin" type="button" id="ook">Aplicar rebaja</button></div></section>
  <section class="bloque"><h2>En oferta ahora · ${enOf.length}</h2><div class="lista">${enOf.map(p => `<div class="fila"><div class="cr"><div class="prod-n">${esc(p.n)}</div><div class="prod-m"><s>${eur(p.precio)}</s> → <b>${eur(p.precio * (1 - p.oferta / 100))}</b></div></div><span class="pill p-er">−${p.oferta} %</span><button class="icono" type="button" data-qo="${esc(p.id)}" aria-label="Quitar oferta">${ic("cerrar")}</button></div>`).join("") || '<p class="vacio">Ningún producto está rebajado.</p>'}</div>${enOf.length ? '<button class="btn pq" type="button" id="qtodas">Quitar todas las rebajas</button>' : ""}</section></div>
  <section class="bloque"><h2>Códigos de descuento</h2><p class="mini" style="margin-top:-6px">La base de datos ya los aplica al registrar un pedido. Falta añadir la casilla «código de descuento» en la cesta de la web: pídamelo cuando quiera usarlos.</p><div class="tabla-env"><table><thead><tr><th>Código</th><th>Descuento</th><th>Válido hasta</th><th class="der">Veces usado</th><th>Activo</th></tr></thead><tbody>
  ${S.codigos.map((c, i) => `<tr><td><b class="num">${esc(c.cod)}</b></td><td>${c.tipo === "%" ? coma(c.valor) + " %" : eur(c.valor)}</td><td>${c.hasta ? fCorta(Date.parse(c.hasta)) : "Sin fecha"}</td><td class="der num">${c.usos}</td><td><label class="interr"><input type="checkbox" data-cod="${i}" ${c.activo ? "checked" : ""} aria-label="Activar ${esc(c.cod)}"><span></span></label></td></tr>`).join("") || '<tr><td colspan="5" class="vacio">Aún no hay códigos.</td></tr>'}
  </tbody></table></div><div class="filtros" style="margin-top:14px"><input class="campo" id="cn" placeholder="NUEVOCODIGO" aria-label="Nuevo código" style="text-transform:uppercase"><input class="campo" id="cv" type="number" value="10" style="width:90px" aria-label="Valor"><select class="campo" id="ct" aria-label="Tipo"><option value="%">%</option><option value="€">€</option></select><input class="campo" id="ch" type="date" aria-label="Válido hasta (opcional)"><button class="btn" type="button" id="cok">${ic("mas")}Crear código</button></div></section></div>`;
};
enlazar.ofertas = () => {
  $("#ook").onclick = async () => {
    const [t, v] = $("#oa").value.split(":"), pct = Math.round(+$("#op").value);
    if (!(pct >= 1 && pct <= 90)) return tostada("El descuento va de 1 a 90 %");
    const ps = S.productos.filter(p => t === "cat" ? p.cat === v : t === "sub" ? p.sub === v : p.id === v), ids = ps.map(p => p.id);
    await bd(sb.from("productos").update({ oferta: pct }).in("id", ids), `Rebaja aplicada a ${ids.length} productos`, async () => { await sb.from("productos").update({ oferta: null }).in("id", ids); await cargar(); });
    registrar(`Puso un ${pct} % de rebaja a ${ids.length} productos`); await cargar(); pintar();
  };
  $$("[data-qo]").forEach(b => b.onclick = async () => { const p = PID[b.dataset.qo]; await bd(actProd(p.id, { oferta: null }), "Rebaja quitada"); registrar(`Quitó la rebaja de «${p.n}»`); p.oferta = null; pintar(); });
  const qt = $("#qtodas"); if (qt) qt.onclick = async () => { const ids = S.productos.filter(p => p.oferta).map(p => p.id); await bd(sb.from("productos").update({ oferta: null }).in("id", ids), "Rebajas quitadas"); registrar("Quitó todas las rebajas"); await cargar(); pintar(); };
  $$("[data-cod]").forEach(c => c.onchange = async () => { const k = S.codigos[+c.dataset.cod]; k.activo = c.checked; await bd(sb.from("codigos").update({ activo: k.activo }).eq("codigo", k.cod), k.activo ? "Código activado" : "Código desactivado"); registrar(`${k.activo ? "Activó" : "Desactivó"} el código ${k.cod}`); });
  $("#cok").onclick = async () => {
    const cod = $("#cn").value.trim().toUpperCase().replace(/\s+/g, ""); if (!cod) return tostada("Escriba el código");
    if (S.codigos.some(c => c.cod === cod)) return tostada("Ese código ya existe");
    await bd(sb.from("codigos").insert({ codigo: cod, tipo: $("#ct").value, valor: +$("#cv").value || 0, activo: true, hasta: $("#ch").value || null }), `Código ${cod} creado`);
    registrar(`Creó el código ${cod}`); await cargar(); pintar();
  };
};

/* ===== SECCIONES ===== */
V.categorias = () => cab("Secciones", "Las secciones y subsecciones del menú de la tienda. Puede renombrarlas, añadir nuevas o cambiar su orden.") + `<div class="vista"><div class="rejilla r2" style="align-items:start">${S.cats.map((c, ci) => `<section class="bloque"><h2>${esc(c.n)}</h2><div class="lista">${c.subs.map((s, si) => `<div class="fila"><div class="cr"><input class="campo" data-rs="${ci}:${si}" value="${esc(s.n)}" aria-label="Nombre de la subsección" style="width:100%"></div><span class="mini num">${S.productos.filter(p => p.sub === s.id).length} prod.</span><button class="icono" type="button" data-sube="${ci}:${si}" aria-label="Subir" ${si ? "" : "disabled"}>↑</button></div>`).join("")}</div>
  <div class="filtros" style="margin-top:10px"><input class="campo" data-nsn="${ci}" placeholder="Nueva subsección" aria-label="Nueva subsección en ${esc(c.n)}" style="flex:1"><button class="btn pq" type="button" data-ns="${ci}">${ic("mas")}Añadir</button></div></section>`).join("")}</div>
  <p class="mini">Las subsecciones nuevas aparecen en la tienda cuando tengan productos. Para que salgan también en el menú desplegable, pídamelo y las añado al diseño.</p></div>`;
enlazar.categorias = () => {
  $$("[data-rs]").forEach(i => i.onchange = async () => { const [a, b] = i.dataset.rs.split(":").map(Number), s = S.cats[a].subs[b], ant = s.n, nuevo = i.value.trim(); if (!nuevo) { i.value = ant; return; }
    await bd(sb.from("subcategorias").update({ nombre: nuevo }).eq("id", s.id), "Nombre cambiado"); s.n = nuevo; subN[s.id] = nuevo; registrar(`Renombró la subsección «${ant}» a «${nuevo}»`); });
  $$("[data-sube]").forEach(x => x.onclick = async () => { const [a, b] = x.dataset.sube.split(":").map(Number), l = S.cats[a].subs; [l[b - 1], l[b]] = [l[b], l[b - 1]];
    await bd(Promise.all(l.map((s, k) => sb.from("subcategorias").update({ orden: k }).eq("id", s.id)))); pintar(); });
  $$("[data-ns]").forEach(x => x.onclick = async () => { const ci = +x.dataset.ns, n = $(`[data-nsn="${ci}"]`).value.trim(); if (!n) return tostada("Escriba el nombre de la subsección");
    let id = slug(n), k = 2; while (subN[id]) id = slug(n) + "-" + k++;
    await bd(sb.from("subcategorias").insert({ id, cat: S.cats[ci].id, nombre: n, orden: S.cats[ci].subs.length }), "Subsección añadida");
    registrar(`Añadió la subsección «${n}» a ${S.cats[ci].n}`); await cargar(); pintar(); });
};

/* ===== CLIENTES ===== */
V.clientes = () => {
  const m = {};
  S.pedidos.filter(p => p.estado !== "cancelado" && p.canal !== "tienda").forEach(p => { const k = (p.tel !== "—" ? p.tel : p.cli).replace(/\s/g, ""); const c = m[k] || (m[k] = { n: p.cli, tel: p.tel, email: p.email, ped: 0, tot: 0, ult: 0 }); c.ped++; c.tot += p.total; if (p.t > c.ult) { c.ult = p.t; c.n = p.cli; if (p.email !== "—") c.email = p.email; } });
  const q = F.clientes.q.trim().toLowerCase(), l = Object.values(m).filter(c => !q || (c.n + " " + c.tel + " " + c.email).toLowerCase().includes(q)).sort((a, b) => b.tot - a.tot);
  return cab("Clientes", "Quién compra, cuánto y cuándo fue la última vez. Se forma solo a partir de los pedidos de la web.") + `<div class="vista"><input class="campo buscar" id="cq" type="search" placeholder="Buscar cliente…" value="${esc(F.clientes.q)}" aria-label="Buscar clientes">
  <div class="tabla-env"><table><thead><tr><th>Cliente</th><th>Contacto</th><th class="der">Pedidos</th><th class="der">Ha gastado</th><th>Último pedido</th></tr></thead><tbody>${l.map(c => `<tr class="clic" data-cli="${esc(c.tel !== "—" ? c.tel : c.n)}"><td class="prod-n">${esc(c.n)}</td><td class="num">${esc(c.tel)}<div class="prod-m">${esc(c.email)}</div></td><td class="der num">${c.ped}</td><td class="der num">${eur(c.tot)}</td><td>${hace(c.ult)}</td></tr>`).join("") || '<tr><td colspan="5" class="vacio">Aún no hay clientes: aparecerán con los primeros pedidos.</td></tr>'}</tbody></table></div></div>`;
};
enlazar.clientes = () => { buscarEn("#cq", "clientes"); $$("[data-cli]").forEach(r => r.onclick = () => { F.pedidos.q = r.dataset.cli; F.pedidos.estado = "todos"; location.hash = "pedidos"; }); };

/* ===== AJUSTES ===== */
const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const hhmm = x => `${String(Math.floor(x)).padStart(2, "0")}:${String(Math.round(x % 1 * 60)).padStart(2, "0")}`;
const leerHora = s => { const m = /^(\d{1,2})(?::(\d{2}))?$/.exec(s.trim()); return m ? +m[1] + (+m[2] || 0) / 60 : NaN; };
V.ajustes = () => { const a = S.ajustes, hor = a.horario || {}, fest = a.festivos || [], pago = window.LV_PAGO || {};
  return cab("Ajustes de la tienda", "Envíos, horario, festivos y avisos. Los cambios se ven en la web en cuanto alguien la abre o la recarga.") + `<div class="vista"><div class="rejilla r2" style="align-items:start">
  <section class="bloque"><h2>Envíos y cambios</h2><div class="form">
   <label class="c">Coste del envío (€)<input class="campo" data-aj="envio" inputmode="decimal" value="${coma(a.envio ?? 4.95)}"></label>
   <label class="c">Envío gratis desde (€)<input class="campo" data-aj="envioGratis" inputmode="decimal" value="${coma(a.envioGratis ?? 50)}"></label>
   <label class="c">Plazo de entrega<input class="campo" data-aj="plazoEnvio" data-texto value="${esc(a.plazoEnvio || "")}"></label>
   <label class="c">Días para cambios<input class="campo" data-aj="diasCambio" inputmode="numeric" value="${a.diasCambio ?? 14}"></label></div></section>
  <section class="bloque"><h2>Avisos en la web</h2><div style="display:flex;flex-direction:column;gap:12px">
   <label class="marcar"><span class="interr"><input type="checkbox" id="avac" ${a.vacaciones ? "checked" : ""}><span></span></span>Modo vacaciones: se puede mirar, pero no comprar</label>
   <label class="c">Texto de aviso arriba de la web <small>Vacío = sin aviso</small><input class="campo" id="atx" value="${esc(a.avisoTexto || "")}" placeholder="Ej.: Del 24 al 26 de diciembre los pedidos salen el día 27"></label></div></section>
  <section class="bloque"><h2>Horario</h2><p class="mini" style="margin-top:-6px">Escriba los tramos así: 10:00-14:00, 17:00-20:00. Vacío = cerrado.</p><div class="lista">${[1, 2, 3, 4, 5, 6, 0].map(d => `<div class="fila"><span class="cr">${DIAS[d]}</span><input class="campo" data-hor="${d}" value="${esc((hor[d] || []).map(([x, y]) => `${hhmm(x)}-${hhmm(y)}`).join(", "))}" placeholder="Cerrado" aria-label="Horario del ${DIAS[d]}" style="width:min(240px,55vw)"></div>`).join("")}</div></section>
  <section class="bloque"><h2>Festivos (cerrado)</h2><div class="lista">${fest.map(f => `<div class="fila"><span class="cr">${new Date(f + "T12:00").toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span><button class="icono" type="button" data-qf="${f}" aria-label="Quitar festivo">${ic("cerrar")}</button></div>`).join("") || '<p class="vacio">No hay festivos.</p>'}</div>
   <div class="filtros" style="margin-top:10px"><input class="campo" type="date" id="fnuevo" aria-label="Nuevo festivo"><button class="btn pq" type="button" id="fok2">${ic("mas")}Añadir festivo</button></div></section>
  <section class="bloque"><h2>Cobros</h2><p style="margin:0 0 8px">Pasarela: <b>PayPal</b> (tarjeta y cuenta PayPal). <span class="pill ${pago.prueba ? "p-av" : "p-ok"}">${pago.prueba ? "Modo de prueba: no cobra" : "Cobrando de verdad"}</span></p>
   <p class="mini" style="margin:0">Los pagos con tarjeta se reservan al hacer el pedido; se cobran desde PayPal cuando lo prepare. Para pasar a cobrar de verdad hace falta la cuenta PayPal Business: pídamelo y lo cambio.</p></section>
  <section class="bloque"><h2>Quién puede entrar aquí</h2><div class="lista">${S.admins.map(u => `<div class="fila"><span class="av">${esc(iniciales(u.nombre))}</span><div class="cr"><div class="prod-n">${esc(u.nombre || "Sin nombre")}${u.user_id === "" ? "" : ""}</div></div><span class="pill p-ne">${esc(ROL[u.rol] || u.rol)}</span></div>`).join("")}</div>
   <p class="mini">Para dar acceso a alguien: en Supabase, <i>Authentication → Users → Add user</i> con su correo y una contraseña; después pídame que le asigne el permiso (Administración, Pedidos y stock, o Solo consultar).</p></section></div></div>`; };
const guardarAjuste = (clave, valor, txt) => { S.ajustes[clave] = valor; return bd(sb.from("ajustes").upsert({ clave, valor }), txt || "Ajuste guardado").then(() => registrar(`Cambió el ajuste «${clave}»`)); };
enlazar.ajustes = () => {
  $$("[data-aj]").forEach(i => i.onchange = () => { const k = i.dataset.aj, txt = i.hasAttribute("data-texto"), v = txt ? i.value.trim() : leerNum(i.value);
    if (!txt && !(v >= 0)) { tostada("Escriba un número, por ejemplo 4,95"); return; } guardarAjuste(k, v); });
  $("#avac").onchange = e => guardarAjuste("vacaciones", e.target.checked, e.target.checked ? "Modo vacaciones activado: la web no admite pedidos" : "La tienda vuelve a vender");
  $("#atx").onchange = e => guardarAjuste("avisoTexto", e.target.value.trim(), e.target.value.trim() ? "Aviso publicado" : "Aviso quitado");
  $$("[data-hor]").forEach(i => i.onchange = () => {
    const tramos = i.value.split(",").map(s => s.trim()).filter(Boolean).map(t => t.split(/[-–]/).map(leerHora));
    if (tramos.some(t => t.length !== 2 || t.some(isNaN) || t[0] >= t[1])) { tostada("Formato: 10:00-14:00, 17:00-20:00"); return; }
    const h = { ...(S.ajustes.horario || {}) }; h[i.dataset.hor] = tramos; guardarAjuste("horario", h, `Horario del ${DIAS[i.dataset.hor].toLowerCase()} guardado`);
  });
  $("#fok2").onclick = async () => { const v = $("#fnuevo").value; if (!v) return tostada("Elija una fecha"); const f = [...new Set([...(S.ajustes.festivos || []), v])].sort(); await guardarAjuste("festivos", f, "Festivo añadido"); pintar(); };
  $$("[data-qf]").forEach(b => b.onclick = async () => { await guardarAjuste("festivos", (S.ajustes.festivos || []).filter(f => f !== b.dataset.qf), "Festivo quitado"); pintar(); });
};

/* ===== REGISTRO ===== */
V.registro = () => cab("Registro de cambios", "Todo lo que se cambia en el panel queda apuntado: quién, qué y cuándo.") + `<div class="vista"><section class="bloque"><div class="lista">${S.registro.map(r => `<div class="fila"><span class="av">${esc(iniciales(r.quien))}</span><div class="cr"><div>${esc(r.txt)}</div><div class="prod-m">${esc(r.quien)} · ${fLarga(r.t)}</div></div></div>`).join("") || '<p class="vacio">Aún no hay cambios.</p>'}</div></section></div>`;

/* ---------- cajón lateral ---------- */
let foco;
function cajon(titulo, cuerpo, pie){
  foco = document.activeElement;
  $("#capa").innerHTML = `<div class="velo" data-cerrar></div><div class="cajon" role="dialog" aria-modal="true" aria-label="${esc(titulo)}"><header><h2>${esc(titulo)}</h2><button class="icono" type="button" data-cerrar aria-label="Cerrar">${ic("cerrar")}</button></header><div class="cuerpo">${cuerpo}</div>${pie ? `<footer>${pie}</footer>` : ""}</div>`;
  $$("#capa [data-cerrar]").forEach(b => b.onclick = cerrarCajon);
  const pri = $("#capa .cuerpo input, #capa .cuerpo select, #capa footer .btn"); (pri || $("#capa .icono")).focus();
}
function cerrarCajon(){ if ($("#capa").innerHTML) { $("#capa").innerHTML = ""; if (foco && document.contains(foco)) foco.focus(); } }
document.addEventListener("keydown", e => { if (e.key === "Escape") cerrarCajon(); });
function copiar(t){ try { navigator.clipboard.writeText(t).then(() => tostada("Copiado"), () => tostada(t)); } catch (e) { tostada(t); } }

entrar();
})();
