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
- Para dar acceso a otra persona: créela en *Authentication → Users → Add user* y ejecute en *SQL Editor*:
  `insert into admins (user_id, nombre, rol) select id, 'Nombre', 'pedidos' from auth.users where email = 'correo@ejemplo.es';`
  Roles: `admin` (todo), `pedidos` (pedidos, stock y productos), `consulta` (solo ver).
- Para la recuperación de contraseña, en *Authentication → URL Configuration → Redirect URLs* debe estar
  `https://danielduranmoya-spec.github.io/web-la-valenciana/**`.
