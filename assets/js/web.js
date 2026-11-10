/* La Valenciana · comportamiento común */
(function(){
  var b=document.body, root=document.documentElement;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function guardar(k,v){try{localStorage.setItem(k,v)}catch(e){}}

  // Letra grande (se recuerda en este navegador)
  var letra=document.querySelector('.boton-letra');
  if(letra){
    letra.setAttribute('aria-pressed',root.classList.contains('letra-grande')?'true':'false');
    letra.addEventListener('click',function(){
      var on=root.classList.toggle('letra-grande');
      letra.setAttribute('aria-pressed',on?'true':'false');
      guardar('lv-letra',on?'1':'0');
    });
  }

  // Menú en móvil
  var boton=document.querySelector('.boton-menu'), menu=document.getElementById('menu-principal');
  function cerrar(foco){ menu.classList.remove('abierto'); boton.setAttribute('aria-expanded','false'); boton.querySelector('.txt').textContent='Menú'; if(foco) boton.focus() }
  if(boton&&menu){
    boton.addEventListener('click',function(){
      var abierto=menu.classList.toggle('abierto');
      boton.setAttribute('aria-expanded',abierto?'true':'false');
      boton.querySelector('.txt').textContent=abierto?'Cerrar':'Menú';
      if(abierto){ var p=menu.querySelector('a'); if(p) p.focus() }
    });
    menu.addEventListener('click',function(e){ if(e.target.closest('a')) cerrar(false) });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&menu.classList.contains('abierto')) cerrar(true) });
    document.addEventListener('click',function(e){ if(menu.classList.contains('abierto')&&!e.target.closest('.cabecera')) cerrar(false) });
  }

  // Línea bajo la cabecera al hacer scroll
  var cab=document.querySelector('.cabecera');
  function borde(){ if(cab) cab.classList.toggle('con-borde', window.scrollY>8) }
  window.addEventListener('scroll',borde,{passive:true}); borde();

  // Abierto / cerrado ahora (hora de Madrid). Horario: L-S 10-14 y 17-21.
  var TRAMOS=[[600,840],[1020,1260]], DIAS=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
  function ahoraMadrid(){
    try{
      var f=new Intl.DateTimeFormat('es-ES',{timeZone:'Europe/Madrid',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());
      var o={}; f.forEach(function(p){o[p.type]=p.value});
      var d=['dom','lun','mar','mié','jue','vie','sáb'].indexOf(o.weekday.replace('.','').toLowerCase());
      if(d<0) throw 0; return {d:d,m:(+o.hour)*60+(+o.minute)};
    }catch(e){ var n=new Date(); return {d:n.getDay(),m:n.getHours()*60+n.getMinutes()} }
  }
  function hh(m){ return Math.floor(m/60)+':'+('0'+m%60).slice(-2) }
  var t=ahoraMadrid();
  document.querySelectorAll('[data-estado]').forEach(function(el){
    var txt, abierto=false;
    if(t.d!==0){ TRAMOS.forEach(function(r){ if(t.m>=r[0]&&t.m<r[1]){abierto=true; txt='Abierto ahora · cerramos a las '+hh(r[1])} }) }
    if(!abierto){
      if(t.d!==0&&t.m<TRAMOS[0][0]) txt='Cerrado ahora · abrimos hoy a las 10:00';
      else if(t.d!==0&&t.m>=TRAMOS[0][1]&&t.m<TRAMOS[1][0]) txt='Cerrado ahora · abrimos hoy a las 17:00';
      else { var sig=(t.d+1)%7; if(sig===0) sig=1; txt='Cerrado ahora · abrimos el '+DIAS[sig]+' a las 10:00' }
    }
    el.classList.add(abierto?'abierto':'cerrado');
    el.querySelector('.estado-txt').textContent=txt;
  });
  document.querySelectorAll('.tabla-horario tr[data-dia]').forEach(function(tr){
    if(+tr.getAttribute('data-dia')===t.d){ tr.classList.add('hoy'); var th=tr.querySelector('th'); th.insertAdjacentHTML('beforeend',' <span class="marca-hoy">Hoy</span>') }
  });

  // Índice de subsecciones: marca la activa
  var enlaces=document.querySelectorAll('.indice a');
  if(enlaces.length&&'IntersectionObserver' in window){
    var mapa={}; enlaces.forEach(function(a){mapa[a.getAttribute('href').slice(1)]=a});
    var obs=new IntersectionObserver(function(entradas){
      entradas.forEach(function(en){ if(en.isIntersecting){ enlaces.forEach(function(a){a.classList.remove('activo');a.removeAttribute('aria-current')}); var a=mapa[en.target.id]; if(a){a.classList.add('activo'); a.setAttribute('aria-current','location'); var ul=a.closest('ul'); ul.scrollTo({left:a.parentNode.offsetLeft-ul.offsetLeft-8,behavior:'smooth'})} } });
    },{rootMargin:'-45% 0px -50% 0px'});
    document.querySelectorAll('.subseccion').forEach(function(s){obs.observe(s)});
  }

  // ---------- Cesta ----------
  var CLAVE='lv-cesta', cesta={};
  try{ cesta=JSON.parse(localStorage.getItem(CLAVE)||'{}')||{} }catch(e){ cesta={} }
  var flot=document.querySelector('.cesta-flotante'), dlg=document.getElementById('cesta'), aviso=document.querySelector('.aviso-cesta');
  var eur=new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'});
  function items(){ return Object.keys(cesta).map(function(k){var x=cesta[k];x.id=k;return x}) }
  function unidades(){ return items().reduce(function(a,x){return a+x.q},0) }
  function total(){ return items().reduce(function(a,x){return a+x.q*x.p},0) }
  function guardarCesta(){ guardar(CLAVE,JSON.stringify(cesta)) }
  function texto(n){ return n===1?'1 producto':n+' productos' }
  function pintar(nuevo){
    var n=unidades();
    if(flot){
      var antes=flot.hidden; flot.hidden=n===0;
      flot.querySelector('.contador').textContent=n;
      flot.querySelector('.cesta-resumen').textContent=': '+texto(n)+', '+eur.format(total());
      if(!reduce&&n>0){ if(antes){ flot.classList.remove('aparece'); void flot.offsetWidth; flot.classList.add('aparece') } else if(nuevo){ flot.classList.remove('late'); void flot.offsetWidth; flot.classList.add('late') } }
    }
    document.querySelectorAll('.anadir').forEach(function(bt){
      var x=cesta[bt.getAttribute('data-id')]; bt.classList.toggle('en-cesta',!!x);
      bt.querySelector('.txt').textContent=x?('Añadir otro ('+x.q+' en la cesta)'):'Añadir a la cesta';
    });
    if(!dlg) return;
    dlg.classList.toggle('vacia',n===0);
    var ul=dlg.querySelector('.cesta-lista'); ul.innerHTML='';
    items().forEach(function(x){
      var li=document.createElement('li');
      li.innerHTML='<div><div class="nombre"></div><div class="detalle"></div></div><div class="subtotal"></div>'+
        '<div class="cantidad" role="group"><button type="button" class="control menos"></button><output aria-live="polite"></output><button type="button" class="control mas"></button><button type="button" class="control quitar">Quitar</button></div>';
      li.querySelector('.nombre').textContent=x.n;
      li.querySelector('.detalle').textContent=x.d+' · '+eur.format(x.p)+' la unidad';
      li.querySelector('.subtotal').textContent=eur.format(x.p*x.q);
      li.querySelector('.cantidad').setAttribute('aria-label','Cantidad de '+x.n);
      li.querySelector('output').textContent=x.q;
      var m=li.querySelector('.menos'); m.textContent='−'; m.setAttribute('aria-label','Quitar uno de '+x.n);
      var p=li.querySelector('.mas'); p.textContent='+'; p.setAttribute('aria-label','Añadir uno de '+x.n);
      li.querySelector('.quitar').setAttribute('aria-label','Quitar '+x.n+' de la cesta');
      m.onclick=function(){ cambiar(x.id,-1,m) }; p.onclick=function(){ cambiar(x.id,1,p) };
      li.querySelector('.quitar').onclick=function(){ delete cesta[x.id]; guardarCesta(); pintar(); avisar(x.n+' quitado de la cesta'); enfocarTrasBorrar() };
      li.setAttribute('data-id',x.id); ul.appendChild(li);
    });
    dlg.querySelector('.cesta-importe').textContent=eur.format(total());
    actualizarEnvio();
  }
  function enfocarTrasBorrar(){ var b=dlg.querySelector('.cesta-lista .mas')||dlg.querySelector('.cerrar-cesta'); if(b) b.focus() }
  function cambiar(id,d,boton){
    var x=cesta[id]; if(!x) return; x.q+=d;
    var nombre=x.n;
    if(x.q<=0){ delete cesta[id]; guardarCesta(); pintar(); avisar(nombre+' quitado de la cesta'); enfocarTrasBorrar(); return }
    guardarCesta(); pintar();
    var li=dlg.querySelector('li[data-id="'+id+'"]'); if(li){ var b=li.querySelector(d>0?'.mas':'.menos'); if(b) b.focus() }
  }
  var tAviso;
  function avisar(t){ if(!aviso) return; aviso.textContent=t; aviso.classList.add('visible'); clearTimeout(tAviso); tAviso=setTimeout(function(){aviso.classList.remove('visible')},2600) }
  document.querySelectorAll('.anadir').forEach(function(bt){
    bt.addEventListener('click',function(){
      var id=bt.getAttribute('data-id');
      if(!cesta[id]) cesta[id]={n:bt.getAttribute('data-nombre'),d:bt.getAttribute('data-detalle'),p:+bt.getAttribute('data-precio'),s:bt.getAttribute('data-seccion'),q:0};
      cesta[id].q++; guardarCesta(); pintar(true);
      avisar('Añadido a la cesta: '+cesta[id].n+'. Tienes '+texto(unidades())+'.');
    });
  });
  function mensaje(){
    var f=dlg.querySelector('.cesta-form'), nombre=f.nombre.value.trim(), notas=f.notas.value.trim();
    var l=['Hola, La Valenciana. Quiero hacer este pedido para recoger en la tienda:',''];
    items().forEach(function(x){ l.push('- '+x.q+' × '+x.n+' ('+x.d+') · '+eur.format(x.p*x.q)) });
    l.push('','Total orientativo: '+eur.format(total()));
    if(notas) l.push('Indicaciones: '+notas);
    if(nombre) l.push('Nombre: '+nombre);
    l.push('','¿Me confirmáis disponibilidad? Gracias.');
    return l.join('\n');
  }
  function actualizarEnvio(){
    if(!dlg||!items().length) return;
    var m=mensaje(), secs={}; items().forEach(function(x){secs[x.s]=1});
    var para=secs.complementos&&!secs.merceria?dlg.getAttribute('data-correo-c'):dlg.getAttribute('data-correo-m');
    var cc=secs.complementos&&secs.merceria?'&cc='+dlg.getAttribute('data-correo-c'):'';
    dlg.querySelector('.enviar-wa').href='https://wa.me/'+dlg.getAttribute('data-wa')+'?text='+encodeURIComponent(m);
    dlg.querySelector('.enviar-correo').href='mailto:'+para+'?subject='+encodeURIComponent('Pedido para recoger en tienda')+cc+'&body='+encodeURIComponent(m);
  }
  if(dlg){
    var ultimoFoco=null;
    function abrir(){ ultimoFoco=document.activeElement; pintar(); if(dlg.showModal) dlg.showModal(); else dlg.setAttribute('open',''); var t=dlg.querySelector('.cerrar-cesta'); if(t) t.focus() }
    function cerrarCesta(){ if(dlg.close) dlg.close(); else dlg.removeAttribute('open') }
    dlg.addEventListener('close',function(){ if(ultimoFoco&&ultimoFoco.focus) ultimoFoco.focus() });
    if(flot) flot.addEventListener('click',abrir);
    dlg.querySelector('.cerrar-cesta').addEventListener('click',cerrarCesta);
    dlg.addEventListener('click',function(e){ if(e.target===dlg) cerrarCesta() });
    dlg.querySelector('.cesta-form').addEventListener("input",actualizarEnvio);
    dlg.querySelector('.vaciar').addEventListener('click',function(){ if(confirm('¿Vaciar la cesta?')){ cesta={}; guardarCesta(); pintar(); avisar('La cesta está vacía.'); dlg.querySelector('.cerrar-cesta').focus() } });
    window.addEventListener('storage',function(e){ if(e.key===CLAVE){ try{cesta=JSON.parse(e.newValue||'{}')||{}}catch(_){cesta={}} pintar() } });
  }
  pintar();

  // La caja: solo decoración. Todo el contenido está visible desde el principio.
  if(!b.classList.contains('con-caja')) return;
  var visto=false; try{visto=localStorage.getItem('lv-caja')==='1'}catch(e){}
  var k=visto?0.45:1; root.style.setProperty('--t',k);
  if(reduce||location.hash||window.scrollY>200){ b.classList.add('entrada','fase-abierta','fase-sale','fase-abanico'); return }
  [['entrada',50],['fase-abierta',700*k],['fase-sale',1700*k],['fase-abanico',2500*k]].forEach(function(f){
    setTimeout(function(){ b.classList.add(f[0]) }, f[1]);
  });
  guardar('lv-caja','1');
})();
