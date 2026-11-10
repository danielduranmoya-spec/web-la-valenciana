/* La Valenciana · página de pago (PayPal: tarjeta y PayPal). Requiere catalogo.js y pago-config.js */
(function(){
  var cfg=window.LV_PAGO||{}, CAT=window.LV_CATALOGO||{};
  var raiz=document.querySelector('.pedido-pagina'); if(!raiz) return;
  var form=raiz.querySelector('.pedido-form'), rejilla=raiz.querySelector('.pedido-rejilla'), vacio=raiz.querySelector('.pedido-vacio');
  var estado=raiz.querySelector('.pago-estado'), cont=document.getElementById('pago-botones'), alt=raiz.querySelector('.pago-alternativa');
  var errores=raiz.querySelector('.resumen-errores'), ok=raiz.querySelector('.pedido-ok');
  var eur=new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'});
  var WA='34633930935';
  function leerCesta(){ try{ return JSON.parse(localStorage.getItem('lv-cesta')||'{}')||{} }catch(e){ return {} } }

  // Líneas del pedido con precios del catálogo (no se fía del precio guardado en el navegador)
  function lineas(){
    var c=leerCesta(), out=[];
    Object.keys(c).forEach(function(id){
      var p=CAT[id], q=Math.max(0,Math.min(99,parseInt(c[id].q,10)||0));
      if(p&&q>0) out.push({id:id,n:p.n,d:p.d,c:Math.round(p.p*100),q:q});
    });
    return out;
  }
  function centimos(ls){ return ls.reduce(function(a,l){return a+l.c*l.q},0) }
  function dec(c){ return (c/100).toFixed(2) }

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
    var t=eur.format(centimos(ls)/100);
    raiz.querySelector('.r-subtotal').textContent=t; raiz.querySelector('.r-total').textContent=t;
    var waP=raiz.querySelector('.enviar-wa-pedido'); if(waP) waP.href=enlaceWA(ls,null);
  }
  document.addEventListener('lv-cesta',pintar);
  window.addEventListener('storage',function(e){ if(e.key==='lv-cesta') pintar() });

  function datos(){ return {nombre:form.nombre.value.trim(),email:form.email.value.trim(),tel:form.telefono.value.replace(/[\s.-]/g,''),notas:form.notas.value.trim()} }
  function enlaceWA(ls,num){
    var d=datos(), l=[num?('Hola, La Valenciana. He pagado el pedido '+num+' en la web:'):'Hola, La Valenciana. Quiero hacer este pedido para recoger en la tienda:',''];
    ls.forEach(function(x){ l.push('- '+x.q+' × '+x.n+' ('+x.d+') · '+eur.format(x.c*x.q/100)) });
    l.push('','Total: '+eur.format(centimos(ls)/100));
    if(d.nombre) l.push('Nombre: '+d.nombre); if(d.tel) l.push('Teléfono: '+d.tel); if(d.notas) l.push('Indicaciones: '+d.notas);
    return 'https://wa.me/'+WA+'?text='+encodeURIComponent(l.join('\n'));
  }

  // Validación accesible
  var reglas=[
    ['nombre',function(v){return v.trim().length>=3},'Escribe tu nombre y apellidos.'],
    ['email',function(v){return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())},'Escribe un correo válido, por ejemplo nombre@correo.com.'],
    ['telefono',function(v){return /^(\+34|0034)?[6789]\d{8}$/.test(v.replace(/[\s.-]/g,''))},'Escribe un teléfono de 9 cifras, por ejemplo 600 123 456.'],
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
  form.addEventListener('change',function(){ if(tocado) validar(false); actualizarBotones() });
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
        var ls=lineas(), total=centimos(ls), dt=datos(); ref=referencia();
        return a.order.create({
          intent:'CAPTURE',
          purchase_units:[{
            reference_id:ref, invoice_id:ref,
            description:('Recogida en tienda · '+dt.nombre+' · '+dt.tel).slice(0,127),
            custom_id:(dt.email+' | '+dt.notas).slice(0,127),
            amount:{currency_code:cfg.moneda||'EUR',value:dec(total),breakdown:{item_total:{currency_code:cfg.moneda||'EUR',value:dec(total)}}},
            items:ls.map(function(l){ return {name:l.n.slice(0,127),description:l.d.slice(0,127),sku:l.id.slice(0,127),quantity:String(l.q),category:'PHYSICAL_GOODS',unit_amount:{currency_code:cfg.moneda||'EUR',value:dec(l.c)}} })
          }],
          application_context:{brand_name:'La Valenciana',locale:'es-ES',shipping_preference:'NO_SHIPPING',user_action:'PAY_NOW'}
        });
      },
      onApprove:function(d,a){
        decir('Confirmando el pago…');
        return a.order.capture().then(function(det){
          var cap=det&&det.purchase_units&&det.purchase_units[0].payments&&det.purchase_units[0].payments.captures&&det.purchase_units[0].payments.captures[0];
          if(det.status!=='COMPLETED'&&!(cap&&cap.status==='COMPLETED')){ decir('El pago no se ha completado. No se ha cobrado nada; inténtalo de nuevo.','mal'); return }
          var ls=lineas(), dt=datos(), r={num:ref||det.id,id:det.id,tel:dt.tel,total:centimos(ls),ls:ls,nombre:dt.nombre,notas:dt.notas};
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
    ok.querySelector('.ok-tel').textContent=r.tel;
    pintarLista(ok.querySelector('.ok-lista'),r.ls);
    ok.querySelector('.ok-total').textContent='Total pagado: '+eur.format(r.total/100);
    var l=['Hola, La Valenciana. He pagado el pedido '+r.num+' en la web (PayPal '+r.id+').','Nombre: '+r.nombre,'Teléfono: '+r.tel]; if(r.notas) l.push('Indicaciones: '+r.notas);
    ok.querySelector('.ok-wa').href='https://wa.me/'+WA+'?text='+encodeURIComponent(l.join('\n'));
    document.title='Pedido pagado · La Valenciana';
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
  sc.src='https://www.paypal.com/sdk/js?client-id='+encodeURIComponent(cfg.clientId)+'&currency='+(cfg.moneda||'EUR')+'&intent=capture&components=buttons&enable-funding=card&disable-funding=paylater,sepa,credit&locale=es_ES';
  sc.setAttribute('data-namespace','paypal');
  sc.onload=function(){ decir(''); botones() }; sc.onerror=fallo;
  document.head.appendChild(sc);
  // si se vacía la cesta mientras se paga, se recarga el estado
})();
