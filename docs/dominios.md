# Conectar los dominios (más adelante)

Hoy la web está en https://danielduranmoya-spec.github.io/web-la-valenciana/. Los dos dominios están en Raiola Networks.

## Propuesta

- **lavalencianamerceria.com**: dominio principal de la web.
- **lavalencianacomplementos.com**: redirección a `https://lavalencianamerceria.com/complementos/`.

## Pasos

1. En GitHub: Settings → Pages → Custom domain → `lavalencianamerceria.com` → Save. Cuando esté verificado, activar «Enforce HTTPS».
2. En el DNS de Raiola, para `lavalencianamerceria.com`:
   - Registros A de `@` hacia 185.199.108.153, 185.199.109.153, 185.199.110.153 y 185.199.111.153.
   - Registro CNAME de `www` hacia `danielduranmoya-spec.github.io`.
3. En Raiola, crear para `lavalencianacomplementos.com` una redirección 301 hacia `https://lavalencianamerceria.com/complementos/`.
4. Cambiar en el código:
   - En `404.html` (y en `docs/generar.py`, variable `base`), `/web-la-valenciana/` por `/`.
   - En `sitemap.xml` y `robots.txt`, la dirección de github.io por `https://lavalencianamerceria.com`.

Los correos (administracion@, pedidos@) dependen de los registros MX, que no se tocan.
