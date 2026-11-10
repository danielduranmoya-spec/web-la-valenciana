/* La Valenciana · comportamiento común */
(function(){
  var b=document.body, root=document.documentElement;
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

  // La caja: solo decoración. Todo el contenido está visible desde el principio.
  if(!b.classList.contains('con-caja')) return;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var visto=false; try{visto=localStorage.getItem('lv-caja')==='1'}catch(e){}
  var k=visto?0.45:1; root.style.setProperty('--t',k);
  if(reduce||location.hash||window.scrollY>200){ b.classList.add('entrada','fase-abierta','fase-sale','fase-abanico'); return }
  [['entrada',50],['fase-abierta',700*k],['fase-sale',1700*k],['fase-abanico',2500*k]].forEach(function(f){
    setTimeout(function(){ b.classList.add(f[0]) }, f[1]);
  });
  guardar('lv-caja','1');
})();
