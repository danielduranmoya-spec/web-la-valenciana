# Supabase · base de datos de la tienda y del panel

- Proyecto: `https://stcgilzvgfyiqmdljhgn.supabase.co` (región UE).
- `instalar.sql`: tablas, permisos (RLS), funciones `crear_pedido()` y `cancelar_pedido()` y el catálogo inicial.
  Se pega entero en *SQL Editor → New query → Run*. Se puede repetir sin estropear nada.
- La tienda usa solo la clave pública (*publishable*). La clave *secret / service_role* nunca va en el repositorio.
- Administradores: tabla `admins` (roles `admin`, `pedidos`, `consulta`). El registro público está desactivado:
  a cada persona se la crea en *Authentication → Users* y se añade a `admins`.
