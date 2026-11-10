/* La Valenciana · comportamiento común */
(function(){
  var b=document.body, root=document.documentElement;

  // Menú en móvil
  var boton=document.querySelector('.boton-menu'), menu=document.getElementById('menu-principal');
  if(boton&&menu){
    boton.addEventListener('click',function(){
      var abierto=menu.classList.toggle('abierto');
      boton.setAttribute('aria-expanded',abierto?'true':'false');
      boton.textContent=abierto?'Cerrar':'Menú';
    });
    menu.addEventListener('click',function(e){ if(e.target.tagName==='A'){menu.classList.remove('abierto');boton.setAttribute('aria-expanded','false');boton.textContent='Menú'} });
  }

  // Línea bajo la cabecera al hacer scroll
  var cab=document.querySelector('.cabecera');
  function borde(){ if(cab) cab.classList.toggle('con-borde', window.scrollY>8) }
  window.addEventListener('scroll',borde,{passive:true}); borde();

  // Índice de subsecciones: marca la activa
  var enlaces=document.querySelectorAll('.indice a');
  if(enlaces.length&&'IntersectionObserver' in window){
    var mapa={}; enlaces.forEach(function(a){mapa[a.getAttribute('href').slice(1)]=a});
    var obs=new IntersectionObserver(function(entradas){
      entradas.forEach(function(en){ if(en.isIntersecting){ enlaces.forEach(function(a){a.classList.remove('activo')}); var a=mapa[en.target.id]; if(a){a.classList.add('activo'); a.scrollIntoView({block:'nearest',inline:'center'})} } });
    },{rootMargin:'-45% 0px -50% 0px'});
    document.querySelectorAll('.subseccion').forEach(function(s){obs.observe(s)});
  }

  // La caja
  if(!b.classList.contains('con-caja')) return;
  var tarjetas=document.querySelectorAll('.tarjeta');
  function activarTarjetas(){ tarjetas.forEach(function(a){a.removeAttribute('tabindex')}) }
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var visto=false; try{visto=sessionStorage.getItem('lv-caja')==='1'||localStorage.getItem('lv-caja')==='1'}catch(e){}
  var k=visto?0.45:1; root.style.setProperty('--t',k);
  // si se llega con un ancla (#visitanos) o con poca altura de scroll, no hacemos esperar
  if(reduce||location.hash||window.scrollY>200){ b.classList.add('entrada','fase-abierta','fase-sale','fase-abanico','fase-menu'); activarTarjetas(); return }
  [['entrada',50],['fase-abierta',700*k],['fase-sale',1700*k],['fase-abanico',2500*k],['fase-menu',3000*k]].forEach(function(f){
    setTimeout(function(){ b.classList.add(f[0]); if(f[0]==='fase-abanico') activarTarjetas() }, f[1]);
  });
  try{localStorage.setItem('lv-caja','1')}catch(e){}
})();
