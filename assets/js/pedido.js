/* La Valenciana · página de pago (PayPal: tarjeta y PayPal). Requiere catalogo.js y pago-config.js */
(function(){
  var cfg=window.LV_PAGO||{}, CAT=window.LV_CATALOGO||{};
  var raiz=document.querySelector('.pedido-pagina'); if(!raiz) return;
  var form=raiz.querySelector('.pedido-form'), rejilla=raiz.querySelector('.pedido-rejilla'), vacio=raiz.querySelector('.pedido-vacio');
  var estado=raiz.querySelector('.pago-estado'), cont=document.getElementById('pago-botones'), alt=raiz.querySelector('.pago-alternativa');
  var errores=raiz.querySelector('.resumen-errores'), ok=raiz.querySelector('.pedido-ok');
  var eur=new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'});
  var WA='34633930935', ENV=window.LV_ENVIO||{gratis:50,precio:4.95};
  var bloqueTarjeta=raiz.querySelector('.bloque-tarjeta'), bloqueBizum=raiz.querySelector('.bloque-bizum'), dirBox=raiz.querySelector('.direccion');
  function leerCesta(){ try{ return JSON.parse(localStorage.getItem('lv-cesta')||'{}')||{} }catch(e){ return {} } }

  // Líneas del pedido con precios del catálogo (no se fía del precio guardado en el navegador)
  function lineas(){
    var c=leerCesta(), out=[];
    Object.keys(c).forEach(function(id){
      var p=CAT[id], q=Math.max(0,Math.min(99,parseInt(c[id].q,10)||0));
      if(p&&q>0&&p.st!=='agotado') out.push({id:id,n:p.n,d:p.d,c:Math.round(p.p*100),q:q});
    });
    return out;
  }
  function centimos(ls){ return ls.reduce(function(a,l){return a+l.c*l.q},0) }
  function dec(c){ return (c/100).toFixed(2) }
  function entrega(){ var r=form.querySelector('input[name=entrega]:checked'); return r?r.value:'tienda' }
  function metodo(){ var r=form.querySelector('input[name=metodo]:checked'); return r?r.value:'tarjeta' }
  function envioC(ls){ if(entrega()!=='envio') return 0; return centimos(ls)>=ENV.gratis*100?0:Math.round(ENV.precio*100) }
  function totalC(ls){ return centimos(ls)+envioC(ls) }

  function pintarLista(ul,ls){
    ul.innerHTML='';
    ls.forEach(function(l){
      var li=document.createElement('li');
      li.innerHTML='<span class="r-cant num"></span><span class="r-nombre"><span></span><small></small></span><span class="r-precio num"></span>';
      li.querySelector('.r-cant').textContent=l.q+' ×';
      li.querySelector('.r-nombre span').textContent=l.n;
      li.querySelector('.r-nombre small').textContent=l.d;
      li.querySelector('.r-precio').textContent=eur.format(l.c*l.q/100);
      ul.appendChild(li);
    });
  }
  function pintar(){
    if(!ok.hidden) return;
    var ls=lineas(), vacia=!ls.length;
    vacio.hidden=!vacia; rejilla.hidden=vacia;
    pintarLista(raiz.querySelector('.pedido-resumen .resumen-lista'),ls);
    raiz.querySelector('.r-subtotal').textContent=eur.format(centimos(ls)/100);
    var envio=entrega()==='envio', ec=envioC(ls);
    raiz.querySelector('.r-envio-txt').textContent=envio?'Envío a domicilio':'Recogida en tienda';
    raiz.querySelector('.r-envio').textContent=ec?eur.format(ec/100):'Gratis';
    raiz.querySelector('.r-total').textContent=eur.format(totalC(ls)/100);
    var falta=ENV.gratis*100-centimos(ls), rf=raiz.querySelector('.r-falta');
    rf.textContent=falta>0?('Te faltan '+eur.format(falta/100)+' para el envío gratis.'):'Envío gratis a domicilio incluido.';
    var pe=raiz.querySelector('.precio-envio'); if(pe) pe.textContent=falta>0?eur.format(ENV.precio):'Gratis';
    var waP=raiz.querySelector('.enviar-wa-pedido'); if(waP) waP.href=enlaceWA(ls,null);
  }
  document.addEventListener('lv-cesta',pintar);
  window.addEventListener('storage',function(e){ if(e.key==='lv-cesta') pintar() });

  function datos(){ return {nombre:form.nombre.value.trim(),email:form.email.value.trim(),tel:form.telefono.value.replace(/[\s.-]/g,''),notas:form.notas.value.trim(),entrega:entrega(),dir:form.direccion.value.trim(),cp:form.cp.value.trim(),loc:form.localidad.value.trim(),prov:form.provincia.value.trim()} }
  function textoEntrega(d){ return d.entrega==='envio'?('Envío a: '+d.dir+', '+d.cp+' '+d.loc+' ('+d.prov+')'):'Recogida en la tienda' }
  function enlaceWA(ls,num){
    var d=datos(), l=[num?('Hola, La Valenciana. He pagado el pedido '+num+' en la web:'):'Hola, La Valenciana. Quiero hacer este pedido:',''];
    ls.forEach(function(x){ l.push('- '+x.q+' × '+x.n+' ('+x.d+') · '+eur.format(x.c*x.q/100)) });
    var ec=envioC(ls); if(d.entrega==='envio') l.push('Envío: '+(ec?eur.format(ec/100):'gratis'));
    l.push('','Total: '+eur.format(totalC(ls)/100));
    l.push(textoEntrega(d));
    if(d.nombre) l.push('Nombre: '+d.nombre); if(d.tel) l.push('Teléfono: '+d.tel); if(d.email) l.push('Correo: '+d.email); if(d.notas) l.push('Indicaciones: '+d.notas);
    return 'https://wa.me/'+WA+'?text='+encodeURIComponent(l.join('\n'));
  }

  // Validación accesible
  var reglas=[
    ['nombre',function(v){return v.trim().length>=3},'Escribe tu nombre y apellidos.'],
    ['email',function(v){return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())},'Escribe un correo válido, por ejemplo nombre@correo.com.'],
    ['telefono',function(v){return /^(\+34|0034)?[6789]\d{8}$/.test(v.replace(/[\s.-]/g,''))},'Escribe un teléfono de 9 cifras, por ejemplo 600 123 456.'],
    ['direccion',function(v){return entrega()!=='envio'||v.trim().length>=5},'Escribe la dirección de entrega.'],
    ['cp',function(v){ if(entrega()!=='envio') return true; v=v.trim(); return /^\d{5}$/.test(v)&&+v.slice(0,2)>=1&&+v.slice(0,2)<=50&&['07','35','38'].indexOf(v.slice(0,2))<0 },'Escribe un código postal de 5 cifras de la Península.'],
    ['localidad',function(v){return entrega()!=='envio'||v.trim().length>=2},'Escribe la localidad.'],
    ['provincia',function(v){return entrega()!=='envio'||v.trim().length>=2},'Escribe la provincia.'],
    ['acepto',function(v,el){return el.checked},'Marca la casilla para aceptar las condiciones de venta.']
  ];
  var tocado=false;
  function validar(mostrar){
    var fallos=[];
    reglas.forEach(function(r){
      var el=form.elements[r[0]], bien=r[1](el.value,el), err=document.getElementById(el.getAttribute('aria-describedby').split(' ').pop());
      if(mostrar||tocado){ el.setAttribute('aria-invalid',bien?'false':'true'); err.textContent=bien?'':r[2] }
      if(!bien) fallos.push({el:el,msg:r[2]});
    });
    if(mostrar){
      var ul=errores.querySelector('ul'); ul.innerHTML='';
      fallos.forEach(function(f){ var li=document.createElement('li'), a=document.createElement('a'); a.href='#'+f.el.id; a.textContent=f.msg; a.onclick=function(e){e.preventDefault();f.el.focus()}; li.appendChild(a); ul.appendChild(li) });
      errores.hidden=!fallos.length; if(fallos.length){ errores.focus(); tocado=true }
    }
    return fallos.length===0;
  }
  form.addEventListener('input',function(){ if(tocado) validar(false); actualizarBotones(); pintar() });
  form.addEventListener('change',function(e){
    if(e.target.name==='entrega'){ dirBox.hidden=entrega()!=='envio'; pintar() }
    if(e.target.name==='metodo'){ var b=metodo()==='bizum'; bloqueBizum.hidden=!b; bloqueTarjeta.hidden=b; decir('') }
    if(tocado) validar(false); actualizarBotones() });
  raiz.querySelector('.confirmar-bizum').addEventListener('click',function(){
    if(!lineas().length){ decir('Tu cesta está vacía.','mal'); return }
    if(!validar(true)){ decir('Antes de enviar el pedido, completa tus datos.','mal'); return }
    var ls=lineas(), dt=datos(), num=referencia(), url=enlaceWA(ls,null).replace(encodeURIComponent('Quiero hacer este pedido'),encodeURIComponent('Pedido '+num+' (pago con Bizum)'));
    var r={num:num,id:'',tel:dt.tel,total:totalC(ls),ls:ls,nombre:dt.nombre,notas:dt.notas,metodo:'bizum',entrega:dt.entrega,wa:url};
    try{ sessionStorage.setItem('lv-ultimo-pedido',JSON.stringify(r)) }catch(e){}
    window.open(url,'_blank','noopener');
    if(window.LVCesta) LVCesta.vaciar(); else try{ localStorage.removeItem('lv-cesta') }catch(e){}
    confirmar(r);
  });
  form.addEventListener('submit',function(e){ e.preventDefault(); validar(true) });

  // Pasarela
  var acciones=null;
  function actualizarBotones(){ if(!acciones) return; if(validar(false)) acciones.enable(); else acciones.disable() }
  function decir(t,tipo){ estado.textContent=t; estado.className='pago-estado'+(tipo?' '+tipo:'') }
  function fallo(){ decir('No se ha podido cargar la pasarela de pago. Comprueba tu conexión e inténtalo de nuevo.','mal'); alt.hidden=false }
  if(cfg.prueba) raiz.querySelector('.aviso-prueba').hidden=false;

  function referencia(){ var d=new Date(); return 'LV-'+String(d.getFullYear()).slice(2)+('0'+(d.getMonth()+1)).slice(-2)+('0'+d.getDate()).slice(-2)+'-'+Math.random().toString(36).slice(2,6).toUpperCase() }
  function botones(){
    if(!window.paypal||!paypal.Buttons){ fallo(); return }
    var ref=null;
    paypal.Buttons({
      style:{layout:'vertical',shape:'pill',color:'black',label:'pay',height:52,tagline:false},
      onInit:function(d,a){ acciones=a; actualizarBotones() },
      onClick:function(d,a){
        if(!lineas().length){ decir('Tu cesta está vacía.','mal'); return a.reject() }
        if(!validar(true)){ decir('Antes de pagar, completa tus datos.','mal'); return a.reject() }
        decir(''); return a.resolve();
      },
      createOrder:function(d,a){
        var ls=lineas(), sub=centimos(ls), env=envioC(ls), total=sub+env, dt=datos(); ref=referencia();
        var mon=cfg.moneda||'EUR', bd={item_total:{currency_code:mon,value:dec(sub)}}; if(dt.entrega==='envio') bd.shipping={currency_code:mon,value:dec(env)};
        var pu={};
        if(dt.entrega==='envio') pu.shipping={name:{full_name:dt.nombre.slice(0,300)},address:{address_line_1:dt.dir.slice(0,300),admin_area_2:dt.loc.slice(0,120),admin_area_1:dt.prov.slice(0,300),postal_code:dt.cp,country_code:'ES'}};
        return a.order.create({
          intent:'AUTHORIZE',
          purchase_units:[{
            reference_id:ref, invoice_id:ref,
            description:((dt.entrega==='envio'?'Envío':'Recogida en tienda')+' · '+dt.nombre+' · '+dt.tel).slice(0,127),
            shipping:pu.shipping,
            custom_id:(dt.email+' | '+dt.notas).slice(0,127),
            amount:{currency_code:mon,value:dec(total),breakdown:bd},
            items:ls.map(function(l){ return {name:l.n.slice(0,127),description:l.d.slice(0,127),sku:l.id.slice(0,127),quantity:String(l.q),category:'PHYSICAL_GOODS',unit_amount:{currency_code:cfg.moneda||'EUR',value:dec(l.c)}} })
          }],
          application_context:{brand_name:'La Valenciana',locale:'es-ES',shipping_preference:dt.entrega==='envio'?'SET_PROVIDED_ADDRESS':'NO_SHIPPING',user_action:'CONTINUE'}
        });
      },
      onApprove:function(d,a){
        decir('Confirmando el pago…');
        return a.order.authorize().then(function(det){
          var pay=det&&det.purchase_units&&det.purchase_units[0].payments, au=pay&&pay.authorizations&&pay.authorizations[0];
          if(!(det.status==='COMPLETED'||(au&&(au.status==='CREATED'||au.status==='PENDING')))){ decir('El pago no se ha completado. No se ha cobrado nada; inténtalo de nuevo.','mal'); return }
          var ls=lineas(), dt=datos(), r={num:ref||det.id,id:det.id,tel:dt.tel,total:totalC(ls),ls:ls,nombre:dt.nombre,notas:dt.notas,metodo:'tarjeta',entrega:dt.entrega};
          try{ sessionStorage.setItem('lv-ultimo-pedido',JSON.stringify(r)) }catch(e){}
          if(window.LVCesta) LVCesta.vaciar(); else try{ localStorage.removeItem('lv-cesta') }catch(e){}
          confirmar(r);
        });
      },
      onCancel:function(){ decir('Has cancelado el pago. No se ha cobrado nada y tu cesta sigue guardada.') },
      onError:function(){ decir('Ha habido un problema con el pago y no se ha cobrado nada. Inténtalo otra vez o pide por WhatsApp.','mal'); alt.hidden=false }
    }).render(cont).catch(fallo);
  }
  function confirmar(r){
    rejilla.hidden=true; vacio.hidden=true; ok.hidden=false;
    raiz.querySelector('.progreso li[aria-current]').removeAttribute('aria-current');
    raiz.querySelectorAll('.progreso li').forEach(function(li){li.classList.add('hecho')});
    raiz.querySelector('.progreso li:last-child').setAttribute('aria-current','step');
    ok.querySelector('.ok-numero').textContent=r.num;
    var lugar=r.entrega==='envio'?'te lo enviamos y te mandamos el número de seguimiento':'te avisamos al '+r.tel+' para que lo recojas en Plaza de Espronceda 2';
    ok.querySelector('.ok-texto').textContent=r.metodo==='bizum'
      ?('Si no se ha abierto WhatsApp, pulsa «Enviar el pedido por WhatsApp». Comprobamos que tenemos todo y te confirmamos el total; entonces haces el Bizum indicando el número de pedido. Después '+lugar+'.')
      :('Hemos reservado el importe en tu tarjeta, pero no se cobra hasta que comprobemos que tenemos todo. Si falta algo, te avisamos antes. Después '+lugar+'. PayPal te enviará el justificante por correo.');
    pintarLista(ok.querySelector('.ok-lista'),r.ls);
    ok.querySelector('.ok-total').textContent=(r.metodo==='bizum'?'Total a pagar: ':'Total: ')+eur.format(r.total/100);
    var l=['Hola, La Valenciana. He hecho el pedido '+r.num+' en la web'+(r.id?' (PayPal '+r.id+')':'')+'.','Nombre: '+r.nombre,'Teléfono: '+r.tel]; if(r.notas) l.push('Indicaciones: '+r.notas);
    var bw=ok.querySelector('.ok-wa'); bw.href=r.wa||('https://wa.me/'+WA+'?text='+encodeURIComponent(l.join('\n')));
    bw.lastChild.textContent=r.metodo==='bizum'?'Enviar el pedido por WhatsApp':'Avisarnos por WhatsApp';
    document.title='Pedido recibido · La Valenciana';
    ok.focus(); window.scrollTo({top:0,behavior:'smooth'});
  }

  // ¿Volvemos de un pago ya hecho?
  var previo=null; try{ previo=JSON.parse(sessionStorage.getItem('lv-ultimo-pedido')||'null') }catch(e){}
  if(previo&&!lineas().length){ confirmar(previo); return }
  pintar();
  if(!lineas().length) return;
  if(!cfg.clientId){ fallo(); return }
  decir('Cargando la pasarela de pago…');
  var sc=document.createElement('script');
  sc.src='https://www.paypal.com/sdk/js?client-id='+encodeURIComponent(cfg.clientId)+'&currency='+(cfg.moneda||'EUR')+'&intent=authorize&components=buttons&enable-funding=card&disable-funding=paylater,sepa,credit&locale=es_ES';
  sc.setAttribute('data-namespace','paypal');
  sc.onload=function(){ decir(''); botones() }; sc.onerror=fallo;
  document.head.appendChild(sc);
  // si se vacía la cesta mientras se paga, se recarga el estado
})();
