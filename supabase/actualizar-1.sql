-- =====================================================================
-- La Valenciana · actualización 1 de la base de datos (16-11-2026)
-- Fotos de productos, gestión de accesos desde el panel y ajustes nuevos.
-- Pegar entero en Supabase → SQL Editor → New query → Run. Se puede repetir sin problema.
-- =====================================================================

-- ---------- FOTOS DE PRODUCTOS ----------
alter table productos add column if not exists fotos jsonb not null default '[]';
grant select (fotos) on productos to anon;

-- Carpeta pública «fotos» (cualquiera puede VER las fotos; solo el equipo puede subir o borrar)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos', 'fotos', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 5242880, allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "fotos: el equipo sube" on storage.objects;
create policy "fotos: el equipo sube" on storage.objects for insert to authenticated
  with check (bucket_id = 'fotos' and public.puede_editar());
drop policy if exists "fotos: el equipo cambia" on storage.objects;
create policy "fotos: el equipo cambia" on storage.objects for update to authenticated
  using (bucket_id = 'fotos' and public.puede_editar());
drop policy if exists "fotos: el equipo borra" on storage.objects;
create policy "fotos: el equipo borra" on storage.objects for delete to authenticated
  using (bucket_id = 'fotos' and public.puede_editar());
drop policy if exists "fotos: el equipo ve" on storage.objects;
create policy "fotos: el equipo ve" on storage.objects for select to authenticated
  using (bucket_id = 'fotos');

-- ---------- ACCESOS (se gestionan desde el panel) ----------
create or replace function es_jefa() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where user_id = auth.uid() and rol = 'admin');
$$;

-- Personas con acceso, con su correo y su última entrada
create or replace function lista_admins()
returns table (user_id uuid, nombre text, rol text, email text, ultimo timestamptz)
language sql stable security definer set search_path = public, auth as $$
  select a.user_id, a.nombre, a.rol, u.email::text, u.last_sign_in_at
  from admins a join auth.users u on u.id = a.user_id
  where public.es_admin() order by a.nombre;
$$;

-- Cuentas creadas en el panel que aún no tienen acceso
create or replace function usuarios_pendientes()
returns table (user_id uuid, email text, creado timestamptz, confirmado boolean)
language sql stable security definer set search_path = public, auth as $$
  select u.id, u.email::text, u.created_at, u.email_confirmed_at is not null
  from auth.users u where public.es_jefa() and not exists (select 1 from admins a where a.user_id = u.id)
  order by u.created_at desc;
$$;

create or replace function dar_acceso(uid uuid, pnombre text, prol text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not es_jefa() then raise exception 'Solo la administración puede dar accesos.'; end if;
  if prol not in ('admin','pedidos','consulta') then raise exception 'Permiso no válido.'; end if;
  if uid = auth.uid() and prol <> 'admin' and (select count(*) from admins where rol = 'admin') <= 1 then
    raise exception 'Debe quedar al menos una persona con permiso de administración.'; end if;
  insert into admins (user_id, nombre, rol) values (uid, nullif(trim(pnombre),''), prol)
  on conflict (user_id) do update set nombre = coalesce(nullif(trim(excluded.nombre),''), admins.nombre), rol = excluded.rol;
end $$;

create or replace function quitar_acceso(uid uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not es_jefa() then raise exception 'Solo la administración puede quitar accesos.'; end if;
  if uid = auth.uid() then raise exception 'No puede quitarse el acceso a sí misma.'; end if;
  delete from admins where user_id = uid;
end $$;

revoke all on function lista_admins() from public, anon;
revoke all on function usuarios_pendientes() from public, anon;
revoke all on function dar_acceso(uuid,text,text) from public, anon;
revoke all on function quitar_acceso(uuid) from public, anon;
grant execute on function lista_admins(), usuarios_pendientes(), dar_acceso(uuid,text,text), quitar_acceso(uuid) to authenticated;

-- Solo la administración cambia ajustes y secciones (el resto del equipo, pedidos y productos)
drop policy if exists "admin escribe" on ajustes;
create policy "admin escribe" on ajustes for all to authenticated using (es_jefa()) with check (es_jefa());

-- ---------- AJUSTES NUEVOS (datos de contacto y cobros) ----------
insert into ajustes (clave, valor) values
  ('contacto', '{"tel":"924 67 08 39","whatsapp":"633 930 935","correo":"administracion@lavalencianamerceria.com","correoMerceria":"pedidos@lavalencianamerceria.com","correoComplementos":"pedidos@lavalencianacomplementos.com","calle":"Calle Moreno Nieto, 7","cp":"06200","ciudad":"Almendralejo","provincia":"Badajoz"}'::jsonb),
  ('pago', '{"clientId":"sb","prueba":true}'::jsonb)
on conflict (clave) do nothing;
