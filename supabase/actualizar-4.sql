-- =====================================================================
-- La Valenciana · actualización 4 de la base de datos (23-11-2026)
-- 1. Da de alta el ovillo «100% Baby 3» de DMC (7 colores con foto real, carpeta de Drive «Web Valenciana»).
-- 2. OCULTA en la tienda todos los productos que aún no tienen foto real (ni fotos subidas en la trastienda
--    ni foto por color). No se borran: siguen en la trastienda y vuelven a verse en cuanto se les sube
--    una foto y se marcan como visibles.
-- Pegar entero en Supabase → SQL Editor → New query → Run. Se puede repetir sin problema.
-- =====================================================================

insert into productos (id,cat,sub,nombre,precio,icono,descripcion,variantes,tipo_var,medidas,tipo_medida,por_metro,precios,etiqueta,detalles,destacado,novedad,uds,umbral,orden) values ('baby-3','merceria','lanas','100% Baby 3 DMC 50 g',5.5,'ovillo','Lana merino extrafina superwash de DMC, pensada para la piel del bebé: no pica y se lava a máquina. Para chaquetitas, patucos, gorros y mantas.','[{"n": "Crudo", "c": "#F4EEE1", "foto": "assets/tienda/fotos/baby-3/crudo.webp"}, {"n": "Rosa", "c": "#F7CFCC", "foto": "assets/tienda/fotos/baby-3/rosa.webp"}, {"n": "Celeste", "c": "#BDD0DC", "foto": "assets/tienda/fotos/baby-3/celeste.webp"}, {"n": "Azul hielo", "c": "#BED3DE", "foto": "assets/tienda/fotos/baby-3/azul-hielo.webp"}, {"n": "Verde pistacho", "c": "#D4D9C1", "foto": "assets/tienda/fotos/baby-3/verde-pistacho.webp"}, {"n": "Gris perla", "c": "#DED8DF", "foto": "assets/tienda/fotos/baby-3/gris-perla.webp"}, {"n": "Beige", "c": "#D3CAC4", "foto": "assets/tienda/fotos/baby-3/beige.webp"}]'::jsonb,'color','[]'::jsonb,null,false,null,null,'["50 g, unos 165 m", "100 % lana merino extrafina superwash", "Agujas de 2,5 a 3,5 mm · ganchillo de 3 mm", "Una chaquetita de 6 meses lleva 2 ovillos"]'::jsonb,false,true,100,10,33)
on conflict (id) do update set variantes = excluded.variantes, descripcion = excluded.descripcion, detalles = excluded.detalles, visible = true;

update productos set visible = false
where coalesce(jsonb_array_length(fotos), 0) = 0
  and not exists (select 1 from jsonb_array_elements(coalesce(variantes, '[]'::jsonb)) v where v ? 'foto');
