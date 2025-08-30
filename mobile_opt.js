
(function(){
  const canvas = document.getElementById('game') || document.querySelector('canvas');
  if (!canvas) return console.warn('[mobile_opt] canvas not found');
  const ctx = canvas.getContext('2d', { alpha:false, desynchronized:true });
  if (!ctx) return;
  ctx.imageSmoothingEnabled = false;

  const state = { dpr: 1 };
  function resize(){
    state.dpr = Math.max(1, Math.min(2, window.devicePixelRatio||1));
    const w = window.innerWidth, h = window.innerHeight;
    canvas.width = Math.floor(w * state.dpr);
    canvas.height = Math.floor(h * state.dpr);
    canvas.style.width = w+'px'; canvas.style.height = h+'px';
    ctx.setTransform(state.dpr,0,0,state.dpr,0,0);
  }
  window.addEventListener('resize', resize, { passive:true });
  resize();

  // Swipe input
  let touchStart=null;
  window.addEventListener('touchstart', e=>{ touchStart=e.changedTouches[0]; }, { passive:true });
  window.addEventListener('touchend', e=>{
    if(!touchStart) return; const t=e.changedTouches[0];
    const dx=t.clientX-touchStart.clientX; const dy=t.clientY-touchStart.clientY;
    if (Math.abs(dx)>Math.abs(dy)) window.dispatchEvent(new CustomEvent('paperio:dir',{detail:{x:Math.sign(dx),y:0}}));
    else window.dispatchEvent(new CustomEvent('paperio:dir',{detail:{x:0,y:Math.sign(dy)}}));
    touchStart=null;
  }, { passive:true });

  // Example: engine listens this event to change direction
  // window.addEventListener('paperio:dir', e => setDirection(e.detail.x, e.detail.y));
})();
