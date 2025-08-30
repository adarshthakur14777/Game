
(function(){
  const c = document.getElementById('game');
  const x = c.getContext('2d', { alpha:false });
  let w=innerWidth, h=innerHeight; let last=performance.now();
  let pos={x:80,y:80}, dir={x:1,y:0};
  let lastSafe={x:80,y:80,dir:{x:1,y:0}}; const rects=[{minx:0,miny:0,maxx:200,maxy:200}];

  function resize(){ w=innerWidth; h=innerHeight; }
  addEventListener('resize', resize);

  addEventListener('paperio:dir', e=>{ const d=e.detail; if (d.x!==-dir.x||d.y!==-dir.y){ dir={x:d.x,y:d.y}; }});

  // Provide respawn handler to reviver
  window.PaperRevive && window.PaperRevive.onRespawn(()=>{
    pos={x:window.PaperRevive.getLastSafe().x,y:window.PaperRevive.getLastSafe().y};
    dir={...window.PaperRevive.getLastSafe().dir};
    last=performance.now();
    requestAnimationFrame(loop);
  });

  function insideTerritory(p){ return rects.some(t=>p.x>=t.minx && p.x<=t.maxx && p.y>=t.miny && p.y<=t.maxy); }

  function loop(ts){
    const dt=Math.min(0.032,(ts-last)/1000||0.016); last=ts;
    pos.x+=dir.x*220*dt; pos.y+=dir.y*220*dt;

    if (insideTerritory(pos)) lastSafe={x:pos.x,y:pos.y,dir:{...dir}};

    // death conditions: borders
    if (pos.x<0||pos.y<0||pos.x>w||pos.y>h){ window.PaperRevive.onDeath(lastSafe); return; }

    x.fillStyle='#0f1320'; x.fillRect(0,0,w,h);
    x.fillStyle='#00ff8866'; for(const t of rects) x.fillRect(t.minx,t.miny,t.maxx-t.minx,t.maxy-t.miny);
    x.fillStyle='#00aaff'; x.fillRect(pos.x-5,pos.y-5,10,10);

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
