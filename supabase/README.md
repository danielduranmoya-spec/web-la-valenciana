# Supabase · base de datos de la tienda y del panel

- Proyecto: `https://stcgilzvgfyiqmdljhgn.supabase.co` (región UE).
- `instalar.sql`: tablas, permisos (RLS), funciones `crear_pedido()` y `cancelar_pedido()` y el catálogo inicial.
  Se pega entero en *SQL Editor → New query → Run*. Se puede repetir sin estropear nada.
- La tienda usa solo la clave pública (*publishable*). La clave *secret / service_role* nunca va en el repositorio.
- Administradores: tabla `admins` (roles `admin`, `pedidos`, `consulta`). El registro público está desactivado:
  a cada persona se la crea en *Authentication → Users* y se añade a `admins`.

## Panel de administración

- Dirección: `/trastienda/` (p. ej. https://danielduranmoya-spec.github.io/web-la-valenciana/trastienda/). No sale en buscadores (`noindex`).
- Código: `trastienda/index.html`, `assets/trastienda/panel.js` y `panel.css`. Librería supabase-js 2.45.4 copiada en `assets/trastienda/` (sin CDN).
- La tienda lee precios, stock, visibilidad, ofertas, productos nuevos y ajustes al arrancar (`assets/tienda/js/remoto.js`).
  Si la base no responde en 3 s, usa `datos.js` tal cual. Cada pedido se registra con `crear_pedido()`.
- `actualizar-1.sql` (16-11-2026): fotos (carpeta pública `fotos` en Storage y columna `productos.fotos`), funciones para gestionar
  accesos desde el panel (`lista_admins`, `usuarios_pendientes`, `dar_acceso`, `quitar_acceso`), solo la administración cambia ajustes,
  y ajustes nuevos `contacto` y `pago` (Client ID público de PayPal y modo de prueba). Ya va incluido al final de `instalar.sql`.
- Accesos: la persona crea su cuenta en /trastienda/ («Soy del equipo y aún no tengo cuenta») y la administración se la aprueba en
  *Ajustes → Quién puede entrar*. Requiere *Authentication → Sign In / Providers → Allow new users to sign up* activado: crear cuenta no da
  acceso a nada hasta que la administración lo aprueba. Roles: `admin` (todo), `pedidos` (pedidos, stock, productos y ofertas), `consulta` (solo ver).
- Para la recuperación de contraseña, en *Authentication → URL Configuration → Redirect URLs* debe estar
  `https://danielduranmoya-spec.github.io/web-la-valenciana/**`.
- `actualizar-2.sql` (16-11-2026): función `comprobar_codigo()` para la casilla de código de descuento de la cesta, y avisos por
  correo: activa `pg_net`, añade `pedidos.avisado` y `productos.aviso_stock`, y dos disparadores que llaman a la función `avisos`
  cuando entra un pedido (salvo los hechos en la tienda) o cuando un producto cruza su mínimo o se agota. Ajuste nuevo `avisos`
  `{correo, pedidos, stock}`, que se cambia en el panel. Ya va incluido al final de `instalar.sql`.

## Avisos por correo (función `avisos`)

Código en `funciones/avisos/index.ts`. Envía con [Resend](https://resend.com) (gratis hasta 3.000 correos al mes).

1. Crear cuenta en resend.com con el correo donde se quieren recibir los avisos. *API Keys → Create API key* (permiso «Sending access»).
   Sin dominio propio verificado, Resend solo entrega al correo de la cuenta: ese debe ser el de «Enviar los avisos a» en el panel.
   Para enviar a otros correos, verificar el dominio `lavalencianamerceria.com` en *Domains* y poner en el ajuste `avisos`
   `"remitente": "La Valenciana <avisos@lavalencianamerceria.com>"`.
2. Supabase → *Edge Functions → Deploy a new function → Via Editor*. Nombre `avisos`; pegar `funciones/avisos/index.ts`; *Deploy*.
3. En la función → *Details*: desactivar *Enforce JWT verification* (la llama la base de datos; solo acepta referencias reales y no repite avisos).
4. *Edge Functions → Secrets → Add new secret*: `RESEND_API_KEY` = la clave de Resend. (`SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` ya existen.)
5. Ejecutar `actualizar-2.sql` en el SQL Editor.
6. Panel → *Ajustes → Avisos por correo → Enviar un correo de prueba*.
