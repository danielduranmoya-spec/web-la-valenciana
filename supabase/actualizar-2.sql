-- =====================================================================
-- La Valenciana · actualización 2 de la base de datos (16-11-2026)
-- Códigos de descuento en la cesta y avisos por correo (pedidos nuevos y stock bajo).
-- Pegar entero en Supabase → SQL Editor → New query → Run. Se puede repetir sin problema.
-- Los avisos necesitan además la función «avisos» (ver supabase/README.md).
-- =====================================================================

-- ---------- CÓDIGOS DE DESCUENTO ----------
-- La tienda pregunta si un código existe y está en vigor. No ve la lista de códigos,
-- solo la respuesta para el código que escribe la clienta.
create or replace function comprobar_codigo(pcodigo text) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object('codigo', codigo, 'tipo', tipo, 'valor', valor) from codigos
  where codigo = upper(trim(pcodigo)) and activo and (hasta is null or hasta >= current_date);
$$;
revoke all on function comprobar_codigo(text) from public;
grant execute on function comprobar_codigo(text) to anon, authenticated;

-- ---------- AVISOS POR CORREO ----------
-- La base de datos llama a la función «avisos» (Edge Function) cuando entra un pedido
-- o cuando un producto baja de su mínimo. La función lee los datos y envía el correo.
create extension if not exists pg_net with schema extensions;

alter table pedidos   add column if not exists avisado boolean not null default false;
alter table productos add column if not exists aviso_stock timestamptz;

create or replace function avisar(cuerpo jsonb) returns void
language plpgsql security definer set search_path = public as $$
begin
  perform net.http_post(
    url := 'https://stcgilzvgfyiqmdljhgn.supabase.co/functions/v1/avisos',
    body := cuerpo,
    headers := '{"Content-Type":"application/json"}'::jsonb);
exception when others then
  null;  -- un aviso que falla nunca debe impedir un pedido
end $$;
revoke all on function avisar(jsonb) from public, anon, authenticated;

create or replace function aviso_pedido() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.canal <> 'tienda' then perform avisar(jsonb_build_object('tipo', 'pedido', 'ref', new.ref)); end if;
  return new;
end $$;
drop trigger if exists pedidos_aviso on pedidos;
create trigger pedidos_aviso after insert on pedidos for each row execute function aviso_pedido();

create or replace function aviso_stock() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  -- solo al cruzar el mínimo (o al agotarse), no en cada cambio
  if new.visible and ((new.uds <= new.umbral and old.uds > old.umbral) or (new.uds <= 0 and old.uds > 0)) then
    perform avisar(jsonb_build_object('tipo', 'stock', 'id', new.id));
  end if;
  return new;
end $$;
drop trigger if exists productos_aviso on productos;
create trigger productos_aviso after update of uds on productos for each row execute function aviso_stock();

-- A quién avisar (se cambia en el panel → Ajustes → Avisos por correo)
insert into ajustes (clave, valor) values
  ('avisos', '{"correo":"administracion@lavalencianamerceria.com","pedidos":true,"stock":true}'::jsonb)
on conflict (clave) do nothing;
