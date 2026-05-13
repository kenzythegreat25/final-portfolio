/* shared site behaviors */
(function(){
  /* cursor */
  var cur=document.getElementById('cur'), curR=document.getElementById('curR');
  if(cur && curR){
    var mx=window.innerWidth/2, my=window.innerHeight/2, rx=mx, ry=my;
    document.addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY});
    (function tick(){
      rx+=(mx-rx)*.18; ry+=(my-ry)*.18;
      cur.style.transform='translate('+mx+'px,'+my+'px) translate(-50%,-50%)';
      curR.style.transform='translate('+rx+'px,'+ry+'px) translate(-50%,-50%)';
      requestAnimationFrame(tick);
    })();
  }
  /* reveal */
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}});
  },{threshold:.12});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});
  /* clock in nav (subtle Manila time) */
  var clock=document.getElementById('clock');
  if(clock){
    function pad(n){return String(n).padStart(2,'0')}
    function tick(){
      var d=new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Manila'}));
      clock.textContent=pad(d.getHours())+':'+pad(d.getMinutes())+' MNL';
      setTimeout(tick,30000);
    }
    tick();
  }
  /* about photo: 3D parallax tilt on scroll + mouse */
  var apTilt=document.querySelector('.about-photo .ap-tilt');
  var apWrap=document.querySelector('.about-photo');
  if(apTilt && apWrap){
    var sx=0,sy=0,tx=0,ty=0;
    function onScroll(){
      var r=apWrap.getBoundingClientRect();
      var vh=window.innerHeight;
      var p=(r.top+r.height/2-vh/2)/vh;
      sy=Math.max(-1,Math.min(1,p));
    }
    apWrap.addEventListener('mousemove',function(e){
      var r=apWrap.getBoundingClientRect();
      sx=((e.clientX-r.left)/r.width-.5)*2;
    });
    apWrap.addEventListener('mouseleave',function(){sx=0});
    window.addEventListener('scroll',onScroll,{passive:true});onScroll();
    (function loop(){
      tx+=(sx-tx)*.08; ty+=(sy-ty)*.08;
      apTilt.style.transform='rotateY('+(tx*9)+'deg) rotateX('+(-ty*7)+'deg) translateY('+(ty*-12)+'px)';
      requestAnimationFrame(loop);
    })();
  }

  /* notification stack — top card cycles every 5s */
  var stack=document.querySelector('.ostack');
  if(stack){
    var msgs=[
      {b:'New sales call booked',m:'',t:'Just now'},
      {b:'Reply received',m:' — positive intent',t:'2m'},
      {b:'Demo scheduled',m:' — Thursday',t:'5m'},
      {b:'Meeting confirmed',m:'',t:'12m'}
    ];
    var idx=0;
    function rotate(){
      var top=stack.querySelector('.ocard-n.l1');
      if(!top) return;
      // slide off
      top.classList.add('is-out');
      setTimeout(function(){
        // re-stamp top with next message
        idx=(idx+1)%msgs.length;
        var n=msgs[idx];
        top.querySelector('.msg').innerHTML='<b>'+n.b+'</b>'+n.m;
        top.querySelector('.t').textContent=n.t;
        top.classList.remove('is-out');
        top.classList.add('is-in');
        requestAnimationFrame(function(){requestAnimationFrame(function(){top.classList.add('is-settled')})});
        setTimeout(function(){top.classList.remove('is-in','is-settled')},700);
      },620);
    }
    setInterval(rotate,5000);
  }
})();
